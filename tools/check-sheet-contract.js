const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { parseSheetContract } = require('./sheet-contract-parser');
const { buildSheetContract, readTranslationInputs } = require('./build-sheet-contract');
const {
  brotliBase64,
  readSheet,
  render,
  renderBrotliDecoder,
} = require('./embed-sheet-recognition');

const decoderRuntime = {
  module: { exports: 'must-not-be-used' },
  exports: { mustNotBeUsed: true },
  define() { throw new Error('AMD must not be used.'); },
  window: { mustNotBeUsed: true },
  global: { mustNotBeUsed: true },
};
vm.runInNewContext(renderBrotliDecoder(), decoderRuntime);
const brotliRoundTripText = JSON.stringify({
  kind: 'sheet-contract-round-trip',
  values: Array.from({ length: 256 }, (_, index) => `field-${index}:${index % 17}`),
});
const brotliRoundTripPayload = brotliBase64(brotliRoundTripText);
assert.strictEqual(
  decoderRuntime.DecodeBrotliJson(brotliRoundTripPayload),
  brotliRoundTripText,
  'Node 기본 Brotli 압축 결과를 Roll20용 ES5 디코더가 그대로 복원해야 합니다.',
);
[
  brotliRoundTripPayload.slice(0, -4),
  `*${brotliRoundTripPayload.slice(1)}`,
].forEach((malformed) => {
  assert.throws(
    () => decoderRuntime.DecodeBrotliJson(malformed),
    '잘리거나 잘못 인코딩된 Brotli 데이터는 복원 중 즉시 거부해야 합니다.',
  );
});

const html = `
<div class="madness-control">
  <select name="attr_madness_mode">
    <option value="rt" selected>실시간</option>
    <option value="summary">요약</option>
  </select>
  <button type="roll" name="roll_madness" value="&amp;{template:test} {{kind=@{madness_mode}}} {{name=광기}}">광기</button>
</div>
<div class="dice-control">
  <label><input type="radio" name="attr_dice_mode" value="[[1d100]]" checked>일반</label>
  <label><input type="radio" name="attr_dice_mode" value="{{dice_type=[[@{bonus_count}]]}}">보너스
    <select name="attr_bonus_count">
      <option value="1">1개</option>
      <option value="2">2개</option>
    </select>
    개
  </label>
  <button type="roll" name="roll_check" value="&amp;{template:test} {{dice=@{dice_mode}}} {{visibility=@{visibility}}}">판정</button>
</div>
<label><input type="radio" name="attr_visibility" value="public" checked>공개</label>
<label><input type="radio" name="attr_visibility" value="secret">비밀</label>
<div class="sibling-control">
  <div><input type="radio" name="attr_sibling_mode" value="normal" checked><span>기본 주사위</span></div>
  <div><input type="radio" name="attr_sibling_mode" value="bonus"><span>보너스 1개</span></div>
  <button type="roll" name="roll_sibling" value="&amp;{template:test} {{dice=@{sibling_mode}}}">인접 선택</button>
</div>
<div><select name="attr_theme"><option value="0">봄</option><option value="1">여름</option></select></div>
<div><button type="roll" name="roll_theme" value="&amp;{template:test} {{theme=@{theme}}} {{roll=[[1d6]]}}">테마 판정</button></div>
<button type="roll" value="&amp;{template:test} {{visibility=?{공개 방식|공개,public|비밀,secret}}}">질의</button>
<button type="roll" name="roll_double" value="&amp;{template:test} {{roll=[[?{Difficulty|Easy,1|Hard,2}+?{Size|Small,10|Large,20}]]}}">Double</button>
<button type="roll" name="roll_twin" value="&amp;{template:test} {{roll=[[?{Pick|A,1|B,2}+?{Pick|A,1|B,2}]]}}">Twin</button>
<input type="text" name="attr_free_formula" value="1d6">
<textarea name="attr_other_formula">1d8</textarea>
<input type="number" name="attr_skill_formula" value="55">
<button type="roll" name="roll_free" value="&amp;{template:test} {{formula=@{free_formula}}} {{result=[[@{free_formula}]]}}">자유</button>
<button type="roll" name="roll_prefixed_free" value="&amp;{template:test} {{name=Rolling @{other_formula}}} {{result=[[@{other_formula}]]}}">다른 자유</button>
<button type="roll" name="roll_skill_formula" value="&amp;{template:test} {{target=@{skill_formula}}} {{result=[[@{skill_formula}]]}}">일반 수치 판정</button>
<input name="attr_direct_formula" value="1d20">
<input name="attr_modifier" value="3">
<button type="roll" name="roll_direct" value="&amp;{template:test} {{result=[[@{direct_formula}]]}}">직접 식</button>
<button type="roll" name="roll_composed" value="&amp;{template:test} {{result=[[1d20+@{modifier}]]}}">조합 식</button>
<div class="roll-row"><div><button type="roll" name="roll_adjacent" value="&amp;{template:test} {{roll=[[1d6]]}}"></button></div><div><span>인접 실행</span></div></div>
<div class="mode-and-free">
  <div><span>패널티 2개</span><input name="attr_penalty"></div>
  <div><span>자유다이스</span><input name="attr_local_formula"><button type="roll" name="roll_local_free" value="&amp;{template:test} {{roll=[[@{local_formula}]]}}"></button></div>
</div>
<div class="free-and-stats">
  <div><button type="roll" name="roll_unlabelled_free" value="&amp;{template:test} {{roll=[[@{blank_formula}]]}}"></button><input name="attr_blank_formula"></div>
  <div><button type="roll" name="roll_luck_neighbor" value="&amp;{template:test} {{roll=[[1d100]]}}">행운</button><span>체구</span><input name="attr_build"></div>
</div>
<div class="items">
  <div><button type="roll" name="roll_item_one" value="&amp;{template:test} {{items=[[1]]}}"></button><span data-i18n="items_painkiller">Painkiller</span><input></div>
  <div><button type="roll" name="roll_item_two" value="&amp;{template:test} {{items=[[2]]}}"></button><span data-i18n="items_weapon">Weapon</span><input></div>
</div>
<div class="skills">
  <div><button type="roll" name="roll_skill_one" data-i18n="incineration" value="&amp;{template:test} {{roll=[[2d6]]}}">Incineration</button><input></div>
  <div><button type="roll" name="roll_skill_two" data-i18n="torture" value="&amp;{template:test} {{roll=[[2d6]]}}">Torture</button><input></div>
</div>

<fieldset class="repeating_weapon">
  <input name="attr_damage" value="1d6">
  <button type="roll" name="roll_damage" value="&amp;{template:test} {{damage=@{damage}}} {{maximum=@{damage|max}}}">피해</button>
</fieldset>`;

