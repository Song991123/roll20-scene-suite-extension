const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const handoutFile = path.join(root, 'public', 'scripts', '07_handout_director.js');
const cutinFile = path.join(root, 'public', 'scripts', '08_cutin_director.js');
const avatarFile = path.join(root, 'public', 'scripts', '09_avatar_director.js');
const handoutText = fs.readFileSync(handoutFile, 'utf8');
const cutinText = fs.readFileSync(cutinFile, 'utf8');
const avatarText = fs.readFileSync(avatarFile, 'utf8');

function model(id, values) {
  return {
    id,
    values: { ...values },
    get(key, callback) {
      const value = this.values[key];
      if (callback) callback(value);
      return value;
    },
    set(key, value) {
      if (typeof key === 'object') Object.assign(this.values, key);
      else this.values[key] = value;
    },
    remove() {},
  };
}

function expose(source, expression) {
  return source.replace(
    /\n\}\)\(\);\s*$/,
    `\nKIBScene.__optimizationTest = ${expression};\n})();`,
  );
}

const handlers = {};
let scheduled = 0;
let characterFinds = 0;
const characters = [
  model('c1', { name: '나', controlledby: 'p1' }),
  model('c2', { name: '가', controlledby: 'p2' }),
  model('c3', { name: '무권한', controlledby: '' }),
];
const handouts = {
  h1: model('h1', { name: '첫 자료', inplayerjournals: 'p1' }),
  h2: model('h2', { name: '둘째 자료', inplayerjournals: 'p2' }),
};
const handoutRuntime = {
  KIBScene: { handlers: {}, adapters: {} },
  state: { KIBSceneHandout: { managerId: 'manager', activeFolderId: '__root__' } },
  on(event, callback) { handlers[event] = callback; },
  playerIsGM() { return true; },
  sendChat() {},
  log() {},
  Campaign() {
    return { get() { return JSON.stringify(['h1', 'h2']); } };
  },
  findObjs(query) {
    if (query._type === 'character') {
      characterFinds++;
      return characters;
    }
    return [];
  },
  getObj(type, id) {
    return type === 'handout' ? handouts[id] || null : null;
  },
  createObj() { return null; },
  setTimeout() { scheduled++; return scheduled; },
  clearTimeout() {},
};
vm.createContext(handoutRuntime);
vm.runInContext(
  expose(handoutText, '{ managerHtml: managerHtml, refreshManager: refreshManager }'),
  handoutRuntime,
);

function macro(name) {
  return { get(key) { return key === 'name' ? name : ''; } };
}
handlers['add:macro'](macro('다른 매크로'), {});
assert.strictEqual(scheduled, 0, '관계없는 매크로는 핸드아웃 갱신을 예약하지 않아야 합니다.');
handlers['change:macro:name'](macro('다른 매크로'), { name: '🖊️핸드아웃' });
assert.strictEqual(scheduled, 1, '대상 매크로가 이름 변경으로 빠질 때는 갱신해야 합니다.');
handlers['change:macro:action'](macro('🖊️핸드아웃'), { name: '🖊️핸드아웃' });
assert.strictEqual(scheduled, 2, '대상 매크로 내용 변경은 갱신해야 합니다.');

const managerHtml = handoutRuntime.KIBScene.__optimizationTest.managerHtml();
assert.strictEqual(characterFinds, 1, '한 관리 화면에서 캐릭터 목록은 한 번만 읽어야 합니다.');
assert(managerHtml.includes('<b>보기 권한:</b> 나'));
assert(managerHtml.includes('<b>보기 권한:</b> 가'));

const manager = model('manager', {
  name: '[GM] 핸드아웃 관리',
  inplayerjournals: '',
  controlledby: '',
  archived: false,
  notes: managerHtml,
});
let managerSets = 0;
manager.set = function set(key, value) {
  managerSets++;
  if (typeof key === 'object') Object.assign(this.values, key);
  else this.values[key] = value;
};
handouts.manager = manager;
handoutRuntime.KIBScene.__optimizationTest.refreshManager();
assert.strictEqual(managerSets, 0, '관리 핸드아웃 값이 같으면 set을 생략해야 합니다.');
manager.values.controlledby = 'p1';
handoutRuntime.KIBScene.__optimizationTest.refreshManager();
assert.strictEqual(managerSets, 1, '관리 핸드아웃 값이 다르면 기존처럼 교정해야 합니다.');

