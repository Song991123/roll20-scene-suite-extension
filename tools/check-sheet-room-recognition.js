const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseSheetContract } = require('./sheet-contract-parser');

const source = fs.readFileSync(path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'), 'utf8');
const attributes = [];
const characters = [];
const events = {};

function object(id, values) {
  const data = { ...values };
  return {
    id,
    get(name) { return data[name]; },
    set(name, value) { data[name] = value; },
    remove() {},
  };
}

function character(id, name) {
  const value = object(id, { name, controlledby: 'player' });
  characters.push(value);
  return value;
}

function attribute(characterId, name, current) {
  const value = object(characterId + '-' + name + '-' + attributes.length, {
    _characterid: characterId,
    characterid: characterId,
    name,
    current: current == null ? '' : String(current),
    max: '',
  });
  attributes.push(value);
  return value;
}

const runtime = {
  KIBSheetContracts: [],
  KIBScene: { adapters: {}, register(name, adapter) { this.adapters[name] = adapter; } },
  state: { KIBSheetHelper: {
    activeCharacterId: 'second', sheetSelections: { first: 'stale-choice' }, keep: 'preserved',
  } },
  on(name, callback) { events[name] = callback; },
  findObjs(query) {
    if (query._type === 'attribute' || query.type === 'attribute') {
      const characterId = query._characterid || query.characterid;
      return attributes.filter((item) => !characterId || item.get('_characterid') === characterId);
    }
    if (query._type === 'character' || query.type === 'character') return characters.slice();
    return [];
  },
  getObj(type, id) {
    return type === 'character' ? characters.find((item) => item.id === id) || null : null;
  },
  getAttrByName(characterId, name, type) {
    const found = attributes.find((item) =>
      item.get('_characterid') === characterId && item.get('name') === name);
    return found && found.get(type === 'max' ? 'max' : 'current');
  },
  createObj() { return null; },
  sendChat() {},
  playerIsGM() { return true; },
  randomInteger() { return 1; },
  setTimeout() { return 1; },
  clearTimeout() {},
  log() {},
  Date,
};

vm.createContext(runtime);
vm.runInContext(source, runtime);
const helper = runtime.KIBSheetHelper;

const first = parseSheetContract([
  '<input name="attr_room_marker_a"><input name="attr_room_marker_b">',
  '<input name="attr_room_marker_c"><input name="attr_room_marker_d">',
  '<fieldset class="repeating_roomskill">',
  '<input name="attr_item_name"><input name="attr_item_value">',
  '<button type="roll" name="roll_item" value="&{template:test} {{subject=@{item_name}}} {{success=[[@{item_value}]]}} {{roll=[[1d100]]}}"></button>',
  '</fieldset>',
].join('\n'), { id: 'room-sheet-a', sourceHash: 'room-sheet-a' });
first.signature = {
  attrs: ['room_marker_a', 'room_marker_b', 'room_marker_c', 'room_marker_d'].map((name) => ({
    name, weight: 1, required: true,
  })),
  minimum: 4,
};

const second = parseSheetContract([
  '<input name="attr_other_marker_a"><input name="attr_other_marker_b">',
  '<input name="attr_other_marker_c"><input name="attr_other_marker_d">',
  '<fieldset class="repeating_other"><input name="attr_other_name"><input name="attr_other_value">',
  '<button type="roll" value="&{template:test} {{subject=@{other_name}}} {{roll=[[@{other_value}]]}}"></button></fieldset>',
].join('\n'), { id: 'room-sheet-b', sourceHash: 'room-sheet-b' });
second.signature = {
  attrs: ['other_marker_a', 'other_marker_b', 'other_marker_c', 'other_marker_d'].map((name) => ({
    name, weight: 1, required: true,
  })),
  minimum: 4,
};

helper.registerContract(first);
helper.registerContract(second);

const firstCharacter = character('first', '첫 캐릭터');
const secondCharacter = character('second', '둘째 캐릭터');
attribute(firstCharacter.id, 'room_marker_a', 1);
attribute(firstCharacter.id, 'room_marker_b', 1);
attribute(firstCharacter.id, 'repeating_roomskill_rowMine_item_name', '내 기능');
attribute(firstCharacter.id, 'repeating_roomskill_rowMine_item_value', 55);
attribute(secondCharacter.id, 'room_marker_c', 1);
attribute(secondCharacter.id, 'room_marker_d', 1);
attribute(secondCharacter.id, 'repeating_roomskill_rowOther_item_name', '다른 캐릭터 기능');
attribute(secondCharacter.id, 'repeating_roomskill_rowOther_item_value', 44);

runtime.state.KIBSheetHelper.sheetSelections[firstCharacter.id] = second.id;
const firstInspection = helper.inspectContracts(firstCharacter.id);
const secondInspection = helper.inspectContracts(secondCharacter.id);
assert.strictEqual(firstInspection.status, 'matched');
assert.strictEqual(firstInspection.contract.id, first.id,
  '오래된 캐릭터별 시트 선택값이 방의 자동 인식을 덮어쓰면 안 됩니다.');
assert.strictEqual(secondInspection.contract.id, first.id,
  '같은 방의 캐릭터마다 다른 시트로 인식하면 안 됩니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections[firstCharacter.id], second.id,
  '구버전 저장값은 실행에 쓰지 않되 업데이트 중 삭제하지 않아야 합니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.activeCharacterId, secondCharacter.id,
  '구버전 대상 저장값은 실행에 쓰지 않되 업데이트 중 삭제하지 않아야 합니다.');

const firstRollLabels = helper.contractRolls(firstCharacter.id).map((item) => item.label);
assert(firstRollLabels.includes('내 기능'));
assert(!firstRollLabels.includes('다른 캐릭터 기능'),
  '방 전체 증거는 시트 구조만 정해야 하며 다른 캐릭터의 반복행 값까지 섞으면 안 됩니다.');

['other_marker_a', 'other_marker_b', 'other_marker_c', 'other_marker_d'].forEach((name) => {
  const added = attribute(secondCharacter.id, name, 1);
  events['add:attribute'](added);
});
['repeating_other_rowOld_other_name', 'repeating_other_rowOld_other_value'].forEach((name) => {
  const added = attribute(secondCharacter.id, name, name.endsWith('_name') ? '오래된 항목' : '20');
  events['add:attribute'](added);
});
const afterResidue = helper.inspectContracts(firstCharacter.id);
assert.strictEqual(afterResidue.status, 'matched', JSON.stringify((afterResidue.matches || []).map((item) => ({
  id: item.id, score: item.score, ratio: item.ratio, rankScore: item.rankScore, eligible: item.eligible,
}))));
assert.strictEqual(afterResidue.contract.id, first.id,
  '한 캐릭터에 남은 과거 시트 데이터가 현재 방 전체의 시트 인식을 막으면 안 됩니다.');
const firstMatch = afterResidue.matches.find((item) => item.id === first.id);
const residueMatch = afterResidue.matches.find((item) => item.id === second.id);
assert(firstMatch && residueMatch && firstMatch.supportCount > residueMatch.supportCount,
  '현재 시트와 과거 잔재를 구분할 캐릭터별 증거 범위를 유지해야 합니다.');

// A real sheet-default lookup distinguishes an absent field (undefined) from
// a present but blank input (''). Do not resurrect candidates rejected by it.
const candidate = (id, ownField) => parseSheetContract([
  '<input name="attr_common_base" value="5">',
  '<input name="attr_' + ownField + '" value="1">',
  '<input name="attr_old_appearance" value="50">',
  '<button type="roll" name="roll_appearance" value="&{template:test} {{subject=외모}} {{success=[[@{old_appearance}]]}} {{roll=[[1d100]]}}"></button>',
].join('\n'), { id, sourceHash: id });
const missingA = candidate('missing-source-a', 'only_a');
const missingB = candidate('missing-source-b', 'only_b');
const unrelated = parseSheetContract(
  '<input name="attr_unrelated" value="7"><button type="roll" value="[[1d6]]">다른 굴림</button>',
  { id: 'unrelated-source', sourceHash: 'unrelated-source' },
);
characters.length = 0;
attributes.length = 0;
const unsupported = character('unsupported', '실제 원본에 없는 후보 반례');
attribute(unsupported.id, 'appearance', 63);
runtime.KIBSheetContracts = [missingA, missingB, unrelated];
helper.registerContract(missingA);
let currentDefaults = { common_base: '5', appearance: '63' };
runtime.getSheetDefaultValue = name => currentDefaults[name];
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'none',
  '현재 원본에 없다는 증거로 탈락한 후보를 공통 기본값만으로 다시 살리면 안 됩니다.');