const contract = parseSheetContract(html, { name: '합성 시트', id: 'fixture', sourceHash: 'abc123' });

function packedContractShape(sheet) {
  const fieldKeys = [
    'name', 'type', 'label', 'aliases', 'section', 'default', 'max', 'onValue', 'visibility',
    'groupLabel', 'numericCandidate', 'trackCandidate', 'readonly', 'disabled', 'hidden',
  ];
  (sheet.fields || []).forEach((field) => {
    const unknown = Object.keys(field).filter((key) => !fieldKeys.includes(key));
    assert.deepStrictEqual(unknown, [], `필드 압축기가 보존하지 않는 새 속성이 있습니다: ${unknown.join(', ')}`);
  });
  return JSON.parse(JSON.stringify({
    attributes: sheet.attributes || [],
    globalAttributes: sheet.globalAttributes || [],
    sections: sheet.sections || {},
    controls: sheet.controls || {},
    resultTemplates: sheet.resultTemplates || [],
    rolls: (sheet.rolls || []).map((roll) => Object.assign({ modes: [] }, roll)),
    fields: (sheet.fields || []).map((field) => ({
      name: field.name,
      type: field.type || 'text',
      label: field.label || field.name,
      aliases: field.aliases || [],
      section: field.section || null,
      default: field.default || '',
      max: field.max || '',
      onValue: field.onValue || '',
      visibility: field.visibility || null,
      groupLabel: field.groupLabel || '',
      numericCandidate: field.numericCandidate === true,
      trackCandidate: field.trackCandidate === true,
      readonly: field.readonly === true,
      disabled: field.disabled === true,
      hidden: field.hidden === true,
    })),
  }));
}

const packedContractRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([contract]), packedContractRuntime);
assert.deepStrictEqual(packedContractShape(packedContractRuntime.KIBSheetContracts[0]), packedContractShape(contract),
  '시트 정보 압축·복원 과정에서 굴림·선택지·수치·반복 구역 정보가 달라지면 안 됩니다.');

const sharedModeRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([{ id: 'shared-modes', rolls: [
  { name: 'first', modes: [{ overrides: { mode: 'normal' } }] },
  { name: 'second', modes: [{ overrides: { mode: 'normal' } }] },
] }]), sharedModeRuntime);
const sharedModeRolls = sharedModeRuntime.KIBSheetContracts[0].rolls;
assert.notStrictEqual(sharedModeRolls[0].modes, sharedModeRolls[1].modes);
assert.notStrictEqual(sharedModeRolls[0].modes[0], sharedModeRolls[1].modes[0]);
assert(!Object.isFrozen(sharedModeRolls[0].modes));
assert(!Object.isFrozen(sharedModeRolls[0].modes[0]));
assert(!Object.isFrozen(sharedModeRolls[0].modes[0].overrides));
sharedModeRolls[0].modes[0].overrides.mode = 'changed';
assert.strictEqual(sharedModeRolls[1].modes[0].overrides.mode, 'normal',
  '한 굴림의 선택 방식 변경이 다른 굴림을 오염시키면 안 됩니다.');
sharedModeRolls[0].modes.push({ overrides: { mode: 'extra' } });
assert.strictEqual(sharedModeRolls[1].modes.length, 1,
  '한 굴림의 선택 방식 추가가 다른 굴림을 오염시키면 안 됩니다.');

const packedRollVisibilityRuntime = { KIBSheetContracts: [] };
const packedRollVisibility = { any: [{ name: 'display_mode', op: 'eq', value: 'detail', scope: 'global' }] };
vm.runInNewContext(render([{ id: 'shared-roll-visibility', rolls: [
  { key: 'first', modes: [], visibility: packedRollVisibility },
  { key: 'second', modes: [], visibility: packedRollVisibility },
  { key: 'third', modes: [] },
] }]), packedRollVisibilityRuntime);
const restoredRollVisibilitySheet = packedRollVisibilityRuntime.KIBSheetContracts[0];
assert(!Object.prototype.hasOwnProperty.call(restoredRollVisibilitySheet, 'rollVisibilitySets'));
assert.strictEqual(JSON.stringify(restoredRollVisibilitySheet.rolls.map((roll) => roll.visibility || null)),
  JSON.stringify([packedRollVisibility, packedRollVisibility, null]),
  '압축한 굴림 표시 조건을 원래 순서와 값으로 복원해야 합니다.');
assert.strictEqual(restoredRollVisibilitySheet.rolls[0].visibility, restoredRollVisibilitySheet.rolls[1].visibility,
  '같은 굴림 표시 조건은 중복 생성하지 않아야 합니다.');

const packedVisibilityRuntime = { KIBSheetContracts: [] };
const packedVisibility = { not: { name: 'temporary_mode', op: 'eq', value: 'on', scope: 'global' } };
vm.runInNewContext(render([{
  id: 'shared-field-visibility', attributes: ['major_one', 'major_two'], sections: {}, rolls: [],
  fields: [
    { name: 'major_one', type: 'checkbox', label: '중상 1', trackCandidate: true, visibility: packedVisibility },
    { name: 'major_two', type: 'checkbox', label: '중상 2', trackCandidate: true, visibility: packedVisibility },
  ],
}]), packedVisibilityRuntime);
const restoredVisibilitySheet = packedVisibilityRuntime.KIBSheetContracts[0];
assert(!Object.prototype.hasOwnProperty.call(restoredVisibilitySheet, 'fieldVisibilitySets'));
assert.strictEqual(JSON.stringify(restoredVisibilitySheet.fields.map((field) => field.visibility)),
  JSON.stringify([packedVisibility, packedVisibility]), '압축한 필드 표시 조건을 배포 런타임에서 그대로 복원해야 합니다.');
assert(restoredVisibilitySheet.fields.every((field) => field.groupLabel === ''),
  '자원 묶음 정보가 없는 기존 필드는 압축·복원 뒤 빈값으로 호환되어야 합니다.');

const packedGlobalRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([{
  id: 'packed-global-fields', attributes: ['fixed', 'shared', 'repeat_only'],
  globalAttributes: ['fixed', 'shared'], sections: { repeating_test: ['shared', 'repeat_only'] },
  rolls: [], fields: [],
}]), packedGlobalRuntime);
assert.strictEqual(JSON.stringify(packedGlobalRuntime.KIBSheetContracts[0].globalAttributes),
  JSON.stringify(['fixed', 'shared']),
  '일반·반복 구역에 같은 이름이 있어도 압축·복원 뒤 일반 속성 목록을 그대로 보존해야 합니다.');

