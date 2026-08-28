/*
 * Scene Suite 08 - Cutin Director 1.6.1
 * 제작 및 통합: @EOOOOORK
 * 연출 아이디어 참고: 젠트의 주사위 판정 컷인, 똣의 범용 컷인 API
 * https://lise1415622.tistory.com/52
 * https://www.postype.com/@ttospt/post/21806654
 * 카드덱, 핸드아웃, 나레이터 연동 별도 구현
 */
var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};
(function () {
  'use strict';

  // ===== 사용자 설정 =====
  var SETTING = {
    enabled: true,
    command: '!컷인',
    deckName: 'cutin',
    macroName: '🎬컷인',
    managerName: '[GM] 컷인 관리',
    areaName: 'cutin_area',
    overlayName: 'cutin_overlay',
    overlayImageUrl: '',
    layer: 'objects',
    defaultWidth: 700,
    defaultHeight: 280,
    defaultDuration: 4000,
    speaker: '컷인',
  };

  // ===== 실행 상태 =====
  var activeTimer = null;
  var activeNarratorLines = 0;
  var activeFinalLineDuration = SETTING.defaultDuration;
  var activeCaptionInterval = null;
  var activeCaptionEnabled = false;
  var macroTimer = null;
  var managerTimer = null;
  var frontRetryTimer = null;
  var SHEET_OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  on('ready', function () {
    if (!SETTING.enabled) return;
    initState();
    captureOverlayGuides();
    registerAdapter();
    var handout = KIBScene.adapters && KIBScene.adapters.handout;
    if (handout && typeof handout.refresh === 'function') handout.refresh();
    cleanupStaleGraphics();
    clearActive(false);
    cutinRefreshSafe(true);
  });

  on('chat:message', function (msg) {
    if (!SETTING.enabled || !msg) return;
    try {
      if (msg.type === 'api') {
        if (!playerIsGM(msg.playerid)) return;
        var content = String(msg.content || '');
        if (content.indexOf(SETTING.command) !== 0) return;
        handleCommand(content.substring(SETTING.command.length).trim(), msg);
        return;
      }
      handleAutomaticTrigger(msg);
    } catch (err) {
      whisper(
        '<b>컷인 명령 오류</b><br><code>!컷인 help</code>에서 형식을 확인해 주세요.<br><span style="font-size:11px">오류: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  });

  [
    'add:card',
    'change:card',
    'destroy:card',
    'add:deck',
    'change:deck',
    'destroy:deck',
  ].forEach(function (eventName) {
    on(eventName, scheduleRefresh);
  });
  on('destroy:handout', function (handout) {
    initState();
    if (state.KIBSceneCutin.managerId === handout.id)
      state.KIBSceneCutin.managerId = '';
    pruneState();
    scheduleManager();
  });
  on('destroy:jukeboxtrack', function (track) {
    initState();
    Object.keys(state.KIBSceneCutin.audioLinks).forEach(function (cardId) {
      if (state.KIBSceneCutin.audioLinks[cardId] === track.id)
        delete state.KIBSceneCutin.audioLinks[cardId];
    });
    refreshHelp();
  });
  on('destroy:graphic', function (graphic) {
    if (!state.KIBSceneCutin) return;
    if (state.KIBSceneCutin.activeOverlayId === graphic.id) {
      state.KIBSceneCutin.activeOverlayId = '';
      return;
    }
    if (state.KIBSceneCutin.activeGraphicId !== graphic.id) return;
    var overlay = state.KIBSceneCutin.activeOverlayId
      ? getObj('graphic', state.KIBSceneCutin.activeOverlayId)
      : null;
    state.KIBSceneCutin.activeGraphicId = '';
    state.KIBSceneCutin.activeOverlayId = '';
    state.KIBSceneCutin.activeTrackId = '';
    if (activeCaptionEnabled)
      suppressVisualDialogue(false, graphic.get('_pageid'));
    activeCaptionEnabled = false;
    clearCaption();
    if (overlay) overlay.remove();
    if (activeTimer) clearTimeout(activeTimer);
    activeTimer = null;
    activeNarratorLines = 0;
    activeFinalLineDuration = SETTING.defaultDuration;
  });
  on('destroy:text', function (text) {
    if (!state.KIBSceneCutin || state.KIBSceneCutin.activeCaptionId !== text.id)
      return;
    state.KIBSceneCutin.activeCaptionId = '';
    if (activeCaptionInterval) clearInterval(activeCaptionInterval);
    activeCaptionInterval = null;
  });
  on('add:graphic', keepActiveAboveNewObject);
  on('add:text', keepActiveAboveNewObject);

  function registerAdapter() {
    var adapter = {
      meta: { code: '08_cutin_director.js', title: '컷인' },
      aliases: { 컷인: '', cutin: '' },
      cue: function (args, context) {
        var stopped = parseStop(args);
        if (stopped) {
          if (!stopped.ok) return stopped;
          clearActive(true);
          return { ok: true, stopped: true };
        }
        var parsed = parsePlay(args, context || {});
        return parsed.ok ? show(parsed) : parsed;
      },
      validate: function (args, context) {
        return parseStop(args) || parsePlay(args, context || {});
      },
      events: {
        'narrator:prepare': function (payload) {
          if (
            payload.parsed &&
            payload.parsed.cues.some(function (cue) {
              return cue.type === 'cutin';
            })
          )
            return { ok: true };
          return automaticCueForText(payload.parsed ? payload.parsed.text : '');
        },
        'narrator:line': advanceNarratorLine,
        'sheet:result': playSheetResult,
      },
      onNarratorLine: advanceNarratorLine,
      status: function () {
        initState();
        return {
          defaultWidth: state.KIBSceneCutin.defaultWidth,
          defaultHeight: state.KIBSceneCutin.defaultHeight,
        };
      },
      handoutControls: handoutControls,
      saveHandoutSize: saveHandoutSize,
      bringToFront: bringActiveToFront,
      sheetControls: sheetControlsHtml,
      refreshSheetControls: refreshManagerSoon,
      help: [
        '<code>@컷인 카드명|3초</code>',
        '<code>@컷인 카드명|줄=3</code>',
        '<code>@컷인 핸드아웃|자료명|3초</code>',
        '<code>@컷인 URL|Roll20이미지주소|3초</code>',
        '<code>@컷인 중지</code>',
        '<code>!컷인 시트연결목록</code>',
      ],
    };
    if (typeof KIBScene.register === 'function')
      KIBScene.register('cutin', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.cutin = adapter;
      KIBScene.handlers.cutin = adapter.cue;
    }
  }

  function handleCommand(source, msg) {
    var parts = String(source || '')
      .split('|')
      .map(trim)
      .filter(Boolean);
    var action = String(parts.shift() || 'help')
      .replace(/\s+/g, '')
      .toLowerCase();
    if (action === '재생' || action === 'play') {
      var parsed = parsePlay(parts, {});
      if (!parsed.ok) return whisper(parsed.error);
      var shown = show(parsed);
      if (!shown.ok) whisper(shown.error);
      return;
    }
    if (
      action === '중지' ||
      action === '정리' ||
      action === 'stop' ||
      action === 'clear'
    ) {
      clearActive(true);
      return;
    }
    if (action === '설정') return saveDuration(parts);
    if (action === '기본크기' || action === '크기')
      return saveDefaultSize(parts);
    if (action === '부류크기' || action === '그룹크기')
      return saveGroupSize(parts);
    if (action === '비율') return saveRatio(parts, msg || {});
    if (action === '핸드아웃크기') return saveHandoutSize(parts);
    if (action === '자막크기' || action === '스크립트크기')
      return saveCaptionSize(parts);
    if (action === '자막위치' || action === '스크립트위치')
      return saveCaptionPosition(parts);
    if (action === '관리' || action === '갱신') {
      refreshManager();
      return whisper(managerLink());
    }
    if (action === '대사추가') return changeTextRules(parts, false);
    if (action === '대사삭제') return changeTextRules(parts, true);
    if (action === '대사목록') return whisper(ruleStatus(parts[0]));
    if (action === '시트연결') return bindSheetCutin(parts);
    if (action === '시트연결해제') return unbindSheetCutin(parts);
    if (action === '시트연결목록') return whisper(sheetRuleStatus());
    if (action === '연결') return bindAudio(parts);
    if (action === '연결해제') return unbindAudio(parts);
    if (action === '연결목록') return whisper(linkStatus());
    if (action === '매크로갱신')
      return whisper('컷인 매크로: ' + updateMacro() + '개');
    if (
      action === 'help' ||
      action === '도움말' ||
      action === '상태' ||
      action === '목록'
    )
      return whisper(helpHtml());

    var shorthand = parsePlay([action].concat(parts), {});
    if (!shorthand.ok) return whisper(shorthand.error);
    var result = show(shorthand);
    if (!result.ok) whisper(result.error);
  }

  function parseStop(args) {
    var values = (args || []).map(trim).filter(Boolean);
    if (
      !values.some(function (value) {
        return /^(?:중지|정리|stop|clear)$/i.test(value);
      })
    )
      return null;
    if (
      values.some(function (value) {
        return !/^(?:중지|정리|stop|clear|전체|all)$/i.test(value);
      })
    ) {
      return {
        ok: false,
        error:
          '컷인은 한 번에 하나만 표시하므로 중지할 이름을 따로 적지 않습니다.',
      };
    }
    return { ok: true, stop: true };
  }

  function parsePlay(args, context) {
    initState();
    var values = (args || []).map(trim).filter(Boolean);
    if (values[0] && /^(?:재생|play)$/i.test(values[0])) values.shift();
    if (!values.length)
      return {
        ok: false,
        error: '재생할 컷인 카드, 핸드아웃 또는 이미지 주소가 없습니다.',
      };

    var sourceType = 'card';
    if (/^(?:핸드아웃|handout|자료)$/i.test(values[0])) {
      sourceType = 'handout';
      values.shift();
    } else if (/^(?:url|주소|이미지)$/i.test(values[0])) {
      sourceType = 'url';
      values.shift();
    } else if (/^https?:\/\//i.test(values[0])) sourceType = 'url';
    if (!values[0])
      return { ok: false, error: '컷인 원본 이름이나 주소가 없습니다.' };

    var reference = values.shift();
    var source =
      sourceType === 'handout'
        ? findHandout(reference)
        : sourceType === 'url'
          ? fromUrl(reference)
          : findCard(reference);
    if (!source.ok) return source;
    var size = sourceSize(source);
    if (!size.ok) return size;

    var duration =
      (source.card && Number(state.KIBSceneCutin.durations[source.card.id])) ||
      0;
    var explicitDuration = false;
    var narratorLines = null;
    var invalidOption = '';
    values.forEach(function (value) {
      var parsedDuration = parseDuration(value);
      var parsedLines = parseNarratorLines(value);
      if (parsedLines !== null) narratorLines = parsedLines;
      else if (parsedDuration !== null) {
        duration = parsedDuration;
        explicitDuration = true;
      } else invalidOption = value;
    });
    if (invalidOption)
      return {
        ok: false,
        error: '컷인 옵션을 이해하지 못했습니다: ' + escapeHtml(invalidOption),
      };
    if (narratorLines !== null && explicitDuration)
      return { ok: false, error: '컷인 시간과 줄 수는 하나만 사용하세요.' };
    if (
      narratorLines !== null &&
      !Object.prototype.hasOwnProperty.call(context || {}, 'text')
    ) {
      return {
        ok: false,
        error: '줄 수 표시는 나레이터의 @컷인에서만 사용할 수 있습니다.',
      };
    }
    if (
      narratorLines !== null &&
      !(narratorLines >= 1 && narratorLines <= 100)
    ) {
      return { ok: false, error: '컷인 표시 줄 수는 1~100줄이어야 합니다.' };
    }
    if (!explicitDuration && !duration) {
      duration =
        context && context.text && typeof KIBScene.get === 'function'
          ? Number(KIBScene.get('timing.lineInterval', SETTING.defaultDuration))
          : SETTING.defaultDuration;
    }
    if (narratorLines !== null && typeof KIBScene.get === 'function')
      duration = Number(
        KIBScene.get('timing.lineInterval', SETTING.defaultDuration),
      );
    if (!(duration >= 100 && duration <= 600000))
      return { ok: false, error: '컷인 표시 시간은 0.1초~600초여야 합니다.' };

    var page = getObj('page', Campaign().get('playerpageid'));
    if (!page)
      return { ok: false, error: '현재 플레이어 페이지를 찾지 못했습니다.' };
    var areas =
      findObjs({
        _type: 'graphic',
        name: SETTING.areaName,
        _pageid: page.id,
      }) || [];
    if (areas.length > 1)
      return {
        ok: false,
        error:
          '현재 페이지에 <b>' +
          SETTING.areaName +
          '</b> 토큰이 여러 개 있습니다.',
      };
    var rawBounds = areas[0]
      ? boundsFromGraphic(areas[0])
      : boundsFromPage(page);
    var bounds = areas[0]
      ? fitBounds(rawBounds, size.ratio)
      : size.natural
        ? boundsFromNaturalSize(page, size)
        : fitBounds(rawBounds, size.ratio);
    if (!(bounds.width > 0 && bounds.height > 0))
      return { ok: false, error: '컷인 표시 영역의 크기가 올바르지 않습니다.' };
    var overlayResult = findOverlay(page);
    if (!overlayResult.ok) return overlayResult;

    var trackId = source.card
      ? state.KIBSceneCutin.audioLinks[source.card.id]
      : '';
    if (trackId && !getObj('jukeboxtrack', trackId))
      return { ok: false, error: '컷인에 연결한 효과음이 삭제되었습니다.' };
    if (trackId && !cutinHasPlugin('audio')) {
      return {
        ok: false,
        error: '연결한 효과음을 재생하려면 02 오디오 코드가 필요합니다.',
      };
    }
    return {
      ok: true,
      source: source,
      page: page,
      bounds: bounds,
      overlay: overlayResult,
      duration: duration,
      narratorLines: narratorLines || 0,
      trackId: trackId,
      captionEnabled: !!(source.handout && context && context.narrator),
      captionText:
        context && context.narrator
          ? captionText(context.text, context.chatType)
          : '',
    };
  }

  function show(parsed) {
    clearActive(true);
    var layer = cutinLayer();
    var overlay = createObj('graphic', {
      _pageid: parsed.page.id,
      imgsrc: parsed.overlay.imgsrc,
      name: 'sd_cutin:overlay',
      left: parsed.overlay.bounds.left,
      top: parsed.overlay.bounds.top,
      width: parsed.overlay.bounds.width,
      height: parsed.overlay.bounds.height,
      layer: layer,
      isdrawing: true,
      disableSnapping: true,
      disableTokenMenu: true,
    });
    if (!overlay)
      return {
        ok: false,
        error:
          '컷인 뒤 배경을 만들지 못했습니다. <b>' +
          SETTING.overlayName +
          '</b> 토큰이나 오버레이 이미지 주소를 확인하세요.',
      };
    var graphic = createObj('graphic', {
      _pageid: parsed.page.id,
      imgsrc: parsed.source.imgsrc,
      name: 'sd_cutin:' + parsed.source.key,
      left: parsed.bounds.left,
      top: parsed.bounds.top,
      width: parsed.bounds.width,
      height: parsed.bounds.height,
      layer: layer,
      isdrawing: true,
      disableSnapping: true,
      disableTokenMenu: true,
    });
    if (!graphic) {
      overlay.remove();
      return {
        ok: false,
        error:
          '컷인 그림을 만들지 못했습니다. 카드 또는 핸드아웃 표지 이미지를 확인해 주세요.',
      };
    }

    state.KIBSceneCutin.activeGraphicId = graphic.id;
    state.KIBSceneCutin.activeOverlayId = overlay.id;
    state.KIBSceneCutin.activeTrackId = parsed.trackId || '';
    activeNarratorLines = parsed.narratorLines || 0;
    activeFinalLineDuration = parsed.duration;
    activeCaptionEnabled = parsed.captionEnabled === true;
    if (activeCaptionEnabled) suppressVisualDialogue(true, parsed.page.id);
    if (activeCaptionEnabled && parsed.captionText)
      showCaption(parsed.page, parsed.captionText);
    bringActiveToFront();
    scheduleFrontRetry();

    if (parsed.trackId) {
      var audioResult = cutinCall('audio', 'cue', [
        ['재생', 'id:' + parsed.trackId, '1회'],
        {},
      ]);
      if (audioResult && audioResult.ok === false) {
        clearActive(false);
        return audioResult;
      }
    }
    if (!activeNarratorLines || activeNarratorLines === 1) {
      activeTimer = setTimeout(function () {
        clearActive(false);
      }, parsed.duration);
    }
    return {
      ok: true,
      id: graphic.id,
      duration: parsed.duration,
      narratorLines: activeNarratorLines,
    };
  }

  function advanceNarratorLine(payload) {
    if (!state.KIBSceneCutin.activeGraphicId) return { ok: true };
    if (!activeNarratorLines) {
      updateCaptionFromNarrator(payload);
      bringActiveToFront();
      return { ok: true };
    }
    if (activeNarratorLines === 1) {
      clearActive(false);
      return { ok: true };
    }
    updateCaptionFromNarrator(payload);
    activeNarratorLines--;
    if (activeNarratorLines === 1) {
      if (activeTimer) clearTimeout(activeTimer);
      activeTimer = setTimeout(function () {
        clearActive(false);
      }, activeFinalLineDuration);
    }
    bringActiveToFront();
    return { ok: true };
  }

  function bringActiveToFront() {
    initState();
    var overlay = state.KIBSceneCutin.activeOverlayId
      ? getObj('graphic', state.KIBSceneCutin.activeOverlayId)
      : null;
    var graphic = state.KIBSceneCutin.activeGraphicId
      ? getObj('graphic', state.KIBSceneCutin.activeGraphicId)
      : null;
    var caption = state.KIBSceneCutin.activeCaptionId
      ? getObj('text', state.KIBSceneCutin.activeCaptionId)
      : null;
    if (overlay) toFront(overlay);
    if (graphic) toFront(graphic);
    if (caption) toFront(caption);
    return !!(overlay || graphic || caption);
  }

  function keepActiveAboveNewObject(item) {
    if (!item || !state.KIBSceneCutin) return;
    var graphic = state.KIBSceneCutin.activeGraphicId
      ? getObj('graphic', state.KIBSceneCutin.activeGraphicId)
      : null;
    if (!graphic || item.get('_pageid') != graphic.get('_pageid')) return;
    if (
      item.id == state.KIBSceneCutin.activeGraphicId ||
      item.id == state.KIBSceneCutin.activeOverlayId ||
      item.id == state.KIBSceneCutin.activeCaptionId
    )
      return;
    bringActiveToFront();
    scheduleFrontRetry();
  }

  function scheduleFrontRetry() {
    if (frontRetryTimer) clearTimeout(frontRetryTimer);
    frontRetryTimer = setTimeout(function () {
      frontRetryTimer = null;
      bringActiveToFront();
    }, 1000);
  }

  function clearActive(stopAudio) {
    initState();
    if (activeTimer) clearTimeout(activeTimer);
    activeTimer = null;
    if (frontRetryTimer) clearTimeout(frontRetryTimer);
    frontRetryTimer = null;
    var graphic = state.KIBSceneCutin.activeGraphicId
      ? getObj('graphic', state.KIBSceneCutin.activeGraphicId)
      : null;
    var overlay = state.KIBSceneCutin.activeOverlayId
      ? getObj('graphic', state.KIBSceneCutin.activeOverlayId)
      : null;
    var pageId = graphic
      ? graphic.get('_pageid')
      : overlay
        ? overlay.get('_pageid')
        : '';
    state.KIBSceneCutin.activeGraphicId = '';
    state.KIBSceneCutin.activeOverlayId = '';
    if (activeCaptionEnabled) suppressVisualDialogue(false, pageId);
    clearCaption();
    if (overlay) overlay.remove();
    if (graphic) graphic.remove();
    if (
      stopAudio &&
      state.KIBSceneCutin.activeTrackId &&
      cutinHasPlugin('audio')
    ) {
      cutinCall('audio', 'cue', [
        ['중지', 'id:' + state.KIBSceneCutin.activeTrackId],
        {},
      ]);
    }
    state.KIBSceneCutin.activeTrackId = '';
    activeNarratorLines = 0;
    activeFinalLineDuration = SETTING.defaultDuration;
    activeCaptionEnabled = false;
  }

  function cleanupStaleGraphics() {
    (findObjs({ _type: 'graphic' }) || [])
      .filter(function (item) {
        return String(item.get('name') || '').indexOf('sd_cutin:') === 0;
      })
      .forEach(function (item) {
        item.remove();
      });
    var caption = state.KIBSceneCutin.activeCaptionId
      ? getObj('text', state.KIBSceneCutin.activeCaptionId)
      : null;
    state.KIBSceneCutin.activeCaptionId = '';
    if (caption) caption.remove();
  }

  function updateCaptionFromNarrator(payload) {
    if (!activeCaptionEnabled || !payload || !payload.prepared) return;
    var lines = payload.prepared
      .map(function (item) {
        return captionText(
          item.parsed && item.parsed.text,
          item.context && item.context.chatType,
        );
      })
      .filter(Boolean);
    if (!lines.length) return;
    var graphic = getObj('graphic', state.KIBSceneCutin.activeGraphicId);
    var page = graphic && getObj('page', graphic.get('_pageid'));
    if (page) showCaption(page, lines.join('\n'));
  }

  function showCaption(page, value) {
    var text = trim(value);
    if (!page || !text) return;
    if (activeCaptionInterval) clearInterval(activeCaptionInterval);
    activeCaptionInterval = null;
    var style = captionStyle();
    var layout = captionLayout(page, text, style.fontSize);
    var caption = state.KIBSceneCutin.activeCaptionId
      ? getObj('text', state.KIBSceneCutin.activeCaptionId)
      : null;
    var graphic = state.KIBSceneCutin.activeGraphicId
      ? getObj('graphic', state.KIBSceneCutin.activeGraphicId)
      : null;
    var layer = graphic ? graphic.get('layer') : cutinLayer();
    if (!caption) {
      caption = createObj('text', {
        _pageid: page.id,
        text: '',
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        font_size: style.fontSize,
        font_family: style.fontFamily,
        color: style.color,
        stroke: style.stroke,
        layer: layer,
      });
      if (!caption) return;
      state.KIBSceneCutin.activeCaptionId = caption.id;
    }
    caption.set({
      text: '',
      left: layout.left,
      top: layout.top,
      width: layout.width,
      height: layout.height,
      font_size: style.fontSize,
      font_family: style.fontFamily,
      color: style.color,
      stroke: style.stroke,
      layer: layer,
    });
    var characters = Array.from(layout.text);
    var shown = 0;
    var speed =
      typeof KIBScene.get === 'function'
        ? Number(KIBScene.get('timing.typeSpeed', 45))
        : 45;
    var intervalId = setInterval(
      function () {
        if (activeCaptionInterval !== intervalId || !getObj('text', caption.id))
          return;
        shown++;
        caption.set('text', characters.slice(0, shown).join(''));
        if (shown >= characters.length) {
          clearInterval(intervalId);
          if (activeCaptionInterval === intervalId)
            activeCaptionInterval = null;
        }
      },
      speed > 0 ? speed : 45,
    );
    activeCaptionInterval = intervalId;
  }

  function clearCaption() {
    if (activeCaptionInterval) clearInterval(activeCaptionInterval);
    activeCaptionInterval = null;
    var caption = state.KIBSceneCutin.activeCaptionId
      ? getObj('text', state.KIBSceneCutin.activeCaptionId)
      : null;
    state.KIBSceneCutin.activeCaptionId = '';
    if (caption) caption.remove();
  }

  function captionStyle() {
    var config = {};
    var vd = KIBScene.adapters && KIBScene.adapters.vd;
    try {
      config =
        vd && typeof vd.status === 'function' ? vd.status().config || {} : {};
    } catch (ignore) {}
    return {
      fontSize: state.KIBSceneCutin.captionFontSize,
      fontFamily: config.font_family || 'Arial',
      color: config.dialogue_font_color || '#ffffff',
      stroke:
        config.stroke_enabled === false
          ? 'transparent'
          : config.stroke_color || '#000000',
    };
  }

  function captionLayout(page, value, fontSize) {
    var pageWidth = Number(page.get('width')) * 70;
    var pageHeight = Number(page.get('height')) * 70;
    var width = Math.max(fontSize * 4, pageWidth * 0.84);
    var text = wrapCaption(
      value,
      Math.max(4, Math.floor(width / (fontSize * 0.9))),
    );
    var height = Math.max(
      fontSize * 1.5,
      text.split('\n').length * fontSize * 1.5,
    );
    var top = pageHeight * 0.82 + state.KIBSceneCutin.captionOffsetY;
    top = Math.max(height / 2, Math.min(pageHeight - height / 2, top));
    return {
      text: text,
      left: pageWidth / 2,
      top: top,
      width: width,
      height: height,
    };
  }

  function wrapCaption(value, maxChars) {
    var result = '';
    var lineLength = 0;
    Array.from(String(value || '')).forEach(function (character) {
      if (character === '\n') {
        result += character;
        lineLength = 0;
        return;
      }
      if (lineLength >= maxChars) {
        result += '\n';
        lineLength = 0;
      }
      result += character;
      lineLength++;
    });
    return result;
  }

  function captionText(value, type) {
    var text = String(value || '').replace(/^\s*\/(?:desc|em)\b\s*/i, '');
    var vd = KIBScene.adapters && KIBScene.adapters.vd;
    try {
      if (vd && typeof vd.sanitize === 'function')
        text = vd.sanitize(text, type);
    } catch (ignore) {}
    var decorated = text.match(/^\s*\[([\s\S]*)\]\(\s*#"[\s\S]*\)\s*$/);
    if (decorated) text = decorated[1];
    return decodeHtml(
      text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ' '),
    )
      .split('\n')
      .map(function (line) {
        return line.replace(/\s+/g, ' ').trim();
      })
      .filter(Boolean)
      .join('\n');
  }

  function findCard(reference) {
    var decks = findObjs({ _type: 'deck', name: SETTING.deckName }) || [];
    if (!decks.length)
      return {
        ok: false,
        error: '이름이 <b>' + SETTING.deckName + '</b>인 카드덱이 없습니다.',
      };
    if (decks.length > 1)
      return {
        ok: false,
        error:
          '이름이 <b>' + SETTING.deckName + '</b>인 카드덱이 여러 개입니다.',
      };
    var ref = trim(reference).replace(/^card:/, 'id:');
    var cards;
    if (ref.indexOf('id:') === 0) {
      var byId = getObj('card', ref.substring(3));
      cards = byId && byId.get('_deckid') === decks[0].id ? [byId] : [];
    } else {
      var byObjectId = getObj('card', ref);
      if (byObjectId && byObjectId.get('_deckid') === decks[0].id)
        cards = [byObjectId];
      else {
        var allCards = findObjs({ _type: 'card', _deckid: decks[0].id }) || [];
        var wanted = normalizeText(ref);
        cards = allCards.filter(function (card) {
          var info = cardInfo(card);
          return (
            normalizeText(card.get('name')) === wanted ||
            normalizeText(info.name) === wanted
          );
        });
        if (!cards.length)
          cards = allCards.filter(function (card) {
            return normalizeText(cardInfo(card).shortName) === wanted;
          });
      }
    }
    if (!cards.length)
      return {
        ok: false,
        error: 'cutin 덱에서 카드를 찾지 못했습니다: ' + escapeHtml(ref),
      };
    if (cards.length > 1)
      return {
        ok: false,
        error:
          '짧은 이름이 겹치는 컷인이 여러 개입니다. 전체 이름을 입력하세요: ' +
          escapeHtml(ref),
      };
    var imgsrc = cleanImageUrl(cards[0].get('avatar'));
    if (!imgsrc)
      return {
        ok: false,
        error:
          '컷인 카드 앞면에 Roll20 라이브러리 이미지가 없습니다: ' +
          escapeHtml(cards[0].get('name')),
      };
    return {
      ok: true,
      key: 'card:' + cards[0].id,
      imgsrc: imgsrc,
      card: cards[0],
      deck: decks[0],
      info: cardInfo(cards[0]),
    };
  }

  function findHandout(reference) {
    var ref = trim(reference).replace(/^handout:/, 'id:');
    var handouts;
    if (ref.indexOf('id:') === 0) {
      var byId = getObj('handout', ref.substring(3));
      handouts = byId ? [byId] : [];
    } else {
      var direct = getObj('handout', ref);
      handouts = direct
        ? [direct]
        : findObjs({ _type: 'handout', name: ref }) || [];
    }
    if (!handouts.length)
      return {
        ok: false,
        error: '핸드아웃을 찾지 못했습니다: ' + escapeHtml(ref),
      };
    if (handouts.length > 1)
      return {
        ok: false,
        error: '같은 이름의 핸드아웃이 여러 개입니다: ' + escapeHtml(ref),
      };
    var imgsrc = cleanImageUrl(handouts[0].get('avatar'));
    if (!imgsrc)
      return {
        ok: false,
        error:
          '핸드아웃 <b>' +
          escapeHtml(handouts[0].get('name')) +
          '</b>에 표지 이미지가 없습니다.',
      };
    return {
      ok: true,
      key: 'handout:' + handouts[0].id,
      imgsrc: imgsrc,
      handout: handouts[0],
    };
  }

  function fromUrl(reference) {
    var imgsrc = cleanImageUrl(reference);
    return imgsrc
      ? { ok: true, key: 'url', imgsrc: imgsrc }
      : {
          ok: false,
          error:
            'Roll20 라이브러리에 올린 이미지 주소만 컷인으로 사용할 수 있습니다.',
        };
  }

  function sourceSize(source) {
    var saved = state.KIBSceneCutin.sourceRatios[source.key];
    if (source.info) {
      var groupSize = state.KIBSceneCutin.groupSizes[source.info.groupKey];
      if (groupSize && Number(groupSize.ratio) > 0)
        return {
          ok: true,
          width: Number(groupSize.width),
          height: Number(groupSize.height),
          ratio: Number(groupSize.ratio),
          natural: true,
        };
      if (source.info.size)
        return {
          ok: true,
          width: source.info.size.width,
          height: source.info.size.height,
          ratio: source.info.size.width / source.info.size.height,
          natural: true,
        };
      if (saved && Number(saved.ratio) > 0)
        return {
          ok: true,
          width: Number(saved.width),
          height: Number(saved.height),
          ratio: Number(saved.ratio),
          natural: true,
        };
      return {
        ok: false,
        error:
          '컷인 관리에서 <b>' +
          escapeHtml(source.info.group) +
          '</b> 그룹의 크기를 먼저 등록해 주세요.',
      };
    }
    if (saved && Number(saved.ratio) > 0)
      return {
        ok: true,
        width: Number(saved.width),
        height: Number(saved.height),
        ratio: Number(saved.ratio),
        natural: true,
      };
    if (source.handout) {
      return {
        ok: false,
        error:
          '핸드아웃 관리에서 이 표지 이미지의 원본 크기를 먼저 등록해 주세요.',
      };
    }
    var imageKey = canonicalImage(source.imgsrc);
    var graphic = (findObjs({ _type: 'graphic' }) || []).filter(
      function (item) {
        return (
          String(item.get('name') || '').indexOf('sd_cutin:') !== 0 &&
          canonicalImage(item.get('imgsrc')) === imageKey &&
          Number(item.get('width')) > 0 &&
          Number(item.get('height')) > 0
        );
      },
    )[0];
    if (graphic)
      return {
        ok: true,
        width: Number(graphic.get('width')),
        height: Number(graphic.get('height')),
        ratio: Number(graphic.get('width')) / Number(graphic.get('height')),
        natural: false,
      };
    return {
      ok: true,
      width: state.KIBSceneCutin.defaultWidth,
      height: state.KIBSceneCutin.defaultHeight,
      ratio:
        state.KIBSceneCutin.defaultWidth / state.KIBSceneCutin.defaultHeight,
      natural: false,
    };
  }

  function cardInfo(card) {
    var raw = trim(card && card.get('name'));
    var parsed = parseSizePrefix(raw);
    var name = parsed ? trim(raw.substring(parsed.length)) : raw;
    var pieces = name.split(/\s*[-\u2013\u2014]\s*/).filter(Boolean);
    var group = pieces.length > 1 ? pieces[0] : name || raw;
    return {
      name: name || raw,
      shortName: pieces.length > 1 ? pieces.slice(1).join('-') : name || raw,
      group: group,
      groupKey: normalizeText(group),
      size: parsed && parsed.size,
    };
  }

  function parseSizePrefix(value) {
    var match = trim(value).match(
      /^\[\s*(\d{1,5})\s*(?:\*|x|×)\s*(\d{1,5})\s*\]\s*/i,
    );
    if (!match) return null;
    var width = Number(match[1]);
    var height = Number(match[2]);
    return width >= 1 && height >= 1
      ? { length: match[0].length, size: { width: width, height: height } }
      : null;
  }

  function saveHandoutSize(args) {
    var values = (args || []).map(trim).filter(Boolean);
    if (!values[0] || !values[1])
      return whisper('사용법: <code>!컷인 핸드아웃크기|자료명|800*600</code>');
    var source = findHandout(values[0]);
    if (!source.ok) return whisper(source.error);
    var match = values[1].match(/^(\d{1,5})\s*(?:\*|x|×)\s*(\d{1,5})$/i);
    if (!match || !(Number(match[1]) > 0 && Number(match[2]) > 0))
      return whisper('크기는 <code>800*600</code>처럼 입력하세요.');
    var width = Number(match[1]);
    var height = Number(match[2]);
    state.KIBSceneCutin.sourceRatios[source.key] = {
      ratio: width / height,
      width: width,
      height: height,
    };
    scheduleManager();
    cutinCall('handout', 'refresh', []);
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(source.handout.get('name')) +
        '</b> 크기: ' +
        width +
        '*' +
        height,
    );
    return { ok: true };
  }

  function saveGroupSize(args) {
    initState();
    var values = (args || []).map(trim).filter(Boolean);
    if (!values[0] || !values[1])
      return whisper('사용법: <code>!컷인 그룹크기|그룹명|800*600</code>');
    var wanted = normalizeText(values[0]);
    var decks = findObjs({ _type: 'deck', name: SETTING.deckName }) || [];
    if (decks.length !== 1)
      return whisper(
        decks.length
          ? '<code>cutin</code> 덱이 여러 개입니다.'
          : '<code>cutin</code> 덱이 없습니다.',
      );
    var groups = (findObjs({ _type: 'card', _deckid: decks[0].id }) || [])
      .map(cardInfo)
      .filter(function (info, index, list) {
        return (
          list
            .map(function (item) {
              return item.groupKey;
            })
            .indexOf(info.groupKey) === index
        );
      });
    var info = groups.filter(function (item) {
      return item.groupKey === wanted;
    })[0];
    if (!info)
      return whisper(
        '<code>cutin</code> 덱에서 <b>' +
          escapeHtml(values[0]) +
          '</b> 그룹을 찾지 못했습니다.',
      );
    var match = values[1].match(/^(\d{1,5})\s*(?:\*|x|×)\s*(\d{1,5})$/i);
    if (!match || !(Number(match[1]) > 0 && Number(match[2]) > 0))
      return whisper('크기는 <code>800*600</code>처럼 입력하세요.');
    var width = Number(match[1]);
    var height = Number(match[2]);
    state.KIBSceneCutin.groupSizes[info.groupKey] = {
      width: width,
      height: height,
      ratio: width / height,
    };
    refreshManager();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(info.group) +
        '</b> 그룹 크기: ' +
        width +
        '*' +
        height,
    );
    return { ok: true };
  }

  function saveRatio(args, msg) {
    initState();
    var values = (args || []).map(trim).filter(Boolean);
    var sourceType = 'card';
    if (/^(?:핸드아웃|handout|자료)$/i.test(values[0])) {
      sourceType = 'handout';
      values.shift();
    } else if (/^(?:url|주소|이미지)$/i.test(values[0])) {
      sourceType = 'url';
      values.shift();
    }
    if (!values[0])
      return whisper(
        '같은 이미지 토큰을 선택한 뒤 <code>!컷인 비율|카드명</code> 또는 <code>!컷인 비율|핸드아웃|자료명</code>을 입력하세요.',
      );
    var reference = values.shift();
    var source =
      sourceType === 'handout'
        ? findHandout(reference)
        : sourceType === 'url'
          ? fromUrl(reference)
          : findCard(reference);
    if (!source.ok) return whisper(source.error);
    var width = Number(values[0]);
    var height = Number(values[1]);
    if (!(width > 0 && height > 0)) {
      var selected = (msg.selected || [])
        .map(function (item) {
          return getObj('graphic', item._id);
        })
        .filter(Boolean);
      if (selected.length !== 1)
        return whisper(
          '같은 이미지의 토큰 하나를 선택하거나 가로와 세로를 함께 입력하세요.',
        );
      if (
        canonicalImage(selected[0].get('imgsrc')) !==
        canonicalImage(source.imgsrc)
      )
        return whisper('선택한 토큰과 등록할 컷인의 이미지가 다릅니다.');
      width = Number(selected[0].get('width'));
      height = Number(selected[0].get('height'));
    }
    if (!(width > 0 && height > 0))
      return whisper('원본 가로와 세로를 확인하지 못했습니다.');
    state.KIBSceneCutin.sourceRatios[source.key] = {
      ratio: width / height,
      width: width,
      height: height,
    };
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(reference) +
        '</b> 원본 비율: ' +
        width +
        ':' +
        height,
    );
  }

  function findOverlay(page) {
    var guides =
      findObjs({
        _type: 'graphic',
        name: SETTING.overlayName,
        _pageid: page.id,
        layer: 'gmlayer',
      }) || [];
    if (guides.length > 1)
      return {
        ok: false,
        error:
          '현재 페이지에 <b>' +
          SETTING.overlayName +
          '</b> 토큰이 여러 개 있습니다.',
      };
    var imgsrc = guides[0] ? saveOverlayGuide(guides[0]) : '';
    imgsrc =
      imgsrc ||
      cleanImageUrl(state.KIBSceneCutin.overlayImages[page.id]) ||
      cleanImageUrl(SETTING.overlayImageUrl);
    if (!imgsrc)
      return {
        ok: false,
        error:
          '컷인 뒤 배경 이미지가 없습니다. GM 레이어에 <b>' +
          SETTING.overlayName +
          '</b> 토큰을 하나 두거나 배경 이미지 주소를 설정하세요.',
      };
    return { ok: true, imgsrc: imgsrc, bounds: boundsFromFullPage(page) };
  }

  function captureOverlayGuides() {
    var pages = {};
    (
      findObjs({
        _type: 'graphic',
        name: SETTING.overlayName,
        layer: 'gmlayer',
      }) || []
    ).forEach(
      function (guide) {
        var pageId = trim(guide.get('_pageid'));
        if (!pageId) return;
        pages[pageId] = pages[pageId] || [];
        pages[pageId].push(guide);
      },
    );
    Object.keys(pages).forEach(function (pageId) {
      if (pages[pageId].length === 1) saveOverlayGuide(pages[pageId][0]);
    });
  }

  function saveOverlayGuide(guide) {
    var pageId = guide && trim(guide.get('_pageid'));
    var imgsrc = guide && cleanImageUrl(guide.get('imgsrc'));
    if (!pageId || !imgsrc) return '';
    state.KIBSceneCutin.overlayImages[pageId] = imgsrc;
    guide.remove();
    return imgsrc;
  }

  function saveDefaultSize(args) {
    initState();
    var values = (args || []).map(trim).filter(Boolean);
    if (/^(?:초기화|reset)$/i.test(values[0])) {
      state.KIBSceneCutin.defaultWidth = SETTING.defaultWidth;
      state.KIBSceneCutin.defaultHeight = SETTING.defaultHeight;
    } else {
      var width = Number(values[0]);
      var height = Number(values[1]);
      if (!(width >= 50 && width <= 10000 && height >= 50 && height <= 10000)) {
        return whisper('컷인 기본 가로와 세로는 각각 50~10000px로 입력하세요.');
      }
      state.KIBSceneCutin.defaultWidth = Math.round(width);
      state.KIBSceneCutin.defaultHeight = Math.round(height);
    }
    refreshHelp();
    whisper(
      '컷인 기본 크기: <b>' +
        state.KIBSceneCutin.defaultWidth +
        ' × ' +
        state.KIBSceneCutin.defaultHeight +
        'px</b>',
    );
  }

  function saveCaptionSize(args) {
    initState();
    var size = Number(args && args[0]);
    if (!(size >= 8 && size <= 100))
      return whisper('컷인 스크립트 크기는 8~100px로 입력하세요.');
    state.KIBSceneCutin.captionFontSize = Math.round(size);
    refreshManager();
    refreshHelp();
    whisper(
      '컷인 스크립트 크기: <b>' + state.KIBSceneCutin.captionFontSize + 'px</b>',
    );
  }

  function saveCaptionPosition(args) {
    initState();
    var offset = Number(args && args[0]);
    if (!isFinite(offset) || offset < -5000 || offset > 5000)
      return whisper(
        '컷인 스크립트 위치는 -5000~5000px로 입력하세요. 양수는 아래, 음수는 위입니다.',
      );
    state.KIBSceneCutin.captionOffsetY = Math.round(offset);
    refreshManager();
    refreshHelp();
    whisper(
      '컷인 스크립트 위치: <b>' +
        (offset >= 0 ? '+' : '') +
        state.KIBSceneCutin.captionOffsetY +
        'px</b>',
    );
  }

  function saveDuration(args) {
    if (!args[0] || !args[1])
      return whisper('사용법: <code>!컷인 설정|카드명|3초</code>');
    var source = findCard(args[0]);
    if (!source.ok) return whisper(source.error);
    var duration = parseDuration(args[1]);
    if (!(duration >= 100 && duration <= 600000))
      return whisper('컷인 표시 시간은 0.1초~600초여야 합니다.');
    state.KIBSceneCutin.durations[source.card.id] = duration;
    updateMacro();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(source.card.get('name')) +
        '</b> 표시 시간: ' +
        formatSeconds(duration),
    );
  }

  function bindAudio(args) {
    if (!args[0] || !args[1])
      return whisper('사용법: <code>!컷인 연결|카드명|효과음 제목</code>');
    var source = findCard(args[0]);
    if (!source.ok) return whisper(source.error);
    var track = findTrack(args[1]);
    if (!track.ok) return whisper(track.error);
    state.KIBSceneCutin.audioLinks[source.card.id] = track.value.id;
    scheduleManager();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(source.card.get('name')) +
        '</b> 효과음: <b>' +
        escapeHtml(track.value.get('title')) +
        '</b>',
    );
  }

  function unbindAudio(args) {
    var source = findCard(args[0]);
    if (!source.ok) return whisper(source.error);
    delete state.KIBSceneCutin.audioLinks[source.card.id];
    scheduleManager();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(source.card.get('name')) +
        '</b> 효과음: 없음',
    );
  }

  function findTrack(reference) {
    var ref = trim(reference);
    if (ref.indexOf('id:') === 0) {
      var byId = getObj('jukeboxtrack', ref.substring(3));
      return byId
        ? { ok: true, value: byId }
        : { ok: false, error: '효과음을 찾지 못했습니다.' };
    }
    var tracks = findObjs({ _type: 'jukeboxtrack', title: ref }) || [];
    if (!tracks.length)
      return {
        ok: false,
        error: '효과음을 찾지 못했습니다: ' + escapeHtml(ref),
      };
    if (tracks.length > 1)
      return {
        ok: false,
        error: '같은 제목의 효과음이 여러 개입니다: ' + escapeHtml(ref),
      };
    return { ok: true, value: tracks[0] };
  }

  function linkStatus() {
    var rows = Object.keys(state.KIBSceneCutin.audioLinks).map(
      function (cardId) {
        var card = getObj('card', cardId);
        var track = getObj(
          'jukeboxtrack',
          state.KIBSceneCutin.audioLinks[cardId],
        );
        return (
          escapeHtml(card ? card.get('name') : '(삭제된 카드)') +
          ' / ' +
          escapeHtml(track ? track.get('title') : '(삭제된 효과음)')
        );
      },
    );
    return rows.length
      ? '<b>컷인 효과음 연결</b><br>' + rows.join('<br>')
      : '연결된 컷인 효과음이 없습니다.';
  }

  function changeTextRules(args, removing) {
    initState();
    var values = (args || []).map(trim);
    var source = resolveRuleSource(values.shift());
    if (!source.ok) return whisper(source.error);
    var phrases = splitList(values.join('|'));
    if (!phrases.length)
      return whisper(
        '사용법: <code>!컷인 대사' +
          (removing ? '삭제' : '추가') +
          '|컷인명|문구1,문구2</code>',
      );
    var current = state.KIBSceneCutin.textRules[source.key] || [];
    var before = current.length;
    if (removing) {
      var removed = phrases.map(normalizeText);
      current = current.filter(function (phrase) {
        return removed.indexOf(normalizeText(phrase)) < 0;
      });
    } else
      phrases.forEach(function (phrase) {
        if (
          !current.some(function (saved) {
            return normalizeText(saved) === normalizeText(phrase);
          })
        )
          current.push(phrase);
      });
    if (removing && current.length === before)
      return whisper('삭제할 대사 연결을 찾지 못했습니다.');
    if (current.length) state.KIBSceneCutin.textRules[source.key] = current;
    else delete state.KIBSceneCutin.textRules[source.key];
    scheduleManager();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(sourceLabel(source)) +
        '</b><br>' +
        ruleStatusBySource(source),
    );
  }

  function handleAutomaticTrigger(msg) {
    initState();
    if (msg.type === 'whisper' || msg.playerid === 'API') return;
    if (msg.rolltemplate) return;
    var keys = [];
    if (/^(?:general|emote|desc)$/i.test(String(msg.type || ''))) {
      var text = normalizeDialogueText(msg.content);
      Object.keys(state.KIBSceneCutin.textRules).forEach(function (key) {
        if (
          (state.KIBSceneCutin.textRules[key] || []).some(function (phrase) {
            return normalizeText(phrase) === text;
          })
        )
          keys.push(key);
      });
    }
    keys = keys.filter(function (key, index) {
      return keys.indexOf(key) === index && !!sourceByKey(key);
    });
    if (!keys.length) return;
    if (keys.length > 1)
      return whisper(
        '같은 채팅에 서로 다른 컷인 ' +
          keys.length +
          '개가 연결되어 자동 재생하지 않았습니다.',
      );
    var source = sourceByKey(keys[0]);
    var parsed =
      source &&
      parsePlay(
        source.handout
          ? ['핸드아웃', 'id:' + source.handout.id]
          : ['id:' + source.card.id],
        {},
      );
    if (!parsed || !parsed.ok)
      return whisper(parsed ? parsed.error : '연결된 컷인이 삭제되었습니다.');
    var shown = show(parsed);
    if (!shown.ok) whisper(shown.error);
  }

  function automaticCueForText(text) {
    initState();
    var wanted = normalizeDialogueText(text);
    var keys = Object.keys(state.KIBSceneCutin.textRules).filter(
      function (key) {
        return (
          !!sourceByKey(key) &&
          (state.KIBSceneCutin.textRules[key] || []).some(function (phrase) {
            return normalizeText(phrase) === wanted;
          })
        );
      },
    );
    if (!keys.length) return { ok: true };
    if (keys.length > 1)
      return {
        ok: false,
        error:
          '같은 대사에 서로 다른 컷인 ' +
          keys.length +
          '개가 연결되어 있습니다.',
      };
    var source = sourceByKey(keys[0]);
    return {
      ok: true,
      cue: {
        type: 'cutin',
        args: source.handout
          ? ['핸드아웃', 'id:' + source.handout.id]
          : ['id:' + source.card.id],
        raw: '(대사 자동 컷인)',
      },
    };
  }

  function resolveRuleSource(reference) {
    var ref = trim(reference);
    var match = ref.match(/^(핸드아웃|handout|card|카드)\s*:(.+)$/i);
    if (match) {
      var idOrName = trim(match[2]);
      var objectType = /^(?:핸드아웃|handout)$/i.test(match[1])
        ? 'handout'
        : 'card';
      var object = getObj(objectType, idOrName);
      return objectType === 'handout'
        ? findHandout(object ? 'id:' + object.id : idOrName)
        : findCard(object ? 'id:' + object.id : idOrName);
    }
    var card = findCard(ref);
    var handout = findHandout(ref);
    if (card.ok && handout.ok)
      return {
        ok: false,
        error:
          '같은 이름의 카드와 핸드아웃이 모두 있습니다. <code>카드:</code> 또는 <code>핸드아웃:</code>을 앞에 붙이세요.',
      };
    return card.ok
      ? card
      : handout.ok
        ? handout
        : {
            ok: false,
            error:
              '컷인 카드나 표지 이미지가 있는 핸드아웃을 찾지 못했습니다: ' +
              escapeHtml(ref),
          };
  }

  function sourceByKey(key) {
    var match = String(key || '').match(/^(card|handout):(.+)$/);
    if (!match) return null;
    var object = getObj(match[1], match[2]);
    if (!object) return null;
    var imgsrc = cleanImageUrl(object.get('avatar'));
    if (!imgsrc) return null;
    if (match[1] === 'handout')
      return { ok: true, key: key, imgsrc: imgsrc, handout: object };
    var deck = getObj('deck', object.get('_deckid'));
    return deck && deck.get('name') === SETTING.deckName
      ? {
          ok: true,
          key: key,
          imgsrc: imgsrc,
          card: object,
          deck: deck,
          info: cardInfo(object),
        }
      : null;
  }

  function sourceLabel(source) {
    return source.card
      ? cardInfo(source.card).name
      : source.handout
        ? String(source.handout.get('name') || '')
        : source.key;
  }

  function rawSheetItems(items) {
    if (Array.isArray(items)) return items.slice();
    var sheet = KIBScene.adapters && KIBScene.adapters.sheet;
    return sheet && typeof sheet.cutinItems === 'function' ? sheet.cutinItems() : [];
  }

  function sheetItems(items) {
    var available = rawSheetItems(items);
    var outcomes = sheetOutcomes();
    available.forEach(function (item) {
      Object.keys(outcomes).forEach(function (outcome) {
        sheetRuleWithLegacy(item.key, outcome, item, available);
      });
    });
    return available;
  }

  function sheetRuleKey(itemKey, outcome) {
    return trim(itemKey) + '|' + trim(outcome);
  }

  function sheetOutcomes() {
    var sheet = KIBScene.adapters && KIBScene.adapters.sheet;
    var provided = sheet && typeof sheet.outcomes === 'function' ? sheet.outcomes() : null;
    return Object.assign({}, SHEET_OUTCOMES, provided || {});
  }

  function validSheetRule(rule) {
    return !!rule && !Array.isArray(rule) && typeof rule === 'object' &&
      trim(rule.itemKey) && trim(rule.outcome) && trim(rule.sourceKey) &&
      isFinite(Number(rule.duration));
  }

  function sheetChoiceQuery(label, choices) {
    if (!choices.length) return '';
    if (choices.length === 1) return safeQuery(choices[0].value);
    return '?{' + macroEscape(label) + choices.map(function (choice) {
      return '|' + macroEscape(choice.label) + ',' + macroEscape(choice.value);
    }).join('') + '}';
  }

  function sheetRulesForSource(sourceKey) {
    initState();
    return Object.keys(state.KIBSceneCutin.sheetRules).sort().map(function (key) {
      return state.KIBSceneCutin.sheetRules[key];
    }).filter(function (rule) {
      return validSheetRule(rule) && (!sourceKey || rule.sourceKey === sourceKey);
    });
  }

  function sheetUnbindButton(rule) {
    return button(
      '해제',
      SETTING.command + ' 시트연결해제|' + safeQuery(rule.itemKey) + '|' + safeQuery(rule.outcome),
      '#8b3940',
    );
  }

  function sheetBindButton(source, items) {
    var availableItems = sheetItems(items);
    if (!source || !source.card) return '';
    var itemQuery = sheetChoiceQuery('판정 항목', availableItems.map(function (item) {
      return { label: item.displayLabel || item.label, value: item.key };
    }));
    var outcomes = sheetOutcomes();
    var outcomeQuery = sheetChoiceQuery('판정 결과', Object.keys(outcomes).map(function (key) {
      return { label: outcomes[key], value: key };
    }));
    var controls = button(
      '판정 연결',
      SETTING.command + ' 시트연결|*|' + outcomeQuery + '|' + safeQuery(source.key) + '|?{표시 시간|4초}',
      '#7654a8',
    );
    if (itemQuery)
      controls += ' ' + button(
        '특정 판정 연결',
        SETTING.command + ' 시트연결|' + itemQuery + '|' + outcomeQuery + '|' + safeQuery(source.key) + '|?{표시 시간|4초}',
        '#53657d',
      );
    return controls;
  }

  function compactSheetRuleStatus(source) {
    var rules = sheetRulesForSource(source.key);
    var outcomes = sheetOutcomes();
    return rules.length
      ? '판정 연결:<br>' + rules.map(function (rule) {
          return '<b>' + escapeHtml(rule.itemLabel || rule.itemKey) + '</b> / ' +
            escapeHtml(outcomes[rule.outcome] || rule.outcome) + ' / ' +
            formatSeconds(rule.duration) + ' ' + sheetUnbindButton(rule);
        }).join('<br>')
      : '판정 연결: 없음';
  }

  function bindSheetCutin(parts) {
    initState();
    var itemKey = trim(parts[0]);
    var outcome = trim(parts[1]).toLowerCase();
    var sourceKey = trim(parts[2]);
    var duration = parseDuration(parts[3] || '4초');
    var item = itemKey === '*'
      ? { key: '*', label: '모든 판정' }
      : sheetItems().filter(function (candidate) { return candidate.key === itemKey; })[0];
    var outcomes = sheetOutcomes();
    if (!item) return whisper('연결할 판정 항목을 찾지 못했습니다.');
    if (!outcomes[outcome]) return whisper('판정 결과를 확인해 주세요.');
    var source = sourceByKey(sourceKey);
    if (!source) return whisper('연결할 컷인 카드를 찾지 못했습니다.');
    if (duration === null || duration < 100 || duration > 600000)
      return whisper('표시 시간은 0.1초 이상 600초 이하로 입력해 주세요.');
    state.KIBSceneCutin.sheetRules[sheetRuleKey(itemKey, outcome)] = {
      itemKey: itemKey,
      itemLabel: item.displayLabel || item.label,
      outcome: outcome,
      sourceKey: source.key,
      duration: duration,
    };
    refreshLinkedManagers();
    whisper('<b>' + escapeHtml(item.displayLabel || item.label) + '</b> ' + outcomes[outcome] + ' → ' + escapeHtml(sourceLabel(source)));
  }

  function unbindSheetCutin(parts) {
    initState();
    var key = sheetRuleKey(parts[0], parts[1]);
    if (!state.KIBSceneCutin.sheetRules[key]) return whisper('등록된 판정 컷인 연결이 없습니다.');
    delete state.KIBSceneCutin.sheetRules[key];
    refreshLinkedManagers();
    whisper('판정 컷인 연결을 해제했습니다.');
  }

  function refreshLinkedManagers() {
    refreshManager();
    var sheet = KIBScene.adapters && KIBScene.adapters.sheet;
    if (sheet && typeof sheet.refresh === 'function') sheet.refresh();
    refreshHelp();
  }

  function sheetItemNames(item) {
    var seen = {};
    return [item && item.label].concat(item && item.aliases || []).map(normalizeText).filter(function (name) {
      if (!name || seen[name]) return false;
      seen[name] = true;
      return true;
    });
  }

  function legacySheetItemName(itemKey) {
    var value = trim(itemKey);
    var colon = value.indexOf(':');
    if (colon < 1) return '';
    var prefix = value.substring(0, colon).toLowerCase();
    if (prefix !== 'sheet' && prefix.indexOf('contract') !== 0) return '';
    try {
      return normalizeText(decodeURIComponent(value.substring(colon + 1)));
    } catch (error) {
      return normalizeText(value.substring(colon + 1));
    }
  }

  function sheetRuleWithLegacy(itemKey, outcome, item, items) {
    initState();
    var currentKey = sheetRuleKey(itemKey, outcome);
    var current = state.KIBSceneCutin.sheetRules[currentKey];
    if (current) {
      if (item && Array.isArray(items) && item.label && current.itemLabel !== (item.displayLabel || item.label))
        current.itemLabel = item.displayLabel || item.label;
      return current;
    }
    if (trim(itemKey).indexOf('sheet:') !== 0) return null;
    var available = rawSheetItems(items);
    var target = item || available.filter(function (candidate) { return candidate.key === itemKey; })[0];
    if (!target) return null;
    if (!target.key) {
      var payloadItem = {};
      Object.keys(target).forEach(function (key) { payloadItem[key] = target[key]; });
      payloadItem.key = itemKey;
      target = payloadItem;
    }
    if (!available.some(function (candidate) { return candidate.key === itemKey; })) available.push(target);
    var targetNames = sheetItemNames(target);
    function candidates(prefix) {
      return Object.keys(state.KIBSceneCutin.sheetRules).filter(function (key) {
        if (key === currentKey) return false;
        var split = key.lastIndexOf('|');
        if (split < 0 || key.substring(split + 1) !== trim(outcome)) return false;
        var oldItemKey = key.substring(0, split);
        var oldPrefix = oldItemKey.substring(0, oldItemKey.indexOf(':')).toLowerCase();
        if (prefix === 'sheet' ? oldPrefix !== 'sheet' : oldPrefix.indexOf('contract') !== 0) return false;
        var rule = state.KIBSceneCutin.sheetRules[key];
        if (!validSheetRule(rule) || sheetRuleKey(rule.itemKey, rule.outcome) !== key) return false;
        var oldNames = [normalizeText(rule.itemLabel), legacySheetItemName(oldItemKey)].filter(Boolean);
        var uniqueOwner = oldNames.some(function (name) {
          var owners = available.filter(function (candidate) {
            return sheetItemNames(candidate).indexOf(name) >= 0;
          });
          return owners.length === 1 && owners[0].key === itemKey && targetNames.indexOf(name) >= 0;
        });
        return uniqueOwner;
      });
    }
    var legacyKeys = candidates('sheet');
    if (!legacyKeys.length) legacyKeys = candidates('contract');
    if (legacyKeys.length !== 1) return null;
    var legacyKey = legacyKeys[0];
    var legacy = state.KIBSceneCutin.sheetRules[legacyKey];
    var migrated = {};
    Object.keys(legacy).forEach(function (key) { migrated[key] = legacy[key]; });
    migrated.itemKey = itemKey;
    migrated.itemLabel = target.displayLabel || target.label || migrated.itemLabel;
    state.KIBSceneCutin.sheetRules[currentKey] = migrated;
    delete state.KIBSceneCutin.sheetRules[legacyKey];
    return migrated;
  }

  function playSheetResult(payload) {
    initState();
    if (typeof KIBScene.isFeatureEnabled === 'function' &&
        (!KIBScene.isFeatureEnabled('sheet') || !KIBScene.isFeatureEnabled('cutin')))
      return { ok: true };
    if (!payload || payload.secret) return { ok: true };
    var itemKey = trim(payload.cutinKey);
    var rule =
      (itemKey && payload.outcome && sheetRuleWithLegacy(itemKey, payload.outcome, payload)) ||
      (itemKey && sheetRuleWithLegacy(itemKey, 'roll', payload)) ||
      (payload.outcome && state.KIBSceneCutin.sheetRules[sheetRuleKey('*', payload.outcome)]) ||
      state.KIBSceneCutin.sheetRules[sheetRuleKey('*', 'roll')];
    if (!validSheetRule(rule)) return { ok: true };
    var source = sourceByKey(rule.sourceKey);
    if (!source) {
      whisper('판정에 연결된 컷인 카드가 없습니다: ' + escapeHtml(rule.itemLabel));
      return { ok: true };
    }
    var args = source.handout
      ? ['핸드아웃', 'id:' + source.handout.id, formatSeconds(rule.duration)]
      : ['id:' + source.card.id, formatSeconds(rule.duration)];
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    var shown = cutin && typeof cutin.cue === 'function'
      ? cutin.cue(args, { source: 'sheet', result: payload })
      : { ok: false, error: '컷인 기능을 불러오지 못했습니다.' };
    if (!shown.ok) whisper(shown.error);
    return { ok: true };
  }

  function sheetControlsHtml(items) {
    initState();
    sheetItems(items);
    var outcomes = sheetOutcomes();
    var rows = sheetRulesForSource('').map(function (rule) {
      var source = sourceByKey(rule.sourceKey);
      return '<div style="margin-top:6px;padding:6px;border:1px solid #bbb"><b>' +
        escapeHtml(rule.itemLabel || rule.itemKey) + '</b> / ' + escapeHtml(outcomes[rule.outcome] || rule.outcome) +
        '<br>' + escapeHtml(source ? sourceLabel(source) : '삭제된 컷인') + ' / ' + formatSeconds(rule.duration) + ' ' +
        sheetUnbindButton(rule) +
        '</div>';
    }).join('');
    return rows || '<div style="margin-top:6px;color:#777">연결 없음</div>';
  }

  function sheetRuleStatus() {
    return '<b>판정 컷인</b><br>' + sheetControlsHtml();
  }

  function ruleStatus(reference) {
    if (reference) {
      var source = resolveRuleSource(reference);
      return source.ok ? ruleStatusBySource(source) : source.error;
    }
    var keys = Object.keys(state.KIBSceneCutin.textRules);
    return keys.length
      ? keys
          .map(function (key) {
            var source = sourceByKey(key);
            return source
              ? '<b>' +
                  escapeHtml(sourceLabel(source)) +
                  '</b><br>' +
                  ruleStatusBySource(source)
              : '';
          })
          .filter(Boolean)
          .join('<br>')
      : '자동 대사: 없음';
  }

  function ruleStatusBySource(source) {
    var textRules = state.KIBSceneCutin.textRules[source.key] || [];
    return textRules.length
      ? '자동 대사: ' + textRules.map(escapeHtml).join(', ')
      : '자동 대사: 없음';
  }

  function splitList(value) {
    return String(value || '')
      .split(',')
      .map(trim)
      .filter(Boolean)
      .filter(function (item, index, list) {
        return list.map(normalizeText).indexOf(normalizeText(item)) === index;
      });
  }

  function updateMacro() {
    initState();
    pruneState();
    var decks = findObjs({ _type: 'deck', name: SETTING.deckName }) || [];
    var cards =
      decks.length === 1
        ? (findObjs({ _type: 'card', _deckid: decks[0].id }) || [])
            .filter(function (card) {
              return !!cleanImageUrl(card.get('avatar'));
            })
            .sort(byName)
        : [];
    var playTarget =
      cards.length === 1
        ? 'id:' + cards[0].id
        : '?{컷인 선택' +
          cards
            .map(function (card) {
              return '|' + safeQuery(cardInfo(card).name) + ',id:' + card.id;
            })
            .join('') +
          '}';
    var play = SETTING.command + ' 재생|' + playTarget + '|?{표시 시간|4초}';
    var action = cards.length
      ? '?{컷인 동작|재생,' +
        macroEscape(play) +
        '|중지,' +
        macroEscape(SETTING.command + ' 중지') +
        '}'
      : SETTING.command + ' help';
    var players = findObjs({ _type: 'player' }) || [];
    var gmIds = players
      .filter(function (player) {
        return playerIsGM(player.id);
      })
      .map(function (player) {
        return player.id;
      });
    if (!gmIds.length) return 0;
    var key = normalizeMacroName(SETTING.macroName);
    var macros = (findObjs({ _type: 'macro' }) || []).filter(function (macro) {
      return normalizeMacroName(macro.get('name')) === key;
    });
    var values = {
      name: SETTING.macroName,
      action: action,
      visibleto: gmIds.join(','),
    };
    var keeper = macros.shift();
    if (keeper) {
      if (
        keeper.get('action') !== action ||
        keeper.get('visibleto') !== values.visibleto ||
        keeper.get('name') !== values.name
      )
        keeper.set(values);
    } else
      createObj('macro', {
        name: values.name,
        action: values.action,
        visibleto: values.visibleto,
        playerid: gmIds[0],
      });
    macros.forEach(function (macro) {
      macro.remove();
    });
    return cards.length;
  }

  function refreshManager() {
    initState();
    var managers =
      findObjs({ _type: 'handout', name: SETTING.managerName }) || [];
    var manager = state.KIBSceneCutin.managerId
      ? getObj('handout', state.KIBSceneCutin.managerId)
      : null;
    if (!manager) manager = managers.shift();
    if (!manager)
      manager = createObj('handout', {
        name: SETTING.managerName,
        inplayerjournals: '',
        controlledby: '',
      });
    if (!manager) return;
    state.KIBSceneCutin.managerId = manager.id;
    managers
      .filter(function (item) {
        return item.id !== manager.id;
      })
      .forEach(function (item) {
        item.remove();
      });
    var notes =
      '<div style="font-family:Arial,sans-serif;color:#111;background:#fff;line-height:1.4">' +
      '<div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎬 컷인 관리</b></div>' +
      captionManagerHtml() +
      sheetManagerHtml() +
      cardManagerHtml() +
      '</div>';
    var handled = false;
    function apply(currentNotes) {
      if (handled) return;
      handled = true;
      var updates = { inplayerjournals: '', controlledby: '' };
      if (String(currentNotes == null ? '' : currentNotes) !== notes)
        updates.notes = notes;
      manager.set(updates);
    }
    var direct = manager.get('notes', apply);
    if (typeof direct === 'string') apply(direct);
  }

  function managerLink() {
    var manager = state.KIBSceneCutin.managerId
      ? getObj('handout', state.KIBSceneCutin.managerId)
      : null;
    return manager
      ? '<div style="padding:8px;background:#111;color:#fff">' +
          '<b>🎬 컷인 관리</b><br>' +
          '<a href="http://journal.roll20.net/handout/' +
          encodeURIComponent(manager.id) +
          '" style="display:inline-block;margin-top:5px;padding:5px 8px;background:#7654a8;color:#fff;text-decoration:none;border-radius:0;font-weight:bold;font-size:12px">관리 핸드아웃 열기</a></div>'
      : '관리 핸드아웃 생성 오류';
  }

  function captionManagerHtml() {
    var position = state.KIBSceneCutin.captionOffsetY;
    return (
      '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
      '<div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">컷인 스크립트</div>' +
      '<div style="padding:9px"><span style="font-size:11px">크기 ' +
      state.KIBSceneCutin.captionFontSize +
      'px / 위치 ' +
      (position >= 0 ? '+' : '') +
      position +
      'px</span><br>' +
      button(
        '스크립트 크기',
        SETTING.command +
          ' 스크립트크기|?{글자 크기(px)|' +
          state.KIBSceneCutin.captionFontSize +
          '}',
        '#7654a8',
      ) +
      ' ' +
      button(
        '스크립트 위치',
        SETTING.command +
          ' 스크립트위치|?{세로 이동(px, 아래 + / 위 -)|' +
          position +
          '}',
        '#237a8b',
      ) +
      '</div></div>'
    );
  }

  function sheetManagerHtml() {
    return KIBScene.adapters && KIBScene.adapters.sheet
      ? '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
          '<div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">판정 컷인</div>' +
          '<div style="padding:9px">' + sheetControlsHtml() + '</div></div>'
      : '';
  }

  function cardManagerHtml() {
    initState();
    var decks = findObjs({ _type: 'deck', name: SETTING.deckName }) || [];
    var cards =
      decks.length === 1
        ? (findObjs({ _type: 'card', _deckid: decks[0].id }) || [])
            .filter(function (card) {
              return !!cleanImageUrl(card.get('avatar'));
            })
            .sort(byName)
        : [];
    var availableSheetItems = cards.length ? sheetItems() : [];
    var groups = {};
    cards.forEach(function (card) {
      var group = cardInfo(card).group;
      groups[group] = groups[group] || [];
      groups[group].push(card);
    });
    var rows = Object.keys(groups)
      .sort()
      .map(function (group) {
        var firstInfo = cardInfo(groups[group][0]);
        var groupSize =
          state.KIBSceneCutin.groupSizes[firstInfo.groupKey] || firstInfo.size;
        var sizeText = groupSize
          ? groupSize.width + '*' + groupSize.height
          : '없음';
        var sizeButton =
          SETTING.command +
          ' 그룹크기|' +
          group +
          '|?{표시 크기 (가로*세로)|800*600}';
        return (
          '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
          '<div style="padding:6px 9px;background:#111;color:#fff"><b>' +
          escapeHtml(group) +
          '</b> ' +
          '<span style="font-size:11px;color:#fff">그룹 크기: ' +
          sizeText +
          '</span></div><div style="padding:7px">' +
          button(groupSize ? '크기 수정' : '크기 등록', sizeButton, '#7654a8') +
          groups[group]
            .map(function (card) {
              var info = cardInfo(card);
              var source = {
                ok: true,
                key: 'card:' + card.id,
                imgsrc: cleanImageUrl(card.get('avatar')),
                card: card,
                deck: decks[0],
                info: info,
              };
              return (
                '<div style="padding:7px;margin-top:7px;background:#fff;border:1px solid #bbb"><b>' +
                escapeHtml(info.shortName) +
                '</b><br>' +
                sourceButtons(source, availableSheetItems) +
                '<div style="font-size:11px;color:#111;margin-top:4px">' +
                compactRuleStatus(source) +
                '</div></div>'
              );
            })
            .join('') +
          '</div></div>'
        );
      })
      .join('');
    return (
      '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
      '<div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">카드 컷인</div>' +
      '<div style="padding:9px;font-size:11px"><code>cutin</code> 덱에 컷인 이미지를 카드로 등록<br>이름 앞부분이 같으면 같은 그룹</div></div>' +
      (rows ||
        '<div style="margin-top:10px;padding:12px;background:#f3f3f3;border-left:4px solid #111"><code>cutin</code> 덱에 카드가 없습니다.</div>')
    );
  }

  function handoutControls(handout) {
    initState();
    if (!handout || handout.id === state.KIBSceneCutin.managerId) return '';
    var image = !!cleanImageUrl(handout.get('avatar'));
    var metadata = state.KIBSceneCutin.sourceRatios['handout:' + handout.id];
    var size =
      metadata && metadata.width
        ? '있음 (' + metadata.width + '*' + metadata.height + ')'
        : '없음';
    var play = SETTING.command + ' 재생|핸드아웃|' + handout.id + '|4초';
    var sizeButton =
      SETTING.command +
      ' 핸드아웃크기|' +
      handout.id +
      '|?{원본 크기 (가로*세로)|800*600}';
    return (
      '<div style="padding:6px;margin-top:6px;background:#f3f3f3;border-left:4px solid #111;font-size:11px"><b>표지 이미지: </b>' +
      (image ? '있음' : '없음') +
      '<br><b>크기: </b>' +
      size +
      (image
        ? '<br>' +
          button('재생', play, '#287a4b') +
          ' ' +
          button(
            metadata && metadata.width ? '크기 수정' : '크기 등록',
            sizeButton,
            '#7654a8',
          )
        : '') +
      '</div>'
    );
  }

  function sourceButtons(source, availableSheetItems) {
    var key = source.key;
    var target = safeQuery(sourceLabel(source));
    var textRules = state.KIBSceneCutin.textRules[key] || [];
    var play = source.handout
      ? SETTING.command + ' 재생|핸드아웃|' + target + '|4초'
      : SETTING.command + ' 재생|' + target + '|4초';
    var controls =
      button('재생', play, '#287a4b') +
      ' ' +
      button(
        '대사 추가',
        SETTING.command +
          ' 대사추가|' +
          target +
          '|?{자동 재생할 대사(여러 개는 쉼표)}',
        '#237a8b',
      );
    if (source.card) {
      controls +=
        ' ' +
          button(
            '효과음 연결',
          SETTING.command +
            ' 연결|' +
            target +
            '|?{연결할 쥬크박스 효과음 이름}',
          '#a66a16',
        );
      if (state.KIBSceneCutin.audioLinks[source.card.id])
        controls +=
          ' ' +
          button(
            '효과음 해제',
            SETTING.command + ' 연결해제|' + target,
            '#8b3940',
          );
      var sheetButton = sheetBindButton(source, availableSheetItems);
      if (sheetButton) controls += ' ' + sheetButton;
    }
    if (textRules.length)
      controls +=
        ' ' +
          button(
            '대사 삭제',
          SETTING.command +
            ' 대사삭제|' +
            target +
            '|' +
            optionQuery('삭제할 대사', textRules),
          '#8b3940',
        );
    return controls;
  }

  function compactRuleStatus(source) {
    var trackId = source.card && state.KIBSceneCutin.audioLinks[source.card.id];
    var track = trackId ? getObj('jukeboxtrack', trackId) : null;
    return (
      ruleStatusBySource(source) +
      '<br>효과음: ' +
      (track
        ? escapeHtml(track.get('title'))
        : trackId
          ? '(삭제된 음원)'
          : '없음') +
      '<br>' + compactSheetRuleStatus(source)
    );
  }

  function refreshManagerSoon() {
    if (managerTimer) clearTimeout(managerTimer);
    managerTimer = setTimeout(function () {
      managerTimer = null;
      cutinRefreshSafe(false);
    }, 100);
  }

  function scheduleManager() {
    refreshManagerSoon();
  }

  function scheduleRefresh() {
    if (macroTimer) clearTimeout(macroTimer);
    macroTimer = setTimeout(function () {
      macroTimer = null;
      cutinRefreshSafe(true);
    }, 100);
  }

  function cutinRefreshSafe(includeMacro) {
    try {
      if (includeMacro) updateMacro();
      refreshHelp();
      refreshManager();
    } catch (err) {
      whisper(
        '<b>컷인 관리 갱신 오류</b><br><code>cutin</code> 덱을 확인해 주세요.<br><span style="font-size:11px">오류: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  }

  function pruneState() {
    Object.keys(state.KIBSceneCutin.durations).forEach(function (cardId) {
      if (!getObj('card', cardId)) delete state.KIBSceneCutin.durations[cardId];
    });
    Object.keys(state.KIBSceneCutin.audioLinks).forEach(function (cardId) {
      if (
        !getObj('card', cardId) ||
        !getObj('jukeboxtrack', state.KIBSceneCutin.audioLinks[cardId])
      )
        delete state.KIBSceneCutin.audioLinks[cardId];
    });
    Object.keys(state.KIBSceneCutin.sourceRatios).forEach(function (key) {
      var match = key.match(/^(card|handout):(.+)$/);
      if (match && !getObj(match[1], match[2]))
        delete state.KIBSceneCutin.sourceRatios[key];
    });
    Object.keys(state.KIBSceneCutin.textRules).forEach(function (key) {
      if (!sourceByKey(key)) delete state.KIBSceneCutin.textRules[key];
    });
  }

  function helpHtml() {
    return (
      '<b>컷인 명령어</b><br>' +
      '<code>!컷인 재생|카드명|3초</code> cutin 덱 카드 표시<br>' +
      '<code>!컷인 핸드아웃|자료명|3초</code> 핸드아웃 표지 표시<br>' +
      '<code>!컷인 URL|Roll20이미지주소|3초</code> 주소의 이미지 표시<br>' +
      '<code>!컷인 중지</code> 현재 컷인과 연결 효과음 중지<br>' +
      '<code>!컷인 설정|카드명|3초</code> 카드 기본 시간 저장<br>' +
      '<code>!컷인 관리</code> <code>cutin</code> 덱 카드 관리<br>' +
      '<code>!컷인 그룹크기|그룹명|800*600</code> 같은 그룹 카드 크기 저장<br>' +
      '<code>!컷인 핸드아웃크기|자료명|800*600</code> 핸드아웃 컷인 크기 저장<br>' +
      '<code>!컷인 스크립트크기|28</code> 컷인 스크립트 크기<br>' +
      '<code>!컷인 스크립트위치|0</code> 컷인 스크립트 위치<br>' +
      '<code>!컷인 대사추가|컷인명|문구1,문구2</code> 같은 대사가 올라오면 자동 재생<br>' +
      '<code>!컷인 대사삭제|컷인명|문구1</code> 해당 문구만 삭제<br>' +
      '<code>!컷인 연결|카드명|효과음 제목</code> 카드와 효과음 연결<br>' +
      '<code>!... 대사 @컷인 카드명|3초</code> 나레이터 줄과 동시에 표시<br>' +
      '<code>!... 대사 @컷인 카드명|줄=3</code> 현재 줄부터 나레이터 3줄 동안 표시<br>' +
      '핸드아웃 컷인과 함께 해당 줄의 스크립트를 표시합니다.<br>' +
      '<code>cutin_overlay</code> GM 레이어 토큰: 전체 화면 배경 등록 후 자동 제거<br>' +
      '컷인은 현재 페이지의 전원에게 표시됩니다.'
    );
  }

  function boundsFromGraphic(graphic) {
    return {
      left: Number(graphic.get('left')),
      top: Number(graphic.get('top')),
      width: Number(graphic.get('width')),
      height: Number(graphic.get('height')),
    };
  }

  function boundsFromPage(page) {
    var width = Number(page.get('width')) * 70;
    var height = Number(page.get('height')) * 70;
    return {
      left: width / 2,
      top: height / 2,
      width: Math.min(state.KIBSceneCutin.defaultWidth, width),
      height: Math.min(state.KIBSceneCutin.defaultHeight, height),
    };
  }

  function boundsFromFullPage(page) {
    var width = Number(page.get('width')) * 70;
    var height = Number(page.get('height')) * 70;
    return { left: width / 2, top: height / 2, width: width, height: height };
  }

  function cutinLayer() {
    return SETTING.layer;
  }

  function boundsFromNaturalSize(page, size) {
    var pageWidth = Number(page.get('width')) * 70;
    var pageHeight = Number(page.get('height')) * 70;
    var scale = Math.min(
      1,
      (pageWidth * 0.9) / size.width,
      (pageHeight * 0.9) / size.height,
    );
    return {
      left: pageWidth / 2,
      top: pageHeight / 2,
      width: size.width * scale,
      height: size.height * scale,
    };
  }

  function fitBounds(bounds, ratio) {
    var width = Number(bounds.width);
    var height = Number(bounds.height);
    if (width / height > ratio) width = height * ratio;
    else height = width / ratio;
    return { left: bounds.left, top: bounds.top, width: width, height: height };
  }

  function parseDuration(value) {
    var match = trim(value)
      .toLowerCase()
      .match(/^(\d+(?:\.\d+)?)\s*(초|s|ms)?$/);
    if (!match) return null;
    return match[2] === 'ms'
      ? Math.round(Number(match[1]))
      : Math.round(Number(match[1]) * 1000);
  }

  function parseNarratorLines(value) {
    var match = trim(value).match(/^(?:줄\s*=\s*(\d+)|(\d+)\s*줄)$/);
    return match ? Number(match[1] || match[2]) : null;
  }

  function cleanImageUrl(value) {
    var match = trim(value).match(
      /(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/i,
    );
    return match ? match[1] + 'thumb' + match[3] + (match[4] || '') : '';
  }

  function canonicalImage(value) {
    return trim(value).replace(
      /\/(?:thumb|med|max|original)(\.[^/?]+)(\?.*)?$/i,
      '/size$1$2',
    );
  }

  function initState() {
    state.KIBSceneCutin = state.KIBSceneCutin || {};
    state.KIBSceneCutin.version = '1.6.1';
    state.KIBSceneCutin.durations = state.KIBSceneCutin.durations || {};
    state.KIBSceneCutin.audioLinks = state.KIBSceneCutin.audioLinks || {};
    state.KIBSceneCutin.sourceRatios = state.KIBSceneCutin.sourceRatios || {};
    state.KIBSceneCutin.groupSizes = state.KIBSceneCutin.groupSizes || {};
    state.KIBSceneCutin.overlayImages =
      state.KIBSceneCutin.overlayImages || {};
    var legacyHandoutMeta = Object.assign(
      {},
      (state.KIBSceneHandout && state.KIBSceneHandout.handoutMeta) || {},
      state.KIBSceneCutin.handoutMeta || {},
    );
    Object.keys(legacyHandoutMeta).forEach(function (id) {
      var value = legacyHandoutMeta[id];
      if (
        value &&
        value.width > 0 &&
        value.height > 0 &&
        !state.KIBSceneCutin.sourceRatios['handout:' + id]
      ) {
        state.KIBSceneCutin.sourceRatios['handout:' + id] = {
          width: Number(value.width),
          height: Number(value.height),
          ratio: Number(value.width) / Number(value.height),
        };
      }
    });
    if (state.KIBSceneHandout) delete state.KIBSceneHandout.handoutMeta;
    delete state.KIBSceneCutin.handoutMeta;
    state.KIBSceneCutin.textRules = state.KIBSceneCutin.textRules || {};
    state.KIBSceneCutin.sheetRules = state.KIBSceneCutin.sheetRules || {};
    state.KIBSceneCutin.legacySheetRules = state.KIBSceneCutin.legacySheetRules || {};
    Object.keys(state.KIBSceneCutin.sheetRules).forEach(function (key) {
      if (!Array.isArray(state.KIBSceneCutin.sheetRules[key])) return;
      if (!state.KIBSceneCutin.legacySheetRules[key])
        state.KIBSceneCutin.legacySheetRules[key] = state.KIBSceneCutin.sheetRules[key];
      delete state.KIBSceneCutin.sheetRules[key];
    });
    state.KIBSceneCutin.managerId = state.KIBSceneCutin.managerId || '';
    delete state.KIBSceneCutin.folderSelected;
    delete state.KIBSceneCutin.activeFolderId;
    state.KIBSceneCutin.defaultWidth =
      Number(state.KIBSceneCutin.defaultWidth) > 0
        ? Number(state.KIBSceneCutin.defaultWidth)
        : SETTING.defaultWidth;
    state.KIBSceneCutin.defaultHeight =
      Number(state.KIBSceneCutin.defaultHeight) > 0
        ? Number(state.KIBSceneCutin.defaultHeight)
        : SETTING.defaultHeight;
    var captionSize = Number(state.KIBSceneCutin.captionFontSize);
    var captionOffset = Number(state.KIBSceneCutin.captionOffsetY);
    state.KIBSceneCutin.captionFontSize =
      captionSize >= 8 && captionSize <= 100 ? captionSize : 28;
    state.KIBSceneCutin.captionOffsetY =
      isFinite(captionOffset) && captionOffset >= -5000 && captionOffset <= 5000
        ? captionOffset
        : 0;
    state.KIBSceneCutin.activeGraphicId =
      state.KIBSceneCutin.activeGraphicId || '';
    state.KIBSceneCutin.activeOverlayId =
      state.KIBSceneCutin.activeOverlayId || '';
    state.KIBSceneCutin.activeCaptionId =
      state.KIBSceneCutin.activeCaptionId || '';
    state.KIBSceneCutin.activeTrackId = state.KIBSceneCutin.activeTrackId || '';
  }

  function cutinCall(name, method, args) {
    if (typeof KIBScene.call === 'function')
      return KIBScene.call(name, method, args);
    var adapter = KIBScene.adapters[name];
    if (adapter && typeof adapter[method] === 'function')
      return adapter[method].apply(adapter, args || []);
    return method === 'cue' && typeof KIBScene.handlers[name] === 'function'
      ? KIBScene.handlers[name].apply(null, args || [])
      : undefined;
  }

  function cutinHasPlugin(name) {
    return (
      !!KIBScene.adapters[name] || typeof KIBScene.handlers[name] === 'function'
    );
  }

  function suppressVisualDialogue(enabled, pageId) {
    var vd = KIBScene.adapters && KIBScene.adapters.vd;
    if (vd && typeof vd.suppressCutinText === 'function')
      vd.suppressCutinText(enabled, pageId);
  }

  function refreshHelp() {
    if (typeof KIBScene.refreshHandout === 'function')
      KIBScene.refreshHandout();
  }
  function formatSeconds(ms) {
    return String(Math.round(ms / 100) / 10) + '초';
  }
  function trim(value) {
    return String(value || '').trim();
  }
  function byName(a, b) {
    return String(a.get('name') || '').localeCompare(
      String(b.get('name') || ''),
    );
  }
  function normalizeText(value) {
    return decodeHtml(String(value || '').replace(/<[^>]*>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
  function normalizeDialogueText(value) {
    var text = String(value || '').replace(/^\s*\/(?:desc|em)\b\s*/i, '');
    var decorated = text.match(/^\s*\[([\s\S]*)\]\(\s*#"[\s\S]*\)\s*$/);
    return normalizeText(decorated ? decorated[1] : text);
  }
  function decodeHtml(value) {
    return String(value || '')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&times;/gi, '×')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'");
  }
  function safeQuery(value) {
    return trim(value).replace(/[|,{}?]/g, ' ');
  }
  function macroEscape(value) {
    return String(value || '')
      .replace(/\|/g, '&#124;')
      .replace(/,/g, '&#44;')
      .replace(/}/g, '&#125;');
  }
  function normalizeMacroName(value) {
    return trim(value)
      .replace(/\uFE0F/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }
  function optionQuery(label, values) {
    if (values.length === 1) return safeQuery(values[0]);
    return (
      '?{' +
      label +
      values
        .map(function (value) {
          return '|' + safeQuery(value) + ',' + safeQuery(value);
        })
        .join('') +
      '}'
    );
  }
  function button(label, command, color) {
    return (
      '<a href="' +
      escapeHtml(command) +
      '" style="display:inline-block;padding:4px 7px;margin:2px 0;background:' +
      color +
      ';color:#fff;text-decoration:none;border-radius:0;font-size:12px">' +
      escapeHtml(label) +
      '</a>'
    );
  }
  function whisper(value) {
    sendChat(SETTING.speaker, '/w GM ' + value, null, { noarchive: true });
  }
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
