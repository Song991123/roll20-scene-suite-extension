const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseSheetContract } = require('./sheet-contract-parser');

const distributedSource = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'),
  'utf8',
);
const recognitionStart = '/* KIB_SHEET_RECOGNITION_START */';
const recognitionEnd = '/* KIB_SHEET_RECOGNITION_END */';
const recognitionStartAt = distributedSource.indexOf(recognitionStart);
const recognitionEndAt = distributedSource.indexOf(recognitionEnd);
assert(recognitionStartAt >= 0 && recognitionEndAt > recognitionStartAt,
  '10번에 시트 인식 정보 구역이 없습니다.');

const recognitionBlock = distributedSource.slice(
  recognitionStartAt,
  recognitionEndAt + recognitionEnd.length,
);
const recognitionRuntime = { KIBSheetContracts: [] };
vm.createContext(recognitionRuntime);
vm.runInContext(recognitionBlock, recognitionRuntime);
const embeddedSheets = recognitionRuntime.KIBSheetContracts;
assert.strictEqual(embeddedSheets.length, 5,
  '배포용 10번에는 검증된 실제 시트 5종이 포함되어야 합니다.');
const embeddedModeArrays = new Set();
const repeatedModeArrays = new Map();
let embeddedRollsWithModes = 0;
let repeatedModeSets = 0;
embeddedSheets.forEach((sheet) => {
  assert(!Object.prototype.hasOwnProperty.call(sheet, 'modeSets'),
    '복원 뒤 시트에 임시 modeSets가 남았습니다: ' + sheet.name);
  (sheet.rolls || []).forEach((roll) => {
    assert(Array.isArray(roll.modes),
      '복원 뒤 roll.modes가 배열이 아닙니다: ' + sheet.name + ' / ' + roll.key);
    if (roll.modes.length) {
      embeddedRollsWithModes++;
      embeddedModeArrays.add(roll.modes);
      assert(!Object.isFrozen(roll.modes),
        '기존 확장 호환성을 위해 선택 방식 배열은 변경 가능해야 합니다: ' + sheet.name + ' / ' + roll.key);
      roll.modes.forEach((mode) => {
        assert(!Object.isFrozen(mode) && !Object.isFrozen(mode.overrides || {}),
          '기존 확장 호환성을 위해 선택 방식 내용은 변경 가능해야 합니다: ' + sheet.name + ' / ' + roll.key);
      });
      const signature = JSON.stringify(roll.modes);
      const previous = repeatedModeArrays.get(signature);
      if (previous) {
        repeatedModeSets++;
        assert.notStrictEqual(previous, roll.modes,
          '같은 선택 방식이라도 굴림마다 독립 배열이어야 합니다.');
        assert.notStrictEqual(previous[0], roll.modes[0],
          '같은 선택 방식이라도 굴림마다 독립 객체여야 합니다.');
      } else repeatedModeArrays.set(signature, roll.modes);
    }
    assert(!Object.prototype.hasOwnProperty.call(roll, 'm'),
      '복원 뒤 roll에 임시 mode 참조가 남았습니다: ' + sheet.name + ' / ' + roll.key);
  });
});
assert.strictEqual(embeddedModeArrays.size, embeddedRollsWithModes,
  '선택 방식 배열은 굴림마다 독립적이어야 합니다.');
assert(repeatedModeSets > 0, '동일한 선택 방식이 여러 굴림에 있는 검증 자료가 필요합니다.');
assert(Buffer.byteLength(distributedSource, 'utf8') <= 1600000,
  '10번 임베드 데이터가 다시 비대해졌습니다: ' + Buffer.byteLength(distributedSource, 'utf8') + ' bytes');

// 생성된 인식 정보 안에는 원본 변수명이 있을 수 있지만 런타임은 이를
// 별도 고정 목록이나 대체 공식으로 다시 만들면 안 됩니다.
const runtimeOnlySource =
  distributedSource.slice(0, recognitionStartAt) +
  distributedSource.slice(recognitionEndAt + recognitionEnd.length);
[
  'legacy_profile_fallback',
  'default_profile',
  'registerProfile',
  'rollMadness',
  'rollLuck',
  'rollHitLocation',
  'contractDiscriminatorFields',
  'sheetDefaultFieldExists',
  'rand_maddess',
  'pulp_bomtoggle',
  'spot_hidden',
].forEach((legacyName) => {
  assert(!runtimeOnlySource.includes(legacyName),
    '배포 런타임에 구형 고정 경로가 남았습니다: ' + legacyName);
});
assert(!/\b(?:san|luck)\b/.test(runtimeOnlySource),
  '배포 런타임에 특정 시트의 고정 수치 변수명이 남았습니다.');

