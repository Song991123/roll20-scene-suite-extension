const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');
const { execFileSync } = require('child_process');
const { performance } = require('perf_hooks');

const ROOT = path.resolve(__dirname, '..');
const SCRIPTS_ROOT = path.join(ROOT, 'public', 'scripts');
const RECOGNITION_START = '/* SCENE_SUITE_SHEET_RECOGNITION_START */';
const RECOGNITION_END = '/* SCENE_SUITE_SHEET_RECOGNITION_END */';
const DEFAULT_REF = '13a57d4';
const FIXTURE_SIZES = [10, 100, 1000];
const PUBLIC_TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.md', '.svg', '.txt']);

function usage() {
  return [
    'Usage: node tools/benchmark.js [--ref <git-ref>] [--legacy-only|--recognition-only|--rows-only]',
    '',
    `Compares public/scripts at a Git ref (default: ${DEFAULT_REF}) with the worktree.`,
  ].join('\n');
}

function parseArgs(argv) {
  let ref = DEFAULT_REF;
  let recognitionOnly = false;
  let rowsOnly = false;
  let legacyOnly = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') return { help: true, ref, recognitionOnly, rowsOnly, legacyOnly };
    if (arg === '--legacy-only') {
      legacyOnly = true;
      continue;
    }
    if (arg === '--recognition-only') {
      recognitionOnly = true;
      continue;
    }
    if (arg === '--rows-only') {
      rowsOnly = true;
      continue;
    }
    if (arg === '--ref') {
      assert(argv[index + 1], '--ref requires a Git ref.');
      ref = argv[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  assert([legacyOnly, recognitionOnly, rowsOnly].filter(Boolean).length <= 1, 'Choose one focused benchmark.');
  return { help: false, ref, recognitionOnly, rowsOnly, legacyOnly };
}

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function resolveRef(ref) {
  try {
    return git(['rev-parse', '--verify', `${ref}^{commit}`]).trim();
  } catch (error) {
    throw new Error(`Git ref not found: ${ref}`);
  }
}

function scriptNames() {
  const names = fs
    .readdirSync(SCRIPTS_ROOT)
    .filter((name) => /^\d{2}_.+\.js$/.test(name))
    .sort();
  assert.strictEqual(names.length, 11, 'Expected public scripts 00 through 10.');
  names.forEach((name, index) => {
    assert(
      name.startsWith(`${String(index).padStart(2, '0')}_`),
      `Missing public script ${String(index).padStart(2, '0')}.`,
    );
  });
  return names;
}

function readSources(names, commit) {
  const sources = {};
  names.forEach((name) => {
    if (commit) {
      sources[name] = git(['show', `${commit}:public/scripts/${name}`]);
    } else {
      sources[name] = fs.readFileSync(path.join(SCRIPTS_ROOT, name), 'utf8');
    }
  });
  return sources;
}

function normalizeLf(source) {
  return source.replace(/\r\n?/g, '\n');
}

function bytes(source) {
  if (source == null) return { raw: 0, gzip: 0 };
  const normalized = normalizeLf(source);
  return {
    raw: Buffer.byteLength(normalized, 'utf8'),
    gzip: zlib.gzipSync(Buffer.from(normalized, 'utf8'), { level: 9 }).length,
  };
}

function percentDelta(before, after) {
  if (before === 0) return after === 0 ? '0.0%' : 'n/a';
  const value = ((after - before) / before) * 100;
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function printSizes(names, baseline, candidate) {
  console.log('\nRoll20 script bytes (LF-normalized raw / gzip-9)');
  let baselineTotal = { raw: 0, gzip: 0 };
  let candidateTotal = { raw: 0, gzip: 0 };
  names.forEach((name) => {
    const before = bytes(baseline[name]);
    const after = bytes(candidate[name]);
    baselineTotal.raw += before.raw;
    baselineTotal.gzip += before.gzip;
    candidateTotal.raw += after.raw;
    candidateTotal.gzip += after.gzip;
    console.log(
      `${name.padEnd(36)} ${String(before.raw).padStart(8)} / ${String(before.gzip).padStart(7)} -> ${String(after.raw).padStart(8)} / ${String(after.gzip).padStart(7)}  (${percentDelta(before.raw, after.raw)} raw)`,
    );
  });
  console.log(
    `${'TOTAL'.padEnd(36)} ${String(baselineTotal.raw).padStart(8)} / ${String(baselineTotal.gzip).padStart(7)} -> ${String(candidateTotal.raw).padStart(8)} / ${String(candidateTotal.gzip).padStart(7)}  (${percentDelta(baselineTotal.raw, candidateTotal.raw)} raw)`,
  );
  return { baseline: baselineTotal, candidate: candidateTotal };
}

function gitPublicTextNames(commit) {
  const output = git(['ls-tree', '-r', '--name-only', commit, '--', 'public']);
  return output
    .trim()
    .split(/\r?\n/)
    .filter((name) => name && PUBLIC_TEXT_EXTENSIONS.has(path.extname(name).toLowerCase()));
}

function worktreePublicTextNames() {
  const names = [];
  function visit(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return visit(fullPath);
      const relative = path.relative(ROOT, fullPath).split(path.sep).join('/');
      if (PUBLIC_TEXT_EXTENSIONS.has(path.extname(relative).toLowerCase())) names.push(relative);
    });
  }
  visit(path.join(ROOT, 'public'));
  return names.sort();
}

function readPublicTexts(names, commit, availableNames) {
  const available = new Set(availableNames);
  const result = {};
  names.forEach((name) => {
    if (!available.has(name)) {
      result[name] = null;
      return;
    }
    result[name] = commit
      ? git(['show', `${commit}:${name}`])
      : fs.readFileSync(path.join(ROOT, ...name.split('/')), 'utf8');
  });
  return result;
}

function printPublicTextSizes(names, baseline, candidate) {
  console.log('\nOther deployed public text bytes (LF-normalized raw / gzip-9)');
  let baselineTotal = { raw: 0, gzip: 0 };
  let candidateTotal = { raw: 0, gzip: 0 };
  names.forEach((name) => {
    const before = bytes(baseline[name]);
    const after = bytes(candidate[name]);
    baselineTotal.raw += before.raw;
    baselineTotal.gzip += before.gzip;
    candidateTotal.raw += after.raw;
    candidateTotal.gzip += after.gzip;
    const status = baseline[name] == null ? 'new' : candidate[name] == null ? 'deleted' : '';
    console.log(
      `${name.padEnd(48)} ${String(before.raw).padStart(8)} / ${String(before.gzip).padStart(7)} -> ${String(after.raw).padStart(8)} / ${String(after.gzip).padStart(7)}  (${percentDelta(before.raw, after.raw)} raw${status ? `, ${status}` : ''})`,
    );
  });
  console.log(
    `${'OTHER PUBLIC TEXT TOTAL'.padEnd(48)} ${String(baselineTotal.raw).padStart(8)} / ${String(baselineTotal.gzip).padStart(7)} -> ${String(candidateTotal.raw).padStart(8)} / ${String(candidateTotal.gzip).padStart(7)}  (${percentDelta(baselineTotal.raw, candidateTotal.raw)} raw)`,
  );
  return { baseline: baselineTotal, candidate: candidateTotal };
}

function printPublicTotal(scripts, other) {
  const before = {
    raw: scripts.baseline.raw + other.baseline.raw,
    gzip: scripts.baseline.gzip + other.baseline.gzip,
  };
  const after = {
    raw: scripts.candidate.raw + other.candidate.raw,
    gzip: scripts.candidate.gzip + other.candidate.gzip,
  };
  console.log(
    `${'DEPLOYED PUBLIC TEXT TOTAL'.padEnd(48)} ${String(before.raw).padStart(8)} / ${String(before.gzip).padStart(7)} -> ${String(after.raw).padStart(8)} / ${String(after.gzip).padStart(7)}  (${percentDelta(before.raw, after.raw)} raw)`,
  );
}

function recognitionSource(source) {
  const legacyStart = '/* KIB_SHEET_RECOGNITION_START */';
  const legacyEnd = '/* KIB_SHEET_RECOGNITION_END */';
  const startMarker = source.includes(RECOGNITION_START) ? RECOGNITION_START : legacyStart;
  const endMarker = startMarker === RECOGNITION_START ? RECOGNITION_END : legacyEnd;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  assert(start >= 0 && end > start, 'Sheet recognition block markers are missing.');
  return source.slice(start + startMarker.length, end);
}

function percentile(samples, fraction) {
  const sorted = samples.slice().sort((a, b) => a - b);
  const index = Math.max(0, Math.ceil(sorted.length * fraction) - 1);
  return sorted[index];
}

function loadRecognition(script) {
  const context = vm.createContext({ KIBSheetContracts: [] });
  const started = performance.now();
  script.runInContext(context);
  return {
    elapsed: performance.now() - started,
    contracts: context.KIBSheetContracts,
  };
}

function measureRecognition(source, label) {
  const script = new vm.Script(recognitionSource(source), {
    filename: `${label}/10_sheet_helper-recognition.js`,
  });
  for (let index = 0; index < 3; index += 1) loadRecognition(script);
  const samples = [];
  let contracts = null;
  for (let index = 0; index < 21; index += 1) {
    const result = loadRecognition(script);
    samples.push(result.elapsed);
    contracts = result.contracts;
  }
  return {
    median: percentile(samples, 0.5),
    p95: percentile(samples, 0.95),
    contracts,
    identities: modeIdentities(contracts),
  };
}

function modeIdentities(contracts) {
  const arrays = [];
  const modes = [];
  let rolls = 0;
  contracts.forEach((sheet) => {
    (sheet.rolls || []).forEach((roll) => {
      rolls += 1;
      if (!Array.isArray(roll.modes)) return;
      arrays.push(roll.modes);
      roll.modes.forEach((mode) => {
        if (mode && typeof mode === 'object') modes.push(mode);
      });
    });
  });
  const uniqueArrays = new Set(arrays).size;
  const uniqueModes = new Set(modes).size;
  const arrayReferences = referenceCounts(arrays);
  const modeReferences = referenceCounts(modes);
  return {
    sheets: contracts.length,
    rolls,
    arrays: arrays.length,
    uniqueArrays,
    sharedArrays: arrays.length - uniqueArrays,
    frozenArrays: arrays.filter(Object.isFrozen).length,
    unsafeSharedArrays: unsafeSharedCount(arrayReferences),
    modes: modes.length,
    uniqueModes,
    sharedModes: modes.length - uniqueModes,
    frozenModes: modes.filter(Object.isFrozen).length,
    unsafeSharedModes: unsafeSharedCount(modeReferences),
  };
}

function recognitionExecutionShape(contracts) {
  return contracts.map((sheet) => {
    const controlNames = new Set();
    (sheet.rolls || []).forEach((roll) => {
      (roll.modes || []).forEach((mode) => {
        Object.keys((mode && mode.overrides) || {}).forEach((name) => controlNames.add(name));
      });
    });
    const controls = {};
    Array.from(controlNames).sort().forEach((name) => {
      if (sheet.controls && Object.prototype.hasOwnProperty.call(sheet.controls, name))
        controls[name] = sheet.controls[name];
    });
    return {
      id: sheet.id,
      sourceHash: sheet.sourceHash,
      controls,
      resultTemplates: sheet.resultTemplates || {},
      rolls: (sheet.rolls || []).map((roll) => ({
        key: roll.key,
        raw: roll.raw,
        template: roll.template,
        repeating: roll.repeating,
        controls: roll.controls,
        modes: roll.modes,
        visibility: roll.visibility,
        staticLabels: roll.staticLabels,
        labelRefs: roll.labelRefs,
        expressionRefs: roll.expressionRefs,
      })),
    };
  });
}

function referenceCounts(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return counts;
}

function unsafeSharedCount(counts) {
  let total = 0;
  counts.forEach((count, value) => {
    if (count > 1 && !Object.isFrozen(value)) total += count - 1;
  });
  return total;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  const result = {};
  Object.keys(value)
    .sort()
    .forEach((key) => {
      result[key] = stable(value[key]);
    });
  return result;
}

function jsonClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hash(value) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(stable(value)))
    .digest('hex');
}

