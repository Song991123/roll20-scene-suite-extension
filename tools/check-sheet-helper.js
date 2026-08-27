const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'),
  'utf8',
);

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

const characterId = 'character-1';
const fixedFields = [
  ['san', '이성'], ['luck', '행운'], ['str', '근력'], ['con', '건강'], ['siz', '크기'],
  ['dex', '민첩성'], ['app', '외모'], ['edu', '교육'], ['int', '지능'], ['pow', '정신력'],
  ['appraise', '감정'], ['archaeology', '고고학'], ['spot_hidden', '관찰력'],
  ['fighting_brawl', '근접전(격투)'], ['fighting_swords', '근접전(도검)'],
  ['fighting_ax', '근접전(도끼)'], ['fighting_mace', '근접전(도리깨)'],
  ['fighting_lance', '근접전(창)'], ['fighting_whip', '근접전(채찍)'],
  ['mech_repair', '기계수리'], ['jump', '도약'], ['mouth_talk', '독순술'],
  ['animal_control', '동물 다루기'], ['listen', '듣기'], ['fast_talk', '말재주'],
  ['charm', '매혹'], ['law', '법률'], ['disguise', '변장'], ['firearms_handgun', '사격(권총)'],
  ['firearms_rifle', '사격(라이플/산탄총)'], ['persuade', '설득'], ['sleight_of_hand', '손놀림'],
  ['swim', '수영'], ['ride', '승마'], ['psychology', '심리학'], ['language_own', '언어(모국어)'],
  ['history', '역사'], ['locksmith', '열쇠공'], ['climb', '오르기'], ['occult', '오컬트'],
  ['intimidate', '위협'], ['stealth', '은밀행동'], ['first_aid', '응급처치'], ['medicine', '의료'],
  ['anthropology', '인류학'], ['drive_auto', '자동차 운전'], ['library_use', '자료 조사'],
  ['natural_world', '자연'], ['credit_rating', '재력'], ['elec_repair', '전기 수리'],
  ['elec_machin', '전자기기'], ['psychoanalysis', '정신분석'], ['op_hv_machine', '중장비 조작'],
  ['hypnosis', '최면술'], ['track', '추적'], ['computer', '컴퓨터 사용'],
  ['cthulhu_mythos', '크툴루 신화'], ['throw', '투척'], ['shelling', '포격'], ['boom', '폭파'],
  ['navigate', '항법'], ['accounting', '회계'], ['dodge', '회피'],
];

const defaults = {
  character_name: '테스트 탐사자',
  dice_type: '{{roll=[[1d100]]}}',
  template_common: '',
  temp_insane: '0',
  indef_insane: '0',
  hp: '12', hp_max: '12', mp: '10', mp_max: '10', san_max: '70', san_start: '70', mov: '8',
  damage_bonus: '1d4', build: '1', dying: '0', 'major-wound-toggle': '0',
  free_dice: '2d6+3', rand_maddess: '1',
  weapon_name_fix: '비무장', weapon_range_fix: '-', weapon_attacks_fix: '1',
  weapon_ammo_fix: '-', weapon_malf_fix: '-',
};
fixedFields.forEach(([name], index) => {
  defaults[name] = String(30 + (index % 7) * 5);
});
defaults.spot_hidden = 'floor(@{spot_hidden_mod})';
defaults.spot_hidden_mod = '55';
defaults.appraise = 'floor(@{appraise_mod})';
defaults.appraise_mod = '45';
defaults.dodge = 'floor(@{dodge_base} + @{dodge_mod})';
defaults.dodge_base = '25';
defaults.dodge_mod = '10';

Object.assign(defaults, {
  ori_science_title: '천문학', ori_science: '61',
  ori_foreign_title: '라틴어', ori_foreign: '42',
  ori_art_title: '사진', ori_art: '55',
  ori_live_title: '산악', ori_live: '48',
  ori_other_control_title: '보트 조종', ori_other_control: '37',
  ori_other_weapon_title: '도검술', ori_other_weapon: '44',
  defense_name_01: '가죽 각반', defense_pice_01: '오른다리', defense_value_01: '1d2', defense_desc_01: '가죽 보호대',
  defense_name_07: '철제 투구', defense_pice_07: '머리', defense_value_07: '2', defense_desc_07: '단단한 투구',
});

