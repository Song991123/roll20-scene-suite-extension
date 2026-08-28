const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(
  path.resolve(__dirname, '../public/scripts/08_cutin_director.js'),
  'utf8',
);

function roll20Object(type, id, values) {
  const data = { ...values };
  let removed = false;
  return {
    id,
    type,
    get(key, callback) {
      const value = data[key];
      if (typeof callback === 'function') callback(value);
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
    !buttonCommand(initialManagerNotes, '판정 연결').includes('?{판정 항목'),
  '기본 판정 연결이 전역 * 규칙을 쓰지 않거나 판정 항목을 묻습니다.',
);
check(
  '특정 판정 연결만 모든 실행 항목을 질문',
  buttonCommand(initialManagerNotes, '특정 판정 연결').includes('?{판정 항목') &&
    ['관찰력', '리볼버', '문 열기', '철제 투구', '자유 주사위', '광기 발작 실시간', '광기 발작 요약', '명중부위']
      .every((label) => buttonCommand(initialManagerNotes, '특정 판정 연결').includes(label)),
  '특정 판정 연결 선택지에 시트 헬퍼의 전체 실행 항목이 없습니다.',
);
check(
  '카드 행에 현재 판정 연결과 해제 표시',
  countText(initialManagerNotes, '!컷인 시트연결해제|coc7:관찰력|success') === 2 &&
    countText(initialManagerNotes, '!컷인 시트연결해제|coc7:관찰력|roll') === 2,
  '기존 연결이 전역 호환 목록과 해당 카드 행 양쪽에 표시되지 않았습니다.',
);
check(
  '등록 대사 전체 미리보기',
  initialManagerNotes &&
    initialManagerNotes.includes('첫 번째 자동 대사') &&
    initialManagerNotes.includes('둘째 &lt;자동 대사&gt;'),
  '카드 행이 등록 대사 전체 또는 HTML 이스케이프된 미리보기를 표시하지 않습니다.',
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
  cueCalls.length === 1 && cueCalls[0].context && cueCalls[0].context.source === 'sheet',
  'sheet listener가 adapter.cue를 거치지 않고 내부 parsePlay/show를 직접 호출합니다.',
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
  '구형 해시 기반 시트 연결을 안정 키로 자동 이전',
  activeGraphic() && activeGraphic().get('imgsrc') === exactCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:alien|success'] &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:alien|success'].itemKey === 'sheet:alien' &&
    !runtime.state.KIBSceneCutin.sheetRules['contractoldhash:alien|success'],
  '기존 시트 컷인 연결이 재생되지 않거나 새 안정 키로 이전되지 않았습니다.',
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
  '번역 전 label 기반 시트 연결을 현재 롤 키로 이전',
  activeGraphic() && activeGraphic().get('imgsrc') === exactCard.get('avatar') &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:translated|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['sheet:translated|hard'].itemLabel === '사용자 판정' &&
    !runtime.state.KIBSceneCutin.sheetRules['sheet:Custom%20Check|hard'],
  '이전 표시 이름이 aliases에 있는데도 안정 키로 이전되지 않았습니다.',
);
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
  content: `!컷인 시트연결|*|hard|card:${exactCard.id}|601초`,
}));
check(
  '600초 초과 설정은 저장하지 않음',
  !runtime.state.KIBSceneCutin.sheetRules['*|hard'],
  '실행할 수 없는 표시 시간이 state에 저장됐습니다.',
);

(events['chat:message'] || []).forEach((callback) => callback({
  type: 'api',
  playerid: gm.id,
  content: `!컷인 시트연결|*|hard|card:${exactCard.id}|3초`,
}));
check(
  '기본 판정 연결 명령은 전역 규칙 저장',
  runtime.state.KIBSceneCutin.sheetRules['*|hard'] &&
    runtime.state.KIBSceneCutin.sheetRules['*|hard'].sourceKey === `card:${exactCard.id}` &&
    runtime.state.KIBSceneCutin.sheetRules['*|hard'].duration === 3000,
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
    runtime.state.KIBSceneCutin.sheetRules['coc7:관찰력|success'].duration === 3000,
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

if (failures.length) {
  console.error(`\n${failures.length}개 계약 검사 실패`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('\nSheet Helper와 Cutin 연결 계약 검사 통과');
}
