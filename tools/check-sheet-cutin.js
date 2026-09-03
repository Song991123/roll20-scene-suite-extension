const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/08_cutin_director.js'),
  'utf8',
);

const deferredNoteReads = [];
let deferNoteReads = false;

function roll20Object(type, id, values) {
  const data = { ...values };
  let removed = false;
  return {
    id,
    type,
    get(key, callback) {
      const value = data[key];
      if (typeof callback === 'function' && type === 'handout' && key === 'notes' && deferNoteReads) {
        deferredNoteReads.push(() => callback(value));
        return undefined;
      } else if (typeof callback === 'function') callback(value);
      return value;
    },
    set(key, value) {
      if (typeof key === 'object') Object.assign(data, key);
      else data[key] = value;
    },
    remove() {
      removed = true;
    },
    isRemoved() {
      return removed;
    },
  };
}

const page = roll20Object('page', 'page-1', { name: '테스트', width: 20, height: 12 });
const deck = roll20Object('deck', 'deck-1', { name: 'cutin' });
const exactCard = roll20Object('card', 'card-exact', {
  _deckid: deck.id,
  name: '[400*300] 정확 결과',
  avatar: 'https://files.d20.io/images/101/exact/thumb.png?1',
});
const genericCard = roll20Object('card', 'card-generic', {
  _deckid: deck.id,
  name: '[400*300] 항목 공통 판정',
  avatar: 'https://files.d20.io/images/102/generic/thumb.png?1',
});
const globalExactCard = roll20Object('card', 'card-global-exact', {
  _deckid: deck.id,
  name: '[400*300] 전역 정확 결과',
  avatar: 'https://files.d20.io/images/103/global-exact/thumb.png?1',
});
const globalRollCard = roll20Object('card', 'card-global-roll', {
  _deckid: deck.id,
  name: '[400*300] 전역 공통 판정',
  avatar: 'https://files.d20.io/images/104/global-roll/thumb.png?1',
});
const gm = roll20Object('player', 'gm-1', { _displayname: 'GM' });
const objects = [page, deck, exactCard, genericCard, globalExactCard, globalRollCard, gm];
const events = {};
const created = [];
let nextId = 1;
let nextTimer = 1;

function matches(object, query) {
  const wantedType = query._type || query.type;
  if (wantedType && object.type !== wantedType) return false;
  return Object.keys(query).every((key) => {
    if (key === '_type' || key === 'type') return true;
    return object.get(key) === query[key];
  });
}

