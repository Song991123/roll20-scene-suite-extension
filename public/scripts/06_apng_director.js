/*
 * Scene Suite 06 - APNG Director 1.2.2-dev
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
    DECK_NAME: 'apng',
    PAGE_NAME: 'conversation',
    AREA_NAME: 'apng_area',
    MACRO_NAME: '📽️apng',
    DEFAULT_MODE: 'once',
    DEFAULT_DURATION: 3000,
    AREA_LAYER: 'map',
    FULL_LAYER: 'objects',
    MANAGER_NAME: '[GM] APNG 관리',
  };

  // ===== 실행 상태 =====
  var API = 'APNG';
  var macroTimer = null;
  var hideTimers = {};
  var linkedWatches = {};
  var audioLinkBusy = false;
  var transitionQueue = [];
  var transitionRun = null;
  var transitionTimer = null;
  var transitionRemoving = false;

  on('ready', function () {
    initState();
    clearActive(false);
    if (SETTING.SCENE_DIRECTOR_ENABLED) {
      var cue = function (args, context) {
        if (args[0] === '전환') return enqueueTransition(args.slice(1), context);
        var stop = inspectStopCue(args);
        if (stop) {
          if (!stop.ok) return stop;
          if (!stop.card) cancelTransitions();
          stopActive(stop.card ? stop.card.id : null, true);
          return { ok: true, stopped: true };
        }
        var parsed = parsePlayArgs(args);
        if (!parsed.ok) return parsed;
        return show(parsed);
      };
      var adapter = {
        meta: { code: '06_apng_director.js', title: 'APNG' },
        aliases: { APNG: '', apng: '', 에이피엔지: '', 장면전환: '전환' },
        cue: cue,
        validate: function (args) {
          if (args[0] === '전환') return inspectTransition(args.slice(1));
          return inspectStopCue(args) || parsePlayArgs(args);
        },
        transitionControls: transitionControls,
        events: { 'narrator:cancel': function () { cancelTransitions(true); } },
        onAudioPlay: playLinkedApngForAudio,
        playLinkedAPNGForAudio: playLinkedApngForAudio,
        bringToFront: bringActiveToFront,
        help: [
          '<code>@APNG 카드 이름|1회|3초|전체</code> 한 번 재생',
          '<code>@APNG 카드 이름|반복|영역</code> 중지할 때까지 반복',
          '<code>전체</code> 적용 페이지 전체',
          '<code>영역</code> GM 레이어의 <code>' +
            escapeHtml(SETTING.AREA_NAME) +
            '</code> 영역 이미지 토큰 위치',
          '<code>@APNG 중지</code>',
          '<code>@APNG 카드 이름|중지</code>',
          '<code>!APNG 관리</code> 장면전환 등록과 수정',
          '<code>!APNG 전환|전환명|@명령</code> 앞 연출 후 명령 실행 후 뒤 연출',
          '<code>@장면전환 전환명</code> 저장한 장면전환 실행',
        ],
      };
      if (typeof KIBScene.register === 'function')
        KIBScene.register('apng', adapter);
      else {
        KIBScene.adapters.apng = adapter;
        KIBScene.handlers.apng = adapter.cue;
      }
    }
    apngRefreshSafe();
  });

  on('chat:message', function (msg) {
    if (
      !msg ||
      msg.type != 'api' ||
      String(msg.content || '').indexOf('!APNG') !== 0 ||
      !playerIsGM(msg.playerid)
    )
      return;
    try {
      handleCommand(msg);
    } catch (err) {
      whisper(
        '<b>APNG 명령을 처리하지 못했습니다.</b><br><code>!APNG 도움말</code>에서 형식을 확인해 주세요.<br><span style="font-size:11px;color:#687386">오류 내용: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  });

  ['add:card', 'change:card', 'destroy:card'].forEach(function (eventName) {
    on(eventName, scheduleMacroForCard);
  });
  ['add:deck', 'change:deck', 'destroy:deck'].forEach(function (eventName) {
    on(eventName, scheduleMacroForDeck);
  });
  on('destroy:jukeboxtrack', function (obj) {
    initState();
    Object.keys(state.KIBSceneAPNG.audioLinks).forEach(function (cardId) {
      if (state.KIBSceneAPNG.audioLinks[cardId] == obj.id)
        delete state.KIBSceneAPNG.audioLinks[cardId];
    });
    refreshHelp();
  });
  on('change:jukeboxtrack', function (obj, prev) {
    initState();
    if (obj.get('playing') === true && prev.playing !== true)
      playLinkedApngForAudio(obj.id);
  });
  on('destroy:graphic', function (obj) {
    if (!transitionRemoving && transitionRun && transitionRun.ids.indexOf(obj.id) >= 0) {
      finishTransition('장면전환 중지: 표시 토큰 삭제');
    }
    var index = state.KIBSceneAPNG.activeIds.indexOf(obj.id);
    if (index > -1) state.KIBSceneAPNG.activeIds.splice(index, 1);
    if (hideTimers[obj.id]) clearTimeout(hideTimers[obj.id]);
    delete hideTimers[obj.id];
    clearLinkedWatch(obj.id);
  });

  function handleCommand(msg) {
    var parts = String(msg.content || '')
      .split('|')
      .map(function (part) {
        return part.trim();
      });
    var head = parts
      .shift()
      .replace(/^!APNG/i, '')
      .trim();
    var action = String(head || '도움말').toLowerCase();
    if (action === '관리') { refreshManager(); return whisper(statusHtml()); }
    if (action === '전환저장') return saveTransition(parts);
    if (action === '전환삭제') {
      if (!Object.prototype.hasOwnProperty.call(state.KIBSceneAPNG.transitions, parts[0])) return whisper('장면전환 없음');
      delete state.KIBSceneAPNG.transitions[parts[0]];
      refreshHelp();
      return whisper('장면전환 삭제');
    }
    if (action === '전환명령') {
      var savedTransition = state.KIBSceneAPNG.transitions[parts[0]];
      if (!Object.prototype.hasOwnProperty.call(state.KIBSceneAPNG.transitions, parts[0])) return whisper('장면전환 없음');
      var savedCommands = transitionCues(parts.slice(1).join('|'));
      if (!savedCommands.ok) return whisper(savedCommands.error);
      var checkedCommands = checkTransitionCues(savedCommands.cues);
      if (!checkedCommands.ok) return whisper(checkedCommands.error);
      savedTransition.commands = parts.slice(1).join('|');
      refreshHelp();
      return whisper('장면전환 명령 저장');
    }
    if (action === '전환중지') { cancelTransitions(); return whisper('장면전환 중지'); }
    if (action === '전환') {
      var transition = enqueueTransition(parts, { playerid: msg.playerid });
      if (!transition.ok) whisper(transition.error);
      return;
    }
    if (action == '재생' || action == 'play') {
      var parsed = parsePlayArgs(parts);
      if (!parsed.ok) return whisper(parsed.error);
      show(parsed);
      return;
    }
    if (
      action == '중지' ||
      action == '정리' ||
      action == 'stop' ||
      action == 'clear'
    ) {
      var stop = inspectStopCue([action].concat(parts));
      if (!stop.ok) return whisper(stop.error);
      if (!stop.card) cancelTransitions();
      stopActive(stop.card ? stop.card.id : null, true);
      return;
    }
    if (action == '설정')
      return parts.length ? saveCardSetting(parts) : whisper(statusHtml());
    if (action == '연결') return bindAudio(parts);
    if (action == '연결해제') return unbindAudio(parts);
    if (action == '연결목록') return whisper(audioLinkStatus());
    if (
      action == '목록' ||
      action == '상태' ||
      action == '도움말' ||
      action == 'help' ||
      action == 'status'
    )
      return whisper(statusHtml());
    if (action == '매크로갱신') {
      updateMacro();
      return whisper(
        '<b>' +
          escapeHtml(SETTING.MACRO_NAME) +
          '</b> 매크로를 갱신했습니다.',
      );
    }
    if (action == '매크로없음')
      return whisper(
        '<b>' +
          escapeHtml(SETTING.DECK_NAME) +
          '</b> 덱에 앞면 이미지가 있는 카드가 없습니다.',
      );
    whisper(
      '사용법: <code>!APNG 재생|카드 이름|1회|3초|전체</code><br><code>!APNG 재생|카드 이름|반복|영역</code><br><code>!APNG 중지</code><br>영역 재생은 GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <code>' +
        escapeHtml(SETTING.AREA_NAME) +
        '</code>로 지정합니다. 토큰 이름은 업로드 파일명이 아닙니다.',
    );
  }

  function inspectStopCue(args) {
    var values = (args || [])
      .map(function (value) {
        return String(value || '').trim();
      })
      .filter(Boolean);
    if (
      !values.some(function (value) {
        return /^(?:중지|정리|stop|clear)$/i.test(value);
      })
    )
      return null;
    var targets = values.filter(function (value) {
      return !/^(?:중지|정리|stop|clear|전체|all)$/i.test(value);
    });
    if (!targets.length) return { ok: true, card: null };
    if (targets.length > 1)
      return {
        ok: false,
        error: '중지할 APNG 카드는 하나만 지정하세요: ' + targets.join(' | '),
      };
    var cardResult = findCard(targets[0]);
    return cardResult.ok ? { ok: true, card: cardResult.card } : cardResult;
  }

  function parsePlayArgs(args) {
    if (!SETTING.ENABLED) return { ok: true, skipped: true };
    var values = (args || [])
      .map(function (value) {
        return String(value || '').trim();
      })
      .filter(Boolean);
    if (values[0] && /^(?:재생|play)$/i.test(values[0])) values.shift();
    if (!values.length)
      return { ok: false, error: 'APNG 카드 이름이 없습니다.' };
    var cardResult = findCard(values.shift());
    if (!cardResult.ok) return cardResult;
    var saved = state.KIBSceneAPNG.cardSettings[cardResult.card.id] || {};
    var mode = saved.mode || SETTING.DEFAULT_MODE;
    var duration = Number(saved.duration) || SETTING.DEFAULT_DURATION;
    var placement = saved.placement || 'full';
    for (var i = 0; i < values.length; i++) {
      var modeValue = parseMode(values[i]);
      var placementValue = parsePlacement(values[i]);
      if (modeValue) mode = modeValue;
      else if (placementValue) placement = placementValue;
      else {
        if (/^(?:정지)?유지\s*=|^\d+\s*줄$|^줄\s*=/.test(values[i]))
          return {
            ok: false,
            error:
              'APNG 1회 재생에는 유지 옵션을 사용할 수 없습니다.',
          };
        var durationValue = parseDuration(values[i]);
        if (durationValue === null)
          return {
            ok: false,
            error: 'APNG 옵션을 이해하지 못했습니다: ' + values[i],
          };
        duration = durationValue;
      }
    }
    var pageResult = findPage();
    if (!pageResult.ok) return pageResult;
    var areaResult =
      placement == 'area'
        ? findArea(pageResult.page)
        : { ok: true, area: null };
    if (!areaResult.ok) return areaResult;
    var image = cleanImageUrl(cardResult.card.get('avatar'));
    if (!image)
      return {
        ok: false,
        error:
          '카드 앞면 이미지를 사용할 수 없습니다: ' +
          cardResult.card.get('name'),
      };
    var linkedTrackId = state.KIBSceneAPNG.audioLinks[cardResult.card.id];
    if (linkedTrackId && !getObj('jukeboxtrack', linkedTrackId))
      return {
        ok: false,
        error:
          '카드에 연결된 효과음을 찾지 못했습니다. 다시 연결해 주세요: ' +
          cardResult.card.get('name'),
      };
    if (linkedTrackId && !apngHasPlugin('audio'))
      return {
        ok: false,
        error: '효과음을 함께 재생하려면 02 오디오를 설치해 주세요.',
      };
    if (
      linkedTrackId &&
      typeof KIBScene.isFeatureEnabled === 'function' &&
      !KIBScene.isFeatureEnabled('audio')
    )
      return { ok: false, error: '00 Scene Director에서 오디오를 켜 주세요.' };
    var audioStatus = linkedTrackId ? apngCall('audio', 'status') : null;
    if (audioStatus && audioStatus.driver && audioStatus.driver != 'native')
      return {
        ok: false,
        error:
          'Roll20AM 재생 방식에서는 APNG와 효과음을 연결할 수 없습니다. <code>!sd audio driver|native</code>로 Roll20 직접 재생 방식을 선택해 주세요.',
      };
    if (!(duration >= 100 && duration <= 600000))
      return {
        ok: false,
        error: 'APNG 재생 시간은 0.1초에서 600초 사이여야 합니다.',
      };
    return {
      ok: true,
      card: cardResult.card,
      page: pageResult.page,
      area: areaResult.area,
      placement: placement,
      imgsrc: image,
      mode: mode,
      duration: mode == 'loop' ? 0 : duration,
      cycleDuration: duration,
    };
  }

  function show(parsed, sourceTrackId, hold) {
    if (parsed.skipped) return parsed;
    if (!hold) stopActive(parsed.card.id, true, sourceTrackId);
    var pageWidth = Number(parsed.page.get('width')) * 70;
    var pageHeight = Number(parsed.page.get('height')) * 70;
    if (!(pageWidth > 0 && pageHeight > 0))
      return {
        ok: false,
        error:
          '적용 페이지 크기를 확인해 주세요: ' +
          escapeHtml(parsed.page.get('name')),
      };
    var mapSheetBounds = parsed.area
      ? null
      : apngCall('vd', 'mapSheetBounds', [parsed.page.id]);
    var bounds = parsed.area
      ? {
          left: Number(parsed.area.get('left')),
          top: Number(parsed.area.get('top')),
          width: Number(parsed.area.get('width')),
          height: Number(parsed.area.get('height')),
        }
      : mapSheetBounds || {
          left: pageWidth / 2,
          top: pageHeight / 2,
          width: pageWidth,
          height: pageHeight,
        };
    if (!(bounds.width > 0 && bounds.height > 0))
      return {
        ok: false,
        error:
          '지정 영역 토큰의 크기를 확인해 주세요: ' +
          escapeHtml(SETTING.AREA_NAME),
      };
    var graphic = createObj('graphic', {
      _pageid: parsed.page.id,
      imgsrc: parsed.imgsrc,
      name: 'sd_apng:' + parsed.card.id,
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      layer:
        parsed.placement == 'area' ? SETTING.AREA_LAYER : SETTING.FULL_LAYER,
      isdrawing: true,
      disableSnapping: true,
      disableTokenMenu: true,
    });
    if (!graphic)
      return {
        ok: false,
        error:
          'APNG를 표시하지 못했습니다. 카드 앞면 이미지와 적용 페이지를 확인해 주세요.',
      };
    state.KIBSceneAPNG.activeIds.push(graphic.id);
    bringActiveToFront(parsed.page.id);
    setTimeout(function () {
      bringActiveToFront(parsed.page.id);
    }, 100);
    var linkedTrackId = state.KIBSceneAPNG.audioLinks[parsed.card.id];
    if (linkedTrackId) {
      playLinkedAudioForApng(parsed.card.id, parsed.mode);
      if (parsed.mode == 'loop')
        watchLinkedPlayback(
          graphic.id,
          linkedTrackId,
          parsed.cycleDuration || SETTING.DEFAULT_DURATION,
        );
      else linkedWatches[graphic.id] = { trackId: linkedTrackId };
    }
    if (parsed.mode == 'once' && !hold) {
      hideTimers[graphic.id] = setTimeout(function () {
        removeGraphic(graphic.id);
      }, parsed.cycleDuration || SETTING.DEFAULT_DURATION);
    }
    return {
      ok: true,
      id: graphic.id,
      mode: parsed.mode,
      duration: parsed.duration,
    };
  }

  function playLinkedAudioForApng(cardId, mode) {
    var trackId = state.KIBSceneAPNG.audioLinks[cardId];
    if (!trackId || audioLinkBusy) return;
    audioLinkBusy = true;
    try {
      apngCall('audio', 'cue', [
        ['재생', 'id:' + trackId, mode == 'loop' ? '반복' : '1회'],
        {},
      ]);
    } finally {
      audioLinkBusy = false;
    }
  }

  function playLinkedApngForAudio(trackId) {
    initState();
    if (audioLinkBusy) return;
    var cardId = Object.keys(state.KIBSceneAPNG.audioLinks).filter(
      function (id) {
        return state.KIBSceneAPNG.audioLinks[id] == trackId;
      },
    )[0];
    if (!cardId) return;
    var parsed = parsePlayArgs(['id:' + cardId]);
    if (!parsed.ok) return whisper(parsed.error);
    var track = getObj('jukeboxtrack', trackId);
    parsed.mode = track && track.get('loop') === true ? 'loop' : 'once';
    parsed.duration = parsed.mode == 'loop' ? 0 : parsed.cycleDuration;
    audioLinkBusy = true;
    try {
      show(parsed, trackId);
    } finally {
      audioLinkBusy = false;
    }
  }

  function watchLinkedPlayback(graphicId, trackId, minimumCycle) {
    clearLinkedWatch(graphicId);
    var watch = (linkedWatches[graphicId] = {
      trackId: trackId,
      minimumDone: false,
      trackDone: false,
      minimumTimer: null,
      pollTimer: null,
    });
    watch.minimumTimer = setTimeout(
      function () {
        watch.minimumDone = true;
        if (watch.trackDone) removeGraphic(graphicId);
      },
      Math.max(100, Number(minimumCycle) || SETTING.DEFAULT_DURATION),
    );
    var poll = function () {
      var graphic = getObj('graphic', graphicId);
      var track = getObj('jukeboxtrack', trackId);
      if (!graphic) return clearLinkedWatch(graphicId);
      if (
        !track ||
        track.get('playing') !== true ||
        track.get('softstop') === true
      ) {
        watch.trackDone = true;
        if (watch.minimumDone) removeGraphic(graphicId);
        return;
      }
      watch.pollTimer = setTimeout(poll, 200);
    };
    watch.pollTimer = setTimeout(poll, 200);
  }

  function clearLinkedWatch(graphicId) {
    var watch = linkedWatches[graphicId];
    if (!watch) return;
    if (watch.minimumTimer) clearTimeout(watch.minimumTimer);
    if (watch.pollTimer) clearTimeout(watch.pollTimer);
    delete linkedWatches[graphicId];
  }

  function findArea(page) {
    var areas =
      findObjs({
        _type: 'graphic',
        name: SETTING.AREA_NAME,
        _pageid: page.id,
      }) || [];
    if (areas.length > 1)
      return {
        ok: false,
        error:
          '<b>' +
          escapeHtml(page.get('name')) +
          '</b> 페이지에 <b>' +
          escapeHtml(SETTING.AREA_NAME) +
          '</b> 토큰이 여러 개 있습니다. 하나만 남겨 주세요.',
      };
    if (!areas.length)
      return {
        ok: false,
        error:
          '지정 영역에 재생하려면 <b>' +
          escapeHtml(page.get('name')) +
          '</b> 페이지 GM 레이어에 이미지 토큰을 놓고 토큰 이름을 <b>' +
          escapeHtml(SETTING.AREA_NAME) +
          '</b>로 지정해 주세요.',
      };
    return { ok: true, area: areas[0] };
  }

  function bringActiveToFront(pageId) {
    initState();
    var active = state.KIBSceneAPNG.activeIds
      .map(function (id) {
        return getObj('graphic', id);
      })
      .filter(function (graphic) {
        return graphic && (!pageId || graphic.get('_pageid') == pageId);
      });
    active.forEach(toFront);
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.bringToFront == 'function') cutin.bringToFront();
    return active.length > 0;
  }

  function clearActive(stopLinkedAudio, exceptTrackId) {
    stopActive(null, stopLinkedAudio, exceptTrackId);
  }

  function stopActive(cardId, stopLinkedAudio, exceptTrackId) {
    initState();
    var activeIds = state.KIBSceneAPNG.activeIds.filter(function (graphicId) {
      if (!cardId) return true;
      var graphic = getObj('graphic', graphicId);
      return graphic && graphic.get('name') == 'sd_apng:' + cardId;
    });
    if (stopLinkedAudio) {
      var stopped = {};
      activeIds.forEach(function (graphicId) {
        var watch = linkedWatches[graphicId];
        if (
          watch &&
          watch.trackId != exceptTrackId &&
          !stopped[watch.trackId]
        ) {
          stopped[watch.trackId] = true;
          stopLinkedAudioTrack(watch.trackId);
        }
      });
    }
    activeIds.slice().forEach(removeGraphic);
  }

  function stopLinkedAudioTrack(trackId) {
    var track = getObj('jukeboxtrack', trackId);
    if (!track) return;
    if (apngHasPlugin('audio')) {
      audioLinkBusy = true;
      try {
        apngCall('audio', 'cue', [['중지', 'id:' + trackId], {}]);
      } finally {
        audioLinkBusy = false;
      }
    } else track.set({ playing: false, softstop: false });
  }

  function removeGraphic(id) {
    if (hideTimers[id]) clearTimeout(hideTimers[id]);
    delete hideTimers[id];
    clearLinkedWatch(id);
    var graphic = getObj('graphic', id);
    if (graphic) graphic.remove();
    var index = state.KIBSceneAPNG.activeIds.indexOf(id);
    if (index > -1) state.KIBSceneAPNG.activeIds.splice(index, 1);
  }

  function saveCardSetting(args) {
    if (!args || args.length < 2)
      return whisper(
        '사용법: <code>!APNG 설정|카드 이름|반복</code> 또는 <code>!APNG 설정|카드 이름|1회|3초</code>',
      );
    var cardResult = findCard(args[0]);
    if (!cardResult.ok) return whisper(cardResult.error);
    var mode = parseMode(args[1]);
    if (!mode)
      return whisper(
        '재생 방식은 <code>반복</code> 또는 <code>1회</code>여야 합니다.',
      );
    var duration = args[2] ? parseDuration(args[2]) : SETTING.DEFAULT_DURATION;
    if (!(duration >= 100 && duration <= 600000))
      return whisper('APNG 재생 시간은 0.1초에서 600초 사이여야 합니다.');
    var saved = state.KIBSceneAPNG.cardSettings[cardResult.card.id] || {};
    var placement = args[3] ? parsePlacement(args[3]) : saved.placement || 'full';
    if (!placement) return whisper('재생 위치는 전체 또는 영역을 선택하세요.');
    state.KIBSceneAPNG.cardSettings[cardResult.card.id] = {
      mode: mode,
      duration: duration,
      placement: placement,
    };
    updateMacro();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(cardResult.card.get('name')) +
        '</b> / 재생 시간: ' + formatSeconds(duration) + ' / 재생 위치: ' + (placement === 'area' ? '지정 영역' : '전체'),
    );
  }

  function bindAudio(args) {
    if (!args || args.length < 2)
      return whisper(
        '사용법: <code>!APNG 연결|APNG 카드 이름|효과음 제목</code>',
      );
    var cardResult = findCard(args[0]);
    if (!cardResult.ok) return whisper(cardResult.error);
    var trackResult = findTrack(args[1]);
    if (!trackResult.ok) return whisper(trackResult.error);
    Object.keys(state.KIBSceneAPNG.audioLinks).forEach(function (cardId) {
      if (state.KIBSceneAPNG.audioLinks[cardId] == trackResult.track.id)
        delete state.KIBSceneAPNG.audioLinks[cardId];
    });
    state.KIBSceneAPNG.audioLinks[cardResult.card.id] = trackResult.track.id;
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(cardResult.card.get('name')) +
        '</b>에 <b>' +
        escapeHtml(trackResult.track.get('title')) +
        '</b> 효과음을 연결했습니다.',
    );
  }

  function unbindAudio(args) {
    var cardResult = findCard(args && args[0]);
    if (!cardResult.ok) return whisper(cardResult.error);
    if (!state.KIBSceneAPNG.audioLinks[cardResult.card.id])
      return whisper('해당 APNG 카드에 연결된 효과음이 없습니다.');
    delete state.KIBSceneAPNG.audioLinks[cardResult.card.id];
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(cardResult.card.get('name')) +
        '</b>의 효과음 연결을 해제했습니다.',
    );
  }

  function findTrack(reference) {
    var ref = String(reference || '').trim();
    if (ref.indexOf('id:') === 0) {
      var track = getObj('jukeboxtrack', ref.substring(3));
      return track
        ? { ok: true, track: track }
        : { ok: false, error: '쥬크박스 효과음을 찾지 못했습니다.' };
    }
    var matches = (findObjs({ _type: 'jukeboxtrack' }) || []).filter(
      function (track) {
        return String(track.get('title') || '').trim() == ref;
      },
    );
    if (!matches.length)
      return {
        ok: false,
        error: '쥬크박스 효과음을 찾지 못했습니다: ' + escapeHtml(ref),
      };
    if (matches.length > 1)
      return {
        ok: false,
        error: '같은 제목의 쥬크박스 음원이 여러 개입니다: ' + escapeHtml(ref),
      };
    return { ok: true, track: matches[0] };
  }

  function audioLinkStatus() {
    var rows = Object.keys(state.KIBSceneAPNG.audioLinks).map(
      function (cardId) {
        var card = getObj('card', cardId);
        var track = getObj(
          'jukeboxtrack',
          state.KIBSceneAPNG.audioLinks[cardId],
        );
        return (
          escapeHtml(card ? card.get('name') : '(삭제된 카드)') +
          ': ' +
          escapeHtml(track ? track.get('title') : '(삭제된 음원)')
        );
      },
    );
    return rows.length
      ? '<b>APNG와 효과음 연결</b><br>' + rows.join('<br>')
      : '연결된 APNG와 효과음이 없습니다.';
  }

  function findCard(reference) {
    var deckResult = findDeck();
    if (!deckResult.ok) return deckResult;
    var ref = String(reference || '').trim();
    var cards;
    if (/^id[:=]/.test(ref)) {
      var card = getObj('card', ref.substring(3));
      cards = card && card.get('_deckid') == deckResult.deck.id ? [card] : [];
    } else
      cards =
        findObjs({ _type: 'card', _deckid: deckResult.deck.id, name: ref }) ||
        [];
    if (!cards.length)
      return {
        ok: false,
        error:
          'apng 덱에 이름이 <b>' + escapeHtml(ref) + '</b>인 카드가 없습니다.',
      };
    if (cards.length > 1)
      return {
        ok: false,
        error:
          'apng 덱에 같은 이름의 카드가 여러 개 있습니다: <b>' +
          escapeHtml(ref) +
          '</b>',
      };
    return { ok: true, card: cards[0] };
  }

  function findDeck() {
    var decks = findObjs({ _type: 'deck', name: SETTING.DECK_NAME }) || [];
    if (!decks.length)
      decks = findObjs({ type: 'deck', name: SETTING.DECK_NAME }) || [];
    if (!decks.length)
      return {
        ok: false,
        error:
          '이름이 <b>' +
          escapeHtml(SETTING.DECK_NAME) +
          '</b>인 덱이 없습니다.',
      };
    if (decks.length > 1)
      return {
        ok: false,
        error:
          '이름이 <b>' +
          escapeHtml(SETTING.DECK_NAME) +
          '</b>인 덱이 여러 개입니다.',
      };
    return { ok: true, deck: decks[0] };
  }

  function findPage() {
    var pages = findObjs({ _type: 'page', name: SETTING.PAGE_NAME }) || [];
    if (!pages.length)
      pages = findObjs({ type: 'page', name: SETTING.PAGE_NAME }) || [];
    if (!pages.length)
      return {
        ok: false,
        error:
          '이름이 <b>' +
          escapeHtml(SETTING.PAGE_NAME) +
          '</b>인 페이지가 없습니다.',
      };
    if (pages.length > 1)
      return {
        ok: false,
        error:
          '이름이 <b>' +
          escapeHtml(SETTING.PAGE_NAME) +
          '</b>인 페이지가 여러 개입니다.',
      };
    return { ok: true, page: pages[0] };
  }

  function updateMacro() {
    initState();
    var deckResult = findDeck();
    var cards = deckResult.ok
      ? (findObjs({ _type: 'card', _deckid: deckResult.deck.id }) || []).filter(
          function (card) {
            return !!cleanImageUrl(card.get('avatar'));
          },
        )
      : [];
    cards.sort(function (a, b) {
      return String(a.get('name') || '').localeCompare(
        String(b.get('name') || ''),
      );
    });
    var playTarget =
      cards.length === 1
        ? 'id:' + cards[0].id
        : '?{APNG 선택' +
          cards
            .map(function (card) {
              return '|' + card.get('name') + ',id:' + card.id;
            })
            .join('') +
          '}';
    var playAction =
      '!APNG 재생|' +
      playTarget +
      '|?{표시 위치|전체,전체|지정 영역,영역}|?{재생 방식|1회,1회|반복,반복}|?{APNG 재생 시간|3초}';
    var stopAction = '!APNG 중지|?{중지할 APNG|전체,전체';
    cards.forEach(function (card) {
      stopAction += '|' + card.get('name') + ',id:' + card.id;
    });
    stopAction += '}';
    var action = cards.length
      ? '?{APNG 동작|재생,' +
        macroEscape(playAction) +
        '|중지,' +
        macroEscape(stopAction) +
        '}'
      : '!APNG 매크로없음';
    var players = findObjs({ _type: 'player' }) || [];
    if (!players.length) players = findObjs({ type: 'player' }) || [];
    var gmIds = players
      .filter(function (player) {
        return playerIsGM(player.id);
      })
      .map(function (player) {
        return player.id;
      });
    var owner = gmIds[0] || (players[0] && players[0].id);
    if (!owner) return;
    var macroKey = String(SETTING.MACRO_NAME)
      .replace(/\uFE0F/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
    var macros =
      (findObjs({ _type: 'macro' }) || []).filter(function (obj) {
        return (
          String(obj.get('name') || '')
            .replace(/\uFE0F/g, '')
            .replace(/\s+/g, '')
            .toLowerCase() == macroKey
        );
      }) || [];
    var options = {
      name: SETTING.MACRO_NAME,
      action: action,
      visibleto: gmIds.join(','),
    };
    if (macros.length) {
      var keeper = macros[0];
      if (
        keeper.get('name') != options.name ||
        keeper.get('action') != options.action ||
        keeper.get('visibleto') != options.visibleto
      )
        keeper.set(options);
      macros.forEach(function (macro) {
        if (macro.id != keeper.id) macro.remove();
      });
    } else {
      options.playerid = owner;
      createObj('macro', options);
    }
    return 1;
  }

  function scheduleMacro() {
    if (macroTimer) clearTimeout(macroTimer);
    macroTimer = setTimeout(function () {
      macroTimer = null;
      apngRefreshSafe();
    }, 100);
  }

  function scheduleMacroForCard(obj, prev) {
    var ids = [obj && obj.get('_deckid'), prev && prev._deckid].filter(Boolean);
    if (
      ids.some(function (id) {
        var deck = getObj('deck', id);
        return deck && deck.get('name') == SETTING.DECK_NAME;
      })
    )
      scheduleMacro();
  }

  function scheduleMacroForDeck(obj, prev) {
    if (
      (obj && obj.get('name') == SETTING.DECK_NAME) ||
      (prev && prev.name == SETTING.DECK_NAME)
    )
      scheduleMacro();
  }

  function apngRefreshSafe() {
    try {
      pruneSettings();
      updateMacro();
      refreshHelp();
    } catch (err) {
      whisper(
        '<b>APNG 매크로를 갱신하지 못했습니다.</b><br><code>apng</code> 덱을 확인해 주세요.<br><span style="font-size:11px;color:#687386">오류 내용: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  }

  function pruneSettings() {
    Object.keys(state.KIBSceneAPNG.cardSettings).forEach(function (id) {
      if (!getObj('card', id)) delete state.KIBSceneAPNG.cardSettings[id];
    });
    Object.keys(state.KIBSceneAPNG.audioLinks).forEach(function (cardId) {
      if (
        !getObj('card', cardId) ||
        !getObj('jukeboxtrack', state.KIBSceneAPNG.audioLinks[cardId])
      )
        delete state.KIBSceneAPNG.audioLinks[cardId];
    });
  }

  function transitionCues(source) {
    var text = String(source || '').trim();
    if (!text || text === '-') return { ok: true, cues: [] };
    if (text[0] !== '@') return { ok: false, error: '중간 명령은 @명령으로 입력하세요.' };
    var cues = [];
    var chunks = text.split(/\s+(?=@)/);
    for (var i = 0; i < chunks.length; i++) {
      var match = chunks[i].match(/^@([^\s|@]+)(?:\s+|\|)?([\s\S]*)$/);
      var resolved = match && typeof KIBScene.resolveCueAlias === 'function'
        ? KIBScene.resolveCueAlias(match[1]) : null;
      if (!resolved && match) {
        Object.keys(KIBScene.adapters).some(function (name) {
          var adapter = KIBScene.adapters[name];
          var aliases = adapter.aliases || {};
          var key = Object.keys(aliases).filter(function (alias) {
            return alias.toLowerCase() === match[1].toLowerCase();
          })[0];
          if (key !== undefined || name.toLowerCase() === match[1].toLowerCase()) {
            resolved = { type: name, action: key === undefined ? '' : aliases[key] };
            return true;
          }
          return false;
        });
      }
      if (!resolved) return { ok: false, error: '사용할 수 없는 중간 명령: ' + escapeHtml(chunks[i]) };
      var args = match[2].trim() ? match[2].split('|').map(function (part) { return part.trim(); }) : [];
      if (resolved.action) args.unshift(resolved.action);
      if (resolved.type === 'apng' && /^(?:전환|중지|정리|stop|clear)$/.test(args[0] || ''))
        return { ok: false, error: '장면전환 안에서 전환이나 APNG 중지는 사용할 수 없습니다.' };
      cues.push({ type: resolved.type, args: args, raw: chunks[i] });
    }
    return { ok: true, cues: cues };
  }

  function checkTransitionCues(cues, context) {
    for (var i = 0; i < cues.length; i++) {
      var cue = cues[i];
      var adapter = KIBScene.adapters[cue.type];
      if (!adapter || typeof adapter.cue !== 'function' || typeof adapter.validate !== 'function')
        return { ok: false, error: '검증할 수 없는 중간 명령: ' + escapeHtml(cue.type) };
      if (typeof KIBScene.isFeatureEnabled === 'function' && !KIBScene.isFeatureEnabled(cue.type))
        return { ok: false, error: '중간 명령 기능이 꺼져 있습니다: ' + escapeHtml(cue.type) };
      var result = typeof KIBScene.validate === 'function'
        ? KIBScene.validate(cue, context || {}) : adapter.validate(cue.args, context || {});
      if (result && (result.ok === false || result.skipped))
        return { ok: false, error: result.error || '중간 명령을 실행할 수 없습니다.' };
    }
    return { ok: true };
  }

  function inspectTransition(args) {
    if (!SETTING.ENABLED) return { ok: true, skipped: true };
    var ref = String(args[0] || '').trim();
    var presets = state.KIBSceneAPNG.transitions;
    var matches = Object.keys(presets).filter(function (id) {
      return /^id[:=]/.test(ref) ? ref.substring(3) === id : presets[id].name === ref;
    });
    if (matches.length !== 1) return { ok: false, error: '장면전환 이름 확인: ' + escapeHtml(ref) };
    var preset = presets[matches[0]];
    var cover = parsePlayArgs(['id:' + preset.cover, '1회', preset.coverMs + 'ms', preset.placement]);
    if (!cover.ok || cover.skipped) return cover;
    var reveal = parsePlayArgs(['id:' + preset.reveal, '1회', preset.revealMs + 'ms', preset.placement]);
    if (!reveal.ok || reveal.skipped) return reveal;
    var parsed = transitionCues(args.length > 1 ? args.slice(1).join('|') : preset.commands);
    if (!parsed.ok) return parsed;
    var checked = checkTransitionCues(parsed.cues);
    if (!checked.ok) return checked;
    return { ok: true, name: preset.name, cover: cover, reveal: reveal, cues: parsed.cues,
      duration: preset.coverMs + preset.revealMs };
  }

  function enqueueTransition(args, context) {
    var plan = inspectTransition(args);
    if (!plan.ok || plan.skipped) return plan;
    if (transitionQueue.length >= 20) return { ok: false, error: '장면전환 대기열이 가득 찼습니다.' };
    var waitMs = transitionRun ? Math.max(0, transitionRun.endsAt - Date.now()) : 0;
    transitionQueue.forEach(function (queued) { waitMs += queued.plan.duration; });
    transitionQueue.push({ args: args.slice(), plan: plan, context: context || {} });
    if (!transitionRun) startNextTransition();
    return { ok: true, waitMs: waitMs + plan.duration };
  }

  function transitionLater(callback, delay) {
    transitionTimer = setTimeout(function () {
      transitionTimer = null;
      try { callback(); }
      catch (err) { finishTransition('장면전환 실패: ' + escapeHtml(err.message || err)); }
    }, delay);
  }

  function startNextTransition() {
    if (transitionRun || !transitionQueue.length) return;
    var entry = transitionQueue.shift();
    var plan = inspectTransition(entry.args);
    if (!plan.ok || plan.skipped) {
      whisper(plan.error || '장면전환 기능 꺼짐');
      startNextTransition();
      return;
    }
    transitionRun = { context: entry.context, ids: [], endsAt: Date.now() + plan.duration };
    try {
      var front = show(plan.cover, null, true);
      if (!front.ok) return finishTransition(front.error);
      transitionRun.ids.push(front.id);
      transitionLater(function () {
        var nextCard = parsePlayArgs(['id:' + plan.reveal.card.id, '1회', plan.reveal.cycleDuration + 'ms', plan.reveal.placement]);
        if (!nextCard.ok || nextCard.skipped) return finishTransition(nextCard.error || '뒤 연출 실행 불가');
        var checked = checkTransitionCues(plan.cues, entry.context);
        if (!checked.ok) return finishTransition(checked.error);
        for (var i = 0; i < plan.cues.length; i++) {
          var cue = plan.cues[i];
          var result = typeof KIBScene.execute === 'function'
            ? KIBScene.execute(cue, entry.context)
            : KIBScene.adapters[cue.type].cue(cue.args, entry.context);
          if (result && (result.ok === false || result.skipped))
            return finishTransition(result.error || '중간 명령 실행 불가');
        }
        // 앞 연출을 유지한 채 뒤 연출을 먼저 만들어 토큰 공백을 줄인다.
        var back = show(nextCard, null, true);
        if (!back.ok) return finishTransition(back.error);
        transitionRun.ids.push(back.id);
        transitionRemoving = true;
        try { removeGraphic(front.id); } finally { transitionRemoving = false; }
        transitionLater(function () { finishTransition(); }, plan.reveal.cycleDuration);
      }, plan.cover.cycleDuration);
    } catch (err) { finishTransition('장면전환 실패: ' + escapeHtml(err.message || err)); }
  }

  function finishTransition(error) {
    if (transitionTimer !== null) clearTimeout(transitionTimer);
    transitionTimer = null;
    var run = transitionRun;
    transitionRun = null;
    transitionRemoving = true;
    try { if (run) run.ids.forEach(removeGraphic); }
    finally { transitionRemoving = false; }
    if (error && run && typeof run.context.onAsyncError === 'function') run.context.onAsyncError(error);
    else if (error) whisper(error);
    startNextTransition();
  }

  function cancelTransitions(narratorOnly) {
    transitionQueue = narratorOnly ? transitionQueue.filter(function (entry) { return !entry.context.narrator; }) : [];
    if (transitionRun && (!narratorOnly || transitionRun.context.narrator)) finishTransition();
  }

  function saveTransition(args) {
    var id = args[0];
    var name = String(args[1] || '').trim();
    if (!name || /[|{}\r\n]/.test(name)) return whisper('장면전환 이름 확인');
    var presets = state.KIBSceneAPNG.transitions;
    if (id !== '새로' && !Object.prototype.hasOwnProperty.call(presets, id)) return whisper('장면전환 없음');
    if (Object.keys(presets).some(function (key) { return key !== id && presets[key].name === name; })) return whisper('장면전환 이름 중복');
    var cover = findCard(args[2]);
    var reveal = findCard(args[4]);
    if (!cover.ok || !reveal.ok) return whisper((!cover.ok ? cover : reveal).error);
    var coverMs = parseDuration(args[3]);
    var revealMs = parseDuration(args[5]);
    var placement = parsePlacement(args[6]);
    if (!(coverMs >= 100 && coverMs <= 600000 && revealMs >= 100 && revealMs <= 600000) || !placement)
      return whisper('앞뒤 시간 0.1~600초 / 위치 전체 또는 영역');
    var commands = args.slice(7).join('|');
    var parsed = transitionCues(commands);
    if (!parsed.ok) return whisper(parsed.error);
    var checked = checkTransitionCues(parsed.cues);
    if (!checked.ok) return whisper(checked.error);
    if (id === '새로') id = 't' + (++state.KIBSceneAPNG.transitionCounter);
    presets[id] = { name: name, cover: cover.card.id, coverMs: coverMs, reveal: reveal.card.id,
      revealMs: revealMs, placement: placement, commands: commands };
    refreshHelp();
    whisper('장면전환 저장: ' + escapeHtml(name));
  }

  function transitionButton(label, command, color) {
    return '<a href="' + escapeHtml(command).replace(/\?/g, '&#63;') +
      '" style="display:inline-block;padding:4px 7px;margin:2px 3px 2px 0;background:' + (color || '#53657d') +
      ';color:#fff;text-decoration:none;border-radius:0;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function apngSection(title, body) {
    return '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
      '<div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' + escapeHtml(title) +
      '</div><div style="padding:9px">' + body + '</div></div>';
  }

  function transitionControls() {
    initState();
    var deck = findDeck();
    var cards = deck.ok ? findObjs({ _type: 'card', _deckid: deck.deck.id }) : [];
    var presets = state.KIBSceneAPNG.transitions;
    function editButton(id, preset) {
      function cardQuery(label, selected) {
        var sorted = cards.slice().sort(function (a, b) { return (a.id === selected ? -1 : 0) - (b.id === selected ? -1 : 0); });
        return '?{' + label + '|' + sorted.map(function (card) {
          return String(card.get('name')).replace(/[|,{}]/g, ' ') + ',id=' + card.id;
        }).join('|') + '}';
      }
      return transitionButton(preset ? '전환 설정 수정' : '장면전환 만들기', '!APNG 전환저장|' + id +
        '|?{장면전환 이름|' + (preset ? macroEscape(preset.name) : '') + '}|' + cardQuery('앞 연출 APNG', preset && preset.cover) +
        '|?{앞 연출 시간|' + (preset ? formatSeconds(preset.coverMs) : '1.2초') + '}|' + cardQuery('뒤 연출 APNG', preset && preset.reveal) +
        '|?{뒤 연출 시간|' + (preset ? formatSeconds(preset.revealMs) : '1.2초') + '}|?{위치|' +
        (preset && preset.placement === 'area' ? '영역,영역|전체,전체' : '전체,전체|영역,영역') +
        '}|' + (preset ? preset.commands : '?{기본 중간 명령 비우면 없음|}'), '#7654a8');
    }
    var rows = Object.keys(presets).map(function (id) {
      var preset = presets[id];
      var coverCard = getObj('card', preset.cover);
      var revealCard = getObj('card', preset.reveal);
      return '<div style="padding:7px;margin-top:7px;background:#fff;border:1px solid #bbb"><b>' + escapeHtml(preset.name) + '</b>' +
        '<div style="margin:5px 0;font-size:12px">재생 위치: ' + (preset.placement === 'area' ? '지정 영역' : '전체') +
        '<br>앞 연출: ' + escapeHtml(coverCard ? coverCard.get('name') : '카드 없음') + ' / ' + formatSeconds(preset.coverMs) +
        '<br>뒤 연출: ' + escapeHtml(revealCard ? revealCard.get('name') : '카드 없음') + ' / ' + formatSeconds(preset.revealMs) +
        '<br>중간 명령: ' + (preset.commands && preset.commands !== '-' ? '<code>' + escapeHtml(preset.commands) + '</code>' : '없음') + '</div>' +
        transitionButton('전환 실행', '!APNG 전환|id=' + id, '#287a4b') +
        transitionButton('명령 지정 실행', '!APNG 전환|id=' + id + '|?{중간 명령 없으면 -|-}') + editButton(id, preset) +
        transitionButton('중간 명령 수정', '!APNG 전환명령|' + id + '|?{새 중간 명령 비우면 없음|}', '#7654a8') +
        transitionButton('삭제', '!APNG 전환삭제|' + id, '#8b3940') + '</div>';
    }).join('');
    return apngSection('장면전환',
      '<div style="padding:8px 9px;margin-bottom:7px;background:#f3f3f3;border-left:4px solid #111">' +
      '두 APNG와 실행 시점을 묶어서 장면전환으로 저장합니다. 일반 APNG 재생과는 별도 기능입니다.<br>' +
      '앞 APNG를 등록한 시간 동안 표시한 뒤, 중간 명령을 실행하고 뒤 APNG를 표시합니다. 앞뒤 APNG는 각각 1회만 사용합니다.<br>' +
      '중간 명령은 비워도 됩니다. 배경이나 이미지를 바꾸려면 해당 모듈의 명령을 넣으세요.<br>' +
      '전체 화면과 지정 영역 모두 사용할 수 있으며, 불투명한 덮개는 추가하지 않습니다.</div>' +
      (cards.length ? editButton('새로') : 'apng 덱에 카드를 등록하세요.') +
      transitionButton('전환 중지', '!APNG 전환중지', '#8b3940') + rows +
      '<div style="margin-top:8px;font-size:12px"><code>!APNG 전환|전환명</code> 저장한 전환을 실행합니다.<br>' +
      '<code>!APNG 전환|전환명|@비주얼 배경 장면명</code> 이번에 실행할 중간 명령을 지정합니다. 해당 모듈이 설치돼 있어야 합니다.<br>' +
      '<code>!APNG 전환|전환명|-</code> 중간 명령 없이 앞뒤 APNG만 재생합니다.<br>' +
      '<code>!... @장면전환 전환명</code> 나레이터와 함께 쓰면 전환이 끝난 뒤 다음 줄을 출력합니다.<br>' +
      '전환 중지는 실행 중인 전환과 대기열만 취소하며, 등록한 설정은 유지합니다.</div>');
  }

  function refreshManager() {
    initState();
    var manager = state.KIBSceneAPNG.managerId ? getObj('handout', state.KIBSceneAPNG.managerId) : null;
    if (!manager) manager = (findObjs({ _type: 'handout', name: SETTING.MANAGER_NAME }) || [])[0];
    if (!manager) manager = createObj('handout', { name: SETTING.MANAGER_NAME, inplayerjournals: '', controlledby: '' });
    if (!manager) return;
    state.KIBSceneAPNG.managerId = manager.id;
    manager.set('notes', statusHtml());
  }

  function statusHtml() {
    var deckResult = findDeck();
    var cards = deckResult.ok ? findObjs({ _type: 'card', _deckid: deckResult.deck.id }) || [] : [];
    var rows = cards
      .map(function (card) {
        var saved = state.KIBSceneAPNG.cardSettings[card.id] || {};
        var mode = saved.mode || SETTING.DEFAULT_MODE;
        var duration = Number(saved.duration) || SETTING.DEFAULT_DURATION;
        var placement = saved.placement || 'full';
        // Roll20 removes handout hrefs when an id: before any query is treated as a URL scheme.
        var reference = 'id=' + card.id;
        var settingCommand = '!APNG 설정|' + reference + '|' + mode + '|' + duration + 'ms|';
        return (
          '<div style="padding:7px;margin-top:7px;background:#fff;border:1px solid #bbb"><b>' +
          escapeHtml(card.get('name')) +
          '</b><div style="margin:5px 0;font-size:12px">재생 시간: ' + formatSeconds(duration) +
          '<br>재생 위치: ' + (placement === 'area' ? '지정 영역 (' + escapeHtml(SETTING.AREA_NAME) + ')' : '전체') + '</div>' +
          transitionButton('전체' + (placement === 'full' ? ' ✓' : ''), settingCommand + '전체', placement === 'full' ? '#287a4b' : '#53657d') +
          transitionButton('지정 영역' + (placement === 'area' ? ' ✓' : ''), settingCommand + '영역', placement === 'area' ? '#287a4b' : '#53657d') + '<br>' +
          transitionButton('실행', '!APNG 재생|' + reference + '|1회|' + duration + 'ms|' + placement, '#287a4b') +
          transitionButton('반복 실행', '!APNG 재생|' + reference + '|반복|' + duration + 'ms|' + placement, '#287a4b') +
          transitionButton('중지', '!APNG 중지|' + reference, '#8b3940') +
          transitionButton('재생 시간 변경', '!APNG 설정|' + reference + '|' + mode + '|?{재생 시간|' + formatSeconds(duration) + '}', '#7654a8') +
          '</div>'
        );
      })
      .join('');
    return (
      '<div style="font-family:Arial,sans-serif;color:#111;background:#fff;line-height:1.45">' +
      '<div style="padding:12px;background:#111;color:#fff;font-size:20px;font-weight:bold">📽️ APNG 관리</div>' +
      apngSection('적용 설정', '<div style="padding:8px 9px;background:#f3f3f3;border-left:4px solid #111">' +
        '<b>적용 페이지:</b> ' + escapeHtml(SETTING.PAGE_NAME) + '<br><b>카드 덱:</b> ' + escapeHtml(SETTING.DECK_NAME) +
        '<br><b>전체 재생:</b> 적용 페이지 전체를 사용합니다. 맵시트가 등록돼 있으면 해당 영역을 사용합니다.' +
        '<br><b>지정 영역:</b> <code>' + escapeHtml(SETTING.AREA_NAME) + '</code> 토큰의 위치와 크기를 사용합니다.</div>') +
      apngSection('APNG 재생', '<div style="padding:8px 9px;margin-bottom:7px;background:#f3f3f3;border-left:4px solid #111">' +
        '장면전환을 등록하지 않아도 카드별로 바로 재생할 수 있습니다.<br>' +
        '카드에서 <b>전체</b> 또는 <b>지정 영역</b>을 먼저 선택한 뒤 실행하세요. 체크된 위치에 재생합니다.<br>' +
        '<b>실행:</b> 등록한 시간 동안 표시한 뒤 화면에서 제거합니다.<br>' +
        '<b>반복 실행:</b> 중지할 때까지 표시합니다. 연결된 음원이 있으면 기존 음원 연동 설정을 따릅니다.<br>' +
        '<b>중지:</b> 해당 카드가 표시 중이면 즉시 제거합니다.<br>' +
        '<b>재생 시간 변경:</b> 일반 실행의 표시 시간을 바꿉니다. 장면전환에 등록한 앞뒤 시간은 바뀌지 않습니다.</div>' +
        (rows || (deckResult.ok ? 'apng 덱에 카드를 등록하세요.' : deckResult.error))) +
      transitionControls() + '</div>'
    );
  }

  function initState() {
    state.KIBSceneAPNG = state.KIBSceneAPNG || {};
    state.KIBSceneAPNG.cardSettings = state.KIBSceneAPNG.cardSettings || {};
    state.KIBSceneAPNG.audioLinks = state.KIBSceneAPNG.audioLinks || {};
    state.KIBSceneAPNG.transitions = state.KIBSceneAPNG.transitions || {};
    state.KIBSceneAPNG.transitionCounter = state.KIBSceneAPNG.transitionCounter || 0;
    state.KIBSceneAPNG.activeIds = Array.isArray(state.KIBSceneAPNG.activeIds)
      ? state.KIBSceneAPNG.activeIds
      : [];
  }

  function apngCall(name, method, args) {
    if (typeof KIBScene.call === 'function')
      return KIBScene.call(name, method, args);
    var adapter = KIBScene.adapters[name];
    if (adapter && typeof adapter[method] === 'function')
      return adapter[method].apply(adapter, args || []);
    return method == 'cue' && typeof KIBScene.handlers[name] === 'function'
      ? KIBScene.handlers[name].apply(null, args || [])
      : undefined;
  }

  function apngHasPlugin(name) {
    return (
      !!KIBScene.adapters[name] || typeof KIBScene.handlers[name] === 'function'
    );
  }

  function parseMode(value) {
    var text = String(value || '')
      .trim()
      .toLowerCase();
    if (text == '반복' || text == 'loop') return 'loop';
    if (text == '1회' || text == '단일' || text == 'once' || text == 'single')
      return 'once';
    return '';
  }

  function parsePlacement(value) {
    var text = String(value || '')
      .replace(/\s+/g, '')
      .toLowerCase();
    if (
      text == '전체' ||
      text == '전체화면' ||
      text == '맵시트' ||
      text == 'full'
    )
      return 'full';
    if (
      text == '영역' ||
      text == '지정영역' ||
      text == '제한' ||
      text == '위치제한' ||
      text == 'area'
    )
      return 'area';
    return '';
  }

  function parseDuration(value) {
    var match = String(value || '')
      .trim()
      .toLowerCase()
      .match(/^(\d+(?:\.\d+)?)\s*(초|s|ms)?$/);
    if (!match) return null;
    var amount = Number(match[1]);
    return match[2] == 'ms' ? Math.round(amount) : Math.round(amount * 1000);
  }

  function formatSeconds(ms) {
    return String(Number(ms) / 1000) + '초';
  }

  function cleanImageUrl(url) {
    var match = String(url || '')
      .trim()
      .match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/i);
    return match ? match[1] + 'thumb' + match[3] + (match[4] || '') : '';
  }

  function macroEscape(value) {
    return String(value || '')
      .replace(/\|/g, '&#124;')
      .replace(/,/g, '&#44;')
      .replace(/}/g, '&#125;');
  }

  function refreshHelp() {
    refreshManager();
    if (typeof KIBScene.refreshHandout === 'function')
      KIBScene.refreshHandout();
  }

  function whisper(message) {
    sendChat(API, '/w gm ' + message, null, { noarchive: true });
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
