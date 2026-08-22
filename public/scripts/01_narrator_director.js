/*
 * Scene Suite 01 - Narrator Director 확장 버전
 * 확장 및 통합: @EOOOOORK
 * 원본: 양천일염 (kibkibe) Narrator
 * 원본 코드: narrator.js
 * 원본 라이선스: CC BY-NC (저작자표시-비영리)
 * https://github.com/kibkibe/roll20-api-scripts/tree/master/narrator
 */

var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};

// ===== 공통 태그 =====
state.nt_linebreaker = 'Uk3jmApq-*QzfkMA';
state.api_tag = '<a href="#vd-permitted-api-chat"></a>';
state.vd_explicit_as_tag = '<a href="#vd-explicit-as"></a>';

// ===== 사용자 설정 =====
const nt_setting = {
  // 대화 간격(ms)
  interval: 2800,

  // 설치한 호환 모듈
  use_audio: true,
  use_visual_dialogue: true,
  use_image_switcher: true,
  use_dialog_overlay: true,
  use_apng: true,
  use_handout: true,
  use_cutin: true,
  use_avatar: true,
  use_page_change: false,

  // 모든 줄 타자 출력
  type_all_lines: true,
};

// ===== Roll20 이벤트 =====
on('ready', function () {
  if (!state.narration) {
    state.narration = [];
  }
  if (!state.is_narrating) {
    state.is_narrating = 1; //0: 초기화 이전 1: 정지상태 2: 낭독중 3: 일시정지
  }
  if (state.narration_error === undefined) state.narration_error = null;
  // 이전 오류 상태 정리
  if (state.is_narrating === 3) {
    state.narration = [];
    state.is_narrating = 1;
    state.narration_error = null;
  }
  var adapter = {
    meta: { code: '01_narrator_director.js', title: 'Narrator' },
    aliases: { 나레이터: '', narrator: '' },
    extract: ntExtractCues,
    help: [
      '<code>!... 대사</code> 차례대로 출력',
      '<code>!,</code> 일시정지/재시작',
      '<code>!/</code> 취소',
    ],
  };
  if (typeof KIBScene.register === 'function')
    KIBScene.register('narrator', adapter);
  else KIBScene.adapters.narrator = adapter;
});

