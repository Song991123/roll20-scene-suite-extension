/*
 * Scene Suite 09 - Avatar Expression Director 1.0.0
 * 제작 및 통합: @EOOOOORK
 */

var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};

var avatar_setting = {
  enabled: true,
  deck_name: 'avatars',
  management_handout_name: '[GM] 아바타 관리',
  expression_handout_prefix: '🎭 아바타｜',
  update_character_avatar: true,
  update_map_tokens: false,
  update_visual_dialogue: true,
};
var avatar_refresh_timer = null;

function avInitState() {
  state.KIBSceneAvatar = state.KIBSceneAvatar || {};
  var data = state.KIBSceneAvatar;
  if (
    !data.defaults ||
    typeof data.defaults != 'object' ||
    Array.isArray(data.defaults)
  ) {
    data.defaults = {
      avatar: avatar_setting.update_character_avatar,
      token: avatar_setting.update_map_tokens,
      vd: avatar_setting.update_visual_dialogue,
    };
  }
  ['avatar', 'token', 'vd'].forEach(function (key) {
    data.defaults[key] = data.defaults[key] === true;
  });
  if (
    !data.characterTargets ||
    typeof data.characterTargets != 'object' ||
    Array.isArray(data.characterTargets)
  )
    data.characterTargets = {};
  if (!Array.isArray(data.excludedCharacters)) data.excludedCharacters = [];
  if (
    !data.selectedCards ||
    typeof data.selectedCards != 'object' ||
    Array.isArray(data.selectedCards)
  )
    data.selectedCards = {};
  if (
    !data.expressionHandouts ||
    typeof data.expressionHandouts != 'object' ||
    Array.isArray(data.expressionHandouts)
  )
    data.expressionHandouts = {};
  if (typeof data.managementHandoutId != 'string')
    data.managementHandoutId = '';
  return data;
}

function avDeck() {
  return (
    (findObjs({ _type: 'deck', name: avatar_setting.deck_name }) || [])[0] ||
    null
  );
}

function avCharacters() {
  return (findObjs({ _type: 'character' }) || []).slice().sort(function (a, b) {
    return String(a.get('name') || '').localeCompare(
      String(b.get('name') || ''),
    );
  });
}

function avCharacter(reference) {
  var value = String(reference || '').trim();
  return (
    getObj('character', value) ||
    (findObjs({ _type: 'character', name: value }) || [])[0] ||
    null
  );
}