assert.strictEqual(contract.version, 1);
assert.strictEqual(contract.id, 'fixture');
assert.strictEqual(contract.sourceHash, 'abc123');
assert.strictEqual(contract.controls.madness_mode.type, 'select');
assert.strictEqual(contract.controls.madness_mode.default, 'rt');
assert.strictEqual(contract.controls.visibility.type, 'radio');
assert.deepStrictEqual(contract.controls.dice_mode.options.map((option) => option.label), ['일반', '보너스 개']);
assert.deepStrictEqual(contract.controls.sibling_mode.options.map((option) => option.label), ['기본 주사위', '보너스 1개']);
assert(contract.signature.length <= 32);
assert(contract.attributes.includes('madness_mode'));
assert(contract.attributes.includes('free_formula'));
assert(contract.attributes.includes('damage'));
assert(contract.globalAttributes.includes('free_formula'));
assert(!contract.globalAttributes.includes('damage'));

const fieldContract = parseSheetContract(`
  <label for="vital-current">체력</label><input id="vital-current" type="number" name="attr_vital_current" value="10">
  <div class="resource"><strong>이성</strong><div><input title="현재" type="number" name="attr_mind_current" value="40"></div></div>
  <div class="resource-box"><div class="resource-title">체력</div><input type="hidden" name="attr_health_ratio"><div><div><input title="현재" type="number" name="attr_health_current"><input title="최대" type="number" name="attr_health_max" value="20" disabled></div></div><div><input type="checkbox" name="attr_health_warning"><span>위험</span></div></div>
  <div class="wide-resource"><div><strong>이성</strong><button type="roll" value="&{template:test} {{subject=이성}} {{success=[[@{sanity_current}]]}} {{roll=[[1d100]]}}"></button></div><div><input title="현재" type="number" name="attr_sanity_current"><input title="최대" type="number" name="attr_sanity_max" value="99" disabled></div><input title="시작" type="number" name="attr_sanity_start"><input title="행운" type="number" name="attr_extra_score"></div>
  <div class="split-outer"><h4>MEMO</h4><div class="split-resource"><div class="split-start"><button type="roll" value="&{template:test} {{subject=정신 안정}} {{success=[[@{split_current}]]}}">정신 안정</button><input title="시작" type="number" name="attr_split_start"></div><div class="split-current"><input title="현재" type="number" name="attr_split_current"><input title="최대" type="number" name="attr_split_max"></div></div></div>
  <div class="line-resource"><div class="sheet-tit"><strong>평정</strong><button type="roll" value="&{template:test} {{subject=평정}} {{success=[[@{line_current}]]}}"></button></div><div class="sheet-control"><strong>시작평정</strong><input title="시작" type="number" name="attr_line_start"></div><div class="sheet-graph"><div class="sheet-graph-input"><input title="현재" type="number" name="attr_line_current"><input title="최대" type="number" name="attr_line_max"></div></div></div>
  <div class="bloody-resource"><div class="sheet-frame"><strong>정신 안정<button type="roll" value="&{template:test} {{speaker=@{narration_name}}} {{subject=정신 안정}} {{success=[[@{blood_current}]]}} {{roll=[[1d100]]}}"></button></strong><input title="현재" type="number" name="attr_blood_current"> / <input title="최대" type="number" name="attr_blood_limit" value="99" disabled readonly><div class="sheet-side"><input placeholder="시작" type="number" name="attr_blood_start"></div></div></div>
  <input type="text" name="attr_narration_name">
  <div class="official-resource"><h4 data-i18n="stability-title">Stability</h4><div class="section"><div class="sheet-row"><button type="roll" value="&{template:test} {{name=Stability Roll}} {{success=[[@{official_current}]]}} {{roll=[[1d100]]}}"></button><input placeholder="4/5" type="text" name="attr_official_threshold" readonly><input data-i18n-placeholder="current-label" placeholder="current" type="text" name="attr_official_current"> / <input placeholder="max" type="number" name="attr_official_limit" readonly><input data-i18n-placeholder="start-label" placeholder="start" type="text" name="attr_official_start"></div><div class="sheet-row"><input title="현재" type="number" name="attr_unrelated_current"></div></div></div>
  <label>장기적 광기<input type="checkbox" name="attr_long_madness" value="checked-value"></label>
  <button type="roll" value="&{template:test} {{subject=지능}} {{success=[[@{mind_score}]]}}">지능</button>
  <input type="number" name="attr_mind_score" value="50">
  <label>메모<textarea name="attr_note">기록</textarea></label>
  <input type="hidden" name="attr_internal_total" value="10">
  <label>잠금 수치<input name="attr_locked_value" value="10" readonly></label>
  <label>비활성 수치<input name="attr_disabled_value" value="10" disabled></label>
  <div class="field-row"><div class="field-name"><button type="roll" value="&{template:test} {{name=외모}} {{value=[[@{appearance}]]}}"><span>외모</span></button></div><div class="field-value"><input type="number" name="attr_appearance" value="50"></div></div>
  <div class="free-row"><button type="roll" value="&{template:test} {{value=[[@{free_formula}]]}}"></button><input type="text" name="attr_free_formula" value="1d100"></div>
  <input type="hidden" name="attr_template_data" value="{{name=@{character_name}}}">
  <table><tr><td>행운</td><td><input type="number" name="attr_fortune" value="40"></td></tr></table>
  <div class="sheet-credit">커스텀 시트 제작 : 예시 제작자 | 디자인 : 예시 디자이너</div>
  <fieldset class="repeating_weapon"><label>내구도<input type="number" name="attr_durability"></label></fieldset>
`, { translations: [{
  'stability-title': '정신 안정',
  'current-label': '현재',
  'start-label': '시작',
}] });
const vitalField = fieldContract.fields.find((field) => field.name === 'vital_current');
assert.strictEqual(vitalField.label, '체력');
assert.strictEqual(vitalField.type, 'number');
assert.strictEqual(vitalField.section, null);
assert.strictEqual(vitalField.numericCandidate, true);
assert.strictEqual(vitalField.trackCandidate, true);
const mindField = fieldContract.fields.find((field) => field.name === 'mind_current');
assert(mindField.aliases.includes('이성'), '현재 입력란은 상위 묶음의 사용자 표시명도 보존해야 합니다.');
assert(fieldContract.fields.find((field) => field.name === 'health_current').aliases.includes('체력'),
  '체크박스가 함께 있는 자원 묶음에서도 현재 수치의 상위 제목을 보존해야 합니다.');
