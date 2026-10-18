const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, 'session-clock.js'), 'utf8');

function room(options = {}) {
  const objects = new Map(), handlers = {}, timers = new Map(), messages = [], logs = [], fronts = [];
  let now = 100000, nextId = 0, nextTimer = 0;
  const faults = {}, state = { OtherAPI: { untouched: true } };
  function emit(event, obj) { (handlers[event] || []).forEach(fn => fn(obj)); }
  function object(type, attrs, id = String(++nextId)) {
    const data = { ...attrs }, obj = { id,
      get(key) {
        if (type === 'text' && ['width', 'height'].includes(key)) {
          if (options.noBounds) return 0;
          return key === 'width' ? data.text.length * data.font_size : data.font_size * 1.2;
        }
        return data[key];
      },
      set(values) { if (faults.set === type) throw new Error('set failed'); Object.assign(data, values); },
      remove() { if (faults.remove === type) throw new Error('remove failed'); objects.delete(type + id); emit('destroy:' + type, obj); },
      data
    };
    objects.set(type + id, obj); return obj;
  }
  object('page', { name: 'Test page' }, 'page');
  const guide = object('graphic', { _pageid: 'page', layer: 'gmlayer', rotation: 0, left: 500, top: 200, width: 500, height: 100 }, 'guide');
  const outsider = object('text', { text: 'Keep me' }, 'outsider');
  const context = vm.createContext({ state, Date: { now: () => now },
    on: (name, fn) => (handlers[name] ||= []).push(fn),
    getObj: (type, id) => objects.get(type + id),
    createObj: (type, attrs) => { if (faults.create === type) throw new Error('create failed'); return object(type, attrs); },
    toFront: obj => fronts.push(obj.id), playerIsGM: id => id === 'gm',
    sendChat: (who, content, callback, settings) => messages.push({ who, content, settings }),
    log: value => logs.push(value),
    setTimeout: (fn, delay) => { const id = ++nextTimer; timers.set(id, { fn, due: now + delay }); return id; },
    clearTimeout: id => timers.delete(id)
  });
  vm.runInContext(source, context);
  emit('ready');
  const api = {
    state, objects, timers, messages, logs, fronts, guide, outsider, faults, emit,
    s: () => state.Roll20SessionClock,
    cmd(action = '', playerid = 'gm', selected = [{ _type: 'graphic', _id: 'guide' }]) {
      emit('chat:message', { type: 'api', content: '!시계' + (action ? ' ' + action : ''), playerid, selected });
    },
    timerCmd(action = '', playerid = 'gm') {
      emit('chat:message', { type: 'api', content: '!타이머' + (action ? ' ' + action : ''), playerid });
    },
    label: () => [...objects.values()].find(obj => obj.id !== 'outsider' && obj.data.font_family),
    panel: () => [...objects.values()].find(obj => obj.data.shape === 'rec'),
    advance(ms) {
      const target = now + ms;
      for (let steps = 0; steps < 10000; steps++) {
        const next = [...timers.entries()].sort((a, b) => a[1].due - b[1].due)[0];
        if (!next || next[1].due > target) { now = target; return; }
        now = next[1].due; timers.delete(next[0]); next[1].fn();
      }
      throw new Error('timer runaway');
    },
    lag(ms) { now += ms; },
    display() { api.cmd('영역등록'); api.cmd('ON'); },
    timer(duration = '00:00:05') { api.cmd('타이머|' + duration); api.cmd('시작'); }
  };
  return api;
}
let passed = 0;
function test(name, fn) {
  fn(); passed++; console.log('PASS ' + name);
}
function idle(r) { assert.equal(r.timers.size, 0); assert.equal(r.s().running, false); }
function unchanged(r, command) {
  const before = JSON.stringify(r.s()); r.cmd(command); assert.equal(JSON.stringify(r.s()), before);
}