function printRecognition(baselineSource, candidateSource) {
  console.log('\nSheet recognition loader (21 samples, compile/context creation excluded)');
  const baseline = measureRecognition(baselineSource, 'baseline');
  const candidate = measureRecognition(candidateSource, 'worktree');
  const before = stable(jsonClone(recognitionExecutionShape(baseline.contracts)));
  const after = stable(jsonClone(recognitionExecutionShape(candidate.contracts)));
  const sameExecution = hash(after) === hash(before);
  [baseline, candidate].forEach((result, index) => {
    assert.strictEqual(
      result.identities.unsafeSharedArrays,
      0,
      `${index ? 'Worktree' : 'Baseline'} recognition rolls share mutable mode arrays.`,
    );
    assert.strictEqual(
      result.identities.unsafeSharedModes,
      0,
      `${index ? 'Worktree' : 'Baseline'} recognition rolls share mutable mode objects.`,
    );
  });
  const beforeIdentity = baseline.identities;
  const afterIdentity = candidate.identities;
  assert.strictEqual(afterIdentity.uniqueArrays, afterIdentity.arrays,
    'Worktree recognition must preserve one mutable mode array per roll.');
  assert.strictEqual(afterIdentity.uniqueModes, afterIdentity.modes,
    'Worktree recognition must preserve one mutable mode object per roll.');
  assert.strictEqual(afterIdentity.frozenArrays, 0,
    'Worktree recognition mode arrays must remain mutable for extension compatibility.');
  assert.strictEqual(afterIdentity.frozenModes, 0,
    'Worktree recognition mode objects must remain mutable for extension compatibility.');
  console.log(
    `baseline median ${baseline.median.toFixed(3)} ms, p95 ${baseline.p95.toFixed(3)} ms`,
  );
  console.log(
    `worktree median ${candidate.median.toFixed(3)} ms, p95 ${candidate.p95.toFixed(3)} ms (${percentDelta(baseline.median, candidate.median)} median)`,
  );
  console.log(
    `output ${afterIdentity.sheets} sheets, ${afterIdentity.rolls} rolls, SHA-256 ${hash(after).slice(0, 16)}...`,
  );
  if (!sameExecution)
    console.log('recognition output differs from the pre-fix baseline; correctness is checked by check-sheet-contract/check-sheet-helper');
  console.log(
    `baseline mode identities arrays ${beforeIdentity.uniqueArrays}/${beforeIdentity.arrays} unique, objects ${beforeIdentity.uniqueModes}/${beforeIdentity.modes} unique`,
  );
  console.log(
    `worktree mode identities arrays ${afterIdentity.uniqueArrays}/${afterIdentity.arrays} unique, objects ${afterIdentity.uniqueModes}/${afterIdentity.modes} unique; per-roll mutable isolation preserved`,
  );
}