const runtime = {
  state: {
    KIBSceneCutin: {
      durations: {
        [exactCard.id]: 2750,
        [genericCard.id]: 3200,
        [globalExactCard.id]: 3600,
        [globalRollCard.id]: 4100,
      },
      overlayImages: {
        [page.id]: 'https://files.d20.io/images/100/overlay/thumb.png?1',
      },
      textRules: {
        [`card:${exactCard.id}`]: ['첫 번째 자동 대사', '둘째 <자동 대사>'],
      },
      sheetRules: {
        'coc7:관찰력|roll': {
          itemKey: 'coc7:관찰력',
          itemLabel: '관찰력',
          outcome: 'roll',
          sourceKey: `card:${genericCard.id}`,
          duration: 4000,
        },
        'coc7:관찰력|success': {
          itemKey: 'coc7:관찰력',
          itemLabel: '관찰력',
          outcome: 'success',
          sourceKey: `card:${exactCard.id}`,
          duration: 4000,
        },
        'coc7:듣기|failure': {
          itemKey: 'coc7:듣기',
          itemLabel: '듣기',
          outcome: 'failure',
          sourceKey: 'card:deleted',
          duration: 2500,
        },
        '*|success': {
          itemKey: '*',
          itemLabel: '모든 판정',
          outcome: 'success',
          sourceKey: `card:${globalExactCard.id}`,
          duration: 4000,
        },
        '*|roll': {
          itemKey: '*',
          itemLabel: '모든 판정',
          outcome: 'roll',
          sourceKey: `card:${globalRollCard.id}`,
          duration: 4000,
        },
        'legacy-source': [
          { template: 'coc', field: 'result', conditions: [{ op: 'eq', value: '1' }] },
        ],
      },
    },
  },
  KIBScene: {
    handlers: {},
    adapters: {
      sheet: {
        cutinItems() {
          return [
            { key: 'coc7:관찰력', label: '관찰력', system: 'coc7', kind: 'field' },
            { key: 'coc7:리볼버', label: '리볼버', system: 'coc7', kind: 'weapon' },
            { key: 'coc7:문열기', label: '문 열기', system: 'coc7', kind: 'spell' },
            { key: 'coc7:철제투구', label: '철제 투구', system: 'coc7', kind: 'armor' },
            { key: 'coc7:자유주사위', label: '자유 주사위', system: 'coc7', kind: 'free' },
            { key: 'coc7:광기실시간', label: '광기 발작 실시간', system: 'coc7', kind: 'madness' },
            { key: 'coc7:광기요약', label: '광기 발작 요약', system: 'coc7', kind: 'madness' },
            { key: 'coc7:명중부위', label: '명중부위', system: 'coc7', kind: 'hit-location' },
            { key: 'sheet:translated', label: '사용자 판정', aliases: ['Custom Check'], system: 'sheet', kind: 'contract' },
            { key: 'sheet:roll%40row', label: '퍼센트 키 판정', system: 'sheet', kind: 'contract' },
            { key: 'sheet:shared-a', label: '공유 판정 A', aliases: ['Shared Old'], system: 'sheet', kind: 'contract' },
            { key: 'sheet:shared-b', label: '공유 판정 B', aliases: ['Shared Old'], system: 'sheet', kind: 'contract' },
          ];
        },
        refresh() {},
      },
    },
    register(name, adapter) {
      this.adapters[name] = adapter;
      if (typeof adapter.cue === 'function') this.handlers[name] = adapter.cue;
    },
    call(name, method, args) {
      const adapter = this.adapters[name];
      return adapter && typeof adapter[method] === 'function'
        ? adapter[method].apply(adapter, args || [])
        : undefined;
    },
    get(_key, fallback) {
      return fallback;
    },
    refreshHandout() {},
  },
  on(name, callback) {
    events[name] = events[name] || [];
    events[name].push(callback);
  },
  findObjs(query) {
    return objects.filter((object) => !object.isRemoved() && matches(object, query));
  },
  getObj(type, id) {
    return objects.find(
      (object) => object.type === type && object.id === id && !object.isRemoved(),
    ) || null;
  },
  createObj(type, values) {
    const object = roll20Object(type, `${type}-${nextId++}`, values);
    objects.push(object);
    created.push(object);
    return object;
  },
  Campaign() {
    return { get: (key) => (key === 'playerpageid' ? page.id : '') };
  },
  playerIsGM(id) {
    return id === gm.id;
  },
  sendChat() {},
  toFront() {},
  setTimeout() {
    return nextTimer++;
  },
  clearTimeout() {},
  setInterval() {
    return nextTimer++;
  },
  clearInterval() {},
  console,
};

vm.createContext(runtime);
vm.runInContext(source, runtime, { filename: '08_cutin_director.js' });
(events.ready || []).forEach((callback) => callback());

const adapter = runtime.KIBScene.adapters.cutin;
if (!adapter || !adapter.events || typeof adapter.events['sheet:result'] !== 'function') {
  throw new Error('08 컷인 adapter의 sheet:result listener를 찾지 못했습니다.');
}

const originalCue = adapter.cue;
const cueCalls = [];
adapter.cue = function checkedCue(args, context) {
  cueCalls.push({ args, context });
  return originalCue.call(adapter, args, context);
};
runtime.KIBScene.handlers.cutin = adapter.cue;

const failures = [];
function check(name, condition, detail) {
  if (condition) {
    console.log(`PASS ${name}`);
    return;
  }
  failures.push(`${name}: ${detail}`);
  console.error(`FAIL ${name}: ${detail}`);
}

function activeGraphic() {
  return runtime.getObj('graphic', runtime.state.KIBSceneCutin.activeGraphicId);
}

function graphicCount() {
  return created.filter((object) => object.type === 'graphic').length;
}

function countText(value, wanted) {
  return String(value || '').split(wanted).length - 1;
}

function buttonCommand(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = String(html || '').match(new RegExp('<a href="([^"]+)"[^>]*>' + escaped + '</a>'));
  return match ? match[1] : '';
}

function ruleUnbindCommand(html, itemKey, outcome) {
  const links = String(html || '').matchAll(/<a href="([^"]+)"/g);
  for (const link of links) {
    const command = link[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    const match = command.match(/^!컷인 시트연결해제\|([^|]+)\|([^|]+)$/);
    if (match && decodeSheetCommandKey(match[1]) === itemKey && match[2] === outcome) return command;
  }
  return '';
}