assert.strictEqual(helper.contractRolls(unsupported.id).length, 0,
  '지원 원본이 없을 때 다른 시트의 외모 50을 제공하면 안 됩니다.');

currentDefaults = { common_base: '5', only_a: '1', old_appearance: '50' };
helper.refresh();
assert(helper.contractRolls(unsupported.id).some(item => item.contract.id === missingA.id),
  '실제로 존재하는 원본의 기본값 굴림은 보존해야 합니다.');
currentDefaults.only_a = '';
helper.refresh();
assert(helper.contractRolls(unsupported.id).some(item => item.contract.id === missingA.id),
  '존재하는 빈 입력은 없는 필드와 구별하여 보존해야 합니다.');

const resourceContract = parseSheetContract([
  '<label>체력<input type="number" name="attr_hp" value="12"></label>',
  '<input type="number" name="attr_hp_max" value="12" readonly>',
  '<label>마력<input type="number" name="attr_mp" value="10"></label>',
  '<input type="number" name="attr_mp_max" value="10" readonly>',
  '<label>이성<input type="number" name="attr_sanity" value="50"></label>',
  '<input type="number" name="attr_sanity_max" value="99" readonly>',
  '<label>초기 이성치<input type="number" name="attr_initSanity" value="50" readonly></label>',
  '<label>무기<input type="text" name="attr_weapon-name"></label>',
  '<input type="text" name="attr_damage" value="1d6">',
  '<button type="roll" value="&{template:test} {{name=@{character_name}}} {{character_id=@{character_id}}} {{weapon_name=@{weapon-name}}} {{damage_roll=[[@{damage}]]}}"></button>',
  '<input type="number" name="attr_strength" value="60" readonly>',
  '<button type="roll" name="roll_strength" value="&{template:test} {{subject=힘}} {{target=[[@{strength}]]}} {{roll=[[1d100]]}}"></button>',
].join('\n'), { id: 'resource-pair-source', sourceHash: 'resource-pair-source' });
resourceContract.fields.find(field => field.name === 'sanity').aliases.push('초기 이성치', 'initial-sanity');
runtime.KIBSheetContracts = [resourceContract];
currentDefaults = Object.fromEntries(resourceContract.fields.map(field => [field.name, field.default]));
helper.registerContract(resourceContract);
assert.strictEqual(helper.resolveContractAction(unsupported, '외모', false).handled, false,
  '분류용 characteristic 묶음을 명령 별칭으로 써서 외모를 유일한 힘 굴림에 연결하면 안 됩니다.');
