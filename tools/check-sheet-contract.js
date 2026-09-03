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

const adjacentSiblingRolls = parseSheetContract(`
  <div><h2>현재 이성치</h2><input name="attr_stability">
    <button type="roll" name="roll_stability_check" value="&amp;{template:three} {{name=Stability Roll}} {{success=[[@{stability}]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}"></button>
    <button type="roll" name="roll_stability_check" value="&amp;{template:one} {{name=Stability Roll}} {{success=[[@{stability}]]}} {{roll1=[[1d100]]}}"></button>
  </div>
  <div><h2>다른 항목 제목</h2>
    <button type="roll" name="roll_other_first" value="&amp;{template:test} {{roll=[[1d6]]}}"></button>
    <button type="roll" name="roll_other_second" value="&amp;{template:test} {{roll=[[1d8]]}}"></button>
  </div>
  <div><h2>무명 항목 제목</h2>
    <button type="roll" value="&amp;{template:test} {{roll=[[1d4]]}}"></button>
    <button type="roll" value="&amp;{template:test} {{roll=[[1d12]]}}"></button>
  </div>
  <div><h2>전투</h2>
    <button type="roll" name="roll_tracker" value="[[@{speed}&amp;{tracker}]]"></button>
    <button type="roll" name="roll_tracker" value="[[@{speed}+@{modifier}&amp;{tracker}]]"></button>
  </div>
  <div>방패 <input name="attr_defense_score">
    <button type="roll" name="roll_defense" value="&amp;{template:test} {{success=[[@{defense_score}]]}} {{roll=[[1d100]]}}"></button>
    <button type="roll" name="roll_defense" value="&amp;{template:test} {{success=[[@{defense_score}+?{Mod|0}]]}} {{roll=[[1d100]]}}"></button>
    AP <input name="attr_armor_points">
  </div>`);
assert.deepStrictEqual(adjacentSiblingRolls.rolls.slice(0, 2).map((roll) => roll.label),
  ['현재 이성치', '현재 이성치'],
  '동일한 원본 name의 일반·다중 굴림 버튼은 앞의 같은 제목을 함께 읽어야 합니다.');
assert.strictEqual(adjacentSiblingRolls.rolls[3].label, 'other_second',
  '이름이 다른 앞 버튼은 인접 제목 탐색의 경계로 유지해야 합니다.');
assert.strictEqual(adjacentSiblingRolls.rolls[5].label, '',
  '이름 없는 앞 버튼을 건너뛰어 무관한 제목을 공유하면 안 됩니다.');
assert.strictEqual(adjacentSiblingRolls.rolls[7].label, 'tracker',
  '같은 버튼 이름이라도 판정 식이 다른 동작은 제목 탐색의 경계로 유지해야 합니다.');
assert.deepStrictEqual(adjacentSiblingRolls.rolls.slice(8).map((roll) => roll.label), ['방패', 'AP'],
  '동명 버튼 뒤의 다른 입력 제목을 앞 판정 제목으로 끌어오면 안 됩니다.');

// source19 원본의 빈 일반/보너스 버튼은 숫자 입력 한 칸 뒤의 wrapper에 있습니다.
const source19LuckHtml = `
  <div class="characterisrics_container">
    <input type="checkbox" style="display:none" class="sheet-showpulp" name="attr_showpulp" value="1">
    <input type="checkbox" style="display:none" class="sheet-showpulp" name="attr_showpulp" value="1">
    <input type="checkbox" style="display:none" class="sheet-showskills" name="attr_showskills" value="7" checked="checked">
    <input type="checkbox" style="display:none" class="sheet-showskills" name="attr_showskills" value="1">
    <input type="checkbox" style="display:none" class="sheet-showskills" name="attr_showskills" value="5">
    <input type="checkbox" style="display:none" class="sheet-showskills" name="attr_showskills" value="2">
    <h4 class="section-head" style="width:73px">행운</h4>
    <input class="attr-input" type="number" name="attr_luck" value="50" min="0" max="99">
    <div class="attr-roll">
      <button class="sheet-old-roll btn ui-draggable" type="roll" value="&amp;{template:coc} {{name=@{luck_txt}}} {{success=[[@{luck}]]}} {{hard=[[floor(@{luck}/2)]]}} {{extreme=[[floor(@{luck}/5)]]}} {{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}" name="roll_luck_check"></button>
      <button class="sheet-new-roll btn ui-draggable" type="roll" value="&amp;{template:coc-1} {{name=@{luck_txt}}} {{success=[[@{luck}]]}} {{hard=[[floor(@{luck}/2)]]}} {{extreme=[[floor(@{luck}/5)]]}} {{roll1=[[1d100]]}}" name="roll_luck_check"></button>
    </div>
  </div>
  <input type="hidden" name="attr_luck_txt" value="Luck ROLL"/>
  <script type="text/worker">
    getAttrs(['luck_txt'], v => {
      if (v.luck_txt !== getTranslationByKey('luck-u')) {
        setAttrs({luck_txt: getTranslationByKey('luck-u')});
    }});
  </script>`;
const source19Luck = parseSheetContract(source19LuckHtml, { translations: [{ 'luck-u': '운' }] });
assert.deepStrictEqual(source19Luck.rolls.map((roll) => roll.label), ['행운', '행운'],
  'source19의 숫자 입력 뒤에 묶인 일반·보너스 버튼은 실제 UI 제목 행운을 함께 보존해야 합니다.');
assert.deepStrictEqual(source19Luck.rolls.map((roll) => roll.template), ['coc', 'coc-1']);
assert(source19Luck.rolls.every((roll) => roll.raw.includes('{{name=@{luck_txt}}}') &&
  roll.labelRefs.some((ref) => ref.field === 'name' && ref.name === 'luck_txt')),
'UI 제목을 연결해도 원본 출력 이름 참조를 바꾸면 안 됩니다.');
assert.strictEqual(source19Luck.fields.find((field) => field.name === 'luck_txt').default, '운');
assert.strictEqual(source19Luck.fields.find((field) => field.name === 'luck').label, '행운');

const wrappedNumericBoundaries = parseSheetContract(`
  <div><h4>주변 제목</h4><input type="number" name="attr_explicit_target" value="50">
    <div><button type="roll" name="roll_explicit" value="&{template:test} {{success=[[@{explicit_target}]]}}">명시된 버튼 이름</button></div>
  </div>
  <div><h4>무관한 입력 제목</h4><input type="number" name="attr_unrelated" value="50">
    <div><button type="roll" name="roll_unrelated" value="&{template:test} {{success=[[@{elsewhere}]]}}"></button></div>
  </div>
  <div><h4>시작</h4><input type="number" name="attr_san_start" value="50">
    <input type="number" name="attr_san_max" value="99" readonly>
    <h4>현재</h4><input type="number" name="attr_san" value="50">
    <div><button type="roll" name="roll_san_check" value="&{template:test} {{name=SAN Roll}} {{success=[[@{san}]]}}"></button></div>
  </div>
  <fieldset class="repeating_custom"><h4>가변 이름칸 제목</h4><input type="number" name="attr_custom_value" value="47">
    <div><button type="roll" name="roll_custom" value="&{template:test} {{name=@{custom_name}}} {{success=[[@{custom_value}]]}}"></button></div>
    <input type="text" name="attr_custom_name" value="">
  </fieldset>`);
