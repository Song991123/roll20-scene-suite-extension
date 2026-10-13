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
const contractParserFile = path.join(root, 'tools', 'sheet-contract-parser.js');
const readText = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n');
const scripts = Array.from({ length: 11 }, (_, index) =>
  fs
    .readdirSync(scriptsRoot)
    .find((name) => name.startsWith(`${String(index).padStart(2, '0')}_`)),
);

assert(scripts.every(Boolean), '00부터 10까지 스크립트가 모두 있어야 합니다.');
scripts.forEach((name) =>
  execFileSync(process.execPath, ['--check', path.join(scriptsRoot, name)]),
);
execFileSync(process.execPath, ['--check', contractParserFile]);
execFileSync(
  process.execPath,
  [path.join(root, 'tools', 'check-github-release-preservation.js')],
  { stdio: 'inherit' },
);

const publicTextFiles = [
  path.join(root, 'README.md'),
  path.join(root, 'THIRD_PARTY_NOTICE.md'),
  path.join(publicRoot, 'index.html'),
  path.join(publicRoot, 'assets', 'app.js'),
  path.join(publicRoot, 'assets', 'styles.css'),
];
const publicText = publicTextFiles
  .map(readText)
  .join('\n');
const artifactRoot = path.join(root, 'artifacts');
const publicDocs = publicTextFiles.concat(
  fs
    .readdirSync(artifactRoot)
    .filter((name) => /\.(?:md|html)$/i.test(name))
    .map((name) => path.join(artifactRoot, name)),
);
publicDocs.forEach((file) =>
  assert(
    !/[A-Z]:\\/i.test(readText(file)),
    `공개 문서에 개인 컴퓨터 경로가 남았습니다: ${path.relative(root, file)}`,
  ),
);
const indexText = readText(path.join(publicRoot, 'index.html'));
const appText = readText(path.join(publicRoot, 'assets', 'app.js'));
const cutinText = readText(path.join(scriptsRoot, '08_cutin_director.js'));
const sceneDirectorText = readText(path.join(scriptsRoot, '00_scene_director.js'));
const narratorText = readText(path.join(scriptsRoot, '01_narrator_director.js'));
const audioText = readText(path.join(scriptsRoot, '02_audio_bridge.js'));
const visualDialogueText = readText(path.join(scriptsRoot, '03_visual_dialogue_compatible.js'));
const imageText = readText(path.join(scriptsRoot, '04_image_switcher_compatible.js'));
const apngText = readText(path.join(scriptsRoot, '06_apng_director.js'));
const handoutText = readText(path.join(scriptsRoot, '07_handout_director.js'));
const avatarText = readText(path.join(scriptsRoot, '09_avatar_director.js'));
const sheetHelperText = readText(path.join(scriptsRoot, '10_sheet_helper.js'));
const scriptText = scripts
  .map((name) => readText(path.join(scriptsRoot, name)))
  .join('\n');
const releaseText = `${publicText}\n${scriptText}`;
new Function(scriptText);
if (!process.argv.includes('--expression-hotfix') && !process.argv.includes('--fast')) {
  [
    'check-sheet-contract.js',
    'check-sheet-room-recognition.js',
    'check-sheet-helper.js',
    'check-sheet-cutin.js',
    'check-handout-cutin-optimization.js',
  ].forEach((name) =>
    execFileSync(process.execPath, [path.join(root, 'tools', name)], {
      stdio: 'inherit',
    }),
  );
}

