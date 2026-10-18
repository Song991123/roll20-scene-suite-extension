const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..', 'public');
const element = () => ({ innerHTML: '', textContent: '', querySelectorAll: () => [], addEventListener() {} });
const context = vm.createContext({ document: { querySelector: element }, window: {} });
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'sources.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8'), context);

(async () => {
  assert.equal(vm.runInContext('MODULES.length', context), 12);
  assert.match(vm.runInContext("moduleHtml(MODULES.find(m => m.id === '11'))", context), /!시계 설정/);
  const setup = vm.runInContext("MODULES.find(m => m.id === '11').setup", context);
  assert.equal(setup.length, 3, '11번 세팅법은 최초 배치, 영역 등록, 설정 화면의 3단계로 안내합니다.');
  assert.match(setup[0], /GM 레이어.*이미지 토큰/);
  assert.match(setup[1], /!시계 영역등록/);
  assert.match(setup[2], /!시계 설정/);
  assert.doesNotMatch(setup.join(' '), /증가|감소|!타이머|나레이터|재시작|불투명도/, '사용법을 초기 세팅법에 섞지 않습니다.');
  for (const ids of [['00', '11'], ['00', '01'], Array.from({ length: 12 }, (_, i) => String(i).padStart(2, '0'))]) {
    vm.runInContext('selected.clear()', context);
    ids.forEach(id => vm.runInContext(`selected.add('${id}')`, context));
    const bundle = await vm.runInContext('buildBundle()', context);
    new vm.Script(bundle);
    assert.equal(bundle.includes('Scene Suite 11 - Session Clock 1.1.0'), ids.includes('11'));
    assert.match(bundle, new RegExp('clock:\\s*' + ids.includes('11')));
    if (ids.includes('11')) {
      assert.equal((bundle.match(/Session Clock 1\.1\.0 ready/g) || []).length, 1);
      assert.match(bundle, /@시계 증가 1시간/);
      assert.doesNotMatch(bundle, /Scene Suite 06 - APNG Director 1\.2\.5-dev/);
    }
  }
  console.log('Clock installer: 12 modules, 00+11, 00+01 without 11 and full bundle passed (mock only).');
})().catch(error => { console.error(error); process.exitCode = 1; });