const fixture = parseSheetContract([
  '<input name="attr_fixture_marker_a">',
  '<input name="attr_fixture_marker_b">',
  '<input name="attr_fixture_marker_c">',
  '<input name="attr_character_name">',
  '<input name="attr_skill_value" value="60">',
  '<div class="mode-control">',
  '  <select name="attr_bonus_mode">',
  '    <option value="0">기본</option>',
  '    <option value="10">보너스 개 1</option>',
  '    <option value="-10">패널티 개 1</option>',
  '  </select>',
  '  <button type="roll" name="roll_precision" value="&{template:fixture} {{subject=정밀 관찰}} {{success=[[@{skill_value}]]}} {{hard=[[floor(@{skill_value}/2)]]}} {{extreme=[[floor(@{skill_value}/5)]]}} {{roll=[[1d100+@{bonus_mode}]]}}"></button>',
  '</div>',
  '<input name="attr_free_expression" value="1d6">',
  '<button type="roll" name="roll_free" value="&{template:fixture} {{subject=자유 굴림}} {{formula=@{free_expression}}} {{roll=[[@{free_expression}]]}}"></button>',
  '<fieldset class="repeating_skill">',
  '  <input name="attr_item_name">',
  '  <input name="attr_item_value">',
  '  <button type="roll" name="roll_item" value="&{template:fixture} {{subject=@{item_name}}} {{success=[[@{item_value}]]}} {{hard=[[floor(@{item_value}/2)]]}} {{extreme=[[floor(@{item_value}/5)]]}} {{roll=[[1d100]]}}"></button>',
  '</fieldset>',
  '<button type="roll" name="roll_conflict_a" value="&{template:fixture} {{subject=겹친 굴림}} {{roll=[[1d6]]}}"></button>',
  '<button type="roll" name="roll_conflict_b" value="&{template:fixture} {{subject=겹친 굴림}} {{roll=[[1d8]]}}"></button>',
  '<button type="roll" name="roll_source_boundary" value="&{template:source-boundary} {{subject=원본 경계}} {{goal=[[60]]}} {{die=[[1d100]]}}"></button>',
  '<rolltemplate class="sheet-rolltemplate-source-boundary">',
  '  {{#rollTotal() die 1}}<span class="sheet-critical">Critical</span>{{/rollTotal() die 1}}',
  '  {{#rollGreater() die goal}}{{#rollGreater() goal 49}}{{#rollTotal() die 100}}<b data-i18n="fumble">Fumble</b>{{/rollTotal() die 100}}{{/rollGreater() goal 49}}{{/rollGreater() die goal}}',
  '  {{#rollGreater() die goal}}{{#^rollGreater() goal 49}}{{#rollGreater() die 95}}<b>Fumble</b>{{/rollGreater() die 95}}{{/^rollGreater() goal 49}}{{/rollGreater() die goal}}',
  '</rolltemplate>',
].join('\n'), {
  id: 'generic-fixture',
  name: '범용 시험 시트',
  sourceHash: 'generic-fixture-v1',
});

function roll20Object(id, values) {
  const data = { ...values };
  return {
    id,
    get(key) {
      return data[key];
    },
    set(key, value) {
      if (typeof key === 'object') Object.assign(data, key);
      else data[key] = value;
    },
    setWithWorker(value) {
      Object.assign(data, value);
    },
    remove() {},
  };
}

const characters = [];
const attributeObjects = [];
const created = [];
const sent = [];
const events = {};
const sheetFieldDefaults = {};
const getAttrByNameCalls = [];
const characterFindCalls = [];
const players = {
  gm: roll20Object('gm', { _displayname: '테스터 GM', speakingas: 'player|gm' }),
  'player-1': roll20Object('player-1', {
    _displayname: '테스터',
    speakingas: 'character|generic-character',
  }),
};

const runtime = {
  KIBSheetContracts: [],
  state: {
    KIBSheetHelper: {
      managerCharacterId: '',
      sheetSelections: { preserved: 'keep' },
      keepMe: '보존',
    },
  },
  KIBScene: {
    adapters: {},
    broadcast(name, payload) {
      sent.push({ event: name, payload });
    },
  },
  on(name, callback) {
    events[name] = callback;
  },
  getAttrByName(characterId, name, valueType) {
    getAttrByNameCalls.push({ characterId, name, valueType: valueType || 'current' });
    const object = attributeObjects.find((item) =>
      item.get('_characterid') === characterId && item.get('name') === name);
    if (object) return object.get(valueType === 'max' ? 'max' : 'current');
    const defaults = sheetFieldDefaults[characterId];
    if (defaults && Object.prototype.hasOwnProperty.call(defaults, name))
      return defaults[name];
    return undefined;
  },
  findObjs(query) {
    if (query._type === 'attribute' || query.type === 'attribute') {
      const characterId = query._characterid || query.characterid;
      return attributeObjects.filter((item) =>
        !characterId || item.get('_characterid') === characterId).slice().reverse();
    }
    if (query._type === 'character' || query.type === 'character') {
      characterFindCalls.push({ ...query });
      return characters.slice();
    }
    if (query._type === 'handout' || query.type === 'handout')
      return created.filter((item) =>
        item.get('_type') === 'handout' && (!query.name || item.get('name') === query.name));
    return [];
  },
  getObj(type, id) {
    if (type === 'character')
      return characters.find((item) => item.id === id) || null;
    if (type === 'player') return players[id] || null;
    if (type === 'handout')
      return created.find((item) =>
        item.id === id && item.get('_type') === 'handout') || null;
    return null;
  },
  createObj(type, values) {
    const normalized = { _type: type, ...values };
    if (type === 'attribute') {
      normalized._characterid = normalized._characterid || normalized.characterid;
      normalized.characterid = normalized.characterid || normalized._characterid;
    }
    const object = roll20Object(type + '-' + created.length, normalized);
    created.push(object);
    if (type === 'attribute') attributeObjects.push(object);
    return object;
  },
  sendChat(who, content, callback, options) {
    sent.push({ who, content, options });
    if (callback) callback([{ content }]);
  },
  playerIsGM(playerId) {
    return playerId === 'gm';
  },
  randomInteger(sides) {
    return Math.max(1, Math.min(3, sides));
  },
  setTimeout() {
    return 1;
  },
  clearTimeout() {},
  log() {},
  Date,
};

vm.createContext(runtime);
// 설정 문자열을 바꾸거나 구형 기능을 강제로 켜지 않고 배포 파일을 그대로 실행합니다.
vm.runInContext(distributedSource, runtime);
const helper = runtime.KIBSheetHelper;
assert(helper && typeof helper.registerContract === 'function',
  '배포용 10번을 그대로 실행하지 못했습니다.');
assert.strictEqual(helper.sheetContracts().length, 5,
  '배포 파일의 실제 시트 인식 정보가 런타임에 등록되지 않았습니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.keepMe, '보존');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections.preserved, 'keep',
  '업데이트할 때 기존 시트 선택 설정을 지우면 안 됩니다.');

function addCharacter(id, name, controlledby, values) {
  const character = roll20Object(id, { name, controlledby: controlledby || '' });
  characters.push(character);
  Object.entries(values || {}).forEach(([attribute, current], index) => {
    attributeObjects.push(roll20Object(id + '-attribute-' + index, {
      _characterid: id,
      characterid: id,
      name: attribute,
      current,
      max: '',
    }));
  });
  return character;
}

