const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { performance } = require('perf_hooks');
const { parseSheetContract } = require('./sheet-contract-parser');

const indirectTemplate = parseSheetContract([
  '<input type="hidden" name="attr_result_style" value="&{template:indirect}">',
  '<input type="hidden" name="attr_dice_fragment" value="{{roll1=[[1d100]]}}">',
  '<button type="roll" title="일반 다이스" value="@{result_style} {{subject=외모}} @{dice_fragment}"></button>',
].join('\n'));
assert.strictEqual(indirectTemplate.rolls[0].template, 'indirect',
  '숨은 필드에 있는 원본 템플릿 이름도 직접 굴림 인식에 연결해야 합니다.');
assert.strictEqual(indirectTemplate.rolls[0].label, '외모',
  '빈 버튼의 공통 툴팁보다 원본 판정 이름을 표시해야 합니다.');
assert(indirectTemplate.rolls[0].aliases.includes('일반 다이스'),
  '버튼 툴팁은 원본 별칭으로 보존해야 합니다.');

const distributedSource = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'),
  'utf8',
);
const recognitionStart = '/* SCENE_SUITE_SHEET_RECOGNITION_START */';
const recognitionEnd = '/* SCENE_SUITE_SHEET_RECOGNITION_END */';
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
  'sheet-cf240692b20596fc', 'sheet-f3665f982d39afe2',
];
assert.deepStrictEqual(Array.from(embeddedSheets, (sheet) => sheet.id), expectedEmbeddedIds,
  '배포용 10번의 CoC 시트 인식 구조가 누락되거나 순서가 바뀌었습니다.');
// CoC6 translated titles were rebuilt from its unchanged source. The subsequent
// Achtung refresh changes only roll/field labels and aliases: all 179 raw rolls,
// 1132 field behaviors, visibility/modes and the other 34 contracts were preserved.
// Keep that baseline except the explicitly verified visibility/settings fixes.
const preservationSheets = JSON.parse(JSON.stringify(embeddedSheets.slice(0, 34)));
const workerUpdatedSheet = preservationSheets.find(sheet => sheet.id === 'sheet-c653c0852b277de6');
function withoutWorkerGate(condition) {
  if (!condition || condition.required) return null;
  if (condition.not) {
    const child = withoutWorkerGate(condition.not);
    return child ? { not: child } : null;
  }
  for (const key of ['all', 'any']) {
    if (!condition[key]) continue;
    const children = condition[key].map(withoutWorkerGate).filter(Boolean);
    const unique = [...new Map(children.map(child => [JSON.stringify(child), child])).values()];
    return unique.length > 1 ? { [key]: unique } : unique[0] || null;
  }
  return condition;
}
delete workerUpdatedSheet.controls.oldcombatcheck;
workerUpdatedSheet.rolls.forEach(roll => {
  const visibility = withoutWorkerGate(roll.visibility);
  if (visibility) roll.visibility = visibility;
  else delete roll.visibility;
});
workerUpdatedSheet.fields.forEach(field => { field.visibility = withoutWorkerGate(field.visibility); });
const settingsOnlyFields = ['agemovemod', 'clog', 'hptemp', 'initpow', 'is_config', 'mixedbom',
  'oldcombatcheck', 'pulp_bomtoggle', 'pulp_hp_mod', 'showpulp', 'toggledr', 'toggletalents'];