assert(fieldContract.fields.find((field) => field.name === 'health_max').aliases.includes('체력'),
  '같은 자원 묶음의 최대 수치에도 현재 수치와 같은 원본 제목을 보존해야 합니다.');
assert(fieldContract.fields.find((field) => field.name === 'sanity_current').aliases.includes('이성'),
  '넓은 자원 묶음에서는 그 수치 하나를 참조하는 원본 굴림명을 별칭으로 보존해야 합니다.');
assert(fieldContract.fields.find((field) => field.name === 'sanity_max').aliases.includes('이성'),
  '같은 입력 묶음의 최대값은 원본 굴림에서 얻은 현재값 표시명을 공유해야 합니다.');
['split_start', 'split_current', 'split_max'].forEach((name) => {
  assert.strictEqual(fieldContract.fields.find((field) => field.name === name).groupLabel, '정신 안정',
    `떨어진 시작·현재 입력 묶음의 ${name} 필드는 가까운 원본 굴림명을 사용해야 합니다.`);
});
['line_start', 'line_current', 'line_max'].forEach((name) => {
  assert.strictEqual(fieldContract.fields.find((field) => field.name === name).groupLabel, '평정',
    `중간 제어 상자의 텍스트가 ${name}의 상위 자원 제목을 덮어쓰면 안 됩니다.`);
});
['blood_current', 'blood_limit', 'blood_start'].forEach((name) => {
  const field = fieldContract.fields.find((item) => item.name === name);
  assert.strictEqual(field.groupLabel, '정신 안정',
    `Bloody Mary형 중첩 자원 묶음의 ${name} 필드는 원본 제목으로 결속되어야 합니다.`);
  assert(!field.aliases.includes('정신 안정'),
    `Bloody Mary형 ${name}의 검색 별칭에 공통 제목을 넣어 현재값과 시작값을 모호하게 만들면 안 됩니다.`);
});
['official_threshold', 'official_current', 'official_limit', 'official_start'].forEach((name) => {
  const field = fieldContract.fields.find((item) => item.name === name);
  assert.strictEqual(field.groupLabel, '정신 안정',
    `공식 시트형 자원 행의 ${name} 필드는 번역된 상위 제목으로 결속되어야 합니다.`);
  assert(!field.aliases.includes('정신 안정'),
    `공식 시트형 ${name}의 검색 별칭에 공통 제목을 넣어 현재값과 시작값을 모호하게 만들면 안 됩니다.`);
});
assert.strictEqual(fieldContract.fields.find((field) => field.name === 'unrelated_current').groupLabel, undefined,
  '같은 큰 구역의 다른 행까지 자원 제목이 번지면 안 됩니다.');
const groupedFieldRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([fieldContract]), groupedFieldRuntime);
['blood_current', 'blood_limit', 'blood_start', 'official_threshold', 'official_current', 'official_limit', 'official_start']
  .forEach((name) => {
    assert.strictEqual(groupedFieldRuntime.KIBSheetContracts[0].fields.find((field) => field.name === name).groupLabel, '정신 안정',
      `압축·복원 뒤에도 ${name}의 원본 자원 결속을 보존해야 합니다.`);
  });
assert.strictEqual(fieldContract.fields.find((field) => field.name === 'appearance').label, '외모',
  '같은 항목 묶음의 유일한 굴림 버튼은 입력 필드의 사용자 표시명이어야 합니다.');
assert.strictEqual(fieldContract.fields.find((field) => field.name === 'fortune').label, '행운',
  '같은 표 행의 앞쪽 셀은 입력 필드의 사용자 표시명이어야 합니다.');
const freeFormulaField = fieldContract.fields.find((field) => field.name === 'free_formula');
[freeFormulaField, fieldContract.fields.find((field) => field.name === 'template_data')].forEach((field) => {
  assert(![field.label].concat(field.aliases).some((label) =>
    /커스텀 시트 제작|디자인\s*:/.test(label)),
    '멀리 떨어진 제작자·디자인 표기를 입력 필드 라벨로 읽으면 안 됩니다.');
});
assert.strictEqual(fieldContract.fields.find((field) => field.name === 'long_madness').onValue, 'checked-value');
assert.strictEqual(fieldContract.fields.find((field) => field.name === 'durability').section, 'repeating_weapon');
['note', 'internal_total', 'locked_value', 'disabled_value'].forEach((name) => {
  assert.strictEqual(fieldContract.fields.find((field) => field.name === name).numericCandidate, false,
    `${name} 필드는 변경 가능한 수치 입력 후보가 아니어야 합니다.`);
});
['internal_total', 'locked_value', 'disabled_value'].forEach((name) => {
  assert(!fieldContract.signature.includes(name),
    `${name} 필드는 실제로 저장할 수 없는 값이므로 시트 인식 기준이 아니어야 합니다.`);
});

const madness = contract.rolls.find((roll) => roll.name === 'madness');
assert.strictEqual(madness.raw.startsWith('&{template:test}'), true);
assert(madness.staticLabels.some((entry) => entry.field === 'name' && entry.value === '광기'));
assert.deepStrictEqual(madness.modes.map((mode) => mode.labelPath), [['실시간'], ['요약']]);
assert.deepStrictEqual(madness.modes.map((mode) => mode.overrides.madness_mode), ['rt', 'summary']);

const check = contract.rolls.find((roll) => roll.name === 'check');
assert.strictEqual(check.modes.length, 5);
assert(check.modes.some((mode) => mode.labelPath.join('/') === '보너스 개/2개'));
assert(check.modes.some((mode) => mode.overrides.dice_mode === '{{dice_type=[[@{bonus_count}]]}}' && mode.overrides.bonus_count === '2'));
assert(check.modes.some((mode) => mode.overrides.visibility === 'secret'));
assert(!check.modes.some((mode) => mode.overrides.dice_mode && mode.overrides.visibility));

const query = contract.rolls.find((roll) => roll.label === '질의');
assert(query.modes.some((mode) => mode.labelPath[0] === '비밀' && mode.queries['공개 방식'].value === 'secret'));
assert(query.modes.every((mode) => mode.queries['공개 방식'].raw.includes('?{공개 방식')));
assert(query.modes.some((mode) => mode.aliases.includes('공개 방식 비밀')));

const sibling = contract.rolls.find((roll) => roll.name === 'sibling');
assert.deepStrictEqual(sibling.modes.map((mode) => mode.labelPath), [['기본 주사위'], ['보너스 1개']]);
const theme = contract.rolls.find((roll) => roll.name === 'theme');
assert.deepStrictEqual(theme.modes.map((mode) => mode.labelPath), [['봄'], ['여름']]);
assert.deepStrictEqual(theme.modes.map((mode) => mode.overrides.theme), ['0', '1'],
  '롤 식이 직접 참조한 선택값은 DOM 위치와 무관하게 실행 모드로 유지해야 합니다.');