function addAttribute(characterId, name, current, id) {
  const attribute = roll20Object(
    id || characterId + '-attribute-' + attributeObjects.length,
    {
      _characterid: characterId,
      characterid: characterId,
      name,
      current,
      max: '',
    },
  );
  attributeObjects.push(attribute);
  if (events['add:attribute']) events['add:attribute'](attribute);
  return attribute;
}

function runApi(content, who, playerId) {
  const before = sent.length;
  events['chat:message']({
    type: 'api',
    content,
    playerid: playerId || 'player-1',
    who: who || '범용 탐사자',
  });
  return sent.slice(before);
}

helper.registerContract(fixture);
const fixtureValues = {};
fixture.signature.forEach((entry) => {
  fixtureValues[typeof entry === 'string' ? entry : entry.name] = '1';
});
Object.assign(fixtureValues, {
  character_name: '범용 탐사자',
  skill_value: '60',
  bonus_mode: '0',
  free_expression: '1d6',
  repeating_skill_rowOne_item_name: '사용자 항목',
  repeating_skill_rowOne_item_value: '55',
  repeating_skill_rowTwo_item_name: '두 번째 항목',
  repeating_skill_rowTwo_item_value: '44',
  repeating_skill_rowAlpha_item_name: '추가 항목',
  repeating_skill_rowAlpha_item_value: '33',
  _reporder_repeating_skill: 'rowTwo,rowOne,rowTwo,missing',
});
const fixtureCharacter = addCharacter(
  'generic-character',
  '범용 탐사자',
  'player-1',
  fixtureValues,
);

let inspection = helper.inspectContracts(fixtureCharacter.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || '범용 시트 정보를 인식하지 못했습니다.');
assert.strictEqual(inspection.contract.id, fixture.id);
let scan = helper.scan(fixtureCharacter.id, true);
assert.strictEqual(scan.matched, true);
assert.strictEqual(scan.profileName, fixture.name);
assert(!Object.prototype.hasOwnProperty.call(scan, 'resources'),
  '범용 스캔에 구형 고정 수치 목록을 만들면 안 됩니다.');

let rolls = helper.contractRolls(fixtureCharacter.id);
assert(rolls.some((item) => item.label === '정밀 관찰'));
assert(rolls.some((item) => item.label === '사용자 항목'),
  '사용자가 추가한 반복 항목을 원본 굴림으로 찾지 못했습니다.');
const repeatingRollKey = fixture.rolls.find((roll) => roll.repeating).key;
assert.strictEqual(JSON.stringify(rolls
  .filter((item) => item.roll.key === repeatingRollKey)
  .map((item) => ({
    key: item.key,
    label: item.label,
    rowId: item.row.id,
    value: item.row.values.item_value,
    ref: item.row.refs.item_value,
  }))), JSON.stringify([
  {
    key: repeatingRollKey + '@rowTwo', label: '두 번째 항목', rowId: 'rowTwo', value: '44',
    ref: 'repeating_skill_rowTwo_item_value',
  },
  {
    key: repeatingRollKey + '@rowOne', label: '사용자 항목', rowId: 'rowOne', value: '55',
    ref: 'repeating_skill_rowOne_item_value',
  },
  {
    key: repeatingRollKey + '@rowTwo', label: '두 번째 항목', rowId: 'rowTwo', value: '44',
    ref: 'repeating_skill_rowTwo_item_value',
  },
  {
    key: repeatingRollKey + '@rowAlpha', label: '추가 항목', rowId: 'rowAlpha', value: '33',
    ref: 'repeating_skill_rowAlpha_item_value',
  },
]), '반복행 정렬은 원본 _reporder의 순서·중복을 보존하고 유령 행만 제외해야 합니다.');
assert(!rolls.some((item) => /^(?:HP|MP|메모)$/i.test(item.label)),
  '굴림이 아닌 수치나 메모를 굴림 항목으로 만들면 안 됩니다.');

const speakingStatus = runApi('!!상태', '범용 탐사자', 'player-1');
const fallbackFindsBefore = characterFindCalls.length;
const fallbackStatus = runApi('!!상태', '테스터', 'player-1');
assert.deepStrictEqual(fallbackStatus, speakingStatus,
  '화자 이름 매칭과 권한 기반 매칭의 출력이 달라지면 안 됩니다.');
assert.strictEqual(characterFindCalls.length - fallbackFindsBefore, 1,
  '한 명령에서 캐릭터 전체 목록을 중복 조회하면 안 됩니다.');

const blockedAttributeStart = attributeObjects.length;
const blockedCharacter = addCharacter('blocked-character', '권한 없는 캐릭터', 'other-player', fixtureValues);
const blockedMessages = runApi(
  '!시트 굴림목록|blocked-character|' + encodeURIComponent('정밀 관찰') + '|0',
  '테스터',
  'player-1',
);
assert.strictEqual(blockedMessages.length, 1);
assert.strictEqual(blockedMessages[0].content,
  '/w "테스터" 이 캐릭터를 조작할 권한이 없습니다.',
  '명시적 캐릭터 선택의 권한 오류 문구가 바뀌면 안 됩니다.');
characters.splice(characters.indexOf(blockedCharacter), 1);
attributeObjects.splice(blockedAttributeStart);

const normal = helper.resolveContractAction(fixtureCharacter, '정밀 관찰', false);
assert(normal.handled && normal.result.ok);
assert(sent.at(-1).content.includes('{{subject=정밀 관찰}}'));
assert(sent.at(-1).content.includes('{{success=[[60]]}}'));
assert(sent.at(-1).content.includes('{{hard=[[floor(60/2)]]}}'));

const bonus = helper.resolveContractAction(fixtureCharacter, '정밀관찰 보너스1', false);
assert(bonus.handled && bonus.result.ok);
assert.strictEqual(bonus.result.payload.modeLabel, '보너스 개 1');
assert(sent.at(-1).content.includes('[[1d100+10]]'),
  '원본 선택지를 고정 공식으로 재조립하지 말고 원본 선택 값을 적용해야 합니다.');

