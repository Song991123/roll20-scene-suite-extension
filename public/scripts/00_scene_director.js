/*
 * Scene Suite 00 - Scene Director 3.5.1
 * 제작 및 통합: @EOOOOORK
 */
var KIBScene = KIBScene || {};
(function () {
  'use strict';

  // ===== 기본 설정 =====
  var DEFAULTS = {
    version: '3.5.1',
    command: '!sd',
    features: {
      audio: true,
      vd: true,
      image: true,
      type: true,
      apng: true,
      handout: true,
      cutin: true,
      avatar: true,
      sheet: true,
      page: false,
    },
    timing: {
      firstDelay: 500,
      lineInterval: 2800,
      visualMinShow: 400,
      visualCharRatio: 10,
      typeSpeed: 45,
      typeHold: 2800,
      typeAllLines: true,
    },
    help: {
      createHandout: true,
      handoutName: '[GM] SceneDirector 사용법',
    },
  };

  // ===== 모듈 연결 =====
  KIBScene.handlers = KIBScene.handlers || {};
  KIBScene.adapters = KIBScene.adapters || {};
  KIBScene.refreshHandout = scheduleHandoutRefresh;

  KIBScene.register = function (name, adapter) {
    name = normalize(name);
    if (!name || !adapter) return;
    KIBScene.adapters[name] = adapter;
    if (typeof adapter.cue === 'function')
      KIBScene.handlers[name] = adapter.cue;
    scheduleHandoutRefresh();
  };

  KIBScene.plugin = function (name) {
    return KIBScene.adapters[normalize(name)] || null;
  };

  KIBScene.call = function (name, method, args) {
    var adapter = KIBScene.plugin(name);
    if (!adapter || typeof adapter[method] !== 'function') return undefined;
    try {
      return adapter[method].apply(adapter, Array.isArray(args) ? args : []);
    } catch (err) {
      return {
        ok: false,
        plugin: normalize(name),
        error: featureFailure(name, err),
      };
    }
  };

  KIBScene.broadcast = function (eventName, payload) {
    var values = [];
    var names = Object.keys(KIBScene.adapters).sort();
    for (var i = 0; i < names.length; i++) {
      var adapter = KIBScene.adapters[names[i]];
      var listener = adapter && adapter.events && adapter.events[eventName];
      if (typeof listener !== 'function') continue;
      try {
        var value = listener(payload || {});
        if (value && value.ok === false)
          return {
            ok: false,
            plugin: names[i],
            error: String(
              value.error ||
                featureName(names[i]) + '을 실행하지 못했습니다.',
            ),
          };
        if (value !== undefined)
          values.push({ plugin: names[i], value: value });
      } catch (err) {
        return {
          ok: false,
          plugin: names[i],
          error: featureFailure(names[i], err),
        };
      }
    }
    return { ok: true, values: values };
  };

  KIBScene.resolveCueAlias = function (value) {
    var wanted = normalize(value);
    var names = Object.keys(KIBScene.adapters).sort();
    for (var i = 0; i < names.length; i++) {
      var current = KIBScene.adapters[names[i]];
      if (typeof current.cue !== 'function') continue;
      var aliases = current.aliases || {};
      if (
        Array.isArray(aliases) &&
        aliases.some(function (alias) {
          return normalize(alias) === wanted;
        })
      )
        return { type: names[i], action: '' };
      if (!Array.isArray(aliases)) {
        var keys = Object.keys(aliases);
        for (var j = 0; j < keys.length; j++)
          if (normalize(keys[j]) === wanted)
            return { type: names[i], action: String(aliases[keys[j]] || '') };
      }
      if (names[i] === wanted) return { type: names[i], action: '' };
    }
    return null;
  };

  KIBScene.cueAliases = function () {
    var result = [];
    Object.keys(KIBScene.adapters).forEach(function (name) {
      if (typeof KIBScene.adapters[name].cue !== 'function') return;
      var aliases = KIBScene.adapters[name].aliases || {};
      var values = Array.isArray(aliases) ? aliases : Object.keys(aliases);
      values.concat([name]).forEach(function (alias) {
        if (result.indexOf(alias) < 0) result.push(alias);
      });
    });
    return result;
  };

  KIBScene.execute = function (cue, context) {
    if (!cue || !KIBScene.isFeatureEnabled(cue.type))
      return { ok: true, skipped: true };
    var handler = KIBScene.handlers[cue.type];
    if (typeof handler !== 'function') {
      return { ok: false, error: featureUnavailable(cue.type) };
    }
    try {
      return normalizeResult(handler(cue.args || [], context || {}));
    } catch (err) {
      return { ok: false, error: featureFailure(cue.type, err) };
    }
  };

  KIBScene.validate = function (cue, context) {
    if (!cue || !KIBScene.isFeatureEnabled(cue.type))
      return { ok: true, skipped: true };
    var adapter = KIBScene.adapters[cue.type];
    if (!adapter || typeof KIBScene.handlers[cue.type] !== 'function') {
      return { ok: false, error: featureUnavailable(cue.type) };
    }
    if (typeof adapter.validate !== 'function') return { ok: true };
    try {
      return normalizeResult(adapter.validate(cue.args || [], context || {}));
    } catch (err) {
      return { ok: false, error: featureFailure(cue.type, err) };
    }
  };

  KIBScene.get = function (path, fallback) {
    var value = getPath(config(), path);
    return value === undefined ? fallback : value;
  };

  KIBScene.isFeatureEnabled = function (name) {
    name = normalize(name);
    var saved = getPath(config(), 'features.' + name);
    return saved === undefined ? !!KIBScene.adapters[name] : saved === true;
  };

  KIBScene.routeCommand = function (source, msg) {
    return handleCommand(String(source || '').trim(), msg);
  };

  KIBScene.estimate = function (lines) {
    lines = lines && lines.length ? lines : [''];
    var first = number('timing.firstDelay');
    var interval = number('timing.lineInterval');
    var typeSpeed = number('timing.typeSpeed');
    var typeHold = number('timing.typeHold');
    var vdMin = number('timing.visualMinShow');
    var vdRatio = number('timing.visualCharRatio');
    var typeEnabled = KIBScene.isFeatureEnabled('type');
    var vdEnabled = KIBScene.isFeatureEnabled('vd');
    var typeAll = KIBScene.get('timing.typeAllLines', true) === true;
    var lastStart = first;
    var nextStart = first;
    var typeEnd = 0;
    var vdEnd = 0;
    var vdCursor = first;
    for (var i = 0; i < lines.length; i++) {
      var start = nextStart;
      lastStart = start;
      var length = visibleLength(lines[i]);
      var parsedLine = KIBScene.call('narrator', 'extract', [lines[i]]) || null;
      if (parsedLine && parsedLine.lineDelayError)
        return { error: parsedLine.lineDelayError };
      nextStart =
        start +
        (parsedLine &&
          typeof parsedLine.lineDelay === 'number' &&
          !parsedLine.lineDelayError
          ? Number(parsedLine.lineDelay)
          : interval);
      if (
        typeEnabled &&
        (typeAll ||
          (parsedLine && parsedLine.directType) ||
          /(?:\{\{@type(?:\|[^{}]*)?\}\}|(?:^|\s)@(?:스크립트|타자|type)(?=\s|$))/.test(
            lines[i],
          ))
      ) {
        typeEnd = Math.max(typeEnd, start + length * typeSpeed + typeHold);
      }
      if (vdEnabled) {
        var vdStart = Math.max(start, vdCursor);
        vdCursor = vdStart + Math.max(vdMin, length * vdRatio);
        vdEnd = vdCursor;
      }
    }
    return {
      lines: lines.length,
      lastLineStartsAt: lastStart,
      typewriterEndsAt: typeEnd,
      visualDialogueEndsAt: vdEnd,
      total: Math.max(lastStart, typeEnd, vdEnd),
    };
  };

  on('ready', function () {
    initState();
    if (KIBScene.get('help.createHandout', true)) scheduleHandoutRefresh();
    log('SceneDirector ' + DEFAULTS.version + ' ready');
  });

  on('chat:message', function (msg) {
    if (
      msg.type !== 'api' ||
      String(msg.content || '').indexOf(DEFAULTS.command) !== 0
    )
      return;
    if (!playerIsGM(msg.playerid)) return;
    try {
      handleCommand(
        String(msg.content || '')
          .substring(DEFAULTS.command.length)
          .trim(),
        msg,
      );
    } catch (err) {
      whisper(
        '<b>명령을 처리하지 못했습니다.</b><br>오류: ' +
          escapeHtml(errorText(err)) +
          '<br><code>!sd help</code>에서 사용법을 확인하세요.',
      );
    }
  });

  on('destroy:handout', function (obj) {
    if (!state.KIBSceneDirector || obj.id !== state.KIBSceneDirector.helpId)
      return;
    state.KIBSceneDirector.helpId = '';
    if (KIBScene.get('help.createHandout', true)) scheduleHandoutRefresh();
  });

  function handleCommand(source, msg) {
    var parts = source.split('|').map(function (part) {
      return part.trim();
    });
    var head = parts.shift().split(/\s+/);
    var command = normalize(head[0] || 'help');

    if (command === 'help' || command === '도움말')
      return whisper(helpHtml(false));
    if (command === 'status') return whisper(statusHtml());
    if (command === 'config') return whisper(configHtml());
    if (command === 'handout') {
      refreshHandout();
      return whisper('사용법 핸드아웃을 갱신했습니다.');
    }
    if (command === 'estimate') return showEstimate(parts);
    if (command === 'set') return setConfig(parts[0], parts.slice(1).join('|'));
    if (command === 'reset') return resetConfig(parts[0]);
    if (command === 'feature') return setFeature(parts[0], parts[1]);

    var adapter = KIBScene.adapters[command];
    if (adapter && typeof adapter.command === 'function')
      return adapter.command(head.slice(1), parts, msg);
    whisper(
      '알 수 없는 명령입니다: <code>' +
        escapeHtml(command) +
        '</code><br>사용법: <code>!sd help</code>',
    );
  }

  function setConfig(path, rawValue) {
    if (!isSettablePath(path))
      return whisper('변경할 수 없는 설정입니다: ' + escapeHtml(path));
    var value = parseValue(rawValue);
    var invalid = validateValue(path, value);
    if (invalid) return whisper(invalid);
    setPath(config(), path, value);
    whisper(
      '<b>' + escapeHtml(settingName(path)) + ':</b> ' + escapeHtml(String(value)),
    );
    scheduleHandoutRefresh();
  }

  function resetConfig(path) {
    if (!path || path === 'all') {
      state.KIBSceneDirector.config = clone(DEFAULTS);
      whisper('전체 설정을 초기화했습니다.');
    } else {
      var defaultValue = getPath(DEFAULTS, path);
      if (defaultValue === undefined)
        return whisper('기본값이 없는 설정입니다: ' + escapeHtml(path));
      setPath(config(), path, clone(defaultValue));
      whisper('<b>' + escapeHtml(settingName(path)) + '</b>을 초기화했습니다.');
    }
    scheduleHandoutRefresh();
  }

  function setFeature(name, value) {
    name = normalize(name);
    if (!Object.prototype.hasOwnProperty.call(DEFAULTS.features, name))
      return whisper('설치되지 않은 기능입니다: ' + escapeHtml(name));
    if (
      !/^(?:on|off|true|false|1|0|켜기|끄기|사용|미사용)$/i.test(
        String(value || ''),
      )
    ) {
      return whisper('켜기 또는 끄기로 입력하세요.');
    }
    var enabled = /^(?:on|true|1|켜기|사용)$/i.test(String(value || ''));
    setPath(config(), 'features.' + name, enabled);
    whisper(
      escapeHtml(featureName(name)) + ': <b>' + (enabled ? '켜짐' : '꺼짐') + '</b>',
    );
    scheduleHandoutRefresh();
  }

  function showEstimate(lines) {
    if (!lines.length || (lines.length === 1 && !lines[0]))
      return whisper('형식: <code>!sd estimate|첫 줄|둘째 줄</code>');
    var result = KIBScene.estimate(lines);
    if (result.error)
      return whisper(
        '<b>예상 시간을 계산하지 못했습니다.</b><br>' + result.error,
      );
    whisper(
      '<b>예상 출력 시간</b><br>' +
        '줄 수: ' +
        result.lines +
        '<br>' +
        '마지막 줄 시작: ' +
        seconds(result.lastLineStartsAt) +
        '<br>' +
        '스크립트 종료: ' +
        seconds(result.typewriterEndsAt) +
        '<br>' +
        '비주얼 노벨 종료: ' +
        seconds(result.visualDialogueEndsAt) +
        '<br>' +
        '전체 예상: <b>' +
        seconds(result.total) +
        '</b>',
    );
  }

  function statusHtml() {
    var adapters = Object.keys(KIBScene.adapters).sort();
    var narratorState =
      { 1: '대기', 2: '출력 중', 3: '일시정지' }[state.is_narrating || 1] ||
      '상태 확인 필요';
    return (
      '<b>SceneDirector ' +
      DEFAULTS.version +
      '</b><br>' +
      '설치된 기능: ' +
      escapeHtml(adapters.map(featureName).join(', ') || '(없음)') +
      '<br>' +
      '나레이터: ' +
      narratorState +
      (state.last_narration_error
        ? ' / 최근 오류: ' +
          escapeHtml(state.last_narration_error.error || '')
        : '') +
      '<br>' +
      featureRows() +
      '<br>' +
      timingRows()
    );
  }

  function configHtml() {
    var firstFeature = Object.keys(DEFAULTS.features).filter(hasPlugin)[0];
    return (
      '<b>전체 설정</b><br>' +
      featureRows() +
      '<br>' +
      timingRows() +
      '<br>' +
      '<code>!sd set|timing.lineInterval|3000</code><br>' +
      (firstFeature
        ? '<code>!sd feature|' + escapeHtml(firstFeature) + '|off</code><br>'
        : '') +
      '<code>!sd reset|all</code>'
    );
  }

  function featureRows() {
    var features = KIBScene.get('features', {});
    return (
      Object.keys(DEFAULTS.features)
        .filter(function (name) {
          return name !== 'page' && hasPlugin(name);
        })
        .map(function (name) {
          return featureName(name) + '=' + (features[name] ? '켜짐' : '꺼짐');
        })
        .join(', ') || '(설치된 선택 기능 없음)'
    );
  }

  function timingRows() {
    var timing = KIBScene.get('timing', {});
    var rows = [
      '첫 출력=' +
        timing.firstDelay +
        'ms, 줄 간격=' +
        timing.lineInterval +
        'ms',
    ];
    if (hasPlugin('vd'))
      rows.push(
        '대사창=' +
          timing.visualMinShow +
          'ms 이상 / 글자당 ' +
          timing.visualCharRatio +
          'ms',
      );
    if (hasPlugin('type'))
      rows.push(
        '스크립트=글자당 ' +
          timing.typeSpeed +
          'ms + 유지 ' +
          timing.typeHold +
          'ms, 전체=' +
          timing.typeAllLines,
      );
    return rows.join('<br>');
  }

  function helpHtml(full) {
    if (full) return fullHelpHtml();
    var rows = [
      '<b>SceneDirector ' + DEFAULTS.version + '</b>',
      '<code>!sd status</code>: 연결된 기능 상태',
      '<code>!sd config</code>: 전체 시간과 기능 설정',
      '<code>!sd set|timing.lineInterval|3000</code>: 설정 변경',
      '<code>!sd estimate|첫 줄|둘째 줄</code>: 예상 출력 시간',
      '<code>!sd handout</code>: 사용법 핸드아웃 갱신',
    ];
    var names = Object.keys(KIBScene.adapters).sort();
    for (var i = 0; i < names.length; i++) {
      var adapter = KIBScene.adapters[names[i]];
      var meta = adapter.meta || {};
      if (adapter.help && adapter.help.length)
        rows.push(
          '<b>' +
            escapeHtml(meta.code || names[i]) +
            ' - ' +
            escapeHtml(meta.title || names[i]) +
            '</b><br>' +
            adapter.help.join('<br>'),
        );
    }
    return rows.join('<br>');
  }

  function fullHelpHtml() {
    var names = Object.keys(KIBScene.adapters).sort();
    var featureLabels = {
      audio: '오디오',
      vd: '비주얼 노벨',
      image: '이미지 전환',
      type: '스크립트',
      apng: 'APNG',
      handout: '핸드아웃',
      cutin: '컷인',
      avatar: '캐릭터 이미지',
      sheet: '시트 헬퍼',
    };
    var featureButtons = names
      .filter(function (name) {
        return (
          Object.prototype.hasOwnProperty.call(DEFAULTS.features, name) &&
          name !== 'narrator' &&
          name !== 'page'
        );
      })
      .map(function (name) {
        var enabled = KIBScene.isFeatureEnabled(name);
        return actionButton(
          (featureLabels[name] || name) + ' ' + (enabled ? '켜짐' : '꺼짐'),
          '!sd feature|' + name + '|' + (enabled ? 'off' : 'on'),
          enabled ? '#287a4b' : '#8b3940',
        );
      })
      .join(' ');
    var headerButtons =
      actionButton('상태 확인', '!sd status', '#237a8b') +
      ' ' +
      actionButton('중앙 설정', '!sd config', '#53657d') +
      ' ' +
      (hasPlugin('audio')
        ? actionButton('오디오 상태', '!sd audio status', '#7654a8') +
          ' ' +
          actionButton('오디오 매크로', '!오디오 매크로갱신', '#287a4b') +
          ' '
        : '') +
      (hasPlugin('handout')
        ? actionButton('핸드아웃 관리', '!핸드아웃 관리', '#7654a8') + ' '
        : '') +
      (hasPlugin('cutin')
        ? actionButton('컷인 관리', '!컷인 관리', '#7654a8') + ' '
        : '') +
      (hasPlugin('avatar')
        ? actionButton('캐릭터 이미지', '!아바타 관리', '#7654a8') + ' '
        : '') +
      (hasPlugin('sheet')
        ? actionButton('시트 헬퍼', '!!관리', '#7654a8') + ' '
        : '') +
      actionButton('도움말 갱신', '!sd handout', '#9b6b20');
    var sections = [];
    sections.push(
      helpSection(
        '00 SceneDirector 설정',
        (featureButtons
            ? '<div><b>기능 설정</b><br>' +
              featureButtons +
              '</div>'
            : '') +
          '<div style="margin-top:8px"><b>시간 설정</b><br>' +
          actionButton(
            '줄 간격 변경',
            '!sd set|timing.lineInterval|?{줄 사이 간격(ms)|2800}',
            '#53657d',
          ) +
          ' ' +
          actionButton(
            '예상 시간 계산',
            '!sd estimate|?{첫 줄}|?{둘째 줄}',
            '#237a8b',
          ) +
          '</div>',
      ),
    );
    if (hasPlugin('narrator')) sections.push(narratorHelpSection());
    if (hasPlugin('audio')) sections.push(audioHelpSection());
    if (hasPlugin('vd')) sections.push(vdHelpSection());
    if (hasPlugin('image')) sections.push(imageHelpSection());
    if (hasPlugin('type')) sections.push(typeHelpSection());
    if (hasPlugin('apng')) sections.push(apngHelpSection());
    if (hasPlugin('handout')) sections.push(handoutHelpSection());
    if (hasPlugin('cutin')) sections.push(cutinHelpSection());
    if (hasPlugin('avatar')) sections.push(avatarHelpSection());
    if (hasPlugin('sheet')) sections.push(sheetHelpSection());
    return (
      '<div style="font-family:Arial,sans-serif;color:#111;line-height:1.45;background:#fff">' +
      '<div style="background:#111;color:#fff;padding:14px">' +
      '<div style="font-size:20px;font-weight:bold">SceneDirector <span style="font-size:12px;color:#fff">v' +
      DEFAULTS.version +
      '</span></div>' +
      '<div style="margin-top:3px">현재 설치된 기능 관리</div>' +
      '<div style="margin-top:10px">' +
      headerButtons +
      '</div>' +
      '</div>' +
      sections.join('') +
      '</div>'
    );
  }

  function hasPlugin(name) {
    return !!KIBScene.plugin(name);
  }

  function moduleHelpSection(name, fallbackTitle, body) {
    return helpSection(escapeHtml(fallbackTitle), body);
  }

  function narratorHelpSection() {
    var rows =
      commandRow('!... 대사', '줄을 차례대로 출력') +
      commandRow(
        '!... 대사 @다음줄 1.2초',
        '이 줄만 다음 줄까지 1.2초 대기',
      ) +
      commandRow('!,', '일시정지 / 다시 시작') +
      commandRow('!/', '전체 취소') +
      commandRow('!... /as "홍길동" 대사 @웃음', '캐릭터 대사와 표정 변경') +
      commandRow('!... /desc 설명', '강조 설명 출력') +
      commandRow('!... /emas "홍길동" 행동', '캐릭터 행동 출력');
    var setup = setupSteps([
      '화자: <code>/as</code> 또는 <code>/emas</code> 이름과 캐릭터 저널 이름 일치',
      '연출: 줄 끝에 <code>@오디오</code>, <code>@APNG</code> 입력',
    ]);
    return moduleHelpSection(
      'narrator',
      '01 나레이터',
      setup +
        '<table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table><div style="margin-top:7px"><b>@명령:</b> 해당 줄과 함께 실행, 오류 시 남은 줄 취소</div>',
    );
  }

  function audioHelpSection() {
    var buttons =
      actionButton(
        '재생',
        '!오디오 재생|?{음원 제목}|?{방식|반복,반복|1회,1회}|볼륨=?{볼륨|30}|페이드=?{시간|2초}',
        '#287a4b',
      ) +
      ' ' +
      actionButton(
        '중지',
        '!오디오 중지|?{음원 제목}|페이드=?{시간|2초}',
        '#8b3940',
      ) +
      ' ' +
      actionButton('전체 중지', '!오디오 전체중지', '#6b2630') +
      ' ' +
      actionButton('매크로 갱신', '!오디오 매크로갱신', '#7654a8');
    var rows =
      commandRow('!오디오 재생|제목|반복|볼륨=30|페이드=2초', '페이드인 재생') +
      commandRow('!오디오 중지|제목|페이드=2초', '페이드아웃 후 중지') +
      commandRow('!오디오 전체중지', '모든 음원과 예약 동작 중지') +
      commandRow(
        '!오디오 분류|자동',
        '제목 첫 이모지가 있는 음원을 BGM으로 분류',
      );
    var setup = setupSteps([
      '음원 등록: Roll20 쥬크박스의 <b>오디오 관리</b>',
      '음원 제목: 중복 없이 지정',
      '자동 분류: 제목 앞 이모지 있음 = BGM, 없음 = 효과음',
      '매크로 바: Roll20 매크로 설정에서 <code>🎵오디오</code>, <code>🪇효과음</code> 표시 켜기',
    ]);
    return moduleHelpSection(
      'audio',
      '02 오디오',
      setup +
        '<div style="margin:7px 0">' +
        buttons +
        '</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function vdHelpSection() {
    var vd = vdHelpConfig();
    var panelSetup =
      vd.dialogue_panel_mode == 'shared'
        ? '<code>vd_panel</code> 패널 하나'
        : '<code>vd_panel</code> 스크립트창, <code>vd_dialogue_box</code> 대사창';
    var setup =
      tableRow('페이지', '<code>page_list</code>에 실제 페이지 이름 입력') +
      tableRow(
        'GM 레이어',
        '<code>vd_area</code>, <code>vd_name</code>, <code>vd_dialogue</code>',
      ) +
      tableRow(
        '창 구성',
        vd.dialogue_panel_mode == 'shared'
          ? '패널 하나'
          : '스크립트창과 대사창 분리',
      ) +
      tableRow('오브젝트 레이어', panelSetup) +
      tableRow('맵 레이어', '<code>vd_background</code> 선택') +
      tableRow(
        '스탠딩',
        '<code>standings</code> 덱에 <code>캐릭터명</code>, <code>캐릭터명-표정명</code> 카드',
      );
    var controls =
      actionButton(
        '창 구성',
        '!비주얼 설정|창구성|?{창 구성|패널 하나,패널 하나|스크립트창과 대사창 분리,분리}',
        '#237a8b',
      ) +
      ' ' +
      actionButton(
        '글꼴',
        '!비주얼 설정|글꼴|?{글꼴|Arial|Patrick Hand|Contrail One|Shadows Into Light|Candal}',
        '#7654a8',
      ) +
      ' ' +
      actionButton(
        '대사 크기',
        '!비주얼 설정|대사크기|?{크기|' + vd.dialogue_font_size + '}',
        '#53657d',
      ) +
      ' ' +
      actionButton(
        vd.stroke_enabled ? '외곽선 끄기' : '외곽선 켜기',
        '!비주얼 설정|외곽선|' + (vd.stroke_enabled ? '끄기' : '켜기'),
        '#237a8b',
      ) +
      ' ' +
      actionButton(
        '외곽선색',
        '!비주얼 설정|외곽선색|?{색|' + vd.stroke_color + '}',
        '#7654a8',
      ) +
      '<br>' +
      actionButton(
        '스탠딩 크기',
        '!비주얼 설정|스탠딩크기|?{가로|' +
          vd.width +
          '}|?{세로|' +
          vd.height +
          '}',
        '#9b6b20',
      ) +
      ' ' +
      actionButton(
        '동시 인원',
        '!비주얼 설정|스탠딩개수|?{인원|' + vd.max_number + '}',
        '#9b6b20',
      ) +
      ' ' +
      standingRatioHelpControl() +
      '<br>' +
      actionButton('맵시트 등록', '!비주얼 순서|맵시트등록', '#53657d') +
      ' ' +
      actionButton(
        '스크립트창 뒤',
        '!비주얼 순서|스크립트창뒤',
        '#287a4b',
      ) +
      ' ' +
      actionButton('대사창 뒤', '!비주얼 순서|대사창뒤', '#287a4b') +
      ' ' +
      actionButton('글자 뒤', '!비주얼 순서|글자뒤', '#287a4b') +
      ' ' +
      actionButton('순서 상태', '!비주얼 순서|상태', '#237a8b');
    var rows =
      commandRow(
        '!비주얼 설정|창구성|패널 하나 또는 분리',
        '창 사용 방식 변경',
      ) +
      commandRow('!@웃음', '현재 캐릭터 표정 변경') +
      commandRow('!@', '기본 표정으로 변경') +
      commandRow('!비주얼 제외|추가|화자명', '해당 화자 숨김') +
      commandRow(
        '!비주얼 순서|맵시트등록',
        '선택한 고정 맵시트의 앞뒤 순서 저장',
      );
    var firstSetup = setupSteps([
      '<code>page_list</code>: 적용할 페이지 이름',
      '가이드 토큰: 적용 페이지에 배치',
      '<code>standings</code> 덱: <code>캐릭터명</code>, <code>캐릭터명-표정명</code> 카드',
      '캐릭터 저널: 카드의 캐릭터명과 이름 일치',
      '고정 맵시트: 토큰 선택 후 <b>맵시트 등록</b>',
    ]);
    return moduleHelpSection(
      'vd',
      '03 비주얼 노벨',
      firstSetup +
        '<b>화면 꾸미기</b><table style="width:100%;border-collapse:collapse">' +
        setup +
        '</table><div style="margin:7px 0">' +
        controls +
        '</div><div style="margin:7px 0;padding:7px;background:#f3f3f3;border-left:4px solid #111"><b>화면 순서</b><br>' +
        vdHelpLayerOrder() +
        '<br>글자: 스크립트창과 대사창 앞</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function imageHelpSection() {
    var setup = setupSteps([
      '덱 이름: <code>image</code>로 시작. 예: <code>image_scene</code>',
      '카드 앞면: 전환할 이미지',
      '대상 토큰: 덱과 같은 이름',
      '실행: <code>이미지변경</code> 매크로',
    ]);
    return moduleHelpSection(
      'image',
      '04 이미지 전환',
      setup +
        '<table style="width:100%;border-collapse:collapse">' +
        commandRow(
          '!#image_scene 카드명',
          '같은 이름 토큰을 해당 카드 그림으로 변경',
        ) +
        commandRow(
          '!... 대사 @이미지 image_scene|카드명',
          '나레이터 줄과 함께 변경',
        ) +
        '</table>',
    );
  }

  function typeHelpSection() {
    var setup = setupSteps([
      '설치: 별도 스크립트가 필요할 때만 05 사용',
      '설정: <code>PAGE_NAME</code>, <code>BOX_IMAGE_URL</code>, <code>ALLOWED_NAMES</code>',
      '페이지 등록: 표시 페이지에서 <code>!dialog-page here</code> 실행',
    ]);
    return moduleHelpSection(
      'type',
      '05 스크립트',
      setup +
        '<div style="margin-top:7px">' +
        actionButton(
          '스크립트 속도',
          '!sd set|timing.typeSpeed|?{글자당 시간(ms)|' +
            KIBScene.get('timing.typeSpeed', 45) +
            '}',
          '#7654a8',
        ) +
        ' ' +
        actionButton(
          KIBScene.get('timing.typeAllLines', true)
            ? '전체 스크립트 끄기'
            : '전체 스크립트 켜기',
          '!sd set|timing.typeAllLines|' +
            (KIBScene.get('timing.typeAllLines', true) ? 'false' : 'true'),
          '#287a4b',
        ) +
        '</div><table style="width:100%;border-collapse:collapse">' +
        commandRow('!... 대사 @스크립트', '이 줄만 스크립트로 표시') +
        '</table>',
    );
  }

  function apngHelpSection() {
    var rows =
      commandRow('!APNG 재생|카드명|1회|3초|전체', '맵시트 전체에 한 번 재생') +
      commandRow(
        '!APNG 재생|카드명|반복|영역',
        '<code>apng_area</code>에서 반복 재생',
      ) +
      commandRow('!APNG 중지|카드명', '해당 APNG와 연결 음원 중지') +
      commandRow('!APNG 설정|카드명|1회|3초', '기본 재생 방식 저장') +
      commandRow('!APNG 연결|카드명|효과음 제목', 'APNG와 음원을 서로 연결');
    var setup = setupSteps([
      '페이지: <code>conversation</code>',
      '덱: <code>apng</code>, 카드 앞면에 애니메이션 등록',
      '전체: 맵시트 또는 페이지 전체',
      '영역(선택): GM 레이어 <code>apng_area</code>의 위치와 크기',
      '실행: <code>📽️apng</code> 매크로에서 카드, 위치, 재생 방식 선택',
    ]);
    return moduleHelpSection(
      'apng',
      '06 APNG',
      setup +
        (hasPlugin('audio') ? apngAudioHelpControls() : '') +
        '<table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function handoutHelpSection() {
    var rows =
      commandRow('!핸드아웃 관리', '관리 핸드아웃 갱신') +
      commandRow(
        '!핸드아웃 보내기|자료명|캐릭터명 또는 전원',
        '보기 권한을 주고 공개문 표시',
      ) +
      commandRow(
        '!핸드아웃 권한추가|자료명|캐릭터명 또는 전원',
        '보기 권한 부여',
      ) +
      commandRow(
        '!핸드아웃 권한삭제|자료명|캐릭터명 또는 전원',
        '보기 권한 회수',
      ) +
      commandRow(
        '!... 대사 @핸드아웃 보내기|자료명|캐릭터명',
        '나레이터 줄과 함께 공개',
      );
    var setup = setupSteps([
      '자료: 공개할 핸드아웃을 관리할 폴더에 배치',
      '대상: 캐릭터 편집 권한에 플레이어 지정',
      '폴더: <code>!핸드아웃 관리</code>에서 선택',
      '공개 알림: <code>🖊️핸드아웃</code> 매크로의 <code>/desc</code> 디자인 사용',
    ]);
    return moduleHelpSection(
      'handout',
      '07 핸드아웃',
      setup +
        '<div style="margin:7px 0">' +
        actionButton('관리 열기', '!핸드아웃 관리', '#7654a8') +
        '</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function avatarHelpSection() {
    var setup = setupSteps([
      '덱: <code>avatars</code>, 카드 앞면에 캐릭터 이미지 등록',
      '카드 이름: <code>캐릭터명</code>, <code>캐릭터명-표정명</code>',
      '캐릭터 저널: 카드의 캐릭터명과 이름 일치',
      '변경 대상: <code>!아바타 관리</code>에서 선택',
    ]);
    var rows =
      commandRow('!@웃음', '현재 화자의 설정된 대상 변경') +
      commandRow('!... /as "홍길동" 대사 @웃음', '나레이터 줄과 함께 변경') +
      commandRow('!아바타 대상|홍길동|시트|켜기', '캐릭터별 변경 대상 설정') +
      commandRow('!아바타 제외|추가|홍길동', '캐릭터 이미지와 맵 토큰 자동 변경 제외');
    return moduleHelpSection(
      'avatar',
      '09 캐릭터 이미지',
      setup +
        '<div style="margin:7px 0">' +
        actionButton('캐릭터 이미지', '!아바타 관리', '#7654a8') +
        '</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function sheetHelpSection() {
    var setupItems = [
      '화자를 사용할 캐릭터로 선택하거나 토큰 하나를 선택',
      '<code>!!관리</code>에서 계약 매칭과 원본 롤 버튼 확인',
    ];
    if (hasPlugin('cutin')) setupItems.push('08 컷인에서 지원되는 판정 결과 또는 특정 항목에 컷인 연결');
    var setup = setupSteps(setupItems);
    var rows =
      commandRow('!!원본 버튼 이름', '현재 시트의 롤 실행') +
      commandRow('!!비밀 원본 버튼 이름', '현재 시트의 롤을 GM에게 실행') +
      commandRow('!!원본 버튼 이름 선택지 이름', '현재 시트의 선택 모드로 실행') +
      commandRow('!!상태', '인식된 항목 확인');
    return moduleHelpSection(
      'sheet',
      '10 시트 헬퍼',
      setup +
        '<div style="margin:7px 0">' +
        actionButton('시트 헬퍼 관리', '!!관리', '#7654a8') +
        '</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function cutinHelpSection() {
    var cutin = cutinHelpConfig();
    var rows =
      commandRow('!컷인 재생|카드명|3초', '카드 컷인 표시') +
      commandRow('!컷인 핸드아웃|자료명|3초', '핸드아웃 표지 컷인 표시') +
      commandRow('!컷인 중지', '현재 컷인과 연결 음원 중지') +
      commandRow('!... 대사 @컷인 카드명|3초', '나레이터 줄과 함께 표시') +
      commandRow(
        '!컷인 대사추가|컷인명|문구1,문구2',
        '정확히 같은 대사와 자동 연결',
      );
    var controls =
      actionButton('컷인 관리', '!컷인 관리', '#287a4b') +
      ' ' +
      actionButton(
        '화면 최대 크기',
        '!컷인 기본크기|?{최대 가로(px)|' +
          cutin.width +
          '}|?{최대 세로(px)|' +
          cutin.height +
          '}',
        '#7654a8',
      );
    var setup = setupSteps([
      '덱: <code>cutin</code>, 카드 앞면에 컷인 이미지 등록',
      '그룹: <code>다이스-성공</code>, <code>다이스-실패</code>는 <code>다이스</code> 크기 공유',
      '표시 영역(선택): GM 레이어 <code>cutin_area</code>',
      '배경(선택): 맵 전체 크기의 GM 레이어 <code>cutin_overlay</code>',
      '핸드아웃 표지 크기: 07 핸드아웃 관리에서 등록',
    ]);
    return moduleHelpSection(
      'cutin',
      '08 컷인',
      setup +
        '<div style="margin:7px 0">' +
        controls +
        '</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function vdHelpConfig() {
    var defaults = {
      font_family: 'Arial',
      name_font_size: 20,
      name_font_color: '#c0c0c0',
      dialogue_font_size: 18,
      dialogue_font_color: 'rgb(255, 255, 255)',
      desc_font_size: 22,
      desc_font_color: '#c0c0c0',
      stroke_enabled: false,
      stroke_color: '#000000',
      desc_offset_y: 0,
      dialogue_panel_mode: 'split',
      width: 415,
      height: 623,
      standing_fit: 'contain-top',
      max_number: 5,
    };
    var status = KIBScene.call('vd', 'status') || {};
    var saved = status.config || {};
    var result = {};
    Object.keys(defaults).forEach(function (key) {
      result[key] = saved[key] === undefined ? defaults[key] : saved[key];
    });
    result.ratio_count = Number(status.ratioCount) || 0;
    return result;
  }

  function vdHelpLayerOrder() {
    var status = KIBScene.call('vd', 'status') || {};
    return status.layerOrder || '현재 페이지에 등록한 맵시트가 없습니다.';
  }

  function cutinHelpConfig() {
    var saved = KIBScene.call('cutin', 'status') || {};
    return {
      width: Number(saved.defaultWidth) > 0 ? Number(saved.defaultWidth) : 700,
      height:
        Number(saved.defaultHeight) > 0 ? Number(saved.defaultHeight) : 280,
    };
  }

  function apngAudioHelpControls() {
    var deck = (findObjs({ _type: 'deck', name: 'apng' }) || [])[0];
    var cards = deck ? findObjs({ _type: 'card', _deckid: deck.id }) || [] : [];
    var tracks = findObjs({ _type: 'jukeboxtrack' }) || [];
    cards.sort(function (a, b) {
      return String(a.get('name') || '').localeCompare(
        String(b.get('name') || ''),
      );
    });
    tracks.sort(function (a, b) {
      return String(a.get('title') || '').localeCompare(
        String(b.get('title') || ''),
      );
    });
    if (!cards.length || !tracks.length)
      return '<div style="margin-bottom:8px;padding:7px;background:#f3f3f3;border-left:4px solid #111"><b>APNG 효과음 연결:</b> <code>apng</code> 카드와 쥬크박스 음원 필요</div>';
    var cardQuery = idQuery('APNG 카드', cards, 'name');
    var trackQuery = idQuery('효과음', tracks, 'title');
    return (
      '<div style="margin-bottom:8px;padding:7px;background:#f3f3f3;border-left:4px solid #111"><b>APNG 효과음 연결</b><br>' +
      actionButton(
        '연결 등록',
        '!APNG 연결|' + cardQuery + '|' + trackQuery,
        '#7654a8',
      ) +
      ' ' +
      actionButton('연결 해제', '!APNG 연결해제|' + cardQuery, '#8b3940') +
      ' ' +
      actionButton('연결 목록', '!APNG 연결목록', '#237a8b') +
      '</div>'
    );
  }

  function standingRatioHelpControl() {
    var deck = (findObjs({ _type: 'deck', name: 'standings' }) || [])[0];
    var cards = deck ? findObjs({ _type: 'card', _deckid: deck.id }) || [] : [];
    cards.sort(function (a, b) {
      return String(a.get('name') || '').localeCompare(
        String(b.get('name') || ''),
      );
    });
    if (!cards.length)
      return '<br><span style="display:inline-block;margin-top:5px;font-size:11px;color:#111"><b>스탠딩 비율:</b> standings 덱에 카드 없음</span>';
    return actionButton(
      '카드 비율 등록',
      '!비주얼 비율|등록|' +
        idQuery('스탠딩 카드', cards, 'name') +
        '|?{원본 가로(px)}|?{원본 세로(px)}',
      '#7654a8',
    );
  }

  function idQuery(label, items, field) {
    if (items.length === 1) return 'id:' + items[0].id;
    var result = '?{' + label;
    items.forEach(function (item) {
      var name = String(item.get(field) || '이름 없음').replace(/[|,}]/g, ' ');
      result += '|' + name + ',id:' + item.id;
    });
    return result + '}';
  }

  function helpSection(title, body) {
    return (
      '<div style="margin-top:12px;border:1px solid #111;background:#fff">' +
      '<div style="padding:7px 9px;background:#111;font-weight:bold;color:#fff">' +
      title +
      '</div>' +
      '<div style="padding:9px">' +
      body +
      '</div></div>'
    );
  }

  function setupSteps(steps) {
    return (
      '<div style="margin-bottom:9px;padding:8px 9px;background:#f3f3f3;border-left:4px solid #111"><b>세팅법</b><ol style="margin:5px 0 0 20px;padding:0">' +
      steps
        .map(function (step) {
          return '<li style="margin:3px 0">' + step + '</li>';
        })
        .join('') +
      '</ol></div>'
    );
  }

  function actionButton(label, command, color) {
    return (
      '<a href="' +
      escapeHtml(command) +
      '" style="display:inline-block;margin:2px 1px;padding:5px 8px;border-radius:0;background:' +
      color +
      ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' +
      escapeHtml(label) +
      '</a>'
    );
  }

  function inlineCode(command) {
    return (
      '<code style="display:inline-block;padding:2px 5px;background:#f5f5f5;color:#111;border:1px solid #111;border-radius:0">' +
      escapeHtml(command) +
      '</code>'
    );
  }

  function tableRow(label, value) {
    return (
      '<tr><td style="width:44%;padding:6px;border-bottom:1px solid #111;font-weight:bold;vertical-align:top">' +
      label +
      '</td>' +
      '<td style="padding:6px;border-bottom:1px solid #111;vertical-align:top">' +
      value +
      '</td></tr>'
    );
  }

  function commandRow(command, description) {
    return tableRow(inlineCode(command), description);
  }

  function refreshHandout() {
    initState();
    var name = KIBScene.get('help.handoutName', DEFAULTS.help.handoutName);
    var handout = state.KIBSceneDirector.helpId
      ? getObj('handout', state.KIBSceneDirector.helpId)
      : null;
    if (!handout) {
      var found = findObjs({ _type: 'handout', name: name }) || [];
      handout =
        found[0] ||
        createObj('handout', {
          name: name,
          inplayerjournals: '',
          controlledby: '',
          archived: false,
        });
    }
    if (!handout) return;
    state.KIBSceneDirector.helpId = handout.id;
    var desired = {
      name: name,
      inplayerjournals: '',
      controlledby: '',
      notes: helpHtml(true),
    };
    var handled = false;
    function apply(notes) {
      if (handled) return;
      handled = true;
      var updates = {};
      ['name', 'inplayerjournals', 'controlledby'].forEach(function (key) {
        var current = handout.get(key);
        if (String(current == null ? '' : current) !== String(desired[key]))
          updates[key] = desired[key];
      });
      if (String(notes == null ? '' : notes) !== desired.notes)
        updates.notes = desired.notes;
      if (Object.keys(updates).length) handout.set(updates);
    }
    var direct = handout.get('notes', apply);
    if (typeof direct === 'string') apply(direct);
  }

  var handoutTimer = null;
  function scheduleHandoutRefresh() {
    if (!state.KIBSceneDirector || !KIBScene.get('help.createHandout', true))
      return;
    if (handoutTimer) clearTimeout(handoutTimer);
    handoutTimer = setTimeout(function () {
      handoutTimer = null;
      try {
        refreshHandout();
      } catch (err) {
        whisper(
          '<b>사용법 핸드아웃을 갱신하지 못했습니다.</b><br>오류: ' +
            escapeHtml(errorText(err)) +
            '',
        );
      }
    }, 100);
  }

  function initState() {
    state.KIBSceneDirector = state.KIBSceneDirector || {};
    state.KIBSceneDirector.config = mergeDefaults(
      state.KIBSceneDirector.config || {},
      DEFAULTS,
    );
    if (!state.KIBSceneDirector.typewriterAllMigration310) {
      state.KIBSceneDirector.config.timing.typeAllLines = true;
      state.KIBSceneDirector.typewriterAllMigration310 = true;
    }
    state.KIBSceneDirector.config.version = DEFAULTS.version;
  }

  function config() {
    initState();
    return state.KIBSceneDirector.config;
  }
  function normalizeResult(result) {
    if (result === false)
      return {
        ok: false,
        error: '연결된 기능이 이 명령을 실행하지 못했습니다.',
      };
    if (result && result.ok === false)
      return {
        ok: false,
        error: String(result.error || '연결된 기능을 실행하지 못했습니다.'),
      };
    return result && typeof result === 'object' ? result : { ok: true };
  }
  function number(path) {
    return parseInt(KIBScene.get(path, 0), 10) || 0;
  }
  function seconds(ms) {
    return (ms / 1000).toFixed(2) + '초';
  }
  function visibleLength(text) {
    var source = String(text || '');
    var parsed = KIBScene.call('narrator', 'extract', [source]);
    var visible =
      parsed && parsed.text !== undefined
        ? parsed.text
        : source.replace(/\{\{@[^{}]+\}\}/g, '');
    visible = visible.replace(/^\/(?:desc|em)\s+/, '');
    var sanitized = KIBScene.call('vd', 'sanitize', [visible, 'desc']);
    if (sanitized !== undefined && !(sanitized && sanitized.ok === false))
      visible = sanitized;
    return visible.length;
  }
  function isSettablePath(path) {
    return (
      /^timing\.(?:firstDelay|lineInterval|visualMinShow|visualCharRatio|typeSpeed|typeHold|typeAllLines)$/.test(
        path,
      ) || /^help\.(?:createHandout|handoutName)$/.test(path)
    );
  }
  function parseValue(value) {
    if (/^(?:true|on|켜기)$/i.test(value)) return true;
    if (/^(?:false|off|끄기)$/i.test(value)) return false;
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
    return value;
  }
  function validateValue(path, value) {
    if (path === 'timing.typeAllLines' || path === 'help.createHandout') {
      return typeof value === 'boolean'
        ? ''
        : '이 설정은 true 또는 false만 사용할 수 있습니다.';
    }
    if (path.indexOf('timing.') === 0) {
      if (typeof value !== 'number' || !isFinite(value))
        return '시간 설정은 숫자여야 합니다.';
      var max =
        path === 'timing.visualCharRatio' || path === 'timing.typeSpeed'
          ? 10000
          : 600000;
      if (value < 0 || value > max) return '허용 범위는 0~' + max + '입니다.';
    }
    if (path === 'help.handoutName' && !String(value || '').trim())
      return '핸드아웃 이름은 비울 수 없습니다.';
    return '';
  }
  function getPath(object, path) {
    var parts = String(path || '').split('.');
    var value = object;
    for (var i = 0; i < parts.length; i++) {
      if (
        value == null ||
        !Object.prototype.hasOwnProperty.call(value, parts[i])
      )
        return undefined;
      value = value[parts[i]];
    }
    return value;
  }
  function setPath(object, path, value) {
    var parts = String(path || '').split('.');
    var target = object;
    for (var i = 0; i < parts.length - 1; i++)
      target = target[parts[i]] = target[parts[i]] || {};
    target[parts[parts.length - 1]] = value;
  }
  function mergeDefaults(value, defaults) {
    var result = value && typeof value === 'object' ? value : {};
    Object.keys(defaults).forEach(function (key) {
      if (result[key] === undefined) result[key] = clone(defaults[key]);
      else if (
        defaults[key] &&
        typeof defaults[key] === 'object' &&
        !Array.isArray(defaults[key])
      ) {
        result[key] = mergeDefaults(result[key], defaults[key]);
      }
    });
    return result;
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function normalize(value) {
    return String(value || '')
      .trim()
      .toLowerCase();
  }
  function errorText(err) {
    return String(err && err.message ? err.message : err || '알 수 없는 오류');
  }
  function settingName(path) {
    return (
      {
        'timing.firstDelay': '첫 출력 대기',
        'timing.lineInterval': '줄 간격',
        'timing.visualMinShow': '비주얼 노벨 최소 표시 시간',
        'timing.visualCharRatio': '비주얼 노벨 글자당 시간',
        'timing.typeSpeed': '스크립트 글자당 시간',
        'timing.typeHold': '스크립트 유지 시간',
        'timing.typeAllLines': '모든 줄 스크립트',
        'help.createHandout': '사용법 핸드아웃',
        'help.handoutName': '사용법 핸드아웃 이름',
      }[path] || path
    );
  }
  function featureName(name) {
    var key = normalize(name);
    var adapter = KIBScene.adapters[key];
    var labels = {
      audio: '오디오',
      vd: '비주얼 노벨',
      image: '이미지 전환',
      type: '스크립트',
      apng: 'APNG',
      handout: '핸드아웃',
      cutin: '컷인',
      avatar: '캐릭터 이미지',
      sheet: '시트 헬퍼',
    };
    return String(
      (adapter && adapter.meta && adapter.meta.title) ||
        labels[key] ||
        name ||
        '연결 기능',
    );
  }
  function featureUnavailable(name) {
    return (
      featureName(name) +
      ' 기능을 사용할 수 없습니다. 설치 여부를 확인하세요.'
    );
  }
  function featureFailure(name, err) {
    return (
      featureName(name) + ' 처리 중 문제가 발생했습니다: ' + errorText(err)
    );
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
