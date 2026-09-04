/*
 * Scene Suite 04 - Image Switcher 확장 버전
 * 확장 및 통합: @EOOOOORK
 * 원본: 양천일염 (kibkibe) Image Switcher
 * 원본 코드: image_switcher.js
 * 원본 라이선스: CC BY-NC (저작자표시-비영리)
 * https://github.com/kibkibe/roll20-api-scripts/tree/master/image_switcher
 */

var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};
var is_compat_setting = {
  enabled: true,
};

// ===== 사용자 설정 =====
const is_setting = {
  // 덱과 토큰 이름 앞글자
  keyword: 'image',
  // 이미지 매크로 이름
  macro_name: '이미지변경',
};

// ===== Roll20 이벤트 =====
on('ready', function () {
  if (is_compat_setting.enabled) {
    var imageCue = function (args) {
      var validation = validateImageCue(args);
      if (!validation.ok) return validation;
      sendChat(
        'SceneDirector',
        '!#' + args[0] + ' ' + args.slice(1).join('|'),
        null,
        { noarchive: true },
      );
      return { ok: true };
    };
    var adapter = {
      meta: { code: '04_image_switcher_compatible.js', title: '이미지 전환' },
      aliases: { 이미지: '', image: '' },
      cue: imageCue,
      validate: validateImageCue,
      help: ['<code>@이미지 덱과 토큰 이름|카드 이름</code>'],
    };
    if (typeof KIBScene.register === 'function')
      KIBScene.register('image', adapter);
    else {
      KIBScene.adapters.image = adapter;
      KIBScene.handlers.image = adapter.cue;
    }
  }
  on('add:card', isRefreshForCard);
});
on('change:deck:name', isRefreshForDeck);
on('destroy:deck', isRefreshForDeck);
on('change:card', isRefreshForCard);
on('destroy:card', isRefreshForCard);