settingsOnlyFields.forEach(name => {
  const field = workerUpdatedSheet.fields.find(item => item.name === name);
  assert.strictEqual(field.trackCandidate, false, '원본 설정 컨트롤의 추적 제외: ' + name);
  field.trackCandidate = true;
});
assert.strictEqual(
  crypto.createHash('sha256').update(JSON.stringify(preservationSheets)).digest('hex'),
  '71cf9a121e4594fc3dd16299519e3324819776562220701cf80213659714b7e1',
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
const distributedBytes = Buffer.byteLength(distributedSource.replace(/\r\n/g, '\n'), 'utf8');
// 35종 원본과 질문 버튼 전달 코드를 포함한 상한. 기존 원본은 위 해시로 별도 보존합니다.
assert(distributedBytes <= 677000,
  '10번 배포 코드가 다시 비대해졌습니다: ' + distributedBytes + ' bytes');

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
  '<label>체력 <input type="number" name="attr_vital_current" max="@{vital_limit}"></label>',
  '<input type="hidden" name="attr_vital_limit" value="20">',
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
let deferAttributeTimers = false;
let nextTimerId = 1;
const attributeTimers = [];
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
  getSheetDefaultValue(name) {
    const ids = roomCharacterIds ? Array.from(roomCharacterIds) : characters.map((item) => item.id);
    for (const id of ids) {
      const defaults = sheetFieldDefaults[id];
      if (defaults && Object.prototype.hasOwnProperty.call(defaults, name)) return defaults[name];
    }
    return undefined;
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
  setTimeout(callback, delay) {
    const id = nextTimerId++;
    if (delay === 25) {
      const timer = { id, callback, cancelled: false, fired: false };
      attributeTimers.push(timer);
      if (!deferAttributeTimers) {
        timer.fired = true;
        callback();
      }
    }
    return id;
  },
  clearTimeout(id) {
    const timer = attributeTimers.find((item) => item.id === id);
    if (timer) timer.cancelled = true;
  },
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

function flushAttributeTimers() {
  const pending = attributeTimers.splice(0);
  pending.forEach((timer) => {
    if (!timer.cancelled && !timer.fired) {
      timer.fired = true;
      timer.callback();
    }
  });
}
assert.strictEqual(runtime.state.KIBSheetHelper.trackGmOnly, false,
  '새 설치에서 플레이어 권한이 없는 GM 캐릭터를 기본 공개 대상에 포함하면 안 됩니다.');
const compactHelp = runtime.KIBScene.adapters.sheet.help.join('\n');
[':수치이름+3', '!!화자 본인', '!!변화알림 공개|GM|끄기', '!!GM캐릭터알림 켜기|끄기']
  .forEach((command) => assert(compactHelp.includes(command), '!sd help에 명령이 없습니다: ' + command));

function addCharacter(id, name, controlledby, values, inplayerjournals) {
  const character = roll20Object(id, {
    name,
    controlledby: controlledby || '',
    inplayerjournals: inplayerjournals || '',
  });
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
  vital_limit: '20',
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

const secondFixtureValues = Object.fromEntries(Object.entries(fixtureValues).filter(([name]) =>
  !name.startsWith('repeating_skill_') && name !== '_reporder_repeating_skill'));
Object.assign(secondFixtureValues, {
  repeating_skill_otherRow_item_name: '사용자 항목',
  repeating_skill_otherRow_item_value: '55',
  _reporder_repeating_skill: 'otherRow',
});
const secondFixtureCharacter = addCharacter(
  'generic-character-second',
  '두 번째 범용 탐사자',
  'player-1',
  secondFixtureValues,
);
useRoomCharacters(fixtureCharacter, secondFixtureCharacter);
addAttribute(fixtureCharacter.id, 'cutin_catalog_probe', '');
const cutinCatalogCharacter = [fixtureCharacter, secondFixtureCharacter]
  .sort((left, right) => left.get('name').localeCompare(right.get('name')))[0];
helper.scan(cutinCatalogCharacter.id);
const cutinLiveReadStart = getAttrByNameCalls.length;
const fixtureCutinItems = helper.cutinItems();
assert.strictEqual(fixtureCutinItems.filter((item) => item.label === '사용자 항목').length, 1,
  '한 방의 같은 시트 굴림을 캐릭터 수만큼 중복 스캔하면 안 됩니다.');
assert.strictEqual(getAttrByNameCalls.length, cutinLiveReadStart,
  '컷인 항목 이름은 현재 스캔 캐시를 재사용하고 실시간 시트 값을 추가 조회하면 안 됩니다.');
assert.deepStrictEqual(Array.from(fixtureCutinItems.filter((item) => item.label === '지능'), (item) => item.displayLabel),
  [1, 2].map((index) => '지능 (' + cutinCatalogCharacter.get('name') + ' ' + index + ')'),
  '원본에 구분 표시명이 없으면 주사위 식으로 모드 이름을 지어내지 말고 기존 동명 번호를 유지해야 합니다.');
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
  assert(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/.test(pending[0].content),
    '자동 지능 판정도 템플릿 필드를 추가하지 않는 주석 표식으로 결과를 연결해야 합니다.');
  const token = pending[0].content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
  setPlayerSpeakingAs(fixtureCharacter.get('name'), 'player-1');
  const start = sent.length;
  events['chat:message']({
    type: 'general',
    content: '&{template:fixture} {{subject=지능}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
      '{{extreme=$[[2]]}} {{roll=$[[3]]}} <!--kib_sheet_result=' + token + '-->',
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

helper.scan(fixtureCharacter.id, true);
const cachedExactFinds = attributeFindCalls.length;
const normal = helper.resolveContractAction(fixtureCharacter, '정밀 관찰', false);
assert(normal.handled && normal.result.ok);
assert.strictEqual(attributeFindCalls.length, cachedExactFinds,
  '캐시된 굴림을 정확히 찾을 때 캐릭터 Attribute를 다시 전부 조회하면 안 됩니다.');
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
const firstStoredValueStart = sent.length;
storedBlankAttribute.set('current', '42');
events['change:attribute'](storedBlankAttribute, { current: '' });
const firstStoredValue = helper.scan(fixtureCharacter.id);
assert.strictEqual(firstStoredValue.resources.find((item) => item.name === 'blank_target').value, 42,
  '처음 비어 있던 기존 입력칸에 값을 넣으면 강제 새로고침 없이 즉시 읽어야 합니다.');
assert(sent.slice(firstStoredValueStart).some((item) =>
  String(item.content || '').includes('미입력 수치') && String(item.content || '').includes('42')),
  '처음 비어 있던 기존 수치의 첫 입력도 변화 알림에서 빠지면 안 됩니다.');
const firstStoredStatus = runApi('!!상태').find((item) => item.who === '시트 헬퍼');
assert(firstStoredStatus && !firstStoredStatus.content.includes('미입력 수치'),
  '원본에서 현재·최대·시작 수치로 묶이지 않은 숫자 입력칸을 상태 수치에 늘리면 안 됩니다.');
storedBlankAttribute.set('current', '57');
events['change:attribute'](storedBlankAttribute, { current: '42' });
assert.strictEqual(helper.scan(fixtureCharacter.id).resources.find((item) => item.name === 'blank_target').value, 57,
  '이미 읽은 수치를 다시 바꿔도 최신값을 사용해야 합니다.');
assert(helper.resolveContractAction(fixtureCharacter, '사용자 항목', false).result.ok &&
  sent.at(-1).content.includes('{{success=[[55]]}}'),
  '기존 입력칸 갱신 뒤에도 사용자가 추가한 반복 기능치를 그대로 굴려야 합니다.');
attributeObjects.splice(attributeObjects.indexOf(storedBlankAttribute), 1);
events['destroy:attribute'](storedBlankAttribute);
helper.scan(fixtureCharacter.id, true);
const cachedMissFinds = attributeFindCalls.length;
const unknownCommandMessages = runApi('!!존재하지 않는 굴림');
assert(unknownCommandMessages.some((item) => item.who === '시트 헬퍼' && /찾지 못했습니다/.test(item.content)),
  '없는 굴림 명령은 샌드박스 오류가 아니라 채팅 오류로 끝나야 합니다.');
assert.strictEqual(attributeFindCalls.length, cachedMissFinds,
  '없는 굴림을 두 단계로 찾을 때 같은 캐릭터 Attribute를 다시 전부 조회하면 안 됩니다.');
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
const rollGroupTitles = ['특성치', '기능 / 판정', '무기', '주문', '광기', '기타 주사위'];
const rollGroupMarkers = rollGroupTitles.map((title) => 'font-weight:bold">' + title + ' ');
const rollGroupPositions = rollGroupMarkers.map((marker) => status.content.indexOf(marker));
assert(rollGroupPositions.every((position) => position >= 0) &&
  rollGroupPositions.every((position, index) => index === 0 || position > rollGroupPositions[index - 1]),
  'PL 상태 화면은 특성치, 기능 / 판정, 무기, 주문, 광기, 기타 주사위 순으로 나눠야 합니다.');
const rollGroupContents = Object.fromEntries(rollGroupTitles.map((title, index) => [
  title,
  status.content.slice(rollGroupPositions[index], rollGroupPositions[index + 1] || status.content.length),
]));
assert(rollGroupContents['기능 / 판정'].includes('정밀 관찰') &&
  rollGroupContents['기능 / 판정'].includes('간접 판정') &&
  rollGroupContents['기능 / 판정'].includes('숙련 기능') &&
  !rollGroupContents['기능 / 판정'].includes('개조 무기'),
  '판정 구조와 사용자 추가 기능은 기능 / 판정 구역에만 보여야 합니다.');
assert(rollGroupContents['특성치'].includes('지능') &&
  !rollGroupContents['특성치'].includes('정밀 관찰'),
  '특성치는 기능과 분리하고 기능을 특성치로 섞으면 안 됩니다.');
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
  managerNotes.includes('특성치') && managerNotes.includes('기능 / 판정') && managerNotes.includes('무기') &&
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
assert(!majorMessages.some((item) => item.content && item.content.startsWith('/desc ')),
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
}, 'all');
const gmOnlyHealth = attributeObjects.find((item) =>
  item.get('_characterid') === gmOnlyCharacter.id && item.get('name') === 'vital_current');
helper.scan(gmOnlyCharacter.id, true);
runtime.state.KIBSheetHelper.trackingMode = 'gm';
runtime.state.KIBSheetHelper.trackGmOnly = true;
let gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '9');
events['change:attribute'](gmOnlyHealth, { current: '10' });
let trackedMessage = sent.slice(gmOnlyMessageStart).find((item) =>
  item.content && item.content.startsWith('/w gm ') && item.content.includes('GM 전용 탐사자 / 체력'));
assert(trackedMessage && (!trackedMessage.options || trackedMessage.options.noarchive !== true) &&
  !sent.slice(gmOnlyMessageStart).some((item) => item.content && item.content.startsWith('/desc ')),
  'GM 전용 변화 알림은 전체 공개하지 않고 채팅 로그에는 남겨야 합니다.');
runtime.state.KIBSheetHelper.trackingMode = 'public';
runtime.state.KIBSheetHelper.trackGmOnly = false;
gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '8');
events['change:attribute'](gmOnlyHealth, { current: '9' });
assert(!sent.slice(gmOnlyMessageStart).some((item) =>
  item.content && item.content.includes('GM 전용 탐사자 / 체력')),
  '보기 권한만 공개된 캐릭터는 플레이어 제어 캐릭터로 추적하면 안 됩니다.');
gmOnlyCharacter.set('controlledby', 'missing-player');
gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '7');
events['change:attribute'](gmOnlyHealth, { current: '8' });
assert(!sent.slice(gmOnlyMessageStart).some((item) =>
  item.content && item.content.includes('GM 전용 탐사자 / 체력')),
  '삭제된 플레이어 제어 ID가 남아도 플레이어 제어 캐릭터로 추적하면 안 됩니다.');
gmOnlyCharacter.set('controlledby', '');
runtime.state.KIBSheetHelper.trackGmOnly = true;
gmOnlyMessageStart = sent.length;
gmOnlyHealth.set('current', '6');
events['change:attribute'](gmOnlyHealth, { current: '7' });
trackedMessage = sent.slice(gmOnlyMessageStart).find((item) =>
  item.content && item.content.startsWith('/desc ') && item.content.includes('GM 전용 탐사자 / 체력'));
assert(trackedMessage && !trackedMessage.content.includes('vd-permitted-api-chat') &&
  (!trackedMessage.options || trackedMessage.options.noarchive !== true),
  'GM 캐릭터 공개 알림은 표시하고 채팅 로그에도 남겨야 합니다.');
assert.strictEqual(trackedMessage.who, '',
  '공개 변화 알림은 발화자 이름 없는 desc로 표시해야 합니다.');
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
const longInsanityNotice = longInsanityMessages.find((item) => item.content &&
  item.content.includes('40 / 시작 50 (80%)'));
assert(longInsanityNotice && !longInsanityNotice.content.includes('/ 최대 99'),
  '이성 변화 알림은 시작 이성 비율만 보여 주고 최대 이성은 생략해야 합니다: ' +
  JSON.stringify(longInsanityMessages.map((item) => item.content)));
assert(longInsanityNotice.content.includes('font-size:10px') &&
  longInsanityNotice.content.includes('color:#969696'),
  '수치 변화 알림은 작은 연회색 로그 스타일이어야 합니다.');
assert(!longInsanityMessages.some((item) => item.content &&
  item.content.includes('장기적 광기 활성화 상태라 지능 판정 생략')),
  '장기적 광기가 우선되더라도 지능 판정 생략 안내를 중복 표시하면 안 됩니다.');

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

[['', '0'], ['off', '0'], ['false', '']].forEach(([before, after]) => {
  resetFixture({ long_madness: before });
  assert.strictEqual(changeFixture('long_madness', after).length, 0,
    '체크 해제의 원시 표현만 바뀌었으면 해제→해제 알림을 보내면 안 됩니다.');
});
resetFixture({ long_madness: '0' });
assert.strictEqual(changeFixture('long_madness', 'active').filter((item) =>
  item.content && item.content.includes('→ <b>활성화</b>')).length, 1,
  '원본 체크값으로 실제 활성화되면 알림을 한 번 보내야 합니다.');
assert.strictEqual(changeFixture('long_madness', '0').filter((item) =>
  item.content && item.content.includes('→ <b>해제</b>')).length, 1,
  '활성화된 체크를 실제 해제하면 알림을 한 번 보내야 합니다.');

const missingLong = addMinimalInsanityFixture('missing_long', { longCount: 0, temporary: true });
let missingFieldMessages = missingLong.change('current', 40);
assert.strictEqual(intelligenceRolls(missingFieldMessages).length, 0,
  '장기 기준에 도달하면 체크 필드가 없어도 일시적 광기용 지능 판정을 실행하면 안 됩니다.');
assert(missingFieldMessages.some((item) => item.content && item.content.includes('장기적 광기 자동 처리 생략')),
  '시작 이성의 5분의 1 기준을 넘었지만 체크 필드가 없으면 생략 이유를 알려야 합니다.');
assert.strictEqual(missingLong.attribute('temporary').get('current'), '0',
  '장기 기준에 도달했는데 일시적 광기를 대신 활성화하면 안 됩니다.');
missingLong.reset({ current: 45, temporary: 0 });
missingFieldMessages = missingLong.change('current', 40);
assert.strictEqual(intelligenceRolls(missingFieldMessages).length, 0,
  '누적 손실이 장기 기준에 도달한 사건도 지능 판정을 실행하면 안 됩니다.');
assert.strictEqual(missingLong.attribute('temporary').get('current'), '0',
  '장기적 광기 체크 필드가 없더라도 일시적 광기를 켜면 안 됩니다.');

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
const token = pendingMessage.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
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

// 결과 표식은 allprops에 보이는 원본 필드가 아니며, 결과 도착 순서와 공개 범위를 보존합니다.
{
  const instance = helper.contractRolls(fixtureCharacter.id).find((item) => item.roll.name === 'precision');
  const mode = instance.modes.find((item) => String(item.overrides.bonus_mode) === '0');
  assert(mode, '주석 표식 검사에 원본의 명시적 기본 선택 방식이 필요합니다.');
  const originalRandomInteger = runtime.randomInteger;
  let markerRandom = 100;
  runtime.randomInteger = () => ++markerRandom;
  function startMarkerRoll(secret, selectedMode) {
    const expected = helper.qualifyContractMacro(fixtureCharacter.id, instance, selectedMode);
    assert(expected.ok);
    const before = sent.length;
    const result = helper.executeContract(fixtureCharacter.id, fixture.id, instance.roll.key, '',
      selectedMode ? selectedMode.id : '', secret, '');
    assert(result.ok);
    const messages = sent.slice(before).filter((item) => (item.content || '').includes('kib_sheet_result='));
    assert.strictEqual(messages.length, 1);
    const content = messages[0].content;
    const match = content.match(/ <!--kib_sheet_result=([A-Za-z0-9_-]+)-->$/);
    assert(match, '새 결과 표식은 템플릿 property가 아닌 마지막 HTML 주석이어야 합니다.');
    const original = (secret ? '/w gm ' : '') + expected.content;
    assert.strictEqual(content.slice(0, match.index), original,
      '주석 앞의 공개/비밀 원본 굴림을 바꾸면 안 됩니다.');
    assert.deepStrictEqual(content.match(/\{\{\s*[^={}]+\s*=/g), original.match(/\{\{\s*[^={}]+\s*=/g),
      'allprops가 열거하는 원본 템플릿 필드를 추적 목적으로 늘리면 안 됩니다.');
    assert.deepStrictEqual(content.match(/\[\[[\s\S]*?\]\]/g), original.match(/\[\[[\s\S]*?\]\]/g),
      '결과 추적이 원본 inline 개수·식·순서를 바꾸면 안 됩니다.');
    return { token: match[1], result };
  }
  function finishMarkerRoll(value, total, legacy) {
    const before = sent.length;
    events['chat:message']({
      type: value.result && value.result.payload.secret ? 'whisper' : 'general',
      rolltemplate: 'fixture',
      content: '{{subject=정밀 관찰}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
        '{{extreme=$[[2]]}} {{roll=$[[3]]}} ' + (legacy
          ? '{{kib_sheet_result=' + value.token + '}}'
          : '<!--kib_sheet_result=' + value.token + '-->'),
      inlinerolls: [60, 30, 12, total].map((number) => ({ results: { total: number } })),
      who: fixtureCharacter.get('name'), playerid: 'player-1',
    });
    return sent.slice(before).filter((item) => item.event === 'sheet:result');
  }
  try {
    const publicRoll = startMarkerRoll(false, null);
    const privateRoll = startMarkerRoll(true, mode);
    assert.notStrictEqual(publicRoll.token, privateRoll.token,
      '같은 원본 굴림을 연속 실행해도 서로 다른 결과 대기 항목이어야 합니다.');
    const privateEvents = finishMarkerRoll(privateRoll, 20, false);
    const publicEvents = finishMarkerRoll(publicRoll, 80, false);
    assert.strictEqual(privateEvents.length, 1);
    assert.strictEqual(publicEvents.length, 1);
    const privatePayload = privateEvents[0].payload;
    const publicPayload = publicEvents[0].payload;
    assert.strictEqual(privatePayload, privateRoll.result.payload);
    assert.strictEqual(publicPayload, publicRoll.result.payload);
    assert.strictEqual(privatePayload.result.total, 20);
    assert.strictEqual(publicPayload.result.total, 80);
    assert.strictEqual(privatePayload.secret, true);
    assert.strictEqual(publicPayload.secret, false);
    assert.strictEqual(privatePayload.mode, mode.id);
    assert.strictEqual(privatePayload.modeLabel, '기본');
    assert.strictEqual(privatePayload.cutinKey, resultEvent.payload.cutinKey,
      '08에 전달하는 비밀·모드 payload도 원본 판정의 컷인 연결 키를 유지해야 합니다.');
    assert.strictEqual(publicPayload.cutinKey, resultEvent.payload.cutinKey);
    [publicRoll, privateRoll].forEach((value) => {
      assert.strictEqual(finishMarkerRoll(value, 20, false).length, 0,
        '소비된 주석 표식은 원본 굴림으로 재분류하여 중복 broadcast하면 안 됩니다.');
      assert.strictEqual(finishMarkerRoll(value, 20, true).length, 0,
        '소비된 구형 property 표식도 원본 굴림으로 재분류하면 안 됩니다.');
    });
    ['unknown_result_token', 'constructor', '__proto__'].forEach((unknown) => {
      [false, true].forEach((legacy) => assert.strictEqual(
        finishMarkerRoll({ token: unknown }, 20, legacy).length, 0,
        '알 수 없는 결과 표식은 원본 굴림으로 재분류하면 안 됩니다: ' + unknown));
    });
    const legacyRoll = startMarkerRoll(false, null);
    assert.strictEqual(finishMarkerRoll(legacyRoll, 20, true).length, 1,
      '이전 property 표식으로 도착하는 대기 결과의 호환성은 유지해야 합니다.');
    const freeValue = fixtureAttribute('free_expression');
    const previous = freeValue.get('current');
    try {
      ['<!--kib_sheet_result=reserved-->', '{{kib_sheet_result=reserved}}'].forEach((marker) => {
        const rawInstance = { ...instance, roll: { ...instance.roll, raw: instance.roll.raw + ' ' + marker } };
        const rawRejected = helper.qualifyContractMacro(fixtureCharacter.id, rawInstance, null);
        assert(!rawRejected.ok && rawRejected.error.includes('예약 필드'),
          '원본 raw가 소유한 예약 결과 표식은 실행을 거부해야 합니다.');
        freeValue.set('current', marker);
        const expandedInstance = { ...instance, roll: { ...instance.roll,
          raw: '&{template:fixture} {{subject=정밀 관찰}} @{free_expression}' } };
        const expandedRejected = helper.qualifyContractMacro(fixtureCharacter.id, expandedInstance, null);
        assert(!expandedRejected.ok && expandedRejected.error.includes('예약 필드'),
          '속성 확장으로 들어온 예약 결과 표식도 실행을 거부해야 합니다.');
      });
    } finally {
      freeValue.set('current', previous);
    }
  } finally {
    runtime.randomInteger = originalRandomInteger;
  }
}

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
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
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
const blue29Sheet = findEmbeddedSheet(360, 244, 638);
const bloodySheet = findEmbeddedSheet(422, 253, 2928);
const publicSheet = embeddedLargeSheet;
const marenHyeyoomSheet = findEmbeddedSheet(187, 72, 374);

function visibilityMentions(condition, name) {
  if (!condition || typeof condition !== 'object') return false;
  if (Array.isArray(condition)) return condition.some((entry) => visibilityMentions(entry, name));
  if (condition.name === name) return true;
  return ['all', 'any', 'not'].some((key) => visibilityMentions(condition[key], name));
}

function visibilityEquals(condition, name, value) {
  if (!condition || typeof condition !== 'object') return false;
  if (Array.isArray(condition))
    return condition.some((entry) => visibilityEquals(entry, name, value));
  if (condition.name === name && condition.op === 'eq' && String(condition.value) === String(value))
    return true;
  return ['all', 'any'].some((key) => visibilityEquals(condition[key], name, value));
}

// 저장된 선택값이 현재 원본 시트의 선택지에 없으면 원본 기본 화면을 사용하고,
// 유효한 다른 선택값은 그대로 존중해야 합니다. 시트·변수명 없이 두 컨트롤 구조를 검증합니다.
['select', 'radio'].forEach((type) => {
  const selectors = embeddedSheets.flatMap((sheet) => Object.entries(sheet.controls || {})
    .map(([name, control]) => ({
      sheet,
      name,
      control,
      uses: (sheet.rolls || []).filter((roll) => visibilityMentions(roll.visibility, name)).length,
    }))).filter(({ control, uses }) => {
      const values = (control.options || control.values || []).map((option) =>
        String(option && typeof option === 'object' ? option.value : option));
      return String(control.type || '').toLowerCase() === type && uses > 1 && values.length > 1 &&
        values.includes(String(control.default));
    }).sort((left, right) => right.uses - left.uses);
  let verified = false;
  selectors.some((selector, index) => {
    const selectorRuntime = addSourceCharacter(
      selector.sheet, `source-${type}-fallback-${index}`, `원본 ${type} 회귀 시험 ${index}`);
    const selectorAttribute = attributeObjects.find((item) =>
      item.get('_characterid') === selectorRuntime.character.id && item.get('name') === selector.name);
    if (!selectorAttribute) return false;
    const visibleRolls = (value) => {
      selectorAttribute.set('current', value);
      return helper.scan(selectorRuntime.character.id, true).contractRolls
        .filter((instance) => visibilityMentions(instance.roll.visibility, selector.name))
        .map((instance) => instance.roll.key).sort();
    };
    const options = (selector.control.options || selector.control.values)
      .map((option) => String(option && typeof option === 'object' ? option.value : option));
    const defaults = visibleRolls(String(selector.control.default));
    const alternate = options.map((value) => ({ value, rolls: visibleRolls(value) }))
      .find((entry) => entry.value !== String(selector.control.default) &&
        JSON.stringify(entry.rolls) !== JSON.stringify(defaults));
    if (!alternate) return false;
    assert.deepStrictEqual(visibleRolls('__not_a_source_option__'), defaults,
      `${type}: 원본 선택지에 없는 저장값은 원본 기본 화면으로 복구해야 합니다.`);
    assert.deepStrictEqual(visibleRolls(alternate.value), alternate.rolls,
      `${type}: 원본에 존재하는 현재 선택값을 기본값으로 덮어쓰면 안 됩니다.`);
    verified = true;
    return true;
  });
  assert(verified, `${type}: 원본 선택값 fallback을 검증할 공통 반례를 찾지 못했습니다.`);
});

// 접힌 기본 패널을 여는 단일 표시용 체크박스가 아직 저장되지 않은 경우에는
// 원본 버튼을 숨기지 않습니다. 체크된 일반 상태값은 사용자가 끈 값을 보존합니다.
const winterSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-42f7d7a429602033');
assert(winterSheet, '접힌 기본 기능 패널 회귀를 검증할 원본 구조가 필요합니다.');
const winterPanelField = (winterSheet.fields || []).find((field) => {
  if (field.section || String(field.type).toLowerCase() !== 'checkbox' ||
      String(field.default || '') !== '' || !String(field.onValue || '')) return false;
  return winterSheet.rolls.filter((roll) =>
    visibilityEquals(roll.visibility, field.name, field.onValue)).length * 2 > winterSheet.rolls.length;
});
assert(winterPanelField, '접힌 기본 기능 패널을 원본 표시 관계에서 찾지 못했습니다.');
const winterRuntime = addSourceCharacter(winterSheet, 'winter-panel-character', '겨울 패널 시험');
const winterPanelAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === winterRuntime.character.id && item.get('name') === winterPanelField.name);
assert(winterPanelAttribute, '접힌 기본 기능 패널의 저장값을 만들지 못했습니다.');
winterPanelAttribute.set('current', '');
const winterScan = helper.scan(winterRuntime.character.id, true);
assert(winterScan.contractRolls.some((instance) => /^감정(?:\s|\()/.test(instance.label)),
  '저장 전 접힌 기본 패널에서도 원본 감정 굴림을 사용할 수 있어야 합니다.');
const winterStatusMessage = runApi('!!상태', winterRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼');
assert(winterStatusMessage, '접힌 기본 패널 상태를 출력하지 못했습니다.');
const winterTracker = winterSheet.rolls.find((roll) => /&\{tracker\}/i.test(String(roll.raw || '')));
assert(winterTracker, '턴 순서 유틸리티 굴림을 원본에서 찾지 못했습니다.');
const winterOtherAt = winterStatusMessage.content.indexOf('기타 주사위');
const winterTrackerAt = winterStatusMessage.content.indexOf(winterTracker.label);
assert(winterOtherAt >= 0 && winterTrackerAt > winterOtherAt,
  '턴 순서 유틸리티를 특성치로 분류하지 말고 기타 주사위에 표시해야 합니다.');

// 같은 name을 공유하는 여러 checkbox 선택지는 select/radio와 똑같이 현재값을
// 검증합니다. 원본에 없는 0은 기본 화면으로, 유효한 다른 값은 그대로 유지합니다.
const multiCheckboxSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-99888fc8321bfa35');
assert(multiCheckboxSheet, '다중 checkbox 화면 선택 회귀를 검증할 원본 구조가 필요합니다.');
const multiCheckboxSelector = Object.entries(multiCheckboxSheet.controls || {}).map(([name, control]) => {
  const options = (control.options || control.values || []).map((option) =>
    String(option && typeof option === 'object' ? option.value : option));
  return {
    name,
    control,
    options,
    uses: multiCheckboxSheet.rolls.filter((roll) => visibilityMentions(roll.visibility, name)).length,
  };
}).filter((entry) => String(entry.control.type || '').toLowerCase() === 'checkbox' &&
  entry.options.length > 1 && entry.options.includes(String(entry.control.default)) &&
  !entry.options.includes('0') && entry.uses > 1)
  .sort((left, right) => right.uses - left.uses)[0];
assert(multiCheckboxSelector, '원본 다중 checkbox 화면 선택기를 찾지 못했습니다.');
const multiCheckboxRuntime = addSourceCharacter(
  multiCheckboxSheet, 'multi-checkbox-character', '다중 checkbox 시험');
const multiCheckboxAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === multiCheckboxRuntime.character.id &&
  item.get('name') === multiCheckboxSelector.name);
assert(multiCheckboxAttribute, '다중 checkbox 선택값을 만들지 못했습니다.');
const multiCheckboxRolls = (value) => {
  multiCheckboxAttribute.set('current', value);
  return helper.scan(multiCheckboxRuntime.character.id, true).contractRolls
    .map((instance) => instance.roll.key).sort();
};
const multiCheckboxDefault = multiCheckboxRolls(String(multiCheckboxSelector.control.default));
const multiCheckboxAlternate = multiCheckboxSelector.options
  .map((value) => ({ value, rolls: multiCheckboxRolls(value) }))
  .find((entry) => entry.value !== String(multiCheckboxSelector.control.default) &&
    JSON.stringify(entry.rolls) !== JSON.stringify(multiCheckboxDefault));
assert(multiCheckboxAlternate, '다중 checkbox의 유효한 다른 화면을 찾지 못했습니다.');
assert.deepStrictEqual(multiCheckboxRolls('0'), multiCheckboxDefault,
  '다중 checkbox의 원본 선택지에 없는 0은 원본 기본 화면으로 복구해야 합니다.');
assert.deepStrictEqual(multiCheckboxRolls(multiCheckboxAlternate.value), multiCheckboxAlternate.rolls,
  '다중 checkbox의 유효한 현재 화면을 원본 기본값으로 덮어쓰면 안 됩니다.');

const singleCheckboxSheet = parseSheetContract([
  '<input name="attr_single_marker_a"><input name="attr_single_marker_b"><input name="attr_single_marker_c">',
  '<input type="checkbox" class="sheet-single-switch" name="attr_single_switch" value="1" checked>',
  '<div class="sheet-single-panel"><button type="roll" value="&{template:single} {{subject=단일 체크 판정}} {{roll=[[1d100]]}}">단일 체크 판정</button></div>',
].join('\n'), {
  id: 'single-checkbox-off',
  sourceHash: 'single-checkbox-off-v1',
  css: '.sheet-single-panel{display:none}.sheet-single-switch[value="1"]:checked ~ .sheet-single-panel{display:block}',
});
const singleCheckboxRuntime = addSourceCharacter(
  singleCheckboxSheet, 'single-checkbox-character', '단일 checkbox 시험');
const singleCheckboxAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === singleCheckboxRuntime.character.id && item.get('name') === 'single_switch');
assert(singleCheckboxAttribute, '단일 checkbox 저장값을 만들지 못했습니다.');
assert(helper.scan(singleCheckboxRuntime.character.id, true).contractRolls
  .some((instance) => instance.label === '단일 체크 판정'),
  '원본에서 켜진 단일 checkbox 판정을 찾지 못했습니다.');
singleCheckboxAttribute.set('current', '0');
assert(!helper.scan(singleCheckboxRuntime.character.id, true).contractRolls
  .some((instance) => instance.label === '단일 체크 판정'),
  '사용자가 끈 단일 checkbox를 원본 기본값으로 되돌리면 안 됩니다.');

const achtungSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-cf240692b20596fc');
const nativeLimitSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-4ffca055eb552326');
const officialSixSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-c236bcff42e9a873');
assert(achtungSheet, 'Achtung! Cthulhu 공개 시트 인식 정보가 필요합니다.');
assert(nativeLimitSheet, 'HTML 입력 상한과 명시 최대 필드가 함께 있는 공개 시트 인식 정보가 필요합니다.');
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
// getSheetDefaultValue는 없는 필드(undefined)와 존재하는 빈 기본값('')을
// 구분합니다. 기본값 증거가 충돌하거나 부족하면 임의 선택하지 않습니다.
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
  const defaultReadsBefore = getAttrByNameCalls.length;
  const result = helper.inspectContracts(character.id);
  assert.strictEqual(getAttrByNameCalls.slice(defaultReadsBefore)
    .filter((call) => call.characterId === character.id).length, 0,
  sheet.id + ': 현재 시트 기본값 탐색은 캐릭터의 없는 필드를 조회하면 안 됩니다.');
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

// 실제 Roll20은 원본 HTML의 수식 기본값 상당수를 아직 계산할 수 없는 새 캐릭터에서
// 빈 문자열로 돌려줍니다. 앞쪽 24개 빈 probe 뒤에 남은 원본 고유 기본값까지 읽어야 합니다.
const nativeLiveDefaults = sourceDefaults(nativeLimitSheet);
const nativeLiveCharacter = addCharacter(
  'native-live-default-character', '공식 구판 실시간 기본값 반례', 'player-1', {},
);
sheetFieldDefaults[nativeLiveCharacter.id] = nativeLiveDefaults;
Object.keys(nativeLiveDefaults).forEach((name) => {
  getAttrByNameOverrides[nativeLiveCharacter.id + '|' + name + '|current'] = '';
});
Object.assign(getAttrByNameOverrides, {
  [nativeLiveCharacter.id + '|character_name|current']: nativeLiveCharacter.get('name'),
  [nativeLiveCharacter.id + '|HP|current']: '15',
  [nativeLiveCharacter.id + '|MP|current']: '9',
  [nativeLiveCharacter.id + '|Sanity|current']: '45',
  [nativeLiveCharacter.id + '|Max-Sanity|current']: '99-@{Cthulhu-Mythos}',
  [nativeLiveCharacter.id + '|Active|current']: '10',
  [nativeLiveCharacter.id + '|Aminus1|current']: '@{Active}-1',
});
useContracts(...embeddedSheets);
useRoomCharacters(nativeLiveCharacter);
const nativeLiveInspection = helper.inspectContracts(nativeLiveCharacter.id);
assert.strictEqual(nativeLiveInspection.status, 'matched',
  'Roll20이 수식 기본값을 빈값으로 돌려줘도 뒤쪽 원본 구분값까지 읽어야 합니다.');
assert.strictEqual(nativeLiveInspection.contract.id, nativeLimitSheet.id,
  '뒤쪽 기본값으로 확인한 현재 원본과 다른 시트를 선택하면 안 됩니다.');
const nativeLiveStatus = runApi('!!상태', nativeLiveCharacter.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
assert(!helper.scan(nativeLiveCharacter.id, true).contractRolls
  .some((item) => item.label === nativeLiveCharacter.get('name')),
  '이름이 비어 있는 굴림에 캐릭터 이름을 항목명으로 대신 표시하면 안 됩니다.');
const nativeCheckAt = nativeLiveStatus.indexOf('font-weight:bold">기능 / 판정 ');
const nativeOtherAt = nativeLiveStatus.indexOf('font-weight:bold">기타 주사위 ');
const nativeAccountingAt = nativeLiveStatus.indexOf('Accounting');
assert(nativeCheckAt >= 0 && nativeAccountingAt > nativeCheckAt &&
  (nativeOtherAt < 0 || nativeAccountingAt < nativeOtherAt),
  '1d100과 판정 기준값이 있는 원본 굴림은 기타 주사위가 아니라 기능 / 판정으로 보여야 합니다.');
const nativeResourceStatus = nativeLiveStatus.slice(nativeLiveStatus.indexOf('font-weight:bold">현재 수치 '));
assert(nativeResourceStatus.includes('Hit Points') && nativeResourceStatus.includes('Magic Points') &&
  nativeResourceStatus.includes('Sanity Points') &&
  !/(?:Dead|Unconscious|Insane)/.test(nativeResourceStatus),
  '수치 이름에는 상태 선택지 전체가 아니라 원본의 사람이 읽는 항목명을 보여야 합니다.');

const officialSixCharacter = addCharacter(
  'official-six-status-character', '공식 6판 분류 반례', 'player-1', {},
);
attributeObjects.push(roll20Object('official-six-dexterity', {
  _characterid: officialSixCharacter.id, characterid: officialSixCharacter.id,
  name: 'dex', current: '10', max: '',
}));
sheetFieldDefaults[officialSixCharacter.id] = sourceDefaults(officialSixSheet);
useContracts(...embeddedSheets);
useRoomCharacters(officialSixCharacter);
const officialSixStatus = runApi('!!상태', officialSixCharacter.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
const officialSixCharacteristicAt = officialSixStatus.indexOf('font-weight:bold">특성치 ');
const officialSixCheckAt = officialSixStatus.indexOf('font-weight:bold">기능 / 판정 ');
const officialSixStrengthAt = officialSixStatus.indexOf('힘');
const officialSixSpotAt = officialSixStatus.indexOf('관찰력');
assert(officialSixCharacteristicAt >= 0 && officialSixCheckAt > officialSixCharacteristicAt &&
  officialSixStrengthAt > officialSixCharacteristicAt && officialSixStrengthAt < officialSixCheckAt &&
  officialSixSpotAt > officialSixCheckAt,
  '원본의 characteristic/skill 구조로 특성치와 기능을 구분해야 합니다.');
assert(officialSixStatus.includes('백병전 <b>20') && !officialSixStatus.includes('백병전 <b>10'),
  '현황의 계산형 판정 기준값은 원본 시트 굴림과 같은 수식 결과를 보여야 합니다.');

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
  '이전 시트의 기본값과 없는 필드 빈값 때문에 공식 CoC 시트가 인식 불가가 되면 안 됩니다. ' +
    JSON.stringify((liveOfficialInspection.matches || []).slice(0, 8).map((item) => ({
      id: item.id, defaults: item.defaultMatchCount, support: item.supportCount,
      unique: item.uniqueEvidence, reason: liveOfficialInspection.recognitionReason,
    }))));
assert.strictEqual(liveOfficialInspection.contract.id, publicSheet.id,
  '이전 시트의 기본값과 없는 필드 빈값을 다른 시트의 양성 증거로 사용하면 안 됩니다.');

// 34개 배포 시트가 함께 등록된 실제 방에서는 Roll20이 화면에 저장한 일부 값만
// Attribute 객체로 만들 수 있습니다. 이때 현재 원본과 구조가 거의 같은 후보가
// 남아도 원본 기능을 잃거나 같은 명령을 후보 수만큼 보여주면 안 됩니다.
const publicAttributeNames = new Set(publicSheet.globalAttributes || []);
const publicRollLabels = new Set((publicSheet.rolls || []).map((roll) => roll.label).filter(Boolean));
const publicSourceFamily = embeddedSheets.filter((sheet) => sheet.id !== publicSheet.id).map((sheet) => {
  const sharedAttributes = (sheet.globalAttributes || []).filter((name) => publicAttributeNames.has(name)).length;
  const sharedLabels = new Set((sheet.rolls || []).map((roll) => roll.label).filter(Boolean));
  let sharedRollLabels = 0;
  sharedLabels.forEach((label) => { if (publicRollLabels.has(label)) sharedRollLabels += 1; });
  return {
    sheet,
    score: sharedAttributes / publicAttributeNames.size + sharedRollLabels / publicRollLabels.size,
  };
}).sort((left, right) => right.score - left.score).slice(0, 2).map((entry) => entry.sheet);
assert.strictEqual(publicSourceFamily.length, 2,
  '희소한 공식 시트 반례에 쓸 구조상 가까운 원본 후보를 찾지 못했습니다.');
const publicSourceCandidates = [publicSheet].concat(publicSourceFamily);
const publicSourceDefaultMaps = publicSourceCandidates.map((sheet) => sourceDefaults(sheet));
const sharedPublicDefaults = Object.fromEntries(Object.entries(publicSourceDefaultMaps[0]).filter(([name, value]) =>
  value !== '' && publicSourceDefaultMaps.slice(1).every((defaults) => defaults[name] === value)));
assert(Object.keys(sharedPublicDefaults).length >= 20,
  '실제 공식 시트 계열에서 희소 런타임 반례에 쓸 공통 기본값이 부족합니다.');
const sparsePublicValues = {};
(publicSheet.rolls || []).some((roll) => {
  String(roll.raw || '').replace(/@\{([^}|]+)(?:\|max)?\}/g, (match, name) => {
    if (Object.prototype.hasOwnProperty.call(sharedPublicDefaults, name) &&
      !Object.prototype.hasOwnProperty.call(sparsePublicValues, name))
      sparsePublicValues[name] = sharedPublicDefaults[name];
    return match;
  });
  return Object.keys(sparsePublicValues).length >= 8;
});
assert(Object.keys(sparsePublicValues).length >= 8,
  '원본 굴림에서 희소 런타임 값을 파생하지 못했습니다.');
const sparsePublicSourceCharacter = addCharacter(
  'sparse-public-source-character', '희소 공식 원본 기준', 'player-1', sparsePublicValues);
sheetFieldDefaults[sparsePublicSourceCharacter.id] = sourceDefaults(publicSheet);
useContracts(publicSheet);
useRoomCharacters(sparsePublicSourceCharacter);
const sparsePublicSourceRolls = helper.scan(sparsePublicSourceCharacter.id, true).contractRolls;
const sparsePublicTarget = sparsePublicSourceRolls.find((instance) => {
  const label = String(instance.label || '').trim();
  const raw = String(instance.roll && instance.roll.raw || '');
  const threshold = raw.match(/\{\{\s*success\s*=\s*\[\[@\{([^}|]+)/i);
  const field = threshold && (publicSheet.fields || []).find((candidate) =>
    !candidate.section && candidate.name === threshold[1]);
  return label && field && field.visibility && /1d100/i.test(raw) &&
    publicSourceFamily.every((sheet) => (sheet.rolls || []).some((roll) => roll.label === label));
});
assert(sparsePublicTarget,
  '실제 공식 원본에서 희소 런타임 회귀검사에 쓸 기능 판정을 찾지 못했습니다.');
const sparsePublicCharacter = addCharacter(
  'sparse-public-runtime-character', '희소 공식 시트 반례', 'player-1', sparsePublicValues);
sheetFieldDefaults[sparsePublicCharacter.id] = sharedPublicDefaults;
// This partial-data case models the legacy saved-attribute reader, not an
// authoritative sheet-default lookup declaring every omitted field absent.
const savedSheetDefaultReader = runtime.getSheetDefaultValue;
delete runtime.getSheetDefaultValue;
useContracts(...embeddedSheets);
useRoomCharacters(sparsePublicCharacter);
const sparsePublicInspection = helper.inspectContracts(sparsePublicCharacter.id);
assert.strictEqual(sparsePublicInspection.status, 'ambiguous',
  '구조가 같은 공식 시트 후보가 남는 희소 런타임 반례를 재현하지 못했습니다: ' +
    JSON.stringify((sparsePublicInspection.matches || []).slice(0, 8).map((item) => item.id)));
assert((sparsePublicInspection.matches || []).some((item) => item.id === publicSheet.id),
  '희소 런타임 후보에서 실제 공식 원본이 사라졌습니다.');
const sparsePublicRolls = helper.scan(sparsePublicCharacter.id, true).contractRolls;
const sparsePublicTargetRolls = sparsePublicRolls.filter((instance) =>
  instance.label === sparsePublicTarget.label);
assert(sparsePublicTargetRolls.length > 0,
  '희소한 공식 시트에서 원본 기능 판정을 누락하면 안 됩니다: ' +
    sparsePublicTarget.label + ' / ' + sparsePublicTargetRolls.length + ' / ' +
    JSON.stringify((sparsePublicInspection.matches || []).map((item) => item.id)));
const sparsePublicSentBefore = sent.length;
const sparsePublicAction = helper.resolveContractAction(
  sparsePublicCharacter, sparsePublicTarget.label, false);
assert(sparsePublicAction.handled && sparsePublicAction.result.ok,
  '희소한 공식 시트의 단일 원본 판정을 바로 실행하지 못했습니다: ' + sparsePublicTarget.label + ' / ' +
  JSON.stringify(sparsePublicAction.result));
assert.strictEqual(sent.length, sparsePublicSentBefore + 1,
  '희소한 공식 시트의 단일 판정 명령은 채팅 굴림을 정확히 한 번만 보내야 합니다.');
runtime.getSheetDefaultValue = savedSheetDefaultReader;

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

const staleBloodyValues = Object.fromEntries((bloodySheet.signature || []).map((entry) =>
  [typeof entry === 'string' ? entry : entry.name, '1']));
staleBloodyValues.rand_maddess = '2';
staleBloodyValues.san = '50';
staleBloodyValues.san_start = '50';
staleBloodyValues.str = '50';
staleBloodyValues.hp = '10';
staleBloodyValues.hp_max = '10';
staleBloodyValues.mp = '10';
staleBloodyValues.mp_max = '10';
const blue29AfterBloody = addCharacter(
  'blue29-after-bloody',
  'BLUE29 시트 교체 반례',
  'player-1',
  staleBloodyValues,
);
sheetFieldDefaults[blue29AfterBloody.id] = sourceDefaults(blue29Sheet);
useContracts(...embeddedSheets);
useRoomCharacters(blue29AfterBloody);
const blue29AfterBloodyInspection = helper.inspectContracts(blue29AfterBloody.id);
assert.strictEqual(blue29AfterBloodyInspection.status, 'matched');
assert.strictEqual(blue29AfterBloodyInspection.contract.id, blue29Sheet.id,
  '현재 원본에 없는 비어 있지 않은 기본 필드로 구조가 비슷한 다른 시트를 제외해야 합니다.');
assert.strictEqual(blue29AfterBloodyInspection.recognitionReason, 'source-defaults');
const blue29CommonScan = helper.scan(blue29AfterBloody.id, true);
['감정 (05%)', '관찰력 (25%)', '근접전(격투) (25%)'].forEach((label) => {
  assert(blue29CommonScan.contractRolls.some((item) => item.label === label),
    '현재 BLUE29 원본의 기본 기능을 빠뜨리면 안 됩니다: ' + label);
});
const blue29StatusResources = blue29CommonScan.resources
  .filter((item) => item.statusResource)
  .map((item) => item.name);
['hp', 'mp', 'san'].forEach((name) => {
  assert(blue29StatusResources.includes(name),
    '현재 수치에는 원본의 현재/최대 수치 묶음을 표시해야 합니다: ' + name +
      ' / actual=' + blue29StatusResources.join(','));
});
['str', 'appraise_mod', 'edit_mode'].forEach((name) => {
  assert(!blue29StatusResources.includes(name),
    '현재 수치에 특성치·기능치·편집 토글을 섞으면 안 됩니다: ' + name);
});
assert(blue29CommonScan.resources.some((item) => item.name === 'hp') &&
  blue29CommonScan.resources.some((item) => item.name === 'san'),
  '현재 시트 후보가 남아도 모두 같은 체력·이성 수치는 사용할 수 있어야 합니다.');
assert(blue29CommonScan.resources.some((item) => item.name === 'san_start'),
  '같은 시작 이성 입력칸의 표시 문구가 후보마다 달라도 실제 필드가 같으면 읽어야 합니다.');
assert(!blue29CommonScan.trackedFields.edit_mode,
  '여러 시트 영역의 표시만 바꾸는 편집용 토글을 상태 변화로 추적하면 안 됩니다.');
const blue29EditAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'edit_mode') ||
  addAttribute(blue29AfterBloody.id, 'edit_mode', '');
const blue29EditBefore = String(blue29EditAttribute.get('current'));
const blue29EditStart = sent.length;
blue29EditAttribute.set('current', blue29EditBefore === '1' ? '' : '1');
events['change:attribute'](blue29EditAttribute, { current: blue29EditBefore });
assert(!sent.slice(blue29EditStart).some((item) => /EDIT|edit_mode/.test(String(item.content || ''))),
  '편집용 토글을 켜고 꺼도 수치 변화 알림을 보내면 안 됩니다.');
const blue29EditScan = helper.scan(blue29AfterBloody.id, true);
['감정 (05%)', '관찰력 (25%)', '근접전(격투) (25%)'].forEach((label) => {
  assert(blue29EditScan.contractRolls.some((item) => item.label === label),
    '편집 화면에서도 원본 기본 기능을 명령 굴림에서 빠뜨리면 안 됩니다: ' + label);
});
blue29EditAttribute.set('current', blue29EditBefore);
events['change:attribute'](blue29EditAttribute, { current: blue29EditBefore === '1' ? '' : '1' });
assert.strictEqual(blue29CommonScan.resources.find((item) => item.name === 'hp').max, 10,
  '공통 최대 체력 항목은 호환 후보 병합 뒤에도 현재 체력과 다시 연결해야 합니다.');
const blue29HpAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'hp');
const blue29SanAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'san');
runGeneral(':hp-3', blue29AfterBloody.get('name'));
assert.strictEqual(blue29HpAttribute.get('current'), '7', '공통 hp 수치 감소가 실제 Attribute에 적용되어야 합니다.');
runGeneral(':체력+3', blue29AfterBloody.get('name'));
assert.strictEqual(blue29HpAttribute.get('current'), '10', '공통 체력 별칭도 같은 Attribute를 변경해야 합니다.');
const blue29Major = Object.values(blue29CommonScan.trackedFields).find((item) =>
  (item.sourceLabels || []).some((label) => String(label).replace(/[\s_.:()"'-]+/g, '') === '중상'));
assert(blue29Major, '공통 중상 체크 항목도 추적해야 합니다.');
const blue29MajorMessages = runGeneral(':hp-5', blue29AfterBloody.get('name'));
const blue29MajorAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === blue29Major.name);
assert(blue29MajorAttribute && String(blue29MajorAttribute.get('current')) === String(blue29Major.onValue || '1'),
  '공통 최대 체력의 절반 이상 피해는 원본 중상 항목을 활성화해야 합니다.');
assert(blue29MajorMessages.some((item) => {
  const content = String(item.content || '');
  return content.includes('10 / 10 (100%)') && content.includes('5 / 10 (50%)') &&
    content.includes('중상 활성화') && !content.includes('자동 처리 생략');
}), '공통 체력 알림은 전후 퍼센트와 중상 자동 처리를 함께 보여야 합니다.');
runGeneral(':hp+5', blue29AfterBloody.get('name'));
runGeneral(':이성-3', blue29AfterBloody.get('name'));
assert.strictEqual(blue29SanAttribute.get('current'), '47', '공통 이성 수치 감소가 실제 Attribute에 적용되어야 합니다.');
runGeneral(':이성+3', blue29AfterBloody.get('name'));
assert.strictEqual(blue29SanAttribute.get('current'), '50');
const blue29LongAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'indef_insane');
const blue29TemporaryAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'temp_insane');
blue29LongAttribute.set('current', '0');
blue29TemporaryAttribute.set('current', '0');
helper.scan(blue29AfterBloody.id, true);
const blue29SanLossMessages = runGeneral(':이성-5', blue29AfterBloody.get('name'));
assert.strictEqual(blue29SanLossMessages.filter((item) =>
  String(item.content || '').includes('kib_sheet_result=') && String(item.content || '').includes('지능')).length, 1,
  '공통 이성이 한 번에 5 감소하면 공통 지능 판정을 정확히 한 번 실행해야 합니다.');
const blue29IntelligenceToken = blue29SanLossMessages.find((item) =>
  String(item.content || '').includes('kib_sheet_result=') && String(item.content || '').includes('지능'))
  .content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
setPlayerSpeakingAs(blue29AfterBloody.get('name'), 'player-1');
events['chat:message']({
  type: 'general',
  content: '&{template:coc} {{subject=지능}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
    '{{extreme=$[[2]]}} {{roll=$[[3]]}} {{kib_sheet_result=' + blue29IntelligenceToken + '}}',
  inlinerolls: [100, 50, 20, 7].map((value) => ({ results: { total: value } })),
  who: blue29AfterBloody.get('name'),
  playerid: 'player-1',
});
assert.strictEqual(attributeObjects.find((item) =>
  item.get('_characterid') === blue29AfterBloody.id && item.get('name') === 'temp_insane').get('current'), '1',
  '지능 판정 성공 시 일시라고 표시된 원본 체크박스를 활성화해야 합니다.');
runGeneral(':이성+5', blue29AfterBloody.get('name'));
blue29SanAttribute.set('current', '50');
blue29LongAttribute.set('current', '0');
blue29TemporaryAttribute.set('current', '0');
helper.scan(blue29AfterBloody.id, true);
const blue29LongMessages = runGeneral(':이성-10', blue29AfterBloody.get('name'));
assert.strictEqual(blue29LongAttribute.get('current'), '1',
  '시작 이성의 5분의 1 손실은 장기라고 표시된 원본 체크박스를 먼저 활성화해야 합니다.');
assert.strictEqual(intelligenceRolls(blue29LongMessages).length, 0,
  '장기적 광기 기준에 도달한 손실은 일시적 광기용 지능 판정을 실행하면 안 됩니다.');
blue29SanAttribute.set('current', '50');
blue29LongAttribute.set('current', '0');
helper.scan(blue29AfterBloody.id, true);
const blue29DirectStart = sent.length;
blue29HpAttribute.set('current', '8');
events['change:attribute'](blue29HpAttribute, { current: '10' });
assert(sent.slice(blue29DirectStart).some((item) => String(item.content || '').includes('2 감소')),
  '공통 체력 Attribute를 시트에서 직접 바꿔도 기존 변화 알림을 유지해야 합니다.');
assert(sent.slice(blue29DirectStart).some((item) => {
  const content = String(item.content || '');
  return content.includes('10 / 10 (100%)') && content.includes('8 / 10 (80%)');
}), '시트에서 체력을 직접 바꿔도 전후 퍼센트를 보여야 합니다.');
blue29HpAttribute.set('current', '10');
events['change:attribute'](blue29HpAttribute, { current: '8' });
const blue29StatusMessages = runApi('!!상태', blue29AfterBloody.get('name'));
assert(!blue29StatusMessages.some((item) => String(item.content || '').includes('현재 인식된 시트가 없습니다')),
  '안전하게 공통 항목을 읽은 시트를 미인식으로 표시하면 안 됩니다.');
assert(blue29StatusMessages.some((item) => String(item.content || '').includes('50 / 시작 50 (100%)')),
  '나중에 저장된 시작 이성을 현재 이성과 함께 최신값으로 보여줘야 합니다.');
const blue29DuplicateStart = sent.length;
const blue29Strength = helper.resolveContractAction(blue29AfterBloody, '근력', false);
assert(blue29Strength.handled && blue29Strength.result.ok &&
  blue29Strength.result.payload.key === 'roll-e583f27c1e91',
  '원본 식과 결과 규칙이 같은 후보를 선택지로 중복 표시하면 안 됩니다.');
const blue29Sanity = helper.resolveContractAction(blue29AfterBloody, '이성', false);
assert(blue29Sanity.handled && blue29Sanity.result.ok &&
  blue29Sanity.result.payload.key === 'roll-5d027c038e4c',
  '동일한 이성 굴림 후보는 하나로 합쳐 바로 실행해야 합니다.');
assert.strictEqual(sent.length, blue29DuplicateStart + 2,
  '근력과 이성 굴림은 각각 한 번만 전송해야 합니다.');
const blue29Long = helper.resolveContractAction(blue29AfterBloody, '장기', false);
assert(blue29Long.handled && blue29Long.result.ok &&
  blue29Long.result.payload.contractId === blue29Sheet.id &&
  /madness_type=\[\[2\]\]/i.test(sent.at(-1).content) &&
  /rand_roll3=\[\[1d6\]\]/i.test(sent.at(-1).content),
  'BLUE29의 장기 광기는 현재 시트 원본 굴림을 실행해야 합니다.');
const blue29Short = helper.resolveContractAction(blue29AfterBloody, '일시', false);
assert(blue29Short.handled && blue29Short.result.ok &&
  blue29Short.result.payload.contractId === blue29Sheet.id &&
  /madness_type=\[\[1\]\]/i.test(sent.at(-1).content) &&
  /rand_roll=\[\[1d10\]\]/i.test(sent.at(-1).content),
  'BLUE29의 일시 광기도 현재 시트 원본 굴림을 실행해야 합니다.');
assert(runApi('!!장기', blue29AfterBloody.get('name')).some((item) =>
  /madness_type=\[\[2\]\]/i.test(String(item.content || '')) &&
  /rand_roll3=\[\[1d6\]\]/i.test(String(item.content || ''))),
'!!장기는 현재 시트에 있는 장기 광기 원본 굴림을 실행해야 합니다.');
assert(runApi('!!일시', blue29AfterBloody.get('name')).some((item) =>
  /madness_type=\[\[1\]\]/i.test(String(item.content || '')) &&
  /rand_roll=\[\[1d10\]\]/i.test(String(item.content || ''))),
'!!일시는 현재 시트에 있는 일시 광기 원본 굴림을 실행해야 합니다.');
['실시간', '요약'].forEach((name) => {
  const messages = runApi('!!' + name, blue29AfterBloody.get('name'));
  assert(!messages.some((item) => String(item.content || '').includes('kib_sheet_result=')) &&
    messages.some((item) => /찾지 못했습니다/.test(String(item.content || ''))),
  '일시/장기만 있는 시트에 ' + name + ' 굴림을 임의로 만들어내면 안 됩니다.');
});

const blue29FieldNames = new Set((blue29Sheet.fields || []).map((field) => field.name));
const blue29AttributeNames = new Set(blue29Sheet.attributes || []);
const blue29Family = embeddedSheets.filter((sheet) => sheet.id !== blue29Sheet.id &&
  Array.from(blue29AttributeNames).every((name) => (sheet.attributes || []).includes(name)));
const staleSiblingDefaults = {};
blue29Family.forEach((sheet) => {
  (sheet.fields || []).forEach((field) => {
    if (!blue29FieldNames.has(field.name) && !field.section && String(field.default || '').trim())
      staleSiblingDefaults[field.name] = String(field.default);
  });
});
assert(Object.keys(staleSiblingDefaults).length >= 2,
  '구조가 비슷한 상위 시트의 과거 기본 필드 반례가 필요합니다.');
const blue29WithStaleSibling = addCharacter(
  'blue29-with-stale-sibling',
  'BLUE29 과거 형제 시트 반례',
  'player-1',
  staleSiblingDefaults,
);
sheetFieldDefaults[blue29WithStaleSibling.id] = sourceDefaults(blue29Sheet);
useRoomCharacters(blue29WithStaleSibling);
const blue29WithStaleSiblingInspection = helper.inspectContracts(blue29WithStaleSibling.id);
assert.strictEqual(blue29WithStaleSiblingInspection.status, 'ambiguous',
  '과거 시트의 저장 필드만으로 현재 시트를 다른 형제 시트로 확정하면 안 됩니다.');
assert.strictEqual(blue29WithStaleSiblingInspection.recognitionReason, 'source-defaults-ambiguous');

// Roll20이 새 캐릭터의 기본 입력들을 Attribute로 먼저 저장하면 기본값 probe는
// 그 이름들을 건너뜁니다. 이 경우에도 실제로 저장된 전체 구조로 현재 원본을
// 하나로 좁혀야 하며, 비슷한 원본들의 공통 굴림을 중복 표시하면 안 됩니다.
const blue29SavedDefaults = {};
(blue29Sheet.globalAttributes || []).forEach((name) => {
  const field = (blue29Sheet.fields || []).find((candidate) => candidate.name === name);
  blue29SavedDefaults[name] = field && Object.prototype.hasOwnProperty.call(field, 'default')
    ? String(field.default == null ? '' : field.default)
    : '';
});
const blue29SavedCharacter = addCharacter(
  'blue29-saved-defaults',
  '저장된 기본값 구조 반례',
  'player-1',
  blue29SavedDefaults,
);
sheetFieldDefaults[blue29SavedCharacter.id] = sourceDefaults(blue29Sheet);
useContracts(...embeddedSheets);
useRoomCharacters(blue29SavedCharacter);
const blue29SavedInspection = helper.inspectContracts(blue29SavedCharacter.id);
assert.strictEqual(blue29SavedInspection.status, 'matched',
  '저장된 현재 시트 구조를 비교하기 전에 여러 기본값 후보를 그대로 사용하면 안 됩니다. ' +
    JSON.stringify({ reason: blue29SavedInspection.recognitionReason,
      matches: (blue29SavedInspection.matches || []).slice(0, 8).map((item) => ({
        id: item.id, score: item.score, ratio: item.ratio, support: item.supportCount,
        unique: item.uniqueEvidence, compatible: item.compatibilityOwnerCount,
        rank: item.rankScore, eligible: item.eligible,
      })) }));
assert.strictEqual(blue29SavedInspection.contract.id, blue29Sheet.id,
  '저장된 현재 시트 구조가 가리키는 원본을 선택하지 못했습니다.');
const blue29SavedRolls = helper.scan(blue29SavedCharacter.id, true).contractRolls;
['근력', '이성.', '감정 (05%)', '관찰력 (25%)', '회피 (민첩성/2)'].forEach((label) => {
  assert.strictEqual(blue29SavedRolls.filter((item) => item.label === label).length, 1,
    '현재 원본의 한국어 굴림은 한 번만 인식해야 합니다: ' + label + ' / ' +
      JSON.stringify(blue29SavedRolls.map((item) => item.label)));
});

const blue29BlankDefaults = sourceDefaults(blue29Sheet);
Object.keys(blue29BlankDefaults).filter((name) =>
  String(blue29BlankDefaults[name]).trim() && name !== 'bonus_dice' && name !== 'penalty_dice',
).slice(0, 12).forEach((name) => { blue29BlankDefaults[name] = ''; });
const blue29WithBlankDefaults = addCharacter(
  'blue29-with-blank-defaults',
  'BLUE29 미저장 기본값 반례',
  'player-1',
  staleBloodyValues,
);
sheetFieldDefaults[blue29WithBlankDefaults.id] = blue29BlankDefaults;
useRoomCharacters(blue29WithBlankDefaults);
const blue29BlankInspection = helper.inspectContracts(blue29WithBlankDefaults.id);
assert.strictEqual(blue29BlankInspection.status, 'matched');
assert.strictEqual(blue29BlankInspection.contract.id, blue29Sheet.id,
  '현재 시트의 미저장 기본 필드를 빈값만으로 반대 증거로 사용하면 안 됩니다.');
const blue29BlankLong = helper.resolveContractAction(blue29WithBlankDefaults, '장기', false);
assert(blue29BlankLong.handled && blue29BlankLong.result.ok &&
  blue29BlankLong.result.payload.contractId === blue29Sheet.id,
  '현재 시트가 완전히 확정되지 않아도 유일한 원본 굴림은 안전하게 실행해야 합니다.');

const achtungCharacter = addCharacter('achtung-availability', 'Achtung 기능 표시 반례', 'player-1', {
  'edit-mode': '1',
  'sk-appraise-avl': '0',
});
sheetFieldDefaults[achtungCharacter.id] = sourceDefaults(achtungSheet);
useRoomCharacters(achtungCharacter);
assert.strictEqual(helper.inspectContracts(achtungCharacter.id).contract.id, achtungSheet.id);
const achtungStatusResources = helper.scan(achtungCharacter.id, true).resources
  .filter((item) => item.statusResource)
  .map((item) => item.name);
['char-age', 'char-move', 'sk-credit-min', 'sk-credit-max', 'sk-credit-rating'].forEach((name) => {
  assert(!achtungStatusResources.includes(name),
    'HTML 입력 제한 max를 현재/최대 자원 묶음으로 오인하면 안 됩니다: ' + name);
});
const achtungEditMode = attributeObjects.find((item) =>
  item.get('_characterid') === achtungCharacter.id && item.get('name') === 'edit-mode');
achtungEditMode.set('current', '0');
events['change:attribute'](achtungEditMode, { current: '1' });
assert(!helper.scan(achtungCharacter.id, true).contractRolls.some((item) => item.label === 'Appraise'),
  '원본에서 사용하지 않도록 끈 기능을 편집 화면 토글로 오인해 굴림 목록에 남기면 안 됩니다.');
const achtungAvailability = attributeObjects.find((item) =>
  item.get('_characterid') === achtungCharacter.id && item.get('name') === 'sk-appraise-avl');
achtungAvailability.set('current', '1');
events['change:attribute'](achtungAvailability, { current: '0' });
assert(helper.scan(achtungCharacter.id, true).contractRolls.some((item) => item.label === 'Appraise'),
  '원본에서 켠 기능은 굴림 목록에 다시 보여야 합니다.');

const survivorRollA = parseSheetContract([
  '<input name="attr_source_probe_one" value="current">',
  '<input name="attr_source_probe_two" value="current">',
  '<input name="attr_shared_target" value="50">',
  '<button type="roll" name="roll_shared_check" value="&{template:fixture} {{subject=겹친 판정}} {{success=[[@{shared_target}]]}} {{roll=[[1d100]]}}">겹친 판정</button>',
  '<button type="roll" name="roll_label_conflict" value="&{template:fixture} {{subject=동일식}} {{roll=[[1d100]]}}">첫 이름</button>',
  '<button type="roll" name="roll_shared_check_bonus" value="&{template:fixture} {{subject=겹친 판정}} {{success=[[@{shared_target}]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}}">겹친 판정</button>',
].join('\n'), { id: 'source-survivor-roll-a', sourceHash: 'source-survivor-roll-a-v1' });
const survivorRollB = parseSheetContract([
  '<input name="attr_source_probe_one" value="current">',
  '<input name="attr_source_probe_two" value="current">',
  '<input name="attr_shared_target" value="50">',
  '<input type="number" name="attr_stale_only_one">',
  '<input type="number" name="attr_stale_only_two">',
  '<button type="roll" name="roll_shared_check" value="&{template:fixture} {{subject=겹친 판정}} {{success=[[@{shared_target}]]}} {{roll=[[1d100]]}}">겹친 판정</button>',
  '<button type="roll" name="roll_label_conflict" value="&{template:fixture} {{subject=동일식}} {{roll=[[1d100]]}}">둘째 이름</button>',
  '<button type="roll" name="roll_shared_check_bonus" value="&{template:fixture} {{subject=겹친 판정}} {{success=[[@{shared_target}]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}">겹친 판정</button>',
].join('\n'), { id: 'source-survivor-roll-b', sourceHash: 'source-survivor-roll-b-v1' });
const removedSourceCandidate = parseSheetContract([
  '<input name="attr_source_probe_one" value="other">',
  '<input name="attr_source_probe_two" value="other">',
  '<button type="roll" name="roll_other_check" value="&{template:fixture} {{subject=다른 판정}} {{roll=[[1d100]]}}">다른 판정</button>',
].join('\n'), { id: 'removed-source-candidate', sourceHash: 'removed-source-candidate-v1' });

const narrowedWithStaleAttributes = addCharacter(
  'narrowed-with-stale-attributes',
  '좁힌 후보의 과거 저장값 반례',
  'player-1',
  { stale_only_one: '1', stale_only_two: '1' },
);
sheetFieldDefaults[narrowedWithStaleAttributes.id] = sourceDefaults(survivorRollA);
useContracts(survivorRollA, survivorRollB, removedSourceCandidate);
useRoomCharacters(narrowedWithStaleAttributes);
const narrowedWithStaleInspection = helper.inspectContracts(narrowedWithStaleAttributes.id);
assert.strictEqual(narrowedWithStaleInspection.status, 'ambiguous');
assert.strictEqual(narrowedWithStaleInspection.recognitionReason, 'source-defaults-ambiguous');
assert.deepStrictEqual(
  Array.from(narrowedWithStaleInspection.matches, (item) => item.id).sort(),
  [survivorRollA.id, survivorRollB.id].sort(),
  '현재 기본값으로 좁힌 후보를 과거 저장값만으로 다시 하나로 확정하면 안 됩니다.',
);
const distinctNamedRolls = helper.scan(narrowedWithStaleAttributes.id, true).contractRolls.filter((instance) =>
  instance.label === '첫 이름' || instance.label === '둘째 이름');
assert.deepStrictEqual(Array.from(distinctNamedRolls, (instance) => instance.label).sort(), ['둘째 이름', '첫 이름'],
  '실행 식이 같아도 원본 표시명이 다른 굴림은 서로 다른 항목으로 보존해야 합니다.');
const staleOnlyAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === narrowedWithStaleAttributes.id && item.get('name') === 'stale_only_one');
const staleOnlyMessages = runGeneral(':stale_only_one+1', narrowedWithStaleAttributes.get('name'));
assert.strictEqual(staleOnlyAttribute.get('current'), '1',
  '한 후보에만 있는 과거 수치를 현재 시트의 수치로 바꾸면 안 됩니다.');
assert(staleOnlyMessages.some((item) => String(item.content || '').includes('수치를 찾지 못했습니다')),
  '후보 전원이 공유하지 않는 수치는 찾지 못했다고 안내해야 합니다.');

// 알파벳상 먼저 조사되는 과거 기본값 두 개만 맞아도 즉시 확정하던 회귀입니다.
// 현재 시트의 뒤쪽 구분값까지 끝까지 읽어 실제 후보를 골라야 합니다.
const currentDefaultSheet = parseSheetContract([
  '<input name="attr_z_current_one" value="current">',
  '<input name="attr_z_current_two" value="current">',
  '<input name="attr_z_current_three" value="current">',
  '<input name="attr_z_current_four" value="current">',
  '<button type="roll" name="roll_current_appraise" value="&{template:fixture} {{subject=감정}} {{roll=[[1d100]]}}">감정</button>',
].join('\n'), { id: 'current-default-sheet', sourceHash: 'current-default-sheet-v1' });
const staleDefaultSheet = parseSheetContract([
  '<input name="attr_a_stale_one" value="stale">',
  '<input name="attr_a_stale_two" value="stale">',
  '<button type="roll" name="roll_stale_luck" value="&{template:fixture} {{subject=행운}} {{roll=[[1d100]]}}">행운</button>',
].join('\n'), { id: 'stale-default-sheet', sourceHash: 'stale-default-sheet-v1' });
const lateDefaultCharacter = addCharacter(
  'late-default-character',
  '기본값 끝까지 비교 반례',
  'player-1',
  {},
);
sheetFieldDefaults[lateDefaultCharacter.id] = sourceDefaults(currentDefaultSheet);
getAttrByNameOverrides[lateDefaultCharacter.id + '|a_stale_one|current'] = 'stale';
getAttrByNameOverrides[lateDefaultCharacter.id + '|a_stale_two|current'] = 'stale';
useContracts(currentDefaultSheet, staleDefaultSheet);
useRoomCharacters(lateDefaultCharacter);
const lateDefaultInspection = helper.inspectContracts(lateDefaultCharacter.id);
assert.strictEqual(lateDefaultInspection.status, 'matched');
assert.strictEqual(lateDefaultInspection.contract.id, currentDefaultSheet.id,
  '과거 기본값 두 개에서 조기 종료하지 말고 현재 시트의 모든 구분값을 비교해야 합니다.');
assert(helper.scan(lateDefaultCharacter.id, true).contractRolls.some((item) => item.label === '감정'),
  '현재 시트를 확정한 뒤 해당 시트의 전체 기능 굴림을 복구해야 합니다.');

// 새 캐릭터가 추가된 직후에도 이전 방 판별 캐시를 계속 쓰면 새 As 캐릭터가
// 현재 시트의 굴림을 사용할 수 없습니다.
const cachedSourceCharacter = addCharacter(
  'cached-source-character', '캐시 이전 시트', 'player-1', {},
);
sheetFieldDefaults[cachedSourceCharacter.id] = sourceDefaults(currentDefaultSheet);
useContracts(currentDefaultSheet, staleDefaultSheet);
useRoomCharacters(cachedSourceCharacter);
assert.strictEqual(helper.inspectContracts(cachedSourceCharacter.id).contract.id, currentDefaultSheet.id);
sheetFieldDefaults[cachedSourceCharacter.id] = sourceDefaults(staleDefaultSheet);
const addedAfterSourceChange = addCharacter(
  'added-after-source-change', '가 새 캐릭터', 'player-1', {},
);
sheetFieldDefaults[addedAfterSourceChange.id] = sourceDefaults(staleDefaultSheet);
roomCharacterIds.add(addedAfterSourceChange.id);
events['add:character'](addedAfterSourceChange);
assert.strictEqual(helper.inspectContracts(addedAfterSourceChange.id).contract.id, staleDefaultSheet.id,
  '새 캐릭터가 추가되면 방의 이전 시트 판별 캐시를 비워야 합니다.');

useContracts(survivorRollA, survivorRollB, removedSourceCandidate);
const ambiguousMultipleRollCharacter = addCharacter(
  'ambiguous-multiple-roll-character',
  '여러 후보 보너스 굴림 반례',
  'player-1',
  {},
);
sheetFieldDefaults[ambiguousMultipleRollCharacter.id] = sourceDefaults(survivorRollA);
useRoomCharacters(ambiguousMultipleRollCharacter);
const ambiguousMultipleRoll = helper.resolveContractAction(
  ambiguousMultipleRollCharacter,
  '겹친 판정 보너스1',
  false,
);
assert(ambiguousMultipleRoll.handled && !ambiguousMultipleRoll.result.ok &&
  ambiguousMultipleRoll.result.reason === 'conflict');
assert.deepStrictEqual(
  Array.from(ambiguousMultipleRoll.result.choices, (choice) => choice.contractId).sort(),
  [survivorRollA.id, survivorRollB.id].sort(),
  '후보 시트별 보너스 굴림을 비교한 뒤 inline roll이 많은 한 시트를 임의 실행하면 안 됩니다.',
);

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
// These saved-field-only cases exercise the legacy path without a sheet-default API.
delete runtime.getSheetDefaultValue;
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
runtime.getSheetDefaultValue = savedSheetDefaultReader;
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
  '인식한 시트를 점검하면서 다른 시트에만 있는 필드를 probe하면 안 됩니다. ' +
    JSON.stringify(fallbackCalls.slice(0, 30)));

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
sheetFieldDefaults[publicResourceCharacter.id] = sourceDefaults(publicSheet);
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

// 미저장 체크박스가 들어간 원본 최대값, 한국어 자원 굴림, 무기 상태 표시를 함께 검증합니다.
const newsSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-5cab2ac801cda404');
assert(newsSheet, '크툴루 뉴스 테마 시트 인식 정보가 필요합니다.');
const newsDexField = newsSheet.fields.find((field) => field.name === 'dex');
assert(newsDexField && newsDexField.default === '50' &&
  JSON.stringify(newsDexField.defaultVariants) === JSON.stringify(['50', '-5']),
  '뉴스 테마의 보이는 민첩 기본값과 숨은 중복값을 원본 순서와 무관하게 구분해야 합니다.');
const newsValues = {};
newsSheet.signature.forEach((entry) => {
  const name = typeof entry === 'string' ? entry : entry.name;
  if (name !== 'damage_bonus' && name !== 'pulp_hp') newsValues[name] = '1';
});
Object.assign(newsValues, {
  hp: '5', mp: '6', con: '50', siz: '50', pow: '50',
  san: '50', san_start: '50', cthulhu_mythos: '0', fighting_brawl: '25', damage_bonus: '1d6',
  temp_insane: '0', indef_insane: '0',
});
delete newsValues.dex;
const newsAttributeStart = attributeObjects.length;
const newsCharacter = addCharacter('news-theme-character', '뉴스 테마 탐사자', 'player-1', newsValues);
sheetFieldDefaults[newsCharacter.id] = sourceDefaults(newsSheet);
getAttrByNameOverrides[newsCharacter.id + '|dex|current'] = '-5';
useContracts(newsSheet);
useRoomCharacters(newsCharacter);
const newsData = helper.scan(newsCharacter.id, true);
const newsHealth = newsData.resourcesByAttribute.hp;
const newsMagic = newsData.resourcesByAttribute.mp;
assert(newsHealth && newsHealth.value === 5 && newsHealth.max === 10,
  '미저장 펄프 체크박스는 0으로 계산해 체력 현재·최대값을 읽어야 합니다.');
assert(newsMagic && newsMagic.value === 6 && newsMagic.max === 10,
  '원본 마력 공식에서 현재·최대값을 읽어야 합니다.');
const newsStatus = runApi('!!상태', newsCharacter.get('name'));
const newsStatusHtml = newsStatus.map((item) => item.content || '').join('\n');
const newsCharacteristicsHtml = newsStatusHtml.slice(
  newsStatusHtml.indexOf('특성치 8개'), newsStatusHtml.indexOf('기능 / 판정'));
const newsChecksHtml = newsStatusHtml.slice(
  newsStatusHtml.indexOf('기능 / 판정'), newsStatusHtml.indexOf('무기 1개'));
assert(newsCharacteristicsHtml.includes('민첩 <b>50') && newsCharacteristicsHtml.includes('정신 <b>50') &&
  !newsCharacteristicsHtml.includes('민첩 <b>-5') && newsChecksHtml.includes('정신분석 <b>1') &&
  !newsChecksHtml.includes('>정신 <b>50'),
  '원본 화면의 특성치 이름과 표시 기본값을 숨은 중복 기본값보다 우선해야 합니다.');
assert(newsStatus.some((item) => item.content && item.content.includes('체력 <b>5 / 10 (50%)') &&
  item.content.includes('마력 <b>6 / 10 (60%)') && item.content.includes('이성 <b>50') &&
  !item.content.includes('광기 <b>50') && !item.content.includes('체력 <b>6')),
  '뉴스 테마 상태에 이성·체력·마력의 원본 이름과 현재·최대값을 함께 보여야 합니다.');
assert(newsStatus.some((item) => item.content && item.content.includes('비무장') &&
  item.content.includes('피해 1d3+1d6') && item.content.includes('+1d6') && !item.content.includes('+1d4') &&
  !item.content.includes('+10d6') && !item.content.includes('+9d6')),
  '무기 상태에는 원본 피해식과 현재 피해보너스만 보여야 하며 선택지 전체를 나열하면 안 됩니다.');
assert(!newsStatusHtml.includes('SAN Roll'),
  '글자 없는 원본 이성 버튼은 매크로 내부 영문명이 아니라 화면의 이성 그룹명으로 보여야 합니다.');
const newsDexterityRoll = runApi('!!민첩', newsCharacter.get('name'));
assert.strictEqual(newsDexterityRoll.filter((item) => item.content &&
  item.content.includes('{{success=[[50]]}}') && !item.content.includes('-5')).length, 1,
  '저장값이 없는 보이는 특성치는 숨은 중복값 대신 원본 화면 기본값으로 굴려야 합니다.');
getAttrByNameOverrides[newsCharacter.id + '|dex|current'] = '75';
helper.scan(newsCharacter.id, true);
assert(runApi('!!상태', newsCharacter.get('name')).some((item) =>
  item.content && item.content.includes('민첩 <b>75')),
  '저장 객체가 없어도 실제 시트 워커가 계산한 값은 원본 기본값보다 우선해야 합니다.');
assert.strictEqual(runApi('!!민첩', newsCharacter.get('name')).filter((item) => item.content &&
  item.content.includes('{{success=[[75]]}}')).length, 1,
  '저장 객체가 없는 실제 시트 워커 값으로 굴려야 합니다.');
getAttrByNameOverrides[newsCharacter.id + '|dex|current'] = '-5';
helper.scan(newsCharacter.id, true);
const newsSavedDexterity = roll20Object('news-theme-dexterity', {
  _characterid: newsCharacter.id, characterid: newsCharacter.id,
  name: 'dex', current: '65', max: '',
});
attributeObjects.push(newsSavedDexterity);
helper.scan(newsCharacter.id, true);
assert(runApi('!!상태', newsCharacter.get('name')).some((item) =>
  item.content && item.content.includes('민첩 <b>65')),
  '사용자가 저장한 특성치는 현황에도 바로 반영해야 합니다.');
assert.strictEqual(runApi('!!민첩', newsCharacter.get('name')).filter((item) => item.content &&
  item.content.includes('{{success=[[65]]}}') && !item.content.includes('-5')).length, 1,
  '사용자가 저장한 특성치는 숨은 기본값보다 우선해야 합니다.');
newsSavedDexterity.set('current', '0');
helper.scan(newsCharacter.id, true);
assert(runApi('!!상태', newsCharacter.get('name')).some((item) =>
  item.content && item.content.includes('민첩 <b>0')),
  '사용자가 저장한 0도 현황에 그대로 보여야 합니다.');
assert.strictEqual(runApi('!!민첩', newsCharacter.get('name')).filter((item) => item.content &&
  item.content.includes('{{success=[[0]]}}') && !item.content.includes('-5')).length, 1,
  '사용자가 저장한 0도 빈 값으로 취급하지 않아야 합니다.');
const newsSanityAction = helper.resolveContractAction(newsCharacter, '이성', false);
const newsSanityAliasAction = helper.resolveContractAction(newsCharacter, 'SAN Roll', false);
assert(newsSanityAction.result.ok && newsSanityAliasAction.result.ok &&
  newsSanityAction.result.payload.cutinKey === newsSanityAliasAction.result.payload.cutinKey &&
  helper.cutinItems().some((item) => item.key === newsSanityAction.result.payload.cutinKey &&
    item.label === '이성' && item.aliases.includes('SAN Roll')),
  '한국어 표시명과 원본 별칭은 같은 기존 컷인 연결 키를 사용해야 합니다.');
const newsSanityRoll = runApi('!!이성', newsCharacter.get('name'));
assert.strictEqual(newsSanityRoll.filter((item) => item.content &&
  item.content.includes('{{name=SAN Roll}}') && item.content.includes('kib_sheet_result=')).length, 1,
  '원본 SAN Roll을 한국어 !!이성 명령으로 한 번 실행해야 합니다.');
assert.strictEqual(runApi('!!SAN Roll', newsCharacter.get('name')).filter((item) => item.content &&
  item.content.includes('{{name=SAN Roll}}') && item.content.includes('kib_sheet_result=')).length, 1,
  '기존 원본 매크로 이름 별칭도 계속 한 번 실행해야 합니다.');
const newsAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === newsCharacter.id && item.get('name') === name);
function changeNewsValue(name, next) {
  const attribute = newsAttribute(name);
  const before = attribute.get('current');
  const start = sent.length;
  attribute.set('current', String(next));
  events['change:attribute'](attribute, { current: before });
  return sent.slice(start);
}
const newsLongMessages = changeNewsValue('san', 40);
assert.strictEqual(newsAttribute('indef_insane').get('current'), 'on',
  '짧은 화면 표시와 원본 별칭을 함께 읽어 시작 이성의 5분의 1 손실에서 장기적 광기를 활성화해야 합니다.');
assert.strictEqual(intelligenceRolls(newsLongMessages).length, 0,
  '장기적 광기가 우선되는 손실에서는 일시적 광기용 지능 판정을 실행하면 안 됩니다.');
newsAttribute('san').set('current', '50');
newsAttribute('indef_insane').set('current', '0');
newsAttribute('temp_insane').set('current', '0');
helper.scan(newsCharacter.id, true);
const newsTemporaryMessages = changeNewsValue('san', 45);
const newsIntelligenceRolls = newsTemporaryMessages.filter((item) => item.content &&
  item.content.includes('{{name=지능}}') && item.content.includes('kib_sheet_result='));
assert.strictEqual(newsIntelligenceRolls.length, 1,
  '장기 기준 미만인 5 이성 손실은 원본 지능 판정을 한 번 실행해야 합니다.');
const newsIntelligenceToken = newsIntelligenceRolls[0].content
  .match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
setPlayerSpeakingAs(newsCharacter.get('name'), 'player-1');
events['chat:message']({
  type: 'general',
  content: '&{template:coc-1} {{name=지능}} {{success=$[[0]]}} {{hard=$[[1]]}} ' +
    '{{extreme=$[[2]]}} {{roll1=$[[3]]}} {{kib_sheet_result=' + newsIntelligenceToken + '}}',
  inlinerolls: [50, 25, 10, 40].map((value) => ({ results: { total: value } })),
  who: newsCharacter.get('name'),
  playerid: 'player-1',
});
assert.strictEqual(newsAttribute('temp_insane').get('current'), 'on',
  '원본 지능 판정이 성공하면 짧은 화면 표시의 일시적 광기 체크박스를 활성화해야 합니다.');
runtime.state.KIBSheetHelper.trackingMode = 'public';
const newsHealthAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === newsCharacter.id && item.get('name') === 'hp');
newsHealthAttribute.set('current', '10');
events['change:attribute'](newsHealthAttribute, { current: '5' });
const newsDamageStart = sent.length;
newsHealthAttribute.set('current', '5');
events['change:attribute'](newsHealthAttribute, { current: '10' });
assert(sent.slice(newsDamageStart).some((item) => item.content &&
  item.content.includes('10 / 10 (100%)') && item.content.includes('5 / 10 (50%)') &&
  item.content.includes('중상 자동 처리 생략')),
  '최대 체력의 절반 피해는 최대값과 중상 항목 부재를 채팅에 기록해야 합니다.');
characters.splice(characters.indexOf(newsCharacter), 1);
attributeObjects.splice(newsAttributeStart);
delete getAttrByNameOverrides[newsCharacter.id + '|dex|current'];

const nestedDefaultSheet = parseSheetContract(`
  <label>점수<input type="number" name="attr_score" value="-5" style="opacity:0"></label>
  <label>점수<input type="number" name="attr_score" value="50"></label>
  <label>중간값<input type="number" name="attr_middle" value="@{score}+10"></label>
  <label>결과<input type="number" name="attr_result" value="floor(@{middle}/2)"></label>
`, { name: '중첩 기본값 시험', id: 'nested-default-sheet' });
const nestedDefaultCharacter = addCharacter(
  'nested-default-character', '중첩 기본값 탐사자', 'player-1', {});
sheetFieldDefaults[nestedDefaultCharacter.id] = sourceDefaults(nestedDefaultSheet);
getAttrByNameOverrides[nestedDefaultCharacter.id + '|score|current'] = '-5';
useContracts(nestedDefaultSheet);
useRoomCharacters(nestedDefaultCharacter);
assert.strictEqual(helper.scan(nestedDefaultCharacter.id, true)
  .resourcesByAttribute.result.value, 30,
  '숨은 중복 기본값은 중첩 수식에서도 보이는 값을 사용해야 합니다.');
getAttrByNameOverrides[nestedDefaultCharacter.id + '|score|current'] = '75';
assert.strictEqual(helper.scan(nestedDefaultCharacter.id, true)
  .resourcesByAttribute.result.value, 42,
  '실제 시트 워커 값은 중첩 수식에서도 원본 기본값보다 우선해야 합니다.');
characters.splice(characters.indexOf(nestedDefaultCharacter), 1);
delete sheetFieldDefaults[nestedDefaultCharacter.id];
delete getAttrByNameOverrides[nestedDefaultCharacter.id + '|score|current'];

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
  sheetFieldDefaults[character.id] = sourceDefaults(sheet);
  useContracts(sheet);
  useRoomCharacters(character);
  return { character, values };
}

// 역할 별칭은 정확한 원본 이름보다 우선하거나 모호한 자원을 임의 선택하면 안 됩니다.
const resourceGuardSheet = parseSheetContract([
  '<input name="attr_resource_guard_a"><input name="attr_resource_guard_b"><input name="attr_resource_guard_c">',
  '<label>체력<input type="number" name="attr_health_a"></label>',
  '<label>체력<input type="number" name="attr_health_b"></label>',
  '<label>보관 수량<input type="number" name="attr_mana"></label>',
  '<label>마력<input type="number" name="attr_magic_pool"></label>',
  '<label>SAN<input type="number" name="attr_mind_a"></label>',
  '<label>Sanity<input type="number" name="attr_mind_b"></label>',
  '<button type="roll" value="&{template:resource-guard} {{subject=원본 판정}} {{roll=[[1d100]]}}"></button>',
].join('\n'), { id: 'resource-resolution-guards', sourceHash: 'resource-resolution-guards-v1' });
const resourceGuardAttributeStart = attributeObjects.length;
const resourceGuardCharacter = addCharacter('resource-guard-character', '자원 이름 보호 시험', 'player-1', {
  resource_guard_a: '1', resource_guard_b: '1', resource_guard_c: '1',
  health_a: '10', health_b: '20', mana: '7', magic_pool: '10', mind_a: '50', mind_b: '40',
});
useContracts(resourceGuardSheet);
useRoomCharacters(resourceGuardCharacter);
const resourceGuardValue = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === resourceGuardCharacter.id && item.get('name') === name).get('current');
const duplicateHealthChanges = runGeneral(':체력-1', resourceGuardCharacter.get('name'));
assert(duplicateHealthChanges.some((item) => item.content && item.content.includes('같은 이름의 수치가 여러 개')),
  '동명 체력 자원 둘은 역할 별칭으로 우회하지 않고 정확 이름 단계에서 거부해야 합니다.');