assert(helper.resolveContractAction(unsupported, '힘', false).result.ok,
  '원본 한국어 판정 이름은 그대로 실행되어야 합니다.');
const resourceScan = helper.scan(unsupported.id, true);
[['hp', 12], ['mp', 10], ['sanity', 99]].forEach(([name, max]) => {
  const item = resourceScan.resources.find(field => field.name === name);
  assert(item && item.statusResource, '라벨 없는 최대치 입력과 연결된 현재 수치 누락: ' + name);
  assert.strictEqual(item.max, max, '원본의 실제 최대치 연결: ' + name);
});
assert(!resourceScan.resources.some(item => /_max$/.test(item.name)),
  '계산 전용 최대치 입력을 별도 편집 가능한 현재 수치로 추가하면 안 됩니다.');

const initialSanity = attribute(unsupported.id, 'initSanity', 50);
attribute(unsupported.id, 'character_id', unsupported.id);
const statusMessages = [];
const originalGetObj = runtime.getObj;
runtime.getObj = (type, id) => type === 'player'
  ? object(id, { speakingas: 'character|' + unsupported.id, _displayname: '검증 GM' })
  : originalGetObj(type, id);
runtime.sendChat = (_who, content) => statusMessages.push(String(content));
helper.refresh();
events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
assert(statusMessages.some(text => text.includes('50 / 시작 50 (100%)')),
  '읽기 전용 계산값인 초기 이성치도 현재 이성의 기준으로 표시해야 합니다.');
