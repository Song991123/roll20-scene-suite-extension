const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = name => fs.readFileSync(path.join(root, 'public/scripts', name), 'utf8');
function room({ director = false, narrator = false, modules = [], apng = true, apngIntegration = true } = {}) {
  let now = 1000, sequence = 0;
  const objects = new Map(), timers = new Map(), events = {}, messages = [], changes = [];
  const state = {};
  function object(type, id, data) {
    const obj = { id, type, data,
      get(key, callback) { const value = key === '_type' ? type : key === '_id' ? id : data[key]; if (callback) callback(value); return value; },
      set(key, value) { if (typeof key === 'object') Object.assign(data, key); else data[key] = value; },
      remove() { objects.delete(id); (events['destroy:' + type] || []).forEach(fn => fn(obj)); } };
    objects.set(id, obj); return obj;
  }
  object('page', 'page', { name: 'conversation', width: 20, height: 12 });
  object('deck', 'deck', { name: 'apng' });
  ['front', 'back'].forEach(id => object('card', id, { name: id === 'front' ? '앞 연출' : '뒤 연출', _deckid: 'deck', avatar: 'https://files.d20.io/images/' + id + '/thumb.png' }));
  object('graphic', 'area', { name: 'apng_area', _pageid: 'page', layer: 'gmlayer', left: 200, top: 300, width: 400, height: 250 });
  object('player', 'gm', { _displayname: 'GM', _online: true });
  function emit(event, ...args) { (events[event] || []).forEach(fn => fn(...args)); }
  const context = {
    state, log() {}, on(event, fn) { (events[event] ||= []).push(fn); },
    Date: { now: () => now }, playerIsGM: id => id === 'gm', randomInteger: () => 1,
    Campaign: () => ({ get: () => '' }), toFront() {}, toBack() {},
    findObjs(query) { return [...objects.values()].filter(o => Object.entries(query).every(([key, value]) => o.get(key === 'type' ? '_type' : key) === value)); },
    getObj(type, id) { const obj = objects.get(id); return obj && obj.type === type ? obj : null; },
    createObj(type, data) { return object(type, 'created' + ++sequence, { ...data }); },
    sendChat(as, content, cb, options) { messages.push({ as, content, options }); if (cb) cb([]); },
    setTimeout(fn, delay) { const id = ++sequence; timers.set(id, { fn, at: now + Number(delay || 0) }); return id; },
    clearTimeout(id) { timers.delete(id); }, setInterval() { throw new Error('Transition must not poll'); }, clearInterval() {},
  };
  vm.createContext(context);
  if (director) vm.runInContext(source('00_scene_director.js'), context);
  if (narrator) vm.runInContext(source('01_narrator_director.js'), context);
  modules.forEach(name => vm.runInContext(source(name), context));
  if (apng) vm.runInContext(apngIntegration ? source('06_apng_director.js') :
    source('06_apng_director.js').replace('SCENE_DIRECTOR_ENABLED: true', 'SCENE_DIRECTOR_ENABLED: false'), context);
  emit('ready');
  function advance(ms) {
    const end = now + ms;
    let count = 0;
    for (;;) {
      const next = [...timers.entries()].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      assert(++count < 1000, 'Timer recursion');
      const [id, timer] = next; now = timer.at; timers.delete(id); timer.fn();
    }
    now = end;
  }
  advance(2000);
  function chat(content, playerid = 'gm') { emit('chat:message', { type: 'api', content, playerid, who: 'GM' }); }
  function adapter(name, aliases) {
    context.KIBScene.adapters[name] = { aliases, validate: () => ({ ok: true }), cue(args) { changes.push({ name, args: Array.from(args), time: now }); return { ok: true }; } };
    context.KIBScene.handlers[name] = context.KIBScene.adapters[name].cue;
  }
  function save(name = '슬라이드', extra = '', placement = '전체') { chat('!장면전환 저장|새로|' + name + '|id:front|1.2초|id:back|0.8초|' + placement + '|' + extra); }
  function graphics() { return [...objects.values()].filter(o => o.type === 'graphic' && String(o.data.name).startsWith('sd_apng:')); }
  function managerHtml() { return objects.get(state.KIBSceneAPNG.managerId).get('notes'); }
  return { context, state, timers, objects, messages, changes, emit, advance, chat, adapter, save, graphics, managerHtml, object };
}
function decode(value) { return value.replace(/&#63;/g, '?').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }
function button(html, label) {
  const links = [...html.matchAll(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g)];
  const result = links.find(match => decode(match[2]) === label);
  assert(result, 'Missing button: ' + label);
  return decode(result[1]);
}
function answer(command, values = {}) {
  return command.replace(/\?\{([^{}]*)\}/g, (_, body) => {
    const [label, ...choices] = body.split('|');
    if (Object.hasOwn(values, label)) return values[label];
    const first = choices[0] || '';
    return (first.includes(',') ? first.slice(first.indexOf(',') + 1) : first)
      .replace(/&#44;/g, ',').replace(/&#124;/g, '|').replace(/&#125;/g, '}');
  });
}
let count = 0;
function test(name, fn) { fn(); count++; console.log('PASS ' + name); }
test('06 alone: handout buttons create, edit, run and delete presets', () => {
  const r = room();
  r.chat(answer(button(r.managerHtml(), '장면전환 만들기'), { '장면전환 이름': '별빛', '뒤 연출 APNG': 'id:back', '위치': '영역' }));
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.name, '별빛');
  r.chat(answer(button(r.managerHtml(), '전환 설정 수정'), { '장면전환 이름': '별빛 수정', '앞 연출 시간': '0.5초', '뒤 연출 시간': '0.7초' }));
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.coverMs, 500);
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.reveal, 'back');
  r.chat(button(r.managerHtml(), '전환 실행')); assert.equal(r.graphics().length, 1);
  r.advance(500); assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
  r.advance(700); assert.equal(r.graphics().length, 0);
  r.chat(button(r.managerHtml(), '삭제')); assert.equal(Object.keys(r.state.KIBSceneAPNG.transitions).length, 0);
});
test('middle commands run only after front, before back with preserved pipe args', () => {
  const r = room(); r.adapter('vd', { 비주얼: '' }); r.adapter('audio', { 오디오: '' });
  r.save('슬라이드', '@비주얼 배경 외부인숙소_2층복도 @오디오 중지|숙소 계단');
  r.chat('!APNG 전환|슬라이드'); r.advance(1199); assert.equal(r.changes.length, 0);
  assert.equal(r.graphics()[0].data.name, 'sd_apng:front');
  r.advance(1); assert.deepEqual(r.changes.map(c => c.name), ['vd', 'audio']);
  assert.deepEqual(r.changes[1].args, ['중지', '숙소 계단']);
  assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
  r.advance(800); assert.equal(r.graphics().length, 0);
});
test('areas and full page use existing bounds and do not create opaque overlays', () => {
  for (const placement of ['영역', '전체']) {
    const r = room(); r.save('전환', '', placement); r.chat('!APNG 전환|전환');
    assert.equal(r.graphics().length, 1);
    const g = r.graphics()[0];
    assert.equal(g.data.width, placement === '영역' ? 400 : 1400);
    assert.equal(g.data.layer, placement === '영역' ? 'map' : 'objects');
    r.advance(2000); assert.equal(r.graphics().length, 0);
  }
});
test('image switcher is optional; command override buttons use adapter only', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save();
  r.chat(answer(button(r.managerHtml(), '중간 명령 수정'), { '새 중간 명령 비우면 없음': '@이미지 image_room|ON' }));
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.commands, '@이미지 image_room|ON');
  r.chat(answer(button(r.managerHtml(), '명령 지정 실행'), { '중간 명령 없으면 -': '@이미지 image_room|OFF' }));
  r.advance(1200); assert.deepEqual(r.changes[0].args, ['image_room', 'OFF']);
  r.advance(800);
  r.chat('!APNG 전환|슬라이드|-'); r.advance(2000); assert.equal(r.changes.length, 1);
});
test('queue is FIFO; cancellation removes owned effects and pending commands', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save();
  r.chat('!APNG 전환|슬라이드|@이미지 one|ON'); r.chat('!APNG 전환|슬라이드|@이미지 two|ON');
  r.advance(2000); assert.equal(r.changes.length, 1); assert.equal(r.graphics()[0].data.name, 'sd_apng:front');
  r.advance(1200); assert.equal(r.changes[1].args[0], 'two');
  r.chat(button(r.managerHtml(), '전환 중지')); r.advance(10000); assert.equal(r.graphics().length, 0);
  assert.equal(r.changes.length, 2);
});
test('invalid, disabled, missing or recursive commands fail before effects', () => {
  const r = room({ director: true }); r.save();
  ['@비주얼 배경 없음', '@장면전환 슬라이드', '@APNG 중지', '!오디오 재생|x'].forEach(command => {
    r.chat('!APNG 전환|슬라이드|' + command); assert.equal(r.graphics().length, 0);
  });
  r.adapter('audio', { 오디오: '' }); r.context.KIBScene.isFeatureEnabled = () => false;
  r.chat('!APNG 전환|슬라이드|@오디오 재생|x'); assert.equal(r.graphics().length, 0);
});
test('resource disappears at midpoint: cancel cleanly without command execution', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save();
  r.chat('!APNG 전환|슬라이드|@이미지 x|ON');
  r.context.KIBScene.adapters.image.validate = () => ({ ok: false, error: '대상 없음' });
  r.advance(2000); assert.equal(r.changes.length, 0); assert.equal(r.graphics().length, 0);
});
test('existing APNG once/loop and card settings stay independent', () => {
  const r = room(); r.chat('!APNG 설정|id:front|1회|0.5초'); r.chat('!APNG 재생|앞 연출');
  assert.equal(r.graphics().length, 1); r.advance(500); assert.equal(r.graphics().length, 0);
  r.chat('!APNG 재생|뒤 연출|반복'); r.save(); r.chat('!APNG 전환|슬라이드'); r.chat('!APNG 전환중지');
  assert.equal(r.graphics().length, 1); assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
  r.chat('!APNG 중지'); assert.equal(r.graphics().length, 0);
});
test('GM-only controls and invalid edits preserve saved data', () => {
  const r = room(); r.save(); const saved = JSON.stringify(r.state.KIBSceneAPNG.transitions);
  r.chat('!APNG 전환저장|t1|파손|id:front|0초|id:back|1초|전체');
  r.chat('!APNG 전환삭제|t1', 'player');
  assert.equal(JSON.stringify(r.state.KIBSceneAPNG.transitions), saved);
  r.chat('!APNG 전환|슬라이드', 'player'); assert.equal(r.graphics().length, 0);
});
test('cancel before midpoint clears queued commands and only transition objects', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save('전환', '@이미지 x|ON');
  r.chat('!APNG 전환|전환'); r.chat('!APNG 전환|전환'); r.advance(500);
  r.chat('!APNG 전환중지'); r.advance(10000);
  assert.equal(r.changes.length, 0); assert.equal(r.graphics().length, 0);
  assert(r.objects.has('area'));
});
test('external removal cancels the run without executing its pending commands', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save('전환', '@이미지 x|ON');
  r.chat('!APNG 전환|전환'); r.graphics()[0].remove(); r.advance(3000);
  assert.equal(r.changes.length, 0); assert.equal(r.graphics().length, 0);
});
test('00 + 01 + 06: narrator cue resolves alias, waits and cancels', () => {
  const r = room({ director: true, narrator: true }); r.save('긴전환');
  r.chat('!APNG 전환저장|t1|긴전환|id:front|2초|id:back|2초|전체|');
  const parsed = r.context.ntExtractCues('@장면전환 긴전환');
  assert.equal(parsed.cues[0].type, 'apng'); assert.deepEqual(Array.from(parsed.cues[0].args), ['전환', '긴전환']);
  r.context.state.narration = [{ as: 'GM', msg: '@장면전환 긴전환' }, { as: 'GM', msg: '다음 장면' }];
  r.context.state.is_narrating = 2; r.context.narrate();
  r.advance(3999); assert(!r.messages.some(m => m.content.includes('다음 장면')));
  r.advance(1); assert(r.messages.some(m => m.content.includes('다음 장면')));
  r.context.state.narration = [{ as: 'GM', msg: '@장면전환 긴전환' }];
  r.context.state.is_narrating = 2; r.context.narrate(); r.chat('!/'); r.advance(5000);
  assert.equal(r.graphics().length, 0);
});
test('01 + 06 without 00: generic adapter aliases and wait contract work', () => {
  const r = room({ narrator: true }); r.save();
  const cue = r.context.ntExtractCues('@장면전환 슬라이드').cues[0];
  assert.equal(cue.type, 'apng');
  const result = r.context.ntRunCues([cue], { narrator: true });
  assert.equal(result.waitMs, 2000); r.advance(2000); assert.equal(r.graphics().length, 0);
});
test('legacy grouped cue format accepts per-run middle commands without early execution', () => {
  const r = room({ narrator: true }); r.adapter('image', { 이미지: '' }); r.save();
  const parsed = r.context.ntExtractCues('{{@장면전환|슬라이드|@이미지 image_room|ON}}');
  assert.equal(parsed.cues.length, 1);
  const result = r.context.ntRunCues(parsed.cues, { narrator: true });
  assert.equal(result.waitMs, 2000); assert.equal(r.changes.length, 0);
  r.advance(1200); assert.deepEqual(r.changes[0].args, ['image_room', 'ON']);
});
test('buttons preserve query punctuation in names and pipe commands during edit', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save('별,빛 & 밤', '@이미지 image_room|ON');
  r.chat(answer(button(r.managerHtml(), '전환 설정 수정'), { '앞 연출 시간': '0.9초' }));
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.name, '별,빛 & 밤');
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.commands, '@이미지 image_room|ON');
  r.chat(button(r.managerHtml(), '전환 실행')); r.advance(900);
  assert.deepEqual(r.changes[0].args, ['image_room', 'ON']);
});
test('missing reveal at midpoint prevents middle changes and removes front', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save();
  r.chat('!APNG 전환|슬라이드|@이미지 x|ON'); r.objects.get('back').remove();
  r.advance(2000); assert.equal(r.changes.length, 0); assert.equal(r.graphics().length, 0);
});
test('async transition failure cancels remaining narrator lines', () => {
  const r = room({ director: true, narrator: true }); r.adapter('image', { 이미지: '' }); r.save('전환', '@이미지 x|ON');
  r.state.narration = [{ as: 'GM', msg: '@장면전환 전환' }, { as: 'GM', msg: '출력되면 안됨' }];
  r.state.is_narrating = 2; r.context.narrate();
  r.context.KIBScene.adapters.image.cue = () => ({ ok: false, error: '대상 삭제' });
  r.context.KIBScene.handlers.image = r.context.KIBScene.adapters.image.cue;
  r.advance(5000); assert.equal(r.state.narration.length, 0);
  assert(!r.messages.some(m => m.content === '출력되면 안됨'));
  assert.equal(r.graphics().length, 0);
});
test('real 02 audio and 04 image adapters execute only at midpoint', () => {
  const r = room({ modules: ['02_audio_bridge.js', '04_image_switcher_compatible.js'] });
  const track = r.object('jukeboxtrack', 'bgm', { title: '숙소 계단', playing: true, volume: 50 });
  r.object('deck', 'image-deck', { name: 'image_room' });
  r.object('card', 'image-card', { _deckid: 'image-deck', name: 'ON', avatar: 'https://files.d20.io/images/room/thumb.png' });
  const token = r.object('graphic', 'image-token', { _pageid: 'page', name: 'image_room', imgsrc: 'old' });
  r.save('전환', '@이미지 image_room|ON @오디오 중지|숙소 계단');
  r.chat('!APNG 전환|전환'); r.advance(1199);
  assert.equal(track.data.playing, true); assert.equal(token.data.imgsrc, 'old');
  r.advance(1); assert.equal(track.data.playing, false); assert(token.data.imgsrc.includes('/room/'));
});
test('manager uses shared handout hierarchy and separates settings, playback and transitions', () => {
  const r = room(); r.save();
  const html = r.managerHtml();
  ['📽️ APNG 관리', '적용 설정', 'APNG 재생', '장면전환'].forEach(label => assert(html.includes(label)));
  assert(html.includes('font-family:Arial,sans-serif;color:#111;background:#fff;line-height:1.45'));
  assert(html.includes('padding:6px 9px;background:#111;color:#fff;font-weight:bold'));
  assert(html.includes('background:#f3f3f3;border-left:4px solid #111'));
  assert(html.includes('재생 시간: 3초')); assert(!html.includes('한 사이클')); assert(!html.includes('·'));
  assert(html.includes('<b>전체</b> 또는 <b>지정 영역</b>을 각 APNG별로 선택해 재생할 수 있습니다.'));
  assert(html.includes('원하는 APNG로 장면전환을 만들 수 있습니다.'));
  assert(html.includes('시작할 APNG와 끝날 때의 APNG를 골라주세요.'));
  assert(!html.includes('장면전환을 등록하지 않아도'));
  assert(!html.includes('앞뒤 APNG는 각각 1회만'));
  assert(!html.includes('<b>실행:</b>'));
});
test('card buttons force once or repeat, preserve placement choice and stop only their card', () => {
  const r = room();
  r.chat('!APNG 설정|id:front|반복|2초');
  let html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  r.chat(button(html, '지정 영역'));
  html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  assert(html.includes('재생 위치: 지정 영역 (apng_area)'));
  assert(!button(html, '실행').includes('?{'));
  r.chat(button(html, '실행'));
  assert.equal(r.graphics()[0].data.width, 400);
  r.advance(1999); assert.equal(r.graphics().length, 1);
  r.advance(1); assert.equal(r.graphics().length, 0);
  r.chat(button(html, '전체'));
  html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  r.chat(button(html, '반복 실행')); r.advance(12000);
  assert.equal(r.graphics().length, 1); assert.equal(r.graphics()[0].data.width, 1400);
  r.chat('!APNG 재생|id:back|반복');
  r.chat(button(html, '중지')); assert.equal(r.graphics().length, 1);
  assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
  r.chat(button(html, '중지')); assert.equal(r.graphics().length, 1);
  assert.equal(r.state.KIBSceneAPNG.cardSettings.front.mode, 'loop');
});
test('playback time button changes only normal playback duration and keeps exact milliseconds', () => {
  const r = room(); r.save();
  r.chat('!APNG 설정|id:front|반복|2초|영역');
  let html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  const command = answer(button(html, '재생 시간 변경'), { '재생 시간': '1.234초' });
  assert(!command.includes('재생 방식'));
  r.chat(command);
  assert.equal(r.state.KIBSceneAPNG.cardSettings.front.duration, 1234);
  assert.equal(r.state.KIBSceneAPNG.cardSettings.front.mode, 'loop');
  assert.equal(r.state.KIBSceneAPNG.cardSettings.front.placement, 'area');
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.coverMs, 1200);
  assert(r.managerHtml().includes('재생 시간: 1.234초'));
  assert(!r.messages.at(-1).content.includes('한 사이클'));
  r.chat('!APNG 전환|슬라이드'); r.advance(1199);
  assert.equal(r.graphics()[0].data.name, 'sd_apng:front');
  r.advance(1); assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
});
test('normal play stop removes an in-flight once effect and remains GM-only', () => {
  const r = room(); const html = r.managerHtml();
  r.chat(answer(button(html, '실행'))); r.advance(100);
  r.chat(button(html, '중지'), 'player'); assert.equal(r.graphics().length, 1);
  r.chat(button(html, '중지')); r.advance(10000); assert.equal(r.graphics().length, 0);
});