assert.deepStrictEqual(['health_a', 'health_b'].map(resourceGuardValue), ['10', '20'],
  '동명 체력 중 어느 값도 임의로 변경하면 안 됩니다.');
runGeneral(':mana-1', resourceGuardCharacter.get('name'));
assert.deepStrictEqual(['mana', 'magic_pool'].map(resourceGuardValue), ['6', '10'],
  '명시적인 사용자 필드 이름 mana는 마력 역할 별칭보다 우선해야 합니다.');
assert(!helper.scan(resourceGuardCharacter.id, true).resourceAliases['이성'],
  '역할 모호성 시험에는 이성의 정확 이름 일치가 없어야 합니다.');
const ambiguousSanityChanges = runGeneral(':이성-1', resourceGuardCharacter.get('name'));
assert(ambiguousSanityChanges.some((item) => item.content &&
  /찾지 못|여러 개/.test(item.content)),
  '이성 역할 자원이 둘이면 하나를 임의 선택하지 말고 명령 실패를 알려야 합니다.');
assert.deepStrictEqual(['mind_a', 'mind_b'].map(resourceGuardValue), ['50', '40'],
  '역할 별칭이 모호할 때 SAN과 Sanity 중 어느 값도 변경하면 안 됩니다.');
characters.splice(characters.indexOf(resourceGuardCharacter), 1);
attributeObjects.splice(resourceGuardAttributeStart);

// 실제 6번 원본의 이미지 제목이 HP/MP에 각각 연결되어야 합니다. 전체 배포
// 인식 정보를 유지하고, 라이브처럼 현재값 둘을 저장해야 별칭 충돌이 드러납니다.
const lampResourceAttributeStart = attributeObjects.length;
const lampResourceRuntime = addSourceCharacter(
  multiCheckboxSheet, 'lamp-resource-character', '람피온 자원 분리 시험');
const lampResourceCharacter = lampResourceRuntime.character;
sheetFieldDefaults[lampResourceCharacter.id] = sourceDefaults(multiCheckboxSheet);
useContracts(...embeddedSheets);
useRoomCharacters(lampResourceCharacter);
const lampResourceAttributes = {};
Object.entries({
  con: '80', siz: '50', pow: '60', hp: '10', mp: '10', san: '50', san_start: '50',
  showpulp: '0', pulp_hp: '0', 'major-wound-toggle': '0', temp_insane: '0', indef_insane: '0',
}).forEach(([name, value]) => {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === lampResourceCharacter.id && item.get('name') === name) ||
    addAttribute(lampResourceCharacter.id, name, value);
  attribute.set('current', value);
  lampResourceAttributes[name] = attribute;
});
// Roll20 워커가 저장한 실제 current/max 슬롯 형태이며 별도 *_max Attribute가 아닙니다.
lampResourceAttributes.hp.set('max', 13);
lampResourceAttributes.mp.set('max', 12);
const lampResourceData = helper.scan(lampResourceCharacter.id, true);
[['체력', 'hp', 13], ['마력', 'mp', 12]].forEach(([label, name, maximum]) => {
  const item = lampResourceData.resourcesByAttribute[name];
  assert(item && item.label === label && item.value === 10 && item.max === maximum,
    `람피온 ${name}은 다른 자원 제목을 물려받지 않고 ${label} 현재·최대로 표시되어야 합니다.`);
  assert.deepStrictEqual(Array.from(lampResourceData.resourceAliases[label] || [], (item) => item.name), [name],
    `람피온 ${label} 명령은 같은 이름으로 오인된 HP/MP 중 하나를 임의 선택하면 안 됩니다.`);
});
const lampInitialStatus = runApi('!!상태', lampResourceCharacter.get('name'));
assert(lampInitialStatus.some((item) => item.content &&
  item.content.includes('체력 <b>10 / 13 (77%)') && item.content.includes('마력 <b>10 / 12 (83%)')),
  '람피온 상태는 체력과 마력의 서로 다른 이름·현재·최대값을 함께 표시해야 합니다.');