function emptyCalls() {
  return {
    findObjs: 0,
    findScanned: 0,
    filterObjs: 0,
    filterScanned: 0,
    getObj: 0,
    objectGet: 0,
    set: 0,
    setFields: 0,
    createObj: 0,
    remove: 0,
    sendChat: 0,
    toFront: 0,
    toBack: 0,
  };
}

function createRoll20Model(fixture) {
  const records = [];
  const byKey = new Map();
  let calls = emptyCalls();
  let nextId = 1;
  let timerId = 1;
  let chats = [];
  let removed = [];
  let front = [];
  let back = [];
  const events = {};

  function key(type, id) {
    return `${type}:${id}`;
  }

  function cloneRecord(record) {
    return {
      type: record.type,
      id: record.id,
      values: jsonClone(record.values || {}),
      removed: false,
    };
  }

  function add(record) {
    const item = cloneRecord(record);
    records.push(item);
    byKey.set(key(item.type, item.id), item);
    return item;
  }

  (fixture.records || []).forEach(add);

  function value(record, name) {
    if (name === '_id' || name === 'id') return record.id;
    if (name === '_type' || name === 'type') return record.type;
    if (name === 'pageid' && record.values.pageid === undefined)
      return record.values._pageid;
    if (name === 'characterid' && record.values.characterid === undefined)
      return record.values._characterid;
    return record.values[name];
  }

  function wrap(record) {
    if (!record || record.removed) return null;
    return {
      id: record.id,
      _id: record.id,
      get(name, callback) {
        calls.objectGet += 1;
        const result = value(record, name);
        if (typeof callback === 'function') callback(result);
        return result;
      },
      set(name, nextValue) {
        calls.set += 1;
        const updates = name && typeof name === 'object' ? name : { [name]: nextValue };
        const keys = Object.keys(updates);
        calls.setFields += keys.length;
        keys.forEach((field) => {
          record.values[field] = updates[field];
        });
      },
      remove() {
        if (record.removed) return;
        calls.remove += 1;
        record.removed = true;
        byKey.delete(key(record.type, record.id));
        removed.push(`${record.type}:${record.id}`);
      },
    };
  }

  function matches(record, query) {
    return Object.keys(query || {}).every((name) => value(record, name) === query[name]);
  }

  function liveRecords() {
    return records.filter((record) => !record.removed);
  }

  const api = {
    on(name, handler) {
      events[name] = events[name] || [];
      events[name].push(handler);
    },
    log() {},
    findObjs(query) {
      calls.findObjs += 1;
      const current = liveRecords();
      calls.findScanned += current.length;
      return current.filter((record) => matches(record, query)).map(wrap);
    },
    filterObjs(predicate) {
      calls.filterObjs += 1;
      const current = liveRecords();
      calls.filterScanned += current.length;
      return current.map(wrap).filter(predicate);
    },
    getObj(type, id) {
      calls.getObj += 1;
      return wrap(byKey.get(key(type, id)));
    },
    createObj(type, values) {
      calls.createObj += 1;
      let id = `created-${type}-${nextId}`;
      while (byKey.has(key(type, id))) {
        nextId += 1;
        id = `created-${type}-${nextId}`;
      }
      nextId += 1;
      return wrap(add({ type, id, values: values || {} }));
    },
    getAttrByName(characterId, name, mode) {
      const attribute = liveRecords().find(
        (record) =>
          record.type === 'attribute' &&
          value(record, '_characterid') === characterId &&
          value(record, 'name') === name,
      );
      return attribute ? value(attribute, mode === 'max' ? 'max' : 'current') : '';
    },
    Campaign() {
      return {
        get(name) {
          if (name === 'playerpageid' || name === '_id') return 'page-1';
          if (name === 'playerspecificpages') return false;
          return '';
        },
        set() {},
      };
    },
    playerIsGM() {
      return true;
    },
    sendChat(who, message, callback, options) {
      calls.sendChat += 1;
      chats.push({ who, message, options: options || null });
      if (typeof callback === 'function') callback([]);
    },
    toFront(object) {
      calls.toFront += 1;
      front.push(object && object.id);
    },
    toBack(object) {
      calls.toBack += 1;
      back.push(object && object.id);
    },
    toFrontAbove(object, below) {
      calls.toFront += 1;
      front.push([object && object.id, below && below.id]);
    },
    toBackBehind(object, above) {
      calls.toBack += 1;
      back.push([object && object.id, above && above.id]);
    },
    setTimeout() {
      return timerId++;
    },
    clearTimeout() {},
    setInterval() {
      return timerId++;
    },
    clearInterval() {},
    randomInteger(maximum) {
      return maximum > 0 ? 1 : 0;
    },
  };

  function reset() {
    calls = emptyCalls();
    chats = [];
    removed = [];
    front = [];
    back = [];
  }

  function exportRecords() {
    return liveRecords().map((record) => ({
      type: record.type,
      id: record.id,
      values: jsonClone(record.values),
    }));
  }

  function snapshot(state) {
    const handouts = exportRecords()
      .filter((record) => record.type === 'handout')
      .sort((a, b) => a.id.localeCompare(b.id));
    return stable({
      state: jsonClone(state),
      handouts,
      removed: removed.slice(),
      chats: jsonClone(chats),
      front: jsonClone(front),
      back: jsonClone(back),
    });
  }

  return {
    api,
    reset,
    exportRecords,
    snapshot,
    calls: () => ({ ...calls }),
  };
}

