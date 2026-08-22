const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const scriptsRoot = path.join(publicRoot, 'scripts');
const scripts = Array.from({ length: 10 }, (_, index) =>
  fs.readdirSync(scriptsRoot).find(name => name.startsWith(`${String(index).padStart(2, '0')}_`)),
);

assert(scripts.every(Boolean), '00부터 09까지 스크립트가 모두 있어야 합니다.');
scripts.forEach(name => execFileSync(process.execPath, ['--check', path.join(scriptsRoot, name)]));

const publicTextFiles = [
  path.join(root, 'README.md'),
  path.join(root, 'THIRD_PARTY_NOTICE.md'),
  path.join(publicRoot, 'index.html'),
  path.join(publicRoot, 'assets', 'app.js'),
  path.join(publicRoot, 'assets', 'styles.css'),
];
const publicText = publicTextFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
const scriptText = scripts.map(name => fs.readFileSync(path.join(scriptsRoot, name), 'utf8')).join('\n');
new Function(scriptText);

assert(!publicText.includes('·'), '공개 문서와 페이지에 가운데 점을 쓰지 않습니다.');
assert(!publicText.includes('Song991123'), '공개 페이지에 GitHub 계정명을 넣지 않습니다.');
assert(!/files\.d20\.io\/images\/493(?:872337|961531)/.test(scriptText), '개인 Roll20 이미지 주소를 배포하지 않습니다.');
assert(publicText.includes('확장 버전'), '확장 버전 표기가 필요합니다.');
assert(publicText.includes('2089133134201995610'), '제작 기록 링크가 필요합니다.');
assert(scriptText.includes('kibkibe/roll20-api-scripts/tree/master/narrator'), 'Narrator 원본 출처가 필요합니다.');
assert(scriptText.includes('kibkibe/roll20-api-scripts/tree/master/visual_dialogue'), 'Visual Dialogue 원본 출처가 필요합니다.');
assert(scriptText.includes('kibkibe/roll20-api-scripts/tree/master/image_switcher'), 'Image Switcher 원본 출처가 필요합니다.');

console.log('Scene Suite release check: PASS');
