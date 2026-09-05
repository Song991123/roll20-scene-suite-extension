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

const checkboxSource = parseSheetContract([
  '<input name="attr_checkbox_source" value="checkbox-source">',
  '<input name="attr_checkbox_version" value="version-one">',
  '<input name="attr_checkbox_guard" value="guard">',
  '<input type="checkbox" name="attr_mode_fragment" value="{{mode=enabled}}" checked>',
  '<button type="roll" name="roll_native" value="&{template:test} @{mode_fragment} {{roll=[[1d100]]}}">검증 굴림</button>',
].join('\n'), { id: 'checkbox-source-default', sourceHash: 'checkbox-source-default' });
runtime.KIBSheetContracts = [checkboxSource];
attributes.length = 0;
['checkbox_source', 'checkbox_version', 'checkbox_guard'].forEach(name =>
  attribute(unsupported.id, name, checkboxSource.fields.find(field => field.name === name).default));
currentDefaults = Object.fromEntries(checkboxSource.fields.map(field => [field.name, field.default]));
currentDefaults.mode_fragment = '0';
helper.registerContract(checkboxSource);
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'matched',
  '굴림 조각을 값으로 쓰는 체크박스도 정상 해제값 0을 다른 원본의 증거로 오인하면 안 됩니다.');
currentDefaults.mode_fragment = '{{mode=unrelated}}';
helper.refresh();
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'none',
  '실제로 다른 원본의 굴림 조각은 계속 인식에서 제외해야 합니다.');
checkboxSource.fields.find(field => field.name === 'mode_fragment').type = 'text';
currentDefaults.mode_fragment = '0';
helper.registerContract(checkboxSource);
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'none',
  '체크박스가 아닌 굴림 조각의 0값까지 원본 불일치 검사에서 제외하면 안 됩니다.');