const repeating = helper.resolveContractAction(fixtureCharacter, '사용자 항목', false);
assert(repeating.handled && repeating.result.ok);
assert(sent.at(-1).content.includes('{{subject=사용자 항목}}'));
assert(sent.at(-1).content.includes('{{success=[[55]]}}'));

const itemName = attributeObjects.find((item) =>
  item.get('_characterid') === fixtureCharacter.id &&
  item.get('name') === 'repeating_skill_rowOne_item_name');
const itemValue = attributeObjects.find((item) =>
  item.get('_characterid') === fixtureCharacter.id &&
  item.get('name') === 'repeating_skill_rowOne_item_value');
itemName.set('current', '새 항목');
events['change:attribute'](itemName, { current: '사용자 항목' });
itemValue.set('current', '63');
events['change:attribute'](itemValue, { current: '55' });
assert(helper.resolveContractAction(fixtureCharacter, '새 항목', false).result.ok);
assert(sent.at(-1).content.includes('{{success=[[63]]}}'),
  '사용자 반복 항목의 이름과 값 변경을 다시 읽어야 합니다.');

const freeRoll = runApi('!!r 2d6+3');
assert(freeRoll.some((item) =>
  item.content && item.content.includes('{{roll=[[2d6+3]]}}')),
  '안전한 !!r 식은 시트의 원본 자유 굴림 버튼으로 실행해야 합니다.');
['!!r 55', '!!r 1d6]]', '!!r 101d6', '!!r 1d100001'].forEach((command) => {
  const messages = runApi(command);
  assert(!messages.some((item) =>
    item.content && item.content.includes('kib_sheet_result=')),
    command + '를 실행하면 안 됩니다.');
});

const conflict = runApi('!!겹친 굴림').find((item) => item.who === '시트 헬퍼');
assert(conflict && conflict.content.includes('background:#111'));
assert(conflict.content.includes('겹친 굴림 (선택 1)') &&
  conflict.content.includes('겹친 굴림 (선택 2)'),
  '동일한 원본 굴림은 내부 ID 대신 사람이 구분할 수 있는 번호를 보여야 합니다.');

const status = runApi('!!상태').find((item) => item.who === '시트 헬퍼');
assert(status && status.content.includes('정밀 관찰') && status.content.includes('새 항목'));
assert(!/mode-?[a-f0-9]{8,}/i.test(status.content),
  'PL 화면에 내부 선택 ID를 노출하면 안 됩니다.');

const manager = helper.refresh();
assert(manager && manager.get('notes').includes('범용 시험 시트'));
assert(!manager.get('notes').includes('원본 시트 계약'));
const playerHelp = created.find((item) => item.get('name') === '[PL] 시트 헬퍼 사용법');
assert(playerHelp && playerHelp.get('notes').includes('!!굴릴항목이름'));
assert(playerHelp.get('notes').includes('<table'));

// 원본 굴림 -> Roll20 결과 메시지 -> 성공 수준 -> 컷인 키 전달을 한 흐름으로 검증합니다.
const rollBefore = sent.length;
const pending = helper.resolveContractAction(fixtureCharacter, '정밀 관찰', false);
assert(pending.result.ok);
const pendingMessage = sent.slice(rollBefore).find((item) =>
  item.content && item.content.includes('kib_sheet_result='));
assert(pendingMessage, '원본 굴림에 결과 추적 토큰이 없습니다.');
const token = pendingMessage.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)/)[1];
const resultBefore = sent.length;
events['chat:message']({
  type: 'general',
  content: '&{template:fixture} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
    '{{extreme=$[[2]]}} {{roll=$[[3]]}} {{kib_sheet_result=' + token + '}}',
  inlinerolls: [
    { results: { total: 60 } },
    { results: { total: 30 } },
    { results: { total: 12 } },
    { results: { total: 20 } },
  ],
  who: '범용 탐사자',
  playerid: 'player-1',
});
const resultEvent = sent.slice(resultBefore).find((item) => item.event === 'sheet:result');
assert(resultEvent, '원본 굴림 결과가 sheet:result로 전달되지 않았습니다.');
assert.strictEqual(resultEvent.payload.outcome, 'hard');
assert.strictEqual(resultEvent.payload.outcomeLabel, '어려운 성공');
assert(resultEvent.payload.cutinKey && resultEvent.payload.cutinKey.startsWith('sheet:'),
  '성공 수준 결과에 안정적인 컷인 연결 키가 없습니다.');
assert(helper.cutinItems().some((item) =>
  item.key === resultEvent.payload.cutinKey && item.label === '정밀 관찰'),
  '실행 결과의 컷인 키와 관리 화면의 컷인 항목이 같아야 합니다.');

function captureSourceBoundary(total, target) {
  const beforeRoll = sent.length;
  const started = helper.resolveContractAction(fixtureCharacter, '원본 경계', false);
  assert(started.handled && started.result.ok);
  const message = sent.slice(beforeRoll).find((item) =>
    item.content && item.content.includes('kib_sheet_result='));
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)/)[1];
  const beforeResult = sent.length;
  events['chat:message']({
    type: 'general',
    content: '&{template:source-boundary} {{goal=$[[0]]}} {{die=$[[1]]}} ' +
      '{{kib_sheet_result=' + sourceToken + '}}',
    inlinerolls: [
      { results: { total: target } },
      { results: { total } },
    ],
    who: '범용 탐사자',
    playerid: 'player-1',
  });
  return sent.slice(beforeResult).find((item) => item.event === 'sheet:result');
}

assert.strictEqual(captureSourceBoundary(1, 60).payload.outcome, 'critical',
  '원본 rolltemplate의 다른 필드 이름으로 정의된 대성공을 인식하지 못했습니다.');
assert.strictEqual(captureSourceBoundary(100, 60).payload.outcome, 'fumble',
  '원본 rolltemplate의 data-i18n 대실패 조건을 인식하지 못했습니다.');
