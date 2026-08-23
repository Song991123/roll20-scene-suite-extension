/*
 * Scene Suite 05 - Dialog Overlay 1.4.1
 * 제작 및 통합: @EOOOOORK
 */

var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};

(function () {
  'use strict';

  // ===== 사용자 설정 =====
  var SETTING = {
    ENABLED: true,
    SCENE_DIRECTOR_ENABLED: true,
    GM_ONLY: true,

    // 자동 출력할 Speaking As 이름
    ALLOWED_NAMES: ['▶'],

    // 명령어
    TEST_COMMAND: '!dialog-test',
    CLEAN_COMMAND: '!dialog-clean',
    STATUS_COMMAND: '!dialog-status',
    HELP_COMMAND: '!dialog-help',
    PAGE_COMMAND: '!dialog-page',

    // 페이지: name, ribbon, id, stored
    PAGE_MODE: 'name',
    PAGE_NAME: 'Start',
    PAGE_ID: '',

    BOX_IMAGE_URL: '',
    BOX_WIDTH: 1320,
    BOX_HEIGHT: 220,
    BOTTOM_MARGIN: 80,

    TEXT_SIZE: 35,
    TEXT_SPEED: 45,
    HOLD_TIME: 2800,
    MAX_CHARS_PER_LINE: 32,

    TEXT_COLOR: '#ffffff',
    FONT_FAMILY: 'Arial',

    // objects 또는 foreground
    LAYER: 'objects',

    REGISTER_ICECANDY_HELP: true,
    SFX_ENABLED: true,
    SFX_DEBUG_TO_GM: false,
    SFX: {
      ROUND: {
        TRACK: '라운드',
        VOLUME: 55,
        PATTERNS: [
          /^(?:제\s*)?\d+\s*라운드(?:\s|$|[.!?。？！:：])/i,
          /^라운드\s*\d+(?:\s|$|[.!?。？！:：])/i,
          /^클라이맥스\s*(?:제\s*)?\d+\s*라운드(?:\s|$|[.!?。？！:：])/i,
        ],
      },
      JUDGE: {
        TRACK: '판정',
        VOLUME: 50,
        PATTERNS: [
          /^[^!\/\n]{1,24}판정(?:\s*(?:개시|시작|굴림|합니다|하겠습니다|:|：|$))/i,
          /^판정\s*(?:개시|시작|굴림|합니다|하겠습니다|:|：|$)/i,
        ],
      },
      HANDOUT: {
        TRACK: '핸드아웃',
        VOLUME: 52,
        PATTERNS: [
          /핸드아웃\s*(?:공개|오픈|열람|해금)/i,
          /(?:비밀|정보|단서)\s*(?:공개|오픈|해금)/i,
        ],
      },
    },
    DEBUG_TO_GM: false,
  };
  // ===== 실행 상태 =====
  var API = '별도 대사창';
  var VERSION = '1.4.1';
  var activeObjects = [];
  var activeTimer = null;
  var activeInterval = null;

  on('ready', function () {
    initState();
    if (SETTING.SCENE_DIRECTOR_ENABLED) {
      var typeCue = function (args, context) {
        // 비주얼 노벨이 처리한 줄은 중복 출력 제외
        if (context && context.visualDialogue === true)
          return { ok: true, delegated: true };
        var source = String((context && context.text) || '');
        var type =
          source.indexOf('/desc') === 0
            ? 'desc'
            : source.indexOf('/em') === 0
              ? 'emote'
              : 'general';
        source = source.replace(/^\/(?:desc|em)\s+/, '');
        var sanitized = callPlugin('vd', 'sanitize', [source, type]);
        source =
          sanitized === undefined || (sanitized && sanitized.ok === false)
            ? stripMarkdown(source)
            : sanitized;
        if (source.trim()) showDialogBox(source);
      };
      var adapter = {
        meta: { code: '05_dialog_overlay_compatible.js', title: '별도 대사창' },
        aliases: { 스크립트: '', 타자: '', type: '' },
        cue: typeCue,
        validate: function (args, context) {
          var source = String((context && context.text) || '').replace(
            /^\/(?:desc|em)\s+/,
            '',
          );
          if (!source.trim()) return { ok: true, skipped: true };
          var pageId = resolveTargetPageId();
          if (!pageId || !getObj('page', pageId))
            return {
              ok: false,
              error: '별도 대사창을 표시할 페이지를 찾지 못했습니다.',
            };
          if (!/^https:\/\//i.test(String(SETTING.BOX_IMAGE_URL || '')))
            return {
              ok: false,
              error:
                '대사창 이미지 주소를 HTTPS 주소로 설정해 주세요.',
            };
          return { ok: true };
        },
        help: [
          '<code>@스크립트</code> 이 줄을 별도 대사창에 표시',
          '<code>!sd set|timing.typeAllLines|true</code> 모든 나레이터 스크립트',
        ],
      };
      if (typeof KIBScene.register === 'function')
        KIBScene.register('type', adapter);
      else {
        KIBScene.adapters.type = adapter;
        KIBScene.handlers.type = adapter.cue;
      }
    }
    if (SETTING.REGISTER_ICECANDY_HELP) registerIcecandyHelp();
    log(API + ' v' + VERSION + ' loaded');
  });

  function callPlugin(name, method, args) {
    if (typeof KIBScene.call === 'function')
      return KIBScene.call(name, method, args);
    var adapter = KIBScene.adapters[name];
    return adapter && typeof adapter[method] === 'function'
      ? adapter[method].apply(adapter, args || [])
      : undefined;
  }

  on('chat:message', function (msg) {
    try {
      if (msg.type === 'api') return handleApi(msg);
      if (!shouldShowDialog(msg)) return;
      var dialogText = stripMarkdown(msg.content);
      playSfxForText(dialogText);
      showDialogBox(dialogText);
    } catch (err) {
      whisperGm(
        '<b>별도 대사창을 표시하지 못했습니다.</b><br><code>!대사창 도움말</code>에서 설정을 확인해 주세요.<br><span style="font-size:11px;color:#687386">오류 내용: ' +
          escapeHtml(String(err && err.message ? err.message : err)) +
          '</span>',
      );
    }
  });

  function handleApi(msg) {
    var content = String(msg.content || '').trim();
    if (!content) return false;

    if (content === SETTING.CLEAN_COMMAND) {
      if (!isGm(msg)) return false;
      cleanupDialog();
      whisperGm('별도 대사창을 닫았습니다.');
      return true;
    }

    if (content === SETTING.STATUS_COMMAND) {
      if (!isGm(msg)) return false;
      whisperGm(statusHtml(msg));
      return true;
    }

    if (
      content === SETTING.HELP_COMMAND ||
      /^!대사창(?:\s+(?:help|도움말))?$/i.test(content)
    ) {
      if (!isGm(msg)) return false;
      whisperGm(statusHtml(msg));
      return true;
    }

    if (content.indexOf(SETTING.PAGE_COMMAND) === 0) {
      if (!isGm(msg)) return false;
      handlePageCommand(
        content.substring(SETTING.PAGE_COMMAND.length).trim(),
        msg,
      );
      return true;
    }

    if (content.indexOf(SETTING.TEST_COMMAND) === 0) {
      if (!isGm(msg)) return false;
      var text =
        content.substring(SETTING.TEST_COMMAND.length).trim() ||
        '스크립트 미리보기';
      playSfxForText(stripMarkdown(text));
      showDialogBox(stripMarkdown(text));
      return true;
    }

    return false;
  }

  function shouldShowDialog(msg) {
    if (!SETTING.ENABLED) return debugReject('disabled', msg);
    if (msg.type !== 'general' && msg.type !== 'emote')
      return debugReject('type=' + msg.type, msg);
    if (msg.rolltemplate) return debugReject('rolltemplate', msg);
    if (!isAllowedSpeaker(msg))
      return debugReject('speaker=' + getSpeakerName(msg), msg);

    var content = String(msg.content || '').trim();
    if (content.indexOf('#sd-direct-type') !== -1)
      return debugReject('direct-type', msg);
    if (!content) return debugReject('empty', msg);
    if (content.indexOf('!') === 0) return debugReject('api-like', msg);
    if (content.indexOf('/') === 0) return debugReject('slash', msg);
    if (content.indexOf('&{template:') === 0)
      return debugReject('template', msg);
    if (content.indexOf('http://') !== -1 || content.indexOf('https://') !== -1)
      return debugReject('url', msg);

    return true;
  }

  function isAllowedSpeaker(msg) {
    if (SETTING.GM_ONLY && !isGm(msg)) return false;
    var speakerName = getSpeakerName(msg);
    for (var i = 0; i < SETTING.ALLOWED_NAMES.length; i++) {
      if (speakerName === SETTING.ALLOWED_NAMES[i]) return true;
    }
    return false;
  }

  function getSpeakerName(msg) {
    return String(msg.who || '')
      .replace(/\s*\(GM\)\s*$/i, '')
      .trim();
  }

  function playSfxForText(text) {
    if (!SETTING.SFX_ENABLED) return;
    var cue = matchSfxCue(text);
    if (!cue) return;
    playJukeboxTrack(cue.TRACK, cue.VOLUME);
  }

  function matchSfxCue(text) {
    var source = String(text || '').trim();
    if (!source) return null;
    var order = ['HANDOUT', 'ROUND', 'JUDGE'];
    for (var i = 0; i < order.length; i++) {
      var cue = SETTING.SFX[order[i]];
      if (!cue || !cue.TRACK || !cue.PATTERNS) continue;
      for (var j = 0; j < cue.PATTERNS.length; j++) {
        if (cue.PATTERNS[j].test(source)) return cue;
      }
    }
    return null;
  }

  function playJukeboxTrack(trackTitle, volume) {
    var track = findJukeboxTrack(trackTitle);
    if (!track) {
      if (SETTING.SFX_DEBUG_TO_GM)
        whisperGm(
          '쥬크박스에 <b>' +
            escapeHtml(trackTitle) +
            '</b> 효과음이 없습니다. 제목을 확인해 주세요.',
        );
      return;
    }
    try {
      track.set({ playing: false, softstop: false });
      setTimeout(function () {
        if (!objectExists(track)) return;
        track.set({
          playing: true,
          softstop: false,
          loop: false,
          volume: numberOr(volume, 50),
        });
      }, 40);
    } catch (err) {
      if (SETTING.SFX_DEBUG_TO_GM)
        whisperGm(
          '<b>효과음을 재생하지 못했습니다.</b><br><span style="font-size:11px;color:#687386">오류 내용: ' +
            escapeHtml(String(err && err.message ? err.message : err)) +
            '</span>',
        );
    }
  }

  function findJukeboxTrack(title) {
    var target = String(title || '')
      .trim()
      .toLowerCase();
    var tracks = (findObjs({ _type: 'jukeboxtrack' }) || []).concat(
      findObjs({ type: 'jukeboxtrack' }) || [],
    );
    for (var i = 0; i < tracks.length; i++) {
      var name = String(tracks[i].get('title') || tracks[i].get('name') || '')
        .trim()
        .toLowerCase();
      if (name === target) return tracks[i];
    }
    return null;
  }

  function showDialogBox(fullText) {
    cleanupDialog();

    var page = getDialogPageInfo();
    if (!page) return;

    var boxWidth = Math.min(SETTING.BOX_WIDTH, Math.max(70, page.width - 180));
    var boxHeight = SETTING.BOX_HEIGHT;
    var centerX = page.width / 2;
    var centerY = page.height - SETTING.BOTTOM_MARGIN - boxHeight / 2;

    var box = null;
    if (SETTING.BOX_IMAGE_URL && SETTING.BOX_IMAGE_URL.indexOf('http') === 0) {
      box = createObj('graphic', {
        _pageid: page.pageId,
        imgsrc: cleanImageUrl(SETTING.BOX_IMAGE_URL),
        left: centerX,
        top: centerY,
        width: boxWidth,
        height: boxHeight,
        layer: SETTING.LAYER,
        isdrawing: true,
      });
      if (box) activeObjects.push(box);
    }

    var bodyText = createObj('text', {
      _pageid: page.pageId,
      left: centerX,
      top: centerY,
      text: '',
      font_size: SETTING.TEXT_SIZE,
      color: SETTING.TEXT_COLOR,
      stroke: 'transparent',
      font_family: SETTING.FONT_FAMILY,
      layer: SETTING.LAYER,
    });
    if (bodyText) activeObjects.push(bodyText);

    setTimeout(function () {
      safeToFront(box);
      safeToFront(bodyText);
    }, 100);

    var i = 0;
    activeInterval = setInterval(
      function () {
        i++;
        if (!bodyText || !objectExists(bodyText)) {
          cleanupDialog();
          return;
        }

        bodyText.set({
          text: wrapText(fullText.slice(0, i), SETTING.MAX_CHARS_PER_LINE),
          font_size: SETTING.TEXT_SIZE,
          color: SETTING.TEXT_COLOR,
          font_family: SETTING.FONT_FAMILY,
        });

        safeToFront(box);
        safeToFront(bodyText);

        if (i >= fullText.length) {
          clearInterval(activeInterval);
          activeInterval = null;
          var holdTime =
            typeof KIBScene.get === 'function'
              ? KIBScene.get('timing.typeHold', SETTING.HOLD_TIME)
              : SETTING.HOLD_TIME;
          activeTimer = setTimeout(cleanupDialog, holdTime);
        }
      },
      typeof KIBScene.get === 'function'
        ? KIBScene.get('timing.typeSpeed', SETTING.TEXT_SPEED)
        : SETTING.TEXT_SPEED,
    );
  }

  function getDialogPageInfo() {
    var pageId = resolveTargetPageId();
    var page = pageId ? getObj('page', pageId) : null;

    if (!page) {
      whisperGm(
        '별도 대사창 적용 페이지를 찾지 못했습니다. <code>!dialog-page status</code>로 설정을 확인해 주세요.',
      );
      return null;
    }

    return {
      pageId: pageId,
      width: numberOr(page.get('width'), 0) * 70,
      height: numberOr(page.get('height'), 0) * 70,
    };
  }

  function resolveTargetPageId() {
    var config = pageConfig();
    var mode = String(
      config.pageMode || SETTING.PAGE_MODE || 'ribbon',
    ).toLowerCase();
    var pageId = config.pageId || SETTING.PAGE_ID;
    var pageNameValue = config.pageName || SETTING.PAGE_NAME;

    if (
      (mode === 'id' || mode === 'stored') &&
      pageId &&
      getObj('page', pageId)
    )
      return pageId;
    if (mode === 'name' && pageNameValue) {
      var byName = findPageByName(pageNameValue);
      if (byName) return byName.id;
    }

    var campaign = Campaign && Campaign();
    return campaign && campaign.get ? campaign.get('playerpageid') : '';
  }

  function handlePageCommand(raw, msg) {
    var arg = String(raw || '').trim();
    if (!arg || /^status$/i.test(arg)) {
      whisperGm(pageStatusHtml());
      return;
    }

    var config = pageConfig();

    if (/^(here|선택|현재)$/i.test(arg)) {
      var selectedPageId = selectedPageIdFromMessage(msg);
      if (!selectedPageId) {
        whisperGm(
          '적용할 페이지의 토큰 하나를 선택한 뒤 <code>!dialog-page here</code>를 실행해 주세요.',
        );
        return;
      }
      config.pageMode = 'stored';
      config.pageId = selectedPageId;
      config.pageName = pageName(selectedPageId);
      whisperGm(
        '별도 대사창 적용 페이지: <b>' +
          escapeHtml(pageName(selectedPageId)) +
          '</b>',
      );
      return;
    }

    if (/^ribbon$/i.test(arg)) {
      config.pageMode = 'ribbon';
      config.pageId = '';
      config.pageName = '';
      whisperGm('별도 대사창 적용 페이지: 플레이어 리본이 있는 페이지');
      return;
    }

    if (/^reset$/i.test(arg)) {
      config.pageMode = SETTING.PAGE_MODE || 'ribbon';
      config.pageName = SETTING.PAGE_NAME || '';
      config.pageId = SETTING.PAGE_ID || '';
      whisperGm(
        '별도 대사창 적용 페이지를 처음 설정으로 되돌렸습니다: <b>' +
          escapeHtml(pageName(resolveTargetPageId())) +
          '</b>',
      );
      return;
    }

    var idMatch = arg.match(/^id\s+(.+)$/i);
    if (idMatch) {
      var id = idMatch[1].trim();
      if (!getObj('page', id)) {
        whisperGm(
          '입력한 페이지를 찾지 못했습니다. 적용할 페이지의 토큰을 선택한 뒤 <code>!dialog-page here</code>를 입력해 주세요.',
        );
        return;
      }
      config.pageMode = 'stored';
      config.pageId = id;
      config.pageName = pageName(id);
      whisperGm(
        '별도 대사창 적용 페이지: <b>' +
          escapeHtml(config.pageName) +
          '</b>',
      );
      return;
    }

    var nameMatch = arg.match(/^name\s+(.+)$/i);
    var pageNameArg = nameMatch ? nameMatch[1].trim() : arg;
    if (pageNameArg) {
      var page = findPageByName(pageNameArg);
      if (!page) {
        whisperGm(
          '이름이 <b>' +
            escapeHtml(pageNameArg) +
            '</b>인 페이지를 찾지 못했습니다.',
        );
        return;
      }
      config.pageMode = 'stored';
      config.pageId = page.id;
      config.pageName = page.get('name');
      whisperGm(
        '별도 대사창 적용 페이지: <b>' +
          escapeHtml(page.get('name')) +
          '</b>',
      );
      return;
    }

    whisperGm(
      '페이지 설정을 확인해 주세요. <code>!dialog-page status</code>',
    );
  }

  function initState() {
    state.DialogOverlay = state.DialogOverlay || {};
    if (!state.DialogOverlay.pageMode)
      state.DialogOverlay.pageMode = SETTING.PAGE_MODE || 'ribbon';
    if (!state.DialogOverlay.pageName && SETTING.PAGE_NAME)
      state.DialogOverlay.pageName = SETTING.PAGE_NAME;
    if (!state.DialogOverlay.pageId && SETTING.PAGE_ID)
      state.DialogOverlay.pageId = SETTING.PAGE_ID;
  }

  function pageConfig() {
    initState();
    return state.DialogOverlay;
  }

  function findPageByName(name) {
    var target = String(name || '')
      .trim()
      .toLowerCase();
    var pages = (findObjs({ _type: 'page' }) || []).concat(
      findObjs({ type: 'page' }) || [],
    );
    for (var i = 0; i < pages.length; i++) {
      if (
        String(pages[i].get('name') || '')
          .trim()
          .toLowerCase() === target
      )
        return pages[i];
    }
    return null;
  }

  function selectedPageIdFromMessage(msg) {
    if (!msg || !msg.selected || !msg.selected.length) return '';
    for (var i = 0; i < msg.selected.length; i++) {
      var sel = msg.selected[i];
      var obj = getObj(sel._type || sel.type || 'graphic', sel._id);
      if (obj && obj.get && obj.get('_pageid')) return obj.get('_pageid');
    }
    return '';
  }

  function pageName(pageId) {
    var page = pageId ? getObj('page', pageId) : null;
    return page ? page.get('name') : '(없음)';
  }

  function cleanupDialog() {
    if (activeTimer) clearTimeout(activeTimer);
    if (activeInterval) clearInterval(activeInterval);
    activeTimer = null;
    activeInterval = null;

    while (activeObjects.length > 0) {
      safeRemove(activeObjects.pop());
    }
  }

  function cleanImageUrl(url) {
    return String(url || '')
      .replace('max.png', 'thumb.png')
      .replace('med.png', 'thumb.png')
      .replace('max.jpg', 'thumb.jpg')
      .replace('med.jpg', 'thumb.jpg')
      .replace('max.jpeg', 'thumb.jpeg')
      .replace('med.jpeg', 'thumb.jpeg')
      .replace('max.webp', 'thumb.webp')
      .replace('med.webp', 'thumb.webp');
  }

  function safeToFront(obj) {
    if (objectExists(obj)) toFront(obj);
  }

  function safeRemove(obj) {
    if (objectExists(obj)) obj.remove();
  }

  function objectExists(obj) {
    if (!obj || !obj.get) return false;
    var type = obj.get('_type') || obj.get('type');
    var id = obj.get('_id') || obj.get('id');
    return !!(type && id && getObj(type, id));
  }

  function stripMarkdown(text) {
    return String(text || '')
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/___([^_]+)___/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1');
  }

  function wrapText(text, maxChars) {
    var result = '';
    var lineLength = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === '\n') {
        result += ch;
        lineLength = 0;
        continue;
      }
      result += ch;
      lineLength++;
      if (lineLength >= maxChars) {
        result += '\n';
        lineLength = 0;
      }
    }
    return result;
  }

  function statusHtml() {
    return (
      '<div style="border:1px solid #111;background:#fff;padding:8px">' +
      '<b>별도 대사창 설정</b><br>' +
      '표시 화자: <b>' +
      escapeHtml(SETTING.ALLOWED_NAMES.join(', ')) +
      '</b><br>' +
      '적용 페이지: <b>' +
      escapeHtml(pageName(resolveTargetPageId())) +
      '</b><br>' +
      '효과음: <b>' +
      (SETTING.SFX_ENABLED ? '사용' : '사용 안 함') +
      '</b><br><code>' +
      escapeHtml(SETTING.TEST_COMMAND) +
      ' 스크립트</code> 미리보기' +
      '</div>'
    );
  }

  function pageStatusHtml() {
    return (
      '<div style="border:1px solid #111;background:#fff;padding:8px">' +
      '<b>별도 대사창 적용 페이지</b><br>' +
      '현재: <b>' +
      escapeHtml(pageName(resolveTargetPageId())) +
      '</b><br>' +
      '<div style="margin-top:6px"><code>!dialog-page here</code> 선택한 토큰이 있는 페이지</div>' +
      '<div><code>!dialog-page Start</code> Start 페이지</div>' +
      '<div><code>!dialog-page name 새 페이지 1</code> 이름으로 선택</div>' +
      '<div><code>!dialog-page ribbon</code> 플레이어 리본이 있는 페이지</div>' +
      '<div><code>!dialog-page reset</code> 처음 설정으로 복구</div>' +
      '</div>'
    );
  }

  function registerIcecandyHelp() {
    state.IcecandyScriptHelp = state.IcecandyScriptHelp || { scripts: {} };
    state.IcecandyScriptHelp.scripts = state.IcecandyScriptHelp.scripts || {};
    state.IcecandyScriptHelp.scripts['dialog-overlay'] = {
      id: 'dialog-overlay',
      group: '연출',
      order: 90,
      name: '별도 대사창',
      description: '설정한 화자의 채팅을 별도 대사창에 표시',
      commands: [
        {
          command: SETTING.TEST_COMMAND + ' <대사>',
          description: '별도 대사창 미리보기',
          gmOnly: true,
        },
        {
          command: SETTING.CLEAN_COMMAND,
          description: '별도 대사창 닫기',
          gmOnly: true,
        },
        {
          command: SETTING.STATUS_COMMAND,
          description: '현재 설정 확인',
          gmOnly: true,
        },
        {
          command: SETTING.PAGE_COMMAND + ' Start|here|name <페이지>|ribbon',
          description: '적용 페이지 변경',
          gmOnly: true,
        },
      ],
      details: [
        '일반 채팅과 /em 대사를 자동 표시',
        '화자: ' + escapeHtml(SETTING.ALLOWED_NAMES.join(', ')),
        '적용 페이지: ' + escapeHtml(SETTING.PAGE_NAME),
        '라운드, 판정, 핸드아웃 공개 문구에 설정된 효과음 재생',
      ],
    };
  }

  function debugReject(reason, msg) {
    if (SETTING.DEBUG_TO_GM)
      whisperGm(
        '별도 대사창 제외: ' +
          escapeHtml(reason) +
          ' / 화자: ' +
          escapeHtml(msg && msg.who),
      );
    return false;
  }

  function isGm(msg) {
    return msg && playerIsGM(msg.playerid);
  }

  function numberOr(value, fallback) {
    var n = parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  function whisperGm(content) {
    sendChat(API, '/w gm ' + content, null, { noarchive: true });
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