assert.strictEqual(wrappedNumericBoundaries.rolls[0].label, '명시된 버튼 이름',
  '명시된 버튼 이름을 숫자 입력 앞의 주변 제목으로 덮으면 안 됩니다.');
assert(!wrappedNumericBoundaries.rolls[0].aliases.includes('주변 제목'));
assert.strictEqual(wrappedNumericBoundaries.rolls[1].label, 'unrelated',
  '굴림이 참조하지 않는 숫자 입력을 건너 제목을 가져오면 안 됩니다.');
assert.strictEqual(wrappedNumericBoundaries.rolls[2].label, 'san_check',
  '숫자 입력이 여러 개인 묶음의 현재 라벨을 SAN 굴림 제목으로 가져오면 안 됩니다.');
assert.deepStrictEqual(wrappedNumericBoundaries.rolls[2].staticLabels, [{ field: 'name', value: 'SAN Roll' }]);
assert.strictEqual(wrappedNumericBoundaries.rolls[3].label, 'custom',
  '가변 텍스트 이름칸은 숫자 입력으로 취급하여 건너뛰면 안 됩니다.');
assert.deepStrictEqual(wrappedNumericBoundaries.rolls[3].labelRefs,
  [{ field: 'name', name: 'custom_name', max: false }],
  '가변 이름의 원본 참조는 이름 변경 후에도 사용할 수 있게 보존해야 합니다.');

// source20: 숫자를 담는 text 입력의 순수 wrapper 뒤에도 실제 UI 제목이 있습니다.
const source20PowRaw = '&{template:coc}@{template_name}{{name=정신력}}{{success=[[@{pow}]]}}{{hard=[[floor(@{pow}/2)]]}}{{extreme=[[floor(@{pow}/5)]]}}{{roll1=[[1d100]]}}';
const source20Pow = parseSheetContract(`
  <div>
    <div class="sheet-ability-header">정신</div>
    <div class="sheet-attributes"><input type="text" name="attr_pow" value="50"></div>
    <div class="sheet-ability-footer">
      <button type="roll" value="${source20PowRaw}@{dice_corr}" name="roll_pow_check" class="sheet-button sheet-dice-btn pale"><i class="fa-solid fa-dice-d20"></i><img name="attr_dice_01" class="sheet-for-custom"></button>
      <button type="roll" value="${source20PowRaw}" name="roll_pow_check" class="sheet-button sheet-dice-btn"><i class="fa-solid fa-dice-d20"></i><img name="attr_dice_02" class="sheet-for-custom"></button>
    </div>
  </div>`);
assert.deepStrictEqual(source20Pow.rolls.map((roll) => roll.label), ['정신', '정신'],
  '숫자 text 입력만 감싼 wrapper를 사이에 둔 일반·보너스 굴림은 UI 제목 정신을 읽어야 합니다.');
assert.deepStrictEqual(source20Pow.rolls.map((roll) => roll.raw),
  [source20PowRaw + '@{dice_corr}', source20PowRaw],
  'UI 제목을 읽어도 정신력이라는 원본 출력 이름과 판정 식은 그대로 보존해야 합니다.');
assert(source20Pow.rolls.every((roll) => roll.staticLabels.some((entry) => entry.value === '정신력')));

const source20LuckRaw = '&{template:coc}@{template_name}{{name=행운}}{{success=[[@{luck}]]}} {{hard=[[floor(@{luck}/2)]]}}{{extreme=[[floor(@{luck}/5)]]}}{{roll1=[[1d100]]}}';
const source20Luck = parseSheetContract(`
  <div class="sheet-subability-03">
    <label for="attr_luck" class="sheet-label-default">운</label>
    <input type="number" min="0" max="99" name="attr_luck" placeholder="50" id="attr_luck" class="sheet-point-box-input">
    <button type="roll" name="roll_luck" value="${source20LuckRaw}@{dice_corr}"><i class="fa-solid fa-dice-d20"></i><img name="attr_dice_01"></button>
    <button type="roll" name="roll_luck" value="${source20LuckRaw}"><i class="fa-solid fa-dice-d20"></i><img name="attr_dice_02"></button>
  </div>`);
assert.deepStrictEqual(source20Luck.rolls.map((roll) => roll.label), ['운', '운'],
  '같은 국소 수치 입력을 참조하는 두 버튼은 명시된 label-for UI 이름을 함께 읽어야 합니다.');
assert.deepStrictEqual(source20Luck.rolls.map((roll) => roll.raw),
  [source20LuckRaw + '@{dice_corr}', source20LuckRaw]);
assert(source20Luck.rolls.every((roll) => roll.staticLabels.some((entry) => entry.value === '행운')));
assert.strictEqual(source20Luck.fields.find((field) => field.name === 'luck').default, null,
  'placeholder만 있는 숫자 입력에 임의 기본값을 넣으면 안 됩니다.');