assert.strictEqual(captureSourceBoundary(96, 40).payload.outcome, 'fumble',
  '원본 rolltemplate의 역조건과 표시 텍스트 대실패를 인식하지 못했습니다.');

[itemName, itemValue].forEach((attribute) => {
  attributeObjects.splice(attributeObjects.indexOf(attribute), 1);
  events['destroy:attribute'](attribute);
});
assert(!helper.contractRolls(fixtureCharacter.id).some((item) => item.label === '새 항목'),
  '삭제한 사용자 반복 항목이 굴림 목록에 남으면 안 됩니다.');

// 저장 구조가 같은 시트는 GM 선택을 받고, 시트가 바뀌면 예전 선택을 강제하지 않습니다.
const twinA = parseSheetContract([
  '<input name="attr_twin_a"><input name="attr_twin_b"><input name="attr_twin_c">',
  '<button type="roll" value="&{template:test} {{subject=쌍둥이 A}} {{roll=[[1d6]]}}"></button>',
].join('\n'), { id: 'twin-a', name: '쌍둥이 시트 A' });
const twinB = parseSheetContract([
  '<input name="attr_twin_a"><input name="attr_twin_b"><input name="attr_twin_c">',
  '<button type="roll" value="&{template:test} {{subject=쌍둥이 B}} {{roll=[[1d8]]}}"></button>',
].join('\n'), { id: 'twin-b', name: '쌍둥이 시트 B' });
helper.registerContract(twinA);
helper.registerContract(twinB);
const twinCharacter = addCharacter('twin-character', '쌍둥이 캐릭터', '', {
  twin_a: '1', twin_b: '1', twin_c: '1',
});
inspection = helper.inspectContracts(twinCharacter.id);
assert.strictEqual(inspection.status, 'ambiguous');
runtime.state.KIBSheetHelper.managerCharacterId = twinCharacter.id;
const twinManager = helper.refresh().get('notes');
assert(twinManager.includes('쌍둥이 시트 A') && twinManager.includes('쌍둥이 시트 B'));
runApi('!시트 인식선택|' + twinCharacter.id + '|' + twinA.id,
  '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections[twinCharacter.id], twinA.id);
assert.strictEqual(helper.inspectContracts(twinCharacter.id).contract.id, twinA.id);

// 배포본에 함께 넣은 실제 시트 5종의 추출 결과와 런타임 실행을 회귀 검증합니다.
const expectedEmbeddedStats = [
  ['천량성 커스텀 CoC', 329, 90, 424],
  ['자체제작 호질', 338, 81, 405],
  ['Bloody Mary Castle', 422, 253, 2928],
  ['Roll20 공개 CoC 7판', 1611, 879, 744],
  ['마렌 헤윰 커스텀 CoC', 187, 72, 374],
];
assert.deepStrictEqual(Array.from(embeddedSheets, (sheet) => [
  sheet.name,
  sheet.attributes.length,
  sheet.rolls.length,
  sheet.rolls.reduce((total, roll) => total + (roll.modes || []).length, 0),
]), expectedEmbeddedStats,
  '실제 시트 5종의 추출 결과가 바뀌었습니다. 원본 변경인지 파서 회귀인지 확인하세요.');

const actualSheet = embeddedSheets.find((sheet) => sheet.name === '천량성 커스텀 CoC');
const hojilSheet = embeddedSheets.find((sheet) => sheet.name === '자체제작 호질');
const bloodySheet = embeddedSheets.find((sheet) => sheet.name === 'Bloody Mary Castle');
const publicSheet = embeddedSheets.find((sheet) => sheet.name === 'Roll20 공개 CoC 7판');
const marenHyeyoomSheet = embeddedSheets.find((sheet) => sheet.name === '마렌 헤윰 커스텀 CoC');
assert(actualSheet && hojilSheet && bloodySheet && publicSheet && marenHyeyoomSheet);
embeddedSheets.forEach((sheet) => helper.registerContract(sheet));

// Roll20은 시트 기본 필드를 Attribute 객체로 만들지 않을 수 있습니다.
// 존재하지 않는 다른 시트 필드를 getAttrByName으로 조회하면 Roll20 콘솔에 오류가
// 남으므로, 저장 증거가 부족하면 필드를 추측하지 않고 GM 선택을 받아야 합니다.
const sparseDefaults = {};
(actualSheet.globalAttributes || []).forEach((name) => {
  sparseDefaults[name] = '';
});
Object.entries(actualSheet.controls || {}).forEach(([name, control]) => {
  if (control && Object.prototype.hasOwnProperty.call(control, 'default'))
    sparseDefaults[name] = control.default === null ? '' : String(control.default);
});
const sparseCharacter = addCharacter('sparse-sheet-character', '테스트 조사원', 'player-1', {
  ori_other_skills: '0',
  language_own: '50',
});
sheetFieldDefaults[sparseCharacter.id] = sparseDefaults;
const sparseCallsBefore = getAttrByNameCalls.length;
const sparseInspection = helper.inspectContracts(sparseCharacter.id);
const sparseCalls = getAttrByNameCalls.slice(sparseCallsBefore).filter((call) =>
  call.characterId === sparseCharacter.id);
assert.strictEqual(sparseInspection.status, 'ambiguous',
  '저장 Attribute가 적으면 다른 시트 필드를 조회해 자동 확정하면 안 됩니다.');
assert.strictEqual(sparseInspection.manualFallback, true);
assert(sparseInspection.matches.some((match) => match.id === actualSheet.id) &&
  sparseInspection.matches.some((match) => match.id === publicSheet.id),
  '증거가 부족하면 등록된 시트를 GM 선택지로 제공해야 합니다.');
assert.strictEqual(attributeObjects.filter((item) =>
  item.get('_characterid') === sparseCharacter.id).length, 2,
  '시트 인식을 위해 Attribute 객체를 새로 만들면 안 됩니다.');
assert.strictEqual(sparseCalls.length, 0,
  '시트 인식 단계에서 getAttrByName으로 다른 시트 필드를 probe하면 안 됩니다.');

const fallbackCallsBefore = getAttrByNameCalls.length;
runtime.state.KIBSheetHelper.activeCharacterId = sparseCharacter.id;
const sparseInspectionMessages = runApi('!!점검', '테스터 GM (GM)', 'gm');
const fallbackCalls = getAttrByNameCalls.slice(fallbackCallsBefore).filter((call) =>
  call.characterId === sparseCharacter.id);
assert(sparseInspectionMessages.some((item) =>
  item.content && item.content.includes('시트 선택') &&
  item.content.includes('background:#111') &&
  item.content.includes(actualSheet.name) &&
  item.content.includes('!시트 인식선택|')),
  '실제 희소 캐릭터의 첫 !!점검은 오류 대신 GM 검정 선택 버튼을 보여줘야 합니다.');
assert.strictEqual(fallbackCalls.length, 0,
  'GM 선택 화면을 만들 때도 다른 시트 필드를 probe하면 안 됩니다.');

runApi('!시트 인식선택|' + sparseCharacter.id + '|' + actualSheet.id,
  '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections[sparseCharacter.id], actualSheet.id,
  'GM이 고른 시트는 state에 저장되어야 합니다.');
const selectedCallsBefore = getAttrByNameCalls.length;
const selectedInspectionMessages = runApi('!!점검', '테스터 GM (GM)', 'gm');
const selectedCalls = getAttrByNameCalls.slice(selectedCallsBefore).filter((call) =>
  call.characterId === sparseCharacter.id);
assert(selectedInspectionMessages.some((item) =>
  item.content && item.content.includes(actualSheet.name) &&
  !item.content.includes('시트 선택')),
  'GM 선택 뒤 !!점검은 저장한 시트의 인식 결과를 보여줘야 합니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections[sparseCharacter.id], actualSheet.id,
  '!!점검은 캐시만 비우고 GM의 저장 선택을 지우면 안 됩니다.');
const selectedFieldNames = new Set(actualSheet.globalAttributes || []);
assert(selectedCalls.length > 0,
  'GM 선택 뒤에는 선택한 시트의 실제 굴림값을 읽어야 합니다.');
assert(selectedCalls.every((call) => selectedFieldNames.has(call.name)),
  'GM 선택 뒤에는 선택한 시트에 없는 필드를 조회하면 안 됩니다: ' +
    selectedCalls.filter((call) => !selectedFieldNames.has(call.name)).map((call) => call.name).join(', '));
runtime.state.KIBSheetHelper.activeCharacterId = '';

function sourceRefName(ref) {
  return typeof ref === 'string'
    ? ref
    : String(ref && (ref.name || ref.attr || ref.key) || '');
}

function satisfySimpleVisibility(condition, values) {
  if (!condition || typeof condition !== 'object') return;
  if (Array.isArray(condition.all)) {
    condition.all.forEach((entry) => satisfySimpleVisibility(entry, values));
    return;
  }
  if (Array.isArray(condition.any)) {
    if (condition.any.length) satisfySimpleVisibility(condition.any[0], values);
    return;
  }
  if (condition.not) {
    const negated = condition.not;
    if (negated && negated.name && negated.op === 'eq')
      values[negated.name] = String(negated.value) === '' ? '__off__' : '';
    return;
  }
  if (condition.name && condition.op === 'eq')
    values[condition.name] = String(condition.value);
}

function addSourceCharacter(sheet, id, name) {
  const values = {};
  (sheet.globalAttributes || []).forEach((attribute) => {
    values[attribute] = '';
  });
  Object.entries(sheet.controls || {}).forEach(([attribute, control]) => {
    values[attribute] = control && control.default !== undefined && control.default !== null
      ? String(control.default)
      : '';
  });
  Object.entries(sheet.sections || {}).forEach(([section, fields]) => {
    const field = Array.isArray(fields) && fields[0];
    if (!field) return;
    values[section + '_sourceRow_' + field] = '';
    values['_reporder_' + section] = 'sourceRow';
  });
  sheet.rolls.forEach((roll) => {
    (roll.expressionRefs || []).forEach((ref) => {
      const attribute = sourceRefName(ref);
      if (attribute) values[attribute] = '1d100';
    });
    if ((roll.expressionRefs || []).length)
      satisfySimpleVisibility(roll.visibility, values);
  });
  return {
    character: addCharacter(id, name, 'player-1', values),
    values,
  };
}

// 실제 천량성 시트의 사용자 추가 기능은 생성·변경을 모두 따라가야 합니다.
const actualValues = {};
actualSheet.signature.forEach((entry) => {
  actualValues[typeof entry === 'string' ? entry : entry.name] = '50';
});
Object.assign(actualValues, {
  character_name: '실제 시트 시험',
  dice_type: '{{roll=[[1d100]]}}',
  template_common: '{{character_name=@{character_name}}}',
});
const actualCharacter = addCharacter(
  'actual-character',
  '실제 시트 시험',
  'player-1',
  actualValues,
);
if (helper.inspectContracts(actualCharacter.id).status === 'ambiguous') {
  runApi('!시트 인식선택|' + actualCharacter.id + '|' + actualSheet.id,
    '테스터 GM (GM)', 'gm');
}
assert.strictEqual(helper.inspectContracts(actualCharacter.id).status, 'matched');
const actualRow = [
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_title', '테스트'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_base', '1'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_mod', '49'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science', '50'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_checkbox', '1'),
  addAttribute(actualCharacter.id, '_reporder_repeating_science', 'rowTest'),
];
const actualName = actualRow[0];
const actualValue = actualRow[3];
assert(helper.contractRolls(actualCharacter.id).some((item) => item.label === '테스트'));
assert(helper.resolveContractAction(actualCharacter, '테스트', false).result.ok);
assert(sent.at(-1).content.includes('{{success=[[50]]}}'));
actualName.set('current', '항해술');
events['change:attribute'](actualName, { current: '테스트' });
actualValue.set('current', '63');
events['change:attribute'](actualValue, { current: '50' });
assert(helper.resolveContractAction(actualCharacter, '항해술', false).result.ok);
assert(sent.at(-1).content.includes('{{success=[[63]]}}'));

const actualCheckRoll = actualSheet.rolls.find((roll) =>
  /\{\{\s*subject\s*=\s*감정\s*\}\}/.test(roll.raw));
assert(actualCheckRoll && actualSheet.resultTemplates && actualSheet.resultTemplates.coc,
  '1순위 실제 시트에서 원본 결과 규칙을 찾지 못했습니다.');
const actualNormalMode = actualCheckRoll.modes.find((mode) =>
  /(?:기본|일반)/.test((mode.labelPath || []).join(' ')));
const actualBonusMode = actualCheckRoll.modes.find((mode) =>
  /보너스.*1/.test((mode.labelPath || []).join(' ')));
const actualPenaltyMode = actualCheckRoll.modes.find((mode) =>
  /패널티.*1/.test((mode.labelPath || []).join(' ')));
assert(actualNormalMode && actualBonusMode && actualPenaltyMode);

function captureActualSheetResult(mode, fields) {
  const beforeRoll = sent.length;
  const started = helper.executeContract(
    actualCharacter.id,
    actualSheet.id,
    actualCheckRoll.key,
    '',
    mode.id,
    false,
    '',
  );
  assert(started.ok);
  const message = sent.slice(beforeRoll).find((item) =>
    item.content && item.content.includes('kib_sheet_result='));
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)/)[1];
  const entries = Object.entries(fields);
  const beforeResult = sent.length;
  events['chat:message']({
    type: 'general',
    content: '&{template:coc} ' + entries.map(([field], index) =>
      '{{' + field + '=$[[' + index + ']]}}').join(' ') +
      ' {{kib_sheet_result=' + sourceToken + '}}',
    inlinerolls: entries.map(([, total]) => ({ results: { total } })),
    who: actualCharacter.get('name'),
    playerid: 'player-1',
  });
  return sent.slice(beforeResult).find((item) => item.event === 'sheet:result');
}