on('chat:message', function (msg) {
  if (msg.type == 'api') {
    if (
      /^!나레이터(?:\s+(?:help|도움말))?$/i.test(String(msg.content || '')) &&
      playerIsGM(msg.playerid)
    ) {
      sendChat(
        'Narrator',
        '/w GM <b>Narrator 도움말</b><br><code>!... 대사</code> 순서대로 출력<br><code>!... /as "홍길동" 대사</code> 캐릭터 대사<br><code>!... /desc 설명</code> 강조문<br><code>!... /emas "홍길동" 행동</code> 행동문<br><code>!,,, 다음 줄</code> 이전 항목에 줄바꿈 추가<br><code>!. 동시에 출력할 줄</code> 같은 차례에 함께 출력<br><code>!,</code> 일시정지/재시작 · <code>!/</code> 전체 취소<br>줄 끝에 <code>@표정</code>·<code>@오디오</code>·<code>@비주얼</code>·<code>@APNG</code>·<code>@핸드아웃</code>·<code>@컷인</code> 명령을 붙일 수 있습니다.',
        null,
        { noarchive: true },
      );
      return;
    }
    if (
      (msg.content == '!,' ||
        msg.content == '!/' ||
        msg.content.indexOf('!... ') == 0 ||
        msg.content.indexOf('!,,, ') == 0 ||
        msg.content.indexOf('!. ') == 0) &&
      (msg.playerid == 'API' || playerIsGM(msg.playerid))
    ) {
      try {
        if (msg.inlinerolls) {
          msg.inlinerolls.reduce(function (m, v, k) {
            msg.content = msg.content.replace(
              '$[[' + k + ']]',
              '[[' + v.expression + ']]',
            );
          }, {});
        }
        if (msg.content == '!,') {
          // 일시정지, 재시작
          if (state.is_narrating == 2) {
            state.is_narrating = 1;
          } else {
            state.is_narrating = 2;
            narrate();
          }
        } else if (msg.content == '!/') {
          // 전체 취소

          state.narration = [];
          state.is_narrating = 1;
          state.narration_error = null;
        } else if (msg.content.indexOf('!... ') == 0) {
          // 새 대사
          var str = msg.content.replace('!... ', '');
          var as_who;
          var explicit_as = false;

          if (str.indexOf('/desc') == 0) {
            as_who = '';
          } else if (str.indexOf('/as') == 0 || str.indexOf('/emas') == 0) {
            var as_match = str.match(
              /^\/(as|emas)\s+"([^"]+)"(?:\s+([\s\S]*))?$/,
            );
            if (!as_match) {
              sendChat(
                'Narrator',
                '/w GM <b>/as 형식을 확인해 주세요.</b><br>예: <code>!... /as "홍길동" 대사</code>',
                null,
                { noarchive: true },
              );
              return;
            }
            explicit_as = true;
            var cha = findObjs({ _type: 'character', name: as_match[2] })[0];
            if (cha) {
              as_who = 'character|' + cha.get('_id');
            } else {
              as_who = as_match[2];
            }
            if (as_match[1] == 'emas') {
              str = '/em ' + (as_match[3] || '');
            } else {
              str = as_match[3] || '';
            }
          } else {
            as_who = findObjs({
              _type: 'character',
              name: msg.who.replace(' (GM)', ''),
            });
            if (as_who.length > 0) {
              as_who = 'character|' + as_who[0].get('_id');
            } else {
              as_who = findObjs({
                _type: 'player',
                _displayname: msg.who.replace(' (GM)', ''),
              });
              if (as_who.length > 0) {
                as_who = 'player|' + as_who[0].get('_id');
              } else {
                as_who = msg.who;
              }
            }
          }

          state.narration.push({
            as: as_who,
            msg: str,
            explicitAs: explicit_as,
          });

          if (state.is_narrating == 1) {
            state.is_narrating = 2;
            setTimeout(narrate, ntCentral('timing.firstDelay', 500));
          }
        } else if (msg.content.indexOf('!,,, ') == 0) {
          var str = msg.content.replace('!,,, ', '');
          if (state.narration.length > 0) {
            state.narration[state.narration.length - 1].msg += '<br>' + str;
          } else {
            sendChat(
              'Narrator',
              '/w GM <code>!,,,</code>을 붙일 이전 줄이 없습니다.<br><code>!...</code>로 첫 줄을 먼저 입력해 주세요.',
              null,
              { noarchive: true },
            );
          }
        } else if (msg.content.indexOf('!. ') == 0) {
          var str = msg.content.replace('!. ', '');
          if (state.narration.length > 0) {
            state.narration[state.narration.length - 1].msg +=
              state.nt_linebreaker + str;
          } else {
            sendChat(
              'Narrator',
              '/w GM <code>!.</code>을 붙일 이전 줄이 없습니다.<br><code>!...</code>로 첫 줄을 먼저 입력해 주세요.',
              null,
              { noarchive: true },
            );
          }
        }
      } catch (err) {
        ntWhisperProblem('Narrator 명령을 처리하지 못했습니다.', err);
      }
    }
  }
});

