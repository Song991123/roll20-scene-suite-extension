const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { parseSheetContract } = require('../public/assets/sheet-contract-parser');

const source = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'),
  'utf8',
);

const contractFixture = parseSheetContract(`
  <input name="attr_contract_marker" value="fixture">
  <input name="attr_character_name">
  <input name="attr_skill_value">
  <input name="attr_nested_value"><input name="attr_nested_mod">
  <input name="attr_cycle_a"><input name="attr_cycle_b">
  <input name="attr_external_ref">
  <div class="max-control">
    <select name="attr_max_value"><option value="5">현재</option><option value="99">임시</option></select>
    <button type="roll" value="&{template:fixture} {{subject=최대 식}} {{current=@{max_value}}} {{roll=[[@{max_value|max}]]}}"></button>
  </div>
  <div class="bonus-control">
    <select name="attr_bonus_mode"><option value="0">기본</option><option value="10">보너스 개 1</option></select>
    <button type="roll" value="&{template:fixture} {{character_name=@{character_name}}} {{subject=정밀 관찰}} {{roll=[[@{skill_value}+@{bonus_mode}]]}}"></button>
  </div>
  <select name="attr_family"><option value="0">가족 기본</option><option value="5">가족 추가</option></select>
  <button type="roll" value="&{template:fixture} {{subject=중첩 식}} {{roll=[[@{nested_value}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=순환 식}} {{roll=[[@{cycle_a}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=외부 참조}} {{value=@{external_ref}}}"></button>
  <input type="text" name="attr_free_expression" value="1d6">
  <button type="roll" value="&{template:fixture} {{character_name=@{character_name}}} {{subject=계약 자유 주사위}} {{formula=@{free_expression}}} {{roll=[[@{free_expression}]]}}"></button>
  <input type="number" name="attr_ordinary_value" value="55">
  <button type="roll" value="&{template:fixture} {{subject=일반 수치 판정}} {{target=@{ordinary_value}}} {{roll=[[@{ordinary_value}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=질의 판정}} {{roll=[[?{대상|현재,@{skill_value}|고정,20}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=Double}} {{roll=[[?{Difficulty|Easy,1|Hard,2}+?{Size|Small,10|Large,20}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=Twin}} {{roll=[[?{Pick|A,1|B,2}+?{Pick|A,1|B,2}]]}}"></button>
  <fieldset class="repeating_weapon">
    <input name="attr_weapon_name"><input name="attr_weapon_value">
    <button type="roll" value="&{template:fixture} {{character_name=@{character_name}}} {{subject=@{weapon_name}}} {{roll=[[@{weapon_value}]]}}"></button>
  </fieldset>
  <button type="roll" value="&{template:fixture} {{subject=겹친 판정}} {{roll=[[1d100]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=겹친 판정}} {{roll=[[1d20]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=이름 충돌}} {{roll=[[1d12]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=다른 롤}} {{roll=[[?{자세|이름 충돌,1d6|기본,1d8}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=우선 판정}} {{roll=[[1d100+@{family}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=우선 판정}} {{roll=[[1d100+?{보너스 주사위|1개,1|2개,2}+@{family}]]}}"></button>
  <button type="roll" value="&{template:fixture} {{subject=우선 판정}} {{roll=[[1d100+?{패널티 주사위|1개,-1|2개,-2}+@{family}]]}}"></button>
  <button type="roll" name="roll_kanji" value="&{template:fixture} {{subject=知覚}} {{roll=[[1d100]]}}">知覚</button>
  <button type="roll" name="roll_year_madness" value="&{template:fixture} {{subject=1920년 광기}} {{roll=[[1d10]]}}"></button>
  <button type="roll" name="roll_status" value="&{template:fixture} {{subject=상태}} {{roll=[[1d8]]}}"></button>
  <button type="roll" name="roll_prefixed_check" value="&{template:fixture} {{subject=판정 정밀 관찰}} {{roll=[[1d4]]}}"></button>
  <button type="roll" name="roll_observe_exact" value="&{template:fixture} {{subject=관찰력}} {{roll=[[1d6]]}}"></button>
  <button type="roll" name="roll_prefixed_extended" value="&{template:fixture} {{subject=판정 관찰력 강화}} {{roll=[[1d10]]}}"></button>
  <button type="roll" name="roll_numeric_label" value="&{template:fixture} {{subject=51}} {{roll=[[1d100]]}}">51</button>
  <button type="roll" name="roll_long_dice_label" value="&{template:fixture} {{subject=자유 1d100}} {{roll=[[1d100]]}}"></button>
  <button type="roll" name="roll_fire" value="&{template:fixture} {{subject=화염}} {{roll=[[1d6]]}}"></button>
  <button type="roll" name="roll_fire_dice" value="&{template:fixture} {{subject=화염 주사위}} {{roll=[[1d8]]}}"></button>
  <button type="roll" name="roll_translated" value="&{template:fixture} {{subject=번역 판정}} {{roll=[[1d6]]}}">Custom Check</button>
`, { id: 'fixture-contract', name: '계약 시험 시트', sourceHash: 'fixture-v1' });

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
  template_common: '', template_other: '',
  temp_insane: '0',
  indef_insane: '0',
  hp: '12', hp_max: '12', mp: '10', mp_max: '10', san_max: '70', san_start: '70', mov: '8',
  damage_bonus: '1d4', build: '1', dying: '0', 'major-wound-toggle': '0',
  free_dice: '2d6+3', rand_maddess: '1',
  current_mental_condition: '안정', phobias_manias: '어둠 공포증',
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
  ori_other_skills_title: '기상학', ori_other_skills: '46',
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
  repeating_skills_rowS_other_skills_title: '잠수',
  repeating_skills_rowS_other_skills: '41',
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
  repeating_magic_rowM1_magic_condition: '문에 손을 댄다.',
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
  skills: ['rowS'],
  weapon: ['rowW1', 'rowW2', 'rowW3'],
  magic: ['rowM1', 'rowM2'],
};

const character = roll20Object(characterId, {
  name: '저널 이름',
  controlledby: 'player-1',
});
const officialCharacterId = 'character-official';
const officialCharacter = roll20Object(officialCharacterId, {
  name: '공개 시트 탐사자',
  controlledby: 'player-1',
});
const ildCharacterId = 'character-ildneige';
const ildCharacter = roll20Object(ildCharacterId, {
  name: '일드네쥬 탐사자',
  controlledby: 'player-1',
});
const sparseCharacterId = 'character-sparse';
const sparseCharacter = roll20Object(sparseCharacterId, {
  name: '특수 주사위 없는 탐사자',
  controlledby: 'player-1',
});
const contractCharacterId = 'character-contract';
const contractCharacter = roll20Object(contractCharacterId, {
  name: '계약 탐사자',
  controlledby: 'player-1',
});
const gmCharacter = roll20Object('character-gm', { name: '이경태', controlledby: '' });
const playerCharacter = roll20Object('character-player', { name: '이경호', controlledby: 'player-2' });
const gmSpeakerCharacter = roll20Object('character-gm-speaker', { name: 'GM', controlledby: '' });
const characters = [character, officialCharacter, ildCharacter, sparseCharacter, contractCharacter, gmCharacter, playerCharacter, gmSpeakerCharacter];
const players = {
  gm: roll20Object('gm', { _displayname: '마렌 (GM)', speakingas: '' }),
  'player-1': roll20Object('player-1', { _displayname: '테스터', speakingas: '' }),
};
const enteredValues = {
  template_other: defaults.template_other,
  free_dice: defaults.free_dice,
  rand_maddess: defaults.rand_maddess,
  current_mental_condition: defaults.current_mental_condition,
  phobias_manias: defaults.phobias_manias,
  ori_science_title: defaults.ori_science_title, ori_science: defaults.ori_science,
  ori_foreign_title: defaults.ori_foreign_title, ori_foreign: defaults.ori_foreign,
  ori_art_title: defaults.ori_art_title, ori_art: defaults.ori_art,
  ori_live_title: defaults.ori_live_title, ori_live: defaults.ori_live,
  ori_other_control_title: defaults.ori_other_control_title, ori_other_control: defaults.ori_other_control,
  ori_other_weapon_title: defaults.ori_other_weapon_title, ori_other_weapon: defaults.ori_other_weapon,
  ori_other_skills_title: defaults.ori_other_skills_title, ori_other_skills: defaults.ori_other_skills,
  defense_name_07: defaults.defense_name_07, defense_pice_07: defaults.defense_pice_07,
  defense_value_07: defaults.defense_value_07, defense_desc_07: defaults.defense_desc_07,
};
let attributeObjects = Object.entries({ ...enteredValues, ...attributeValues }).map(([name, current], index) =>
  roll20Object(`attribute-${index}`, {
    _characterid: characterId,
    characterid: characterId,
    name,
    current,
    max: '',
  }),
);
Object.entries({
  contract_marker: 'fixture', character_name: '계약 탐사자', skill_value: '55', bonus_mode: '0', family: '0', free_expression: '1d6', ordinary_value: '55', appraise: '55',
  nested_value: 'floor(@{nested_mod})', nested_mod: '42', cycle_a: '@{cycle_b}', cycle_b: '@{cycle_a}', external_ref: '@{victim|secret}',
  max_value: '5',
  hp: '6', hp_max: '12', san: '30',
  defense_name_02: '계약에 없는 방어구', defense_pice_02: '몸통', defense_value_02: '1', defense_desc_02: '구형 스캔 오염 검사용',
  repeating_weapon_rowZ_weapon_name: '쇠파이프', repeating_weapon_rowZ_weapon_value: '45',
}).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`contract-attribute-${index}`, {
    _characterid: contractCharacterId,
    characterid: contractCharacterId,
    name,
    current,
    max: '',
  }));
});
attributeObjects.find((item) => item.get('_characterid') === contractCharacterId && item.get('name') === 'max_value')
  .set('max', 'floor(@{nested_mod})');