initialSanity.set('current', '60');
helper.refresh();
events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
assert(statusMessages.some(text => text.includes('50 / 시작 60 (83%)')),
  '워커가 갱신한 읽기 전용 시작값을 이전 값으로 표시하면 안 됩니다.');
initialSanity.set('current', '50');
helper.refresh();
events['chat:message']({ type: 'general', playerid: 'gm', content: ':시작이성=80' });
assert.strictEqual(initialSanity.get('current'), '50', '읽기 전용 시작값을 명령으로 덮어쓰면 안 됩니다.');
assert(statusMessages.some(text => /읽기 전용/.test(text)), '계산값 편집 거절 이유를 알려야 합니다.');
assert(!helper.contractRolls(unsupported.id).some(item => item.label === unsupported.id),
  '캐릭터 ID는 무기나 기능 이름으로 표시하면 안 됩니다.');
assert(!helper.contractRolls(unsupported.id).some(item => /weapon_name/.test(item.roll.raw)),
  '아직 이름을 입력하지 않은 무기 틀을 목록에 넣으면 안 됩니다.');
attribute(unsupported.id, 'weapon-name', '검증 무기');
helper.refresh();
assert(helper.contractRolls(unsupported.id).some(item => item.label === '검증 무기'),
  '이름을 입력하면 하이픈 속성명을 사용하는 무기도 즉시 인식해야 합니다.');

// The distributed Korean CoC6 source contains two unnamed skill templates whose
// label reference does not match either declared input. Do not invent a binding.
const embedded = { KIBSheetContracts: [] };
vm.runInNewContext(source.slice(source.indexOf('/* SCENE_SUITE_SHEET_RECOGNITION_START */'),
  source.indexOf('/* SCENE_SUITE_SHEET_RECOGNITION_END */')), embedded);
const coc6 = embedded.KIBSheetContracts.find(sheet => sheet.id === 'sheet-c236bcff42e9a873');
assert(coc6, '기존 한국어 CoC6 원본 보존');
runtime.KIBSheetContracts = [coc6];
currentDefaults = Object.fromEntries(coc6.fields.filter(field => !field.section).map(field => [field.name, field.default]));
attributes.length = 0;
coc6.fields.filter(field => !field.section && field.numericCandidate)
  .forEach(field => attribute(unsupported.id, field.name, field.name === 'impact' ? field.default : 47));
attribute(unsupported.id, 'character_id', unsupported.id);
attribute(unsupported.id, 'initSanity', 50);
helper.registerContract(coc6);
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'matched');
assert.strictEqual(helper.contractRolls(unsupported.id).filter(item => item.label === '예술 문화').length, 1,
  '원본에서 이름 참조가 비어 있는 두 기능 틀을 고정 기능과 같은 이름으로 나열하면 안 됩니다.');