function captionFramesOld(value) {
  const characters = Array.from(value);
  return characters.map((_, index) => characters.slice(0, index + 1).join(''));
}

function captionFramesNew(value) {
  const characters = Array.from(value);
  let rendered = '';
  return characters.map((character) => (rendered += character));
}

['한글 caption', '줄1\n줄2', '이모지🙂와 한글'].forEach((sample) =>
  assert.deepStrictEqual(captionFramesNew(sample), captionFramesOld(sample)),
);
assert(!cutinText.includes("characters.slice(0, shown).join('')"));
assert(cutinText.includes('rendered += characters[shown - 1];'));

let deckFinds = 0;
let cardFinds = 0;
let cutinScheduled = 0;
const cutinHandlers = {};
const deck = model('deck1', { name: 'cutin' });
const otherDeck = model('deck2', { name: 'other' });
const card = model('card1', {
  name: '그룹-컷인',
  avatar: 'https://files.d20.io/images/1/thumb.png',
  _deckid: deck.id,
});
const cutinManager = model('cutin-manager', { notes: '', inplayerjournals: '', controlledby: '' });
const cutinRuntime = {
  KIBScene: { handlers: {}, adapters: {} },
  state: {},
  on(event, callback) { cutinHandlers[event] = callback; },
  log() {},
  playerIsGM() { return true; },
  sendChat() {},
  toFront() {},
  toBack() {},
  Campaign() { return { get() { return ''; } }; },
  findObjs(query) {
    if (query._type === 'deck') { deckFinds++; return [deck]; }
    if (query._type === 'card') { cardFinds++; return [card]; }
    if (query._type === 'player') return [model('gm', {})];
    if (query._type === 'macro') return [];
    if (query._type === 'handout') return [];
    return [];
  },
  getObj(type, id) {
    if (type === 'deck' && id === deck.id) return deck;
    if (type === 'deck' && id === otherDeck.id) return otherDeck;
    if (type === 'handout' && id === cutinManager.id) return cutinManager;
    return null;
  },
  createObj(type, values) {
    if (type === 'handout') {
      Object.assign(cutinManager.values, values);
      return cutinManager;
    }
    return model(`new-${type}`, values);
  },
  setTimeout() { cutinScheduled++; return cutinScheduled; },
  clearTimeout() {},
  setInterval() { return 1; },
  clearInterval() {},
};
vm.createContext(cutinRuntime);
vm.runInContext(
  expose(cutinText, '{ cutinRefreshSafe: cutinRefreshSafe, cutinDeckSnapshot: cutinDeckSnapshot, cardManagerHtml: cardManagerHtml }'),
  cutinRuntime,
);

function expectSchedule(handlers, event, readCount, invoke, expected, message) {
  assert.strictEqual(typeof handlers[event], 'function', `${event} 이벤트가 등록되어야 합니다.`);
  invoke(handlers[event]);
  assert.strictEqual(readCount(), expected, message);
}

cutinScheduled = 0;
expectSchedule(
  cutinHandlers,
  'change:card',
  () => cutinScheduled,
  (handler) => handler(model('other-card', { _deckid: otherDeck.id }), { _deckid: otherDeck.id }),
  0,
  '무관 카드 변경은 컷인 갱신을 예약하지 않아야 합니다.',
);
expectSchedule(
  cutinHandlers,
  'change:deck',
  () => cutinScheduled,
  (handler) => handler(otherDeck, { name: 'other-before' }),
  0,
  '무관 덱 변경은 컷인 갱신을 예약하지 않아야 합니다.',
);
expectSchedule(
  cutinHandlers,
  'change:card',
  () => cutinScheduled,
  (handler) => handler(model('target-card', { _deckid: deck.id }), { _deckid: otherDeck.id }),
  1,
  '현재 카드가 cutin 덱에 들어오면 갱신을 예약해야 합니다.',
);
expectSchedule(
  cutinHandlers,
  'change:card',
  () => cutinScheduled,
  (handler) => handler(model('moved-card', { _deckid: otherDeck.id }), { _deckid: deck.id }),
  2,
  '카드가 cutin 덱에서 빠져나가도 이전 덱 기준으로 갱신해야 합니다.',
);
expectSchedule(
  cutinHandlers,
  'change:deck',
  () => cutinScheduled,
  (handler) => handler(otherDeck, { name: 'cutin' }),
  3,
  '덱 이름이 cutin에서 빠져나가면 갱신해야 합니다.',
);
expectSchedule(
  cutinHandlers,
  'change:deck',
  () => cutinScheduled,
  (handler) => handler(deck, { name: 'other' }),
  4,
  '덱 이름이 cutin으로 들어오면 갱신해야 합니다.',
);