const vdHandlers = {};
let vdScheduledTimeouts = 0;
const vdRuntime = {
  state: { KIBSceneVD: { config: { font_family: 'Candal' } } },
  on(event, handler) {
    (vdHandlers[event] ||= []).push(handler);
  },
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
    vdScheduledTimeouts += 1;
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
vdRuntime.state.vd_stock = [];
assert.strictEqual(
  vdRuntime.state.VD_INJECT('공백 화자', 'general', '인물A ', {}),
  true,
);
assert.strictEqual(
  vdRuntime.state.vd_stock[0].who,
  '인물A ',
  '나레이터가 넘긴 화자의 공백 차이를 비주얼 노벨이 제거하면 안 됩니다.',
);
assert.strictEqual(
  vdRuntime.vdContextSpeaker({ explicitAs: true, as: '인물A ' }),
  '인물A ',
);
vdRuntime.state.vd_stock = [];
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('desc', 'split'),
  'vd_panel',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('emote', 'split'),
  'vd_dialogue_box',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('general', 'split'),
  'vd_dialogue_box',
);
assert.strictEqual(
  vdRuntime.vdDecorationForMessage('general', 'shared'),
  'vd_panel',
);
let vdAsyncFieldUpdate = null;
vdRuntime.vdSetChanged(
  {
    get(key) {
      if (key === 'notes')
        throw new Error('Roll20 requires a callback for Handout notes.');
      return key === 'name' ? 'same' : '';
    },
    set(values) { vdAsyncFieldUpdate = values; },
  },
  { name: 'same', notes: '본문' },
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(vdAsyncFieldUpdate)),
  { notes: '본문' },
  '03은 callback 전용 Handout 필드를 직접 읽지 않고 기존처럼 갱신해야 합니다.',
);
assert.strictEqual(
  (visualDialogueText.match(/left: name_left/g) || []).length,
  2,
  '이름 글자는 생성할 때부터 최종 위치를 사용해야 합니다.',
);
assert.strictEqual(
  (visualDialogueText.match(/left: dialogue_left/g) || []).length,
  1,
  '일반 대사 글자는 vd_dialogue 위치에 따로 생성해야 합니다.',
);
assert.strictEqual(
  (visualDialogueText.match(/left: script_left/g) || []).length,
  1,
  '스크립트 글자는 vd_panel 위치에 따로 생성해야 합니다.',
);
assert(
  visualDialogueText.includes(
    'let text_dialogue = is_script_mode ? text_script : text_normal;',
  ),
  '일반 대사와 스크립트는 서로 다른 글자 객체를 사용해야 합니다.',
);
assert(
  visualDialogueText.includes(
    "let is_general = msg.type == 'general' || msg.type == 'emote';",
  ) && visualDialogueText.includes("let is_script_mode = msg.type == 'desc';"),
  '/emas는 이름과 행동문을 대사창에 함께 배치해야 합니다.',
);
assert(
  visualDialogueText.includes("stroke: vdTextStroke(is_script_mode ? 'script' : 'dialogue')"),
  '대사 출력 때 스크립트와 대사 외곽선을 구별해야 합니다.',
);
assert(
  sceneDirectorText.includes("['script', '스크립트']") &&
    appText.includes("codeKey: 'script_stroke_enabled'"),
  '관리 화면과 설치 페이지에도 영역별 외곽선 설정이 있어야 합니다.',
);
assert(
  visualDialogueText.includes(
    'clearTextWithout(text_name, text_dialogue, inactive_text);',
  ),
  '현재 글자 주변만 정리하고 비활성 글자 객체는 보존해야 합니다.',
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
vdRuntime.state = { KIBSceneVD: { config: { stroke_enabled: true, stroke_color: '#123456' } } };
vdRuntime.vdInitState();
for (const part of ['name', 'script', 'dialogue']) {
  assert.strictEqual(vdRuntime.state.KIBSceneVD.config[`${part}_stroke_enabled`], true);
  assert.strictEqual(vdRuntime.vdTextStroke(part), '#123456');
}
vdRuntime.state = {};
vdRuntime.vdInitState();
assert.strictEqual(
  vdRuntime.state.KIBSceneVD.config.dialogue_panel_mode,
  'split',
);
const vdTexts = {
  name: roll20Object('name-text', { _pageid: 'page-1' }),
  dialogue: roll20Object('dialogue-text', { _pageid: 'page-1' }),
  script: roll20Object('script-text', { _pageid: 'page-1' }),
};
const vdGuides = [
  roll20Object('name-guide', {
    name: 'vd_name',
    _pageid: 'page-1',
    gmnotes: 'name-text',
  }),
  roll20Object('dialogue-guide', {
    name: 'vd_dialogue',
    _pageid: 'page-1',
    gmnotes: 'dialogue-text',
  }),
];
vdRuntime.state.KIBSceneVD.scriptTexts['page-1'] = 'script-text';
vdRuntime.findObjs = (query) =>
  query && query._type === 'graphic' && query._pageid === 'page-1'
    ? vdGuides
    : [];
vdRuntime.getObj = (type, id) => (type === 'text' ? vdTexts[id.split('-')[0]] : null);
assert.deepStrictEqual(
  Array.from(vdRuntime.vdDialogueTexts('page-1'), (text) => text.id),
  ['name-text', 'dialogue-text', 'script-text'],
);
vdRuntime.state.KIBSceneVD.config.name_stroke_enabled = true;
vdRuntime.state.KIBSceneVD.config.name_stroke_color = '#112233';
vdRuntime.vdInitState();
vdRuntime.findObjs = (query) =>
  query && query.name === 'vd_name'
    ? [vdGuides[0]]
    : query && query.name === 'vd_dialogue'
      ? [vdGuides[1]]
      : [];
vdRuntime.vdApplyTextStyle();
assert.strictEqual(vdTexts.name.get('stroke'), '#112233');
assert.strictEqual(vdTexts.dialogue.get('stroke'), 'transparent');
assert.strictEqual(vdTexts.script.get('stroke'), 'transparent');
vdRuntime.vdTrimStandingCount = () => {};
vdRuntime.vdApplyStandingLayout = () => {};
vdRuntime.vdRefreshHandout = () => {};
vdRuntime.vdWhisperExclude = () => {};
vdRuntime.vdHandleConfigCommand('!비주얼 설정|스크립트외곽선|켜기');
vdRuntime.vdHandleConfigCommand('!비주얼 설정|스크립트외곽선색|#abcdef');
assert.strictEqual(vdRuntime.vdTextStroke('script'), '#abcdef');
assert.strictEqual(vdRuntime.vdTextStroke('dialogue'), 'transparent');
vdRuntime.vdHandleConfigCommand('!비주얼 설정|외곽선|켜기');
assert.strictEqual(vdRuntime.vdTextStroke('dialogue'), '#000000');
vdRuntime.vdHandleConfigCommand('!비주얼 설정|외곽선색|#445566');
for (const part of ['name', 'script', 'dialogue'])
  assert.strictEqual(vdRuntime.vdTextStroke(part), '#445566');
assert.strictEqual(vdRuntime.vdTextStroke(), '#445566');
assert.strictEqual(
  vdRuntime.vdResolveCueCommand(['장면없음'], {
    explicitAs: true,
    as: '인물A',
  }),
  '장면없음',
);
vdRuntime.findObjs = (query) =>
  query && (query.type === 'page' || query._type === 'page')
    ? [{ get(key) { return key === '_id' ? 'page-1' : 'conversation'; } }]
    : query && query._type === 'deck' && query.name === 'standings'
      ? [{ get(key) { return key === '_id' ? 'standings-deck' : 'standings'; } }]
      : query && query._type === 'character' && query.name === '인물B'
        ? [{ get() { return '인물B'; } }]
        : query &&
            query._type === 'card' &&
            query._deckid === 'standings-deck' &&
            query.name === '인물B'
          ? [{ get() { return '인물B'; } }]
          : [];
assert.strictEqual(vdRuntime.vdValidateCue(['퇴장:인물A'], {}).ok, true);
assert.strictEqual(vdRuntime.vdValidateCue(['장면없음'], {}).ok, true);
assert.strictEqual(
  vdRuntime.vdValidateCue(['인물B:'], {}).ok,
  true,
  '나레이터의 빈 표정명은 캐릭터 기본 표정 카드로 검증되어야 합니다.',
);
const tabletopCards = [
  roll20Object('card-front', {
    _subtype: 'card',
    layer: 'objects',
    name: '앞 카드',
  }),
  roll20Object('not-card', {
    _subtype: 'token',
    layer: 'objects',
    name: '일반 토큰',
  }),
  roll20Object('card-back', {
    _subtype: 'card',
    layer: 'objects',
    name: '뒤 카드',
  }),
];
vdRuntime.getObj = (type) =>
  type === 'page'
    ? roll20Object('page-1', { _zorder: 'card-back,not-card,card-front' })
    : null;
assert.deepStrictEqual(
  Array.from(vdRuntime.vdTabletopCards('page-1', tabletopCards), (card) => card.id),
  ['card-back', 'card-front'],
  '카드 토큰끼리의 기존 앞뒤 순서를 보존해야 합니다.',
);
const cardFrontCalls = [];
vdRuntime.findObjs = (query) =>
  query && query._type === 'graphic' && query._pageid === 'page-1'
    ? [tabletopCards[0]]
    : [];
vdRuntime.getObj = (type, id) => {
  if (type === 'page' && id === 'page-1')
    return roll20Object('page-1', { _zorder: 'card-front' });
  return type === 'graphic' && id === 'card-front' ? tabletopCards[0] : null;
};
vdRuntime.toFront = (obj) => cardFrontCalls.push(obj.id);
vdRuntime.setTimeout = (callback) => {
  callback();
  return 1;
};
vdHandlers['destroy:graphic'][0](
  roll20Object('removed-cutin', {
    _pageid: 'page-1',
    name: '',
  }),
);
assert.deepStrictEqual(
  cardFrontCalls,
  ['card-front'],
  '그래픽 삭제가 끝난 다음 카드 토큰을 다시 최상단으로 복구해야 합니다.',
);

const narratorRuntime = {
  state: {},
  on() {},
  sendChat() {},
  playerIsGM() {
    return true;
  },
  findObjs() {
    return [];
  },
  getObj() {
    return null;
  },
  Campaign() {
    return { get() { return ''; } };
  },
  setTimeout() {
    return 1;
  },
  clearTimeout() {},
};
vm.createContext(narratorRuntime);
vm.runInContext(narratorText, narratorRuntime);
narratorRuntime.KIBScene.handlers.avatar = function () {};
narratorRuntime.KIBScene.handlers.vd = function () {};
narratorRuntime.KIBScene.adapters.avatar = {};
narratorRuntime.KIBScene.adapters.vd = {};
[
  '퇴장:인물A',
  'exit:인물A',
  '숨김',
  '장면없음',
].forEach((command) => {
  const parsed = narratorRuntime.ntExtractCues(`대사 !@${command}`);
  assert.strictEqual(parsed.cues.length, 1);
  assert.strictEqual(parsed.cues[0].type, 'vd');
  assert.strictEqual(parsed.cues[0].args[0], command);
});
const expressionCue = narratorRuntime.ntExtractCues('대사 @난감').cues[0];
assert.strictEqual(expressionCue.type, 'vd');
assert.strictEqual(expressionCue.args[0], '난감');
const avatarOnlyCue = narratorRuntime.ntExtractCues('대사 @인물A:난감').cues[0];
narratorRuntime.KIBScene.validate = (cue) =>
  cue.type === 'vd'
    ? { ok: false, error: 'standings 카드 없음' }
    : { ok: true, targets: { avatar: true, token: false } };
assert.strictEqual(narratorRuntime.ntValidateCues([avatarOnlyCue], {}).ok, true);
assert.strictEqual(avatarOnlyCue.type, 'avatar');
const noAvatarTargetCue = narratorRuntime.ntExtractCues('대사 @인물A:난감').cues[0];
narratorRuntime.KIBScene.validate = (cue) =>
  cue.type === 'vd'
    ? { ok: false, error: 'standings 카드 없음' }
    : { ok: true, targets: { avatar: false, token: false } };
assert.strictEqual(narratorRuntime.ntValidateCues([noAvatarTargetCue], {}).ok, false);
delete narratorRuntime.KIBScene.validate;
assert.strictEqual(
  narratorRuntime.ntExtractCues('대사 @인물A:난감').cues[0].type,
  'vd',
  '03이 설치된 방의 표정 명령은 09 설정과 무관하게 03 경로를 사용해야 합니다.',
);
narratorRuntime.KIBScene.isFeatureEnabled = (name) => name !== 'vd';
assert.strictEqual(
  narratorRuntime.ntExtractCues('대사 @난감').cues[0].type,
  'avatar',
  '03이 꺼진 방에서는 09의 표정 명령을 유지해야 합니다.',
);
delete narratorRuntime.KIBScene.isFeatureEnabled;
const namedExpression = narratorRuntime.ntExtractCues(
  '/desc [ 인물A는 아쉬운 듯 돌아봅니다. @인물A:불안 ](#" style="font-size:13px;")',
);
assert.strictEqual(namedExpression.cues.length, 1);
assert.strictEqual(namedExpression.cues[0].type, 'vd');
assert.strictEqual(namedExpression.cues[0].args[0], '인물A:불안');
assert(!namedExpression.text.includes('@인물A:불안'));
assert(namedExpression.text.includes('](#" style="font-size:13px;")'));
const multipleExpressions = narratorRuntime.ntExtractCues(
  '/desc [ 인물A는 아쉬운 듯 몇 번이나 당신을 돌아보지만 @인물A:불안 @인물B: ](#" style="font-size:13px;")',
);
assert.deepStrictEqual(
  Array.from(multipleExpressions.cues, (cue) => cue.args[0]),
  ['인물A:불안', '인물B:'],
);
assert(!multipleExpressions.text.includes('@인물A:불안'));
assert(!multipleExpressions.text.includes('@인물B:'));
assert(multipleExpressions.text.includes('](#" style="font-size:13px;")'));
const mixedExpressions = narratorRuntime.ntExtractCues(
  '대사 @오디오 재생|BGM @APNG 재생|연출 @인물A:불안 @인물B:',
);
assert.deepStrictEqual(
  Array.from(mixedExpressions.cues, (cue) => cue.type),
  ['audio', 'apng', 'vd', 'vd'],
);
const expressionBeforeCue = narratorRuntime.ntExtractCues(
  '대사 @웃음 @오디오 재생|BGM 이름',
);
assert.deepStrictEqual(
  Array.from(expressionBeforeCue.cues, (cue) => cue.type),
  ['audio', 'vd'],
);
assert.strictEqual(expressionBeforeCue.text, '대사');
const expressionAndExit = narratorRuntime.ntExtractCues(
  '대사 @인물A:불안 @퇴장:전원',
);
assert.deepStrictEqual(
  Array.from(expressionAndExit.cues, (cue) => cue.type),
  ['vd', 'vd'],
);
const lineDelayCue = narratorRuntime.ntExtractCues(
  '전환 @APNG 블라인드페이드아웃|1회|영역|1.2초 @퇴장:전원 @다음줄 1.2초',
);
assert.strictEqual(lineDelayCue.lineDelay, 1200);
assert.strictEqual(lineDelayCue.lineDelayError, '');
assert(!lineDelayCue.text.includes('@다음줄'));
assert.deepStrictEqual(
  Array.from(lineDelayCue.cues, (cue) => ({
    type: cue.type,
    args: Array.from(cue.args),
  })),
  [
    {
      type: 'apng',
      args: ['블라인드페이드아웃', '1회', '영역', '1.2초'],
    },
    { type: 'vd', args: ['퇴장:전원'] },
  ],
);
assert(
  narratorRuntime.ntExtractCues('대사 @다음줄 1.2').lineDelayError,
  '@다음줄은 시간 단위를 요구해야 합니다.',
);
const decoratedLineDelay = narratorRuntime.ntExtractCues(
  '/desc [설명 @오디오 재생|BGM ](#" style="font-size:13px;") @다음줄 1.2초',
);
assert.strictEqual(decoratedLineDelay.lineDelay, 1200);
assert.strictEqual(
  decoratedLineDelay.text.trim(),
  '/desc [설명](#" style="font-size:13px;")',
);
assert.deepStrictEqual(
  Array.from(decoratedLineDelay.cues[0].args),
  ['재생', 'BGM'],
);
const innerDecoratedLineDelay = narratorRuntime.ntExtractCues(
  '/desc [설명 @다음줄 1.2초 ](#" style="font-size:13px;")',
);
assert.strictEqual(innerDecoratedLineDelay.lineDelay, 1200);
assert.strictEqual(
  innerDecoratedLineDelay.text.trim(),
  '/desc [설명 ](#" style="font-size:13px;")',
);

const narratorSent = [];
const battleDecoration = '/desc [ 전 투 시 작 ]\\(#" style="box-sizing: content-box;background-color: #000;color: #b22222;padding: 2px;box-shadow: #000000 -9px 0px 0px 7px, #000000 7px 0px 0px 7px;display: block;margin: auto;text-decoration: none;text-align: center;font-style: normal; font-size:18px;font-family:\'Diphylleia\')';
const hospitalDecoration = '/desc <div style="[보건소](#" style="font-weight: bold; font-family:\'Diphylleia\'; background-image:url(example.png);)<div style="[: 전원](#" style="font-size: 11px; color: #fff;)';
[battleDecoration, hospitalDecoration].forEach((markup) => {
  assert.strictEqual(narratorRuntime.ntExtractCues(markup).text, markup);
  const parsed = narratorRuntime.ntExtractCues(markup + ' @오디오 재생|BGM @인물A:불안');
  assert.strictEqual(parsed.text.trimEnd(), markup);
  assert.deepStrictEqual(Array.from(parsed.cues, cue => cue.type), ['audio', 'vd']);
  assert.deepStrictEqual(Array.from(parsed.cues[0].args), ['재생', 'BGM']);
});
const multiDecorated = narratorRuntime.ntExtractCues(
  '/desc [장면 @인물A:불안](#" style="color:red;) [대상 @비주얼 퇴장:전원](#" style="color:white;) @다음줄 1초',
);
assert.deepStrictEqual(Array.from(multiDecorated.cues, cue => cue.args[0]), ['인물A:불안', '퇴장:전원']);
assert(!multiDecorated.text.includes('@'));
assert.strictEqual(multiDecorated.lineDelay, 1000);
assert.strictEqual(narratorRuntime.ntExtractCues('[메일](#" style="content:\'@example\';)').cues.length, 0);
const narratorInjected = [];
const narratorExecuted = [];
const narratorBroadcasts = [];
narratorRuntime.sendChat = (as, content, callback, options) =>
  narratorSent.push({ as, content, options });
narratorRuntime.KIBScene.adapters.type = {};
narratorRuntime.KIBScene.get = (path, fallback) => fallback;
narratorRuntime.KIBScene.isFeatureEnabled = () => true;
narratorRuntime.KIBScene.validate = () => ({ ok: true });
narratorRuntime.KIBScene.execute = (cue) => {
  narratorExecuted.push(cue);
  return { ok: true };
};
narratorRuntime.KIBScene.call = (name, method, args) => {
  if (name === 'vd' && method === 'inject') {
    narratorInjected.push(args[0]);
    return true;
  }
};
narratorRuntime.KIBScene.broadcast = (name, payload) => {
  narratorBroadcasts.push({ name, payload });
  return { ok: true, values: [] };
};
narratorRuntime.KIBScene.handlers.audio = function () {};
[battleDecoration, hospitalDecoration].forEach((markup) => {
  narratorRuntime.state.narration = [{ as: 'GM', msg: markup + ' @오디오 재생|BGM @인물A:불안', explicitAs: false }];
  narratorRuntime.state.is_narrating = 2;
  narratorRuntime.narrate();
  assert.deepStrictEqual(Array.from(narratorExecuted, cue => cue.type), ['audio', 'vd']);
  assert.strictEqual(narratorSent[0].content, markup);
  assert.strictEqual(narratorRuntime.state.narration.length, 0);
  narratorSent.length = narratorExecuted.length = narratorInjected.length = narratorBroadcasts.length = 0;
});
narratorRuntime.state.narration = [
  { as: 'GM', msg: '/w gm 비밀 지문 @스크립트', explicitAs: false },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.state.nt_linebreaker = 'Uk3jmApq-*QzfkMA';
narratorRuntime.state.api_tag = '<a href="#vd-permitted-api-chat"></a>';
narratorRuntime.state.vd_explicit_as_tag = '<a href="#vd-explicit-as"></a>';
narratorRuntime.narrate();
assert.strictEqual(narratorSent.length, 1);
assert.strictEqual(narratorSent[0].content, '/w gm 비밀 지문');
assert.strictEqual(narratorInjected.length, 0);
assert.strictEqual(
  narratorExecuted.filter((cue) => cue.type === 'type').length,
  0,
);
assert.strictEqual(
  narratorBroadcasts.filter((event) =>
    /narrator:(?:prepare|line)/.test(event.name),
  ).length,
  0,
);
assert.strictEqual(narratorRuntime.state.narration.length, 0);
assert.strictEqual(narratorRuntime.state.is_narrating, 1);

narratorSent.length = 0;
narratorRuntime.state.narration = [
  {
    as: 'GM',
    msg:
      '/w gm 첫 번째' +
      narratorRuntime.state.nt_linebreaker +
      '/w GM 두 번째',
    explicitAs: false,
  },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.deepStrictEqual(
  Array.from(narratorSent, (entry) => entry.content),
  ['/w gm 첫 번째', '/w GM 두 번째'],
);

narratorSent.length = 0;
const narratorPlayers = [
  {
    id: 'gm-1',
    get(key) {
      if (key === '_displayname') return '테스터 GM';
      return key === '_online';
    },
  },
  {
    id: 'ho1-player',
    get(key) {
      if (key === '_displayname') return '수신자 계정';
      return key === '_online';
    },
  },
  {
    id: 'ho1-prefix-player',
    get(key) {
      if (key === '_displayname') return 'HO1 계정';
      return key === '_online';
    },
  },
  {
    id: 'ho3-online-player',
    get(key) {
      if (key === '_displayname') return '현재 접속자';
      return key === '_online';
    },
  },
  {
    id: 'ho3-offline-player',
    get(key) {
      if (key === '_displayname') return '퇴장한 플레이어';
      return false;
    },
  },
];
const narratorCharacters = [
  {
    id: 'ho1-character',
    get(key) {
      return key === 'name'
        ? 'HO1 조사자'
        : key === 'controlledby'
          ? 'gm-1,ho1-player'
          : '';
    },
  },
  {
    id: 'ho3-online-character',
    get(key) {
      return key === 'name'
        ? 'HO3 고봉밥'
        : key === 'controlledby'
          ? 'ho3-online-player'
          : '';
    },
  },
  {
    id: 'ho3-offline-character',
    get(key) {
      return key === 'name'
        ? 'HO3 춘삼'
        : key === 'controlledby'
          ? 'ho3-offline-player'
          : '';
    },
  },
  {
    id: 'ho4-offline-character',
    get(key) {
      return key === 'name'
        ? 'HO4 유령'
        : key === 'controlledby'
          ? 'ho3-offline-player'
          : '';
    },
  },
];
narratorRuntime.getObj = (type, id) =>
  type === 'player'
    ? narratorPlayers.find((player) => player.id === id) || null
    : null;
narratorRuntime.findObjs = (query) => {
  if (query._type === 'player') return narratorPlayers;
  if (query._type === 'character') return narratorCharacters;
  return [];
};
narratorRuntime.playerIsGM = (id) => id === 'gm-1';
assert.strictEqual(
  narratorRuntime.ntWhisperNameMatches('HO1 계정', {
    target: 'HO1',
    quoted: false,
  }),
  true,
);
assert.strictEqual(
  narratorRuntime.ntWhisperNameMatches('HO1 계정', {
    target: 'HO1',
    quoted: true,
  }),
  false,
);
assert.strictEqual(
  narratorRuntime.ntWhisperNameMatches('HO1   조사자', {
    target: 'HO1',
    quoted: false,
  }),
  true,
  '따옴표 없는 귓말은 캐릭터명의 첫 공백 앞부분을 인식해야 합니다.',
);
narratorRuntime.state.narration = [
  {
    as: 'character|gm-character',
    msg: '/w HO1 비밀 지문',
    explicitAs: false,
    originPlayerId: 'gm-1',
  },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.deepStrictEqual(
  Array.from(narratorSent, (entry) => ({
    as: entry.as,
    content: entry.content,
  })),
  [
    {
      as: 'character|gm-character',
      content: '/w "HO1 계정" 비밀 지문',
    },
    {
      as: 'character|gm-character',
      content: '/w "수신자 계정" 비밀 지문',
    },
    {
      as: '나레이터 서버',
      content: '/w "테스터 GM" → HO1 조사자 : 비밀 지문',
    },
  ],
);
assert(
  narratorSent.every((entry) => !entry.options || entry.options.noarchive !== true),
  '전달된 귓말과 서버 전달 기록은 채팅 로그에 남아야 합니다.',
);

narratorSent.length = 0;
narratorRuntime.state.narration = [
  {
    as: 'character|gm-character',
    msg: '/w HO3 현재 접속자만',
    explicitAs: false,
    originPlayerId: 'gm-1',
  },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.deepStrictEqual(
  Array.from(narratorSent, (entry) => entry.content),
  [
    '/w "현재 접속자" 현재 접속자만',
    '/w "테스터 GM" → HO3 고봉밥 : 현재 접속자만',
  ],
  '퇴장한 플레이어와 그 캐릭터는 수신자 및 전달 기록에서 제외해야 합니다.',
);

narratorSent.length = 0;
narratorRuntime.state.narration = [
  {
    as: 'character|gm-character',
    msg: '/w HO4 접속자 없음',
    explicitAs: false,
    originPlayerId: 'gm-1',
  },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.strictEqual(narratorSent.length, 1);
assert(narratorSent[0].content.includes('현재 접속 중인 수신자가 없습니다: HO4 유령'));
assert(!narratorSent[0].options || narratorSent[0].options.noarchive !== true);

narratorSent.length = 0;
narratorRuntime.state.narration = [
  {
    as: 'character|gm-character',
    msg:
      '/w 없는캐릭터 첫 번째' +
      narratorRuntime.state.nt_linebreaker +
      '/w HO1 두 번째',
    explicitAs: false,
    originPlayerId: 'gm-1',
  },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.strictEqual(narratorSent.length, 1);
assert.strictEqual(narratorSent[0].as, '나레이터');
assert(narratorSent[0].content.includes('없는 캐릭터명 또는 플레이어명입니다'));
assert(
  !narratorSent[0].options || narratorSent[0].options.noarchive !== true,
  '없는 귓말 대상 오류도 채팅 로그에 남아야 합니다.',
);
assert.strictEqual(
  narratorRuntime.state.narration.length,
  0,
  '없는 귓말 대상이 포함된 묶음은 전부 취소해야 합니다.',
);
const captureNarratorChat = narratorRuntime.sendChat;
narratorRuntime.sendChat = () => {
  throw new Error('sender copy failed');
};
assert.doesNotThrow(() =>
  narratorRuntime.ntMirrorWhisper(
    { as: 'character|gm-character', originPlayerId: 'gm-1' },
    '/w HO1 비밀 지문',
  ),
);
narratorRuntime.sendChat = captureNarratorChat;

narratorInjected.length = 0;
narratorRuntime.state.narration = [
  { as: '', msg: '/desc 공개 설명', explicitAs: false },
  { as: '어린아이', msg: '/em 공개 행동', explicitAs: true },
  { as: '어린아이', msg: '공개 대사', explicitAs: true },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
narratorRuntime.narrate();
narratorRuntime.narrate();
assert.deepStrictEqual(
  Array.from(narratorInjected, (entry) => ({
    text: entry.text,
    type: entry.type,
  })),
  [
    { text: '공개 설명', type: 'desc' },
    { text: '공개 행동', type: 'emote' },
    { text: '공개 대사', type: 'general' },
  ],
);

const narratorTimeouts = [];
narratorSent.length = 0;
narratorRuntime.setTimeout = (callback, delay) => {
  narratorTimeouts.push(delay);
  return narratorTimeouts.length;
};
narratorRuntime.KIBScene.get = (path, fallback) =>
  path === 'timing.lineInterval' ? 3800 : fallback;
narratorRuntime.state.narration = [
  { as: 'GM', msg: '첫 줄 @다음줄 1.2초', explicitAs: false },
  { as: 'GM', msg: '둘째 줄', explicitAs: false },
  { as: 'GM', msg: '셋째 줄', explicitAs: false },
];
narratorRuntime.state.is_narrating = 2;
narratorRuntime.narrate();
assert.strictEqual(narratorTimeouts.pop(), 1200);
assert(!narratorSent[0].content.includes('@다음줄'));
narratorRuntime.narrate();
assert.strictEqual(narratorTimeouts.pop(), 3800);

if (process.argv.includes('--narrator-delay')) {
  console.log('Narrator line delay: checked');
  process.exit(0);
}

assert.strictEqual(
  vdRuntime.vdShouldCollectMessage({
    type: 'whisper',
    content: '비밀 지문',
    playerid: 'player-1',
  }),
  false,
);
assert.strictEqual(
  vdRuntime.vdShouldCollectMessage({
    type: 'desc',
    content: '<span style="color:#555">수치 변화</span>',
    playerid: 'API',
    who: '시트 헬퍼',
  }),
  false,
  '시트 헬퍼가 남긴 desc 기록은 비주얼 스크립트창에 표시하면 안 됩니다.',
);
assert.strictEqual(
  vdRuntime.vdShouldCollectMessage({
    type: 'desc',
    content: vdRuntime.state.api_tag + '나레이터 지문',
    playerid: 'API',
    who: '',
  }),
  true,
  '나레이터가 승인 태그를 붙인 API desc는 기존처럼 비주얼 스크립트창에 표시해야 합니다.',
);
assert.strictEqual(
  vdRuntime.vdShouldCollectMessage({
    type: 'desc',
    content: '공개 지문',
    playerid: 'gm',
    who: '테스터 GM',
  }),
  true,
  '일반 GM desc 지문은 기존처럼 비주얼 스크립트창에 표시해야 합니다.',
);

assert(!audioText.includes('RESTART_DELAY_MS'));
assert(!/(?:처음부터|재시작|restart): 'restart'/.test(audioText));
[
  '!오디오 전체초기화',
  '!오디오 재생위치',
  '!오디오 재생 위치',
  '!오디오 재시작',
  '|처음부터',
].forEach((removedCommand) => {
  assert(
    !releaseText.includes(removedCommand),
    `제거한 오디오 초기화 항목이 남아 있습니다: ${removedCommand}`,
  );
});

assert.strictEqual(
  readText(sourcesFile),
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

const imageHandlers = {};
let imageAdapter;
const legacyImageTokenValues = {
  _type: 'graphic',
  name: 'img_HO1',
  imgsrc: 'https://files.d20.io/images/old/thumb.png?1',
};
const legacyImageDeckValues = {
  _type: 'deck',
  _id: 'legacy-image-deck',
  name: 'img_HO1',
};
const legacyImageCardValues = {
  _type: 'card',
  _deckid: 'legacy-image-deck',
  name: 'ON',
  avatar: 'https://files.d20.io/images/new/med.png?2',
};
const imageObjects = [
  roll20Object('legacy-image-token', legacyImageTokenValues),
  roll20Object('legacy-image-deck', legacyImageDeckValues),
  roll20Object('legacy-image-card', legacyImageCardValues),
];
const imageRuntime = {
  KIBScene: {
    handlers: {},
    adapters: {},
    register(name, adapter) {
      if (name === 'image') imageAdapter = adapter;
    },
  },
  on(event, handler) {
    (imageHandlers[event] ||= []).push(handler);
  },
  findObjs(query) {
    return imageObjects.filter((object) =>
      Object.keys(query || {}).every((key) => object.get(key) === query[key]),
    );
  },
  filterObjs(callback) {
    return imageObjects.filter(callback);
  },
  getObj(type, id) {
    return imageObjects.find(
      (object) => object.id === id && object.get('_type') === type,
    ) || null;
  },
  playerIsGM() {
    return true;
  },
  sendChat() {},
  createObj() {
    return null;
  },
  setTimeout(callback) {
    callback();
    return 1;
  },
};
vm.createContext(imageRuntime);
vm.runInContext(imageText, imageRuntime);
imageHandlers.ready.forEach((handler) => handler());
assert.strictEqual(imageRuntime.isDeckName('image_scene'), true);
assert.strictEqual(imageRuntime.isDeckName('img_HO1'), true);
assert.strictEqual(imageAdapter.validate(['img_HO1', 'ON']).ok, true);
imageHandlers['chat:message'][0]({
  type: 'api',
  playerid: 'GM',
  content: '!#img_HO1 ON',
});
assert.strictEqual(
  legacyImageTokenValues.imgsrc,
  'https://files.d20.io/images/new/thumb.png?2',
  '기존 img_ 매크로 명령도 이미지 토큰을 변경해야 합니다.',
);

const audioHandlers = {};
let audioAdapter;
let audioFolder = JSON.stringify([{ i: ['audio-visible'] }]);
const audioTrackValues = [
  { title: '바깥 비소리', volume: 30, loop: false },
  { title: '바깥 비소리', volume: 30, loop: false },
  { title: '바깥 비소리', volume: 30, loop: false },
];
const audioTracks = [
  roll20Object('audio-ghost', audioTrackValues[0]),
  roll20Object('audio-visible', audioTrackValues[1]),
  roll20Object('audio-real-duplicate', audioTrackValues[2]),
];
const audioRuntime = {
  state: {},
  KIBScene: {
    adapters: {},
    handlers: {},
    register(name, adapter) {
      if (name === 'audio') audioAdapter = adapter;
    },
  },
  on(event, handler) {
    audioHandlers[event] = handler;
  },
  findObjs(query) {
    return query && query._type === 'jukeboxtrack' ? audioTracks : [];
  },
  getObj(type, id) {
    return type === 'jukeboxtrack'
      ? audioTracks.find((track) => track.id === id) || null
      : null;
  },
  Campaign() {
    return { get: () => audioFolder };
  },
  playerIsGM() {
    return true;
  },
  sendChat() {},
  createObj() {
    return null;
  },
  setTimeout() {
    return 1;
  },
  clearTimeout() {},
  log() {},
};
vm.createContext(audioRuntime);
vm.runInContext(audioText, audioRuntime);
audioHandlers.ready();
assert.strictEqual(
  audioAdapter.validate(['재생', '바깥 비소리']).ok,
  true,
  '현재 주크박스 구조에 없는 숨은 음원은 제목 중복으로 세면 안 됩니다.',
);
assert.strictEqual(audioAdapter.cue(['재생', '바깥 비소리']).ok, true);
assert.strictEqual(audioTrackValues[1].playing, true);
assert.strictEqual(audioTrackValues[0].playing, undefined);
audioFolder = JSON.stringify([
  { i: ['audio-visible', 'audio-real-duplicate'] },
]);
const duplicateAudio = audioAdapter.validate(['재생', '바깥 비소리']);
assert.strictEqual(duplicateAudio.ok, false);
assert(
  duplicateAudio.error.includes('2개'),
  '화면에 실제로 같은 제목 음원이 둘이면 중복 오류를 유지해야 합니다.',
);

const avatarDeck = roll20Object('avatar-deck', { name: 'avatars' });
const avatarCharacterValues = {
  name: '인물A',
  avatar: 'original.png',
  controlledby: '',
};
const avatarCharacter = roll20Object('character-1', avatarCharacterValues);
let avatarCards = [];
let avatarWhispers = 0;
const avatarRuntime = {
  state: {},
  KIBScene: {
    adapters: {
      vd: {
        validateExpression() {
          throw new Error('09 must not call 03');
        },
      },
    },
  },
  on() {},
  findObjs(query) {
    if (query._type === 'deck') return query.name === 'avatars' ? [avatarDeck] : [];
    if (query._type === 'character')
      return !query.name || query.name === avatarCharacter.get('name')
        ? [avatarCharacter]
        : [];
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
assert.strictEqual(
  avatarRuntime.avContextCharacter({ explicitAs: true, as: '인물A ' }),
  null,
  '공백으로 구분한 화자를 09가 실제 캐릭터로 자동 인식하면 안 됩니다.',
);

let avatarAsyncFieldUpdate = null;
avatarRuntime.avSetChanged(
  {
    get(key) {
      if (key === 'notes')
        throw new Error('Roll20 requires a callback for Handout notes.');
      return key === 'name' ? 'same' : '';
    },
    set(values) { avatarAsyncFieldUpdate = values; },
  },
  { name: 'same', notes: '본문' },
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(avatarAsyncFieldUpdate)),
  { notes: '본문' },
  '09는 callback 전용 Handout 필드를 직접 읽지 않고 기존처럼 갱신해야 합니다.',
);

const avatarRequest = {
  characterId: avatarCharacter.id,
  expression: '난감',
  playerId: 'API',
};
let avatarResult = avatarRuntime.avValidateChange(avatarRequest);
assert.strictEqual(avatarResult.ok, true);
assert.strictEqual(avatarResult.targets.avatar, false);
assert.strictEqual(avatarResult.targets.token, false);
assert.strictEqual(avatarResult.targets.vd, undefined);
avatarResult = avatarRuntime.avApplyChange(avatarRequest);
assert.strictEqual(avatarResult.ok, true);
assert.strictEqual(avatarCharacterValues.avatar, 'original.png');
assert(
  !avatarRuntime
    .avTargetButtons('기본', { avatar: true, token: false })
    .includes('비주얼 노벨'),
  '09 관리에는 03 설정 버튼이 없어야 합니다.',
);
avatarRuntime.state.KIBSceneAvatar.characterTargets[avatarCharacter.id] = {
  avatar: false,
  token: false,
  vd: true,
};
assert.strictEqual(
  avatarRuntime.avTargets(avatarCharacter).vd,
  undefined,
  '예전 09 비주얼 대상 저장값도 03에 영향을 주면 안 됩니다.',
);
const whispersBeforeOldSetting = avatarWhispers;
avatarRuntime.avHandleTargetCommand({
  content: '!아바타 대상|기본|비주얼|켜기',
  playerid: 'gm',
});
assert.strictEqual(avatarWhispers, whispersBeforeOldSetting + 1);
assert.strictEqual(avatarRuntime.state.KIBSceneAvatar.defaults.vd, undefined);

const standingValues = {
  name: 'vd_standing',
  represents: avatarCharacter.id,
  _pageid: 'page-1',
  bar1_value: '인물A',
  width: 100,
  height: 100,
  imgsrc: 'before.png',
};
const standingToken = roll20Object('standing-1', standingValues);
const standingDeck = roll20Object('standing-deck', {
  _id: 'standing-deck',
  name: 'standings',
});
const standingCard = roll20Object('standing-card', {
  _id: 'standing-card',
  _deckid: 'standing-deck',
  name: '인물A-난감',
  avatar: 'https://files.d20.io/images/1/max.png',
});
const ratioCards = [
  roll20Object('ratio-base', { _deckid: standingDeck.id, name: '인물A', avatar: 'base.png' }),
  standingCard,
  roll20Object('ratio-smile', { _deckid: standingDeck.id, name: '인물A-기쁨', avatar: 'smile.png' }),
  roll20Object('ratio-other', { _deckid: standingDeck.id, name: '인물A-자매', avatar: 'other.png' }),
  roll20Object('ratio-other-smile', { _deckid: standingDeck.id, name: '인물A-자매-기쁨', avatar: 'other-smile.png' }),
];
const ratioCharacters = [
  roll20Object('ratio-char-a', { name: '인물A' }),
  roll20Object('ratio-char-other', { name: '인물A-자매' }),
];
vdRuntime.setTimeout = () => {
  vdScheduledTimeouts += 1;
  return 1;
};
const priorFindObjs = vdRuntime.findObjs;
const priorGetObj = vdRuntime.getObj;
vdRuntime.findObjs = (query) => {
  if (query._type === 'deck') return [standingDeck];
  if (query._type === 'character') return ratioCharacters;
  if (query._type === 'card')
    return ratioCards.filter((card) => !query.name || card.get('name') === query.name);
  return [];
};
vdRuntime.getObj = (type, id) =>
  type === 'card' ? ratioCards.find((card) => card.id === id) : null;
assert.strictEqual(
  vdRuntime.vdStandingCardsForCharacter('인물A ', ratioCards).length,
  0,
  '공백이 포함된 캐릭터 이름을 공백 없는 스탠딩 카드와 같게 취급하면 안 됩니다.',
);
assert.strictEqual(
  vdRuntime.vdCardBelongsToCharacter(ratioCards[0], '인물A '),
  false,
  '스탠딩 카드 소유 확인에서도 캐릭터 이름의 공백을 보존해야 합니다.',
);
vdRuntime.vdInitState();
vdRuntime.state.KIBSceneVD.standingRatios = {};
vdRuntime.vdStoreRatio(standingCard, 100, 200);
for (const card of ratioCards.slice(0, 3))
  assert.strictEqual(vdRuntime.vdStandingRatio(card, '인물A'), 0.5);
assert.strictEqual(vdRuntime.state.KIBSceneVD.standingRatios['ratio-other'], undefined);
assert.strictEqual(vdRuntime.state.KIBSceneVD.standingRatios['ratio-other-smile'], undefined);
const ratioRefreshBefore = vdScheduledTimeouts;
vdRuntime.vdHandleRatioCommand('!비주얼 비율|등록|ratio-smile|200|100', { selected: [] });
assert(
  vdScheduledTimeouts > ratioRefreshBefore,
  '비율 등록 뒤 캐릭터별 표정 핸드아웃 갱신을 예약해야 합니다.',
);
for (const card of ratioCards.slice(0, 3))
  assert.strictEqual(vdRuntime.vdStandingRatio(card, '인물A'), 2);
const baseSize = vdRuntime.vdStandingSize(ratioCards[0], '인물A');
const expressionSize = vdRuntime.vdStandingSize(standingCard, '인물A');
assert.strictEqual(baseSize.width, expressionSize.width);
assert.strictEqual(baseSize.height, expressionSize.height);
vdRuntime.vdHandleRatioCommand('!비주얼 비율|삭제|id:standing-card', { selected: [] });
for (const card of ratioCards.slice(0, 3))
  assert.strictEqual(vdRuntime.state.KIBSceneVD.standingRatios[card.id], undefined);
const selectedRatioImage = roll20Object('selected-ratio-image', {
  width: 300,
  height: 600,
  imgsrc: 'https://files.d20.io/images/1/thumb.png',
});
vdRuntime.getObj = (type, id) =>
  type === 'card'
    ? ratioCards.find((card) => card.id === id)
    : type === 'graphic' && id === selectedRatioImage.id
      ? selectedRatioImage
      : null;
assert.strictEqual(vdRuntime.vdRegisterSelectedRatios([{ _id: selectedRatioImage.id }]), 1);
for (const card of ratioCards.slice(0, 3))
  assert.strictEqual(vdRuntime.vdStandingRatio(card, '인물A'), 0.5);
vdRuntime.findObjs = priorFindObjs;
vdRuntime.getObj = priorGetObj;
vm.runInContext(
  "vd_setting.page_list = 'conversation'; vd_setting.use_emotion = true; vd_setting.standing_fit = 'stretch';",
  vdRuntime,
);
vdRuntime.Campaign = () => ({ get: () => 'page-1' });
vdRuntime.getObj = (type, id) =>
  type === 'page' && id === 'page-1'
    ? roll20Object('page-1', { name: 'conversation' })
    : null;
vdRuntime.findObjs = (query) => {
  if (query._type === 'character' && query.name === '인물A')
    return [avatarCharacter];
  if (query._type === 'deck' && query.name === 'standings')
    return [standingDeck];
  if (query._type === 'card' && (!query.name || query.name === '인물A-난감'))
    return [standingCard];
  if (query._type === 'graphic' && query.name === 'vd_standing')
    return [standingToken];
  return [];
};
vdRuntime.vdScheduleExpressionHandouts = () => {};
const sharedExpression = {
  type: 'api',
  content: '!@인물A:난감',
  who: 'GM',
  playerid: 'gm',
};
assert.strictEqual(avatarRuntime.avHandleApi(sharedExpression).ok, true);
vdHandlers['chat:message'][0](sharedExpression);
assert.strictEqual(
  standingValues.imgsrc,
  'https://files.d20.io/images/1/thumb.png',
  '09 대상이 모두 꺼져 있어도 03은 같은 !@ 명령으로 스탠딩을 바꿔야 합니다.',
);

avatarRuntime.state.KIBSceneAvatar.characterTargets[avatarCharacter.id].avatar = true;

avatarCards = [
  roll20Object('avatar-base', { name: '인물A', avatar: 'base.png' }),
];
avatarResult = avatarRuntime.avValidateChange(avatarRequest);
assert.strictEqual(avatarResult.ok, false);
assert(avatarResult.error.includes('인물A-난감'));

avatarCards.push(
  roll20Object('avatar-expression', {
    name: '인물A-난감',
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
const bothTargetsExpression = {
  type: 'api',
  content: '!@인물A:난감',
  who: 'GM',
  playerid: 'gm',
};
standingValues.imgsrc = 'before.png';
avatarCharacterValues.avatar = 'original.png';
vdHandlers['chat:message'][0](bothTargetsExpression);
avatarRuntime.avHandleApi(bothTargetsExpression);
assert.strictEqual(standingValues.imgsrc, 'https://files.d20.io/images/1/thumb.png');
assert.strictEqual(avatarCharacterValues.avatar, 'awkward.png');
for (const handlers of [
  [vdRuntime.vdHandleInlineExpression, avatarRuntime.avHandleInline],
  [avatarRuntime.avHandleInline, vdRuntime.vdHandleInlineExpression],
]) {
  const message = {
    type: 'general',
    content: '대사 @난감',
    who: '인물A',
    playerid: 'gm',
  };
  standingValues.imgsrc = 'before.png';
  avatarCharacterValues.avatar = 'original.png';
  handlers.forEach((handler) => handler(message));
  assert.strictEqual(message.content, '대사');
  assert.strictEqual(standingValues.imgsrc, 'https://files.d20.io/images/1/thumb.png');
  assert.strictEqual(avatarCharacterValues.avatar, 'awkward.png');
}
let hiddenChatCount = 0;
vdRuntime.sendChat = avatarRuntime.sendChat = () => { hiddenChatCount += 1; };
for (const handlers of [
  [vdRuntime.vdHandleHiddenExpressionChat, avatarRuntime.avHandleHiddenChat],
  [avatarRuntime.avHandleHiddenChat, vdRuntime.vdHandleHiddenExpressionChat],
]) {
  const message = {
    type: 'api',
    content: '!대사 대사 @난감',
    who: '인물A',
    playerid: 'gm',
  };
  hiddenChatCount = 0;
  handlers.forEach((handler) => handler(message));
  assert.strictEqual(hiddenChatCount, 1, '03/09의 !대사는 어느 쪽이 먼저 실행돼도 한 번만 표시해야 합니다.');
}
avatarResult = avatarRuntime.avValidateCue(
  ['인물A:난감'],
  { explicitAs: false, chatType: 'desc' },
);
assert.strictEqual(avatarResult.ok, true, '이름을 적은 표정 명령은 /as 없이 검증되어야 합니다.');
avatarResult = avatarRuntime.avRunCue(
  ['인물A:난감'],
  { explicitAs: false, chatType: 'desc' },
);
assert.strictEqual(avatarResult.ok, true);
avatarResult = avatarRuntime.avValidateCue(
  ['난감'],
  { explicitAs: true, as: 'character|' + avatarCharacter.id },
);
assert.strictEqual(avatarResult.ok, true, '기존 /as + @표정 형식을 유지해야 합니다.');
avatarResult = avatarRuntime.avValidateCue(
  ['없는 캐릭터:난감'],
  { explicitAs: false, chatType: 'desc' },
);
assert.strictEqual(avatarResult.ok, false);

if (process.argv.includes('--expression-hotfix')) {
  console.log('03/09 expression isolation: checked');
  process.exit(0);
}

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
[
  '!,,, 다음 줄',
  '!. 동시에 출력할 줄',
  '@다음줄 1.2초',
  '!@배경 장면명',
  '@인물A:불안 @인물B:',
  '!컷인 URL|Roll20이미지주소|3초',
  '@컷인 카드명|줄=3',
  '!!도움말',
  '!!검색 이름',
  '!!점검',
].forEach((command) =>
  assert(
    sceneDirectorText.includes(command),
    `00 통합 도움말에 확장 명령이 필요합니다: ${command}`,
  ),
);
assert(
  sceneDirectorText.includes("hasPlugin('apng') && hasPlugin('vd')") &&
    sceneDirectorText.includes("hasPlugin('vd') || hasPlugin('avatar')") &&
    /hasPlugin\('narrator'\)[\s\S]+?@인물A:불안/.test(sceneDirectorText) &&
    /hasPlugin\('narrator'\)[\s\S]+?@컷인 카드명\|줄=3/.test(sceneDirectorText),
  '결합 기능의 도움말은 필요한 모듈이 설치됐을 때만 보여야 합니다.',
);
assert(
  /hasPlugin\('audio'\)[\s\S]+?cueNames\.push\('<code>@오디오<\/code>'\)/.test(sceneDirectorText) &&
    /hasPlugin\('apng'\)[\s\S]+?cueNames\.push\('<code>@APNG<\/code>'\)/.test(sceneDirectorText) &&
    /ntHasPlugin\('audio'\)[\s\S]+?@오디오/.test(narratorText) &&
    /ntHasPlugin\('cutin'\)[\s\S]+?@컷인/.test(narratorText),
  '선택 연출 명령은 해당 모듈이 있을 때만 도움말에 보여야 합니다.',
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
const directorEvents = {};
const directorMessages = [];
const directorHandoutData = {};
const directorHandout = {
  id: 'help-handout',
  get(key, callback) {
    const value = directorHandoutData[key] || '';
    if (callback) callback(value);
    return value;
  },
  set(updates) {
    Object.assign(directorHandoutData, updates);
  },
};
const directorRuntime = {
  KIBScene: { adapters: { narrator: {} } },
  state: {},
  on(event, callback) { directorEvents[event] = callback; },
  playerIsGM() { return true; },
  sendChat(who, content, callback, options) {
    directorMessages.push({ who, content, options });
  },
  findObjs() { return []; },
  getObj() { return null; },
  createObj() { return directorHandout; },
  setTimeout() { return 1; },
  clearTimeout() {},
  log() {},
};
vm.createContext(directorRuntime);
vm.runInContext(sceneDirectorText, directorRuntime);
directorEvents['chat:message']({ type: 'api', content: '!도움', playerid: 'gm' });
assert(
  directorHandoutData.notes.includes('01 나레이터') &&
    directorMessages.some((message) =>
      message.content.includes('journal.roll20.net/handout/help-handout')),
  '!도움은 설치된 기능의 세팅법과 명령어 핸드아웃을 갱신하고 열어야 합니다.',
);
directorRuntime.KIBScene.adapters.vd = {};
directorEvents['chat:message']({ type: 'api', content: '!도움', playerid: 'gm' });
assert(
  directorHandoutData.notes.includes('03 비주얼 노벨') &&
    directorHandoutData.notes.includes('!. 같은 차례에 보여줄 문장') &&
    directorHandoutData.notes.includes('!... /as &quot;홍길동&quot; 대사 @다음줄 1.2초') &&
    directorHandoutData.notes.includes('!sd set|timing.lineInterval|3000'),
  '01과 03을 함께 설치하면 비주얼 노벨 도움말에도 동시 출력과 다음 줄 간격이 보여야 합니다.',
);
delete directorRuntime.KIBScene.adapters.vd;
assert(
  appText.includes('01 나레이터와 함께 설치하면 !. 문장') &&
    visualDialogueText.includes('01 나레이터와 함께 설치했을 때:'),
  '설치 페이지와 03 단독 도움말에서도 나레이터 전용 명령임을 구분해야 합니다.',
);
let directorFeatureChanged = null;
directorRuntime.KIBScene.adapters.avatar = {
  events: {
    'feature:changed'(payload) {
      directorFeatureChanged = payload;
      return { ok: true };
    },
  },
};
directorRuntime.KIBScene.routeCommand('feature|vd|off', { playerid: 'gm' });
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(directorFeatureChanged)),
  { name: 'vd', enabled: false },
  '00 전체 기능 변경을 09 관리 화면에 알려야 합니다.',
);
assert(
  sceneDirectorText.includes("var helpAlias = content === '!도움';") &&
    sceneDirectorText.includes("helpAlias ? 'handout'") &&
    sceneDirectorText.includes('세팅법과 명령어 열기'),
  '!도움은 세팅법과 명령어가 담긴 00 통합 도움말로 연결되어야 합니다.',
);
assert(
  appText.includes('채팅에 !도움을 입력합니다.'),
  '설치 페이지는 통합 도움말 명령을 !도움으로 안내해야 합니다.',
);
assert(
  appText.includes('토큰 이름은 업로드 파일명이 아니라 Roll20 보드에서 선택한 이미지 토큰의 이름입니다.') &&
    appText.includes('토큰 이름을 각각 vd_area') &&
    appText.includes('토큰 이름을 apng_area') &&
    appText.includes('토큰 이름을 cutin_area') &&
    appText.includes('토큰 이름을 cutin_overlay') &&
    sceneDirectorText.includes('<b>토큰 이름 안내</b>') &&
    sceneDirectorText.includes('업로드 파일명이 아니라 Roll20 보드에 놓은 이미지 토큰의 이름입니다.'),
  '설치 페이지와 통합 도움말에서 토큰 이름과 이미지 파일명을 구분해야 합니다.',
);
assert(
  visualDialogueText.includes('맵 레이어에 배경 이미지 토큰을 놓고 토큰 이름을 <code>vd_background</code>') &&
    scriptText.includes('토큰 이름은 업로드 파일명이 아닙니다.') &&
    cutinText.includes('토큰 이름을 <code>cutin_area</code>') &&
    cutinText.includes('업로드 파일명은 바꾸지 않아도 됩니다.'),
  '단독 도움말에서도 보드 이미지 토큰과 업로드 파일명을 구분해야 합니다.',
);
assert(
  appText.includes('방에 적용된 시트를 인식해 명령어로 실행, 자동 트래킹 기능'),
  '설치 페이지는 시트 헬퍼를 사용자 관점에서 설명해야 합니다.',
);
assert(
  !appText.includes('비슷한 시트가 여러 개로 표시되면') &&
    !appText.includes('현재 시트를 인식하지 못하면 별도 JS를 만들지 말고'),
  '시트 헬퍼 세팅법에 시트 선택이나 개발자용 지원 절차를 넣으면 안 됩니다.',
);
assert(
  appText.includes("label: '패널 이미지 주소'") &&
    appText.includes('Roll20 HTTPS 이미지 주소'),
  '패널 이미지 설정 설명이 필요합니다.',
);
assert(
  /(?:sheetRules|sheet:result|function playSheetResult)/.test(cutinText),
  '기능 브랜치의 08은 10 시트 헬퍼 결과를 연결해야 합니다.',
);
assert(
  appText.includes('10번과 함께 쓰면 지원되는 판정 결과 연결'),
  '컷인과 시트 헬퍼의 선택적 연결 안내가 필요합니다.',
);
assert(
  cutinText.includes('state.KIBSceneCutin.overlayImages[pageId] = imgsrc;') &&
    cutinText.includes('captureOverlayGuides();') &&
    /function saveOverlayGuide[\s\S]+?guide\.remove\(\);/.test(cutinText),
  'cutin_overlay 이미지를 저장한 뒤 안내 토큰을 제거해야 합니다.',
);
assert(
  visualDialogueText.includes(
    'vdBringTabletopCardsFront(pageId, pageGraphics);\n  vdKeepTransientFront(pageId);',
  ) &&
    visualDialogueText.includes(
      "if (vdIsTabletopCard(obj)) vdScheduleTabletopFront(pageId, 1000);",
    ),
  '카드 토큰은 비주얼 요소 위, 활성 연출 아래에 다시 배치해야 합니다.',
);
assert(
  cutinText.includes("on('add:graphic', keepActiveAboveNewObject);") &&
    cutinText.includes("on('add:text', keepActiveAboveNewObject);") &&
    /function scheduleFrontRetry[\s\S]+?1000\);/.test(cutinText),
  '활성 컷인은 새 카드와 새 화면 객체보다 위로 복구되어야 합니다.',
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
assert(!indexText.includes('assets/sheet-contract-parser.js'),
  '사용자 설치 페이지에서 시트별 보조 JS 생성기를 불러오면 안 됩니다.');
assert(
  appText.includes("id: '10'") &&
    appText.includes("file: '10_sheet_helper.js'") &&
    appText.includes("sheet: '10'"),
  '10 시트 헬퍼를 설치기에 노출하고 00 기능 설정과 연결해야 합니다.',
);
assert(
  !appText.includes('contractBuilder: true') &&
    !appText.includes('bindSheetContractBuilder();') &&
    !appText.includes('이 10번 코드 하나를 Roll20 Mod Scripts에 넣고 저장합니다.') &&
    appText.includes('채팅에 !!관리를 입력해 인식된 항목을 확인합니다.') &&
    appText.includes('!!굴릴항목이름으로 실행하고, !!검색 이름으로 현재 수치와 굴림 버튼을 찾습니다.'),
  '10번 설명은 설치 절차를 반복하지 않고 실제 사용 순서만 안내해야 합니다.',
);
assert(
  !/(?:define:|\/define:|on\.ready|\/on\.|✅|option:)/.test(scriptText),
  '예전 설명형 주석 표기를 남기지 않습니다.',
);
assert(
  !publicText.includes('x.com/EOOOOORK') &&
    !publicText.includes('distribution.php?dist=dist-scene-suite-340') &&
    !publicText.includes('>배포 글</a') &&
    !publicText.includes('>제작 기록</a') &&
    !publicText.includes('>원본 출처</a'),
  '공개 설치 페이지에 개인 배포·제작 기록 링크를 노출하지 않습니다.',
);
[
  [sceneDirectorText, "command === 'config' || command === '설정'"],
  [narratorText, '나레이터 설정'],
  [audioText, "action == '설정'"],
  [visualDialogueText, '비주얼 노벨 설정'],
  [imageText, 'help|도움말|설정|매크로갱신'],
  [apngText, "parts.length ? saveCardSetting(parts) : whisper(statusHtml())"],
  [handoutText, "action === '관리' || action === '갱신' || action === '설정'"],
  [cutinText, "if (action === '설정')"],
  [sheetHelperText, "else if (action === '설정') action = '관리'"],
].forEach(([text, marker]) =>
  assert(text.includes(marker), `모듈별 설정 진입점이 필요합니다: ${marker}`),
);
assert(
  /var action = normalizeAction\(parts\.shift\(\)\);/.test(audioText) &&
    audioText.includes('명령 맨 앞에 재생 또는 중지를 입력하세요.'),
  '오디오 동작은 명령 맨 앞에서만 읽고 정확한 오류를 보여야 합니다.',
);
assert(
  visualDialogueText.includes('<b>스탠딩 크기:</b>') &&
    visualDialogueText.includes('>크기 설정</a>') &&
    visualDialogueText.includes('&#63;{가로|') &&
    !visualDialogueText.includes('<br><a href="!비주얼 비율|등록|id:') &&
    !visualDialogueText.includes('전체 스탠딩 최대 크기:</b>'),
  '스탠딩 표정 핸드아웃에서 캐릭터 공통 크기/비율을 설정할 수 있어야 합니다.',
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