function kibSceneStub() {
  const scene = {
    handlers: {},
    adapters: {},
    register(name, adapter) {
      scene.adapters[name] = adapter;
      if (adapter && typeof adapter.cue === 'function') scene.handlers[name] = adapter.cue;
      return adapter;
    },
    refreshHandout() {},
    get(pathName, fallback) {
      return fallback;
    },
    call() {
      return null;
    },
    broadcast() {
      return { ok: true };
    },
    isFeatureEnabled() {
      return true;
    },
    validate() {
      return { ok: true };
    },
    execute() {
      return { ok: true };
    },
  };
  return scene;
}

function initialRecords(kind, count) {
  const deckName = kind === '03' ? 'standings' : 'avatars';
  const deckId = `${kind}-deck`;
  const records = [{ type: 'deck', id: deckId, values: { name: deckName } }];
  for (let index = 0; index < count; index += 1) {
    const characterId = `character-${String(index).padStart(4, '0')}`;
    const name = `C${index}`;
    records.push({
      type: 'character',
      id: characterId,
      values: { name, controlledby: `player-${index % 4}`, avatar: '' },
    });
    ['','-E1','-E2'].forEach((suffix, cardIndex) => {
      records.push({
        type: 'card',
        id: `card-${String(index).padStart(4, '0')}-${cardIndex}`,
        values: {
          name: name + suffix,
          _deckid: deckId,
          avatar: `https://example.invalid/${kind}/${index}/${cardIndex}/thumb.png`,
        },
      });
    });
  }
  return records;
}

function runtimeContext(model, state) {
  return vm.createContext({
    state,
    KIBScene: kibSceneStub(),
    ...model.api,
  });
}

function runRefresh(script, kind, fixture) {
  const model = createRoll20Model(fixture);
  const state = jsonClone(fixture.state || {});
  const context = runtimeContext(model, state);
  script.runInContext(context);
  const functionName = kind === '03' ? 'vdUpdateExpressionHandouts' : 'avRefreshHandouts';
  assert.strictEqual(typeof context[functionName], 'function', `${functionName} is unavailable.`);
  model.reset();
  const started = performance.now();
  context[functionName]();
  const elapsed = performance.now() - started;
  return {
    elapsed,
    calls: model.calls(),
    output: model.snapshot(context.state),
    fixture: { records: model.exportRecords(), state: jsonClone(context.state) },
  };
}

function fixtureFromBaseline(script, kind, count) {
  return runRefresh(script, kind, {
    records: initialRecords(kind, count),
    state: {},
  }).fixture;
}

function guardRefresh(baseline, candidate, kind, count) {
  assert.deepStrictEqual(
    candidate.output,
    baseline.output,
    `${kind} refresh output/state changed at N=${count}.`,
  );
  ['createObj', 'remove', 'sendChat', 'toFront', 'toBack'].forEach((name) => {
    assert.strictEqual(
      candidate.calls[name],
      baseline.calls[name],
      `${kind} ${name} side-effect count changed at N=${count}.`,
    );
  });
  ['findObjs', 'findScanned', 'filterObjs', 'filterScanned', 'set', 'setFields'].forEach(
    (name) => {
      assert(
        candidate.calls[name] <= baseline.calls[name],
        `${kind} ${name} regressed at N=${count}: ${baseline.calls[name]} -> ${candidate.calls[name]}.`,
      );
    },
  );
}

function callSummary(calls) {
  return [
    `find ${calls.findObjs}`,
    `scan ${calls.findScanned}`,
    `getObj ${calls.getObj}`,
    `obj.get ${calls.objectGet}`,
    `set ${calls.set}/${calls.setFields}f`,
    `create ${calls.createObj}`,
    `remove ${calls.remove}`,
    `front/back ${calls.toFront}/${calls.toBack}`,
    `chat ${calls.sendChat}`,
  ].join(', ');
}

function scale(first, last) {
  if (first === 0) return last === 0 ? '1.0x' : 'n/a';
  return `${(last / first).toFixed(1)}x`;
}

function consumeFrame(checksum, frame) {
  return Math.imul(checksum ^ frame.length, 16777619) >>> 0;
}

