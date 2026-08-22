const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const buildSourceCatalog = require('./build-sources');

const root = path.resolve(__dirname, '..');
const publicRoot = path.join(root, 'public');
const scriptsRoot = path.join(publicRoot, 'scripts');
const sourcesFile = path.join(publicRoot, 'assets', 'sources.js');
const scripts = Array.from({ length: 10 }, (_, index) =>
  fs
    .readdirSync(scriptsRoot)
    .find((name) => name.startsWith(`${String(index).padStart(2, '0')}_`)),
);

assert(scripts.every(Boolean), '00부터 09까지 스크립트가 모두 있어야 합니다.');
scripts.forEach((name) =>
  execFileSync(process.execPath, ['--check', path.join(scriptsRoot, name)]),
);

const publicTextFiles = [
  path.join(root, 'README.md'),
  path.join(root, 'THIRD_PARTY_NOTICE.md'),
  path.join(publicRoot, 'index.html'),
  path.join(publicRoot, 'assets', 'app.js'),
  path.join(publicRoot, 'assets', 'styles.css'),
];
const publicText = publicTextFiles
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n');
const indexText = fs.readFileSync(path.join(publicRoot, 'index.html'), 'utf8');
const appText = fs.readFileSync(
  path.join(publicRoot, 'assets', 'app.js'),
  'utf8',
);
const cutinText = fs.readFileSync(
  path.join(scriptsRoot, '08_cutin_director.js'),
  'utf8',
);
const scriptText = scripts
  .map((name) => fs.readFileSync(path.join(scriptsRoot, name), 'utf8'))
  .join('\n');
new Function(scriptText);
assert.strictEqual(
  fs.readFileSync(sourcesFile, 'utf8'),
  buildSourceCatalog(),
  '코드 원문 묶음을 다시 만들어야 합니다: node tools/build-sources.js',
);

assert(
  !publicText.includes('·'),
  '공개 문서와 페이지에 가운데 점을 쓰지 않습니다.',
);
assert(
  !publicText.includes('Song991123'),
  '공개 페이지에 GitHub 계정명을 넣지 않습니다.',
);
assert(
  !/files\.d20\.io\/images\/493(?:872337|961531)/.test(scriptText),
  '개인 Roll20 이미지 주소를 배포하지 않습니다.',
);
assert(publicText.includes('확장 버전'), '확장 버전 표기가 필요합니다.');
assert(
  !indexText.includes('Roll20 적용 코드 만들기'),
  '불필요한 소개 구역을 다시 넣지 않습니다.',
);
assert(
  !indexText.includes('통합 파일'),
  '받기 버튼에 별도 통합 파일 구역을 만들지 않습니다.',
);
assert(
  publicText.includes('단독 사용 가능'),
  '단독 사용 가능 표기가 필요합니다.',
);
assert(
  appText.includes("label: '패널 이미지 주소'") &&
    appText.includes('Roll20 HTTPS 이미지 주소'),
  '패널 이미지 설정 설명이 필요합니다.',
);
assert(
  !/(?:sheetRules|changeSheetRules|시트추가|시트삭제|시트목록|function rollFields|function conditionMatches)/.test(
    cutinText,
  ),
  '배포본 08에 시트 호환 코드를 넣지 않습니다.',
);
assert(
  appText.includes('각종 여러 시트 호환은 아직 미개발. 추후 업뎃 예정'),
  '컷인 시트 호환 예정 안내가 필요합니다.',
);
assert(
  !indexText.includes('id="setup-list"') &&
    !indexText.includes('id="settings-title"'),
  '세팅법과 사용자 설정은 코드 목록 안에 둡니다.',
);
assert(
  appText.includes('class="module-item') &&
    appText.includes('<h2>세팅법</h2>') &&
    appText.includes('<summary>코드 보기</summary>') &&
    appText.includes('data-setting-key'),
  '각 코드 안에 세팅법, 설정, 코드 보기가 필요합니다.',
);
assert(
  !/(?:define:|\/define:|on\.ready|\/on\.|✅|option:)/.test(scriptText),
  '예전 설명형 주석 표기를 남기지 않습니다.',
);
assert(
  publicText.includes('2089133134201995610'),
  '제작 기록 링크가 필요합니다.',
);
assert(
  publicText.includes(
    'API-%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EA%B0%80%EA%B3%B5-%EB%B0%8F-%EC%9E%AC%EB%B0%B0%ED%8F%AC-%EC%A0%95%EC%B1%85',
  ),
  '원본 재배포 정책 링크가 필요합니다.',
);
assert(
  scriptText.includes('kibkibe/roll20-api-scripts/tree/master/narrator'),
  'Narrator 원본 출처가 필요합니다.',
);
assert(
  scriptText.includes('kibkibe/roll20-api-scripts/tree/master/visual_dialogue'),
  'Visual Dialogue 원본 출처가 필요합니다.',
);
assert(
  scriptText.includes('kibkibe/roll20-api-scripts/tree/master/image_switcher'),
  'Image Switcher 원본 출처가 필요합니다.',
);
assert.strictEqual(
  (scriptText.match(/원본 라이선스: CC BY-NC/g) || []).length,
  3,
  '가공한 세 코드에 CC BY-NC 표기가 필요합니다.',
);
assert(
  scriptText.includes('lise1415622.tistory.com/52'),
  '컷인 아이디어 참고 출처가 필요합니다.',
);
assert(
  scriptText.includes('postype.com/@ttospt/post/21806654'),
  '범용 컷인 아이디어 참고 출처가 필요합니다.',
);

console.log('Scene Suite release check: PASS');