const scalarBridgeCases = [
  { name: 'direct_text', input: '<input type="text" name="attr_score" value="-2.5">', expected: '국소 제목' },
  { name: 'wrapped_number', input: '<div><input type="number" name="attr_score" value="50"></div>', expected: '국소 제목' },
  ...['', ' ', '50%', '@{other}', 'Infinity', '9'.repeat(310)].map((value, index) => ({
    name: 'nonnumeric_' + index, input: `<div><input type="text" name="attr_score" value="${value}"></div>`,
  })),
  ...[
    '현재', '<span>현재</span>', '<input type="hidden" name="attr_mirror" value="1">',
    '<input type="checkbox" name="attr_flag">', '<input type="radio" name="attr_mode">',
    '<select name="attr_option"><option>옵션</option></select>', '<textarea name="attr_note"></textarea>',
    '<button type="action" name="act_other"></button>', '<img alt="현재">',
    '<span data-i18n="current"></span>', '<span title="현재"></span>',
    '<span name="attr_display"></span>', '<span aria-label="현재"></span>',
    '<span placeholder="현재"></span>', '<span></span>'.repeat(205) + '현재',
  ].map((extra, index) => ({
    name: 'semantic_wrapper_' + index,
    input: `<div><input type="text" name="attr_score" value="50">${extra}</div>`,
  })),
  { name: 'label_only', input: '<div><input type="text" name="attr_score" value="50"></div>', raw: '{{name=@{score}}} {{roll=[[1d100]]}}' },
  { name: 'inline_max_only', input: '<div><input type="text" name="attr_score" value="50"></div>', raw: '{{name=@{score}}} {{target=[[@{score|max}]]}}' },
  { name: 'multiple_scalars', input: '<div><input type="text" name="attr_score" value="50"></div><input type="text" name="attr_name" value="">' },
  { name: 'explicit_for', input: '<label for="score-id">국소 제목</label><input type="number" name="attr_score" id="score-id">', expected: '국소 제목' },
  { name: 'unrelated_for', input: '<label for="other-id">무관한 명시 제목</label><input type="number" name="attr_score" id="score-id">' },
  { name: 'label_only_for', input: '<label for="score-id">이름칸 제목</label><input type="text" name="attr_score" id="score-id" value="50">', raw: '{{name=@{score}}} {{roll=[[1d100]]}}' },
];
scalarBridgeCases.forEach((test) => {
  const sheet = parseSheetContract(`<div><h4>국소 제목</h4>${test.input}<div><button type="roll" name="roll_${test.name}" value="&{template:test} ${test.raw || '{{success=[[@{score}]]}} {{roll=[[1d100]]}}'}"></button></div></div>`);
  assert.strictEqual(sheet.rolls[0].label, test.expected || test.name,
    test.name + ': 숫자 참조와 순수 입력 wrapper가 확인된 경우에만 앞 제목을 연결해야 합니다.');
});