function medianPair(baselineOperation, candidateOperation, length) {
  const sampleCount = length >= 10000 ? 3 : length >= 1000 ? 5 : 7;
  baselineOperation();
  candidateOperation();
  const baselineSamples = [];
  const candidateSamples = [];
  for (let index = 0; index < sampleCount; index += 1) {
    const operations = index % 2
      ? [
          [candidateOperation, candidateSamples],
          [baselineOperation, baselineSamples],
        ]
      : [
          [baselineOperation, baselineSamples],
          [candidateOperation, candidateSamples],
        ];
    let baselineValue;
    let candidateValue;
    operations.forEach(([operation, samples]) => {
      const started = performance.now();
      const value = operation();
      samples.push(performance.now() - started);
      if (operation === baselineOperation) baselineValue = value;
      else candidateValue = value;
    });
    assert.strictEqual(
      candidateValue,
      baselineValue,
      `Timed consumer changed at length ${length}.`,
    );
  }
  return {
    baseline: percentile(baselineSamples, 0.5),
    candidate: percentile(candidateSamples, 0.5),
  };
}

function dialogueText(length) {
  const pattern = '가나다 abcdef\n라마바 12345 ';
  return pattern.repeat(Math.ceil(length / pattern.length)).slice(0, length);
}

function wrapDialoguePrefix(text, maxChars) {
  let result = '';
  let lineLength = 0;
  for (let index = 0; index < text.length; index += 1) {
    const character = text.charAt(index);
    if (character === '\n') {
      result += character;
      lineLength = 0;
      continue;
    }
    result += character;
    lineLength += 1;
    if (lineLength >= maxChars) {
      result += '\n';
      lineLength = 0;
    }
  }
  return result;
}

function runDialogueLegacy(text, maxChars) {
  let checksum = 2166136261;
  for (let shown = 1; shown <= text.length; shown += 1) {
    checksum = consumeFrame(
      checksum,
      wrapDialoguePrefix(text.slice(0, shown), maxChars),
    );
  }
  return checksum;
}

function runDialogueCurrent(text, maxChars) {
  let checksum = 2166136261;
  let rendered = '';
  let lineLength = 0;
  for (let shown = 1; shown <= text.length; shown += 1) {
    const character = text.charAt(shown - 1);
    rendered += character;
    if (character === '\n') lineLength = 0;
    else if (++lineLength >= maxChars) {
      rendered += '\n';
      lineLength = 0;
    }
    checksum = consumeFrame(checksum, rendered);
  }
  return checksum;
}

function verifyDialogueFrames(text, maxChars) {
  const digest = crypto.createHash('sha256');
  let rendered = '';
  let lineLength = 0;
  for (let shown = 1; shown <= text.length; shown += 1) {
    const legacy = wrapDialoguePrefix(text.slice(0, shown), maxChars);
    const character = text.charAt(shown - 1);
    rendered += character;
    if (character === '\n') lineLength = 0;
    else if (++lineLength >= maxChars) {
      rendered += '\n';
      lineLength = 0;
    }
    if (legacy !== rendered)
      throw new Error(`05 frame ${shown}/${text.length} changed.`);
    digest.update(String(legacy.length)).update(':').update(legacy).update('\0');
  }
  return digest.digest('hex');
}

function captionCharacters(length) {
  const pattern = ['가', '🙂', 'A', '\n', '나', '7'];
  return Array.from({ length }, (_, index) => pattern[index % pattern.length]);
}

function runCaptionLegacy(characters) {
  let checksum = 2166136261;
  for (let shown = 1; shown <= characters.length; shown += 1) {
    checksum = consumeFrame(checksum, characters.slice(0, shown).join(''));
  }
  return checksum;
}

function runCaptionCurrent(characters) {
  let checksum = 2166136261;
  let rendered = '';
  for (let shown = 1; shown <= characters.length; shown += 1) {
    rendered += characters[shown - 1];
    checksum = consumeFrame(checksum, rendered);
  }
  return checksum;
}

function verifyCaptionFrames(characters) {
  const digest = crypto.createHash('sha256');
  let rendered = '';
  for (let shown = 1; shown <= characters.length; shown += 1) {
    const legacy = characters.slice(0, shown).join('');
    rendered += characters[shown - 1];
    if (legacy !== rendered)
      throw new Error(`08 frame ${shown}/${characters.length} changed.`);
    digest.update(String(legacy.length)).update(':').update(legacy).update('\0');
  }
  return digest.digest('hex');
}

function printGrowth(label, results) {
  const parts = [];
  for (let index = 1; index < results.length; index += 1) {
    const before = results[index - 1];
    const after = results[index];
    parts.push(
      `${before.length}->${after.length} ${scale(before.baseline, after.baseline)} -> ${scale(before.candidate, after.candidate)}`,
    );
  }
  console.log(`  ${label} growth (baseline -> worktree): ${parts.join(', ')}`);
}

function benchmarkFrameBuilders(baseline, candidate, names) {
  const file05 = names.find((name) => name.startsWith('05_'));
  const file08 = names.find((name) => name.startsWith('08_'));
  assert(
    baseline[file05].includes('wrapText(fullText.slice(0, i), SETTING.MAX_CHARS_PER_LINE)'),
    'Baseline 05 prefix-wrap implementation was not found.',
  );
  assert(
    candidate[file05].includes('wrappedText += character;'),
    'Worktree 05 cumulative-wrap implementation was not found.',
  );
  assert(
    baseline[file08].includes("characters.slice(0, shown).join('')"),
    'Baseline 08 slice/join implementation was not found.',
  );
  assert(
    candidate[file08].includes('rendered += characters[shown - 1];'),
    'Worktree 08 cumulative-caption implementation was not found.',
  );

  console.log(
    '\n05 dialogue string building only (Roll20 get/set/toFront/render excluded; all frames deep-equal)',
  );
  const dialogueResults = [100, 1000, 10000].map((length) => {
    const text = dialogueText(length);
    const frameHash = verifyDialogueFrames(text, 32);
    const timing = medianPair(
      () => runDialogueLegacy(text, 32),
      () => runDialogueCurrent(text, 32),
      length,
    );
    console.log(
      `L=${String(length).padStart(5)} ${timing.baseline.toFixed(3)} -> ${timing.candidate.toFixed(3)} ms (${percentDelta(timing.baseline, timing.candidate)}), frames ${frameHash.slice(0, 16)}...`,
    );
    return { length, ...timing };
  });
  printGrowth('05', dialogueResults);

  console.log(
    '\n08 cutin caption string building only (Roll20 set/toFront/render excluded; all Unicode frames deep-equal)',
  );
  const captionResults = [100, 1000, 10000].map((length) => {
    const characters = captionCharacters(length);
    const frameHash = verifyCaptionFrames(characters);
    const timing = medianPair(
      () => runCaptionLegacy(characters),
      () => runCaptionCurrent(characters),
      length,
    );
    console.log(
      `L=${String(length).padStart(5)} ${timing.baseline.toFixed(3)} -> ${timing.candidate.toFixed(3)} ms (${percentDelta(timing.baseline, timing.candidate)}), frames ${frameHash.slice(0, 16)}...`,
    );
    return { length, ...timing };
  });
  printGrowth('08', captionResults);
}

