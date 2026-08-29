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
  return packed;
}

function render(sheets) {
  const json = JSON.stringify(sheets.map(packModes))
    .replace(/</g, '\\u003c')
    .replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`);
  return `${start}\n(function () {\n  var embedded = ${json};\n  embedded.forEach(function (sheet) {\n    var modeSets = sheet.modeSets || [];\n    var serializedModes = modeSets.map(JSON.stringify);\n    (sheet.rolls || []).forEach(function (roll) {\n      roll.modes = roll.m === undefined ? [] : JSON.parse(serializedModes[roll.m]);\n      delete roll.m;\n    });\n    delete sheet.modeSets;\n    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))\n      KIBSheetContracts.push(sheet);\n  });\n}());\n${end}`;
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
