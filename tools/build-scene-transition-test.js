const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'artifacts', 'scene-transition-dev');
const moduleRoot = path.join(root, 'public', 'scripts');
fs.mkdirSync(path.join(output, 'modules'), { recursive: true });
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const files = fs.readdirSync(moduleRoot).filter(name => /^\d\d_.+\.js$/.test(name)).sort();
assert.equal(files.length, 11);
const source = Object.fromEntries(files.map(name => [name, fs.readFileSync(path.join(moduleRoot, name), 'utf8').replace(/\r\n?/g, '\n')]));
const manifest = { commit, localOnly: true, liveVerified: false, files: {} };
function write(name, text) {
  fs.writeFileSync(path.join(output, name), text);
  manifest.files[name] = crypto.createHash('sha256').update(text).digest('hex');
}
files.forEach(name => write('modules/' + name, source[name]));
function bundle(name, selected) {
  const selectedFiles = files.filter(file => selected.includes(file.slice(0, 2)));
  const text = '/* LOCAL TEST - APNG scene transitions\n * Commit: ' + commit +
    '\n * Modules: ' + selected.join(',') + '\n * Disable installed duplicates. Not deployed. No standalone lyrics.\n */\n' +
    selectedFiles.map(file => source[file]).join('\n;\n');
  new vm.Script(text);
  write(name, text);
}
bundle('scene-suite-transition-test.js', ['00', '01', '02', '03', '04', '06', '07', '08', '10']);
bundle('scene-suite-transition-all-00-10-test.js', files.map(file => file.slice(0, 2)));
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Local scene transition bundles: ' + Object.keys(manifest.files).length + ' files, commit ' + commit);
