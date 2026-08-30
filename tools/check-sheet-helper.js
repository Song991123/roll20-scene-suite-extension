const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { performance } = require('perf_hooks');
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
const expectedEmbeddedIds = [
  'sheet-b3cd19dc20eb2710', 'sheet-c31fd05b084bc43c', 'sheet-63a2085d7f5fcc59',
  'sheet-5cab2ac801cda404', 'sheet-6bfaa0279ec11623', 'sheet-42f7d7a429602033',
  'sheet-99888fc8321bfa35', 'sheet-db283d90e7ce3ebf', 'sheet-9b09d7edc1403192',
  'sheet-897a7f3b9c6a8d78', 'sheet-cb64ac50518f0b60', 'sheet-5627b5447e29051b',
  'sheet-4055c5e84d37f613', 'sheet-43cc84d495364321', 'sheet-280aaa54543fa2cb',
  'sheet-985cd27c28db2ec5', 'sheet-333b740f1e467d01', 'sheet-ff0b26c52105b05d',
  'sheet-0a09356ad817043a', 'sheet-29faeb0167cef992', 'sheet-5a49a6311b033377',
  'sheet-21cbd9bcaf5c2ed4', 'sheet-4ef69d1ea6666110', 'sheet-4ffca055eb552326',
  'sheet-982a8cbae9128aea', 'sheet-c236bcff42e9a873', 'sheet-e1376f830eba05c9',
  'sheet-c653c0852b277de6', 'sheet-3916f9196f8c21ed', 'sheet-2f86ba472bdc1c42',
  'sheet-f08a8b2d95ebc3cb', 'sheet-1b678812ac2dada9', 'sheet-8165ce77b3301b5d',
  'sheet-cf240692b20596fc',
];
assert.deepStrictEqual(Array.from(embeddedSheets, (sheet) => sheet.id), expectedEmbeddedIds,
  '배포용 10번의 CoC 시트 인식 구조가 누락되거나 순서가 바뀌었습니다.');