assert.strictEqual(captureActualSheetResult(actualNormalMode, {
  success: 60, hard: 30, extreme: 12, roll: 1,
}).payload.outcome, 'critical', '실제 시트의 1을 대성공으로 읽지 못했습니다.');
assert.strictEqual(captureActualSheetResult(actualNormalMode, {
  success: 60, hard: 30, extreme: 12, roll: 100,
}).payload.outcome, 'fumble', '실제 시트의 100을 대실패로 읽지 못했습니다.');
assert.strictEqual(captureActualSheetResult(actualNormalMode, {
  success: 40, hard: 20, extreme: 8, roll: 96,
}).payload.outcome, 'fumble', '실제 시트의 낮은 목표치 96을 대실패로 읽지 못했습니다.');
assert.strictEqual(captureActualSheetResult(actualBonusMode, {
  success: 60, hard: 30, extreme: 12, roll1: 80, roll2: 1, roll3: 55, dice_type: 1,
}).payload.outcome, 'critical', '실제 시트 보너스 주사위의 선택 결과를 대성공으로 읽지 못했습니다.');
assert.strictEqual(captureActualSheetResult(actualPenaltyMode, {
  success: 40, hard: 20, extreme: 8, roll1: 1, roll2: 96, roll3: 50, dice_type: -1,
}).payload.outcome, 'fumble', '실제 시트 패널티 주사위의 선택 결과를 대실패로 읽지 못했습니다.');