function decodeSheetCommandKey(value) {
  if (value === '*' || !/^k(?:[0-9a-f]{4})+$/i.test(value)) return value;
  let decoded = '';
  for (let index = 1; index < value.length; index += 4)
    decoded += String.fromCharCode(parseInt(value.slice(index, index + 4), 16));
  return decoded;
}

function ruleUnbindCount(html, itemKey, outcome) {
  let count = 0;
  const links = String(html || '').matchAll(/<a href="([^"]+)"/g);
  for (const link of links) {
    const command = link[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    const match = command.match(/^!컷인 시트연결해제\|([^|]+)\|([^|]+)$/);
    if (match && decodeSheetCommandKey(match[1]) === itemKey && match[2] === outcome) count += 1;
  }
  return count;
}

const manager = runtime.findObjs({ _type: 'handout', name: '[GM] 컷인 관리' })[0];
const initialManagerNotes = manager && manager.get('notes');
const globalSheetControls = adapter.sheetControls();

check(
  '구형 배열형 판정 규칙을 별도 상태로 보존',
  !Array.isArray(runtime.state.KIBSceneCutin.sheetRules['legacy-source']) &&
    runtime.state.KIBSceneCutin.legacySheetRules &&
    JSON.stringify(runtime.state.KIBSceneCutin.legacySheetRules['legacy-source']) ===
      JSON.stringify([{ template: 'coc', field: 'result', conditions: [{ op: 'eq', value: '1' }] }]),
  '배열형 sheetRules가 legacySheetRules로 그대로 이동되지 않았습니다.',
);
check(
  '구형 상태가 있어도 관리 화면에 잘못된 값 없음',
  initialManagerNotes &&
    !initialManagerNotes.includes('undefined') &&
    !initialManagerNotes.includes('NaN'),
  '관리 핸드아웃에 undefined 또는 NaN이 출력됐습니다.',
);

check(
  '전역 판정 목록은 추가 없이 기존 연결 해제만 제공',
  !globalSheetControls.includes(' 시트연결|') &&
    globalSheetControls.includes(' 시트연결해제|') &&
    globalSheetControls.includes('삭제된 컷인'),
  '전역 sheetControls에 연결 추가가 남았거나 기존/삭제 원본 해제 경로가 없습니다.',
);
check(
  '기본 판정 연결은 항목 질문 없이 전역 결과에 연결',
  buttonCommand(initialManagerNotes, '판정 연결').includes('시트연결|*|') &&
    !buttonCommand(initialManagerNotes, '판정 연결').includes('?{판정 항목') &&
    !buttonCommand(initialManagerNotes, '판정 연결').includes('표시 시간'),
  '기본 판정 연결이 전역 * 규칙을 쓰지 않거나 판정 항목을 묻습니다.',
);
check(
  '특정 판정 연결만 모든 실행 항목을 질문',
  buttonCommand(initialManagerNotes, '특정 판정 연결').includes('?{판정 항목') &&
    ['관찰력', '리볼버', '문 열기', '철제 투구', '자유 주사위', '광기 발작 실시간', '광기 발작 요약', '명중부위', '퍼센트 키 판정']
      .every((label) => buttonCommand(initialManagerNotes, '특정 판정 연결').includes(label)),
  '특정 판정 연결 선택지에 시트 헬퍼의 전체 실행 항목이 없습니다.',
);
check(
  '카드 행에 현재 판정 연결과 해제 표시',
  ruleUnbindCount(initialManagerNotes, 'coc7:관찰력', 'success') === 2 &&
    ruleUnbindCount(initialManagerNotes, 'coc7:관찰력', 'roll') === 2,
  '기존 연결이 전역 호환 목록과 해당 카드 행 양쪽에 표시되지 않았습니다.',
);
check(
  '등록 대사 전체 미리보기',
  initialManagerNotes &&
    initialManagerNotes.includes('첫 번째 자동 대사') &&
    initialManagerNotes.includes('둘째 &lt;자동 대사&gt;'),
  '카드 행이 등록 대사 전체 또는 HTML 이스케이프된 미리보기를 표시하지 않습니다.',
);
check(
  '공용 재생 버튼은 저장된 카드 시간 사용',
  !initialManagerNotes.includes('표시 시간|4초') &&
    !initialManagerNotes.includes('|4초'),
  '관리 핸드아웃 재생 버튼이 4초를 강제합니다.',
);
const cutinMacro = runtime.findObjs({ _type: 'macro' })[0];
check(
  '컷인 매크로는 저장된 카드 시간 사용',
  cutinMacro && !String(cutinMacro.get('action') || '').includes('표시 시간|4초'),
  '공용 컷인 매크로가 4초를 강제합니다.',
);