test('manager hrefs avoid the id-colon prefix removed by Roll20 journal sanitization', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save('기호: 이름', '@이미지 image_room|ON');
  const links = [...r.managerHtml().matchAll(/<a href="([^"]*)"/g)].map(match => decode(match[1]));
  assert(links.length > 15);
  for (const href of links) {
    assert(/^!(?:APNG |장면전환(?: |\|))/.test(href), href);
    assert(!href.split('?')[0].includes(':'), 'Unsafe colon before query: ' + href);
  }
  assert.equal(button(r.managerHtml(), '중지'), '!APNG 중지|id=front');
  assert.equal(button(r.managerHtml(), '전환 실행'), '!장면전환|id=t1');
});

test('safe id references and legacy id-colon commands select the same cards and presets', () => {
  const r = room(); r.save();
  for (const prefix of ['id:', 'id=']) {
    r.chat('!APNG 재생|' + prefix + 'front|반복');
    assert.equal(r.graphics()[0].data.name, 'sd_apng:front');
    r.chat('!APNG 중지|' + prefix + 'front'); assert.equal(r.graphics().length, 0);
    r.chat('!APNG 전환|' + prefix + 't1'); assert.equal(r.graphics().length, 1);
    r.advance(2000); assert.equal(r.graphics().length, 0);
  }
});