assert.strictEqual(contract.rolls.find((roll) => roll.name === 'adjacent').label, '인접 실행');
const localFree = contract.rolls.find((roll) => roll.name === 'local_free');
assert.strictEqual(localFree.label, '자유다이스');
assert(!localFree.aliases.includes('패널티 2개'));
const unlabelledFree = contract.rolls.find((roll) => roll.name === 'unlabelled_free');
assert.strictEqual(unlabelledFree.label, 'unlabelled_free');
assert(!unlabelledFree.aliases.includes('체구'));
const itemOne = contract.rolls.find((roll) => roll.name === 'item_one');
assert.strictEqual(itemOne.label, 'Painkiller');
assert(itemOne.aliases.includes('items_painkiller'));
assert(!itemOne.aliases.includes('Weapon') && !itemOne.aliases.includes('items_weapon'));
const skillOne = contract.rolls.find((roll) => roll.name === 'skill_one');
assert.strictEqual(skillOne.label, 'Incineration');
assert(skillOne.aliases.includes('incineration'));
assert(!skillOne.aliases.includes('Torture') && !skillOne.aliases.includes('torture'));

const doubleQuery = contract.rolls.find((roll) => roll.name === 'double');
assert.deepStrictEqual(doubleQuery.modes.map((mode) => mode.labelPath), [
  ['Easy', 'Small'], ['Easy', 'Large'], ['Hard', 'Small'], ['Hard', 'Large'],
]);
assert(doubleQuery.modes.every((mode) => Object.keys(mode.queries).length === 2));
const twinQuery = contract.rolls.find((roll) => roll.name === 'twin');
assert.strictEqual(twinQuery.modes.length, 4);
assert(twinQuery.modes.every((mode) => mode.queries.Pick && mode.queries['Pick#2']));

const free = contract.rolls.find((roll) => roll.name === 'free');
assert.deepStrictEqual(free.expressionRefs, ['free_formula']);
assert(free.labelRefs.some((ref) => ref.field === 'formula' && ref.name === 'free_formula'));
assert.strictEqual(free.controls, undefined);
assert.strictEqual(contract.controls.free_formula.type, 'text');
const prefixedFree = contract.rolls.find((roll) => roll.name === 'prefixed_free');
assert.deepStrictEqual(prefixedFree.expressionRefs, ['other_formula']);
assert.strictEqual(prefixedFree.controls, undefined);
assert.strictEqual(contract.controls.other_formula.type, 'textarea');
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'skill_formula').expressionRefs, []);
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'direct').expressionRefs, []);
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'composed').expressionRefs, []);

const damage = contract.rolls.find((roll) => roll.name === 'damage');
assert.strictEqual(damage.repeating.section, 'repeating_weapon');
assert(damage.repeating.fields.includes('damage'));
assert.strictEqual(Object.prototype.hasOwnProperty.call(damage, 'refs'), false);
assert(contract.signature.includes('bonus_count'));
const persistedSignature = parseSheetContract(`
  <input name="attr_mixed" readonly><input name="attr_mixed" disabled>
  <input name="attr_writable"><select name="attr_choice"><option value="a">A</option></select>
  <textarea name="attr_notes"></textarea>
  <select name="attr_disabled_choice" disabled><option value="a">A</option></select>
  <textarea name="attr_readonly_notes" readonly></textarea>
`, { name: '저장 필드', id: 'persisted-signature' }).signature;
['mixed', 'disabled_choice', 'readonly_notes'].forEach((name) => {
  assert(!persistedSignature.includes(name),
    `${name}처럼 편집 가능한 노드가 없는 필드를 시트 인식 기준으로 쓰면 안 됩니다.`);
});
['writable', 'choice', 'notes'].forEach((name) => {
  assert(persistedSignature.includes(name), `${name} 저장 입력이 시트 인식 기준에서 빠졌습니다.`);
});
const workerContract = parseSheetContract(`
  <input name="attr_visible">
  <script type="text/worker">
    on('change:visible', function () {
      setAttrs({ worker_total: 1, 'worker-state': 2, attr_prefixed: 3,
        nested: makeValue({ ignore_nested: 4 }), ['computed_key']: 5, shorthand });
    });
  </script>
`, { name: '작업 스크립트 저장값', id: 'worker-attributes' });
['worker_total', 'worker-state', 'prefixed', 'nested', 'computed_key', 'shorthand'].forEach((name) => {
  assert(workerContract.globalAttributes.includes(name), `${name} 작업 스크립트 저장값을 찾지 못했습니다.`);
});
assert(!workerContract.globalAttributes.includes('ignore_nested'),
  'setAttrs 값 내부 객체의 키를 캐릭터 속성으로 잘못 읽으면 안 됩니다.');
assert(!workerContract.signature.includes('worker_total'),
  '작업 스크립트 전용 저장값을 화면 입력 기반 인식 서명으로 올리면 안 됩니다.');
const fixtureModeCount = contract.rolls.reduce((count, roll) => count + roll.modes.length, 0);
assert(fixtureModeCount <= 24);

// 성공 수준의 경계는 특정 시트 변수명을 추측하지 않고 원본 rolltemplate의
// Mustache 조건과 표시 문구에서 읽어야 합니다.
const resultRuleContract = parseSheetContract(`
  <input name="attr_marker_one"><input name="attr_marker_two"><input name="attr_marker_three">
  <button type="roll" name="roll_source_result"
    value="&{template:source-result} {{goal=[[60]]}} {{die=[[1d100]]}}">원본 결과</button>
  <rolltemplate class="sheet-rolltemplate-source-result">
    <table>
      <tr><td class="template_label">0:</td><td>
        {{#die}}{{#rollTotal() die 1}}<span class="sheet-critical">대성공</span>{{/rollTotal() die 1}}{{/die}}
        {{#rollGreater() die goal}}{{#rollGreater() goal 49}}{{#rollTotal() die 100}}
          <b data-i18n="fumble">Fumble</b>
        {{/rollTotal() die 100}}{{/rollGreater() goal 49}}{{/rollGreater() die goal}}
        {{#rollGreater() die goal}}{{#^rollGreater() goal 49}}{{#rollGreater() die 95}}
          <b>Fumble</b>
        {{/rollGreater() die 95}}{{/^rollGreater() goal 49}}{{/rollGreater() die goal}}
      </td></tr>
      <tr><td class="template_label">+1:</td><td>
        {{#rollTotal() die 1}}<span class="sheet-critical">대성공</span>{{/rollTotal() die 1}}
      </td></tr>
    </table>
  </rolltemplate>
`, { name: '원본 결과 규칙', id: 'source-result-rules' });
const sourceResultRules = resultRuleContract.resultTemplates['source-result'].rules;
assert(sourceResultRules.some((rule) => rule.outcome === 'critical' && rule.valueField === 'die' && rule.group === '0'),
  'class 표시와 순차 Mustache 조건에서 대성공 규칙을 읽지 못했습니다.');