function exposeHandoutBenchmark(source, label) {
  const exposed = source.replace(
    /\r?\n\}\)\(\);\s*$/,
    [
      '',
      'KIBScene.__benchmark = {',
      '  initState: initState,',
      '  managerHtml: managerHtml,',
      '  refreshManager: refreshManager',
      '};',
      '})();',
    ].join('\n'),
  );
  assert.notStrictEqual(exposed, source, `${label} 07 benchmark hook was not inserted.`);
  return exposed;
}

function handoutObject(id, values, counts) {
  return {
    id,
    values: { ...values },
    get(name, callback) {
      const value = this.values[name];
      if (typeof callback === 'function') callback(value);
      return value;
    },
    set(name, value) {
      counts.set += 1;
      if (name && typeof name === 'object') Object.assign(this.values, name);
      else this.values[name] = value;
    },
    remove() {},
  };
}

function createHandoutBenchmarkRuntime(source, handoutCount, label) {
  const counts = { characterFinds: 0, set: 0, timers: 0 };
  const handlers = {};
  const characters = [
    handoutObject('character-1', { name: '가', controlledby: 'player-1' }, counts),
    handoutObject('character-2', { name: '나', controlledby: 'player-2' }, counts),
    handoutObject('character-3', { name: '무권한', controlledby: '' }, counts),
  ];
  const handouts = {};
  const journalIds = [];
  for (let index = 0; index < handoutCount; index += 1) {
    const id = `handout-${String(index).padStart(4, '0')}`;
    journalIds.push(id);
    handouts[id] = handoutObject(
      id,
      {
        name: `자료 ${String(index).padStart(4, '0')}`,
        inplayerjournals: index % 2 ? 'player-2' : 'player-1',
        controlledby: '',
      },
      counts,
    );
  }
  const manager = handoutObject(
    'manager',
    {
      name: '[GM] 핸드아웃 관리',
      inplayerjournals: '',
      controlledby: '',
      archived: false,
      notes: '',
    },
    counts,
  );
  handouts[manager.id] = manager;
  const state = {
    KIBSceneHandout: {
      managerId: manager.id,
      activeFolderId: '__root__',
      macroTemplate: '',
      lastMacroTemplateError: '',
    },
  };
  const scene = { handlers: {}, adapters: {} };
  const context = vm.createContext({
    KIBScene: scene,
    state,
    on(eventName, callback) {
      handlers[eventName] = handlers[eventName] || [];
      handlers[eventName].push(callback);
    },
    playerIsGM() {
      return true;
    },
    sendChat() {},
    log() {},
    Campaign() {
      return {
        get(name) {
          return name === '_journalfolder' || name === 'journalfolder'
            ? JSON.stringify(journalIds)
            : '';
        },
      };
    },
    findObjs(query) {
      if (query && query._type === 'character') {
        counts.characterFinds += 1;
        return characters;
      }
      return [];
    },
    getObj(type, id) {
      if (type === 'handout') return handouts[id] || null;
      if (type === 'character')
        return characters.find((character) => character.id === id) || null;
      return null;
    },
    createObj() {
      return null;
    },
    setTimeout() {
      counts.timers += 1;
      return counts.timers;
    },
    clearTimeout() {},
    setInterval() {
      return 1;
    },
    clearInterval() {},
  });
  new vm.Script(exposeHandoutBenchmark(source, label), {
    filename: `${label}/07_handout_director.js`,
  }).runInContext(context);
  context.KIBScene.__benchmark.initState();
  function reset() {
    counts.characterFinds = 0;
    counts.set = 0;
    counts.timers = 0;
  }
  return { context, counts, handlers, manager, reset };
}

function runHandoutDeterministic(source, handoutCount, label) {
  const runtime = createHandoutBenchmarkRuntime(source, handoutCount, label);
  runtime.reset();
  const html = runtime.context.KIBScene.__benchmark.managerHtml();
  const htmlCharacterFinds = runtime.counts.characterFinds;
  runtime.manager.values.notes = html;
  runtime.reset();
  runtime.context.KIBScene.__benchmark.refreshManager();
  const sameValueSets = runtime.counts.set;
  runtime.reset();
  const macro = { get: (name) => (name === 'name' ? '관계없는 매크로' : '') };
  const macroHandler = runtime.handlers['add:macro'] && runtime.handlers['add:macro'][0];
  assert.strictEqual(typeof macroHandler, 'function', `${label} add:macro handler missing.`);
  macroHandler(macro);
  return {
    html,
    htmlCharacterFinds,
    sameValueSets,
    unrelatedMacroRefreshes: runtime.counts.timers,
  };
}

function benchmarkHandoutDirector(baselineSource, candidateSource) {
  console.log('\n07 handout manager deterministic calls');
  [10, 100, 1000].forEach((handoutCount) => {
    const baseline = runHandoutDeterministic(
      baselineSource,
      handoutCount,
      'baseline',
    );
    const candidate = runHandoutDeterministic(
      candidateSource,
      handoutCount,
      'worktree',
    );
    if (candidate.html !== baseline.html)
      throw new Error(`07 manager HTML changed at H=${handoutCount}.`);
    assert.strictEqual(baseline.htmlCharacterFinds, handoutCount + 1);
    assert.strictEqual(candidate.htmlCharacterFinds, 1);
    assert.strictEqual(baseline.sameValueSets, 1);
    assert.strictEqual(candidate.sameValueSets, 0);
    assert.strictEqual(baseline.unrelatedMacroRefreshes, 1);
    assert.strictEqual(candidate.unrelatedMacroRefreshes, 0);
    console.log(
      `H=${String(handoutCount).padStart(4)} character findObjs ${baseline.htmlCharacterFinds} -> ${candidate.htmlCharacterFinds}, same-value set ${baseline.sameValueSets} -> ${candidate.sameValueSets}, unrelated macro refresh ${baseline.unrelatedMacroRefreshes} -> ${candidate.unrelatedMacroRefreshes}, HTML ${crypto.createHash('sha256').update(baseline.html).digest('hex').slice(0, 16)}...`,
    );
  });
}