Object.entries({
  showskills: '2', character_name: '공개 시트 탐사자', dice_type: '0', toggledr: '1', dice_roll: '1d100',
  pulp_bomtoggle: '0', mixedbom: '0', current_mental_condition: '안정', phobias_manias: '없음',
  san: '60', cthulhu_mythos: '3', luck: '55', str: '50', dex: '45', pow: '60', int: '65',
  cthulhu_mythos_da: '2',
  hp: '10', hp_max: '10', major_wound_toggle: '0', fighting_brawl: '40',
  spot_hidden: '52', damage_bonus: '1d4',
  spot_hidden_mdr: '58',
  artandcraft_name_et: '인쇄', artandcraft_et: '41',
  artandcraft_name_ow: '항해 지도', artandcraft_ow: '42',
  artandcraft_name_ic: '홀로그램', artandcraft_ic: '43',
  repeating_skills_rowO_skillname: '사진술', repeating_skills_rowO_skill: '47',
  repeating_skillsmdr_rowM_skillname_mdr: '드론 조종', repeating_skillsmdr_rowM_skill_mdr: '44',
  repeating_weapons_rowP_weaponname: '권총', repeating_weapons_rowP_weaponskill: '@{spot_hidden}',
  repeating_weapons_rowP_weapondamage: '1d10', repeating_weapons_rowP_weapondb: '+0',
  repeating_weapons_rowP_weaponrange: '15m', repeating_weapons_rowP_weaponattacks: '1',
  repeating_weapons_rowP_weaponammo: '6', repeating_weapons_rowP_weaponmalf: '100',
  repeating_spells_rowQ_spellname: '문지기', repeating_spells_rowQ_spellcastime: '1라운드',
  repeating_spells_rowQ_spellcost: '마력 3', repeating_spells_rowQ_spelldescription: '문을 지킨다.',
}).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`official-attribute-${index}`, {
    _characterid: officialCharacterId,
    characterid: officialCharacterId,
    name,
    current,
    max: '',
  }));
});
Object.entries({ san: '50', cthulhu_mythos: '0', luck: '50', str: '50' }).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`sparse-attribute-${index}`, {
    _characterid: sparseCharacterId,
    characterid: sparseCharacterId,
    name,
    current,
    max: '',
  }));
});
Object.entries({
  showskills: '7', san: '60', luck: '50', str: '50', dex: '50', pow: '50',
  cthulhu_mythos_mdr: '0', spot_hidden_mdr: '55', major_wound_toggle: '0',
  repeating_skillsmdr_rowI_skillname_mdr: '사진술',
  repeating_skillsmdr_rowI_skill_mdr: '45',
}).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`ild-attribute-${index}`, {
    _characterid: ildCharacterId,
    characterid: ildCharacterId,
    name,
    current,
    max: '',
  }));
});
const sent = [];
const events = {};
const created = [];
const getAttrByNameCalls = [];

const runtime = {
  KIBSheetContracts: [contractFixture],
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
    if (id === characterId && Object.prototype.hasOwnProperty.call(defaults, name)) return defaults[name];
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
  const object = attributeObjects.find((item) =>
    item.get('_characterid') === characterId && item.get('name') === name);
  if (object) object.set('current', current);
  else defaults[name] = current;
}

const scanCallStart = getAttrByNameCalls.length;
const scanned = helper.scan(characterId, true);
const scanCalls = getAttrByNameCalls.slice(scanCallStart);
assert.strictEqual(scanned.ok, true);
assert.strictEqual(scanned.matched, true);
assert.strictEqual(scanned.schema.hasFreeDice, true);
assert.strictEqual(scanned.schema.specialTemplate, 'cocOther');
assert.strictEqual(scanned.fields.length, fixedFields.length + 15);
fixedFields.forEach(([, label]) => {
  assert(scanned.fields.some((item) => item.label === label), `${label} 판정 누락`);
});
['천문학', '라틴어', '사진', '산악', '보트 조종', '도검술', '기상학', '화학', '지질학', '프랑스어', '회화', '극지', '항공기 조종', '봉술', '잠수']
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
assert(!scanCalls.includes('defense_name_02'), '없는 선택 항목을 getAttrByName으로 재조회하면 안 됨');
assert.strictEqual(scanned.spells.length, 2);
assert(scanned.spells[0].details.some(([label, value]) => label === '발동조건' && value === '문에 손을 댄다.'));
assert.strictEqual(scanned.armors.length, 2);
assert(scanned.specialDice.some((item) => item.kind === 'free'));
assert.strictEqual(scanned.specialDice.filter((item) => item.kind === 'madness').length, 2);
assert(!scanned.specialDice.some((item) => item.kind === 'luck' || item.kind === 'hit-location'));
assert(scanned.madnessHistory.some((item) => item.attr === 'phobias_manias' && item.value === '어둠 공포증'));
assert(
  !scanCalls.includes('defense_name_01') &&
    !scanCalls.includes('defense_pice_01') &&
    !scanCalls.includes('defense_value_01') &&
    !scanCalls.includes('defense_desc_01'),
  '이미 읽은 속성 객체를 getAttrByName으로 다시 조회하면 안 됩니다.',
);
assert.strictEqual(runtime.state.KIBSheetHelper.keepMe, '보존');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm');

const sparseScan = helper.scan(sparseCharacterId, true);
assert.strictEqual(sparseScan.matched, true);
assert.strictEqual(sparseScan.specialDice.length, 0, '시트에 없는 특수 주사위를 메뉴에 만들면 안 됩니다.');
assert.strictEqual(helper.rollFree(sparseCharacterId, false).ok, false);
assert.strictEqual(helper.rollMadness(sparseCharacterId, '', false).ok, false);
assert.strictEqual(helper.rollLuck(sparseCharacterId, false).ok, false);
assert.strictEqual(helper.rollHitLocation(sparseCharacterId, false).ok, false);

