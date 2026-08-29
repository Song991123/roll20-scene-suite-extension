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
const ambiguous = helper.inspectContracts(firstCharacter.id);
assert.strictEqual(ambiguous.status, 'ambiguous', JSON.stringify((ambiguous.matches || []).map((item) => ({
  id: item.id, score: item.score, ratio: item.ratio, rankScore: item.rankScore, eligible: item.eligible,
}))));
assert(ambiguous.error && !/골라|선택/.test(ambiguous.error),
  '방 증거가 충돌할 때 GM에게 시트를 고르게 하면 안 됩니다.');

console.log('Sheet room recognition: ok');
