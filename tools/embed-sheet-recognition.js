const fs = require('fs');
const path = require('path');
const { parseSheetContract } = require('./sheet-contract-parser');
const { readSheetSourceInputs } = require('./build-sheet-contract');

const target = path.resolve(__dirname, '../public/scripts/10_sheet_helper.js');
const start = '/* KIB_SHEET_RECOGNITION_START */';
const end = '/* KIB_SHEET_RECOGNITION_END */';

function readSheet(name, htmlPath, cssPath) {
  const { source, translationInputs, stylesheet, sourceHash } =
    readSheetSourceInputs(htmlPath, cssPath);
  return parseSheetContract(source, {
    name,
    id: `sheet-${sourceHash.slice(0, 16)}`,
    sourceHash,
    translations: translationInputs.map((entry) => entry.messages),
    css: stylesheet,
  });
}

function packModes(sheet) {
  const packed = JSON.parse(JSON.stringify(sheet));
  const modeSets = [];
  const modeSetIds = new Map();
  const fieldVisibilitySets = [];
  const fieldVisibilityIds = new Map();
  const fieldAliasSets = [];
  const fieldAliasIds = new Map();

  (packed.rolls || []).forEach((roll) => {
    const modes = Array.isArray(roll.modes) ? roll.modes : [];
    delete roll.modes;
    if (!modes.length) return;

    const key = JSON.stringify(modes);
    if (!modeSetIds.has(key)) {
      modeSetIds.set(key, modeSets.length);
      modeSets.push(modes);
    }
    roll.m = modeSetIds.get(key);
  });

  packed.modeSets = modeSets;
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
    ];
    while (values.length > 4 && !values[values.length - 1]) values.pop();
    return values;
  });
  if (fieldVisibilitySets.length) packed.fieldVisibilitySets = fieldVisibilitySets;
  if (fieldAliasSets.length) packed.fieldAliasSets = fieldAliasSets;
  delete packed.fields;
  return packed;
}

function render(sheets) {
  const json = JSON.stringify(sheets.map(packModes))
    .replace(/</g, '\\u003c')
    .replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`);
  return `${start}\n(function () {\n  var embedded = ${json};\n  embedded.forEach(function (sheet) {\n    var modeSets = sheet.modeSets || [];\n    var serializedModes = modeSets.map(JSON.stringify);\n    (sheet.rolls || []).forEach(function (roll) {\n      roll.modes = roll.m === undefined ? [] : JSON.parse(serializedModes[roll.m]);\n      delete roll.m;\n    });\n    delete sheet.modeSets;\n    var fieldVisibilitySets = sheet.fieldVisibilitySets || [];\n    var fieldAliasSets = sheet.fieldAliasSets || [];\n    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];\n    var sections = Object.keys(sheet.sections || {}).sort();\n    var repeatingFields = Object.create(null);\n    sections.forEach(function (section) {\n      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });\n    });\n    var globalRepeating = sheet.g || [];\n    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {\n      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;\n    });\n    delete sheet.g;\n    sheet.fields = (sheet.f || []).map(function (field) {\n      var flags = Number(field[3]) || 0;\n      return { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',\n        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],\n        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',\n        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),\n        disabled: !!(flags & 8), hidden: !!(flags & 16) };\n    });\n    delete sheet.f;\n    delete sheet.fieldVisibilitySets;\n    delete sheet.fieldAliasSets;\n    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))\n      KIBSheetContracts.push(sheet);\n  });\n}());\n${end}`;
}

function embed(entries) {
  const source = fs.readFileSync(target, 'utf8');
  const startAt = source.indexOf(start);
  const endAt = source.indexOf(end);
  if (startAt < 0 || endAt < startAt) throw new Error('Sheet recognition markers were not found.');
  const sheets = entries.map((entry) => readSheet(entry.name, entry.html, entry.css));
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
    console.log(`Embedded sheet recognition: ${sheets.map((sheet) => sheet.name).join(', ')}`);
  }
}

module.exports = { embed, packModes, readSheet, render };