const cutinItems = helper.cutinItems();
const expectedCutinKinds = [
  ['field', '관찰력'],
  ['weapon', '리볼버'],
  ['spell', '문 열기'],
  ['armor', '철제 투구'],
  ['free', '자유 주사위'],
  ['madness', '광기 발작 실시간'],
  ['madness', '광기 발작 요약'],
  ['hit-location', '명중부위'],
];
expectedCutinKinds.forEach(([kind, label]) => {
  assert(
    cutinItems.some((item) => item.kind === kind && item.label === label && item.key),
    `${label} 컷인 항목의 kind/key가 없습니다: ${JSON.stringify(cutinItems.filter((item) => item.label === label))}`,
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

defaults.san_max = '99-@{cthulhu_mythos}';
const manager = helper.refresh();
assert(manager, '관리 핸드아웃을 만들지 못했습니다.');
const managerNotes = manager.get('notes');
assert(managerNotes.includes('기본값 무기'));
assert(managerNotes.includes('피해 1d3+0'));
assert(managerNotes.includes('문 열기'));
assert(managerNotes.includes('시전 시간 1라운드'));
assert(managerNotes.includes('발동조건 문에 손을 댄다.'));
assert(managerNotes.includes('광기 관련 기록'));
assert(managerNotes.includes('어둠 공포증'));
assert(!managerNotes.includes('!시트 내부운결정|' + characterId));
assert(!managerNotes.includes('!시트 내부명중부위|' + characterId));
assert.strictEqual(manager.get('inplayerjournals'), '');
const playerHelp = created.find((item) => item.get('name') === '[PL] 시트 헬퍼 사용법');
assert(playerHelp, 'PL 사용법 핸드아웃을 만들지 못했습니다.');
assert.strictEqual(playerHelp.get('inplayerjournals'), 'all');
assert(playerHelp.get('notes').includes('!!굴릴항목이름'));
assert(playerHelp.get('notes').includes('!!굴릴항목이름 선택할이름'));
assert(playerHelp.get('notes').includes('!!검색 이름'));
assert(playerHelp.get('notes').includes('내 상태 보기'));
assert(playerHelp.get('notes').includes('<table'));
assert(!playerHelp.get('notes').includes('원본 시트 계약'));
assert(playerHelp.get('notes').includes('!!광기실시간'));
assert(playerHelp.get('notes').includes('!!광기요약'));
assert(!playerHelp.get('notes').includes('!!일시적광기'));
assert(!playerHelp.get('notes').includes('!!장기적광기'));
assert(playerHelp.get('notes').includes('!!r 2d6+3'));
assert(playerHelp.get('notes').includes('검정 선택 버튼'));
assert(!playerHelp.get('notes').includes('!!운결정'));
assert(!playerHelp.get('notes').includes('!시트 관리'), 'PL 사용법에 GM 명령이 들어가면 안 됩니다.');

function runBangBang(content, who = '저널 이름') {
  const before = sent.length;
  events['chat:message']({ type: 'api', content, playerid: 'player-1', who });
  return sent.slice(before);
}

assert(runBangBang('!!관찰력').some((item) => item.content && item.content.includes('{{subject=관찰력}}')));
assert(runBangBang('!!리볼버').some((item) => item.content && item.content.includes('{{subject=리볼버}}')));
assert(runBangBang('!!문 열기').some((item) => item.content && item.content.includes('{{side_subject=주문}}')));
assert(runBangBang('!!철제 투구').some((item) => item.content && item.content.includes('{{sub_subject2=방어구}}')));
assert(runBangBang('!!비밀 관찰력').some((item) => item.content && item.content.indexOf('/w gm ') === 0));
assert(runBangBang('!!판정관찰력 보너스1').some((item) => item.content && item.content.includes('{{subject=관찰력}}') && item.content.includes('{{dice_type=[[1]]}}')));
const statusMessages = runBangBang('!!상태');
assert(statusMessages.some((item) => item.content && item.content.includes('굴릴 항목') && item.content.includes('관찰력')));
assert(statusMessages.some((item) => item.content && item.content.includes('기록') && item.content.includes('어둠 공포증')));
assert(!statusMessages.some((item) => item.content && (item.content.includes('@{') || item.content.includes('&#64;{'))));
assert(statusMessages.some((item) => item.content && item.content.includes('최대 이성') && item.content.includes(`<b>${99 - Number(defaults.cthulhu_mythos)}</b>`)));
const searchMessages = runBangBang('!!검색 관찰');
assert(searchMessages.some((item) => item.content && item.content.includes('관찰력') && item.content.includes('현재 55')));
assert(searchMessages.some((item) => item.content && item.content.includes('background:#111') && item.content.includes('굴리기')));
const playerInspection = runBangBang('!!점검');
assert(playerInspection.some((item) => item.content && item.content.includes('GM 전용 명령입니다.')));
const gmInspectionBefore = sent.length;
events['chat:message']({ type: 'api', content: '!!점검', playerid: 'gm', who: '저널 이름 (GM)' });
assert(sent.slice(gmInspectionBefore).some((item) => item.content && item.content.includes('GM 인식 점검') && item.content.includes('확인할 항목')));
const madnessNote = runtime.createObj('attribute', {
  _characterid: characterId, characterid: characterId, name: 'phobias_manias', current: '폐소공포증', max: '',
});
events['add:attribute'](madnessNote);
assert(helper.scan(characterId).madnessHistory.some((item) => item.attr === 'phobias_manias' && item.value === '폐소공포증'));
madnessNote.set('current', '고소공포증');
events['change:attribute'](madnessNote, { current: '폐소공포증' });
assert(helper.scan(characterId).madnessHistory.some((item) => item.attr === 'phobias_manias' && item.value === '고소공포증'));

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
  conflictError && conflictError.content.includes('관찰력 / 판정') && conflictError.content.includes('관찰력 / 주문') &&
    conflictError.content.includes('background:#111') && conflictError.content.includes('!시트 선택|'),
  JSON.stringify(conflictBangBang),
);
assert(!conflictBangBang.some((item) => item.content && item.content.includes('kib_sheet_result=')));
const checkChoice = conflictError.content.match(/href="([^"]+\|check\|[^"]+)"/);
assert(checkChoice, conflictError.content);
const chosenBefore = sent.length;
events['chat:message']({ type: 'api', content: checkChoice[1], playerid: 'player-1', who: '저널 이름' });
assert(sent.slice(chosenBefore).some((item) => item.content && item.content.includes('{{subject=관찰력}}')));

const parsedContractScan = helper.scan(contractCharacterId, true);
assert.strictEqual(parsedContractScan.contractMatch.status, 'matched', JSON.stringify(parsedContractScan.contractMatch.matches && parsedContractScan.contractMatch.matches.map((item) => ({ id: item.id, score: item.score, ratio: item.ratio }))));
assert.strictEqual(parsedContractScan.profileMatched, false);
assert.strictEqual(parsedContractScan.resources.length, 0);
assert.strictEqual(parsedContractScan.armors.length, 0);
assert.strictEqual(typeof helper.registerContract, 'function');
helper.registerContract(contractFixture);
assert.strictEqual(helper.sheetContracts().filter((contract) => contract.id === contractFixture.id).length, 1);
const parsedContractRolls = helper.contractRolls(contractCharacterId);
const parsedCheck = parsedContractRolls.find((item) => item.label === '정밀 관찰');
const parsedRepeating = parsedContractRolls.find((item) => item.row);
assert(parsedCheck, 'character_name보다 원본 시트의 정적 판정명이 우선되어야 합니다.');
assert(parsedRepeating && parsedRepeating.label === '쇠파이프', '반복 행의 원본 이름을 판정명으로 사용해야 합니다.');
const qualifiedRepeating = helper.qualifyContractMacro(contractCharacterId, parsedRepeating, null);
assert.strictEqual(qualifiedRepeating.ok, true);
assert(qualifiedRepeating.content.includes('{{roll=[[45]]}}'));

const modeResult = helper.resolveContractAction(contractCharacter, '정밀관찰 보너스1', false);
assert(modeResult.handled && modeResult.result.ok, '공백과 한국어 단위가 다른 모드 이름도 원본 선택지에 매칭되어야 합니다.');
assert.strictEqual(modeResult.result.payload.modeLabel, '보너스 개 1');
assert(sent.at(-1).content.includes('{{roll=[[55+10]]}}'));
const secretContract = helper.resolveContractAction(contractCharacter, '정밀관찰 보너스1', true);
assert(secretContract.handled && secretContract.result.ok && sent.at(-1).content.startsWith('/w gm '));
assert(helper.resolveContractAction(contractCharacter, '정밀관찰', false).result.ok, '선택형 속성은 현재 시트 값을 그대로 써야 합니다.');
const nestedFormula = helper.resolveContractAction(contractCharacter, '중첩식', false);
assert(nestedFormula.handled && nestedFormula.result.ok, '속성 안의 원본 시트 식도 실행할 수 있어야 합니다.');
assert(sent.at(-1).content.includes('[[floor(42)]]'));
assert(!sent.at(-1).content.includes('@{nested_'));
const cyclicFormula = helper.resolveContractAction(contractCharacter, '순환식', false);
assert(cyclicFormula.handled && !cyclicFormula.result.ok && cyclicFormula.result.error.includes('순환'), '순환 속성은 샌드박스를 멈추지 않고 거절해야 합니다.');
const externalReference = helper.resolveContractAction(contractCharacter, '외부참조', false);
assert(externalReference.handled && !externalReference.result.ok && externalReference.result.error.includes('현재 캐릭터 외'), '속성값에 숨은 다른 캐릭터 참조를 실행하면 안 됩니다.');
const maxFormulaInstance = parsedContractRolls.find((item) => item.label === '최대 식');
const maxFormula = helper.qualifyContractMacro(contractCharacterId, maxFormulaInstance, { overrides: { max_value: '99' } });
assert(maxFormula.ok && maxFormula.content.includes('{{current=99}}') && maxFormula.content.includes('[[floor(42)]]'), JSON.stringify(maxFormula));
for (let depth = 0; depth < 7; depth += 1) {
  attributeObjects.push(roll20Object(`contract-explosion-${depth}`, {
    _characterid: contractCharacterId, characterid: contractCharacterId, name: `explode_${depth}`,
    current: depth === 6 ? '1' : Array(8).fill(`@{explode_${depth + 1}}`).join('+'), max: '',
  }));
}
const expansionBomb = helper.qualifyContractMacro(contractCharacterId, {
  contract: contractFixture,
  roll: { key: 'expansion-bomb', raw: '&{template:fixture} {{roll=[[@{explode_0}]]}}' },
  row: null,
}, null);
assert(!expansionBomb.ok && expansionBomb.error.includes('복잡'), '분기형 속성은 제한 안에서 즉시 거절해야 합니다.');
const nestedQuery = helper.resolveContractAction(contractCharacter, '질의판정 현재', false);
assert(nestedQuery.handled && nestedQuery.result.ok);
assert(!sent.at(-1).content.includes('?{대상'));
assert(sent.at(-1).content.includes('[[55]]'));
const doubleQuery = helper.resolveContractAction(contractCharacter, 'Double Easy Large', false);
assert(doubleQuery.handled && doubleQuery.result.ok);
assert(!sent.at(-1).content.includes('?{') && sent.at(-1).content.includes('[[1+20]]'));
const twinQuery = helper.resolveContractAction(contractCharacter, 'Twin A B', false);
assert(twinQuery.handled && twinQuery.result.ok);
assert(!sent.at(-1).content.includes('?{') && sent.at(-1).content.includes('[[1+2]]'));
assert(runBangBang('!!r 4d6+2', '계약 탐사자').some((item) => item.content && item.content.includes('{{roll=[[4d6+2]]}}')));
assert(!runBangBang('!!r 1d6]]', '계약 탐사자').some((item) => item.content && item.content.includes('kib_sheet_result=')));
assert(!runBangBang('!!r 55', '계약 탐사자').some((item) => item.content && item.content.includes('kib_sheet_result=')),
  '자유 주사위 명령은 상수만 있는 식을 실행하면 안 됩니다.');
const ordinaryContractRoll = helper.contractRolls(contractCharacterId).find((item) => item.label === '일반 수치 판정');
assert(ordinaryContractRoll && ordinaryContractRoll.roll.expressionRefs.length === 0,
  '숫자 판정값을 그대로 굴리는 원본 롤을 !!r 식 입력 롤로 분류하면 안 됩니다.');
const freeExpressionAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === contractCharacterId && item.get('name') === 'free_expression');
freeExpressionAttribute.set('current', '55');
const nonDiceExpression = runBangBang('!!r 2d6', '계약 탐사자');
assert(nonDiceExpression.some((item) => item.who === '시트 헬퍼' && item.content.includes('굴릴 수 있는 항목이 없습니다')),
  '현재 source 입력값이 주사위 식이 아니면 !!r 후보에서 제외해야 합니다.');
assert(!nonDiceExpression.some((item) => item.content && item.content.includes('{{roll=[[2d6]]}}')));
freeExpressionAttribute.set('current', '1d6');
attributeObjects.push(roll20Object('contract-nested-dice', {
  _characterid: contractCharacterId, characterid: contractCharacterId, name: 'nested_dice', current: '1d10', max: '',
}));
freeExpressionAttribute.set('current', '@{nested_dice}');
assert(runBangBang('!!r 2d8', '계약 탐사자').some((item) => item.content && item.content.includes('{{roll=[[2d8]]}}')),
  '다른 시트 입력값으로 주사위 식을 구성한 자유 굴림도 인식해야 합니다.');
freeExpressionAttribute.set('current', '1d6');
const noLegacyFallback = runBangBang('!!감정', '계약 탐사자');
assert(noLegacyFallback.some((item) => item.who === '시트 헬퍼' && item.content.includes('현재 시트에서 감정 굴림을 찾지 못했습니다')));
assert(!noLegacyFallback.some((item) => item.content && item.content.includes('kib_sheet_result=')), '계약 미매칭 롤을 기존 CoC 하드코딩으로 실행하면 안 됩니다.');
assert(runBangBang('!!知覚', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=知覚}}')),
  '원본 시트의 일본어 및 한자 라벨도 그대로 매칭해야 합니다.');
assert(runBangBang('!!1920년 광기', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=1920년 광기}}')),
  '숫자로 시작하는 원본 라벨을 일반 주사위 식으로 오인하면 안 됩니다.');
