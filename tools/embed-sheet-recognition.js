const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { parseSheetContract } = require('./sheet-contract-parser');
const { readSheetSourceInputs } = require('./build-sheet-contract');

const target = path.resolve(__dirname, '../public/scripts/10_sheet_helper.js');
const start = '/* SCENE_SUITE_SHEET_RECOGNITION_START */';
const end = '/* SCENE_SUITE_SHEET_RECOGNITION_END */';
const brotliDecoderPath = path.resolve(
  __dirname,
  'vendor/brotli-json-decoder.es5.min.js',
);
const brotliLicensePath = path.resolve(
  __dirname,
  'vendor/brotli-json-decoder.LICENSE.txt',
);

function readSheet(name, htmlPath, cssPath, translationPaths) {
  const { source, translationInputs, stylesheet, sourceHash, legacy } =
    readSheetSourceInputs(htmlPath, cssPath, translationPaths);
  return parseSheetContract(source, {
    name,
    id: `sheet-${sourceHash.slice(0, 16)}`,
    sourceHash,
    translations: translationInputs.map((entry) => entry.messages),
    css: stylesheet,
    legacy,
  });
}

function functionalKey(sheet) {
  const comparable = JSON.parse(JSON.stringify(sheet));
  delete comparable.id;
  delete comparable.name;
  delete comparable.sourceHash;
  return JSON.stringify(comparable);
}