const listener = adapter.events['sheet:result'];
const basePayload = {
  system: 'coc7',
  kind: 'check',
  cutinKey: 'coc7:관찰력',
  label: '관찰력',
  secret: false,
};

listener({ ...basePayload, outcome: 'success' });
check(
  '항목 정확 결과가 가장 먼저 적용',
  activeGraphic() && activeGraphic().get('imgsrc') === exactCard.get('avatar'),
  '항목 정확 결과 카드가 선택되지 않았습니다.',
);
check(
  '기존 show 경로가 활성 컷인을 생성',
  activeGraphic() && activeGraphic().get('name') === `sd_cutin:card:${exactCard.id}`,
  '활성 컷인 graphic이 생성되지 않았습니다.',
);
check(
  'sheet:result가 공개 adapter.cue 경유',
  cueCalls.length === 1 && cueCalls[0].context && cueCalls[0].context.source === 'sheet' &&
    cueCalls[0].args.length === 1,
  'sheet listener가 adapter.cue를 거치지 않고 내부 parsePlay/show를 직접 호출합니다.',
);
const storedDurationPlay = adapter.cue([`id:${exactCard.id}`], {});
check(
  '카드 컷인의 저장 재생시간 자동 사용',
  storedDurationPlay.ok && storedDurationPlay.duration === 2750,
  '명시 시간이 없을 때 카드에 저장된 2.75초를 사용하지 않습니다.',
);

delete runtime.state.KIBSceneCutin.sheetRules['coc7:관찰력|success'];
listener({ ...basePayload, outcome: 'success' });
check(
  '항목 공통 판정이 전역 정확 결과보다 우선',
  activeGraphic() && activeGraphic().get('imgsrc') === genericCard.get('avatar'),
  '항목 roll 대신 전역 success가 선택되었습니다.',
);

delete runtime.state.KIBSceneCutin.sheetRules['coc7:관찰력|roll'];
listener({ ...basePayload, outcome: 'success' });
check(
  '전역 정확 결과가 전역 공통 판정보다 우선',
  activeGraphic() && activeGraphic().get('imgsrc') === globalExactCard.get('avatar'),
  '전역 success 대신 전역 roll이 선택되었습니다.',
);

listener({ ...basePayload, outcome: 'failure' });
check(
  '정확 결과가 없으면 전역 공통 판정 사용',
  activeGraphic() && activeGraphic().get('imgsrc') === globalRollCard.get('avatar'),
  '전역 roll 카드가 선택되지 않았습니다.',
);

const beforeSecretGraphics = graphicCount();
const beforeSecretCueCalls = cueCalls.length;
listener({ ...basePayload, outcome: 'success', secret: true });
check(
  '비밀 판정은 컷인을 표시하지 않음',
  graphicCount() === beforeSecretGraphics && cueCalls.length === beforeSecretCueCalls,
  'secret 결과가 adapter.cue 또는 show를 실행했습니다.',
);