// ===== 대사 처리 =====
function narrate() {
  try {
    if (state.is_narrating == 2 && state.narration.length > 0) {
      const current = state.narration[0];
      const split = current.msg.split(state.nt_linebreaker);
      const prepared = [];
      for (let i = 0; i < split.length; i++) {
        const element = split[i];
        const parsed = ntExtractCues(element);
        const typeEnabled = ntFeature('type', nt_setting.use_dialog_overlay);
        const context = {
          as: current.as,
          explicitAs: current.explicitAs === true,
          narrator: true,
          chatType: /^\/desc(?:\s|$)/.test(parsed.text)
            ? 'desc'
            : /^\/em(?:\s|$)/.test(parsed.text)
              ? 'emote'
              : 'general',
          text: parsed.text,
          visualDialogue: false,
        };
        const preparedEvent = ntBroadcast('narrator:prepare', {
          parsed: parsed,
          context: context,
          source: element,
        });
        if (!preparedEvent.ok) return ntCancelOnError(preparedEvent, element);
        preparedEvent.values.forEach(function (entry) {
          if (
            entry.value &&
            entry.value.cue &&
            !parsed.cues.some(function (cue) {
              return cue.type == entry.value.cue.type;
            })
          )
            parsed.cues.push(entry.value.cue);
        });
        if (
          parsed.text.trim().length > 0 &&
          ntHasPlugin('vd') &&
          ntFeature('vd', nt_setting.use_visual_dialogue)
        ) {
          const displayCheck = ntValidateCues(
            [{ type: 'vd', args: ['__display__'], raw: '(display)' }],
            context,
          );
          if (!displayCheck.ok) return ntCancelOnError(displayCheck, element);
          context.visualDialogue = displayCheck.skipped !== true;
        }
        if (
          typeEnabled &&
          ntCentral('timing.typeAllLines', nt_setting.type_all_lines) &&
          !parsed.directType
        ) {
          if (context.visualDialogue) parsed.directType = true;
          else if (ntHasPlugin('type')) {
            parsed.directType = true;
            parsed.cues.push({ type: 'type', args: [], raw: '(automatic)' });
          }
        }
        if (context.visualDialogue && parsed.directType) {
          parsed.cues = parsed.cues.filter(function (cue) {
            return cue.type != 'type';
          });
        }
        const validation = ntValidateCues(parsed.cues, context);
        if (!validation.ok) return ntCancelOnError(validation, element);
        prepared.push({
          parsed: parsed,
          context: context,
          typeEnabled: typeEnabled,
          source: element,
        });
      }
      const lineEvent = ntBroadcast('narrator:line', {
        current: current,
        prepared: prepared,
      });
      if (!lineEvent.ok) return ntCancelOnError(lineEvent, current.msg);
      for (let i = 0; i < prepared.length; i++) {
        const item = prepared[i];
        const execution = ntRunCues(item.parsed.cues, item.context);
        if (!execution.ok) return ntCancelOnError(execution, item.source);
        if (item.parsed.text.trim().length > 0) {
          const injected = ntInjectVisualDialogue(item, current);
          sendChat(
            current.as,
            item.parsed.text +
              (injected
                ? ''
                : (!item.parsed.text.includes(state.api_tag)
                    ? state.api_tag
                    : '') +
                  (current.explicitAs === true
                    ? state.vd_explicit_as_tag
                    : '') +
                  (item.typeEnabled && item.parsed.directType
                    ? '<a href="#sd-direct-type"></a>'
                    : '')),
          );
        }
      }
      state.narration_error = null;
      state.narration.splice(0, 1);
      if (state.narration.length > 0) {
        setTimeout(
          narrate,
          ntCentral('timing.lineInterval', nt_setting.interval),
        );
      } else {
        state.is_narrating = 1;
      }
    } else {
      state.is_narrating = 1;
    }
  } catch (err) {
    ntCancelOnError(
      { ok: false, error: String(err && err.message ? err.message : err) },
      '(runtime)',
    );
  }
}

