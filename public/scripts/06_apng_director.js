/*
 * Scene Suite 06 - APNG Director 1.1.1
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
  };

  // ===== 실행 상태 =====
  var API = 'APNG';
  var macroTimer = null;
  var hideTimers = {};
  var linkedWatches = {};
  var audioLinkBusy = false;

  on('ready', function () {
    initState();
    clearActive(false);
    if (SETTING.SCENE_DIRECTOR_ENABLED) {
      var cue = function (args) {
        var stop = inspectStopCue(args);
        if (stop) {
          if (!stop.ok) return stop;
          stopActive(stop.card ? stop.card.id : null, true);
          return { ok: true, stopped: true };
        }
        var parsed = parsePlayArgs(args);
        if (!parsed.ok) return parsed;
        return show(parsed);
      };
      var adapter = {
        meta: { code: '06_apng_director.js', title: 'APNG' },
        aliases: { APNG: '', apng: '', 에이피엔지: '' },
        cue: cue,
        validate: function (args) {
          return inspectStopCue(args) || parsePlayArgs(args);
        },
        onAudioPlay: playLinkedApngForAudio,
        playLinkedAPNGForAudio: playLinkedApngForAudio,
        bringToFront: bringActiveToFront,
        help: [
          '<code>@APNG 카드 이름|1회|3초|전체</code> 한 번 재생',
          '<code>@APNG 카드 이름|반복|영역</code> 중지할 때까지 반복',
          '<code>전체</code> 적용 페이지 전체',
          '<code>영역</code> ' + escapeHtml(SETTING.AREA_NAME) + ' 위치',
          '<code>@APNG 중지</code>',
          '<code>@APNG 카드 이름|중지</code>',
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

  [
    'add:card',
    'change:card',
    'destroy:card',
    'add:deck',
    'change:deck',
    'destroy:deck',
  ].forEach(function (eventName) {
    on(eventName, scheduleMacro);
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
      stopActive(stop.card ? stop.card.id : null, true);
      return;
    }
    if (action == '설정') return saveCardSetting(parts);
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
      '사용법: <code>!APNG 재생|카드 이름|1회|3초|전체</code><br><code>!APNG 재생|카드 이름|반복|영역</code><br><code>!APNG 중지</code>',
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
    var placement = 'full';
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
        error: 'APNG 한 사이클 시간은 0.1초에서 600초 사이여야 합니다.',
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

  function show(parsed, sourceTrackId) {
    if (parsed.skipped) return parsed;
    stopActive(parsed.card.id, true, sourceTrackId);
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
    if (parsed.mode == 'once') {
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
          '</b> 페이지 GM 레이어에 <b>' +
          escapeHtml(SETTING.AREA_NAME) +
          '</b> 토큰을 하나 놓아 주세요.',
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
      return whisper('APNG 한 사이클 시간은 0.1초에서 600초 사이여야 합니다.');
    state.KIBSceneAPNG.cardSettings[cardResult.card.id] = {
      mode: mode,
      duration: duration,
    };
    updateMacro();
    refreshHelp();
    whisper(
      '<b>' +
        escapeHtml(cardResult.card.get('name')) +
        '</b> 재생 설정: ' +
        (mode == 'loop'
          ? '반복, 한 사이클 ' + formatSeconds(duration)
          : '1회, 한 사이클 ' + formatSeconds(duration)),
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
    if (ref.indexOf('id:') === 0) {
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
      '|?{표시 위치|전체,전체|지정 영역,영역}|?{재생 방식|1회,1회|반복,반복}|?{APNG 한 사이클 시간|3초}';
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

  function statusHtml() {
    var deckResult = findDeck();
    if (!deckResult.ok) return deckResult.error;
    var cards = findObjs({ _type: 'card', _deckid: deckResult.deck.id }) || [];
    var rows = cards
      .map(function (card) {
        var saved = state.KIBSceneAPNG.cardSettings[card.id] || {};
        var mode = saved.mode || SETTING.DEFAULT_MODE;
        var duration = Number(saved.duration) || SETTING.DEFAULT_DURATION;
        return (
          '<tr><td style="border:1px solid #ddd;padding:4px">' +
          escapeHtml(card.get('name')) +
          '</td><td style="border:1px solid #ddd;padding:4px">' +
          (mode == 'loop'
            ? '반복, 한 사이클 ' + formatSeconds(duration)
            : '1회, 한 사이클 ' + formatSeconds(duration)) +
          '</td></tr>'
        );
      })
      .join('');
    return (
      '<b>APNG 설정</b><br>적용 페이지: <b>' +
      escapeHtml(SETTING.PAGE_NAME) +
      '</b><br>카드 덱: <b>' +
      escapeHtml(SETTING.DECK_NAME) +
      '</b><br>전체 화면: 적용 페이지 전체<br>지정 영역: <b>' +
      escapeHtml(SETTING.AREA_NAME) +
      '</b> 토큰의 위치와 크기<table style="border-collapse:collapse;width:100%;margin-top:6px">' +
      rows +
      '</table>'
    );
  }

  function initState() {
    state.KIBSceneAPNG = state.KIBSceneAPNG || {};
    state.KIBSceneAPNG.cardSettings = state.KIBSceneAPNG.cardSettings || {};
    state.KIBSceneAPNG.audioLinks = state.KIBSceneAPNG.audioLinks || {};
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
    return String(Math.round(ms / 100) / 10) + '초';
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
