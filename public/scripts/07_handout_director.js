/*
 * Scene Suite 07 - Handout Director 1.4.5
 * 제작 및 통합: @EOOOOORK
 */
var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};
(function () {
  'use strict';

  // ===== 사용자 설정 =====
  var SETTING = {
    enabled: true,
    command: '!핸드아웃',
    managerName: '[GM] 핸드아웃 관리',
    macroName: '🖊️핸드아웃',
    defaultMacroTemplate:
      '/desc [✎ ?{누구}에게 ?{핸드아웃}을/를 공개합니다.](#" style="font-weight: normal; text-decoration:none; font-style:normal; color: #535353; background-color:#FFFCDE; text-align: left; display:block; line-height:1.3; padding:9px 25px; margin: -9px -30px -7px; cursor: default; border-bottom: 2px solid #F4C35B;)',
    rootFolderId: '__root__',
    speaker: '핸드아웃',
  };

  // ===== 실행 상태 =====
  var refreshTimer = null;
  var macroRefreshTimer = null;

  on('ready', function () {
    if (!SETTING.enabled) return;
    initState();
    registerAdapter();
    refreshAll();
  });

  on('chat:message', function (msg) {
    if (!SETTING.enabled || msg.type !== 'api') return;
    var content = String(msg.content || '');
    if (content.indexOf(SETTING.command) !== 0 || !playerIsGM(msg.playerid))
      return;
    var source = content.substring(SETTING.command.length).trim();
    try {
      handleCommand(source || '관리');
    } catch (err) {
      gm(
        '<b>핸드아웃 명령 오류</b><br><code>!핸드아웃 help</code>에서 형식을 확인해 주세요.<br><span style="font-size:11px">오류: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  });

  [
    'add:handout',
    'change:handout:name',
    'change:handout:avatar',
    'change:handout:inplayerjournals',
    'change:handout:controlledby',
    'destroy:handout',
    'add:character',
    'change:character:name',
    'change:character:controlledby',
    'destroy:character',
  ].forEach(function (eventName) {
    on(eventName, function (obj) {
      if (
        eventName === 'destroy:handout' &&
        state.KIBSceneHandout &&
        state.KIBSceneHandout.managerId === obj.id
      ) {
        state.KIBSceneHandout.managerId = '';
      }
      if (!state.KIBSceneHandout || obj.id !== state.KIBSceneHandout.managerId)
        scheduleRefresh();
    });
  });
  ['change:campaign:_journalfolder', 'change:campaign:journalfolder'].forEach(
    function (eventName) {
      on(eventName, scheduleRefresh);
    },
  );
  [
    'add:macro',
    'change:macro:name',
    'change:macro:action',
    'destroy:macro',
  ].forEach(function (eventName) {
    on(eventName, function (macro, prev) {
      if (isTargetMacro(macro, prev)) scheduleMacroOnly();
    });
  });

  function initState() {
    var saved = state.KIBSceneHandout || {};
    saved.version = '1.4.5';
    saved.managerId = saved.managerId || '';
    saved.activeFolderId = saved.activeFolderId || SETTING.rootFolderId;
    saved.macroTemplate = saved.macroTemplate || SETTING.defaultMacroTemplate;
    saved.lastMacroTemplateError = saved.lastMacroTemplateError || '';
    delete saved.activeGroup;
    delete saved.groups;
    state.KIBSceneHandout = saved;
  }

  function registerAdapter() {
    var adapter = {
      meta: { code: '07_handout_director.js', title: '핸드아웃' },
      aliases: { 핸드아웃: '', handout: '', 자료: '', journal: '' },
      cue: function (args) {
        return runCue(args, false);
      },
      validate: function (args) {
        return runCue(args, true);
      },
      refresh: refreshAll,
      help: ['<code>!... 대사 @핸드아웃 보내기|자료명|캐릭터명</code>'],
    };
    if (typeof KIBScene.register === 'function')
      KIBScene.register('handout', adapter);
    else {
      KIBScene.adapters.handout = adapter;
      KIBScene.handlers.handout = adapter.cue;
    }
  }

  function handleCommand(source) {
    var parts = source.split('|').map(function (part) {
      return part.trim();
    });
    var action = normalizeAction(parts.shift());
    if (action === 'help' || action === '도움말') return gm(helpHtml());

    if (action === '매크로') return runMacro(parts);
    if (action === '관리' || action === '갱신') {
      refreshAll();
      var manager = getManager();
      return gm(
        manager ? managerOpenHtml(manager) : '관리 핸드아웃 생성 오류',
      );
    }
    if (action === '폴더') {
      var folderId =
        String(parts[0] || '').replace(/^id:/, '') || SETTING.rootFolderId;
      var folders = readJournalFolders();
      if (!findFolder(folders, folderId))
        return gm(
          '저널에서 폴더를 찾지 못했습니다. 새로고침한 뒤 다시 선택해 주세요.',
        );
      state.KIBSceneHandout.activeFolderId = folderId;
      refreshAll();
      return;
    }
    if (action === '크기') {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      if (!cutin || typeof cutin.saveHandoutSize !== 'function')
        return gm('표지 컷인 크기를 저장하려면 08 컷인 코드가 필요합니다.');
      return cutin.saveHandoutSize(parts);
    }

    var result = runCue([action].concat(parts), false, {});
    if (!result.ok) return gm(result.error);
    refreshAll();
  }

  function runCue(args, validateOnly) {
    var parsed = parseCue(args);
    if (!parsed.ok) return parsed;
    if (validateOnly) return { ok: true };
    var handout = parsed.handout;
    var action = parsed.action;

    if (action === '보내기' || action === '권한추가') {
      grantRecipients(handout, parsed.recipient);
      if (action === '보내기')
        sendAnnouncement(handout, parsed.recipient.label);
    } else if (action === '권한삭제') {
      var revoked = revokeRecipients(handout, parsed.recipient);
      if (!revoked.ok) return revoked;
    } else if (action === '전체공개') {
      handout.set('inplayerjournals', 'all');
    } else if (action === '전체해제') {
      handout.set('inplayerjournals', '');
    }
    scheduleRefresh();
    return { ok: true };
  }

  function runMacro(parts) {
    if (!parts[0] || !parts[1])
      return gm(
        '매크로 선택값이 비어 있습니다. <code>🖊️핸드아웃</code>을 새로고침해 주세요.',
      );
    var handoutResult = resolveHandout(parts[1]);
    if (!handoutResult.ok) return gm(handoutResult.error);
    var recipientResult = resolveRecipient(parts[0]);
    if (!recipientResult.ok) return gm(recipientResult.error);
    grantRecipients(handoutResult.value, recipientResult.value);
    sendAnnouncement(handoutResult.value, recipientResult.value.label);
    scheduleRefresh();
  }

  function parseCue(args) {
    var values = (args || [])
      .map(function (value) {
        return String(value || '').trim();
      })
      .filter(Boolean);
    var actionIndex = -1;
    var action = '';
    for (var i = 0; i < values.length; i++) {
      var candidate = normalizeAction(values[i]);
      if (
        ['보내기', '권한추가', '권한삭제', '전체공개', '전체해제'].indexOf(
          candidate,
        ) >= 0
      ) {
        action = candidate;
        actionIndex = i;
        break;
      }
    }
    if (actionIndex >= 0) values.splice(actionIndex, 1);
    if (!action) action = '보내기';
    if (!values[0]) return { ok: false, error: '핸드아웃 이름이 없습니다.' };
    var handoutResult = resolveHandout(values[0]);
    if (!handoutResult.ok) return handoutResult;
    var result = { ok: true, action: action, handout: handoutResult.value };
    if (['보내기', '권한추가', '권한삭제'].indexOf(action) >= 0) {
      if (!values[1]) return { ok: false, error: '대상 캐릭터가 없습니다.' };
      var recipientResult = resolveRecipient(values[1]);
      if (!recipientResult.ok) return recipientResult;
      result.recipient = recipientResult.value;
    }
    var expectedValues = result.recipient ? 2 : 1;
    if (values.length > expectedValues)
      return {
        ok: false,
        error:
          '핸드아웃 명령의 <code>|</code> 구분과 순서를 확인해 주세요. 사용법: <code>!핸드아웃 help</code>',
      };
    return result;
  }

  function resolveHandout(token) {
    token = String(token || '').trim();
    var byId = getObj(
      'handout',
      token.indexOf('id:') === 0 ? token.substring(3) : token,
    );
    if (byId && byId.id !== state.KIBSceneHandout.managerId)
      return { ok: true, value: byId };
    var matches = all('handout').filter(function (item) {
      return (
        item.id !== state.KIBSceneHandout.managerId &&
        String(item.get('name') || '') === token
      );
    });
    if (!matches.length)
      return {
        ok: false,
        error: '핸드아웃을 찾지 못했습니다: ' + escapeHtml(token),
      };
    if (matches.length > 1)
      return {
        ok: false,
        error:
          '같은 이름의 핸드아웃이 여러 개입니다. 관리 핸드아웃의 버튼을 사용하세요: ' +
          escapeHtml(token),
      };
    return { ok: true, value: matches[0] };
  }

  function resolveRecipient(token) {
    token = String(token || '').trim();
    if (isAllPlayerToken(token))
      return {
        ok: true,
        value: { allPlayers: true, players: [], label: '전원' },
      };

    var explicitCharacter =
      token.indexOf('character:') === 0
        ? getObj('character', token.substring(10))
        : token.indexOf('id:') === 0
          ? getObj('character', token.substring(3))
          : null;
    if (explicitCharacter) return recipientFromCharacter(explicitCharacter);
    if (/^(?:캐릭터|as)\s*:/i.test(token)) {
      token = token.replace(/^(?:캐릭터|as)\s*:/i, '').trim();
    }

    var characters = all('character').filter(function (item) {
      return String(item.get('name') || '') === token;
    });
    if (!characters.length)
      return {
        ok: false,
        error: '캐릭터를 찾지 못했습니다: ' + escapeHtml(token),
      };
    if (characters.length > 1)
      return {
        ok: false,
        error: '같은 이름의 캐릭터가 여러 명입니다: ' + escapeHtml(token),
      };
    return recipientFromCharacter(characters[0]);
  }

  function recipientFromCharacter(character) {
    var controlled = csv(character.get('controlledby'));
    var name = String(character.get('name') || '(이름 없는 캐릭터)');
    if (controlled.indexOf('all') >= 0)
      return {
        ok: true,
        value: { allPlayers: true, players: [], label: name },
      };
    var players = controlled
      .map(function (id) {
        return getObj('player', id);
      })
      .filter(Boolean);
    if (!players.length)
      return {
        ok: false,
        error:
          '<b>' + escapeHtml(name) + '</b>을/를 제어하는 플레이어가 없습니다.',
      };
    return { ok: true, value: recipientFromPlayers(players, name) };
  }

  function recipientFromPlayers(players, label) {
    var unique = [];
    players.forEach(function (player) {
      if (
        player &&
        !unique.some(function (item) {
          return item.id === player.id;
        })
      )
        unique.push(player);
    });
    return { allPlayers: false, players: unique, label: label };
  }

  function grantRecipients(handout, recipient) {
    if (recipient.allPlayers) {
      handout.set('inplayerjournals', 'all');
      return;
    }
    recipient.players.forEach(function (player) {
      grantView(handout, player.id);
    });
  }

  function revokeRecipients(handout, recipient) {
    if (recipient.allPlayers) {
      handout.set('inplayerjournals', '');
      return { ok: true };
    }
    if (csv(handout.get('inplayerjournals')).indexOf('all') >= 0) {
      return {
        ok: false,
        error:
          '현재 전체 공개 상태입니다. 먼저 전체 해제를 누른 뒤 필요한 사람에게 다시 권한을 주세요.',
      };
    }
    recipient.players.forEach(function (player) {
      revokeView(handout, player.id);
    });
    return { ok: true };
  }

  function grantView(handout, playerId) {
    var ids = csv(handout.get('inplayerjournals'));
    if (ids.indexOf('all') >= 0 || ids.indexOf(playerId) >= 0) return;
    ids.push(playerId);
    handout.set('inplayerjournals', ids.join(','));
  }

  function revokeView(handout, playerId) {
    var ids = csv(handout.get('inplayerjournals'));
    if (ids.indexOf('all') >= 0)
      return {
        ok: false,
        error:
          '현재 전체 공개 상태입니다. 먼저 전체 해제를 누른 뒤 필요한 사람에게 다시 권한을 주세요.',
      };
    handout.set(
      'inplayerjournals',
      ids
        .filter(function (id) {
          return id !== playerId;
        })
        .join(','),
    );
    return { ok: true };
  }

  function sendAnnouncement(handout, recipientLabel) {
    var template =
      state.KIBSceneHandout.macroTemplate || SETTING.defaultMacroTemplate;
    var url =
      'http://journal.roll20.net/handout/' + encodeURIComponent(handout.id);
    var content = replaceQuery(template, '누구', recipientLabel);
    content = replaceQuery(
      content,
      '핸드아웃',
      String(handout.get('name') || '핸드아웃'),
    );
    content = content.replace(/\{\{(?:링크|handout_url)\}\}/gi, url);
    var decorated = content.match(
      /^(\s*\/desc\s*)(?:<div\s+style="\s*)?\[([\s\S]*?)\]\(\s*#"\s*style="([\s\S]*?)\)\s*(?:<\/div>)?\s*$/i,
    );
    if (decorated) {
      content =
        decorated[1] + openLink(handout, decorated[2], decorated[3].trim());
    } else if (content.indexOf(url) < 0) {
      var desc = content.match(/^(\s*\/desc\s*)([\s\S]*)$/i);
      content = desc
        ? desc[1] +
          openLink(
            handout,
            desc[2],
            'display:block;color:inherit;text-decoration:none',
          )
        : content + ' ' + openLink(handout, '📖 열기');
    }
    if (!/^\s*\/(?:desc|em)\b/i.test(content)) content = '/desc ' + content;
    sendChat('', content);
  }

  function replaceQuery(template, label, value) {
    var pattern = new RegExp('\\?\\{' + label + '(?:\\|[^{}]*)?\\}', 'g');
    return String(template || '').replace(pattern, String(value || ''));
  }

  function refreshAll() {
    if (!SETTING.enabled) return;
    initState();
    refreshManager();
    refreshMacro();
  }

  function refreshManager() {
    var manager = getManager();
    if (!manager) {
      manager = createObj('handout', {
        name: SETTING.managerName,
        inplayerjournals: '',
        controlledby: '',
        archived: false,
      });
      if (!manager) return;
      state.KIBSceneHandout.managerId = manager.id;
    }
    var notes = managerHtml();
    var handled = false;
    function apply(currentNotes) {
      if (handled) return;
      handled = true;
      var values = {
        name: SETTING.managerName,
        inplayerjournals: '',
        controlledby: '',
        archived: false,
      };
      var updates = {};
      Object.keys(values).forEach(function (key) {
        if (manager.get(key) !== values[key]) updates[key] = values[key];
      });
      if (String(currentNotes == null ? '' : currentNotes) !== notes)
        updates.notes = notes;
      if (Object.keys(updates).length) manager.set(updates);
    }
    var direct = manager.get('notes', apply);
    if (typeof direct === 'string') apply(direct);
  }

  function getManager() {
    var saved = state.KIBSceneHandout && state.KIBSceneHandout.managerId;
    var manager = saved ? getObj('handout', saved) : null;
    if (manager) return manager;
    var matches = all('handout').filter(function (item) {
      return String(item.get('name') || '') === SETTING.managerName;
    });
    if (matches[0]) state.KIBSceneHandout.managerId = matches[0].id;
    return matches[0] || null;
  }

  function readJournalFolders() {
    var root = {
      id: SETTING.rootFolderId,
      name: '저널 맨 위',
      path: '저널 맨 위',
      handoutIds: [],
    };
    var folders = [root];
    var raw = '[]';
    try {
      var campaign = typeof Campaign === 'function' ? Campaign() : null;
      if (campaign)
        raw =
          campaign.get('_journalfolder') ||
          campaign.get('journalfolder') ||
          '[]';
    } catch (ignore) {}
    var tree;
    try {
      tree = JSON.parse(raw);
    } catch (ignoreParse) {
      tree = [];
    }
    if (!Array.isArray(tree)) tree = [];

    function walk(items, parent, parentPath, trail) {
      (items || []).forEach(function (item, index) {
        if (typeof item === 'string') {
          parent.handoutIds.push(item);
          return;
        }
        if (!item || typeof item !== 'object' || !Array.isArray(item.i)) return;
        var name = String(item.n || '(이름 없는 폴더)');
        var folder = {
          id: String(item.id || 'path-' + trail.concat(index).join('-')),
          name: name,
          path: parentPath ? parentPath + ' / ' + name : name,
          handoutIds: [],
        };
        folders.push(folder);
        walk(item.i, folder, folder.path, trail.concat(index));
      });
    }
    walk(tree, root, '', []);
    return folders;
  }

  function findFolder(folders, id) {
    for (var i = 0; i < folders.length; i++)
      if (folders[i].id === id) return folders[i];
    return null;
  }

  function managerHtml() {
    var store = state.KIBSceneHandout;
    var allCharacters = all('character');
    var characters = allCharacters
      .filter(function (character) {
        return csv(character.get('controlledby')).length > 0;
      })
      .sort(byName);
    var folders = readJournalFolders();
    var active = findFolder(folders, store.activeFolderId);
    if (!active) {
      active = folders[0];
      store.activeFolderId = active.id;
    }
    var handouts = active.handoutIds
      .map(function (id) {
        return getObj('handout', id);
      })
      .filter(function (item) {
        return item && item.id !== store.managerId;
      })
      .sort(byName);
    var revealQuery = queryCharacters('공개할 대상', characters, true);
    var grantQuery = queryCharacters('보기 권한 부여 대상', characters, true);
    var revokeQuery = queryCharacters('보기 권한 회수 대상', characters, true);
    var folderQuery = queryFolders(folders);
    var rows = handouts.length
      ? handouts
          .map(function (handout) {
            var view = permissionNames(
              handout.get('inplayerjournals'),
              allCharacters,
            );
            var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
            var cutinControls =
              cutin && typeof cutin.handoutControls === 'function'
                ? cutin.handoutControls(handout)
                : '';
            // id: 인수의 링크 제거 방지
            var id = handout.id;
            var playerButtons =
              button(
                '공개',
                SETTING.command + ' 보내기|' + id + '|' + revealQuery,
                '#287a4b',
              ) +
              ' ' +
              button(
                '보기 권한 부여',
                SETTING.command + ' 권한추가|' + id + '|' + grantQuery,
                '#237a8b',
              ) +
              ' ' +
              button(
                '보기 권한 회수',
                SETTING.command + ' 권한삭제|' + id + '|' + revokeQuery,
                '#9b6b20',
              );
            return (
              '<div style="margin-top:10px;background:#fff;color:#111;border:1px solid #111">' +
              '<div style="padding:7px 9px;background:#111;color:#fff;font-size:15px;font-weight:bold">' +
              escapeHtml(handout.get('name') || '(이름 없음)') +
              '</div><div style="padding:9px">' +
              '<div style="font-size:12px;margin-bottom:6px"><b>보기 권한:</b> ' +
              escapeHtml(view) +
              '</div>' +
              cutinControls +
              openLink(handout, '핸드아웃 열기') +
              ' ' +
              playerButtons +
              '</div></div>'
            );
          })
          .join('')
      : '<div style="margin-top:10px;padding:16px;text-align:center;color:#111;background:#f3f3f3;border-left:4px solid #111">이 폴더에 핸드아웃이 없습니다.</div>';

    return (
      '<div style="font-family:Arial,sans-serif;color:#111;background:#fff;line-height:1.45">' +
      '<div style="padding:12px;background:#111;color:#fff;font-size:20px;font-weight:bold">📚 핸드아웃 관리</div>' +
      '<div style="margin-top:10px;background:#fff;border:1px solid #111">' +
      '<div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">관리할 폴더</div>' +
      '<div style="padding:9px"><b>' +
      escapeHtml(active.path) +
      '</b><br>' +
      button('폴더 선택', SETTING.command + ' 폴더|' + folderQuery, '#237a8b') +
      ' ' +
      button('새로고침', SETTING.command + ' 갱신', '#53657d') +
      '</div></div>' +
      rows +
      '<div style="margin-top:8px">' +
      button('명령어 보기', SETTING.command + ' help', '#53657d') +
      '</div></div>'
    );
  }

  function refreshMacro() {
    var allMacros = all('macro');
    var macros = allMacros.filter(function (macro) {
      return (
        normalizeMacroName(macro.get('name')) ===
        normalizeMacroName(SETTING.macroName)
      );
    });
    if (!macros.length) return;
    var main = macros[0];
    if (isGeneratedMacroAction(main.get('action'))) {
      if (!isGeneratedMacroAction(state.KIBSceneHandout.macroTemplate))
        main.set('action', state.KIBSceneHandout.macroTemplate);
      return;
    }
    if (main) {
      var templateError = validateMacroTemplate(main.get('action'));
      if (templateError) {
        if (
          state.KIBSceneHandout.lastMacroTemplateError !==
          String(main.get('action') || '')
        ) {
          state.KIBSceneHandout.lastMacroTemplateError = String(
            main.get('action') || '',
          );
          gm(templateError);
        }
        return;
      }
      state.KIBSceneHandout.macroTemplate = String(main.get('action'));
      state.KIBSceneHandout.lastMacroTemplateError = '';
    }
  }

  function isGeneratedMacroAction(value) {
    value = String(value || '').trim();
    return value.indexOf(SETTING.command + ' 매크로|') === 0;
  }

  function isTargetMacro(macro, prev) {
    var key = normalizeMacroName(SETTING.macroName);
    return (
      (macro && normalizeMacroName(macro.get('name')) === key) ||
      (prev && normalizeMacroName(prev.name) === key)
    );
  }

  function validateMacroTemplate(value) {
    var template = String(value || '');
    if (!/^\s*\/desc\b/i.test(template))
      return '<code>🖊️핸드아웃</code> 매크로는 <code>/desc</code>로 시작해야 합니다.';
    if (
      !/\?\{누구(?:\||\})/.test(template) ||
      !/\?\{핸드아웃(?:\||\})/.test(template)
    ) {
      return '<code>🖊️핸드아웃</code> 디자인에 <code>?{누구}</code>와 <code>?{핸드아웃}</code>이 모두 필요합니다.';
    }
    return '';
  }

  function scheduleRefresh() {
    if (refreshTimer !== null) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      handoutRefreshSafe(false);
    }, 100);
  }

  function scheduleMacroOnly() {
    if (macroRefreshTimer !== null) clearTimeout(macroRefreshTimer);
    macroRefreshTimer = setTimeout(function () {
      macroRefreshTimer = null;
      handoutRefreshSafe(true);
    }, 100);
  }

  function handoutRefreshSafe(macroOnly) {
    try {
      initState();
      if (macroOnly) refreshMacro();
      else refreshManager();
    } catch (err) {
      gm(
        '<b>핸드아웃 관리 갱신 오류</b><br>관리할 폴더와 핸드아웃 이름을 확인해 주세요.<br><span style="font-size:11px">오류: ' +
          escapeHtml(err && err.message ? err.message : err) +
          '</span>',
      );
    }
  }

  function all(type) {
    return typeof findObjs === 'function'
      ? findObjs({ _type: type }) || []
      : [];
  }

  function csv(value) {
    return String(value || '')
      .split(',')
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function permissionNames(value, characters) {
    var ids = csv(value);
    if (!ids.length) return '없음';
    if (ids.indexOf('all') >= 0) return '전원';
    var names = [];
    (characters || all('character')).forEach(function (character) {
      var controllers = csv(character.get('controlledby'));
      if (
        !ids.some(function (id) {
          return controllers.indexOf(id) >= 0;
        })
      )
        return;
      var name = String(character.get('name') || '(이름 없는 캐릭터)');
      if (names.indexOf(name) < 0) names.push(name);
    });
    return names.length ? names.join(', ') : '연결 캐릭터 없음';
  }

  function queryCharacters(label, characters, includeAll) {
    var options = characters.map(function (character) {
      return {
        label: safeQuery(character.get('name') || '(이름 없음)'),
        value: 'character:' + safeQuery(character.id),
      };
    });
    if (includeAll) options.unshift({ label: '전원', value: 'all' });
    if (options.length === 1) return options[0].value;
    return (
      '?{' +
      label +
      options
        .map(function (option) {
          return '|' + option.label + ',' + option.value;
        })
        .join('') +
      '}'
    );
  }

  function queryFolders(folders) {
    if (folders.length === 1) return 'id:' + safeQuery(folders[0].id);
    return (
      '?{관리할 저널 폴더' +
      folders
        .map(function (folder) {
          return '|' + safeQuery(folder.path) + ',id:' + safeQuery(folder.id);
        })
        .join('') +
      '}'
    );
  }

  function safeQuery(value) {
    return String(value || '')
      .replace(/[|,{}?]/g, ' ')
      .trim();
  }

  function normalizeAction(value) {
    value = String(value || '')
      .replace(/\s+/g, '')
      .toLowerCase();
    return (
      {
        열기: '보내기',
        보여주기: '보내기',
        전달: '보내기',
        send: '보내기',
        추가: '권한추가',
        권한부여: '권한추가',
        grant: '권한추가',
        삭제: '권한삭제',
        권한회수: '권한삭제',
        revoke: '권한삭제',
        모두공개: '전체공개',
        all: '전체공개',
        권한초기화: '전체해제',
        모두해제: '전체해제',
        clear: '전체해제',
        폴더선택: '폴더',
        folder: '폴더',
      }[value] || value
    );
  }

  function isAllPlayerToken(value) {
    value = String(value || '')
      .replace(/\s+/g, '')
      .toLowerCase();
    return (
      value === 'all' ||
      value === '모든플레이어' ||
      value === '전체' ||
      value === '전원'
    );
  }

  function openLink(handout, label, style) {
    style =
      style ||
      'display:inline-block;padding:4px 7px;background:#53657d;color:#fff;text-decoration:none;border-radius:0';
    return (
      '<a href="http://journal.roll20.net/handout/' +
      encodeURIComponent(handout.id) +
      '" style="' +
      escapeHtml(style) +
      '">' +
      escapeHtml(label) +
      '</a>'
    );
  }

  function managerOpenHtml(handout) {
    return (
      '<div style="padding:8px;background:#111;color:#fff"><b>📚 핸드아웃 관리</b><br>' +
      openLink(
        handout,
        '관리 핸드아웃 열기',
        'display:inline-block;margin-top:5px;padding:5px 8px;background:#237a8b;color:#fff;text-decoration:none;border-radius:0;font-weight:bold;font-size:12px',
      ) +
      '</div>'
    );
  }

  function helpHtml() {
    return (
      '<b>핸드아웃 명령어</b><br>' +
      '<code>!핸드아웃 관리</code> 관리 화면 열기<br>' +
      '<code>🖊️핸드아웃</code> 공개 알림 디자인<br>' +
      '<code>!핸드아웃 보내기|자료명|캐릭터명 또는 전원</code> 보기 권한과 공개 알림<br>' +
      '<code>!핸드아웃 권한추가|자료명|캐릭터명 또는 전원</code> 보기 권한만 주기<br>' +
      '<code>!핸드아웃 권한삭제|자료명|캐릭터명 또는 전원</code> 보기 권한 회수<br>' +
      '<code>!핸드아웃 크기|자료명|800*600</code> 표지 원본 크기 저장<br>' +
      '<code>!... 대사 @핸드아웃 보내기|자료명|캐릭터명</code> 나레이터 줄과 동시에 공개<br>' +
      '공개 알림 디자인은 <code>🖊️핸드아웃</code> 매크로에서 수정합니다.'
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

  function gm(html) {
    sendChat(SETTING.speaker, '/w GM ' + html, null, { noarchive: true });
  }

  function byName(a, b) {
    return String(a.get('name') || '').localeCompare(
      String(b.get('name') || ''),
    );
  }

  function normalizeMacroName(value) {
    return String(value || '')
      .replace(/\uFE0F/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
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
