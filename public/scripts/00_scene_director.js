/*
 * Scene Suite 00 - Scene Director 3.4.0
 * 제작 및 통합: @EOOOOORK
 */
var KIBScene = KIBScene || {};
(function () {
  'use strict';

  var DEFAULTS = {
    version: '3.4.0',
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
                featureName(names[i]) + ' 연동 처리를 완료하지 못했습니다.',
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
    var lastStart = first + (lines.length - 1) * interval;
    var typeEnd = 0;
    var vdEnd = 0;
    var vdCursor = first;
    for (var i = 0; i < lines.length; i++) {
      var start = first + i * interval;
      var length = visibleLength(lines[i]);
      var parsedLine = KIBScene.call('narrator', 'extract', [lines[i]]) || null;
      if (
        typeEnabled &&
        (typeAll ||
          (parsedLine && parsedLine.directType) ||
          /(?:\{\{@type(?:\|[^{}]*)?\}\}|(?:^|\s)@(?:타자|type)(?=\s|$))/.test(
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
        '<b>SceneDirector 명령을 처리하지 못했습니다.</b><br>명령을 확인한 뒤 <code>!sd help</code>를 참고해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
          escapeHtml(errorText(err)) +
          '</span>',
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
      return whisper('GM 전용 도움말 핸드아웃을 갱신했습니다.');
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
    whisper('<b>' + escapeHtml(path) + '</b> = ' + escapeHtml(String(value)));
    scheduleHandoutRefresh();
  }

  function resetConfig(path) {
    if (!path || path === 'all') {
      state.KIBSceneDirector.config = clone(DEFAULTS);
      whisper('중앙 설정 전체를 기본값으로 복구했습니다.');
    } else {
      var defaultValue = getPath(DEFAULTS, path);
      if (defaultValue === undefined)
        return whisper('기본값이 없는 설정입니다: ' + escapeHtml(path));
      setPath(config(), path, clone(defaultValue));
      whisper('<b>' + escapeHtml(path) + '</b>을 기본값으로 복구했습니다.');
    }
    scheduleHandoutRefresh();
  }

  function setFeature(name, value) {
    name = normalize(name);
    if (!Object.prototype.hasOwnProperty.call(DEFAULTS.features, name))
      return whisper('알 수 없는 기능: ' + escapeHtml(name));
    if (
      !/^(?:on|off|true|false|1|0|켜기|끄기|사용|미사용)$/i.test(
        String(value || ''),
      )
    ) {
      return whisper('기능 값은 on 또는 off로 입력하세요.');
    }
    var enabled = /^(?:on|true|1|켜기|사용)$/i.test(String(value || ''));
    setPath(config(), 'features.' + name, enabled);
    whisper(name + ' = <b>' + (enabled ? 'ON' : 'OFF') + '</b>');
    scheduleHandoutRefresh();
  }

  function showEstimate(lines) {
    if (!lines.length || (lines.length === 1 && !lines[0]))
      return whisper('형식: <code>!sd estimate|첫 줄|둘째 줄</code>');
    var result = KIBScene.estimate(lines);
    whisper(
      '<b>예상 출력 시간</b><br>' +
        '줄 수: ' +
        result.lines +
        '<br>' +
        '마지막 줄 시작: ' +
        seconds(result.lastLineStartsAt) +
        '<br>' +
        '타자식 종료: ' +
        seconds(result.typewriterEndsAt) +
        '<br>' +
        'Visual Dialogue 종료: ' +
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
      '사용 가능한 기능: ' +
      escapeHtml(adapters.map(featureName).join(', ') || '(없음)') +
      '<br>' +
      'Narrator: ' +
      narratorState +
      (state.last_narration_error
        ? ' / 마지막 문제: ' +
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
      '<b>중앙 설정</b><br>' +
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
        '타자식=글자당 ' +
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
      '<code>!sd status</code> — 연결된 기능 상태',
      '<code>!sd config</code> — 중앙 시간·기능 설정',
      '<code>!sd set|timing.lineInterval|3000</code> — 설정 변경',
      '<code>!sd estimate|첫 줄|둘째 줄</code> — 예상 출력시간',
      '<code>!sd handout</code> — 사용법 핸드아웃 갱신',
    ];
    var names = Object.keys(KIBScene.adapters).sort();
    for (var i = 0; i < names.length; i++) {
      var adapter = KIBScene.adapters[names[i]];
      var meta = adapter.meta || {};
      if (adapter.help && adapter.help.length)
        rows.push(
          '<b>' +
            escapeHtml(meta.code || names[i]) +
            ' · ' +
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
      vd: '대사창',
      image: '이미지 전환',
      type: '타자식',
      apng: 'APNG',
      handout: '핸드아웃',
      cutin: '컷인',
      avatar: '아바타',
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
    var adapterRows = names.length
      ? names
          .map(function (name) {
            return tableRow(
              escapeHtml(featureLabels[name] || name),
              '<span style="color:#287a4b;font-weight:bold">사용 가능</span>',
            );
          })
          .join('')
      : tableRow('(없음)', '설치한 기능 파일을 확인하세요.');

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
        ? actionButton('아바타 관리', '!아바타 관리', '#7654a8') + ' '
        : '') +
      actionButton('도움말 갱신', '!sd handout', '#9b6b20');
    var sections = [];
    sections.push(
      helpSection(
        '00 · SceneDirector 중앙 관리',
        '<div>설치된 코드만 아래에 표시됩니다. 각 기능은 해당 파일만 따로 설치해도 사용할 수 있습니다.</div>' +
          (featureButtons
            ? '<div style="margin-top:8px"><b>기능 켜기 / 끄기</b><br>' +
              featureButtons +
              '</div>'
            : '') +
          '<div style="margin-top:8px">' +
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
    sections.push(
      helpSection(
        '설치 상태',
        '<table style="width:100%;border-collapse:collapse">' +
          adapterRows +
          '</table>',
      ),
    );

    return (
      '<div style="font-family:Arial,sans-serif;color:#2d3340;line-height:1.45">' +
      '<div style="background:#172235;color:#fff;padding:14px;border:1px solid #0e1726;border-radius:6px">' +
      '<div style="font-size:20px;font-weight:bold">SceneDirector <span style="font-size:12px;color:#8ed8f8">v' +
      DEFAULTS.version +
      '</span></div>' +
      '<div style="margin-top:3px;color:#d9e3f0">현재 설치된 기능을 한곳에서 설정합니다.</div>' +
      '<div style="margin-top:10px">' +
      headerButtons +
      '</div>' +
      '</div>' +
      sections.join('') +
      '<div style="margin-top:12px;color:#667085;font-size:11px;text-align:center">GM 전용 · ' +
      inlineCode('!sd handout') +
      '으로 언제든 갱신</div>' +
      '</div>'
    );
  }

  function hasPlugin(name) {
    return !!KIBScene.plugin(name);
  }

  function moduleHelpSection(name, fallbackTitle, body) {
    var adapter = KIBScene.plugin(name) || {};
    var meta = adapter.meta || {};
    return helpSection(
      escapeHtml(meta.code || '') +
        (meta.code ? ' · ' : '') +
        escapeHtml(meta.title || fallbackTitle),
      body,
    );
  }

  function narratorHelpSection() {
    var rows =
      commandRow('!... 대사', '줄을 차례대로 출력') +
      commandRow('!,', '일시정지 / 다시 시작') +
      commandRow('!/', '전체 취소') +
      commandRow('!... /as "홍길동" 대사 @웃음', '캐릭터 대사와 표정 변경') +
      commandRow('!... /desc 설명', '강조 설명 출력') +
      commandRow('!... /emas "홍길동" 행동', '캐릭터 행동 출력');
    var setup = setupSteps([
      '맵·덱 설정은 필요 없습니다. 캐릭터 대사를 쓸 경우 저널에 캐릭터를 만듭니다.',
      '<code>/as</code>와 <code>/emas</code> 이름을 캐릭터 저널 이름과 같게 쓰세요.',
      '같이 실행할 기능 파일만 추가한 뒤 줄 끝에 <code>@오디오</code>·<code>@APNG</code> 등을 붙입니다.',
    ]);
    return moduleHelpSection(
      'narrator',
      '01 Narrator',
      setup +
        '<table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table><div style="margin-top:7px">줄 끝의 <code>@기능</code>은 같은 순간에 실행되며, 실패하면 남은 큐를 자동 취소합니다.</div>',
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
      'Roll20 쥬크박스의 <b>오디오 관리</b>에서 음원을 추가하고, 제목은 서로 다르게 짓습니다.',
      'BGM은 제목 앞에 이모지를 붙이고, 효과음은 이모지 없이 두면 자동 분류됩니다.',
      '자동 생성된 <code>🎵오디오</code>·<code>🪇효과음</code> 매크로를 바에서 쓰려면 각 매크로의 <b>Show in Macro Bar</b>를 켭니다.',
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
    var setup =
      tableRow('페이지', '<code>page_list</code>에 실제 페이지 이름 입력') +
      tableRow(
        'GM 레이어',
        '<code>vd_area</code>, <code>vd_name</code>, <code>vd_dialogue</code>',
      ) +
      tableRow(
        '오브젝트 레이어',
        '<code>vd_panel</code> 필수, <code>vd_dialogue_box</code> 선택',
      ) +
      tableRow('맵 레이어', '<code>vd_background</code> 선택') +
      tableRow(
        '스탠딩',
        '<code>standings</code> 덱에 <code>캐릭터명</code>, <code>캐릭터명-감정명</code> 카드',
      );
    var controls =
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
      actionButton('강조창 뒤', '!비주얼 순서|강조창뒤', '#287a4b') +
      ' ' +
      actionButton('대사창 뒤', '!비주얼 순서|대사창뒤', '#287a4b') +
      ' ' +
      actionButton('글자 뒤', '!비주얼 순서|글자뒤', '#287a4b') +
      ' ' +
      actionButton('순서 상태', '!비주얼 순서|상태', '#237a8b');
    var rows =
      commandRow('!@웃음', '현재 캐릭터 표정 변경') +
      commandRow('!@', '기본 표정으로 변경') +
      commandRow('!비주얼 제외|추가|AS 이름', '해당 AS 숨김') +
      commandRow(
        '!비주얼 순서|맵시트등록',
        '선택한 고정 맵시트의 앞뒤 순서 저장',
      );
    var firstSetup = setupSteps([
      '코드 상단 <code>page_list</code>에 쓸 페이지 이름을 적고, 그 페이지에 아래 가이드 토큰을 배치합니다.',
      '<code>standings</code> 덱을 만들고 <code>캐릭터명</code>·<code>캐릭터명-표정명</code> 카드를 넣습니다. 캐릭터 저널 이름도 같아야 합니다.',
      '고정 맵시트를 쓰면 토큰을 선택하고 <b>맵시트 등록</b>을 한 번 누릅니다.',
    ]);
    return moduleHelpSection(
      'vd',
      '03 Visual Dialogue',
      firstSetup +
        '<b>화면 꾸미기</b><table style="width:100%;border-collapse:collapse">' +
        setup +
        '</table><div style="margin:7px 0">' +
        controls +
        '</div><div>' +
        vdHelpLayerOrder() +
        '<br>글자는 강조창과 대사창보다 항상 앞에 표시됩니다.</div><table style="width:100%;border-collapse:collapse">' +
        rows +
        '</table>',
    );
  }

  function imageHelpSection() {
    var setup = setupSteps([
      '<code>image</code>로 시작하는 덱을 만듭니다. 예: <code>image_scene</code>.',
      '변경할 그림을 그 덱의 카드 앞면에 넣습니다.',
      '페이지에 덱과 이름이 완전히 같은 토큰 <code>image_scene</code>을 두고, 자동 생성된 <code>이미지변경</code> 매크로를 쓸니다.',
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
          'Narrator 줄과 동시에 변경',
        ) +
        '</table>',
    );
  }

  function typeHelpSection() {
    var setup = setupSteps([
      '<b>03 Visual Dialogue의 대사창 타자 출력만 쓰면 05는 설치하지 않아도 됩니다.</b>',
      '별도 타자창을 쓸 때만 코드 상단의 <code>PAGE_NAME</code>, <code>BOX_IMAGE_URL</code>, <code>ALLOWED_NAMES</code>를 방에 맞게 바꾸세요.',
      '표시 페이지에서 <code>!dialog-page here</code>를 한 번 실행하면 그 페이지를 쓸 수 있습니다.',
    ]);
    return moduleHelpSection(
      'type',
      '05 타자식 출력',
      setup +
        '<div style="margin-top:7px">' +
        actionButton(
          '타자 속도',
          '!sd set|timing.typeSpeed|?{글자당 시간(ms)|' +
            KIBScene.get('timing.typeSpeed', 45) +
            '}',
          '#7654a8',
        ) +
        ' ' +
        actionButton(
          KIBScene.get('timing.typeAllLines', true)
            ? '전체 타자 끄기'
            : '전체 타자 켜기',
          '!sd set|timing.typeAllLines|' +
            (KIBScene.get('timing.typeAllLines', true) ? 'false' : 'true'),
          '#287a4b',
        ) +
        '</div><table style="width:100%;border-collapse:collapse">' +
        commandRow('!... 대사 @타자', '이 줄만 타자식으로 표시') +
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
      '이름이 <code>conversation</code>인 페이지와 <code>apng</code> 덱을 만들고, 덱 카드 앞면에 애니메이션을 넣습니다.',
      '<code>전체</code>는 등록 맵시트 전체에 틉니다. 맵시트가 없으면 페이지 전체를 쓸니다.',
      '지정한 위치에도 틀 경우만 GM 레이어에 <code>apng_area</code> 토큰을 하나 둡니다. 토큰이 있어도 <code>영역</code>을 고른 재생에만 적용됩니다.',
      '자동 생성된 <code>📽️apng</code> 매크로에서 카드·전체/지정 영역·1회/반복을 고릅니다.',
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
      commandRow('!핸드아웃 관리', '관리 핸드아웃 생성·갱신') +
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
        'Narrator 줄과 동시에 공개',
      );
    var setup = setupSteps([
      '공개할 핸드아웃을 저널에 만들고 관리할 폴더에 넣습니다.',
      '받을 사람은 캐릭터 저널의 <b>Controlled By</b>에 먼저 지정합니다. 명령에는 플레이어명이 아니라 캐릭터명을 쓸니다.',
      '<code>!핸드아웃 관리</code>를 열어 폴더를 선택합니다. <code>🖊️핸드아웃</code> 매크로가 있으면 그 <code>/desc</code> 디자인만 읽고 내용은 바꾸지 않습니다.',
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
      '<code>avatars</code> 덱을 만들고 시트·토큰용으로 미리 자른 이미지를 카드 앞면에 넣습니다.',
      '카드 이름은 <code>캐릭터명</code>·<code>캐릭터명-표정명</code>으로 만들고 캐릭터 저널 이름도 같게 맞춥니다.',
      '<code>!아바타 관리</code>에서 기본 또는 캐릭터별로 시트·토큰·비주얼 변경 대상을 선택합니다.',
    ]);
    var rows =
      commandRow('!@웃음', '현재 Speaking As 캐릭터의 설정된 대상 변경') +
      commandRow('!... /as "홍길동" 대사 @웃음', 'Narrator 줄과 동시에 변경') +
      commandRow('!아바타 대상|홍길동|시트|켜기', '캐릭터별 변경 대상 설정') +
      commandRow('!아바타 제외|추가|홍길동', '시트·토큰 자동 변경 제외');
    return moduleHelpSection(
      'avatar',
      '09 아바타 표정',
      setup +
        '<div style="margin:7px 0">' +
        actionButton('아바타 관리', '!아바타 관리', '#7654a8') +
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
      commandRow('!... 대사 @컷인 카드명|3초', 'Narrator 줄과 동시에 표시') +
      commandRow(
        '!컷인 대사추가|컷인명|문구1,문구2',
        '정확히 같은 대사와 자동 연결',
      ) +
      commandRow(
        '!컷인 시트추가|컷인명|시트출력이름|필드|값',
        '주사위 결과 필드와 연결',
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
      '<code>cutin</code> 덱을 만들고 카드 앞면에 컷인 이미지를 넣습니다.',
      '<code>다이스-성공</code>·<code>다이스-실패</code>처럼 이름을 지으면 <code>다이스</code> 부류가 같은 크기를 씁니다. 크기는 <code>!컷인 관리</code>에서 부류별로 등록합니다.',
      '위치를 제한할 때만 GM 레이어에 <code>cutin_area</code>를 둡니다. 배경을 바꾸려면 맵 전체를 덮는 <code>cutin_overlay</code> 토큰을 GM 레이어에 둡니다.',
      '핸드아웃 표지를 컷인으로 쓸 때만 07 관리 화면에서 표지 크기를 등록합니다.',
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
      return '<div style="margin-bottom:8px;padding:7px;background:#fff3d6;border-left:4px solid #d39827">APNG·효과음 연결 버튼을 쓰려면 <code>apng</code> 카드와 쥬크박스 음원을 하나 이상 등록하세요.</div>';
    var cardQuery = idQuery('APNG 카드', cards, 'name');
    var trackQuery = idQuery('효과음', tracks, 'title');
    return (
      '<div style="margin-bottom:8px;padding:7px;background:#eef0fa;border-left:4px solid #7654a8"><b>APNG ↔ 효과음 자동 연결</b><br>' +
      actionButton(
        '연결 등록',
        '!APNG 연결|' + cardQuery + '|' + trackQuery,
        '#7654a8',
      ) +
      ' ' +
      actionButton('연결 해제', '!APNG 연결해제|' + cardQuery, '#8b3940') +
      ' ' +
      actionButton('연결 목록', '!APNG 연결목록', '#237a8b') +
      '<br><span style="font-size:11px">나중에 이름을 바꿔도 연결은 유지됩니다.</span></div>'
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
      return '<span style="font-size:11px;color:#8b3940">standings 카드 없음</span>';
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
      '<div style="margin-top:12px;border:1px solid #cbd3df;border-radius:5px;background:#f8fafc">' +
      '<div style="padding:7px 9px;background:#e7edf5;border-bottom:1px solid #cbd3df;font-weight:bold;color:#26364d">' +
      title +
      '</div>' +
      '<div style="padding:9px">' +
      body +
      '</div></div>'
    );
  }

  function setupSteps(steps) {
    return (
      '<div style="margin-bottom:8px;padding:8px;background:#fff8e8;border-left:4px solid #d39a26"><b>처음 세팅</b><ol style="margin:5px 0 0 20px;padding:0">' +
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
      '" style="display:inline-block;margin:2px 1px;padding:5px 8px;border-radius:4px;background:' +
      color +
      ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' +
      escapeHtml(label) +
      '</a>'
    );
  }

  function inlineCode(command) {
    return (
      '<code style="display:inline-block;padding:2px 5px;background:#f5e9ed;color:#b42349;border-radius:3px">' +
      escapeHtml(command) +
      '</code>'
    );
  }

  function tableRow(label, value) {
    return (
      '<tr><td style="width:32%;padding:6px;border-bottom:1px solid #dde3ec;font-weight:bold;vertical-align:top">' +
      label +
      '</td>' +
      '<td style="padding:6px;border-bottom:1px solid #dde3ec;vertical-align:top">' +
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
          '<b>SceneDirector 도움말을 갱신하지 못했습니다.</b><br>GM 핸드아웃을 확인한 뒤 <code>!sd handout</code>을 다시 실행해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
            escapeHtml(errorText(err)) +
            '</span>',
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
  function featureName(name) {
    var key = normalize(name);
    var adapter = KIBScene.adapters[key];
    var labels = {
      audio: '오디오',
      vd: '비주얼 대사',
      image: '이미지 전환',
      type: '타자식',
      apng: 'APNG',
      handout: '핸드아웃',
      cutin: '컷인',
      avatar: '아바타',
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
      ' 기능을 사용할 수 없습니다. 해당 기능 코드가 저장·활성화됐는지 확인해 주세요.'
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
