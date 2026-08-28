const assert = require('assert');
const { parseSheetContract } = require('../public/assets/sheet-contract-parser');

const html = `
<select name="attr_madness_mode">
  <option value="rt" selected>실시간</option>
  <option value="summary">요약</option>
</select>
<label><input type="radio" name="attr_dice_mode" value="[[1d100]]" checked>일반</label>
<label><input type="radio" name="attr_dice_mode" value="@{bonus_count}">보너스
  <select name="attr_bonus_count">
    <option value="1">1개</option>
    <option value="2">2개</option>
  </select>
  개
</label>
<label><input type="radio" name="attr_visibility" value="public" checked>공개</label>
<label><input type="radio" name="attr_visibility" value="secret">비밀</label>

<button type="roll" name="roll_madness" value="&amp;{template:test} {{kind=@{madness_mode}}} {{name=광기}}">광기</button>
<button type="roll" name="roll_check" value="&amp;{template:test} {{dice=@{dice_mode}}} {{visibility=@{visibility}}}">판정</button>
<button type="roll" value="&amp;{template:test} {{visibility=?{공개 방식|공개,public|비밀,secret}}}">질의</button>
<button type="roll" name="roll_double" value="&amp;{template:test} {{roll=[[?{Difficulty|Easy,1|Hard,2}+?{Size|Small,10|Large,20}]]}}">Double</button>
<button type="roll" name="roll_twin" value="&amp;{template:test} {{roll=[[?{Pick|A,1|B,2}+?{Pick|A,1|B,2}]]}}">Twin</button>
<button type="roll" name="roll_free" value="&amp;{template:test} {{formula=@{free_formula}}} {{result=[[@{free_formula}]]}}">자유</button>
<button type="roll" name="roll_prefixed_free" value="&amp;{template:test} {{name=Rolling @{other_formula}}} {{result=[[@{other_formula}]]}}">다른 자유</button>
<input name="attr_direct_formula" value="1d20">
<input name="attr_modifier" value="3">
<button type="roll" name="roll_direct" value="&amp;{template:test} {{result=[[@{direct_formula}]]}}">직접 식</button>
<button type="roll" name="roll_composed" value="&amp;{template:test} {{result=[[1d20+@{modifier}]]}}">조합 식</button>

<fieldset class="repeating_weapon">
  <input name="attr_damage" value="1d6">
  <button type="roll" name="roll_damage" value="&amp;{template:test} {{damage=@{damage}}} {{maximum=@{damage|max}}}">피해</button>
</fieldset>`;

const contract = parseSheetContract(html, { name: '합성 시트', id: 'fixture', sourceHash: 'abc123' });

assert.strictEqual(contract.version, 1);
assert.strictEqual(contract.id, 'fixture');
assert.strictEqual(contract.sourceHash, 'abc123');
assert.strictEqual(contract.controls.madness_mode.type, 'select');
assert.strictEqual(contract.controls.madness_mode.default, 'rt');
assert.deepStrictEqual(contract.controls.visibility.options.map((option) => option.label), ['공개', '비밀']);
assert.deepStrictEqual(contract.controls.dice_mode.options.map((option) => option.label), ['일반', '보너스 개']);
assert(contract.signature.length <= 32);
assert(contract.attributes.includes('madness_mode'));
assert(contract.attributes.includes('free_formula'));
assert(contract.attributes.includes('damage'));
assert(contract.globalAttributes.includes('free_formula'));
assert(!contract.globalAttributes.includes('damage'));

const madness = contract.rolls.find((roll) => roll.name === 'madness');
assert.strictEqual(madness.raw.startsWith('&{template:test}'), true);
assert(madness.staticLabels.some((entry) => entry.field === 'name' && entry.value === '광기'));
assert.deepStrictEqual(madness.modes.map((mode) => mode.labelPath), [['실시간'], ['요약']]);
assert.deepStrictEqual(madness.modes.map((mode) => mode.overrides.madness_mode), ['rt', 'summary']);

const check = contract.rolls.find((roll) => roll.name === 'check');
assert.strictEqual(check.modes.length, 5);
assert(check.modes.some((mode) => mode.labelPath.join('/') === '보너스 개/2개'));
assert(check.modes.some((mode) => mode.overrides.dice_mode === '@{bonus_count}' && mode.overrides.bonus_count === '2'));
assert(!check.modes.some((mode) => mode.overrides.dice_mode && mode.overrides.visibility));

const query = contract.rolls.find((roll) => roll.label === '질의');
assert(query.modes.some((mode) => mode.labelPath[0] === '비밀' && mode.queries['공개 방식'].value === 'secret'));
assert(query.modes.every((mode) => mode.queries['공개 방식'].raw.includes('?{공개 방식')));

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
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'prefixed_free').expressionRefs, ['other_formula']);
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'direct').expressionRefs, []);
assert.deepStrictEqual(contract.rolls.find((roll) => roll.name === 'composed').expressionRefs, []);

const damage = contract.rolls.find((roll) => roll.name === 'damage');
assert.strictEqual(damage.repeating.section, 'repeating_weapon');
assert(damage.repeating.fields.includes('damage'));
assert.strictEqual(Object.prototype.hasOwnProperty.call(damage, 'refs'), false);
assert(contract.signature.includes('bonus_count'));
assert(contract.rolls.reduce((count, roll) => count + roll.modes.length, 0) <= 20);

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
  <select name="attr___proto__"><option value="a">A</option><option value="b">B</option></select>
  <input name="attr_constructor">
  <button type="roll" value="&{template:test} {{mode=@{__proto__}}} {{value=@{constructor}}}">Prototype</button>
  <fieldset class="repeating___proto__"><input name="attr_constructor"></fieldset>
`, { name: '프로토타입 이름', id: 'prototype-names' });
assert(prototypeNames.attributes.includes('__proto__') && prototypeNames.attributes.includes('constructor'));
assert.strictEqual(prototypeNames.controls.__proto__.type, 'select');
assert(prototypeNames.sections.repeating___proto__.includes('constructor'));

console.log('Sheet contract parser: ok');