assert(sourceResultRules.some((rule) => rule.outcome === 'fumble' &&
  rule.conditions.some((condition) => condition.not)),
  'data-i18n/표시 텍스트 또는 역조건에서 대실패 규칙을 읽지 못했습니다.');
assert(sourceResultRules.some((rule) => rule.group === '+1'),
  '원본 rolltemplate의 +1 결과 그룹을 보존하지 못했습니다.');
assert(!JSON.stringify(resultRuleContract.resultTemplates).includes('skill_value'),
  '결과 규칙에 다른 시트의 고정 변수명을 섞으면 안 됩니다.');

const malformed = '<input name="attr_kind" class="sheet-switch"">' +
  '<button type="roll" name="roll_test" value="&{template:test} {{kind=@{kind}}}">검사</button>';
const corrected = malformed.replace('sheet-switch""', 'sheet-switch"');
assert.deepStrictEqual(
  parseSheetContract(malformed, { name: '오류 복구', id: 'recovery' }),
  parseSheetContract(corrected, { name: '오류 복구', id: 'recovery' })
);

const repeatingOnly = parseSheetContract(`
  <fieldset class="repeating_notes">
    <input name="attr_optional"><input name="attr_title">
    <button type="roll" value="&{template:test} {{roll=[[1d20]]}}"></button>
  </fieldset>
`, { name: '반복 전용', id: 'repeating-only' });
assert.deepStrictEqual(repeatingOnly.rolls[0].repeating.fields, ['optional', 'title']);
assert.deepStrictEqual(repeatingOnly.sections.repeating_notes, ['optional', 'title']);
assert.strictEqual(repeatingOnly.signature.length, 0);
assert(repeatingOnly.attributes.includes('title'));

const sharedRepeatingNames = parseSheetContract(`
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
`, { name: '중복 반복 이름', id: 'shared-repeating-names' });
const weaponRoll = sharedRepeatingNames.rolls.find((roll) => roll.repeating.section === 'repeating_weapons');
const spellRoll = sharedRepeatingNames.rolls.find((roll) => roll.repeating.section === 'repeating_spells');
assert.deepStrictEqual(weaponRoll.repeating.fields, ['mode', 'name', 'value']);
assert.deepStrictEqual(spellRoll.repeating.fields, ['mode', 'name', 'value']);
assert.deepStrictEqual(weaponRoll.controls.mode.options.map((option) => option.value), ['slash', 'thrust']);
assert.deepStrictEqual(spellRoll.controls.mode.options.map((option) => option.value), ['fire', 'ice']);
assert.deepStrictEqual(weaponRoll.modes.map((mode) => mode.overrides.mode), ['slash', 'thrust']);
assert.deepStrictEqual(spellRoll.modes.map((mode) => mode.overrides.mode), ['fire', 'ice']);

const prototypeNames = parseSheetContract(`
  <div>
    <select name="attr___proto__"><option value="a">A</option><option value="b">B</option></select>
    <input name="attr_constructor">
    <button type="roll" value="&{template:test} {{mode=@{__proto__}}} {{value=@{constructor}}}">Prototype</button>
  </div>
  <fieldset class="repeating___proto__"><input name="attr_constructor"></fieldset>
`, { name: '프로토타입 이름', id: 'prototype-names' });
assert(prototypeNames.attributes.includes('__proto__') && prototypeNames.attributes.includes('constructor'));
assert.strictEqual(prototypeNames.controls.__proto__.type, 'select');
assert(prototypeNames.sections.repeating___proto__.includes('constructor'));

const cappedQueryExpression = Array.from({ length: 7 }, (_, index) =>
  `?{Q${index}|A,0|B,1}`).join('+');
const cappedModes = parseSheetContract(`
  <button type="roll" name="roll_capped" value="&{template:test} {{roll=[[${cappedQueryExpression}]]}}">Capped</button>
`, { name: '모드 제한', id: 'capped-modes' }).rolls[0];
assert(cappedModes.modes.length < 128);
assert.strictEqual(cappedModes.modesIncomplete, true);
assert.strictEqual(Object.prototype.hasOwnProperty.call(doubleQuery, 'modesIncomplete'), false);

