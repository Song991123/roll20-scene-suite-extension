const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseSheetContract } = require('../public/assets/sheet-contract-parser');

function translationManifestName(file, isDefault) {
  const basename = path.basename(file);
  return isDefault || basename.toLowerCase() === 'translation.json'
    ? 'translation.json'
    : `translations/${basename}`;
}

function readTranslationInputs(inputPath, requestedPaths) {
  const directory = path.dirname(inputPath);
  const defaults = [
    { relative: 'translations/ko.json', file: path.join(directory, 'translations', 'ko.json') },
    { relative: 'translation.json', file: path.join(directory, 'translation.json') },
  ];
  const requested = (requestedPaths || []).map((file) => {
    const resolved = path.resolve(file);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile())
      throw new Error(`Translation file not found: ${resolved}`);
    return {
      relative: translationManifestName(resolved, false),
      file: resolved,
    };
  });
  const seen = new Set();
  const manifest = new Map();
  return requested.concat(defaults).filter((entry) => {
    const key = path.resolve(entry.file).toLowerCase();
    if (seen.has(key) || !fs.existsSync(entry.file) || !fs.statSync(entry.file).isFile()) return false;
    const manifestKey = entry.relative.toLowerCase();
    if (manifest.has(manifestKey))
      throw new Error(`Translation files use the same name: ${manifest.get(manifestKey)} and ${entry.file}`);
    seen.add(key);
    manifest.set(manifestKey, entry.file);
    return true;
  }).map((entry) => {
    const source = fs.readFileSync(entry.file, 'utf8');
    let messages;
    try {
      messages = JSON.parse(source.replace(/^\uFEFF/, ''));
    } catch (error) {
      throw new Error(`Invalid translation JSON: ${entry.file} (${error.message})`);
    }
    if (!messages || typeof messages !== 'object' || Array.isArray(messages))
      throw new Error(`Translation JSON must contain an object: ${entry.file}`);
    return { ...entry, source, messages };
  });
}

function findCssInput(inputPath, requestedPath) {
  if (requestedPath === '-') return null;
  if (requestedPath) {
    const resolved = path.resolve(requestedPath);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile())
      throw new Error(`Stylesheet not found: ${resolved}`);
    return resolved;
  }
  const directory = path.dirname(inputPath);
  const sameBase = path.join(directory, `${path.basename(inputPath, path.extname(inputPath))}.css`);
  if (fs.existsSync(sameBase) && fs.statSync(sameBase).isFile()) return sameBase;
  const siblings = fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.css')
    .map((entry) => path.join(directory, entry.name));
  return siblings.length === 1 ? siblings[0] : null;
}

function readSheetSourceInputs(inputPath, cssPath, translationPaths) {
  inputPath = path.resolve(inputPath);
  const source = fs.readFileSync(inputPath, 'utf8');
  const translationInputs = readTranslationInputs(inputPath, translationPaths);
  const stylesheetPath = findCssInput(inputPath, cssPath);
  const stylesheet = stylesheetPath ? fs.readFileSync(stylesheetPath, 'utf8') : '';
  const digest = crypto.createHash('sha256').update(source);
  translationInputs.forEach((entry) => digest.update(`\0${entry.relative}\0`).update(entry.source));
  if (stylesheetPath) digest.update('\0stylesheet\0').update(stylesheet);
  const sourceHash = digest.digest('hex');
  return { source, translationInputs, stylesheetPath, stylesheet, sourceHash };
}

function buildSheetContract(inputPath, outputPath, cssPath, translationPaths) {
  const { source, translationInputs, stylesheetPath, stylesheet, sourceHash } =
    readSheetSourceInputs(inputPath, cssPath, translationPaths);
  const name = path.basename(inputPath, path.extname(inputPath));
  const contract = parseSheetContract(source, {
    name,
    id: `sheet-${sourceHash.slice(0, 16)}`,
    sourceHash,
    translations: translationInputs.map((entry) => entry.messages),
    css: stylesheet,
  });
  const target = outputPath || path.join(path.dirname(inputPath), 'sheet_contract.js');
  if (path.resolve(inputPath) === path.resolve(target)) throw new Error('Output path must differ from the sheet HTML path.');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const json = JSON.stringify(contract)
    .replace(/</g, '\\u003c')
    .replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`);
  fs.writeFileSync(target, `var KIBSheetContracts = KIBSheetContracts || [];\n(function () {\n  var contract = ${json};\n  KIBSheetContracts.push(contract);\n  if (typeof KIBSheetHelper !== 'undefined' && KIBSheetHelper && typeof KIBSheetHelper.registerContract === 'function') {\n    KIBSheetHelper.registerContract(contract);\n  }\n}());\n`);
  return { contract, target, translationPaths: translationInputs.map((entry) => entry.file), cssPath: stylesheetPath };
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node tools/build-sheet-contract.js <sheet.html> [output.js] [sheet.css] [translation.json ...]');
    process.exitCode = 1;
  } else {
    const result = buildSheetContract(
      path.resolve(input),
      process.argv[3] ? path.resolve(process.argv[3]) : null,
      process.argv[4] ? path.resolve(process.argv[4]) : null,
      process.argv.slice(5).map((file) => path.resolve(file))
    );
    console.log(`Sheet contract: ${result.target}`);
    if (result.cssPath) console.log(`Stylesheet: ${result.cssPath}`);
  }
}

module.exports = {
  buildSheetContract,
  parseSheetContract,
  readTranslationInputs,
  findCssInput,
  readSheetSourceInputs,
  translationManifestName,
};