runtime.state.KIBSceneCutin.sheetRules['contractoldhash:alien|success'] = {
  itemKey: 'contractoldhash:alien', itemLabel: 'Alien', outcome: 'success',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
listener({ ...basePayload, cutinKey: 'sheet:alien', label: 'Alien', outcome: 'success' });
check(
  '구형 해시 규칙은 표시명만으로 자동 이전하지 않음',
  activeGraphic() && activeGraphic().get('imgsrc') === globalExactCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['contractoldhash:alien|success'] &&
    !runtime.state.KIBSceneCutin.sheetRules['sheet:alien|success'],
  '현재 항목이라는 증거 없이 구형 규칙을 이전하거나 삭제했습니다.',
);
runtime.state.KIBSceneCutin.sheetRules['contractnewhash:alien|success'] = {
  itemKey: 'contractnewhash:alien', itemLabel: 'Alien old', outcome: 'success',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
runtime.state.KIBSceneCutin.sheetRules['sheet:alien|success'] = {
  itemKey: 'sheet:alien', itemLabel: 'Alien new', outcome: 'success',
  sourceKey: `card:${globalExactCard.id}`, duration: 4000,
};
listener({ ...basePayload, cutinKey: 'sheet:alien', label: 'Alien', outcome: 'success' });
check(
  '새 안정 키가 남은 구형 키보다 우선',
  activeGraphic() && activeGraphic().get('imgsrc') === globalExactCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['contractoldhash:alien|success'] &&
    runtime.state.KIBSceneCutin.sheetRules['contractnewhash:alien|success'],
  '새 연결이 있는데 구형 해시 연결을 다시 가져오면 안 됩니다.',
);
runtime.state.KIBSceneCutin.sheetRules['sheet:Custom%20Check|hard'] = {
  itemKey: 'sheet:Custom%20Check', itemLabel: 'Custom Check', outcome: 'hard',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
listener({
  ...basePayload,
  cutinKey: 'sheet:translated',
  label: '사용자 판정',
  aliases: ['Custom Check'],
  outcome: 'hard',
});
check(
  '번역 전 label 규칙은 alias만으로 자동 이전하지 않음',
  activeGraphic() && activeGraphic().get('imgsrc') === globalRollCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:Custom%20Check|hard'] &&
    !runtime.state.KIBSceneCutin.sheetRules['sheet:translated|hard'],
  '번역 전 표시명이 alias와 같다는 이유로 구형 규칙을 이전하거나 삭제했습니다.',
);
runtime.state.KIBSceneCutin.sheetRules['sheet:translated|hard'] = {
  itemKey: 'sheet:translated', itemLabel: '사용자 판정', outcome: 'hard',
  sourceKey: `card:${globalExactCard.id}`, duration: 4000,
};
runtime.state.KIBSceneCutin.sheetRules['sheet:Custom%20Check|hard'] = {
  itemKey: 'sheet:Custom%20Check', itemLabel: 'Custom Check', outcome: 'hard',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
runtime.state.KIBSceneCutin.sheetRules['contractduplicate:Custom%20Check|hard'] = {
  itemKey: 'contractduplicate:Custom%20Check', itemLabel: 'Custom Check', outcome: 'hard',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
runtime.state.KIBSceneCutin.sheetRules['contract-absent:Custom%20Check|hard'] = {
  itemKey: 'contract-absent:Custom%20Check', itemLabel: 'Custom Check', outcome: 'hard',
  sourceKey: `card:${genericCard.id}`, duration: 2500,
};
runtime.state.KIBSceneCutin.sheetRules['sheet:shared-a|hard'] = {
  itemKey: 'sheet:shared-a', itemLabel: '공유 판정 A', outcome: 'hard',
  sourceKey: `card:${genericCard.id}`, duration: 4000,
};
const translatedUnbindCommand = ruleUnbindCommand(
  adapter.sheetControls(),
  'sheet:translated',
  'hard',
);
check(
  '관리 화면의 실제 특정 판정 해제 버튼 명령',
  translatedUnbindCommand.startsWith('!컷인 시트연결해제|k') &&
    !translatedUnbindCommand.includes('%') &&
    translatedUnbindCommand.endsWith('|hard'),
  '표시된 해제 버튼이 Roll20이 보존할 수 있는 명령키를 전달하지 않습니다.',
);
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: translatedUnbindCommand,
}));
check(
  '현재 exact 연결만 해제하고 구형·다른 시트 규칙은 보존',
  !runtime.state.KIBSceneCutin.sheetRules['sheet:translated|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:Custom%20Check|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['contractduplicate:Custom%20Check|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['contract-absent:Custom%20Check|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:shared-a|hard'],
  '해제 대상 exact 키 외의 구형 또는 현재 목록에 없는 시트 규칙이 삭제되었습니다.',
);
check(
  '특정 판정 해제 뒤 관리 화면에서도 즉시 제거',
  !ruleUnbindCommand(manager.get('notes'), 'sheet:translated', 'hard'),
  'state에서 삭제한 특정 판정 연결이 관리 핸드아웃 갱신 중 다시 나타났습니다.',
);
const percentBindToken = (buttonCommand(initialManagerNotes, '특정 판정 연결')
  .match(/퍼센트 키 판정,(k[0-9a-f]+)/i) || [])[1];
check(
  '퍼센트가 든 판정키도 Roll20 안전 명령으로 연결',
  /^k(?:[0-9a-f]{4})+$/i.test(percentBindToken || '') &&
    !/[ %|,{}?]/.test(percentBindToken || ''),
  '특정 판정 연결 선택지에 Roll20이 제거할 수 있는 문자가 남았습니다.',
);
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api', playerid: gm.id,
  content: `!컷인 시트연결|${percentBindToken}|hard|card:${exactCard.id}`,
}));
runtime.state.KIBSceneCutin.sheetRules['sheet:roll%40row2|hard'] = {
  itemKey: 'sheet:roll%40row2', itemLabel: '이웃 판정', outcome: 'hard',
  sourceKey: `card:${genericCard.id}`,
};
const percentUnbindCommand = ruleUnbindCommand(adapter.sheetControls(), 'sheet:roll%40row', 'hard');
check(
  '퍼센트가 든 판정키도 Roll20 안전 명령으로 해제',
  /^!컷인 시트연결해제\|k(?:[0-9a-f]{4})+\|hard$/i.test(percentUnbindCommand || ''),
  'encodeURIComponent 판정키의 %가 해제 href에 그대로 남았습니다.',
);
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api', playerid: gm.id, content: percentUnbindCommand,
}));
check(
  '안전 명령키를 원래 판정키로 복원해 정확히 삭제',
  !runtime.state.KIBSceneCutin.sheetRules['sheet:roll%40row|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:roll%40row2|hard'],
  '안전 명령키가 기존 state 키로 복원되지 않았습니다.',
);
delete runtime.state.KIBSceneCutin.sheetRules['sheet:roll%40row2|hard'];