function exposeSheetBenchmark(source, label) {
  const exposed = source.replace(
    /\r?\n\}\)\(KIBSheetHelper\);\s*$/,
    [
      '',
      'api.__benchmark = {',
      '  collectRows: collectRows,',
      '  resolveCharacter: resolveCharacter',
      '};',
      '})(KIBSheetHelper);',
    ].join('\n'),
  );
  assert.notStrictEqual(exposed, source, `${label} 10 benchmark hook was not inserted.`);
  return exposed;
}

function sheetCharacter(id, name) {
  const values = { name, controlledby: 'player-1' };
  return {
    id,
    get(key) {
      return values[key];
    },
  };
}

function createSheetBenchmarkRuntime(source, label) {
  let characterFinds = 0;
  let characters = [];
  const context = vm.createContext({
    KIBScene: kibSceneStub(),
    KIBSheetHelper: {},
    KIBSheetContracts: [],
    state: {},
    on() {},
    log() {},
    findObjs(query) {
      if (query && (query._type === 'character' || query.type === 'character')) {
        characterFinds += 1;
        return characters;
      }
      return [];
    },
    getObj() {
      return null;
    },
    createObj() {
      return null;
    },
    getAttrByName() {
      return undefined;
    },
    Campaign() {
      return { get: () => '' };
    },
    playerIsGM() {
      return false;
    },
    sendChat() {},
    setTimeout() {
      return 1;
    },
    clearTimeout() {},
    setInterval() {
      return 1;
    },
    clearInterval() {},
    randomInteger(maximum) {
      return maximum > 0 ? 1 : 0;
    },
  });
  new vm.Script(exposeSheetBenchmark(source, label), {
    filename: `${label}/10_sheet_helper.js`,
  }).runInContext(context);
  return {
    api: context.KIBSheetHelper.__benchmark,
    setCharacters(next) {
      characters = next;
    },
    resetCharacterFinds() {
      characterFinds = 0;
    },
    characterFinds: () => characterFinds,
  };
}

function sheetAttribute(name, current) {
  return {
    get(key) {
      if (key === 'name') return name;
      if (key === 'current') return current;
      return '';
    },
  };
}

function repeatingFixture(rowCount) {
  const section = 'benchmark';
  const fields = ['name', 'value'];
  const rowIds = Array.from(
    { length: rowCount },
    (_, index) => `row-${String(index).padStart(5, '0')}`,
  );
  const attributes = [];
  rowIds.forEach((rowId, index) => {
    fields.forEach((field) => {
      attributes.push(
        sheetAttribute(
          `repeating_${section}_${rowId}_${field}`,
          `${field}-${index}`,
        ),
      );
    });
  });
  attributes.push(
    sheetAttribute(
      `_reporder_repeating_${section}`,
      rowIds.slice().reverse().join(','),
    ),
  );
  return { section, fields, attributes };
}

function rowDigest(rows) {
  const digest = crypto.createHash('sha256');
  rows.forEach((row) => {
    const serialized = JSON.stringify(stable(jsonClone(row)));
    digest.update(String(serialized.length)).update(':').update(serialized).update('\0');
  });
  return digest.digest('hex');
}

function consumeRows(rows) {
  let checksum = rows.length >>> 0;
  rows.forEach((row, index) => {
    const id = String(row.id || '');
    checksum = (
      Math.imul(checksum ^ id.length ^ index, 16777619) ^
      (id.length ? id.charCodeAt(id.length - 1) : 0)
    ) >>> 0;
  });
  return checksum;
}

function benchmarkSheetInternals(baselineSource, candidateSource, rowsOnly) {
  assert(
    baselineSource.includes('if (ordered.indexOf(rowId) < 0) ordered.push(rowId);'),
    'Baseline 10 indexOf row membership was not found.',
  );
  assert(
    candidateSource.includes('var orderedRows = dictionary();'),
    'Worktree 10 membership map was not found.',
  );
  const baseline = createSheetBenchmarkRuntime(baselineSource, 'baseline');
  const candidate = createSheetBenchmarkRuntime(candidateSource, 'worktree');
  console.log(
    '\n10 collectRows (legacy indexOf -> membership map; ordered canonical deep hash, no retained result history)',
  );
  const results = [100, 1000, 10000].map((rowCount) => {
    const fixture = repeatingFixture(rowCount);
    const baselineRows = baseline.api.collectRows(
      'character-1',
      fixture.section,
      fixture.fields,
      fixture.attributes,
    );
    const baselineHash = rowDigest(baselineRows);
    const candidateRows = candidate.api.collectRows(
      'character-1',
      fixture.section,
      fixture.fields,
      fixture.attributes,
    );
    const candidateHash = rowDigest(candidateRows);
    assert.strictEqual(candidateRows.length, baselineRows.length);
    assert.strictEqual(
      candidateHash,
      baselineHash,
      `10 repeating-row order/content changed at R=${rowCount}.`,
    );
    const timing = medianPair(
      () =>
        consumeRows(
          baseline.api.collectRows(
            'character-1',
            fixture.section,
            fixture.fields,
            fixture.attributes,
          ),
        ),
      () =>
        consumeRows(
          candidate.api.collectRows(
            'character-1',
            fixture.section,
            fixture.fields,
            fixture.attributes,
          ),
        ),
      rowCount,
    );
    console.log(
      `R=${String(rowCount).padStart(5)} ${timing.baseline.toFixed(3)} -> ${timing.candidate.toFixed(3)} ms (${percentDelta(timing.baseline, timing.candidate)}), rows ${baselineHash.slice(0, 16)}...`,
    );
    return { length: rowCount, ...timing };
  });
  printGrowth('10 collectRows', results);
  if (rowsOnly) return;

  const characters = [
    sheetCharacter('character-1', '가'),
    sheetCharacter('character-2', '나'),
  ];
  baseline.setCharacters(characters);
  candidate.setCharacters(characters);
  const message = { playerid: 'player-1', who: 'GM (GM)' };
  baseline.resetCharacterFinds();
  const baselineResolution = baseline.api.resolveCharacter(message, '');
  const baselineFinds = baseline.characterFinds();
  candidate.resetCharacterFinds();
  const candidateResolution = candidate.api.resolveCharacter(message, '');
  const candidateFinds = candidate.characterFinds();
  assert.strictEqual(
    candidateResolution.ok,
    baselineResolution.ok,
    '10 character resolution success/failure changed.',
  );
  assert.strictEqual(baselineFinds, 2);
  assert(candidateFinds <= 1);
  console.log(
    `10 resolveCharacter character findObjs ${baselineFinds} -> ${candidateFinds}, success/failure equal`,
  );
}