test('saved placement survives time updates, defaults and restart without affecting transition placement', () => {
  const r = room(); r.save();
  r.chat('!APNG 설정|id=front|1회|2초|영역');
  r.chat('!APNG 설정|id=front|1회|1초');
  r.chat('!APNG 설정|id=front|1회|1초|없는 위치');
  assert.equal(r.state.KIBSceneAPNG.cardSettings.front.placement, 'area');
  r.emit('ready');
  r.chat('!APNG 재생|앞 연출'); assert.equal(r.graphics()[0].data.width, 400);
  r.advance(1000); assert.equal(r.graphics().length, 0);
  r.chat('!APNG 재생|id=front|1회|전체'); assert.equal(r.graphics()[0].data.width, 1400);
  r.advance(1000);
  r.chat('!APNG 전환|슬라이드'); assert.equal(r.graphics()[0].data.width, 1400);
});
test('00 links to the APNG manager without owning transition or audio controls', () => {
  const r = room({ director: true, modules: ['02_audio_bridge.js'] }); r.save(); r.advance(2000);
  const help = [...r.objects.values()].find(o => o.type === 'handout' && o.get('name') === '[GM] SceneDirector 사용법').get('notes');
  assert.equal(button(help, 'APNG 관리'), '!APNG 관리');
  assert(help.includes('!장면전환|전환명')); assert(help.includes('!APNG 연결|카드명|효과음 제목'));
  for (const label of ['장면전환 만들기', '전환 설정 수정', '연결 등록', '음원 연결']) assert(!help.includes('>' + label + '</a>'));
  assert.equal(r.context.KIBScene.adapters.apng.transitionControls, undefined);
  assert(r.managerHtml().includes('>장면전환 만들기</a>'));
  assert(!source('00_scene_director.js').includes('apngAudioHelpControls'));
});
test('manager commands open the existing journal without duplicating editable controls in chat', () => {
  const r = room(); r.save(); const managerId = r.state.KIBSceneAPNG.managerId;
  for (const command of ['!APNG 관리', '!APNG 설정']) {
    r.chat(command);
    assert.equal(button(r.messages.at(-1).content, '관리 핸드아웃 열기'), 'http://journal.roll20.net/handout/' + managerId);
    assert(!r.messages.at(-1).content.includes('>장면전환 만들기</a>'));
    assert.equal(r.messages.at(-1).options.noarchive, true);
  }
  const count = r.messages.length; r.chat('!APNG 관리', 'player'); assert.equal(r.messages.length, count);
  assert.equal(r.state.KIBSceneAPNG.managerId, managerId); assert.equal(Object.keys(r.state.KIBSceneAPNG.transitions).length, 1);
});
test('06 owns audio bind change and unlink buttons without requiring 00 or 02', () => {
  const r = room(); r.save();
  r.object('jukeboxtrack', 'sound1', { title: '효과음: 밤, {문|소리} & <바람>' });
  r.object('jukeboxtrack', 'sound2', { title: '효과음2' });
  r.chat('!APNG 관리');
  let html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  assert(!button(html, '음원 연결').split('?')[0].includes(':'));
  r.chat(answer(button(html, '음원 연결'), { '연결할 음원': 'id=sound1' }));
  assert.equal(r.state.KIBSceneAPNG.audioLinks.front, 'sound1');
  assert(r.managerHtml().includes('연결 음원: 효과음: 밤, {문|소리} &amp; &lt;바람&gt;'));
  html = r.managerHtml().slice(r.managerHtml().indexOf('<b>앞 연출</b>'));
  r.chat(answer(button(html, '음원 변경'), { '연결할 음원': 'id=sound2' }));
  assert.equal(r.state.KIBSceneAPNG.audioLinks.front, 'sound2');
  r.chat(button(r.managerHtml(), '연결 해제'), 'player'); assert.equal(r.state.KIBSceneAPNG.audioLinks.front, 'sound2');
  r.chat(button(r.managerHtml(), '연결 해제')); assert.equal(r.state.KIBSceneAPNG.audioLinks.front, undefined);
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.name, '슬라이드');
});
test('audio links retain legacy id and title lookup, one-to-one binding, invalid input and restart behavior', () => {
  const r = room(); r.object('jukeboxtrack', 'sound', { title: '문 소리' });
  for (const reference of ['id:sound', 'id=sound', '문 소리']) {
    r.chat('!APNG 연결|id=front|' + reference); assert.equal(r.state.KIBSceneAPNG.audioLinks.front, 'sound');
  }
  r.chat('!APNG 연결|id=back|id=sound'); assert.equal(r.state.KIBSceneAPNG.audioLinks.front, undefined);
  r.chat('!APNG 연결|id=back|id=missing'); assert.equal(r.state.KIBSceneAPNG.audioLinks.back, 'sound');
  r.emit('ready'); assert.equal(r.state.KIBSceneAPNG.audioLinks.back, 'sound');
  assert(r.managerHtml().includes('연결 음원: 문 소리'));
  r.chat('!APNG 연결목록'); assert(r.messages.at(-1).content.includes('뒤 연출: 문 소리'));
});
test('track inventory refreshes only on add rename and delete, not volume or playback', () => {
  const r = room(); assert(!r.managerHtml().includes('>음원 연결</a>'));
  const track = r.object('jukeboxtrack', 'sound', { title: '원래', playing: false, volume: 50 });
  r.emit('add:jukeboxtrack', track); r.advance(100); assert(r.managerHtml().includes('id=sound'));
  track.set('title', '새 제목'); r.emit('change:jukeboxtrack', track, { title: '원래', playing: false }); r.advance(100);
  assert(r.managerHtml().includes('새 제목'));
  r.chat('!APNG 연결|id=front|id=sound');
  const manager = r.objects.get(r.state.KIBSceneAPNG.managerId), set = manager.set; let writes = 0;
  manager.set = (...args) => { writes++; return set(...args); };
  track.set('volume', 60); r.emit('change:jukeboxtrack', track, { title: '새 제목', playing: false }); r.advance(200);
  assert.equal(writes, 0);
  track.set('playing', true); r.emit('change:jukeboxtrack', track, { title: '새 제목', playing: false }); r.advance(200);
  assert.equal(writes, 0);
  track.remove(); assert.equal(r.state.KIBSceneAPNG.audioLinks.front, undefined);
  assert(!r.managerHtml().includes('>음원 연결</a>')); assert(r.managerHtml().includes('주크박스 음원 없음'));
});

