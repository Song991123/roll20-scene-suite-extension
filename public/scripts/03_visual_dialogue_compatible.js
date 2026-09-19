/*
 * Scene Suite 03 - Visual Dialogue 확장 버전
 * 확장 및 통합: @EOOOOORK
 * 원본: 양천일염 (kibkibe) Visual Dialogue
 * 원본 코드: visual_dialogue.js
 * 원본 라이선스: CC BY-NC (저작자표시-비영리)
 * https://github.com/kibkibe/roll20-api-scripts/tree/master/visual_dialogue
 */

var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};

// ===== 공통 상태 =====
var vd_compat_setting = {
  enabled: true,
};
var vd_expression_refresh_timer = null;
var vd_typewriter_interval = null;
var vd_ratio_warned = {};
var vd_dialogue_box_names = ['vd_dialogue_box', 'vd_deco'];
var vd_cutin_suppressed = {};
var vd_cutin_hidden_texts = {};
var vd_tabletop_front_timers = {};

// ===== 공통 태그 =====
state.api_tag = '<a href="#vd-permitted-api-chat"></a>';
state.vd_explicit_as_tag = '<a href="#vd-explicit-as"></a>';
state.vd_divider = 'ℍ';
state.last_displayed_time = 0;

// ===== 외부 대사 입력 =====
// 채팅 이벤트 없이 패널 대기열에 추가
// type: desc, general, emote
state.VD_INJECT = function (text, type, who, options) {
  var t = type === 'general' || type === 'emote' ? type : 'desc';
  var speaker = String(who || '').trim();
  var opts = options || {};

  if (
    vd_setting.require_as &&
    !speaker &&
    !((t === 'desc' || t === 'emote') && opts.allowNoAs === true)
  )
    return false;
  if (vdIsExcludedAs(speaker)) return false;

  if (!state.vd_stock) state.vd_stock = [];

  var fake = {
    type: t,
    playerid: 'API',
    who: speaker,
    content: String(text || ''),
    sdTypewriter: opts.typewriter === true,
    time: new Date().getTime(),
  };

  state.vd_stock.push(fake);

  if (
    state.vd_stock.length === 1 ||
    (state.vd_stock.length > 1 && state.last_displayed_time + 5000 < fake.time)
  ) {
    setTimeout(vdShowDialogueSafe, 0);
  }
  return true;
};

function vdInitState() {
  var existingConfig =
    state.KIBSceneVD &&
    state.KIBSceneVD.config &&
    typeof state.KIBSceneVD.config == 'object' &&
    !Array.isArray(state.KIBSceneVD.config)
      ? state.KIBSceneVD.config
      : null;
  var migratedPanelMode = null;
  if (existingConfig && existingConfig.dialogue_panel_mode === undefined) {
    migratedPanelMode = vd_dialogue_box_names.some(function (name) {
      return (findObjs({ _type: 'graphic', name: name }) || []).length > 0;
    })
      ? 'split'
      : 'shared';
  }
  state.KIBSceneVD = state.KIBSceneVD || {};
  if (!Array.isArray(state.KIBSceneVD.excludedAs)) {
    state.KIBSceneVD.excludedAs = vdParseNames(vd_setting.excluded_as_list);
  }
  if (
    !state.KIBSceneVD.config ||
    typeof state.KIBSceneVD.config != 'object' ||
    Array.isArray(state.KIBSceneVD.config)
  )
    state.KIBSceneVD.config = {};
  if (migratedPanelMode)
    state.KIBSceneVD.config.dialogue_panel_mode = migratedPanelMode;
  ['name', 'script', 'dialogue'].forEach(function (part) {
    ['enabled', 'color'].forEach(function (field) {
      var key = part + '_stroke_' + field;
      var legacy = 'stroke_' + field;
      if (
        state.KIBSceneVD.config[key] === undefined &&
        state.KIBSceneVD.config[legacy] !== undefined
      )
        state.KIBSceneVD.config[key] = state.KIBSceneVD.config[legacy];
    });
  });
  Object.keys(vd_config_defaults).forEach(function (key) {
    if (state.KIBSceneVD.config[key] === undefined)
      state.KIBSceneVD.config[key] = vd_config_defaults[key];
    vd_setting[key] = state.KIBSceneVD.config[key];
  });
  if (!/^(?:shared|split)$/.test(state.KIBSceneVD.config.dialogue_panel_mode)) {
    state.KIBSceneVD.config.dialogue_panel_mode =
      vd_config_defaults.dialogue_panel_mode;
    vd_setting.dialogue_panel_mode = vd_config_defaults.dialogue_panel_mode;
  }
  if (
    !state.KIBSceneVD.standingRatios ||
    typeof state.KIBSceneVD.standingRatios != 'object' ||
    Array.isArray(state.KIBSceneVD.standingRatios)
  )
    state.KIBSceneVD.standingRatios = {};
  if (
    !state.KIBSceneVD.defaultExpressions ||
    typeof state.KIBSceneVD.defaultExpressions != 'object' ||
    Array.isArray(state.KIBSceneVD.defaultExpressions)
  )
    state.KIBSceneVD.defaultExpressions = {};
  if (
    !state.KIBSceneVD.expressionHandouts ||
    typeof state.KIBSceneVD.expressionHandouts != 'object' ||
    Array.isArray(state.KIBSceneVD.expressionHandouts)
  )
    state.KIBSceneVD.expressionHandouts = {};
  if (
    !state.KIBSceneVD.scriptTexts ||
    typeof state.KIBSceneVD.scriptTexts != 'object' ||
    Array.isArray(state.KIBSceneVD.scriptTexts)
  )
    state.KIBSceneVD.scriptTexts = {};
  if (
    !state.KIBSceneVD.layerOrder ||
    typeof state.KIBSceneVD.layerOrder != 'object' ||
    Array.isArray(state.KIBSceneVD.layerOrder)
  )
    state.KIBSceneVD.layerOrder = { byPage: {} };
  if (
    !state.KIBSceneVD.layerOrder.byPage ||
    typeof state.KIBSceneVD.layerOrder.byPage != 'object' ||
    Array.isArray(state.KIBSceneVD.layerOrder.byPage)
  )
    state.KIBSceneVD.layerOrder.byPage = {};
  Object.keys(state.KIBSceneVD.layerOrder.byPage).forEach(function (pageId) {
    var entry = state.KIBSceneVD.layerOrder.byPage[pageId];
    if (entry.panelPosition !== 'front' && entry.panelPosition !== 'behind')
      entry.panelPosition = 'behind';
    if (entry.decoPosition !== 'front' && entry.decoPosition !== 'behind')
      entry.decoPosition = 'front';
    if (entry.textPosition !== 'front' && entry.textPosition !== 'behind')
      entry.textPosition = 'front';
    // 예전 화면 순서 설정 정리
    if (entry.textPosition == 'behind') {
      entry.panelPosition = 'behind';
      entry.decoPosition = 'behind';
    }
  });
}

function vdParseNames(value) {
  return String(value || '')
    .split(',')
    .map(function (name) {
      return name.trim();
    })
    .filter(function (name) {
      return name.length > 0;
    });
}

function vdNormalizeAs(name) {
  return String(name || '')
    .replace(/ \(GM\)$/, '')
    .trim()
    .toLowerCase();
}

function vdIsExcludedAs(name) {
  vdInitState();
  var normalized = vdNormalizeAs(name);
  return (
    normalized.length > 0 &&
    state.KIBSceneVD.excludedAs.some(function (item) {
      return vdNormalizeAs(item) == normalized;
    })
  );
}

function vdContextSpeaker(context) {
  if (!context || context.explicitAs !== true) return '';
  var as = String(context.as || '').trim();
  if (as.indexOf('character|') === 0) {
    var character = getObj('character', as.substring('character|'.length));
    return character ? String(character.get('name') || '').trim() : '';
  }
  if (as.indexOf('player|') === 0) return '';
  return as;
}

function vdShouldCollectMessage(msg) {
  if (
    !msg ||
    (msg.type != 'general' && msg.type != 'desc' && msg.type != 'emote') ||
    msg.rolltemplate
  )
    return false;
  var content = String(msg.content || '');
  if (msg.playerid == 'API' && content.indexOf(state.api_tag) < 0) return false;
  // GM /desc는 발화자 없이 표시
  if (msg.type == 'desc')
    return msg.playerid == 'API' || playerIsGM(msg.playerid);
  var speaker = String(msg.who || '')
    .replace(/ \(GM\)$/, '')
    .trim();
  if (vdIsExcludedAs(speaker)) return false;
  // /emas " "는 이름 없이 표시
  if (
    msg.type == 'emote' &&
    !speaker &&
    msg.playerid != 'API' &&
    playerIsGM(msg.playerid)
  )
    return true;
  if (!vd_setting.require_as) {
    return (
      !!findCharacterWithName(speaker) ||
      findObjs({ _type: 'player', _displayname: speaker }).length == 0
    );
  }
  if (!speaker) return false;
  if (msg.playerid == 'API')
    return content.indexOf(state.vd_explicit_as_tag) > -1;
  return (
    !!findCharacterWithName(speaker) ||
    findObjs({ _type: 'player', _displayname: speaker }).length == 0
  );
}

function vdHandleExcludeCommand(content) {
  vdInitState();
  var parts = String(content || '').split('|');
  var action = String(parts[1] || '').trim();
  var name = parts.slice(2).join('|').trim();
  var list = state.KIBSceneVD.excludedAs;
  var index = list.findIndex(function (item) {
    return vdNormalizeAs(item) == vdNormalizeAs(name);
  });
  if (action == '추가' && name) {
    if (index < 0) list.push(name);
    return vdWhisperExclude(
      '<b>' +
        vdEscapeHtml(name) +
        '</b> 화자를 비주얼 노벨에서 제외했습니다.',
    );
  }
  if (action == '삭제' && name) {
    if (index < 0)
      return vdWhisperExclude(
        '<b>' + vdEscapeHtml(name) + '</b>은 제외 목록에 없습니다.',
      );
    list.splice(index, 1);
    return vdWhisperExclude(
      '<b>' + vdEscapeHtml(name) + '</b> 화자를 다시 표시합니다.',
    );
  }
  if (action == '목록') {
    return vdWhisperExclude(
      list.length
        ? '<b>숨긴 화자:</b> ' + list.map(vdEscapeHtml).join(', ')
        : '숨긴 화자가 없습니다.',
    );
  }
  if (action == '초기화') {
    state.KIBSceneVD.excludedAs = vdParseNames(vd_setting.excluded_as_list);
    return vdWhisperExclude(
      '숨긴 화자 목록을 초기화했습니다.',
    );
  }
  vdWhisperExclude(
    '사용법: <code>!비주얼 제외|추가|이름</code> / <code>!비주얼 제외|삭제|이름</code> / <code>!비주얼 제외|목록</code> / <code>!비주얼 제외|초기화</code>',
  );
}

function vdWhisperExclude(text) {
  sendChat('비주얼 노벨', '/w gm ' + text, null, { noarchive: true });
}

function vdWhisperProblem(problem, fix, err) {
  var html = '<b>' + vdEscapeHtml(problem) + '</b>';
  if (fix) html += '<br>' + fix;
  if (err)
    html +=
      '<br>오류: ' +
      vdEscapeHtml(err && err.message ? err.message : err) +
      '';
  vdWhisperExclude(html);
}

function vdShowDialogueSafe() {
  try {
    showDialogue();
  } catch (err) {
    vdClearTypewriter();
    state.vd_stock = [];
    vdWhisperProblem(
      '비주얼 노벨을 표시하지 못했습니다.',
      '<code>vd_area</code>, <code>vd_panel</code>, <code>vd_name</code>, <code>vd_dialogue</code> 토큰을 확인하세요.',
      err,
    );
  }
}

function vdUpdateMacroSafe(obj) {
  try {
    updateMacro(obj);
  } catch (err) {
    vdWhisperProblem(
      '장면 매크로를 갱신하지 못했습니다.',
      '<code>background</code> 덱을 확인해 주세요.',
      err,
    );
  }
}

function vdPageName(pageId) {
  var page = pageId ? getObj('page', pageId) : null;
  return page ? String(page.get('name') || '현재 페이지') : '현재 페이지';
}

function vdRefreshHandout() {
  if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
}

function vdCardUsesDeck(obj, prev, deckName) {
  var ids = [obj && obj.get('_deckid'), prev && prev._deckid].filter(Boolean);
  return ids.some(function (id) {
    var deck = getObj('deck', id);
    return deck && deck.get('name') == deckName;
  });
}

function vdHandleCardChange(obj, prev) {
  var standingChanged = vdCardUsesDeck(
    obj,
    prev,
    vd_setting.deck_name,
  );
  var backgroundChanged = vdCardUsesDeck(obj, prev, 'background');
  if (backgroundChanged) vdUpdateMacroSafe(obj);
  if (standingChanged) vdScheduleExpressionHandouts();
  if (standingChanged || backgroundChanged) vdRefreshHandout();
}

function vdHandleDeckChange(obj, prev) {
  var names = [obj && obj.get('name'), prev && prev.name];
  var backgroundChanged = names.indexOf('background') > -1;
  var standingChanged = names.indexOf(vd_setting.deck_name) > -1;
  if (backgroundChanged) setTimeout(vdUpdateMacroSafe, 100);
  if (standingChanged) vdScheduleExpressionHandouts();
  if (standingChanged || backgroundChanged) vdRefreshHandout();
}

function vdPluginStatus() {
  vdInitState();
  var pageId = vdGetCurrentPage();
  var entry = pageId && state.KIBSceneVD.layerOrder.byPage[pageId];
  var layerOrder = '현재 페이지에 등록한 맵시트가 없습니다.';
  if (entry) {
    var sheet = getObj('graphic', entry.sheetId);
    layerOrder =
      '<b>맵시트:</b> ' +
      vdEscapeHtml(sheet ? sheet.get('name') || '이름 없음' : '삭제됨') +
      '<br><b>스크립트창:</b> ' +
      (entry.panelPosition == 'front' ? '앞' : '뒤') +
      '<br><b>대사창:</b> ' +
      (entry.decoPosition == 'front' ? '앞' : '뒤') +
      '<br><b>글자:</b> ' +
      (entry.textPosition == 'front' ? '앞' : '뒤');
  }
  return {
    config: state.KIBSceneVD.config,
    ratioCount: Object.keys(state.KIBSceneVD.standingRatios).length,
    layerOrder: layerOrder,
  };
}

function vdEscapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== 사용자 설정 =====
const vd_setting = {
  // 스탠딩
  max_number: 5,
  width: 415,
  height: 623,
  // contain-top: 비율 유지, 상단 맞춤 / stretch: 지정 크기로 늘이기
  standing_fit: 'contain-top',
  fit_width: 200,
  use_emotion: true,
  show_extra_standing: false,

  // 출력 대상
  require_as: true,
  excluded_as_list: '',
  deck_name: 'standings',
  extra_name: 'extra',
  // 스탠딩 제외 이름, 쉼표 구분
  ignore_list:
    'GM,마을사람1, 마을사람2, 마을사람3, 마을사람, 마을사람4, 마을사람5, 마을사람6, 마을사람7, 마을사람8, 남자, 미래, 이해묵, 연민우, 선우재, 진미재, 유태경, 남다름, 이도형, 이경섭',

  // 페이지와 배경
  page_list: 'conversation,intro',
  background_macro_name: '📹장면',

  // 창 구성: split은 스크립트창과 대사창 분리, shared는 패널 하나
  dialogue_panel_mode: 'split',

  // 글자
  font_family: 'Arial',
  name_font_size: 20,
  name_font_color: '#c0c0c0',
  dialogue_font_size: 18,
  dialogue_font_color: 'rgb(255, 255, 255)',
  desc_font_size: 22,
  desc_font_color: '#c0c0c0',
  stroke_enabled: false,
  stroke_color: '#000000',
  name_stroke_enabled: false,
  name_stroke_color: '#000000',
  script_stroke_enabled: false,
  script_stroke_color: '#000000',
  dialogue_stroke_enabled: false,
  dialogue_stroke_color: '#000000',
  // 양수는 아래, 음수는 위
  desc_offset_y: 0,

  // 출력 시간(ms)
  min_showtime: 400,
  showtime_ratio: 10,

  // 글자 배치 비율
  line_height: 2.0,
  letter_spacing: 0.9,
};
const vd_config_defaults = {
  font_family: vd_setting.font_family,
  name_font_size: vd_setting.name_font_size,
  name_font_color: vd_setting.name_font_color,
  dialogue_font_size: vd_setting.dialogue_font_size,
  dialogue_font_color: vd_setting.dialogue_font_color,
  desc_font_size: vd_setting.desc_font_size,
  desc_font_color: vd_setting.desc_font_color,
  stroke_enabled: vd_setting.stroke_enabled,
  stroke_color: vd_setting.stroke_color,
  name_stroke_enabled: vd_setting.name_stroke_enabled,
  name_stroke_color: vd_setting.name_stroke_color,
  script_stroke_enabled: vd_setting.script_stroke_enabled,
  script_stroke_color: vd_setting.script_stroke_color,
  dialogue_stroke_enabled: vd_setting.dialogue_stroke_enabled,
  dialogue_stroke_color: vd_setting.dialogue_stroke_color,
  desc_offset_y: vd_setting.desc_offset_y,
  dialogue_panel_mode: vd_setting.dialogue_panel_mode,
  line_height: vd_setting.line_height,
  letter_spacing: vd_setting.letter_spacing,
  width: vd_setting.width,
  height: vd_setting.height,
  standing_fit: vd_setting.standing_fit,
  max_number: vd_setting.max_number,
};
const vd_supported_fonts = [
  'Arial',
  'Patrick Hand',
  'Contrail One',
  'Shadows Into Light',
  'Candal',
];

function vdHandleConfigCommand(content) {
  vdInitState();
  var parts = String(content || '')
    .split('|')
    .map(function (part) {
      return part.trim();
    });
  var action = parts[1] || '';
  if (!action || action == '보기') return vdWhisperExclude(vdConfigStatus());
  if (action == '초기화') {
    state.KIBSceneVD.config = Object.assign({}, vd_config_defaults);
    vdInitState();
    showHideDecorations('vd_panel', false);
    showHideDecorations('vd_dialogue_box', false);
    vdApplyStandingLayout();
    vdRefreshHandout();
    return vdWhisperExclude('비주얼 노벨 설정을 초기화했습니다.');
  }
  var keyMap = {
    글꼴: 'font_family',
    이름크기: 'name_font_size',
    이름색: 'name_font_color',
    대사크기: 'dialogue_font_size',
    대사색: 'dialogue_font_color',
    강조크기: 'desc_font_size',
    강조색: 'desc_font_color',
    외곽선: 'stroke_enabled',
    선: 'stroke_enabled',
    외곽선색: 'stroke_color',
    선색: 'stroke_color',
    이름외곽선: 'name_stroke_enabled',
    이름외곽선색: 'name_stroke_color',
    스크립트외곽선: 'script_stroke_enabled',
    스크립트외곽선색: 'script_stroke_color',
    대사외곽선: 'dialogue_stroke_enabled',
    대사외곽선색: 'dialogue_stroke_color',
    강조위치: 'desc_offset_y',
    강조Y: 'desc_offset_y',
    창구성: 'dialogue_panel_mode',
    대사창구성: 'dialogue_panel_mode',
    패널구성: 'dialogue_panel_mode',
    줄간격: 'line_height',
    글자폭: 'letter_spacing',
    스탠딩맞춤: 'standing_fit',
    스탠딩개수: 'max_number',
  };
  if (action == '스탠딩크기') {
    var width = vdPositiveNumber(parts[2], 50, 2000);
    var height = vdPositiveNumber(parts[3], 50, 2000);
    if (!width || !height)
      return vdWhisperExclude(
        '스탠딩 크기는 50~2000 픽셀의 가로와 세로를 모두 입력하세요.',
      );
    state.KIBSceneVD.config.width = width;
    state.KIBSceneVD.config.height = height;
  } else {
    var key = keyMap[action];
    if (!key)
      return vdWhisperExclude(
        '알 수 없는 비주얼 설정입니다: <b>' + vdEscapeHtml(action) + '</b>',
      );
    var value = parts.slice(2).join('|').trim();
    if (key == 'font_family') {
      var font = vd_supported_fonts.filter(function (item) {
        return item.toLowerCase() == value.toLowerCase();
      })[0];
      if (!font)
        return vdWhisperExclude('지원 글꼴: ' + vd_supported_fonts.join(', '));
      value = font;
    } else if (/_font_size$/.test(key)) {
      value = vdPositiveNumber(value, 8, 300);
      if (!value)
        return vdWhisperExclude('글자 크기는 8~300 범위로 입력하세요.');
    } else if (/_font_color$|_stroke_color$/.test(key) || key == 'stroke_color') {
      if (!vdValidColor(value))
        return vdWhisperExclude(
          '색상은 <code>#ffffff</code> 또는 <code>rgb(255,255,255)</code> 형식으로 입력하세요.',
        );
    } else if (key == 'stroke_enabled' || /_stroke_enabled$/.test(key)) {
      var enabled = String(value || '').toLowerCase();
      if (!/^(?:켜기|사용|on|true|1|끄기|미사용|off|false|0)$/.test(enabled))
        return vdWhisperExclude(
          '외곽선은 <b>켜기</b> 또는 <b>끄기</b>로 입력하세요.',
        );
      value = /^(?:켜기|사용|on|true|1)$/.test(enabled);
    } else if (key == 'desc_offset_y') {
      value = Number(value);
      if (!isFinite(value) || value < -2000 || value > 2000)
        return vdWhisperExclude(
          '강조 위치는 -2000~2000 픽셀 범위로 입력하세요. 양수는 아래, 음수는 위입니다.',
        );
    } else if (key == 'dialogue_panel_mode') {
      var mode = String(value || '')
        .toLowerCase()
        .replace(/\s+/g, '');
      value = /^(?:공용|하나|패널하나|shared)$/.test(mode)
        ? 'shared'
        : /^(?:분리|따로|split)$/.test(mode)
          ? 'split'
          : '';
      if (!value)
        return vdWhisperExclude(
          '창 구성은 <b>패널 하나</b> 또는 <b>분리</b>로 입력하세요.',
        );
    } else if (key == 'line_height' || key == 'letter_spacing') {
      value = vdPositiveNumber(value, 0.1, 5);
      if (!value)
        return vdWhisperExclude(action + '은 0.1~5 범위로 입력하세요.');
    } else if (key == 'max_number') {
      value = vdPositiveNumber(value, 1, 20);
      if (!value || value % 1)
        return vdWhisperExclude('스탠딩 개수는 1~20 정수로 입력하세요.');
    } else if (key == 'standing_fit') {
      value =
        value == '늘이기' || value == 'stretch'
          ? 'stretch'
          : value == '상단비율' || value == 'contain-top'
            ? 'contain-top'
            : '';
      if (!value)
        return vdWhisperExclude(
          '스탠딩 맞춤은 <b>상단비율</b>(비율 유지) 또는 <b>늘이기</b>(지정 크기)로 입력하세요.',
        );
    }
    state.KIBSceneVD.config[key] = value;
    if (key == 'stroke_enabled' || key == 'stroke_color')
      ['name', 'script', 'dialogue'].forEach(function (part) {
        state.KIBSceneVD.config[part + '_' + key] = value;
      });
  }
  vdInitState();
  vdTrimStandingCount();
  vdApplyTextStyle();
  vdApplyStandingLayout();
  if (key == 'dialogue_panel_mode') {
    showHideDecorations('vd_panel', false);
    showHideDecorations('vd_dialogue_box', false);
  }
  vdRefreshHandout();
  var shownValue =
    action == '스탠딩크기'
      ? state.KIBSceneVD.config.width + '×' + state.KIBSceneVD.config.height
      : key == 'stroke_enabled' || /_stroke_enabled$/.test(key)
        ? value
          ? '켜기'
          : '끄기'
        : key == 'standing_fit'
          ? value == 'contain-top'
            ? '비율 유지'
            : '지정 크기로 늘이기'
          : key == 'dialogue_panel_mode'
            ? vdPanelModeLabel(value)
            : String(value);
  vdWhisperExclude(
    '<b>' + vdEscapeHtml(action) + ':</b> ' + vdEscapeHtml(shownValue),
  );
}

function vdHandleRatioCommand(content, msg) {
  vdInitState();
  var parts = String(content || '')
    .split('|')
    .map(function (part) {
      return part.trim();
    });
  var action = parts[1] || '목록';
  var ratios = state.KIBSceneVD.standingRatios;
  if (action == '등록') {
    var cards = vdStandingCardsByReference(parts[2]);
    var width = vdPositiveNumber(parts[3], 1, 100000);
    var height = vdPositiveNumber(parts[4], 1, 100000);
    if (cards.length != 1)
      return vdWhisperExclude(
        cards.length
          ? '같은 이름의 스탠딩 카드가 여러 개입니다.'
          : '스탠딩 카드를 찾지 못했습니다: ' + vdEscapeHtml(parts[2]),
      );
    if (!width || !height)
      return vdWhisperExclude('원본 가로와 세로를 양수로 입력하세요.');
    vdStoreRatio(cards[0], width, height);
  } else if (action == '선택등록') {
    var count = vdRegisterSelectedRatios(msg.selected || []);
    if (!count)
      return vdWhisperExclude(
        '선택한 이미지 토큰과 같은 이미지를 쓰는 <b>' +
          vdEscapeHtml(vd_setting.deck_name) +
          '</b> 카드를 찾지 못했습니다.',
      );
    vdApplyStandingLayout();
    vdRefreshHandout();
    return vdWhisperExclude(
      count + '개 스탠딩 비율을 등록했습니다.',
    );
  } else if (action == '삭제') {
    var removeCards = vdStandingCardsByReference(parts[2]);
    removeCards.forEach(function (card) {
      vdStandingFamilyCards(card).forEach(function (member) {
        delete ratios[member.id];
      });
    });
    vdRefreshHandout();
    return vdWhisperExclude(
      removeCards.length
        ? '같은 캐릭터의 스탠딩 비율을 삭제했습니다: ' + vdEscapeHtml(parts[2])
        : '스탠딩 카드를 찾지 못했습니다.',
    );
  } else if (action == '초기화') {
    state.KIBSceneVD.standingRatios = {};
    vdApplyStandingLayout();
    vdRefreshHandout();
    return vdWhisperExclude('스탠딩 비율을 모두 초기화했습니다.');
  } else if (action == '목록') {
    var rows = Object.keys(ratios).map(function (id) {
      var card = getObj('card', id);
      var item = ratios[id];
      return (
        vdEscapeHtml(card ? card.get('name') : item.name || id) +
        ' = ' +
        item.width +
        ':' +
        item.height
      );
    });
    return vdWhisperExclude(
      rows.length
        ? '<b>등록된 스탠딩 비율</b><br>' + rows.join('<br>')
        : '등록된 스탠딩 비율이 없습니다.',
    );
  } else
    return vdWhisperExclude(
      '사용법: <code>!비주얼 비율|등록|카드명|가로|세로</code> / <code>!비주얼 비율|선택등록</code>',
    );
  vdApplyStandingLayout();
  vdRefreshHandout();
  vdWhisperExclude(
    '<b>' +
      vdEscapeHtml(parts[2]) +
      '</b> 및 같은 캐릭터의 표정 카드 비율을 ' +
      width +
      ':' +
      height +
      '로 등록했습니다.',
  );
}

function vdConfigStatus() {
  var c = state.KIBSceneVD.config;
  return (
    '<b>비주얼 노벨 설정</b><br>창 구성=' +
    vdPanelModeLabel(c.dialogue_panel_mode) +
    '<br>글꼴=' +
    vdEscapeHtml(c.font_family) +
    '<br>이름=' +
    c.name_font_size +
    ' / 대사=' +
    c.dialogue_font_size +
    ' / 강조=' +
    c.desc_font_size +
    '<br>외곽선: 이름=' + vdStrokeStatus(c, 'name') +
    ' / 스크립트=' + vdStrokeStatus(c, 'script') +
    ' / 대사=' + vdStrokeStatus(c, 'dialogue') +
    ' / 강조위치=' +
    (c.desc_offset_y >= 0 ? '+' : '') +
    c.desc_offset_y +
    'px' +
    '<br>스탠딩 최대=' +
    c.width +
    '×' +
    c.height +
    ' / 동시 표시=' +
    c.max_number +
    '명 / 맞춤=' +
    (c.standing_fit == 'contain-top' ? '비율 유지' : '지정 크기로 늘이기')
  );
}

function vdStrokeStatus(config, part) {
  return config[part + '_stroke_enabled']
    ? '켜짐 (' + vdEscapeHtml(config[part + '_stroke_color']) + ')'
    : '꺼짐';
}

function vdPanelModeLabel(mode) {
  return mode == 'shared' ? '패널 하나' : '스크립트창과 대사창 분리';
}

function vdDecorationForMessage(type, mode) {
  return mode == 'shared' || type == 'desc' || type == 'emote'
    ? 'vd_panel'
    : 'vd_dialogue_box';
}

function vdPositiveNumber(value, min, max) {
  var number = Number(value);
  return isFinite(number) && number >= min && number <= max ? number : 0;
}

function vdValidColor(value) {
  if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value)) return true;
  var match = String(value || '').match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i,
  );
  return (
    !!match &&
    Number(match[1]) <= 255 &&
    Number(match[2]) <= 255 &&
    Number(match[3]) <= 255 &&
    (match[4] === undefined || Number(match[4]) <= 1)
  );
}

function vdTextStroke(part) {
  if (!part)
    return vd_setting.stroke_enabled ? vd_setting.stroke_color : 'transparent';
  return vd_setting[part + '_stroke_enabled']
    ? vd_setting[part + '_stroke_color']
    : 'transparent';
}