cutinRuntime.KIBScene.__optimizationTest.cutinRefreshSafe(true);
assert.strictEqual(deckFinds, 1, '한 번의 컷인 갱신에서 cutin 덱은 한 번만 읽어야 합니다.');
assert.strictEqual(cardFinds, 1, '한 번의 컷인 갱신에서 cutin 카드는 한 번만 읽어야 합니다.');

deckFinds = 0;
cardFinds = 0;
const directHtml = cutinRuntime.KIBScene.__optimizationTest.cardManagerHtml();
const snapshot = cutinRuntime.KIBScene.__optimizationTest.cutinDeckSnapshot();
const snapshotHtml = cutinRuntime.KIBScene.__optimizationTest.cardManagerHtml(snapshot);
assert.strictEqual(snapshotHtml, directHtml, '공유한 카드 목록은 관리 핸드아웃 HTML을 바꾸지 않아야 합니다.');
assert.strictEqual(deckFinds, 2, '직접 생성과 공유 목록 생성은 각각 덱을 한 번만 읽어야 합니다.');
assert.strictEqual(cardFinds, 2, '공유 목록을 넘긴 HTML 생성은 카드를 다시 읽지 않아야 합니다.');

let avatarScheduled = 0;
const avatarHandlers = {};
const avatarDeck = model('avatar-deck', { name: 'avatars' });
const avatarOtherDeck = model('avatar-other-deck', { name: 'other' });
const avatarRuntime = {
  KIBScene: { handlers: {}, adapters: {} },
  state: {},
  on(event, callback) { avatarHandlers[event] = callback; },
  log() {},
  findObjs() { return []; },
  getObj(type, id) {
    if (type === 'deck' && id === avatarDeck.id) return avatarDeck;
    if (type === 'deck' && id === avatarOtherDeck.id) return avatarOtherDeck;
    return null;
  },
  createObj() { return null; },
  playerIsGM() { return true; },
  sendChat() {},
  Campaign() { return { get() { return ''; } }; },
  setTimeout() { avatarScheduled++; return avatarScheduled; },
  clearTimeout() {},
  setInterval() { return 1; },
  clearInterval() {},
};
vm.createContext(avatarRuntime);
vm.runInContext(avatarText, avatarRuntime);

expectSchedule(
  avatarHandlers,
  'change:card',
  () => avatarScheduled,
  (handler) => handler(model('avatar-other', { _deckid: avatarOtherDeck.id }), { _deckid: avatarOtherDeck.id }),
  0,
  '무관 카드 변경은 아바타 갱신을 예약하지 않아야 합니다.',
);
expectSchedule(
  avatarHandlers,
  'change:card',
  () => avatarScheduled,
  (handler) => handler(model('avatar-target', { _deckid: avatarDeck.id }), { _deckid: avatarOtherDeck.id }),
  1,
  '현재 카드가 avatars 덱에 들어오면 갱신을 예약해야 합니다.',
);
expectSchedule(
  avatarHandlers,
  'change:card',
  () => avatarScheduled,
  (handler) => handler(model('avatar-moved', { _deckid: avatarOtherDeck.id }), { _deckid: avatarDeck.id }),
  2,
  '카드가 avatars 덱에서 빠져나가도 이전 덱 기준으로 갱신해야 합니다.',
);
expectSchedule(
  avatarHandlers,
  'destroy:deck',
  () => avatarScheduled,
  (handler) => handler(avatarOtherDeck),
  2,
  '무관 덱 삭제는 아바타 갱신을 예약하지 않아야 합니다.',
);
expectSchedule(
  avatarHandlers,
  'destroy:deck',
  () => avatarScheduled,
  (handler) => handler(avatarDeck),
  3,
  'avatars 덱 삭제는 아바타 갱신을 예약해야 합니다.',
);

console.log('Handout/Cutin optimization check: PASS');