assert(runBangBang('!!51', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=51}}')),
  '숫자만 있는 원본 라벨도 일반 주사위 식보다 먼저 정확히 매칭해야 합니다.');
const contractSearch = runBangBang('!!검색 정밀', '계약 탐사자');
assert(contractSearch.some((item) => item.content && item.content.includes('정밀 관찰') && item.content.includes('현재 55')),
  '검색은 특정 게임 이름을 하드코딩하지 않고 시트가 참조한 현재 수치를 보여야 합니다.');
assert(contractSearch.some((item) => item.content && item.content.includes('background:#111') && item.content.includes('굴리기')));
const contractDicePassBefore = sent.length;
runBangBang('!!1d100', '계약 탐사자');
assert.strictEqual(sent.length, contractDicePassBefore,
  '주사위 식은 더 긴 원본 라벨에 부분일치시키지 말고 다른 주사위 스크립트로 넘겨야 합니다.');
assert(runBangBang('!!원본 상태', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=상태}}')),
  '관리 명령과 같은 원본 라벨은 원본 접두어로 실행할 수 있어야 합니다.');
assert(runBangBang('!!비밀원본 상태', '계약 탐사자').some((item) => item.content && item.content.startsWith('/w gm ') && item.content.includes('{{subject=상태}}')));
assert(runBangBang('!!판정 정밀 관찰', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=판정 정밀 관찰}}')),
  '명령 접두어까지 포함한 원본 라벨이 있으면 잘라낸 이름보다 먼저 매칭해야 합니다.');
assert(runBangBang('!!판정 관찰력', '계약 탐사자').some((item) => item.content && item.content.includes('{{subject=관찰력}}') && !item.content.includes('강화')),
  '접두어 포함 부분일치보다 접두어를 뺀 원본 정확 일치를 우선해야 합니다.');

const publicContractRoll = helper.roll(contractCharacterId, '정밀 관찰', { mode: '보너스1' });
assert(publicContractRoll.ok && sent.at(-1).content.includes('&{template:fixture}'), '공개 roll API도 원본 계약 롤을 실행해야 합니다.');
assert.strictEqual(publicContractRoll.payload.system, 'sheet');
const publicFallbackBefore = sent.length;
assert.strictEqual(helper.roll(contractCharacterId, '감정', {}).ok, false);
assert.strictEqual(helper.rollWeapon(contractCharacterId, '리볼버', false).ok, false);
assert.strictEqual(helper.showSpell(contractCharacterId, '문 열기', false).ok, false);
assert.strictEqual(helper.rollArmor(contractCharacterId, '계약에 없는 방어구', false).ok, false);
assert.strictEqual(helper.rollMadness(contractCharacterId, '', false).ok, false);
assert.strictEqual(helper.rollHitLocation(contractCharacterId, false).ok, false);
assert.strictEqual(sent.length, publicFallbackBefore, '공개 API가 계약에 없는 CoC 매크로를 만들면 안 됩니다.');
assert(helper.rollFree(contractCharacterId, false, '3d6').ok && sent.at(-1).content.includes('{{roll=[[3d6]]}}'));
assert(!helper.cutinItems().some((item) => item.label === '계약에 없는 방어구'), '계약 컷인 목록에 구형 CoC 스캔 항목이 섞이면 안 됩니다.');
assert(helper.cutinItems().some((item) => item.label === '정밀 관찰' && item.system === 'sheet'));
const stableCutinKey = publicContractRoll.payload.cutinKey;
const originalContractId = contractFixture.id;
const originalSourceHash = contractFixture.sourceHash;
contractFixture.id = 'fixture-contract-updated';
contractFixture.sourceHash = 'fixture-v2';
helper.refresh();
const refreshedContractRoll = helper.roll(contractCharacterId, '정밀 관찰', {});
assert(refreshedContractRoll.ok && refreshedContractRoll.payload.cutinKey === stableCutinKey,
  '시트 HTML·CSS·번역 파일을 다시 만들 때 기존 컷인 연결 키가 바뀌면 안 됩니다.');
contractFixture.id = originalContractId;
contractFixture.sourceHash = originalSourceHash;
helper.refresh();
const translatedRoll = contractFixture.rolls.find((roll) => roll.name === 'translated');
const translatedCutinBefore = helper.roll(contractCharacterId, 'Custom Check', {});
const translatedCutinKey = translatedCutinBefore.payload.cutinKey;
translatedRoll.label = '사용자 판정';
translatedRoll.aliases = ['Custom Check'];
helper.refresh();
const translatedCutinAfter = helper.roll(contractCharacterId, '사용자 판정', {});
assert(translatedCutinAfter.ok && translatedCutinAfter.payload.cutinKey === translatedCutinKey,
  '같은 시트 롤의 번역 라벨만 바뀔 때 판정 컷인 연결 키가 바뀌면 안 됩니다.');
assert(helper.cutinItems().some((item) => item.key === translatedCutinKey && item.aliases.includes('Custom Check')),
  '컷인 관리 목록과 실행 payload가 같은 안정 키와 이전 표시 이름을 공유해야 합니다.');
translatedRoll.label = 'Custom Check';
translatedRoll.aliases = [];
helper.refresh();
const duplicateRowStart = attributeObjects.length;
[
  ['repeating_weapon_rowY_weapon_name', '쇠파이프'],
  ['repeating_weapon_rowY_weapon_value', '50'],
].forEach(([name, current], index) => attributeObjects.push(roll20Object(`contract-duplicate-${index}`, {
  _characterid: contractCharacterId, characterid: contractCharacterId, name, current, max: '',
})));
helper.refresh();
const duplicateCutinItems = helper.cutinItems().filter((item) => item.label === '쇠파이프');
assert.strictEqual(duplicateCutinItems.length, 2);
assert.notStrictEqual(duplicateCutinItems[0].key, duplicateCutinItems[1].key);
assert(duplicateCutinItems.every((item) => item.displayLabel && item.displayLabel.includes('계약 탐사자')),
  '같은 이름의 반복 굴림은 내부 키를 노출하지 않고 컷인 선택지에서 구분되어야 합니다.');
attributeObjects.splice(duplicateRowStart);
helper.refresh();
const contractHp = attributeObjects.find((item) => item.get('_characterid') === contractCharacterId && item.get('name') === 'hp');
const contractMessagesBefore = sent.filter((item) => item.who === `character|${contractCharacterId}`).length;
events['change:attribute'](contractHp, { current: '12' });
assert.strictEqual(sent.filter((item) => item.who === `character|${contractCharacterId}`).length, contractMessagesBefore);
assert(!attributeObjects.some((item) => item.get('_characterid') === contractCharacterId && /major.?wound/i.test(item.get('name'))));
events['chat:message']({ type: 'general', content: ':hp+3', playerid: 'player-1', who: '계약 탐사자' });
assert.strictEqual(contractHp.get('current'), '6');

