/*
 * Scene Suite 02 - Audio Bridge 1.8.6
 * 제작 및 통합: @EOOOOORK
 */
var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};
(function () {
  'use strict';

  // ===== 사용자 설정 =====
  var SETTING = {
    AUDIO_ENABLED: true,
    SCENE_DIRECTOR_ENABLED: true,

    // native: 쥬크박스 직접 제어, roll20am: Roll20AM 사용
    AUDIO_DRIVER: 'native',
    ROLL20AM_ACCEPT_API_AS_GM: true,
    // 페이드 갱신 간격(ms)
    FADE_IN_STEP_MS: 500,
    FADE_OUT_STEP_MS: 100,
    RESTART_DELAY_MS: 50,
    COMMAND: '!sd',
    KOREAN_AUDIO_COMMAND: '!오디오',
    BGM_MACRO_NAME: '🎵오디오',
    SFX_MACRO_NAME: '🪇효과음',
    MACRO_REFRESH_MS: 100,
  };

  // ===== 실행 상태 =====
  var bridge = KIBScene;
  var fades = {};
  var macroRefreshTimer = null;

  on('ready', function () {
    state.KIBSceneAudio = state.KIBSceneAudio || { aliases: {} };
    state.KIBSceneAudio.aliases = state.KIBSceneAudio.aliases || {};
    state.KIBSceneAudio.volumes = state.KIBSceneAudio.volumes || {};
    state.KIBSceneAudio.driver =
      state.KIBSceneAudio.driver || SETTING.AUDIO_DRIVER;
    state.KIBSceneAudio.classification = state.KIBSceneAudio.classification || {
      mode: 'auto',
      prefixes: [],
    };
    if (
      state.KIBSceneAudio.classification.mode != 'auto' &&
      state.KIBSceneAudio.classification.mode != 'prefix'
    )
      state.KIBSceneAudio.classification.mode = 'auto';
    if (!Array.isArray(state.KIBSceneAudio.classification.prefixes))
      state.KIBSceneAudio.classification.prefixes = [];
    if (SETTING.SCENE_DIRECTOR_ENABLED && SETTING.AUDIO_ENABLED) {
      var adapter = {
        meta: { code: '02_audio_bridge.js', title: '오디오' },
        aliases: {
          오디오: '',
          audio: '',
          오디오재생: '재생',
          오디오중지: '중지',
          오디오볼륨: '볼륨',
          오디오페이드인: '페이드인',
          오디오페이드아웃: '페이드아웃',
        },
        cue: handleAudioCue,
        validate: validateAudioCue,
        command: adapterCommand,
        status: function () {
          return { driver: state.KIBSceneAudio.driver };
        },
        help: [
          '<code>!오디오 재생|음원 제목|반복|볼륨=30|페이드=2초</code>',
          '<code>!오디오 중지|음원 제목|페이드=2초</code>',
          '<code>!오디오 전체중지|페이드=3초</code>',
        ],
      };
      if (typeof bridge.register === 'function')
        bridge.register('audio', adapter);
      else {
        bridge.adapters.audio = adapter;
        bridge.handlers.audio = adapter.cue;
      }
    }
    if (SETTING.AUDIO_ENABLED) {
      on('add:jukeboxtrack', scheduleAudioMacroRefresh);
      on('change:jukeboxtrack:title', scheduleAudioMacroRefresh);
      on('destroy:jukeboxtrack', scheduleAudioMacroRefresh);
      scheduleAudioMacroRefresh();
    }
  });

  on('chat:message', function (msg) {
    if (msg.type != 'api' || !playerIsGM(msg.playerid)) return;
    try {
      if (isCommand(msg.content, SETTING.KOREAN_AUDIO_COMMAND)) {
        if (!SETTING.AUDIO_ENABLED) return;
        return koreanAudioCommand(
          msg.content.substring(SETTING.KOREAN_AUDIO_COMMAND.length).trim(),
        );
      }
      if (
        !isCommand(msg.content, SETTING.COMMAND) ||
        typeof bridge.routeCommand === 'function'
      )
        return;
      handleCommand(msg.content.substring(SETTING.COMMAND.length).trim());
    } catch (err) {
      whisper(
        '<b>오디오 명령을 처리하지 못했습니다.</b><br><code>!오디오 help</code>에서 형식을 확인해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  });

  function handleCommand(source) {
    var parts = source.split('|').map(function (part) {
      return part.trim();
    });
    var command = parts.shift().split(/\s+/);
    if (command[0] == 'audio') return adapterCommand(command.slice(1), parts);
    whisper('형식: !오디오 재생|음원 제목|반복|볼륨=30|페이드=2초');
  }

  function koreanAudioCommand(source) {
    var parts = source.split('|').map(function (part) {
      return part.trim();
    });
    var action = parts.shift();
    if (!action) return audioUsage('동작이 없습니다.');
    if (normalize(action) == 'help' || action == '도움말') return audioUsage();
    if (action == '분류') return configureClassification(parts);
    if (action == '분류상태') return showClassification();
    if (action == '매크로없음')
      return whisper(
        parts[0] == 'BGM'
          ? '제목 앞에 이모지가 있는 BGM이 없습니다.'
          : '제목 앞에 이모지가 없는 효과음이 없습니다.',
      );
    if (action == '매크로갱신') {
      updateAudioMacros();
      return whisper('오디오 매크로를 갱신했습니다.');
    }
    return handleAudioCue([action].concat(parts));
  }

  function configureClassification(parts) {
    var mode = normalize(parts.shift());
    if (mode == '자동' || mode == 'auto') {
      state.KIBSceneAudio.classification = { mode: 'auto', prefixes: [] };
    } else if (mode == '지정' || mode == 'prefix') {
      var prefixes = parts.filter(function (item) {
        return item.length > 0;
      });
      if (!prefixes.length)
        return audioUsage(
          '지정 모드에는 BGM 표식 이모지를 하나 이상 입력하세요.',
        );
      state.KIBSceneAudio.classification = {
        mode: 'prefix',
        prefixes: prefixes,
      };
    } else {
      return audioUsage('분류는 자동 또는 지정만 사용할 수 있습니다.');
    }
    updateAudioMacros();
    showClassification();
    return { ok: true };
  }

  function showClassification() {
    var config = state.KIBSceneAudio.classification;
    return whisper(
      '오디오 자동 분류: <b>' +
        (config.mode == 'prefix' ? '지정 이모지' : '제목 앞 이모지 자동 감지') +
        '</b>' +
        (config.mode == 'prefix'
          ? '<br>표식: ' + escapeHtml(config.prefixes.join(' '))
          : '') +
        '<br><code>!오디오 분류|자동</code><br><code>!오디오 분류|지정|🌧️|🎻|🌙</code>',
    );
  }

  function adapterCommand(head, parts) {
    var action = normalize(head[0]);
    if (action == 'bind') return bind(parts[0], parts.slice(1).join('|'));
    if (action == 'unbind') {
      delete state.KIBSceneAudio.aliases[normalize(parts[0])];
      return whisper('별칭을 해제했습니다: ' + escapeHtml(parts[0]));
    }
    if (action == 'list') return listBindings();
    if (action == 'driver') {
      var driver = normalize(parts[0]);
      if (driver != 'native' && driver != 'roll20am')
        return whisper(
          '재생 방식은 <code>native</code> 또는 <code>roll20am</code>으로 입력해 주세요.',
        );
      state.KIBSceneAudio.driver = driver;
      return whisper(
        '오디오 재생 방식: <b>' +
          (driver == 'native' ? 'Roll20 쥬크박스 직접 제어' : 'Roll20AM 연결') +
          '</b>',
      );
    }
    if (action == 'status')
      return whisper(
        '재생 방식: <b>' +
          (state.KIBSceneAudio.driver == 'native'
            ? 'Roll20 쥬크박스 직접 제어'
            : 'Roll20AM 연결') +
          '</b>',
      );
    action = normalizeAction(action);
    if (
      action == 'play' ||
      action == 'stop' ||
      action == 'stopall' ||
      action == 'volume' ||
      action == 'fadein' ||
      action == 'fadeout'
    ) {
      return handleAudioCue([action].concat(parts));
    }
    whisper(
      '형식: !sd audio play|제목|loop / stop|제목 / fadein|제목|fade=2000 / bind|별칭|제목',
    );
  }

  function handleAudioCue(args) {
    var parsed = inspectAudioCue(args);
    if (!parsed.ok) return audioUsage(parsed.error);
    var action = parsed.action;
    var target = parsed.target;
    var options = parsed.options;
    if (action == 'stopall') return stopAllAudio(options.fade);
    if (state.KIBSceneAudio.driver == 'roll20am')
      return sendRoll20Am(action, target, options);

    var track = parsed.track;
    stopFade(track.id);

    var currentVolume = clamp(track.get('volume'), 30);
    var rememberedVolume = state.KIBSceneAudio.volumes[track.id];
    var volume =
      options.volume == null
        ? currentVolume === 0 && rememberedVolume != null
          ? clamp(rememberedVolume, currentVolume)
          : currentVolume
        : clamp(options.volume, currentVolume);
    var loop =
      options.loop === true
        ? true
        : options.once === true
          ? false
          : !!track.get('loop');
    var fade = clamp(options.fade, 1000, 0, 60000);

    if (action == 'play') {
      state.KIBSceneAudio.volumes[track.id] = volume;
      // 재생 중으로 남은 트랙도 짧게 재시작
      track.set({
        playing: false,
        softstop: false,
        loop: loop,
        volume: volume,
      });
      fades[track.id] = setTimeout(function () {
        delete fades[track.id];
        var restarted = getObj('jukeboxtrack', track.id);
        if (restarted)
          restarted.set({
            playing: true,
            softstop: false,
            loop: loop,
            volume: volume,
          });
      }, SETTING.RESTART_DELAY_MS);
      notifyLinkedApng(track);
      return fades[track.id];
    }
    if (action == 'stop') return track.set({ playing: false, softstop: false });
    if (action == 'volume') {
      state.KIBSceneAudio.volumes[track.id] = volume;
      return track.set('volume', volume);
    }
    if (action == 'fadein') {
      state.KIBSceneAudio.volumes[track.id] = volume;
      if (options.once === true || options.restart === true) {
        track.set({ playing: false, softstop: false, loop: loop, volume: 0 });
        fades[track.id] = setTimeout(function () {
          delete fades[track.id];
          var restarted = getObj('jukeboxtrack', track.id);
          if (!restarted) return;
          restarted.set({
            playing: true,
            softstop: false,
            loop: loop,
            volume: 0,
          });
          fadeTrack(restarted, 0, volume, fade, false, SETTING.FADE_IN_STEP_MS);
        }, SETTING.RESTART_DELAY_MS);
        notifyLinkedApng(track);
        return fades[track.id];
      }
      track.set({ playing: true, softstop: false, loop: loop, volume: 0 });
      notifyLinkedApng(track);
      return fadeTrack(track, 0, volume, fade, false, SETTING.FADE_IN_STEP_MS);
    }
    if (action == 'fadeout') {
      if (currentVolume > 0)
        state.KIBSceneAudio.volumes[track.id] = currentVolume;
      return fadeTrack(
        track,
        currentVolume,
        0,
        fade,
        true,
        SETTING.FADE_OUT_STEP_MS,
      );
    }
    audioUsage('지원하지 않는 동작입니다: ' + escapeHtml(action));
  }

  function validateAudioCue(args) {
    var parsed = inspectAudioCue(args);
    return parsed.ok ? { ok: true } : { ok: false, error: parsed.error };
  }

  function inspectAudioCue(args) {
    var parts = (args || [])
      .map(function (part) {
        return String(part || '').trim();
      })
      .filter(Boolean);
    var actionIndex = -1;
    for (var i = 0; i < parts.length; i++) {
      if (normalizeAction(parts[i])) {
        actionIndex = i;
        break;
      }
    }
    if (actionIndex < 0)
      return {
        ok: false,
        error:
          '재생, 중지, 볼륨, 페이드인, 페이드아웃 중 동작을 하나 입력하세요.',
      };
    var action = normalizeAction(parts.splice(actionIndex, 1)[0]);
    if (action == 'stopall') {
      var stopAllOptions = parseOptions(parts);
      if (stopAllOptions.error)
        return { ok: false, error: stopAllOptions.error };
      if (
        Object.keys(stopAllOptions).some(function (key) {
          return key != 'fade';
        })
      )
        return {
          ok: false,
          error: '전체중지에는 페이드 옵션만 사용할 수 있습니다.',
        };
      return { ok: true, action: action, target: '', options: stopAllOptions };
    }
    var optionParts = [];
    var targets = [];
    for (var j = 0; j < parts.length; j++) {
      if (normalizeOption(parts[j].split('=')[0])) optionParts.push(parts[j]);
      else targets.push(parts[j]);
    }
    if (!targets.length) return { ok: false, error: '음원 제목이 없습니다.' };
    if (targets.length > 1)
      return {
        ok: false,
        error: '음원 제목은 하나만 입력하세요: ' + targets.join(' | '),
      };
    var target = targets[0];
    var options = parseOptions(optionParts);
    if (options.error) return { ok: false, error: options.error };
    if (action == 'volume' && options.volume == null)
      return {
        ok: false,
        error: '볼륨 동작에는 볼륨=0~100 옵션이 필요합니다.',
      };
    if (action == 'play' && options.fade > 0) action = 'fadein';
    if (action == 'stop' && options.fade > 0) action = 'fadeout';
    if (state.KIBSceneAudio.driver == 'roll20am') {
      return SETTING.ROLL20AM_ACCEPT_API_AS_GM
        ? { ok: true, action: action, target: target, options: options }
        : {
            ok: false,
            error: 'Roll20AM의 API 발신자 GM 허용 설정이 필요합니다.',
          };
    }
    var resolved = resolveTrack(target);
    if (!resolved.ok) return resolved;
    return {
      ok: true,
      action: action,
      target: target,
      options: options,
      track: resolved.track,
    };
  }

  function bind(alias, title) {
    if (!alias || !title)
      return whisper('형식: !sd audio bind|별칭|현재 트랙 제목');
    var track = findTrackByTitle(title);
    if (!track)
      return whisper(
        '쥬크박스에 <b>' + escapeHtml(title) + '</b> 음원이 없습니다.',
      );
    state.KIBSceneAudio.aliases[normalize(alias)] = {
      id: track.id,
      lastTitle: track.get('title'),
    };
    whisper(
      '연결됨: <b>' +
        escapeHtml(alias) +
        '</b> → ' +
        escapeHtml(track.get('title')),
    );
  }

  function listBindings() {
    var aliases = state.KIBSceneAudio.aliases;
    var keys = Object.keys(aliases);
    if (!keys.length) return whisper('등록된 별칭이 없습니다.');
    whisper(
      keys
        .map(function (alias) {
          var track = getObj('jukeboxtrack', aliases[alias].id);
          return (
            escapeHtml(alias) +
            ' → ' +
            escapeHtml(track ? track.get('title') : '(삭제됨)')
          );
        })
        .join('<br>'),
    );
  }

  function resolveTrack(aliasOrTitle) {
    if (String(aliasOrTitle || '').indexOf('id:') === 0) {
      var idTrack = getObj('jukeboxtrack', String(aliasOrTitle).substring(3));
      return idTrack
        ? { ok: true, track: idTrack }
        : { ok: false, error: '연결된 쥬크박스 음원이 삭제되었습니다.' };
    }
    var saved = state.KIBSceneAudio.aliases[normalize(aliasOrTitle)];
    var savedTrack = saved && getObj('jukeboxtrack', saved.id);
    if (savedTrack) return { ok: true, track: savedTrack };
    var target = normalize(aliasOrTitle);
    var tracks = findObjs({ _type: 'jukeboxtrack' }) || [];
    var matches = [];
    for (var i = 0; i < tracks.length; i++) {
      if (normalize(tracks[i].get('title')) == target) matches.push(tracks[i]);
    }
    if (matches.length > 1)
      return {
        ok: false,
        error:
          '같은 제목의 쥬크박스 음원이 ' +
          matches.length +
          '개입니다: ' +
          aliasOrTitle,
      };
    if (!matches.length)
      return {
        ok: false,
        error:
          '쥬크박스에 "' +
          aliasOrTitle +
          '" 음원이 없습니다. 제목을 정확히 확인해 주세요.',
      };
    return { ok: true, track: matches[0] };
  }

  function findTrackByTitle(title) {
    var target = normalize(title);
    var tracks = findObjs({ _type: 'jukeboxtrack' }) || [];
    var matches = [];
    for (var i = 0; i < tracks.length; i++) {
      if (normalize(tracks[i].get('title')) == target) matches.push(tracks[i]);
    }
    if (matches.length > 1) {
      whisper(
        '같은 제목의 쥬크박스 음원이 ' +
          matches.length +
          '개입니다: <b>' +
          escapeHtml(title) +
          '</b><br>제목을 구분한 뒤 별칭을 연결하세요.',
      );
      return null;
    }
    return matches[0] || null;
  }

  function sendRoll20Am(action, target, options) {
    if (!SETTING.ROLL20AM_ACCEPT_API_AS_GM)
      return whisper('Roll20AM의 API 권한을 gm으로 설정해야 합니다.');
    var command = '';
    if (action == 'play')
      command =
        '!roll20AM --audio,play' + (options.loop ? ',loop' : '') + '|' + target;
    if (action == 'stop') command = '!roll20AM --audio,stop|' + target;
    if (action == 'fadein') command = '!roll20AM --audio,fade,in|' + target;
    if (action == 'fadeout') command = '!roll20AM --audio,fade,out|' + target;
    if (action == 'volume')
      command =
        '!roll20AM --edit,volume,level=' +
        clamp(options.volume, 30) +
        '|' +
        target;
    if (command) sendChat('SceneDirector', command, null, { noarchive: true });
  }

  function fadeTrack(track, from, to, duration, stopAfter, stepMs) {
    if (!duration) {
      if (stopAfter) track.set({ volume: to, playing: false, softstop: false });
      else track.set('volume', to);
      return;
    }
    var started = Date.now();
    var tick = function () {
      if (!getObj('jukeboxtrack', track.id)) {
        stopFade(track.id);
        return;
      }
      var ratio = Math.min(1, (Date.now() - started) / duration);
      if (ratio == 1) {
        stopFade(track.id);
        if (stopAfter)
          track.set({ volume: to, playing: false, softstop: false });
        else track.set('volume', to);
        return;
      }
      track.set('volume', interpolateRoll20Volume(from, to, ratio));
      fades[track.id] = setTimeout(
        tick,
        Math.min(stepMs, duration - (Date.now() - started)),
      );
    };
    fades[track.id] = setTimeout(tick, Math.min(stepMs, duration));
  }

  function stopFade(id) {
    if (!fades[id]) return;
    clearTimeout(fades[id]);
    delete fades[id];
  }

  function stopAllAudio(fade) {
    var tracks = findObjs({ _type: 'jukeboxtrack' }) || [];
    fade = clamp(fade, 0, 0, 60000);
    tracks.forEach(function (track) {
      stopFade(track.id);
      var volume = clamp(track.get('volume'), 30);
      var isPlaying =
        track.get('playing') === true && track.get('softstop') !== true;
      if (fade > 0 && isPlaying && volume > 0) {
        state.KIBSceneAudio.volumes[track.id] = volume;
        fadeTrack(track, volume, 0, fade, true, SETTING.FADE_OUT_STEP_MS);
      } else if (!fade || isPlaying)
        track.set({ playing: false, softstop: false });
    });
    return { ok: true, count: tracks.length };
  }

  function parseOptions(parts) {
    var options = {};
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      var pair = parts[i].split('=');
      var key = normalizeOption(pair[0]);
      var value = pair.length > 1 ? pair.slice(1).join('=').trim() : true;
      if (!key) return { error: '알 수 없는 옵션입니다: ' + parts[i] };
      if ((key == 'loop' && options.once) || (key == 'once' && options.loop))
        return { error: '반복과 1회는 동시에 사용할 수 없습니다.' };
      if (key == 'volume') {
        if (
          !/^\d+$/.test(String(value)) ||
          Number(value) < 0 ||
          Number(value) > 100
        )
          return { error: '볼륨은 0~100 정수로 입력하세요.' };
        value = Number(value);
      }
      if (key == 'fade') {
        var fadeMatch = String(value).match(
          /^(\d+(?:\.\d+)?)\s*(초|ms|밀리초)?$/i,
        );
        if (!fadeMatch)
          return { error: '페이드는 2초 또는 2000ms처럼 입력하세요.' };
        value = Number(fadeMatch[1]) * (fadeMatch[2] == '초' ? 1000 : 1);
        if (value < 0 || value > 60000)
          return { error: '페이드는 0~60초 범위만 사용할 수 있습니다.' };
      }
      options[key] = value;
    }
    return options;
  }

  function normalizeAction(value) {
    var action = normalize(value).replace(/\s+/g, '');
    var actions = {
      재생: 'play',
      play: 'play',
      중지: 'stop',
      정지: 'stop',
      stop: 'stop',
      전체중지: 'stopall',
      모두중지: 'stopall',
      stopall: 'stopall',
      볼륨: 'volume',
      volume: 'volume',
      페이드인: 'fadein',
      fadein: 'fadein',
      페이드아웃: 'fadeout',
      fadeout: 'fadeout',
    };
    return actions[action] || '';
  }

  function normalizeOption(value) {
    var key = normalize(value).replace(/\s+/g, '');
    var options = {
      반복: 'loop',
      loop: 'loop',
      '1회': 'once',
      한번: 'once',
      once: 'once',
      처음부터: 'restart',
      재시작: 'restart',
      restart: 'restart',
      볼륨: 'volume',
      volume: 'volume',
      페이드: 'fade',
      fade: 'fade',
    };
    return options[key] || '';
  }

  function isCommand(content, command) {
    content = String(content || '');
    return (
      content === command ||
      content.indexOf(command + ' ') === 0 ||
      content.indexOf(command + '|') === 0
    );
  }

  function scheduleAudioMacroRefresh() {
    if (macroRefreshTimer) clearTimeout(macroRefreshTimer);
    macroRefreshTimer = setTimeout(function () {
      macroRefreshTimer = null;
      try {
        updateAudioMacros();
        if (typeof bridge.refreshHandout === 'function')
          bridge.refreshHandout();
      } catch (err) {
        whisper(
          '<b>오디오 매크로를 갱신하지 못했습니다.</b><br>쥬크박스 음원과 GM 계정을 확인해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
            escapeHtml(err && err.message ? err.message : err) +
            '</span>',
        );
      }
    }, SETTING.MACRO_REFRESH_MS);
  }

  function notifyLinkedApng(track) {
    if (!track) return;
    if (typeof bridge.call === 'function')
      bridge.call('apng', 'onAudioPlay', [track.id]);
    else if (
      bridge.adapters.apng &&
      typeof bridge.adapters.apng.onAudioPlay === 'function'
    )
      bridge.adapters.apng.onAudioPlay(track.id);
  }

  function updateAudioMacros() {
    if (typeof createObj !== 'function') return;
    var tracks = findObjs({ _type: 'jukeboxtrack' }) || [];
    var bgm = [];
    var sfx = [];
    var seen = {};
    for (var i = 0; i < tracks.length; i++) {
      var title = String(tracks[i].get('title') || '').trim();
      if (!title || title.indexOf('|') > -1 || seen[title]) continue;
      seen[title] = true;
      (isBgmTitle(title) ? bgm : sfx).push(title);
    }
    bgm.sort(compareText);
    sfx.sort(compareText);
    upsertGmMacro(
      SETTING.BGM_MACRO_NAME,
      bgm.length
        ? '!오디오 ?{동작|재생|중지}|' +
            rollQuery('BGM 선택', bgm) +
            '|반복|볼륨=?{볼륨(0~100)|30}|페이드=?{페이드 시간|2초}'
        : '!오디오 매크로없음|BGM',
    );
    upsertGmMacro(
      SETTING.SFX_MACRO_NAME,
      sfx.length
        ? '!오디오 ?{동작|재생|중지}|' +
            rollQuery('효과음 선택', sfx) +
            '|1회|볼륨=?{볼륨(0~100)|50}|페이드=?{페이드 시간|2초}'
        : '!오디오 매크로없음|효과음',
    );
  }

  function isBgmTitle(title) {
    var value = String(title || '').replace(/^\s+/, '');
    var config = state.KIBSceneAudio.classification || {
      mode: 'auto',
      prefixes: [],
    };
    if (config.mode == 'prefix') {
      for (var i = 0; i < config.prefixes.length; i++) {
        if (value.indexOf(config.prefixes[i]) === 0) return true;
      }
      return false;
    }
    if (!value) return false;
    var code = value.codePointAt ? value.codePointAt(0) : value.charCodeAt(0);
    return (
      (code >= 0x1f000 && code <= 0x1faff) ||
      (code >= 0x2600 && code <= 0x27bf) ||
      (code >= 0x2300 && code <= 0x23ff) ||
      (code >= 0x2b00 && code <= 0x2bff) ||
      (code >= 0x2190 && code <= 0x21ff) ||
      code == 0x00a9 ||
      code == 0x00ae ||
      code == 0x2122
    );
  }

  function rollQuery(label, values) {
    if (values.length === 1) return String(values[0]);
    var result = '?{' + label;
    for (var i = 0; i < values.length; i++)
      result += '|' + queryEscape(values[i]) + ',' + queryEscape(values[i]);
    return result + '}';
  }

  function queryEscape(value) {
    return String(value || '')
      .replace(/,/g, '&#44;')
      .replace(/}/g, '&#125;');
  }

  function upsertGmMacro(name, action) {
    var players = (findObjs({ _type: 'player' }) || []).concat(
      findObjs({ type: 'player' }) || [],
    );
    var unique = [];
    var seen = {};
    for (var i = 0; i < players.length; i++) {
      if (!seen[players[i].id]) {
        seen[players[i].id] = true;
        unique.push(players[i]);
      }
    }
    var gmIds = unique
      .filter(function (player) {
        return playerIsGM(player.id);
      })
      .map(function (player) {
        return player.id;
      });
    var owner = gmIds[0] || (unique[0] && unique[0].id);
    if (!owner) return;
    var macros = findObjs({ _type: 'macro', name: name }) || [];
    var options = { name: name, action: action, visibleto: gmIds.join(',') };
    if (macros.length) macros[0].set(options);
    else {
      options.playerid = owner;
      createObj('macro', options);
    }
  }

  function compareText(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function audioUsage(error) {
    if (error) {
      whisper(
        '<b>오디오 명령을 실행하지 못했습니다.</b><br>' +
          escapeHtml(error) +
          '<br>사용법: <code>!오디오 help</code>',
      );
      return { ok: false, error: String(error) };
    }
    whisper(
      '<code>!오디오 재생|음원 제목|반복|볼륨=30|페이드=2초</code><br>' +
        '<code>!오디오 중지|음원 제목|페이드=2초</code><br>' +
        '<code>!오디오 전체중지</code> / <code>!오디오 전체중지|페이드=3초</code><br>' +
        '<code>!오디오 볼륨|음원 제목|볼륨=20</code><br>' +
        '<code>!오디오 분류|자동</code> / <code>!오디오 분류|지정|🌧️|🎻</code>',
    );
    return { ok: false, error: '오디오 사용법' };
  }

  function clamp(value, fallback, min, max) {
    var number = parseInt(value, 10);
    if (isNaN(number)) number = fallback;
    min = min == null ? 0 : min;
    max = max == null ? 100 : max;
    return Math.max(min, Math.min(max, number));
  }

  // Roll20 볼륨 슬라이더 곡선
  function interpolateRoll20Volume(from, to, ratio) {
    var fromSlider = Math.sqrt(clamp(from, 0) / 100) * 100;
    var toSlider = Math.sqrt(clamp(to, 0) / 100) * 100;
    var slider = fromSlider + (toSlider - fromSlider) * ratio;
    return Math.round(Math.pow(slider / 100, 2) * 100);
  }

  function normalize(value) {
    var text = String(value || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    return typeof text.normalize === 'function' ? text.normalize('NFC') : text;
  }
  function whisper(text) {
    sendChat('SceneDirector', '/w gm ' + text, null, { noarchive: true });
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