deferNoteReads = true;
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api', playerid: gm.id, content: '!컷인 관리',
}));
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api', playerid: gm.id,
  content: `!컷인 시트연결|*|failure|card:${genericCard.id}`,
}));
deferNoteReads = false;
check(
  '비동기 관리 갱신 두 건을 수집',
  deferredNoteReads.length === 2,
  '관리 화면의 이전/최신 notes 읽기를 정확히 두 건 수집하지 못했습니다.',
);
const newestRead = deferredNoteReads.pop();
const staleRead = deferredNoteReads.shift();
if (newestRead) newestRead();
if (staleRead) staleRead();
check(
  '늦게 끝난 이전 관리 갱신이 최신 연결 화면을 덮지 않음',
  manager.get('notes').includes('모든 판정') &&
    manager.get('notes').includes('실패') &&
    runtime.state.KIBSceneCutin.sheetRules['*|failure'],
  '비동기 notes 콜백 역전으로 이전 관리 화면이 다시 저장됐습니다.',
);
delete runtime.state.KIBSceneCutin.sheetRules['*|failure'];
delete runtime.state.KIBSceneCutin.sheetRules['sheet:shared-a|hard'];
runtime.state.KIBSceneCutin.sheetRules['contract-a:Shared%20Old|extreme'] = {
  itemKey: 'contract-a:Shared%20Old', itemLabel: 'Shared Old', outcome: 'extreme',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
runtime.state.KIBSceneCutin.sheetRules['contract-b:Shared%20Old|extreme'] = {
  itemKey: 'contract-b:Shared%20Old', itemLabel: 'Shared Old', outcome: 'extreme',
  sourceKey: `card:${genericCard.id}`, duration: 4000,
};
listener({
  ...basePayload,
  cutinKey: 'sheet:shared-a',
  label: '공유 판정 A',
  aliases: ['Shared Old'],
  outcome: 'extreme',
});
check(
  '모호한 구형 시트 연결은 임의 이전하지 않음',
  activeGraphic() && activeGraphic().get('imgsrc') === globalRollCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['contract-a:Shared%20Old|extreme'] &&
    runtime.state.KIBSceneCutin.sheetRules['contract-b:Shared%20Old|extreme'] &&
    !runtime.state.KIBSceneCutin.sheetRules['sheet:shared-a|extreme'],
  '후보 또는 현재 항목이 모호한 구형 연결을 한 항목에 임의로 옮겼습니다.',
);
runtime.state.KIBSceneCutin.sheetRules['contractoldhash:관찰력|failure'] = {
  itemKey: 'contractoldhash:관찰력', itemLabel: '관찰력', outcome: 'failure',
  sourceKey: `card:${exactCard.id}`, duration: 4000,
};
listener({ ...basePayload, outcome: 'failure' });
check(
  'CoC 고정 키는 구형 시트 키 이전 대상에서 제외',
  activeGraphic() && activeGraphic().get('imgsrc') === globalRollCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['contractoldhash:관찰력|failure'],
  'coc7 연결이 일반 시트의 구형 키를 잘못 가져왔습니다.',
);

(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: `!컷인 시트연결|*|hard|card:${exactCard.id}|3초`,
}));
check(
  '기본 판정 연결은 컷인 자체 시간 사용',
  runtime.state.KIBSceneCutin.sheetRules['*|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['*|hard'].sourceKey === `card:${exactCard.id}` &&
    !Object.prototype.hasOwnProperty.call(runtime.state.KIBSceneCutin.sheetRules['*|hard'], 'duration'),
  '전역 *|outcome 규칙이 저장되지 않았습니다.',
);

(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: `!컷인 시트연결|coc7:관찰력|success|card:${genericCard.id}|3초`,
}));
check(
  '기존 명령과 sheetRules 스키마로 카드 연결 변경',
  runtime.state.KIBSceneCutin.sheetRules['coc7:관찰력|success'].sourceKey === `card:${genericCard.id}` &&
    !Object.prototype.hasOwnProperty.call(runtime.state.KIBSceneCutin.sheetRules['coc7:관찰력|success'], 'duration'),
  '기존 시트연결 명령이 같은 itemKey|outcome 규칙을 갱신하지 못했습니다.',
);