actualRow.forEach((attribute) => {
  attributeObjects.splice(attributeObjects.indexOf(attribute), 1);
  events['destroy:attribute'](attribute);
});
assert(!helper.contractRolls(actualCharacter.id).some((item) => item.label === '항해술'),
  '실제 시트에서 삭제한 사용자 기능이 굴림 목록에 남으면 안 됩니다.');

// 반복행의 기본값은 실제 행 ID가 아니라 $순번으로만 읽히는 경우가 있습니다.
const sparseRowId = '-P09SparseRow';
const sparseTitle = addAttribute(actualCharacter.id,
  'repeating_science_' + sparseRowId + '_science_title', '기상학');
const sparseMod = addAttribute(actualCharacter.id,
  'repeating_science_' + sparseRowId + '_science_mod', '36');
const sparseOrder = addAttribute(actualCharacter.id,
  '_reporder_repeating_science', sparseRowId);
sheetFieldDefaults[actualCharacter.id] = {
  'repeating_science_$0_science_base': '1',
  'repeating_science_$0_science': 'floor(@{science_base} + @{science_mod})',
};
events['add:attribute'](sparseTitle);
events['add:attribute'](sparseMod);
events['add:attribute'](sparseOrder);
assert(helper.resolveContractAction(actualCharacter, '기상학', false).result.ok);
assert(sent.at(-1).content.includes('{{success=[[floor(1 + 36)]]}}'),
  '저장되지 않은 반복행 기본값은 $순번 참조로 실행해야 합니다.');
assert(!/repeating_science_(?:-P09SparseRow|\$0)_science/.test(sent.at(-1).content),
  '반복행 속성 참조가 Roll20에 보내는 굴림식에 남으면 안 됩니다.');

const hojilRuntime = addSourceCharacter(
  hojilSheet,
  'source-hojil',
  '호질 원본 시험',
);
inspection = helper.inspectContracts(hojilRuntime.character.id);
assert.strictEqual(inspection.status, 'ambiguous',
  '저장 구조가 같은 실제 시트를 근거 없이 자동 선택하면 안 됩니다.');
runApi('!시트 인식선택|' + hojilRuntime.character.id + '|' + hojilSheet.id,
  '테스터 GM (GM)', 'gm');