const visibilityHtml = `
  <input type="checkbox" class="sheet-route" name="attr_route" value="left" checked>
  <input type="checkbox" class="sheet-route" name="attr_route" value="right">
  <div class="sheet-panel sheet-panel-left"><label>공용 상태<input type="checkbox" name="attr_shared_state" value="active"></label><button type="roll" name="roll_left" value="&{template:test} {{roll=[[1d6]]}}">왼쪽</button></div>
  <div class="sheet-panel sheet-panel-right"><label>공용 상태<input type="checkbox" name="attr_shared_state" value="active"></label><button type="roll" name="roll_right" value="&{template:test} {{roll=[[1d8]]}}">오른쪽</button></div>
  <input type="checkbox" class="sheet-temporary-mode" name="attr_temporary_mode" value="on">
  <label class="sheet-major-field">중상<input type="checkbox" name="attr_major_state" value="active"></label>
  <div class="sheet-temporary-panel"><label>임시 체력<input type="number" name="attr_temporary_health"></label></div>
  <div class="sheet-uncertain"><button type="roll" name="roll_uncertain" value="&{template:test} {{roll=[[1d10]]}}">미확정</button></div>
  <fieldset class="repeating_items">
    <input type="checkbox" class="sheet-row-route" name="attr_route" value="row-on" checked>
    <div class="sheet-row-panel"><button type="roll" name="roll_row" value="&{template:test} {{roll=[[1d12]]}}">행</button></div>
  </fieldset>
`;
const visibilityCss = `
  .charsheet .sheet-panel, .charsheet .sheet-uncertain, .charsheet .sheet-row-panel { display: none; }
  .sheet-route[value="left"]:checked ~ .sheet-panel-left { display: block; }
  .sheet-route[value="right"]:checked ~ .sheet-panel-right { display: block; }
  .sheet-temporary-panel { display: none; }
  .sheet-temporary-mode[value="on"]:checked ~ .sheet-temporary-panel { display: block; }
  .sheet-temporary-mode[value="on"]:checked ~ .sheet-major-field { display: none; }
  .charsheet:has(.sheet-future) .sheet-uncertain { display: block; }
  .sheet-row-route[value="row-on"]:checked ~ .sheet-row-panel { display: block; }
`;
const visibleContract = parseSheetContract(visibilityHtml, { name: '가시성 합성 시트', id: 'visibility', css: visibilityCss });
assert.deepStrictEqual(visibleContract.rolls.find((roll) => roll.name === 'left').visibility, { name: 'route', op: 'eq', value: 'left', scope: 'global' });
assert.deepStrictEqual(visibleContract.rolls.find((roll) => roll.name === 'right').visibility, { name: 'route', op: 'eq', value: 'right', scope: 'global' });
assert.strictEqual(Object.prototype.hasOwnProperty.call(visibleContract.rolls.find((roll) => roll.name === 'uncertain'), 'visibility'), false);
assert.deepStrictEqual(visibleContract.rolls.find((roll) => roll.name === 'row').visibility, { name: 'route', op: 'eq', value: 'row-on', scope: 'row' });
assert.deepStrictEqual(visibleContract.fields.find((field) => field.name === 'shared_state').visibility, {
  any: [
    { name: 'route', op: 'eq', value: 'left', scope: 'global' },
    { name: 'route', op: 'eq', value: 'right', scope: 'global' },
  ],
}, '같은 속성을 쓰는 복제 UI의 표시 조건은 AND가 아니라 OR로 보존해야 합니다.');
assert.deepStrictEqual(visibleContract.fields.find((field) => field.name === 'major_state').visibility, {
  not: { name: 'temporary_mode', op: 'eq', value: 'on', scope: 'global' },
}, '대체 화면에서 숨겨지는 상태 필드의 원본 CSS 조건을 보존해야 합니다.');
assert.strictEqual(visibleContract.controls.route.default, 'left');
assert.strictEqual(visibleContract.controls.temporary_mode.default, null);
assert(visibleContract.rolls.filter((roll) => !roll.repeating).every((roll) => !roll.controls),
  '전역 가시성 컨트롤을 각 롤에 중복 저장하면 안 됩니다.');
assert.strictEqual(visibleContract.rolls.find((roll) => roll.name === 'row').controls.route.repeating, 'repeating_items');
const htmlOnlyContract = parseSheetContract(visibilityHtml, { name: 'HTML 전용', id: 'html-only' });
assert(htmlOnlyContract.rolls.every((roll) => !Object.prototype.hasOwnProperty.call(roll, 'visibility')));

const visibilityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sheet-contract-css-'));
try {
  const visibilityInput = path.join(visibilityRoot, 'switchboard.html');
  const visibilityStylesheet = path.join(visibilityRoot, 'switchboard.css');
  fs.writeFileSync(visibilityInput, visibilityHtml);
  fs.writeFileSync(visibilityStylesheet, visibilityCss);
  const first = buildSheetContract(visibilityInput, path.join(visibilityRoot, 'contract.js'));
  assert.strictEqual(first.cssPath, visibilityStylesheet);
  assert(first.contract.rolls.some((roll) => roll.visibility));
  const firstHash = first.contract.sourceHash;
  fs.writeFileSync(visibilityStylesheet, `${visibilityCss}\n.sheet-unused { display: block; }`);
  const second = buildSheetContract(visibilityInput, path.join(visibilityRoot, 'contract-2.js'));
  assert.notStrictEqual(second.contract.sourceHash, firstHash);
  fs.writeFileSync(path.join(visibilityRoot, 'extra.css'), '.sheet-extra { display: none; }');
  fs.renameSync(visibilityStylesheet, path.join(visibilityRoot, 'renamed.css'));
  const ambiguous = buildSheetContract(visibilityInput, path.join(visibilityRoot, 'contract-3.js'));
  assert.strictEqual(ambiguous.cssPath, null, '같은 이름도 아니고 CSS가 여러 개면 임의 선택하지 않아야 합니다.');
} finally {
  fs.rmSync(visibilityRoot, { recursive: true, force: true });
}

const translationRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sheet-contract-i18n-'));
try {
  const translationHtml = path.join(translationRoot, 'sheet.html');
  const translationOutput = path.join(translationRoot, 'contract.js');
  fs.mkdirSync(path.join(translationRoot, 'translations'));
  fs.writeFileSync(translationHtml, `
    <div>
      <select name="attr_mode">
        <option value="normal" data-i18n="normal-mode">Normal</option>
        <option value="bonus" data-i18n="bonus-mode">Bonus</option>
      </select>
      <button type="roll" name="roll_mode" value="&{template:test} {{mode=@{mode}}}">Mode</button>
    </div>
    <div><button type="roll" name="roll_live" value="&{template:test} {{roll=[[1d10]]}}"></button></div>
    <div><span data-i18n="live-label">Live</span></div>
    <table><tr><td data-i18n="appraise-label">Appraise(05%)</td><td><input name="attr_appraise" value="5"></td><td><button type="roll" name="roll_appraise" value="&{template:test} {{roll=[[@{appraise}]]}}"></button></td><td><button type="roll" name="roll_appraise_alt" value="&{template:test-alt} {{roll=[[@{appraise}]]}}"></button></td></tr></table>
    <table><tr><td><button type="roll" name="roll_d7" value="&{template:test} {{roll=[[1d7]]}}">1D7</button></td><td><input type="text" name="attr_custom_dice" placeholder="Custom" data-i18n-placeholder="custom-u" value="1d100"></td><td><button type="roll" name="roll_custom" value="&{template:test} {{formula=@{custom_dice}}} {{roll=[[@{custom_dice}]]}}"></button></td></tr></table>
    <table><tr><td>Spot Hidden</td><td><input type="number" name="attr_spot" placeholder="0" value="25"></td><td><button type="roll" name="roll_spot" value="&{template:test} {{target=@{spot}}} {{roll=[[@{spot}]]}}"></button></td></tr></table>
    <table><tr><td><input type="text" name="attr_plain_custom" placeholder="Custom" value="1d20"></td><td><button type="roll" name="roll_plain_custom" value="&{template:test} {{formula=@{plain_custom}}} {{roll=[[@{plain_custom}]]}}"></button></td></tr></table>
    <table><tr><th>51</th><td><button type="roll" name="roll_numeric_row" value="&{template:test} {{roll=[[1d100]]}}"></button></td></tr></table>
    <button type="roll" name="roll_kanji" value="&{template:test} {{roll=[[1d6]]}}">知覚</button>
  `);
  fs.writeFileSync(path.join(translationRoot, 'translation.json'), JSON.stringify({
    'normal-mode': 'Normal', 'bonus-mode': 'Bonus', 'live-label': 'Real-Time', 'appraise-label': 'Appraise', 'custom-u': 'Custom',
  }));
  fs.writeFileSync(path.join(translationRoot, 'translations', 'ko.json'), JSON.stringify({
    'normal-mode': '일반', 'bonus-mode': '보너스', 'live-label': '실시간', 'appraise-label': '감정', 'custom-u': '임의 주사위',
  }));
  const translated = buildSheetContract(translationHtml, translationOutput);
  const translatedMode = translated.contract.rolls.find((roll) => roll.name === 'mode');
  const translatedLive = translated.contract.rolls.find((roll) => roll.name === 'live');
  const translatedAppraise = translated.contract.rolls.filter((roll) => /^appraise(?:_alt)?$/.test(roll.name));
  assert.strictEqual(translated.translationPaths.length, 2);
  assert(translatedMode.modes.some((mode) => mode.labelPath.includes('일반') && mode.aliases.includes('Normal')));
  assert.strictEqual(translatedLive.label, '실시간');
  assert(translatedLive.aliases.includes('Real-Time') && translatedLive.aliases.includes('Live'));
  assert.strictEqual(translatedAppraise.length, 2);
  translatedAppraise.forEach((roll) => {
    assert.strictEqual(roll.label, '감정');
    assert(roll.aliases.includes('Appraise(05%)'), '같은 표 행 앞쪽의 원문 라벨을 모든 굴림 별칭으로 유지해야 합니다.');
  });
  const translatedCustom = translated.contract.rolls.find((roll) => roll.name === 'custom');
  assert.strictEqual(translatedCustom.label, '임의 주사위');
  assert(translatedCustom.aliases.includes('Custom'));
  assert(!translatedCustom.aliases.includes('1D7'));
  assert.deepStrictEqual(translatedCustom.expressionRefs, ['custom_dice']);
  assert.strictEqual(translated.contract.rolls.find((roll) => roll.name === 'spot').label, 'Spot Hidden');
  assert.strictEqual(translated.contract.rolls.find((roll) => roll.name === 'plain_custom').label, 'Custom');
  assert.strictEqual(translated.contract.rolls.find((roll) => roll.name === 'numeric_row').label, '51');
  assert.strictEqual(translated.contract.rolls.find((roll) => roll.name === 'kanji').label, '知覚');
  assert(fs.readFileSync(translationOutput, 'utf8').includes('실시간'));
  const embeddedRuntime = { KIBSheetContracts: [] };
  vm.runInNewContext(render([readSheet('번역 시트', translationHtml, '-')]), embeddedRuntime);
  const embeddedLive = embeddedRuntime.KIBSheetContracts[0].rolls.find((roll) => roll.name === 'live');
  assert.strictEqual(embeddedRuntime.KIBSheetContracts[0].sourceHash, translated.contract.sourceHash);
  assert(embeddedLive.label === '실시간' && embeddedLive.aliases.includes('Real-Time'),
    '임베딩한 시트에서도 번역된 굴림명과 원문 별칭을 함께 유지해야 합니다.');
  const jaPath = path.join(translationRoot, 'translations', 'ja.json');
  fs.writeFileSync(jaPath, JSON.stringify({ 'appraise-label': '鑑定' }));
  const multilingual = buildSheetContract(
    translationHtml,
    path.join(translationRoot, 'contract-ja.js'),
    null,
    [jaPath],
  );
  assert.strictEqual(multilingual.translationPaths.length, 3);
  assert(multilingual.contract.rolls.filter((roll) => /^appraise(?:_alt)?$/.test(roll.name)).every((roll) =>
    roll.label === '鑑定' && roll.aliases.includes('감정')),
  '사용자가 지정한 번역을 파일명이나 언어에 관계없이 표시 이름으로 우선해야 합니다.');
  const customTranslation = path.join(translationRoot, 'custom-ko.json');
  fs.writeFileSync(customTranslation, JSON.stringify({ 'live-label': '현재 시각' }));
  const explicitInputs = readTranslationInputs(translationHtml, [customTranslation]);
  assert.strictEqual(explicitInputs[0].relative, 'translations/custom-ko.json');
  const explicitBuild = buildSheetContract(
    translationHtml,
    path.join(translationRoot, 'contract-custom.js'),
    null,
    [customTranslation],
  );
  const expectedHash = crypto.createHash('sha256').update(fs.readFileSync(translationHtml));
  explicitInputs.forEach((entry) => expectedHash.update(`\0${entry.relative}\0`).update(entry.source));
  assert.strictEqual(explicitBuild.contract.sourceHash, expectedHash.digest('hex'),
    '같은 번역 파일 집합은 화면 생성기와 명령행 생성기에서 같은 manifest hash를 써야 합니다.');
  const unnamedHtml = '<div><span data-i18n="unnamed-roll">Roll</span><button type="roll" value="&{template:test} {{roll=[[1d6]]}}"></button></div>';
  const unnamedEnglish = parseSheetContract(unnamedHtml, { translations: [{ 'unnamed-roll': 'Custom Roll' }] });
  const unnamedKorean = parseSheetContract(unnamedHtml, { translations: [{ 'unnamed-roll': '사용자 굴림' }] });
  assert.strictEqual(unnamedEnglish.rolls[0].key, unnamedKorean.rolls[0].key,
    '이름 없는 롤의 내부 키가 번역 라벨에 따라 바뀌면 안 됩니다.');
  const hiddenAdjacent = parseSheetContract(`
    <fieldset><legend>Initiative</legend>
      <span class="sheet-hidden">Re-roll?:</span>
      <button name="roll_init" type="roll" value="&{template:test} {{roll=[[1d100]]}}"></button>
    </fieldset>`);
  assert(!hiddenAdjacent.rolls[0].label.includes('Re-roll'),
    '화면에서 숨긴 인접 문구를 굴림 이름으로 인식하면 안 됩니다.');
  const firstHash = translated.contract.sourceHash;
  fs.writeFileSync(path.join(translationRoot, 'translations', 'ko.json'), JSON.stringify({
    'normal-mode': '표준', 'bonus-mode': '이점', 'live-label': '현재', 'appraise-label': '평가',
  }));
  const rebuilt = buildSheetContract(translationHtml, path.join(translationRoot, 'contract-2.js'));
  assert.notStrictEqual(rebuilt.contract.sourceHash, firstHash);
  assert.notStrictEqual(rebuilt.contract.id, translated.contract.id);
} finally {
  fs.rmSync(translationRoot, { recursive: true, force: true });
}

console.log('Sheet contract parser: ok');
