const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
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
const sceneDirectorText = fs.readFileSync(
  path.join(scriptsRoot, '00_scene_director.js'),
  'utf8',
);
const visualDialogueText = fs.readFileSync(
  path.join(scriptsRoot, '03_visual_dialogue_compatible.js'),
  'utf8',
);
const handoutText = fs.readFileSync(
  path.join(scriptsRoot, '07_handout_director.js'),
  'utf8',
);
const avatarText = fs.readFileSync(
  path.join(scriptsRoot, '09_avatar_director.js'),
  'utf8',
);
const scriptText = scripts
  .map((name) => fs.readFileSync(path.join(scriptsRoot, name), 'utf8'))
  .join('\n');
const releaseText = `${publicText}\n${scriptText}`;
new Function(scriptText);

const vdRuntime = {
  state: { KIBSceneVD: { config: { font_family: 'Candal' } } },
  on() {},
  log() {},
  findObjs() {
    return [];
  },
  getObj() {
    return null;
  },
  createObj() {
    return null;
  },
  Campaign() {
    return { get() { return ''; } };
  },
  playerIsGM() {
    return true;
  },
  sendChat() {},
  toFront() {},
  toBack() {},
  setTimeout() {
    return 1;
  },
  clearTimeout() {},
  setInterval() {
    return 1;
  },
  clearInterval() {},
};
vm.createContext(vdRuntime);
vm.runInContext(visualDialogueText, vdRuntime);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('desc', 'split'),
  'vd_panel',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('emote', 'split'),
  'vd_panel',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('general', 'split'),
  'vd_dialogue_box',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('general', 'shared'),
  'vd_panel',
);
vdRuntime.vdInitState();
assert.strictEqual(vdRuntime.state.KIBSceneVD.config.font_family, 'Candal');
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'shared',
);
vdRuntime.state = { KIBSceneVD: { config: { font_family: 'Candal' } } };
vdRuntime.findObjs = (query) =>
  query && query._type === 'graphic' && query.name === 'vd_dialogue_box'
    ? [{}]
    : [];
vdRuntime.vdInitState();
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'split',
);
vdRuntime.findObjs = () => [];
vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode = 'shared';
vdRuntime.vdInitState();
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'shared',
);
vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode = 'invalid';
vdRuntime.vdInitState();
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'split',
);
vdRuntime.state = {};
vdRuntime.vdInitState();
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'split',
);
assert.strictEqual(
  fs.readFileSync(sourcesFile, 'utf8'),
  buildSourceCatalog(),
  '코드 원문 묶음을 다시 만들어야 합니다: node tools/build-sources.js',
);

function roll20Object(id, values) {
  return {
    id,
    get(key) {
      return values[key];
    },
    set(key, value) {
      if (typeof key === 'object') Object.assign(values, key);
      else values[key] = value;
    },
  };
}

const avatarDeck = roll20Object('avatar-deck', { name: 'avatars' });
const avatarCharacterValues = {
  name: '이경태',
  avatar: 'original.png',
  controlledby: '',
};
const avatarCharacter = roll20Object('character-1', avatarCharacterValues);
const avatarEvents = [];
let avatarCards = [];
let avatarWhispers = 0;
const avatarRuntime = {
  state: {},
  KIBScene: {
    adapters: {
      vd: {
        validateExpression(payload) {
          avatarEvents.push(['validate', payload]);
          return { ok: true };
        },
      },
    },
    broadcast(name, payload) {
      avatarEvents.push([name, payload]);
      return { ok: true };
    },
  },
  on() {},
  findObjs(query) {
    if (query._type === 'deck') return query.name === 'avatars' ? [avatarDeck] : [];
    if (query._type === 'character') return [avatarCharacter];
    if (query._type === 'card') return avatarCards;
    return [];
  },
  getObj(type, id) {
    if (type === 'character' && id === avatarCharacter.id) return avatarCharacter;
    return avatarCards.find((card) => type === 'card' && card.id === id) || null;
  },
  Campaign() {
    return { get() { return 'page-1'; } };
  },
  playerIsGM() {
    return true;
  },
  sendChat() {
    avatarWhispers += 1;
  },
  setTimeout() {
    return 1;
  },
  clearTimeout() {},
};
vm.createContext(avatarRuntime);
vm.runInContext(avatarText, avatarRuntime);