assert.strictEqual(helper.inspectContracts(hojilRuntime.character.id).contract.id, hojilSheet.id);
assert(runApi('!!일시적', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{madness_type=[[1]]}}')));
assert(runApi('!!장기적', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{madness_type=[[2]]}}')));
assert(runApi('!!r 2d6+3', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{free_roll=[[2d6+3]]}}')));

const bloodyRuntime = addSourceCharacter(
  bloodySheet,
  'source-bloody',
  '블러디 메리 원본 시험',
);
inspection = helper.inspectContracts(bloodyRuntime.character.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || 'Bloody Mary Castle 시트 자동 인식 실패');
assert.strictEqual(inspection.contract.id, bloodySheet.id);
const bloodyConflict = runApi('!!실시간', bloodyRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼');
assert(bloodyConflict && bloodyConflict.content.includes('background:#111') &&
  bloodyConflict.content.includes('일반 | 실시간') &&
  bloodyConflict.content.includes('펄프 | 실시간'),
  '실제 시트의 동명 방식을 임의로 하나 실행하면 안 됩니다.');
const bloodyMadnessRoll = bloodySheet.rolls.find((roll) => roll.label === '광기 발작');
const bloodyRealtime = bloodyMadnessRoll && bloodyMadnessRoll.modes.find((mode) =>
  (mode.labelPath || []).join(' ') === '일반 | 실시간');
assert(bloodyMadnessRoll && bloodyRealtime);
assert(runApi(
  '!!' + bloodyMadnessRoll.label + ' ' + (bloodyRealtime.labelPath || []).join(' '),
  bloodyRuntime.character.get('name'),
).some((item) => item.content && item.content.includes('{{madness_type=[[1]]}}')));

const publicRuntime = addSourceCharacter(
  publicSheet,
  'source-public',
  '공개 CoC 7판 원본 시험',
);
inspection = helper.inspectContracts(publicRuntime.character.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || 'Roll20 공개 CoC 7판 자동 인식 실패');
assert.strictEqual(inspection.contract.id, publicSheet.id);
const publicOldRoll = publicSheet.rolls.find((roll) =>
  roll.template === 'coc' && /\{\{\s*success\s*=/.test(roll.raw) &&
  /\{\{\s*roll1\s*=/.test(roll.raw) && /\{\{\s*roll3\s*=/.test(roll.raw));
assert(publicOldRoll && publicSheet.resultTemplates && publicSheet.resultTemplates.coc &&
  publicSheet.resultTemplates.coc.rules.some((rule) => rule.group === '0'),
  '공개 시트 구형 rolltemplate의 0 결과 그룹을 찾지 못했습니다.');

function capturePublicOldResult(fields) {
  const beforeRoll = sent.length;
  const started = helper.executeContract(
    publicRuntime.character.id,
    publicSheet.id,
    publicOldRoll.key,
    '',
    '',
    false,
    '',
  );
  assert(started.ok);
  const message = sent.slice(beforeRoll).find((item) =>
    item.content && item.content.includes('kib_sheet_result='));
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)/)[1];
  const entries = Object.entries(fields);
  const beforeResult = sent.length;
  events['chat:message']({
    type: 'general',
    content: '&{template:coc} ' + entries.map(([field], index) =>
      '{{' + field + '=$[[' + index + ']]}}').join(' ') +
      ' {{kib_sheet_result=' + sourceToken + '}}',
    inlinerolls: entries.map(([, total]) => ({ results: { total } })),
    who: publicRuntime.character.get('name'),
    playerid: 'player-1',
  });
  return sent.slice(beforeResult).find((item) => item.event === 'sheet:result');
}

assert.strictEqual(capturePublicOldResult({
  success: 60, hard: 30, extreme: 12, roll1: 50, roll2: 1, roll3: 80,
}).payload.outcome, 'success',
'공개 구형 시트의 기본 실행에서 +1 그룹 대성공을 섞어 읽으면 안 됩니다.');
assert.strictEqual(capturePublicOldResult({
  success: 40, hard: 20, extreme: 8, roll1: 50, roll2: 100, roll3: 80,
}).payload.outcome, 'failure',
'공개 구형 시트의 기본 실행에서 다른 그룹 대실패를 섞어 읽으면 안 됩니다.');
assert.strictEqual(capturePublicOldResult({
  success: 60, hard: 30, extreme: 12, roll1: 1, roll2: 80, roll3: 90,
}).payload.outcome, 'critical',
'공개 구형 시트의 기본 0 그룹 대성공을 읽지 못했습니다.');
[
  ['!!실시간', 'coc-bomadness-rt'],
  ['!!요약', 'coc-bomadness-summ'],
].forEach(([command, template]) => {
  assert(runApi(command, publicRuntime.character.get('name')).some((item) =>
    item.content && item.content.includes('&{template:' + template + '}')),
  command + '은 공개 시트에서 읽은 원본 굴림으로 실행되어야 합니다.');
});
assert(runApi('!!r 3d8+1', publicRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{diceroll=[[3d8+1]]}}')),
  '공개 시트의 원본 자유 굴림 버튼을 실행하지 못했습니다.');

function inlineRollFieldCount(raw) {
  const fields = new Set();
  String(raw || '').replace(/\{\{\s*(roll\d*)\s*=\s*\[\[/gi, (match, field) => {
    fields.add(field.toLowerCase());
    return match;
  });
  return fields.size;
}

const publicGroups = {};
helper.contractRolls(publicRuntime.character.id).forEach((instance) => {
  if (!publicGroups[instance.label]) publicGroups[instance.label] = [];
  publicGroups[instance.label].push(instance);
});
const publicCombinedLabel = Object.keys(publicGroups).find((label) => {
  const counts = publicGroups[label].map((instance) =>
    inlineRollFieldCount(instance.roll.raw));
  return counts.includes(1) && counts.some((count) => count >= 3);
});
assert(publicCombinedLabel,
  '공개 시트의 기본 굴림과 통합 보너스·패널티 굴림을 찾지 못했습니다.');
['보너스1', '패널티1'].forEach((mode) => {
  const messages = runApi(
    '!!' + publicCombinedLabel + ' ' + mode,
    publicRuntime.character.get('name'),
  );
  assert(messages.some((item) =>
    item.content && inlineRollFieldCount(item.content) >= 3),
  '공개 시트의 통합 ' + mode + ' 굴림을 실행하지 못했습니다.');
});

console.log('Sheet Helper check: PASS');