on('chat:message', function (msg) {
  if (msg.type == 'api') {
    try {
      if (
        /^!이미지(?:\s+(?:help|도움말))?$/i.test(String(msg.content || '')) &&
        playerIsGM(msg.playerid)
      ) {
        sendChat(
          '이미지 전환',
          '/w gm <b>이미지 전환</b><br><code>!#image이름 카드 이름</code> 카드 이미지로 변경<br><code>!#image이름 이미지 주소</code> 주소 이미지로 변경<br><code>!... 대사 @이미지 image이름|카드 이름</code> 나레이터 스크립트와 동시에 변경<br>Roll20 보드에 이미지 토큰을 놓고 토큰 이름을 덱 이름과 같게 지정해 주세요. 이름 앞에는 <code>image</code>를 붙입니다. 토큰 이름은 업로드 파일명이 아닙니다.',
          null,
          { noarchive: true },
        );
        return;
      }
      if (
        (playerIsGM(msg.playerid) || msg.playerid == 'API') &&
        msg.content.startsWith('!#' + is_setting.keyword)
      ) {
        const deck_name = msg.content.split(' ')[0].replace('!#', '');
        const new_bg = msg.content.replace('!#' + deck_name + ' ', '').trim();
        let bg_background = findObjs({ _type: 'graphic', name: deck_name });
        let bg_deck = findObjs({ _type: 'deck', name: deck_name });
        if (bg_background.length == 0) {
          isProblem(
            '현재 페이지에 <b>' + isEscape(deck_name) + '</b> 토큰이 없습니다.',
            'Roll20 보드에 이미지 토큰을 놓고 토큰 이름을 덱 이름과 같게 지정해 주세요.',
          );
          return;
        } else if (bg_deck.length == 0) {
          isProblem(
            '<b>' + isEscape(deck_name) + '</b> 덱이 없습니다.',
            '이미지 토큰 이름과 같은 이름의 덱을 만들어 주세요.',
          );
          return;
        } else if (bg_deck.length > 1) {
          isProblem(
            '<b>' + isEscape(deck_name) + '</b> 덱이 여러 개입니다.',
            '같은 이름의 덱을 하나만 남겨 주세요.',
          );
          return;
        } else if (!new_bg || new_bg == msg.content) {
          isProblem(
            '변경할 카드 이름 또는 이미지 주소가 없습니다.',
            '예: <code>!#토큰이름 카드이름</code>',
          );
          return;
        }
        for (let i = 0; i < bg_background.length; i++) {
          const token = bg_background[i];
          const current_url = token.get('imgsrc');
          let is_url_input = msg.content.indexOf('https://') > -1;
          if (is_url_input) {
            token.set(
              'imgsrc',
              new_bg
                .replace('med', 'thumb')
                .replace('max', 'thumb')
                .replace(' ', ''),
            );
            if (current_url == token.get('imgsrc')) {
              isProblem(
                '이미지가 변경되지 않았습니다.',
                'Roll20 라이브러리의 HTTPS 이미지 주소인지 확인해 주세요.',
              );
            }
          } else {
            let bg_cards = findObjs({
              _type: 'card',
              _deckid: bg_deck[0].get('_id'),
              name: new_bg,
            });
            if (bg_cards.length == 0) {
              isProblem(
                '<b>' +
                  isEscape(new_bg) +
                  '</b> 카드가 <b>' +
                  isEscape(deck_name) +
                  '</b> 덱에 없습니다.',
                '카드 이름을 정확히 확인해 주세요.',
              );
              return;
            } else {
              var avatar = String(bg_cards[0].get('avatar') || '');
              if (!avatar) {
                isProblem(
                  '<b>' +
                    isEscape(new_bg) +
                    '</b> 카드 앞면에 이미지가 없습니다.',
                  '카드 앞면에 Roll20 라이브러리 이미지를 넣어 주세요.',
                );
                return;
              }
              token.set(
                'imgsrc',
                avatar.replace('med', 'thumb').replace('max', 'thumb'),
              );
            }
          }
        }
      }
    } catch (err) {
      isProblem(
        '이미지 변경 명령을 처리하지 못했습니다.',
        '<code>!이미지 도움말</code>에서 사용법을 확인해 주세요.',
        err,
      );
    }
  }
});