const avatarRequest = {
  characterId: avatarCharacter.id,
  expression: '난감',
  playerId: 'API',
};
let avatarResult = avatarRuntime.avValidateChange(avatarRequest);
assert.strictEqual(avatarResult.ok, true);
assert.strictEqual(avatarResult.targets.avatar, false);
assert.strictEqual(avatarResult.targets.token, false);
assert.strictEqual(avatarResult.targets.vd, true);
avatarResult = avatarRuntime.avApplyChange(avatarRequest);
assert.strictEqual(avatarResult.ok, true);
assert.strictEqual(avatarCharacterValues.avatar, 'original.png');
assert.strictEqual(
  avatarEvents.filter((event) => event[0] === 'expression:changed').length,
  1,
);
const whispersBeforeSync = avatarWhispers;
avatarResult = avatarRuntime.avSyncExternal({
  source: 'vd',
  characterId: avatarCharacter.id,
  expression: '난감',
});
assert.strictEqual(avatarResult.skipped, true);
assert.strictEqual(avatarWhispers, whispersBeforeSync);

avatarCards = [
  roll20Object('avatar-base', { name: '이경태', avatar: 'base.png' }),
];
avatarResult = avatarRuntime.avValidateChange(avatarRequest);
assert.strictEqual(avatarResult.ok, false);
assert(avatarResult.error.includes('이경태-난감'));

avatarCards.push(
  roll20Object('avatar-expression', {
    name: '이경태-난감',
    avatar: 'awkward.png',
  }),
);
avatarResult = avatarRuntime.avApplyChange(avatarRequest);
assert.strictEqual(avatarResult.ok, true);
assert.strictEqual(avatarCharacterValues.avatar, 'awkward.png');
assert.strictEqual(
  avatarRuntime.state.KIBSceneAvatar.selectedCards[avatarCharacter.id],
  'avatar-expression',
);

assert(
  !releaseText.includes('·'),
  '공개 문서, 페이지, 스크립트에 가운데 점을 쓰지 않습니다.',
);
assert(!releaseText.includes('—'), '사용자 안내에 긴 대시를 쓰지 않습니다.');
[
  '맵·덱 설정은 필요 없습니다.',
  '현재 설치된 기능을 한곳에서 설정합니다.',
  '현재 폴더:',
  '표정 카드가 바꿀 대상을 선택합니다.',
  '조용히 교체',
  '타자식',
].forEach((text) =>
  assert(!releaseText.includes(text), `배포 문구를 다시 정리해야 합니다: ${text}`),
);
assert(
  scriptText.includes('관리할 폴더') &&
    scriptText.includes('현재 설치된 기능 관리') &&
    scriptText.includes('컷인 스크립트'),
  '통일한 핸드아웃 용어가 필요합니다.',
);
[
  sceneDirectorText,
  visualDialogueText,
  handoutText,
  cutinText,
  avatarText,
].forEach((text) =>
  assert(
    text.includes('background:#111;color:#fff'),
    '자동 핸드아웃에는 검은 제목 영역과 흰 글자가 필요합니다.',
  ),
);
assert(
  sceneDirectorText.includes('<b>세팅법</b>') &&
    !sceneDirectorText.includes('처음 세팅'),
  '사용법 핸드아웃의 세팅 용어를 통일해야 합니다.',
);
assert(
  appText.includes("codeKey: 'dialogue_panel_mode'") &&
    sceneDirectorText.includes('!비주얼 설정|창구성|') &&
    visualDialogueText.includes("dialogue_panel_mode: 'split'"),
  '비주얼 노벨 창 구성 설정이 설치 페이지와 도움말에 필요합니다.',
);
assert(
  !handoutText.includes('편집할 수 있는 사람:'),
  '핸드아웃 관리에는 보기 권한만 표시합니다.',
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
  cutinText.includes('state.KIBSceneCutin.overlayImages[pageId] = imgsrc;') &&
    cutinText.includes('captureOverlayGuides();') &&
    /function saveOverlayGuide[\s\S]+?guide\.remove\(\);/.test(cutinText),
  'cutin_overlay 이미지를 저장한 뒤 안내 토큰을 제거해야 합니다.',
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