(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: '!컷인 시트연결해제|coc7:듣기|failure',
}));
check(
  '삭제된 원본의 기존 연결도 호환 해제',
  !runtime.state.KIBSceneCutin.sheetRules['coc7:듣기|failure'],
  '전역 호환 목록의 삭제된 원본 규칙을 기존 명령으로 해제하지 못했습니다.',
);

const sheetAdapter = runtime.KIBScene.adapters.sheet;
delete runtime.KIBScene.adapters.sheet;
(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: '!컷인 관리',
}));
const standaloneManagerNotes = manager.get('notes');
check(
  '08 단독 사용 시 시트 연결 UI 숨김',
  !standaloneManagerNotes.includes('판정 컷인') &&
    !standaloneManagerNotes.includes('판정 연결') &&
    !adapter.help.some((line) => line.includes('시트연결')),
  '시트 헬퍼가 없는데 컷인 관리 또는 도움말에 시트 연결 기능이 표시됩니다.',
);
const standalonePlay = adapter.cue([`id:${exactCard.id}`], {});
check(
  '08 단독 사용 시 기존 컷인 재생 유지',
  standalonePlay.ok && standalonePlay.duration === 2750 &&
    activeGraphic() && activeGraphic().get('imgsrc') === exactCard.get('avatar'),
  '시트 헬퍼가 없을 때 일반 카드 컷인 재생이 손상됐습니다.',
);
runtime.KIBScene.adapters.sheet = sheetAdapter;

// 실제 내장 French 2e의 jetGM 원본 설정과 명시 비밀 명령을 구분합니다.
// 10의 공개 실행/채팅 이벤트 경로를 거쳐 같은 08 listener가 그래픽을 만드는지 검사합니다.
const privacyCharacter = roll20Object('character', 'privacy-character', { name: 'Privacy Fixture' });
const privacySetting = roll20Object('attribute', 'privacy-setting', {
  _characterid: privacyCharacter.id, name: 'jetGM', current: '', max: '',
});
objects.push(privacyCharacter, privacySetting, roll20Object('attribute', 'privacy-score', {
  _characterid: privacyCharacter.id, name: 'Chance-of-Success', current: '50', max: '',
}));
const privacySends = [];
const privacyResults = [];
let privacyDefaults = {};
runtime.getSheetDefaultValue = (name) => privacyDefaults[name] ?? '';
runtime.getAttrByName = (characterId, name, type = 'current') => {
  const attribute = runtime.findObjs({ _type: 'attribute', _characterid: characterId, name })[0];
  return attribute ? attribute.get(type) : type === 'current' ? privacyDefaults[name] ?? '' : '';
};
let privacyToken = 0;
runtime.randomInteger = () => ++privacyToken;
runtime.sendChat = (speaker, content) => privacySends.push({ speaker, content });
runtime.KIBScene.broadcast = (event, payload) => {
  if (event !== 'sheet:result') return;
  privacyResults.push(payload);
  listener(payload);
};
vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../public/scripts/10_sheet_helper.js'), 'utf8'),
  runtime, { filename: '10_sheet_helper.js' });