function uniqueSheets(sheets) {
  const seen = new Set();
  return sheets.filter((sheet) => {
    const key = functionalKey(sheet);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function packModes(sheet) {
  const packed = JSON.parse(JSON.stringify(sheet));
  // 원본 파일을 구분하려고 붙인 개발용 이름은 Roll20 시트 데이터가 아니다.
  delete packed.name;
  const modeSets = [];
  const modeSetIds = new Map();
  const rollVisibilitySets = [];
  const rollVisibilityIds = new Map();
  const fieldVisibilitySets = [];
  const fieldVisibilityIds = new Map();
  const fieldAliasSets = [];
  const fieldAliasIds = new Map();

  (packed.rolls || []).forEach((roll) => {
    const modes = Array.isArray(roll.modes) ? roll.modes : [];
    delete roll.modes;
    if (modes.length) {
      const key = JSON.stringify(modes);
      if (!modeSetIds.has(key)) {
        modeSetIds.set(key, modeSets.length);
        modeSets.push(modes);
      }
      roll.m = modeSetIds.get(key);
    }

    const visibility = roll.visibility;
    delete roll.visibility;
    if (visibility === undefined) return;
    const visibilityKey = JSON.stringify(visibility);
    if (!rollVisibilityIds.has(visibilityKey)) {
      rollVisibilityIds.set(visibilityKey, rollVisibilitySets.length);
      rollVisibilitySets.push(visibility);
    }
    roll.v = rollVisibilityIds.get(visibilityKey);
  });

  packed.modeSets = modeSets;
  if (rollVisibilitySets.length) packed.rollVisibilitySets = rollVisibilitySets;
  const fieldTypes = ['text', 'number', 'range', 'checkbox', 'radio', 'hidden', 'textarea', 'select'];
  const sections = Object.keys(packed.sections || {}).sort();
  const repeatingFields = new Set(sections.flatMap((section) => packed.sections[section] || []));
  packed.g = (packed.globalAttributes || []).filter((name) => repeatingFields.has(name));
  delete packed.globalAttributes;
  packed.f = (packed.fields || []).map((field) => {
    const label = String(field.label || field.name).replace(/\s*·\s*/g, ' / ');
    const aliases = (field.aliases || []).map((alias) => String(alias).replace(/\s*·\s*/g, ' / '));
    let aliasId = 0;
    if (aliases.length) {
      const aliasKey = JSON.stringify(aliases);
      if (!fieldAliasIds.has(aliasKey)) {
        fieldAliasIds.set(aliasKey, fieldAliasSets.length + 1);
        fieldAliasSets.push(aliases);
      }
      aliasId = fieldAliasIds.get(aliasKey);
    }
    const flags = (field.numericCandidate ? 1 : 0) | (field.trackCandidate ? 2 : 0) |
      (field.readonly ? 4 : 0) | (field.disabled ? 8 : 0) | (field.hidden ? 16 : 0);
    let visibilityId = 0;
    if (field.visibility) {
      const visibilityKey = JSON.stringify(field.visibility);
      if (!fieldVisibilityIds.has(visibilityKey)) {
        fieldVisibilityIds.set(visibilityKey, fieldVisibilitySets.length + 1);
        fieldVisibilitySets.push(field.visibility);
      }
      visibilityId = fieldVisibilityIds.get(visibilityKey);
    }
    const defaultVariants = Array.isArray(field.defaultVariants) && field.defaultVariants.length
      ? field.defaultVariants.slice(1) : [];
    const values = [
      packed.attributes.indexOf(field.name),
      Math.max(0, fieldTypes.indexOf(field.type)),
      label === field.name ? '' : label,
      flags,
      aliasId,
      field.section ? sections.indexOf(field.section) + 1 : 0,
      field.default === undefined || field.default === null || field.default === '' ? 0 : field.default,
      field.max || 0,
      field.onValue || 0,
      visibilityId,
      field.groupLabel || 0,
      defaultVariants.length ? defaultVariants : 0,
      field.radioRange || 0,
    ];
    while (values.length > 4 && !values[values.length - 1]) values.pop();
    return values;
  });
  if (fieldVisibilitySets.length) packed.fieldVisibilitySets = fieldVisibilitySets;
  if (fieldAliasSets.length) packed.fieldAliasSets = fieldAliasSets;
  delete packed.fields;
  return packed;
}

function sharedPackedPayload(sheets) {
  const tables = { m: [], r: [], v: [], a: [] };
  const indexes = { m: new Map(), r: new Map(), v: new Map(), a: new Map() };
  function intern(kind, value) {
    const key = JSON.stringify(value);
    if (!indexes[kind].has(key)) {
      indexes[kind].set(key, tables[kind].length);
      tables[kind].push(value);
    }
    return indexes[kind].get(key);
  }
  const packed = sheets.map(packModes);
  packed.forEach((sheet) => {
    [
      ['modeSets', 'M', 'm'],
      ['rollVisibilitySets', 'R', 'r'],
      ['fieldVisibilitySets', 'V', 'v'],
      ['fieldAliasSets', 'A', 'a'],
    ].forEach(([source, target, table]) => {
      if (sheet[source] && sheet[source].length)
        sheet[target] = sheet[source].map((value) => intern(table, value));
      delete sheet[source];
    });
    sheet.rolls = (sheet.rolls || []).map((roll) => {
      const known = new Set([
        'key', 'name', 'label', 'aliases', 'raw', 'template', 'refs', 'repeating',
        'staticLabels', 'labelRefs', 'expressionRefs', 'controls', 'modesIncomplete', 'm', 'v',
      ]);
      const unknown = Object.keys(roll).filter((key) => !known.has(key));
      if (unknown.length) throw new Error(`Roll packer does not preserve: ${unknown.join(', ')}`);
      const values = [
        roll.key,
        roll.name || 0,
        roll.label || 0,
        roll.aliases && roll.aliases.length ? roll.aliases : 0,
        roll.raw || 0,
        roll.template || 0,
        roll.refs && roll.refs.length ? roll.refs : 0,
        roll.repeating || 0,
        roll.staticLabels && roll.staticLabels.length ? roll.staticLabels : 0,
        roll.labelRefs && roll.labelRefs.length ? roll.labelRefs : 0,
        roll.expressionRefs && roll.expressionRefs.length ? roll.expressionRefs : 0,
        roll.controls || 0,
        roll.modesIncomplete ? 1 : 0,
        roll.m === undefined ? 0 : roll.m + 1,
        roll.v === undefined ? 0 : roll.v + 1,
      ];
      while (values.length > 5 && !values[values.length - 1]) values.pop();
      return values;
    });
  });
  return { m: tables.m, r: tables.r, v: tables.v, a: tables.a, s: packed };
}

function internPayloadStrings(payload) {
  const marker = '\x01';
  const counts = new Map();
  (function count(value) {
    if (typeof value === 'string') {
      if (value.charAt(0) === marker) throw new Error('Sheet data uses the reserved string marker.');
      counts.set(value, (counts.get(value) || 0) + 1);
    } else if (Array.isArray(value)) value.forEach(count);
    else if (value && typeof value === 'object') Object.keys(value).forEach((key) => count(value[key]));
  }(payload));
  function potential(entry) {
    return (entry[1] - 1) * JSON.stringify(entry[0]).length;
  }
  const strings = [];
  const ids = new Map();
  Array.from(counts.entries()).sort((left, right) =>
    potential(right) - potential(left) || (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0)
  ).forEach(([value, count]) => {
    const id = strings.length;
    const originalBytes = JSON.stringify(value).length;
    const referenceBytes = JSON.stringify(marker + id.toString(36)).length;
    if ((count - 1) * originalBytes <= count * referenceBytes + 1) return;
    ids.set(value, id);
    strings.push(value);
  });
  function encode(value) {
    if (typeof value === 'string') {
      const id = ids.get(value);
      return id === undefined ? value : marker + id.toString(36);
    }
    if (Array.isArray(value)) return value.map(encode);
    if (value && typeof value === 'object') {
      const result = {};
      Object.keys(value).forEach((key) => { result[key] = encode(value[key]); });
      return result;
    }
    return value;
  }
  return { d: strings, p: encode(payload) };
}

function brotliBase64(text) {
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) > 0x7f)
      throw new Error('Brotli input must contain ASCII text only.');
  }
  const input = Buffer.from(text, 'ascii');
  const params = {};
  params[zlib.constants.BROTLI_PARAM_MODE] = zlib.constants.BROTLI_MODE_TEXT;
  params[zlib.constants.BROTLI_PARAM_QUALITY] = 11;
  params[zlib.constants.BROTLI_PARAM_LGWIN] = 22;
  params[zlib.constants.BROTLI_PARAM_SIZE_HINT] = input.length;
  return zlib.brotliCompressSync(input, { params }).toString('base64');
}