assert.strictEqual(
  crypto.createHash('sha256').update(JSON.stringify(embeddedSheets)).digest('hex'),
  '1b50e8a19c41e13f899e67ead7cab6875e27134b5af36e82bf660c9966ce523e',
  'Brotli 교체 뒤 34개 시트의 전체 굴림·선택지·수치 구조가 달라졌습니다.',
);
assert(!/\brequire\s*\(/.test(recognitionBlock) &&
  !/\bBuffer(?:\.|\s*\()/.test(recognitionBlock) &&
  !/\bPromise\s*\(|\bWebAssembly\b/.test(recognitionBlock),
'Roll20 실행 구역은 require, Buffer, Promise, WebAssembly에 의존하면 안 됩니다.');
const brotliPayloadMatch = recognitionBlock.match(
  /var compressed = '([A-Za-z0-9+/=]+)';/,
);
assert(brotliPayloadMatch, '배포용 10번에서 Brotli 시트 데이터가 보이지 않습니다.');
const brotliPayload = brotliPayloadMatch[1];
const flippedAt = Math.floor(brotliPayload.length / 2);
const flippedPayload = brotliPayload.slice(0, flippedAt) +
  (brotliPayload.charAt(flippedAt) === 'A' ? 'B' : 'A') +
  brotliPayload.slice(flippedAt + 1);
[
  brotliPayload.slice(0, -4),
  `*${brotliPayload.slice(1)}`,
  flippedPayload,
  '',
].forEach((malformed, index) => {
  const malformedBlock = recognitionBlock.replace(brotliPayload, malformed);
  const startedAt = performance.now();
  assert.throws(
    () => vm.runInNewContext(malformedBlock, { KIBSheetContracts: [] }),
    `손상된 Brotli 데이터 ${index + 1}번을 거부해야 합니다.`,
  );
  assert(performance.now() - startedAt < 5000,
    `손상된 Brotli 데이터 ${index + 1}번 처리가 5초 안에 중단되지 않았습니다.`);
});
const embeddedModeArrays = new Set();
const repeatedModeArrays = new Map();
let embeddedRollsWithModes = 0;
let repeatedModeSets = 0;
embeddedSheets.forEach((sheet) => {
  assert(!Object.prototype.hasOwnProperty.call(sheet, 'name'),
    '배포용 시트 인식 정보에는 사람이 붙인 시트 이름을 포함하면 안 됩니다: ' + sheet.id);
  assert(!Object.prototype.hasOwnProperty.call(sheet, 'modeSets'),
    '복원 뒤 시트에 임시 modeSets가 남았습니다: ' + sheet.id);
  assert(!Object.prototype.hasOwnProperty.call(sheet, 'fieldAliasSets'),
    '복원 뒤 시트에 임시 fieldAliasSets가 남았습니다: ' + sheet.id);
  (sheet.rolls || []).forEach((roll) => {
    assert(Array.isArray(roll.modes),
      '복원 뒤 roll.modes가 배열이 아닙니다: ' + sheet.id + ' / ' + roll.key);
    if (roll.modes.length) {
      embeddedRollsWithModes++;
      embeddedModeArrays.add(roll.modes);
      assert(!Object.isFrozen(roll.modes),
        '기존 확장 호환성을 위해 선택 방식 배열은 변경 가능해야 합니다: ' + sheet.id + ' / ' + roll.key);
      roll.modes.forEach((mode) => {
        assert(!Object.isFrozen(mode) && !Object.isFrozen(mode.overrides || {}),
          '기존 확장 호환성을 위해 선택 방식 내용은 변경 가능해야 합니다: ' + sheet.id + ' / ' + roll.key);
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
      '복원 뒤 roll에 임시 mode 참조가 남았습니다: ' + sheet.id + ' / ' + roll.key);
  });
});
assert.strictEqual(embeddedModeArrays.size, embeddedRollsWithModes,
  '선택 방식 배열은 굴림마다 독립적이어야 합니다.');
assert(repeatedModeSets > 0, '동일한 선택 방식이 여러 굴림에 있는 검증 자료가 필요합니다.');
function findEmbeddedSheet(attributeCount, rollCount, modeCount) {
  const matches = embeddedSheets.filter((sheet) =>
    sheet.attributes.length === attributeCount &&
    sheet.rolls.length === rollCount &&
    sheet.rolls.reduce((total, roll) => total + (roll.modes || []).length, 0) === modeCount);
  assert.strictEqual(matches.length, 1,
    `구조 ${attributeCount}/${rollCount}/${modeCount}인 배포 시트는 정확히 하나여야 합니다.`);
  return matches[0];
}

const embeddedLargeSheet = findEmbeddedSheet(1613, 879, 744);
const embeddedMajorWound = embeddedLargeSheet.fields.find((field) =>
  ['중상', 'majorwound'].includes(String(field.label || '').toLowerCase().replace(/[\s_.:()"'-]+/g, '')) &&
  field.type === 'checkbox');
assert(embeddedMajorWound && embeddedMajorWound.visibility,
  '대형 시트의 대체 체력 화면에서 숨겨지는 중상 조건을 배포 정보에 보존해야 합니다.');
assert.strictEqual(embeddedLargeSheet.rolls.filter((roll) => /@\{int\}/i.test(roll.raw)).length, 2,
  '대형 시트의 단일·보너스/패널티 지능 버튼을 모두 원본대로 보존해야 합니다.');
[
  ['hp', '체력'], ['hp_max', '체력'],
  ['mp', '마력'], ['mp_max', '마력'],
].forEach(([name, group]) => {
  const field = embeddedLargeSheet.fields.find((candidate) => candidate.name === name);
  assert(field && field.groupLabel === group,
    `대형 시트의 ${name}은 원본 화면의 ${group} 현재·최대 묶음을 보존해야 합니다.`);
});
embeddedSheets.forEach((sheet) => {
  const current = sheet.fields.find((field) => field.name === 'san');
  const maximum = sheet.fields.find((field) => field.name === 'san_max');
  const starting = sheet.fields.find((field) => field.name === 'san_start');
  if (!current || !maximum || !starting) return;
  const groupLabels = [current, maximum, starting]
    .map((field) => String(field.groupLabel || '').replace(/^븿\s*/, ''))
    .filter(Boolean);
  if (groupLabels.length === 3)
    assert(groupLabels.every((label) => label === groupLabels[0]),
      sheet.id + '의 현재·시작·최대 수치가 서로 다른 원본 자원으로 묶이면 안 됩니다.');
  assert([starting.label].concat(starting.aliases || []).some((label) =>
    String(label || '').trim() && String(label).toLowerCase().replace(/[\s_.:-]+/g, '') !== 'sanstart'),
  sheet.id + '의 시작 수치 입력은 내부 변수명이 아니라 원본 표시명으로 구분되어야 합니다.');
});
assert(Buffer.byteLength(distributedSource, 'utf8') <= 650000,
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
assert(!/(?:getAttr|setResourceValue)\([^\n]*['"](?:san|luck)['"]|\bname\s*===\s*['"](?:san|luck)['"]/.test(runtimeOnlySource),
  '표시명 용어집이 아니라 특정 시트 변수명으로 직접 조회·변경하는 경로가 남았습니다.');

const fixture = parseSheetContract([
  '<input name="attr_fixture_marker_a">',
  '<input name="attr_fixture_marker_b">',
  '<input name="attr_fixture_marker_c">',
  '<input name="attr_character_name">',
  '<label>체력 <input type="number" name="attr_vital_current" max="20"></label>',
  '<input type="checkbox" class="sheet-temporary-mode" name="attr_temporary_mode" value="on">',
  '<label class="sheet-major-field">중상 <input type="checkbox" name="attr_major_state" value="active"></label>',
  '<div class="sheet-temporary-panel"><label>임시 체력 <input type="number" name="attr_temporary_health" value="20"></label></div>',
  '<label>빈사 <input type="checkbox" name="attr_dying_state" value="active"></label>',
  '<div class="mind-resource"><strong>이성</strong><input title="현재" type="number" name="attr_mind_current"><input title="시작" type="number" name="attr_mind_start" value="50"><input title="최대" type="number" name="attr_mind_limit" value="99"></div>',
  '<label>공식 수치 <input type="text" name="attr_formula_current" value="floor((@{mind_score}+20)/2)"></label>',
  '<label>장기 광기 <input type="checkbox" name="attr_long_madness" value="active"></label>',
  '<label>일시적 광기 <input type="checkbox" name="attr_temporary_madness" value="active"></label>',
  '<input type="number" name="attr_mind_score" value="60">',
  '<label>미입력 수치 <input type="number" name="attr_blank_target"></label>',
  '<button type="roll" name="roll_blank_target" value="&{template:fixture} {{subject=미입력 판정}} {{success=[[@{blank_target}]]}} {{hard=[[floor(@{blank_target}/2)]]}} {{roll=[[1d100]]}}">미입력 판정</button>',
  '<select name="attr_blank_mode"><option value="">미입력 방식</option><option value="1">입력 방식</option></select>',
  '<button type="roll" name="roll_blank_mode" value="&{template:fixture} {{subject=빈 선택 판정}} {{roll=[[@{blank_mode}]]}}">빈 선택 판정</button>',
  '<button type="roll" name="roll_intelligence_bonus" value="&{template:fixture} {{subject=지능}} {{success=[[@{mind_score}]]}} {{hard=[[floor(@{mind_score}/2)]]}} {{extreme=[[floor(@{mind_score}/5)]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}">지능</button>',
  '<button type="roll" name="roll_intelligence" value="&{template:fixture} {{subject=지능}} {{success=[[@{mind_score}]]}} {{hard=[[floor(@{mind_score}/2)]]}} {{extreme=[[floor(@{mind_score}/5)]]}} {{roll=[[1d100]]}}">지능</button>',
  '<input name="attr_skill_value" value="60">',
  '<input name="attr_indirect_value" value="60">',
  '<label><input type="radio" name="attr_indirect_fields" value="{{roll=[[1d100]]}}" checked>일반 판정</label>',
  '<button type="roll" name="roll_indirect_check" value="&{template:fixture} {{subject=간접 판정}} {{success=[[@{indirect_value}]]}} @{indirect_fields}"></button>',
  '<div class="mode-control">',
  '  <select name="attr_bonus_mode">',
  '    <option value="0">기본</option>',
  '    <option value="10">보너스 개 1</option>',
  '    <option value="-10">패널티 개 1</option>',
  '  </select>',
  '  <button type="roll" name="roll_precision" value="&{template:fixture} {{subject=정밀 관찰}} {{success=[[@{skill_value}]]}} {{hard=[[floor(@{skill_value}/2)]]}} {{extreme=[[floor(@{skill_value}/5)]]}} {{roll=[[1d100+@{bonus_mode}]]}}"></button>',
  '  <button type="roll" name="roll_dexterity" value="&{template:fixture} {{subject=민첩성}} {{success=[[@{skill_value}]]}} {{roll=[[1d100+@{bonus_mode}]]}}"></button>',
  '</div>',
  '<button type="roll" name="roll_dodge" value="&{template:fixture} {{subject=회피 (민첩성/2)}} {{success=[[floor(@{skill_value}/2)]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_brawl" value="&{template:fixture} {{subject=근접전(격투)}} {{success=[[@{skill_value}]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_sword" value="&{template:fixture} {{subject=근접전(도검)}} {{success=[[@{skill_value}]]}} {{roll=[[1d100]]}}"></button>',
  '<select name="attr_sheet_theme"><option value="1">라이즈벨</option><option value="2">루엔야크</option></select>',
  '<button type="roll" name="roll_theme_a" value="&{template:fixture} {{subject=테마 판정 A}} {{theme=[[@{sheet_theme}]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_theme_b" value="&{template:fixture} {{subject=테마 판정 B}} {{theme=[[@{sheet_theme}]]}} {{roll=[[1d100]]}}"></button>',
  '<select name="attr_trace_mode"><option value="0">기본</option><option value="1">공개</option></select>',
  '<button type="roll" name="roll_trace" value="&{template:fixture} {{subject=추적}} {{trace_mode=[[@{trace_mode}]]}} {{roll=[[1d100]]}}"></button>',
  '<select name="attr_gm_trace_mode"><option value="0">기본</option><option value="1">켜기</option></select>',
  '<button type="roll" name="roll_gm_trace" value="&{template:fixture} {{subject=GM전용추적}} {{gm_trace_mode=[[@{gm_trace_mode}]]}} {{roll=[[1d100]]}}"></button>',
  '<input name="attr_free_expression" value="1d6">',
  '<button type="roll" name="roll_free" value="&{template:fixture} {{subject=자유 굴림}} {{formula=@{free_expression}}} {{roll=[[@{free_expression}]]}}"></button>',
  '<fieldset class="repeating_skill">',
  '  <label>기능 이름 <input name="attr_item_name"></label>',
  '  <label>판정 수치 <input name="attr_item_value"></label>',
  '  <button type="roll" name="roll_item" value="&{template:fixture} {{subject=@{item_name}}} {{success=[[@{item_value}]]}} {{hard=[[floor(@{item_value}/2)]]}} {{extreme=[[floor(@{item_value}/5)]]}} {{roll=[[1d100]]}}"></button>',
  '</fieldset>',
  '<fieldset class="repeating_armory">',
  '  <label>무기 이름 <input name="attr_gear_title"></label>',
  '  <label>피해 <input name="attr_gear_damage"></label>',
  '  <label>공격 방식 <select name="attr_gear_style"><option value="1d4">보통 공격</option><option value="2d6">강한 공격</option></select></label>',
  '  <button type="roll" name="roll_gear" value="&{template:fixture} {{subject=@{gear_title}}} {{damage=[[@{gear_damage}]]}} {{roll=[[1d100+@{gear_style}]]}}"></button>',
  '</fieldset>',
  '<fieldset class="repeating_ritual">',
  '  <label>주문 이름 <input name="attr_incantation_title"></label>',
  '  <label>시전 수치 <input name="attr_incantation_target"></label>',
  '  <label>시전 방식 <select name="attr_incantation_style"><option value="1d8">단일 시전</option><option value="2d8">확대 시전</option></select></label>',
  '  <button type="roll" name="roll_incantation" value="&{template:fixture} {{subject=@{incantation_title}}} {{success=[[@{incantation_target}]]}} {{roll=[[1d100+@{incantation_style}]]}}"></button>',
  '</fieldset>',
  '<label>광기 발작 방식 <select name="attr_episode_style"><option value="1d10">실시간</option><option value="1d20">요약</option></select></label>',
  '<button type="roll" name="roll_episode" value="&{template:fixture} {{subject=정신 동요}} {{roll=[[@{episode_style}]]}}">광기 발작</button>',
  '<select name="attr_hidden_episode_style"><option value="1">실시간</option><option value="2">요약</option></select>',
  '<button type="roll" value="&{template:fixture-other} {{madness_type=[[@{hidden_episode_style}]]}} {{roll=[[1d10]]}}"></button>',
  '<button type="roll" name="roll_conflict_a" value="&{template:fixture} {{subject=겹친 굴림}} {{roll=[[1d6]]}}"></button>',
  '<button type="roll" name="roll_conflict_b" value="&{template:fixture} {{subject=겹친 굴림}} {{roll=[[1d8]]}}"></button>',
  '<rolltemplate class="sheet-rolltemplate-fixture">',
  '  {{#rollTotal() roll 1}}<b class="sheet-critical">Critical</b>{{/rollTotal() roll 1}}',
  '  {{#rollGreater() roll success}}<b class="sheet-fumble">Fumble</b>{{/rollGreater() roll success}}',
  '</rolltemplate>',
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
  css: [
    '.sheet-temporary-panel { display: none; }',
    '.sheet-temporary-mode[value="on"]:checked ~ .sheet-temporary-panel { display: block; }',
    '.sheet-temporary-mode[value="on"]:checked ~ .sheet-major-field { display: none; }',
  ].join('\n'),
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
const getAttrByNameOverrides = {};
const attributeFindCalls = [];
const characterFindCalls = [];
let roomCharacterIds = null;
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
    hide_tracking: true,
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
    const overrideKey = characterId + '|' + name + '|' + (valueType === 'max' ? 'max' : 'current');
    if (Object.prototype.hasOwnProperty.call(getAttrByNameOverrides, overrideKey))
      return getAttrByNameOverrides[overrideKey];
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
      attributeFindCalls.push({ ...query });
      const characterId = query._characterid || query.characterid;
      return attributeObjects.filter((item) =>
        characterId ? item.get('_characterid') === characterId :
          !roomCharacterIds || roomCharacterIds.has(item.get('_characterid'))).slice().reverse();
    }
    if (query._type === 'character' || query.type === 'character') {
      characterFindCalls.push({ ...query });
      return characters.filter((item) => !roomCharacterIds || roomCharacterIds.has(item.id));
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
  Date,
};

vm.createContext(runtime);
// 설정 문자열을 바꾸거나 구형 기능을 강제로 켜지 않고 배포 파일을 그대로 실행합니다.
vm.runInContext(distributedSource, runtime);
const helper = runtime.KIBSheetHelper;
assert(helper && typeof helper.registerContract === 'function',
  '배포용 10번을 그대로 실행하지 못했습니다.');
assert.strictEqual(helper.sheetContracts().length, expectedEmbeddedIds.length,
  '배포 파일의 실제 시트 인식 정보가 런타임에 등록되지 않았습니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.keepMe, '보존');
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections.preserved, 'keep',
  '업데이트할 때 기존 시트 선택 설정을 지우면 안 됩니다.');
events.ready();
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm',
  '구버전 비공개 변화 표시 설정을 업데이트 후 공개로 바꾸면 안 됩니다.');

function useContracts(...contracts) {
  runtime.KIBSheetContracts = contracts.slice();
  if (contracts.length) helper.registerContract(contracts[0]);
  else helper.refresh();
}
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false,
  '새 설치에서 플레이어 권한이 없는 GM 캐릭터를 기본 공개 대상에 포함하면 안 됩니다.');
const compactHelp = runtime.KIBScene.adapters.sheet.help.join('\n');
[':수치이름+3', '!!화자 본인', '!!변화알림 공개|GM|끄기', '!!GM캐릭터알림 켜기|끄기']
  .forEach((command) => assert(compactHelp.includes(command), '!sd help에 명령이 없습니다: ' + command));

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

function useRoomCharacters(...values) {
  roomCharacterIds = new Set(values.map((value) => typeof value === 'string' ? value : value.id));
  helper.refresh();
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

function messageSpeakingAs(who, playerId, speakingAs) {
  if (speakingAs !== undefined) return speakingAs;
  const name = String(who || '범용 탐사자').replace(/\s*\(GM\)\s*$/, '');
  const character = characters.find((item) => item.get('name') === name);
  const player = players[playerId || 'player-1'];
  return character ? 'character|' + character.id : player ? player.get('speakingas') : '';
}

function setPlayerSpeakingAs(who, playerId, speakingAs) {
  const id = playerId || 'player-1';
  const player = players[id];
  const value = messageSpeakingAs(who, id, speakingAs);
  if (player) player.set({ speakingas: value });
}

function runApi(content, who, playerId, speakingAs) {
  setPlayerSpeakingAs(who, playerId, speakingAs);
  const before = sent.length;
  events['chat:message']({
    type: 'api',
    content,
    playerid: playerId || 'player-1',
    who: who || '범용 탐사자',
  });
  return sent.slice(before);
}

function runGeneral(content, who, playerId, speakingAs) {
  setPlayerSpeakingAs(who, playerId, speakingAs);
  const before = sent.length;
  events['chat:message']({
    type: 'general', content,
    playerid: playerId || 'player-1', who: who || '범용 탐사자',
  });
  return sent.slice(before);
}

helper.registerContract(fixture);
useContracts(fixture);
const fixtureValues = {};
fixture.signature.forEach((entry) => {
  fixtureValues[typeof entry === 'string' ? entry : entry.name] = '1';
});
delete fixtureValues.blank_target;
Object.assign(fixtureValues, {
  character_name: '범용 탐사자',
  vital_current: '10',
  temporary_mode: '',
  temporary_health: '20',
  major_state: '0',
  dying_state: '0',
  mind_current: '50',
  mind_start: '50',
  mind_limit: '99',
  long_madness: '0',
  temporary_madness: '0',
  mind_score: '60',
  formula_current: 'floor((@{mind_score}+20)/2)',
  skill_value: '60',
  bonus_mode: '0',
  trace_mode: '0',
  gm_trace_mode: '0',
  free_expression: '1d6',
  repeating_skill_rowOne_item_name: '사용자 항목',
  repeating_skill_rowOne_item_value: '55',
  repeating_skill_rowTwo_item_name: '두 번째 항목',
  repeating_skill_rowTwo_item_value: '44',
  repeating_skill_rowAlpha_item_name: '추가 항목',
  repeating_skill_rowAlpha_item_value: '33',
  _reporder_repeating_skill: 'rowTwo,rowOne,rowTwo,missing',
  repeating_armory_rowGear_gear_title: '연습용 칼',
  repeating_armory_rowGear_gear_damage: '1d6',
  repeating_armory_rowGear_gear_style: '1d4',
  _reporder_repeating_armory: 'rowGear',
  repeating_ritual_rowRitual_incantation_title: '별빛 주문',
  repeating_ritual_rowRitual_incantation_target: '47',
  repeating_ritual_rowRitual_incantation_style: '1d8',
  _reporder_repeating_ritual: 'rowRitual',
  episode_style: '1d10',
});
const fixtureCharacter = addCharacter(
  'generic-character',
  '범용 탐사자',
  'player-1',
  fixtureValues,
);
useRoomCharacters(fixtureCharacter);

// 새 설치는 안전한 비공개로 시작하고, 명시적으로 저장된 기존 설정은 그대로 보존해야 합니다.
delete runtime.state.hide_tracking;
delete runtime.state.KIBSheetHelper.trackingMode;
delete runtime.state.KIBSheetHelper.trackGmOnly;
helper.refresh();
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false);
runtime.state.KIBSheetHelper.trackingMode = 'off';
runtime.state.KIBSheetHelper.trackGmOnly = true;
helper.refresh();
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'off',
  '사용자가 저장한 변화 알림 설정을 업데이트 중 초기화하면 안 됩니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, true,
  '사용자가 저장한 GM 캐릭터 알림 설정을 업데이트 중 초기화하면 안 됩니다.');
runtime.state.hide_tracking = false;
delete runtime.state.KIBSheetHelper.trackingMode;
delete runtime.state.KIBSheetHelper.trackGmOnly;
helper.refresh();
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'public',
  '구버전의 명시적인 공개 설정은 유지해야 합니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false);
runtime.state.hide_tracking = true;
delete runtime.state.KIBSheetHelper.trackingMode;
helper.refresh();
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm',
  '구버전의 명시적인 GM 전용 설정은 유지해야 합니다.');
runtime.state.KIBSheetHelper.trackGmOnly = false;

function fixtureAttribute(name) {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === fixtureCharacter.id && item.get('name') === name);
  assert(attribute, '시험 속성을 찾지 못했습니다: ' + name);
  return attribute;
}

function resetFixture(values) {
  Object.entries(values).forEach(([name, value]) => fixtureAttribute(name).set('current', String(value)));
  helper.scan(fixtureCharacter.id, true);
}

function changeFixture(name, next) {
  const attribute = fixtureAttribute(name);
  const before = attribute.get('current');
  const start = sent.length;
  attribute.set('current', String(next));
  events['change:attribute'](attribute, { current: before });
  return sent.slice(start);
}

function intelligenceRolls(messages) {
  return messages.filter((item) => item.content &&
    item.content.includes('{{subject=지능}}') && item.content.includes('kib_sheet_result='));
}

function finishIntelligence(messages, total) {
  const pending = intelligenceRolls(messages);
  assert.strictEqual(pending.length, 1, '자동 지능 판정은 정확히 한 번만 실행해야 합니다.');
  const token = pending[0].content.match(/kib_sheet_result=([A-Za-z0-9_-]+)/)[1];
  setPlayerSpeakingAs(fixtureCharacter.get('name'), 'player-1');
  const start = sent.length;
  events['chat:message']({
    type: 'general',
    content: '&{template:fixture} {{subject=지능}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
      '{{extreme=$[[2]]}} {{roll=$[[3]]}} {{kib_sheet_result=' + token + '}}',
    inlinerolls: [60, 30, 12, total].map((value) => ({ results: { total: value } })),
    who: fixtureCharacter.get('name'),
    playerid: 'player-1',
  });
  return sent.slice(start);
}

function addMinimalInsanityFixture(id, options) {
  const prefix = 'san_case_' + id;
  const toggles = [];
  for (let index = 0; index < (options.longCount || 0); index++)
    toggles.push(`<label>장기적 광기 <input type="checkbox" name="attr_${prefix}_long_${index}" value="active"></label>`);
  if (options.temporary)
    toggles.push(`<label>일시적 광기 <input type="checkbox" name="attr_${prefix}_temporary" value="active"></label>`);
  const contract = parseSheetContract([
    `<input name="attr_${prefix}_marker_a">`,
    `<input name="attr_${prefix}_marker_b">`,
    `<input name="attr_${prefix}_marker_c">`,
    `<div><strong>이성</strong><input title="현재" type="number" name="attr_${prefix}_current"><input title="시작" type="number" name="attr_${prefix}_start"><input title="최대" type="number" name="attr_${prefix}_maximum" value="99" disabled></div>`,
    toggles.join(''),
    `<input type="number" name="attr_${prefix}_intelligence" value="60">`,
    `<button type="roll" value="&{template:fixture} {{subject=지능}} {{success=[[@{${prefix}_intelligence}]]}} {{hard=[[floor(@{${prefix}_intelligence}/2)]]}} {{extreme=[[floor(@{${prefix}_intelligence}/5)]]}} {{roll=[[1d100]]}}">지능</button>`,
  ].join('\n'), { id: prefix, name: prefix, sourceHash: prefix });
  useContracts(contract);
  const values = {};
  contract.signature.forEach((entry) => { values[typeof entry === 'string' ? entry : entry.name] = '1'; });
  Object.assign(values, {
    [`${prefix}_current`]: '45',
    [`${prefix}_start`]: '50',
    [`${prefix}_maximum`]: '99',
    [`${prefix}_intelligence`]: '60',
  });
  if (options.temporary) values[`${prefix}_temporary`] = '0';
  for (let index = 0; index < (options.longCount || 0); index++) values[`${prefix}_long_${index}`] = '0';
  const character = addCharacter(prefix + '_character', prefix, 'player-1', values);
  useRoomCharacters(character);
  function attribute(suffix) {
    const name = prefix + '_' + suffix;
    return attributeObjects.find((item) => item.get('_characterid') === character.id && item.get('name') === name) || null;
  }
  function reset(valuesBySuffix) {
    Object.entries(valuesBySuffix).forEach(([suffix, value]) => attribute(suffix).set('current', String(value)));
    helper.scan(character.id, true);
  }
  function change(suffix, next) {
    const target = attribute(suffix);
    const before = target.get('current');
    const start = sent.length;
    target.set('current', String(next));
    events['change:attribute'](target, { current: before });
    return sent.slice(start);
  }
  assert.strictEqual(helper.inspectContracts(character.id).status, 'matched', prefix + ' 최소 시트를 인식하지 못했습니다.');
  return { prefix, character, attribute, reset, change };
}

let inspection = helper.inspectContracts(fixtureCharacter.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || '범용 시트 정보를 인식하지 못했습니다.');
assert.strictEqual(inspection.contract.id, fixture.id);
let scan = helper.scan(fixtureCharacter.id, true);
assert.strictEqual(scan.matched, true);
assert(!Object.prototype.hasOwnProperty.call(scan, 'profileName'),
  '사용자에게 보여 주지 않는 시트 이름을 런타임 결과에 다시 넣으면 안 됩니다.');
assert(scan.resources.some((item) => item.label === '체력' && item.value === 10 && item.max === 20),
  '원본 시트의 표시명과 숫자 입력란에서 범용 수치 목록을 만들지 못했습니다.');
assert(scan.resources.some((item) => item.label === '공식 수치' && item.value === 40),
  'Roll20 샌드박스에서도 원본 수치 공식을 안전하게 계산해야 합니다.');
assert(!scan.resources.some((item) => /fixture_marker/.test(item.name)),
  '사용자 표시명이 없는 내부 변수는 수치 목록에 노출하면 안 됩니다.');
assert(scan.resources.some((item) => item.name === 'skill_value' && item.label === '정밀 관찰'),
  '원본 굴림이 유일하게 가리키는 기능치는 원본 표시명으로 보여야 합니다: ' +
    scan.resources.map((item) => item.name + '=' + item.label).join(', '));

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
const unrelatedAttribute = addAttribute(fixtureCharacter.id, 'private_note', '이전');
const unrelatedScanCalls = attributeFindCalls.length;
unrelatedAttribute.set({ current: '변경' });
events['change:attribute'](unrelatedAttribute, { current: '이전' });
assert.strictEqual(attributeFindCalls.length, unrelatedScanCalls,
  '인식 대상이 아닌 메모 속성 변경으로 캐릭터 전체를 다시 분석하면 안 됩니다.');
assert(!runtime.KIBScene.adapters.cutin,
  '10 단독 검사에 컷인 adapter가 섞였습니다.');
const standaloneSheetManager = helper.refresh();
assert(standaloneSheetManager && !String(standaloneSheetManager.get('notes') || '').includes('판정 컷인'),
  '컷인 코드가 없는데 시트 관리 화면에 컷인 연결 기능이 표시됩니다.');
runtime.KIBScene.adapters.cutin = {
  sheetControls() { throw new Error('시트 헬퍼 관리 화면에서 컷인 UI를 호출하면 안 됩니다.'); },
};
runtime.state.KIBSheetHelper.managerHash = '';
const managerWithCutinInstalled = helper.refresh();
assert(managerWithCutinInstalled &&
  !String(managerWithCutinInstalled.get('notes') || '').includes('판정 컷인'),
  '컷인 코드가 함께 있어도 시트 헬퍼 관리 화면에 컷인 연결 기능이 표시되면 안 됩니다.');
delete runtime.KIBScene.adapters.cutin;

const speakingStatus = runApi('!!상태', '범용 탐사자', 'player-1');
const fallbackFindsBefore = characterFindCalls.length;
const profileStatus = runApi('!!상태', '테스터', 'player-1', 'player|player-1');
assert(speakingStatus.some((item) => item.content && item.content.includes('범용 탐사자 / 시트 현황')),
  'As 캐릭터의 상태를 보여주지 못했습니다.');
assert(profileStatus.some((item) => item.content && item.content.includes('As를 사용할 캐릭터로 바꾼 뒤')),
  '플레이어 프로필 화자에서 임의의 조작 가능 캐릭터로 대신 실행하면 안 됩니다.');
assert.strictEqual(characterFindCalls.length - fallbackFindsBefore, 0,
  'As 캐릭터를 찾을 때 캐릭터 전체를 이름으로 다시 검색하면 안 됩니다.');

const currentSpeaker = addCharacter('current-speaker', '현재 As 캐릭터', 'player-1', {
  ...fixtureValues,
  vital_current: '7',
});
runtime.state.KIBSheetHelper.activeCharacterId = fixtureCharacter.id;
const storedTargetBefore = fixtureAttribute('vital_current').get('current');
const currentSpeakerHealth = attributeObjects.find((item) =>
  item.get('_characterid') === currentSpeaker.id && item.get('name') === 'vital_current');
runGeneral(':체력+3', currentSpeaker.get('name'), 'player-1', 'character|' + currentSpeaker.id);
assert.strictEqual(currentSpeakerHealth.get('current'), '10',
  ':수치 변경은 이전에 확인한 캐릭터가 아니라 현재 As 캐릭터에 적용해야 합니다.');
assert.strictEqual(fixtureAttribute('vital_current').get('current'), storedTargetBefore,
  '현재 As와 다른 activeCharacterId의 수치를 바꾸면 안 됩니다.');
characters.splice(characters.indexOf(currentSpeaker), 1);
for (let index = attributeObjects.length - 1; index >= 0; index--)
  if (attributeObjects[index].get('_characterid') === currentSpeaker.id) attributeObjects.splice(index, 1);

const blockedAttributeStart = attributeObjects.length;
const blockedCharacter = addCharacter('blocked-character', '권한 없는 캐릭터', 'other-player', fixtureValues);
const missingMessages = runApi(
  '!시트 굴림목록|missing-character|' + encodeURIComponent('정밀 관찰') + '|0',
  '테스터',
  'player-1',
);
assert.strictEqual(missingMessages.length, 1);
assert.strictEqual(missingMessages[0].content,
  '/w "테스터" 버튼에 기록된 캐릭터를 찾지 못했습니다.',
  '삭제된 관리 버튼의 캐릭터 ID를 다른 조작 가능 캐릭터로 대신 실행하면 안 됩니다.');
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

const blankRollStart = sent.length;
const blankRoll = helper.resolveContractAction(fixtureCharacter, '미입력 판정', false);
assert(blankRoll.handled && !blankRoll.result.ok && /비어 있습니다/.test(blankRoll.result.error),
  '원본 시트의 필수 굴림 수치가 비었으면 사용자 오류로 중단해야 합니다.');
assert.strictEqual(sent.length, blankRollStart,
  '빈 수치가 들어간 굴림을 Roll20 sendChat으로 넘기면 안 됩니다.');
const blankCommandMessages = runApi('!!미입력 판정');
assert(blankCommandMessages.some((item) => item.who === '시트 헬퍼' && /비어 있습니다/.test(item.content)),
  '빈 수치 명령은 채팅에 알아볼 수 있는 오류를 보여줘야 합니다.');
assert(!blankCommandMessages.some((item) => item.content && item.content.includes('&{template:fixture}')),
  '빈 수치 명령이 Roll20 굴림으로 전송되면 안 됩니다.');
const storedBlankAttribute = addAttribute(fixtureCharacter.id, 'blank_target', '');
getAttrByNameOverrides[fixtureCharacter.id + '|blank_target|current'] = '0';
const storedBlankStart = sent.length;
const storedBlankRoll = helper.resolveContractAction(fixtureCharacter, '미입력 판정', false);
assert(storedBlankRoll.handled && !storedBlankRoll.result.ok && /비어 있습니다/.test(storedBlankRoll.result.error),
  '저장된 입력칸이 빈 경우 원본 기본값으로 덮지 말고 사용자 오류로 중단해야 합니다.');
assert.strictEqual(sent.length, storedBlankStart,
  'Roll20이 저장된 빈 입력칸을 0으로 읽어도 굴림을 sendChat으로 넘기면 안 됩니다.');
delete getAttrByNameOverrides[fixtureCharacter.id + '|blank_target|current'];
attributeObjects.splice(attributeObjects.indexOf(storedBlankAttribute), 1);
events['destroy:attribute'](storedBlankAttribute);
const unknownCommandMessages = runApi('!!존재하지 않는 굴림');
assert(unknownCommandMessages.some((item) => item.who === '시트 헬퍼' && /찾지 못했습니다/.test(item.content)),
  '없는 굴림 명령은 샌드박스 오류가 아니라 채팅 오류로 끝나야 합니다.');
const blankModeInstance = helper.contractRolls(fixtureCharacter.id)
  .find((instance) => instance.label === '빈 선택 판정');
const blankMode = blankModeInstance && blankModeInstance.modes.find((mode) =>
  Object.prototype.hasOwnProperty.call(mode.overrides || {}, 'blank_mode') && mode.overrides.blank_mode === '');
assert(blankModeInstance && blankMode, '빈 원본 선택값을 가진 굴림 검증 자료가 필요합니다.');
const blankModeStart = sent.length;
const blankModeResult = helper.executeContract(
  fixtureCharacter.id, fixture.id, blankModeInstance.roll.key, '', blankMode.id, false, '',
);
assert(blankModeResult && !blankModeResult.ok && /비어 있습니다/.test(blankModeResult.error),
  '수식 안에 들어가는 빈 원본 선택값도 사용자 오류로 중단해야 합니다.');
assert.strictEqual(sent.length, blankModeStart,
  '빈 원본 선택값을 Roll20 sendChat으로 넘기면 안 됩니다.');

const bonus = helper.resolveContractAction(fixtureCharacter, '정밀관찰 보너스1', false);
assert(bonus.handled && bonus.result.ok);
assert.strictEqual(bonus.result.payload.modeLabel, '보너스 개 1');
assert(sent.at(-1).content.includes('[[1d100+10]]'),
  '원본 선택지를 고정 공식으로 재조립하지 말고 원본 선택 값을 적용해야 합니다.');

const abbreviatedDexterity = helper.resolveContractAction(fixtureCharacter, '민첩', false);
assert(abbreviatedDexterity.handled && abbreviatedDexterity.result.ok &&
  sent.at(-1).content.includes('{{subject=민첩성}}'),
  '이름 앞부분이 유일하게 가까운 민첩성 굴림을 회피 후보보다 먼저 실행해야 합니다.');
const abbreviatedDexterityBonus = helper.resolveContractAction(fixtureCharacter, '민첩 보너스1', false);
assert(abbreviatedDexterityBonus.handled && abbreviatedDexterityBonus.result.ok &&
  abbreviatedDexterityBonus.result.payload.modeLabel === '보너스 개 1' &&
  sent.at(-1).content.includes('{{subject=민첩성}}'),
  '줄인 항목 이름 뒤에도 원본 보너스·패널티 방식을 붙여 실행할 수 있어야 합니다.');
const uniqueNestedName = helper.resolveContractAction(fixtureCharacter, '격투', false);
assert(uniqueNestedName.handled && uniqueNestedName.result.ok &&
  sent.at(-1).content.includes('{{subject=근접전(격투)}}'),
  '항목 이름 안의 일부가 한 굴림에만 맞으면 바로 실행해야 합니다.');
const ambiguousParentName = helper.resolveContractAction(fixtureCharacter, '근접전', false);
assert(ambiguousParentName.handled && !ambiguousParentName.result.ok &&
  ambiguousParentName.result.reason === 'conflict' && ambiguousParentName.result.choices.length === 2,
  '같은 근접도로 맞는 근접전 항목이 여럿일 때만 선택지를 보여야 합니다.');

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

const createdSkillRow = [
  addAttribute(fixtureCharacter.id, 'repeating_skill_rowFresh_item_name', '즉석 기능'),
  addAttribute(fixtureCharacter.id, 'repeating_skill_rowFresh_item_value', '41'),
];
const createdWeaponRow = [
  addAttribute(fixtureCharacter.id, 'repeating_armory_rowFresh_gear_title', '사용자 무기'),
  addAttribute(fixtureCharacter.id, 'repeating_armory_rowFresh_gear_damage', '1d8'),
  addAttribute(fixtureCharacter.id, 'repeating_armory_rowFresh_gear_style', '2d6'),
];
const createdSpellRow = [
  addAttribute(fixtureCharacter.id, 'repeating_ritual_rowFresh_incantation_title', '사용자 주문'),
  addAttribute(fixtureCharacter.id, 'repeating_ritual_rowFresh_incantation_target', '52'),
  addAttribute(fixtureCharacter.id, 'repeating_ritual_rowFresh_incantation_style', '2d8'),
];
assert(helper.resolveContractAction(fixtureCharacter, '즉석 기능', false).result.ok,
  '사용자가 추가한 기능 반복행을 즉시 인식해야 합니다.');
assert(helper.resolveContractAction(fixtureCharacter, '사용자 무기', false).result.ok,
  '사용자가 추가한 무기 반복행을 즉시 인식해야 합니다.');
assert(helper.resolveContractAction(fixtureCharacter, '사용자 주문', false).result.ok,
  '사용자가 추가한 주문 반복행을 즉시 인식해야 합니다.');

[
  [createdSkillRow, '숙련 기능', '58'],
  [createdWeaponRow, '개조 무기', '2d10'],
  [createdSpellRow, '개량 주문', '67'],
].forEach(([row, name, value]) => {
  const beforeName = row[0].get('current');
  const beforeValue = row[1].get('current');
  row[0].set('current', name);
  events['change:attribute'](row[0], { current: beforeName });
  row[1].set('current', value);
  events['change:attribute'](row[1], { current: beforeValue });
  assert(helper.resolveContractAction(fixtureCharacter, name, false).result.ok,
    '사용자 반복행의 이름·값 변경을 다시 읽어야 합니다: ' + name);
});

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
const rollGroupTitles = ['기능 / 판정', '무기', '주문', '광기', '기타 주사위'];
const rollGroupMarkers = rollGroupTitles.map((title) => 'font-weight:bold">' + title + ' ');
const rollGroupPositions = rollGroupMarkers.map((marker) => status.content.indexOf(marker));
assert(rollGroupPositions.every((position) => position >= 0) &&
  rollGroupPositions.every((position, index) => index === 0 || position > rollGroupPositions[index - 1]),
  'PL 상태 화면은 파싱한 굴림 구조에 따라 기능 / 판정, 무기, 주문, 광기, 기타 주사위 순으로 나눠야 합니다.');
const rollGroupContents = Object.fromEntries(rollGroupTitles.map((title, index) => [
  title,
  status.content.slice(rollGroupPositions[index], rollGroupPositions[index + 1] || status.content.length),
]));
assert(rollGroupContents['기능 / 판정'].includes('정밀 관찰') &&
  rollGroupContents['기능 / 판정'].includes('간접 판정') &&
  rollGroupContents['기능 / 판정'].includes('숙련 기능') &&
  !rollGroupContents['기능 / 판정'].includes('개조 무기'),
  '판정 구조와 사용자 추가 기능은 기능 / 판정 구역에만 보여야 합니다.');
assert(rollGroupContents['무기'].includes('연습용 칼') &&
  rollGroupContents['무기'].includes('개조 무기') &&
  !rollGroupContents['무기'].includes('개량 주문'),
  '원본 무기 구역과 사용자 추가 무기는 무기 구역에만 보여야 합니다.');
assert(rollGroupContents['주문'].includes('별빛 주문') &&
  rollGroupContents['주문'].includes('개량 주문') &&
  !rollGroupContents['주문'].includes('연습용 칼'),
  '원본 주문 구역과 사용자 추가 주문은 주문 구역에만 보여야 합니다.');
assert(rollGroupContents['광기'].includes('광기 2개') &&
  rollGroupContents['광기'].includes('실시간') &&
  rollGroupContents['광기'].includes('요약') &&
  !rollGroupContents['광기'].includes('광기 발작') &&
  !rollGroupContents['광기'].includes('자유 굴림'),
  '광기 굴림은 묶음 이름 대신 시트에 실제로 있는 선택지를 광기 구역에 보여야 합니다.');
assert(rollGroupContents['기타 주사위'].includes('자유 굴림'),
  '판정 결과 구조나 원본 구역 근거가 없는 굴림은 기타 주사위에 보여야 합니다.');
assert(!status.content.includes('선택할 수 있는 방식'),
  '시트에 종속된 선택지를 의미가 불분명한 전역 목록으로 보여주면 안 됩니다.');
assert(status.content.includes('다이스 종류') &&
  status.content.includes('보너스 개 1') && status.content.includes('패널티 개 1'),
  '다이스 종류에는 시트에서 읽은 보너스·패널티 선택지만 보여야 합니다.');
assert(!status.content.includes('라이즈벨') && !status.content.includes('루엔야크'),
  '여러 굴림에 공통인 시트 테마를 다이스 종류로 보여주면 안 됩니다.');
['1d4', '2d6', '1d8', '2d8', '1d10', '1d20'].forEach((rawMode) => {
  assert(!status.content.includes('선택 방식: ' + rawMode) &&
    !status.content.includes(', ' + rawMode) && !status.content.includes(rawMode + ','),
  '선택 방식에는 원본 내부 주사위 값 대신 사람이 읽는 이름만 보여야 합니다: ' + rawMode);
});
assert(status.content.includes('50 / 시작 50 (100%) / 최대 99'),
  '이성은 시작 이성 기준 비율과 최대 이성 상한을 서로 구분해 보여야 합니다.');
changeFixture('mind_limit', 50);
const equalMaximumStatus = runApi('!!상태').find((item) => item.who === '시트 헬퍼').content;
assert(equalMaximumStatus.includes('50 / 시작 50 (100%) / 최대 50'),
  '최대 이성이 시작 이성과 같아도 서로 다른 의미이므로 둘 다 보여야 합니다: ' + equalMaximumStatus);
changeFixture('mind_limit', 0);
const zeroMaximumStatus = runApi('!!상태').find((item) => item.who === '시트 헬퍼').content;
assert(zeroMaximumStatus.includes('50 / 시작 50 (100%) / 최대 0'),
  '크툴루 신화가 99인 경우의 최대 이성 0도 숨기면 안 됩니다: ' + zeroMaximumStatus);
changeFixture('mind_limit', 99);
changeFixture('mind_start', 0);
const missingStartStatus = runApi('!!상태').find((item) => item.who === '시트 헬퍼').content;
assert(missingStartStatus.includes('50 / 시작 미입력 / 최대 99'),
  '시작 이성이 비어 있으면 최대 이성으로 광기 비율을 대신 계산하면 안 됩니다: ' + missingStartStatus);
assert(!missingStartStatus.includes('50 / 99 (51%)'),
  '최대 이성은 광기 판단 비율의 분모가 아닙니다.');
changeFixture('mind_start', 50);
assert(!/mode-?[a-f0-9]{8,}/i.test(status.content),
  'PL 화면에 내부 선택 ID를 노출하면 안 됩니다.');

resetFixture({ vital_current: 10, temporary_mode: '', major_state: 0 });
const visibleMajor = helper.scan(fixtureCharacter.id);
assert(visibleMajor.trackedFields.major_state &&
  visibleMajor.trackedFields.major_state.automationVisible === true,
  '현재 화면에 보이는 중상 항목은 자동 처리 대상으로 읽어야 합니다.');
const findCallsBeforeModeChange = attributeFindCalls.length;
changeFixture('temporary_mode', 'on');
assert.strictEqual(attributeFindCalls.length, findCallsBeforeModeChange,
  '화면 모드 속성 이벤트만으로 캐릭터 속성 전체를 다시 검색하면 안 됩니다.');
const hiddenMajorAfterModeChange = helper.scan(fixtureCharacter.id);
assert.notStrictEqual(hiddenMajorAfterModeChange, visibleMajor,
  '화면 모드가 바뀌면 이전 시트 인식 캐시를 버려야 합니다.');
assert(!hiddenMajorAfterModeChange.trackedFields.major_state,
  '화면 모드 전환 뒤 숨겨진 중상 항목을 이전 캐시에서 재사용하면 안 됩니다.');
changeFixture('temporary_mode', '');
assert(helper.scan(fixtureCharacter.id).trackedFields.major_state.automationVisible === true,
  '화면 모드를 되돌리면 중상 항목의 자동 처리 가능 여부도 다시 계산해야 합니다.');
changeFixture('vital_current', 13);
const freshStatus = runApi('!!상태').find((item) => item.who === '시트 헬퍼');
assert(freshStatus && freshStatus.content.includes('13 / 20 (65%)'),
  '시트 수치 변경 뒤 !!상태가 이전 캐시 값을 보여주면 안 됩니다.');
resetFixture({ vital_current: 10, temporary_mode: '', major_state: 0 });

const manager = helper.refresh();
const managerNotes = manager && manager.get('notes');
assert(managerNotes && managerNotes.includes('<table') &&
  managerNotes.includes('기능 / 판정') && managerNotes.includes('무기') &&
  managerNotes.includes('주문') && managerNotes.includes('광기') &&
  managerNotes.includes('수치') && managerNotes.includes('기타 주사위'),
  'GM 관리 화면은 현재 캐릭터에서 인식한 모든 종류를 분류별 표로 보여야 합니다.');
assert(managerNotes.includes('체력') && managerNotes.includes('10 / 20 (50%)') &&
  managerNotes.includes('실시간') && managerNotes.includes('요약'),
  'GM 관리 표에는 현재 수치와 시트에 실제로 있는 광기 선택지가 보여야 합니다.');
assert(managerNotes.includes('캐릭터별 현황 보기') && managerNotes.includes('API가 인식한 현재 캐릭터들 현황 모아보기') &&
  !managerNotes.includes('현재 <code>As</code> 캐릭터에만 적용') && managerNotes.includes('✓ ') &&
  !managerNotes.includes('현황 확인 중:') &&
  managerNotes.includes('!시트 현황보기|') && !managerNotes.includes('!시트 관리대상|'),
  '캐릭터별 현황 보기는 짧은 안내와 현황 버튼만 보여야 합니다.');
assert(!managerNotes.includes('원본 시트 계약') && !managerNotes.includes('서로 다른 이름') &&
  !/외 \d+개는/.test(managerNotes),
  'GM 관리 화면에 개발 용어나 일부 항목만 보여 주는 축약 안내가 남으면 안 됩니다.');
assert((managerNotes.match(/두 번째 항목/g) || []).length >= 2,
  'GM 관리 화면은 같은 표시 이름을 가진 실제 반복행도 이름만으로 합쳐 숨기면 안 됩니다.');
assert(!managerNotes.includes('!시트 굴림선택|') && !managerNotes.includes('!시트 굴림목록|'),
  '캐릭터별 현황 보기에는 현황을 바꾸는 버튼만 있어야 합니다.');
const playerHelp = created.find((item) => item.get('name') === '[PL] 시트 헬퍼 사용법');
assert(playerHelp && playerHelp.get('notes').includes('!!굴릴항목이름'));
assert(playerHelp.get('notes').includes('<table'));
assert(playerHelp.get('notes').includes('!!굴릴항목이름 보너스/패널티개수') &&
  !playerHelp.get('notes').includes('!!굴릴항목이름 선택할이름'),
  'PL 사용법은 실제로 입력하는 보너스·패널티 형식을 바로 보여야 합니다.');

// 새 설정 이름은 예약하고, 과거 별칭과 같은 시트 굴림이 있으면 굴림을 우선합니다.
runtime.state.KIBSheetHelper.trackingMode = 'off';
let legacyRoll = runApi('!!추적').find((item) => item.content && item.content.includes('{{subject=추적}}'));
assert(legacyRoll, '!!추적은 같은 이름의 원본 시트 굴림을 실행해야 합니다.');
legacyRoll = runApi('!!추적 공개').find((item) => item.content && item.content.includes('{{subject=추적}}'));
assert(legacyRoll && legacyRoll.content.includes('{{trace_mode=[[1]]}}'),
  '구형 설정 별칭과 원본 굴림 모드가 겹치면 원본 굴림을 우선해야 합니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'off',
  '원본 추적 굴림을 수치 변화 알림 설정으로 처리하면 안 됩니다.');
runtime.state.KIBSheetHelper.trackGmOnly = false;
legacyRoll = runApi('!!GM전용추적 켜기').find((item) =>
  item.content && item.content.includes('{{subject=GM전용추적}}'));
assert(legacyRoll && legacyRoll.content.includes('{{gm_trace_mode=[[1]]}}'),
  'GM전용추적과 같은 원본 굴림 모드도 설정 별칭보다 우선해야 합니다.');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false,
  '원본 GM전용추적 굴림을 GM 캐릭터 알림 설정으로 처리하면 안 됩니다.');

// 구형 매크로는 명시형 !시트 명령에서 계속 동작합니다.
runApi('!시트 추적|show', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'public');
runApi('!시트 추적|hide', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'gm');
runApi('!시트 GM전용추적|표시', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, true);
runApi('!시트 GM전용추적|숨김', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false);

// 수치 변화 알림 설정과 CoC 자동 규칙은 서로 독립적이어야 합니다.
resetFixture({
  vital_current: 12, major_state: 0, dying_state: 0,
  mind_current: 50, long_madness: 0, temporary_madness: 0, temporary_mode: '',
});
changeFixture('vital_current', 5);
assert.strictEqual(fixtureAttribute('major_state').get('current'), '0',
  '중상 기준은 현재 체력의 절반이 아니라 최대 체력의 절반이어야 합니다.');

runApi('!!추적 끄기', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'off');
runApi('!!GM전용추적 끄기', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false,
  '같은 원본 모드가 없으면 구형 GM 캐릭터 알림 별칭을 계속 지원해야 합니다.');
resetFixture({ vital_current: 20, major_state: 0, dying_state: 0, temporary_mode: '' });
const majorMessages = changeFixture('vital_current', 10);
assert.strictEqual(fixtureAttribute('major_state').get('current'), 'active',
  '변화 알림을 꺼도 최대 체력의 절반 이상 피해는 중상을 활성화해야 합니다.');
assert(!majorMessages.some((item) => item.content && item.content.startsWith('/direct ')),
  '변화 알림 끄기 상태에서는 공개 변화 메시지를 보내면 안 됩니다.');
changeFixture('vital_current', 0);
assert.strictEqual(fixtureAttribute('dying_state').get('current'), 'active',
  '중상 상태에서 체력이 0 이하가 되면 빈사를 활성화해야 합니다.');
runApi('!!변화알림 공개', '테스터 GM (GM)', 'gm');
assert.strictEqual(runtime.state.KIBSheetHelper.trackingMode, 'public');

// GM 전용 캐릭터 알림 설정은 실제 속성 변화 메시지에만 영향을 줘야 합니다.
const gmOnlyAttributeStart = attributeObjects.length;
const gmOnlyCharacter = addCharacter('gm-only-character', 'GM 전용 탐사자', '', {
  ...fixtureValues,
  vital_current: '10',
});
const gmOnlyHealth = attributeObjects.find((item) =>
  item.get('_characterid') === gmOnlyCharacter.id && item.get('name') === 'vital_current');
helper.scan(gmOnlyCharacter.id, true);
runtime.state.KIBSheetHelper.trackingMode = 'gm';
runtime.state.KIBSheetHelper.trackGmOnly = true;
let gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '9');
events['change:attribute'](gmOnlyHealth, { current: '10' });
assert(sent.slice(gmOnlyMessageStart).some((item) =>
  item.content && item.content.startsWith('/w gm ') && item.content.includes('GM 전용 탐사자 / 체력')) &&
  !sent.slice(gmOnlyMessageStart).some((item) => item.content && item.content.startsWith('/direct ')),
  '공개 범위가 GM이면 GM 전용 캐릭터 알림도 전체 공개하면 안 됩니다.');
runtime.state.KIBSheetHelper.trackingMode = 'public';
runtime.state.KIBSheetHelper.trackGmOnly = false;
gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '8');
events['change:attribute'](gmOnlyHealth, { current: '9' });
assert(!sent.slice(gmOnlyMessageStart).some((item) =>
  item.content && item.content.includes('GM 전용 탐사자 / 체력')),
  'GM 캐릭터 알림을 끄면 플레이어 권한이 없는 캐릭터의 변화를 보내면 안 됩니다.');
runtime.state.KIBSheetHelper.trackGmOnly = true;
gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '7');
events['change:attribute'](gmOnlyHealth, { current: '8' });
assert(sent.slice(gmOnlyMessageStart).some((item) =>
  item.content && item.content.startsWith('/direct ') && item.content.includes('GM 전용 탐사자 / 체력')),
  'GM 캐릭터 알림을 켜면 플레이어 권한이 없는 캐릭터의 변화를 보내야 합니다.');
characters.splice(characters.indexOf(gmOnlyCharacter), 1);
attributeObjects.splice(gmOnlyAttributeStart);
runtime.state.KIBSheetHelper.trackGmOnly = false;

// 최대 체력식을 계산하지 못해도 기존 중상 상태에서 체력 0이 되면 빈사는 계속 연동합니다.
const unreadableMaximumContract = parseSheetContract([
  '<input name="attr_unreadable_marker_a">',
  '<input name="attr_unreadable_marker_b">',
  '<input name="attr_unreadable_marker_c">',
  '<label>체력 <input type="number" name="attr_unreadable_health" max="floor(@{missing_maximum})"></label>',
  '<label>중상 <input type="checkbox" name="attr_unreadable_major" value="active"></label>',
  '<label>빈사 <input type="checkbox" name="attr_unreadable_dying" value="active"></label>',
].join('\n'), { id: 'unreadable-maximum', sourceHash: 'unreadable-maximum' });
useContracts(unreadableMaximumContract);
const unreadableAttributeStart = attributeObjects.length;
const unreadableCharacter = addCharacter('unreadable-maximum-character', '최대 체력 미입력', 'player-1', {
  unreadable_marker_a: '1',
  unreadable_marker_b: '1',
  unreadable_marker_c: '1',
  unreadable_health: '1',
  unreadable_major: 'active',
  unreadable_dying: '0',
});
const unreadableHealth = attributeObjects.find((item) =>
  item.get('_characterid') === unreadableCharacter.id && item.get('name') === 'unreadable_health');
const unreadableDying = attributeObjects.find((item) =>
  item.get('_characterid') === unreadableCharacter.id && item.get('name') === 'unreadable_dying');
useRoomCharacters(unreadableCharacter);
helper.scan(unreadableCharacter.id, true);
unreadableHealth.set('current', '0');
events['change:attribute'](unreadableHealth, { current: '1' });
assert.strictEqual(unreadableDying.get('current'), 'active',
  '최대 체력을 읽지 못해도 이미 중상이면 체력 0에서 빈사를 활성화해야 합니다.');
characters.splice(characters.indexOf(unreadableCharacter), 1);
attributeObjects.splice(unreadableAttributeStart);
useRoomCharacters(fixtureCharacter);
useContracts(fixture);

resetFixture({ mind_current: 50, long_madness: 0, temporary_madness: 0 });
assert.strictEqual(intelligenceRolls(changeFixture('mind_current', 46)).length, 0,
  '이성 손실이 5 미만이면 지능 판정을 실행하면 안 됩니다.');

resetFixture({ mind_current: 50, mind_limit: 99, long_madness: 0, temporary_madness: 0 });
assert.strictEqual(intelligenceRolls(changeFixture('mind_limit', 98)).length, 0,
  '최대 이성만 바뀌었을 때 광기용 지능 판정을 실행하면 안 됩니다.');
assert.strictEqual(fixtureAttribute('long_madness').get('current'), '0',
  '최대 이성 변화는 장기적 광기를 활성화하면 안 됩니다.');

resetFixture({ mind_current: 50, mind_start: 50, long_madness: 0, temporary_madness: 0 });
assert.strictEqual(intelligenceRolls(changeFixture('mind_start', 40)).length, 0,
  '시작 이성 자체를 수정했을 때 광기용 지능 판정을 실행하면 안 됩니다.');
assert.strictEqual(fixtureAttribute('long_madness').get('current'), '0',
  '시작 이성 자체 변경은 장기적 광기를 활성화하면 안 됩니다.');

resetFixture({ mind_current: 45, long_madness: 0, temporary_madness: 0 });
assert.strictEqual(intelligenceRolls(changeFixture('mind_current', 50)).length, 0,
  '현재 이성이 회복될 때 광기용 지능 판정을 실행하면 안 됩니다.');

resetFixture({ mind_current: 41, mind_start: 50, mind_limit: 99, long_madness: 0, temporary_madness: 0 });
const longInsanityMessages = changeFixture('mind_current', 40);
assert.strictEqual(fixtureAttribute('long_madness').get('current'), 'active',
  '장기적 광기는 최대 이성이 아니라 시작 이성에서 현재 이성이 5분의 1 이상 줄었을 때 활성화해야 합니다.');
assert.strictEqual(intelligenceRolls(longInsanityMessages).length, 0,
  '장기적 광기가 활성화된 손실에서는 일시적 광기용 지능 판정을 실행하면 안 됩니다.');
assert(longInsanityMessages.some((item) => item.content && item.content.includes('40 / 시작 50 (80%) / 최대 99')),
  '이성 변화 알림도 시작 이성 기준 비율과 최대 이성 상한을 구분해야 합니다: ' +
  JSON.stringify(longInsanityMessages.map((item) => item.content)));

resetFixture({ mind_current: 50, long_madness: 0, temporary_madness: 0 });
const successfulIntelligence = changeFixture('mind_current', 45);
assert.strictEqual(intelligenceRolls(successfulIntelligence).length, 1,
  '이성이 정확히 5 감소하면 지능 판정을 한 번 실행해야 합니다.');
assert(intelligenceRolls(successfulIntelligence)[0].content.includes('{{roll=[[1d100]]}}') &&
  !intelligenceRolls(successfulIntelligence)[0].content.includes('{{roll1='),
  '동시에 보이는 복수 지능 버튼 중 원본 단일 일반 판정을 골라야 합니다.');
finishIntelligence(successfulIntelligence, 40);
assert.strictEqual(fixtureAttribute('temporary_madness').get('current'), 'active',
  '자동 지능 판정이 성공하면 일시적 광기를 활성화해야 합니다.');
const duplicateStart = sent.length;
events['change:attribute'](fixtureAttribute('temporary_madness'), { current: '0' });
assert.strictEqual(sent.length, duplicateStart,
  '자동 체크가 다시 change 이벤트로 돌아와 중복 알림이나 재실행을 만들면 안 됩니다.');

resetFixture({ mind_current: 50, mind_start: 50, long_madness: 0, temporary_madness: 0 });
const commandSanityMessages = runGeneral(':이성-5', fixtureCharacter.get('name'));
events['change:attribute'](fixtureAttribute('mind_current'), { current: '50' });
assert.strictEqual(fixtureAttribute('mind_current').get('current'), '45',
  ':이성-5는 현재 시트에서 찾은 이성 수치만 변경해야 합니다.');
assert.strictEqual(intelligenceRolls(commandSanityMessages).length, 1,
  ':이성-5도 직접 속성 변경과 같은 지능 판정을 정확히 한 번 실행해야 합니다.');
finishIntelligence(commandSanityMessages, 80);

resetFixture({ mind_current: 50, long_madness: 0, temporary_madness: 0 });
finishIntelligence(changeFixture('mind_current', 45), 80);
assert.strictEqual(fixtureAttribute('temporary_madness').get('current'), '0',
  '자동 지능 판정 실패 시 일시적 광기를 활성화하면 안 됩니다.');

resetFixture({ mind_current: 50, long_madness: 'active', temporary_madness: 0 });
assert.strictEqual(intelligenceRolls(changeFixture('mind_current', 45)).length, 0,
  '장기적 광기 활성 상태에서는 지능 판정을 실행하면 안 됩니다.');

resetFixture({ mind_current: 50, long_madness: 0, temporary_madness: 0 });
const pendingIntelligence = changeFixture('mind_current', 45);
changeFixture('long_madness', 'active');
finishIntelligence(pendingIntelligence, 40);
assert.strictEqual(fixtureAttribute('temporary_madness').get('current'), '0',
  '지능 판정 대기 중 장기적 광기가 활성화되면 일시적 광기를 켜면 안 됩니다.');

resetFixture({ mind_current: 50, long_madness: 0, temporary_madness: 0 });
const manualIntelligence = fixture.rolls.find((roll) => roll.name === 'intelligence');
const manualStart = sent.length;
assert(helper.executeContract(fixtureCharacter.id, fixture.id, manualIntelligence.key, '', '', false, '').ok);
finishIntelligence(sent.slice(manualStart), 40);
assert.strictEqual(fixtureAttribute('temporary_madness').get('current'), '0',
  '수동으로 실행한 지능 판정 성공은 일시적 광기 자동화에 연결하면 안 됩니다.');

resetFixture({ mind_current: 45, temporary_madness: 0 });
assert.strictEqual(changeFixture('mind_current', 45).length, 0,
  '같은 이성 값의 중복 이벤트로 자동 판정을 실행하면 안 됩니다.');

const missingLong = addMinimalInsanityFixture('missing_long', { longCount: 0, temporary: true });
let missingFieldMessages = missingLong.change('current', 40);
assert.strictEqual(intelligenceRolls(missingFieldMessages).length, 1,
  '장기적 광기 체크 필드가 없어도 단일 5 이상 이성 손실은 지능 판정을 실행해야 합니다.');
assert(missingFieldMessages.some((item) => item.content && item.content.includes('장기적 광기 자동 처리 생략')),
  '시작 이성의 5분의 1 기준을 넘었지만 체크 필드가 없으면 생략 이유를 알려야 합니다.');
finishIntelligence(missingFieldMessages, 40);
assert.strictEqual(missingLong.attribute('temporary').get('current'), 'active',
  '장기적 광기 체크 필드가 없어도 지능 판정 성공 시 일시적 광기는 활성화해야 합니다.');
missingLong.reset({ current: 45, temporary: 0 });
missingFieldMessages = missingLong.change('current', 40);
finishIntelligence(missingFieldMessages, 80);
assert.strictEqual(missingLong.attribute('temporary').get('current'), '0',
  '장기적 광기 체크 필드가 없더라도 지능 판정 실패에서 일시적 광기를 켜면 안 됩니다.');

const ambiguousLong = addMinimalInsanityFixture('ambiguous_long', { longCount: 2, temporary: true });
const ambiguousLongMessages = ambiguousLong.change('current', 40);
assert.strictEqual(intelligenceRolls(ambiguousLongMessages).length, 0,
  '장기적 광기 체크 필드가 여러 개면 잘못된 상태를 가정하지 말고 자동 판정을 중단해야 합니다.');
assert(ambiguousLongMessages.some((item) => item.content && item.content.includes('같은 뜻의 항목이 여러 개')),
  '장기적 광기 체크 필드가 모호한 이유를 GM에게 알려야 합니다.');
assert.strictEqual(ambiguousLong.attribute('temporary').get('current'), '0',
  '장기적 광기 체크 필드가 모호할 때 일시적 광기를 자동으로 켜면 안 됩니다.');

const missingTemporary = addMinimalInsanityFixture('missing_temporary', { longCount: 1, temporary: false });
missingTemporary.reset({ current: 50, long_0: 0 });
const missingTemporaryMessages = missingTemporary.change('current', 45);
assert.strictEqual(intelligenceRolls(missingTemporaryMessages).length, 1,
  '일시적 광기 체크 필드가 없어도 단일 5 이상 이성 손실의 지능 판정은 실행해야 합니다.');
assert(missingTemporaryMessages.some((item) => item.content && item.content.includes('일시적 광기 자동 처리 생략')),
  '일시적 광기 체크 필드가 없으면 자동 체크를 생략한다고 알려야 합니다.');
finishIntelligence(missingTemporaryMessages, 40);
assert.strictEqual(missingTemporary.attribute('temporary'), null,
  '원본 시트에 없는 일시적 광기 체크 속성을 새로 만들면 안 됩니다.');
useRoomCharacters(fixtureCharacter);
useContracts(fixture);

resetFixture({ vital_current: 20, major_state: 0, temporary_mode: 'on' });
const hiddenMajor = changeFixture('vital_current', 10);
assert.strictEqual(fixtureAttribute('major_state').get('current'), '0',
  '현재 시트 화면에서 숨겨진 중상 필드를 자동으로 켜면 안 됩니다.');
assert(hiddenMajor.some((item) => item.content && item.content.includes('중상 자동 처리 생략')),
  '숨겨진 필드를 건드리지 못한 이유는 GM에게 알려야 합니다.');
resetFixture({ vital_current: 10, temporary_mode: '' });

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

const directResultBefore = sent.length;
setPlayerSpeakingAs(fixtureCharacter.get('name'), 'player-1');
events['chat:message']({
  type: 'general',
  rolltemplate: 'fixture',
  content: '{{subject=정밀 관찰}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
    '{{extreme=$[[2]]}} {{roll=$[[3]]}}',
  inlinerolls: [60, 30, 12, 20].map((value) => ({ results: { total: value } })),
  who: fixtureCharacter.get('name'),
  playerid: 'player-1',
});
const directResult = sent.slice(directResultBefore).find((item) => item.event === 'sheet:result');
assert(directResult && directResult.payload.outcome === 'hard',
  '시트 화면의 원본 버튼으로 굴린 결과도 성공 수준으로 인식해야 합니다.');
assert.strictEqual(directResult.payload.cutinKey, resultEvent.payload.cutinKey,
  '명령어 굴림과 시트 버튼 굴림은 같은 컷인 판정 연결 키를 사용해야 합니다.');

const unidentifiedDirectResultBefore = sent.length;
events['chat:message']({
  type: 'general',
  rolltemplate: 'fixture',
  content: '{{success=$[[0]]}} {{hard=$[[1]]}} {{extreme=$[[2]]}} {{roll=$[[3]]}}',
  inlinerolls: [60, 30, 12, 20].map((value) => ({ results: { total: value } })),
  who: fixtureCharacter.get('name'),
  playerid: 'player-1',
});
assert(!sent.slice(unidentifiedDirectResultBefore).some((item) => item.event === 'sheet:result'),
  'subject 등 시트 굴림 식별 필드가 없으면 공통 템플릿 필드만으로 판정하면 안 됩니다.');

function captureRepeatingDirect(subject, includeSubject) {
  setPlayerSpeakingAs(fixtureCharacter.get('name'), 'player-1');
  const before = sent.length;
  events['chat:message']({
    type: 'general',
    rolltemplate: 'fixture',
    content: (includeSubject === false ? '' : '{{subject=' + subject + '}} ') +
      '{{success=$[[0]]}} {{hard=$[[1]]}} {{extreme=$[[2]]}} {{roll=$[[3]]}}',
    inlinerolls: [44, 22, 8, 20].map((value) => ({ results: { total: value } })),
    who: fixtureCharacter.get('name'),
    playerid: 'player-1',
  });
  return sent.slice(before).filter((item) => item.event === 'sheet:result');
}

const repeatingDirect = captureRepeatingDirect('두 번째 항목', true);
assert.strictEqual(repeatingDirect.length, 1,
  '사용자 추가 반복행의 원본 버튼 굴림도 행 이름으로 식별해야 합니다.');
assert.strictEqual(repeatingDirect[0].payload.label, '두 번째 항목');
assert.strictEqual(captureRepeatingDirect('없는 반복 항목', true).length, 0,
  '반복행 이름이 다르면 비슷한 공통 템플릿만으로 판정하면 안 됩니다.');
assert.strictEqual(captureRepeatingDirect('', false).length, 0,
  '반복행 이름 필드가 없으면 임의의 사용자 행으로 판정하면 안 됩니다.');

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

[itemName, itemValue].concat(createdSkillRow, createdWeaponRow, createdSpellRow).forEach((attribute) => {
  attributeObjects.splice(attributeObjects.indexOf(attribute), 1);
  events['destroy:attribute'](attribute);
});
assert(!helper.contractRolls(fixtureCharacter.id).some((item) => item.label === '새 항목'),
  '삭제한 사용자 반복 항목이 굴림 목록에 남으면 안 됩니다.');
['숙련 기능', '개조 무기', '개량 주문'].forEach((label) => {
  assert(!helper.contractRolls(fixtureCharacter.id).some((item) => item.label === label),
    '삭제한 사용자 반복행이 굴림 목록에 남으면 안 됩니다: ' + label);
});

// 저장 구조가 같은 시트도 사용자에게 수동 시트 선택 기능을 노출하지 않습니다.
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
useContracts(twinA, twinB);
const twinAttributeStart = attributeObjects.length;
const twinCharacter = addCharacter('twin-character', '쌍둥이 캐릭터', '', {
  twin_a: '1', twin_b: '1', twin_c: '1',
});
useRoomCharacters(twinCharacter);
inspection = helper.inspectContracts(twinCharacter.id);
assert.strictEqual(inspection.status, 'ambiguous');
runtime.state.KIBSheetHelper.managerCharacterId = twinCharacter.id;
const twinManager = helper.refresh().get('notes');
assert(!twinManager.includes('!시트 인식선택|') && !twinManager.includes('시트 선택'),
  '관리 화면에 사용자가 고르는 시트 후보나 수동 선택 버튼을 노출하면 안 됩니다.');
assert(twinManager.includes('현재 인식된 시트가 없습니다.') &&
  !twinManager.includes('방에 저장된 항목만으로'),
  '관리 화면의 시트 인식 실패 문구가 사용자용 한 문장으로 표시되지 않습니다.');
assert(twinManager.includes('API가 인식한 현재 캐릭터들 현황 모아보기') &&
  !twinManager.includes('API가 인식한 캐릭터들의 현재 현황입니다.'),
  '관리 화면의 캐릭터 현황 안내가 짧은 문구로 표시되지 않습니다.');
runtime.state.KIBSheetHelper.sheetSelections[twinCharacter.id] = twinA.id;
helper.scan(twinCharacter.id, true);
assert.strictEqual(runtime.state.KIBSheetHelper.sheetSelections[twinCharacter.id], twinA.id);
assert.strictEqual(helper.inspectContracts(twinCharacter.id).status, 'ambiguous',
  '구버전 캐릭터별 시트 선택값이 방 자동 인식을 강제로 바꾸면 안 됩니다.');
characters.splice(characters.indexOf(twinCharacter), 1);
attributeObjects.splice(twinAttributeStart);
useRoomCharacters(fixtureCharacter);
useContracts(fixture);

// 배포본에 넣은 모든 CoC 구조가 실제 굴림 자료를 보존하는지 확인합니다.
embeddedSheets.forEach((sheet) => {
  assert(sheet.attributes.length > 0 && sheet.rolls.length > 0,
    `${sheet.id}: 속성이나 굴림이 없는 미완성 시트를 배포 정보에 넣으면 안 됩니다.`);
});
[
  [331, 90, 424],
  [339, 81, 405],
  [422, 253, 2928],
  [1613, 879, 744],
  [187, 72, 374],
].forEach((stats) => findEmbeddedSheet(...stats));

const actualSheet = findEmbeddedSheet(331, 90, 424);
const hojilSheet = findEmbeddedSheet(339, 81, 405);
const bloodySheet = findEmbeddedSheet(422, 253, 2928);
const publicSheet = embeddedLargeSheet;
const marenHyeyoomSheet = findEmbeddedSheet(187, 72, 374);
const actualField = (name) => actualSheet.fields.find((field) => field.name === name);
assert([actualField('str').label].concat(actualField('str').aliases || []).includes('근력'));
assert([actualField('hp').label].concat(actualField('hp').aliases || []).includes('체력'));
assert([actualField('hp_max').label].concat(actualField('hp_max').aliases || []).includes('체력'));
assert([actualField('mp').label].concat(actualField('mp').aliases || []).includes('마력'));
assert([actualField('mp_max').label].concat(actualField('mp_max').aliases || []).includes('마력'));
assert([actualField('san').label].concat(actualField('san').aliases || []).includes('이성'));
assert([actualField('san_max').label].concat(actualField('san_max').aliases || []).includes('이성'));
embeddedSheets.forEach((sheet) => {
  const misplacedCredits = (sheet.fields || []).filter((field) =>
    [field.label].concat(field.aliases || []).some((label) =>
      /커스텀 시트 제작|디자인\s*:/.test(String(label || ''))));
  assert.strictEqual(misplacedCredits.length, 0,
    `${sheet.id}: 제작자·디자인 표기를 입력 필드 라벨로 읽으면 안 됩니다: ` +
    misplacedCredits.map((field) => field.name).join(', '));
});
const marenFieldLabels = Object.fromEntries((marenHyeyoomSheet.fields || []).map((field) =>
  [field.name, field.label]));
assert.deepStrictEqual({
  str: marenFieldLabels.str,
  con: marenFieldLabels.con,
  siz: marenFieldLabels.siz,
  dex: marenFieldLabels.dex,
  int: marenFieldLabels.int,
  app: marenFieldLabels.app,
  pow: marenFieldLabels.pow,
  edu: marenFieldLabels.edu,
}, {
  str: '근력', con: '건강', siz: '크기', dex: '민첩성',
  int: '지능', app: '외모', pow: '정신력', edu: '교육',
}, '실제 시트의 같은 항목 묶음에 있는 능력치 라벨을 보존해야 합니다.');
embeddedSheets.forEach((sheet) => helper.registerContract(sheet));

function sourceDefaults(sheet) {
  return Object.fromEntries((sheet.fields || [])
    .filter((field) => !field.section && Object.prototype.hasOwnProperty.call(field, 'default'))
    .map((field) => [field.name, String(field.default == null ? '' : field.default)]));
}

// 기본 필드가 아직 Attribute 객체로 생성되지 않은 새 캐릭터도, 특정 시트명이나
// 캐릭터명을 박지 않고 원본 HTML에서 읽은 비어 있지 않은 기본값으로 판별합니다.
// Roll20은 없는 필드와 빈 기본값을 모두 ''로 돌려주므로 그 둘만 다른 시트는
// 안전하게 구별할 수 없으며, 이 경우 임의 선택하지 않는 것이 정상입니다.
let safelyMatchedEmptySheets = 0;
embeddedSheets.forEach((sheet, index) => {
  useContracts(...embeddedSheets);
  const character = addCharacter(
    'empty-source-character-' + index,
    '빈 캐릭터 ' + index,
    'player-1',
    {},
  );
  sheetFieldDefaults[character.id] = sourceDefaults(sheet);
  if (index === 0) attributeObjects.push(roll20Object('orphan-attribute', {
    _characterid: 'deleted-character', characterid: 'deleted-character',
    name: 'pulp_hp', current: '1', max: '',
  }));
  useRoomCharacters(character);
  const result = helper.inspectContracts(character.id);
  if (result.status === 'matched') {
    assert.strictEqual(result.contract.id, sheet.id, sheet.id + ': 다른 원본 시트로 잘못 인식했습니다.');
    safelyMatchedEmptySheets += 1;
  } else {
    assert.strictEqual(result.status, 'ambiguous',
      sheet.id + ': 증거가 부족한 새 캐릭터를 다른 원본 시트로 임의 선택하면 안 됩니다.');
  }
  assert.strictEqual(attributeObjects.filter((item) => item.get('_characterid') === character.id).length, 0,
    sheet.id + ': 인식을 위해 새 Attribute 객체를 만들면 안 됩니다.');
});
assert(safelyMatchedEmptySheets > 0,
  '비어 있지 않은 독립 기본값이 충분한 새 캐릭터까지 전부 인식하지 못하면 안 됩니다.');

// Roll20이 시트를 교체한 뒤 없는 필드는 빈 문자열로, 이전 시트의 기본값 일부는
// 계속 반환하더라도 그 한 번의 값과 빈값들을 현재 시트의 증거로 확정하면 안 됩니다.
const liveOfficialCharacter = addCharacter(
  'live-official-regression',
  '공식 CoC 오인식 반례',
  'player-1',
  { luck: '' },
);
sheetFieldDefaults[liveOfficialCharacter.id] = sourceDefaults(publicSheet);
getAttrByNameOverrides[liveOfficialCharacter.id + '|luck|current'] = '0';
getAttrByNameOverrides[liveOfficialCharacter.id + '|credit_rating|current'] =
  'floor(@{credit_rating_base} + @{credit_rating_mod})';
['art_mod_total', 'assets', 'birthday', 'bonus_dice'].forEach((name) => {
  getAttrByNameOverrides[liveOfficialCharacter.id + '|' + name + '|current'] = '';
});
useContracts(...embeddedSheets);
useRoomCharacters(liveOfficialCharacter);
const liveOfficialInspection = helper.inspectContracts(liveOfficialCharacter.id);
assert.strictEqual(liveOfficialInspection.status, 'matched',
  '이전 시트의 기본값과 없는 필드 빈값 때문에 공식 CoC 시트가 인식 불가가 되면 안 됩니다.');
assert.strictEqual(liveOfficialInspection.contract.id, publicSheet.id,
  '이전 시트의 기본값과 없는 필드 빈값을 다른 시트의 양성 증거로 사용하면 안 됩니다.');

// 시트를 교체한 방에서는 과거 시트의 저장값이 남아 있어도 현재 시트의 기본값을
// 우선합니다. 저장된 이름 자체는 기본값 probe에서 다시 읽지 않습니다.
const strongActualNames = (actualSheet.signature || []).map((entry) =>
  typeof entry === 'string' ? entry : entry.name).filter(Boolean);
assert(strongActualNames.length >= 3,
  '저장 구조 우선순위를 검증할 원본 서명 필드가 부족합니다.');
const strongActualValues = Object.fromEntries(strongActualNames.map((name) => [name, '1']));
Object.assign(strongActualValues, { accounting: '5', anthropology: '1' });
const strongActualCharacter = addCharacter(
  'strong-actual-character',
  '강한 원본 구조 캐릭터',
  'player-1',
  strongActualValues,
);
sheetFieldDefaults[strongActualCharacter.id] = sourceDefaults(publicSheet);
const staleRoomCharacter = addCharacter(
  'stale-room-character',
  '과거 시트 캐릭터',
  'player-1',
  Object.fromEntries(Object.keys(sourceDefaults(publicSheet)).map((name) => [name, 'stale'])),
);
useContracts(...embeddedSheets);
useRoomCharacters(strongActualCharacter, staleRoomCharacter);
const staleFirstInspection = helper.inspectContracts(staleRoomCharacter.id);
const strongActualInspection = helper.inspectContracts(strongActualCharacter.id);
assert.strictEqual(strongActualInspection.status, 'matched');
assert.strictEqual(staleFirstInspection.status, 'matched');
assert.strictEqual(staleFirstInspection.contract.id, publicSheet.id,
  'GM 현황에서 과거 캐릭터를 먼저 열어도 방의 현재 시트 인식 캐시가 바뀌면 안 됩니다.');
assert.strictEqual(strongActualInspection.contract.id, publicSheet.id,
  '시트 교체 뒤 과거 저장 구조를 현재 시트로 잘못 인식하면 안 됩니다.');

// Roll20은 시트 기본 필드를 Attribute 객체로 만들지 않을 수 있습니다.
// 전체 시트 목록에서 한 후보에만 속하는 서로 다른 저장 필드가 두 개 이상일 때만
// 희소한 저장값으로 시트를 확정합니다. 필드 하나나 여러 시트에 겹치는 값은 부족합니다.
const sparseDefaults = {};
const attributeOwners = new Map();
embeddedSheets.forEach((sheet) => {
  (sheet.globalAttributes || []).forEach((name) => {
    if (!attributeOwners.has(name)) attributeOwners.set(name, new Set());
    attributeOwners.get(name).add(sheet.id);
  });
});
function uniqueNonSignatureFields(sheet) {
  const signatureNames = new Set((sheet.signature || []).map((entry) =>
    typeof entry === 'string' ? entry : entry.name));
  return (sheet.globalAttributes || []).filter((name) =>
    attributeOwners.get(name) && attributeOwners.get(name).size === 1 &&
    !signatureNames.has(name));
}
const sparseEvidenceSheets = embeddedSheets.map((sheet) => ({
  sheet, fields: uniqueNonSignatureFields(sheet),
})).filter((entry) => entry.fields.length >= 2);
assert(sparseEvidenceSheets.length >= 2,
  '실제 시트에서 희소 인식 반례에 쓸 고유 저장 필드 두 개를 찾지 못했습니다.');
const sparseEvidenceSheet = sparseEvidenceSheets[0].sheet;
const actualUniqueAttributes = sparseEvidenceSheets[0].fields;
const staleEvidenceSheet = sparseEvidenceSheets[1].sheet;
const hojilUniqueAttributes = sparseEvidenceSheets[1].fields;
Object.assign(sparseDefaults, sourceDefaults(sparseEvidenceSheet), {
  hp: '10', hp_max: '20', mp: '10', mp_max: '10', san: '50', san_max: '99',
  con: '100', siz: '100', pow: '50', cthulhu_mythos: '0',
});

useContracts(...embeddedSheets);
const singleEvidenceCharacter = addCharacter(
  'single-evidence-character', '단일 증거 조사원', 'player-1',
  { [actualUniqueAttributes[0]]: '1' },
);
useRoomCharacters(singleEvidenceCharacter);
const singleEvidenceInspection = helper.inspectContracts(singleEvidenceCharacter.id);
assert.strictEqual(singleEvidenceInspection.status, 'ambiguous',
  '고유 저장 필드 하나만으로 현재 시트를 확정하면 안 됩니다.');
const singleActualMatch = singleEvidenceInspection.matches.find((item) => item.id === sparseEvidenceSheet.id);
assert(singleActualMatch && singleActualMatch.uniqueEvidence === 1 && !singleActualMatch.eligible,
  '단일 고유 증거가 정상 인식 기준을 우회하는 반례를 재현하지 못했습니다.');

const overlappingEvidenceCharacter = addCharacter(
  'overlapping-evidence-character', '겹치는 증거 조사원', 'player-1',
  { ori_other_skills: '0', language_own: '50' },
);
useRoomCharacters(overlappingEvidenceCharacter);
assert.strictEqual(helper.inspectContracts(overlappingEvidenceCharacter.id).status, 'ambiguous',
  '전체 배포 시트 목록에서 겹치는 저장 필드 둘로 한 시트를 확정하면 안 됩니다.');

// 새 캐릭터는 화면에서 실제로 저장한 일부 항목만 Attribute로 생길 수 있습니다.
// 이름이나 고정 우선순위 없이, 관측된 조합을 가장 잘 설명하는 원본을 인식합니다.
const sparseCoverageCharacter = addCharacter(
  'sparse-coverage-character', '희소 저장 조사원', 'player-1',
  Object.fromEntries([
    'app', 'appraise_mod', 'archaeology_mod', 'build', 'computer_mod', 'con',
    'damage_bonus', 'dex', 'edit_mode', 'edu', 'fighting_brawl_mod', 'hp',
    'hp_per', 'int', 'language_own_mod', 'mov', 'mp', 'mp_per', 'pow', 'san',
    'san_per', 'san_per2', 'siz', 'spot_hidden_mod', 'str',
  ].map((name) => [name, '1'])),
);
useRoomCharacters(sparseCoverageCharacter);
const sparseCoverageInspection = helper.inspectContracts(sparseCoverageCharacter.id);
assert.strictEqual(sparseCoverageInspection.status, 'ambiguous',
  '서로 다른 원본이 새 캐릭터의 저장값을 똑같이 설명하면 임의로 하나를 선택하면 안 됩니다.');

const oneFieldCurrentCharacters = [0, 1, 2].map((index) => addCharacter(
  'one-field-current-' + index, '현재 단일 필드 조사원 ' + index, 'player-1',
  { [actualUniqueAttributes[0]]: '1' },
));
const staleTwoFieldCharacter = addCharacter(
  'stale-two-field-character', '과거 두 필드 조사원', 'player-1',
  Object.fromEntries(hojilUniqueAttributes.slice(0, 2).map((name) => [name, '1'])),
);
useRoomCharacters(...oneFieldCurrentCharacters, staleTwoFieldCharacter);
assert.strictEqual(helper.inspectContracts(oneFieldCurrentCharacters[0].id).status, 'ambiguous',
  '필드 하나뿐인 현재 캐릭터들을 빼고 과거 캐릭터 한 명의 시트를 확정하면 안 됩니다.');

const sharedAttributeGroups = new Map();
[...attributeOwners.entries()].forEach(([name, owners]) => {
  if (owners.size < 2) return;
  const key = [...owners].sort().join('|');
  if (!sharedAttributeGroups.has(key)) sharedAttributeGroups.set(key, []);
  sharedAttributeGroups.get(key).push(name);
});
const sharedAttributes = [...sharedAttributeGroups.values()]
  .sort((left, right) => right.length - left.length)[0].slice(0, 8);
assert(sharedAttributes.length >= 8,
  '잔재 데이터 반례에 사용할 공통 저장 필드가 부족합니다.');
const sharedValues = Object.fromEntries(sharedAttributes.map((name) => [name, '1']));
const currentSharedCharacters = [0, 1, 2].map((index) => addCharacter(
  'current-shared-' + index, '현재 공통 조사원 ' + index, 'player-1', sharedValues,
));
const staleUniqueCharacter = addCharacter(
  'stale-unique-character', '과거 고유 조사원', 'player-1',
  Object.fromEntries(actualUniqueAttributes.slice(0, 2).map((name) => [name, '1'])),
);
useRoomCharacters(...currentSharedCharacters, staleUniqueCharacter);
assert.strictEqual(helper.inspectContracts(currentSharedCharacters[0].id).status, 'ambiguous',
  '과거 캐릭터 한 명의 고유 저장 필드만으로 현재 시트를 확정하면 안 됩니다.');

useRoomCharacters(...currentSharedCharacters, sparseCoverageCharacter);
assert.strictEqual(helper.inspectContracts(currentSharedCharacters[0].id).status, 'ambiguous',
  '과거 캐릭터 한 명의 공통 저장값 조합으로 현재 시트를 확정하면 안 됩니다.');

const currentUniqueCharacters = [0, 1, 2].map((index) => addCharacter(
  'current-unique-' + index, '현재 고유 조사원 ' + index, 'player-1',
  Object.fromEntries(actualUniqueAttributes.slice(0, 2).map((name) => [name, '1'])),
));
useRoomCharacters(...currentUniqueCharacters, currentSharedCharacters[0]);
const majorityInspection = helper.inspectContracts(currentUniqueCharacters[0].id);
assert.strictEqual(majorityInspection.status, 'matched',
  '같은 시트의 고유 저장 필드가 캐릭터 과반에서 확인되면 인식해야 합니다.');
assert.strictEqual(majorityInspection.contract.id, sparseEvidenceSheet.id,
  '캐릭터 과반의 고유 저장 필드가 가리키는 시트를 선택하지 못했습니다.');

const sparseValues = {};
actualUniqueAttributes.slice(0, 2).forEach((name) => { sparseValues[name] = '1'; });
const sparseCharacter = addCharacter(
  'sparse-sheet-character', '테스트 조사원', 'player-1', sparseValues);
useRoomCharacters(sparseCharacter);
sheetFieldDefaults[sparseCharacter.id] = sparseDefaults;
const sparseCallsBefore = getAttrByNameCalls.length;
const sparseInspection = helper.inspectContracts(sparseCharacter.id);
const sparseCalls = getAttrByNameCalls.slice(sparseCallsBefore).filter((call) =>
  call.characterId === sparseCharacter.id);
assert.strictEqual(sparseInspection.status, 'matched',
  '서로 다른 고유 저장 필드가 두 개 있으면 희소한 시트도 인식해야 합니다.');
assert.strictEqual(sparseInspection.contract.id, sparseEvidenceSheet.id,
  '희소한 저장값에서 실제 고유 증거가 있는 시트가 선택되지 않았습니다.');
assert.strictEqual(attributeObjects.filter((item) =>
  item.get('_characterid') === sparseCharacter.id).length, 2,
  '시트 인식을 위해 Attribute 객체를 새로 만들면 안 됩니다.');
assert.strictEqual(sparseCalls.length, 0,
  '시트 인식 단계에서 getAttrByName으로 다른 시트 필드를 probe하면 안 됩니다.');

const fallbackCallsBefore = getAttrByNameCalls.length;
runtime.state.KIBSheetHelper.managerCharacterId = sparseCharacter.id;
const sparseInspectionMessages = runApi('!!점검', '테스터 GM (GM)', 'gm');
const fallbackCalls = getAttrByNameCalls.slice(fallbackCallsBefore).filter((call) =>
  call.characterId === sparseCharacter.id);
const actualAttributeNames = new Set(sparseEvidenceSheet.attributes || []);
const publicOnlyAttributeNames = new Set((publicSheet.attributes || []).filter((name) =>
  !actualAttributeNames.has(name)));
assert(sparseInspectionMessages.some((item) =>
  item.content && item.content.includes('테스트 조사원 / GM 인식 점검') &&
  !item.content.includes('!시트 인식선택|')),
  '실제 희소 캐릭터의 !!점검 결과를 표시하지 못했습니다.');
assert(!fallbackCalls.some((call) => publicOnlyAttributeNames.has(call.name)),
  '인식한 시트를 점검하면서 다른 시트에만 있는 필드를 probe하면 안 됩니다.');

const publicResourceValues = {
  hp: '10', hp_max: '20', mp: '8', mp_max: '10',
  major_wound_toggle: '0', dying: '0', hptemp: '', showpulp: '',
};
publicSheet.signature.forEach((entry) => {
  const name = typeof entry === 'string' ? entry : entry.name;
  publicResourceValues[name] = publicResourceValues[name] || '1';
});
const publicResourceCharacter = addCharacter(
  'public-resource-sheet', '공개 시트 자원 시험', 'player-1', publicResourceValues);
useContracts(publicSheet);
useRoomCharacters(publicResourceCharacter);
const publicResourceData = helper.scan(publicResourceCharacter.id, true);
const publicHealth = publicResourceData.resources.find((item) => item.label === '체력');
const publicMana = publicResourceData.resources.find((item) => item.label === '마력');
assert(publicHealth && publicHealth.value === 10 && publicHealth.max === 20,
  '공개 CoC 시트의 체력 현재·최대값을 같은 자원으로 읽어야 합니다.');
assert(publicMana && publicMana.value === 8 && publicMana.max === 10,
  '공개 CoC 시트의 마력 현재·최대값을 같은 자원으로 읽어야 합니다.');
assert(runApi('!!검색 체력', publicResourceCharacter.get('name')).some((item) =>
  item.content && item.content.includes('<b>체력</b>') && item.content.includes('10 / 20')),
  '공개 CoC 시트의 체력 검색에 현재·최대값을 함께 보여야 합니다.');
assert(runGeneral(':체력+1', publicResourceCharacter.get('name')).some((item) =>
  item.content && item.content.includes('체력') && item.content.includes('10') && item.content.includes('11')),
  '공개 CoC 시트에서도 :체력+1을 현재 체력에 적용해야 합니다.');
const publicAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === publicResourceCharacter.id && item.get('name') === name);
assert.strictEqual(publicAttribute('hp').get('current'), '11');
function changePublicResource(name, next) {
  const attribute = publicAttribute(name);
  const before = attribute.get('current');
  attribute.set('current', String(next));
  events['change:attribute'](attribute, { current: before });
}
changePublicResource('hp', 20);
changePublicResource('major_wound_toggle', 0);
changePublicResource('dying', 0);
changePublicResource('hp', 10);
assert.strictEqual(publicAttribute('major_wound_toggle').get('current'), '1',
  '공개 CoC 시트에서도 최대 체력의 절반 이상 피해는 중상을 활성화해야 합니다.');
changePublicResource('hp', 0);
assert.strictEqual(publicAttribute('dying').get('current'), '1',
  '공개 CoC 시트에서도 중상 상태에서 체력 0은 빈사를 활성화해야 합니다.');

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
  const nonEmptyDefaults = new Set((sheet.fields || []).filter((field) =>
    !field.section && field.default !== undefined && field.default !== null && String(field.default).trim() !== '')
    .map((field) => field.name));
  (sheet.globalAttributes || []).forEach((attribute) => {
    if (!nonEmptyDefaults.has(attribute)) values[attribute] = '';
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
  const character = addCharacter(id, name, 'player-1', values);
  useContracts(sheet);
  useRoomCharacters(character);
  return { character, values };
}

// 실제 배포 시트의 사용자 추가 기능은 생성·변경을 모두 따라가야 합니다.
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
useContracts(actualSheet);
const actualRow = [
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_title', '테스트'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_base', '1'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_mod', '49'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science', '50'),
  addAttribute(actualCharacter.id, 'repeating_science_rowTest_science_checkbox', '1'),
  addAttribute(actualCharacter.id, '_reporder_repeating_science', 'rowTest'),
];
useRoomCharacters(actualCharacter);
const actualInspection = helper.inspectContracts(actualCharacter.id);
assert.strictEqual(actualInspection.status, 'matched', JSON.stringify(actualInspection.matches.map((item) => ({
  id: item.id, score: item.score, ratio: item.ratio, repeatingHits: item.repeatingHits,
  repeatingRatio: item.repeatingRatio, rankScore: item.rankScore, eligible: item.eligible,
}))));
const blankSanMessages = runApi('!!이성', actualCharacter.get('name'));
assert(blankSanMessages.some((item) => item.who === '시트 헬퍼' && /비어 있습니다/.test(item.content)),
  '이성 수치가 비었을 때 Roll20 파서로 보내지 말고 채팅 오류로 끝내야 합니다.');
assert(!blankSanMessages.some((item) => item.content && item.content.includes('&{template:coc}')),
  '이성 수치가 빈 굴림을 Roll20 sendChat으로 보내면 안 됩니다.');
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

// 반복행 계산식은 같은 행의 값만 읽고, 없는 전역 속성을 추측 조회하지 않습니다.
actualValue.set('current', 'floor(@{science_base}+@{science_mod})');
events['change:attribute'](actualValue, { current: '63' });
const rowReadsBefore = getAttrByNameCalls.length;
assert(helper.scan(actualCharacter.id, true).ok,
  '반복행 계산식이 있는 시트도 정상적으로 읽어야 합니다.');
const rowReads = getAttrByNameCalls.slice(rowReadsBefore).map((call) => call.name);
assert(!rowReads.includes('science_base') && !rowReads.includes('science_mod'),
  '반복행 계산식이 행 정보를 잃고 전역 속성을 조회하면 안 됩니다.');
actualValue.set('current', '63');
events['change:attribute'](actualValue, { current: 'floor(@{science_base}+@{science_mod})' });

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
  'source-variant-a',
  '변형 A 원본 시험',
);
inspection = helper.inspectContracts(hojilRuntime.character.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || '한 종류의 시트만 적용된 방에서 변형 A를 인식하지 못했습니다.');
assert.strictEqual(inspection.contract.id, hojilSheet.id);
assert(runApi('!!일시적', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{madness_type=[[1]]}}')));
assert(runApi('!!장기적', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{madness_type=[[2]]}}')));
assert(runApi('!!r 2d6+3', hojilRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('{{free_roll=[[2d6+3]]}}')));

const bloodyRuntime = addSourceCharacter(
  bloodySheet,
  'source-variant-b',
  '변형 B 원본 시험',
);
inspection = helper.inspectContracts(bloodyRuntime.character.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || '다중 광기 방식 시트 자동 인식 실패');
assert.strictEqual(inspection.contract.id, bloodySheet.id);
const bloodyShortBonus = helper.resolveContractAction(bloodyRuntime.character, '민첩 보너스1', false);
assert(bloodyShortBonus.handled && bloodyShortBonus.result.ok &&
  bloodyShortBonus.result.payload.label === '민첩성' &&
  /보너스.*1/.test(bloodyShortBonus.result.payload.modeLabel),
  '기본 굴림과 보너스 굴림이 분리된 실제 시트에서도 줄인 이름으로 보너스 굴림을 실행해야 합니다.');
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
const bloodyStatus = runApi('!!상태', bloodyRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼');
assert(bloodyStatus && ['보너스 주사위 1개', '보너스 주사위 2개', '패널티 주사위 1개', '패널티 주사위 2개']
  .every((label) => bloodyStatus.content.includes(label)),
  '분리된 기본·보너스·패널티 굴림도 같은 항목의 다이스 종류로 합쳐 보여야 합니다.');
['라이즈벨', '루엔야크', '애셜', '이카르드', '헬레니아'].forEach((theme) => {
  assert(!bloodyStatus.content.includes(theme),
    '시트 테마를 다이스 종류로 보여주면 안 됩니다: ' + theme);
});

const publicRuntime = addSourceCharacter(
  publicSheet,
  'source-public',
  '대형 원본 시험',
);
inspection = helper.inspectContracts(publicRuntime.character.id);
assert.strictEqual(inspection.status, 'matched',
  inspection.error || '대형 배포 시트 자동 인식 실패');
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

// 배포본에 들어간 모든 실제 시트도 시트 화면에서 직접 누른 rolltemplate 결과를
// 명령 굴림과 같은 판정 컷인 키로 전달해야 합니다.
embeddedSheets.forEach((sheet, index) => {
  const directRuntime = addSourceCharacter(
    sheet,
    'direct-source-' + index,
    '직접 굴림 시험 ' + index,
  );
  const instance = helper.contractRolls(directRuntime.character.id).find((item) =>
    item.roll && item.roll.template &&
    Array.isArray(item.roll.staticLabels) && item.roll.staticLabels.length);
  assert(instance, sheet.id + ': 직접 결과를 식별할 원본 rolltemplate 굴림이 없습니다.');
  const identity = instance.roll.staticLabels.map((entry) =>
    '{{' + entry.field + '=' + entry.value + '}}').join(' ');
  setPlayerSpeakingAs(directRuntime.character.get('name'), 'player-1');
  const before = sent.length;
  events['chat:message']({
    type: 'general',
    rolltemplate: instance.roll.template,
    content: identity + ' {{direct_probe=$[[0]]}}',
    inlinerolls: [{ results: { total: 42 } }],
    who: directRuntime.character.get('name'),
    playerid: 'player-1',
  });
  const result = sent.slice(before).find((item) => item.event === 'sheet:result');
  assert(result, sheet.id + ': 시트에서 직접 누른 굴림을 판정 결과로 인식하지 못했습니다.');
  assert.strictEqual(result.payload.outcome, 'roll',
    sheet.id + ': 성공 수준이 없는 직접 굴림도 판정 실행으로 전달해야 합니다.');
  assert(helper.cutinItems().some((item) =>
    item.key === result.payload.cutinKey && item.label === instance.label),
  sheet.id + ': 직접 굴림과 컷인 관리 항목의 연결 키가 다릅니다.');
});

// 많은 사용자 반복행에서도 현재/최대 짝은 그대로 유지하면서 전체 후보를
// 행마다 다시 훑지 않아야 합니다.
const pairingSheet = parseSheetContract([
  '<input name="attr_pair_marker_a"><input name="attr_pair_marker_b"><input name="attr_pair_marker_c">',
  '<fieldset class="repeating_pair">',
  '  <label>항목 <input name="attr_item_name"></label>',
  '  <label>현재 <input type="number" name="attr_current_value"></label>',
  '  <label>최대 <input type="number" name="attr_maximum_value"></label>',
  '  <button type="roll" name="roll_pair" value="&{template:pair} {{subject=@{item_name}}} {{success=[[@{current_value}]]}} {{roll=[[1d100]]}}">굴림</button>',
  '</fieldset>',
].join('\n'), { id: 'pairing-scale', name: '반복 수치 성능 시험' });
useContracts(pairingSheet);

function addPairingCharacter(id, size, duplicateNames) {
  const values = {
    pair_marker_a: '1',
    pair_marker_b: '1',
    pair_marker_c: '1',
  };
  const order = [];
  for (let index = 0; index < size; index += 1) {
    const row = 'row' + String(index).padStart(5, '0');
    order.push(row);
    values['repeating_pair_' + row + '_item_name'] = duplicateNames ? '같은 항목' : '항목 ' + index;
    values['repeating_pair_' + row + '_current_value'] = String(index + 1);
    values['repeating_pair_' + row + '_maximum_value'] = String(1000 + index);
  }
  values._reporder_repeating_pair = order.join(',');
  return addCharacter(id, id, 'player-1', values);
}

function pairingScanMilliseconds(character, rounds) {
  helper.scan(character.id, true);
  const times = [];
  for (let index = 0; index < rounds; index += 1) {
    const started = performance.now();
    helper.scan(character.id, true);
    times.push(performance.now() - started);
  }
  times.sort((left, right) => left - right);
  return times[Math.floor(times.length / 2)];
}

const ambiguousPairing = addPairingCharacter('pairing-ambiguous', 2, true);
useRoomCharacters(ambiguousPairing);
const ambiguousResources = helper.scan(ambiguousPairing.id, true).resources.filter((item) =>
  /_current_value$/.test(item.name));
assert.strictEqual(ambiguousResources.length, 2);
assert(ambiguousResources.every((item) => item.max === null),
  '같은 이름의 최대 수치가 여러 개면 이전처럼 임의로 하나를 연결하면 안 됩니다.');

const smallPairing = addPairingCharacter('pairing-small', 100, false);
const largePairing = addPairingCharacter('pairing-large', 800, false);
useRoomCharacters(ambiguousPairing, smallPairing, largePairing);
const largePairingData = helper.scan(largePairing.id, true);
const pairedResources = largePairingData.resources.filter((item) => /_current_value$/.test(item.name));
assert.strictEqual(pairedResources.length, 800);
pairedResources.forEach((item) => {
  const row = Number(item.name.match(/_row(\d+)_current_value$/)[1]);
  assert.strictEqual(item.max, 1000 + row,
    '반복행 현재 수치가 같은 행의 최대 수치와 연결되어야 합니다: ' + item.name);
});
const smallPairingMs = pairingScanMilliseconds(smallPairing, 5);
const largePairingMs = pairingScanMilliseconds(largePairing, 5);
assert(largePairingMs <= smallPairingMs * 10 + 25,
  '반복행 8배 증가 시 스캔이 제곱으로 증가했습니다: ' +
  smallPairingMs.toFixed(2) + 'ms -> ' + largePairingMs.toFixed(2) + 'ms');

console.log('Sheet Helper check: PASS');