function benchmarkRefresh(kind, fileName, baselineSource, candidateSource) {
  console.log(`\n${kind} refresh handler (${fileName}, steady-state fixture)`);
  const baselineScript = new vm.Script(baselineSource, {
    filename: `baseline/${fileName}`,
  });
  const candidateScript = new vm.Script(candidateSource, {
    filename: `worktree/${fileName}`,
  });
  const results = [];
  FIXTURE_SIZES.forEach((count) => {
    const fixture = fixtureFromBaseline(baselineScript, kind, count);
    const baseline = runRefresh(baselineScript, kind, fixture);
    const candidate = runRefresh(candidateScript, kind, fixture);
    guardRefresh(baseline, candidate, kind, count);
    results.push({ count, baseline, candidate });
    console.log(
      `N=${String(count).padStart(4)}  ${baseline.elapsed.toFixed(3)} -> ${candidate.elapsed.toFixed(3)} ms (${percentDelta(baseline.elapsed, candidate.elapsed)})`,
    );
    console.log(`  baseline ${callSummary(baseline.calls)}`);
    console.log(`  worktree ${callSummary(candidate.calls)}`);
  });
  const first = results[0];
  const last = results[results.length - 1];
  console.log(
    `  N=10 -> 1000 growth: time ${scale(first.baseline.elapsed, last.baseline.elapsed)} -> ${scale(first.candidate.elapsed, last.candidate.elapsed)}, scanned ${scale(first.baseline.calls.findScanned, last.baseline.calls.findScanned)} -> ${scale(first.candidate.calls.findScanned, last.candidate.calls.findScanned)}`,
  );
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const commit = resolveRef(options.ref);
  const names = scriptNames().filter((name) => !options.legacyOnly || !name.startsWith('10_'));
  const baseline = readSources(names, commit);
  const candidate = readSources(names, null);
  if (options.legacyOnly) {
    console.log(`Baseline: ${options.ref} (${commit.slice(0, 12)})`);
    console.log('Candidate: worktree');
    printSizes(names, baseline, candidate);
    benchmarkFrameBuilders(baseline, candidate, names);
    const handoutName = names.find((name) => name.startsWith('07_'));
    benchmarkHandoutDirector(baseline[handoutName], candidate[handoutName]);
    ['03', '09'].forEach((kind) => {
      const fileName = names.find((name) => name.startsWith(`${kind}_`));
      benchmarkRefresh(kind, fileName, baseline[fileName], candidate[fileName]);
    });
    console.log('\nLegacy 00-09 benchmark guards: PASS');
    return;
  }
  if (options.recognitionOnly) {
    const sheetName = names.find((name) => name.startsWith('10_'));
    console.log(`Baseline: ${options.ref} (${commit.slice(0, 12)})`);
    console.log('Candidate: worktree');
    printSizes([sheetName], baseline, candidate);
    printRecognition(baseline[sheetName], candidate[sheetName]);
    console.log('\nRecognition benchmark guards: PASS');
    return;
  }
  if (options.rowsOnly) {
    const sheetName = names.find((name) => name.startsWith('10_'));
    console.log(`Baseline: ${options.ref} (${commit.slice(0, 12)})`);
    console.log('Candidate: worktree');
    printSizes([sheetName], baseline, candidate);
    benchmarkSheetInternals(baseline[sheetName], candidate[sheetName], true);
    console.log('\nRepeating-row benchmark guards: PASS');
    return;
  }
  const baselinePublicNames = gitPublicTextNames(commit);
  const candidatePublicNames = worktreePublicTextNames();
  const otherPublicNames = Array.from(
    new Set(baselinePublicNames.concat(candidatePublicNames)),
  )
    .filter((name) => !name.startsWith('public/scripts/'))
    .sort();
  const baselinePublic = readPublicTexts(
    otherPublicNames,
    commit,
    baselinePublicNames,
  );
  const candidatePublic = readPublicTexts(
    otherPublicNames,
    null,
    candidatePublicNames,
  );
  console.log(`Baseline: ${options.ref} (${commit.slice(0, 12)})`);
  console.log('Candidate: worktree');
  const scriptTotals = printSizes(names, baseline, candidate);
  const otherPublicTotals = printPublicTextSizes(
    otherPublicNames,
    baselinePublic,
    candidatePublic,
  );
  printPublicTotal(scriptTotals, otherPublicTotals);
  benchmarkFrameBuilders(baseline, candidate, names);
  const handoutName = names.find((name) => name.startsWith('07_'));
  benchmarkHandoutDirector(baseline[handoutName], candidate[handoutName]);
  const sheetName = names.find((name) => name.startsWith('10_'));
  printRecognition(baseline[sheetName], candidate[sheetName]);
  benchmarkSheetInternals(baseline[sheetName], candidate[sheetName]);
  ['03', '09'].forEach((kind) => {
    const fileName = names.find((name) => name.startsWith(`${kind}_`));
    benchmarkRefresh(kind, fileName, baseline[fileName], candidate[fileName]);
  });
  console.log('\nBenchmark guards: PASS');
}

try {
  main();
} catch (error) {
  console.error(`\nBenchmark guards: FAIL\n${error.stack || error.message || error}`);
  process.exitCode = 1;
}