const attributeValues = {
  defense_name_01: '가죽 각반',
  defense_pice_01: '오른다리',
  defense_value_01: '1d2',
  defense_desc_01: '가죽 보호대',
  repeating_science_rowA_science_title: '화학',
  repeating_science_rowA_science: '58',
  repeating_science_rowG_science_title: '지질학',
  repeating_science_rowG_science_mod: '33',
  _reporder_repeating_science: 'rowG,rowA',
  repeating_foreign_rowB_foreign_title: '프랑스어',
  repeating_foreign_rowB_foreign: '39',
  repeating_art_rowC_art_title: '회화',
  repeating_art_rowC_art: '47',
  repeating_live_rowD_live_title_read: '극지',
  repeating_live_rowD_live: '43',
  repeating_other_control_rowE_other_control_title: '항공기 조종',
  repeating_other_control_rowE_other_control: '36',
  repeating_other_weapon_rowF_other_weapon_title: '봉술',
  repeating_other_weapon_rowF_other_weapon: '45',
  _reporder_repeating_other_weapon: 'rowF',
  repeating_weapon_rowW1_weapon_name: '리볼버',
  repeating_weapon_rowW1_weapon_skill: '@{firearms_handgun}',
  repeating_weapon_rowW1_weapon_damage: '1d10',
  repeating_weapon_rowW1_weapon_db: '+0',
  repeating_weapon_rowW1_weapon_range: '15m',
  repeating_weapon_rowW1_weapon_attacks: '1',
  repeating_weapon_rowW1_weapon_ammo: '6',
  repeating_weapon_rowW1_weapon_malf: '100',
  repeating_weapon_rowW2_weapon_name: '지팡이',
  repeating_weapon_rowW2_weapon_skill: '@{repeating_other_weapon_$0_other_weapon}',
  repeating_weapon_rowW2_weapon_damage: '1d6',
  repeating_weapon_rowW2_weapon_db: '+round((@{damage_bonus})/2)',
  repeating_weapon_rowW2_weapon_range: '근접',
  repeating_weapon_rowW2_weapon_attacks: '1',
  repeating_weapon_rowW2_weapon_ammo: '-',
  repeating_weapon_rowW2_weapon_malf: '-',
  repeating_weapon_rowW3_weapon_name: '기본값 무기',
  repeating_magic_rowM1_magic_flag: '1',
  repeating_magic_rowM1_magic_name: '문 열기',
  repeating_magic_rowM1_magic_time: '1라운드',
  repeating_magic_rowM1_magic_cost: '마력 2',
  repeating_magic_rowM1_magic_desc: '잠긴 문을 연다.',
  repeating_magic_rowM2_magic_flag: '0',
  repeating_magic_rowM2_magic_name: '기억 지우기',
  repeating_magic_rowM2_magic_time: '즉시',
  repeating_magic_rowM2_magic_cost: '마력 5',
  repeating_magic_rowM2_magic_desc: '짧은 기억을 지운다.',
};

const repeatingOrder = {
  science: ['rowG', 'rowA'],
  foreign: ['rowB'],
  art: ['rowC'],
  live: ['rowD'],
  other_control: ['rowE'],
  other_weapon: ['rowF'],
  weapon: ['rowW1', 'rowW2', 'rowW3'],
  magic: ['rowM1', 'rowM2'],
};

const character = roll20Object(characterId, {
  name: '저널 이름',
  controlledby: 'player-1',
});
const gmCharacter = roll20Object('character-gm', { name: '이경태', controlledby: '' });
const playerCharacter = roll20Object('character-player', { name: '이경호', controlledby: 'player-2' });
const gmSpeakerCharacter = roll20Object('character-gm-speaker', { name: 'GM', controlledby: '' });
const characters = [character, gmCharacter, playerCharacter, gmSpeakerCharacter];
const players = {
  gm: roll20Object('gm', { _displayname: '마렌 (GM)', speakingas: '' }),
  'player-1': roll20Object('player-1', { _displayname: '테스터', speakingas: '' }),
};
let attributeObjects = Object.entries(attributeValues).map(([name, current], index) =>
  roll20Object(`attribute-${index}`, {
    _characterid: characterId,
    characterid: characterId,
    name,
    current,
    max: '',
  }),
);
const sent = [];
const events = {};
const created = [];
const getAttrByNameCalls = [];