function vdStandingDeck() {
  return (
    (findObjs({ _type: 'deck', name: vd_setting.deck_name }) || [])[0] || null
  );
}

function vdStandingCardsByName(name) {
  var deck = vdStandingDeck();
  return deck
    ? findObjs({
        _type: 'card',
        _deckid: deck.get('_id'),
        name: String(name || '').trim(),
      }) || []
    : [];
}

function vdStandingCardsByReference(reference) {
  var value = String(reference || '').trim();
  if (value.indexOf('id:') !== 0) return vdStandingCardsByName(value);
  var deck = vdStandingDeck();
  var card = getObj('card', value.substring(3));
  return deck && card && card.get('_deckid') == deck.get('_id') ? [card] : [];
}

function vdStoreRatio(card, width, height) {
  vdStandingFamilyCards(card).forEach(function (member) {
    state.KIBSceneVD.standingRatios[member.id] = {
      ratio: width / height,
      width: width,
      height: height,
      name: String(member.get('name') || ''),
    };
    delete vd_ratio_warned[member.id];
  });
}

function vdStandingFamilyCards(card) {
  var deck = vdStandingDeck();
  if (!deck || !card || card.get('_deckid') != deck.get('_id'))
    return card ? [card] : [];
  var cards = findObjs({ _type: 'card', _deckid: deck.get('_id') }) || [];
  var names = cards.map(function (item) {
    return String(item.get('name') || '');
  });
  var characters = (findObjs({ _type: 'character' }) || []).map(function (item) {
    return String(item.get('name') || '');
  });
  function base(name) {
    var exactOrPrefix = function (candidate) {
      return (
        candidate && (name == candidate || name.indexOf(candidate + '-') === 0)
      );
    };
    var known = characters.filter(exactOrPrefix).sort(function (a, b) {
      return b.length - a.length;
    })[0];
    if (known) return known;
    return (
      names
        .filter(function (candidate) {
          return candidate != name && name.indexOf(candidate + '-') === 0;
        })
        .sort(function (a, b) {
          return a.length - b.length;
        })[0] || name
    );
  }
  var characterName = base(String(card.get('name') || ''));
  return cards.filter(function (item) {
    return base(String(item.get('name') || '')) == characterName;
  });
}

function vdCanonicalImage(url) {
  return String(url || '').replace(
    /\/(?:thumb|med|max|original)(\.[^/?]+)(\?.*)?$/i,
    '/size$1$2',
  );
}

function vdGraphicImage(url) {
  return String(url || '').replace(
    /\/(?:med|max|original)(\.[^/?]+)(\?.*)?$/i,
    '/thumb$1$2',
  );
}

function vdSetChanged(object, values) {
  var callbackOnly = {
    bio: true,
    notes: true,
    gmnotes: true,
    defaulttoken: true,
  };
  var updates = {};
  Object.keys(values).forEach(function (key) {
    if (callbackOnly[key] || object.get(key) !== values[key])
      updates[key] = values[key];
  });
  if (Object.keys(updates).length) object.set(updates);
}

function vdSetBackgroundImage(token, url) {
  var imgsrc = vdGraphicImage(url);
  var animated =
    /\.(?:webm|mp4)(?:\?|$)/i.test(imgsrc) ||
    /\.(?:webm|mp4)(?:\?|$)/i.test(String(token.get('imgsrc') || ''));
  if (!animated) {
    token.set('imgsrc', imgsrc);
    return token;
  }
  var pageId = token.get('_pageid');
  var replacement = createObj('graphic', {
    _pageid: pageId,
    name: token.get('name'),
    imgsrc: imgsrc,
    left: token.get('left'),
    top: token.get('top'),
    width: token.get('width'),
    height: token.get('height'),
    layer: token.get('layer') || 'map',
    rotation: token.get('rotation') || 0,
    flipv: !!token.get('flipv'),
    fliph: !!token.get('fliph'),
    isdrawing: true,
    disableSnapping: true,
    disableTokenMenu: true,
  });
  if (!replacement) return null;
  token.remove();
  var placeLikeApng = function () {
    if (!getObj('graphic', replacement.id)) return;
    if (typeof toFront === 'function') toFront(replacement);
    (
      findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: pageId }) || []
    ).forEach(toFront);
    vdApplyLayerOrder(pageId);
  };
  placeLikeApng();
  setTimeout(placeLikeApng, 100);
  return replacement;
}

function vdRegisterSelectedRatios(selected) {
  var deck = (findObjs({ _type: 'deck', name: vd_setting.deck_name }) || [])[0];
  if (!deck) return 0;
  var cards = findObjs({ _type: 'card', _deckid: deck.get('_id') }) || [];
  var count = 0;
  selected.forEach(function (ref) {
    var token = getObj('graphic', ref._id);
    if (
      !token ||
      !(Number(token.get('width')) > 0) ||
      !(Number(token.get('height')) > 0)
    )
      return;
    var image = vdCanonicalImage(token.get('imgsrc'));
    cards.forEach(function (card) {
      if (vdCanonicalImage(card.get('avatar')) != image) return;
      vdStoreRatio(
        card,
        Number(token.get('width')),
        Number(token.get('height')),
      );
      count++;
    });
  });
  return count;
}

function vdStandingCardsForCharacter(characterName, deckCards) {
  if (!Array.isArray(deckCards)) {
    var deck = vdStandingDeck();
    if (!deck) return [];
    deckCards = findObjs({ _type: 'card', _deckid: deck.get('_id') }) || [];
  }
  var base = String(characterName || '').trim();
  return deckCards
    .filter(function (card) {
      var name = String(card.get('name') || '');
      return (
        !!card.get('avatar') &&
        (name == base ||
          (vd_setting.use_emotion && name.indexOf(base + '-') === 0))
      );
    })
    .sort(function (a, b) {
      var an = String(a.get('name') || '');
      var bn = String(b.get('name') || '');
      if (an == base) return -1;
      if (bn == base) return 1;
      return an < bn ? -1 : an > bn ? 1 : 0;
    });
}

function vdCardBelongsToCharacter(card, characterName) {
  if (!card) return false;
  var deck = vdStandingDeck();
  if (!deck || card.get('_deckid') != deck.get('_id') || !card.get('avatar'))
    return false;
  var name = String(card.get('name') || '');
  var base = String(characterName || '').trim();
  return (
    name == base || (vd_setting.use_emotion && name.indexOf(base + '-') === 0)
  );
}

function vdDefaultStandingCard(character, cards) {
  vdInitState();
  if (!character) return null;
  cards = Array.isArray(cards)
    ? cards
    : vdStandingCardsForCharacter(character.get('name'));
  if (!cards.length) return null;
  var saved = getObj('card', state.KIBSceneVD.defaultExpressions[character.id]);
  if (
    saved &&
    cards.some(function (card) {
      return card.id == saved.id;
    })
  )
    return saved;
  state.KIBSceneVD.defaultExpressions[character.id] = cards[0].id;
  return cards[0];
}

function vdExpressionName(card, characterName) {
  var name = String(card.get('name') || '');
  return name == characterName
    ? '기본'
    : name.substring(characterName.length + 1) || '기본';
}

function vdCanControlCharacter(character, playerId) {
  if (playerIsGM(playerId)) return true;
  var controlled = String(character.get('controlledby') || '')
    .split(',')
    .map(function (id) {
      return id.trim();
    });
  return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
}