function ntInjectVisualDialogue(item, current) {
  if (!item.context.visualDialogue || !ntHasPlugin('vd')) return false;
  var text = String(item.parsed.text || '');
  if (item.context.chatType == 'desc')
    text = text.replace(/^\/desc(?:\s+|$)/, '');
  else if (item.context.chatType == 'emote')
    text = text.replace(/^\/em(?:\s+|$)/, '');
  var speaker = '';
  var as = String(current.as || '');
  if (as.indexOf('character|') === 0) {
    var character = getObj('character', as.substring('character|'.length));
    speaker = character ? String(character.get('name') || '') : '';
  } else if (as.indexOf('player|') !== 0) speaker = as;
  return (
    ntCall('vd', 'inject', [
      {
        text: text,
        type: item.context.chatType,
        who: speaker,
        options: {
          allowNoAs:
            item.context.chatType == 'desc' ||
            (item.context.chatType == 'emote' && current.explicitAs === true),
          typewriter: item.typeEnabled && item.parsed.directType,
        },
      },
    ]) === true
  );
}

// 줄 끝 연출 분리, 예전 {{@...}} 형식도 읽기
// Roll template과 채팅 꾸미기 문자열은 유지
function ntExtractCues(source) {
  const cues = [];
  let directType = false;
  let text = String(source || '').replace(
    /\{\{@([^{}]+)\}\}/g,
    function (all, body) {
      const parts = body.split('|').map(function (part) {
        return part.trim();
      });
      const head = ntCueHead(parts.shift());
      let type = head.type;
      if (head.action) parts.unshift(head.action);
      if (type == 'type') directType = true;
      cues.push({ type: type, args: parts, raw: all });
      return '';
    },
  );
  let rollDecorationSuffix = '';
  const rollDecorationMatch = text.match(/(\]\(\s*#"[\s\S]*\)\s*)$/i);
  if (rollDecorationMatch) {
    rollDecorationSuffix = rollDecorationMatch[1];
    text = text.substring(0, text.length - rollDecorationSuffix.length);
  }
  let expressionCue = null;
  const expressionMatch = text.match(/(^|\s)!?@([^\s@|{}]*)\s*$/);
  if (expressionMatch && !ntKnownCue(ntCueHead(expressionMatch[2]).type)) {
    expressionCue = {
      type: ntExpressionCueType(),
      args: [expressionMatch[2]],
      raw: '@' + expressionMatch[2],
    };
    text = text.substring(0, expressionMatch.index) + expressionMatch[1];
  }
  const names = ntCueAliases()
    .map(ntRegexEscape)
    .sort(function (a, b) {
      return b.length - a.length;
    })
    .join('|');
  const bareCue = new RegExp(
    '(^|\\s)@(' +
      names +
      ')(?:(?:\\||\\s+)([\\s\\S]*?))?(?=\\s+@(?:' +
      names +
      ')(?:\\||\\s|$)|$)',
    'gi',
  );
  let removedBareCue = false;
  text = text.replace(bareCue, function (all, prefix, name, body) {
    removedBareCue = true;
    const head = ntCueHead(name);
    const type = head.type;
    const args =
      body == null || !String(body).trim()
        ? []
        : String(body)
            .split('|')
            .map(function (part) {
              return part.trim();
            });
    if (head.action) args.unshift(head.action);
    if (type == 'type') directType = true;
    cues.push({ type: type, args: args, raw: all.substring(prefix.length) });
    return prefix;
  });
  if (expressionCue) cues.push(expressionCue);
  if (removedBareCue || expressionCue) text = text.replace(/\s+$/, '');
  if (rollDecorationSuffix) text += rollDecorationSuffix;
  return { text: text, cues: cues, directType: directType };
}

function ntCueHead(value) {
  const raw = String(value || '').trim();
  if (typeof KIBScene.resolveCueAlias === 'function') {
    const resolved = KIBScene.resolveCueAlias(raw);
    if (resolved) return resolved;
  }
  const compact = raw.match(/^(오디오)(재생|중지|볼륨|페이드인|페이드아웃)$/);
  return {
    type: ntNormalizeCueType(compact ? compact[1] : raw),
    action: compact ? compact[2] : '',
  };
}

function ntNormalizeCueType(value) {
  const type = String(value || '')
    .trim()
    .toLowerCase();
  return (
    {
      오디오: 'audio',
      audio: 'audio',
      이미지: 'image',
      image: 'image',
      비주얼: 'vd',
      vd: 'vd',
      아바타: 'avatar',
      avatar: 'avatar',
      타자: 'type',
      type: 'type',
      apng: 'apng',
      에이피엔지: 'apng',
      핸드아웃: 'handout',
      handout: 'handout',
      자료: 'handout',
      journal: 'handout',
      컷인: 'cutin',
      cutin: 'cutin',
      페이지: 'page',
      page: 'page',
    }[type] || type
  );
}

function ntExpressionCueType() {
  return ntHasPlugin('avatar') ? 'avatar' : 'vd';
}

function ntRunCues(cues, context) {
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (!ntKnownCue(cue.type))
      return {
        ok: false,
        error: '알 수 없는 @명령입니다: ' + cue.type,
        cue: cue,
      };
    if (!ntCueEnabled(cue.type)) continue;
    if (typeof KIBScene.execute === 'function') {
      const result = KIBScene.execute(cue, context);
      if (result && result.ok === false)
        return { ok: false, error: result.error, cue: cue };
      continue;
    }
    const handler = KIBScene.handlers[cue.type];
    if (typeof handler == 'function') {
      try {
        const result = handler(cue.args, context);
        if (result && result.ok === false)
          return { ok: false, error: result.error, cue: cue };
      } catch (err) {
        return {
          ok: false,
          error: String(err && err.message ? err.message : err),
          cue: cue,
        };
      }
    } else {
      return {
        ok: false,
        error:
          ntCueLabel(cue.type) +
          ' 기능을 사용할 수 없습니다. 해당 기능 코드가 저장·활성화됐는지 확인해 주세요.',
        cue: cue,
      };
    }
  }
  return { ok: true };
}

function ntValidateCues(cues, context) {
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    if (!ntKnownCue(cue.type))
      return {
        ok: false,
        error: '알 수 없는 @명령입니다: ' + cue.type,
        cue: cue,
      };
    if (!ntCueEnabled(cue.type)) continue;
    if (typeof KIBScene.validate === 'function') {
      const result = KIBScene.validate(cue, context);
      if (result && result.ok === false)
        return { ok: false, error: result.error, cue: cue };
    } else if (typeof KIBScene.handlers[cue.type] !== 'function') {
      return {
        ok: false,
        error:
          ntCueLabel(cue.type) +
          ' 기능을 사용할 수 없습니다. 해당 기능 코드가 저장·활성화됐는지 확인해 주세요.',
        cue: cue,
      };
    }
  }
  return { ok: true };
}