test('plain transition cues automatically defer following commands until the midpoint with or without 00', () => {
  for (const director of [false, true]) {
    const r = room({ director, narrator: true }); r.adapter('audio', { 오디오: '' }); r.adapter('vd', { 비주얼: '' }); r.save('기본');
    const line = `/desc <div style="[다방](#" style="font-weight: bold; text-decoration:none; font-style:normal; font-family:'Diphylleia'; color: #fff; background-color:#332e27;box-shadow:inset 0 -15px 10px -10px #ffffff20; text-align: right; display:block; font-size: 17px; padding:12px 25px 12px; margin: -9px -30px; cursor: default; border-bottom: 2px solid #ffffff80;)<div style="[: ?{온사람} ](#" style="font-size: 11px; color: #fff; text-align: right; border-top: 1px solid #fff; margin-top: 5px; font-weight: normal;) @오디오 전체중지 @장면전환 기본 @비주얼 퇴장:전원 @오디오 재생|༄ 다방|반복|볼륨=30 @비주얼 배경 다방`;
    const parsed = r.context.ntExtractCues(line), context = { narrator: true, as: 'GM' };
    assert(parsed.text.includes("font-family:'Diphylleia'")); assert(!parsed.text.includes('@비주얼'));
    assert.equal(r.context.ntValidateCues(parsed.cues, context).ok, true);
    const result = r.context.ntRunCues(parsed.cues, context);
    assert.equal(result.waitMs, 2000); assert.deepEqual(r.changes.map(c => c.args), [['전체중지']]);
    r.advance(1199); assert.equal(r.changes.length, 1); assert.equal(r.graphics()[0].data.name, 'sd_apng:front');
    r.advance(1); assert.deepEqual(r.changes.slice(1).map(c => c.args), [['퇴장:전원'], ['재생', '༄ 다방', '반복', '볼륨=30'], ['배경 다방']]);
    assert.equal(r.graphics()[0].data.name, 'sd_apng:back');
    r.advance(800); assert.equal(r.graphics().length, 0);
  }
});
test('ordinary lines and explicit legacy groups retain their original timing', () => {
  const r = room({ narrator: true }); r.adapter('audio', { 오디오: '' }); r.adapter('image', { 이미지: '' }); r.save();
  let parsed = r.context.ntExtractCues('@오디오 전체중지 @이미지 image_room|ON');
  r.context.ntRunCues(parsed.cues, {}); assert.equal(r.changes.length, 2);
  r.changes.length = 0;
  parsed = r.context.ntExtractCues('@오디오 전체중지 {{@장면전환|슬라이드|@이미지 image_room|OFF}} @오디오 재생|music');
  assert.equal(r.context.ntValidateCues(parsed.cues, {}).ok, true);
  r.context.ntRunCues(parsed.cues, {}); assert.deepEqual(r.changes.map(c => c.args), [['전체중지'], ['재생', 'music']]);
  r.advance(1200); assert.deepEqual(r.changes.at(-1).args, ['image_room', 'OFF']);
});
test('two inline transitions partition their following commands and run FIFO', () => {
  const r = room({ narrator: true }); r.adapter('image', { 이미지: '' }); r.save();
  const parsed = r.context.ntExtractCues('@장면전환 슬라이드 @이미지 one|ON @장면전환 슬라이드 @이미지 two|ON');
  assert.equal(r.context.ntValidateCues(parsed.cues, {}).ok, true);
  assert.equal(r.context.ntRunCues(parsed.cues, {}).waitMs, 4000);
  r.advance(1200); assert.deepEqual(r.changes.map(c => c.args[0]), ['one']);
  r.advance(1999); assert.equal(r.changes.length, 1);
  r.advance(1); assert.deepEqual(r.changes.map(c => c.args[0]), ['one', 'two']);
  r.advance(800); assert.equal(r.graphics().length, 0);
});
test('invalid following commands cancel the entire line before immediate prefix actions', () => {
  for (const director of [false, true]) {
    const r = room({ director, narrator: true }); r.adapter('audio', { 오디오: '' }); r.adapter('image', { 이미지: '' }); r.save();
    r.context.KIBScene.adapters.image.validate = () => ({ ok: false, error: '배경 없음' });
    r.state.narration = [{ as: 'GM', msg: '@오디오 전체중지 @장면전환 슬라이드 @이미지 room|missing' }, { as: 'GM', msg: '출력 금지' }];
    r.state.is_narrating = 2; r.context.narrate(); r.advance(5000);
    assert.equal(r.changes.length, 0); assert.equal(r.graphics().length, 0); assert.equal(r.state.narration.length, 0);
    assert(r.messages.some(m => m.content.includes('배경 없음'))); assert(!r.messages.some(m => m.content === '출력 금지'));
  }
});
test('automatic display cues and disabled modules are not swallowed by inline transitions', () => {
  const r = room({ director: true, narrator: true }); r.adapter('image', { 이미지: '' }); r.adapter('type', { 타자: '' }); r.adapter('cutin', { 컷인: '' }); r.save();
  r.context.KIBScene.isFeatureEnabled = type => type !== 'image';
  const parsed = r.context.ntExtractCues('@장면전환 슬라이드 @이미지 room|ON');
  parsed.cues.push({ type: 'type', args: [], raw: '(automatic)' }, { type: 'cutin', args: ['matched'], raw: '(대사 자동 컷인)' });
  assert.equal(r.context.ntValidateCues(parsed.cues, {}).ok, true);
  r.context.ntRunCues(parsed.cues, {}); assert.deepEqual(r.changes.map(c => c.name), ['type', 'cutin']);
  r.advance(2000); assert.equal(r.changes.length, 2);
});
test('inline commands preserve saved midpoint commands and cancellation removes only pending work', () => {
  const r = room({ narrator: true }); r.adapter('image', { 이미지: '' }); r.save('슬라이드', '@이미지 saved|ON');
  const parsed = r.context.ntExtractCues('@장면전환 슬라이드 @이미지 inline|ON');
  r.context.ntRunCues(parsed.cues, { narrator: true }); r.advance(1200);
  assert.deepEqual(r.changes.map(c => c.args[0]), ['saved', 'inline']); r.advance(800);
  r.context.ntRunCues(parsed.cues, { narrator: true }); r.chat('!/'); r.advance(5000);
  assert.equal(r.changes.length, 2); assert.equal(r.graphics().length, 0);
  assert.equal(r.state.KIBSceneAPNG.transitions.t1.commands, '@이미지 saved|ON');
});
test('inline midpoint failures stop narration and recursive APNG commands fail validation', () => {
  const r = room({ director: true, narrator: true }); r.adapter('image', { 이미지: '' }); r.save();
  const invalid = r.context.ntExtractCues('@장면전환 슬라이드 @APNG 중지');
  assert.equal(r.context.ntValidateCues(invalid.cues, {}).ok, false);
  r.state.narration = [{ as: 'GM', msg: '@장면전환 슬라이드 @이미지 x|ON' }, { as: 'GM', msg: '출력 금지' }];
  r.state.is_narrating = 2; r.context.narrate();
  r.context.KIBScene.adapters.image.cue = () => ({ ok: false, error: '중간 실패' });
  r.context.KIBScene.handlers.image = r.context.KIBScene.adapters.image.cue;
  r.advance(6000); assert.equal(r.state.narration.length, 0); assert.equal(r.graphics().length, 0);
  assert(!r.messages.some(m => m.content === '출력 금지'));
});
test('deferred expression shorthands retain avatar fallback before being queued', () => {
  const r = room({ director: true, narrator: true }); r.adapter('vd', { 비주얼: '' }); r.adapter('avatar', { 아바타: '' }); r.save();
  r.context.KIBScene.adapters.vd.validate = () => ({ ok: false, error: '스탠딩 없음' });
  r.context.KIBScene.adapters.avatar.validate = () => ({ ok: true, targets: { avatar: true } });
  const parsed = r.context.ntExtractCues('@장면전환 슬라이드 @홍길동:웃음');
  assert.equal(r.context.ntValidateCues(parsed.cues, {}).ok, true);
  assert.equal(parsed.cues.at(-1).type, 'avatar');
  r.context.ntRunCues(parsed.cues, {}); assert.equal(r.changes.length, 0);
  r.advance(1200); assert.deepEqual(r.changes.map(c => [c.name, ...c.args]), [['avatar', '홍길동:웃음']]);
});
test('following-cue collection is an optional adapter contract, not an APNG import in 01', () => {
  const r = room({ narrator: true }); r.adapter('gate', { 대기문: '' }); r.adapter('image', { 이미지: '' });
  const gate = r.context.KIBScene.adapters.gate; gate.collectFollowing = () => true;
  gate.cue = (args, context) => { assert.equal(context.followingCues[0].type, 'image'); return { ok: true, waitMs: 100 }; };
  r.context.KIBScene.handlers.gate = gate.cue;
  const parsed = r.context.ntExtractCues('@대기문 x @이미지 room|ON');
  assert.equal(r.context.ntValidateCues(parsed.cues, {}).ok, true);
  assert.equal(r.context.ntRunCues(parsed.cues, {}).waitMs, 100); assert.equal(r.changes.length, 0);
  assert(!source('01_narrator_director.js').includes('KIBSceneAPNG'));
});