['발', '손', '머리'].forEach(label => assert(helper.contractRolls(unsupported.id).some(item => item.label === label),
  '번역된 원본 무기 이름을 수식으로 바꾸면 안 됩니다: ' + label));
statusMessages.length = 0;
events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
assert(statusMessages.some(text => text.includes('특성치 8개') && text.includes('기능 / 판정 43개')),
  '공통 characteristic_threshold를 쓰더라도 원본 이성 판정은 특성치와 분리해야 합니다.');
['1d6+0', '1d3+0', '1d4+0'].forEach(damage => assert(statusMessages.some(text => text.includes(damage)),
  '피해 전용 원본 굴림은 보정값 0이 아니라 실제 피해식을 표시해야 합니다: ' + damage));
assert(!statusMessages.some(text => /(?:발|손|머리) <b>0<\/b>/.test(text)),
  '피해 보정값을 판정 기준값처럼 표시하면 안 됩니다.');

// Sheet tooltips can document an ability reference; that is not a visible label
// and must never be evaluated by sendChat while showing a status/error message.
const referenceTitle = parseSheetContract([
  '<input name="attr_reference_marker" value="reference-labels">',
  '<input type="number" name="attr_dodge" value="25">',
  '<button type="roll" name="roll_dodge" title="%{dodge}" value="&{template:test} {{subject=회피}} {{target=[[@{dodge}]]}} {{roll=[[1d100]]}}"></button>',
].join('\n'), { id: 'reference-labels', sourceHash: 'reference-labels' });
runtime.KIBSheetContracts = [referenceTitle];
currentDefaults = Object.fromEntries(referenceTitle.fields.map(field => [field.name, field.default]));
attributes.length = 0;
attribute(unsupported.id, 'reference_marker', 'reference-labels');
attribute(unsupported.id, 'dodge', 25);
helper.registerContract(referenceTitle);
const referenceRoll = helper.contractRolls(unsupported.id).find(item => item.roll.name === 'dodge');
assert(referenceRoll && referenceRoll.label === '회피', '기술용 %{dodge} 툴팁은 실제 판정 이름을 가리면 안 됩니다.');
assert.strictEqual(referenceRoll.roll.raw, referenceTitle.rolls[0].raw, '표시 필터는 원본 굴림을 바꾸면 안 됩니다.');
statusMessages.length = 0;
events['chat:message']({ type: 'api', playerid: 'gm', content: '!!없는항목%{dodge}' });
assert(statusMessages.some(text => text.includes('&#37;{dodge}')),
  '오류 안내의 굴림 참조는 실행되지 않도록 표시용으로 이스케이프해야 합니다.');