function ntCancelOnError(result, source) {
  const cancelled = state.narration.length;
  state.last_narration_error = {
    error: String((result && result.error) || '알 수 없는 오류'),
    cue: result && result.cue ? result.cue.raw : '',
    source: String(source || ''),
  };
  state.narration = [];
  state.is_narrating = 1;
  state.narration_error = null;
  sendChat(
    'Narrator',
    '/w GM <b>Narrator가 남은 대사를 취소했습니다.</b><br>' +
      '문제: ' +
      ntEscape(state.last_narration_error.error) +
      (state.last_narration_error.cue
        ? '<br>함께 실행한 명령: <code>' +
          ntEscape(state.last_narration_error.cue) +
          '</code>'
        : '') +
      '<br>취소: ' +
      cancelled +
      '개<br>수정한 뒤 다음 <code>!...</code>를 바로 입력하면 됩니다.',
    null,
    { noarchive: true },
  );
  return { ok: false };
}

function ntEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ntCueLabel(type) {
  return (
    {
      audio: '오디오',
      image: '이미지 전환',
      vd: '비주얼 대사',
      avatar: '아바타',
      type: '타자식',
      apng: 'APNG',
      handout: '핸드아웃',
      cutin: '컷인',
      page: '페이지',
    }[type] || type
  );
}