test('transition commands use their own namespace while legacy commands share the same saved state', () => {
  const r = room(); r.adapter('image', { 이미지: '' }); r.save('기본');
  for (const command of ['!장면전환', '!장면전환 관리', '!장면전환 설정']) {
    r.chat(command); assert(r.messages.at(-1).content.includes('장면전환 관리'));
    assert.equal(button(r.messages.at(-1).content, '관리 핸드아웃 열기'), 'http://journal.roll20.net/handout/' + r.state.KIBSceneAPNG.managerId);
  }
  for (const command of ['!장면전환 기본', '!장면전환|기본', '!APNG 전환|기본']) {
    r.chat(command); assert.equal(r.graphics()[0].data.name, 'sd_apng:front'); r.advance(2000); assert.equal(r.graphics().length, 0);
  }
  r.chat('!장면전환 명령|t1|@이미지 saved|ON');
  r.chat('!APNG 전환|기본'); r.advance(1200); assert.deepEqual(r.changes.at(-1).args, ['saved', 'ON']); r.advance(800);
  r.chat('!장면전환|기본|-'); r.advance(2000); assert.equal(r.changes.length, 1);
  r.chat('!APNG 재생|id=back|반복'); r.chat('!장면전환|기본'); r.chat('!장면전환|기본'); r.chat('!장면전환 중지'); r.advance(5000);
  assert.equal(r.graphics().length, 1); assert.equal(r.graphics()[0].data.name, 'sd_apng:back'); assert.equal(r.changes.length, 1);
  r.chat('!APNG 중지'); r.chat('!장면전환 삭제|t1'); assert.equal(Object.keys(r.state.KIBSceneAPNG.transitions).length, 0);
});
test('transition namespace retains GM permissions, exact command boundaries and unreserved preset names', () => {
  const r = room(); r.save('toString'); const saved = JSON.stringify(r.state.KIBSceneAPNG.transitions);
  for (const command of ['!장면전환 toString', '!장면전환 중지', '!장면전환 삭제|t1', '!장면전환 저장|새로|무단|id=front|1초|id=back|1초|전체']) r.chat(command, 'player');
  assert.equal(JSON.stringify(r.state.KIBSceneAPNG.transitions), saved); assert.equal(r.graphics().length, 0);
  r.chat('!장면전환삭제|t1'); r.emit('chat:message', { type: 'general', content: '!장면전환 toString', playerid: 'gm' });
  assert.equal(JSON.stringify(r.state.KIBSceneAPNG.transitions), saved); assert.equal(r.graphics().length, 0);
  r.chat('!장면전환 toString'); assert.equal(r.graphics().length, 1); r.chat('!장면전환 중지');
  r.save('중지'); r.chat('!장면전환|중지'); assert.equal(r.graphics().length, 1);
});
test('transition buttons and current help advertise only the transition namespace', () => {
  const r = room({ director: true }); r.save(); r.advance(200);
  const html = r.managerHtml(); const section = html.slice(html.indexOf('>장면전환</div>'));
  assert(section.includes('!장면전환 저장|')); assert(section.includes('!장면전환 중지'));
  assert(!section.includes('!APNG 전환')); assert(!section.includes('@APNG 전환'));
  const help = [...r.objects.values()].find(o => o.type === 'handout' && o.get('name') === '[GM] SceneDirector 사용법').get('notes');
  assert(help.includes('!장면전환|전환명')); assert(!help.includes('!APNG 전환'));
  assert(!source('06_apng_director.js').includes('!APNG 전환'));
  assert(!fs.readFileSync(path.join(root, 'public/assets/app.js'), 'utf8').includes('!APNG 전환'));
});
test('06 alone manages and plays transitions even with its integration switch off', () => {
  const r = room({ apngIntegration: false }); r.save();
  assert.equal(r.context.KIBScene.adapters.apng, undefined); assert.equal(r.state.KIBSceneDirector, undefined); assert.equal(r.state.narration, undefined);
  for (const placement of ['전체', '영역']) {
    r.chat('!장면전환 저장|t1|단독|id=front|1.2초|id=back|0.8초|' + placement);
    r.chat(button(r.managerHtml(), '전환 실행')); assert.equal(r.graphics()[0].data.width, placement === '영역' ? 400 : 1400);
    r.advance(1200); assert.equal(r.graphics()[0].data.name, 'sd_apng:back'); r.advance(800); assert.equal(r.graphics().length, 0);
  }
  r.chat('!APNG 재생|id=front|1회|0.2초'); r.advance(200); assert.equal(r.graphics().length, 0);
});
test('00 and 01 keep working when 06 is not installed', () => {
  for (const options of [{ director: true }, { narrator: true }, { director: true, narrator: true }]) {
    const r = room({ ...options, apng: false }); assert.equal(r.state.KIBSceneAPNG, undefined); assert.equal(r.context.KIBScene.adapters.apng, undefined);
    if (options.narrator) {
      r.state.narration = [{ as: 'GM', msg: '독립 나레이터 출력' }]; r.state.is_narrating = 2; r.context.narrate();
      assert(r.messages.some(m => m.content.startsWith('독립 나레이터 출력'))); assert.equal(r.state.last_narration_error, undefined);
    } else assert([...r.objects.values()].some(o => o.type === 'handout' && o.get('name') === '[GM] SceneDirector 사용법'));
  }
});
test('02 plus 06 can link audio to transitions without 00 or 01', () => {
  const r = room({ modules: ['02_audio_bridge.js'] }); const track = r.object('jukeboxtrack', 'sound', { title: '문 소리', playing: false, volume: 35, loop: false });
  r.save(); r.chat('!APNG 연결|id=front|id=sound'); r.chat('!APNG 재생|id=front|1회');
  assert.equal(track.data.playing, true); r.chat('!APNG 중지'); assert.equal(track.data.playing, false);
  r.chat('!장면전환|슬라이드');
  assert.equal(r.state.KIBSceneDirector, undefined); assert.equal(r.state.narration, undefined);
  assert.equal(track.data.playing, true); assert.equal(r.graphics().length, 1);
  r.chat('!장면전환 중지'); assert.equal(r.graphics().length, 0);
  r.chat('!오디오 중지|id:sound'); assert.equal(track.data.playing, false);
});
test('04 plus 06 changes an image at the midpoint without 00, 01 or 03', () => {
  const r = room({ modules: ['04_image_switcher_compatible.js'] });
  r.object('deck', 'image-deck', { name: 'image_room' });
  r.object('card', 'image-card', { _deckid: 'image-deck', name: 'ON', avatar: 'https://files.d20.io/images/room/thumb.png' });
  const token = r.object('graphic', 'image-token', { _pageid: 'page', name: 'image_room', imgsrc: 'old' });
  r.save(); r.chat('!장면전환|슬라이드|@이미지 image_room|ON'); r.advance(1199); assert.equal(token.data.imgsrc, 'old');
  r.advance(1); assert(token.data.imgsrc.includes('/room/')); r.advance(800); assert.equal(r.graphics().length, 0);
  assert.equal(r.state.KIBSceneDirector, undefined); assert.equal(r.state.narration, undefined); assert.equal(r.context.KIBScene.adapters.vd, undefined);
});

const previewIndex = process.argv.indexOf('--preview');
if (previewIndex >= 0) {
  const r = room(); r.adapter('vd', { 비주얼: '' }); r.save('복도 장면전환', '@비주얼 배경 외부인숙소_2층복도');
  fs.writeFileSync(path.resolve(process.argv[previewIndex + 1]), '<!doctype html><html lang="ko"><meta charset="utf-8"><title>APNG 관리 미리보기</title><body style="margin:24px;max-width:650px;background:#fff">' + r.managerHtml() + '</body></html>');
}
console.log('APNG transitions: ' + count + ' groups passed (mock only, not live Roll20 clicks).');
