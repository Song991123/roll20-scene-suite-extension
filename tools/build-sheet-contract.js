const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parseSheetContract } = require('../public/assets/sheet-contract-parser');

function buildSheetContract(inputPath, outputPath) {
  const source = fs.readFileSync(inputPath, 'utf8');
  const sourceHash = crypto.createHash('sha256').update(source).digest('hex');
  const name = path.basename(inputPath, path.extname(inputPath));
  const contract = parseSheetContract(source, { name, id: `sheet-${sourceHash.slice(0, 16)}`, sourceHash });
  const target = outputPath || path.join(path.dirname(inputPath), 'sheet_contract.js');
  if (path.resolve(inputPath) === path.resolve(target)) throw new Error('Output path must differ from the sheet HTML path.');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const json = JSON.stringify(contract)
    .replace(/</g, '\\u003c')
    .replace(/[\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16)}`);
  fs.writeFileSync(target, `var KIBSheetContracts = KIBSheetContracts || [];\n(function () {\n  var contract = ${json};\n  KIBSheetContracts.push(contract);\n  if (typeof KIBSheetHelper !== 'undefined' && KIBSheetHelper && typeof KIBSheetHelper.registerContract === 'function') {\n    KIBSheetHelper.registerContract(contract);\n  }\n}());\n`);
  return { contract, target };
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node tools/build-sheet-contract.js <sheet.html> [output.js]');
    process.exitCode = 1;
  } else {
    const result = buildSheetContract(path.resolve(input), process.argv[3] ? path.resolve(process.argv[3]) : null);
    console.log(`Sheet contract: ${result.target}`);
  }
}

module.exports = { buildSheetContract, parseSheetContract };