function ntWhisperProblem(title, err) {
  var detail = String(
    err && err.message ? err.message : err || '알 수 없는 오류',
  );
  sendChat(
    'Narrator',
    '/w GM <b>' +
      ntEscape(title) +
      '</b><br><span style="font-size:11px;color:#687386">상세: ' +
      ntEscape(detail) +
      '</span>',
    null,
    { noarchive: true },
  );
}

function ntCentral(path, fallback) {
  return typeof KIBScene.get === 'function'
    ? KIBScene.get(path, fallback)
    : fallback;
}

function ntFeature(name, fallback) {
  return typeof KIBScene.isFeatureEnabled === 'function'
    ? KIBScene.isFeatureEnabled(name)
    : fallback;
}

function ntHasPlugin(name) {
  return (
    !!(KIBScene.adapters && KIBScene.adapters[name]) ||
    typeof KIBScene.handlers[name] === 'function'
  );
}

function ntCall(name, method, args) {
  if (typeof KIBScene.call === 'function')
    return KIBScene.call(name, method, args);
  var adapter = KIBScene.adapters && KIBScene.adapters[name];
  return adapter && typeof adapter[method] === 'function'
    ? adapter[method].apply(adapter, args || [])
    : undefined;
}

function ntBroadcast(eventName, payload) {
  if (typeof KIBScene.broadcast === 'function')
    return KIBScene.broadcast(eventName, payload);
  var values = [];
  var names = Object.keys(KIBScene.adapters || {}).sort();
  for (var i = 0; i < names.length; i++) {
    var listener =
      KIBScene.adapters[names[i]].events &&
      KIBScene.adapters[names[i]].events[eventName];
    if (typeof listener !== 'function') continue;
    try {
      var value = listener(payload || {});
      if (value && value.ok === false)
        return { ok: false, plugin: names[i], error: value.error };
      if (value !== undefined) values.push({ plugin: names[i], value: value });
    } catch (err) {
      return {
        ok: false,
        plugin: names[i],
        error: String(err && err.message ? err.message : err),
      };
    }
  }
  return { ok: true, values: values };
}

function ntCueAliases() {
  var names = [
    '오디오재생',
    '오디오중지',
    '오디오볼륨',
    '오디오페이드인',
    '오디오페이드아웃',
    '오디오',
    'audio',
    '이미지',
    'image',
    '비주얼',
    'vd',
    '아바타',
    'avatar',
    '타자',
    'type',
    'APNG',
    'apng',
    '에이피엔지',
    '핸드아웃',
    'handout',
    '자료',
    'journal',
    '컷인',
    'cutin',
    '페이지',
    'page',
  ];
  if (typeof KIBScene.cueAliases === 'function')
    names = names.concat(KIBScene.cueAliases());
  return names.filter(function (name, index, list) {
    return name && list.indexOf(name) === index;
  });
}

function ntRegexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ntKnownCue(type) {
  var adapter = KIBScene.adapters && KIBScene.adapters[type];
  return (
    [
      'audio',
      'vd',
      'avatar',
      'image',
      'type',
      'apng',
      'handout',
      'cutin',
      'page',
    ].indexOf(type) > -1 ||
    !!(adapter && typeof adapter.cue === 'function') ||
    typeof KIBScene.handlers[type] === 'function'
  );
}

function ntCueEnabled(type) {
  var fallback = {
    audio: nt_setting.use_audio,
    vd: nt_setting.use_visual_dialogue,
    avatar: nt_setting.use_avatar,
    image: nt_setting.use_image_switcher,
    type: nt_setting.use_dialog_overlay,
    apng: nt_setting.use_apng,
    handout: nt_setting.use_handout,
    cutin: nt_setting.use_cutin,
    page: nt_setting.use_page_change,
  };
  return ntFeature(
    type,
    Object.prototype.hasOwnProperty.call(fallback, type)
      ? fallback[type]
      : ntHasPlugin(type),
  );
}