function vdWhisperPlayer(msg, text) {
  var player = getObj('player', msg.playerid);
  var who = player
    ? player.get('_displayname')
    : String(msg.who || '').replace(/ \(GM\)$/, '');
  sendChat(
    '비주얼 노벨',
    '/w "' + String(who || 'gm').replace(/"/g, '') + '" ' + text,
    null,
    { noarchive: true },
  );
}

function vdApplyExpressionCard(character, card) {
  vdInitState();
  state.KIBSceneVD.defaultExpressions[character.id] = card.id;
  var token = findTokenWithCharacter(character.id, character.get('name'));
  if (token) {
    var size = vdStandingSize(card, character.get('name'), token);
    token.set({
      imgsrc: vdGraphicImage(card.get('avatar')),
      width: size.width,
      height: size.height,
      top: vdStandingTop(token.get('_pageid'), size.height),
      bar2_value: card.id,
    });
  }
  vdScheduleExpressionHandouts();
  return token;
}

function vdHandleInlineExpression(msg) {
  if (
    !msg ||
    msg.playerid == 'API' ||
    (msg.type != 'general' && msg.type != 'emote')
  )
    return false;
  var content = String(msg.kibSceneOriginalContent || msg.content || '');
  var match = content.match(/(?:^|\s)@([^\s@|{}]+)\s*$/);
  if (!match) return false;
  var speaker = String(msg.who || '')
    .replace(/ \(GM\)$/, '')
    .trim();
  var character = findCharacterWithName(speaker);
  if (!character) return false;

  msg.kibSceneOriginalContent = content;
  msg.content = content.substring(0, match.index).replace(/\s+$/, '');
  if (!vdCanControlCharacter(character, msg.playerid)) {
    vdWhisperPlayer(msg, '이 캐릭터의 표정을 변경할 권한이 없습니다.');
    return true;
  }
  var emotion = match[1];
  var cardName =
    emotion == '기본' || emotion.toLowerCase() == 'default'
      ? speaker
      : speaker + '-' + emotion;
  var card = vdStandingCardsForCharacter(speaker).filter(function (item) {
    return item.get('name') == cardName;
  })[0];
  if (!card) {
    vdWhisperPlayer(
      msg,
      '<b>' + vdEscapeHtml(cardName) + '</b> 표정 카드를 찾지 못했습니다.',
    );
    return true;
  }
  vdApplyExpressionCard(character, card);
  return true;
}

function vdHandleHiddenExpressionChat(msg) {
  if (
    !msg ||
    msg.type != 'api' ||
    String(msg.content || '').indexOf('!대사 ') !== 0
  )
    return false;
  var speaker = String(msg.who || '')
    .replace(/ \(GM\)$/, '')
    .trim();
  var character = findCharacterWithName(speaker);
  if (!character) {
    vdWhisperPlayer(
      msg,
      '<code>!대사</code>는 채팅 화자를 캐릭터로 선택한 뒤 사용하세요.',
    );
    return true;
  }
  if (!vdCanControlCharacter(character, msg.playerid)) {
    vdWhisperPlayer(msg, '이 캐릭터로 대사를 보낼 권한이 없습니다.');
    return true;
  }
  var forwarded = {
    type: 'general',
    playerid: msg.playerid,
    who: speaker,
    content: String(msg.content).substring('!대사 '.length),
  };
  vdHandleInlineExpression(forwarded);
  if (forwarded.content.trim() && !msg.kibSceneHiddenSent) {
    sendChat(
      'character|' + character.id,
      forwarded.content + state.api_tag + state.vd_explicit_as_tag,
    );
    msg.kibSceneHiddenSent = true;
  }
  return true;
}

function vdHandleExpressionCommand(msg) {
  vdInitState();
  var parts = String(msg.content || '').split('|');
  var character = getObj('character', String(parts[1] || '').trim());
  var card = getObj('card', String(parts[2] || '').trim());
  if (
    !character ||
    !card ||
    !vdCardBelongsToCharacter(card, character.get('name'))
  ) {
    return vdWhisperPlayer(
      msg,
      '표정 카드 또는 캐릭터가 없습니다.',
    );
  }
  if (!vdCanControlCharacter(character, msg.playerid))
    return vdWhisperPlayer(msg, '이 캐릭터의 표정을 변경할 권한이 없습니다.');
  var token = vdApplyExpressionCard(character, card);
  vdWhisperPlayer(
    msg,
    '<b>' +
      vdEscapeHtml(character.get('name')) +
      ' 기본 표정:</b> ' +
      vdEscapeHtml(vdExpressionName(card, character.get('name'))),
  );
}

function vdScheduleExpressionHandouts() {
  if (vd_expression_refresh_timer) clearTimeout(vd_expression_refresh_timer);
  vd_expression_refresh_timer = setTimeout(function () {
    vd_expression_refresh_timer = null;
    vdUpdateExpressionHandouts();
    vdPruneUnregisteredStandings();
  }, 100);
}

function vdUpdateExpressionHandouts() {
  if (typeof createObj !== 'function') return;
  vdInitState();
  var characters = findObjs({ _type: 'character' }) || [];
  var deck = vdStandingDeck();
  var deckCards = deck
    ? findObjs({ _type: 'card', _deckid: deck.get('_id') }) || []
    : [];
  var active = {};
  characters.forEach(function (character) {
    var cards = vdStandingCardsForCharacter(character.get('name'), deckCards);
    if (!cards.length) return;
    active[character.id] = true;
    var handoutId = state.KIBSceneVD.expressionHandouts[character.id];
    var name = '🎭 스탠딩｜' + character.get('name');
    var handout = handoutId && getObj('handout', handoutId);
    if (!handout)
      handout = (findObjs({ _type: 'handout', name: name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: name,
        inplayerjournals: String(character.get('controlledby') || ''),
        controlledby: '',
        archived: false,
      });
    state.KIBSceneVD.expressionHandouts[character.id] = handout.id;
    var selected = vdDefaultStandingCard(character, cards);
    var cells = cards
      .map(function (card) {
        var expression = vdExpressionName(card, character.get('name'));
        var image = vdEscapeHtml(card.get('avatar'));
        var label =
          selected && selected.id == card.id ? '✓ ' + expression : expression;
        return (
          '<div style="display:inline-block;width:150px;vertical-align:top;text-align:center;margin:4px;padding:6px;border:' +
          (selected && selected.id == card.id ? '2px solid #111' : '1px solid #bbb') +
          ';background:#fff;color:#111">' +
          '<img src="' +
          image +
          '" style="max-width:138px;max-height:180px"><br>' +
          '<a href="!비주얼 표정|' +
          character.id +
          '|' +
          card.id +
          '" style="display:inline-block;margin-top:5px;padding:4px 8px;background:#4d617a;color:#fff;text-decoration:none">' +
          vdEscapeHtml(label) +
          '</a></div>'
        );
      })
      .join('');
    vdSetChanged(handout, {
      name: name,
      avatar: selected ? selected.get('avatar') : '',
      inplayerjournals: String(character.get('controlledby') || ''),
      controlledby: '',
      archived: false,
      notes:
        '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:9px;background:#111;color:#fff;font-size:17px;font-weight:bold">' +
        vdEscapeHtml(character.get('name')) +
        ' 표정</div><div style="padding:8px"><div style="margin:0 4px 6px"><b>현재 표정:</b> ' +
        vdEscapeHtml(
          selected ? vdExpressionName(selected, character.get('name')) : '없음',
        ) +
        '</div>' +
        cells +
        '</div></div>',
    });
  });
  Object.keys(state.KIBSceneVD.expressionHandouts).forEach(
    function (characterId) {
      if (active[characterId]) return;
      var stale = getObj(
        'handout',
        state.KIBSceneVD.expressionHandouts[characterId],
      );
      if (stale)
        vdSetChanged(stale, {
          archived: true,
          inplayerjournals: '',
          controlledby: '',
        });
    },
  );
}

function vdPruneUnregisteredStandings() {
  var removed = false;
  (findObjs({ _type: 'graphic', name: 'vd_standing' }) || []).forEach(
    function (token) {
      var character = findCharacterWithName(token.get('bar1_value'));
      var currentCard = vdStandingCardByImage(token.get('imgsrc'));
      if (
        character &&
        vdCardBelongsToCharacter(currentCard, character.get('name'))
      ) {
        var currentSize = vdStandingSize(currentCard, character.get('name'));
        if (currentSize) {
          vdSetChanged(token, {
            width: currentSize.width,
            height: currentSize.height,
            top: vdStandingTop(token.get('_pageid'), currentSize.height),
          });
          return;
        }
        token.remove();
        removed = true;
        vdWarnMissingRatio(currentCard);
        return;
      }
      var replacement = vdDefaultStandingCard(character);
      if (!replacement) {
        token.remove();
        removed = true;
        return;
      }
      var size = vdStandingSize(replacement, character.get('name'));
      if (!size) {
        token.remove();
        removed = true;
        vdWarnMissingRatio(replacement);
        return;
      }
      vdSetChanged(token, {
        imgsrc: vdGraphicImage(replacement.get('avatar')),
        width: size.width,
        height: size.height,
        top: vdStandingTop(token.get('_pageid'), size.height),
        bar2_value: replacement.id,
      });
    },
  );
  if (removed) arrangeStandings(false);
}

function vdTrimStandingCount() {
  var pageId = vdGetCurrentPage();
  if (!pageId) return;
  var tokens =
    findObjs({ _type: 'graphic', name: 'vd_standing', _pageid: pageId }) || [];
  tokens.sort(function (a, b) {
    return (Number(a.get('gmnotes')) || 0) - (Number(b.get('gmnotes')) || 0);
  });
  while (tokens.length > vd_setting.max_number) tokens.shift().remove();
  arrangeStandings(false);
}

on('ready', function () {
  // ===== 초기화 =====
  state.vd_stock = [];
  vdInitState();
  (
    findObjs({ _type: 'graphic', name: '__vd_background_preloading__' }) || []
  ).forEach(function (token) {
    token.remove();
  });
  (
    findObjs({ _type: 'graphic', name: '__vd_background_retiring__' }) || []
  ).forEach(function (token) {
    token.remove();
  });
  (
    findObjs({ _type: 'graphic', name: '__vd_background_cover__' }) || []
  ).forEach(function (token) {
    var active = (findObjs({
      _type: 'graphic',
      name: 'vd_background',
      _pageid: token.get('_pageid'),
    }) || [])[0];
    if (active) token.remove();
    else token.set({ name: 'vd_background', layer: 'map' });
  });
  if (vd_compat_setting.enabled) {
    var vdCue = function (args, context) {
      var validation = vdValidateCue(args, context);
      if (!validation.ok) return validation;
      var command = vdResolveCueCommand(args, context);
      if (command.indexOf('!@') !== 0) command = '!@' + command;
      sendChat('SceneDirector', command, null, { noarchive: true });
      return { ok: true };
    };
    var adapter = {
      meta: {
        code: '03_visual_dialogue_compatible.js',
        title: '비주얼 노벨',
      },
      aliases: { 비주얼: '', vd: '' },
      cue: vdCue,
      validate: vdValidateCue,
      inject: function (payload) {
        payload = payload || {};
        return state.VD_INJECT(
          payload.text,
          payload.type,
          payload.who,
          payload.options,
        );
      },
      sanitize: function (content, type) {
        return state.VD_SANITIZE(content, type);
      },
      applyLayerOrder: vdApplyLayerOrder,
      mapSheetBounds: vdMapSheetBounds,
      suppressCutinText: vdSuppressCutinText,
      status: vdPluginStatus,
      help: [
        '<code>!@배경 장면명</code> 배경 전환',
        '<code>!@표정명</code> 현재 화자 표정 변경',
        KIBScene.adapters.narrator
          ? '<code>!... /desc 지문 @인물A:불안 @인물B:</code> 여러 캐릭터 표정 변경. 콜론 뒤를 비우면 기본 표정'
          : '',
        '<code>!@퇴장:캐릭터명</code> 캐릭터 퇴장',
      ].filter(Boolean),
    };
    if (typeof KIBScene.register === 'function')
      KIBScene.register('vd', adapter);
    else {
      KIBScene.adapters.vd = adapter;
      KIBScene.handlers.vd = adapter.cue;
    }
  }

  // 창 기본 숨김
  showHideDecorations('vd_panel', false);
  showHideDecorations('vd_dialogue_box', false);
  vdScheduleExpressionHandouts();

  on('add:card', vdHandleCardChange);
  setTimeout(vdUpdateMacroSafe, 100);
});

on('change:deck:name', vdHandleDeckChange);
on('destroy:deck', vdHandleDeckChange);

on('change:card', vdHandleCardChange);
on('destroy:card', vdHandleCardChange);

on('add:character', vdScheduleExpressionHandouts);
on('destroy:character', vdScheduleExpressionHandouts);
on('change:character:name', vdScheduleExpressionHandouts);
on('change:character:controlledby', vdScheduleExpressionHandouts);

on('destroy:graphic', function (obj) {
  if (!obj) return;
  var pageId = obj.get('_pageid');
  if (pageId) vdScheduleTabletopFront(pageId, 0);
  if (obj.get('name') == 'vd_standing') {
    arrangeStandings(false);
  }
});

on('add:graphic', function (obj) {
  if (!obj) return;
  var pageId = obj.get('_pageid');
  if (!pageId) return;
  vdScheduleTabletopFront(pageId, 0);
  if (vdIsTabletopCard(obj)) vdScheduleTabletopFront(pageId, 1000);
});

on('add:text', function (obj) {
  if (obj && obj.get('_pageid')) vdScheduleTabletopFront(obj.get('_pageid'), 0);
});

// ===== 채팅 처리 =====
on('chat:message', function (msg) {
  try {
    if (vdHandleHiddenExpressionChat(msg)) return;
    vdHandleInlineExpression(msg);
    if (
      msg.type == 'api' &&
      /^!비주얼(?:\s+(?:help|도움말))?$/i.test(String(msg.content || ''))
    ) {
      if (playerIsGM(msg.playerid))
        vdWhisperExclude(
          '<b>비주얼 노벨 도움말</b><br>토큰 이름은 업로드 파일명이 아니라 Roll20 보드의 이미지 토큰 설정에 입력합니다.<br><code>!@배경 장면명</code> 배경 전환<br><code>!@표정명</code> 현재 화자 표정 변경<br><code>!대사 본문 @표정명</code> 명령 글자를 숨기고 대사와 표정 변경<br><code>!비주얼 설정|창구성|패널 하나 또는 분리</code> 창 구성 변경<br>패널 하나: 이미지 토큰 이름 <code>vd_panel</code><br>분리: 스크립트창 이미지 토큰 이름 <code>vd_panel</code>, 대사창 이미지 토큰 이름 <code>vd_dialogue_box</code><br><code>!비주얼 설정|항목|값</code> 글꼴, 크기, 색, 스탠딩 설정<br><code>!비주얼 순서|상태</code> 화면 앞뒤 순서 확인<br><code>!비주얼 비율|등록|카드명|가로|세로</code> 스탠딩 비율 등록<br><code>!비주얼 제외|추가|화자명</code> 특정 화자 숨김<br>01 나레이터와 함께 설치했을 때: <code>!... /desc 지문 @인물A:불안 @인물B:</code>처럼 캐릭터명 뒤의 콜론을 비우면 해당 캐릭터를 기본 표정으로 변경. <code>!. 함께 보여줄 문장</code>은 직전 <code>!...</code> 줄과 같은 차례에 출력(내용 필수), <code>!... 대사 @다음줄 1.2초</code>는 다음 나레이터 줄까지 1.2초 대기. 00 SceneDirector도 설치했다면 기본 간격은 <code>!sd set|timing.lineInterval|3000</code>(3초)으로 변경',
        );
      return;
    }
    if (
      msg.type == 'api' &&
      (msg.content == '!비주얼 설정' ||
        msg.content.indexOf('!비주얼 설정|') === 0)
    ) {
      if (playerIsGM(msg.playerid)) vdHandleConfigCommand(msg.content);
      return;
    }
    if (
      msg.type == 'api' &&
      (msg.content == '!비주얼 순서' ||
        msg.content.indexOf('!비주얼 순서|') === 0)
    ) {
      if (playerIsGM(msg.playerid)) vdHandleLayerOrderCommand(msg);
      return;
    }
    if (
      msg.type == 'api' &&
      (msg.content == '!비주얼 비율' ||
        msg.content.indexOf('!비주얼 비율|') === 0)
    ) {
      if (playerIsGM(msg.playerid)) vdHandleRatioCommand(msg.content, msg);
      return;
    }
    if (
      msg.type == 'api' &&
      (msg.content == '!비주얼 제외' ||
        msg.content.indexOf('!비주얼 제외|') === 0)
    ) {
      if (playerIsGM(msg.playerid)) vdHandleExcludeCommand(msg.content);
      return;
    }
    if (msg.type == 'api' && msg.content.indexOf('!비주얼 표정|') === 0) {
      vdHandleExpressionCommand(msg);
      return;
    }
    if (vdShouldCollectMessage(msg)) {
      if (msg.content.length > 0) {
        msg.content = msg.content
          .replace(state.api_tag, '')
          .replace(state.vd_explicit_as_tag, '')
          .replace(/<br>/g, state.vd_divider);
        msg.time = new Date().getTime();
        state.vd_stock.push(msg);
        if (
          state.vd_stock.length == 1 ||
          (state.vd_stock.length > 1 &&
            state.last_displayed_time + 5000 < msg.time)
        ) {
          setTimeout(vdShowDialogueSafe, 100);
        }
      }
    }
    if (msg.type == 'api' && msg.content.indexOf('!@') === 0) {
      if (msg.content == '!@장면없음') {
        if (playerIsGM(msg.playerid) || msg.playerid == 'API')
          vdWhisperProblem(
            '변경할 장면 카드가 없습니다.',
            '<code>background</code> 덱에 배경 카드를 넣어 주세요.',
          );
        return;
      }

      const current_page_id = vdGetCurrentPage();
      if (!current_page_id) {
        return;
      }

      if (msg.content == '!@숨김' || msg.content == '!@hide') {
        showHideDecorations('vd_dialogue_box', false);
        showHideDecorations('vd_panel', false);

        let bg_name = findObjs({
          _type: 'graphic',
          name: 'vd_name',
          _pageid: current_page_id,
        });
        let bg_dialogue = findObjs({
          _type: 'graphic',
          name: 'vd_dialogue',
          _pageid: current_page_id,
        });
        if (bg_name.length > 0) {
          bg_name = bg_name[0];
        } else {
          vdWhisperProblem(
            vdPageName(current_page_id) + ' 페이지에 vd_name 토큰이 없습니다.',
            'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_name</code>으로 지정해 주세요.',
          );
          return;
        }
        if (bg_dialogue.length > 0) {
          bg_dialogue = bg_dialogue[0];
        } else {
          vdWhisperProblem(
            vdPageName(current_page_id) +
              ' 페이지에 vd_dialogue 토큰이 없습니다.',
            'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_dialogue</code>로 지정해 주세요.',
          );
          return;
        }
        vdDialogueTexts(current_page_id).forEach(function (text) {
          text.remove();
        });
        bg_name.set('gmnotes', '');
        bg_dialogue.set('gmnotes', '');
        delete state.KIBSceneVD.scriptTexts[current_page_id];
        sendChat('vd-api-wildcard', '!@퇴장:전원', null, { noarchive: true });
      } else if (
        msg.content.indexOf('!@퇴장') == 0 ||
        msg.content.indexOf('!@exit') == 0
      ) {
        const keyword = msg.content
          .replace('!@퇴장', '')
          .replace('!@exit', '')
          .replace(state.api_tag, '');

        if (keyword.length == 0) {
          removeStanding(msg);
        } else if (
          playerIsGM(msg.playerid) ||
          msg.playerid == 'API' ||
          msg.who == 'vd-api-wildcard'
        ) {
          if (keyword == ':전원' || keyword == ':전체' || keyword == ':all') {
            let tokens = findObjs({
              _type: 'graphic',
              name: 'vd_standing',
              _pageid: current_page_id,
            });
            tokens.forEach((token) => {
              token.remove();
            });
          } else if (keyword == ':엑스트라' || keyword == ':extra') {
            let tokens = findObjs({
              _type: 'graphic',
              name: 'vd_standing',
              represents: '',
              _pageid: current_page_id,
            });
            tokens.forEach((token) => {
              token.remove();
            });
          } else {
            msg.who = keyword.replace(':', '');
            removeStanding(msg);
          }
        }
      } else if (
        (playerIsGM(msg.playerid) || msg.playerid == 'API') &&
        (msg.content == '!@리셋' || msg.content == '!@reset')
      ) {
        vdClearTypewriter();
        state.vd_stock = [];
        vdWhisperExclude('대사 대기열을 초기화했습니다.');
      } else if (
        (playerIsGM(msg.playerid) || msg.playerid == 'API') &&
        (msg.content == '!@강제진행' || msg.content == '!@force-progress')
      ) {
        showNextDialogue();
      } else if (
        (playerIsGM(msg.playerid) || msg.playerid == 'API') &&
        (msg.content.indexOf('!@배경 ') == 0 ||
          msg.content.indexOf('!@background ') == 0)
      ) {
        let bg_background = findObjs({
          _type: 'graphic',
          name: 'vd_background',
          _pageid: current_page_id,
        });
        let bg_deck = findObjs({ _type: 'deck', name: 'background' });
        if (bg_background.length == 0) {
          vdWhisperProblem(
            vdPageName(current_page_id) +
              ' 페이지에 vd_background 토큰이 없습니다.',
            '맵 레이어에 배경 이미지 토큰을 놓고 토큰 이름을 <code>vd_background</code>로 지정해 주세요.',
          );
          return;
        }
        bg_background = bg_background[0];
        const current_id = bg_background.id;
        const current_url = bg_background.get('imgsrc');
        const new_bg = msg.content
          .replace('!@배경 ', '')
          .replace('!@background ', '');
        let is_url_input = msg.content.indexOf('https://') > -1;
        if (is_url_input) {
          bg_background = vdSetBackgroundImage(
            bg_background,
            new_bg.replace(' ', ''),
          );
          if (
            !bg_background ||
            (bg_background.id == current_id &&
              current_url == bg_background.get('imgsrc'))
          ) {
            vdWhisperProblem(
              '배경 이미지를 변경하지 못했습니다.',
              '이미지 주소를 확인하세요.',
            );
          }
        } else {
          if (bg_deck.length == 0) {
            vdWhisperProblem(
              'background 덱이 없습니다.',
              '<code>background</code> 덱을 만들거나 이미지 주소를 직접 입력해 주세요.',
            );
            return;
          } else {
            let bg_cards = findObjs({
              _type: 'card',
              _deckid: bg_deck[0].get('_id'),
              name: new_bg,
            });
            if (bg_cards.length == 0) {
              vdWhisperProblem(
                'background 덱에 ' + new_bg + ' 카드가 없습니다.',
                '카드 이름을 확인하세요.',
              );
              return;
            } else {
              bg_background = vdSetBackgroundImage(
                bg_background,
                bg_cards[0].get('avatar'),
              );
              if (!bg_background)
                vdWhisperProblem(
                  '배경 그림을 만들지 못했습니다.',
                  '배경 카드 앞면 이미지를 확인하세요.',
                );
            }
          }
        }
      } else if (vd_setting.use_emotion) {
        let cha_name = String(msg.who || '')
          .replace(/ \(GM\)$/, '')
          .trim();
        let content_str = msg.content
          .replace(state.api_tag, '')
          .replace('!@', '');
        let emot = content_str;
        if (
          content_str.lastIndexOf(':') > -1 &&
          (playerIsGM(msg.playerid) || msg.playerid == 'API')
        ) {
          cha_name = content_str.substring(0, content_str.lastIndexOf(':'));
          emot = content_str.substring(
            content_str.lastIndexOf(':') + 1,
            content_str.length,
          );
        }
        let chat_cha = findCharacterWithName(cha_name);
        let current_token = null;
        if (chat_cha || vd_setting.show_extra_standing) {
          current_token = findTokenWithCharacter(
            chat_cha ? chat_cha.get('_id') : '',
            cha_name,
          );
        }
        if (current_token) {
          let rt = findObjs({ _type: 'deck', name: vd_setting.deck_name });
          if (rt.length == 0) {
            vdWhisperProblem(
              vd_setting.deck_name + ' 스탠딩 덱이 없습니다.',
              '같은 이름의 덱을 만들고 스탠딩 카드를 넣어 주세요.',
            );
            return;
          } else {
            let opt = {
              name: 'vd_standing',
              _subtype: 'card',
              _pageid: current_token.get('_pageid'),
              width: vd_setting.width,
              height: vd_setting.height,
              bar1_value: cha_name,
              left: current_token.get('left'),
              top: current_token.get('top'),
              layer: 'map',
              represents: chat_cha ? chat_cha.get('_id') : '',
              tint_color: current_token.get('tint_color'),
            };
            let search_opt = { _type: 'card', _deckid: rt[0].get('_id') };
            if (!vd_setting.use_emotion) {
              search_opt.name = chat_cha ? cha_name : vd_setting.extra_name;
            } else if (emot.length > 0) {
              search_opt.name = cha_name + '-' + emot;
            } else {
              search_opt.name = cha_name;
            }
            let rt_items = findObjs(search_opt);
            if (rt_items.length > 0) {
              opt.imgsrc = vdGraphicImage(rt_items[0].get('avatar'));
              opt.bar2_value = rt_items[0].id;
              let standing_size = vdStandingSize(
                rt_items[0],
                cha_name,
                current_token,
              );
              opt.width = standing_size.width;
              opt.height = standing_size.height;
              opt.top = vdStandingTop(
                current_token.get('_pageid'),
                standing_size.height,
              );
              if (chat_cha)
                state.KIBSceneVD.defaultExpressions[chat_cha.id] =
                  rt_items[0].id;
              vdScheduleExpressionHandouts();
            } else {
              vdWhisperProblem(
                vd_setting.deck_name +
                  ' 덱에 ' +
                  search_opt.name +
                  ' 표정 카드가 없습니다.',
                '카드 이름은 <code>캐릭터명-표정명</code>으로 씁니다.',
              );
              return;
            }
            current_token.set(opt);
          }
        } else if (chat_cha) {
          let rt = findObjs({ _type: 'deck', name: vd_setting.deck_name });
          let cardName = emot.length > 0 ? cha_name + '-' + emot : cha_name;
          let cards = rt.length
            ? findObjs({
                _type: 'card',
                _deckid: rt[0].get('_id'),
                name: cardName,
              })
            : [];
          if (!cards.length)
            vdWhisperProblem(
              vd_setting.deck_name +
                ' 덱에 ' +
                cardName +
                ' 표정 카드가 없습니다.',
              '',
            );
          else {
            state.KIBSceneVD.defaultExpressions[chat_cha.id] = cards[0].id;
            vdScheduleExpressionHandouts();
          }
        } else {
          vdWhisperPlayer(
            msg,
            '<b>' +
              vdEscapeHtml(cha_name) +
              '</b> 캐릭터가 없습니다. 캐릭터 이름을 확인하세요.',
          );
        }
      }
    }
  } catch (err) {
    vdWhisperProblem(
      '비주얼 노벨 명령을 처리하지 못했습니다.',
      '<code>!비주얼 help</code>에서 사용법을 확인하세요.',
      err,
    );
  }
});

// ===== 화면 출력 =====
function vdValidateCue(args, context) {
  var command = vdResolveCueCommand(args, context).replace(/^!@/, '');
  if (command == '__display__') {
    var speaker = vdContextSpeaker(context);
    var isGmDesc = context && context.chatType == 'desc';
    var isAnonymousEmas =
      context && context.chatType == 'emote' && context.explicitAs === true;
    if (
      !isGmDesc &&
      !isAnonymousEmas &&
      ((vd_setting.require_as && !speaker) || vdIsExcludedAs(speaker))
    )
      return { ok: true, skipped: true };
  }
  var pageResult = vdPageForValidation();
  if (!pageResult.ok) return pageResult;
  var pageId = pageResult.pageId;
  if (command == '__display__') {
    var required = ['vd_area', 'vd_panel', 'vd_name', 'vd_dialogue'];
    for (var i = 0; i < required.length; i++) {
      if (
        !(
          findObjs({ _type: 'graphic', name: required[i], _pageid: pageId }) ||
          []
        ).length
      ) {
        return {
          ok: false,
          error:
            getObj('page', pageId).get('name') +
            ' 페이지에 ' +
            required[i] +
            ' 토큰이 없습니다.',
        };
      }
    }
    if (
      vdDecorationForMessage(
        context && context.chatType,
        vd_setting.dialogue_panel_mode,
      ) == 'vd_dialogue_box' &&
      !vdDecorationGraphics('vd_dialogue_box', pageId).length
    )
      return {
        ok: false,
        error:
          getObj('page', pageId).get('name') +
          ' 페이지에 vd_dialogue_box 토큰이 없습니다.',
      };
    return { ok: true };
  }
  if (/^(?:배경|background)\s+/.test(command)) {
    var backgroundName = command.replace(/^(?:배경|background)\s+/, '').trim();
    if (!backgroundName)
      return { ok: false, error: '배경 이름이 없습니다.' };
    if (
      !(
        findObjs({
          _type: 'graphic',
          name: 'vd_background',
          _pageid: pageId,
        }) || []
      ).length
    )
      return {
        ok: false,
        error: '표시 페이지에 vd_background 토큰이 없습니다.',
      };
    if (/^https:\/\//i.test(backgroundName)) return { ok: true };
    var backgroundDeck = (findObjs({ _type: 'deck', name: 'background' }) ||
      [])[0];
    if (!backgroundDeck)
      return { ok: false, error: 'background 덱이 없습니다.' };
    if (
      !(
        findObjs({
          _type: 'card',
          _deckid: backgroundDeck.get('_id'),
          name: backgroundName,
        }) || []
      ).length
    ) {
      return {
        ok: false,
        error:
          'background 덱에 이름이 ' + backgroundName + '인 카드가 없습니다.',
      };
    }
    return { ok: true };
  }
  if (
    /^(?:장면없음|숨김|hide|퇴장|exit|리셋|reset|강제진행|force-progress)/.test(
      command,
    )
  )
    return { ok: true };
  var standingDeck = (findObjs({ _type: 'deck', name: vd_setting.deck_name }) ||
    [])[0];
  if (!standingDeck)
    return {
      ok: false,
      error: vd_setting.deck_name + ' 스탠딩 덱이 없습니다.',
    };
  var divider = command.lastIndexOf(':');
  if (divider > -1) {
    var characterName = command.substring(0, divider).trim();
    var emotionName = command.substring(divider + 1).trim();
    if (!characterName)
      return { ok: false, error: '표정 명령에 캐릭터명이 없습니다.' };
    if (
      !findCharacterWithName(characterName) &&
      !vd_setting.show_extra_standing
    )
      return {
        ok: false,
        error: '저널에 이름이 ' + characterName + '인 캐릭터가 없습니다.',
      };
    var cardName = emotionName
      ? characterName + '-' + emotionName
      : characterName;
    if (
      !(
        findObjs({
          _type: 'card',
          _deckid: standingDeck.get('_id'),
          name: cardName,
        }) || []
      ).length
    )
      return {
        ok: false,
        error: vd_setting.deck_name + ' 덱에 ' + cardName + ' 카드가 없습니다.',
      };
  } else
    return {
      ok: false,
      error:
        '표정 명령은 !... /as "캐릭터명" 대사 @표정 형식으로 입력하세요.',
    };
  return { ok: true };
}

function vdResolveCueCommand(args, context) {
  var command = args.join('|').trim().replace(/^!@/, '');
  var speaker = vdContextSpeaker(context);
  if (!command && args.length) return speaker ? speaker + ':' : command;
  if (
    !command ||
    command == '__display__' ||
    command.indexOf(':') > -1 ||
    /^(?:배경|background)\s+|^(?:장면없음|숨김|hide|퇴장|exit|리셋|reset|강제진행|force-progress)$/.test(
      command,
    )
  )
    return command;
  return speaker ? speaker + ':' + command : command;
}

function vdPageForValidation() {
  var names = vd_setting.page_list
    .replace(/, /g, ',')
    .replace(/ ,/g, ',')
    .split(',');
  var campaign = Campaign();
  var ribbonId = campaign && campaign.get('playerpageid');
  var ribbonPage = ribbonId ? getObj('page', ribbonId) : null;
  if (ribbonPage && names.indexOf(ribbonPage.get('name')) > -1)
    return { ok: true, pageId: ribbonId };
  var pages = findObjs({ type: 'page', name: names[0] }) || [];
  if (!pages.length) pages = findObjs({ _type: 'page', name: names[0] }) || [];
  return pages.length
    ? { ok: true, pageId: pages[0].get('_id') }
    : {
        ok: false,
        error: '설정한 페이지를 찾지 못했습니다: ' + names[0],
      };
}

const vdGetCurrentPage = function () {
  const page_list = vd_setting.page_list
    .replace(/, /g, ',')
    .replace(/ ,/g, ',')
    .split(',');
  if (
    page_list.indexOf(
      getObj('page', Campaign().get('playerpageid')).get('name'),
    ) > -1
  ) {
    return Campaign().get('playerpageid');
  } else {
    const page = findObjs({ type: 'page', name: page_list[0] });
    if (page.length > 0) {
      return page[0].get('_id');
    } else {
      vdWhisperProblem(
        page_list[0] + ' 페이지가 없습니다.',
        '설정한 페이지 이름과 Roll20 페이지 이름을 맞춰 주세요.',
      );
    }
  }
};

const showDialogue = function () {
  let msg = state.vd_stock[0];
  if (!msg) return;
  vdClearTypewriter();
  if (vdIsExcludedAs(msg.who)) {
    showNextDialogue();
    return;
  }

  for (let index = 1; index < state.vd_stock.length; index++) {
    const element = state.vd_stock[index];
    if (element.who == msg.who && Math.abs(element.time - msg.time) < 100) {
      msg.content = msg.content + state.vd_divider + element.content;
      state.vd_stock.splice(index, 1);
      index--;
    } else {
      break;
    }
  }

  const current_page_id = vdGetCurrentPage();
  if (!current_page_id) {
    return;
  }

  let is_general = msg.type == 'general';
  let is_script_mode = msg.type == 'desc' || msg.type == 'emote';
  const decoration_name = vdDecorationForMessage(
    msg.type,
    vd_setting.dialogue_panel_mode,
  );
  const type_feature_enabled =
    typeof KIBScene.isFeatureEnabled === 'function'
      ? KIBScene.isFeatureEnabled('type')
      : true;
  const use_typewriter =
    type_feature_enabled &&
    (msg.sdTypewriter === true ||
      String(msg.content || '').indexOf('#sd-direct-type') > -1 ||
      (typeof KIBScene.get === 'function'
        ? KIBScene.get('timing.typeAllLines', true)
        : true));
  const font_color =
    vd_setting[is_general ? 'dialogue_font_color' : 'desc_font_color'];
  let font_size =
    vd_setting[is_general ? 'dialogue_font_size' : 'desc_font_size'];
  let bg_area = findObjs({
    _type: 'graphic',
    name: 'vd_area',
    _pageid: current_page_id,
  });
  let bg_name = findObjs({
    _type: 'graphic',
    name: 'vd_name',
    _pageid: current_page_id,
  });
  let bg_dialogue = findObjs({
    _type: 'graphic',
    name: 'vd_dialogue',
    _pageid: current_page_id,
  });
  let bg_panel = findObjs({
    _type: 'graphic',
    name: 'vd_panel',
    _pageid: current_page_id,
  });
  let split = [];

  if (bg_area.length > 0) {
    bg_area = bg_area[0];
  } else {
    vdWhisperProblem(
      vdPageName(current_page_id) + ' 페이지에 vd_area 토큰이 없습니다.',
      'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_area</code>로 지정해 주세요.',
    );
    showNextDialogue();
    return;
  }
  if (bg_name.length > 0) {
    bg_name = bg_name[0];
  } else {
    vdWhisperProblem(
      vdPageName(current_page_id) + ' 페이지에 vd_name 토큰이 없습니다.',
      'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_name</code>으로 지정해 주세요.',
    );
    showNextDialogue();
    return;
  }
  if (bg_dialogue.length > 0) {
    bg_dialogue = bg_dialogue[0];
  } else {
    vdWhisperProblem(
      vdPageName(current_page_id) + ' 페이지에 vd_dialogue 토큰이 없습니다.',
      'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_dialogue</code>로 지정해 주세요.',
    );
    showNextDialogue();
    return;
  }
  if (bg_panel.length > 0) {
    bg_panel = bg_panel[0];
  } else {
    vdWhisperProblem(
      vdPageName(current_page_id) + ' 페이지에 vd_panel 토큰이 없습니다.',
      '오브젝트 레이어에 스크립트창 이미지 토큰을 놓고 토큰 이름을 <code>vd_panel</code>로 지정해 주세요.',
    );
    showNextDialogue();
    return;
  }
  if (
    decoration_name == 'vd_dialogue_box' &&
    !vdDecorationGraphics('vd_dialogue_box', current_page_id).length
  ) {
    vdWhisperProblem(
      vdPageName(current_page_id) +
        ' 페이지에 vd_dialogue_box 토큰이 없습니다.',
      '창 분리 설정에서는 오브젝트 레이어에 대사창 이미지 토큰을 놓고 토큰 이름을 <code>vd_dialogue_box</code>로 지정해 주세요.',
    );
    showNextDialogue();
    return;
  }

  const panel_size = vdDecorationSize(bg_panel);
  const dialogue_width = Number(bg_dialogue.get('width'));
  const dialogue_height = Number(bg_dialogue.get('height'));
  const width = is_script_mode ? panel_size.width : dialogue_width;
  const text_height = is_script_mode ? panel_size.height : dialogue_height;
  const name_width = bg_name.get('width');
  const name_left = Number(bg_name.get('left'));
  const name_top =
    Number(bg_name.get('top')) +
    (vd_setting['name_font_size'] * vd_setting['line_height']) / 2;
  const dialogue_left = Number(bg_dialogue.get('left'));
  const dialogue_top = Number(bg_dialogue.get('top'));
  const script_left = Number(bg_panel.get('left'));
  const script_top =
    Number(bg_panel.get('top')) + Number(vd_setting.desc_offset_y || 0);
  let blank_name = '';
  let blank_dialogue = '';
  let text_name = getObj('text', bg_name.get('gmnotes'));
  let text_normal = getObj('text', bg_dialogue.get('gmnotes'));
  let text_script = vdScriptText(current_page_id);
  if (
    !text_script &&
    text_normal &&
    text_normal.get('_pageid') == current_page_id &&
    (Math.abs(script_left - dialogue_left) > 0.5 ||
      Math.abs(script_top - dialogue_top) > 0.5) &&
    Math.abs(Number(text_normal.get('left')) - script_left) <= 0.5 &&
    Math.abs(Number(text_normal.get('top')) - script_top) <= 0.5
  ) {
    text_script = text_normal;
    text_normal = null;
    bg_dialogue.set('gmnotes', '');
    state.KIBSceneVD.scriptTexts[current_page_id] = text_script.get('_id');
  }
  while (
    name_width >
    blank_name.length *
      vd_setting['name_font_size'] *
      vd_setting['letter_spacing'] *
      1.2
  ) {
    blank_name += ' ';
  }
  while (
    width >
    blank_dialogue.length * font_size * vd_setting['letter_spacing'] * 1.15
  ) {
    blank_dialogue += ' ';
  }

  if (text_name && text_name.get('_pageid') != current_page_id) {
    text_name.remove();
    text_name = null;
  }
  if (text_normal && text_normal.get('_pageid') != current_page_id) {
    text_normal.remove();
    text_normal = null;
  }
  if (!text_name) {
    text_name = createObj('text', {
      _pageid: bg_area.get('_pageid'),
      left: name_left,
      top: name_top,
      width: bg_name.get('width'),
      height: bg_name.get('height'),
      layer: 'objects',
      font_family: vd_setting.font_family,
      text: '',
      font_size: vd_setting['name_font_size'],
      color: vd_setting['name_font_color'],
      stroke: vdTextStroke('name'),
    });
    bg_name.set({ gmnotes: text_name.get('_id') });
  }
  if (!text_normal && !is_script_mode) {
    text_normal = createObj('text', {
      _pageid: bg_dialogue.get('_pageid'),
      left: dialogue_left,
      top: dialogue_top,
      width: dialogue_width,
      height: dialogue_height,
      layer: 'objects',
      font_family: vd_setting.font_family,
      text: '',
      font_size: vd_setting.dialogue_font_size,
      color: vd_setting.dialogue_font_color,
      stroke: vdTextStroke('dialogue'),
    });
    bg_dialogue.set({ gmnotes: text_normal.get('_id') });
  }
  if (!text_script && is_script_mode) {
    text_script = createObj('text', {
      _pageid: bg_panel.get('_pageid'),
      left: script_left,
      top: script_top,
      width: panel_size.width,
      height: panel_size.height,
      layer: 'objects',
      font_family: vd_setting.font_family,
      text: '',
      font_size: vd_setting.desc_font_size,
      color: vd_setting.desc_font_color,
      stroke: vdTextStroke('script'),
    });
    state.KIBSceneVD.scriptTexts[current_page_id] = text_script.get('_id');
  }
  if (!vd_cutin_suppressed[current_page_id]) {
    vdRestoreCutinText(text_name, current_page_id);
    vdRestoreCutinText(text_normal, current_page_id);
    vdRestoreCutinText(text_script, current_page_id);
  }
  let text_dialogue = is_script_mode ? text_script : text_normal;
  let inactive_text = is_script_mode ? text_normal : text_script;
  if (inactive_text && inactive_text.get('text') !== '')
    inactive_text.set('text', '');

  // 롤꾸 제거
  let name = msg.who + '\n' + blank_name;
  let filtered = msg.content;

  // 이미지와 버튼 블록
  filtered = filtered.replace(
    /\[\[\s*<a\s*href=\s*\]\([^)]+\)\]\(\s*#"(?:[^"]*)"(?:[^)]*)\)/gi,
    '',
  );

  // 스타일 링크
  filtered = filtered.replace(
    /\[([^\]]+)\]\(\s*#"(?:[^"]*)"(?:[^)]*)\)/g,
    '$1',
  );

  // 남은 태그 조각
  filtered = filtered.replace(/<a\s*href=/gi, '');

  filtered = filtered.replace(/<\s*div\s+style\s*=\s*"/gi, '');
  filtered = filtered.replace(/<\s*span\s+style\s*=\s*"/gi, '');

  // 일반 링크
  filtered = filtered.replace(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '$1');

  // desc, emote 대괄호
  if (msg.type === 'desc' || msg.type === 'emote') {
    filtered = filtered.replace(/\[([^\]]+)\]/g, '$1');
  }

  // 내부 태그 조각
  filtered = filtered.replace(/"#vd-permitted-api-chat">\s*/g, '');
  filtered = filtered.replace(/#vd-permitted-api-chat">\s*/g, '');
  filtered = filtered.replace(/"#sd-direct-type">\s*/g, '');
  filtered = filtered.replace(/#sd-direct-type">\s*/g, '');

  let filter_word = [
    { regex: /\*.+\*/g, replace: /\*/g }, // *, **, ***
    { regex: /``.+``/g, replace: /``/g }, // ``
    {
      regex: /\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,
      replace: /\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,
    }, // [](http...)
    { regex: /<[^>]*>/g, replace: /<[^>]*>/g }, // <html>
    { regex: /\$\[\[.+\]\]/g, replace: /\$\[\[.+\]\]/g }, // [[]]
  ];
  for (let i = 0; i < filter_word.length; i++) {
    let match = filtered.match(filter_word[i].regex);
    if (match) {
      for (let j = 0; j < match.length; j++) {
        filtered = filtered.replace(
          match[j],
          match[j].replace(filter_word[i].replace, ''),
        );
      }
    }
  }
  let ruby_match = filtered.match(/\([^\(\)\[\]]+\)\[[^\(\)\[\]]*\]/g);
  if (ruby_match) {
    for (let j = 0; j < ruby_match.length; j++) {
      let rubystr_split = ruby_match[j]
        .substring(1, ruby_match[j].length - 1)
        .split(')[');
      filtered = filtered.replace(
        ruby_match[j],
        rubystr_split[1] + '(' + rubystr_split[0] + ')',
      );
    }
  }

  if (filtered.length == 0) {
    showNextDialogue();
    return;
  }
  let str = filtered;

  let desc_ratio = is_general ? 1 : 0.8;
  let amount =
    Math.ceil((width / font_size / vd_setting['letter_spacing']) * 3) - 3;
  let idx = 0;
  let length = 0;
  const thirdchar = ["'", ' ', ',', '.', '!', ':', ';', '"'];
  const halfchar = [
    '[',
    ']',
    '(',
    ')',
    '*',
    '^',
    '-',
    '~',
    '<',
    '>',
    '+',
    'l',
    'i',
    '1',
  ];
  const arr = thirdchar.concat(halfchar);
  let divided = false;

  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    length += 3;
    for (let j = 0; j < arr.length; j++) {
      if (c == arr[j]) {
        length -= j < thirdchar.length ? 2 : 1;
        break;
      }
    }
    if (length >= amount * desc_ratio || c == state.vd_divider) {
      let substr = str.substring(idx, i + 1).replace(state.vd_divider, '');
      split.push(
        is_general || msg.who.length > 0
          ? substr
          : getStringWithMargin(amount, length, desc_ratio, substr),
      );
      idx = i + 1;
      length = 0;
      if (
        (split.length + 1) * font_size * vd_setting['line_height'] >
        text_height
      ) {
        state.vd_stock.splice(1, 0, {
          content: filtered.substring(idx, str.length),
          time: msg.time,
          playerid: msg.playerid,
          type: msg.type,
          who: msg.who,
        });
        divided = true;
        break;
      }
    }
  }
  if (idx < str.length && !divided) {
    let substr = str.substring(idx, str.length);
    split.push(
      is_general || msg.who.length > 0
        ? substr
        : getStringWithMargin(amount, length, desc_ratio, substr),
    );
  }
  const typed_line_count = split.length;
  const typed_length = split.reduce(function (total, line) {
    return total + line.replace(/[\sㅤ]/g, '').length;
  }, 0);
  const typed_line_start = is_general || msg.who.length > 0 ? 0 : 1;

  if (is_general || msg.who.length > 0) {
    while (
      (split.length + 1) * font_size * vd_setting['line_height'] <
      text_height
    ) {
      split.push(' ');
    }
  } else {
    split.splice(0, 0, ' ');
  }
  split.push(blank_dialogue);

  text_name.set({
    text: name,
    left: name_left,
    font_family: vd_setting.font_family,
    font_size: vd_setting['name_font_size'],
    color: vd_setting['name_font_color'],
    stroke: vdTextStroke('name'),
    top: name_top,
  });
  const full_dialogue_text = split.join('\n');
  text_dialogue.set({
    text: use_typewriter
      ? vdTypewriterFrame(split, typed_line_start, typed_line_count, 0)
      : full_dialogue_text,
    font_family: vd_setting.font_family,
    font_size: font_size,
    color: font_color,
    stroke: vdTextStroke(is_script_mode ? 'script' : 'dialogue'),
    width: width,
    height: text_height,
    left: is_script_mode ? script_left : dialogue_left,
    top: is_script_mode ? script_top : dialogue_top,
  });

  if (!vdApplyLayerOrder(current_page_id)) {
    toFront(text_name);
    toFront(text_dialogue);
    vdKeepTransientFront(current_page_id);
  }
  var typeSpeed =
    typeof KIBScene.get === 'function'
      ? KIBScene.get('timing.typeSpeed', 45)
      : 45;
  var typeHold =
    typeof KIBScene.get === 'function'
      ? KIBScene.get('timing.typeHold', 2800)
      : 2800;
  if (use_typewriter && typed_length > 0) {
    let shown = 0;
    vd_typewriter_interval = setInterval(function () {
      shown++;
      if (!getObj('text', text_dialogue.id)) return vdClearTypewriter();
      if (!vd_cutin_suppressed[current_page_id])
        text_dialogue.set(
          'text',
          vdTypewriterFrame(split, typed_line_start, typed_line_count, shown),
        );
      if (shown >= typed_length) {
        vdClearTypewriter();
        setTimeout(showNextDialogue, typeHold);
      }
    }, typeSpeed);
  }

  setTimeout(() => {
    showHideDecorations('vd_panel', decoration_name == 'vd_panel');
    showHideDecorations(
      'vd_dialogue_box',
      decoration_name == 'vd_dialogue_box',
    );
    if (!vdApplyLayerOrder(current_page_id)) {
      toFront(text_name);
      toFront(text_dialogue);
      vdKeepTransientFront(current_page_id);
    }
  }, 100);

  clearTextWithout(text_name, text_dialogue, inactive_text);

  const ignore_list = vd_setting.ignore_list
    .replace(/, /g, ',')
    .replace(/ ,/g, ',')
    .split(',');
  if (msg.type != 'desc' && ignore_list.indexOf(msg.who) < 0) {
    let chat_cha = findCharacterWithName(msg.who);
    let current_token = null;
    if (chat_cha || vd_setting.show_extra_standing) {
      current_token = findTokenWithCharacter(
        chat_cha ? chat_cha.get('_id') : '',
        msg.who,
      );
    }
    let tokens = findObjs({
      _type: 'graphic',
      name: 'vd_standing',
      _pageid: current_page_id,
    });
    let lowest_priority = tokens[0];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      token.set('tint_color', '#000000');
      if (
        parseInt(token.get('gmnotes')) <
        parseInt(lowest_priority.get('gmnotes'))
      ) {
        lowest_priority = token;
      }
    }

    if (current_token == null && (chat_cha || vd_setting.show_extra_standing)) {
      let rt = findObjs({ _type: 'deck', name: vd_setting.deck_name });
      if (rt.length == 0) {
        vdWhisperProblem(
          vd_setting.deck_name + ' 스탠딩 덱이 없습니다.',
          '덱을 만들고 스탠딩 카드를 넣어 주세요.',
        );
        showNextDialogue();
        return;
      } else {
        let standing_card = chat_cha
          ? vdDefaultStandingCard(chat_cha)
          : (findObjs({
              _type: 'card',
              _deckid: rt[0].get('_id'),
              name: vd_setting.extra_name,
            }) || [])[0];
        // 등록 카드가 없으면 스탠딩 생략
        if (!standing_card) {
          current_token = null;
        } else {
          let opt = {
            name: 'vd_standing',
            _pageid: bg_area.get('_pageid'),
            bar1_value: msg.who,
            bar2_value: standing_card.id,
            layer: 'map',
            imgsrc: vdGraphicImage(standing_card.get('avatar')),
            represents: chat_cha ? chat_cha.get('_id') : '',
            tint_color: 'transparent',
            gmnotes: Date.now(),
          };
          let standing_size = vdStandingSize(standing_card, msg.who);
          if (!standing_size) {
            vdWarnMissingRatio(standing_card);
            current_token = null;
          } else {
            opt.width = standing_size.width;
            opt.height = standing_size.height;

            if (tokens.length >= vd_setting.max_number) {
              opt.left = lowest_priority.get('left');
            } else {
              opt.left = arrangeStandings(true);
            }
            opt.top = vdStandingTop(
              bg_area.get('_pageid'),
              standing_size.height,
            );

            if (tokens.length >= vd_setting.max_number) {
              lowest_priority.set(opt);
              current_token = lowest_priority;
            } else {
              current_token = createObj('graphic', opt);
            }
            toFront(current_token);
          }
        }
      }
    } else if (current_token) {
      toFront(current_token);
      current_token.set({ tint_color: 'transparent', gmnotes: Date.now() });
    }
  }
  vdKeepTransientFront(current_page_id);

  state.last_displayed_time = new Date().getTime();
  var centralMinShow =
    typeof KIBScene.get === 'function'
      ? KIBScene.get('timing.visualMinShow', vd_setting.min_showtime)
      : vd_setting.min_showtime;
  var centralRatio =
    typeof KIBScene.get === 'function'
      ? KIBScene.get('timing.visualCharRatio', vd_setting.showtime_ratio)
      : vd_setting.showtime_ratio;
  if (!(use_typewriter && typed_length > 0)) {
    setTimeout(
      showNextDialogue,
      use_typewriter
        ? typeHold
        : Math.max(centralMinShow, str.length * centralRatio),
    );
  }
};

function vdTypewriterFrame(lines, contentLineStart, contentLineCount, shown) {
  let visibleCount = 0;
  return lines
    .map(function (line, index) {
      if (
        index < contentLineStart ||
        index >= contentLineStart + contentLineCount
      )
        return line;
      return line
        .split('')
        .map(function (character) {
          if (/[\sㅤ]/.test(character)) return character;
          visibleCount++;
          return visibleCount <= shown ? character : ' ';
        })
        .join('');
    })
    .join('\n');
}

function vdClearTypewriter() {
  if (vd_typewriter_interval !== null) clearInterval(vd_typewriter_interval);
  vd_typewriter_interval = null;
}

const clearTextWithout = function (name_txt, dial_txt, extra_txt) {
  const managed = [name_txt, dial_txt, extra_txt].filter(Boolean);
  if (!managed.length) return;
  const managed_ids = managed.map(function (text) {
    return text.get('_id');
  });
  let filtered_txt = (
    findObjs({ _type: 'text', _pageid: managed[0].get('_pageid') }) || []
  ).filter(function (obj) {
    return (
      managed_ids.indexOf(obj.get('_id')) < 0 &&
      ((Math.abs(obj.get('left') - name_txt.get('left')) < 100 &&
        Math.abs(obj.get('top') - name_txt.get('top')) < 100) ||
        (Math.abs(obj.get('left') - dial_txt.get('left')) < 100 &&
          Math.abs(obj.get('top') - dial_txt.get('top')) < 100))
    );
  });
  filtered_txt.forEach((txt) => {
    txt.remove();
  });
};

const updateMacro = function (obj) {
  let background_deck = findObjs({ type: 'deck', name: 'background' });
  if (background_deck.length == 0)
    background_deck = findObjs({ _type: 'deck', name: 'background' });
  if (background_deck.length == 0 || typeof createObj !== 'function') return;
  if (background_deck.length > 1) {
    vdWhisperProblem(
      'background 덱이 여러 개입니다.',
      '하나만 남겨 주세요.',
    );
  }
  let bg_images = findObjs({ _type: 'card', _deckid: background_deck[0].id });
  bg_images.sort(function (a, b) {
    const left = String(a.get('name') || '');
    const right = String(b.get('name') || '');
    return left < right ? -1 : left > right ? 1 : 0;
  });
  let action_str =
    bg_images.length == 1
      ? '!@배경 ' + String(bg_images[0].get('name') || '')
      : bg_images.length > 1
        ? '!@배경 ?{장면 선택'
        : '!@장면없음';
  for (let index = 0; index < bg_images.length; index++) {
    const name = String(bg_images[index].get('name') || '');
    if (bg_images.length > 1 && name)
      action_str +=
        '|' +
        name
          .replace(/\|/g, '&#124;')
          .replace(/,/g, '&#44;')
          .replace(/}/g, '&#125;');
  }
  if (bg_images.length > 1) action_str += '}';

  let players = findObjs({ type: 'player' });
  if (players.length == 0) players = findObjs({ _type: 'player' });
  let gm_ids = [];
  for (let index = 0; index < players.length; index++)
    if (playerIsGM(players[index].id)) gm_ids.push(players[index].id);
  const owner = gm_ids[0] || (players[0] && players[0].id);
  if (!owner) return;
  let bg_macro = findObjs({
    _type: 'macro',
    name: vd_setting.background_macro_name,
  });
  if (bg_macro.length == 0)
    bg_macro = findObjs({ _type: 'macro', name: '배경전환' });
  let options = {
    name: vd_setting.background_macro_name,
    action: action_str,
    visibleto: gm_ids.join(','),
  };
  if (bg_macro.length > 0) {
    if (
      bg_macro[0].get('name') != options.name ||
      bg_macro[0].get('action') != options.action ||
      bg_macro[0].get('visibleto') != options.visibleto
    )
      bg_macro[0].set(options);
  } else {
    options.playerid = owner;
    createObj('macro', options);
  }
};

function vdDecorationSize(graphic) {
  var width = Number(graphic && graphic.get('width'));
  var height = Number(graphic && graphic.get('height'));
  var saved = String((graphic && graphic.get('gmnotes')) || '').match(
    /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/,
  );
  if (saved) {
    width = Number(saved[1]);
    height = Number(saved[2]);
  }
  return { width: width > 0 ? width : 1, height: height > 0 ? height : 1 };
}

function vdDecorationGraphics(name, pageId) {
  var names =
    vd_dialogue_box_names.indexOf(name) > -1 ? vd_dialogue_box_names : [name];
  var result = [];
  names.forEach(function (itemName) {
    var query = { _type: 'graphic', name: itemName };
    if (pageId) query._pageid = pageId;
    result = result.concat(findObjs(query) || []);
  });
  return result;
}

function vdIsTabletopCard(item) {
  return (
    item &&
    item.get('_subtype') == 'card' &&
    item.get('layer') == 'objects' &&
    item.get('name') != 'vd_standing'
  );
}

function vdTabletopCards(pageId, pageGraphics) {
  var cards = (pageGraphics ||
    findObjs({ _type: 'graphic', _pageid: pageId }) ||
    []).filter(vdIsTabletopCard);
  var page = getObj('page', pageId);
  var order = page
    ? String(page.get('_zorder') || '')
        .split(',')
        .filter(Boolean)
    : [];
  var positions = {};
  order.forEach(function (id, index) {
    positions[id] = index;
  });
  return cards
    .map(function (card, index) {
      return {
        card: card,
        index: index,
        position: Object.prototype.hasOwnProperty.call(positions, card.id)
          ? positions[card.id]
          : order.length + index,
      };
    })
    .sort(function (a, b) {
      return a.position - b.position || a.index - b.index;
    })
    .map(function (entry) {
      return entry.card;
    });
}

function vdBringTabletopCardsFront(pageId, pageGraphics) {
  vdTabletopCards(pageId, pageGraphics).forEach(function (card) {
    if (getObj('graphic', card.id)) toFront(card);
  });
}

function vdScheduleTabletopFront(pageId, delay) {
  var key = pageId + ':' + Number(delay || 0);
  if (vd_tabletop_front_timers[key])
    clearTimeout(vd_tabletop_front_timers[key]);
  vd_tabletop_front_timers[key] = setTimeout(function () {
    delete vd_tabletop_front_timers[key];
    vdBringTabletopCardsFront(pageId);
    vdKeepTransientFront(pageId);
  }, Number(delay || 0));
}

function vdRestoreDefaultLayers(pageId) {
  vdDecorationGraphics('vd_panel', pageId)
    .concat(vdDecorationGraphics('vd_dialogue_box', pageId))
    .forEach(function (item) {
      if (item.get('layer') != 'gmlayer') item.set('layer', 'objects');
    });
  vdDialogueTexts(pageId).forEach(function (text) {
    if (text.get('layer') != 'objects') text.set('layer', 'objects');
  });
}

function vdApplyLayerOrder(pageId) {
  if (vd_cutin_suppressed[pageId]) {
    vdDialogueTexts(pageId).forEach(function (text) {
      vd_cutin_hidden_texts[text.id] = true;
      text.set({ layer: 'gmlayer', text: '' });
    });
    vdKeepTransientFront(pageId);
    return true;
  }
  vdDialogueTexts(pageId).forEach(function (text) {
    vdRestoreCutinText(text, pageId);
  });
  if (
    !state.KIBSceneVD ||
    !state.KIBSceneVD.layerOrder ||
    !state.KIBSceneVD.layerOrder.byPage
  )
    vdInitState();
  var entry = state.KIBSceneVD.layerOrder.byPage[pageId];
  if (!entry) return false;
  var sheet = getObj('graphic', entry.sheetId);
  if (!sheet || sheet.get('_pageid') != pageId) {
    vdRestoreDefaultLayers(pageId);
    delete state.KIBSceneVD.layerOrder.byPage[pageId];
    return false;
  }
  var layer = String(sheet.get('layer') || 'objects');
  var graphicsBehind = [];
  var graphicsFront = [];
  var texts = [];
  var pageGraphics = findObjs({ _type: 'graphic', _pageid: pageId }) || [];
  function graphicsNamed(names) {
    return pageGraphics.filter(function (item) {
      return names.indexOf(item.get('name')) > -1;
    });
  }
  function addGraphic(item, position) {
    if (!item || item.get('layer') == 'gmlayer') return;
    if (item.get('layer') != layer) item.set('layer', layer);
    (position == 'front' ? graphicsFront : graphicsBehind).push(item);
  }
  graphicsNamed(['vd_panel']).forEach(function (item) {
    addGraphic(item, entry.panelPosition);
  });
  graphicsNamed(vd_dialogue_box_names).forEach(function (item) {
    addGraphic(item, entry.decoPosition);
  });
  vdDialogueTexts(pageId, pageGraphics).forEach(function (text) {
    if (!text || text.get('layer') == 'gmlayer') return;
    if (text.get('layer') != layer) text.set('layer', layer);
    texts.push(text);
  });
  var sceneBehind = graphicsNamed(['vd_background', 'vd_standing']).filter(
    function (item) {
      return item.get('layer') == layer;
    },
  );
  var orderedObjects = sceneBehind.concat(
    graphicsBehind,
    graphicsFront,
    texts,
    [sheet],
  );
  var globalRelative =
    typeof toBelow == 'function' && typeof toAbove == 'function';
  var objectRelative = orderedObjects.every(function (item) {
    return (
      typeof item.toBelow == 'function' && typeof item.toAbove == 'function'
    );
  });
  if (globalRelative || objectRelative) {
    var placeBelow = function (item, target) {
      globalRelative ? toBelow(item, target) : item.toBelow(target);
    };
    var placeAbove = function (item, target) {
      globalRelative ? toAbove(item, target) : item.toAbove(target);
    };
    if (entry.textPosition == 'behind') {
      texts.forEach(function (item) {
        placeBelow(item, sheet);
      });
      sceneBehind.concat(graphicsBehind).forEach(function (item) {
        placeBelow(item, texts[0] || sheet);
      });
    } else {
      sceneBehind.concat(graphicsBehind).forEach(function (item) {
        placeBelow(item, sheet);
      });
      var top = sheet;
      graphicsFront.concat(texts).forEach(function (item) {
        placeAbove(item, top);
        top = item;
      });
    }
  } else {
    graphicsBehind.forEach(toFront);
    if (entry.textPosition == 'behind') texts.forEach(toFront);
    toFront(sheet);
    graphicsFront.forEach(toFront);
    if (entry.textPosition == 'front') texts.forEach(toFront);
  }
  vdBringTabletopCardsFront(pageId, pageGraphics);
  vdKeepTransientFront(pageId);
  return true;
}

function vdScriptText(pageId) {
  var ids = state.KIBSceneVD && state.KIBSceneVD.scriptTexts;
  var id = ids && ids[pageId];
  var text = id && getObj('text', id);
  if (text && text.get('_pageid') == pageId) return text;
  if (id) delete ids[pageId];
  return null;
}

function vdDialogueTexts(pageId, graphics) {
  graphics = graphics || findObjs({ _type: 'graphic', _pageid: pageId }) || [];
  var texts = ['vd_name', 'vd_dialogue']
    .map(function (name) {
      var guide = graphics.filter(function (item) {
        return item.get('name') == name;
      })[0];
      return guide && getObj('text', guide.get('gmnotes'));
    })
    .filter(Boolean);
  var script = vdScriptText(pageId);
  if (script && !texts.some(function (text) { return text.id == script.id; }))
    texts.push(script);
  return texts;
}

function vdSuppressCutinText(enabled, pageId) {
  pageId = pageId || vdGetCurrentPage();
  if (!pageId) return false;
  if (enabled) {
    vd_cutin_suppressed[pageId] = true;
    vdDialogueTexts(pageId).forEach(function (text) {
      vd_cutin_hidden_texts[text.id] = true;
      text.set({ layer: 'gmlayer', text: '' });
    });
    return true;
  }
  delete vd_cutin_suppressed[pageId];
  vdClearTypewriter();
  vdDialogueTexts(pageId).forEach(function (text) {
    vdRestoreCutinText(text, pageId);
  });
  vdApplyLayerOrder(pageId);
  return true;
}

function vdRestoreCutinText(text, pageId) {
  if (!text || !vd_cutin_hidden_texts[text.id]) return;
  var entry =
    state.KIBSceneVD &&
    state.KIBSceneVD.layerOrder &&
    state.KIBSceneVD.layerOrder.byPage &&
    state.KIBSceneVD.layerOrder.byPage[pageId];
  var sheet = entry && getObj('graphic', entry.sheetId);
  text.set({ text: '', layer: sheet ? sheet.get('layer') : 'objects' });
  delete vd_cutin_hidden_texts[text.id];
}

function vdMapSheetBounds(pageId) {
  if (
    !state.KIBSceneVD ||
    !state.KIBSceneVD.layerOrder ||
    !state.KIBSceneVD.layerOrder.byPage
  )
    vdInitState();
  var entry = state.KIBSceneVD.layerOrder.byPage[pageId];
  var sheet = entry && getObj('graphic', entry.sheetId);
  if (!sheet || sheet.get('_pageid') != pageId) return null;
  var width = Number(sheet.get('width'));
  var height = Number(sheet.get('height'));
  if (!(width > 0 && height > 0)) return null;
  return {
    left: Number(sheet.get('left')),
    top: Number(sheet.get('top')),
    width: width,
    height: height,
  };
}

function vdKeepTransientFront(pageId) {
  var apng = KIBScene.adapters && KIBScene.adapters.apng;
  if (apng && typeof apng.bringToFront == 'function') apng.bringToFront(pageId);
  var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
  if (cutin && typeof cutin.bringToFront == 'function') cutin.bringToFront();
}

function vdHandleLayerOrderCommand(msg) {
  vdInitState();
  var parts = String(msg.content || '')
    .split('|')
    .map(function (part) {
      return part.trim();
    });
  var action = parts[1] || '상태';
  var pageId = vdGetCurrentPage();
  if (action == '맵시트등록') {
    if (!msg.selected || msg.selected.length != 1)
      return vdWhisperExclude(
        '고정 PNG 맵시트 토큰 하나를 선택한 뒤 <code>!비주얼 순서|맵시트등록</code>을 실행하세요.',
      );
    var selectedSheet = getObj('graphic', msg.selected[0]._id);
    if (!selectedSheet)
      return vdWhisperExclude(
        '선택한 항목이 이미지 토큰이 아닙니다. 고정 PNG 맵시트를 선택해 주세요.',
      );
    if (
      selectedSheet.get('layer') != 'map' &&
      selectedSheet.get('layer') != 'objects'
    )
      return vdWhisperExclude(
        '맵시트 이미지 토큰은 플레이어에게 보이는 <b>맵 레이어</b> 또는 <b>오브젝트 레이어</b>에 둔 뒤 등록하세요. 정해진 토큰 이름은 없습니다.',
      );
    pageId = selectedSheet.get('_pageid');
    var old = state.KIBSceneVD.layerOrder.byPage[pageId];
    state.KIBSceneVD.layerOrder.byPage[pageId] = {
      sheetId: selectedSheet.id,
      panelPosition: old && old.panelPosition == 'front' ? 'front' : 'behind',
      decoPosition: old && old.decoPosition == 'behind' ? 'behind' : 'front',
      textPosition: old && old.textPosition == 'behind' ? 'behind' : 'front',
    };
    vdApplyLayerOrder(pageId);
    vdRefreshHandout();
    return vdWhisperExclude(
      '<b>' +
        vdEscapeHtml(selectedSheet.get('name') || '이름 없는 맵시트') +
        '</b>를 이 페이지의 고정 맵시트로 등록했습니다.',
    );
  }
  var entry = pageId && state.KIBSceneVD.layerOrder.byPage[pageId];
  if (action == '초기화' || action == '맵시트해제') {
    if (pageId) {
      vdRestoreDefaultLayers(pageId);
      delete state.KIBSceneVD.layerOrder.byPage[pageId];
    }
    vdRefreshHandout();
    return vdWhisperExclude('현재 페이지의 맵시트 순서 설정을 해제했습니다.');
  }
  if (!entry)
    return vdWhisperExclude(
      '현재 페이지에 등록된 맵시트가 없습니다. 맵시트 이미지 토큰을 선택하고 <code>!비주얼 순서|맵시트등록</code>을 실행하세요. 정해진 토큰 이름은 없습니다.',
    );
  if (
    action == '패널뒤' ||
    action == '패널앞' ||
    action == '강조창뒤' ||
    action == '강조창앞' ||
    action == '스크립트창뒤' ||
    action == '스크립트창앞'
  ) {
    entry.panelPosition =
      action == '패널앞' ||
      action == '강조창앞' ||
      action == '스크립트창앞'
        ? 'front'
        : 'behind';
    if (entry.panelPosition == 'front') entry.textPosition = 'front';
    vdApplyLayerOrder(pageId);
    vdRefreshHandout();
    return vdWhisperExclude(
      '<b>스크립트창:</b> 맵시트 ' +
        (entry.panelPosition == 'front' ? '앞' : '뒤') +
        (entry.panelPosition == 'front' ? '<br><b>글자:</b> 맵시트 앞' : ''),
    );
  }
  if (
    action == '데코뒤' ||
    action == '데코앞' ||
    action == '대사창뒤' ||
    action == '대사창앞'
  ) {
    entry.decoPosition =
      action == '데코앞' || action == '대사창앞' ? 'front' : 'behind';
    if (entry.decoPosition == 'front') entry.textPosition = 'front';
    vdApplyLayerOrder(pageId);
    vdRefreshHandout();
    return vdWhisperExclude(
      '<b>대사창:</b> 맵시트 ' +
        (entry.decoPosition == 'front' ? '앞' : '뒤') +
        (entry.decoPosition == 'front' ? '<br><b>글자:</b> 맵시트 앞' : ''),
    );
  }
  if (action == '글자뒤' || action == '글자앞') {
    entry.textPosition = action == '글자앞' ? 'front' : 'behind';
    if (entry.textPosition == 'behind') {
      entry.panelPosition = 'behind';
      entry.decoPosition = 'behind';
    }
    vdApplyLayerOrder(pageId);
    vdRefreshHandout();
    return vdWhisperExclude(
      '<b>글자:</b> 맵시트 ' +
        (entry.textPosition == 'front' ? '앞' : '뒤') +
        '<br><b>스크립트창:</b> 맵시트 ' +
        (entry.panelPosition == 'front' ? '앞' : '뒤') +
        '<br><b>대사창:</b> 맵시트 ' +
        (entry.decoPosition == 'front' ? '앞' : '뒤'),
    );
  }
  var sheet = getObj('graphic', entry.sheetId);
  vdWhisperExclude(
    '<b>맵시트:</b> ' +
      vdEscapeHtml(sheet ? sheet.get('name') || '이름 없음' : '삭제됨') +
      '<br><b>스크립트창:</b> 맵시트 ' +
      (entry.panelPosition == 'front' ? '앞' : '뒤') +
      '<br><b>대사창:</b> 맵시트 ' +
      (entry.decoPosition == 'behind' ? '뒤' : '앞') +
      '<br><b>글자:</b> 맵시트 ' +
      (entry.textPosition == 'behind' ? '뒤' : '앞') +
      '<br><b>표시 순서:</b> 글자는 스크립트창과 대사창 앞',
  );
}

const showHideDecorations = function (name, show) {
  const text_deco = vdDecorationGraphics(name);
  for (let index = 0; index < text_deco.length; index++) {
    const itm = text_deco[index];
    if (show) {
      const entry =
        state.KIBSceneVD &&
        state.KIBSceneVD.layerOrder &&
        state.KIBSceneVD.layerOrder.byPage &&
        state.KIBSceneVD.layerOrder.byPage[itm.get('_pageid')];
      const sheet = entry && getObj('graphic', entry.sheetId);
      const visibleLayer = sheet ? sheet.get('layer') : 'objects';
      if (itm.get('gmnotes').includes('/')) {
        const wh = itm.get('gmnotes').split('/');
        itm.set({
          width: parseInt(wh[0]),
          height: parseInt(wh[1]),
          layer: visibleLayer,
        });
      }
      if (!sheet) toFront(itm);
    } else {
      if (itm.get('gmnotes').length == 0) {
        itm.set({ gmnotes: itm.get('width') + '/' + itm.get('height') });
      }
      itm.set({ width: 1, height: 1, layer: 'gmlayer' });
    }
  }
};

const showNextDialogue = function () {
  vdClearTypewriter();
  state.vd_stock.splice(0, 1);
  if (state.vd_stock.length > 0) {
    showDialogue();
  }
};

// ===== 외부 출력용 롤꾸 제거 =====
state.VD_SANITIZE = function (content, type) {
  let filtered = String(content || '');
  filtered = filtered.replace(
    /\[\[\s*<a\s*href=\s*\]\([^)]+\)\]\(\s*#"(?:[^"]*)"(?:[^)]*)\)/gi,
    '',
  );
  filtered = filtered.replace(
    /\[([^\]]+)\]\(\s*#"(?:[^"]*)"(?:[^)]*)\)/g,
    '$1',
  );
  filtered = filtered.replace(/<a\s*href=/gi, '');
  filtered = filtered.replace(/<\s*div\s+style\s*=\s*"/gi, '');
  filtered = filtered.replace(/<\s*span\s+style\s*=\s*"/gi, '');
  filtered = filtered.replace(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '$1');
  if (type === 'desc' || type === 'emote')
    filtered = filtered.replace(/\[([^\]]+)\]/g, '$1');
  filtered = filtered.replace(/"#vd-permitted-api-chat">\s*/g, '');
  filtered = filtered.replace(/#vd-permitted-api-chat">\s*/g, '');

  let filter_word = [
    { regex: /\*.+\*/g, replace: /\*/g },
    { regex: /``.+``/g, replace: /``/g },
    {
      regex: /\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,
      replace: /\[[^\(\)\[\]]*\]\(http[^\(\)\[\]]+\)/g,
    },
    { regex: /<[^>]*>/g, replace: /<[^>]*>/g },
    { regex: /\$\[\[.+\]\]/g, replace: /\$\[\[.+\]\]/g },
  ];
  for (let i = 0; i < filter_word.length; i++) {
    let matches = filtered.match(filter_word[i].regex) || [];
    for (let j = 0; j < matches.length; j++) {
      filtered = filtered.replace(
        matches[j],
        matches[j].replace(filter_word[i].replace, ''),
      );
    }
  }
  let ruby = filtered.match(/\([^\(\)\[\]]+\)\[[^\(\)\[\]]*\]/g) || [];
  for (let i = 0; i < ruby.length; i++) {
    let pair = ruby[i].substring(1, ruby[i].length - 1).split(')[');
    filtered = filtered.replace(ruby[i], pair[1] + '(' + pair[0] + ')');
  }
  return filtered;
};

const getStringWithMargin = function (amount, length, ratio, str) {
  let margin = Math.round(((amount - length) / 4) * ratio);
  for (var j = 0; j < margin; j++) {
    str = 'ㅤ' + str + 'ㅤ';
  }
  return str;
};

const findCharacterWithName = function (who) {
  let chat_cha = findObjs({ _type: 'character', name: who });
  if (chat_cha.length > 0) {
    return chat_cha[0];
  } else {
    return null;
  }
};

const findTokenWithCharacter = function (id, who) {
  let arr = findObjs({
    _type: 'graphic',
    name: 'vd_standing',
    represents: id,
    _pageid: vdGetCurrentPage(),
    bar1_value: who,
  });
  if (arr.length > 0) {
    return arr[0];
  }
  return null;
};

function vdStandingCardByImage(imgsrc) {
  var deck = (findObjs({ _type: 'deck', name: vd_setting.deck_name }) || [])[0];
  if (!deck) return null;
  var image = vdCanonicalImage(imgsrc);
  var cards = findObjs({ _type: 'card', _deckid: deck.get('_id') }) || [];
  for (var i = 0; i < cards.length; i++)
    if (vdCanonicalImage(cards[i].get('avatar')) == image) return cards[i];
  return null;
}

function vdStandingRatio(card, characterName, fallbackToken) {
  vdInitState();
  var saved = card && state.KIBSceneVD.standingRatios[card.id];
  if (!saved && characterName) {
    var base = vdStandingCardsByName(characterName)[0];
    saved = base && state.KIBSceneVD.standingRatios[base.id];
  }
  if (saved && saved.ratio > 0) return saved.ratio;
  var width = fallbackToken && Number(fallbackToken.get('width'));
  var height = fallbackToken && Number(fallbackToken.get('height'));
  return width > 0 && height > 0 ? width / height : 0;
}

function vdStandingSize(card, characterName, fallbackToken) {
  if (vd_setting.standing_fit == 'stretch')
    return { width: vd_setting.width, height: vd_setting.height };
  var ratio = vdStandingRatio(card, characterName, fallbackToken);
  if (!(ratio > 0)) return null;
  var width = vd_setting.width;
  var height = width / ratio;
  if (height > vd_setting.height) {
    height = vd_setting.height;
    width = height * ratio;
  }
  return {
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

function vdWarnMissingRatio(card) {
  if (!card || vd_ratio_warned[card.id]) return;
  vd_ratio_warned[card.id] = true;
  var name = String(card.get('name') || '카드').replace(/[|}]/g, '');
  sendChat(
    '비주얼 노벨',
    '/w gm <b>' +
      vdEscapeHtml(name) +
      '</b> 스탠딩 비율이 없어 표시하지 않았습니다.<br><a href="!비주얼 비율|등록|' +
      name +
      '|?{원본 가로 픽셀}|?{원본 세로 픽셀}">원본 비율 등록</a>',
    null,
    { noarchive: true },
  );
}

function vdStandingTop(pageId, renderedHeight) {
  var area = (findObjs({
    _type: 'graphic',
    name: 'vd_area',
    _pageid: pageId,
  }) || [])[0];
  return area
    ? Number(area.get('top')) - vd_setting.height / 2 + renderedHeight / 2
    : renderedHeight / 2;
}

function vdApplyTextStyle() {
  ['vd_name', 'vd_dialogue'].forEach(function (name) {
    (findObjs({ _type: 'graphic', name: name }) || []).forEach(
      function (guide) {
        var text = getObj('text', guide.get('gmnotes'));
        if (!text) return;
        var isName = name == 'vd_name';
        text.set({
          font_family: vd_setting.font_family,
          font_size: isName
            ? vd_setting.name_font_size
            : vd_setting.dialogue_font_size,
          color: isName
            ? vd_setting.name_font_color
            : vd_setting.dialogue_font_color,
          stroke: vdTextStroke(isName ? 'name' : 'dialogue'),
        });
      },
    );
  });
  vdInitState();
  Object.keys(state.KIBSceneVD.scriptTexts).forEach(function (pageId) {
    var text = vdScriptText(pageId);
    if (!text) return;
    text.set({
      font_family: vd_setting.font_family,
      font_size: vd_setting.desc_font_size,
      color: vd_setting.desc_font_color,
      stroke: vdTextStroke('script'),
    });
  });
}

function vdApplyStandingLayout() {
  vdInitState();
  var removed = false;
  (findObjs({ _type: 'graphic', name: 'vd_standing' }) || []).forEach(
    function (token) {
      var card = vdStandingCardByImage(token.get('imgsrc'));
      var size = vdStandingSize(card, token.get('bar1_value'));
      if (!size) {
        token.remove();
        removed = true;
        vdWarnMissingRatio(card);
        return;
      }
      token.set({
        width: size.width,
        height: size.height,
        top: vdStandingTop(token.get('_pageid'), size.height),
      });
    },
  );
  if (removed) arrangeStandings(false);
}

const removeStanding = function (msg) {
  let character = findCharacterWithName(msg.who);
  let token = findTokenWithCharacter(
    character ? character.get('_id') : '',
    msg.who,
  );
  if (token) {
    token.remove();
    arrangeStandings(false);
  }
};

const arrangeStandings = function (addNew) {
  const currernt_page_id = vdGetCurrentPage();
  let tokens = findObjs({
    _type: 'graphic',
    name: 'vd_standing',
    _pageid: currernt_page_id,
  });
  if (tokens.length > 0 || addNew) {
    let bg_area = findObjs({
      _type: 'graphic',
      name: 'vd_area',
      _pageid: currernt_page_id,
    });
    if (bg_area.length > 0) {
      bg_area = bg_area[0];
    } else {
      vdWhisperProblem(
        'vd_area 토큰이 없습니다.',
        'GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>vd_area</code>로 지정해 주세요.',
      );
      return;
    }
    let tokens_position = [];
    const compare = function (a, b) {
      if (a.left < b.left) {
        return -1;
      }
      if (a.left > b.left) {
        return 1;
      }
      return 0;
    };
    for (var i = 0; i < tokens.length; i++) {
      tokens_position.push({ idx: i, left: tokens[i].get('left') });
    }
    tokens_position.sort(compare);
    let final_count = tokens.length + (addNew ? 1 : 0);
    final_count = final_count < 2 ? 2 : final_count;
    let space = Math.floor(bg_area.get('width') / final_count);
    let left = bg_area.get('left') - Math.floor(bg_area.get('width') / 2);
    if (space < vd_setting.fit_width) {
      left += vd_setting.fit_width / 2;
      space = Math.floor(
        (bg_area.get('width') - vd_setting.fit_width) / (final_count - 1),
      );
    } else {
      left += space / 2;
    }
    let rand = addNew
      ? Math.floor(Math.random() * (tokens_position.length - 1)) + 1
      : Infinity;
    rand = rand < 0 ? 0 : rand;
    for (var i = 0; i < tokens_position.length; i++) {
      let token = tokens[tokens_position[i].idx];
      token.set('left', left + space * (i + (i >= rand ? 1 : 0)));
    }
    return addNew ? left + space * (rand == Infinity ? 0 : rand) : false;
  }
};