const lampPreviousTrackingMode = runtime.state.KIBSheetHelper.trackingMode;
runtime.state.KIBSheetHelper.trackingMode = 'public';
const lampMagicChanges = runGeneral(':마력-1', lampResourceCharacter.get('name'));
assert.strictEqual(lampResourceAttributes.mp.get('current'), '9', '마력 명령은 MP만 감소시켜야 합니다.');
assert.strictEqual(lampResourceAttributes.hp.get('current'), '10', '마력 명령이 HP를 바꾸면 안 됩니다.');
assert.strictEqual(lampResourceAttributes['major-wound-toggle'].get('current'), '0',
  '마력 감소를 체력 피해로 오인해 중상을 활성화하면 안 됩니다.');
assert(lampMagicChanges.some((item) => item.content &&
  ['마력', '10 / 12 (83%)', '9 / 12 (75%)'].every((text) => item.content.includes(text))),
  '마력 변경 로그는 MP의 현재·최대값과 비율만 표시해야 합니다.');
const lampHealthChanges = runGeneral(':체력-7', lampResourceCharacter.get('name'));
assert.strictEqual(lampResourceAttributes.hp.get('current'), '3', '체력 명령은 HP만 감소시켜야 합니다.');
assert.strictEqual(lampResourceAttributes.mp.get('current'), '9', '체력 명령이 MP를 바꾸면 안 됩니다.');
assert.strictEqual(lampResourceAttributes.san.get('current'), '50', 'HP/MP 명령이 이성을 바꾸면 안 됩니다.');
assert.strictEqual(lampResourceAttributes['major-wound-toggle'].get('current'), '1',
  '실제 원본의 최대 체력 절반 이상 피해는 중상을 활성화해야 합니다.');
assert(lampHealthChanges.some((item) => item.content &&
  ['체력', '10 / 13 (77%)', '3 / 13 (23%)', '중상 활성화'].every((text) => item.content.includes(text))),
  '체력 변경 로그는 HP의 현재·최대값과 중상 처리를 표시해야 합니다.');
runGeneral(':이성-1', lampResourceCharacter.get('name'));
assert.strictEqual(lampResourceAttributes.san.get('current'), '49',
  '짧은 이성 명령은 원본 이성치의 현재값만 감소시켜야 합니다.');
assert.strictEqual(lampResourceAttributes.san_start.get('current'), '50',
  '짧은 이성 명령이 같은 원본 제목을 공유하는 시작 이성을 바꾸면 안 됩니다.');
assert(runApi('!!상태', lampResourceCharacter.get('name')).some((item) => item.content &&
  item.content.includes('체력 <b>3 / 13 (23%)') && item.content.includes('마력 <b>9 / 12 (75%)')),
  '변경 후 상태에서도 체력과 마력의 최신값을 서로 구분해야 합니다.');
runtime.state.KIBSheetHelper.trackingMode = lampPreviousTrackingMode;
characters.splice(characters.indexOf(lampResourceCharacter), 1);
attributeObjects.splice(lampResourceAttributeStart);
delete sheetFieldDefaults[lampResourceCharacter.id];

// 실제 8번 원본은 기본/good/bad 버튼이 따로 있고 각 버튼의 1/2 선택지가
// 같은 숫자로 보입니다. 명령은 방향까지 구분하되 시트의 저장 선택값은 유지합니다.
const islandModeSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-9b09d7edc1403192');
assert(islandModeSheet, '섬툴루 원본의 분리된 일반/보너스/패널티 버튼이 필요합니다.');
const islandModeAttributeStart = attributeObjects.length;
const islandModeRuntime = addSourceCharacter(islandModeSheet, 'island-mode-character', '섬툴루 선택 방식 시험');
const islandModeCharacter = islandModeRuntime.character;
sheetFieldDefaults[islandModeCharacter.id] = sourceDefaults(islandModeSheet);
const islandModeAttributes = {};
Object.entries({
  str: '50', con: '50', siz: '50', pow: '50', dex: '50', app: '50', int: '50', edu: '50',
  san: '50', san_start: '50', temp_insane: '0', indef_insane: '0',
  dice_type: '1', bonus_dice: '1', penalty_dice: '-1',
}).forEach(([name, value]) => {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === islandModeCharacter.id && item.get('name') === name) ||
    addAttribute(islandModeCharacter.id, name, value);
  attribute.set('current', value);
  islandModeAttributes[name] = attribute;
});
useContracts(...embeddedSheets);
useRoomCharacters(islandModeCharacter);
const islandStatusHtml = runApi('!!상태', islandModeCharacter.get('name'))
  .map((item) => item.content || '').join('\n').split('현재 수치')[0];
const islandStatusInstances = helper.contractRolls(islandModeCharacter.id);
[['근력', '50'], ['감정', '5'], ['이성', '50']].forEach(([subject, value]) => {
  const instance = islandStatusInstances.find((item) => item.roll.raw.includes('{{subject=' + subject + '}}') &&
    item.roll.raw.includes('{{roll=[[1d100]]}}'));
  assert(instance && islandStatusHtml.includes(instance.label + ' <b>' + value + '</b>'),
    '섬툴루 상태의 ' + subject + ' 판정 수치 ' + value + '는 광기 상태값 0과 섞여 사라지면 안 됩니다.');
});
assert(['광기 2개', '실시간', '요약'].every((text) => islandStatusHtml.includes(text)),
  '섬툴루의 빈 버튼 표시명과 별개로 원본 광기 2개 및 실시간/요약 선택 방식을 상태에 표시해야 합니다.');
assert(islandStatusHtml.includes('명중부위'),
  '목표 수치가 없는 섬툴루 원본 명중부위 굴림도 상태 목록에 남아 있어야 합니다.');
assert(!islandStatusHtml.includes('명중부위 <b>0</b>'),
  '명중부위의 1d20 굴림에 부가 광기 상태값 0을 판정 수치로 표시하면 안 됩니다.');
[
  ['', '', ''], ['보너스1', 'bonus_dice', '1'], ['보너스2', 'bonus_dice', '2'],
  ['패널티1', 'penalty_dice', '-1'], ['패널티2', 'penalty_dice', '-2'],
].forEach(([suffix, control, value]) => {
  const sourceRoll = islandModeSheet.rolls.find((roll) => roll.raw.includes('{{subject=근력}}') &&
    roll.raw.includes(control ? '{{dice_type=[[@{' + control + '}]]}}' : '{{roll=[[1d100]]}}'));
  assert(sourceRoll, '섬툴루 원본 근력 버튼을 찾지 못했습니다: ' + suffix);
  const sourceMode = control && sourceRoll.modes.find((mode) => mode.overrides[control] === value);
  assert(!control || sourceMode, '섬툴루 원본 선택값이 없습니다: ' + suffix);
  const exact = helper.exactContractInstance(islandModeCharacter.id, islandModeSheet.id, sourceRoll.key, '', true);
  assert(exact.ok, '섬툴루 실제 원본 굴림 인스턴스를 찾지 못했습니다: ' + suffix);
  const expected = helper.qualifyContractMacro(islandModeCharacter.id, exact.instance, sourceMode || null);
  assert(expected.ok, '섬툴루 원본 굴림 식을 확장하지 못했습니다: ' + suffix);
  const messages = runApi('!!근력' + (suffix ? ' ' + suffix : ''), islandModeCharacter.get('name'));
  const rolls = messages.filter((item) => item.content && item.content.includes('kib_sheet_result='));
  assert.strictEqual(rolls.length, 1,
    '섬툴루 근력 ' + (suffix || '일반') + '은 선택 질문 없이 원본 버튼을 한 번 실행해야 합니다: ' +
      JSON.stringify(messages.map((item) => item.content)));
  assert(!messages.some((item) => item.content && item.content.includes('!시트 굴림선택|')),
    '숫자가 같은 good/bad 선택지를 사용자에게 다시 물으면 안 됩니다: ' + suffix);
  assert.strictEqual(rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, ''), expected.content,
    '섬툴루 명령은 해당 원본 good/bad 식과 선택값을 그대로 사용해야 합니다: ' + suffix);
  assert.strictEqual(inlineRollFieldCount(rolls[0].content), control ? 3 : 1,
    '섬툴루 일반은 단일 roll, 보너스/패널티는 원본 3개 roll이어야 합니다: ' + suffix);
  if (control) assert(rolls[0].content.includes('{{dice_type=[[' + value + ']]}}'),
    '섬툴루 dice_type은 요청한 +/-1 또는 +/-2여야 합니다: ' + suffix);
  assert.deepStrictEqual(['dice_type', 'bonus_dice', 'penalty_dice'].map((name) =>
    islandModeAttributes[name].get('current')), ['1', '1', '-1'],
  '일회성 명령은 시트에 저장된 일반/보너스/패널티 선택값을 바꾸면 안 됩니다: ' + suffix);
});
characters.splice(characters.indexOf(islandModeCharacter), 1);
attributeObjects.splice(islandModeAttributeStart);
delete sheetFieldDefaults[islandModeCharacter.id];

// 실제 10번 원본 기본값만 사용합니다. 표현식 필드에 임의 주사위를 저장하거나
// 반복 행을 만들어 정상/보너스 선택 및 비무장 중복을 가리지 않습니다.
const stagfieldSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-cb64ac50518f0b60');
assert(stagfieldSheet, '스태그필드 실제 임베드 원본이 필요합니다.');
const stagfieldAttributeStart = attributeObjects.length;
const stagfieldCharacter = addCharacter('stagfield-normal-character', '스태그필드 일반 판정 시험',
  'player-1', { san: '50', language_own: '50', credit_rating: '0', dodge: '25' });
sheetFieldDefaults[stagfieldCharacter.id] = sourceDefaults(stagfieldSheet);
useContracts(...embeddedSheets);
useRoomCharacters(stagfieldCharacter);
const stagfieldInspection = helper.inspectContracts(stagfieldCharacter.id);
assert(stagfieldInspection.contract && stagfieldInspection.contract.id === stagfieldSheet.id ||
  (stagfieldInspection.matches || []).some((item) => item.id === stagfieldSheet.id),
  '원본 기본값과 실제 입력만 있는 캐릭터의 후보에 스태그필드가 있어야 합니다.');
const stagfieldNormalMacros = {};
const stagfieldChecks = [
  ['근력', 'str_check'], ['감정', 'appraise_check'], ['이성', 'san_check'], ['현재이성치', 'san_check'],
  ['비무장', 'unarmed_check', 'coc-attack-1'],
].map(([label, buttonName, template = 'coc-1']) => {
  const sourceRoll = stagfieldSheet.rolls.find((roll) => roll.name === buttonName &&
    roll.raw.includes('&{template:' + template + '}'));
  assert(sourceRoll, '스태그필드 원본 정상 버튼이 없습니다: ' + label);
  const exact = helper.exactContractInstance(stagfieldCharacter.id, stagfieldSheet.id, sourceRoll.key, '', true);
  assert(exact.ok, '스태그필드 원본 정상 인스턴스가 없습니다: ' + label);
  const expected = helper.qualifyContractMacro(stagfieldCharacter.id, exact.instance, null);
  assert(expected.ok, '원본 기본값으로 정상 판정을 확장해야 합니다: ' + label);
  stagfieldNormalMacros[label] = expected.content;
  const messages = runApi('!!' + label, stagfieldCharacter.get('name'));
  const rolls = messages.filter((item) => item.content && item.content.includes('kib_sheet_result='));
  return {
    command: '!!' + label,
    pass: rolls.length === 1 && inlineRollFieldCount(rolls[0].content) === 1 &&
      rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content &&
      !messages.some((item) => item.content && item.content.includes('!시트 굴림선택|')),
    templates: rolls.map((item) => (item.content.match(/&\{template:([^}]+)\}/) || [])[1]),
    diceCounts: rolls.map((item) => inlineRollFieldCount(item.content)),
  };
});
const stagfieldWeapons = westernEuroStatusGroups(stagfieldCharacter)['무기'];
stagfieldChecks.push({
  command: '!!상태 / 무기',
  pass: Array.isArray(stagfieldWeapons) && stagfieldWeapons.length === 1 && stagfieldWeapons[0] === '비무장',
  labels: stagfieldWeapons,
});
const stagfieldSanityResource = helper.scan(stagfieldCharacter.id).resourcesByAttribute.san;
stagfieldChecks.push({
  command: '현재 이성치 자원 이름',
  pass: !!stagfieldSanityResource && stagfieldSanityResource.label === '현재 이성치',
  label: stagfieldSanityResource && stagfieldSanityResource.label,
});
const stagfieldSearchHtml = runApi('!!검색 비무장', stagfieldCharacter.get('name'))
  .map((item) => item.content || '').join('\n');
const stagfieldSearchRows = Array.from(stagfieldSearchHtml.matchAll(/<tr>[\s\S]*?<\/tr>/g), (match) => match[0])
  .filter((row) => row.includes('<b>비무장</b>'));
function stagfieldActionButtons(html) {
  return Array.from(html.matchAll(/href="(!시트 굴림(?:목록|선택)\|[^"]*)"/g),
    (match) => match[1].replace(/&amp;/g, '&'));
}
const stagfieldSearchButtons = stagfieldActionButtons(stagfieldSearchRows.join('\n'));
stagfieldChecks.push({
  command: '!!검색 비무장', pass: stagfieldSearchRows.length === 1 && stagfieldSearchButtons.length === 1,
  rows: stagfieldSearchRows.length, buttons: stagfieldSearchButtons,
});
const stagfieldSearchExecution = stagfieldSearchButtons.length === 1
  ? runApi(stagfieldSearchButtons[0], stagfieldCharacter.get('name')) : [];
const stagfieldSearchRolls = stagfieldSearchExecution.filter((item) => (item.content || '').includes('kib_sheet_result='));
stagfieldChecks.push({
  command: '실제 비무장 검색 버튼 실행',
  pass: stagfieldSearchRolls.length === 1 && inlineRollFieldCount(stagfieldSearchRolls[0].content) === 1 &&
    stagfieldSearchRolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === stagfieldNormalMacros['비무장'] &&
    !stagfieldSearchExecution.some((item) => (item.content || '').includes('!시트 굴림선택|')),
  diceCounts: stagfieldSearchRolls.map((item) => inlineRollFieldCount(item.content)),
});
// 두 실제 후보의 보너스 결과 규칙은 서로 다릅니다. 일반 UI 정리 때문에
// 원본 보너스 후보까지 하나로 만들거나 정상 버튼으로 치환하면 안 됩니다.
const stagfieldBonusPeer = embeddedSheets.find((sheet) => sheet.id === 'sheet-985cd27c28db2ec5');
assert(stagfieldBonusPeer && JSON.stringify(stagfieldSheet.resultTemplates['coc-attack']) !==
  JSON.stringify(stagfieldBonusPeer.resultTemplates['coc-attack']), '실제 후보의 서로 다른 보너스 결과 규칙이 필요합니다.');
const stagfieldBonusMessages = runApi('!!비무장보너스1', stagfieldCharacter.get('name'));
const stagfieldBonusButtons = stagfieldActionButtons(stagfieldBonusMessages.map((item) => item.content || '').join('\n'));
const stagfieldBonusChoices = stagfieldBonusButtons.map((command) => ({ command, parts: command.split('|').map(decodeURIComponent) }));
const stagfieldBonusChoice = stagfieldBonusChoices.find((choice) =>
  choice.parts[2] === stagfieldSheet.id && choice.parts[3] === 'unarmed_check');
stagfieldChecks.push({
  command: '!!비무장보너스1 원본 후보 보존',
  pass: !stagfieldBonusMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) &&
    !!stagfieldBonusChoice && stagfieldBonusChoices.some((choice) =>
      choice.parts[2] === stagfieldBonusPeer.id && choice.parts[3] === 'unarmed_check'),
  choices: stagfieldBonusChoices.map((choice) => choice.parts.slice(2, 4)),
});
const stagfieldBonusExecution = stagfieldBonusChoice
  ? runApi(stagfieldBonusChoice.command, stagfieldCharacter.get('name')) : [];
const stagfieldBonusRolls = stagfieldBonusExecution.filter((item) => (item.content || '').includes('kib_sheet_result='));
const stagfieldBonusExact = helper.exactContractInstance(stagfieldCharacter.id, stagfieldSheet.id, 'unarmed_check', '', true);
assert(stagfieldBonusExact.ok, '스태그필드 원본 비무장 보너스 후보가 남아 있어야 합니다.');
const stagfieldBonusExpected = helper.qualifyContractMacro(stagfieldCharacter.id, stagfieldBonusExact.instance, null);
stagfieldChecks.push({
  command: '실제 비무장 보너스 선택 버튼 실행',
  pass: stagfieldBonusExpected.ok && stagfieldBonusRolls.length === 1 &&
    inlineRollFieldCount(stagfieldBonusRolls[0].content) === 3 &&
    stagfieldBonusRolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === stagfieldBonusExpected.content,
  diceCounts: stagfieldBonusRolls.map((item) => inlineRollFieldCount(item.content)),
});
// 실제 고정 사용자 기능의 정상/보너스 버튼은 같은 필드를 쓰지만 name이 다릅니다.
// 원본 이름을 고치지 않고 실제 저장값과 변경 이벤트로 정상 선택을 검증합니다.
const stagfieldCustomName = addAttribute(stagfieldCharacter.id, 'otherskill4_da_name', '스태그실검기능');
const stagfieldCustomValue = addAttribute(stagfieldCharacter.id, 'otherskill4_da', '47');
const stagfieldCustomSource = stagfieldSheet.rolls.find((roll) =>
  roll.raw.includes('&{template:coc-1}') && roll.raw.includes('@{otherskill4_da_name}'));
assert(stagfieldCustomSource, '실제 사용자 기능 이름 필드의 원본 정상 버튼이 필요합니다.');
[['스태그실검기능', '47'], ['스태그변경기능', '63']].forEach(([name, value]) => {
  [[stagfieldCustomName, name], [stagfieldCustomValue, value]].forEach(([attribute, current]) => {
    const previous = attribute.get('current');
    if (previous === current) return;
    attribute.set('current', current);
    events['change:attribute'](attribute, { current: previous });
  });
  const exact = helper.exactContractInstance(stagfieldCharacter.id, stagfieldSheet.id, stagfieldCustomSource.key, '', true);
  assert(exact.ok, '현재 사용자 기능의 원본 정상 버튼에 접근해야 합니다.');
  const expected = helper.qualifyContractMacro(stagfieldCharacter.id, exact.instance, null);
  assert(expected.ok && expected.content.includes('{{success=[[' + value + ']]}}'),
    '사용자 기능 원본을 실제 저장값으로 확장해야 합니다: ' + value);
  const messages = runApi('!!' + name, stagfieldCharacter.get('name'));
  const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
  const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
  stagfieldChecks.push({
    command: '!!' + name + ' / ' + value,
    pass: rolls.length === 1 && inlineRollFieldCount(rolls[0].content) === 1 && choices.length === 0 &&
      rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content,
    diceCounts: rolls.map((item) => inlineRollFieldCount(item.content)),
    choices: choices.map((command) => command.split('|').slice(2, 4)),
  });
});
const stagfieldOldCustomMessages = runApi('!!스태그실검기능', stagfieldCharacter.get('name'));
stagfieldChecks.push({
  command: '변경 전 스태그실검기능 이름 제거',
  pass: stagfieldOldCustomMessages.some((item) => (item.content || '').includes('스태그실검기능 굴림을 찾지 못했습니다')) &&
    !stagfieldOldCustomMessages.some((item) => /kib_sheet_result=|!시트 굴림선택\|/.test(item.content || '')),
});
assert(stagfieldChecks.every((item) => item.pass),
  '스태그필드 정상 명령은 원본 단일 판정이고 비무장은 상태에 한 번만 있어야 합니다: ' +
    JSON.stringify(stagfieldChecks));
characters.splice(characters.indexOf(stagfieldCharacter), 1);
attributeObjects.splice(stagfieldAttributeStart);
delete sheetFieldDefaults[stagfieldCharacter.id];

// 실제 7번의 장식용 기본 라벨은 한국어 자원 묶음 이름을 덮으면 안 됩니다.
const rottenSanitySheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-db283d90e7ce3ebf');
assert(rottenSanitySheet, '로튼 레이크 실제 임베드 원본이 필요합니다.');
const rottenSanityAttributeStart = attributeObjects.length;
const rottenSanityCharacter = addCharacter('rotten-sanity-label-character', '로튼 이성 이름 시험', 'player-1', { san: '50' });
sheetFieldDefaults[rottenSanityCharacter.id] = sourceDefaults(rottenSanitySheet);
useContracts(...embeddedSheets);
useRoomCharacters(rottenSanityCharacter);
assert.strictEqual(helper.scan(rottenSanityCharacter.id).resourcesByAttribute.san.label, '이성',
  '로튼 원본의 장식 라벨 │ 대신 이성 묶음 이름을 보존해야 합니다.');
characters.splice(characters.indexOf(rottenSanityCharacter), 1);
attributeObjects.splice(rottenSanityAttributeStart);
delete sheetFieldDefaults[rottenSanityCharacter.id];

// 실제 14번의 숨은 전투 화면에는 같은 회피 버튼이 한 번 더 있습니다.
// 원본 전체 35종과 원본 기본값을 유지하며 활성 탭·저장값만 실제 UI 형태로 만듭니다.
const cheonthulhuSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-280aaa54543fa2cb');
assert(cheonthulhuSheet, '천툴루 실제 임베드 원본이 필요합니다.');
const cheonthulhuDodgeSources = cheonthulhuSheet.rolls.filter((roll) =>
  roll.raw.includes('{{subject=회피}}') && roll.raw.includes('{{success=[[@{dodge}]]}}'));
assert.strictEqual(cheonthulhuDodgeSources.length, 2, '실제 회피의 주 화면/전투 화면 두 버튼이 필요합니다.');
assert.strictEqual(cheonthulhuDodgeSources[0].raw, cheonthulhuDodgeSources[1].raw,
  '회피 중복 회귀는 표시 위치만 다른 동일 원본 식이어야 합니다.');
const cheonthulhuStrengthSource = cheonthulhuSheet.rolls.find((roll) => roll.raw.includes('{{subject=근력}}'));
assert(cheonthulhuStrengthSource && cheonthulhuStrengthSource.modes.length === 5,
  '실제 근력에는 일반 및 보너스/패널티 1/2의 다섯 원본 방식이 있어야 합니다.');
const cheonthulhuAttributeStart = attributeObjects.length;
const cheonthulhuCharacter = addCharacter('cheonthulhu-live-regressions', '천툴루 실제 구조 회귀', 'player-1', {
  dodge: '25', san: '50', san_start: '50', int: '100', hp: '10', mp: '10',
  language_own: '50', credit_rating: '0', luck: '50', temp_insane: '0', indef_insane: '0',
  character_info_tab_btn: '0', character_info_tab_value: '0',
  dice_type: '{{roll=[[1d100]]}}', bonus_dice_count: '1', penalty_dice_count: '-1',
});
sheetFieldDefaults[cheonthulhuCharacter.id] = sourceDefaults(cheonthulhuSheet);
useContracts(...embeddedSheets);
useRoomCharacters(cheonthulhuCharacter);
const cheonthulhuInspection = helper.inspectContracts(cheonthulhuCharacter.id);
assert(cheonthulhuInspection.contract && cheonthulhuInspection.contract.id === cheonthulhuSheet.id ||
  (cheonthulhuInspection.matches || []).some((item) => item.id === cheonthulhuSheet.id),
  '전체 배포 원본을 유지한 실제 저장값이 천툴루 후보를 포함해야 합니다.');