const runtime = {
  state: {
    hide_tracking: true,
    KIBSheetHelper: {
      profileId: 'coc7',
      trackingMode: 'gm',
      managerCharacterId: characterId,
      keepMe: '보존',
    },
  },
  KIBScene: {
    broadcast(name, payload) {
      sent.push({ event: name, payload });
    },
  },
  on(name, callback) {
    events[name] = callback;
  },
  getAttrByName(id, name, valueType) {
    getAttrByNameCalls.push(name);
    if (!characters.some((item) => item.id === id)) return undefined;
    const object = attributeObjects.find((item) =>
      item.get('_characterid') === id && item.get('name') === name);
    if (object) return object.get(valueType === 'max' ? 'max' : 'current');
    if (Object.prototype.hasOwnProperty.call(defaults, name)) return defaults[name];
    const ordered = name.match(/^repeating_(.+)_\$(\d+)_(.+)$/);
    if (!ordered) return undefined;
    const rowId = (repeatingOrder[ordered[1]] || [])[Number(ordered[2])];
    if (!rowId) return undefined;
    const exact = `repeating_${ordered[1]}_${rowId}_${ordered[3]}`;
    const rowObject = attributeObjects.find((item) => item.get('_characterid') === id && item.get('name') === exact);
    if (rowObject) return rowObject.get(valueType === 'max' ? 'max' : 'current');
    if (ordered[1] === 'science' && ordered[3] === 'science')
      return 'floor(@{science_base} + @{science_mod})';
    if (ordered[1] === 'science' && ordered[3] === 'science_base') return '1';
    if (ordered[1] === 'weapon') {
      const weaponDefaults = {
        weapon_skill: '@{fighting_brawl}',
        weapon_damage: '1d3',
        weapon_db: '+0',
        weapon_range: '',
        weapon_attacks: '',
        weapon_ammo: '',
        weapon_malf: '',
      };
      if (Object.prototype.hasOwnProperty.call(weaponDefaults, ordered[3]))
        return weaponDefaults[ordered[3]];
    }
    return undefined;
  },
  findObjs(query) {
    if (query._type === 'attribute' || query.type === 'attribute') {
      const id = query._characterid || query.characterid;
      return attributeObjects.filter((item) => !id || item.get('_characterid') === id).slice().reverse();
    }
    if (query._type === 'character' || query.type === 'character') return characters.slice();
    if (query._type === 'handout' || query.type === 'handout')
      return created.filter((item) => item.get('_type') === 'handout' &&
        (!query.name || item.get('name') === query.name));
    return [];
  },
  getObj(type, id) {
    if (type === 'character') return characters.find((item) => item.id === id) || null;
    if (type === 'player') return players[id] || null;
    if (type === 'handout') return created.find((item) => item.id === id && item.get('_type') === 'handout') || null;
    return null;
  },
  createObj(type, values) {
    const normalized = { _type: type, ...values };
    if (type === 'attribute') {
      normalized._characterid = normalized._characterid || normalized.characterid;
      normalized.characterid = normalized.characterid || normalized._characterid;
    }
    const object = roll20Object(`${type}-${created.length}`, normalized);
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
};

vm.createContext(runtime);
vm.runInContext(source, runtime);

const helper = runtime.KIBSheetHelper;

function setCurrent(name, current) {
  const object = attributeObjects.find((item) => item.get('name') === name);
  if (object) object.set('current', current);
  else defaults[name] = current;
}

const scanCallStart = getAttrByNameCalls.length;
const scanned = helper.scan(characterId, true);
const scanCalls = getAttrByNameCalls.slice(scanCallStart);
assert.strictEqual(scanned.ok, true);
assert.strictEqual(scanned.matched, true);
assert.strictEqual(scanned.fields.length, fixedFields.length + 13);
fixedFields.forEach(([, label]) => {
  assert(scanned.fields.some((item) => item.label === label), `${label} 판정 누락`);
});
['천문학', '라틴어', '사진', '산악', '보트 조종', '도검술', '화학', '지질학', '프랑스어', '회화', '극지', '항공기 조종', '봉술']
  .forEach((label) => assert(scanned.fields.some((item) => item.label === label), `${label} 사용자 항목 누락`));
assert.strictEqual(scanned.weapons.length, 4);
const defaultWeapon = scanned.weapons.find((item) => item.label === '기본값 무기');
assert.strictEqual(defaultWeapon.skill, '@{fighting_brawl}');
assert.strictEqual(defaultWeapon.damage, '1d3');
assert.strictEqual(defaultWeapon.db, '+0');
assert.strictEqual(defaultWeapon.ammoAttr, 'repeating_weapon_rowW3_weapon_ammo');
const defaultScience = scanned.fields.find((item) => item.label === '지질학');
assert.strictEqual(defaultScience.key, 'repeating_science_rowG_science');
assert.strictEqual(defaultScience.attr, 'repeating_science_$0_science');
assert(
  scanned.fields.findIndex((item) => item.label === '지질학') <
    scanned.fields.findIndex((item) => item.label === '화학'),
  'science 반복 순서 rowG,rowA가 반영되어야 합니다.',
);
assert.strictEqual(
  getAttrByNameCalls.filter((name) => /^_reporder_repeating_/.test(name)).length,
  0,
  '_reporder_repeating_* 값은 속성 객체에서 읽어야 합니다.',
);
assert.strictEqual(scanned.spells.length, 2);
assert.strictEqual(scanned.armors.length, 2);
assert(
  !scanCalls.includes('defense_name_01') &&
    !scanCalls.includes('defense_pice_01') &&
    !scanCalls.includes('defense_value_01') &&
    !scanCalls.includes('defense_desc_01'),
  '이미 읽은 속성 객체를 getAttrByName으로 다시 조회하면 안 됩니다.',
);
assert.strictEqual(runtime.state.KIBSheetHelper.keepMe, '보존');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm');

const cutinItems = helper.cutinItems();
const expectedCutinKinds = [
  ['field', '관찰력'],
  ['weapon', '리볼버'],
  ['spell', '문 열기'],
  ['armor', '철제 투구'],
  ['free', '자유 주사위'],
  ['temporary-madness', '일시적 광기'],
  ['indefinite-madness', '장기적 광기'],
  ['luck', '행운 결정'],
  ['hit-location', '명중부위'],
];
expectedCutinKinds.forEach(([kind, label]) => {
  assert(
    cutinItems.some((item) => item.kind === kind && item.label === label && item.key),
    `${label} 컷인 항목의 kind/key가 없습니다.`,
  );
});
assert.strictEqual(
  new Set(cutinItems.map((item) => item.key)).size,
  cutinItems.length,
  '컷인 항목 key는 서로 달라야 합니다.',
);
scanned.fields.forEach((field) => {
  assert(cutinItems.some((item) => item.kind === 'field' && item.label === field.label), `${field.label} 판정 컷인 누락`);
});
scanned.weapons.forEach((weapon) => {
  assert(cutinItems.some((item) => item.kind === 'weapon' && item.label === weapon.label), `${weapon.label} 무기 컷인 누락`);
});
scanned.spells.forEach((spell) => {
  assert(cutinItems.some((item) => item.kind === 'spell' && item.label === spell.label), `${spell.label} 주문 컷인 누락`);
});
scanned.armors.forEach((armor) => {
  assert(cutinItems.some((item) => item.kind === 'armor' && item.label === armor.label), `${armor.label} 방어구 컷인 누락`);
});

function cutinItem(kind, label) {
  const item = cutinItems.find((candidate) => candidate.kind === kind && candidate.label === label);
  assert(item, `${label} 컷인 항목이 없습니다.`);
  return item;
}

const manager = helper.refresh();
assert(manager, '관리 핸드아웃을 만들지 못했습니다.');
const managerNotes = manager.get('notes');
assert(managerNotes.includes('기본값 무기'));
assert(managerNotes.includes('피해 1d3+0'));
assert(managerNotes.includes('문 열기'));
assert(managerNotes.includes('시전 시간 1라운드'));
assert.strictEqual(manager.get('inplayerjournals'), '');
const playerHelp = created.find((item) => item.get('name') === '[PL] 시트 헬퍼 사용법');
assert(playerHelp, 'PL 사용법 핸드아웃을 만들지 못했습니다.');
assert.strictEqual(playerHelp.get('inplayerjournals'), 'all');
assert(playerHelp.get('notes').includes('!!관찰력'));
assert(!playerHelp.get('notes').includes('!시트 관리'), 'PL 사용법에 GM 명령이 들어가면 안 됩니다.');

function runBangBang(content) {
  const before = sent.length;
  events['chat:message']({ type: 'api', content, playerid: 'player-1', who: '저널 이름' });
  return sent.slice(before);
}

assert(runBangBang('!!관찰력').some((item) => item.content && item.content.includes('{{subject=관찰력}}')));
assert(runBangBang('!!리볼버').some((item) => item.content && item.content.includes('{{subject=리볼버}}')));
assert(runBangBang('!!문 열기').some((item) => item.content && item.content.includes('{{side_subject=주문}}')));
assert(runBangBang('!!철제 투구').some((item) => item.content && item.content.includes('{{sub_subject2=방어구}}')));
assert(runBangBang('!!비밀 관찰력').some((item) => item.content && item.content.indexOf('/w gm ') === 0));

const sanBeforeBangBang = Number(defaults.san);
runBangBang('!!이성 -1d3');
let sanAttribute = attributeObjects.find((item) => item.get('_characterid') === characterId && item.get('name') === 'san');
assert.strictEqual(Number(sanAttribute.get('current')), sanBeforeBangBang - 3);
runBangBang('!!이성+1d3');
assert.strictEqual(Number(sanAttribute.get('current')), sanBeforeBangBang);

const invalidSanBefore = sanAttribute.get('current');
['!!이성 1d3', '!!이성 -1d0', '!!이성 +101d3', '!!이성 +알수없음'].forEach((content) => {
  const messages = runBangBang(content);
  assert.strictEqual(sanAttribute.get('current'), invalidSanBefore, `${content}가 이성을 바꾸면 안 됩니다.`);
  const error = messages.find((item) => item.who === '시트 헬퍼');
  assert(error && error.options && error.options.noarchive === true, `${content} 오류는 기록에 남지 않아야 합니다.`);
});

const hpAttribute = attributeObjects.find((item) => item.get('_characterid') === characterId && item.get('name') === 'hp') || runtime.createObj('attribute', {
  _characterid: characterId, characterid: characterId, name: 'hp', current: '6', max: '12',
});
hpAttribute.set('current', '6');
events['chat:message']({ type: 'general', content: 'hp+3', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(hpAttribute.get('current'), '6', '콜론 없는 일반 채팅은 체력을 바꾸면 안 됩니다.');
events['chat:message']({ type: 'general', content: ':hp+3', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(hpAttribute.get('current'), '9', '콜론을 붙인 일반 채팅은 체력을 바꿔야 합니다.');

const generalSanBefore = Number(sanAttribute.get('current'));
events['chat:message']({ type: 'general', content: '이성-1', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(Number(sanAttribute.get('current')), generalSanBefore, '콜론 없는 일반 채팅은 이성을 바꾸면 안 됩니다.');
events['chat:message']({ type: 'general', content: ':이성-1', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(Number(sanAttribute.get('current')), generalSanBefore - 1, '콜론을 붙인 일반 채팅은 이성을 바꿔야 합니다.');
const attributeCountBeforeUnknown = attributeObjects.length;
events['chat:message']({ type: 'general', content: ':없는항목+1', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(attributeObjects.length, attributeCountBeforeUnknown, '없는 항목은 새로 만들면 안 됩니다.');
hpAttribute.set('current', '12');
sanAttribute.set('current', String(generalSanBefore));

const unknownBangBang = runBangBang('!!없는 항목');
assert(unknownBangBang.some((item) => item.who === '시트 헬퍼' && item.options && item.options.noarchive === true));
const numericBefore = sent.length;
events['chat:message']({ type: 'api', content: '!!1d100', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(sent.length, numericBefore, '!! 일반 주사위는 시트 헬퍼가 가로채면 안 됩니다.');

const conflictScan = helper.scan(characterId);
const originalSpellLabel = conflictScan.spells[0].label;
conflictScan.spells[0].label = '관찰력';
const conflictBangBang = runBangBang('!!관찰력');
conflictScan.spells[0].label = originalSpellLabel;
const conflictError = conflictBangBang.find((item) => item.who === '시트 헬퍼');
assert(
  conflictError && conflictError.content.includes('!!판정 관찰력') && conflictError.content.includes('!!주문 관찰력'),
  JSON.stringify(conflictBangBang),
);

assert.strictEqual(helper.roll(characterId, '관찰력', { mode: '보너스1' }).ok, true);
let last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc}'));
assert(last.includes('{{character_name=테스트 탐사자}}'));
assert(last.includes('{{dice_type=[[1]]}}'));
assert(last.includes('floor((55))'));
assert(!last.includes('@{spot_hidden'), '중첩 속성 참조는 실제 판정식으로 풀어야 합니다.');

[
  ['{{roll=[[1d100]]}}', '{{roll=[[1d100]]}}'],
  ['{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[1]]}}', '{{dice_type=[[1]]}}'],
  ['{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[2]]}}', '{{dice_type=[[2]]}}'],
  ['{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[-1]]}}', '{{dice_type=[[-1]]}}'],
  ['{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[-2]]}}', '{{dice_type=[[-2]]}}'],
].forEach(([selected, expected]) => {
  setCurrent('dice_type', selected);
  assert.strictEqual(helper.roll(characterId, '관찰력', {}).ok, true);
  const output = sent.filter((item) => item.content).at(-1).content;
  assert(output.includes(expected), '현재 시트의 보너스·패널티 선택을 따라야 합니다.');
});
[
  ['1', '{{dice_type=[[1]]}}'],
  ['2', '{{dice_type=[[2]]}}'],
  ['-1', '{{dice_type=[[-1]]}}'],
  ['-2', '{{dice_type=[[-2]]}}'],
  ['0', '{{roll=[[1d100]]}}'],
].forEach(([selected, expected]) => {
  setCurrent('dice_type', selected);
  assert.strictEqual(helper.roll(characterId, '관찰력', {}).ok, true);
  const output = sent.filter((item) => item.content).at(-1).content;
  assert(output.includes(expected), '단일 숫자 보너스 또는 페널티 값을 그대로 읽어야 합니다.');
});
setCurrent('dice_type', '-2');
getAttrByNameCalls.length = 0;
assert.strictEqual(helper.roll(characterId, '관찰력', { mode: '보너스1' }).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{dice_type=[[1]]}}'), '명령에 적은 주사위 방식이 시트 선택보다 우선입니다.');
assert(
  !getAttrByNameCalls.includes('dice_type'),
  '명령에 주사위 방식을 적었으면 시트의 dice_type을 다시 읽지 않아야 합니다.',
);
setCurrent('dice_type', '{{roll=[[1d100]]}}');

assert.strictEqual(helper.roll(characterId, '감정', {}).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('floor((45))'));
assert(!last.includes('@{appraise'), '감정 판정에 풀리지 않은 appraise 속성이 남으면 안 됩니다.');

assert.strictEqual(helper.roll(characterId, '회피', {}).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('floor((25) + (10))'));
assert(!last.includes('@{dodge'), '다단계 판정식의 속성 참조도 끝까지 풀어야 합니다.');

function inlineResultMessage(values, options = {}) {
  const entries = Object.entries(values);
  return {
    type: options.type || 'general',
    rolltemplate: 'coc',
    playerid: options.playerid || 'player-1',
    who: options.who || '테스트 탐사자',
    content: [
      options.token ? `{{kib_sheet_result=${options.token}}}` : '',
      '{{subject=관찰력}}',
      '{{character_name=테스트 탐사자}}',
      ...entries.map(([name], index) => `{{${name}=$[[${index}]]}}`),
    ].filter(Boolean).join(' '),
    inlinerolls: entries.map(([, total]) => ({ results: { total } })),
  };
}

function latestPendingToken() {
  const message = sent.filter((item) => item.content && item.content.includes('kib_sheet_result=')).at(-1);
  const match = message && message.content.match(/\{\{kib_sheet_result=([^}]+)\}\}/);
  assert(match, '판정 결과 추적 토큰이 없습니다.');
  return match[1];
}

function payloadFromCommand(content) {
  const beforeSent = sent.length;
  const beforeResults = sent.filter((item) => item.event === 'sheet:result').length;
  events['chat:message']({ type: 'api', content, playerid: 'player-1', who: '저널 이름' });
  const message = sent.slice(beforeSent).filter((item) => item.content && item.content.includes('kib_sheet_result=')).at(-1);
  const match = message && message.content.match(/\{\{kib_sheet_result=([^}]+)\}\}/);
  assert(match, `${content} 실행 결과 추적 토큰이 없습니다.`);
  events['chat:message']({
    type: 'general',
    playerid: 'player-1',
    who: '저널 이름',
    content: `{{kib_sheet_result=${match[1]}}}`,
    inlinerolls: [],
  });
  const results = sent.filter((item) => item.event === 'sheet:result');
  assert.strictEqual(results.length, beforeResults + 1, `${content} 결과가 한 번 전달되어야 합니다.`);
  return results.at(-1).payload;
}

function helperResult(mode, rolls, target = 50, secret = false) {
  const before = sent.filter((item) => item.event === 'sheet:result').length;
  assert.strictEqual(helper.roll(characterId, '관찰력', { mode, secret }).ok, true);
  const values = { success: target, hard: Math.floor(target / 2), extreme: Math.floor(target / 5) };
  if (mode === 'normal') values.roll = rolls[0];
  else {
    values.roll1 = rolls[0];
    values.roll2 = rolls[1];
    values.roll3 = rolls[2] == null ? 50 : rolls[2];
    values.dice_type = { bonus1: 1, bonus2: 2, penalty1: -1, penalty2: -2 }[mode];
  }
  events['chat:message'](inlineResultMessage(values, {
    token: latestPendingToken(),
    type: secret ? 'whisper' : 'general',
  }));
  const results = sent.filter((item) => item.event === 'sheet:result');
  assert.strictEqual(results.length, before + 1, '판정 결과는 한 번만 전달되어야 합니다.');
  return results.at(-1).payload;
}

[
  [1, 50, 'critical', '대성공'],
  [10, 50, 'extreme', '극단적 성공'],
  [25, 50, 'hard', '어려운 성공'],
  [50, 50, 'success', '보통 성공'],
  [51, 50, 'failure', '실패'],
  [100, 50, 'fumble', '대실패'],
  [95, 49, 'failure', '실패'],
  [96, 49, 'fumble', '대실패'],
].forEach(([roll, target, outcome, label]) => {
  const payload = helperResult('normal', [roll], target);
  assert.strictEqual(payload.result.total, roll);
  assert.strictEqual(payload.outcome, outcome);
  assert.strictEqual(payload.outcomeLabel, label);
});

assert.strictEqual(helperResult('bonus1', [100, 1]).outcome, 'critical');
assert.strictEqual(helperResult('bonus2', [51, 25, 40]).outcome, 'hard');
assert.strictEqual(helperResult('penalty1', [1, 50]).outcome, 'success');
assert.strictEqual(helperResult('penalty2', [1, 51, 100]).outcome, 'fumble');

const secretPayload = helperResult('normal', [25], 50, true);
assert.strictEqual(secretPayload.secret, true, '비밀판정의 secret 표시가 보존되어야 합니다.');

[
  ['field', '관찰력', helper.roll(characterId, '관찰력', {})],
  ['weapon', '리볼버', helper.rollWeapon(characterId, '리볼버', false)],
  ['spell', '문 열기', helper.showSpell(characterId, '문 열기', false)],
  ['armor', '철제 투구', helper.rollArmor(characterId, '철제 투구', false)],
  ['free', '자유 주사위', helper.rollFree(characterId, false)],
  ['luck', '행운 결정', helper.rollLuck(characterId, false)],
  ['hit-location', '명중부위', helper.rollHitLocation(characterId, false)],
].forEach(([kind, label, result]) => {
  assert.strictEqual(result.ok, true, `${label} 실행 실패`);
  assert.strictEqual(
    result.payload && result.payload.cutinKey,
    cutinItem(kind, label).key,
    `${label} 실행 payload와 컷인 목록 key가 다릅니다.`,
  );
});
assert.strictEqual(
  payloadFromCommand('!!일시적광기').cutinKey,
  cutinItem('temporary-madness', '일시적 광기').key,
  '일시적 광기 실행 payload와 컷인 목록 key가 다릅니다.',
);
assert.strictEqual(
  payloadFromCommand('!!장기적광기').cutinKey,
  cutinItem('indefinite-madness', '장기적 광기').key,
  '장기적 광기 실행 payload와 컷인 목록 key가 다릅니다.',
);

const nativeBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message'](inlineResultMessage({
  success: 50,
  hard: 25,
  extreme: 10,
  roll1: 70,
  roll2: 9,
  roll3: 40,
  dice_type: 2,
}));
const nativeResults = sent.filter((item) => item.event === 'sheet:result');
assert.strictEqual(nativeResults.length, nativeBefore + 1);
const nativePayload = nativeResults.at(-1).payload;
assert.strictEqual(nativePayload.source, 'sheet');
assert.strictEqual(nativePayload.label, '관찰력');
assert.strictEqual(nativePayload.result.mode, 'bonus2');
assert.strictEqual(nativePayload.result.total, 9);
assert.strictEqual(nativePayload.outcome, 'extreme');
assert.strictEqual(nativePayload.outcomeLabel, '극단적 성공');
assert.strictEqual(nativePayload.secret, false);

const nativePenaltyBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message'](inlineResultMessage({
  success: 50,
  hard: 25,
  extreme: 10,
  roll1: 9,
  roll2: 70,
  roll3: 40,
  dice_type: -1,
}));
const nativePenaltyResults = sent.filter((item) => item.event === 'sheet:result');
assert.strictEqual(nativePenaltyResults.length, nativePenaltyBefore + 1);
assert.strictEqual(nativePenaltyResults.at(-1).payload.result.mode, 'penalty1');
assert.strictEqual(nativePenaltyResults.at(-1).payload.result.total, 70);

const specialBefore = sent.filter((item) => item.event === 'sheet:result').length;
const specialMessage = inlineResultMessage({ success: 50, hard: 25, extreme: 10, roll: 25 });
specialMessage.content = specialMessage.content.replace('{{subject=관찰력}}', '{{subject=생물|학?&=}}');
events['chat:message'](specialMessage);
const specialResults = sent.filter((item) => item.event === 'sheet:result');
assert.strictEqual(specialResults.length, specialBefore + 1);
assert(!/[|?&=]/.test(specialResults.at(-1).payload.cutinKey), '컷인 연결 키에 매크로 구분자가 남으면 안 됩니다.');

let standalonePayload = null;
delete runtime.KIBScene.broadcast;
runtime.KIBScene.adapters = {
  cutin: { events: { 'sheet:result': (payload) => { standalonePayload = payload; } } },
};
events['chat:message'](inlineResultMessage({ success: 50, hard: 25, extreme: 10, roll: 50 }));
assert(standalonePayload, '00 없이 08+10만 사용해도 판정 결과가 컷인에 전달되어야 합니다.');
assert.strictEqual(standalonePayload.outcome, 'success');

['천문학', '라틴어', '사진', '산악', '보트 조종', '도검술', '화학', '지질학', '프랑스어', '회화', '극지', '항공기 조종', '봉술']
  .forEach((label) => assert.strictEqual(helper.roll(characterId, label, {}).ok, true, `${label} 판정 실패`));

assert.strictEqual(helper.rollWeapon(characterId, '리볼버', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{damage=[[1d10+0]]}}'));
assert.strictEqual(helper.rollWeapon(characterId, '지팡이', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{success=[[((45))]]}}'), '반복 기능 참조는 실제 값으로 풀어야 합니다.');
assert(!last.includes('@{repeating_other_weapon_$0_other_weapon}'));
assert(last.includes('round(((1d4))/2)'));
assert.strictEqual(helper.rollWeapon(characterId, '기본값 무기', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{damage=[[1d3+0]]}}'));

assert.strictEqual(helper.showSpell(characterId, '문 열기', false).ok, true);
assert.strictEqual(helper.rollArmor(characterId, '철제 투구', false).ok, true);
assert.strictEqual(helper.rollFree(characterId, false).ok, true);
assert.strictEqual(helper.rollMadness(characterId, '', false).ok, true);
setCurrent('rand_maddess', '1');
events['chat:message']({ type: 'api', content: '!장기광기', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{madness_type=[[1]]}}'), '레거시 광기 명령도 현재 시트 선택을 따라야 합니다.');
setCurrent('rand_maddess', '2');
events['chat:message']({ type: 'api', content: '!일시적광기', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{madness_type=[[2]]}}'), '일시적광기 별칭도 현재 시트 선택을 따라야 합니다.');
events['chat:message']({ type: 'api', content: '!장기적광기', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{madness_type=[[2]]}}'), '장기적광기 별칭을 인식해야 합니다.');
setCurrent('rand_maddess', 'bogus');
assert.strictEqual(helper.rollMadness(characterId, '', false).ok, false);
setCurrent('rand_maddess', '1');
assert.strictEqual(helper.rollLuck(characterId, false).ok, true);
assert.strictEqual(helper.rollHitLocation(characterId, false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{mark=[[1d20]]}}'));

assert.strictEqual(helper.roll(characterId, '없는 기능', {}).ok, false);
defaults.free_dice = '2d6+악성문자';
assert.strictEqual(helper.rollFree(characterId, false).ok, false);
defaults.free_dice = '2d6+3';

helper.registerProfile({
  id: 'future-system',
  name: '확장 시험',
  minimumScore: 1,
  markers: {},
  actions: {},
  relevant() { return false; },
  scan() { return { fields: [], resources: [], weapons: [], spells: [], armors: [], warnings: [] }; },
});
assert(helper.profiles['future-system']);

assert(!source.includes('&{template:coc-1}'));
assert(!source.includes('&{template:coc-dice-roll}'));
assert(!source.includes('&{template:coc-attack-1}'));
assert(!source.includes('otherskill1'));

events['chat:message']({
  type: 'api',
  content: '!시트 탄약|기본값 무기|=4',
  playerid: 'player-1',
  who: '저널 이름',
});
assert(attributeObjects.some((item) =>
  item.get('name') === 'repeating_weapon_rowW3_weapon_ammo' && item.get('current') === '4'),
  JSON.stringify({
    attributes: attributeObjects.map((item) => [item.get('name'), item.get('current')]),
    sent: sent.slice(-3),
  }));
assert(!attributeObjects.some((item) => item.get('name') === 'repeating_weapon_$2_weapon_ammo'));

const luckObject = attributeObjects.find((item) => item.get('name') === 'luck');
const luckBefore = luckObject ? luckObject.get('current') : defaults.luck;
runtime.sheet_helper_setting.legacy_commands = false;
events['chat:message']({ type: 'general', content: '행운-1', playerid: 'player-1', who: '테스트 탐사자' });
assert.strictEqual(luckObject ? luckObject.get('current') : defaults.luck, luckBefore);
events['chat:message']({ type: 'general', content: ':행운-1', playerid: 'player-1', who: '테스트 탐사자' });
assert.strictEqual(luckObject ? luckObject.get('current') : defaults.luck, luckBefore);

events['chat:message']({ type: 'api', content: '!시트 판정|없는 기능', playerid: 'player-1', who: '테스트 탐사자' });
const adminMessage = sent.filter((item) => item.who === '시트 헬퍼').at(-1);
assert.strictEqual(adminMessage.options.noarchive, true);
assert.strictEqual(
  getAttrByNameCalls.filter((name) => /^_reporder_repeating_/.test(name)).length,
  0,
  '전체 검증 중 _reporder_repeating_* getAttrByName 호출이 없어야 합니다.',
);

runtime.sheet_helper_setting.legacy_commands = true;
events['chat:message']({ type: 'api', content: '!!화자 이경', playerid: 'gm', who: 'GM (GM)' });
assert(sent.at(-1).content.includes('여러 명'), '부분 이름이 겹치면 선택하지 않아야 합니다.');
assert.strictEqual(players.gm.get('speakingas'), '');
events['chat:message']({ type: 'api', content: '!!화자 경태', playerid: 'gm', who: 'GM (GM)' });
assert.strictEqual(players.gm.get('speakingas'), 'character|' + gmCharacter.id);
events['chat:message']({ type: 'api', content: '!!화자 GM', playerid: 'gm', who: 'GM (GM)' });
assert.strictEqual(players.gm.get('speakingas'), 'character|' + gmSpeakerCharacter.id);
events['chat:message']({ type: 'api', content: '!!화자 마렌', playerid: 'gm', who: 'GM (GM)' });
assert.strictEqual(players.gm.get('speakingas'), '');
events['chat:message']({ type: 'api', content: '!!명령대상 경태', playerid: 'gm', who: 'GM (GM)' });
assert.strictEqual(runtime.state.KIBSheetHelper.activeCharacterId, gmCharacter.id);
events['chat:message']({ type: 'api', content: '!시트 상태', playerid: 'gm', who: 'GM (GM)' });
assert(sent.at(-1).content.includes('이경태'), 'GM이 고른 캐릭터를 다음 명령에 사용해야 합니다.');

events['chat:message']({ type: 'api', content: '!시트 GM전용추적|끄기', playerid: 'gm', who: 'GM (GM)' });
const gmLuck = runtime.createObj('attribute', {
  _characterid: gmCharacter.id, characterid: gmCharacter.id, name: 'luck', current: '31', max: '',
});
const playerLuck = runtime.createObj('attribute', {
  _characterid: playerCharacter.id, characterid: playerCharacter.id, name: 'luck', current: '31', max: '',
});
const gmTrackBefore = sent.filter((item) => item.who === `character|${gmCharacter.id}`).length;
events['change:attribute'](gmLuck, { current: '30' });
assert.strictEqual(
  sent.filter((item) => item.who === `character|${gmCharacter.id}`).length,
  gmTrackBefore,
  'GM 전용 캐릭터 변화는 설정에 따라 숨겨야 합니다.',
);
events['change:attribute'](playerLuck, { current: '30' });
const playerTrack = sent.filter((item) => item.who === `character|${playerCharacter.id}`).at(-1);
assert(playerTrack && playerTrack.content.includes('행운'));
assert.strictEqual(playerTrack.options.noarchive, true, '수치 변화 메시지는 기록에 남기지 않아야 합니다.');
const externalHp = runtime.createObj('attribute', {
  _characterid: playerCharacter.id, characterid: playerCharacter.id, name: 'hp', current: '6', max: '',
});
events['change:attribute'](externalHp, { current: '12' });
assert(attributeObjects.some((item) => item.get('_characterid') === playerCharacter.id && item.get('name') === 'major-wound-toggle' && item.get('current') === '1'));
externalHp.set('current', '0');
events['change:attribute'](externalHp, { current: '6' });
assert(attributeObjects.some((item) => item.get('_characterid') === playerCharacter.id && item.get('name') === 'dying' && item.get('current') === '1'));

events['chat:message']({ type: 'api', content: '!시트 변경|체력|-6', playerid: 'player-1', who: '저널 이름' });
assert(attributeObjects.some((item) => item.get('_characterid') === characterId && item.get('name') === 'major-wound-toggle' && item.get('current') === '1'));
let hpMessage = sent.filter((item) => item.who === `character|${characterId}` && item.content.includes('체력')).at(-1);
assert(hpMessage.content.includes('12 / 12 (100%)'));
assert(hpMessage.content.includes('6 / 12 (50%)'));
assert(hpMessage.content.includes('중상 활성화'));
assert.strictEqual(hpMessage.options.noarchive, true);
events['chat:message']({ type: 'api', content: '!시트 변경|체력|-6', playerid: 'player-1', who: '저널 이름' });
assert(attributeObjects.some((item) => item.get('_characterid') === characterId && item.get('name') === 'dying' && item.get('current') === '1'));
hpMessage = sent.filter((item) => item.who === `character|${characterId}` && item.content.includes('체력')).at(-1);
assert(hpMessage.content.includes('빈사 활성화'));

const intRollsBefore = sent.filter((item) => item.content && item.content.includes('{{subject=지능}}')).length;
events['chat:message']({ type: 'api', content: '!시트 변경|이성|-5', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(
  sent.filter((item) => item.content && item.content.includes('{{subject=지능}}')).length,
  intRollsBefore + 1,
  '이성이 한 번에 5 이상 감소하면 지능 판정을 실행해야 합니다.',
);
let sanMessage = sent.filter((item) => item.who === `character|${characterId}` && item.content.includes('이성')).at(-1);
assert(sanMessage.content.includes('30 / 70 (43%)'));
assert(sanMessage.content.includes('25 / 70 (36%)'));
events['chat:message'](inlineResultMessage(
  { success: 35, hard: 17, extreme: 7, roll: 20 },
  { token: latestPendingToken() },
));
let tempInsane = attributeObjects.find((item) => item.get('_characterid') === characterId && item.get('name') === 'temp_insane');
assert(tempInsane && tempInsane.get('current') === '1', '지능 판정 성공 시 일시적 광기를 활성화해야 합니다.');

tempInsane.set('current', '0');
sanAttribute.set('current', '30');
events['chat:message']({ type: 'api', content: '!시트 변경|이성|-5', playerid: 'player-1', who: '저널 이름' });
events['chat:message'](inlineResultMessage(
  { success: 35, hard: 17, extreme: 7, roll: 80 },
  { token: latestPendingToken() },
));
assert.strictEqual(tempInsane.get('current'), '0', '지능 판정 실패 시 일시적 광기를 활성화하면 안 됩니다.');

const manualInt = helper.roll(characterId, '지능', {});
assert.strictEqual(manualInt.ok, true);
events['chat:message'](inlineResultMessage(
  { success: 35, hard: 17, extreme: 7, roll: 20 },
  { token: latestPendingToken() },
));
assert.strictEqual(tempInsane.get('current'), '0', '일반 지능 판정 성공은 일시적 광기를 활성화하면 안 됩니다.');

setCurrent('indef_insane', '1');
const blockedIntRolls = sent.filter((item) => item.content && item.content.includes('{{subject=지능}}')).length;
events['chat:message']({ type: 'api', content: '!시트 변경|이성|-5', playerid: 'player-1', who: '저널 이름' });
assert.strictEqual(
  sent.filter((item) => item.content && item.content.includes('{{subject=지능}}')).length,
  blockedIntRolls,
  '장기 광기 상태에서는 지능 판정을 다시 실행하지 않아야 합니다.',
);
assert.strictEqual(tempInsane.get('current'), '0', '장기 광기 상태에서는 일시적 광기를 자동 활성화하면 안 됩니다.');

runtime.state.KIBSheetHelper.managerCharacterId = characterId;
const refreshedManager = helper.refresh();
const refreshedNotes = refreshedManager.get('notes');
assert(refreshedNotes.includes('0 / 12 (0%)'));
assert(refreshedNotes.includes('20 / 70 (29%)'), '이성 비율은 시작 이성을 기준으로 표시해야 합니다.');
assert(refreshedNotes.includes('활성화'), '이진 상태는 활성화 또는 해제로 표시해야 합니다.');

console.log('Sheet Helper check: PASS');