const dynamicQuerySheet = parseSheetContract([
  '<input name="attr_query_source" value="dynamic-query">',
  '<input name="attr_query_version" value="one"><input name="attr_query_guard" value="guard">',
  '<input type="hidden" name="attr_generated_roll">',
  '<input type="hidden" name="attr_generated_damage">',
  '<button type="roll" name="roll_appearance" value="&{template:check} {{name=외모}} @{generated_roll}">외모</button>',
  '<button type="roll" name="roll_appraise" value="&{template:check} {{name=감정}} @{generated_roll}">감정</button>',
  '<button type="roll" name="roll_unarmed" value="&{template:check} {{name=비무장}} @{generated_damage}">비무장</button>',
].join('\n'), {id:'dynamic-query', sourceHash:'dynamic-query'});
runtime.KIBSheetContracts = [dynamicQuerySheet];
attributes.length = 0;
currentDefaults = Object.fromEntries(dynamicQuerySheet.fields.map(field => [field.name, field.default]));
['query_source', 'query_version', 'query_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
const generatedRoll = attribute(unsupported.id, 'generated_roll',
  '{{roll=[[((?{보너스/페널티?|보통,1d10|보너스,?{개수&#125;d10kl1|페널티,?{개수&#125;d10kh1}-1)*10)+1d10]]}} {{roll_target=[[63]]}}');
const generatedDamage = attribute(unsupported.id, 'generated_damage',
  '{{roll=[[?{주사위|1d100}]]}}{{target=[[25]]}}{{damage=[[1d3+0]]}}');
helper.registerContract(dynamicQuerySheet);
assert.strictEqual(helper.inspectContracts(unsupported.id).status, 'matched');
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!외모'});
const questionButton = statusMessages.find(text => text.includes('href="!/&#13;'));
assert(questionButton, '워커가 만든 질문도 기본값으로 생략하지 않고 원본 질문 버튼을 제공해야 합니다.');
assert(questionButton.includes('template&#58;check'), '템플릿의 콜론 때문에 Roll20이 버튼 주소를 제거하면 안 됩니다.');
assert(questionButton.includes('&#63;{보너스/페널티?') === false,
  '원본 질문의 모든 물음표는 사전 처리되지 않도록 인코딩해야 합니다.');
assert(questionButton.includes('d10kl1') && questionButton.includes('d10kh1') && questionButton.includes('&amp;#125;'),
  '보너스, 페널티, 중첩 질문의 원본 값을 보존해야 합니다.');
assert(!questionButton.includes('[['), '버튼을 보여줄 때 먼저 주사위를 굴리면 안 됩니다.');
assert(questionButton.includes('&#42;10') && questionButton.includes('&#95;'),
  '곱셈과 템플릿 필드명이 채팅 마크다운으로 바뀌지 않도록 보호해야 합니다.');
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!비밀 외모'});
assert(statusMessages.some(text => text.includes('href="!/&#13;&#47;w gm ')), '비밀 명령은 줄 시작에 공백 없이 있어야 합니다.');
for (const unsafe of ['?{실행|선택,!unsafe}', '&#10;!unsafe ?{입력}', '&amp;#10;!unsafe ?{입력}', '&#37;{other|ability} ?{입력}',
  '&percnt;{other|ability} ?{입력}', '?{입력|선택,&nbsp;#OtherMacro}', '&#37;&#0;{other|ability} ?{입력}']) {
  generatedRoll.set('current', unsafe);
  helper.refresh();
  statusMessages.length = 0;
  events['chat:message']({type:'api', playerid:'gm', content:'!!외모'});
  assert(!statusMessages.some(text => text.includes('href="!/&#13;')), '숨은 명령/외부 참조를 실행 버튼으로 전달하면 안 됩니다: '+unsafe);
}
generatedRoll.set('current', '{{roll=[[1d100]]}} {{target=[[63]]}}');
helper.refresh();
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!외모'});
assert(statusMessages.some(text => text.includes('{{roll=[[1d100]]}}')) && !statusMessages.some(text => text.includes('href="!/&#13;')),
  '질문 없는 기존 굴림은 그대로 즉시 실행해야 합니다.');

for (const target of [63, 67, 0]) {
  generatedRoll.set('current', '{{roll=[[((?{보너스/페널티?|보통,1d10|보너스,?{개수&#125;d10kl1|페널티,?{개수&#125;d10kh1}-1)*10)+1d10]]}}' +
    '{{roll_target=[[floor(' + target + '/1)]]}}{{roll_half=[[floor(' + target + '/2)]]}}{{roll_fifth=[[floor(' + target + '/5)]]}}');
  helper.refresh();
  statusMessages.length = 0;
  events['chat:message']({type:'api', playerid:'gm', content:'!!상태'});
  const status = statusMessages.join('');
  for (const label of ['외모', '감정']) assert(status.includes(label + ' <b>' + target + '</b>'),
    '질문이 있는 동적 굴림도 현재 기준값을 읽어야 합니다: ' + label + '/' + target);
  assert(status.includes('기능 / 판정 1개') && !status.includes('기타 주사위'),
    '원본의 d10 백분위 굴림과 반값/5분의1 기준을 가진 기능은 판정으로 분류해야 합니다.');
}
helper.refresh();
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!상태'});
assert(statusMessages.join('').includes('1d3+0'), '주사위 질문과 무관하게 확정된 원본 피해식은 표시해야 합니다.');

const navigationSheet = parseSheetContract(`
  <input name="attr_navigation_source" value="navigation-source">
  <input name="attr_navigation_version" value="one"><input name="attr_navigation_guard" value="guard">
  <input name="attr_sheet_npc" type="checkbox">
  <div class="sheet-navigation">
    <label><input name="attr_page" type="radio" value="skills" checked>기능</label>
    <label><input name="attr_page" type="radio" value="combat">전투</label>
    <label><input name="attr_page" type="radio" value="settings">설정</label>
  </div>
  <div class="pc"><input name="attr_page" type="hidden">
    <div class="skills"><button type="roll" value="&{template:test} {{title=감정}} {{roll=[[1d100]]}}">감정</button></div>
    <div class="combat"><button type="roll" value="&{template:test} {{title=비무장}} {{roll=[[1d3]]}}">비무장</button></div>
  </div>
  <div class="npc"><button type="roll" value="&{template:test} {{title=NPC}} {{roll=[[1d20]]}}">NPC</button></div>
  <input name="attr_mode" type="radio" value="normal" checked><input name="attr_mode" type="radio" value="pulp">
  <div class="pulp"><button type="roll" value="&{template:test} {{title=펄프}} {{roll=[[1d6]]}}">펄프</button></div>
`, {id:'navigation-sheet', sourceHash:'navigation-sheet', css:`
  .skills, .combat, .npc, .pulp { display: none; }
  input[name="attr_page"][value="skills"] ~ .skills { display: block; }
  input[name="attr_page"][value="combat"] ~ .combat { display: block; }
  input[name="attr_sheet_npc"]:checked ~ .pc { display: none; }
  input[name="attr_sheet_npc"]:checked ~ .npc { display: block; }
  input[name="attr_mode"][value="pulp"]:checked ~ .pulp { display: block; }
`});
runtime.KIBSheetContracts = [navigationSheet];
attributes.length = 0;
currentDefaults = Object.fromEntries(navigationSheet.fields.map(field => [field.name, field.default]));
['navigation_source', 'navigation_version', 'navigation_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
const navigationPage = attribute(unsupported.id, 'page', 'settings');
const navigationNpc = attribute(unsupported.id, 'sheet_npc', '0');
const navigationMode = attribute(unsupported.id, 'mode', 'normal');
helper.registerContract(navigationSheet);
assert.strictEqual(navigationSheet.controls.page.navigation, true, '원본 내비게이션 영역의 라디오만 표시 전환으로 분류해야 합니다.');
assert(!navigationSheet.controls.mode.navigation, '일반 모드 라디오는 내비게이션이 아닙니다.');
for (const page of ['settings', 'skills', 'combat']) {
  navigationPage.set('current', page);
  helper.refresh();
  const labels = helper.contractRolls(unsupported.id).map(item => item.label);
  assert(labels.includes('감정') && labels.includes('비무장'), '화면 탭 선택이 명령어를 숨기면 안 됩니다: ' + page);
  assert(!labels.includes('NPC') && !labels.includes('펄프'), '실제 PC/NPC 및 규칙 모드 조건은 유지해야 합니다.');
}
navigationNpc.set('current', 'on');
navigationMode.set('current', 'pulp');
helper.refresh();
assert.deepStrictEqual(Array.from(helper.contractRolls(unsupported.id), item => item.label).sort(), ['NPC', '펄프'],
  '내비게이션 필터 해제가 실제 모드의 숨김 조건까지 무시하면 안 됩니다.');
navigationNpc.set('current', '0');
navigationMode.set('current', 'normal');
navigationPage.set('current', 'settings');
const requiredNavigation = JSON.parse(JSON.stringify(navigationSheet));
function requirePage(condition) {
  if (!condition) return;
  if (condition.name === 'page') condition.required = true;
  (condition.all || condition.any || []).forEach(requirePage);
  requirePage(condition.not);
}
requiredNavigation.rolls.forEach(roll => requirePage(roll.visibility));
helper.registerContract(requiredNavigation);
assert.strictEqual(helper.contractRolls(unsupported.id).length, 0, '워커가 요구한 활성 조건은 내비게이션 안에서도 유지해야 합니다.');
const referencedNavigation = JSON.parse(JSON.stringify(navigationSheet));
referencedNavigation.rolls[0].expressionRefs.push({name:'page', max:false});
helper.registerContract(referencedNavigation);
assert.strictEqual(helper.contractRolls(unsupported.id).length, 0, '굴림식에서 사용하는 값은 표시 전환으로 무시하면 안 됩니다.');

const linkedCaptionSheet = parseSheetContract(`
  <input name="attr_link_marker" value="link-marker"><input name="attr_link_version" value="one"><input name="attr_link_guard" value="guard">
  <input type="hidden" name="attr_item_name"><input type="hidden" name="attr_action_caption">
  <button name="roll_item" type="roll" value="&{template:test} {{name=@{character_name}}} {{title=@{item_name}}} {{footer=[@{action_caption}](~@{character_id}|bonus)}} {{roll=[[1d100]]}}"></button>
  <button name="roll_appraise" type="roll" value="&{template:test} {{title=감정}} {{footer=[@{action_caption}](~@{character_id}|bonus)}} {{roll=[[1d100]]}}">감정</button>
  <button name="roll_bonus" type="roll" value="&{template:test} {{title=@{action_caption}}} {{roll=[[1d10]]}}"></button>
  <button name="roll_note" type="roll" value="&{template:test} {{title=설명 전송}} {{text=설명 본문}}">설명 전송</button>
  <button name="roll_text_dice" type="roll" value="&{template:test} {{title=유효 주사위}} {{text=메모}} {{roll=[[1d6]]}}">유효 주사위</button>
  <button name="roll_spell" type="roll" value="&{template:test} {{title=주문 설명}} {{text=주문 본문}}">주문 설명</button>
`, {id:'linked-caption', sourceHash:'linked-caption'});
runtime.KIBSheetContracts = [linkedCaptionSheet];
attributes.length = 0;
currentDefaults = Object.fromEntries(linkedCaptionSheet.fields.map(field => [field.name, field.default]));
['link_marker', 'link_version', 'link_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
attribute(unsupported.id, 'action_caption', '보너스');
const linkedItemName = attribute(unsupported.id, 'item_name', '');
helper.registerContract(linkedCaptionSheet);
let linkedRolls = helper.contractRolls(unsupported.id);
assert(!linkedRolls.filter(item => item.roll.name !== 'bonus').some(item => item.aliases.includes('보너스')),
  '보조 실행 링크의 글자를 다른 항목의 이름이나 명령 별칭으로 읽으면 안 됩니다.');
assert(linkedRolls.some(item => item.roll.name === 'bonus' && item.label === '보너스'),
  '진짜 보너스 굴림의 제목까지 제외하면 안 됩니다.');
for (const name of ['ㅇㄴ', '동물 다루기']) {
  linkedItemName.set('current', name);
  helper.refresh();
  linkedRolls = helper.contractRolls(unsupported.id);
  const item = linkedRolls.find(item => item.roll.name === 'item');
  assert.strictEqual(item.label, name, '기능 이름 수정은 계속 즉시 반영해야 합니다.');
  assert(!item.aliases.includes('보너스'));
}
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!상태'});
const linkedStatus = statusMessages.join('');
assert(!linkedStatus.includes('설명 전송'), '본문 전송만 하는 버튼을 기타 주사위로 나열하면 안 됩니다.');
assert(linkedStatus.includes('유효 주사위') && linkedStatus.includes('주문 설명'),
  '본문이 함께 있는 진짜 주사위와 원본 주문 항목은 보존해야 합니다.');
const noteRoll = helper.contractRolls(unsupported.id).find(item => item.roll.name === 'note');
assert(noteRoll && helper.executeContract(unsupported.id, linkedCaptionSheet.id, noteRoll.roll.key, '', '', false, '').ok,
  '목록에서 본문 버튼을 숨기더라도 명시적인 원본 실행 기능까지 삭제하면 안 됩니다.');

const oneWayVisibilitySheet = parseSheetContract(`
  <input name="attr_hide_marker" value="one-way"><input name="attr_hide_version" value="one"><input name="attr_hide_guard" value="guard">
  <input type="hidden" name="attr_rule_toggle">
  <label>선택 규칙<input type="checkbox" name="attr_rule_toggle" value="on"></label>
  <div class="extra"><label>추가 수치<input name="attr_extra_value" type="number" value="37"></label><button type="roll" name="roll_extra" value="&{template:test} {{title=추가 판정}} {{roll=[[1d100]]}}">추가 판정</button></div>
  <div class="basic"><button type="roll" name="roll_basic" value="&{template:test} {{title=기본 판정}} {{roll=[[1d100]]}}">기본 판정</button></div>
  <div class="always"><button type="roll" name="roll_always" value="[[1d6]]">항상 표시</button></div>
  <fieldset class="repeating_subskill"><input type="hidden" name="attr_rule_toggle"><div class="row-panel"><input name="attr_row_name"><button type="roll" name="roll_row" value="&{template:test} {{title=@{row_name}}} {{roll=[[1d100]]}}"></button></div></fieldset>
`, {id:'one-way-visibility', sourceHash:'one-way-visibility', css:`
  input[name=attr_rule_toggle]:not([value=on]) ~ .extra { display:none; }
  input[name=attr_rule_toggle][value=on] ~ .basic { display:none; }
  input[name=attr_rule_toggle][value=on] ~ .always { display:none; }
  .always { display:block !important; }
  .repeating_subskill input[name=attr_rule_toggle]:not([value=on]) ~ .row-panel { display:none; }
`});
assert(oneWayVisibilitySheet.rolls.find(roll => roll.name === 'extra').visibility,
  '짝이 되는 표시 CSS가 없어도 원본의 단방향 숨김 조건은 읽어야 합니다.');
assert(oneWayVisibilitySheet.fields.find(field => field.name === 'extra_value').visibility,
  '같은 조건 아래의 수치도 원본 표시 조건을 보존해야 합니다.');
runtime.KIBSheetContracts = [oneWayVisibilitySheet];
attributes.length = 0;
currentDefaults = Object.fromEntries(oneWayVisibilitySheet.fields.map(field => [field.name, field.default]));
['hide_marker', 'hide_version', 'hide_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
const oneWayToggle = attribute(unsupported.id, 'rule_toggle', '0');
const oneWayRowToggle = attribute(unsupported.id, 'repeating_subskill_-row1_rule_toggle', 'on');
attribute(unsupported.id, 'repeating_subskill_-row1_row_name', '행 판정');
helper.registerContract(oneWayVisibilitySheet);
for (const mode of ['0', 'on', '0']) {
  oneWayToggle.set('current', mode);
  helper.refresh();
  const labels = Array.from(helper.contractRolls(unsupported.id), item => item.label);
  assert.strictEqual(labels.includes('추가 판정'), mode === 'on', '선택 기능은 실제 활성화 상태만 따라야 합니다: ' + mode);
  assert.strictEqual(labels.includes('기본 판정'), mode !== 'on', '반대 방향 숨김 조건도 반영해야 합니다: ' + mode);
  assert(labels.includes('항상 표시'), '우선순위가 높은 원본 표시 선언은 유지해야 합니다.');
  assert(labels.includes('행 판정'), '반복 행의 같은 이름 컨트롤을 전역 값과 혼동하면 안 됩니다.');
}
oneWayToggle.set('current', 'on');
oneWayRowToggle.set('current', '0');
helper.refresh();
assert(!helper.contractRolls(unsupported.id).some(item => item.label === '행 판정'),
  '반복 행의 독립적인 비활성 조건도 즉시 반영해야 합니다.');

const sharedLabelRaw = '&{template:test} {{title=@{shared_title}}} {{target=[[50]]}} {{roll=[[1d100]]}}';
const sharedLabelSheet = parseSheetContract(`
  <input name="attr_shared_marker" value="shared-label"><input name="attr_shared_version" value="one"><input name="attr_shared_guard" value="guard">
  <input type="hidden" name="attr_npc"><input type="hidden" name="attr_shared_title">
  <div class="pc"><button type="roll" name="roll_appraise" data-i18n="appraise" value="${sharedLabelRaw}">appraise</button></div>
  <div class="npc"><button type="roll" name="roll_appraise" value="${sharedLabelRaw}"></button></div>
  <button type="roll" name="roll_different" value="${sharedLabelRaw}"></button>
  <button type="roll" name="roll_appraise" value="[[1d6]]"></button>
  <fieldset class="repeating_other"><button type="roll" name="roll_appraise" value="${sharedLabelRaw}"></button></fieldset>
`, {id:'shared-roll-labels', sourceHash:'shared-roll-labels', translations:[{appraise:'감정'}], css:`
  .npc { display:none; }
  input[name=attr_npc][value=on] ~ .npc { display:block; }
  input[name=attr_npc][value=on] ~ .pc { display:none; }
`});
assert.strictEqual(sharedLabelSheet.rolls[1].label, '감정',
  '같은 이름·원본 식·반복 영역인 복제 버튼은 명시된 번역 별칭을 공유해야 합니다.');
assert(sharedLabelSheet.rolls[1].aliases.includes('appraise'), '원본 식별자 명령도 보존해야 합니다.');
assert(sharedLabelSheet.rolls.slice(2).every(roll => roll.label !== '감정'),
  '다른 이름, 다른 식, 다른 반복 영역에는 복제 버튼의 이름을 전파하면 안 됩니다.');
const ambiguousSharedLabels = parseSheetContract(`
  <button type="roll" name="roll_appraise" value="${sharedLabelRaw}"></button>
  <button type="roll" name="roll_appraise" data-i18n="first" value="${sharedLabelRaw}">appraise</button>
  <button type="roll" name="roll_appraise" data-i18n="second" value="${sharedLabelRaw}">appraise</button>
`, {translations:[{first:'감정', second:'평가'}]});
assert.strictEqual(ambiguousSharedLabels.rolls[0].label, 'appraise',
  '원본에 서로 다른 표시명이 연결되어 있으면 어느 하나를 임의로 선택하지 않습니다.');
const fallbackSharedLabels = parseSheetContract(`
  <button type="roll" name="roll_drive_auto" value="${sharedLabelRaw}"></button>
  <button type="roll" name="roll_drive_auto" data-i18n="drive-auto" value="${sharedLabelRaw}">drive auto</button>
  <button type="roll" name="roll_own" value="${sharedLabelRaw}"></button>
  <button type="roll" name="roll_own" data-i18n="languages" value="${sharedLabelRaw}">languages</button>
  <button type="roll" name="roll_other_skill" value="${sharedLabelRaw}"></button>
  <button type="roll" name="roll_other_skill" data-i18n="other" value="${sharedLabelRaw}">other_skill</button>
`, {translations:[{'drive-auto':'자동차 운전', languages:'언어', other:'다른 기능'}]});
assert.strictEqual(fallbackSharedLabels.rolls[0].label, '자동차 운전',
  '표시명이 없어 내부 버튼명을 사용한 복제본도 같은 원본 굴림의 명시된 표시명을 공유해야 합니다.');
assert.strictEqual(fallbackSharedLabels.rolls[2].label, 'own',
  '내부 버튼명과 연결되지 않은 주변 분류 제목을 복제 버튼의 표시명으로 확산하면 안 됩니다.');
assert.strictEqual(fallbackSharedLabels.rolls[4].label, '다른 기능',
  '원본 별칭에 밑줄이 그대로 있는 경우의 정확 일치도 보존해야 합니다.');
runtime.KIBSheetContracts = [sharedLabelSheet];
attributes.length = 0;
currentDefaults = Object.fromEntries(sharedLabelSheet.fields.map(field => [field.name, field.default]));
['shared_marker', 'shared_version', 'shared_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
const sharedNpc = attribute(unsupported.id, 'npc', 'on');
helper.registerContract(sharedLabelSheet);
for (const mode of ['on', '0', 'on']) {
  sharedNpc.set('current', mode);
  helper.refresh();
  const matches = helper.contractRolls(unsupported.id).filter(item => item.label === '감정');
  assert.strictEqual(matches.length, 1, '모드 전환 후 한국어 항목은 활성 버튼 한 개만 인식해야 합니다.');
  assert.strictEqual(matches[0].roll.raw, sharedLabelRaw);
}

const hiddenListingSheet = parseSheetContract(`
  <input name="attr_list_marker" value="list-hidden"><input name="attr_list_version" value="one"><input name="attr_list_guard" value="guard">
  <input type="hidden" name="attr_list_gate" value="0">
  <button type="roll" class="aux" name="roll_auxiliary" value="[[1d10]]">내부후속</button>
  <button type="roll" style="display:none" name="roll_inline" value="[[1d8]]">인라인 후속</button>
  <button type="roll" class="aux" name="roll_shared" value="[[1d6]]">공유 판정</button>
  <button type="roll" name="roll_shared" value="[[1d6]]">공유 판정</button>
  <button type="roll" class="conditional" name="roll_conditional" value="[[1d4]]">조건 판정</button>
  <button type="roll" class="cascade" name="roll_cascade" value="[[1d12]]">우선 표시</button>
  <button type="roll" class="uncertain" name="roll_uncertain" value="[[1d20]]">불확정 버튼</button>
  <button type="roll" class="unspecified" name="roll_unspecified" value="[[1d20]]">미지원 표시</button>
  <div class="storage"><button type="roll" name="roll_storage" value="[[1d2]]">기존 저장소</button></div>
`, {id:'hidden-roll-listing', sourceHash:'hidden-roll-listing', css:`
  button { display:unset; }
  .aux, .conditional, .cascade, .uncertain, .storage { display:none; }
  .aux:before { display:block; }
  .aux::after { display:unset; }
  input[name=attr_list_gate][value=on] ~ .conditional { display:block; }
  .cascade { display:block !important; }
  .state:has(.future) .uncertain { display:block; }
  .unspecified { display:none; display:unset; }
`});
for (const name of ['auxiliary', 'inline']) {
  const roll = hiddenListingSheet.rolls.find(roll => roll.name === name);
  assert.strictEqual(roll.listHidden, true, '원본에서 버튼 자체가 고정 숨김이면 일반 목록에서만 제외해야 합니다.');
  assert.strictEqual(roll.visibility, undefined, '목록 제외를 원본 실행 불가 조건으로 바꾸면 안 됩니다.');
}
for (const name of ['conditional', 'cascade', 'uncertain', 'unspecified', 'storage']) {
  assert(!hiddenListingSheet.rolls.find(roll => roll.name === name).listHidden,
    '조건부·불확정 표시와 조상 저장소의 실행을 고정 숨김 버튼으로 단정하면 안 됩니다: ' + name);
}
const hiddenListingRestored = {KIBSheetContracts:[]};
vm.runInNewContext(require('./embed-sheet-recognition').render([hiddenListingSheet]), hiddenListingRestored);
assert.strictEqual(JSON.stringify(hiddenListingRestored.KIBSheetContracts[0].rolls.map(roll => !!roll.listHidden)),
  JSON.stringify(hiddenListingSheet.rolls.map(roll => !!roll.listHidden)), '목록 제외 정보는 배포용 압축/복원에서도 유지해야 합니다.');
runtime.KIBSheetContracts = [hiddenListingRestored.KIBSheetContracts[0]];
attributes.length = 0;
currentDefaults = Object.fromEntries(hiddenListingSheet.fields.map(field => [field.name, field.default]));
['list_marker', 'list_version', 'list_guard'].forEach(name => attribute(unsupported.id, name, currentDefaults[name]));
const listingGate = attribute(unsupported.id, 'list_gate', '0');
helper.registerContract(hiddenListingRestored.KIBSheetContracts[0]);
for (const mode of ['0', 'on', '0']) {
  listingGate.set('current', mode);
  helper.refresh();
  statusMessages.length = 0;
  events['chat:message']({type:'api', playerid:'gm', content:'!!상태'});
  const status = statusMessages.join('');
  assert(!status.includes('내부후속') && !status.includes('인라인 후속'), '숨은 보조 버튼을 상태에 나열하면 안 됩니다.');
  assert.strictEqual((status.match(/공유 판정/g) || []).length, 1, '숨은 복제본을 제외한 뒤 보이는 원본은 한 번 유지해야 합니다.');
  assert.strictEqual(status.includes('조건 판정'), mode === 'on', '실제 조건부 버튼은 상태 변경을 계속 따라야 합니다.');
}
const retainedAuxiliary = helper.contractRolls(unsupported.id).find(item => item.roll.name === 'auxiliary');
assert(retainedAuxiliary && helper.executeContract(unsupported.id, hiddenListingSheet.id, retainedAuxiliary.roll.key, '', '', false, '').ok,
  '일반 목록에서 숨겨도 원본 보조 굴림의 명시적 실행은 유지해야 합니다.');
statusMessages.length = 0;
events['chat:message']({type:'api', playerid:'gm', content:'!!검색 내부후속'});
assert(statusMessages.join('').includes('항목을 찾지 못했습니다'), '검색 목록에서도 내부 후속 굴림을 나열하면 안 됩니다.');

console.log('Sheet room recognition: ok');
