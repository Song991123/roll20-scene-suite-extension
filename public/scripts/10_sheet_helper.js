/*
 * Scene Suite 10 - Sheet Helper 0.4.0
 * 제작 및 통합: @EOOOOORK
 * CoC 7판 프로필 기준 시트: 천량성님 커스텀 시트
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  default_profile: 'coc7',
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var VERSION = '0.4.0';
  var profiles = {};
  var cache = {};
  var refreshTimer = null;
  var suppressChanges = {};
  var pendingResults = {};

  // ===== 공통 처리 =====
  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeTemplateText(value) {
    return trim(value)
      .replace(/\r?\n/g, ' ')
      .replace(/\{\{/g, '{ {')
      .replace(/\}\}/g, '} }')
      .replace(/\[\[/g, '[ [')
      .replace(/\]\]/g, '] ]')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function asNumber(value) {
    var number = Number(value);
    return isFinite(number) ? number : null;
  }

  function enabledValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function displayResourceValue(profile, characterId, name, raw) {
    if ((profile.binaryResources || []).indexOf(name) > -1) {
      var enabled = enabledValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var maximumName = profile.resourceMaximums && profile.resourceMaximums[name];
    var current = asNumber(raw);
    var maximum = maximumName ? asNumber(getAttr(characterId, maximumName)) : null;
    return current !== null && maximum !== null && maximum > 0
      ? current + ' / ' + maximum + ' (' + Math.round((current / maximum) * 100) + '%)'
      : trim(raw);
  }

  function resourceChangeContent(profile, characterId, name, label, before, current, extra) {
    var beforeText = displayResourceValue(profile, characterId, name, before);
    var currentText = displayResourceValue(profile, characterId, name, current);
    var beforeNumber = asNumber(before);
    var currentNumber = asNumber(current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = delta === 0 || (profile.binaryResources || []).indexOf(name) > -1
      ? ''
      : ' <span style="color:#777">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var extraText = extra && extra.length
      ? '<br><span style="color:#777">' + extra.map(escapeHtml).join(', ') + '</span>'
      : '';
    return '<b>' + escapeHtml(label) + '</b> <span style="color:#aaa">' + escapeHtml(beforeText) +
      '</span><span style="color:#777"> → </span><b>' + escapeHtml(currentText) + '</b>' + deltaText + extraText;
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (!data.profileId) data.profileId = sheet_helper_setting.default_profile;
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || '')) {
      data.trackingMode =
        own(state, 'hide_tracking') && state.hide_tracking === true ? 'gm' : 'public';
    }
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.activeCharacterId !== 'string') data.activeCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = true;
    data.version = VERSION;
    return data;
  }

  function activeProfile() {
    return profiles[initState().profileId] || profiles[sheet_helper_setting.default_profile];
  }

  function registerProfile(profile) {
    if (!profile || !profile.id || typeof profile.scan !== 'function') {
      throw new Error('시트 프로필 형식이 올바르지 않습니다.');
    }
    profile.name = profile.name || profile.id;
    profile.markers = profile.markers || {};
    profile.minimumScore = Number(profile.minimumScore) || 1;
    profile.tracked = profile.tracked || {};
    profile.changeable = profile.changeable || [];
    profile.binaryResources = profile.binaryResources || [];
    profile.resourceMaximums = profile.resourceMaximums || {};
    profile.actions = profile.actions || {};
    if (typeof profile.result !== 'function') profile.result = function () { return null; };
    if (typeof profile.relevant !== 'function') profile.relevant = function () { return false; };
    profiles[profile.id] = profile;
    return profile;
  }

  function profileScore(profile, characterId) {
    var score = 0;
    var markers = profile.markers || {};
    Object.keys(markers).forEach(function (name) {
      if (getAttr(characterId, name) !== undefined) score += Number(markers[name]) || 0;
    });
    return score;
  }

  function profileMatches(profile, characterId) {
    return profileScore(profile, characterId) >= (profile.minimumScore || 1);
  }

  function collectRows(characterId, section, fields, objects) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = {};
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, values: {}, names: {}, refs: {} };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    Object.keys(rows).sort().forEach(function (rowId) {
      if (ordered.indexOf(rowId) < 0) ordered.push(rowId);
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  function invalidate(characterId) {
    if (characterId) delete cache[characterId];
    else cache = {};
  }

  function scan(characterId, force) {
    var profile = activeProfile();
    if (!profile) return { ok: false, error: '설정된 시트 프로필이 없습니다.' };
    if (!force && cache[characterId] && cache[characterId].profileId === profile.id)
      return cache[characterId].value;
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var value = profile.scan(character, attrObjects(characterId)) || {};
    ['fields', 'resources', 'weapons', 'spells', 'armors', 'warnings'].forEach(function (key) {
      if (!Array.isArray(value[key])) value[key] = [];
    });
    value.ok = true;
    value.profileId = profile.id;
    value.profileName = profile.name;
    value.score = profileScore(profile, characterId);
    value.matched = value.score >= (profile.minimumScore || 1);
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    cache[characterId] = { profileId: profile.id, value: value };
    return value;
  }

  function resolveItem(items, query) {
    var wanted = trim(query).replace(/^key:/i, '');
    if (!wanted) return { ok: false, error: '항목 이름이 비어 있습니다.' };
    var exactKey = items.filter(function (item) {
      return item.key === wanted || item.attr === wanted;
    });
    if (exactKey.length === 1) return { ok: true, item: exactKey[0] };
    var key = normalize(wanted);
    var exact = items.filter(function (item) {
      return [item.label, item.key, item.attr]
        .concat(item.aliases || [])
        .some(function (value) {
          return normalize(value) === key;
        });
    });
    if (exact.length === 1) return { ok: true, item: exact[0] };
    if (exact.length > 1)
      return {
        ok: false,
        error:
          '같은 이름의 항목이 ' +
          exact.length +
          '개입니다: ' +
          exact.map(function (item) { return item.label + ' [' + item.key + ']'; }).join(', '),
      };
    var partial = items.filter(function (item) {
      var values = [item.label, item.key, item.attr].concat(item.aliases || []);
      return values.some(function (value) {
        var normalized = normalize(value);
        return normalized && (normalized.indexOf(key) > -1 || key.indexOf(normalized) > -1);
      });
    });
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 항목이 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', '),
      };
    return { ok: false, error: '시트에서 ' + wanted + ' 항목을 찾지 못했습니다.' };
  }

  function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function (playerId) {
        return playerId === 'all' || !playerIsGM(playerId);
      });
  }

  function profileCharacters() {
    var profile = activeProfile();
    return characterObjects().filter(function (character) {
      return profile && profileMatches(profile, character.id);
    });
  }

  function resolveCharacterName(query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    var characters = profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    var direct = explicitId && getObj('character', explicitId);
    if (direct) {
      return canControl(direct, msg.playerid)
        ? { ok: true, character: direct }
        : { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    if (msg.selected && msg.selected.length) {
      var selected = msg.selected
        .map(function (item) { return getObj('graphic', item._id); })
        .filter(Boolean)
        .map(function (token) { return getObj('character', token.get('represents')); })
        .filter(Boolean);
      if (selected.length === 1) {
        return canControl(selected[0], msg.playerid)
          ? { ok: true, character: selected[0] }
          : { ok: false, error: '선택한 토큰을 조작할 권한이 없습니다.' };
      }
      if (selected.length > 1)
        return { ok: false, error: '캐릭터 토큰을 하나만 선택해 주세요.' };
    }
    var active = playerIsGM(msg.playerid) && getObj('character', initState().activeCharacterId);
    if (active && profileMatches(activeProfile(), active.id)) return { ok: true, character: active };
    var who = trim(msg.who).replace(/\s*\(GM\)\s*$/, '');
    var speaking = characterObjects().filter(function (character) {
      return trim(character.get('name')) === who && canControl(character, msg.playerid);
    });
    if (speaking.length === 1) return { ok: true, character: speaking[0] };
    var controlled = characterObjects().filter(function (character) {
      return canControl(character, msg.playerid);
    });
    if (controlled.length === 1) return { ok: true, character: controlled[0] };
    if (controlled.length > 1)
      return { ok: false, error: '화자를 캐릭터로 바꾸거나 해당 토큰 하나를 선택해 주세요.' };
    return { ok: false, error: '사용할 캐릭터를 찾지 못했습니다.' };
  }

  function ensureSheet(character) {
    var profile = activeProfile();
    if (!profile) return { ok: false, error: '시트 프로필을 먼저 설정해 주세요.' };
    if (!profileMatches(profile, character.id))
      return {
        ok: false,
        error: character.get('name') + ' 시트에서 ' + profile.name + ' 속성을 확인하지 못했습니다.',
      };
    return { ok: true, data: scan(character.id) };
  }

  function parseDiceMode(value) {
    var raw = trim(value).toLowerCase();
    var match = raw.match(/\{\{dice_type=\[\[\s*(-?[0-2])\s*\]\]\}\}/);
    if (match) return match[1];
    if (/^-?[0-2]$/.test(raw)) return raw;
    return normalize(raw);
  }

  function modeInfo(characterId, override) {
    var mode = trim(override)
      ? parseDiceMode(override)
      : parseDiceMode(getAttr(characterId, 'dice_type'));
    if (/^(?:1|보너스1|보너스한개|bonus1)$/.test(mode))
      return { id: 'bonus1', label: '보너스 1개', fragment: '{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[1]]}}' };
    if (/^(?:2|보너스2|보너스두개|bonus2)$/.test(mode))
      return { id: 'bonus2', label: '보너스 2개', fragment: '{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[2]]}}' };
    if (/^(?:-1|페널티1|패널티1|penalty1)$/.test(mode))
      return { id: 'penalty1', label: '페널티 1개', fragment: '{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[-1]]}}' };
    if (/^(?:-2|페널티2|패널티2|penalty2)$/.test(mode))
      return { id: 'penalty2', label: '페널티 2개', fragment: '{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}} {{dice_type=[[-2]]}}' };
    return { id: 'normal', label: '기본', fragment: '{{roll=[[1d100]]}}' };
  }

  function commonTemplate(character) {
    var temporary = /^(?:1|on|true)$/.test(trim(getAttr(character.id, 'temp_insane')).toLowerCase()) ? 1 : 0;
    var indefinite = /^(?:1|on|true)$/.test(trim(getAttr(character.id, 'indef_insane')).toLowerCase()) ? 1 : 0;
    var sheetName = trim(getAttr(character.id, 'character_name')) || trim(character.get('name'));
    return (
      '{{character_name=' + safeTemplateText(sheetName) + '}} ' +
      '{{temp_insane=[[' + temporary + ']]}} {{indef_insane=[[' + indefinite + ']]}}'
    );
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateText(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    return match ? trim(match[1]).replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/gi, "'") : '';
  }

  function cocResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var mode = (payload && payload.mode) || 'normal';
    var diceType = templateValue(message, 'dice_type');
    if (!payload || !payload.mode) {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (rolled === null || target === null) return null;
    if (hard === null) hard = Math.floor(target / 2);
    if (extreme === null) extreme = Math.floor(target / 5);
    var outcome = 'failure';
    if (rolled === 1) outcome = 'critical';
    else if (rolled > target)
      outcome = (target >= 50 ? rolled === 100 : rolled >= 96) ? 'fumble' : 'failure';
    else if (rolled <= extreme) outcome = 'extreme';
    else if (rolled <= hard) outcome = 'hard';
    else outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    var profile = profiles[payload.system] || activeProfile();
    var result = profile && profile.result(message, payload);
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var autoTemporaryInsanity = payload.autoTemporaryInsanity === true;
    delete payload.autoTemporaryInsanity;
    if (
      autoTemporaryInsanity &&
      result &&
      ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1 &&
      enabledValue(getAttr(payload.characterId, 'indef_insane')) !== true &&
      enabledValue(getAttr(payload.characterId, 'temp_insane')) === false
    ) {
      setAttribute(payload.characterId, 'temp_insane', 1);
      invalidate(payload.characterId);
      scheduleManager();
    }
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch && pendingResults[tokenMatch[1]]) {
      var pending = pendingResults[tokenMatch[1]];
      delete pendingResults[tokenMatch[1]];
      emitResult(pending.payload, message);
      return true;
    }
    if (String(message && message.rolltemplate || '').toLowerCase() !== 'coc') return false;
    if (templateValue(message, 'success') === null || (templateValue(message, 'roll') === null && templateValue(message, 'roll1') === null)) return false;
    var label = templateText(message, 'subject');
    if (!label) return false;
    var payload = {
      source: 'sheet',
      system: 'coc7',
      kind: 'check',
      characterId: '',
      characterName: templateText(message, 'character_name'),
      key: '',
      label: label,
      cutinKey: resultKey('coc7', label),
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    };
    emitResult(payload, message);
    return true;
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function buildAction(profile, action, context) {
    var builder = profile && profile.actions && profile.actions[action];
    if (typeof builder !== 'function')
      return { ok: false, error: profile.name + ' 프로필은 이 실행을 지원하지 않습니다.' };
    return builder(context);
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' {{kib_sheet_result=' + token + '}}');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.fields, query);
    if (!resolved.ok) return resolved;
    var value = getAttr(characterId, resolved.item.attr);
    if (value === undefined) return { ok: false, error: resolved.item.label + ' 값을 찾지 못했습니다.' };
    var secret = !!(options && options.secret);
    var built = buildAction(activeProfile(), 'check', {
      character: character,
      item: resolved.item,
      value: value,
      secret: secret,
      mode: options && options.mode,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      source: 'helper',
      system: activeProfile().id,
      kind: 'check',
      characterId: characterId,
      key: resolved.item.key,
      label: resolved.item.label,
      cutinKey: resultKey(activeProfile().id, resolved.item.label),
      value: value,
      secret: secret,
      autoTemporaryInsanity: !!(options && options.autoTemporaryInsanity),
    }, built.payload));
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes) {
    var candidates = [];
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var value = getAttr(characterId, candidates[i].name, valueType);
      if (value !== undefined)
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || []);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = {};
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.weapons, query);
    if (!resolved.ok) return resolved;
    var weapon = resolved.item;
    var built = buildAction(activeProfile(), 'weapon', {
      character: character,
      item: weapon,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      source: 'helper',
      system: activeProfile().id,
      kind: 'weapon',
      characterId: characterId,
      key: weapon.key,
      label: weapon.label,
      cutinKey: resultKey(activeProfile().id, weapon.label),
      secret: !!secret,
    }, built.payload));
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.spells, query);
    if (!resolved.ok) return resolved;
    var spell = resolved.item;
    var built = buildAction(activeProfile(), 'spell', {
      character: character,
      item: spell,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'spell',
      characterId: characterId,
      key: spell.key,
      label: spell.label,
      cutinKey: resultKey(activeProfile().id, spell.label),
      secret: !!secret,
    }, built.payload));
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.armors, query);
    if (!resolved.ok) return resolved;
    var armor = resolved.item;
    var built = buildAction(activeProfile(), 'armor', {
      character: character,
      item: armor,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'armor',
      characterId: characterId,
      key: armor.key,
      label: armor.label,
      cutinKey: resultKey(activeProfile().id, armor.label),
      secret: !!secret,
    }, built.payload));
  }

  function rollFree(characterId, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var built = buildAction(activeProfile(), 'free', {
      character: character,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'free',
      characterId: characterId,
      key: 'free_dice',
      label: '자유 주사위',
      cutinKey: resultKey(activeProfile().id, '자유 주사위'),
      secret: !!secret,
    }, built.payload));
  }

  function rollMadness(characterId, forcedType, secret, requestedLabel) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var built = buildAction(activeProfile(), 'madness', {
      character: character,
      forcedType: forcedType,
      secret: !!secret,
    });
    if (!built.ok) return built;
    var payload = merge({
      system: activeProfile().id,
      kind: 'madness',
      characterId: characterId,
      key: 'rand_maddess',
      secret: !!secret,
    }, built.payload);
    payload.label = trim(requestedLabel) || payload.label || '광기 발작';
    payload.cutinKey = resultKey(activeProfile().id, payload.label);
    return sendSheet(character, built.content, payload);
  }

  function rollLuck(characterId, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var built = buildAction(activeProfile(), 'luck', {
      character: character,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'luck',
      characterId: characterId,
      key: 'luck-start',
      label: '행운 결정',
      cutinKey: resultKey(activeProfile().id, '행운 결정'),
      secret: !!secret,
    }, built.payload));
  }

  function rollHitLocation(characterId, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var built = buildAction(activeProfile(), 'hitLocation', {
      character: character,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'hit-location',
      characterId: characterId,
      key: 'hit-location',
      label: '명중부위',
      cutinKey: resultKey(activeProfile().id, '명중부위'),
      secret: !!secret,
    }, built.payload));
  }

  // ===== 수치 변경 =====
  function rollAmount(expression) {
    var source = trim(expression || '1');
    var match = source.match(/^(\d*)d(\d+)$/i);
    if (!match) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(match[1] || 1);
    var sides = Number(match[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i++) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function findAttributeObject(characterId, name) {
    return attrObjects(characterId).filter(function (attribute) {
      return trim(attribute.get('name')).toLowerCase() === trim(name).toLowerCase();
    })[0] || null;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setAttribute(characterId, name, value) {
    var attribute = findAttributeObject(characterId, name);
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === String(value))
      return attribute;
    var key = suppressKey(characterId, name);
    var marker = { value: String(value) };
    suppressChanges[key] = marker;
    setTimeout(function () {
      if (suppressChanges[key] === marker) delete suppressChanges[key];
    }, 5000);
    if (attribute) {
      if (typeof attribute.setWithWorker === 'function')
        attribute.setWithWorker({ current: String(value) });
      else attribute.set('current', String(value));
      return attribute;
    }
    var initial = getAttr(characterId, name);
    attribute = createObj('attribute', {
      characterid: characterId,
      name: name,
      current: String(initial == null ? '' : initial),
    });
    if (attribute && typeof attribute.setWithWorker === 'function')
      attribute.setWithWorker({ current: String(value) });
    else if (attribute) attribute.set('current', String(value));
    return attribute;
  }

  function applyCocHealthRules(characterId, before, current) {
    var profile = activeProfile();
    if (!profile || profile.id !== 'coc7') return [];
    var oldHp = asNumber(before);
    var hp = asNumber(current);
    var maximum = asNumber(getAttr(characterId, 'hp_max'));
    if (oldHp === null || hp === null || maximum === null || maximum <= 0) return [];
    var changed = [];
    var majorWound = enabledValue(getAttr(characterId, 'major-wound-toggle')) === true;
    if (oldHp > hp && oldHp - hp >= maximum / 2 && !majorWound) {
      setAttribute(characterId, 'major-wound-toggle', 1);
      majorWound = true;
      changed.push('중상 활성화');
    }
    if (hp <= 0 && majorWound && enabledValue(getAttr(characterId, 'dying')) !== true) {
      setAttribute(characterId, 'dying', 1);
      changed.push('빈사 활성화');
    }
    return changed;
  }

  function applyCocSanityRules(characterId, before, current) {
    var profile = activeProfile();
    var oldSan = asNumber(before);
    var san = asNumber(current);
    if (!profile || profile.id !== 'coc7' || oldSan === null || san === null || oldSan - san < 5)
      return [];
    if (enabledValue(getAttr(characterId, 'indef_insane')) === true) return [];
    var rolled = rollCheck(characterId, '지능', { autoTemporaryInsanity: true });
    return rolled && rolled.ok ? ['지능 판정 실행'] : ['지능 판정을 실행하지 못함'];
  }

  function applyChange(characterId, query, operation) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var profile = activeProfile();
    var resolved = resolveItem(checked.data.resources, query);
    if (!resolved.ok) return resolved;
    if ((profile.changeable || []).indexOf(resolved.item.attr) < 0)
      return { ok: false, error: resolved.item.label + ' 항목은 시트에서 직접 바꿔 주세요.' };
    var parsed = trim(operation).match(/^([+\-=])?\s*(\d*d\d+|\d+(?:\.\d+)?)$/i);
    if (!parsed) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var amount = rollAmount(parsed[2]);
    if (!amount.ok) return { ok: false, error: '변경값을 계산하지 못했습니다.' };
    var current = asNumber(getAttr(characterId, resolved.item.attr));
    if (current === null) return { ok: false, error: resolved.item.label + ' 값이 숫자가 아닙니다.' };
    var operator = parsed[1] || '=';
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.max(0, next);
    if ((profile.binaryResources || []).indexOf(resolved.item.attr) > -1) next = next > 0 ? 1 : 0;
    setAttribute(characterId, resolved.item.attr, next);
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    if (resolved.item.attr === 'hp')
      details = details.concat(applyCocHealthRules(characterId, current, next));
    if (resolved.item.attr === 'san')
      details = details.concat(applyCocSanityRules(characterId, current, next));
    invalidate(characterId);
    sendChat(
      'character|' + characterId,
      resourceChangeContent(profile, characterId, resolved.item.attr, resolved.item.label, current, next, details),
      null,
      { noarchive: true },
    );
    scheduleManager();
    return { ok: true, value: next };
  }

  function changeAmmo(characterId, weaponQuery, operation) {
    var data = scan(characterId);
    if (!data.ok) return data;
    var resolved = resolveItem(data.weapons, weaponQuery);
    if (!resolved.ok) return resolved;
    var weapon = resolved.item;
    if (!weapon.ammoAttr) return { ok: false, error: weapon.label + '에 탄약 항목이 없습니다.' };
    var requested = trim(operation || '');
    var ammoName = weapon.ammoRef || weapon.ammoAttr;
    if (!requested) {
      return { ok: true, value: trim(getAttr(characterId, ammoName)), queryOnly: true, weapon: weapon };
    }
    var parsed = requested.match(/^([+\-=])\s*(\d*d\d+|\d+)$/i);
    if (!parsed) return { ok: false, error: '탄약 변경값은 +1, -1, =6 형식으로 입력해 주세요.' };
    var amount = rollAmount(parsed[2]);
    if (!amount.ok) return { ok: false, error: '탄약 변경값을 계산하지 못했습니다.' };
    var current = asNumber(getAttr(characterId, ammoName));
    if (current === null) return { ok: false, error: weapon.label + '의 탄약 값이 숫자가 아닙니다.' };
    var next = parsed[1] === '+' ? current + amount.value : parsed[1] === '-' ? current - amount.value : amount.value;
    next = Math.max(0, next);
    setAttribute(characterId, weapon.ammoAttr, next);
    invalidate(characterId);
    sendChat('character|' + characterId, '<b>' + escapeHtml(weapon.label) + '</b> 탄약 ' + current + ' → <b>' + next + '</b>');
    scheduleManager();
    return { ok: true, value: next };
  }

  // ===== CoC 7판 프로필 =====
  var cocFields = [
    ['san', '이성', '특성치', ['이성치']], ['luck', '행운', '특성치', ['운']],
    ['str', '근력', '특성치'], ['con', '건강', '특성치'], ['siz', '크기', '특성치'],
    ['dex', '민첩성', '특성치', ['민첩']], ['app', '외모', '특성치'], ['edu', '교육', '특성치'],
    ['int', '지능', '특성치'], ['pow', '정신력', '특성치', ['정신']],
    ['appraise', '감정', '기능'], ['archaeology', '고고학', '기능'], ['spot_hidden', '관찰력', '기능', ['관찰']],
    ['fighting_brawl', '근접전(격투)', '기능', ['근접전', '격투']], ['fighting_swords', '근접전(도검)', '기능'],
    ['fighting_ax', '근접전(도끼)', '기능'], ['fighting_mace', '근접전(도리깨)', '기능'],
    ['fighting_lance', '근접전(창)', '기능'], ['fighting_whip', '근접전(채찍)', '기능'],
    ['mech_repair', '기계수리', '기능'], ['jump', '도약', '기능'], ['mouth_talk', '독순술', '기능'],
    ['animal_control', '동물 다루기', '기능'], ['listen', '듣기', '기능'], ['fast_talk', '말재주', '기능'],
    ['charm', '매혹', '기능'], ['law', '법률', '기능'], ['disguise', '변장', '기능'],
    ['firearms_handgun', '사격(권총)', '기능', ['권총']], ['firearms_rifle', '사격(라이플/산탄총)', '기능', ['라이플', '산탄총', '라산']],
    ['persuade', '설득', '기능'], ['sleight_of_hand', '손놀림', '기능'], ['swim', '수영', '기능'],
    ['ride', '승마', '기능'], ['psychology', '심리학', '기능'], ['language_own', '언어(모국어)', '기능', ['모국어']],
    ['history', '역사', '기능'], ['locksmith', '열쇠공', '기능'], ['climb', '오르기', '기능'],
    ['occult', '오컬트', '기능'], ['intimidate', '위협', '기능'], ['stealth', '은밀행동', '기능', ['은밀']],
    ['first_aid', '응급처치', '기능'], ['medicine', '의료', '기능'], ['anthropology', '인류학', '기능'],
    ['drive_auto', '자동차 운전', '기능', ['운전']], ['library_use', '자료 조사', '기능', ['자료조사']],
    ['natural_world', '자연', '기능'], ['credit_rating', '재력', '기능', ['재산']], ['elec_repair', '전기 수리', '기능'],
    ['elec_machin', '전자기기', '기능'], ['psychoanalysis', '정신분석', '기능'], ['op_hv_machine', '중장비 조작', '기능', ['중장비']],
    ['hypnosis', '최면술', '기능'], ['track', '추적', '기능'], ['computer', '컴퓨터 사용', '기능'],
    ['cthulhu_mythos', '크툴루 신화', '기능', ['신화']], ['throw', '투척', '기능'], ['shelling', '포격', '기능'],
    ['boom', '폭파', '기능'], ['navigate', '항법', '기능'], ['accounting', '회계', '기능'], ['dodge', '회피', '기능'],
  ];

  var cocResources = [
    ['hp', '체력', ['hp']], ['hp_max', '최대 체력'], ['mp', '마력', ['mp']], ['mp_max', '최대 마력'],
    ['san', '이성', ['san', '이성치']], ['san_max', '최대 이성'], ['san_start', '시작 이성'],
    ['luck', '행운', ['운']], ['str', '근력'], ['con', '건강'], ['siz', '크기'], ['dex', '민첩성', ['민첩']],
    ['app', '외모'], ['edu', '교육'], ['int', '지능'], ['pow', '정신력', ['정신']], ['mov', '이동력'],
    ['damage_bonus', '피해 보너스', ['피보', 'db']], ['build', '체격'], ['cthulhu_mythos', '크툴루 신화'],
    ['dying', '빈사'], ['major-wound-toggle', '중상'], ['temp_insane', '일시적 광기'], ['indef_insane', '장기 광기'],
  ];

  var cocRepeatingChecks = [
    { section: 'science', labels: ['science_title'], value: 'science', group: '과학' },
    { section: 'foreign', labels: ['foreign_title'], value: 'foreign', group: '외국어' },
    { section: 'art', labels: ['art_title'], value: 'art', group: '예술' },
    { section: 'live', labels: ['live_title_read', 'live_title'], value: 'live', group: '생존술' },
    { section: 'other_control', labels: ['other_control_title'], value: 'other_control', group: '기타 운전' },
    { section: 'other_weapon', labels: ['other_weapon_title'], value: 'other_weapon', group: '기타 전투' },
  ];

  var cocSingleChecks = [
    { label: 'ori_science_title', value: 'ori_science', group: '과학' },
    { label: 'ori_foreign_title', value: 'ori_foreign', group: '외국어' },
    { label: 'ori_art_title', value: 'ori_art', group: '예술' },
    { label: 'ori_live_title', value: 'ori_live', group: '생존술' },
    { label: 'ori_other_control_title', value: 'ori_other_control', group: '기타 운전' },
    { label: 'ori_other_weapon_title', value: 'ori_other_weapon', group: '기타 전투' },
  ];

  function cocField(definition, read) {
    var value = read(definition[0]);
    if (value === undefined) return null;
    return {
      key: definition[0],
      attr: definition[0],
      label: definition[1],
      group: definition[2],
      aliases: definition[3] || [],
      value: value,
      custom: false,
    };
  }

  function cocScan(character, objects) {
    var characterId = character.id;
    var attributeIndex = {};
    (objects || []).forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name || own(attributeIndex, name)) return;
      attributeIndex[name] = {
        current: attribute.get('current'),
        max: attribute.get('max'),
      };
    });
    function read(name, valueType) {
      var indexed = attributeIndex[name];
      var key = valueType == 'max' ? 'max' : 'current';
      return indexed && indexed[key] !== undefined
        ? indexed[key]
        : getAttr(characterId, name, valueType);
    }
    var fields = cocFields.map(function (definition) {
      return cocField(definition, read);
    }).filter(Boolean);
    cocSingleChecks.forEach(function (definition) {
      var label = trim(read(definition.label));
      var value = read(definition.value);
      if (!label || value === undefined) return;
      fields.push({ key: definition.value, attr: definition.value, label: label, group: definition.group, aliases: [], value: value, custom: true });
    });
    var warnings = [];
    cocRepeatingChecks.forEach(function (definition) {
      var names = definition.labels.concat([definition.value]);
      collectRows(characterId, definition.section, names, objects).forEach(function (row, index) {
        var label = '';
        for (var i = 0; i < definition.labels.length; i++) {
          label = trim(row.values[definition.labels[i]]);
          if (label) break;
        }
        var attrName = row.refs[definition.value] || row.names[definition.value];
        if (!label && attrName) warnings.push(definition.group + ' ' + (index + 1) + ' 이름이 비어 있습니다.');
        if (!label || !attrName) return;
        fields.push({
          key: row.names[definition.value],
          attr: attrName,
          scopes: [
            'repeating_' + definition.section + '_' + row.id + '_',
            'repeating_' + definition.section + '_$' + index + '_',
          ],
          label: label,
          group: definition.group,
          aliases: [],
          value: row.values[definition.value],
          custom: true,
        });
      });
    });

    var weaponFields = ['weapon_name', 'weapon_skill', 'weapon_damage', 'weapon_db', 'weapon_range', 'weapon_attacks', 'weapon_ammo', 'weapon_malf'];
    var weapons = [];
    var fixedName = trim(read('weapon_name_fix'));
    if (fixedName) {
      weapons.push({
        key: 'weapon_fix', label: fixedName, aliases: ['비무장'],
        skill: read('fighting_brawl'), damage: '1d3', db: '+@{damage_bonus}',
        range: read('weapon_range_fix'), attacks: read('weapon_attacks_fix'),
        ammo: read('weapon_ammo_fix'), malf: read('weapon_malf_fix'), ammoAttr: '', ammoRef: '',
        details: [
          ['기능', '근접전(격투)'], ['피해', '1d3+피해 보너스'],
          ['사거리', read('weapon_range_fix')], ['공격 횟수', read('weapon_attacks_fix')],
          ['탄약', read('weapon_ammo_fix')], ['고장', read('weapon_malf_fix')],
        ],
      });
    }
    collectRows(characterId, 'weapon', weaponFields, objects).forEach(function (row, index) {
      var name = trim(row.values.weapon_name);
      if (!name) {
        if (Object.keys(row.names).length) warnings.push('무기 ' + (index + 1) + ' 이름이 비어 있습니다.');
        return;
      }
      weapons.push({
        key: row.names.weapon_name || 'repeating_weapon_' + row.id + '_weapon_name',
        scopes: ['repeating_weapon_' + row.id + '_', 'repeating_weapon_$' + index + '_'],
        label: name, aliases: [], skill: row.values.weapon_skill, damage: row.values.weapon_damage,
        db: row.values.weapon_db, range: row.values.weapon_range, attacks: row.values.weapon_attacks,
        ammo: row.values.weapon_ammo,
        malf: row.values.weapon_malf,
        ammoAttr: row.names.weapon_ammo || '',
        ammoRef: row.refs.weapon_ammo || row.names.weapon_ammo || '',
        details: [
          ['기능', row.values.weapon_skill], ['피해', trim(row.values.weapon_damage) + trim(row.values.weapon_db)],
          ['사거리', row.values.weapon_range], ['공격 횟수', row.values.weapon_attacks],
          ['탄약', row.values.weapon_ammo], ['고장', row.values.weapon_malf],
        ],
      });
    });

    var spellFields = ['magic_flag', 'magic_name', 'magic_time', 'magic_cost', 'magic_desc'];
    var spells = [];
    collectRows(characterId, 'magic', spellFields, objects).forEach(function (row, index) {
      var name = trim(row.values.magic_name);
      if (!name) {
        if (Object.keys(row.names).length) warnings.push('주문 ' + (index + 1) + ' 이름이 비어 있습니다.');
        return;
      }
      spells.push({
        key: row.names.magic_name || 'repeating_magic_' + row.id + '_magic_name',
        label: name, aliases: [], time: row.values.magic_time, cost: row.values.magic_cost, desc: row.values.magic_desc,
        details: [['시전 시간', row.values.magic_time], ['비용', row.values.magic_cost], ['설명', row.values.magic_desc]],
      });
    });

    var armors = [];
    for (var armorIndex = 1; armorIndex <= 7; armorIndex++) {
      var suffix = armorIndex < 10 ? '0' + armorIndex : String(armorIndex);
      var armorName = trim(read('defense_name_' + suffix));
      if (!armorName) continue;
      armors.push({
        key: 'defense_name_' + suffix, label: armorName, aliases: [],
        part: read('defense_pice_' + suffix), value: read('defense_value_' + suffix),
        desc: read('defense_desc_' + suffix),
        details: [
          ['부위', read('defense_pice_' + suffix)],
          ['방어', read('defense_value_' + suffix)],
          ['설명', read('defense_desc_' + suffix)],
        ],
      });
    }

    var resources = cocResources.map(function (definition) {
      var value = read(definition[0]);
      return value === undefined ? null : {
        key: definition[0], attr: definition[0], label: definition[1], aliases: definition[2] || [], value: value,
      };
    }).filter(Boolean);
    return { fields: fields, resources: resources, weapons: weapons, spells: spells, armors: armors, warnings: warnings };
  }

  function cocCheckAction(context) {
    var mode = modeInfo(context.character.id, context.mode);
    var expression = resolvedRollExpression(
      context.character.id,
      context.value,
      context.item.scopes || [],
    );
    if (!expression) return { ok: false, error: context.item.label + ' 판정식을 계산하지 못했습니다.' };
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(context.item.label) + '}}' +
        ' {{success=[[(' + expression + ')]]}}' +
        ' {{hard=[[floor((' + expression + ')/2)]]}}' +
        ' {{extreme=[[floor((' + expression + ')/5)]]}} ' + mode.fragment,
      payload: { mode: mode.id, value: context.value },
    };
  }

  function cocWeaponAction(context) {
    var characterId = context.character.id;
    var weapon = context.item;
    var skill = resolvedRollExpression(characterId, weapon.skill, weapon.scopes || []);
    if (!skill) return { ok: false, error: weapon.label + '의 기능 식이 올바르지 않습니다.' };
    var damage = resolvedRollExpression(
      characterId,
      trim(weapon.damage) + trim(weapon.db),
      weapon.scopes || [],
    );
    if (!damage) return { ok: false, error: weapon.label + '의 피해식이 올바르지 않습니다.' };
    var mode = modeInfo(characterId);
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(weapon.label) + '}}' +
        ' {{success=[[(' + skill + ')]]}}' +
        ' {{hard=[[floor((' + skill + ')/2)]]}}' +
        ' {{extreme=[[floor((' + skill + ')/5)]]}} ' + mode.fragment +
        ' {{damage=[[' + damage + ']]}}' +
        (trim(weapon.malf) ? ' {{malf=' + safeTemplateText(weapon.malf) + '}}' : ''),
      payload: { value: trim(weapon.skill), mode: mode.id },
    };
  }

  function cocSpellAction(context) {
    var spell = context.item;
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(spell.label) + '}} {{side_subject=주문}}' +
        ' {{magic_time=' + safeTemplateText(spell.time) + '}}' +
        ' {{magic_cost=' + safeTemplateText(spell.cost) + '}}' +
        ' {{magic_desc=' + safeTemplateText(spell.desc) + '}}',
    };
  }

  function cocArmorAction(context) {
    var armor = context.item;
    var value = resolvedRollExpression(context.character.id, armor.value || '0', []);
    if (!value) return { ok: false, error: armor.label + '의 방어 수치가 올바르지 않습니다.' };
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(armor.label) + '}} {{sub_subject2=방어구}}' +
        ' {{sub_subject=' + safeTemplateText(armor.part) + '}}' +
        ' {{roll=[[' + value + '+0]]}} {{desc=' + safeTemplateText(armor.desc) + '}}',
    };
  }

  function cocFreeAction(context) {
    var raw = getAttr(context.character.id, 'free_dice');
    if (raw === undefined) return { ok: false, error: '현재 시트에 자유 주사위 항목이 없습니다.' };
    var expression = resolvedRollExpression(context.character.id, raw, []);
    if (!expression) return { ok: false, error: '시트의 자유 주사위 식이 올바르지 않습니다.' };
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(raw) + '}} {{free_roll=[[' + expression + ']]}}',
      payload: { label: trim(raw), expression: expression },
    };
  }

  function cocMadnessAction(context) {
    var current = getAttr(context.character.id, 'rand_maddess');
    if (current === undefined) return { ok: false, error: '현재 시트에 광기 발작 항목이 없습니다.' };
    var selected = trim(context.forcedType || current);
    if (!/^[12]$/.test(selected))
      return { ok: false, error: '시트에서 광기 발작 방식을 다시 선택해 주세요.' };
    var type = Number(selected);
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{madness_type=[[' + type + ']]}} {{rand_roll=[[1d10]]}} {{rand_roll2=[[1d10]]}}',
      payload: { label: type === 2 ? '광기 발작 요약' : '광기 발작 실시간', madnessType: type },
    };
  }

  function cocLuckAction(context) {
    if (getAttr(context.character.id, 'luck') === undefined)
      return { ok: false, error: '현재 시트에 행운 항목이 없습니다.' };
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=행운 결정}} {{free_roll=[[3d6*5]]}}',
      payload: { label: '행운 결정' },
    };
  }

  function cocHitLocationAction(context) {
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) + ' {{mark=[[1d20]]}}',
      payload: { label: '명중부위' },
    };
  }

  registerProfile({
    id: 'coc7',
    name: 'CoC 7판 커스텀 시트',
    minimumScore: 8,
    markers: { san: 3, cthulhu_mythos: 3, luck: 2, str: 1, dex: 1, pow: 1 },
    tracked: {
      hp: '체력', mp: '마력', san: '이성', luck: '행운', str: '근력', con: '건강', siz: '크기',
      dex: '민첩성', app: '외모', edu: '교육', int: '지능', pow: '정신력', cthulhu_mythos: '크툴루 신화',
      dying: '빈사', 'major-wound-toggle': '중상', temp_insane: '일시적 광기', indef_insane: '장기 광기',
    },
    changeable: ['hp', 'mp', 'san', 'luck', 'dying', 'major-wound-toggle', 'temp_insane', 'indef_insane'],
    binaryResources: ['dying', 'major-wound-toggle', 'temp_insane', 'indef_insane'],
    resourceMaximums: { hp: 'hp_max', mp: 'mp_max', san: 'san_start' },
    actions: {
      check: cocCheckAction,
      weapon: cocWeaponAction,
      spell: cocSpellAction,
      armor: cocArmorAction,
      free: cocFreeAction,
      madness: cocMadnessAction,
      luck: cocLuckAction,
      hitLocation: cocHitLocationAction,
    },
    result: cocResult,
    relevant: function (name) {
      if (cocFields.some(function (item) { return item[0] === name; })) return true;
      if (cocFields.some(function (item) { return item[0] + '_mod' === name; })) return true;
      if (cocResources.some(function (item) { return item[0] === name; })) return true;
      if (cocSingleChecks.some(function (item) { return item.label === name || item.value === name; })) return true;
      if (cocSingleChecks.some(function (item) { return item.value + '_mod' === name; })) return true;
      return /^repeating_(?:science|foreign|art|live|other_control|other_weapon|weapon|magic)_/.test(name) ||
        /^_reporder_repeating_(?:science|foreign|art|live|other_control|other_weapon|weapon|magic)$/.test(name) ||
        /^defense_(?:name|pice|value|desc)_\d\d$/.test(name) ||
        /^weapon_(?:name|range|attacks|ammo|malf)_fix$/.test(name);
    },
    scan: cocScan,
  });

  // ===== 관리 핸드아웃 =====
  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function itemRows(characterId, items, action, extra) {
    if (!items.length) return '<span style="color:#777">없음</span>';
    return '<table style="width:100%;border-collapse:collapse">' + items.map(function (item) {
      return '<tr><td style="padding:4px;border-bottom:1px solid #ddd">' + escapeHtml(item.label) +
        (item.custom ? ' <span style="color:#7654a8">사용자 추가</span>' : '') +
        (item.details && item.details.length
          ? '<div style="margin-top:3px;color:#555;font-size:11px">' + item.details.map(function (detail) {
              var value = detail[1] === undefined || detail[1] === '' ? '-' : detail[1];
              return escapeHtml(detail[0]) + ' ' + escapeHtml(value);
            }).join(' / ') + '</div>'
          : '') +
        '<br><code style="font-size:10px">' + escapeHtml(item.key) + '</code></td>' +
        '<td style="padding:4px;text-align:right">' +
        (item.value !== undefined ? '<b>' + escapeHtml(item.value) + '</b> ' : '') +
        button('실행', '!시트 내부' + action + '|' + characterId + '|' + item.key, '#287a4b') +
        (extra ? extra(item) : '') + '</td></tr>';
    }).join('') + '</table>';
  }

  function cutinItems() {
    var profile = activeProfile();
    var found = {};
    function add(item, kind) {
      var key = resultKey(profile.id, item.label);
      if (!found[key]) found[key] = { key: key, label: item.label, kind: kind, system: profile.id };
    }
    characterObjects().forEach(function (character) {
      if (!profile || !profileMatches(profile, character.id)) return;
      var data = scan(character.id);
      data.fields.forEach(function (item) { add(item, 'field'); });
      data.weapons.forEach(function (item) { add(item, 'weapon'); });
      data.spells.forEach(function (item) { add(item, 'spell'); });
      data.armors.forEach(function (item) { add(item, 'armor'); });
    });
    [
      ['자유 주사위', 'free'],
      ['광기 발작', 'madness'],
      ['일시적 광기', 'temporary-madness'],
      ['장기적 광기', 'indefinite-madness'],
      ['행운 결정', 'luck'],
      ['명중부위', 'hit-location'],
    ].forEach(function (item) { add({ label: item[0] }, item[1]); });
    return Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
  }

  function cutinControlsHtml() {
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    return cutin && typeof cutin.sheetControls === 'function'
      ? cutin.sheetControls(cutinItems())
      : '<span style="color:#777">08 컷인을 함께 설치하면 판정 결과와 연결할 수 있습니다.</span>';
  }

  function managerHtml() {
    var data = initState();
    var profile = activeProfile();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 관리대상|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">현재 프로필과 맞는 캐릭터가 없습니다.</span>';
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', '<b>' + escapeHtml(profile ? profile.name : '없음') + '</b> ' +
        button('프로필 선택', '!시트 설정|?{시트 프로필|' + Object.keys(profiles).map(function (id) { return profiles[id].name + ',' + id; }).join('|') + '}', '#7654a8') + ' ' +
        button('새로고침', '!시트 새로고침', '#287a4b') + '<br>' +
        'GM 전용 캐릭터 변화: <b>' + (data.trackGmOnly ? '표시' : '숨김') + '</b> ' +
        button(data.trackGmOnly ? '숨기기' : '표시하기', '!시트 GM전용추적|' + (data.trackGmOnly ? '끄기' : '켜기'), '#53657d') +
        (data.activeCharacterId && getObj('character', data.activeCharacterId)
          ? '<br>명령 대상: <b>' + escapeHtml(getObj('character', data.activeCharacterId).get('name')) + '</b>'
          : '')) +
      section('캐릭터', characterButtons);
    var selected = data.managerCharacterId && scan(data.managerCharacterId);
    if (selected && selected.ok) {
      body += section('판정 항목', itemRows(selected.characterId, selected.fields, '판정'));
      body += section('무기', itemRows(selected.characterId, selected.weapons, '무기', function (item) {
        return item.ammoAttr ? button('탄약', '!시트 내부탄약|' + selected.characterId + '|' + item.key + '|?{변경값|-1}', '#a16d1a') : '';
      }));
      body += section('주문', itemRows(selected.characterId, selected.spells, '주문'));
      body += section('방어구', itemRows(selected.characterId, selected.armors, '방어구'));
      body += section(
        '시트 주사위',
        button('자유 주사위', '!시트 내부자유|' + selected.characterId, '#287a4b') +
          button('광기 발작', '!시트 내부광기|' + selected.characterId, '#7654a8') +
          button('행운 결정', '!시트 내부운결정|' + selected.characterId, '#a16d1a') +
          button('명중부위', '!시트 내부명중부위|' + selected.characterId, '#53657d'),
      );
      body += section('수치', '<table style="width:100%">' + selected.resources.map(function (item) {
        return '<tr><td>' + escapeHtml(item.label) + '<br><code style="font-size:10px">' + escapeHtml(item.attr) + '</code></td><td style="text-align:right"><b>' +
          escapeHtml(displayResourceValue(profile, selected.characterId, item.attr, item.value)) + '</b></td></tr>';
      }).join('') + '</table>');
      body += section('판정 컷인', cutinControlsHtml());
      if (selected.warnings.length)
        body += section('확인할 항목', selected.warnings.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  // ===== 안내 =====
  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + text, null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + text, null, { noarchive: true });
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 관리 핸드아웃<br>' +
      '<code>!!캐릭터 이름</code> 명령 대상 변경<br>' +
      '<code>!!추적 공개</code> 수치 변화 표시 설정<br>' +
      '<code>!!GM전용추적 끄기</code> GM 전용 캐릭터 변화 숨김</div>';
  }

  function playerHelpHtml() {
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div><div style="padding:10px;line-height:1.7">' +
      '<code>!!관찰력</code> 판정<br>' +
      '<code>!!리볼버</code> 무기 사용<br>' +
      '<code>!!주문명</code> 주문 표시<br>' +
      '<code>!!방어구명</code> 방어구 표시<br>' +
      '<code>!!이성 -1d3</code> 수치 변경<br>' +
      '<code>:hp+3</code> 일반 채팅에서 수치 변경<br>' +
      '<code>!!비밀 관찰력</code> GM에게 판정<br>' +
      '<code>!!판정 관찰력 보너스1</code> 주사위 방식 지정<br>' +
      '<code>!!자유</code> 시트 자유 주사위<br>' +
      '<code>!!광기</code> 시트에 선택한 광기 발작<br>' +
      '<code>!!일시적광기</code> 일시적 광기 굴림<br>' +
      '<code>!!장기적광기</code> 장기적 광기 굴림<br>' +
      '<code>!!운결정</code> 행운 결정<br>' +
      '<code>!!명중부위</code> 명중부위<br>' +
      '<code>!!상태</code> 인식한 항목 확인</div></div>'
    );
  }

  function statusHtml(data) {
    var profile = activeProfile();
    return '<div><b>' + escapeHtml(data.characterName) + '</b><br>' +
      '프로필: ' + escapeHtml(data.profileName) + '<br>' +
      '판정 ' + data.fields.length + '개, 무기 ' + data.weapons.length + '개, 주문 ' + data.spells.length + '개, 방어구 ' + data.armors.length + '개<br>' +
      data.fields.map(function (item) { return escapeHtml(item.label) + ' <b>' + escapeHtml(item.value) + '</b>'; }).join(', ') +
      (data.resources.length ? '<br><br><b>수치</b><br>' + data.resources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(displayResourceValue(profile, data.characterId, item.attr, item.value)) + '</b>';
      }).join(', ') : '') + '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false) whisper(msg, escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  // ===== 명령 처리 =====
  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function bangBangGroups(data, kinds) {
    var wanted = kinds || ['check', 'weapon', 'spell', 'armor'];
    return [
      { kind: 'check', command: '판정', items: data.fields },
      { kind: 'weapon', command: '무기', items: data.weapons },
      { kind: 'spell', command: '주문', items: data.spells },
      { kind: 'armor', command: '방어구', items: data.armors },
      { kind: 'resource', command: '변경', items: data.resources },
    ].filter(function (group) {
      return wanted.indexOf(group.kind) > -1;
    });
  }

  function bangBangCandidates(data, kinds) {
    var candidates = [];
    bangBangGroups(data, kinds).forEach(function (group) {
      (group.items || []).forEach(function (item) {
        candidates.push({
          kind: group.kind,
          command: group.command,
          item: item,
          values: [item.label, item.key, item.attr].concat(item.aliases || []),
        });
      });
    });
    return candidates;
  }

  function bangBangConflict(candidates) {
    return {
      ok: false,
      reason: 'conflict',
      error:
        '같은 이름으로 찾은 항목이 여러 개입니다. 다음처럼 종류를 붙여 입력해 주세요: ' +
        candidates
          .map(function (candidate) {
            return (
              '!!' +
              candidate.command +
              ' ' +
              (candidate.item.label || 'key:' + candidate.item.key)
            );
          })
          .join(', '),
    };
  }

  function resolveBangBang(data, query, kinds) {
    var wanted = trim(query).replace(/^key:/i, '');
    if (!wanted) return { ok: false, reason: 'empty', error: '항목 이름을 입력해 주세요.' };
    var key = normalize(wanted);
    var candidates = bangBangCandidates(data, kinds);
    var exact = candidates.filter(function (candidate) {
      return candidate.values.some(function (value) {
        return normalize(value) === key;
      });
    });
    if (exact.length === 1) return { ok: true, candidate: exact[0] };
    if (exact.length > 1) return bangBangConflict(exact);
    var partial = candidates.filter(function (candidate) {
      return candidate.values.some(function (value) {
        var normalized = normalize(value);
        return normalized && (normalized.indexOf(key) > -1 || key.indexOf(normalized) > -1);
      });
    });
    if (partial.length === 1) return { ok: true, candidate: partial[0] };
    if (partial.length > 1) return bangBangConflict(partial);
    return {
      ok: false,
      reason: 'missing',
      error:
        '시트에서 ' +
        wanted +
        ' 항목을 찾지 못했습니다. 입력 예: !!관찰력 또는 !!도움말',
    };
  }

  function bangBangHint(result, example) {
    if (result && result.ok === false)
      result.error += ' 입력 예: ' + example;
    return result;
  }

  function runBangBangItem(character, candidate, secret) {
    if (candidate.kind === 'check')
      return rollCheck(character.id, candidate.item.key, { secret: secret });
    if (candidate.kind === 'weapon')
      return rollWeapon(character.id, candidate.item.key, secret);
    if (candidate.kind === 'spell')
      return showSpell(character.id, candidate.item.key, secret);
    if (candidate.kind === 'armor')
      return rollArmor(character.id, candidate.item.key, secret);
    return { ok: false, error: '실행할 시트 항목을 확인하지 못했습니다.' };
  }

  function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (/^[\d(]/.test(body)) return false;

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(캐릭터|전환|설정|추적|GM전용추적)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var compactSecret = body.match(/^비밀(판정|무기|주문|방어구|자유|광기|운결정|명중부위)\s*(.*)$/);
    if (compactSecret) {
      secret = true;
      body = compactSecret[1] + (trim(compactSecret[2]) ? ' ' + trim(compactSecret[2]) : '');
    } else if (/^비밀\s+/.test(body)) {
      secret = true;
      body = body.replace(/^비밀\s+/, '');
    }

    var explicit = body.match(/^(판정|무기|주문|방어구)\s+(.+)$/);
    if (explicit) {
      var action = explicit[1];
      var query = trim(explicit[2]);
      return withCharacter(msg, '', function (character) {
        if (action === '판정') {
          var mode = '';
          var modeMatch = query.match(
            /^(.+?)\s+((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus[12]|penalty[12]|-?[12])$/i,
          );
          if (modeMatch) {
            query = trim(modeMatch[1]);
            mode = trim(modeMatch[2]);
          }
          return bangBangHint(
            rollCheck(character.id, query, { secret: secret, mode: mode }),
            '!!판정 ' + query,
          );
        }
        if (action === '무기')
          return bangBangHint(rollWeapon(character.id, query, secret), '!!무기 ' + query);
        if (action === '주문')
          return bangBangHint(showSpell(character.id, query, secret), '!!주문 ' + query);
        return bangBangHint(rollArmor(character.id, query, secret), '!!방어구 ' + query);
      });
    }

    var simple = normalize(body);
    if (
      ['자유', '광기', '일시광기', '일시적광기', '장기광기', '장기적광기', '운결정', '명중부위'].indexOf(simple) > -1
    ) {
      return withCharacter(msg, '', function (character) {
        if (simple === '자유') return rollFree(character.id, secret);
        if (simple === '운결정') return rollLuck(character.id, secret);
        if (simple === '명중부위') return rollHitLocation(character.id, secret);
        if (simple === '일시광기' || simple === '일시적광기')
          return rollMadness(character.id, '', secret, '일시적 광기');
        if (simple === '장기광기' || simple === '장기적광기')
          return rollMadness(character.id, '', secret, '장기적 광기');
        return rollMadness(character.id, '', secret, '광기 발작');
      });
    }

    var explicitChange = body.match(/^변경\s+(.+?)\s+([+\-=].+)$/);
    if (explicitChange) {
      return withCharacter(msg, '', function (character) {
        return bangBangHint(
          applyChange(character.id, explicitChange[1], explicitChange[2]),
          '!!' + trim(explicitChange[1]) + ' -1d3',
        );
      });
    }
    var explicitAmmo = body.match(/^탄약\s+(.+?)(?:\s+([+\-=].+))?$/);
    if (explicitAmmo) {
      return withCharacter(msg, '', function (character) {
        return bangBangHint(
          changeAmmo(character.id, explicitAmmo[1], explicitAmmo[2]),
          '!!탄약 ' + trim(explicitAmmo[1]) + ' -1',
        );
      });
    }

    return withCharacter(msg, '', function (character) {
      var checked = ensureSheet(character);
      if (!checked.ok) return checked;
      var change = body.match(/^(.+?)\s*([+\-=])\s*(.*)$/);
      if (change) {
        var changed = resolveBangBang(checked.data, change[1], ['resource', 'weapon']);
        if (changed.ok) {
          var operation = change[2] + trim(change[3]);
          var result = changed.candidate.kind === 'resource'
            ? applyChange(character.id, changed.candidate.item.key, operation)
            : changeAmmo(character.id, changed.candidate.item.key, operation);
          return bangBangHint(
            result,
            '!!' + changed.candidate.item.label + (changed.candidate.kind === 'resource' ? ' -1d3' : ' -1'),
          );
        }
        if (changed.reason === 'conflict') return changed;
      }
      var missingOperator = body.match(/^(.+?)\s+(\d*d\d+|\d+(?:\.\d+)?)$/i);
      if (missingOperator) {
        var resource = resolveBangBang(checked.data, missingOperator[1], ['resource']);
        if (resource.ok)
          return {
            ok: false,
            error:
              '수치를 더하거나 뺄 때는 기호를 붙여 주세요. 입력 예: !!' +
              resource.candidate.item.label +
              ' -1d3',
          };
      }
      var resolved = resolveBangBang(checked.data, body);
      return resolved.ok
        ? runBangBangItem(character, resolved.candidate, secret)
        : resolved;
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '설정') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var profileId = parts[0];
      if (!profiles[profileId]) return whisperGm('등록되지 않은 시트 프로필입니다: ' + escapeHtml(profileId));
      initState().profileId = profileId;
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 프로필: <b>' + escapeHtml(profiles[profileId].name) + '</b>');
    }
    if (action === '캐릭터' || action === '전환') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (/^(?:해제|끄기|off)$/i.test(parts[0] || '')) {
        initState().activeCharacterId = '';
        initState().managerHash = '';
        managerHandout();
        return whisperGm('시트 명령 대상을 해제했습니다.');
      }
      var foundCharacter = resolveCharacterName(parts[0]);
      if (!foundCharacter.ok) return whisperGm(escapeHtml(foundCharacter.error));
      initState().activeCharacterId = foundCharacter.character.id;
      initState().managerCharacterId = foundCharacter.character.id;
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 명령 대상: <b>' + escapeHtml(foundCharacter.character.get('name')) + '</b>');
    }
    if (action === 'gm전용추적') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmOnlyMode = normalize(parts[0]);
      if (/^(?:켜기|on|표시)$/.test(gmOnlyMode)) initState().trackGmOnly = true;
      else if (/^(?:끄기|off|숨김)$/.test(gmOnlyMode)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 추적은 켜기 또는 끄기로 설정해 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('GM 전용 캐릭터 변화: <b>' + (initState().trackGmOnly ? '표시' : '숨김') + '</b>');
    }
    if (action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action.indexOf('내부') === 0) {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var internal = action.substring(2);
      var characterId = parts.shift();
      if (internal === '판정') return reportResult(msg, rollCheck(characterId, parts[0], {}));
      if (internal === '무기') return reportResult(msg, rollWeapon(characterId, parts[0], false));
      if (internal === '주문') return reportResult(msg, showSpell(characterId, parts[0], false));
      if (internal === '방어구') return reportResult(msg, rollArmor(characterId, parts[0], false));
      if (internal === '탄약') return reportResult(msg, changeAmmo(characterId, parts[0], parts[1]));
      if (internal === '자유') return reportResult(msg, rollFree(characterId, false));
      if (internal === '광기') return reportResult(msg, rollMadness(characterId, '', false));
      if (internal === '운결정') return reportResult(msg, rollLuck(characterId, false));
      if (internal === '명중부위') return reportResult(msg, rollHitLocation(characterId, false));
      return;
    }
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    if (action === '자유' || action === '비밀자유')
      return withCharacter(msg, '', function (character) { return rollFree(character.id, action === '비밀자유'); });
    if (action === '광기' || action === '비밀광기')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '', action === '비밀광기', '광기 발작'); });
    if (action === '일시광기' || action === '일시적광기')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '', false, '일시적 광기'); });
    if (action === '장기광기' || action === '장기적광기')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '', false, '장기적 광기'); });
    if (action === '운결정' || action === '비밀운결정')
      return withCharacter(msg, '', function (character) { return rollLuck(character.id, action === '비밀운결정'); });
    if (action === '명중부위' || action === '비밀명중부위')
      return withCharacter(msg, '', function (character) { return rollHitLocation(character.id, action === '비밀명중부위'); });
    if (action === '변경')
      return withCharacter(msg, '', function (character) { return applyChange(character.id, parts[0], parts[1]); });
    if (action === '탄약')
      return withCharacter(msg, '', function (character) { return changeAmmo(character.id, parts[0], parts[1]); });
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '추적') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var mode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(mode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(mode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|off)$/.test(mode)) initState().trackingMode = 'off';
      else return whisperGm('추적 설정은 공개, GM, 끄기 중 하나입니다.');
      return whisperGm('수치 변화 표시: <b>' + escapeHtml(initState().trackingMode) + '</b>');
    }
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    match = content.match(/^!탄약(?:\s+(.+?)(?:\s+([+\-=]\s*(?:\d*d\d+|\d+)))?)?$/i);
    if (match) {
      withCharacter(msg, '', function (character) {
        if (!match[1]) {
          var data = scan(character.id);
          whisper(msg, data.weapons.length ? data.weapons.map(function (item) { return escapeHtml(item.label) + ' <b>' + escapeHtml(item.ammo === '' || item.ammo === undefined ? '-' : item.ammo) + '</b>'; }).join('<br>') : '등록된 무기가 없습니다.');
          return { ok: true };
        }
        return changeAmmo(character.id, match[1], match[2]);
      });
      return true;
    }
    if (/^!(?:일시광기|일시적광기|일시)$/.test(content)) {
      withCharacter(msg, '', function (character) { return rollMadness(character.id, '', false, '일시적 광기'); });
      return true;
    }
    if (/^!(?:장기광기|장기적광기|장기)$/.test(content)) {
      withCharacter(msg, '', function (character) { return rollMadness(character.id, '', false, '장기적 광기'); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        var data = scan(character.id);
        whisper(msg, statusHtml(data));
        return { ok: true };
      });
      return true;
    }
    if (/^!at(?:\s+(.+))?$/.test(content)) {
      var at = content.match(/^!at(?:\s+(.+))?$/)[1] || '';
      handleNamespaced(msg, '!시트 추적|' + at);
      return true;
    }
    return false;
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    var match = content.match(/^:\s*([가-힣A-Za-z0-9_()（）\s-]+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)$/i);
    if (!match) return false;
    var resolved = resolveCharacter(msg);
    if (!resolved.ok) return false;
    var data = scan(resolved.character.id);
    var resource = resolveItem(data.resources, match[1]);
    if (!resource.ok || activeProfile().changeable.indexOf(resource.item.attr) < 0) return false;
    reportResult(msg, applyChange(resolved.character.id, resource.item.attr, match[2] + match[3]));
    return true;
  }

  // ===== 변화 감지 =====
  function trackChange(attribute, previous) {
    var profile = activeProfile();
    if (!profile || !attribute) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    if (!characterId || !profile.tracked[name]) return;
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var key = suppressKey(characterId, name);
    if (suppressChanges[key]) {
      if (suppressChanges[key].value === current) {
        delete suppressChanges[key];
        return;
      }
      delete suppressChanges[key];
    }
    var before = previous ? String(previous.current == null ? '' : previous.current) : '';
    if (before === current) return;
    var extra = [];
    if (name === 'hp') extra = applyCocHealthRules(characterId, before, current);
    if (name === 'san') extra = applyCocSanityRules(characterId, before, current);
    var mode = initState().trackingMode;
    if (mode === 'off') return;
    var character = getObj('character', characterId);
    if (!initState().trackGmOnly && character && !hasPlayerController(character)) return;
    var content = resourceChangeContent(profile, characterId, name, profile.tracked[name], before, current, extra);
    sendChat('character|' + characterId, mode === 'gm' ? '/w gm ' + content : content, null, { noarchive: true });
  }

  function onAttributeChanged(attribute, previous) {
    var profile = activeProfile();
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    if (previous) trackChange(attribute, previous);
    if (!profile || !characterId || !profile.relevant(name)) return;
    invalidate(characterId);
    scheduleManager();
  }

  // ===== 외부 연결 =====
  api.version = VERSION;
  api.profiles = profiles;
  api.registerProfile = registerProfile;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.rollMadness = rollMadness;
  api.rollLuck = rollLuck;
  api.rollHitLocation = rollHitLocation;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        var profile = activeProfile();
        return { profile: profile ? profile.id : '', tracking: initState().trackingMode };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!항목명</code> 판정, 무기, 주문, 방어구 자동 실행',
        '<code>!!이성 -1d3</code> 수치 변경',
        '<code>:hp+3</code> 일반 채팅에서 수치 변경',
        '<code>!!관리</code> 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api') captureResult(msg);
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
        return;
      }
      if (sheet_helper_setting.legacy_commands && msg.type === 'general')
        handleGeneralChange(msg);
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate(character.id);
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    if (initState().activeCharacterId === character.id) initState().activeCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