test('isolated namespace and OFF startup', () => {
  const r = room(); idle(r); assert.equal(r.s().enabled, false);
  assert.equal(r.s().objects.length, 0); assert.deepEqual(r.state.OtherAPI, { untouched: true });
  assert.doesNotMatch(source, /KIBScene|SceneDirector\.|fetch\(|setInterval\(/);
});
test('GM-only commands and exact API prefix', () => {
  const r = room(); const before = JSON.stringify(r.state);
  r.cmd('영역등록', 'player');
  r.timerCmd('설정 00:10:00', 'player'); r.timerCmd('시작', 'player'); r.timerCmd('OFF', 'player');
  r.emit('chat:message', { type: 'general', content: '!시계 ON', playerid: 'gm' });
  r.emit('chat:message', { type: 'api', content: '!시계아님 ON', playerid: 'gm' });
  r.emit('chat:message', { type: 'api', content: '!타이머아님 ON', playerid: 'gm' });
  assert.equal(JSON.stringify(r.state), before); assert.equal(r.messages.length, 0);
});
test('area registration validates selected token without changing it', () => {
  const r = room(), original = JSON.stringify(r.guide.data);
  for (const selected of [[], [{ _type: 'text', _id: 'outsider' }], [{ _type: 'graphic', _id: 'missing' }], [{ _type: 'graphic', _id: 'guide' }, { _type: 'graphic', _id: 'guide' }]]) {
    r.cmd('영역등록', 'gm', selected); assert.equal(r.s().area, null);
  }
  for (const bad of [{ layer: 'objects' }, { rotation: 30 }, { width: 20 }, { height: 10 }, { left: NaN }, { _pageid: 'missing' }]) {
    const saved = { ...r.guide.data }; Object.assign(r.guide.data, bad); r.cmd('영역등록'); assert.equal(r.s().area, null); Object.assign(r.guide.data, saved);
  }
  r.display(); assert.equal(JSON.stringify(r.guide.data), original);
  assert.equal(r.s().area.width, 500);
});
test('black rectangle and white Rubik text fill registered bounds', () => {
  const r = room(); r.display();
  assert.equal(r.s().objects.length, 2); assert.equal(r.panel().data.fill, '#000000');
  assert.equal(r.panel().data.layer, 'objects'); assert.equal(r.panel().data.x, 500);
  assert.deepEqual(JSON.parse(r.panel().data.points), [[0, 0], [500, 100]]);
  assert.equal(r.label().data.color, '#FFFFFF'); assert.equal(r.label().data.font_family, 'Rubik Mono One');
  r.advance(1000); idle(r); assert.ok(r.label().get('width') <= 500); assert.ok(r.label().get('height') <= 100);
  assert.ok(r.objects.has('textoutsider')); assert.equal(r.fronts.at(-1), r.label().id);
});
test('font fitting is bounded even without client dimensions', () => {
  const r = room({ noBounds: true }); r.display(); r.advance(1000); idle(r); assert.ok(r.label().data.font_size > 0);
});
test('24h clock input converts AM/PM and normalizes midnight', () => {
  const r = room(); r.display();
  for (const [input, expected] of [['0', 'AM 12:00'], ['06:30', 'AM 06:30'], ['12:00', 'PM 12:00'], ['23:59', 'PM 11:59'], ['24:00', 'AM 12:00']]) {
    r.cmd('시간|' + input); assert.equal(r.label().data.text, expected);
  }
});
test('invalid clock input preserves working display and state', () => {
  const r = room(); r.display(); r.advance(1000);
  for (const value of ['25:00', '24:01', '12:60', '-1', 'NaN', 'PM 1:00', '12:30junk']) unchanged(r, '시간|' + value);
});
test('clock increments use configured minutes and wrap both directions', () => {
  const r = room(); r.display(); r.cmd('시간|23:50'); r.cmd('증가|15분'); assert.equal(r.s().clockMinutes, 5);
  r.cmd('감소|30분'); assert.equal(r.s().clockMinutes, 1415);
  r.cmd('간격|1시간30분'); r.cmd('증가'); assert.equal(r.s().clockMinutes, 65);
  r.cmd('증가|3시간'); assert.equal(r.s().clockMinutes, 245);
  for (const value of ['0', '-1분', '3초', '99:99', '100:00:00']) unchanged(r, '간격|' + value);
});
test('space-separated increments override the default only for one command', () => {
  const r = room(); r.display(); r.cmd('시간|06:00'); r.cmd('간격|30분');
  r.cmd('증가 15분'); assert.equal(r.s().clockMinutes, 375); assert.equal(r.s().stepMinutes, 30);
  r.cmd('증가'); assert.equal(r.s().clockMinutes, 405);
  r.cmd('감소 1시간 5분'); assert.equal(r.s().clockMinutes, 340);
  r.cmd('감소'); assert.equal(r.s().clockMinutes, 310); assert.equal(r.s().stepMinutes, 30);
});
test('direct time setting is silent and increments report only small current time', () => {
  const r = room(); r.cmd('시간|10:00'); assert.equal(r.messages.length, 0);
  r.display(); const count = r.messages.length;
  r.cmd('시간|10:00'); assert.equal(r.messages.length, count);
  r.cmd('증가'); assert.match(r.messages.at(-1).content, /^\/desc .*font-size:10px.*<b>AM 10:30<\/b>/);
  assert.equal(r.messages.at(-1).who, '');
  assert.doesNotMatch(r.messages.at(-1).content, /시간|→|증가|감소/);
  r.cmd('알림|GM'); r.cmd('감소'); assert.match(r.messages.at(-1).content, /^\/w gm .*<b>AM 10:00<\/b>/);
  r.cmd('알림|공개'); r.cmd('증가'); assert.match(r.messages.at(-1).content, /^\/desc /);
  r.cmd('알림|끄기'); assert.equal(r.s().announce, false);
  r.cmd('알림|켜기'); assert.equal(r.s().announce, true);
  r.cmd('OFF'); r.cmd('감소'); assert.match(r.messages.at(-1).content, /^\/w gm /);
  assert.ok(r.messages.every(m => m.settings.noarchive === true));
});
test('background opacity validates without changing the text or running countdown', () => {
  const r = room(); r.display(); r.timerCmd('설정 10초'); r.timerCmd('시작');
  const deadline = r.s().deadline;
  for (const [input, fill] of [['0', '#00000000'], ['25', '#00000040'], ['70', '#000000b3'], ['100', '#000000']]) {
    r.cmd('불투명도|' + input); assert.equal(r.panel().data.fill, fill);
    assert.equal(r.label().data.color, '#FFFFFF'); assert.equal(r.s().deadline, deadline);
    assert.equal(r.s().objects.length, 2); assert.equal(r.s().running, true);
  }
  for (const value of ['', '-1', '101', 'NaN', 'Infinity', '10junk']) unchanged(r, '불투명도|' + value);
  r.advance(1000); assert.equal(r.label().data.text, '00:00:09');
  r.cmd('OFF'); idle(r);
});
test('shadow replaces only the panel and follows clock timer fitting and cleanup', () => {
  const r = room(); r.display(); r.cmd('표시|그림자');
  const shadow = () => r.objects.get('text' + r.s().objects.find(ref => ref.role === 'shadow').id);
  assert.equal(r.panel(), undefined); assert.equal(r.s().objects.length, 2);
  assert.equal(shadow().data.color, '#000000'); assert.equal(shadow().data.left, r.label().data.left + 2);
  assert.equal(shadow().data.top, r.label().data.top + 2); assert.equal(r.fronts.at(-1), r.label().id);
  r.advance(1000); idle(r); assert.equal(shadow().data.font_size, r.label().data.font_size);
  r.cmd('시간|13:45'); assert.equal(shadow().data.text, 'PM 01:45');
  r.timerCmd('설정 3초'); r.timerCmd('시작'); r.advance(1000);
  assert.equal(shadow().data.text, '00:00:02'); const deadline = r.s().deadline;
  r.cmd('불투명도|60'); assert.equal(r.panel(), undefined); assert.equal(r.s().deadline, deadline);
  r.cmd('표시|배경'); assert.equal(r.panel().data.fill, '#00000099');
  assert.equal(r.s().objects.length, 2); assert.equal(r.s().deadline, deadline);
  r.cmd('표시|그림자'); shadow().remove(); idle(r); assert.equal(r.s().objects.length, 0);
  assert.ok(r.objects.has('textoutsider')); assert.ok(r.objects.has('graphicguide'));
});
test('appearance settings persist through OFF and invalid stored values recover on restart', () => {
  const r = room(); r.display(); r.cmd('불투명도|45'); r.cmd('표시|그림자'); r.cmd('OFF');
  assert.equal(r.s().backgroundOpacity, 45); assert.equal(r.s().displayStyle, 'shadow');
  r.emit('ready'); assert.equal(r.s().displayStyle, 'shadow'); assert.equal(r.s().backgroundOpacity, 45);
  r.s().displayStyle = 'bad'; r.s().backgroundOpacity = NaN; r.emit('ready');
  assert.equal(r.s().displayStyle, 'background'); assert.equal(r.s().backgroundOpacity, 100); idle(r);
  delete r.s().displayStyle; delete r.s().backgroundOpacity; r.emit('ready');
  assert.equal(r.s().displayStyle, 'background'); assert.equal(r.s().backgroundOpacity, 100);
});
test('duration formats and limits', () => {
  const r = room();
  for (const [input, expected] of [['3초', 3], ['10', 600], ['1시간 2분 3초', 3723], ['00:00:01', 1], ['99:59:59', 359999]]) {
    r.cmd('타이머|' + input); assert.equal(r.s().durationSeconds, expected);
  }
  for (const value of ['', '0', '0초', '-1', '100시간', '00:60:00', 'Infinity', '9999999999999999999999']) unchanged(r, '타이머|' + value);
});
test('countdown ticks visibly and finishes exactly once', () => {
  const r = room(); r.cmd('영역등록'); r.timer('3초');
  assert.equal(r.label().data.text, '00:00:03'); r.advance(1000); assert.equal(r.label().data.text, '00:00:02');
  r.advance(2000); idle(r); assert.equal(r.label().data.text, '00:00:00');
  r.advance(10000); assert.equal(r.messages.filter(m => m.content === '/desc 타이머 종료').length, 1);
  assert.equal(r.s().enabled, true);
});
test('deadline catches up after delayed callbacks without accumulated drift', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초');
  const [id, task] = [...r.timers.entries()].find(([, t]) => t.due === 101000);
  r.timers.delete(id); r.lag(7000); task.fn(); assert.equal(r.label().data.text, '00:00:03');
  r.cmd('OFF'); idle(r);
});
test('pause resume reset and mode change stop hidden countdown work', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초'); r.advance(2000); r.cmd('일시정지'); idle(r);
  assert.equal(r.s().remainingMs, 8000); r.advance(20000); assert.equal(r.label().data.text, '00:00:08');
  r.cmd('시작'); r.advance(1000); assert.equal(r.label().data.text, '00:00:07');
  r.cmd('초기화'); idle(r); assert.equal(r.label().data.text, '00:00:10');
  r.cmd('시작'); r.cmd('모드|시계'); idle(r); assert.match(r.label().data.text, /^AM /);
});
test('repeated starts retain one ticking task and stale callbacks cannot steal handles', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초');
  const stale = [...r.timers.values()].map(t => t.fn); r.cmd('시작'); r.cmd('시작');
  stale.forEach(fn => fn()); assert.equal(r.timers.size, 1);
  r.cmd('OFF'); idle(r); stale.forEach(fn => fn()); idle(r); assert.equal(r.s().objects.length, 0);
});
test('OFF removes only owned display and clears runtime but preserves configuration', () => {
  const r = room(); r.cmd('영역등록'); r.cmd('시간|18:45'); r.cmd('간격|15분'); r.timer('10초'); r.advance(1000); r.cmd('OFF');
  idle(r); assert.equal(r.s().objects.length, 0); assert.equal(r.s().remainingMs, 0); assert.equal(r.s().deadline, 0);
  assert.equal(r.s().clockMinutes, 1125); assert.equal(r.s().stepMinutes, 15); assert.equal(r.s().durationSeconds, 10);
  assert.ok(r.s().area); assert.ok(r.objects.has('textoutsider')); assert.ok(r.objects.has('graphicguide'));
  r.cmd('시작'); assert.equal(r.label().data.text, '00:00:10'); r.cmd('OFF'); idle(r);
});
test('API restart clears persisted display and never resumes automatically', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초'); r.emit('ready');
  idle(r); assert.equal(r.s().objects.length, 0); assert.equal(r.s().enabled, false); assert.equal(r.s().durationSeconds, 10);
});
test('owned object or page deletion cleans up timers and remaining display', () => {
  for (const target of ['text', 'pathv2', 'page']) {
    const r = room(); r.cmd('영역등록'); r.timer('10초');
    (target === 'text' ? r.label() : target === 'pathv2' ? r.panel() : r.objects.get('pagepage')).remove();
    idle(r); assert.equal(r.s().objects.length, 0); assert.equal(r.s().enabled, false);
  }
  const r = room(); r.display(); r.outsider.remove(); assert.equal(r.s().enabled, true);
});
test('partial creation and display update failures fail closed', () => {
  const r = room(); r.cmd('영역등록'); r.faults.create = 'text'; r.cmd('ON');
  idle(r); assert.equal(r.s().objects.length, 0); assert.equal(r.s().enabled, false); assert.ok(r.logs.some(v => v.includes('create failed')));
  delete r.faults.create; r.timer('10초'); r.faults.set = 'text'; r.advance(1000);
  idle(r); assert.equal(r.s().objects.length, 0); assert.equal(r.s().enabled, false);
});
test('failed cleanup can be retried without leaving a background task', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초'); r.faults.remove = 'text'; r.cmd('OFF'); idle(r);
  assert.equal(r.s().objects.length, 1); assert.match(r.messages.at(-1).content, /재시도/);
  delete r.faults.remove; r.cmd('OFF'); assert.equal(r.s().objects.length, 0); idle(r);
});
test('missing runtime page fails closed even without a deletion event', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초'); r.objects.delete('pagepage'); r.advance(1000);
  idle(r); assert.equal(r.s().enabled, false); assert.equal(r.s().objects.length, 0);
});
test('invalid commands do not cancel an active timer', () => {
  const r = room(); r.cmd('영역등록'); r.timer('10초');
  for (const command of ['모드|bad', '알림|bad', '표시|bad', '불투명도|101', '타이머|0초', '시간|25:00', '증가', 'unknown']) unchanged(r, command);
  assert.equal(r.s().running, true); r.cmd('OFF'); idle(r);
});
test('timer command namespace supports setting ON start pause resume reset and OFF', () => {
  const r = room(); r.cmd('영역등록'); r.timerCmd('설정 00:00:10');
  assert.equal(r.s().mode, 'timer'); assert.equal(r.s().durationSeconds, 10); assert.equal(r.s().enabled, false);
  r.timerCmd('on'); assert.equal(r.label().data.text, '00:00:10'); assert.equal(r.s().running, false);
  r.advance(1000); idle(r); r.timerCmd('시작'); r.advance(2000);
  r.timerCmd('일시정지'); idle(r); assert.equal(r.s().remainingMs, 8000);
  r.timerCmd('시작'); r.advance(1000); assert.equal(r.label().data.text, '00:00:07');
  r.timerCmd('초기화'); idle(r); assert.equal(r.label().data.text, '00:00:10');
  r.timerCmd('시작'); r.timerCmd('oFf'); idle(r); assert.equal(r.s().objects.length, 0);
  assert.equal(r.s().remainingMs, 0); assert.equal(r.s().durationSeconds, 10);
});
test('ON chooses the named mode without automatically starting or restarting a timer', () => {
  const r = room(); r.cmd('영역등록'); r.timerCmd('설정|10초'); r.timerCmd('시작'); r.advance(2000);
  r.cmd('ON'); assert.equal(r.s().mode, 'clock'); assert.equal(r.s().remainingMs, 8000); assert.equal(r.s().running, false);
  r.advance(1000); idle(r); assert.match(r.label().data.text, /^AM /);
  r.timerCmd('ON'); assert.equal(r.s().mode, 'timer'); assert.equal(r.label().data.text, '00:00:08'); assert.equal(r.s().running, false);
  r.timerCmd('시작'); r.advance(1000); r.timerCmd('ON'); assert.equal(r.s().running, true);
  r.advance(1000); assert.equal(r.label().data.text, '00:00:06'); r.cmd('OFF'); idle(r);
});
test('invalid timer commands preserve state and legacy timer aliases still work', () => {
  const r = room(); r.cmd('영역등록'); r.timerCmd('설정 3초'); r.timerCmd('시작');
  for (const action of ['설정 0초', '설정 bad', '시간 06:00', '증가 15분', 'unknown']) {
    const before = JSON.stringify(r.s()); r.timerCmd(action); assert.equal(JSON.stringify(r.s()), before);
  }
  r.cmd('일시정지'); idle(r); r.cmd('타이머|00:00:04'); r.cmd('시작'); r.advance(1000);
  assert.equal(r.label().data.text, '00:00:03'); r.timerCmd('OFF'); idle(r);
});
test('settings buttons emit standalone commands and query links', () => {
  const r = room(); r.cmd('설정'); const html = r.messages.at(-1).content;
  const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  assert.equal(links.length, 18); assert.ok(links.every(href => /^!(시계|타이머) /.test(href)));
  assert.doesNotMatch(html, /영역:|×|원본 토큰은|자동 표시합니다|OFF는 표시/);
  for (const command of ['!시계 표시|배경', '!시계 표시|그림자', '!시계 알림|공개', '!시계 알림|GM']) assert.ok(links.includes(command));
  assert.ok(links.some(href => href.includes('&#63;{현재 시간')));
  assert.ok(links.some(href => href === '!시계 영역등록'));
  assert.ok(links.some(href => href.startsWith('!타이머 설정 &#63;{')));
  for (const action of ['시작', '일시정지', '초기화', 'ON', 'OFF']) assert.ok(links.includes('!타이머 ' + action));
  assert.ok(!links.some(href => /^!시계 (타이머|시작|일시정지|초기화)/.test(href)));
  r.emit('chat:message', { type: 'api', content: '!시계|시간|09:05', playerid: 'gm' });
  assert.equal(r.s().clockMinutes, 545);
  for (const href of links) {
    const content = href.replace(/&#63;/g, '?').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .replace(/\?\{[^|}]+\|([^}]+)\}/g, '$1');
    r.emit('chat:message', { type: 'api', content, playerid: 'gm', selected: [{ _type: 'graphic', _id: 'guide' }] });
  }
  assert.equal(r.logs.length, 1); assert.ok(!r.messages.some(m => /알 수 없는|입력하세요|먼저 설정|선택하세요/.test(m.content)));
  assert.equal(r.s().durationSeconds, 600); assert.equal(r.s().remainingMs, 600000); idle(r);
});
console.log(`${passed} tests passed`);
