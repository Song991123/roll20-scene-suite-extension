const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../public/scripts/03_visual_dialogue_compatible.js'), 'utf8');

function room(registered = false) {
  const objects = [], handlers = {}, timers = new Map(), intervals = new Map(), orders = {}, frontCalls = [];
  let timerId = 0;
  function make(type, values) {
    const data = { _type: type, _id: 'obj-' + objects.length, _pageid: 'p1', ...values };
    const obj = { id: data._id,
      get(key) { return key === '_zorder' ? (orders[obj.id] || []).join(',') : data[key === 'type' ? '_type' : key]; },
      set(key, value) { if (typeof key === 'string') data[key] = value; else Object.assign(data, key); },
      remove() { objects.splice(objects.indexOf(obj), 1); emit('destroy:' + type, obj); }
    };
    objects.push(obj); if (type !== 'page') (orders[data._pageid] ||= []).push(obj.id);
    return obj;
  }
  function emit(event, value) { (handlers[event] || []).forEach(fn => fn(value)); }
  function move(obj, target, after) {
    const order = orders[obj.get('_pageid')]; const index = order.indexOf(obj.id);
    if (index >= 0) order.splice(index, 1);
    order.splice(target ? order.indexOf(target.id) + (after ? 1 : 0) : order.length, 0, obj.id);
  }
  for (const page of ['p1', 'p2']) {
    make('page', { _id: page, name: page === 'p1' ? 'conversation' : 'intro' });
    ['vd_area', 'vd_name', 'vd_dialogue', 'vd_panel', 'vd_dialogue_box'].forEach(name => make('graphic', {
      _id: page + '-' + name, _pageid: page, name, layer: name === 'vd_area' ? 'gmlayer' : 'objects',
      left: 1000, top: 600, width: 1600, height: 300,
      gmnotes: name === 'vd_name' ? page + '-name' : name === 'vd_dialogue' ? page + '-dialogue' : '',
    }));
    for (const part of ['name', 'dialogue', 'script']) make('text', {
      _id: page + '-' + part, _pageid: page, text: '이전 ' + part, layer: 'objects', left: 1000, top: 600,
    });
    make('graphic', { _id: page + '-standing', _pageid: page, name: 'vd_standing', layer: registered ? 'objects' : 'map' });
    make('graphic', { _id: page + '-background', _pageid: page, name: 'vd_background', layer: registered ? 'objects' : 'map' });
    make('text', { _id: page + '-unrelated', _pageid: page, text: '사용자 메모', layer: 'objects', left: 9000, top: 9000 });
    if (registered) make('graphic', { _id: page + '-sheet', _pageid: page, name: '맵시트', layer: 'objects', width: 2000, height: 1500 });
  }
  const runtime = {
    state: { KIBSceneVD: {
      config: { dialogue_panel_mode: 'split', font_family: 'Candal', width: 450 },
      scriptTexts: { p1: 'p1-script', p2: 'p2-script' },
      layerOrder: { byPage: registered ? {
        p1: { sheetId: 'p1-sheet', panelPosition: 'behind', decoPosition: 'front', textPosition: 'front' },
        p2: { sheetId: 'p2-sheet', panelPosition: 'behind', decoPosition: 'front', textPosition: 'behind' },
      } : {} }, standingRatios: { saved: { width: 400, height: 600 } },
    } },
    on(event, fn) { (handlers[event] ||= []).push(fn); },
    getObj(type, id) { return objects.find(obj => obj.get('_type') === type && obj.id === id) || null; },
    findObjs(query) { return objects.filter(obj => Object.keys(query).every(key => obj.get(key) === query[key])); },
    createObj: make, Campaign() { return { get() { return 'p1'; } }; },
    playerIsGM(id) { return id === 'gm'; }, sendChat() {}, log() {},
    toFront(obj) { frontCalls.push(obj.id); move(obj); }, toBack() {},
    toAbove(obj, target) { move(obj, target, true); }, toBelow(obj, target) { move(obj, target, false); },
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, delay }); return id; }, clearTimeout(id) { timers.delete(id); },
    setInterval(fn) { const id = ++timerId; intervals.set(id, fn); return id; }, clearInterval(id) { intervals.delete(id); },
  };
  vm.createContext(runtime); vm.runInContext(source, runtime); runtime.vdInitState();
  runtime.KIBScene.get = (key, fallback) => key === 'timing.typeAllLines' ? false : fallback;
  return { runtime, objects, timers, intervals, orders, frontCalls, emit,
    get: id => objects.find(obj => obj.id === id),
    zero() {
      for (let count = 0; count < 30; count++) {
        const next = [...timers.entries()].find(([, task]) => task.delay === 0); if (!next) return;
        timers.delete(next[0]); next[1].fn();
      }
      throw new Error('unexpected recurring startup work');
    },
    show(text = '새 대사', typewriter = false) {
      runtime.state.VD_INJECT(text, 'desc', '', { allowNoAs: true, typewriter });
      this.zero();
    },
    command(content) { emit('chat:message', { type: 'api', content, playerid: 'gm', who: 'GM' }); },
  };
}
let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS ' + name); }
function hidden(r) {
  for (const page of ['p1', 'p2']) {
    for (const part of ['name', 'dialogue', 'script']) assert.equal(r.get(page + '-' + part).get('text'), '');
    for (const part of ['vd_panel', 'vd_dialogue_box']) assert.equal(r.get(page + '-' + part).get('layer'), 'gmlayer');
    assert.equal(r.get(page + '-unrelated').get('text'), '사용자 메모');
  }
}
test('ready clears only linked text with its frames on every managed page', () => {
  const r = room(true); const before = JSON.stringify(r.runtime.state.KIBSceneVD);
  r.emit('ready'); hidden(r);
  const saved = JSON.parse(before), now = r.runtime.state.KIBSceneVD;
  assert.deepEqual(JSON.parse(JSON.stringify(now.config)), saved.config);
  assert.deepEqual(JSON.parse(JSON.stringify(now.standingRatios)), saved.standingRatios);
  assert.deepEqual(JSON.parse(JSON.stringify(now.layerOrder)), saved.layerOrder);
  assert.ok(r.get('p1-standing')); assert.equal(r.get('p1-unrelated').get('layer'), 'objects');
});
test('ready restores standing order without a registered map sheet and without polling', () => {
  const r = room(); r.emit('ready'); r.zero();
  for (const page of ['p1', 'p2']) assert.ok(r.orders[page].indexOf(page + '-standing') > r.orders[page].indexOf(page + '-background'));
  assert.ok(r.timers.size < 10);
});
test('ready recovers linked text left on the GM layer by an interrupted cutin', () => {
  const r = room();
  for (const part of ['name', 'dialogue', 'script']) r.get('p1-' + part).set('layer', 'gmlayer');
  r.emit('ready'); r.zero(); hidden(r); r.show('재시작 후 대사');
  assert.equal(r.get('p1-script').get('layer'), 'objects');
  assert.ok(r.get('p1-script').get('text').includes('재시작 후 대사'));
});
test('ready reapplies saved front and behind positions after other ready handlers', () => {
  const r = room(true); r.emit('ready');
  r.runtime.toFront(r.get('p1-background')); r.runtime.toFront(r.get('p2-background')); r.zero();
  for (const page of ['p1', 'p2']) {
    assert.ok(r.orders[page].indexOf(page + '-standing') < r.orders[page].indexOf(page + '-sheet'));
    assert.ok(r.orders[page].indexOf(page + '-background') < r.orders[page].indexOf(page + '-standing'));
    const textIndex = r.orders[page].indexOf(page + '-script'), sheetIndex = r.orders[page].indexOf(page + '-sheet');
    assert.equal(textIndex > sheetIndex, page === 'p1', '저장한 글자 앞뒤 위치를 보존해야 합니다.');
  }
  hidden(r);
});
test('standing overlap order is stable regardless of native object enumeration order', () => {
  for (const registered of [false, true]) {
    const r = room(registered);
    const second = r.runtime.createObj('graphic', { _id: 'standing-2', name: 'vd_standing', layer: registered ? 'objects' : 'map' });
    r.runtime.toFront(r.get('p1-standing')); r.runtime.toFront(r.get('p1-background'));
    r.emit('ready'); r.zero();
    assert.ok(r.orders.p1.indexOf(second.id) < r.orders.p1.indexOf('p1-standing'));
    assert.ok(r.orders.p1.indexOf('p1-background') < r.orders.p1.indexOf(second.id));
  }
});
test('frames are shown immediately rather than after a 100ms text-only interval', () => {
  const r = room(true); r.emit('ready'); r.zero(); r.show('어떻게 할까요?');
  assert.equal(r.get('p1-vd_panel').get('layer'), 'objects');
  assert.equal(r.get('p1-vd_panel').get('width'), 1600);
  assert.equal(r.get('p1-vd_panel').get('height'), 300);
  assert.ok(r.get('p1-script').get('text').includes('어떻게 할까요?'));
  assert.ok(r.orders.p1.indexOf('p1-script') > r.orders.p1.indexOf('p1-sheet'));
});
test('config reset cancels typing and old callbacks cannot reopen or consume a new line', () => {
  const r = room(); r.show('초기화 전 대사', true);
  const old = [...r.timers.values()].map(task => task.fn), oldTicks = [...r.intervals.values()];
  r.command('!비주얼 설정|초기화'); hidden(r); assert.equal(r.intervals.size, 0);
  old.forEach(fn => fn()); oldTicks.forEach(fn => fn()); hidden(r);
  r.show('초기화 후 대사', true); old.forEach(fn => fn()); oldTicks.forEach(fn => fn());
  assert.equal(r.runtime.state.vd_stock.length, 1);
  assert.equal(r.intervals.size, 1, '이전 타이핑 콜백이 새 타이핑을 중지하면 안 됩니다.');
  for (let step = 0; r.intervals.size && step < 50; step++) [...r.intervals.values()].forEach(fn => fn());
  assert.ok(r.get('p1-script').get('text').includes('초기화 후 대사'));
});
test('a completed old line cannot advance a newer line after queue reset', () => {
  const r = room(); r.show('이전 대사'); const old = [...r.timers.values()].map(task => task.fn);
  r.command('!@리셋'); r.show('새로운 대사'); old.forEach(fn => fn());
  assert.equal(r.runtime.state.vd_stock.length, 1);
  assert.ok(r.get('p1-script').get('text').includes('새로운 대사'));
});
test('explicit hide cannot be undone by the old frame reveal callback', () => {
  const r = room(); r.show('숨길 대사', true); const old = [...r.timers.values()].map(task => task.fn);
  r.command('!@숨김'); old.forEach(fn => fn());
  assert.equal(r.get('p1-vd_panel').get('layer'), 'gmlayer'); assert.equal(r.intervals.size, 0);
  for (const part of ['name', 'dialogue', 'script']) assert.equal(r.get('p2-' + part).get('text'), '');
  assert.equal(r.get('p2-unrelated').get('text'), '사용자 메모');
});
console.log('Visual lifecycle: ' + count + ' groups passed (mock only, not live Roll20).');