function validateImageCue(args) {
  var deckName = String(args[0] || '').trim();
  var imageName = args.slice(1).join('|').trim();
  if (!deckName || !imageName)
    return {
      ok: false,
      error: '덱과 토큰 이름, 카드 이름을 입력해 주세요.',
    };
  if (deckName.indexOf(' ') > -1)
    return {
      ok: false,
      error: '덱과 토큰 이름에는 띄어쓰기를 사용할 수 없습니다: ' + deckName,
    };
  if (deckName.indexOf(is_setting.keyword) !== 0)
    return {
      ok: false,
      error:
        '덱과 토큰 이름 앞에 ' +
        is_setting.keyword +
        '를 붙여 주세요: ' +
        deckName,
    };
  if (!(findObjs({ _type: 'graphic', name: deckName }) || []).length)
    return {
      ok: false,
      error: '이름이 ' + deckName + '인 이미지 토큰이 없습니다.',
    };
  var decks = findObjs({ _type: 'deck', name: deckName }) || [];
  if (!decks.length)
    return {
      ok: false,
      error: '이름이 ' + deckName + '인 이미지 덱이 없습니다.',
    };
  if (decks.length > 1)
    return {
      ok: false,
      error:
        '이름이 ' + deckName + '인 덱이 여러 개입니다. 하나만 남겨 주세요.',
    };
  if (/^https:\/\//i.test(imageName)) return { ok: true };
  if (
    !(
      findObjs({
        _type: 'card',
        _deckid: decks[0].get('_id'),
        name: imageName,
      }) || []
    ).length
  ) {
    return {
      ok: false,
      error: deckName + ' 덱에 이름이 ' + imageName + '인 카드가 없습니다.',
    };
  }
  return { ok: true };
}

// ===== 매크로 갱신 =====
const updateImageMacro = function () {
  let background_deck = filterObjs(function (obj) {
    return (
      obj.get('_type') == 'deck' &&
      obj.get('name').startsWith(is_setting.keyword)
    );
  });
  if (background_deck.length > 0) {
    let action_str;
    let getCards = function (deck) {
      return findObjs({ _type: 'card', _deckid: deck.get('id') });
    };
    let getCardStr = function (deck, is_sole, cards) {
      let card_str = '';
      for (let j = 0; j < cards.length; j++) {
        const card = cards[j];
        card_str +=
          (is_sole ? '|' : '\&\#124;') +
          card.get('name') +
          (is_sole ? ',!#' : '\&\#44;!#') +
          deck.get('name') +
          ' ' +
          card.get('name');
      }
      return card_str;
    };
    if (background_deck.length > 1) {
      action_str = '?{변경할 토큰 이름을 선택하세요';
      for (let i = 0; i < background_deck.length; i++) {
        const deck = background_deck[i];
        const cards = getCards(deck);
        action_str += '|' + deck.get('name') + ',';
        if (cards.length == 1)
          action_str += '!#' + deck.get('name') + ' ' + cards[0].get('name');
        else
          action_str +=
            '?{변경할 이미지를 선택하세요' +
            getCardStr(deck, false, cards) +
            '\&\#125;';
      }
    } else {
      const cards = getCards(background_deck[0]);
      action_str =
        cards.length == 1
          ? '!#' + background_deck[0].get('name') + ' ' + cards[0].get('name')
          : '?{변경할 이미지를 선택하세요' +
            getCardStr(background_deck[0], true, cards);
    }
    if (background_deck.length > 1 || getCards(background_deck[0]).length != 1)
      action_str += '}';
    let players = findObjs({ type: 'player' });
    if (!players.length) return;
    let gm_list = '';
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      if (playerIsGM(player.id)) {
        gm_list += player.id + ',';
      }
    }
    gm_list = gm_list.substring(0, gm_list.length - 1);
    let main_macro = findObjs({ _type: 'macro', name: is_setting.macro_name });
    let main_options = {
      name: is_setting.macro_name,
      action: action_str,
      visibleto: gm_list,
    };
    if (main_macro.length > 0) {
      main_macro = main_macro[0];
      if (
        main_macro.get('name') != main_options.name ||
        main_macro.get('action') != main_options.action ||
        main_macro.get('visibleto') != main_options.visibleto
      )
        main_macro.set(main_options);
    } else {
      main_options.playerid = players[0].get('id');
      main_macro = createObj('macro', main_options);
    }
  }
};

function isUpdateMacroSafe(obj) {
  try {
    updateImageMacro(obj);
  } catch (err) {
    isProblem(
      '이미지 변경 매크로를 갱신하지 못했습니다.',
      '<code>image</code>로 시작하는 덱을 확인해 주세요.',
      err,
    );
  }
}

function isDeckName(name) {
  return String(name || '').indexOf(is_setting.keyword) === 0;
}

function isRefreshForCard(obj, prev) {
  var ids = [obj && obj.get('_deckid'), prev && prev._deckid].filter(Boolean);
  if (
    ids.some(function (id) {
      var deck = getObj('deck', id);
      return deck && isDeckName(deck.get('name'));
    })
  )
    isUpdateMacroSafe(obj);
}

function isRefreshForDeck(obj, prev) {
  if (!isDeckName(obj && obj.get('name')) && !isDeckName(prev && prev.name)) return;
  setTimeout(function () {
    isUpdateMacroSafe();
  }, 100);
}

function isProblem(problem, fix, err) {
  var html = '<b>' + problem + '</b>' + (fix ? '<br>' + fix : '');
  if (err)
    html +=
      '<br><span style="font-size:11px;color:#687386">오류 내용: ' +
      isEscape(err && err.message ? err.message : err) +
      '</span>';
  sendChat('이미지 전환', '/w gm ' + html, null, { noarchive: true });
}

function isEscape(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