const cheonthulhuChecks = [];
const cheonthulhuAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === cheonthulhuCharacter.id && item.get('name') === name);
function changeCheonthulhu(name, current) {
  const attribute = cheonthulhuAttribute(name);
  const previous = attribute.get('current');
  attribute.set('current', current);
  events['change:attribute'](attribute, { current: previous });
}
function cheonthulhuRollEvidence(command, sourceRoll, mode) {
  const exact = helper.exactContractInstance(cheonthulhuCharacter.id, cheonthulhuSheet.id, sourceRoll.key, '', true);
  assert(exact.ok, '천툴루 원본 인스턴스를 찾지 못했습니다: ' + command);
  const expected = helper.qualifyContractMacro(cheonthulhuCharacter.id, exact.instance, mode || null);
  assert(expected.ok, '천툴루 실제 원본 식을 확장하지 못했습니다: ' + command);
  const messages = runApi(command, cheonthulhuCharacter.get('name'));
  const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
  const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
  return { command, choices, pass: choices.length === 0 && rolls.length === 1 &&
    rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content,
    diceCounts: rolls.map((item) => inlineRollFieldCount(item.content)) };
}
['0', '1'].forEach((tab) => {
  changeCheonthulhu('character_info_tab_btn', tab);
  changeCheonthulhu('character_info_tab_value', tab);
  const evidence = cheonthulhuRollEvidence('!!회피', cheonthulhuDodgeSources[Number(tab)]);
  cheonthulhuChecks.push({ ...evidence, tab, pass: evidence.pass && evidence.diceCounts.join() === '1' });
});
changeCheonthulhu('character_info_tab_btn', '0');
changeCheonthulhu('character_info_tab_value', '0');
const cheonthulhuExpectedModeLabels = [];
[['보너스', 'bonus_dice_count', '1'], ['보너스', 'bonus_dice_count', '2'],
  ['패널티', 'penalty_dice_count', '-1'], ['패널티', 'penalty_dice_count', '-2']].forEach(([label, control, value]) => {
  const mode = cheonthulhuStrengthSource.modes.find((item) => item.overrides[control] === value);
  assert(mode, '천툴루 실제 원본 방향/개수 방식이 필요합니다: ' + label + value);
  cheonthulhuExpectedModeLabels.push(mode.labelPath.join(' '));
  const evidence = cheonthulhuRollEvidence('!!근력 ' + label + Math.abs(Number(value)), cheonthulhuStrengthSource, mode);
  cheonthulhuChecks.push({ ...evidence, pass: evidence.pass && evidence.diceCounts.join() === '3' &&
    ['dice_type', 'bonus_dice_count', 'penalty_dice_count'].map((name) => cheonthulhuAttribute(name).get('current')).join('|') ===
      '{{roll=[[1d100]]}}|1|-1' });
});
const cheonthulhuStatus = runApi('!!상태', cheonthulhuCharacter.get('name')).find((item) => item.who === '시트 헬퍼').content;
const cheonthulhuModeSection = cheonthulhuStatus.match(/font-weight:bold">다이스 종류 (\d+)개<\/div><div style="padding:8px">([^<]*)<\/div>/);
const cheonthulhuModeLabels = cheonthulhuModeSection ? cheonthulhuModeSection[2].split(',').map((item) => item.trim()) : [];
cheonthulhuChecks.push({ command: '!!상태 다이스 종류', expected: cheonthulhuExpectedModeLabels, labels: cheonthulhuModeLabels,
  pass: !!cheonthulhuModeSection && Number(cheonthulhuModeSection[1]) === 4 &&
    cheonthulhuModeLabels.slice().sort().join('|') === cheonthulhuExpectedModeLabels.slice().sort().join('|') });

const cheonthulhuSanChanges = runGeneral(':이성-5', cheonthulhuCharacter.get('name'));
cheonthulhuChecks.push({ command: ':이성-5', current: cheonthulhuAttribute('san').get('current'),
  starting: cheonthulhuAttribute('san_start').get('current'), intelligenceRolls: intelligenceRolls(cheonthulhuSanChanges).length,
  pass: cheonthulhuAttribute('san').get('current') === '45' && cheonthulhuAttribute('san_start').get('current') === '50' &&
    intelligenceRolls(cheonthulhuSanChanges).length === 1 && !cheonthulhuSanChanges.some((item) =>
      (item.content || '').includes('같은 이름의 수치가 여러 개')) });
const cheonthulhuSanBeforeStart = cheonthulhuAttribute('san').get('current');
const cheonthulhuStartChanges = runGeneral(':시작이성=51', cheonthulhuCharacter.get('name'));
cheonthulhuChecks.push({ command: ':시작이성=51',
  pass: cheonthulhuAttribute('san_start').get('current') === '51' && cheonthulhuAttribute('san').get('current') === cheonthulhuSanBeforeStart &&
    !cheonthulhuStartChanges.some((item) => /찾지 못|같은 이름의 수치가 여러 개/.test(item.content || '')) });
runGeneral(':시작이성=50', cheonthulhuCharacter.get('name'));

// 같은 표시명·현재값이어도 실제 필드나 반복행이 다르면 합치면 안 됩니다.
const cheonthulhuSharedTitle = '천툴루 별도 기능';
Object.entries({ ori_other_skills_title: cheonthulhuSharedTitle, ori_other_skills: '47',
  'repeating_skills_-CheonRowA_other_skills_title': cheonthulhuSharedTitle,
  'repeating_skills_-CheonRowA_other_skills': '47',
  'repeating_skills_-CheonRowB_other_skills_title': cheonthulhuSharedTitle,
  'repeating_skills_-CheonRowB_other_skills': '47', _reporder_repeating_skills: '-CheonRowA,-CheonRowB',
}).forEach(([name, value]) => addAttribute(cheonthulhuCharacter.id, name, value));
const cheonthulhuDistinctMessages = runApi('!!' + cheonthulhuSharedTitle, cheonthulhuCharacter.get('name'));
const cheonthulhuDistinctChoices = stagfieldActionButtons(cheonthulhuDistinctMessages.map((item) => item.content || '').join('\n'));
const cheonthulhuDistinctRows = cheonthulhuDistinctChoices.map((command) => command.split('|').map(decodeURIComponent)[4]);
cheonthulhuChecks.push({ command: '서로 다른 실제 필드/행 보존', rows: cheonthulhuDistinctRows,
  pass: cheonthulhuDistinctRows.slice().sort().join('|') === ['', '-CheonRowA', '-CheonRowB'].sort().join('|') &&
    !cheonthulhuDistinctMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
characters.splice(characters.indexOf(cheonthulhuCharacter), 1);
attributeObjects.splice(cheonthulhuAttributeStart);
delete sheetFieldDefaults[cheonthulhuCharacter.id];
assert(cheonthulhuChecks.every((item) => item.pass),
  '천툴루 실제 회피/모드/SAN 회귀: ' + JSON.stringify(cheonthulhuChecks));

// 실제 31번 Physics 버튼의 원본 식은 잘못 복사된 Photography 식입니다.
// 원본 오류를 고치거나 숨기지 말고, 서로 다른 표시명의 검색 항목/선택 키를 보존합니다.
const photographyPhysicsSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-1b678812ac2dada9');
assert(photographyPhysicsSheet, 'Photography/Physics 원본 표시명 반례가 필요합니다.');
const photographyPhysicsAttributeStart = attributeObjects.length;
const photographyPhysicsCharacter = addCharacter('photography-physics-source-preservation', '원본 Physics 표시 보존', 'player-1', {
  showskills: '2', Photography: '47', Physics: '63',
});
sheetFieldDefaults[photographyPhysicsCharacter.id] = sourceDefaults(photographyPhysicsSheet);
useContracts(...embeddedSheets);
useRoomCharacters(photographyPhysicsCharacter);
const photographyPhysicsChecks = [];
['2', '4'].forEach((view) => {
  const attribute = attributeObjects.find((item) => item.get('_characterid') === photographyPhysicsCharacter.id && item.get('name') === 'showskills');
  const previous = attribute.get('current');
  attribute.set('current', view);
  events['change:attribute'](attribute, { current: previous });
  ['Photography (10%)', 'Physics (01)'].forEach((label) => {
    const sourceRolls = photographyPhysicsSheet.rolls.filter((roll) => roll.label === label &&
      visibilityEquals(roll.visibility, 'showskills', view));
    assert.strictEqual(sourceRolls.length, 2, '원본 표시별 일반/수정 버튼 두 개가 필요합니다: ' + label + '/' + view);
    assert(sourceRolls.every((roll) => roll.raw.includes('{{skillname=Photography}}') && roll.raw.includes('@{Photography}')),
      '원본 Physics 복사 오류를 바꿔 반례를 우회하면 안 됩니다.');
    const html = runApi('!!검색 ' + label, photographyPhysicsCharacter.get('name')).map((item) => item.content || '').join('\n');
    const rows = Array.from(html.matchAll(/<tr>[\s\S]*?<\/tr>/g), (match) => match[0])
      .filter((row) => row.includes('<b>' + label + '</b>') && row.includes('>굴림</span>'));
    const buttons = Array.from(rows.join('\n').matchAll(/<a href="([^"]+)"/g), (match) => match[1].replace(/&amp;/g, '&'));
    const messages = buttons.length === 1 ? runApi(buttons[0], photographyPhysicsCharacter.get('name')) : [];
    const keys = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'))
      .map((command) => command.split('|').map(decodeURIComponent)[3]);
    const expectedKeys = sourceRolls.map((roll) => roll.key);
    photographyPhysicsChecks.push({ view, label, rows: rows.length, buttons, keys, expectedKeys,
      pass: rows.length === 1 && buttons.length === 1 && keys.slice().sort().join('|') === expectedKeys.slice().sort().join('|') });
  });
});
characters.splice(characters.indexOf(photographyPhysicsCharacter), 1);
attributeObjects.splice(photographyPhysicsAttributeStart);
delete sheetFieldDefaults[photographyPhysicsCharacter.id];
assert(photographyPhysicsChecks.every((item) => item.pass),
  '31번 원본 Photography/Physics 표시와 검색 선택 키를 보존해야 합니다: ' + JSON.stringify(photographyPhysicsChecks));

// 같은 원본 계열이 함께 후보로 남고 숨은 표시명이 빈 Attribute로 저장된 경우에도
// 단일 판정 버튼을 골라 완전한 원본 rolltemplate 식을 보내야 합니다.
const singleRollSource = embeddedSheets.find((sheet) => sheet.id === 'sheet-897a7f3b9c6a8d78');
assert(singleRollSource, '단일 판정 전송 회귀를 검증할 원본 구조가 필요합니다.');
const singleRollRuntime = addSourceCharacter(
  singleRollSource, 'single-roll-source-character', '단일 판정 전송 시험');
sheetFieldDefaults[singleRollRuntime.character.id] = sourceDefaults(singleRollSource);
['str', 'str_txt'].forEach((name) => {
  let attribute = attributeObjects.find((item) =>
    item.get('_characterid') === singleRollRuntime.character.id && item.get('name') === name);
  if (!attribute) attribute = addAttribute(singleRollRuntime.character.id, name, '');
  attribute.set('current', name === 'str' ? '51' : '');
});
useContracts(...embeddedSheets);
useRoomCharacters(singleRollRuntime.character);
const singleRollMessages = runApi('!!근력', singleRollRuntime.character.get('name'))
  .filter((item) => item.content && item.content.includes('kib_sheet_result='));
assert.strictEqual(singleRollMessages.length, 1,
  '같은 원본 계열 후보가 있어도 근력 굴림은 선택 질문 없이 한 번만 보내야 합니다.');
assert(singleRollMessages[0].content.includes('&{template:coc-1}') &&
  singleRollMessages[0].content.includes('{{name=근력}}') &&
  singleRollMessages[0].content.includes('{{success=[[51]]}}') &&
  singleRollMessages[0].content.includes('{{roll1=[[1d100]]}}') &&
  !singleRollMessages[0].content.includes('{{roll2='),
  '빈 숨은 표시명과 유사 원본 후보가 판정 이름·수치·주사위 식을 비우거나 다른 버튼으로 바꾸면 안 됩니다.');

// 시트 워커가 한 저장에서 같은 값을 여러 차례 보정해도 change 콜백 안에서
// 캐릭터 전체 Attribute를 매번 다시 읽지 않고, 마지막 값으로 한 번만 처리해야 합니다.
const burstAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === singleRollRuntime.character.id && item.get('name') === 'str');
assert(burstAttribute, '연속 Attribute 변경 회귀를 검증할 근력 수치가 필요합니다.');
helper.scan(singleRollRuntime.character.id, true);
const burstFindStart = attributeFindCalls.length;
const burstMessageStart = sent.length;
deferAttributeTimers = true;
for (let value = 52; value <= 101; value += 1) {
  const before = burstAttribute.get('current');
  burstAttribute.set('current', String(value));
  events['change:attribute'](burstAttribute, { current: before });
}
assert.strictEqual(attributeFindCalls.length, burstFindStart,
  '연속 change:attribute 콜백 안에서 캐릭터 전체 Attribute를 다시 읽으면 안 됩니다.');
deferAttributeTimers = false;
flushAttributeTimers();
assert.strictEqual(attributeFindCalls.length - burstFindStart, 1,
  '연속 Attribute 변경은 캐릭터별 전체 스캔 한 번으로 합쳐야 합니다.');
const burstMessages = sent.slice(burstMessageStart).filter((item) => item.content &&
  item.content.includes(singleRollRuntime.character.get('name') + ' / 근력'));
assert.strictEqual(burstMessages.length, 1,
  '연속 Attribute 변경은 최초 값에서 마지막 값까지 변화 알림 한 번만 남겨야 합니다.');
assert(burstMessages[0].content.includes('51') && burstMessages[0].content.includes('101'),
  '합쳐진 변화 알림은 최초 값과 마지막 값을 보존해야 합니다.');

function verifyEditableTitleSlot(sheet, fieldName, id, currentName, nextName) {
  const sourceRolls = (sheet.rolls || []).filter((roll) => (roll.labelRefs || []).some((ref) =>
    sourceRefName(ref) === fieldName));
  assert(sourceRolls.length, `${sheet.id}: 편집형 이름칸과 연결된 원본 굴림이 필요합니다.`);
  const sourceLabels = new Set(sourceRolls.flatMap((roll) => [roll.label].concat(roll.aliases || []))
    .map((label) => String(label || '').trim()).filter(Boolean));
  const runtimeSource = addSourceCharacter(sheet, id, id);
  sourceRolls.forEach((roll) => satisfySimpleVisibility(roll.visibility, runtimeSource.values));
  Object.entries(runtimeSource.values).forEach(([name, value]) => {
    const attribute = attributeObjects.find((item) =>
      item.get('_characterid') === runtimeSource.character.id && item.get('name') === name);
    if (attribute) attribute.set('current', String(value));
  });
  const title = attributeObjects.find((item) =>
    item.get('_characterid') === runtimeSource.character.id && item.get('name') === fieldName);
  assert(title, `${sheet.id}: 편집형 이름 속성을 만들지 못했습니다.`);
  const requiredNames = new Set(sourceRolls.flatMap((roll) =>
    [roll.refs, roll.labelRefs].flat().map(sourceRefName).concat(
      Array.from(String(roll.raw || '').matchAll(/@\{([^{}|]+)/g), (match) => match[1])))
    .filter((name) => name && name !== fieldName));
  attributeObjects.filter((item) => item.get('_characterid') === runtimeSource.character.id &&
    requiredNames.has(item.get('name')) && String(item.get('current') || '').trim() === '')
    .forEach((item) => item.set('current', '50'));
  const blankStatus = runApi('!!상태', runtimeSource.character.get('name'));
  assert(!blankStatus.some((item) => Array.from(sourceLabels).some((label) =>
    item.content && item.content.includes(label))),
  `${sheet.id}: 비어 있는 이름칸의 원본 안내문을 실제 굴림으로 표시하면 안 됩니다.`);

  title.set('current', currentName);
  events['change:attribute'](title, { current: '' });
  let messages = runApi('!!' + currentName, runtimeSource.character.get('name'));
  assert.strictEqual(messages.filter((item) => item.content && item.content.includes('kib_sheet_result=')).length, 1,
    `${sheet.id}: 현재 입력한 이름은 선택 질문 없이 원본 굴림 한 번만 실행해야 합니다. ${JSON.stringify(messages)}`);
  assert(!messages.some((item) => item.content && item.content.includes('어느 항목을 실행할까요?')),
    `${sheet.id}: 현재 이름과 원본 안내문을 중복 후보로 만들면 안 됩니다.`);

  title.set('current', nextName);
  events['change:attribute'](title, { current: currentName });
  messages = runApi('!!' + currentName, runtimeSource.character.get('name'));
  assert(messages.some((item) => item.content && item.content.includes('찾지 못했습니다.')),
    `${sheet.id}: 이름을 바꾼 뒤 이전 입력값이 굴림 별칭으로 남으면 안 됩니다.`);
  messages = runApi('!!' + nextName, runtimeSource.character.get('name'));
  assert.strictEqual(messages.filter((item) => item.content && item.content.includes('kib_sheet_result=')).length, 1,
    `${sheet.id}: 바뀐 현재 이름으로 원본 굴림을 실행해야 합니다.`);
}

verifyEditableTitleSlot(newsSheet, 'otherskill1_name', '뉴스 빈 슬롯 시험', 'ㅇㄴ', '민속학');
verifyEditableTitleSlot(marenHyeyoomSheet, 'ori_other_skills_title', '헤윰 빈 슬롯 시험', '기호학', '민간전승');
verifyEditableTitleSlot(publicSheet, 'artandcraft1_inv_name', '공식 빈 슬롯 시험', '유리공예', '금속공예');

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
sheetFieldDefaults[actualCharacter.id] = sourceDefaults(actualSheet);
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
const modeBoundaryMessages = runApi('!!장기', actualCharacter.get('name'));
assert(!modeBoundaryMessages.some((item) => String(item.content || '').includes('kib_sheet_result=')) &&
  modeBoundaryMessages.some((item) => /찾지 못했습니다/.test(String(item.content || ''))),
'변장 굴림과 기본 선택 방식의 글자 경계를 가로질러 장기 굴림으로 오인하면 안 됩니다.');
const blankSanMessages = runApi('!!이성', actualCharacter.get('name'));
const blankSanNotice = blankSanMessages.find((item) => item.who === '시트 헬퍼' && /비어 있습니다/.test(item.content));
assert(blankSanNotice,
  '이성 수치가 비었을 때 Roll20 파서로 보내지 말고 채팅 오류로 끝내야 합니다.');
assert(blankSanNotice.options && blankSanNotice.options.noarchive === true,
  '오류 안내는 세션 로그에 불필요하게 남기지 않아야 합니다.');
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
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
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
  ...sourceDefaults(actualSheet),
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
const bloodyGeneralRealtime = runApi('!!실시간', bloodyRuntime.character.get('name'))
  .filter((item) => String(item.content || '').includes('kib_sheet_result='));
assert.strictEqual(bloodyGeneralRealtime.length, 1,
  '일반 규칙의 실시간 광기 굴림은 정확히 한 번만 실행해야 합니다.');
assert(bloodyGeneralRealtime[0].content.includes('{{madness_type=[[1]]}}') &&
  !/madness_type=\[\[[234]\]\]/.test(bloodyGeneralRealtime[0].content),
  '일반 규칙에서 실시간은 현재 일반 분기의 굴림만 실행해야 합니다.');
const bloodyGeneralSummary = runApi('!!요약', bloodyRuntime.character.get('name'))
  .filter((item) => String(item.content || '').includes('kib_sheet_result='));
assert.strictEqual(bloodyGeneralSummary.length, 1,
  '일반 규칙의 요약 광기 굴림은 정확히 한 번만 실행해야 합니다.');
assert(bloodyGeneralSummary[0].content.includes('{{madness_type=[[2]]}}') &&
  !/madness_type=\[\[[134]\]\]/.test(bloodyGeneralSummary[0].content),
  '일반 규칙에서 요약은 펄프가 아닌 일반 요약만 실행해야 합니다.');
['일시', '장기'].forEach((name) => {
  const messages = runApi('!!' + name, bloodyRuntime.character.get('name'));
  assert(!messages.some((item) => String(item.content || '').includes('kib_sheet_result=')) &&
    messages.some((item) => /찾지 못했습니다/.test(String(item.content || ''))),
  '실시간/요약만 있는 시트에 ' + name + ' 굴림을 임의로 만들어내면 안 됩니다.');
});
const bloodyMadnessAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === bloodyRuntime.character.id && item.get('name') === 'rand_maddess');
assert(bloodyMadnessAttribute);
bloodyMadnessAttribute.set('current', '3');
const bloodyPulpRealtime = runApi('!!실시간', bloodyRuntime.character.get('name'))
  .filter((item) => String(item.content || '').includes('kib_sheet_result='));
assert.strictEqual(bloodyPulpRealtime.length, 1,
  '펄프 규칙의 실시간 광기 굴림은 정확히 한 번만 실행해야 합니다.');
assert(bloodyPulpRealtime[0].content.includes('{{madness_type=[[3]]}}') &&
  !/madness_type=\[\[[124]\]\]/.test(bloodyPulpRealtime[0].content),
  '펄프 규칙에서 실시간은 일반이 아닌 펄프 실시간만 실행해야 합니다.');
const bloodyPulpSummary = runApi('!!요약', bloodyRuntime.character.get('name'))
  .filter((item) => String(item.content || '').includes('kib_sheet_result='));
assert.strictEqual(bloodyPulpSummary.length, 1,
  '펄프 규칙의 요약 광기 굴림은 정확히 한 번만 실행해야 합니다.');
assert(bloodyPulpSummary[0].content.includes('{{madness_type=[[4]]}}') &&
  !/madness_type=\[\[[123]\]\]/.test(bloodyPulpSummary[0].content),
  '펄프 규칙에서 요약은 일반이 아닌 펄프 요약만 실행해야 합니다.');
const crossRollMode = helper.resolveContractAction(bloodyRuntime.character, '1개 -2', false);
assert(crossRollMode.handled && !crossRollMode.result.ok && crossRollMode.result.reason === 'conflict',
  '서로 다른 보너스·패널티 굴림을 첫 후보의 현재 방식으로 임의 선택하면 안 됩니다.');
// Native sheet defaults supply the authored weapon name, not the nameless fallback.
assert.strictEqual(crossRollMode.result.choices.map((choice) => choice.label).sort().join('\n'), [
  '비무장 / 보너스 주사위 1개',
  '비무장 / 패널티 주사위 1개',
].sort().join('\n'), '서로 다른 control/visibility 소유 굴림은 두 선택지를 모두 남겨야 합니다.');
const crossGroupModeRuntime = addSourceCharacter(
  marenHyeyoomSheet,
  'source-mode-context-cross-group',
  '선택 방식 교차 그룹 시험',
);
const crossGroupStrength = marenHyeyoomSheet.rolls.find((roll) => roll.label === '근력');
const crossGroupPenaltyTwo = crossGroupStrength && crossGroupStrength.modes.find((mode) =>
  (mode.labelPath || []).join(' ') === '패널티 개 2');
assert(crossGroupStrength && crossGroupPenaltyTwo);
Object.entries(crossGroupPenaltyTwo.overrides).forEach(([name, value]) => {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === crossGroupModeRuntime.character.id && item.get('name') === name);
  assert(attribute, '교차 그룹 시험 속성을 찾지 못했습니다: ' + name);
  attribute.set('current', value);
});
helper.scan(crossGroupModeRuntime.character.id, true);
const crossGroupMode = helper.resolveContractAction(crossGroupModeRuntime.character, '근력 보너스', false);
assert(crossGroupMode.handled && !crossGroupMode.result.ok && crossGroupMode.result.reason === 'conflict',
  '현재 패널티 개수가 보너스 개수를 임의 선택하면 안 됩니다.');
assert.strictEqual(crossGroupMode.result.choices.map((choice) => choice.label).sort().join('\n'), [
  '근력 / 보너스 개 1',
  '근력 / 보너스 개 2',
].sort().join('\n'), '현재 방식과 다른 override 그룹의 숫자는 후보 축소에 사용하면 안 됩니다.');
useContracts(bloodySheet);
useRoomCharacters(bloodyRuntime.character);
bloodyMadnessAttribute.set('current', '1');
helper.scan(bloodyRuntime.character.id, true);
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
assert(bloodyStatus.content.includes('일반 | 실시간') && bloodyStatus.content.includes('일반 | 요약') &&
  !bloodyStatus.content.includes('펄프 |'),
  '일반 규칙이 활성화됐을 때 상태 화면에 비활성 펄프 광기 선택지를 섞으면 안 됩니다.');
bloodyMadnessAttribute.set('current', '3');
helper.scan(bloodyRuntime.character.id, true);
const bloodyPulpStatus = runApi('!!상태', bloodyRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼');
assert(bloodyPulpStatus && bloodyPulpStatus.content.includes('펄프 | 실시간') &&
  bloodyPulpStatus.content.includes('펄프 | 요약') && !bloodyPulpStatus.content.includes('일반 |'),
  '펄프 규칙이 활성화됐을 때 상태 화면에 비활성 일반 광기 선택지를 섞으면 안 됩니다.');
bloodyMadnessAttribute.set('current', '1');
helper.scan(bloodyRuntime.character.id, true);
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
assert(runApi('!!요약', publicRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('&{template:coc-bomadness-summ}')),
  '공식 시트의 일반 규칙에서는 현재 시대의 일반 요약 광기를 바로 실행해야 합니다.');
const publicPulpMadness = attributeObjects.find((item) =>
  item.get('_characterid') === publicRuntime.character.id && item.get('name') === 'pulp_bomtoggle');
assert(publicPulpMadness);
publicPulpMadness.set('current', '1');
helper.scan(publicRuntime.character.id, true);
assert(runApi('!!실시간', publicRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('&{template:coc-pulp-bomadness-rt}')),
  '공식 시트의 펄프 규칙에서는 일반이 아닌 펄프 실시간 광기를 바로 실행해야 합니다.');
assert(runApi('!!요약', publicRuntime.character.get('name')).some((item) =>
  item.content && item.content.includes('&{template:coc-pulp-bomadness-summ}')),
  '공식 시트의 펄프 규칙에서는 일반이 아닌 펄프 요약 광기를 바로 실행해야 합니다.');
publicPulpMadness.set('current', '');
helper.scan(publicRuntime.character.id, true);
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
  const sourceToken = message.content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
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

[
  ['근력', /^근력$/],
  ['감정', /^감정/],
  ['추적', /^추적/],
  ['회피', /^회피/],
].forEach(([query, labelPattern]) => {
  const source = helper.contractRolls(publicRuntime.character.id).find((instance) =>
    labelPattern.test(instance.label) && inlineRollFieldCount(instance.roll.raw) === 1);
  assert(source, '공식 시트의 현재 한국어 굴림을 찾지 못했습니다: ' + query);
  (source.roll.labelRefs || []).forEach((ref) => {
    const name = sourceRefName(ref);
    if (!name) return;
    let attribute = attributeObjects.find((item) =>
      item.get('_characterid') === publicRuntime.character.id && item.get('name') === name);
    if (!attribute) attribute = addAttribute(publicRuntime.character.id, name, source.label);
    else attribute.set('current', source.label);
    events['change:attribute'](attribute, { current: '' });
  });
  const labelNames = new Set((source.roll.labelRefs || []).map(sourceRefName).filter(Boolean));
  const numericNames = new Set();
  String(source.roll.raw || '').replace(/@\{([^}|]+)(?:\|max)?\}/g, (match, name) => {
    if (!labelNames.has(name)) numericNames.add(name);
    return match;
  });
  numericNames.forEach((name) => {
    let attribute = attributeObjects.find((item) =>
      item.get('_characterid') === publicRuntime.character.id && item.get('name') === name);
    if (!attribute) attribute = addAttribute(publicRuntime.character.id, name, '50');
    else if (String(attribute.get('current') || '').trim() === '') attribute.set('current', '50');
    events['change:attribute'](attribute, { current: '' });
  });
  const messages = runApi('!!' + query, publicRuntime.character.get('name'));
  const rolls = messages.filter((item) =>
    item.content && item.content.includes('kib_sheet_result='));
  assert.strictEqual(rolls.length, 1,
    '공식 시트의 ' + query + ' 굴림은 현재 보이는 원본 버튼을 한 번만 실행해야 합니다. ' +
      JSON.stringify(messages.map((item) => item.content)));
  assert.strictEqual(inlineRollFieldCount(rolls[0].content), 1,
    '옵션 없는 ' + query + ' 굴림은 원본의 기본 단일 주사위 버튼을 실행해야 합니다.');
  assert(rolls[0].content.includes('&{template:coc-1}') &&
    rolls[0].content.includes('{{name=' + source.label + '}}'),
  '공식 시트의 한국어 표시명과 기본 결과 템플릿을 그대로 사용해야 합니다: ' + query);
});
const publicStrengthBonus = runApi('!!근력 보너스1', publicRuntime.character.get('name'))
  .filter((item) => item.content && item.content.includes('kib_sheet_result='));
assert.strictEqual(publicStrengthBonus.length, 1,
  '공식 시트의 근력 보너스 굴림은 한 번만 실행해야 합니다.');
assert(inlineRollFieldCount(publicStrengthBonus[0].content) >= 3,
  '공식 시트의 보너스 명령은 원본의 통합 보너스·패널티 버튼을 실행해야 합니다.');

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

// Roll20는 attr_name_max 입력을 별도 Attribute가 아니라 name.max 숫자로 저장합니다.
const nativeSlotSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-f3665f982d39afe2');
const nativeSlotValues = {};
nativeSlotSheet.signature.forEach((entry) => {
  nativeSlotValues[typeof entry === 'string' ? entry : entry.name] = '1';
});
Object.assign(nativeSlotValues, { hp: '11', mp: '12', san: '50', san_start: '50', luck: '0' });
['hp_max', 'mp_max', 'san_max'].forEach((name) => { delete nativeSlotValues[name]; });
const nativeSlotCharacter = addCharacter('native-max-slots', '원본 최대값 저장 슬롯 시험', 'player-1', nativeSlotValues);
sheetFieldDefaults[nativeSlotCharacter.id] = sourceDefaults(nativeSlotSheet);
useContracts(nativeSlotSheet);
useRoomCharacters(nativeSlotCharacter);
[['hp', 11], ['mp', 12], ['san', 99]].forEach(([name, maximum]) => {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === nativeSlotCharacter.id && item.get('name') === name);
  attribute.set('max', maximum);
});
const nativeSlotResources = helper.scan(nativeSlotCharacter.id, true).resourcesByAttribute;
[['hp', 11], ['mp', 12], ['san', 99]].forEach(([name, maximum]) => {
  assert.strictEqual(nativeSlotResources[name].max, maximum,
    '별도 _max 속성이 없어도 실제 Attribute.max 숫자를 현재 자원 최대값으로 읽어야 합니다: ' + name);
});

const nativeLimitRuntime = addSourceCharacter(
  nativeLimitSheet,
  'source-native-limit',
  'HTML 입력 상한 공개 시트 시험',
);
const damageBonusAttribute = attributeObjects.find((item) =>
  item.get('_characterid') === nativeLimitRuntime.character.id && item.get('name') === 'Damage-Bonus') ||
  addAttribute(nativeLimitRuntime.character.id, 'Damage-Bonus', '0');
damageBonusAttribute.set('current', '0');
const nativeLimitResources = helper.scan(nativeLimitRuntime.character.id, true).resources
  .filter((item) => item.statusResource);
[
  ['HP', 15, null],
  ['MP', 9, null],
  ['Sanity', 45, 99],
].forEach(([name, value, maximum]) => {
  const item = nativeLimitResources.find((candidate) => candidate.name === name);
  assert(item && item.value === value && item.max === maximum,
    'HTML 입력 상한은 최대값으로 쓰지 않고 원본 명시 최대 필드는 보존해야 합니다: ' + name);
});
assert(!nativeLimitResources.some((item) => item.name === 'Damage-Bonus'),
  '인접 별칭이 섞인 피해 보너스를 현재/최대 자원 묶음으로 오인하면 안 됩니다.');
// 실제 원본 숫자 라디오 자원: 전체 임베드 유지, 선택 범위와 캐릭터 최대값은 분리합니다.
{
  const previousContracts = runtime.KIBSheetContracts.slice();
  const previousRoom = Array.from(roomCharacterIds || []);
  const previousTracking = runtime.state.KIBSheetHelper.trackingMode;
  const modeField = embeddedSheets[17].fields.find((field) => field.name === 'dice_type' && !field.section);
  assert(modeField && modeField.type === 'radio' && !modeField.numericCandidate && !modeField.radioRange,
    '실제 Blue29 1/2/3 기본·보너스·패널티 라디오는 숫자 자원이 아닙니다.');
  try {
    runtime.state.KIBSheetHelper.trackingMode = 'public';
    [[24, 0, 99], [31, -2, null], [32, -2, 99]].forEach(([sourceIndex, minimum, sanityMaximum]) => {
      const sheet = embeddedSheets[sourceIndex];
      const setup = addSourceCharacter(sheet, 'numeric-radio-' + sourceIndex, '숫자 라디오 ' + sourceIndex);
      const character = setup.character;
      sheetFieldDefaults[character.id] = sourceDefaults(sheet);
      function attribute(name) {
        return attributeObjects.find((item) => item.get('_characterid') === character.id && item.get('name') === name) ||
          addAttribute(character.id, name, '0');
      }
      ['HP', 'MP', 'Sanity'].forEach((name, index) => attribute(name).set('current', ['15', '9', '45'][index]));
      const untouched = attributeObjects.filter((item) => item.get('_characterid') === character.id &&
        !['HP', 'MP', 'Sanity'].includes(item.get('name')))
        .map((item) => [item, item.get('current'), item.get('max')]);
      useContracts(...embeddedSheets);
      useRoomCharacters(character);
      let data = helper.scan(character.id, true);
      assert.strictEqual(data.contractMatch.contract.id, sheet.id, '실제 원본과 다른 시트로 우회하면 안 됩니다.');
      ['HP', 'MP', 'Sanity'].forEach((name, index) => {
        const source = sheet.fields.find((field) => field.name === name && !field.section);
        const item = data.resourcesByAttribute[name];
        assert(item && item.statusResource && item.value === [15, 9, 45][index],
          sourceIndex + '/' + name + ': 숫자 라디오 현재값과 상태 항목이 필요합니다.');
        assert.deepStrictEqual(Array.from(item.radioRange), name === 'HP' ? [minimum, 37] : [0, name === 'MP' ? 37 : 99]);
        assert.strictEqual(item.max, name === 'Sanity' ? sanityMaximum : null,
          '라디오의 마지막 선택값을 자원 최대값으로 쓰면 안 됩니다: ' + name);
        const messages = runGeneral(':' + name + '-1', character.get('name'));
        assert.strictEqual(attribute(name).get('current'), String([14, 8, 44][index]));
        assert(messages.some((message) => (message.content || '').includes(item.label) &&
          (message.content || '').includes('→')), '현재값 변경 로그에 원본 자원 이름이 필요합니다.');
        assert.strictEqual(source.default, ['15', '9', '45'][index], '원본 초기 선택값 메타데이터를 수정하면 안 됩니다.');
      });
      data = helper.scan(character.id);
      assert.strictEqual(data.resources.filter((item) => item.statusResource).length, 3,
        '실제 자원 3개 외에 초기값/최대값을 독립 현재 자원으로 추가하면 안 됩니다.');
      const status = runApi('!!상태', character.get('name')).find((item) => item.who === '시트 헬퍼').content;
      assert(status.includes('현재 수치 3개'), 'PL 상태에서 숫자 라디오 자원 세 개를 보여야 합니다.');
      runGeneral(':HP=0', character.get('name'));
      assert.strictEqual(attribute('HP').get('current'), '0', '0은 체크 해제가 아니라 유효한 숫자 선택값입니다.');
      if (minimum < 0) {
        runGeneral(':HP-2', character.get('name'));
        assert.strictEqual(attribute('HP').get('current'), '-2', '원본에 있는 음수 HP는 0으로 clamp하면 안 됩니다.');
      }
      [':HP-1', ':HP=38', ':MP=1.5', ':MP=38'].forEach((command) => {
        const before = ['HP', 'MP', 'Sanity'].map((name) => attribute(name).get('current'));
        const messages = runGeneral(command, character.get('name'));
        assert.strictEqual(messages.filter((message) =>
          (message.content || '').includes('원본 시트에 없는 숫자 선택값')).length, 1,
        '저장 domain 오류는 삼키지 않고 사용자에게 한 번 반환해야 합니다: ' + command);
        assert.deepStrictEqual(['HP', 'MP', 'Sanity'].map((name) => attribute(name).get('current')), before);
        assert(!messages.some((message) => (message.content || '').includes('→')),
          '거부된 숫자 선택값을 성공 변경 로그로 남기면 안 됩니다.');
      });
      assert.strictEqual(attributeObjects.filter((item) => item.get('_characterid') === character.id).length,
        untouched.length + 3, '원본에 없는 자동화/최대/worker 속성을 새로 만들면 안 됩니다.');
      untouched.forEach(([item, current, maximum]) => {
        assert.strictEqual(item.get('current'), current, '초기값/checkbox/계산 의존값이 변경되었습니다: ' + item.get('name'));
        assert.strictEqual(item.get('max'), maximum, '기존 Attribute.max를 덮어쓰면 안 됩니다.');
      });
    });
  } finally {
    runtime.state.KIBSheetHelper.trackingMode = previousTracking;
    useContracts(...previousContracts);
    useRoomCharacters(...previousRoom);
  }
}