const privacyHelper = runtime.KIBSheetHelper;
const privacySheets = privacyHelper.sheetContracts();
const privacySheet = privacySheets.find((sheet) => sheet.id === 'sheet-982a8cbae9128aea');
const privacyRoll = privacySheet && privacySheet.rolls.find((roll) => roll.name === 'Resistance');
check('비밀 전파 검사도 실제 35개 내장 원본 유지', privacySheets.length === 35 &&
  privacyRoll && privacyRoll.raw.startsWith('@{jetGM}') && privacyRoll.template === 'jets',
'French 2e 원본의 공개/비밀 선택 굴림을 찾지 못했습니다.');
if (privacyRoll) {
  privacyDefaults = Object.fromEntries(privacySheet.fields.filter((field) => !field.section &&
    Object.prototype.hasOwnProperty.call(field, 'default')).map((field) => [field.name, field.default]));
  privacySheet.signature.filter((name) => name !== 'jetGM').forEach((name, index) =>
    objects.push(roll20Object('attribute', 'privacy-source-' + index, {
      _characterid: privacyCharacter.id, name, current: privacyDefaults[name] ?? '', max: '',
    })));
  (events['add:character'] || []).forEach((callback) => callback(privacyCharacter));
  const privacyCases = [
    { name: '공개 원본', nativePrivate: false, explicit: false, expected: false },
    { name: '원본 whisper', nativePrivate: true, explicit: false, expected: true },
    { name: '명시 비밀', nativePrivate: false, explicit: true, expected: true },
    { name: '원본 whisper와 명시 비밀', nativePrivate: true, explicit: true, expected: true },
    { name: '기존 표식의 원본 whisper', nativePrivate: true, explicit: false, expected: true, legacy: true },
    // gmrollresult는 전송 경계 검사이며, jets 원본이 이 메시지 유형을 만든다고 가정하지 않습니다.
    { name: 'gmrollresult 전송', nativePrivate: false, explicit: false, expected: true, type: 'gmrollresult' },
    { name: '공개 이벤트도 명시 비밀 유지', nativePrivate: false, explicit: true, expected: true, type: 'general' },
    { name: '비밀 이후 공개 원본', nativePrivate: false, explicit: false, expected: false },
  ];
  privacyCases.forEach((test) => {
    privacySetting.set('current', test.nativePrivate ? '/w gm ' : '');
    const beforeSends = privacySends.length;
    const beforeResults = privacyResults.length;
    const beforeCues = cueCalls.length;
    const beforeGraphics = graphicCount();
    const sent = privacyHelper.executeContract(privacyCharacter.id, privacySheet.id, privacyRoll.key, '', '', test.explicit);
    const wire = privacySends[beforeSends];
    check(test.name + ' 원본 식 한 번 전송', sent.ok && privacySends.length === beforeSends + 1 &&
      wire && wire.speaker === 'character|' + privacyCharacter.id &&
      /^\s*\/w\s+gm\b/.test(wire.content) === (test.nativePrivate || test.explicit), JSON.stringify(sent));
    if (!sent.ok || !wire) return;
    const inlinerolls = [];
    let content = wire.content.replace(/\[\[([\s\S]*?)\]\]/g, (_whole, expression) => {
      const index = inlinerolls.length;
      inlinerolls.push({ expression, results: { total: expression === '1d100' ? 21 : Number(expression) } });
      return '$[[' + index + ']]';
    });
    if (test.legacy) content = content.replace(/<!--kib_sheet_result=([A-Za-z0-9_-]+)-->/, '{{kib_sheet_result=$1}}');
    const message = { type: test.type || (/^\s*\/w\b/.test(wire.content) ? 'whisper' : 'general'),
      playerid: 'API', who: privacyCharacter.get('name'), content, rolltemplate: 'jets', inlinerolls };
    (events['chat:message'] || []).forEach((callback) => callback(message));
    const result = privacyResults[beforeResults];
    check(test.name + ' 결과 비밀 전파 및 실제 08 컷인', privacyResults.length === beforeResults + 1 &&
      result === sent.payload && result.message === message && result.secret === test.expected &&
      cueCalls.length === beforeCues + (test.expected ? 0 : 1) &&
      (test.expected ? graphicCount() === beforeGraphics : graphicCount() > beforeGraphics),
    JSON.stringify({ messageType: message.type, secret: result && result.secret,
      cues: cueCalls.length - beforeCues, graphics: graphicCount() - beforeGraphics }));
  });
}

if (failures.length) {
  console.error(`\n${failures.length}개 계약 검사 실패`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\nSheet Helper와 Cutin 연결 계약 검사 통과');
}
