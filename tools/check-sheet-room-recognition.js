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

console.log('Sheet room recognition: ok');