assert(!statusMessages.some(text => /[@%]\{/.test(text)), '안내문에 실행 가능한 참조가 남으면 안 됩니다.');

const achtung = embedded.KIBSheetContracts.find(sheet => sheet.id === 'sheet-cf240692b20596fc');
runtime.KIBSheetContracts = [achtung];
currentDefaults = Object.fromEntries(achtung.fields.filter(field => !field.section).map(field => [field.name, field.default]));
attributes.length = 0;
['str', 'con', 'siz', 'dex', 'app', 'edu', 'int', 'pow'].forEach(name => attribute(unsupported.id, name, 50));
helper.registerContract(achtung);
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'matched');
assert(!helper.contractRolls(unsupported.id).some(item => /[@%]\{/.test(item.label)),
  '실제 내장 Achtung 원본의 기술용 참조도 표시 이름으로 노출하면 안 됩니다.');
statusMessages.length = 0;
events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
assert(statusMessages.some(text => text.includes('시트 현황')), '부분 번역 시트에서도 상태 안내는 생성해야 합니다.');
assert(!statusMessages.some(text => /[@%]\{/.test(text)), '실제 원본의 상태 안내에 실행 가능한 참조가 남으면 안 됩니다.');

attributes.find(item => item.get('name') === 'app').set('current', '63');
attribute(unsupported.id, 'app-half', 31);
attribute(unsupported.id, 'app-fifth', 12);
const showScores = attribute(unsupported.id, 'show-scores', 1);
const difficultyFlags = ['roll-regular', 'roll-hard', 'roll-extreme'].map(name => attribute(unsupported.id, name, 0));
attribute(unsupported.id, 'edit-mode', 0);
helper.refresh();
const nativeAppearance = helper.contractRolls(unsupported.id).find(item => item.roll.name === 'app');
assert(nativeAppearance, '편집 모드가 꺼진 실제 APP 버튼이 검사 대상이어야 합니다.');
assert.strictEqual(nativeAppearance.label, 'Appearance', '원본 번역 문자열을 잘린 ^{app 토큰보다 우선해야 합니다.');
assert(!helper.contractRolls(unsupported.id).some(item => /\^\{/.test(item.label)),
  '내장 인식 자료에 잘린 번역 토큰이 표시 이름으로 남으면 안 됩니다.');
[63, 31, 12].forEach((target, index) => {
  difficultyFlags.forEach((flag, flagIndex) => flag.set('current', String(flagIndex === index ? 1 : 0)));
  showScores.set('current', String(index === 1 ? 0 : 1));
  helper.refresh();
  statusMessages.length = 0;
  events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
  assert(statusMessages.some(text => text.includes(nativeAppearance.label + ' <b>' + target + '</b>')),
    '실제 내장 시트에서도 표시 옵션이 아닌 현재 난이도의 기준값이어야 합니다: ' + target);
  assert(statusMessages.some(text => text.includes('특성치 8개')), '번역된 특성치는 기능과 분리되어야 합니다.');
  assert.strictEqual((statusMessages.join('').match(/Dodge <b>/g) || []).length, 1,
    '같은 이름과 원본 굴림식의 회피 버튼은 상태 목록에 한 번만 표시해야 합니다.');
});

const displayFlagContract = parseSheetContract([
  '<input name="attr_display_marker" value="display-flag">',
  '<input type="checkbox" name="attr_display" value="1" checked>',
  '<input type="number" name="attr_current" value="63">',
  '<button type="roll" name="roll_appearance" value="&{template:check} {{name=외모}} {{score=[[@{display}]]}} {{check=[[@{current}]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_intelligence" value="&{template:check} {{name=지능}} {{score=[[@{current}]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_scaled" value="&{template:check} {{name=배율}} {{target=[[@{display}]]}} {{stat=[[@{current}*2]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_dice_first" value="&{template:check} {{name=주사위구분}} {{check=[[1d100]]}} {{target=[[@{current}*3]]}}"></button>',
].join('\n'), { id: 'display-flag', sourceHash: 'display-flag' });
runtime.KIBSheetContracts = [displayFlagContract];
currentDefaults = Object.fromEntries(displayFlagContract.fields.map(field => [field.name, field.default]));
attributes.length = 0;
attribute(unsupported.id, 'display_marker', 'display-flag');
const displayFlag = attribute(unsupported.id, 'display', 1);
const displayedTarget = attribute(unsupported.id, 'current', 63);
helper.registerContract(displayFlagContract);
function assertDisplayedTargets(value) {
  helper.refresh();
  statusMessages.length = 0;
  events['chat:message']({ type: 'api', playerid: 'gm', content: '!!상태' });
  [['외모', value], ['지능', value], ['배율', value * 2], ['주사위구분', value * 3]].forEach(([label, target]) => {
    assert(statusMessages.some(text => text.includes(label + ' <b>' + target + '</b>')),
      '표시용 체크박스가 아니라 원본 판정 기준을 표시해야 합니다: ' + label + '/' + target);
  });
}
assertDisplayedTargets(63);
displayFlag.set('current', '0');
assertDisplayedTargets(63);
displayedTarget.set('current', '0');
assertDisplayedTargets(0);

console.log('Sheet room recognition: ok');