const weakContract = parseSheetContract(`
  <input name="attr_shared_a"><input name="attr_shared_b"><input name="attr_shared_c">
  <input name="attr_weak_d"><input name="attr_weak_e"><input name="attr_weak_f"><input name="attr_weak_g">
  <input name="attr_weak_h"><input name="attr_weak_i"><input name="attr_weak_j">
  <button type="roll" value="&{template:weak} {{roll=[[1d20]]}}">약한 계약</button>
`, { id: 'weak-contract', name: '약한 계약' });
helper.registerContract(weakContract);
const weakCharacter = roll20Object('character-weak', { name: '다른 시트', controlledby: 'player-1' });
characters.push(weakCharacter);
['shared_a', 'shared_b', 'shared_c'].concat(Array.from({ length: 20 }, (_, index) => `other_${index}`)).forEach((name, index) => {
  attributeObjects.push(roll20Object(`weak-attribute-${index}`, {
    _characterid: weakCharacter.id, characterid: weakCharacter.id, name, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(weakCharacter.id).status, 'none', '일부 공통 속성만으로 다른 시트를 확정하면 안 됩니다.');
const smallOverlapCharacter = roll20Object('character-small-overlap', { name: '작은 다른 시트', controlledby: 'player-1' });
characters.push(smallOverlapCharacter);
['shared_a', 'shared_b', 'shared_c', 'other_a', 'other_b', 'other_c', 'other_d'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`small-overlap-attribute-${index}`, {
    _characterid: smallOverlapCharacter.id, characterid: smallOverlapCharacter.id, name, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(smallOverlapCharacter.id).status, 'none', '작은 시트도 공통 속성 3개만으로 다른 계약에 매칭하면 안 됩니다.');

const repeatingScopeContract = parseSheetContract(`
  <fieldset class="repeating_scoped">
    <input name="attr_scope_only_a"><input name="attr_scope_only_b"><input name="attr_scope_only_c">
    <button type="roll" value="&{template:test} {{first=@{scope_only_a}}} {{second=@{scope_only_b}}} {{third=@{scope_only_c}}} {{roll=[[1d20]]}}">Scoped</button>
  </fieldset>
`, { id: 'repeating-scope-contract', name: '반복 범위 계약' });
helper.registerContract(repeatingScopeContract);
const globalScopeCharacter = roll20Object('character-global-scope', { name: '전역 범위 시험', controlledby: 'player-1' });
characters.push(globalScopeCharacter);
['scope_only_a', 'scope_only_b', 'scope_only_c'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`global-scope-attribute-${index}`, {
    _characterid: globalScopeCharacter.id, characterid: globalScopeCharacter.id, name, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(globalScopeCharacter.id).status, 'none', '반복 행 필드를 같은 이름의 전역 속성으로 오인하면 안 됩니다.');
const repeatingScopeCharacter = roll20Object('character-repeating-scope', { name: '반복 범위 시험', controlledby: 'player-1' });
characters.push(repeatingScopeCharacter);
['scope_only_a', 'scope_only_b', 'scope_only_c'].forEach((field, index) => {
  attributeObjects.push(roll20Object(`repeating-scope-attribute-${index}`, {
    _characterid: repeatingScopeCharacter.id, characterid: repeatingScopeCharacter.id,
    name: `repeating_scoped_rowR_${field}`, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(repeatingScopeCharacter.id).status, 'matched');
assert.strictEqual(helper.contractRolls(repeatingScopeCharacter.id).length, 1);

const prototypeContract = parseSheetContract(`
  <fieldset class="repeating___proto__">
    <input name="attr_constructor"><input name="attr___proto__"><input name="attr_toString">
    <button type="roll" value="&{template:test} {{a=@{constructor}}} {{b=@{__proto__}}} {{c=@{toString}}} {{roll=[[1d20]]}}">Prototype</button>
  </fieldset>
`, { id: 'prototype-contract', name: '프로토타입 계약' });
assert.doesNotThrow(() => helper.registerContract(prototypeContract));
const prototypeCharacter = roll20Object('character-prototype', { name: '프로토타입 시험', controlledby: 'player-1' });
characters.push(prototypeCharacter);
['constructor', '__proto__', 'toString'].forEach((field, index) => {
  attributeObjects.push(roll20Object(`prototype-attribute-${index}`, {
    _characterid: prototypeCharacter.id, characterid: prototypeCharacter.id,
    name: `repeating___proto___constructor_${field}`, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(prototypeCharacter.id).status, 'matched');
assert.strictEqual(helper.contractRolls(prototypeCharacter.id).length, 1);

const cacheContract = parseSheetContract(`
  <input name="attr_cache_marker_a"><input name="attr_cache_marker_b"><input name="attr_cache_marker_c">
  <button type="roll" value="&{template:test} {{roll=[[1d20]]}}">Cache</button>
`, { id: 'cache-contract', name: '계약 캐시 시험' });
helper.registerContract(cacheContract);
const cacheCharacter = roll20Object('character-contract-cache', { name: '계약 캐시 시험', controlledby: 'player-1' });
characters.push(cacheCharacter);
['cache_marker_a', 'cache_marker_b', 'cache_marker_c'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`cache-marker-${index}`, {
    _characterid: cacheCharacter.id, characterid: cacheCharacter.id, name, current: '1', max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(cacheCharacter.id).status, 'matched');
const cacheNoise = Array.from({ length: 4 }, (_, index) => roll20Object(`cache-noise-${index}`, {
  _characterid: cacheCharacter.id, characterid: cacheCharacter.id, name: `cache_noise_${index}`, current: '1', max: '',
}));
cacheNoise.forEach((attribute) => {
  attributeObjects.push(attribute);
  events['add:attribute'](attribute);
});
assert.strictEqual(helper.inspectContracts(cacheCharacter.id).status, 'matched',
  '관계없는 런타임 속성이 늘어도 계약-side 시그니처 매칭은 유지해야 합니다.');
cacheNoise.forEach((attribute) => {
  attributeObjects.splice(attributeObjects.indexOf(attribute), 1);
  events['destroy:attribute'](attribute);
});
assert.strictEqual(helper.inspectContracts(cacheCharacter.id).status, 'matched', '속성 삭제 후 계약 매칭 캐시를 갱신해야 합니다.');
const renamedMarker = attributeObjects.find((attribute) =>
  attribute.get('_characterid') === cacheCharacter.id && attribute.get('name') === 'cache_marker_a');
renamedMarker.set('name', 'cache_marker_renamed');
events['change:attribute'](renamedMarker, { name: 'cache_marker_a', current: '1' });
assert.strictEqual(helper.inspectContracts(cacheCharacter.id).status, 'none', '속성 이름 변경 후 계약 매칭 캐시를 갱신해야 합니다.');
renamedMarker.set('name', 'cache_marker_a');
events['change:attribute'](renamedMarker, { name: 'cache_marker_renamed', current: '1' });
assert.strictEqual(helper.inspectContracts(cacheCharacter.id).status, 'matched');

const repeatingOnlyContract = parseSheetContract(`
  <input name="attr_global_roll" value="1d20">
  <fieldset class="repeating_notes"><input name="attr_note_title"><button type="roll" value="&{template:test} {{roll=[[@{global_roll}]]}}"></button></fieldset>
`, { id: 'repeating-only-contract', name: '반복 전용 계약' });
assert.doesNotThrow(() => helper.registerContract(repeatingOnlyContract));

const sharedRepeatingContract = parseSheetContract(`
  <input name="attr_scope_a"><input name="attr_scope_b"><input name="attr_scope_c">
  <input name="attr_scope_d"><input name="attr_scope_e"><input name="attr_scope_f">
  <fieldset class="repeating_weapons">
    <input name="attr_name"><input name="attr_value">
    <select name="attr_mode"><option value="slash">Slash</option><option value="thrust">Thrust</option></select>
    <button type="roll" name="roll_use" value="&{template:test} {{name=@{name}}} {{mode=@{mode}}} {{roll=[[@{value}]]}}">Weapon</button>
  </fieldset>
  <fieldset class="repeating_spells">
    <input name="attr_name"><input name="attr_value">
    <select name="attr_mode"><option value="fire">Fire</option><option value="ice">Ice</option></select>
    <button type="roll" name="roll_use" value="&{template:test} {{name=@{name}}} {{mode=@{mode}}} {{roll=[[@{value}]]}}">Spell</button>
  </fieldset>
`, { id: 'shared-repeating-contract', name: '반복 이름 중복 계약' });
helper.registerContract(sharedRepeatingContract);
const sharedRepeatingCharacter = roll20Object('character-shared-repeating', { name: '반복 시험', controlledby: 'player-1' });
characters.push(sharedRepeatingCharacter);
Object.entries({
  scope_a: '1', scope_b: '1', scope_c: '1', scope_d: '1', scope_e: '1', scope_f: '1',
  repeating_weapons_rowW_name: 'Sword', repeating_weapons_rowW_value: '45', repeating_weapons_rowW_mode: 'slash',
  repeating_spells_rowS_name: 'Fireball', repeating_spells_rowS_value: '60', repeating_spells_rowS_mode: 'fire',
}).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`shared-repeating-attribute-${index}`, {
    _characterid: sharedRepeatingCharacter.id, characterid: sharedRepeatingCharacter.id, name, current, max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(sharedRepeatingCharacter.id).status, 'matched');
assert.strictEqual(helper.contractRolls(sharedRepeatingCharacter.id).length, 2);
assert(helper.resolveContractAction(sharedRepeatingCharacter, 'Sword Thrust', false).result.ok);
assert(sent.at(-1).content.includes('{{name=Sword}}') && sent.at(-1).content.includes('{{mode=thrust}}') && sent.at(-1).content.includes('{{roll=[[45]]}}'));
assert(helper.resolveContractAction(sharedRepeatingCharacter, 'Fireball Ice', false).result.ok);
assert(sent.at(-1).content.includes('{{name=Fireball}}') && sent.at(-1).content.includes('{{mode=ice}}') && sent.at(-1).content.includes('{{roll=[[60]]}}'));

const suffixContract = parseSheetContract(`
  <fieldset class="repeating_inventory">
    <input name="attr_name"><input name="attr_value"><input name="attr_weapon_name"><input name="attr_weapon_value">
    <button type="roll" name="roll_use" value="&{template:test} {{roll=[[1d20]]}}">Inventory</button>
  </fieldset>
`, { id: 'suffix-contract', name: '반복 접미사 계약' });
helper.registerContract(suffixContract);
const suffixCharacter = roll20Object('character-suffix', { name: '접미사 시험', controlledby: 'player-1' });
characters.push(suffixCharacter);
['name', 'value', 'weapon_name', 'weapon_value'].forEach((field, index) => {
  attributeObjects.push(roll20Object(`suffix-attribute-${index}`, {
    _characterid: suffixCharacter.id, characterid: suffixCharacter.id,
    name: `repeating_inventory_rowI_${field}`, current: String(index + 1), max: '',
  }));
});
const suffixInspection = helper.inspectContracts(suffixCharacter.id);
assert.strictEqual(suffixInspection.status, 'matched');
assert.strictEqual(suffixInspection.match.score, 4);
assert.strictEqual(helper.contractRolls(suffixCharacter.id).length, 1);
const globalSuffixCharacter = roll20Object('character-global-suffix', { name: '전역 접미사 시험', controlledby: 'player-1' });
characters.push(globalSuffixCharacter);
['name', 'value', 'weapon_name', 'weapon_value'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`global-suffix-attribute-${index}`, {
    _characterid: globalSuffixCharacter.id, characterid: globalSuffixCharacter.id, name, current: String(index + 1), max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(globalSuffixCharacter.id).status, 'none', '반복 필드와 이름만 같은 전역 속성은 계약 증거가 아닙니다.');

const noRollSectionContract = parseSheetContract(`
  <input name="attr_note_marker_a"><input name="attr_note_marker_b"><input name="attr_note_marker_c">
  <button type="roll" name="roll_check" value="&{template:test} {{roll=[[1d20]]}}">Check</button>
  <fieldset class="repeating_notes"><input name="attr_title"><textarea name="attr_text"></textarea></fieldset>
`, { id: 'no-roll-section-contract', name: '롤 없는 반복 섹션 계약' });
helper.registerContract(noRollSectionContract);
const noRollSectionCharacter = roll20Object('character-no-roll-section', { name: '메모 시험', controlledby: 'player-1' });
characters.push(noRollSectionCharacter);
['note_marker_a', 'note_marker_b', 'note_marker_c'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`no-roll-marker-${index}`, {
    _characterid: noRollSectionCharacter.id, characterid: noRollSectionCharacter.id, name, current: '1', max: '',
  }));
});
for (let row = 0; row < 5; row += 1) {
  ['title', 'text'].forEach((field) => {
    attributeObjects.push(roll20Object(`no-roll-row-${row}-${field}`, {
      _characterid: noRollSectionCharacter.id, characterid: noRollSectionCharacter.id,
      name: `repeating_notes_row${row}_${field}`, current: `${field}-${row}`, max: '',
    }));
  });
}
const noRollSectionInspection = helper.inspectContracts(noRollSectionCharacter.id);
assert.strictEqual(noRollSectionInspection.status, 'matched');
assert.strictEqual(noRollSectionInspection.match.score, 3);
assert.strictEqual(noRollSectionInspection.match.ratio, 1);
assert.strictEqual(helper.contractRolls(noRollSectionCharacter.id).length, 1);

const prefixSectionContract = parseSheetContract(`
  <input name="attr_prefix_marker_a"><input name="attr_prefix_marker_b"><input name="attr_prefix_marker_c">
  <fieldset class="repeating_item">
    <input name="attr_name"><input name="attr_value">
    <button type="roll" name="roll_use" value="&{template:test} {{name=@{name}}} {{roll=[[@{value}]]}}">Item</button>
  </fieldset>
  <fieldset class="repeating_item_details">
    <input name="attr_name"><input name="attr_value">
    <button type="roll" name="roll_use" value="&{template:test} {{name=@{name}}} {{roll=[[@{value}]]}}">Detail</button>
  </fieldset>
`, { id: 'prefix-section-contract', name: '반복 섹션 접두사 계약' });
helper.registerContract(prefixSectionContract);
const prefixSectionCharacter = roll20Object('character-prefix-section', { name: '반복 접두사 시험', controlledby: 'player-1' });
characters.push(prefixSectionCharacter);
Object.entries({
  prefix_marker_a: '1', prefix_marker_b: '1', prefix_marker_c: '1',
  repeating_item_rowI_name: 'Sword', repeating_item_rowI_value: '45',
  repeating_item_details_rowD_name: 'Gem', repeating_item_details_rowD_value: '60',
}).forEach(([name, current], index) => {
  attributeObjects.push(roll20Object(`prefix-section-attribute-${index}`, {
    _characterid: prefixSectionCharacter.id, characterid: prefixSectionCharacter.id, name, current, max: '',
  }));
});
assert.strictEqual(helper.inspectContracts(prefixSectionCharacter.id).status, 'matched');
const prefixSectionRolls = helper.contractRolls(prefixSectionCharacter.id);
assert.strictEqual(prefixSectionRolls.length, 2);
assert(prefixSectionRolls.some((item) => item.row.id === 'rowI' && item.aliases.includes('Sword')));
assert(prefixSectionRolls.some((item) => item.row.id === 'rowD' && item.aliases.includes('Gem')));
assert(!prefixSectionRolls.some((item) => item.row.id === 'details_rowD'));

const literalFire = helper.resolveContractAction(contractCharacter, '화염', false);
assert(literalFire.handled && literalFire.result.ok && sent.at(-1).content.includes('{{subject=화염}}') && sent.at(-1).content.includes('[[1d6]]'),
  '원본 literal exact를 주사위 단어 제거 호환 매칭보다 먼저 실행해야 합니다.');
const literalFireDice = helper.resolveContractAction(contractCharacter, '화염주사위', false);
assert(literalFireDice.handled && literalFireDice.result.ok && sent.at(-1).content.includes('{{subject=화염 주사위}}') && sent.at(-1).content.includes('[[1d8]]'));
const genericDiceWord = helper.resolveContractAction(contractCharacter, '주사위', false);
assert(genericDiceWord.handled && genericDiceWord.result.reason === 'conflict' && genericDiceWord.result.choices.length < 10 &&
  genericDiceWord.result.choices.every((choice) => /주사위/.test(choice.label)),
  '주사위라는 검색어를 빈 호환 키로 바꿔 모든 굴림을 선택지로 보여주면 안 됩니다.');

const ambiguousContractBefore = sent.length;
const ambiguousContract = helper.resolveContractAction(contractCharacter, '겹친판정', false);
assert(ambiguousContract.handled && ambiguousContract.result.reason === 'conflict' && ambiguousContract.result.choices.length === 2);
assert.notStrictEqual(ambiguousContract.result.choices[0].label, ambiguousContract.result.choices[1].label,
  '같은 표시명의 원본 롤은 선택 버튼에서 서로 구분되어야 합니다.');
assert.strictEqual(sent.length, ambiguousContractBefore, '모호한 계약 항목을 임의 실행하면 안 됩니다.');
const ambiguousButtons = runBangBang('!!겹친판정', '계약 탐사자').find((item) => item.who === '시트 헬퍼');
assert(ambiguousButtons && ambiguousButtons.content.includes('background:#111') && ambiguousButtons.content.includes('#2'),
  '모호한 원본 롤은 구분 가능한 검정 선택 버튼으로 표시해야 합니다.');
runtime.state.KIBSheetHelper.managerCharacterId = contractCharacterId;
parsedCheck.roll.modesIncomplete = true;
const contractManagerNotes = helper.refresh().get('notes');
assert(contractManagerNotes.includes('겹친 판정 (2개)') && contractManagerNotes.includes('!시트 계약목록|' + contractCharacterId),
  '관리 핸드아웃에서도 같은 이름의 원본 롤을 숨기지 말고 선택 단계로 연결해야 합니다.');
assert(contractManagerNotes.includes('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다.'),
  '불완전하게 확장된 source 모드를 관리 핸드아웃에서 완전한 목록처럼 보여주면 안 됩니다.');
delete parsedCheck.roll.modesIncomplete;
const contractListCommand = contractManagerNotes.match(/href="(!시트 계약목록\|[^"<]+)"/);
assert(contractListCommand, contractManagerNotes);
runtime.state.KIBSheetHelper.activeCharacterId = characterId;
const contractListBefore = sent.length;
events['chat:message']({ type: 'api', content: contractListCommand[1], playerid: 'gm', who: '테스터 (GM)' });
const contractListMessage = sent.slice(contractListBefore).find((item) => item.who === '시트 헬퍼');
assert(contractListMessage && contractListMessage.content.includes('background:#111') && contractListMessage.content.includes(contractCharacterId),
  '관리 화면의 중복 롤 선택은 현재 화자가 아니라 관리 대상 캐릭터로 고정해야 합니다.');
runtime.state.KIBSheetHelper.managerCharacterId = characterId;
const nameModeConflict = helper.resolveContractAction(contractCharacter, '이름충돌', false);
assert(nameModeConflict.handled && nameModeConflict.result.reason === 'conflict' && nameModeConflict.result.choices.length === 2,
  '원본 롤 이름과 다른 롤의 모드명이 겹치면 선택 버튼을 보여야 합니다.');
assert.strictEqual(helper.resolveContractAction(contractCharacter, '정밀관찰 보너스2', false).handled, false,
  '없는 모드 접미사를 기본 롤이나 다른 숫자 모드로 축약 매칭하면 안 됩니다.');
const directPriority = helper.resolveContractAction(contractCharacter, '우선판정', false);
assert(directPriority.handled && directPriority.result.ok && sent.at(-1).content.includes('[[1d100+0]]'),
  '같은 이름의 일반 버튼과 질문 버튼이 있으면 질문 없는 원본 버튼을 우선해야 합니다.');
const queryPriority = helper.resolveContractAction(contractCharacter, '우선판정 보너스1', false);
assert(queryPriority.handled && queryPriority.result.ok && sent.at(-1).content.includes('[[1d100+1+0]]'),
  '질문 선택과 내부 속성 모드가 겹치면 추가 override 없는 원본 질문 선택을 우선해야 합니다.');
const tamperedBefore = sent.length;
const tamperedContract = helper.executeContract(contractCharacterId, '다른-계약', parsedCheck.roll.key, '', '', false, '');
assert.strictEqual(tamperedContract.ok, false);
assert.strictEqual(sent.length, tamperedBefore, '변조된 계약 선택을 실행하면 안 됩니다.');

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
  ['hit-location', '명중부위', helper.rollHitLocation(officialCharacterId, false)],
].forEach(([kind, label, result]) => {
  assert.strictEqual(result.ok, true, `${label} 실행 실패`);
  assert.strictEqual(
    result.payload && result.payload.cutinKey,
    cutinItem(kind, label).key,
    `${label} 실행 payload와 컷인 목록 key가 다릅니다.`,
  );
});
const insanityAliasRolls = sent.filter((item) => item.content && item.content.includes('kib_sheet_result=')).length;
events['chat:message']({ type: 'api', content: '!!실시간', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('{{madness_type=[[1]]}}'));
events['chat:message']({ type: 'api', content: '!!요약', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('{{madness_type=[[2]]}}'));
events['chat:message']({ type: 'api', content: '!!일시적광기', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('굴림이 아니라 시트 상태'));
events['chat:message']({ type: 'api', content: '!!장기적광기', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('굴림이 아니라 시트 상태'));
events['chat:message']({ type: 'api', content: '!!일시적', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('굴림이 아니라 시트 상태'));
events['chat:message']({ type: 'api', content: '!!장기적', playerid: 'player-1', who: '저널 이름' });
assert(sent.at(-1).content.includes('굴림이 아니라 시트 상태'));
assert.strictEqual(sent.filter((item) => item.content && item.content.includes('kib_sheet_result=')).length, insanityAliasRolls + 2);

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

const nativeSpecialBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message']({
  type: 'general', rolltemplate: 'cocOther', playerid: 'player-1', who: '저널 이름',
  content: '{{subject=1d100}} {{free_roll=$[[0]]}}', inlinerolls: [{ results: { total: 51 } }],
});
events['chat:message']({
  type: 'general', rolltemplate: 'cocOther', playerid: 'player-1', who: '저널 이름',
  content: '{{madness_type=$[[0]]}} {{rand_roll=$[[1]]}} {{rand_roll2=$[[2]]}}',
  inlinerolls: [2, 7, 3].map((total) => ({ results: { total } })),
});
events['chat:message']({
  type: 'general', rolltemplate: 'coc-dice-roll', playerid: 'player-1', who: '공개 시트 탐사자',
  content: '{{name=Rolling 1d100}} {{diceroll=$[[0]]}}', inlinerolls: [{ results: { total: 42 } }],
});
events['chat:message']({
  type: 'general', rolltemplate: 'coc-body-hit-loc', playerid: 'player-1', who: '공개 시트 탐사자',
  content: '{{roll1=$[[0]]}}', inlinerolls: [{ results: { total: 17 } }],
});
events['chat:message']({
  type: 'general', rolltemplate: 'coc-bomadness-rt', playerid: 'player-1', who: '공개 시트 탐사자',
  content: '{{roll1=$[[0]]}} {{rounds=$[[1]]}}', inlinerolls: [6, 4].map((total) => ({ results: { total } })),
});
const nativeSpecialResults = sent.filter((item) => item.event === 'sheet:result').slice(nativeSpecialBefore);
assert.deepStrictEqual(nativeSpecialResults.map((item) => item.payload.kind), ['free', 'madness', 'free', 'hit-location', 'madness']);
assert.strictEqual(nativeSpecialResults[0].payload.result.total, 51);
assert.strictEqual(nativeSpecialResults[1].payload.result.madnessLabel, '요약');
assert.strictEqual(nativeSpecialResults[1].payload.result.duration, 3);
assert.strictEqual(nativeSpecialResults[2].payload.result.total, 42);
assert.strictEqual(nativeSpecialResults[3].payload.result.total, 17);
assert.strictEqual(nativeSpecialResults[4].payload.result.madnessLabel, '실시간');
assert.strictEqual(nativeSpecialResults[4].payload.result.total, 6);
assert.strictEqual(nativeSpecialResults[4].payload.result.duration, 4);
assert.strictEqual(nativeSpecialResults[4].payload.madnessType, 1);
assert.strictEqual(nativeSpecialResults[4].payload.source, 'sheet');
assert(nativeSpecialResults[4].payload.cutinKey);

const officialScan = helper.scan(officialCharacterId, true);
assert.strictEqual(officialScan.matched, true);
assert.strictEqual(officialScan.schema.id, 'name');
assert.strictEqual(officialScan.schema.officialLegacy, true);
assert(officialScan.specialDice.some((item) => item.kind === 'hit-location'));
assert(officialScan.specialDice.some((item) => item.kind === 'free'));
assert(!officialScan.specialDice.some((item) => item.kind === 'luck'));
const officialDicePanel = attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'toggledr');
officialDicePanel.set('current', '0');
const officialHiddenDice = helper.scan(officialCharacterId, true);
assert(!officialHiddenDice.specialDice.some((item) => item.kind === 'free' || item.kind === 'hit-location'));
officialDicePanel.set('current', '1');
helper.scan(officialCharacterId, true);
assert(officialScan.fields.some((item) => item.label === '사진술' && item.value === '47'));
assert(officialScan.weapons.some((item) => item.label === '권총'));
assert(officialScan.spells.some((item) => item.label === '문지기'));
assert(officialScan.resources.some((item) => item.attr === 'major_wound_toggle'));
assert(!officialScan.resources.some((item) => item.attr === 'major-wound-toggle'));
assert.strictEqual(
  officialScan.madnessHistory.map((item) => item.attr).join(','),
  'current_mental_condition,phobias_manias,injuries_scars,encounters_with_strange_entities',
);

assert.strictEqual(helper.roll(officialCharacterId, '관찰력', {}).ok, true);
let officialOutput = sent.filter((item) => item.content).at(-1).content;
assert(officialOutput.includes('&{template:coc-1}'));
assert(officialOutput.includes('{{name=관찰력}}'));
assert(officialOutput.includes('{{roll1=[[1d100]]}}'));
assert(!officialOutput.includes('{{roll2=[[1d100]]}}'));
assert(!officialOutput.includes('{{subject=관찰력}}'));

assert.strictEqual(helper.roll(officialCharacterId, '관찰력', { mode: '보너스1' }).ok, true);
officialOutput = sent.filter((item) => item.content).at(-1).content;
assert(officialOutput.includes('&{template:coc}'));
assert(officialOutput.includes('{{roll2=[[1d100]]}}') && officialOutput.includes('{{dice_type=[[1]]}}'));

assert.strictEqual(helper.rollWeapon(officialCharacterId, '권총', false).ok, true);
officialOutput = sent.filter((item) => item.content).at(-1).content;
assert(officialOutput.includes('&{template:coc-attack-1}'));
assert(officialOutput.includes('{{name=권총}}'));
assert(officialOutput.includes('{{damage=[[1d10+0]]}}'));

assert.strictEqual(helper.showSpell(officialCharacterId, '문지기', false).ok, true);
officialOutput = sent.filter((item) => item.content).at(-1).content;
assert(officialOutput.includes('&{template:default}'));
assert(officialOutput.includes('{{name=문지기}}'));
assert(officialOutput.includes('{{시전 시간=1라운드}}'));

const officialShowskills = attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'showskills');
officialShowskills.set('current', '3');
const modernScan = helper.scan(officialCharacterId, true);
assert.strictEqual(modernScan.schema.suffix, '_mdr');
assert(modernScan.fields.some((item) => item.label === '드론 조종' && item.value === '44'));
assert(modernScan.fields.some((item) => item.label === '관찰력' && item.attr === 'spot_hidden_mdr'));
[
  ['4', '인쇄', 'artandcraft_et'],
  ['5', '항해 지도', 'artandcraft_ow'],
  ['6', '홀로그램', 'artandcraft_ic'],
].forEach(([era, label, attr]) => {
  officialShowskills.set('current', era);
  const eraScan = helper.scan(officialCharacterId, true);
  assert(eraScan.fields.some((item) => item.label === label && item.attr === attr));
});
officialShowskills.set('current', '2');
helper.scan(officialCharacterId, true);

const officialHp = attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'hp');
officialHp.set('current', '4');
events['change:attribute'](officialHp, { current: '10' });
assert.strictEqual(attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'major_wound_toggle').get('current'), '1');
assert(!attributeObjects.some((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'major-wound-toggle'));

const officialNativeBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message']({
  type: 'general',
  rolltemplate: 'coc-1',
  playerid: 'player-1',
  who: '공개 시트 탐사자',
  content: '{{name=관찰력}} {{success=$[[0]]}} {{hard=$[[1]]}} {{extreme=$[[2]]}} {{roll1=$[[3]]}}',
  inlinerolls: [50, 25, 10, 25].map((total) => ({ results: { total } })),
});
const officialNativeResults = sent.filter((item) => item.event === 'sheet:result');
assert.strictEqual(officialNativeResults.length, officialNativeBefore + 1);
assert.strictEqual(officialNativeResults.at(-1).payload.label, '관찰력');
assert.strictEqual(officialNativeResults.at(-1).payload.result.total, 25);
assert.strictEqual(officialNativeResults.at(-1).payload.outcome, 'hard');

const officialTypeAttackBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message']({
  type: 'general',
  rolltemplate: 'type-coc-attack-1',
  playerid: 'player-1',
  who: '공개 시트 탐사자',
  content: '{{name=권총}} {{success=$[[0]]}} {{hard=$[[1]]}} {{extreme=$[[2]]}} {{roll1=$[[3]]}}',
  inlinerolls: [50, 25, 10, 12].map((total) => ({ results: { total } })),
});
assert.strictEqual(sent.filter((item) => item.event === 'sheet:result').length, officialTypeAttackBefore + 1);
assert.strictEqual(sent.filter((item) => item.event === 'sheet:result').at(-1).payload.label, '권총');

const ambiguousBefore = sent.filter((item) => item.event === 'sheet:result').length;
events['chat:message']({
  type: 'general',
  rolltemplate: 'coc',
  playerid: 'player-1',
  who: '공개 시트 탐사자',
  content: '{{name=관찰력}} {{success=$[[0]]}} {{hard=$[[1]]}} {{extreme=$[[2]]}} {{roll1=$[[3]]}} {{roll2=$[[4]]}} {{roll3=$[[5]]}}',
  inlinerolls: [50, 25, 10, 12, 42, 92].map((total) => ({ results: { total } })),
});
assert.strictEqual(sent.filter((item) => item.event === 'sheet:result').length, ambiguousBefore);

const ildScan = helper.scan(ildCharacterId, true);
assert.strictEqual(ildScan.matched, true);
assert.strictEqual(ildScan.score, 11);
assert.strictEqual(ildScan.schema.id, 'name');
assert.strictEqual(ildScan.schema.era, '3');
assert.strictEqual(ildScan.schema.suffix, '_mdr');
assert(ildScan.fields.some((item) => item.label === '사진술' && item.value === '45'));
assert.strictEqual(helper.roll(ildCharacterId, '관찰력', {}).ok, true);

const ildShowskills = attributeObjects.find((item) =>
  item.get('_characterid') === ildCharacterId && item.get('name') === 'showskills');
ildShowskills.set('current', '2');
const ildFallbackScan = helper.scan(ildCharacterId, true);
assert.strictEqual(ildFallbackScan.schema.era, '3');
assert.strictEqual(ildFallbackScan.schema.suffix, '_mdr');

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
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{magic_condition=문에 손을 댄다.}}'));
assert.strictEqual(helper.rollArmor(characterId, '철제 투구', false).ok, true);
assert.strictEqual(helper.rollFree(characterId, false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:cocOther}'));
assert(last.includes('{{subject=2d6+3}} {{free_roll=[[2d6+3]]}}'));
assert(runBangBang('!!r 4d6+2').some((item) => item.content && item.content.includes('{{subject=4d6+2}} {{free_roll=[[4d6+2]]}}')));
['!!r', '!!r 1d6+', '!!r 1dd6', '!!r (', '!!r 1d6]] {{subject=침입'].forEach((command) => {
  const output = runBangBang(command);
  assert(output.some((item) => item.who === '시트 헬퍼'), `${command} 오류 안내가 없습니다.`);
  assert(!output.some((item) => item.content && item.content.includes('kib_sheet_result=')), `${command}가 굴림을 보내면 안 됩니다.`);
});
assert.strictEqual(helper.rollMadness(characterId, '', false).ok, true);
events['chat:message']({ type: 'api', content: '!!관찰력 보너스1', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{subject=관찰력}}') && last.includes('{{dice_type=[[1]]}}'), last);
setCurrent('rand_maddess', '1');
events['chat:message']({ type: 'api', content: '!!광기실시간', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{madness_type=[[1]]}}'), '실시간 광기 명령은 실시간 표를 굴려야 합니다.');
setCurrent('rand_maddess', '2');
events['chat:message']({ type: 'api', content: '!!광기요약', playerid: 'player-1', who: '저널 이름' });
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('{{madness_type=[[2]]}}'), '요약 광기 명령은 요약 표를 굴려야 합니다.');
setCurrent('rand_maddess', 'bogus');
assert.strictEqual(helper.rollMadness(characterId, '', false).ok, false);
setCurrent('rand_maddess', '1');
assert.strictEqual(helper.rollLuck(characterId, false).ok, false);
assert(!source.includes('3d6*5'), '시트에 없는 행운 결정 공식을 만들면 안 됨');
assert.strictEqual(helper.rollHitLocation(characterId, false).ok, false);
assert.strictEqual(helper.rollFree(officialCharacterId, false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-dice-roll}'));
assert(last.includes('{{diceroll=[[1d100]]}}'));
assert.strictEqual(helper.rollHitLocation(officialCharacterId, false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-body-hit-loc} {{roll1=[[1D20]]}}'));
assert.strictEqual(helper.rollMadness(officialCharacterId, '1', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-bomadness-rt}'));
assert.strictEqual(helper.rollMadness(officialCharacterId, '', false).ok, false);
assert.strictEqual(helper.rollMadness(officialCharacterId, '2', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-bomadness-summ}'));
const officialPulpMadness = attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'pulp_bomtoggle');
const officialMixedMadness = attributeObjects.find((item) =>
  item.get('_characterid') === officialCharacterId && item.get('name') === 'mixedbom');
officialPulpMadness.set('current', '1');
officialMixedMadness.set('current', '1');
assert.strictEqual(helper.rollMadness(officialCharacterId, '1', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-pulp-bomadness-rt}'), '펄프 광기 설정이 혼합 설정보다 우선해야 합니다.');
officialPulpMadness.set('current', '0');
assert.strictEqual(helper.rollMadness(officialCharacterId, '1', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-mixed-bomadness-rt}') && last.includes('{{roll1=[[1d15]]}}'));
officialMixedMadness.set('current', '0');
officialShowskills.set('current', '1');
helper.scan(officialCharacterId, true);
assert.strictEqual(helper.rollMadness(officialCharacterId, '2', false).ok, true);
last = sent.filter((item) => item.content).at(-1).content;
assert(last.includes('&{template:coc-bomadness-da-summ} {{roll1=[[1D10]]}}'));
officialShowskills.set('current', '2');
helper.scan(officialCharacterId, true);

assert.strictEqual(helper.roll(characterId, '없는 기능', {}).ok, false);
setCurrent('free_dice', '2d6+악성문자');
assert.strictEqual(helper.rollFree(characterId, false).ok, false);
setCurrent('free_dice', '2d6+3');

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
assert(source.includes('&{template:coc-dice-roll}'));
assert(source.includes('&{template:coc-body-hit-loc}'));
assert(source.includes('coc-pulp-bomadness-'));
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
events['chat:message']({ type: 'api', content: '!!명령대상 공개', playerid: 'gm', who: 'GM (GM)' });
assert.strictEqual(runtime.state.KIBSheetHelper.activeCharacterId, officialCharacter.id);
events['chat:message']({ type: 'api', content: '!시트 상태', playerid: 'gm', who: 'GM (GM)' });
assert(sent.at(-1).content.includes('공개 시트 탐사자'), 'GM이 고른 캐릭터를 다음 명령에 사용해야 합니다.');

events['chat:message']({ type: 'api', content: '!시트 GM전용추적|끄기', playerid: 'gm', who: 'GM (GM)' });
const gmLuck = runtime.createObj('attribute', {
  _characterid: gmCharacter.id, characterid: gmCharacter.id, name: 'luck', current: '31', max: '',
});
const playerLuck = runtime.createObj('attribute', {
  _characterid: playerCharacter.id, characterid: playerCharacter.id, name: 'luck', current: '31', max: '',
});
['san', 'cthulhu_mythos', 'str'].forEach((name) => runtime.createObj('attribute', {
  _characterid: playerCharacter.id, characterid: playerCharacter.id, name, current: '30', max: '',
}));
runtime.createObj('attribute', {
  _characterid: playerCharacter.id, characterid: playerCharacter.id, name: 'hp_max', current: '12', max: '',
});
helper.scan(playerCharacter.id, true);
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

const visibilityContract = parseSheetContract(`
  <style>
    .sheet-route[value="left"]:checked~.sheet-order { display: none; }
    .sheet-route[value="left"]:checked~.sheet-important-hide { display: none !important; }
    .sheet-route[value="left"]:checked~.sheet-important-show { display: none; }
  </style>
  <input name="attr_gate_marker_a"><input name="attr_gate_marker_b"><input name="attr_gate_marker_c">
  <input name="attr_gate_marker_d"><input name="attr_gate_marker_e"><input name="attr_gate_marker_f">
  <input type="checkbox" class="sheet-route" name="attr_route" value="left" checked>
  <input type="checkbox" class="sheet-route" name="attr_route" value="right">
  <input type="radio" class="sheet-dice-route" name="attr_dice_route" value="normal" checked>
  <input type="radio" class="sheet-dice-route" name="attr_dice_route" value="bonus">
  <div class="sheet-panel sheet-left"><button type="roll" name="roll_left" value="&{template:test} {{roll=[[1d6]]}}">왼쪽</button></div>
  <div class="sheet-panel sheet-right"><button type="roll" name="roll_right" value="&{template:test} {{roll=[[1d8]]}}">오른쪽</button></div>
  <div class="sheet-order"><button type="roll" name="roll_order" value="&{template:test} {{roll=[[1d12]]}}">순서</button></div>
  <div class="sheet-important-hide"><button type="roll" name="roll_important_hide" value="&{template:test} {{roll=[[1d14]]}}">중요 숨김</button></div>
  <div class="sheet-important-show"><button type="roll" name="roll_important_show" value="&{template:test} {{roll=[[1d16]]}}">중요 표시</button></div>
  <div class="sheet-dice-normal"><button type="roll" name="roll_dice_normal" value="&{template:test} {{subject=가시 판정}} {{roll=[[1d100]]}}"></button></div>
  <div class="sheet-dice-bonus"><button type="roll" name="roll_dice_bonus" value="&{template:test} {{subject=가시 판정}} {{roll=[[1d100+?{보너스 주사위|1개,1|2개,2}]]}}"></button></div>
  <button type="roll" name="roll_unknown" value="&{template:test} {{roll=[[1d10]]}}">미확정</button>
`, {
  id: 'visibility-contract', name: '가시성 계약',
  css: `.charsheet .sheet-panel{display:none}
    .sheet-route[value="left"]:checked~.sheet-left{display:block}
    .sheet-route[value="right"]:checked~.sheet-right{display:block}
    .sheet-route[value="left"]:checked~.sheet-order{display:block}
    .sheet-route[value="left"]:checked~.sheet-important-hide{display:block}
    .sheet-route[value="left"]:checked~.sheet-important-show{display:block!important}
    .sheet-dice-normal,.sheet-dice-bonus{display:none}
    .sheet-dice-route[value="normal"]:checked~.sheet-dice-normal{display:block}
    .sheet-dice-route[value="bonus"]:checked~.sheet-dice-bonus{display:block}`,
});
visibilityContract.rolls.find((roll) => roll.name === 'unknown').visibility = { name: 'future_state', op: 'eq', value: 'enabled' };
helper.registerContract(visibilityContract);
const visibilityCharacter = roll20Object('character-visibility', { name: '가시성 시험', controlledby: 'player-1' });
characters.push(visibilityCharacter);
['gate_marker_a', 'gate_marker_b', 'gate_marker_c', 'gate_marker_d', 'gate_marker_e', 'gate_marker_f'].forEach((name, index) => {
  attributeObjects.push(roll20Object(`visibility-marker-${index}`, {
    _characterid: visibilityCharacter.id, characterid: visibilityCharacter.id, name, current: '1', max: '',
  }));
});
const routeAttribute = roll20Object('visibility-route', {
  _characterid: visibilityCharacter.id, characterid: visibilityCharacter.id, name: 'route', current: 'left', max: '',
});
attributeObjects.push(routeAttribute);
assert.strictEqual(helper.inspectContracts(visibilityCharacter.id).status, 'matched');
assert.strictEqual(
  Array.from(helper.contractRolls(visibilityCharacter.id), (item) => item.roll.name).sort().join(','),
  ['dice_normal', 'important_show', 'left', 'order', 'unknown'].join(','),
  '현재 값으로 확실히 false인 CSS 분기만 제외하고 알 수 없는 조건은 유지해야 합니다.',
);
routeAttribute.set('current', 'right');
assert.strictEqual(
  Array.from(helper.contractRolls(visibilityCharacter.id), (item) => item.roll.name).sort().join(','),
  ['dice_normal', 'important_hide', 'important_show', 'order', 'right', 'unknown'].join(','),
  '같은 우선순위는 뒤의 외부 CSS가 이기고 !important는 source order보다 먼저 적용되어야 합니다.',
);
attributeObjects.splice(attributeObjects.indexOf(routeAttribute), 1);
assert.strictEqual(
  Array.from(helper.contractRolls(visibilityCharacter.id), (item) => item.roll.name).sort().join(','),
  ['dice_normal', 'important_show', 'left', 'order', 'unknown'].join(','),
  '속성 객체가 없으면 HTML에서 추출한 컨트롤 기본값을 사용해야 합니다.',
);
const hiddenMode = helper.resolveContractAction(visibilityCharacter, '가시판정 보너스1', false);
assert(hiddenMode.handled && hiddenMode.result.ok && sent.at(-1).content.includes('[[1d100+1]]'),
  '현재 CSS에서 숨겨진 원본 버튼도 사용자가 그 버튼의 실제 모드를 명시하면 실행할 수 있어야 합니다.');

console.log('Sheet Helper check: PASS');
