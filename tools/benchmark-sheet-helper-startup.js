const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { performance } = require('perf_hooks');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'public', 'scripts', '10_sheet_helper.js');
const RECOGNITION_START = '/* SCENE_SUITE_SHEET_RECOGNITION_START */';
const RECOGNITION_END = '/* SCENE_SUITE_SHEET_RECOGNITION_END */';

function parseArgs(argv) {
  const options = { samples: 15, warmups: 3 };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--samples' || value === '--warmups') {
      const number = Number(argv[index + 1]);
      assert(Number.isInteger(number) && number > 0, `${value} must be a positive integer.`);
      options[value.substring(2)] = number;
      index += 1;
      continue;
    }
    if (value === '--help' || value === '-h') {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

function percentile(values, fraction) {
  const sorted = values.slice().sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil(sorted.length * fraction) - 1)];
}

function summarize(values) {
  return {
    median: percentile(values, 0.5),
    p95: percentile(values, 0.95),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function measure(setup, operation, options) {
  for (let index = 0; index < options.warmups; index += 1) {
    const input = setup();
    operation(input);
  }
  const values = [];
  let result;
  for (let index = 0; index < options.samples; index += 1) {
    const input = setup();
    const started = performance.now();
    result = operation(input);
    values.push(performance.now() - started);
  }
  return { ...summarize(values), result };
}

function recognitionParts(source) {
  const startAt = source.indexOf(RECOGNITION_START);
  const endAt = source.indexOf(RECOGNITION_END);
  assert(startAt >= 0 && endAt > startAt, 'Sheet recognition block markers are missing.');
  return {
    block: source.slice(startAt, endAt + RECOGNITION_END.length),
    runtime: source.slice(0, startAt) + source.slice(endAt + RECOGNITION_END.length),
  };
}

function instrumentRecognitionBlock(block) {
  const payloadMatch = block.match(/var compressed = '([A-Za-z0-9+/=]+)';/);
  const decoderPattern = /var decoded = ([A-Za-z_$][\w$]*)\(compressed\);/;
  const decoderMatch = block.match(decoderPattern);
  assert(payloadMatch && decoderMatch, 'Compressed recognition bundle statement was not found.');
  let result = block.replace(decoderPattern, [
    'var __decodeStarted = performance.now();',
    `  var decoded = ${decoderMatch[1]}(compressed);`,
    '  __bench.decodeMs = performance.now() - __decodeStarted;',
    '  __bench.decodedChars = decoded.length;',
    '  var __parseStarted = performance.now();',
  ].join('\n  '));
  const parseNeedle = 'var bundle = JSON.parse(decoded);';
  assert(result.includes(parseNeedle), 'Recognition JSON parse statement was not found.');
  result = result.replace(parseNeedle,
    parseNeedle + '\n  __bench.parseMs = performance.now() - __parseStarted;');
  const expandNeedle = 'var packed = expand(bundle.p || bundle);';
  assert(result.includes(expandNeedle), 'Recognition string expansion statement was not found.');
  result = result.replace(expandNeedle, [
    'var __expandStarted = performance.now();',
    '  var packed = expand(bundle.p || bundle);',
    '  __bench.expandMs = performance.now() - __expandStarted;',
    '  var __restoreStarted = performance.now();',
  ].join('\n  '));
  const closeAt = result.lastIndexOf('}());');
  assert(closeAt > 0, 'Recognition loader closing statement was not found.');
  result = result.slice(0, closeAt) +
    '  __bench.restoreAndRegisterMs = performance.now() - __restoreStarted;\n' +
    result.slice(closeAt);
  return {
    source: result,
    compression: decoderMatch[1],
    payloadChars: payloadMatch[1].length,
  };
}

function measureLoader(block, options) {
  const instrumented = instrumentRecognitionBlock(block);
  const script = new vm.Script(instrumented.source, {
    filename: '10_sheet_helper-recognition-benchmark.js',
  });
  const samples = {
    decode: [],
    parse: [],
    expand: [],
    restoreAndRegister: [],
    fullBlock: [],
  };
  let last;
  const run = () => {
    const context = vm.createContext({ KIBSheetContracts: [], performance, __bench: {} });
    const started = performance.now();
    script.runInContext(context);
    const fullBlock = performance.now() - started;
    return { context, fullBlock };
  };
  for (let index = 0; index < options.warmups; index += 1) run();
  for (let index = 0; index < options.samples; index += 1) {
    last = run();
    samples.decode.push(last.context.__bench.decodeMs);
    samples.parse.push(last.context.__bench.parseMs);
    samples.expand.push(last.context.__bench.expandMs);
    samples.restoreAndRegister.push(last.context.__bench.restoreAndRegisterMs);
    samples.fullBlock.push(last.fullBlock);
  }
  return {
    compression: instrumented.compression,
    payloadChars: instrumented.payloadChars,
    decodedChars: last.context.__bench.decodedChars,
    contracts: JSON.parse(JSON.stringify(last.context.KIBSheetContracts)),
    phases: Object.fromEntries(
      Object.entries(samples).map(([name, values]) => [name, summarize(values)]),
    ),
  };
}

function roll20Object(id, values) {
  const data = { ...(values || {}) };
  return {
    id,
    get(name) {
      if (name === '_id' || name === 'id') return id;
      return data[name];
    },
    set(name, value) {
      if (name && typeof name === 'object') Object.assign(data, name);
      else data[name] = value;
    },
    setWithWorker(next) {
      Object.assign(data, next || {});
    },
    remove() {},
  };
}

function createRuntime(runtimeSource, contracts, model) {
  const events = {};
  const created = [];
  let timerId = 0;
  const runtimeModel = model || { characters: [], attributes: [], defaults: {} };
  const scene = {
    adapters: {
      cutin: { refreshSheetControls() {} },
    },
    register(name, adapter) {
      this.adapters[name] = adapter;
    },
    refreshHandout() {},
    broadcast() {},
  };
  const context = {
    KIBSheetContracts: (contracts || []).slice(),
    KIBScene: scene,
    state: {},
    on(name, callback) {
      if (!events[name]) events[name] = [];
      events[name].push(callback);
    },
    findObjs(query) {
      const type = query && (query._type || query.type);
      if (type === 'character') return runtimeModel.characters.slice();
      if (type === 'attribute') {
        const characterId = query._characterid || query.characterid;
        return runtimeModel.attributes.filter((attribute) =>
          !characterId || attribute.get('_characterid') === characterId);
      }
      if (type === 'handout') return created.filter((object) =>
        !query.name || object.get('name') === query.name);
      return [];
    },
    getObj(type, id) {
      if (type === 'character')
        return runtimeModel.characters.find((character) => character.id === id) || null;
      return null;
    },
    createObj(type, values) {
      const object = roll20Object(`created-${type}-${created.length}`, { _type: type, ...(values || {}) });
      created.push(object);
      return object;
    },
    getAttrByName(characterId, name, valueType) {
      const attribute = runtimeModel.attributes.find((candidate) =>
        candidate.get('_characterid') === characterId && candidate.get('name') === name);
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      return Object.prototype.hasOwnProperty.call(runtimeModel.defaults || {}, name)
        ? runtimeModel.defaults[name]
        : undefined;
    },
    Campaign() {
      return { get: () => '', set() {} };
    },
    playerIsGM() {
      return true;
    },
    sendChat(who, content, callback) {
      if (callback) callback([{ content }]);
    },
    randomInteger(maximum) {
      return maximum > 0 ? 1 : 0;
    },
    setTimeout() {
      timerId += 1;
      return timerId;
    },
    clearTimeout() {},
    setInterval() {
      timerId += 1;
      return timerId;
    },
    clearInterval() {},
    log() {},
    Date,
  };
  vm.createContext(context);
  new vm.Script(runtimeSource, { filename: '10_sheet_helper-runtime-benchmark.js' })
    .runInContext(context);
  return { context, events, model: runtimeModel, helper: context.KIBSheetHelper };
}

function measureRegistration(runtimeSource, contracts, options) {
  return measure(
    () => createRuntime(runtimeSource, [], { characters: [], attributes: [], defaults: {} }),
    (runtime) => {
      contracts.forEach((contract) => runtime.helper.registerContract(contract));
      const count = runtime.helper.sheetContracts().length;
      assert.strictEqual(count, contracts.length, 'Runtime contract registration lost a contract.');
      return count;
    },
    options,
  );
}

function measureReady(runtimeSource, contracts, options) {
  return measure(
    () => createRuntime(runtimeSource, contracts, { characters: [], attributes: [], defaults: {} }),
    (runtime) => {
      const handlers = runtime.events.ready || [];
      assert(handlers.length, 'Sheet helper ready handler was not registered.');
      handlers.forEach((handler) => handler());
      return handlers.length;
    },
    options,
  );
}

function signatureEntries(contract) {
  const source = contract && contract.signature;
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== 'object') return [];
  return source.attrs || source.attributes || source.required || [];
}

function storedNames(contract) {
  const names = new Set();
  signatureEntries(contract).forEach((entry) => {
    const name = typeof entry === 'string' ? entry : entry && (entry.name || entry.attr || entry.key);
    if (name) names.add(String(name));
  });
  (contract.globalAttributes || []).forEach((name) => names.add(String(name)));
  (contract.fields || []).forEach((field) => {
    if (field && field.name && !field.section) names.add(String(field.name));
  });
  Object.keys(contract.sections || {}).forEach((section) => {
    (contract.sections[section] || []).forEach((field) => {
      names.add(`repeating_${section}_benchmark_${field}`);
    });
    names.add(`_reporder_repeating_${section}`);
  });
  return Array.from(names).filter(Boolean);
}

function defaultValues(contract) {
  const result = {};
  (contract.fields || []).forEach((field) => {
    if (!field || field.section || !field.name ||
        !Object.prototype.hasOwnProperty.call(field, 'default')) return;
    result[field.name] = String(field.default == null ? '' : field.default);
  });
  return result;
}

function recognitionFixture(runtime, contracts) {
  const characterId = 'benchmark-character';
  runtime.model.characters = [roll20Object(characterId, {
    name: 'Benchmark Character',
    controlledby: 'benchmark-player',
  })];
  const ownership = new Map();
  const candidates = contracts.map((contract) => {
    const names = storedNames(contract);
    names.forEach((name) => ownership.set(name, (ownership.get(name) || 0) + 1));
    return { contract, names };
  });
  candidates.forEach((candidate) => {
    candidate.unique = candidate.names.filter((name) => ownership.get(name) === 1).length;
  });
  candidates.sort((left, right) =>
    right.unique - left.unique || right.names.length - left.names.length);
  let stored = null;
  for (const candidate of candidates) {
    runtime.model.attributes = candidate.names.map((name, index) => roll20Object(
      `benchmark-attribute-${index}`,
      { _characterid: characterId, characterid: characterId, name, current: '1', max: '' },
    ));
    runtime.model.defaults = {};
    runtime.helper.registerContract(contracts[0]);
    const inspection = runtime.helper.inspectContracts(characterId);
    if (inspection.status === 'matched' && inspection.contract.id === candidate.contract.id) {
      stored = { ...candidate, inspection };
      break;
    }
  }
  assert(stored, 'No embedded contract produced an unambiguous stored-attribute fixture.');

  let zero = null;
  const zeroCandidates = [stored].concat(candidates.filter((candidate) => candidate !== stored));
  runtime.model.attributes = [];
  for (const candidate of zeroCandidates) {
    runtime.model.defaults = defaultValues(candidate.contract);
    runtime.helper.registerContract(contracts[0]);
    const inspection = runtime.helper.inspectContracts(characterId);
    if (inspection.status === 'matched' && inspection.contract.id === candidate.contract.id) {
      zero = { ...candidate, defaults: { ...runtime.model.defaults }, inspection };
      break;
    }
  }
  return { characterId, stored, zero };
}

function measureRecognition(runtimeSource, contracts, options) {
  const model = { characters: [], attributes: [], defaults: {} };
  const runtime = createRuntime(runtimeSource, contracts, model);
  const fixture = recognitionFixture(runtime, contracts);
  function useStored() {
    model.defaults = {};
    model.attributes = fixture.stored.names.map((name, index) => roll20Object(
      `benchmark-stored-${index}`,
      { _characterid: fixture.characterId, characterid: fixture.characterId,
        name, current: '1', max: '' },
    ));
  }
  function useZero() {
    model.attributes = [];
    model.defaults = { ...(fixture.zero && fixture.zero.defaults || {}) };
  }
  function invalidate() {
    runtime.helper.registerContract(contracts[0]);
  }
  function inspect() {
    return runtime.helper.inspectContracts(fixture.characterId);
  }
  function timed(kind, cached) {
    return measure(
      () => {
        if (kind === 'stored') useStored();
        else useZero();
        invalidate();
        if (cached) inspect();
      },
      () => {
        const result = inspect();
        assert.strictEqual(result.status, 'matched', `${kind} recognition stopped matching.`);
        return result;
      },
      options,
    );
  }
  return {
    fixture: {
      storedContract: fixture.stored.contract.id,
      storedAttributes: fixture.stored.names.length,
      zeroContract: fixture.zero && fixture.zero.contract.id || null,
      zeroDefaults: fixture.zero ? Object.keys(fixture.zero.defaults).length : 0,
    },
    storedCold: timed('stored', false),
    storedCached: timed('stored', true),
    zeroCold: fixture.zero ? timed('zero', false) : null,
    zeroCached: fixture.zero ? timed('zero', true) : null,
  };
}

function contractCounts(contracts) {
  return contracts.reduce((counts, contract) => {
    counts.attributes += (contract.attributes || []).length;
    counts.fields += (contract.fields || []).length;
    counts.rolls += (contract.rolls || []).length;
    counts.modes += (contract.rolls || []).reduce(
      (total, roll) => total + (roll.modes || []).length,
      0,
    );
    counts.sections += Object.keys(contract.sections || {}).length;
    return counts;
  }, { contracts: contracts.length, attributes: 0, fields: 0, rolls: 0, modes: 0, sections: 0 });
}

function formatBytes(value) {
  return `${value.toLocaleString('en-US')} B`;
}

function printPhase(label, timing) {
  if (!timing) return;
  console.log(
    `${label.padEnd(38)} ${timing.median.toFixed(3).padStart(9)}  ${timing.p95.toFixed(3).padStart(9)}  ${timing.min.toFixed(3).padStart(9)}  ${timing.max.toFixed(3).padStart(9)}`,
  );
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log('Usage: node tools/benchmark-sheet-helper-startup.js [--samples N] [--warmups N]');
    return;
  }
  const source = fs.readFileSync(SOURCE_PATH, 'utf8');
  const parts = recognitionParts(source);
  const loader = measureLoader(parts.block, options);
  const contracts = loader.contracts;
  assert(contracts.length > 0, 'Recognition loader did not restore contracts.');
  const registration = measureRegistration(parts.runtime, contracts, options);
  const ready = measureReady(parts.runtime, contracts, options);
  const recognition = measureRecognition(parts.runtime, contracts, options);
  const counts = contractCounts(contracts);

  console.log(`Sheet helper startup benchmark: ${options.samples} samples, ${options.warmups} warmups`);
  console.log('Node/V8 directional benchmark. VM compilation/context creation and fixture setup are excluded.');
  console.log(`Source ${formatBytes(Buffer.byteLength(source, 'utf8'))}, recognition block ${formatBytes(Buffer.byteLength(parts.block, 'utf8'))}`);
  console.log(`Compression ${loader.compression}, payload ${formatBytes(loader.payloadChars)}, decoded JSON ${formatBytes(loader.decodedChars)}`);
  console.log(`Contracts ${counts.contracts}, attributes ${counts.attributes}, fields ${counts.fields}, rolls ${counts.rolls}, modes ${counts.modes}, repeating sections ${counts.sections}`);
  console.log(`Stored recognition fixture ${recognition.fixture.storedContract}: ${recognition.fixture.storedAttributes} saved names`);
  console.log(recognition.fixture.zeroContract
    ? `Zero-state fixture ${recognition.fixture.zeroContract}: ${recognition.fixture.zeroDefaults} source defaults`
    : 'Zero-state fixture: no contract could be identified from source defaults alone');
  console.log('\nPhase                                      median ms     p95 ms      min ms      max ms');
  printPhase(`compression decode (${loader.compression})`, loader.phases.decode);
  printPhase('JSON.parse', loader.phases.parse);
  printPhase('interned string expansion', loader.phases.expand);
  printPhase('contract restore + embedded push', loader.phases.restoreAndRegister);
  printPhase('actual recognition block total', loader.phases.fullBlock);
  printPhase(`registerContract x ${contracts.length}`, registration);
  printPhase('ready callback', ready);
  printPhase('recognition stored / cold', recognition.storedCold);
  printPhase('recognition stored / cached', recognition.storedCached);
  printPhase('recognition zero-state / cold', recognition.zeroCold);
  printPhase('recognition zero-state / cached', recognition.zeroCached);
}

try {
  main();
} catch (error) {
  console.error(`Sheet helper startup benchmark: FAIL\n${error.stack || error.message || error}`);
  process.exitCode = 1;
}