function packedContractShape(sheet) {
  const fieldKeys = [
    'name', 'type', 'label', 'aliases', 'section', 'default', 'max', 'onValue', 'visibility',
    'groupLabel', 'defaultVariants', 'numericCandidate', 'trackCandidate', 'readonly', 'disabled', 'hidden',
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
      defaultVariants: field.defaultVariants || [],
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

const duplicateDefaults = parseSheetContract(`
  <input type="number" name="attr_score" value="-5" style="opacity:0">
  <input type="number" name="attr_score" value="50">
  <input type="number" name="attr_blank_first" style="opacity:0">
  <input type="number" name="attr_blank_first" value="50">
  <input type="hidden" name="attr_hidden_first" value="-5">
  <input type="number" name="attr_hidden_first" value="50">
  <input type="hidden" name="attr_hidden_default" value="10">
  <input type="number" name="attr_hidden_default">
  <input type="number" name="attr_transparent_control" value="3" style="opacity:0">
  <input type="number" name="attr_visible_duplicate" value="10">
  <input type="number" name="attr_visible_duplicate" value="20">
`, { name: '중복 기본값', id: 'duplicate-defaults' });
const scoreField = duplicateDefaults.fields.find((field) => field.name === 'score');
const transparentField = duplicateDefaults.fields.find((field) => field.name === 'transparent_control');
const blankFirstField = duplicateDefaults.fields.find((field) => field.name === 'blank_first');
const hiddenFirstField = duplicateDefaults.fields.find((field) => field.name === 'hidden_first');
const hiddenDefaultField = duplicateDefaults.fields.find((field) => field.name === 'hidden_default');
const visibleDuplicateField = duplicateDefaults.fields.find((field) => field.name === 'visible_duplicate');
assert.strictEqual(scoreField.default, '50');
assert.deepStrictEqual(scoreField.defaultVariants, ['50', '-5'],
  '숨은 중복 입력이 먼저 있어도 보이는 입력값을 기본값으로 보존해야 합니다.');
assert.strictEqual(blankFirstField.default, '50',
  '값이 빈 숨은 입력이 먼저 있어도 보이는 입력값을 기본값으로 보존해야 합니다.');
assert.deepStrictEqual(hiddenFirstField.defaultVariants, ['50', '-5'],
  '명시적인 보이는 값은 같은 이름의 숨은 입력값보다 우선해야 합니다.');
assert.strictEqual(hiddenDefaultField.default, '10');
assert.strictEqual(Object.prototype.hasOwnProperty.call(hiddenDefaultField, 'defaultVariants'), false,
  '보이는 입력에 기본값이 없으면 같은 이름의 숨은 입력값을 원본 기본값으로 유지해야 합니다.');
assert(transparentField.numericCandidate && transparentField.trackCandidate && !transparentField.defaultVariants,
  '단독 투명 입력은 실제 입력으로 유지해야 합니다.');
assert.strictEqual(visibleDuplicateField.default, '10');
assert.strictEqual(Object.prototype.hasOwnProperty.call(visibleDuplicateField, 'defaultVariants'), false,
  '보이는 같은 이름 입력끼리는 숨은 기본값으로 추정하지 않아야 합니다.');
const duplicateRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([duplicateDefaults]), duplicateRuntime);
assert.deepStrictEqual(Array.from(duplicateRuntime.KIBSheetContracts[0].fields
  .find((field) => field.name === 'score').defaultVariants), ['50', '-5'],
  '숨은 중복 기본값은 압축·복원 뒤에도 유지해야 합니다.');

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

const parallelResourceContract = parseSheetContract(`
  <div class="sheet-resource-board">
    <div class="sheet-resource-headings">
      <div class="sheet-vital-title"><h4 data-i18n="vital-title">Vital</h4></div>
      <div class="sheet-arcane-title"><h4 data-i18n="arcane-title">Arcane</h4></div>
    </div>
    <div class="sheet-vital-values"><input type="number" name="attr_vital"><input type="number" name="attr_vital_max"></div>
    <div class="sheet-arcane-values"><input type="number" name="attr_arcane"><input type="number" name="attr_arcane_max"></div>
    <div class="sheet-unknown-values"><input type="number" name="attr_unknown"><input type="number" name="attr_unknown_max"></div>
  </div>
`, { translations: [{ 'vital-title': '생명', 'arcane-title': '마력' }] });
assert.strictEqual(parallelResourceContract.fields.find((field) => field.name === 'vital').groupLabel, '생명',
  '병렬 자원 입력은 앞선 제목 행의 첫 제목을 공통으로 사용하면 안 됩니다.');
assert.strictEqual(parallelResourceContract.fields.find((field) => field.name === 'arcane').groupLabel, '마력',
  '병렬 자원 입력은 실제 소스 토큰이 유일하게 맞는 제목을 사용해야 합니다.');
assert.strictEqual(parallelResourceContract.fields.find((field) => field.name === 'unknown').groupLabel, undefined,
  '병렬 제목 중 유일하게 맞는 원본 후보가 없으면 자원 이름을 추측하면 안 됩니다.');

// source20: 현재값에만 연결된 label과 같은 부모의 무명 disabled *_max 원본 입력입니다.
const source20ResourceContract = parseSheetContract(`
  <div class="sheet-subability-01">
    <label for="attr_hp" class="sheet-label-default">체력</label>
    <div>
      <input type="number" name="attr_hp" placeholder="0" id="attr_hp">/<input type="number" min="0" name="attr_hp_max" value="floor((@{con}+@{siz})/10)" disabled="true">
      <input type="checkbox" id="attr_majorwound" value="1" name="attr_majorwound" class="sheet-checkbox"><label for="attr_majorwound" class="sheet-check-label">중상</label>
      <input type="checkbox" id="attr_dying" value="1" name="attr_dying" class="sheet-checkbox"><label for="attr_dying" class="sheet-check-label">빈사</label>
    </div>
    <label for="attr_mp" class="sheet-label-default">마력</label>
    <div>
      <input type="number" min="0" name="attr_mp" placeholder="0" id="attr_mp">/<input type="number" min="0" name="attr_mp_max" value="floor(@{pow}/5)" disabled="true">
    </div>
    <label for="attr_san" class="sheet-label-default">이성</label>
    <div>
      <input type="number" name="attr_san" min="0" placeholder="0" id="attr_san"> / <input type="number" min="0" name="attr_san_max" placeholder="최대" value="99-@{cthulhu_mythos}" disabled="true">
      <input type="number" min="0" name="attr_san_start" placeholder="시작" title="시작 이성" alt="시작 이성">
    </div>
  </div>`);
[['hp', '체력', 'floor((@{con}+@{siz})/10)'], ['mp', '마력', 'floor(@{pow}/5)']]
  .forEach(([name, label, formula]) => {
    const current = source20ResourceContract.fields.find((field) => field.name === name);
    const maximum = source20ResourceContract.fields.find((field) => field.name === name + '_max');
    assert.strictEqual(current.label, label);
    assert.strictEqual(maximum.label, '최대', 'source20의 명시적 *_max 선언은 같은 부모의 현재값 최대 역할로 보존해야 합니다.');
    assert.strictEqual(maximum.groupLabel, label);
    assert(maximum.aliases.includes(label));
    assert.strictEqual(maximum.default, formula, '원본 최대값 공식은 명칭 보완으로 바뀌면 안 됩니다.');
    assert.strictEqual(maximum.disabled, true);
    assert.strictEqual(maximum.numericCandidate, false);
  });
assert.strictEqual(source20ResourceContract.fields.find((field) => field.name === 'san_max').label, '최대');
assert.strictEqual(source20ResourceContract.fields.find((field) => field.name === 'san_max').default, '99-@{cthulhu_mythos}');
assert.strictEqual(source20ResourceContract.fields.find((field) => field.name === 'san_start').label, '시작 이성');

const namedMaximumGuards = parseSheetContract(`
  <label for="attr_readonly_pool">정력</label><div><input type="number" name="attr_readonly_pool" id="attr_readonly_pool"><input type="number" name="attr_readonly_pool_max" value="12" readonly></div>
  <label for="attr_explicit_pool">잔량</label><div><input type="number" name="attr_explicit_pool" id="attr_explicit_pool"><input type="number" name="attr_explicit_pool_max" title="보유 상한" value="13" disabled></div>
  <label for="attr_aliased_pool">평정</label><div><input type="number" name="attr_aliased_pool" id="attr_aliased_pool"><input type="number" name="attr_aliased_pool_max" title="aliased_pool_max" placeholder="독립 상한" value="20" disabled></div>
  <label for="attr_editable_pool">동력</label><div><input type="number" name="attr_editable_pool" id="attr_editable_pool"><input type="number" name="attr_editable_pool_max" value="14"></div>
  <label for="attr_wrong_pool">집중</label><div><input type="number" name="attr_wrong_pool" id="attr_wrong_pool"><input type="number" name="attr_different_max" value="15" disabled></div>
  <label for="attr_split_pool">생명</label><div><input type="number" name="attr_split_pool" id="attr_split_pool"></div><div><input type="number" name="attr_split_pool_max" value="16" disabled></div>
  <label for="attr_crowded_pool">마나</label><div><input type="number" name="attr_crowded_pool" id="attr_crowded_pool"><input type="number" name="attr_crowded_pool_max" value="17" disabled><input type="number" name="attr_other_count" value="1"></div>
  <label for="attr_hidden_pool">기력</label><div><input type="number" name="attr_hidden_pool" id="attr_hidden_pool"><input type="number" name="attr_hidden_pool_max" value="18" disabled hidden></div>
  <fieldset class="repeating_pool"><label for="attr_row_pool">에너지</label><div><input type="number" name="attr_row_pool" id="attr_row_pool"><input type="number" name="attr_row_pool_max" value="19" disabled></div></fieldset>
`);
assert.strictEqual(namedMaximumGuards.fields.find((field) => field.name === 'readonly_pool_max').label, '최대');
assert.strictEqual(namedMaximumGuards.fields.find((field) => field.name === 'row_pool_max').label, '에너지',
  '반복행에서 이미 얻은 표시명도 새 선언명 보완으로 덮으면 안 됩니다.');
assert.strictEqual(namedMaximumGuards.fields.find((field) => field.name === 'explicit_pool_max').label, '보유 상한',
  '이미 있는 최대 필드의 명시적 UI 제목을 선언명 역할로 덮으면 안 됩니다.');
const aliasedMaximum = namedMaximumGuards.fields.find((field) => field.name === 'aliased_pool_max');
assert.strictEqual(aliasedMaximum.label, 'aliased_pool_max');
assert(aliasedMaximum.aliases.includes('독립 상한'), '기계명 label이어도 원본 별칭이 있으면 새 최대 역할로 바꾸면 안 됩니다.');
['editable_pool_max', 'different_max', 'split_pool_max', 'crowded_pool_max', 'hidden_pool_max'].forEach((name) => {
  assert.strictEqual(namedMaximumGuards.fields.find((field) => field.name === name).label, name,
    '편집 가능·다른 선언명·다른 부모·여러 현재값·숨김 최대필드는 새 명칭 보완에서 제외해야 합니다: ' + name);
});

const imageResourceContract = parseSheetContract(`
  <div class="sheet-resource-board"><div class="sheet-column">
    <input type="checkbox" class="sheet-extra-mode" name="attr_extra_mode" value="1">
    <div class="sheet-extra-panel"><h4>생명</h4><div class="section"><table><tr>
      <td><input placeholder="현재" type="text" name="attr_vital"></td>
      <td>/</td><td><input placeholder="최대" type="number" name="attr_extra_limit" value="20" disabled></td>
    </tr></table></div></div>
    <div><img src="vital.png" alt="생명"></div>
    <div class="section"><table><tr>
      <td><input placeholder="현재" type="text" name="attr_vital"></td>
      <td>/</td><td><input placeholder="최대" type="number" name="attr_vital_max" value="10" disabled></td>
    </tr></table></div>
    <div><img src="arcane.png" alt="마력"></div>
    <div class="section"><table><tr>
      <td><input placeholder="현재" type="text" name="attr_arcane"></td>
      <td>/</td><td><input placeholder="최대" type="number" name="attr_arcane_max" value="12" disabled></td>
    </tr></table></div>
    <div><img src="focus.png" alt="집중"><img src="decoration.png" alt=""></div>
    <div class="section"><table><tr>
      <td><input placeholder="현재" type="text" name="attr_focus"></td>
      <td>/</td><td><input placeholder="최대" type="number" name="attr_focus_max" value="8" disabled></td>
    </tr></table></div>
    <h4>의지</h4>
    <div class="section"><table><tr>
      <td><input placeholder="현재" type="text" name="attr_spirit"></td>
      <td>/</td><td><input placeholder="최대" type="number" name="attr_spirit_max" value="9" disabled></td>
    </tr></table></div>
  </div></div>
`, { css: '.sheet-extra-panel{display:none}.sheet-extra-mode:checked ~ .sheet-extra-panel{display:block}' });
[['vital', '생명'], ['arcane', '마력'], ['focus', '집중'], ['spirit', '의지']].forEach(([name, label]) => {
  [name, name + '_max'].forEach((fieldName) => {
    assert.strictEqual(imageResourceContract.fields.find((field) => field.name === fieldName).groupLabel, label,
      '이미지 제목 자원은 먼 이웃의 제목이 아니라 가까운 원본 alt를 사용해야 합니다: ' + fieldName);
  });
});

const trailingHeadingContract = parseSheetContract(`
  <div class="sheet-focus-panel">
    <h4 class="sheet-focus-title" data-i18n="focus-title">Focus</h4>
    <div class="sheet-values-section">
      <div class="sheet-resource-row"><input type="number" name="attr_focus"><input type="number" name="attr_focus_max"></div>
      <div class="sheet-condition-panel"><h4 data-i18n="condition-title">Condition</h4><input type="checkbox" name="attr_condition"></div>
    </div>
  </div>
`, { translations: [{ 'focus-title': '집중', 'condition-title': '상태' }] });
assert.strictEqual(trailingHeadingContract.fields.find((field) => field.name === 'focus').groupLabel, '집중',
  '현재·최대 입력 뒤의 무관한 제목이 자원 이름을 덮어쓰면 안 됩니다.');
const spanResourceContract = parseSheetContract(`
  <div class="sheet-gauge-area">
    <div class="sheet-gauge-box">
      <div><span class="sheet-gauge-label">집중</span><div><input type="number" title="현재 집중" placeholder="현재" name="attr_focus"></div> / <div><input type="number" title="최대 집중" placeholder="최대" name="attr_focus_max" readonly></div></div>
      <div><span class="sheet-gauge-label">행운</span><input type="number" title="행운" name="attr_fortune"><button type="roll" value="&{template:test} {{subject=행운}} {{success=[[@{fortune}]]}} {{roll=[[1d100]]}}"></button></div>
    </div>
    <div class="sheet-gauge-box"><span class="sheet-gauge-label">동력</span><div><input type="number" title="현재 동력" placeholder="현재" name="attr_energy"></div> / <div><input type="number" title="최대 동력" placeholder="최대" name="attr_energy_max" readonly></div></div>
  </div>
`);
[['focus', '집중'], ['focus_max', '집중'], ['energy', '동력'], ['energy_max', '동력']]
  .forEach(([name, group]) => {
    assert.strictEqual(spanResourceContract.fields.find((field) => field.name === name).groupLabel, group,
      'span 라벨의 현재·최대 묶음은 인접 굴림명이 아니라 자체 제목을 사용해야 합니다: ' + name);
  });
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

// 숫자 라디오 자원은 원본 숫자 표시와 유일한 같은 묶음 수치 근거가 있을 때만 허용합니다.
{
  function radioGroup(values, options) {
    options = options || {};
    const radios = values.map((value) => '<label>' + (options.labels ? options.labels[value] : value) +
      '<input type="radio" name="attr_pool" value="' + value + '"' +
      (String(value) === '0' ? ' checked' : '') + (options.radioAttrs || '') + '></label>')
      .map((radio) => options.table ? radio.replace('<label>', '<td>').replace('</label>', '</td>') : radio).join('');
    const companion = '<label>기준 수치<input type="number" name="attr_base_pool" value="7"></label>';
    return '<div' + (options.containerAttrs || '') + '><h3>잔여 수치</h3>' +
      (options.table ? '<table><tr><td>' + companion + '</td></tr></table><table><tr>' + radios + '</tr></table>' :
        companion + '<div>' + radios + '</div>') + (options.extra || '') + '</div>';
  }
  const scalarRadioHtml = radioGroup([-1, 0, 1]);
  const scalarRadio = parseSheetContract(scalarRadioHtml, { id: 'numeric-radio-div' });
  const scalar = scalarRadio.fields.find((field) => field.name === 'pool');
  assert(scalar.numericCandidate && scalar.type === 'radio');
  assert.deepStrictEqual(scalar.radioRange, [-1, 1]);
  assert.strictEqual(scalar.default, '0');
  assert.strictEqual(scalar.label, '잔여 수치');
  assert.strictEqual(scalar.max, '', '라디오 선택 범위 끝은 캐릭터 최대값이 아닙니다.');
  assert(!scalar.aliases.some((alias) => /^[+-]?\d+$/.test(alias)),
    '라디오의 숫자 선택지를 자원 이름 별칭으로 만들면 안 됩니다.');
  const scalarTable = parseSheetContract(radioGroup([0, 1, 2], { table: true }), { id: 'numeric-radio-table' });
  assert.deepStrictEqual(scalarTable.fields.find((field) => field.name === 'pool').radioRange, [0, 2],
    '표로 나뉜 원본 자원도 같은 h3/수치 묶음 경계를 사용해야 합니다.');
  [
    ['hidden 속성', radioGroup([0, 1, 2], { radioAttrs: ' hidden' })],
    ['disabled 입력', radioGroup([0, 1, 2], { radioAttrs: ' disabled' })],
    ['readonly 입력', radioGroup([0, 1, 2], { radioAttrs: ' readonly' })],
    ['inline 숨은 입력', radioGroup([0, 1, 2], { radioAttrs: ' style="display:none"' })],
    ['inline 숨은 묶음', radioGroup([0, 1, 2], { containerAttrs: ' style="display:none"' })],
    ['더 먼 숨은 조상', '<div style="display:none">' + scalarRadioHtml + '</div>'],
    ['숨은 관련 수치', scalarRadioHtml.replace('name="attr_base_pool"', 'name="attr_base_pool" style="display:none"')],
    ['숨은 동명 mirror', radioGroup([0, 1, 2], { extra: '<input type="hidden" name="attr_pool" value="1">' })],
    ['중복 숫자', radioGroup([0, 1, 1, 2])],
    ['누락 숫자', radioGroup([0, 2, 3])],
    ['소수 선택지', radioGroup([0, 0.5, 1])],
    ['모호한 선행 0', radioGroup(['00', 1, 2])],
    ['동시 다른 입력', radioGroup([0, 1, 2], { extra: '<input name="attr_other">' })],
    ['동시 다른 선택', radioGroup([0, 1, 2], { extra: '<select name="attr_other"><option>하나</option></select>' })],
    ['경쟁 제목', radioGroup([0, 1, 2], { extra: '<h3>다른 제목</h3>' })],
    ['관련 없는 수치', scalarRadioHtml.replace('attr_base_pool', 'attr_unrelated')],
    ['반복행 범위', '<fieldset class="repeating_pool">' + scalarRadioHtml + '</fieldset>'],
    ['숫자 모드', radioGroup([1, 2, 3], { labels: { 1: '기본', 2: '보너스', 3: '패널티' } })],
  ].forEach(([reason, source]) => {
    const field = parseSheetContract(source).fields.find((candidate) => candidate.name === 'pool');
    assert(!field.radioRange && !field.numericCandidate, reason + '는 숫자 자원 opt-in이 아니어야 합니다.');
  });
  const presentationRadio = parseSheetContract('<div><h3>화면 선택</h3><input type="number" name="attr_base_pool">' +
    [0, 1, 2].map((value) => '<input type="radio" name="attr_pool" value="' + value + '" title="' + value + '">').join('') +
    '<div class="panel"><button type="roll" value="&{template:test} {{roll=[[1d100]]}}"></button></div></div>',
    { css: '.panel{display:none}input[name="attr_pool"][value="1"]:checked ~ .panel{display:block}' });
  assert(!presentationRadio.fields.find((field) => field.name === 'pool').radioRange,
    '원본 CSS의 화면 열기 제어는 연속 숫자여도 자원으로 만들면 안 됩니다.');
  const roundTrip = { KIBSheetContracts: [] };
  vm.runInNewContext(render([scalarRadio, scalarTable]), roundTrip);
  const restored = roundTrip.KIBSheetContracts.map((sheet) => sheet.fields.find((field) => field.name === 'pool'));
  assert.deepStrictEqual(Array.from(restored[0].radioRange), [-1, 1]);
  assert.deepStrictEqual(Array.from(restored[1].radioRange), [0, 2]);
  assert.strictEqual(restored[0].default, '0');
  restored[0].radioRange[0] = -99;
  assert.strictEqual(restored[1].radioRange[0], 0, '압축 복원한 선택 범위 배열을 다른 필드와 공유하면 안 됩니다.');
}

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
// Official sheet worker formulas nest a numeric question using an escaped closing brace.
const escapedQuery = '?{방식|일반,1d10|보너스,?{개수&#125;d10kl1|패널티,?{개수&#125;d10kh1}';
const escapedQueryRoll = parseSheetContract('<button type="roll" value="' +
  ('&{template:test} {{roll=[[' + escapedQuery + '+1]]}} {{target=[[63]]}}').replace(/&/g, '&amp;') +
  '">원본 질문</button>').rolls[0];
assert.deepStrictEqual(escapedQueryRoll.modes.map(mode => mode.labelPath), [['일반'], ['보너스'], ['패널티']],
  '중첩 질문의 HTML 닫는 괄호 때문에 패널티 선택지를 잃으면 안 됩니다.');
assert.deepStrictEqual(escapedQueryRoll.modes.map(mode => mode.queries['방식'].raw), [escapedQuery, escapedQuery, escapedQuery],
  '질문 뒤의 실제 주사위/목표치 식을 질문 범위로 삼키면 안 됩니다.');
assert.deepStrictEqual(escapedQueryRoll.modes.map(mode => mode.queries['방식'].value),
  ['1d10', '?{개수}d10kl1', '?{개수}d10kh1'],
  'Roll20처럼 질문 선택값의 HTML 엔티티는 한 단계만 풀어야 합니다.');
const deeperQuery = '?{외부|A,?{안쪽&#124;B&#44;?{깊이&amp;#125;&#124;C&#44;2&#125;|D,0}';
const deeperQueryRoll = parseSheetContract('<button type="roll" value="' + deeperQuery.replace(/&/g, '&amp;') + '">중첩</button>').rolls[0];
assert.deepStrictEqual(deeperQueryRoll.modes.map(mode => mode.labelPath), [['A', 'B'], ['A', 'C'], ['D']]);
assert.strictEqual(deeperQueryRoll.modes[0].queries['외부'].value, '?{안쪽|B,?{깊이&#125;|C,2}',
  '다음 질문에서 풀 엔티티까지 미리 해제하면 안 됩니다.');
assert.strictEqual(deeperQueryRoll.modes[0].queries['안쪽'].value, '?{깊이}');
const numericContextContract = parseSheetContract(`
  <span>보너스 <select name="attr_extra_count"><option value="1">1</option><option value="2">2</option></select> 개</span>
  <span>패널티 <select name="attr_less_count"><option value="-1">1</option><option value="-2">2</option></select> 개</span>
  <span>거리 <select name="attr_range"><option value="1">1</option><option value="2">2</option></select> 칸</span>
  <div>장식 <input name="attr_other"><select name="attr_unlabelled"><option value="1">1</option></select></div>
  <button type="roll" name="roll_extra" value="&{template:test} {{mode=[[@{extra_count}]]}}"></button>
  <button type="roll" name="roll_less" value="&{template:test} {{mode=[[@{less_count}]]}}"></button>
  <button type="roll" name="roll_range" value="&{template:test} {{mode=[[@{range}]]}}"></button>
  <button type="roll" name="roll_unlabelled" value="&{template:test} {{mode=[[@{unlabelled}]]}}"></button>
`);
[['extra', '보너스', 'extra_count', ['1', '2']], ['less', '패널티', 'less_count', ['-1', '-2']], ['range', '거리', 'range', ['1', '2']]]
  .forEach(([rollName, context, attr, values]) => {
    const roll = numericContextContract.rolls.find((item) => item.name === rollName);
    assert.deepStrictEqual(roll.modes.map((mode) => mode.labelPath), [['1'], ['2']],
      '원본 option 라벨과 기존 모드 ID 입력은 문맥 별칭을 추가해도 보존해야 합니다.');
    roll.modes.forEach((mode, index) => {
      assert.strictEqual(mode.overrides[attr], values[index]);
      assert(mode.aliases && mode.aliases.includes(context + ' ' + (index + 1) + (context === '거리' ? ' 칸' : ' 개')),
        '숫자 선택값 앞의 원본 문맥과 뒤의 단위를 실제 순서대로 모드 별칭에 보존해야 합니다.');
      const plain = parseSheetContract('<select name="attr_' + attr + '"><option value="' + values[index] +
        '">' + (index + 1) + '</option></select><button type="roll" value="&{template:test} {{mode=[[@{' + attr + '}]]}}"></button>');
      assert.strictEqual(mode.id, plain.rolls[0].modes[0].id,
        '문맥 별칭이 추가돼도 기존 모드 ID와 override는 바뀌면 안 됩니다.');
    });
  });
assert(!numericContextContract.rolls.find((roll) => roll.name === 'unlabelled').modes[0].aliases,
  '여러 입력란을 품은 상위 레이아웃의 장식 텍스트를 선택 모드 별칭으로 섞으면 안 됩니다.');

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
const classNegationVisibility = parseSheetContract(`
  <input type="hidden" name="attr_npc"><input type="hidden" name="attr_edit">
  <div class="sheet-npc"><button type="roll" name="roll_npc" value="[[1d100]]">외모</button></div>
  <div class="sheet-pc"><button type="roll" name="roll_pc" value="[[1d100]]">외모</button></div>
`, { css: `
  .charsheet .sheet-npc { display: none; }
  .charsheet input[name=attr_npc][value=on] ~ div.sheet-npc { display: block; }
  .charsheet input[name=attr_npc][value=on] ~ div.sheet-pc { display: none; }
  .charsheet input[name=attr_edit][value="0"] ~ *:not(.sheet-npc) .sheet-edit-enable[value=on] + div { display: none; }
` });
const npcVisibility = { name: 'npc', op: 'eq', value: 'on', scope: 'global' };
assert.deepStrictEqual(classNegationVisibility.rolls.map(roll => roll.visibility),
  [npcVisibility, { not: npcVisibility }],
  '관계없는 :not(.class) 편집 CSS가 모든 div의 PC/NPC 표시 조건을 무효화하면 안 됩니다.');
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

const workerPanelHtml = `
  <input type="checkbox" name="attr_combat_route" value="1">
  <div class="current"><button type="roll" name="roll_unarmed" value="&{template:test} {{roll=[[1d100cs1cf100]]}}">비무장</button></div>
  <div class="previous sheet-hidden"><button type="roll" name="roll_unarmed" value="&{template:test} {{roll=[[1d100]]}}">비무장</button></div>
  <script type="text/worker">
  on("sheet:opened change:combat_route", function() {
    getAttrs(["combat_route"], function(values) {
      var route = parseInt(values.combat_route);
      if (route == 1) {
        $20(".sheet-current").addClass("hidden");
        $20(".sheet-previous").removeClass("sheet-hidden");
      } else {
        $20(".sheet-previous").addClass("sheet-hidden");
        $20(".sheet-current").removeClass("hidden");
      }
    });
  });
  </script>`;
const workerPanelCss = '.charsheet .sheet-hidden { display: none; }';
const workerPanel = parseSheetContract(workerPanelHtml, { css: workerPanelCss, legacy: true });
const workerRoute = { name: 'combat_route', op: 'eq', value: '1', scope: 'global', required: true };
assert.deepStrictEqual(workerPanel.rolls.map((roll) => roll.visibility), [{ not: workerRoute }, workerRoute]);
assert.strictEqual(workerPanel.rolls.length, 2, '다른 원본 굴림은 합치지 않고 현재 영역만 고릅니다.');
assert(workerPanel.controls.combat_route, '워커 표시 컨트롤은 변경 감지와 현재값 읽기에 남아야 합니다.');
const workerNested = parseSheetContract(workerPanelHtml.replace('if (route == 1)', 'if (route == 1 && anotherValue)'), { css: workerPanelCss, legacy: true });
assert(workerNested.rolls.every((roll) => !roll.visibility), '해석하지 않은 조건은 임의로 숨기지 않습니다.');
const workerComment = parseSheetContract(workerPanelHtml.replace('on("sheet:opened', '/* on("sheet:opened').replace('</script>', '*/</script>'), { css: workerPanelCss, legacy: true });
assert(workerComment.rolls.every((roll) => !roll.visibility), '주석의 워커 코드는 실행 경로가 아닙니다.');
const workerConflict = parseSheetContract(workerPanelHtml.replace('</script>', '$20(".sheet-current").addClass("hidden");</script>'), { css: workerPanelCss, legacy: true });
assert(!workerConflict.rolls[0].visibility, '다른 곳에서도 쓰는 클래스는 단일 조건으로 단정하지 않습니다.');
const workerTextValue = parseSheetContract(workerPanelHtml.replace('type="checkbox"', 'type="text"'), { css: workerPanelCss, legacy: true });
assert(workerTextValue.rolls.every((roll) => !roll.visibility), '임의 문자열의 parseInt 결과를 문자열 동등성으로 바꾸지 않습니다.');
const workerVisibleClass = parseSheetContract(workerPanelHtml, { css: '.hidden, .sheet-hidden { display: block; }', legacy: true });
assert(workerVisibleClass.rolls.every((roll) => !roll.visibility), 'CSS가 표시하도록 정의한 클래스를 이름만 보고 숨김으로 단정하지 않습니다.');
const workerCse = parseSheetContract(workerPanelHtml, { css: workerPanelCss, legacy: false });
assert(workerCse.rolls.every((roll) => !roll.visibility), 'CSE 시트의 잘못된 선택자를 legacy 접두어로 임의 보정하지 않습니다.');

const settingsHtml = `
  <input type="checkbox" class="HideConfig" name="attr_navigation" value="1">
  <div class="sheet-settings">
    <select name="attr_edition"><option value="normal">일반</option><option value="hero">영웅</option></select>
    <input type="checkbox" name="attr_style" value="1">
    <label>최대값 배율<input type="checkbox" name="attr_capacity_rule" value="5"></label>
    <input type="checkbox" name="attr_shared_state" value="1">
  </div>
  <label>중상<input type="checkbox" name="attr_major" value="1"></label>
  <label>공용 상태<input type="checkbox" name="attr_shared_state" value="1"></label>
  <input type="number" name="attr_health" value="10">
  <input type="number" name="attr_limit" value="20" readonly>
  <button type="roll" name="roll_test" value="&{template:test} {{roll=[[1d100]]}}">판정</button>`;
const settingsOptions = [{ attribute: 'edition' }, { attribute: 'style' }];
const settingsContract = parseSheetContract(settingsHtml, { userOptions: settingsOptions });
['navigation', 'style', 'capacity_rule'].forEach(name => {
  const field = settingsContract.fields.find(f => f.name === name);
  assert.strictEqual(field.trackCandidate, false, '설정 UI를 상태 알림으로 보내면 안 됩니다: ' + name);
  assert(settingsContract.globalAttributes.includes(name), '설정의 원본 속성/변경 감지는 보존해야 합니다.');
});
['major', 'shared_state', 'health'].forEach(name => assert(settingsContract.fields.find(f => f.name === name).trackCandidate));
assert.strictEqual(settingsContract.fields.find(f => f.name === 'capacity_rule').onValue, '5');
const settingsNoMetadata = parseSheetContract(settingsHtml);
assert(settingsNoMetadata.fields.find(f => f.name === 'capacity_rule').trackCandidate,
  '설정 선언 없이 CSS 클래스만으로 상태 항목을 제거하지 않습니다.');
const settingsWithGameplay = parseSheetContract(settingsHtml.replace('<div class="sheet-settings">', '<div class="sheet-settings"><input name="attr_game_value" type="number" value="10">'), { userOptions: settingsOptions });
assert(settingsWithGameplay.fields.find(f => f.name === 'capacity_rule').trackCandidate,
  '설정과 실제 수치가 섞인 영역의 미선언 체크박스는 임의로 제외하지 않습니다.');

// 열기 규칙은 있지만 그 규칙의 원본 형제 컨트롤이 없는 폐기된 탭만 확정 숨김입니다.
const unreachablePanelHtml = `
  <input type="checkbox" class="sheet-route" name="attr_route" value="on">
  <input type="checkbox" class="sheet-route" name="attr_route" value="off" checked>
  <input type="hidden" name="attr_hidden_value" value="10" style="display:none">
  <div class="sheet-active-panel"><button type="roll" name="roll_active" value="&{template:test} {{roll=[[1d6]]}}">유효한 탭</button></div>
  <div class="sheet-retired-panel">
    <input type="number" name="attr_retired_health" value="10">
    <input type="checkbox" class="sheet-child-route" name="attr_child_route" value="on" checked>
    <div class="sheet-child-panel"><button type="roll" name="roll_retired" value="&{template:test} {{roll=[[1d8]]}}">폐기된 탭</button></div>
  </div>
  <button type="roll" class="sheet-auxiliary" name="roll_auxiliary" style="display:none" value="&{template:test} {{roll=[[1d10]]}}">숨은 보조 버튼</button>
  <div class="sheet-roll-storage"><button type="roll" name="roll_stored" value="&{template:test} {{roll=[[1d12]]}}">보조 굴림 저장소</button></div>
  <div class="sheet-future-panel"><button type="roll" name="roll_future" value="&{template:test} {{roll=[[1d20]]}}">불확정 탭</button></div>
`;
const unreachablePanelCss = `
  .sheet-active-panel, .sheet-retired-panel, .sheet-child-panel, .sheet-roll-storage, .sheet-future-panel { display:none; }
  .sheet-route[value="on"]:checked ~ .sheet-active-panel { display:block; }
  .sheet-route[value="retired"]:checked ~ .sheet-retired-panel { display:block; }
  .sheet-child-route[value="on"]:checked ~ .sheet-child-panel { display:block; }
  .sheet-route[value="retired"]:checked ~ .sheet-auxiliary { display:block; }
  .sheet-route[value="retired"]:checked ~ .sheet-future-panel { display:block; }
  .charsheet:has(.sheet-future) .sheet-future-panel { display:block; }
`;
const unreachablePanelContract = parseSheetContract(unreachablePanelHtml, { css: unreachablePanelCss });
assert.deepStrictEqual(unreachablePanelContract.rolls.find((roll) => roll.name === 'retired').visibility,
  { never: true }, '도달 불가 조상 탭은 자식의 다른 조건과 무관하게 never 하나로 보존해야 합니다.');
assert.deepStrictEqual(unreachablePanelContract.fields.find((field) => field.name === 'retired_health').visibility,
  { never: true }, '같은 도달 불가 탭의 수치 필드도 표시 조건을 보존해야 합니다.');
assert.deepStrictEqual(unreachablePanelContract.rolls.find((roll) => roll.name === 'active').visibility,
  { name: 'route', op: 'eq', value: 'on', scope: 'global' },
  '현재 선택이 off라도 원본에 on 컨트롤이 있는 유효한 탭을 영구 숨김으로 바꾸면 안 됩니다.');
['auxiliary', 'stored', 'future'].forEach((name) => {
  assert.strictEqual(unreachablePanelContract.rolls.find((roll) => roll.name === name).visibility, undefined,
    '숨은 보조 버튼, 열기 규칙 없는 저장소, 미지원 조건은 보존해야 합니다: ' + name);
});
assert.strictEqual(unreachablePanelContract.rolls.length, 5, '숨겨진 원본 굴림 자체를 삭제하면 안 됩니다.');
assert.strictEqual(unreachablePanelContract.fields.find((field) => field.name === 'hidden_value').visibility, undefined);
const uncertainPanelCss = [
  '@import url("external.css");',
  '@media (min-width: 1px) { .sheet-retired-panel { display:block; } }',
  '.sheet-retired-panel { display:var(--panel-display); }',
  '.sheet-retired-panel:hover { display:block; }',
  '.sheet-retired-panel { display:inherit; }',
];
uncertainPanelCss.forEach((extra) => {
  const uncertain = parseSheetContract(unreachablePanelHtml, { css: unreachablePanelCss + extra });
  assert(!uncertain.rolls.find((roll) => roll.name === 'retired').visibility?.never,
    '해석하지 못하는 CSS가 있을 때 영구 숨김을 확정하면 안 됩니다: ' + extra);
});
const inlineUncertainPanel = parseSheetContract(
  unreachablePanelHtml.replace('class="sheet-retired-panel"', 'class="sheet-retired-panel" style="display:var(--panel-display)"'),
  { css: unreachablePanelCss });
assert(!inlineUncertainPanel.rolls.find((roll) => roll.name === 'retired').visibility?.never,
  '인라인의 미지원 display 선언도 확정 숨김으로 해석하면 안 됩니다.');
const restoredNeverRuntime = { KIBSheetContracts: [] };
vm.runInNewContext(render([unreachablePanelContract]), restoredNeverRuntime);
assert.strictEqual(JSON.stringify(restoredNeverRuntime.KIBSheetContracts[0].rolls.map((roll) => roll.visibility || null)),
  JSON.stringify(unreachablePanelContract.rolls.map((roll) => roll.visibility || null)),
  'never와 기존 조건은 임베드 압축/복원 뒤에도 그대로 남아야 합니다.');
assert.strictEqual(JSON.stringify(restoredNeverRuntime.KIBSheetContracts[0].fields.map((field) => field.visibility || null)),
  JSON.stringify(unreachablePanelContract.fields.map((field) => field.visibility || null)));

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