function avCards(character) {
  var deck = avDeck();
  if (!deck || !character) return [];
  var base = String(character.get('name') || '').trim();
  return (findObjs({ _type: 'card', _deckid: deck.id }) || [])
    .filter(function (card) {
      var name = String(card.get('name') || '');
      return (
        !!card.get('avatar') && (name == base || name.indexOf(base + '-') === 0)
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

function avCardBelongs(card, character) {
  return (
    !!card &&
    avCards(character).some(function (item) {
      return item.id == card.id;
    })
  );
}

function avExpressionName(card, character) {
  var base = String(character.get('name') || '');
  var name = String(card.get('name') || '');
  return name == base ? '기본' : name.substring(base.length + 1) || '기본';
}

function avExpressionCard(character, expression, cardId) {
  var direct = cardId && getObj('card', cardId);
  if (direct && avCardBelongs(direct, character)) return direct;
  var value = String(expression || '').trim();
  var name =
    !value || value == '기본' || value.toLowerCase() == 'default'
      ? String(character.get('name') || '')
      : String(character.get('name') || '') + '-' + value;
  return (
    avCards(character).filter(function (card) {
      return card.get('name') == name;
    })[0] || null
  );
}

function avSelectedCard(character) {
  var data = avInitState();
  var selected = getObj('card', data.selectedCards[character.id]);
  if (selected && avCardBelongs(selected, character)) return selected;
  var cards = avCards(character);
  return cards[0] || null;
}

function avIsExcluded(character) {
  return (
    !!character && avInitState().excludedCharacters.indexOf(character.id) > -1
  );
}

function avTargets(character) {
  var data = avInitState();
  var saved = character && data.characterTargets[character.id];
  var result = {
    avatar: saved ? saved.avatar === true : data.defaults.avatar === true,
    token: saved ? saved.token === true : data.defaults.token === true,
    vd: saved ? saved.vd === true : data.defaults.vd === true,
  };
  if (avIsExcluded(character)) {
    result.avatar = false;
    result.token = false;
  }
  return result;
}

function avCanControl(character, playerId) {
  if (playerId == 'API' || playerIsGM(playerId)) return true;
  var controlled = String(character.get('controlledby') || '')
    .split(',')
    .map(function (id) {
      return id.trim();
    });
  return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
}

function avContextCharacter(context) {
  if (!context || context.explicitAs !== true) return null;
  var as = String(context.as || '').trim();
  if (as.indexOf('character|') === 0)
    return getObj('character', as.substring('character|'.length));
  return as.indexOf('player|') === 0 ? null : avCharacter(as);
}

function avSpeakerCharacter(msg) {
  return avCharacter(
    String((msg && msg.who) || '')
      .replace(/ \(GM\)$/, '')
      .trim(),
  );
}

function avValidateChange(request) {
  request = request || {};
  var character = avCharacter(request.characterId || request.characterName);
  if (!character)
    return { ok: false, error: '표정을 바꿀 캐릭터 저널을 찾지 못했습니다.' };
  if (!avCanControl(character, request.playerId || 'API'))
    return { ok: false, error: '이 캐릭터의 표정을 변경할 권한이 없습니다.' };
  var targets = request.targets || avTargets(character);
  var card = null;
  if (targets.avatar || targets.token) {
    var decks =
      findObjs({ _type: 'deck', name: avatar_setting.deck_name }) || [];
    if (!decks.length)
      return {
        ok: false,
        error: avatar_setting.deck_name + ' 아바타 덱이 없습니다.',
      };
    if (decks.length > 1)
      return {
        ok: false,
        error:
          avatar_setting.deck_name +
          ' 아바타 덱이 여러 개입니다. 하나만 남겨 주세요.',
      };
    card = avExpressionCard(character, request.expression, request.cardId);
    if (!card)
      return {
        ok: false,
        error:
          '표정 카드를 찾지 못했습니다. ' +
          avatar_setting.deck_name +
          ' 덱에 <b>' +
          avEscape(
            character.get('name') +
              (request.expression && request.expression != '기본'
                ? '-' + request.expression
                : ''),
          ) +
          '</b> 카드를 만들어 주세요.',
      };
  }
  var vd = KIBScene.adapters && KIBScene.adapters.vd;
  if (targets.vd && vd && typeof vd.validateExpression === 'function') {
    var vdResult = vd.validateExpression({
      characterId: character.id,
      characterName: character.get('name'),
      expression: request.expression,
      targets: targets,
      source: 'avatar',
    });
    if (vdResult && vdResult.ok === false) return vdResult;
  }
  return { ok: true, character: character, card: card, targets: targets };
}

function avApplyChange(request) {
  var validation = avValidateChange(request);
  if (!validation.ok) return validation;
  var character = validation.character;
  var card = validation.card;
  var targets = validation.targets;
  var changedTokens = 0;
  if (card) {
    avInitState().selectedCards[character.id] = card.id;
    if (targets.avatar) character.set('avatar', card.get('avatar'));
    if (targets.token)
      changedTokens = avUpdateTokens(character, card.get('avatar'));
  }
  var payload = {
    source: 'avatar',
    characterId: character.id,
    characterName: String(character.get('name') || ''),
    expression: card
      ? avExpressionName(card, character)
      : String(request.expression || '기본'),
    avatarCardId: card ? card.id : '',
    targets: targets,
  };
  if (targets.vd) avBroadcast('expression:changed', payload);
  avScheduleRefresh();
  return {
    ok: true,
    character: character,
    card: card,
    targets: targets,
    changedTokens: changedTokens,
  };
}

function avUpdateTokens(character, image) {
  var campaign = Campaign();
  var pageId = campaign && campaign.get('playerpageid');
  if (!pageId) return 0;
  var tokens = (
    findObjs({ _type: 'graphic', represents: character.id, _pageid: pageId }) ||
    []
  ).filter(function (token) {
    return (
      token.get('layer') == 'objects' && token.get('name') != 'vd_standing'
    );
  });
  var imgsrc = avGraphicImage(image);
  tokens.forEach(function (token) {
    token.set('imgsrc', imgsrc);
  });
  return tokens.length;
}

function avBroadcast(eventName, payload) {
  if (typeof KIBScene.broadcast === 'function')
    return KIBScene.broadcast(eventName, payload);
  var result = { ok: true, values: [] };
  Object.keys(KIBScene.adapters || {}).forEach(function (name) {
    var listener =
      KIBScene.adapters[name].events &&
      KIBScene.adapters[name].events[eventName];
    if (typeof listener !== 'function') return;
    try {
      var value = listener(payload || {});
      if (value && value.ok === false) result = value;
    } catch (err) {
      result = {
        ok: false,
        error:
          '연결된 표정 기능을 처리하지 못했습니다: ' +
          String(err && err.message ? err.message : err),
      };
    }
  });
  return result;
}

function avSyncExternal(payload) {
  payload = payload || {};
  if (payload.source == 'avatar') return { ok: true, skipped: true };
  var character = avCharacter(payload.characterId || payload.characterName);
  if (!character) return { ok: true, skipped: true };
  var targets = avTargets(character);
  if (!targets.avatar && !targets.token) return { ok: true, skipped: true };
  var card = avExpressionCard(character, payload.expression);
  if (!card) {
    avWhisperGm(
      '<b>' +
        avEscape(character.get('name')) +
        '</b>의 <b>' +
        avEscape(payload.expression || '기본') +
        '</b> 아바타 카드가 없어 시트·토큰은 바꾸지 않았습니다.',
    );
    return { ok: true, skipped: true };
  }
  avInitState().selectedCards[character.id] = card.id;
  if (targets.avatar) character.set('avatar', card.get('avatar'));
  if (targets.token) avUpdateTokens(character, card.get('avatar'));
  avScheduleRefresh();
  return { ok: true };
}

function avHandleApi(msg) {
  if (
    !msg ||
    msg.kibAvatarExpressionHandled ||
    msg.type != 'api' ||
    String(msg.content || '').indexOf('!@') !== 0
  )
    return { ok: true, handled: false };
  var body = String(msg.content || '')
    .replace(/^!@/, '')
    .replace(state.api_tag || '', '')
    .trim();
  if (
    KIBScene.adapters &&
    KIBScene.adapters.vd &&
    /^(?:장면없음|숨김|hide|퇴장|exit|리셋|reset|강제진행|force-progress)(?::|\s|$)|^(?:배경|background)\s+/i.test(
      body,
    )
  )
    return { ok: true, handled: false };
  msg.kibAvatarExpressionHandled = true;
  var character = avSpeakerCharacter(msg);
  var expression = body;
  var divider = body.lastIndexOf(':');
  if (divider > -1 && (msg.playerid == 'API' || playerIsGM(msg.playerid))) {
    character = avCharacter(body.substring(0, divider).trim());
    expression = body.substring(divider + 1).trim();
  }
  var result = avApplyChange({
    characterId: character && character.id,
    expression: expression,
    playerId: msg.playerid,
    source: 'api',
  });
  result.handled = true;
  return result;
}

function avHandleInline(msg) {
  if (
    !msg ||
    msg.kibAvatarExpressionHandled ||
    msg.playerid == 'API' ||
    (msg.type != 'general' && msg.type != 'emote')
  )
    return { ok: true, handled: false };
  var content = String(msg.content || '');
  var match = content.match(/(?:^|\s)@([^\s@|{}]+)\s*$/);
  if (!match) return { ok: true, handled: false };
  msg.kibAvatarExpressionHandled = true;
  msg.content = content.substring(0, match.index).replace(/\s+$/, '');
  var character = avSpeakerCharacter(msg);
  var result = avApplyChange({
    characterId: character && character.id,
    expression: match[1],
    playerId: msg.playerid,
    source: 'inline',
  });
  if (!result.ok) avWhisperPlayer(msg, result.error);
  result.handled = true;
  return result;
}

function avHandleHiddenChat(msg) {
  if (
    !msg ||
    msg.kibAvatarExpressionHandled ||
    msg.type != 'api' ||
    String(msg.content || '').indexOf('!대사 ') !== 0
  )
    return { ok: true, handled: false };
  msg.kibAvatarExpressionHandled = true;
  var character = avSpeakerCharacter(msg);
  if (!character) {
    avWhisperPlayer(
      msg,
      '<code>!대사</code>는 캐릭터 Speaking As 상태에서 사용하세요.',
    );
    return {
      ok: false,
      handled: true,
      error: 'Speaking As 캐릭터가 없습니다.',
    };
  }
  if (!avCanControl(character, msg.playerid)) {
    avWhisperPlayer(msg, '이 캐릭터로 대사를 보낼 권한이 없습니다.');
    return { ok: false, handled: true, error: '캐릭터 제어 권한이 없습니다.' };
  }
  var content = String(msg.content).substring('!대사 '.length);
  var forwarded = {
    type: 'general',
    playerid: msg.playerid,
    who: character.get('name'),
    content: content,
  };
  var inline = avHandleInline(forwarded);
  if (inline.handled && inline.ok === false) return inline;
  if (forwarded.content.trim())
    sendChat(
      'character|' + character.id,
      forwarded.content + (state.api_tag || ''),
    );
  return { ok: true, handled: true };
}

function avValidateCue(args, context) {
  var character = avContextCharacter(context);
  if (!character)
    return {
      ok: false,
      error:
        '짧은 표정 큐는 !... /as "캐릭터명" 대사 @표정 형식으로 사용하세요.',
    };
  return avValidateChange({
    characterId: character.id,
    expression: (args || []).join('|').trim(),
    playerId: 'API',
    source: 'narrator',
  });
}

function avRunCue(args, context) {
  var character = avContextCharacter(context);
  return avApplyChange({
    characterId: character && character.id,
    expression: (args || []).join('|').trim(),
    playerId: 'API',
    source: 'narrator',
  });
}

function avHandleExpressionButton(msg) {
  var parts = String(msg.content || '').split('|');
  var character = avCharacter(parts[1]);
  var card = getObj('card', String(parts[2] || '').trim());
  if (!character || !avCardBelongs(card, character))
    return avWhisperPlayer(
      msg,
      '아바타 카드 또는 캐릭터를 찾지 못했습니다. 핸드아웃을 갱신해 주세요.',
    );
  var result = avApplyChange({
    characterId: character.id,
    cardId: card.id,
    expression: avExpressionName(card, character),
    playerId: msg.playerid,
    source: 'handout',
  });
  if (!result.ok) return avWhisperPlayer(msg, result.error);
  avWhisperPlayer(
    msg,
    '<b>' +
      avEscape(character.get('name')) +
      '</b>의 표정을 <b>' +
      avEscape(avExpressionName(card, character)) +
      '</b>(으)로 변경했습니다.',
  );
}

function avHandleTargetCommand(msg) {
  if (!playerIsGM(msg.playerid)) return;
  var parts = String(msg.content || '')
    .split('|')
    .map(function (part) {
      return part.trim();
    });
  var reference = parts[1];
  var key = {
    시트: 'avatar',
    아바타: 'avatar',
    avatar: 'avatar',
    토큰: 'token',
    token: 'token',
    비주얼: 'vd',
    vd: 'vd',
  }[String(parts[2] || '').toLowerCase()];
  var value = avBoolean(parts[3]);
  var data = avInitState();
  if (!reference || (!key && parts[2] != '초기화'))
    return avWhisperGm(
      '사용법: <code>!아바타 대상|캐릭터명 또는 기본|시트·토큰·비주얼|켜기·끄기</code>',
    );
  if (reference == '기본') {
    if (!key || value === null)
      return avWhisperGm(
        '기본 대상은 시트·토큰·비주얼과 켜기·끄기를 지정하세요.',
      );
    data.defaults[key] = value;
  } else {
    var character = avCharacter(reference);
    if (!character)
      return avWhisperGm('캐릭터를 찾지 못했습니다: ' + avEscape(reference));
    if (parts[2] == '초기화') delete data.characterTargets[character.id];
    else {
      if (value === null)
        return avWhisperGm('대상 설정은 켜기 또는 끄기를 입력하세요.');
      data.characterTargets[character.id] =
        data.characterTargets[character.id] || avTargets(character);
      data.characterTargets[character.id][key] = value;
    }
  }
  avScheduleRefresh();
  avWhisperGm('아바타 변경 대상을 저장했습니다.');
}

function avHandleExcludeCommand(msg) {
  if (!playerIsGM(msg.playerid)) return;
  var parts = String(msg.content || '')
    .split('|')
    .map(function (part) {
      return part.trim();
    });
  var action = parts[1];
  var character = avCharacter(parts.slice(2).join('|'));
  if (!character || ['추가', '해제', '삭제'].indexOf(action) < 0)
    return avWhisperGm(
      '사용법: <code>!아바타 제외|추가|캐릭터명</code> / <code>!아바타 제외|해제|캐릭터명</code>',
    );
  var excluded = avInitState().excludedCharacters;
  var index = excluded.indexOf(character.id);
  if (action == '추가' && index < 0) excluded.push(character.id);
  if (action != '추가' && index > -1) excluded.splice(index, 1);
  avScheduleRefresh();
  avWhisperGm(
    '<b>' +
      avEscape(character.get('name')) +
      '</b>을(를) 아바타·토큰 자동 변경에서 ' +
      (action == '추가' ? '제외했습니다.' : '다시 사용합니다.'),
  );
}

function avScheduleRefresh() {
  if (avatar_refresh_timer) clearTimeout(avatar_refresh_timer);
  avatar_refresh_timer = setTimeout(function () {
    avatar_refresh_timer = null;
    avRefreshSafe();
  }, 100);
}

function avRefreshSafe() {
  try {
    var manager = avRefreshHandouts();
    if (typeof KIBScene.refreshHandout === 'function')
      KIBScene.refreshHandout();
    return manager;
  } catch (err) {
    avWhisperGm(
      '<b>아바타 관리 화면을 갱신하지 못했습니다.</b><br><code>avatars</code> 덱과 캐릭터 이름을 확인해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
        avEscape(err && err.message ? err.message : err) +
        '</span>',
    );
    return null;
  }
}

function avRefreshHandouts() {
  if (typeof createObj !== 'function') return;
  var data = avInitState();
  var active = {};
  avCharacters().forEach(function (character) {
    var cards = avCards(character);
    if (!cards.length) return;
    active[character.id] = true;
    if (avIsExcluded(character))
      return avArchiveExpressionHandout(character.id);
    var name = avatar_setting.expression_handout_prefix + character.get('name');
    var handout =
      getObj('handout', data.expressionHandouts[character.id]) ||
      (findObjs({ _type: 'handout', name: name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: name,
        inplayerjournals: '',
        controlledby: '',
        archived: false,
      });
    data.expressionHandouts[character.id] = handout.id;
    var selected = avSelectedCard(character);
    var cells = cards
      .map(function (card) {
        var expression = avExpressionName(card, character);
        var label =
          selected && selected.id == card.id ? '✓ ' + expression : expression;
        return (
          '<div style="display:inline-block;width:150px;vertical-align:top;text-align:center;margin:4px;padding:6px;border:1px solid #bbb;border-radius:4px">' +
          '<img src="' +
          avEscape(card.get('avatar')) +
          '" style="max-width:138px;max-height:138px"><br>' +
          avButton(
            label,
            '!아바타 표정|' + character.id + '|' + card.id,
            '#4d617a',
          ) +
          '</div>'
        );
      })
      .join('');
    handout.set({
      name: name,
      avatar: selected ? selected.get('avatar') : '',
      inplayerjournals: String(character.get('controlledby') || ''),
      controlledby: '',
      archived: false,
      notes:
        '<div style="font-family:Arial,sans-serif"><h3>' +
        avEscape(character.get('name')) +
        ' 아바타 표정</h3><p>버튼은 현재 설정에 따라 시트 아바타·맵 토큰·Visual Dialogue를 함께 바꿉니다.</p>' +
        cells +
        '</div>',
    });
  });
  Object.keys(data.expressionHandouts).forEach(function (characterId) {
    if (!active[characterId]) avArchiveExpressionHandout(characterId);
  });
  return avRefreshManagementHandout();
}

function avArchiveExpressionHandout(characterId) {
  var handout = getObj(
    'handout',
    avInitState().expressionHandouts[characterId],
  );
  if (handout)
    handout.set({ archived: true, inplayerjournals: '', controlledby: '' });
}

function avRefreshManagementHandout() {
  var data = avInitState();
  var handout =
    getObj('handout', data.managementHandoutId) ||
    (findObjs({
      _type: 'handout',
      name: avatar_setting.management_handout_name,
    }) || [])[0];
  if (!handout)
    handout = createObj('handout', {
      name: avatar_setting.management_handout_name,
      inplayerjournals: '',
      controlledby: '',
      archived: false,
    });
  if (!handout) return null;
  data.managementHandoutId = handout.id;
  var defaults = avTargetButtons('기본', data.defaults);
  var rows =
    avCharacters()
      .filter(function (character) {
        return avCards(character).length > 0;
      })
      .map(function (character) {
        var excluded = avIsExcluded(character);
        return (
          '<div style="margin:7px 0;padding:8px;border:1px solid #ccd4df;border-radius:5px"><b>' +
          avEscape(character.get('name')) +
          '</b>' +
          '<div style="margin-top:5px">' +
          (excluded
            ? avButton(
                '다시 사용',
                '!아바타 제외|해제|' + character.id,
                '#287a4b',
              )
            : avButton(
                '자동 변경 제외',
                '!아바타 제외|추가|' + character.id,
                '#8b3940',
              )) +
          ' ' +
          avTargetButtons(character.id, avTargets(character)) +
          ' ' +
          avButton(
            '기본값 사용',
            '!아바타 대상|' + character.id + '|초기화',
            '#7654a8',
          ) +
          '</div></div>'
        );
      })
      .join('') || '<p>avatars 덱과 이름이 맞는 캐릭터가 없습니다.</p>';
  handout.set({
    name: avatar_setting.management_handout_name,
    inplayerjournals: '',
    controlledby: '',
    archived: false,
    notes:
      '<div style="font-family:Arial,sans-serif;color:#2d3340"><div style="padding:12px;background:#172235;color:#fff;border-radius:6px"><b style="font-size:18px">🎭 아바타 관리</b><br><span style="font-size:12px">표정 카드가 바꿀 대상을 선택합니다.</span></div>' +
      '<div style="margin-top:10px;padding:9px;background:#fff8e8;border-left:4px solid #d39a26"><b>기본 대상</b><div style="margin-top:5px">' +
      defaults +
      '</div></div>' +
      rows +
      '<p style="font-size:12px;color:#667085">제외한 캐릭터는 아바타·토큰만 바꾸지 않으며, Visual Dialogue 표정은 설치돼 있으면 계속 동작합니다.</p></div>',
  });
  return handout;
}

function avTargetButtons(reference, targets) {
  return (
    avToggleButton('시트', reference, '시트', targets.avatar) +
    ' ' +
    avToggleButton('토큰', reference, '토큰', targets.token) +
    ' ' +
    avToggleButton('비주얼', reference, '비주얼', targets.vd)
  );
}

function avToggleButton(label, reference, key, enabled) {
  return avButton(
    label + ' ' + (enabled ? '✓' : '－'),
    '!아바타 대상|' + reference + '|' + key + '|' + (enabled ? '끄기' : '켜기'),
    enabled ? '#287a4b' : '#53657d',
  );
}

function avButton(label, command, color) {
  return (
    '<a href="' +
    avEscape(command) +
    '" style="display:inline-block;margin:2px 1px;padding:5px 8px;border-radius:4px;background:' +
    color +
    ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' +
    avEscape(label) +
    '</a>'
  );
}

function avBoolean(value) {
  var normalized = String(value || '')
    .trim()
    .toLowerCase();
  if (/^(?:켜기|사용|on|true|1)$/.test(normalized)) return true;
  if (/^(?:끄기|미사용|off|false|0)$/.test(normalized)) return false;
  return null;
}

function avGraphicImage(url) {
  return String(url || '').replace(
    /\/(?:med|max|original)(\.[^/?]+)(\?.*)?$/i,
    '/thumb$1$2',
  );
}

function avEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function avWhisperGm(text) {
  sendChat('Avatar Director', '/w gm ' + text, null, { noarchive: true });
}

function avWhisperPlayer(msg, text) {
  var player = getObj('player', msg && msg.playerid);
  var who = player
    ? player.get('_displayname')
    : String((msg && msg.who) || 'gm').replace(/ \(GM\)$/, '');
  sendChat(
    'Avatar Director',
    '/w "' + String(who || 'gm').replace(/"/g, '') + '" ' + text,
    null,
    { noarchive: true },
  );
}

function avHelp() {
  return (
    '<b>Avatar Director 도움말</b><br>' +
    '<code>!@웃음</code> Speaking As 캐릭터 표정 변경<br>' +
    '<code>!... /as "홍길동" 대사 @웃음</code> Narrator와 동시 변경<br>' +
    '<code>!아바타 관리</code> 대상·제외 설정 핸드아웃 갱신<br>' +
    '<code>!아바타 대상|홍길동|시트·토큰·비주얼|켜기·끄기</code><br>' +
    '<code>!아바타 제외|추가|홍길동</code> 아바타·토큰 자동 변경 제외'
  );
}

on('ready', function () {
  if (!avatar_setting.enabled) return;
  state.api_tag = state.api_tag || '<a href="#vd-permitted-api-chat"></a>';
  avInitState();
  var adapter = {
    meta: { code: '09_avatar_director.js', title: '아바타 표정' },
    aliases: { 아바타: '', avatar: '' },
    cue: avRunCue,
    validate: avValidateCue,
    handleApi: avHandleApi,
    handleInline: avHandleInline,
    handleHiddenChat: avHandleHiddenChat,
    applyExpression: avApplyChange,
    events: { 'expression:changed': avSyncExternal },
    status: function () {
      return {
        deck: avatar_setting.deck_name,
        defaults: avInitState().defaults,
        excluded: avInitState().excludedCharacters.length,
      };
    },
    help: [
      '<code>!@표정명</code> 시트·토큰·비주얼 표정 변경',
      '<code>!아바타 관리</code> 대상과 제외 캐릭터 설정',
    ],
  };
  if (typeof KIBScene.register === 'function')
    KIBScene.register('avatar', adapter);
  else {
    KIBScene.adapters.avatar = adapter;
    KIBScene.handlers.avatar = adapter.cue;
  }
  avScheduleRefresh();
});

on('chat:message', function (msg) {
  if (!avatar_setting.enabled) return;
  try {
    var content = String(msg.content || '');
    if (
      msg.type == 'api' &&
      /^!아바타(?:\s+(?:help|도움말))?$/i.test(content)
    ) {
      if (playerIsGM(msg.playerid)) avWhisperGm(avHelp());
      return;
    }
    if (msg.type == 'api' && content == '!아바타 관리') {
      if (playerIsGM(msg.playerid)) {
        var manager = avRefreshSafe();
        avWhisperGm(
          manager
            ? avManagerOpenHtml(manager)
            : '관리 핸드아웃을 만들지 못했습니다.',
        );
      }
      return;
    }
    if (msg.type == 'api' && content.indexOf('!아바타 대상|') === 0)
      return avHandleTargetCommand(msg);
    if (msg.type == 'api' && content.indexOf('!아바타 제외|') === 0)
      return avHandleExcludeCommand(msg);
    if (msg.type == 'api' && content.indexOf('!아바타 표정|') === 0)
      return avHandleExpressionButton(msg);
    if (msg.type == 'api' && content.indexOf('!대사 ') === 0)
      return avHandleHiddenChat(msg);
    if (msg.type == 'api' && content.indexOf('!@') === 0) {
      var result = avHandleApi(msg);
      if (result && result.ok === false) avWhisperPlayer(msg, result.error);
      return;
    }
    avHandleInline(msg);
  } catch (err) {
    avWhisperGm(
      '<b>아바타 명령을 처리하지 못했습니다.</b><br><code>!아바타 help</code>에서 형식을 확인해 주세요.<br><span style="font-size:11px;color:#687386">상세: ' +
        avEscape(err && err.message ? err.message : err) +
        '</span>',
    );
  }
});

function avManagerOpenHtml(handout) {
  return (
    '<div style="padding:8px;background:#f6f1fb;border-left:4px solid #7654a8;border-radius:5px;color:#2d3340"><b>🎭 아바타 관리</b><br>' +
    '<a href="http://journal.roll20.net/handout/' +
    encodeURIComponent(handout.id) +
    '" style="display:inline-block;margin-top:5px;padding:5px 8px;background:#7654a8;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;font-size:12px">관리 핸드아웃 열기</a></div>'
  );
}

function avRelevantCard(obj) {
  var deck = avDeck();
  return !!deck && !!obj && obj.get('_deckid') == deck.id;
}

on('add:card', function (obj) {
  if (avRelevantCard(obj)) avScheduleRefresh();
});
on('change:card', function (obj) {
  if (avRelevantCard(obj)) avScheduleRefresh();
});
on('destroy:card', function (obj) {
  if (avRelevantCard(obj)) avScheduleRefresh();
});
on('destroy:deck', function (obj) {
  if (obj && obj.get('name') == avatar_setting.deck_name) avScheduleRefresh();
});
on('add:character', avScheduleRefresh);
on('destroy:character', avScheduleRefresh);
on('change:character:name', avScheduleRefresh);
on('change:character:controlledby', avScheduleRefresh);