const nativeLimitStatus = runApi('!!상태', nativeLimitRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
['Idea', 'Luck'].forEach((label) => {
  assert(nativeLimitSheet.rolls.some((roll) => roll.name === label &&
    (roll.staticLabels || []).some((entry) => entry.field === 'header' && entry.value === label)),
  '실제 공개 시트의 버튼 키와 같은 원본 header 증거가 필요합니다: ' + label);
  assert(new RegExp('>' + label + '(?: <b>[^<]+</b>)?</span>').test(nativeLimitStatus),
    '버튼 키와 같아도 원본 header가 명시한 판정은 상태에서 숨기면 안 됩니다: ' + label);
});
['INT', 'POW', 'EDU', 'DEX', 'Active', 'Passive'].forEach((name) => {
  const attribute = attributeObjects.find((item) =>
    item.get('_characterid') === nativeLimitRuntime.character.id && item.get('name') === name) ||
    addAttribute(nativeLimitRuntime.character.id, name, '10');
  attribute.set('current', '10');
});
helper.scan(nativeLimitRuntime.character.id, true);
const nativeDerivedStatus = runApi('!!상태', nativeLimitRuntime.character.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
const nativeDerivedMissing = [
  ['Idea', 50], ['Luck', 50], ['Know', 50], ['Resistance Roll', 50], ['Dodge (DEX x2)', 20],
].filter(([label, value]) => !nativeDerivedStatus.includes('>' + label + ' <b>' + value + '</b></span>'));
assert.strictEqual(nativeDerivedMissing.length, 0,
  '원본 중첩 inline 산술 기준은 상태에 계산된 수치로 표시해야 합니다: ' + JSON.stringify(nativeDerivedMissing));

// 실제 23번의 원본 섹션/굴림은 그대로 두고 Roll20의 소문자 저장 접두사만 읽습니다.
const sectionCaseSourceBefore = JSON.stringify(nativeLimitSheet);
const sectionCaseAttributeStart = attributeObjects.length;
const sectionCaseRuntime = addSourceCharacter(nativeLimitSheet, 'source-section-case', '반복 접두사 시험');
const sectionCaseCharacter = sectionCaseRuntime.character;
const sectionCaseRows = [
  { section: 'Skills', physical: 'skills', id: '-LowerA', name: 'Skillname', label: '접두사 기능', score: '47' },
  { section: 'Hand-to-Hand', physical: 'hand-to-hand', id: '-Melee', name: 'Attack-Weapon', label: '접두사 근접', score: '41', damage: '1d6' },
  { section: 'Firearms', physical: 'firearms', id: '-Ranged', name: 'Firearm', label: '접두사 원거리', score: '52', damage: '1d8' },
  { section: 'Skills', physical: 'skills', id: '-LowerB', name: 'Skillname', label: '정렬 두번째', score: '39' },
  { section: 'Skills', physical: 'Skills', id: '-Canonical', name: 'Skillname', label: '원본 접두사', score: '31' },
  { section: 'Skills', physical: 'skills', id: '-CaseID', name: 'Skillname', label: '큰 행 ID', score: '13' },
  { section: 'Skills', physical: 'skills', id: '-caseid', name: 'Skillname', label: '작은 행 ID', score: '27' },
  { section: 'Skills', physical: 'Skills', id: '-Shared', name: 'Skillname', label: '원본 충돌 행', score: '33' },
  { section: 'Skills', physical: 'skills', id: '-Shared', name: 'Skillname', label: '소문자 충돌 행', score: '99' },
  { section: 'Skills', physical: 'skills', id: '-Suffix', name: 'Skillname', label: '접미사 보호', score: '' },
  { section: 'Skills', physical: 'SKILLS', id: '-Unlisted', name: 'Skillname', label: '임의 대문자 접두사', score: '88' },
];
function sectionCaseAttribute(name) {
  return attributeObjects.find((item) =>
    item.get('_characterid') === sectionCaseCharacter.id && item.get('name') === name);
}
helper.scan(sectionCaseCharacter.id);
sectionCaseRows.forEach((row) => {
  const prefix = 'repeating_' + row.physical + '_' + row.id + '_';
  nativeLimitSheet.sections['repeating_' + row.section].forEach((name) => {
    addAttribute(sectionCaseCharacter.id, prefix + name,
      name === row.name ? row.label : name === 'Score' ? row.score : name === 'Damage' ? row.damage || '0' : '');
  });
});
addAttribute(sectionCaseCharacter.id, 'repeating_skills_-Suffix_score', '99');
addAttribute(sectionCaseCharacter.id, 'Score', '88');
addAttribute(sectionCaseCharacter.id, '_reporder_repeating_skills',
  '-LowerB,-LowerA,-LowerB,-CaseID,-caseid,-Shared,-Suffix,missing');
sectionCaseAttribute('_reporder_repeating_Skills').set('current', '-Canonical,-Canonical,-Shared,missing');
events['change:attribute'](sectionCaseAttribute('_reporder_repeating_Skills'), { current: 'sourceRow' });
const sectionCaseSkillRoll = nativeLimitSheet.rolls.find((roll) =>
  roll.repeating && roll.repeating.section === 'repeating_Skills');
const sectionCaseInstances = helper.contractRolls(sectionCaseCharacter.id);
sectionCaseRows.slice(0, 3).forEach((row) => {
  const name = 'repeating_' + row.physical + '_' + row.id + '_Score';
  const scanned = helper.scan(sectionCaseCharacter.id).contractRolls.find((item) =>
    item.row && item.row.id === row.id && item.label === row.label);
  assert(scanned && scanned.row.values.Score === row.score && scanned.row.refs.Score === name,
    '소문자 저장 행도 원본 필드의 실제 수치로 읽어야 합니다: ' + row.section);
  const before = sent.length;
  const result = helper.resolveContractAction(sectionCaseCharacter, row.label, false);
  assert(result.handled && result.result.ok, '원본 대문자 계약으로 소문자 행을 실행해야 합니다: ' + row.section);
  assert(sent.slice(before).some((item) => item.content &&
    item.content.includes('{{header=' + row.label + '}}') && item.content.includes('{{stat=[[' + row.score + ']]}}')),
  '실제 행의 표시명/판정값을 원본 stats 식에 넣어야 합니다: ' + row.section);
  if (row.damage) {
    const damageRoll = nativeLimitSheet.rolls.find((roll) => roll.repeating &&
      roll.repeating.section === 'repeating_' + row.section && roll.raw.includes('{{damage='));
    const damageStart = sent.length;
    assert(helper.executeContract(sectionCaseCharacter.id, nativeLimitSheet.id, damageRoll.key, row.id, '', false, '').ok);
    assert(sent.slice(damageStart).some((item) => item.content && item.content.includes('{{damage=[[' + row.damage + ']]}}')),
      '공격과 별도인 원본 피해 굴림도 같은 실제 행을 읽어야 합니다: ' + row.section);
  }
});
const sectionCaseSkillRows = sectionCaseInstances.filter((item) => item.roll.key === sectionCaseSkillRoll.key);
assert.deepStrictEqual(Array.from(sectionCaseSkillRows.filter((item) =>
  ['-LowerA', '-LowerB', '-CaseID', '-caseid'].includes(item.row.id)), (item) => item.row.id),
['-LowerB', '-LowerA', '-LowerB', '-CaseID', '-caseid'],
'소문자 reporder 순서·중복은 보존하고 대소문자가 다른 행 ID는 별개여야 합니다.');
assert.strictEqual(sectionCaseSkillRows.filter((item) => item.row.id === '-Canonical').length, 2,
  '원본 접두사의 별도 reporder 중복도 유지해야 합니다.');
['-CaseID', '-caseid'].forEach((rowId) => {
  const exact = helper.exactContractInstance(sectionCaseCharacter.id, nativeLimitSheet.id, sectionCaseSkillRoll.key, rowId, false);
  assert(exact.ok && exact.instance.row.id === rowId, '정확 행 ID의 대소문자를 바꾸면 안 됩니다: ' + rowId);
});
assert(!sectionCaseInstances.some((item) => item.row && ['-Shared', '-Unlisted'].includes(item.row.id)),
  '물리 접두사가 충돌한 동일 행 ID와 허용하지 않은 대문자 별칭은 실행 후보에서 제외해야 합니다.');
assert(!helper.executeContract(sectionCaseCharacter.id, nativeLimitSheet.id, sectionCaseSkillRoll.key, '-Shared', '', false, '').ok,
  '서로 다른 접두사의 동일 ID는 저장된 직접 실행 링크로도 임의 선택하면 안 됩니다.');
['Skills', 'skills'].forEach((physical) => {
  [['Skillname', '동일 충돌 행'], ['Score', '33']].forEach(([name, value]) => {
    const attribute = sectionCaseAttribute('repeating_' + physical + '_-Shared_' + name);
    const previous = attribute.get('current');
    attribute.set('current', value);
    events['change:attribute'](attribute, { current: previous });
  });
});
assert(!helper.contractRolls(sectionCaseCharacter.id).some((item) => item.row && item.row.id === '-Shared') &&
  !helper.executeContract(sectionCaseCharacter.id, nativeLimitSheet.id, sectionCaseSkillRoll.key, '-Shared', '', false, '').ok,
'이름과 값이 같아져도 물리 접두사 두 개의 동일 ID는 하나로 합치거나 임의 선택하면 안 됩니다.');
const suffixStart = sent.length;
const suffixResult = helper.resolveContractAction(sectionCaseCharacter, '접미사 보호', false);
assert(suffixResult.handled && !suffixResult.result.ok &&
  !sent.slice(suffixStart).some((item) => item.content && item.content.includes('kib_sheet_result=')),
'소문자 score나 전역 Score를 원본 행의 Score 대신 쓰면 안 됩니다.');
const sectionCaseCached = helper.scan(sectionCaseCharacter.id);
const sectionCaseScore = sectionCaseAttribute('repeating_skills_-LowerA_Score');
sectionCaseScore.set('current', '63');
events['change:attribute'](sectionCaseScore, { current: '47' });
const sectionCaseChanged = helper.scan(sectionCaseCharacter.id);
assert.notStrictEqual(sectionCaseChanged, sectionCaseCached,
  '소문자 행 필드 변경 이벤트가 기존 캐시를 무효화해야 합니다.');
assert.strictEqual(sectionCaseChanged.contractRolls.find((item) => item.row && item.row.id === '-LowerA').row.values.Score, '63');
const sectionCaseTitle = sectionCaseAttribute('repeating_skills_-LowerA_Skillname');
sectionCaseTitle.set('current', '변경된 조사');
events['change:attribute'](sectionCaseTitle, { current: '접두사 기능' });
assert(!helper.contractRolls(sectionCaseCharacter.id).some((item) => item.label === '접두사 기능'));
const sectionCaseChangedStart = sent.length;
assert(helper.resolveContractAction(sectionCaseCharacter, '변경된 조사', false).result.ok);
assert(sent.slice(sectionCaseChangedStart).some((item) => item.content && item.content.includes('{{stat=[[63]]}}')));
const sectionCaseOrder = sectionCaseAttribute('_reporder_repeating_skills');
sectionCaseOrder.set('current', '-LowerA,-LowerB,-CaseID,-caseid');
events['change:attribute'](sectionCaseOrder, { current: '-LowerB,-LowerA,-LowerB,-CaseID,-caseid,-Shared,-Suffix,missing' });
assert.deepStrictEqual(Array.from(helper.contractRolls(sectionCaseCharacter.id).filter((item) =>
  item.roll.key === sectionCaseSkillRoll.key && ['-LowerA', '-LowerB'].includes(item.row.id)), (item) => item.row.id),
['-LowerA', '-LowerB'], '소문자 reporder 변경 이벤트도 원본 행 정렬에 반영해야 합니다.');
attributeObjects.filter((item) => item.get('_characterid') === sectionCaseCharacter.id &&
  item.get('name').startsWith('repeating_skills_-LowerA_')).forEach((attribute) => {
  attributeObjects.splice(attributeObjects.indexOf(attribute), 1);
  events['destroy:attribute'](attribute);
});
assert(!helper.contractRolls(sectionCaseCharacter.id).some((item) => item.row && item.row.id === '-LowerA'),
  '소문자 행 삭제 뒤 정렬에 남은 유령 ID를 다시 만들면 안 됩니다.');
getAttrByNameOverrides[sectionCaseCharacter.id + '|repeating_skills_$0_Score|current'] = '47';
addAttribute(sectionCaseCharacter.id, 'repeating_skills_-Sparse_Skillname', '소문자 기본값 행');
sectionCaseOrder.set('current', '-Sparse');
events['change:attribute'](sectionCaseOrder, { current: '-LowerA,-LowerB,-CaseID,-caseid' });
const sectionCaseSparse = helper.contractRolls(sectionCaseCharacter.id).find((item) => item.row && item.row.id === '-Sparse');
assert(sectionCaseSparse && sectionCaseSparse.row.refs.Score === 'repeating_skills_$0_Score' &&
  sectionCaseSparse.row.values.Score === '47', '저장되지 않은 형제 필드는 실제 소문자 접두사의 $순번 기본값을 읽어야 합니다.');
const sectionCaseSparseMacro = helper.qualifyContractMacro(sectionCaseCharacter.id, sectionCaseSparse, null);
assert(sectionCaseSparseMacro.ok && sectionCaseSparseMacro.content.includes('{{stat=[[47]]}}'),
  '소문자 행의 기본값은 전역 Score나 원본 대문자 접두사로 새면 안 됩니다.');
delete getAttrByNameOverrides[sectionCaseCharacter.id + '|repeating_skills_$0_Score|current'];
assert.strictEqual(JSON.stringify(nativeLimitSheet), sectionCaseSourceBefore,
  '행 인식을 위해 실제 임베드 계약의 섹션·원식·키를 소문자로 바꾸면 안 됩니다.');
characters.splice(characters.indexOf(sectionCaseCharacter), 1);
attributeObjects.splice(sectionCaseAttributeStart);

// 원본에 대소문자만 다른 두 섹션이 있으면 별칭을 만들지 않고 정확한 이름만 사용합니다.
['skills', 'SKILLS'].forEach((otherSection) => {
  const sourceSections = ['Skills', otherSection];
  const contract = parseSheetContract(sourceSections.map((section) =>
    '<fieldset class="repeating_' + section + '"><input name="attr_Title"><input name="attr_Score">' +
    '<button type="roll" value="&{template:section_case} {{subject=@{Title}}} {{success=[[@{Score}]]}} {{roll=[[1d100]]}}"></button></fieldset>'
  ).join('\n'), { id: 'case-section-collision-' + otherSection, sourceHash: 'case-section-collision-' + otherSection });
  const start = attributeObjects.length;
  const values = {};
  sourceSections.forEach((section, index) => {
    values['repeating_' + section + '_-Exact_Title'] = '정확 섹션 ' + index;
    values['repeating_' + section + '_-Exact_Score'] = String(41 + index);
  });
  if (otherSection === 'SKILLS') {
    values['repeating_skills_-Alias_Title'] = '모호한 소문자';
    values['repeating_skills_-Alias_Score'] = '99';
  }
  const character = addCharacter('section-collision-' + otherSection, '섹션 소유권 ' + otherSection, 'player-1', values);
  useContracts(contract);
  useRoomCharacters(character);
  const instances = helper.contractRolls(character.id);
  assert.deepStrictEqual(Array.from(instances, (item) => item.label).sort(), ['정확 섹션 0', '정확 섹션 1'],
    'case-only 원본 섹션 둘은 같은 ID여도 독립이며 모호한 lowercase 별칭은 만들면 안 됩니다.');
  instances.forEach((instance) => {
    const qualified = helper.qualifyContractMacro(character.id, instance, null);
    const score = instance.label === '정확 섹션 0' ? 41 : 42;
    assert(qualified.ok && qualified.content.includes('{{success=[[' + score + ']]}}'),
      '원본 exact 섹션별 값은 서로 섞이면 안 됩니다.');
  });
  characters.splice(characters.indexOf(character), 1);
  attributeObjects.splice(start);
});

// 원본 행 조건/수식은 별칭의 실제 접두사와 원본 기본값을 함께 사용해야 합니다.
const sectionScopeSheet = parseSheetContract([
  '<fieldset class="repeating_CaseRow"><input name="attr_Title">',
  '<input class="case-visible" type="checkbox" name="attr_Show" value="1">',
  '<label>원시 값<input type="number" name="attr_Score" value="1"></label>',
  '<label>보정<input type="number" name="attr_Bonus" value="3"></label>',
  '<div class="case-values"><label>합계<input type="text" name="attr_Total" value="@{Score}+@{Bonus}"></label></div>',
  '<button type="roll" value="&{template:section_scope} {{subject=@{Title}}} {{success=[[@{Total}]]}} {{roll=[[1d100]]}}"></button></fieldset>',
].join('\n'), { id: 'section-row-context', sourceHash: 'section-row-context-v1',
  css: '.case-values{display:none}.case-visible[value="1"]:checked ~ .case-values{display:block}' });
const sectionScopeStart = attributeObjects.length;
assert(sectionScopeSheet.fields.find((field) => field.name === 'Total').visibility,
  '행별 조건 검사는 원본 CSS에서 읽은 실제 visibility 조건이 있어야 합니다.');
const sectionScopeCharacter = addCharacter('section-row-context', '행별 수식·표시 조건', 'player-1', {
  Score: '88', Bonus: '90', Show: '1',
  'repeating_caserow_-Context_Title': '별칭 수식', 'repeating_caserow_-Context_Show': '1',
  'repeating_caserow_-Context_Score': '47', 'repeating_caserow_-Context_Total': '@{Score}+@{Bonus}',
});
useContracts(sectionScopeSheet);
useRoomCharacters(sectionScopeCharacter);
const sectionScopeName = 'repeating_caserow_-Context_Total';
const sectionScopeVisible = helper.scan(sectionScopeCharacter.id).resourcesByAttribute[sectionScopeName];
assert(sectionScopeVisible && sectionScopeVisible.value === 50,
  '별칭 행 수식은 실제 행 Score47과 원본 미저장 Bonus3을 쓰고 전역88/90을 읽으면 안 됩니다.');
const sectionScopeToggle = attributeObjects.find((item) => item.get('_characterid') === sectionScopeCharacter.id &&
  item.get('name') === 'repeating_caserow_-Context_Show');
sectionScopeToggle.set('current', '0');
events['change:attribute'](sectionScopeToggle, { current: '1' });
assert(!helper.scan(sectionScopeCharacter.id).resourcesByAttribute[sectionScopeName],
  '행 Show0은 전역 Show1이나 원본 대문자 접두사 대신 실제 별칭 행에서 읽어야 합니다.');
sectionScopeToggle.set('current', '1');
events['change:attribute'](sectionScopeToggle, { current: '0' });
assert.strictEqual(helper.scan(sectionScopeCharacter.id).resourcesByAttribute[sectionScopeName].value, 50,
  '별칭 행 표시 복구 이벤트 후에도 동일한 행 수식을 다시 읽어야 합니다.');
characters.splice(characters.indexOf(sectionScopeCharacter), 1);
attributeObjects.splice(sectionScopeStart);
useContracts(nativeLimitSheet);
useRoomCharacters(nativeLimitRuntime.character);

// 배포본에 들어간 모든 실제 시트도 시트 화면에서 직접 누른 rolltemplate 결과를
// 명령 굴림과 같은 판정 컷인 키로 전달해야 합니다.
embeddedSheets.forEach((sheet, index) => {
  const directRuntime = addSourceCharacter(
    sheet,
    'direct-source-' + index,
    '직접 굴림 시험 ' + index,
  );
  const directInstances = helper.contractRolls(directRuntime.character.id);
  assert(!directInstances.some((item) => item.label === 'false'),
    sheet.id + ': 내부 boolean 값을 굴림 표시명으로 노출하면 안 됩니다.');
  const instance = directInstances.find((item) =>
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

// 같은 원본 실행을 여러 화면 위치에서 다른 이름으로 보여 주는 시트는 상태에서만
// 하나로 합치되, 원본 식·선택 방식·반복 구역/행이 다른 항목은 그대로 보존합니다.
const statusFingerprintRaw =
  '&{template:status-fingerprint} {{subject=@{probe_name}}} {{success=[[@{probe_value}]]}} {{roll=[[1d100]]}}';
const statusFingerprintSheet = parseSheetContract([
  '<input name="attr_status_marker_a"><input name="attr_status_marker_b"><input name="attr_status_marker_c">',
  '<input name="attr_probe_name"><input name="attr_probe_value">',
  '<div><p>동일 실행 (설명)</p><button type="roll" value="' + statusFingerprintRaw + '"></button></div>',
  '<div><strong>동일 실행</strong><button type="roll" value="' + statusFingerprintRaw + '"></button></div>',
  '<div><p>다른 식</p><button type="roll" value="&{template:status-fingerprint} {{subject=다른 식}} {{roll=[[1d6]]}}"></button></div>',
  '<div><strong>다른 식</strong><button type="roll" value="&{template:status-fingerprint} {{subject=다른 식}} {{roll=[[1d8]]}}"></button></div>',
  '<div><p>한 기능</p><button type="roll" name="roll_same_action" value="&{template:status-fingerprint} {{subject=한 기능}} {{roll=[[1d100]]}}"></button><button type="roll" name="roll_same_action" value="&{template:status-fingerprint-compact} {{subject=한 기능}} {{roll=[[1d100]]}}"></button></div>',
  '<fieldset class="repeating_named"><input name="attr_roll_title"><input name="attr_roll_value"><button type="roll" value="&{template:status-fingerprint} {{character_name=@{character_name}}} {{subject=@{roll_title}}} {{roll=[[@{roll_value}]]}}"></button></fieldset>',
  '<div><p>다른 모드 A</p><button type="roll" value="&{template:status-fingerprint} {{subject=다른 모드}} {{roll=[[1d100]]}}"></button></div>',
  '<div><strong>다른 모드 B</strong><button type="roll" value="&{template:status-fingerprint} {{subject=다른 모드}} {{roll=[[1d100]]}}"></button></div>',
  '<fieldset class="repeating_probe_a"><input name="attr_probe_name"><input name="attr_probe_value"><button type="roll" value="' + statusFingerprintRaw + '"></button></fieldset>',
  '<fieldset class="repeating_probe_b"><input name="attr_probe_name"><input name="attr_probe_value"><button type="roll" value="' + statusFingerprintRaw + '"></button></fieldset>',
].join('\n'), { id: 'status-fingerprint', name: '상태 실행 식별 시험' });
const statusModeRolls = statusFingerprintSheet.rolls.filter((roll) => /^다른 모드 [AB]$/.test(roll.label));
assert.strictEqual(statusModeRolls.length, 2, '선택 방식 식별 반례를 만들지 못했습니다.');
statusModeRolls[0].modes = [{ id: 'status-mode-a', labelPath: ['방식 A'], overrides: {} }];
statusModeRolls[1].modes = [{ id: 'status-mode-b', labelPath: ['방식 B'], overrides: {} }];
useContracts(statusFingerprintSheet);
const statusFingerprintCharacter = addCharacter('status-fingerprint-character', '상태 실행 식별 시험', 'player-1', {
  status_marker_a: '1', status_marker_b: '1', status_marker_c: '1',
  character_name: '빈 행 대체 이름',
  probe_name: '동일 실행', probe_value: '25',
  repeating_named_blank_roll_value: '25',
  repeating_named_filled_roll_title: '사용자 추가 기능', repeating_named_filled_roll_value: '30',
  _reporder_repeating_named: 'blank,filled',
  repeating_probe_a_shared_probe_name: '반복 A 공유', repeating_probe_a_shared_probe_value: '25',
  repeating_probe_a_other_probe_name: '반복 A 별도', repeating_probe_a_other_probe_value: '25',
  _reporder_repeating_probe_a: 'shared,other',
  repeating_probe_b_shared_probe_name: '반복 B 공유', repeating_probe_b_shared_probe_value: '25',
  _reporder_repeating_probe_b: 'shared',
});
useRoomCharacters(statusFingerprintCharacter);
const statusFingerprint = runApi('!!상태', statusFingerprintCharacter.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
assert.strictEqual((statusFingerprint.match(/동일 실행/g) || []).length, 1,
  '같은 실행과 선택 방식을 가진 다른 표시 라벨은 상태에서 하나로 합쳐야 합니다.');
assert.strictEqual((statusFingerprint.match(/다른 식/g) || []).length, 2,
  '표시 라벨이 같아도 원본 식이 다르면 상태 항목을 합치면 안 됩니다.');
assert.strictEqual((statusFingerprint.match(/한 기능/g) || []).length, 1,
  '같은 이름의 일반·간략 버튼은 상태에서 한 기능으로 합쳐야 합니다.');
assert(statusFingerprint.includes('사용자 추가 기능') && !statusFingerprint.includes('빈 행 대체 이름'),
  '이름 없는 반복행은 캐릭터 이름으로 대신 표시하지 말고, 이름을 입력한 행만 보여야 합니다.');
assert(statusFingerprint.includes('다른 모드 A') && statusFingerprint.includes('다른 모드 B'),
  '원본 식이 같아도 선택 방식이 다르면 상태 항목을 합치면 안 됩니다.');
['반복 A 공유', '반복 A 별도', '반복 B 공유'].forEach((label) => {
  assert(statusFingerprint.includes(label),
    '원본 식이 같아도 반복 구역이나 행이 다르면 상태 항목을 합치면 안 됩니다: ' + label);
});

// 번역 파일이 없는 한글 원본도 그 원본의 표시명과 식으로 실행해야 합니다.
// 지원 목록에서 원본을 뺀 반례는 공통 기본값 때문에 프랑스어 APP로 오인되던 경로입니다.
const westernEuroSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-f3665f982d39afe2');
assert(westernEuroSheet, '웨스턴유로 원본 인식 정보가 누락되었습니다.');
const westernEuroRuntime = addSourceCharacter(
  westernEuroSheet, 'western-euro-source-character', '한글 원본 인식 시험');
sheetFieldDefaults[westernEuroRuntime.character.id] = sourceDefaults(westernEuroSheet);
useContracts(...embeddedSheets.filter((sheet) => sheet.id !== westernEuroSheet.id));
useRoomCharacters(westernEuroRuntime.character);
const unsupportedWestern = helper.inspectContracts(westernEuroRuntime.character.id);
assert.notStrictEqual(unsupportedWestern.status, 'matched',
  '지원하지 않는 원본을 공통 기본값만으로 다른 시트로 확정하면 안 됩니다: ' +
    (unsupportedWestern.contract && unsupportedWestern.contract.id));
assert(!helper.contractRolls(westernEuroRuntime.character.id).some((roll) =>
  roll.aliases.includes('APP')), '지원하지 않는 원본에서 다른 시트의 APP 굴림을 제공하면 안 됩니다.');

useContracts(...embeddedSheets);
useRoomCharacters(westernEuroRuntime.character);
const westernEuroInspection = helper.inspectContracts(westernEuroRuntime.character.id);
assert.strictEqual(westernEuroInspection.status, 'matched');
assert.strictEqual(westernEuroInspection.contract.id, westernEuroSheet.id);

// 실제 시트 기본값만 있는 새 캐릭터도 상태에서는 일반/보너스 버튼을
// 같은 항목으로 보여야 합니다. 명령 실행 성공만으로 상태 분류를 대신 검증하지 않습니다.
const westernEuroBlank = addCharacter('western-euro-blank-status', '웨스턴유로 빈 상태 시험', 'player-1', {});
sheetFieldDefaults[westernEuroBlank.id] = sourceDefaults(westernEuroSheet);
useRoomCharacters(westernEuroBlank);
function westernEuroStatusGroups(character) {
  const content = runApi('!!상태', character.get('name'))
    .find((item) => item.who === '시트 헬퍼').content;
  const headings = Array.from(content.matchAll(/font-weight:bold">([^<]+)<\/div>/g));
  return Object.fromEntries(headings.map((heading, index) => [
    heading[1].replace(/ \d+개$/, ''),
    Array.from(content.slice(heading.index, headings[index + 1] ? headings[index + 1].index : content.length)
      .matchAll(/<span style="display:inline-block;margin:0 8px 3px 0">([^<]*)/g), (match) => match[1].trim()),
  ]));
}
const westernBlankGroups = westernEuroStatusGroups(westernEuroBlank);
const westernCharacteristics = ['근력', '건강', '크기', '민첩성', '외모', '교육', '지능', '정신력'];
assert.deepStrictEqual(westernBlankGroups['특성치'].slice().sort(), westernCharacteristics.slice().sort(),
  '웨스턴유로의 일반/보너스 특성치 버튼은 상태에서 각각 한 번만 보여야 합니다.');
const westernFixedNames = Array.from(new Set(westernEuroSheet.rolls.flatMap((roll) =>
  (roll.staticLabels || []).filter((label) => label.field === 'subject').map((label) => label.value))));
assert.strictEqual(westernFixedNames.length, 63, '실제 웨스턴유로의 고유 고정 판정명 수가 달라졌습니다.');
assert.deepStrictEqual(westernBlankGroups['기능 / 판정'].slice().sort(),
  westernFixedNames.filter((label) => !westernCharacteristics.includes(label)).sort(),
  '간접 다이스 필드의 1d100과 결과 규칙을 읽어 모든 기능을 한 번씩 기능 / 판정에 보여야 합니다.');
assert.deepStrictEqual(westernBlankGroups['무기'], ['비무장'],
  '읽기 전용 원본 무기 이름을 툴팁보다 우선하고 일반/보너스 버튼을 하나로 보여야 합니다.');
assert.strictEqual(westernBlankGroups['광기'].length, 2,
  '실시간/요약 광기는 서로 다른 원본 판정으로 보존해야 합니다.');
assert(!westernBlankGroups['기타 주사위'], '웨스턴유로 기능을 기타 주사위에 섞으면 안 됩니다.');

const westernCutinReadStart = getAttrByNameCalls.length;
const westernCutinCatalog = helper.cutinItems();
assert.strictEqual(getAttrByNameCalls.length, westernCutinReadStart,
  '웨스턴유로 컷인 목록도 현재 상태 스캔을 재사용해야 합니다.');
assert.strictEqual(westernCutinCatalog.length, 129,
  '표시 이름을 고치면서 원본 일반/보너스 컷인 연결 항목을 합치거나 삭제하면 안 됩니다.');
assert.strictEqual(crypto.createHash('sha256').update(JSON.stringify(
  Array.from(westernCutinCatalog, (item) => item.key).sort())).digest('hex'),
'bc0b6b3c0cddad8c55af6c1fcaf7b4ebc0cc6a93a61fe64b27c6fc16608155dc',
'수정 전 웨스턴유로의 컷인 키 129개를 모두 그대로 보존해야 합니다.');
westernFixedNames.filter((label) => label !== '이성').concat('비무장').forEach((label) => {
  const items = westernCutinCatalog.filter((item) => item.label === label);
  assert.strictEqual(items.length, 2, '원본 이름과 두 개별 실행 키를 보존해야 합니다: ' + label);
  helper.scan(westernEuroBlank.id).contractRolls.filter((instance) => instance.label === label).forEach((instance) => {
    const sourceLabel = instance.roll.aliases[0] || instance.roll.label;
    assert.notStrictEqual(sourceLabel, label, '실제 원본 버튼의 구분 표시명이 누락되었습니다: ' + label);
    assert(items.some((item) => item.displayLabel && item.displayLabel.includes(sourceLabel)),
      '동명 컷인 옵션은 원본 버튼의 실제 표시명으로 구분해야 합니다: ' + label + ' / ' + sourceLabel);
  });
});

// 같은 표시명이라도 다른 반복행은 각각 남겨야 하고, 각 행의 두 버튼만 묶습니다.
['first', 'second'].forEach((row, index) => {
  addAttribute(westernEuroBlank.id, 'repeating_other_weapon_' + row + '_other_weapon_title', '사용자 무기 기능');
  addAttribute(westernEuroBlank.id, 'repeating_other_weapon_' + row + '_other_weapon', String(41 + index));
});
addAttribute(westernEuroBlank.id, '_reporder_repeating_other_weapon', 'first,second');
const westernRepeatedGroups = westernEuroStatusGroups(westernEuroBlank);
assert.strictEqual(Object.values(westernRepeatedGroups).flat().filter((label) => label === '사용자 무기 기능').length, 2,
  '동명이인 반복행을 합치거나 각 행의 일반/보너스 버튼을 중복 표시하면 안 됩니다.');

useRoomCharacters(westernEuroRuntime.character);
[['외모', 'app', '63'], ['감정', 'appraise', '42'], ['근력', 'str', '71'], ['비무장', 'fighting_brawl', '58']]
  .forEach(([label, name, value]) => {
  addAttribute(westernEuroRuntime.character.id, name, value);
  ['', ' 보너스1', ' 보너스2', ' 패널티1', ' 패널티2'].forEach((suffix) => {
    const messages = runApi('!!' + label + suffix, westernEuroRuntime.character.get('name'));
    const rolls = messages.filter((message) => (message.content || '').includes('kib_sheet_result='));
    assert.strictEqual(rolls.length, 1, '한글 명령을 선택 질문 없이 한 번 실행해야 합니다: ' + label + suffix);
    assert(rolls[0].content.includes('{{subject=' + label + '}}') &&
      rolls[0].content.includes('{{success=[[0+' + value + ']]}}'),
    '원본 한글 이름과 현재값을 전송해야 합니다: ' + label + suffix);
    assert(rolls[0].content.includes(suffix ? '&{template:coc}' : '&{template:coc-short}'),
      '일반/보너스·패널티에 해당하는 원본 템플릿을 전송해야 합니다: ' + label + suffix);
    assert(rolls[0].content.includes('{{roll1=[[1d100]]}}') &&
      (suffix ? rolls[0].content.includes('{{roll5=[[1d100]]}}') : !rolls[0].content.includes('{{roll2=')),
    '원본 주사위 식을 빠짐없이 전송해야 합니다: ' + label + suffix);
  });
});

// 상태/수동 명령과 자동 지능은 같은 원본 일반 버튼을 골라야 합니다.
// 실제 웨스턴유로의 간접 템플릿과 roll1 결과를 끝까지 사용합니다.
const westernAutoCharacter = addCharacter('western-euro-auto-sanity', '웨스턴유로 자동 광기 시험', 'player-1', {
  san: '50', san_start: '50', int: '60', temp_insane: '0', indef_insane: '0',
});
sheetFieldDefaults[westernAutoCharacter.id] = sourceDefaults(westernEuroSheet);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
function westernAutoAttribute(name) {
  return attributeObjects.find((item) => item.get('_characterid') === westernAutoCharacter.id && item.get('name') === name);
}
[40, 80].forEach((total) => {
  westernAutoAttribute('san').set('current', '50');
  westernAutoAttribute('temp_insane').set('current', '0');
  helper.scan(westernAutoCharacter.id, true);
  const messages = runGeneral(':이성-5', westernAutoCharacter.get('name'));
  const automaticRolls = intelligenceRolls(messages);
  assert.strictEqual(automaticRolls.length, 1,
    '웨스턴유로 이성 5 감소의 자동 지능은 두 버튼 충돌 없이 한 번 실행해야 합니다.');
  assert.strictEqual(westernAutoAttribute('san').get('current'), '45');
  assert.strictEqual(westernAutoAttribute('temp_insane').get('current'), '0',
    '원본 지능 결과가 도착하기 전에는 일시적 광기를 체크하면 안 됩니다.');
  const content = automaticRolls[0].content;
  assert(content.includes('&{template:coc-short}') && content.includes('{{success=[[0+60]]}}') &&
    content.includes('{{roll1=[[1d100]]}}') && !content.includes('{{roll2='),
  '자동 지능도 현재 지능값을 쓰는 원본 단일 일반 버튼을 실행해야 합니다.');
  const token = content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
  const fields = Object.entries({ success: 60, hard: 30, extreme: 12, hardStart: 13, successStart: 31, failStart: 61, roll1: total });
  events['chat:message']({
    type: 'general', rolltemplate: 'coc-short',
    content: '{{subject=지능}} ' + fields.map(([field], index) => '{{' + field + '=$[[' + index + ']]}}').join(' ') +
      ' {{kib_sheet_result=' + token + '}}',
    inlinerolls: fields.map(([, value]) => ({ results: { total: value } })),
    who: westernAutoCharacter.get('name'), playerid: 'player-1',
  });
  assert.strictEqual(westernAutoAttribute('temp_insane').get('current'), total === 40 ? '1' : '0',
    '실제 웨스턴유로 지능 성공 결과만 원본 일시적 광기 체크값 1로 저장해야 합니다.');
});
const westernRoleAlias = runApi('!!sanity', westernAutoCharacter.get('name'));
assert.strictEqual(westernRoleAlias.filter((item) => item.content &&
  item.content.includes('{{subject=이성}}') && item.content.includes('kib_sheet_result=')).length, 1,
  '기존 의미역 별칭 호출자는 원본 이성 버튼을 그대로 실행해야 합니다.');

// 실제 16번에서 워커의 최신 저장값이 도착했더라도 25ms 추적 묶음이 아직
// 실행되지 않은 동안 상태·검색은 이전 scan의 최대값을 다시 쓰면 안 됩니다.
// 전체 35종을 그대로 등록하고 원본 기본값과 실제로 저장한 속성을 분리합니다.
const tatekMaximumSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-333b740f1e467d01');
assert(tatekMaximumSheet, '최대값 갱신 회귀에 실제 타텍 임베드 원본이 필요합니다.');
const tatekMaximumAttributeStart = attributeObjects.length;
const tatekMaximumCharacter = addCharacter('tatek-live-maximums', '타텍 최대값 갱신 회귀', 'player-1', {
  con: '80', siz: '50', pow: '60', hp: '10', hp_max: '13', mp: '10', mp_max: '12',
  san: '50', san_start: '50', san_max: '99', int: '100', language_own: '50', credit_rating: '0',
  temp_insane: '0', indef_insane: '0', dying: '0', 'major-wound-toggle': '0',
  dice_type: '{{roll=[[1d100]]}}', edit_mode: '0', view_tabs_default: '1',
});
sheetFieldDefaults[tatekMaximumCharacter.id] = sourceDefaults(tatekMaximumSheet);
useContracts(...embeddedSheets);
useRoomCharacters(tatekMaximumCharacter);
const tatekMaximumInspection = helper.inspectContracts(tatekMaximumCharacter.id);
assert(tatekMaximumInspection.contract && tatekMaximumInspection.contract.id === tatekMaximumSheet.id ||
  (tatekMaximumInspection.matches || []).some((item) => item.id === tatekMaximumSheet.id),
  '전체 배포 원본을 유지한 최대값 시험에서 타텍 원본이 후보에 포함되어야 합니다.');
const tatekMaximumChecks = [];
const tatekMaximumAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === tatekMaximumCharacter.id && item.get('name') === name);
function changeTatekMaximum(name, current) {
  const attribute = tatekMaximumAttribute(name);
  const previous = attribute.get('current');
  attribute.set('current', current);
  events['change:attribute'](attribute, { current: previous });
}
function tatekMaximumStatus(label, hpMax, mpMax, sanStart) {
  const html = runApi('!!상태', tatekMaximumCharacter.get('name'))
    .map((item) => item.content || '').join('\n');
  const resourceHtml = html.slice(html.indexOf('현재 수치 '));
  const resources = helper.scan(tatekMaximumCharacter.id).resourcesByAttribute;
  const actual = {};
  const pass = [['hp', hpMax], ['mp', mpMax]].map(([name, maximum]) => {
    const item = resources[name];
    actual[name] = item && (resourceHtml.split(item.label + ' <b>')[1] || '').split('</b>')[0];
    const current = Number(tatekMaximumAttribute(name).get('current'));
    return actual[name] === current + ' / ' + maximum + ' (' + Math.round(current / maximum * 100) + '%)';
  }).every(Boolean);
  const san = resources.san;
  actual.san = san && (resourceHtml.split(san.label + ' <b>')[1] || '').split('</b>')[0];
  tatekMaximumChecks.push({ label, pass: pass && actual.san.includes(' / 시작 ' + sanStart + ' '), actual });
}
helper.scan(tatekMaximumCharacter.id, true);
tatekMaximumStatus('baseline', 13, 12, 50);
[
  { label: 'increase-before-flush', con: '90', pow: '70', hp_max: '14', mp_max: '14', san_start: '60' },
  { label: 'decrease-before-flush', con: '80', pow: '60', hp_max: '13', mp_max: '12', san_start: '50' },
].forEach(({ label, ...values }) => {
  deferAttributeTimers = true;
  const findStart = attributeFindCalls.length;
  Object.entries(values).forEach(([name, current]) => changeTatekMaximum(name, current));
  tatekMaximumChecks.push({ label: label + '-no-event-scan', pass: attributeFindCalls.length === findStart });
  tatekMaximumChecks.push({ label: label + '-timer-pending',
    pass: attributeTimers.some((timer) => !timer.cancelled && !timer.fired) });
  tatekMaximumStatus(label, Number(values.hp_max), Number(values.mp_max), Number(values.san_start));
  const search = runApi('!!검색 체력', tatekMaximumCharacter.get('name'))
    .map((item) => item.content || '').join('\n');
  tatekMaximumChecks.push({ label: label + '-search',
    pass: search.includes('10 / ' + values.hp_max + ' (' + Math.round(10 / Number(values.hp_max) * 100) + '%)') });
  // 실검에서 !!점검 직후 정상화된 경로도 별도로 보존합니다.
  runApi('!!점검', tatekMaximumCharacter.get('name'), 'gm', 'character|' + tatekMaximumCharacter.id);
  tatekMaximumStatus(label + '-forced-inspection', Number(values.hp_max), Number(values.mp_max), Number(values.san_start));
  deferAttributeTimers = false;
  flushAttributeTimers();
  tatekMaximumStatus(label + '-after-flush', Number(values.hp_max), Number(values.mp_max), Number(values.san_start));
});
// 10→14와 14→10은 피해 6의 중상 판정 결과가 달라집니다. 현재값 변경
// 명령과 변화 로그도 추적 타이머 전에 받은 최신 최대값을 사용해야 합니다.
const tatekPreviousTrackingMode = runtime.state.KIBSheetHelper.trackingMode;
runtime.state.KIBSheetHelper.trackingMode = 'public';
[
  { oldCon: '50', oldMax: '10', con: '90', maximum: '14', major: '0' },
  { oldCon: '90', oldMax: '14', con: '50', maximum: '10', major: '1' },
].forEach(({ oldCon, oldMax, con, maximum, major }) => {
  Object.entries({ con: oldCon, hp_max: oldMax, hp: '10', 'major-wound-toggle': '0' })
    .forEach(([name, value]) => tatekMaximumAttribute(name).set('current', value));
  helper.scan(tatekMaximumCharacter.id, true);
  deferAttributeTimers = true;
  changeTatekMaximum('con', con);
  changeTatekMaximum('hp_max', maximum);
  const html = runGeneral(':체력-6', tatekMaximumCharacter.get('name'))
    .map((item) => item.content || '').join('\n');
  const actual = { hp: tatekMaximumAttribute('hp').get('current'),
    major: tatekMaximumAttribute('major-wound-toggle').get('current') };
  tatekMaximumChecks.push({ label: 'major-current-maximum-' + maximum,
    pass: actual.hp === '4' && actual.major === major, actual });
  tatekMaximumChecks.push({ label: 'change-log-current-maximum-' + maximum,
    pass: html.includes('10 / ' + maximum + ' (' + Math.round(10 / Number(maximum) * 100) + '%)') &&
      html.includes('4 / ' + maximum + ' (' + Math.round(4 / Number(maximum) * 100) + '%)') });
  deferAttributeTimers = false;
  flushAttributeTimers();
});
runtime.state.KIBSheetHelper.trackingMode = tatekPreviousTrackingMode;
delete sheetFieldDefaults[tatekMaximumCharacter.id];
characters.splice(characters.indexOf(tatekMaximumCharacter), 1);
attributeObjects.splice(tatekMaximumAttributeStart);

// 저장 최대값을 무조건 원본 default로 덮는 수정은 허용하지 않습니다.
// 편집 가능한 식, 계산식 없는 워커 전용 칸, 숫자 기본값은 저장값을 보존합니다.
const maximumAuthoritySheet = parseSheetContract([
  '<input name="attr_max_guard_a"><input name="attr_max_guard_b"><input name="attr_max_guard_c">',
  '<label>기준<input type="number" name="attr_basis" value="70"></label>',
  '<div><h3>편집 자원</h3><label>현재<input type="number" name="attr_editable" value="10"></label>',
  '<label>최대<input type="number" name="attr_editable_max" value="floor(@{basis}/5)"></label></div>',
  '<div><h3>워커 자원</h3><label>현재<input type="number" name="attr_worker" value="10"></label>',
  '<label>최대<input type="number" name="attr_worker_max" value="" disabled></label></div>',
  '<div><h3>상수 자원</h3><label>현재<input type="number" name="attr_literal" value="10"></label>',
  '<label>최대<input type="number" name="attr_literal_max" value="99" disabled></label></div>',
  '<button type="roll" value="&{template:max-guard} {{subject=기준}} {{roll=[[1d100]]}}"></button>',
].join('\n'), { id: 'maximum-authority-guards', sourceHash: 'maximum-authority-guards-v1' });
const maximumAuthorityAttributeStart = attributeObjects.length;
const maximumAuthorityCharacter = addCharacter('maximum-authority-guards', '최대값 저장 권한 보호', 'player-1', {
  max_guard_a: '1', max_guard_b: '1', max_guard_c: '1', basis: '70',
  editable: '10', editable_max: '18', worker: '10', worker_max: '27', literal: '10', literal_max: '42',
});
useContracts(maximumAuthoritySheet);
useRoomCharacters(maximumAuthorityCharacter);
const maximumAuthorityResources = helper.scan(maximumAuthorityCharacter.id, true).resourcesByAttribute;
[['editable', 18], ['worker', 27], ['literal', 42]].forEach(([name, maximum]) => {
  const item = maximumAuthorityResources[name];
  tatekMaximumChecks.push({ label: 'preserve-stored-maximum-' + name,
    pass: !!item && item.max === maximum, actual: item && item.max });
});
characters.splice(characters.indexOf(maximumAuthorityCharacter), 1);
attributeObjects.splice(maximumAuthorityAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
assert(tatekMaximumChecks.every((item) => item.pass),
  '실제 16번 최신 저장 최대값은 추적 타이머 전에도 즉시 읽어야 합니다: ' + JSON.stringify(tatekMaximumChecks));

// 실제 16번은 주 기능/전투 영역에 같은 회피 원본 버튼을 한 번씩 둡니다.
// 접힌 주 기능 패널을 명령에서 계속 허용하는 기존 presentation 정책은 유지하고,
// 현재 실행 가능한 동일 식만 합칩니다. 원본 키/컷인 항목을 지우는 검사가 아닙니다.
const tatekCloneSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-333b740f1e467d01');
const tatekCloneRolls = tatekCloneSheet.rolls.filter((roll) => roll.raw.includes('{{subject=회피}}'));
assert.strictEqual(tatekCloneRolls.length, 2, '실제 16번 회피 복제 버튼 두 개가 필요합니다.');
assert.strictEqual(tatekCloneRolls[0].raw, tatekCloneRolls[1].raw, '회피 두 버튼의 원본 식은 완전히 같아야 합니다.');
assert.deepStrictEqual(tatekCloneRolls[0].modes, tatekCloneRolls[1].modes,
  '회피 복제 판별 때문에 원본 모드의 차이를 무시하면 안 됩니다.');
assert.notDeepStrictEqual(tatekCloneRolls[0].visibility, tatekCloneRolls[1].visibility,
  '이 회귀는 서로 다른 영역의 표시 조건을 가져야 합니다.');
const tatekCloneAttributeStart = attributeObjects.length;
const tatekCloneCharacter = addCharacter('tatek-visible-clones', '타텍 회피 복제 회귀', 'player-1', {
  dodge: '25', edit_mode: '0', view_tabs_default: '1', view_tabs_weapon: '0',
  dice_type: '{{roll=[[1d100]]}}', san: '50', san_start: '50',
});
sheetFieldDefaults[tatekCloneCharacter.id] = sourceDefaults(tatekCloneSheet);
useContracts(...embeddedSheets);
useRoomCharacters(tatekCloneCharacter);
const tatekCloneInspection = helper.inspectContracts(tatekCloneCharacter.id);
assert(tatekCloneInspection.contract && tatekCloneInspection.contract.id === tatekCloneSheet.id ||
  (tatekCloneInspection.matches || []).some((item) => item.id === tatekCloneSheet.id),
  '전체 35종을 유지한 회피 시험에 실제 16번 원본이 포함되어야 합니다.');
const tatekCloneChecks = [];
const tatekCloneAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === tatekCloneCharacter.id && item.get('name') === name);
const tatekCloneBonus = tatekCloneRolls[0].modes.find((mode) =>
  String(mode.overrides.dice_type).includes('{{dice_type=[[1]]}}'));
assert(tatekCloneBonus, '실제 16번 보너스 1개 원본 모드가 필요합니다.');
['10', '11', '01', '00'].forEach((tabs) => {
  ['view_tabs_default', 'view_tabs_weapon'].forEach((name, index) => {
    const attribute = tatekCloneAttribute(name);
    const previous = attribute.get('current');
    attribute.set('current', tabs[index]);
    events['change:attribute'](attribute, { current: previous });
  });
  const exact = tatekCloneRolls.map((roll) =>
    helper.exactContractInstance(tatekCloneCharacter.id, tatekCloneSheet.id, roll.key, '', true));
  assert(exact.every((item) => item.ok), '숨은 원본을 포함한 정확 키 조회는 보존되어야 합니다.');
  const hidden = exact.map((item) => item.instance.hidden);
  tatekCloneChecks.push({ tabs, label: 'existing-presentation-and-hidden-policy', hidden,
    pass: hidden[0] === false && hidden[1] === (tabs[1] === '0') });
  const combatVisible = helper.exactContractInstance(
    tatekCloneCharacter.id, tatekCloneSheet.id, tatekCloneRolls[1].key, '', false);
  tatekCloneChecks.push({ tabs, label: 'hidden-combat-key-excluded', pass: combatVisible.ok === (tabs[1] === '1') });
  [['!!회피', null], ['!!회피 보너스1', tatekCloneBonus]].forEach(([command, mode]) => {
    const expected = helper.qualifyContractMacro(tatekCloneCharacter.id, exact[0].instance, mode);
    assert(expected.ok, '실제 회피 원본 식의 확장에 실패했습니다.');
    const messages = runApi(command, tatekCloneCharacter.get('name'));
    const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
    const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
    tatekCloneChecks.push({ tabs, label: command, choices: choices.length, rolls: rolls.length,
      pass: choices.length === 0 && rolls.length === 1 &&
        rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content });
  });
  const search = runApi('!!검색 회피', tatekCloneCharacter.get('name')).map((item) => item.content || '').join('\n');
  const searchRows = Array.from(search.matchAll(/<tr>[\s\S]*?<\/tr>/g), (match) => match[0])
    .filter((row) => /<b>회피(?: \([^<]*\))?<\/b>/.test(row) && row.includes('>굴림</span>'));
  tatekCloneChecks.push({ tabs, label: 'one-action-search-row', rows: searchRows.length, pass: searchRows.length === 1 });
  const status = runApi('!!상태', tatekCloneCharacter.get('name')).map((item) => item.content || '').join('\n');
  const statusDodgeLabels = Array.from(status.matchAll(
    /<span style="display:inline-block;margin:0 8px 3px 0">(회피(?: \([^<]*\))?) <b>/g), (match) => match[1]);
  tatekCloneChecks.push({ tabs, label: 'one-status-action', labels: statusDodgeLabels, pass: statusDodgeLabels.length === 1 });
  // 컷인은 원본 실행 키별 연결을 유지하므로, 둘 다 활성일 때에도 두 항목입니다.
  const cutins = helper.cutinItems().filter((item) => /^회피(?: \(|$)/.test(item.label));
  tatekCloneChecks.push({ tabs, label: 'preserve-original-cutin-keys', keys: cutins.map((item) => item.key),
    pass: cutins.length === (tabs[1] === '1' ? 2 : 1) && new Set(cutins.map((item) => item.key)).size === cutins.length });
});

// 표시명과 수치가 같아도 실제로 다른 원본 고정 필드 및 다른 반복행은 세 선택지입니다.
const tatekDistinctTitle = '타텍 별도 기능';
Object.entries({ view_tabs_default: '1', view_tabs_weapon: '1', ori_science_title: tatekDistinctTitle, ori_science: '47',
  'repeating_science_-TatekCloneA_science_title': tatekDistinctTitle, 'repeating_science_-TatekCloneA_science': '47',
  'repeating_science_-TatekCloneB_science_title': tatekDistinctTitle, 'repeating_science_-TatekCloneB_science': '47',
  _reporder_repeating_science: '-TatekCloneA,-TatekCloneB',
}).forEach(([name, value]) => {
  const attribute = tatekCloneAttribute(name);
  if (attribute) attribute.set('current', value);
  else addAttribute(tatekCloneCharacter.id, name, value);
});
helper.scan(tatekCloneCharacter.id, true);
const tatekDistinctMessages = runApi('!!' + tatekDistinctTitle, tatekCloneCharacter.get('name'));
const tatekDistinctChoices = stagfieldActionButtons(tatekDistinctMessages.map((item) => item.content || '').join('\n'));
const tatekDistinctRows = tatekDistinctChoices.map((command) => command.split('|').map(decodeURIComponent)[4]);
tatekCloneChecks.push({ label: 'distinct-real-field-and-rows', rows: tatekDistinctRows,
  pass: tatekDistinctRows.slice().sort().join('|') === ['', '-TatekCloneA', '-TatekCloneB'].sort().join('|') &&
    !tatekDistinctMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
delete sheetFieldDefaults[tatekCloneCharacter.id];
characters.splice(characters.indexOf(tatekCloneCharacter), 1);
attributeObjects.splice(tatekCloneAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
assert(tatekCloneChecks.every((item) => item.pass),
  '실제 16번 활성 회피 복제와 원본 선택 경계를 보존해야 합니다: ' + JSON.stringify(tatekCloneChecks));

// 실제 18번의 네 근접전 기능은 서로 다른 표시명/필드를 쓰지만 출력 제목은
// 모두 도끼로 복사되어 있습니다. 원본 오타를 고치지 않고 표시명 우선순위만 검증합니다.
const bloodLabelSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-0a09356ad817043a');
const bloodLabelAttributeStart = attributeObjects.length;
const bloodLabelCharacter = addCharacter('blood-primary-labels', '블메캐 표시명 회귀', 'player-1', {
  fighting_ax: '15', fighting_mace: '10', fighting_lance: '20', fighting_whip: '5',
  fighting_brawl: '25', damage_bonus: '0',
  chk_dicetype: '1', edit_mode: '0', family: '0', current_mental_condition: '',
  temp_insane: '0', indef_insane: '0',
});
sheetFieldDefaults[bloodLabelCharacter.id] = sourceDefaults(bloodLabelSheet);
useContracts(...embeddedSheets);
useRoomCharacters(bloodLabelCharacter);
const bloodLabelInspection = helper.inspectContracts(bloodLabelCharacter.id);
assert(bloodLabelInspection.contract && bloodLabelInspection.contract.id === bloodLabelSheet.id ||
  (bloodLabelInspection.matches || []).some((item) => item.id === bloodLabelSheet.id),
  '전체 35종을 유지한 표시명 시험에 실제 18번 원본이 포함되어야 합니다.');
const bloodLabelChecks = [];
const bloodLabelAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === bloodLabelCharacter.id && item.get('name') === name);
function bloodNativeCommand(command, roll, mode, label) {
  const exact = helper.exactContractInstance(bloodLabelCharacter.id, bloodLabelSheet.id, roll.key, '', true);
  assert(exact.ok, '실제 18번 원본 키를 읽지 못했습니다: ' + roll.key);
  const expected = helper.qualifyContractMacro(bloodLabelCharacter.id, exact.instance, mode || null);
  assert(expected.ok, '실제 18번 원본 식의 확장에 실패했습니다: ' + command + ' / ' + JSON.stringify(expected));
  const messages = runApi(command, bloodLabelCharacter.get('name'));
  const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
  const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
  bloodLabelChecks.push({ label, command, key: roll.key, choices: choices.length, rolls: rolls.length,
    pass: choices.length === 0 && rolls.length === 1 &&
      rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content });
}
const bloodPrimaryNormalKeys = [];
[
  ['근접전(도끼)', 'fighting_ax'], ['근접전(도리깨)', 'fighting_mace'],
  ['근접전(창)', 'fighting_lance'], ['근접전(채찍)', 'fighting_whip'],
].forEach(([label, field]) => {
  const rolls = bloodLabelSheet.rolls.filter((roll) => roll.label.startsWith(label + ' ') &&
    roll.raw.includes('{{success=[[@{' + field + '}]]}}'));
  assert.strictEqual(rolls.length, 3, '각 실제 표시명은 일반/보너스/패널티 원본 세 개를 가져야 합니다.');
  assert(rolls.every((roll) => roll.raw.includes('{{subject=근접전(도끼)}}')),
    '잘못 복사된 원본 출력 제목을 테스트 자료에서 고치면 안 됩니다.');
  const normal = rolls.find((roll) => roll.raw.includes('{{roll=[[1d100]]}}'));
  bloodPrimaryNormalKeys.push(normal.key);
  [['1', normal], ['2', rolls.find((roll) => roll.raw.includes('?{보너스 주사위|'))],
    ['3', rolls.find((roll) => roll.raw.includes('?{패널티 주사위|'))]].forEach(([selected, roll]) => {
    bloodLabelAttribute('chk_dicetype').set('current', selected);
    helper.scan(bloodLabelCharacter.id, true);
    if (selected === '1') bloodNativeCommand('!!' + label, roll, null, 'primary-current-variant-' + selected);
    else {
      const messages = runApi('!!' + label, bloodLabelCharacter.get('name'));
      const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'))
        .map((command) => command.split('|').map(decodeURIComponent));
      const modeIds = roll.modes.filter((mode) => Object.keys(mode.queries || {}).length > 0 &&
        (!Object.prototype.hasOwnProperty.call(mode.overrides, 'family') || String(mode.overrides.family) === '0'))
        .map((mode) => mode.id).sort();
      bloodLabelChecks.push({ label: 'primary-current-query-variant-' + selected, command: '!!' + label,
        choices: choices.length, pass: choices.every((parts) => parts[3] === roll.key) &&
          choices.map((parts) => parts[5]).sort().join('|') === modeIds.join('|') &&
          !messages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
    }
  });
  bloodLabelAttribute('chk_dicetype').set('current', '1');
  helper.scan(bloodLabelCharacter.id, true);
  ['보너스', '패널티'].forEach((direction) => [1, 2].forEach((count) => {
    const roll = rolls.find((item) => item.raw.includes('?{' + direction + ' 주사위|'));
    const value = String(direction === '보너스' ? count : -count);
    const mode = roll.modes.find((item) => Object.keys(item.overrides || {}).length === 0 &&
      Object.values(item.queries || {}).some((query) => query.value === value));
    assert(mode, '실제 원본 질의 선택값이 필요합니다: ' + direction + count);
    bloodNativeCommand('!!' + label + ' ' + direction + count, roll, mode, 'primary-explicit-mode');
  }));
});
const bloodAxeNormal = bloodLabelSheet.rolls.find((roll) => roll.key === bloodPrimaryNormalKeys[0]);
const bloodFamilyMode = bloodAxeNormal.modes.find((mode) =>
  mode.labelPath.join(' ') === '루엔야크' && String(mode.overrides.family) === '1');
assert(bloodFamilyMode, '원본 가족 선택 모드가 필요합니다.');
const bloodFamilyMessages = runApi('!!근접전(도끼) 루엔야크', bloodLabelCharacter.get('name'));
const bloodFamilyChoices = stagfieldActionButtons(bloodFamilyMessages.map((item) => item.content || '').join('\n'));
bloodLabelChecks.push({ label: 'primary-combined-non-dice-mode', choices: bloodFamilyChoices.length,
  pass: bloodFamilyChoices.length > 1 && bloodFamilyChoices.every((command) => {
    const parts = command.split('|').map(decodeURIComponent);
    return bloodLabelSheet.rolls.some((roll) => roll.key === parts[3] && roll.label === bloodAxeNormal.label &&
      roll.modes.some((mode) => mode.id === parts[5] && String(mode.overrides.family) === '1'));
  }) && !bloodFamilyMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
// 가족 모드의 기존 일반/질의 버튼 선택은 유지하며, 정확한 일반 링크는 원본 그대로 실행합니다.
const bloodFamilyNormalChoice = bloodFamilyChoices.find((command) => {
  const parts = command.split('|').map(decodeURIComponent);
  return parts[3] === bloodAxeNormal.key && parts[5] === bloodFamilyMode.id;
});
assert(bloodFamilyNormalChoice, '가족 모드의 정상 원본 선택 링크를 보존해야 합니다.');
bloodNativeCommand(bloodFamilyNormalChoice, bloodAxeNormal, bloodFamilyMode, 'primary-family-normal-link');
const bloodBareModeMessages = runApi('!!루엔야크', bloodLabelCharacter.get('name'));
const bloodBareModeChoices = stagfieldActionButtons(bloodBareModeMessages.map((item) => item.content || '').join('\n'))
  .map((command) => command.split('|').map(decodeURIComponent));
bloodLabelChecks.push({ label: 'bare-mode-keeps-distinct-primary-actions',
  pass: new Set(bloodBareModeChoices.map((parts) => parts[3])).size > 1 &&
    bloodBareModeChoices.every((parts) => bloodLabelSheet.rolls.some((roll) => roll.key === parts[3] &&
      roll.modes.some((mode) => mode.id === parts[5] && String(mode.overrides.family) === '1'))) &&
    !bloodBareModeMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) });

const bloodPrimaryStatus = runApi('!!상태', bloodLabelCharacter.get('name'))
  .map((item) => item.content || '').join('\n');
const bloodUnarmedStatus = bloodPrimaryStatus.match(
  /<span style="display:inline-block;margin:0 8px 3px 0">비무장 [\s\S]*?<\/span><\/span>/);
bloodLabelChecks.push({ label: 'status-unarmed-only-native-damage',
  pass: !!bloodUnarmedStatus && bloodUnarmedStatus[0].replace(/<[^>]+>/g, '').trim() === '비무장 25 (피해 1d3+0)' });
bloodLabelChecks.push({ label: 'status-four-explicit-modifiers',
  pass: bloodPrimaryStatus.includes('다이스 종류 4개') &&
    ['보너스 주사위 1개', '보너스 주사위 2개', '패널티 주사위 1개', '패널티 주사위 2개']
      .every((label) => bloodPrimaryStatus.includes(label)) });
bloodLabelChecks.push({ label: 'status-preserve-named-talent-modes',
  pass: ['재능 획득 내역', '기타 재능', '신체적 재능', '재능 선택', '전투 재능', '정신적 재능']
    .every((label) => bloodPrimaryStatus.includes(label)) });

// 같은 표시명 우선순위 안에서도 실제로 다른 반복행은 임의로 하나를 고르면 안 됩니다.
Object.entries({
  'repeating_science_-BloodPrimaryA_science_title': '동명 원본 기능',
  'repeating_science_-BloodPrimaryA_science': '47',
  'repeating_science_-BloodPrimaryB_science_title': '동명 원본 기능',
  'repeating_science_-BloodPrimaryB_science': '47',
  _reporder_repeating_science: '-BloodPrimaryA,-BloodPrimaryB',
}).forEach(([name, value]) => addAttribute(bloodLabelCharacter.id, name, value));
helper.scan(bloodLabelCharacter.id, true);
['', ' 보너스1', ' 패널티2'].forEach((suffix) => {
  const messages = runApi('!!동명 원본 기능' + suffix, bloodLabelCharacter.get('name'));
  const rows = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'))
    .map((command) => command.split('|').map(decodeURIComponent)[4]);
  bloodLabelChecks.push({ label: 'same-primary-distinct-rows' + suffix, rows,
    pass: rows.slice().sort().join('|') === '-BloodPrimaryA|-BloodPrimaryB' &&
      !messages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
});
delete sheetFieldDefaults[bloodLabelCharacter.id];
characters.splice(characters.indexOf(bloodLabelCharacter), 1);
attributeObjects.splice(bloodLabelAttributeStart);

// 일치하는 표시명이 없을 때는 기존 출력 제목 별칭과 그 결합 모드를 계속 허용합니다.
const outputAliasSheet = parseSheetContract([
  '<input name="attr_alias_marker_a"><input name="attr_alias_marker_b"><input name="attr_alias_marker_c">',
  '<label>공식 표시명 <input name="attr_rating" value="47"></label>',
  '<select name="attr_alias_style"><option value="0">기본</option><option value="1">공개</option></select>',
  '<button type="roll" name="roll_legacy_alias" value="&{template:fixture} {{subject=기존 출력명}} {{success=[[@{rating}]]}} {{style=[[@{alias_style}]]}} {{roll=[[1d100]]}}">공식 표시명</button>',
].join('\n'), { id: 'output-alias-priority-fixture' });
assert.strictEqual(outputAliasSheet.rolls[0].label, '공식 표시명');
assert.strictEqual(outputAliasSheet.rolls[0].staticLabels[0].value, '기존 출력명');
const outputAliasAttributeStart = attributeObjects.length;
const outputAliasCharacter = addCharacter('output-alias-priority', '출력 별칭 보존', 'player-1', {
  alias_marker_a: 'a', alias_marker_b: 'b', alias_marker_c: 'c', rating: '47', alias_style: '0',
});
useContracts(outputAliasSheet);
useRoomCharacters(outputAliasCharacter);
const outputAliasExact = helper.exactContractInstance(outputAliasCharacter.id,
  outputAliasSheet.id, outputAliasSheet.rolls[0].key, '', true);
assert(outputAliasExact.ok);
[['!!기존 출력명', null], ['!!기존 출력명 공개', outputAliasSheet.rolls[0].modes.find((mode) =>
  String(mode.overrides.alias_style) === '1')]].forEach(([command, mode]) => {
  const expected = helper.qualifyContractMacro(outputAliasCharacter.id, outputAliasExact.instance, mode);
  assert(expected.ok);
  const messages = runApi(command, outputAliasCharacter.get('name'));
  const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
  bloodLabelChecks.push({ label: 'preserve-output-alias', command,
    pass: rolls.length === 1 && !stagfieldActionButtons(messages.map((item) => item.content || '').join('\n')).length &&
      rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content });
});
characters.splice(characters.indexOf(outputAliasCharacter), 1);
attributeObjects.splice(outputAliasAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
assert(bloodLabelChecks.every((item) => item.pass),
  '원본 표시명 우선 선택과 별칭/동명 행 경계를 보존해야 합니다: ' + JSON.stringify(bloodLabelChecks));

// 실제 19번: 기능의 UI 이름과 무기 기능 선택의 독립 모드명이 같아도,
// 정확한 기능 명령에 다른 계절의 무기 모드를 섞지 않습니다. 원본 출력명은 보존합니다.
const seasonPrioritySheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-29faeb0167cef992');
const seasonPriorityAttributeStart = attributeObjects.length;
const seasonPriorityCharacter = addCharacter('season-primary-mode', '계절 기능과 모드 경계', 'player-1', {
  showskills: '7', fighting_brawl_mdr: '25', firearms_handgun_mdr: '20', firearms_rifle_mdr: '25', throw_mdr: '20',
  luck: '50', luck_txt: '운', fighting_brawl_txt: '근접전(격투)', firearms_hg_txt: '사격(권총)',
  firearms_rs_txt: '사격(라/산)', throw_txt: '투척', damage_bonus: '0',
});
sheetFieldDefaults[seasonPriorityCharacter.id] = sourceDefaults(seasonPrioritySheet);
useContracts(...embeddedSheets);
useRoomCharacters(seasonPriorityCharacter);
assert.strictEqual(helper.inspectContracts(seasonPriorityCharacter.id).contract.id, seasonPrioritySheet.id,
  '전체 35종을 유지한 계절 기능 회귀는 실제 19번 원본을 인식해야 합니다.');
const seasonPriorityChecks = [];
const seasonView = attributeObjects.find((item) => item.get('_characterid') === seasonPriorityCharacter.id &&
  item.get('name') === 'showskills');
function seasonNativeCommand(command, roll, mode, label) {
  const exact = helper.exactContractInstance(seasonPriorityCharacter.id, seasonPrioritySheet.id, roll.key, '', true);
  assert(exact.ok);
  const expected = helper.qualifyContractMacro(seasonPriorityCharacter.id, exact.instance, mode || null);
  assert(expected.ok, '계절 원본 식을 확장할 수 없습니다: ' + command + ' / ' + JSON.stringify(expected));
  const messages = runApi(command, seasonPriorityCharacter.get('name'));
  const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
  const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
  seasonPriorityChecks.push({ label, view: seasonView.get('current'), command, choices: choices.length, rolls: rolls.length,
    pass: choices.length === 0 && rolls.length === 1 &&
      rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') === expected.content });
}
const seasonPrioritySubjects = [
  ['근접전(격투)', 'fighting_brawl_mdr'], ['사격(권총)', 'firearms_handgun_mdr'],
  ['사격(라/산)', 'firearms_rifle_mdr'], ['투척', 'throw_mdr'],
];
const seasonLuckNormal = seasonPrioritySheet.rolls.find((roll) => roll.key === 'luck_check-3de5dde3cfd1');
assert(seasonLuckNormal && seasonLuckNormal.raw.includes('{{name=@{luck_txt}}}'),
  '행운 원본의 간접 출력명 참조를 보존해야 합니다.');
seasonPriorityChecks.push({ label: 'source-luck-visible-ui-label',
  pass: seasonPrioritySheet.rolls.filter((roll) => roll.raw.includes('{{success=[[@{luck}]]}}'))
    .every((roll) => roll.label === '행운') });
['7', '1', '5', '2'].forEach((view) => {
  seasonView.set('current', view);
  helper.scan(seasonPriorityCharacter.id, true);
  seasonPrioritySubjects.forEach(([label, field]) => {
    const normal = seasonPrioritySheet.rolls.filter((roll) => roll.template === 'coc-1' &&
      roll.raw.includes('{{success=[[@{' + field + '}]]}}') && visibilityEquals(roll.visibility, 'showskills', view));
    assert.strictEqual(normal.length, 1, '현재 계절의 실제 일반 기능 버튼이 하나여야 합니다: ' + label);
    seasonNativeCommand('!!' + label, normal[0], null, 'primary-action-not-bare-weapon-mode');
  });
  seasonNativeCommand('!!행운', seasonLuckNormal, null, 'visible-luck-label-keeps-original-output');
  const unarmed = seasonPrioritySheet.rolls.find((roll) => roll.template === 'coc-attack-1' &&
    roll.name === 'unarmed_mdr_check' && visibilityEquals(roll.visibility, 'showskills', view));
  assert(unarmed, '현재 계절의 원본 비무장 버튼이 있어야 합니다.');
  seasonNativeCommand('!!비무장', unarmed, null, 'unreachable-panel-excluded-from-normal');
  seasonPriorityChecks.push({ label: 'unreachable-panel-excluded-from-status', view,
    pass: runApi('!!상태', seasonPriorityCharacter.get('name')).map((item) => item.content || '').join('\n')
      .includes('무기 1개') });
});
seasonView.set('current', '7');
helper.scan(seasonPriorityCharacter.id, true);
seasonNativeCommand('!!운', seasonLuckNormal, null, 'preserve-original-luck-output-alias');
const seasonUnarmedBonus = seasonPrioritySheet.rolls.find((roll) => roll.template === 'coc-attack' &&
  roll.name === 'unarmed_mdr_check' && visibilityEquals(roll.visibility, 'showskills', '7'));
seasonNativeCommand('!!비무장 보너스1', seasonUnarmedBonus, null, 'reachable-hidden-bonus-kept');
const seasonUnreachable = seasonPrioritySheet.rolls.find((roll) => roll.key === 'unarmed_et_check-97a5fc7922f3');
seasonPriorityChecks.push({ label: 'unreachable-panel-retains-source-but-cannot-execute',
  pass: seasonUnreachable.raw.includes('@{fighting_brawl_et}') &&
    !helper.exactContractInstance(seasonPriorityCharacter.id, seasonPrioritySheet.id,
      seasonUnreachable.key, '', true).ok });
addAttribute(seasonPriorityCharacter.id, 'fighting_brawl_et', '88');
helper.scan(seasonPriorityCharacter.id, true);
seasonNativeCommand('!!비무장', seasonPrioritySheet.rolls.find((roll) =>
  roll.name === 'unarmed_mdr_check' && roll.template === 'coc-attack-1' &&
  visibilityEquals(roll.visibility, 'showskills', '7')), null, 'stale-value-cannot-open-unreachable-panel');
seasonPrioritySubjects.forEach(([label, field]) => {
  const multiple = seasonPrioritySheet.rolls.find((roll) => roll.template === 'coc' &&
    roll.raw.includes('{{success=[[@{' + field + '}]]}}') && visibilityEquals(roll.visibility, 'showskills', '7'));
  assert(multiple);
  ['보너스1', '패널티2'].forEach((mode) =>
    seasonNativeCommand('!!' + label + ' ' + mode, multiple, null, 'preserve-explicit-multiple-dice'));
});

// 모드만 부르는 기존 경로와 소유 무기+모드 경로를 남깁니다. 계절별 원본 키는 삭제하지 않습니다.
Object.entries({ weapon1_mdr_name: '계절 시험검', weapon1_mdr_damage: '1d6', weapon1_mdr_db: '+0' })
  .forEach(([name, value]) => addAttribute(seasonPriorityCharacter.id, name, value));
helper.scan(seasonPriorityCharacter.id, true);
const seasonWeaponNormal = seasonPrioritySheet.rolls.find((roll) => roll.key === 'weapon1_mdr_attack-b298e505d882');
[['다른 기능 #1', '다른 기능 #1'], ['계절 시험검 근접전(격투)', '근접전(격투)']].forEach(([query, modeLabel]) => {
  const result = helper.resolveContractAction(seasonPriorityCharacter, query, false);
  const choices = result.result && result.result.choices || [];
  const expectedMode = seasonWeaponNormal.modes.find((mode) => mode.labelPath.join(' ') === modeLabel);
  assert(expectedMode);
  const normalChoice = choices.find((choice) => choice.rollKey === seasonWeaponNormal.key && choice.modeId === expectedMode.id);
  seasonPriorityChecks.push({ label: 'preserve-bare-and-owner-mode', query, choices: choices.length,
    pass: !!normalChoice && choices.length > 1 && choices.every((choice) => choice.contractId === seasonPrioritySheet.id &&
      choice.rollKey.startsWith('weapon1_mdr_attack') && choice.modeId === expectedMode.id) });
  if (modeLabel === '근접전(격투)' && normalChoice) {
    const command = '!시트 굴림선택|' + [seasonPriorityCharacter.id, seasonPrioritySheet.id,
      normalChoice.rollKey, '', normalChoice.modeId, '0'].map(encodeURIComponent).join('|');
    seasonNativeCommand(command, seasonWeaponNormal, expectedMode, 'preserve-explicit-owner-mode-original-macro');
  }
});

Object.entries({
  'repeating_skillsmdr_-SeasonPrimaryA_skillname_mdr': '계절 동명 기능',
  'repeating_skillsmdr_-SeasonPrimaryA_skill_mdr': '47',
  'repeating_skillsmdr_-SeasonPrimaryB_skillname_mdr': '계절 동명 기능',
  'repeating_skillsmdr_-SeasonPrimaryB_skill_mdr': '47',
  _reporder_repeating_skillsmdr: '-SeasonPrimaryA,-SeasonPrimaryB',
}).forEach(([name, value]) => addAttribute(seasonPriorityCharacter.id, name, value));
helper.scan(seasonPriorityCharacter.id, true);
const seasonDistinctMessages = runApi('!!계절 동명 기능', seasonPriorityCharacter.get('name'));
const seasonDistinctRows = stagfieldActionButtons(seasonDistinctMessages.map((item) => item.content || '').join('\n'))
  .map((command) => command.split('|').map(decodeURIComponent)[4]);
seasonPriorityChecks.push({ label: 'preserve-same-primary-distinct-rows', rows: seasonDistinctRows,
  pass: seasonDistinctRows.slice().sort().join('|') === '-SeasonPrimaryA|-SeasonPrimaryB' &&
    !seasonDistinctMessages.some((item) => (item.content || '').includes('kib_sheet_result=')) });
delete sheetFieldDefaults[seasonPriorityCharacter.id];
characters.splice(characters.indexOf(seasonPriorityCharacter), 1);
attributeObjects.splice(seasonPriorityAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
assert(seasonPriorityChecks.every((item) => item.pass),
  '실제 19번 UI 기능명/독립 모드/원본 출력명 경계를 보존해야 합니다: ' + JSON.stringify(seasonPriorityChecks));

// 실제 20번: UI 정신/운과 원본 출력 정신력/행운은 같은 버튼의 별칭입니다.
// 비슷한 이름의 독립 기능, 일반/보너스 원식, 자원 최대값과 광기 처리는 유지합니다.
const pairSourceSheet = embeddedSheets.find((sheet) => sheet.id === 'sheet-5a49a6311b033377');
assert(pairSourceSheet, 'Pair 원본 임베드가 필요합니다.');
const pairSourceAttributeStart = attributeObjects.length;
const pairSourceCharacter = addSourceCharacter(pairSourceSheet, 'pair-visible-labels', 'Pair 표시명과 자원 회귀').character;
sheetFieldDefaults[pairSourceCharacter.id] = sourceDefaults(pairSourceSheet);
const pairSourceAttribute = (name) => attributeObjects.find((item) =>
  item.get('_characterid') === pairSourceCharacter.id && item.get('name') === name);
Object.entries({
  con: '80', siz: '50', pow: '60', luck: '50', psychoanalysis: '1', int: '100',
  hp: '10', mp: '10', san: '50', san_start: '50', cthulhu_mythos: '0',
  majorwound: '0', dying: '0', temp_insane: '0', indef_insane: '0', menu: 'skills',
}).forEach(([name, value]) => {
  const attribute = pairSourceAttribute(name) || addAttribute(pairSourceCharacter.id, name, value);
  attribute.set('current', value);
});
useContracts(...embeddedSheets);
useRoomCharacters(pairSourceCharacter);
assert.strictEqual(helper.inspectContracts(pairSourceCharacter.id).contract.id, pairSourceSheet.id,
  'Pair 회귀도 다른 34종을 남긴 상태에서 실제 원본으로 인식해야 합니다.');
const pairSourceChecks = [];
[['pow_check', '정신'], ['luck', '운']].forEach(([name, label]) => {
  const sourceRolls = pairSourceSheet.rolls.filter((roll) => roll.name === name);
  pairSourceChecks.push({ label: 'source-ui-' + label,
    pass: sourceRolls.length === 2 && sourceRolls.every((roll) => roll.label === label) });
});
const pairDiceBefore = runtime.getAttrByName(pairSourceCharacter.id, 'dice_corr');
[
  ['정신', 'pow_check', '정신력'], ['정신력', 'pow_check', '정신력'],
  ['운', 'luck', '행운'], ['행운', 'luck', '행운'],
  ['정신분석', 'psychoanalysis_check', '정신분석'],
].forEach(([query, name, outputName]) => {
  [[false, false], [true, false], [false, true], [true, true]].forEach(([bonus, secret]) => {
    const sourceRoll = pairSourceSheet.rolls.find((roll) => roll.name === name &&
      roll.raw.includes('@{dice_corr}') === bonus);
    assert(sourceRoll && sourceRoll.raw.includes('{{name=' + outputName + '}}'));
    const exact = helper.exactContractInstance(pairSourceCharacter.id, pairSourceSheet.id, sourceRoll.key, '', true);
    assert(exact.ok);
    const expected = helper.qualifyContractMacro(pairSourceCharacter.id, exact.instance, null);
    assert(expected.ok);
    const command = '!!' + (secret ? '비밀 ' : '') + query + (bonus ? ' 보너스1' : '');
    const messages = runApi(command, pairSourceCharacter.get('name'));
    const rolls = messages.filter((item) => (item.content || '').includes('kib_sheet_result='));
    const choices = stagfieldActionButtons(messages.map((item) => item.content || '').join('\n'));
    pairSourceChecks.push({ label: command, choices: choices.length, rolls: rolls.length,
      pass: choices.length === 0 && rolls.length === 1 &&
        rolls[0].content.replace(/ <!--kib_sheet_result=[A-Za-z0-9_-]+-->$/, '') ===
          (secret ? '/w gm ' : '') + expected.content });
  });
});
pairSourceChecks.push({ label: 'preserve-source-dice-selection',
  pass: runtime.getAttrByName(pairSourceCharacter.id, 'dice_corr') === pairDiceBefore });
function pairResourceMaximums(label, hpMax, mpMax) {
  const resources = helper.scan(pairSourceCharacter.id).resourcesByAttribute;
  pairSourceChecks.push({ label, actual: ['hp', 'mp', 'san'].map((name) => resources[name] && resources[name].max),
    pass: resources.hp && resources.hp.max === hpMax && resources.mp && resources.mp.max === mpMax &&
      resources.san && resources.san.max === 99 });
}
pairResourceMaximums('source-formulas-13-12', 13, 12);
const pairStatusData = helper.scan(pairSourceCharacter.id);
const pairStatusNames = pairStatusData.resources.filter((item) => item.statusResource).map((item) => item.name).sort();
const pairStatusText = runApi('!!상태', pairSourceCharacter.get('name')).map((item) => item.content || '').join(' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const pairStatusSection = (pairStatusText.match(/현재 수치 (\d+)개 (.*?) 항목을 좁혀/s) || []);
pairSourceChecks.push({ label: 'status-current-three-not-start-or-maximum', actual: pairStatusNames,
  pass: JSON.stringify(pairStatusNames) === JSON.stringify(['hp', 'mp', 'san']) && pairStatusSection[1] === '3' });
pairSourceChecks.push({ label: 'status-current-sanity-with-start-and-maximum', actual: pairStatusSection[2],
  pass: /이성 50 \/ 시작 50 \(100%\) \/ 최대 99/.test(pairStatusSection[2] || '') &&
    !/시작 이성|san_max/.test(pairStatusSection[2] || '') });
[['90', '70', 14, 14], ['80', '60', 13, 12]].forEach(([con, pow, hpMax, mpMax]) => {
  [['con', con], ['pow', pow]].forEach(([name, value]) => {
    const attribute = pairSourceAttribute(name), previous = attribute.get('current');
    attribute.set('current', value);
    events['change:attribute'](attribute, { current: previous });
  });
  pairResourceMaximums('source-formulas-after-' + con + '-' + pow, hpMax, mpMax);
});
const pairPreviousTracking = runtime.state.KIBSheetHelper.trackingMode;
runtime.state.KIBSheetHelper.trackingMode = 'public';
runGeneral(':마력-1', pairSourceCharacter.get('name'));
pairSourceChecks.push({ label: 'magic-not-health',
  pass: pairSourceAttribute('mp').get('current') === '9' && pairSourceAttribute('hp').get('current') === '10' &&
    pairSourceAttribute('majorwound').get('current') === '0' });
runGeneral(':체력-7', pairSourceCharacter.get('name'));
pairSourceChecks.push({ label: 'health-major-current-maximum',
  pass: pairSourceAttribute('hp').get('current') === '3' && pairSourceAttribute('mp').get('current') === '9' &&
    pairSourceAttribute('majorwound').get('current') === '1' });
[
  { int: 100, loss: 5, die: 95, temporary: '1', indefinite: '0' },
  { int: 1, loss: 5, die: 14, temporary: '0', indefinite: '0' },
  { int: 100, loss: 10, temporary: '0', indefinite: '1' },
].forEach((branch) => {
  Object.entries({ int: branch.int, san: 50, san_start: 50, temp_insane: 0, indef_insane: 0 })
    .forEach(([name, value]) => pairSourceAttribute(name).set('current', String(value)));
  helper.scan(pairSourceCharacter.id, true);
  const messages = runGeneral(':이성-' + branch.loss, pairSourceCharacter.get('name'));
  const changeText = messages.map((item) => item.content || '').join(' ').replace(/<[^>]*>/g, ' ');
  pairSourceChecks.push({ label: 'SAN-change-log-hides-maximum-' + branch.loss + '-INT-' + branch.int,
    pass: changeText.includes('시작 50') && !/최대\s*99|san_max/.test(changeText) });
  const automatic = messages.filter((item) => (item.content || '').includes('{{name=지능}}') &&
    item.content.includes('kib_sheet_result='));
  pairSourceChecks.push({ label: 'SAN-' + branch.loss + '-INT-' + branch.int + '-before-result',
    pass: automatic.length === (branch.die ? 1 : 0) &&
      pairSourceAttribute('san').get('current') === String(50 - branch.loss) &&
      pairSourceAttribute('san_start').get('current') === '50' &&
      pairSourceAttribute('temp_insane').get('current') === '0' });
  if (branch.die && automatic.length === 1) {
    const content = automatic[0].content;
    pairSourceChecks.push({ label: 'SAN-original-single-INT-' + branch.int,
      pass: content.includes('&{template:coc}') && content.includes('{{success=[[' + branch.int + ']]}}') &&
        content.includes('{{roll1=[[1d100]]}}') && !content.includes('{{roll2=') });
    const token = content.match(/kib_sheet_result=([A-Za-z0-9_-]+)(?:-->|\}\})/)[1];
    const fields = { success: branch.int, hard: Math.floor(branch.int / 2), extreme: Math.floor(branch.int / 5), roll1: branch.die };
    events['chat:message']({
      type: 'general', rolltemplate: 'coc',
      content: '{{name=지능}} ' + Object.keys(fields).map((name, index) => '{{' + name + '=$[[' + index + ']]}}').join(' ') +
        ' {{kib_sheet_result=' + token + '}}',
      inlinerolls: Object.values(fields).map((total) => ({ results: { total } })),
      who: pairSourceCharacter.get('name'), playerid: 'player-1',
    });
  }
  pairSourceChecks.push({ label: 'SAN-' + branch.loss + '-INT-' + branch.int + '-final-flags',
    pass: pairSourceAttribute('temp_insane').get('current') === branch.temporary &&
      pairSourceAttribute('indef_insane').get('current') === branch.indefinite &&
      pairSourceAttribute('san_start').get('current') === '50' });
});
runtime.state.KIBSheetHelper.trackingMode = pairPreviousTracking;
delete sheetFieldDefaults[pairSourceCharacter.id];
characters.splice(characters.indexOf(pairSourceCharacter), 1);
attributeObjects.splice(pairSourceAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);
assert(pairSourceChecks.every((item) => item.pass),
  '실제 20번 UI 별칭/원본 굴림/자원 공식/광기 분기를 보존해야 합니다: ' + JSON.stringify(pairSourceChecks));

// 표시명으로 연결되지 않아도 유일한 명시 최대 필드만 상태 자원으로 보완합니다.
// 일반 HTML max, 의미가 다른 이름, 중복 최대, 숨은 값과 반복행은 확대하지 않습니다.
const statusPairDefinitions = [
  ['meter', '잔량', 5, ''], ['meter_max', '최대', 10, 'disabled'],
  ['doubled', '분리량', 5, ''], ['doubled_max', '최대', 20, 'disabled'], ['max_doubled', '최대', 30, 'disabled'],
  ['named_wrong', '무관값', 5, ''], ['named_wrong_max', '작성번호', 10, 'disabled'],
  ['hidden_pair', '숨은 한도값', 5, ''], ['hidden_pair_max', '최대', 10, 'hidden disabled'],
  ['hidden_current', '감춘 값', 5, 'hidden'], ['hidden_current_max', '최대', 10, 'disabled'],
  ['starting_meter', '시작 측정값', 5, ''], ['starting_meter_max', '최대', 10, 'disabled'],
  ['disabled_meter', '읽기전용 값', 5, 'disabled'], ['disabled_meter_max', '최대', 10, 'disabled'],
  ['ordinary_skill', '독립 기능', 5, 'max="99"'], ['inline_hp', '체력', 5, 'max="20"'],
  ['reference_limit', '보관 한계', 17, ''], ['dynamic_pool', '동적 자원', 5, 'max="@{reference_limit}"'],
];
const statusPairSheet = parseSheetContract(statusPairDefinitions.map(([name, label, value, attrs]) =>
  `<label>${label}<input type="number" name="attr_${name}" value="${value}" ${attrs}></label>`).concat([
  '<div><strong>독립 자원</strong><input title="현재" type="number" name="attr_label_current" value="5">',
  '<input title="최대" type="number" name="attr_label_limit" value="10" disabled></div>',
  '<fieldset class="repeating_samples"><label>행 값<input type="number" name="attr_row_meter" value="5"></label>',
  '<label>최대<input type="number" name="attr_row_meter_max" value="10" disabled></label></fieldset>',
  '<button type="roll" name="roll_status_pair" value="&{template:status_pair} {{subject=독립 판정}} {{success=[[@{meter}]]}} {{roll=[[1d100]]}}">독립 판정</button>',
  '<button type="roll" name="roll_internal_probe" value="&{template:status_pair} {{roll=[[1d6]]}}"></button>',
  '<button type="roll" name="roll_random_threshold" value="&{template:status_pair} {{subject=주사위 기준}} {{stat=[[[[1d6]]]]}} {{roll=[[1d100]]}}"></button>',
  '<button type="roll" name="roll_broken_threshold" value="&{template:status_pair} {{subject=불완전 기준}} {{stat=[[[[50]]}} {{roll=[[1d100]]}}"></button>',
]).join('\n'), { id: 'status-resource-name-pair', sourceHash: 'status-resource-name-pair-v1' });
const statusPairAttributeStart = attributeObjects.length;
const statusPairCharacter = addCharacter('status-resource-name-pair', '현재 수치 표시 경계', 'player-1', {
  ...Object.fromEntries(statusPairDefinitions.map(([name, , value]) => [name, String(value)])),
  label_current: '5', label_limit: '10', repeating_samples_row1_row_meter: '5', repeating_samples_row1_row_meter_max: '10',
});
useContracts(statusPairSheet);
useRoomCharacters(statusPairCharacter);
const statusPairData = helper.scan(statusPairCharacter.id, true);
const statusPairNames = statusPairData.resources.filter((item) => item.statusResource).map((item) => item.name).sort();
assert.deepStrictEqual(Array.from(statusPairNames), ['inline_hp', 'label_current', 'meter'],
  '유일한 명시 최대/기존 label·HTML 자원만 표시하고 무관·중복·숨김·반복·시작값은 제외해야 합니다.');
assert.strictEqual(statusPairData.resourcesByAttribute.doubled.max, null,
  '같은 원본 이름으로 연결되는 최대가 둘이면 표시와 최대값 모두 임의 선택하면 안 됩니다.');
['ordinary_skill', 'inline_hp'].forEach((name) => {
  assert.strictEqual(statusPairData.resourcesByAttribute[name].max, null,
    '숫자형 HTML 입력 상한은 기능이나 자원의 실제 최대값이 아닙니다: ' + name);
});
[['meter', 10], ['label_current', 10], ['dynamic_pool', 17]].forEach(([name, maximum]) => {
  assert.strictEqual(statusPairData.resourcesByAttribute[name].max, maximum,
    '명시 최대 필드와 HTML max의 동적 속성 참조는 보존해야 합니다: ' + name);
});
const headerlessProbe = statusPairSheet.rolls.find((roll) => roll.name === 'internal_probe');
assert(headerlessProbe && !headerlessProbe.staticLabels.length &&
  helper.contractRolls(statusPairCharacter.id).some((instance) => instance.roll.key === headerlessProbe.key),
  'header 없는 내부 키 굴림도 원본 계약과 직접 실행 후보에는 보존해야 합니다.');
const statusPairHtml = runApi('!!상태', statusPairCharacter.get('name'))
  .find((item) => item.who === '시트 헬퍼').content;
assert(!statusPairHtml.includes('internal_probe'),
  '원본 header 없이 버튼 내부 키만 있는 굴림은 상태 표시명으로 노출하면 안 됩니다.');
['주사위 기준', '불완전 기준'].forEach((label) => {
  assert(statusPairHtml.includes('>' + label + '</span>'),
    '주사위나 짝이 맞지 않는 중첩 inline을 확정 숫자로 표시하면 안 됩니다: ' + label);
});
assert(statusPairData.resourcesByAttribute.starting_meter &&
  statusPairData.resourcesByAttribute.repeating_samples_row1_row_meter,
  '시작값과 실제 반복행은 상태에서만 제외하고 일반 수치 접근은 보존해야 합니다.');
characters.splice(characters.indexOf(statusPairCharacter), 1);
attributeObjects.splice(statusPairAttributeStart);
useContracts(...embeddedSheets);
useRoomCharacters(westernAutoCharacter);

const workerSwitchSheet = parseSheetContract(`
  <input type="checkbox" name="attr_route" value="1">
  <select name="attr_bonus"><option value="0">보통</option><option value="1">보너스1</option><option value="-1">페널티1</option></select>
  <div class="new"><button type="roll" name="roll_check" value="&{template:test} {{subject=검증 판정}} {{roll=[[1d6+@{bonus}]]}}">검증 판정</button></div>
  <div class="old hidden"><button type="roll" name="roll_check" value="&{template:test} {{subject=검증 판정}} {{roll=[[1d8+@{bonus}]]}}">검증 판정</button></div>
  <script type="text/worker">
  on("sheet:opened change:route", function() {
    getAttrs(["route"], function(v) {
      var mode = parseInt(v.route);
      if (mode == 1) {
        $20(".new").addClass("hidden"); $20(".old").removeClass("hidden");
      } else {
        $20(".new").removeClass("hidden"); $20(".old").addClass("hidden");
      }
    });
  });
  </script>`, { id: 'worker-panel-switch' });
const workerSwitchCharacter = addCharacter('worker-switch', '워커 전환 검증', 'player-1', { route: '0', bonus: '0' });
useContracts(workerSwitchSheet);
useRoomCharacters(workerSwitchCharacter);
const workerRouteAttribute = attributeObjects.find(item => item.get('_characterid') === workerSwitchCharacter.id && item.get('name') === 'route');
['0', '1', '0'].forEach(value => {
  const before = workerRouteAttribute.get('current');
  workerRouteAttribute.set('current', value);
  events['change:attribute'](workerRouteAttribute, { current: before });
  const expected = value === '1' ? '1d8' : '1d6';
  const all = helper.scan(workerSwitchCharacter.id).contractAllRolls;
  assert.strictEqual(all.length, 1, '명시 모드 후보에도 비활성 워커 영역은 남지 않아야 합니다.');
  assert(all[0].roll.raw.includes(expected));
  ['!!검증 판정', '!!검증 판정 보너스1', '!!검증 판정 페널티1'].forEach(command => {
    const output = runApi(command, workerSwitchCharacter.get('name')).map(item => String(item.content || '')).join('\n');
    assert(output.includes(expected) && !output.includes('어느 항목'), command + ': ' + output);
  });
});

const settingsTrackingSheet = parseSheetContract(`
  <input type="checkbox" class="HideConfig" name="attr_navigation" value="1">
  <section class="sheet-settings">
    <select name="attr_edition"><option value="normal">일반</option><option value="hero">영웅</option></select>
    <input type="checkbox" name="attr_style" value="1">
    <label>최대값 배율<input type="checkbox" name="attr_capacity_rule" value="5"></label>
  </section>
  <label>체력<input name="attr_health" type="number" value="10" max="@{limit}"></label>
  <label>최대 체력<input name="attr_limit" type="number" value="20" readonly></label>
  <label>중상<input name="attr_wound" type="checkbox" value="1"></label>
  <button type="roll" value="&{template:test} {{subject=체력 판정}} {{roll=[[1d100]]}}">체력 판정</button>`,
{ id: 'settings-tracking', userOptions: [{ attribute: 'edition' }, { attribute: 'style' }] });
const settingsTrackingCharacter = addCharacter('settings-tracking', '설정 분리 검증', 'player-1', {
  edition: 'normal', style: '0', navigation: '0', capacity_rule: '0', health: '10', limit: '20', wound: '0',
});
useContracts(settingsTrackingSheet);
useRoomCharacters(settingsTrackingCharacter);
runtime.state.KIBSheetHelper.trackingMode = 'public';
const settingsAttributes = Object.fromEntries(attributeObjects.filter(item => item.get('_characterid') === settingsTrackingCharacter.id).map(item => [item.get('name'), item]));
const settingsScan = helper.scan(settingsTrackingCharacter.id);
assert.strictEqual(settingsScan.resourcesByAttribute.health.max, 20);
['navigation', 'style', 'capacity_rule'].forEach(name => assert(!settingsScan.trackedFields[name]));
assert(settingsScan.trackedFields.wound, '원본 중상 체크는 추적해야 합니다.');
const settingsLogStart = sent.length;
Object.entries({ navigation: '1', style: '1', capacity_rule: '5', limit: '40' }).forEach(([name, value]) => {
  const previous = settingsAttributes[name].get('current');
  settingsAttributes[name].set('current', value);
  events['change:attribute'](settingsAttributes[name], { current: previous });
});
assert(!sent.slice(settingsLogStart).some(item => String(item.content || '').includes('→')), '설정 변경은 상태 로그로 보내지 않습니다.');
assert.strictEqual(helper.scan(settingsTrackingCharacter.id).resourcesByAttribute.health.max, 40,
  '설정 추적을 꺼도 변경 감지와 실제 최대 수치 갱신은 유지해야 합니다.');
const settingsResourceLog = runGeneral(':체력+1', settingsTrackingCharacter.get('name'));
assert.strictEqual(settingsAttributes.health.get('current'), '11');
assert(settingsResourceLog.some(item => String(item.content || '').includes('40')), '실제 수치 로그는 갱신된 최대값을 써야 합니다.');
const settingsStateStart = sent.length;
settingsAttributes.wound.set('current', '1');
events['change:attribute'](settingsAttributes.wound, { current: '0' });
assert(sent.slice(settingsStateStart).some(item => /중상/.test(String(item.content || ''))), '상태 체크 알림까지 꺼지면 안 됩니다.');

console.log('Sheet Helper check: PASS');