function renderBrotliDecoder() {
  const source = fs.readFileSync(brotliDecoderPath, 'utf8').trim();
  const license = fs.readFileSync(brotliLicensePath, 'utf8').trim()
    .replace(/\*\//g, '* /').split(/\r?\n/)
    .map((line) => line ? `   * ${line}` : '   *').join('\n');
  return `  /*!
${license}
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      ${source}
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());`;
}

function render(sheets) {
  const json = JSON.stringify(internPayloadStrings(sharedPackedPayload(sheets)))
    .replace(/</g, '\\u003c')
    .replace(/\u00b7/g, '\\u00b7')
    .replace(/[\u2013\u2014]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`)
    .replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`)
    .replace(/[\u007f-\uffff]/g, (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
  const compressed = brotliBase64(json);
  return `${start}
(function () {
${renderBrotliDecoder()}
  var compressed = '${compressed}';
  if (compressed.length !== ${compressed.length} || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== ${json.length}) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '\x01')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      if (field[12]) restored.radioRange = field[12].slice();
      return restored;
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
${end}`;
}

function embed(entries) {
  const source = fs.readFileSync(target, 'utf8');
  const startAt = source.indexOf(start);
  const endAt = source.indexOf(end);
  if (startAt < 0 || endAt < startAt) throw new Error('Sheet recognition markers were not found.');
  const sheets = uniqueSheets(entries.map((entry) =>
    readSheet(entry.name, entry.html, entry.css, entry.translations)));
  const updated = source.slice(0, startAt) + render(sheets) + source.slice(endAt + end.length);
  fs.writeFileSync(target, updated);
  return sheets;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length || args.length % 3) {
    console.error('Usage: node tools/embed-sheet-recognition.js <name> <sheet.html> <sheet.css|-> [...]');
    process.exitCode = 1;
  } else {
    const entries = [];
    for (let index = 0; index < args.length; index += 3)
      entries.push({ name: args[index], html: args[index + 1], css: args[index + 2] });
    const sheets = embed(entries);
    console.log(`Embedded sheet recognition: ${sheets.length} source files`);
  }
}

module.exports = {
  brotliBase64, embed, functionalKey, internPayloadStrings, packModes, readSheet, render,
  renderBrotliDecoder, sharedPackedPayload, uniqueSheets,
};
