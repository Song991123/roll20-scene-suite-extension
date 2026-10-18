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

  // 모든 줄 스크립트 출력
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
    meta: { code: '01_narrator_director.js', title: '나레이터' },
    aliases: { 나레이터: '', narrator: '' },
    extract: ntExtractCues,
    help: [
      '<code>!... 대사</code> 차례대로 출력',
      '<code>!,,, 다음 줄</code> 이전 항목에 줄바꿈 이어쓰기',
      '<code>!. 동시에 출력할 줄</code> 직전 항목과 같은 차례에 출력',
      '<code>!... 대사 @다음줄 1.2초</code> 이 줄만 다음 줄까지 1.2초 대기',
      '<code>!... {사과|포도}</code> 무작위 선택, 채팅에서 선택된 부분에 밑줄',
      '<code>!... /w 캐릭터명 내용</code> 제어 권한자에게 귓말',
      '<code>!,</code> 일시정지 또는 다시 시작',
      '<code>!/</code> 전체 취소',
    ],
  };
  if (typeof KIBScene.register === 'function')
    KIBScene.register('narrator', adapter);
  else KIBScene.adapters.narrator = adapter;
});

on('chat:message', function (msg) {
  if (msg.type == 'api') {
    var narratorCommand = String(msg.content || '').match(
      /^!나레이터(?:\s+(help|도움말|설정))?$/i,
    );
    if (narratorCommand && playerIsGM(msg.playerid)) {
      if (narratorCommand[1] == '설정') {
        var typeEnabled = ntFeature('type', true);
        var typeAllLines = ntCentral('timing.typeAllLines', nt_setting.type_all_lines);
        var typeSpeed = ntCentral('timing.typeSpeed', 45);
        var lineInterval = ntCentral('timing.lineInterval', nt_setting.interval);
        sendChat(
          '나레이터',
          '/w GM <b>나레이터 설정</b><br>타자 출력=' +
            (typeEnabled ? '켜짐' : '꺼짐') +
            ' / 모든 줄=' +
            (typeAllLines ? '켜짐' : '꺼짐') +
            '<br>글자당 ' +
            typeSpeed +
            'ms / 줄 간격 ' +
            lineInterval +
            'ms<br><a href="!sd feature|type|' +
            (typeEnabled ? 'off' : 'on') +
            '" style="display:inline-block;margin:5px 3px 0 0;padding:4px 7px;background:#7654a8;color:#fff;text-decoration:none">타자 출력 ' +
            (typeEnabled ? '끄기' : '켜기') +
            '</a><a href="!sd set|timing.typeAllLines|' +
            (typeAllLines ? 'false' : 'true') +
            '" style="display:inline-block;margin:5px 3px 0 0;padding:4px 7px;background:#287a4b;color:#fff;text-decoration:none">모든 줄 ' +
            (typeAllLines ? '끄기' : '켜기') +
            '</a><a href="!sd set|timing.typeSpeed|&#63;{글자당 시간(ms)|' +
            typeSpeed +
            '}" style="display:inline-block;margin:5px 3px 0 0;padding:4px 7px;background:#53657d;color:#fff;text-decoration:none">글자 속도</a><a href="!sd set|timing.lineInterval|&#63;{줄 사이 간격(ms)|' +
            lineInterval +
            '}" style="display:inline-block;margin:5px 3px 0 0;padding:4px 7px;background:#53657d;color:#fff;text-decoration:none">줄 간격</a>',
          null,
          { noarchive: true },
        );
        return;
      }
      var cueHelp = [];
      if (ntHasPlugin('vd') || ntHasPlugin('avatar'))
        cueHelp.push('<code>@표정</code>', '<code>@캐릭터명:표정</code>');
      if (ntHasPlugin('audio')) cueHelp.push('<code>@오디오</code>');
      if (ntHasPlugin('vd')) cueHelp.push('<code>@비주얼</code>');
      if (ntHasPlugin('apng')) cueHelp.push('<code>@APNG</code>');
      if (ntHasPlugin('handout')) cueHelp.push('<code>@핸드아웃</code>');
      if (ntHasPlugin('cutin')) cueHelp.push('<code>@컷인</code>');
      sendChat(
        '나레이터',
        '/w GM <b>나레이터 도움말</b><br><code>!... 대사</code> 차례대로 출력<br><code>!... 대사 @다음줄 1.2초</code> 이 줄만 다음 줄까지 대기, 0~600초 또는 ms<br><code>!... {사과|포도}</code> 무작위 선택, 채팅에서 밑줄 표시<br><code>!... /w 캐릭터명 내용</code> 제어 권한자에게 귓말<br><code>!... /as "홍길동" 대사</code> 캐릭터 대사<br><code>!... /desc 설명</code> 강조문<br><code>!... /emas "홍길동" 행동</code> 행동문<br><code>!,,, 다음 줄</code> 이전 항목에 줄바꿈 추가<br><code>!. 동시에 출력할 줄</code> 같은 차례에 함께 출력, 내용 필요<br><code>!,</code> 일시정지 또는 다시 시작<br><code>!/</code> 전체 취소' +
          (cueHelp.length ? '<br>줄 끝에 ' + cueHelp.join(', ') + ' 명령을 붙일 수 있습니다.' : ''),
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
          ntBroadcast('narrator:cancel', {});
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
                '나레이터',
                '/w GM <b>/as 또는 /emas 형식을 확인하세요.</b><br>예: <code>!... /as "홍길동" 대사</code>',
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
            originPlayerId: msg.playerid,
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
              '나레이터',
              '/w GM <code>!,,,</code>을 추가할 이전 줄이 없습니다.<br><code>!...</code>로 첫 줄을 먼저 입력하세요.',
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
              '나레이터',
              '/w GM <code>!.</code>을 추가할 이전 줄이 없습니다.<br><code>!...</code>로 첫 줄을 먼저 입력하세요.',
              null,
              { noarchive: true },
            );
          }
        }
      } catch (err) {
        ntWhisperProblem('나레이터 명령을 처리하지 못했습니다.', err);
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
      let lineDelay = null;
      for (let i = 0; i < split.length; i++) {
        const element = split[i];
        const parsed = ntExtractCues(element);
        if (parsed.lineDelayError)
          return ntCancelOnError({ ok: false, error: parsed.lineDelayError }, element);
        if (parsed.lineDelay !== null) {
          if (lineDelay !== null && lineDelay !== parsed.lineDelay)
            return ntCancelOnError(
              {
                ok: false,
                error: '같은 차례에 동시 출력할 줄은 @다음줄 시간을 하나만 사용하세요.',
              },
              current.msg,
            );
          lineDelay = parsed.lineDelay;
        }
        const privateChat = /^\s*\/w(?:\s|$)/i.test(parsed.text);
        let whisperResolution = null;
        if (privateChat) {
          const whisper = ntParseWhisper(parsed.text);
          if (!whisper)
            return ntCancelOnError(
              {
                ok: false,
                error: '귓말 형식을 확인하세요. 예: /w HO1 내용',
              },
              element,
              true,
            );
          whisperResolution = ntResolveWhisperTarget(whisper);
          if (!whisperResolution.ok)
            return ntCancelOnError(whisperResolution, element, true);
        }
        const typeEnabled = ntFeature('type', nt_setting.use_dialog_overlay);
        const context = {
          as: current.as,
          explicitAs: current.explicitAs === true,
          narrator: true,
          privateChat: privateChat,
          chatType: privateChat
            ? 'whisper'
            : /^\/desc(?:\s|$)/.test(parsed.text)
              ? 'desc'
              : /^\/em(?:\s|$)/.test(parsed.text)
                ? 'emote'
                : 'general',
          text: privateChat ? '' : parsed.text,
          visualDialogue: false,
          onAsyncError: function (error) { ntCancelOnError({ ok: false, error: error }, element); },
          lineDelay:
            parsed.lineDelay === null
              ? Number(ntCentral('timing.lineInterval', nt_setting.interval))
              : parsed.lineDelay,
        };
        const preparedEvent = privateChat
          ? { ok: true, values: [] }
          : ntBroadcast('narrator:prepare', {
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
          !privateChat &&
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
          !privateChat &&
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
        if (privateChat) {
          parsed.directType = false;
          parsed.cues = parsed.cues.filter(function (cue) {
            return cue.type != 'type';
          });
        }
        const validation = ntValidateCues(parsed.cues, context);
        if (!validation.ok) return ntCancelOnError(validation, element);
        parsed.text = ntResolveRandomText(parsed.text);
        context.text = privateChat ? '' : parsed.text;
        prepared.push({
          parsed: parsed,
          context: context,
          typeEnabled: typeEnabled,
          whisperResolution: whisperResolution,
          source: element,
        });
      }
      let nextLineDelay =
        lineDelay === null
          ? Number(ntCentral('timing.lineInterval', nt_setting.interval))
          : lineDelay;
      prepared.forEach(function (item) {
        item.context.lineDelay = nextLineDelay;
      });
      const publicPrepared = prepared.filter(function (item) {
        return !item.context.privateChat;
      });
      const lineEvent = publicPrepared.length
        ? ntBroadcast('narrator:line', {
            current: current,
            prepared: publicPrepared,
            lineDelay: nextLineDelay,
          })
        : { ok: true, values: [] };
      if (!lineEvent.ok) return ntCancelOnError(lineEvent, current.msg);
      for (let i = 0; i < prepared.length; i++) {
        const item = prepared[i];
        const execution = ntRunCues(item.parsed.cues, item.context);
        if (!execution.ok) return ntCancelOnError(execution, item.source);
        nextLineDelay = Math.max(nextLineDelay, Number(execution.waitMs) || 0);
        if (item.parsed.text.trim().length > 0) {
          const injected = ntInjectVisualDialogue(item, current);
          const chatText =
            item.parsed.text +
            (item.context.privateChat || injected
              ? ''
              : (!item.parsed.text.includes(state.api_tag)
                  ? state.api_tag
                  : '') +
                (current.explicitAs === true
                  ? state.vd_explicit_as_tag
                  : '') +
                (item.typeEnabled && item.parsed.directType
                  ? '<a href="#sd-direct-type"></a>'
                  : ''));
          if (item.context.privateChat)
            ntSendWhisper(current, chatText, item.whisperResolution);
          else sendChat(current.as, chatText);
        }
      }
      state.narration_error = null;
      state.narration.splice(0, 1);
      if (state.narration.length > 0) {
        setTimeout(narrate, nextLineDelay);
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

// API 귓말은 발신자 화면에 송신 기록이 남지 않으므로 전달 기록을 따로 보냄
function ntSendWhisper(current, text, resolution) {
  const whisper = ntParseWhisper(text);
  if (!whisper) return;
  resolution = resolution || ntResolveWhisperTarget(whisper);
  if (!resolution.ok) return;
  if (whisper.target.toLowerCase() == 'gm') {
    sendChat(current.as, text);
    ntMirrorWhisper(current, whisper, resolution.resolvedName);
    return;
  }
  const originPlayerId = String((current && current.originPlayerId) || '');
  const sentNames = {};
  const recipients = resolution.recipients;
  recipients.forEach(function (player) {
    const playerId = String(player.id || player.get('_id') || '');
    if (playerId && playerId == originPlayerId) return;
    const displayName = ntPlayerDisplayName(player);
    const nameKey = displayName.toLowerCase();
    if (!displayName || sentNames[nameKey]) return;
    sentNames[nameKey] = true;
    sendChat(current.as, '/w "' + displayName.replace(/"/g, '') + '" ' + whisper.body);
  });
  ntMirrorWhisper(current, whisper, resolution.resolvedName);
}

function ntParseWhisper(text) {
  const match = String(text || '').match(
    /^\s*\/w\s+(?:"([^"]+)"|(\S+))(?:\s+([\s\S]*))?$/i,
  );
  return match
    ? { target: match[1] || match[2], body: match[3] || '', quoted: !!match[1] }
    : null;
}

function ntResolveWhisperTarget(whisper) {
  const target = String((whisper && whisper.target) || '').trim();
  if (target.toLowerCase() == 'gm')
    return { ok: true, recipients: [], resolvedName: 'GM' };
  const players = findObjs({ _type: 'player' }) || [];
  const characters = findObjs({ _type: 'character' }) || [];
  const recipients = [];
  const seen = {};
  const matchedNames = [];
  const playerNames = [];
  const characterNames = [];
  const addName = function (names, name) {
    name = String(name || '').trim();
    if (
      name &&
      !names.some(function (value) {
        return value.toLowerCase() == name.toLowerCase();
      })
    )
      names.push(name);
  };
  const addPlayer = function (player) {
    if (!ntPlayerIsOnline(player)) return false;
    const playerId = String(player.id || player.get('_id') || '');
    const key = playerId || ntPlayerDisplayName(player).toLowerCase();
    if (!key) return false;
    if (seen[key]) return true;
    seen[key] = true;
    recipients.push(player);
    return true;
  };
  players.forEach(function (player) {
    const name = ntPlayerDisplayName(player);
    if (!ntWhisperNameMatches(name, whisper)) return;
    addName(matchedNames, name);
    if (addPlayer(player)) addName(playerNames, name);
  });
  characters.forEach(function (character) {
    const name = String(character.get('name') || '').trim();
    if (!ntWhisperNameMatches(name, whisper)) return;
    addName(matchedNames, name);
    let hasOnlineRecipient = false;
    String(character.get('controlledby') || '')
      .split(',')
      .map(function (id) {
        return id.trim();
      })
      .filter(Boolean)
      .forEach(function (id) {
        if (id == 'all')
          players.forEach(function (player) {
            if (addPlayer(player)) hasOnlineRecipient = true;
          });
        else if (addPlayer(getObj('player', id))) hasOnlineRecipient = true;
      });
    if (hasOnlineRecipient) addName(characterNames, name);
  });
  const resolvedNames = characterNames.length ? characterNames : playerNames;
  if (!matchedNames.length)
    return {
      ok: false,
      error: '없는 캐릭터명 또는 플레이어명입니다: ' + target,
    };
  if (!recipients.length || !resolvedNames.length)
    return {
      ok: false,
      error: '현재 접속 중인 수신자가 없습니다: ' + matchedNames.join(', '),
    };
  return {
    ok: true,
    recipients: recipients,
    resolvedName: resolvedNames.join(', '),
  };
}

function ntWhisperRecipients(whisper) {
  const resolved = ntResolveWhisperTarget(whisper);
  return resolved.ok ? resolved.recipients : [];
}

function ntWhisperNameMatches(name, whisper) {
  const candidate = String(name || '').trim().toLowerCase();
  const target = String(whisper.target || '').trim().toLowerCase();
  if (!candidate || !target) return false;
  return whisper.quoted
    ? candidate == target
    : candidate == target ||
        (candidate.indexOf(target) == 0 && /^\s/.test(candidate.substring(target.length)));
}

function ntPlayerDisplayName(player) {
  return String(
    (player && (player.get('_displayname') || player.get('displayname'))) || '',
  ).trim();
}

function ntPlayerIsOnline(player) {
  return !!player && player.get('_online') === true;
}

function ntMirrorWhisper(current, text, resolvedName) {
  try {
    const playerId = String((current && current.originPlayerId) || '');
    if (!playerId || playerId == 'API') return;
    const whisper = typeof text == 'string' ? ntParseWhisper(text) : text;
    if (!whisper) return;
    const player = getObj('player', playerId);
    if (!player) return;
    const displayName = ntPlayerDisplayName(player)
      .replace(/"/g, '')
      .trim();
    if (!displayName || ntDuplicatePlayerName(displayName)) return;
    sendChat(
      '나레이터 서버',
      '/w "' +
        displayName +
        '" → ' +
        ntEscape(resolvedName || whisper.target) +
        ' : ' +
        whisper.body,
      null,
    );
  } catch (err) {
    if (typeof log === 'function')
      log('Narrator whisper copy skipped: ' + String(err));
  }
}

function ntDuplicatePlayerName(displayName) {
  const name = String(displayName || '').trim().toLowerCase();
  return (
    findObjs({ _type: 'player' }).filter(function (player) {
      return (
        String(player.get('_displayname') || player.get('displayname') || '')
          .trim()
          .toLowerCase() == name
      );
    }).length > 1
  );
}

function ntInjectVisualDialogue(item, current) {
  if (
    item.context.privateChat ||
    !item.context.visualDialogue ||
    !ntHasPlugin('vd')
  )
    return false;
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
  let lineDelay = null;
  let lineDelayError = '';
  function useLineDelay(duration) {
    const parsedDelay = ntParseLineDelay(duration);
    if (parsedDelay === null) {
      lineDelayError =
        '@다음줄 시간은 0~600초로 적어 주세요. 예: <code>@다음줄 1.2초</code>';
    } else if (lineDelay !== null && lineDelay !== parsedDelay) {
      lineDelayError = '한 줄에 @다음줄 시간을 하나만 적어 주세요.';
    } else lineDelay = parsedDelay;
  }
  function stripLineDelay(value) {
    return value.replace(
      /(^|\s)@다음줄(?:(?:\||\s+)([\s\S]*?))?(?=\s+@|$)/gi,
      function (all, prefix, duration) {
        useLineDelay(duration);
        return prefix;
      },
    );
  }
  // 롤꾸의 표시 문자열과 CSS 목적지를 분리해 명령 인자가 CSS를 삼키지 않게 한다.
  const decoratedSource = String(source || '');
  const decoration = /\[([^\[\]]*)\](?:\\)?\(\s*#"/g;
  let decorationMatch;
  let cursor = 0;
  let decoratedText = '';
  function extractPart(value) {
    const parsed = ntExtractCues(value);
    cues.push.apply(cues, parsed.cues);
    directType = directType || parsed.directType;
    if (parsed.lineDelay !== null) useLineDelay(parsed.lineDelay + 'ms');
    if (parsed.lineDelayError) lineDelayError = parsed.lineDelayError;
    return parsed.text;
  }
  while ((decorationMatch = decoration.exec(decoratedSource))) {
    let end = decoration.lastIndex;
    let depth = 1;
    for (; end < decoratedSource.length && depth; end++) {
      if (decoratedSource[end] === '\\') { end++; continue; }
      if (decoratedSource[end] === '(') depth++;
      else if (decoratedSource[end] === ')') depth--;
    }
    if (depth) break;
    const label = decorationMatch[1];
    decoratedText += extractPart(decoratedSource.slice(cursor, decorationMatch.index));
    const cleanLabel = extractPart(label);
    if (cleanLabel.trim() || cleanLabel === label)
      decoratedText += '[' + cleanLabel + decoratedSource.slice(
        decorationMatch.index + label.length + 1, end,
      );
    cursor = end;
    decoration.lastIndex = end;
  }
  if (cursor) {
    decoratedText += extractPart(decoratedSource.slice(cursor));
    if (cues.length && /^\/(?:desc|em)\s*$/.test(decoratedText.trim())) decoratedText = '';
    return { text: decoratedText, cues: cues, directType: directType,
      lineDelay: lineDelay, lineDelayError: lineDelayError };
  }
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
      cues.push({ type: type, args: parts, raw: all, grouped: true });
      return '';
    },
  );
  text = text.replace(
    /(^|\s)@다음줄(?:\||\s+)(\d+(?:\.\d+)?\s*(?:초|s|ms|밀리초))\s*$/i,
    function (all, prefix, duration) {
      useLineDelay(duration);
      return prefix;
    },
  );
  let rollDecorationSuffix = '';
  const rollDecorationMatch = text.match(/(\]\(\s*#"[\s\S]*\)\s*)$/i);
  if (rollDecorationMatch) {
    rollDecorationSuffix = rollDecorationMatch[1];
    text = text.substring(0, text.length - rollDecorationSuffix.length);
  }
  text = stripLineDelay(text);
  const expressionCues = [];
  function extractTrailingExpressions() {
    let expressionMatch = text.match(/(^|\s)!?@([^\s@|{}]*)\s*$/);
    while (
      expressionMatch &&
      !ntKnownCue(ntCueHead(expressionMatch[2]).type)
    ) {
      expressionCues.unshift({
        type: ntExpressionCueType(expressionMatch[2]),
        args: [expressionMatch[2]],
        raw: '@' + expressionMatch[2],
        expressionShorthand: true,
      });
      text = text.substring(0, expressionMatch.index) + expressionMatch[1];
      expressionMatch = text.match(/(^|\s)!?@([^\s@|{}]*)\s*$/);
    }
  }
  extractTrailingExpressions();
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
  extractTrailingExpressions();
  expressionCues.forEach(function (cue) {
    cues.push(cue);
  });
  if (removedBareCue || expressionCues.length) text = text.replace(/\s+$/, '');
  if (rollDecorationSuffix) text += rollDecorationSuffix;
  return {
    text: text,
    cues: cues,
    directType: directType,
    lineDelay: lineDelay,
    lineDelayError: lineDelayError,
  };
}

// 출력 문구만 추첨한다. @명령, Roll20 매크로, 꾸미기 속성은 보존한다.
function ntResolveRandomText(source) {
  const text = String(source || '');
  let result = '';
  for (let i = 0; i < text.length;) {
    let end = i + 1;
    if (text[i] === '<') {
      const close = text.indexOf('>', i + 1);
      if (close >= 0) end = close + 1;
    } else if (text[i] === '(' && (text[i - 1] === ']' || (text[i - 1] === '\\' && text[i - 2] === ']'))) {
      let depth = 1;
      while (end < text.length && depth) {
        if (text[end] === '\\') { end += 2; continue; }
        if (text[end] === '(') depth++;
        else if (text[end] === ')') depth--;
        end++;
      }
    } else if (text[i] === '{') {
      let depth = 1;
      while (end < text.length && depth) {
        if (text[end] === '{') depth++;
        else if (text[end] === '}') depth--;
        end++;
      }
      const body = text.slice(i + 1, end - 1);
      const reserved = /[?@%&\\]/.test(text[i - 1] || '') || body.includes('{') || body.includes('}');
      const choices = body.split('|').map(value => value.trim());
      if (!depth && !reserved && choices.length > 1 && choices.every(Boolean)) {
        const chosen = choices[randomInteger(choices.length) - 1];
        result += '<u>' + chosen.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</u>';
        i = end;
        continue;
      }
    }
    result += text.slice(i, end);
    i = end;
  }
  return result;
}

function ntParseLineDelay(value) {
  const match = String(value || '')
    .trim()
    .toLowerCase()
    .match(/^(\d+(?:\.\d+)?)\s*(초|s|ms|밀리초)$/);
  if (!match) return null;
  const duration =
    match[2] === 'ms' || match[2] === '밀리초'
      ? Math.round(Number(match[1]))
      : Math.round(Number(match[1]) * 1000);
  return duration >= 0 && duration <= 600000 ? duration : null;
}

function ntCueHead(value) {
  const raw = String(value || '').trim();
  if (typeof KIBScene.resolveCueAlias === 'function') {
    const resolved = KIBScene.resolveCueAlias(raw);
    if (resolved) return resolved;
  }
  const adapters = KIBScene.adapters || {};
  for (const name of Object.keys(adapters)) {
    const aliases = adapters[name].aliases || {};
    const key = Object.keys(aliases).find(alias => alias.toLowerCase() === raw.toLowerCase());
    if (key !== undefined) return { type: name, action: String(aliases[key] || '') };
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
      스크립트: 'type',
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

function ntExpressionCueType(value) {
  if (
    /^(?:장면없음|숨김|hide|퇴장|exit|리셋|reset|강제진행|force-progress)(?::|\s|$)/i.test(
      String(value || '').trim(),
    )
  )
    return 'vd';
  return ntHasPlugin('vd') && ntFeature('vd', nt_setting.use_visual_dialogue)
    ? 'vd'
    : 'avatar';
}

function ntCueSteps(cues, context) {
  const steps = [];
  let current = null;
  cues.forEach(function (cue) {
    const adapter = KIBScene.adapters[cue.type];
    if (ntCueEnabled(cue.type) && adapter &&
        typeof adapter.collectFollowing === 'function' && adapter.collectFollowing(cue.args)) {
      current = cue.grouped ? null : {
        cue: cue,
        context: Object.assign({}, context, { followingCues: [] }),
      };
      steps.push(current || { cue: cue, context: context });
    // Automatically generated display cues must keep their original line timing.
    } else if (current && ntCueEnabled(cue.type) && !/^\(/.test(cue.raw || '')) {
      current.context.followingCues.push(cue);
    } else steps.push({ cue: cue, context: context });
  });
  return steps;
}

function ntRunCues(cues, context) {
  let waitMs = 0;
  const steps = ntCueSteps(cues, context);
  for (let i = 0; i < steps.length; i++) {
    const cue = steps[i].cue;
    const cueContext = steps[i].context;
    if (!ntKnownCue(cue.type))
      return {
        ok: false,
        error: '알 수 없는 @명령입니다: ' + cue.type,
        cue: cue,
      };
    if (!ntCueEnabled(cue.type)) continue;
    if (typeof KIBScene.execute === 'function') {
      const result = KIBScene.execute(cue, cueContext);
      if (result && result.ok === false)
        return { ok: false, error: result.error, cue: cue };
      waitMs = Math.max(waitMs, Number(result && result.waitMs) || 0);
      continue;
    }
    const handler = KIBScene.handlers[cue.type];
    if (typeof handler == 'function') {
      try {
        const result = handler(cue.args, cueContext);
        if (result && result.ok === false)
          return { ok: false, error: result.error, cue: cue };
        waitMs = Math.max(waitMs, Number(result && result.waitMs) || 0);
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
          ' 기능을 사용할 수 없습니다. 설치 여부를 확인하세요.',
        cue: cue,
      };
    }
  }
  return waitMs > 0 ? { ok: true, waitMs: waitMs } : { ok: true };
}

function ntValidateCues(cues, context) {
  const steps = ntCueSteps(cues, context);
  for (let i = 0; i < steps.length; i++) {
    const cue = steps[i].cue;
    const cueContext = steps[i].context;
    if (!ntKnownCue(cue.type))
      return {
        ok: false,
        error: '알 수 없는 @명령입니다: ' + cue.type,
        cue: cue,
      };
    if (!ntCueEnabled(cue.type)) continue;
    if (cueContext !== context) {
      const followingCheck = ntValidateCues(cueContext.followingCues, context);
      if (!followingCheck.ok) return followingCheck;
    }
    const adapter = KIBScene.adapters[cue.type];
    if (typeof KIBScene.validate === 'function' || (adapter && typeof adapter.validate === 'function')) {
      const result = typeof KIBScene.validate === 'function'
        ? KIBScene.validate(cue, cueContext) : adapter.validate(cue.args, cueContext);
      if (result && result.ok === false) {
        if (
          cue.expressionShorthand &&
          cue.type === 'vd' &&
          ntHasPlugin('avatar') &&
          ntCueEnabled('avatar')
        ) {
          const avatarAdapter = KIBScene.adapters.avatar;
          const avatarResult = typeof KIBScene.validate === 'function'
            ? KIBScene.validate({ type: 'avatar', args: cue.args, raw: cue.raw }, cueContext)
            : avatarAdapter && typeof avatarAdapter.validate === 'function'
              ? avatarAdapter.validate(cue.args, cueContext) : null;
          if (
            avatarResult &&
            avatarResult.ok &&
            avatarResult.targets &&
            (avatarResult.targets.avatar || avatarResult.targets.token)
          ) {
            cue.type = 'avatar';
            continue;
          }
        }
        return { ok: false, error: result.error, cue: cue };
      }
    } else if (typeof KIBScene.handlers[cue.type] !== 'function') {
      return {
        ok: false,
        error:
          ntCueLabel(cue.type) +
          ' 기능을 사용할 수 없습니다. 설치 여부를 확인하세요.',
        cue: cue,
      };
    }
  }
  return { ok: true };
}

function ntCancelOnError(result, source, archive) {
  ntBroadcast('narrator:cancel', {});
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
    '나레이터',
    '/w GM <b>나레이터를 취소했습니다.</b><br>' +
      '오류: ' +
      ntEscape(state.last_narration_error.error) +
      (state.last_narration_error.cue
        ? '<br>명령: <code>' +
          ntEscape(state.last_narration_error.cue) +
          '</code>'
        : '') +
      '<br>취소된 줄: ' +
      cancelled +
      '개',
    null,
    archive ? undefined : { noarchive: true },
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
      vd: '비주얼 노벨',
      avatar: '캐릭터 이미지',
      type: '스크립트',
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
    '나레이터',
    '/w GM <b>' +
      ntEscape(title) +
      '</b><br>오류: ' +
      ntEscape(detail) +
      '',
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
    '스크립트',
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
  else Object.keys(KIBScene.adapters || {}).forEach(function (name) {
    names = names.concat(Object.keys(KIBScene.adapters[name].aliases || {}));
  });
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
