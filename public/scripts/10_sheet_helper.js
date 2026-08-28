/*
 * Scene Suite 10 - Sheet Helper 0.6.0
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * CoC 7판 결과 해석: 천량성님 커스텀 시트, Roll20 공개 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

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

  var VERSION = '0.6.0';
  var profiles = {};
  var cache = {};
  var refreshTimer = null;
  var suppressChanges = {};
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};

  // ===== 공통 처리 =====
  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
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

  function resolvedResourceValue(characterId, raw) {
    var source = trim(raw);
    var resolved = resolvedRollExpression(characterId, source, [], 0, {});
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      try {
        var js = resolved.replace(/\b(floor|ceil|round|min|max|abs)\b/gi, 'Math.$1');
        var calculated = Function('"use strict";return (' + js + ');')();
        if (typeof calculated === 'number' && isFinite(calculated)) {
          calculated = Math.round(calculated * 100) / 100;
          return { number: calculated, text: String(calculated) };
        }
      } catch (err) {}
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function displayResourceValue(profile, characterId, name, raw) {
    if ((profile.binaryResources || []).indexOf(name) > -1) {
      var enabled = enabledValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var maximumName = profile.resourceMaximums && profile.resourceMaximums[name];
    var current = resolvedResourceValue(characterId, raw);
    var maximum = maximumName
      ? resolvedResourceValue(characterId, getAttr(characterId, maximumName))
      : { number: null, text: '' };
    return current.number !== null && maximum.number !== null && maximum.number > 0
      ? current.text + ' / ' + maximum.text + ' (' + Math.round((current.number / maximum.number) * 100) + '%)'
      : current.text;
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
    profile.markerAliases = profile.markerAliases || {};
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
      var candidates = [name].concat(profile.markerAliases[name] || []);
      if (candidates.some(function (candidate) { return getAttr(characterId, candidate) !== undefined; }))
        score += Number(markers[name]) || 0;
    });
    return score;
  }

  function profileMatches(profile, characterId) {
    return profileScore(profile, characterId) >= (profile.minimumScore || 1);
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, values: dictionary(), names: dictionary(), refs: dictionary() };
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

  // ===== 시트 HTML 인식 =====
  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 파일 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractIndexCache = {};
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function inspectContracts(characterId, objects) {
    if (!objects && contractMatchCache[characterId]) return contractMatchCache[characterId];
    function remember(result) {
      contractMatchCache[characterId] = result;
      return result;
    }
    var attributes = objects || attrObjects(characterId);
    var names = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) names[name] = true;
    });
    var scored = sheetContracts().map(function (contract) {
      var signature = contractSignature(contract);
      var signatureScore = 0;
      var sourceScore = 0;
      var missingRequired = [];
      signature.entries.forEach(function (entry) {
        if (names[entry.name]) signatureScore += entry.weight;
        else if (entry.required) missingRequired.push(entry.name);
      });
      var contractAttributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      if (!signature.total && contractAttributes.length) {
        var index = contractRuntimeIndex(contract);
        var evidence = dictionary();
        Object.keys(names).forEach(function (name) {
          if (index.exact[name]) {
            evidence[name] = true;
            return;
          }
          index.prefixes.some(function (prefix) {
            if (name.indexOf(prefix) !== 0) return false;
            var fields = index.sections[prefix.substring(10, prefix.length - 1)] || [];
            var field = fields.filter(function (candidate) { return name.slice(-candidate.length - 1) === '_' + candidate; })[0];
            if (!field) return false;
            evidence[prefix + field] = true;
            return true;
          });
        });
        sourceScore = Object.keys(evidence).length;
      }
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) { return b.score - a.score || b.ratio - a.ratio; });
    var eligible = scored.filter(function (item) { return item.eligible; });
    if (!eligible.length) return remember({ status: 'none', contract: null, matches: scored });
    var best = eligible[0];
    var close = eligible.filter(function (item) {
      return best.ratio - item.ratio < 0.1 || best.score - item.score <= 2;
    });
    if (close.length !== 1)
      return remember({ status: 'ambiguous', contract: null, matches: close, error: '현재 캐릭터와 비슷하게 맞는 시트 인식 파일이 여러 개입니다: ' + close.map(function (item) { return item.name; }).join(', ') });
    return remember({ status: 'matched', contract: best.contract, match: best, matches: scored });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    return trim(reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current'));
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      labelRefFrequency: dictionary(),
    };
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          addExact(contractRefName(ref));
        });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractRolls(characterId, inspection, objects, includeHidden) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = getAttr(characterId, name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      rowsBySection[sectionName] = collectRows(characterId, sectionName, index.sections[sectionName], attributes, index.prefixes);
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        var visibility = contractVisibilityResult(roll.visibility, function (name, atom) {
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          if (own(attributeValues, fullName)) return { known: true, value: attributeValues[fullName].current };
          var liveValue = read(fullName, 'current');
          if (liveValue !== undefined && liveValue !== null && String(liveValue) !== '')
            return { known: true, value: liveValue };
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        });
        // A contract without CSS has no condition. Unsupported/missing state is unknown and stays usable.
        if (visibility === false && !includeHidden) return;
        var visible = trim(roll.label);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        var dynamic = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (value) dynamic.push({ value: value, frequency: index.labelRefFrequency[contractRefName(ref)] || 0 });
        });
        dynamic.sort(function (left, right) { return left.frequency - right.frequency; });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        if (!usefulDynamic.length) usefulDynamic = dynamic;
        var modeSummary = [];
        (Array.isArray(roll.modes) ? roll.modes : []).forEach(function (mode) {
          var label = contractModeLabels(mode)[0];
          if (label && modeSummary.indexOf(label) < 0) modeSummary.push(label);
        });
        var labels = [visible]
          .concat(roll.aliases || [])
          .concat(staticLabels.filter(humanContractLabel))
          .concat(usefulDynamic.map(function (entry) { return entry.value; }))
          .concat(staticLabels)
          .concat(modeSummary.length && modeSummary.length <= 4 ? [modeSummary.join(' / ')] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: labels[0] || roll.key,
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete contractMatchCache[characterId];
    } else {
      cache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var profile = activeProfile();
    if (!profile) return { ok: false, error: '설정된 시트 프로필이 없습니다.' };
    if (!force && cache[characterId] && cache[characterId].profileId === profile.id)
      return cache[characterId].value;
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var objects = attrObjects(characterId);
    var contractMatch = inspectContracts(characterId, objects);
    var profileMatched = profileMatches(profile, characterId);
    var value = profileMatched ? profile.scan(character, objects) || {} : {};
    ['fields', 'resources', 'weapons', 'spells', 'armors', 'specialDice', 'madnessHistory', 'warnings'].forEach(function (key) {
      if (!Array.isArray(value[key])) value[key] = [];
    });
    value.ok = true;
    value.profileId = profile.id;
    value.profileName = profileMatched ? profile.name : contractMatch.contract && (contractMatch.contract.name || contractMatch.contract.id) || profile.name;
    value.score = profileMatched ? profileScore(profile, characterId) : contractMatch.match && contractMatch.match.score || 0;
    value.profileMatched = profileMatched;
    value.matched = profileMatched || contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    value.contractRolls = contractRolls(characterId, value.contractMatch, objects);
    if (value.contractMatch.status === 'matched') value.specialDice = [];
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
      return (profile && profileMatches(profile, character.id)) || inspectContracts(character.id).status === 'matched';
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
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
    if (active && (profileMatches(activeProfile(), active.id) || inspectContracts(active.id).status === 'matched'))
      return { ok: true, character: active };
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
    var contractMatch = inspectContracts(character.id);
    if (contractMatch.status === 'ambiguous') return { ok: false, error: contractMatch.error };
    if (!profileMatches(profile, character.id) && contractMatch.status !== 'matched')
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

  function modeInfo(characterId, override, schema) {
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
    return {
      id: 'normal',
      label: '기본',
      fragment: schema && schema.officialLegacy
        ? '{{roll1=[[1d100]]}}'
        : schema && schema.id === 'name'
          ? '{{roll1=[[1d100]]}} {{roll2=[[1d100]]}} {{roll3=[[1d100]]}}'
        : '{{roll=[[1d100]]}}',
    };
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

  function sheetResultSystem(profile, characterId) {
    return profile && profileMatches(profile, characterId) ? profile.id : 'sheet';
  }

  function contractCutinKey(system, instance) {
    return resultKey(system, system === 'sheet' ? instance.key : instance.label);
  }

  function madnessKey(type) {
    return Number(type) === 2 ? 'madness-summary' : 'madness-realtime';
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
    if (payload && payload.kind === 'madness') {
      var madnessType = Number(payload.madnessType || templateValue(message, 'madness_type')) || 1;
      return {
        total: templateValue(message, 'rand_roll') !== null ? templateValue(message, 'rand_roll') : templateValue(message, 'roll1'),
        duration: templateValue(message, madnessType === 2 ? 'hours' : 'rounds') !== null
          ? templateValue(message, madnessType === 2 ? 'hours' : 'rounds')
          : templateValue(message, 'rand_roll2'),
        madnessType: madnessType,
        madnessLabel: madnessType === 2 ? '요약' : '실시간',
        outcome: 'roll',
        outcomeLabel: OUTCOMES.roll,
      };
    }
    if (payload && (payload.kind === 'free' || payload.kind === 'luck')) {
      var freeTotal = templateValue(message, 'free_roll');
      if (freeTotal === null) freeTotal = templateValue(message, 'diceroll');
      return freeTotal === null ? null : { total: freeTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (payload && payload.kind === 'hit-location') {
      var hitTotal = templateValue(message, 'mark');
      if (hitTotal === null) hitTotal = templateValue(message, 'roll1');
      return hitTotal === null ? null : { total: hitTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
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
    if (mode === 'normal' && rolled === null) rolled = roll1;
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
    var profile = profiles[payload.system] || (payload.contractId ? null : activeProfile());
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
    var rolltemplate = String(message && message.rolltemplate || '').toLowerCase();
    if (!/^coc(?:$|-|other$)/.test(rolltemplate) && !/^type-coc-attack(?:-1)?$/.test(rolltemplate)) return false;
    var specialPayload = null;
    var madnessType = templateValue(message, 'madness_type');
    if (madnessType !== null || /bomadness-(?:da-)?(?:rt|summ)$/.test(rolltemplate)) {
      madnessType = madnessType || (/summ$/.test(rolltemplate) ? 2 : 1);
      specialPayload = {
        source: 'sheet', system: 'coc7', kind: 'madness', characterId: '', characterName: templateText(message, 'character_name'),
        key: madnessKey(madnessType), label: madnessType === 2 ? '광기 발작 요약' : '광기 발작 실시간',
        madnessType: madnessType, secret: message.type === 'whisper' || message.type === 'gmrollresult',
      };
    } else if (templateValue(message, 'free_roll') !== null || (rolltemplate === 'coc-dice-roll' && templateValue(message, 'diceroll') !== null)) {
      var freeLabel = templateText(message, 'subject');
      specialPayload = {
        source: 'sheet', system: 'coc7', kind: normalize(freeLabel) === '행운결정' ? 'luck' : 'free', characterId: '',
        characterName: templateText(message, 'character_name'), key: 'free-dice',
        label: normalize(freeLabel) === '행운결정' ? '행운 결정' : '자유 주사위',
        secret: message.type === 'whisper' || message.type === 'gmrollresult',
      };
    } else if (templateValue(message, 'mark') !== null || (rolltemplate === 'coc-body-hit-loc' && templateValue(message, 'roll1') !== null)) {
      specialPayload = {
        source: 'sheet', system: 'coc7', kind: 'hit-location', characterId: '', characterName: templateText(message, 'character_name'),
        key: 'hit-location', label: '명중부위', secret: message.type === 'whisper' || message.type === 'gmrollresult',
      };
    }
    if (specialPayload) {
      specialPayload.cutinKey = resultKey('coc7', specialPayload.label);
      emitResult(specialPayload, message);
      return true;
    }
    if (
      /^(?:coc|coc-attack|type-coc-attack)$/.test(rolltemplate) &&
      templateValue(message, 'dice_type') === null &&
      templateValue(message, 'roll2') !== null
    ) return false;
    if (templateValue(message, 'success') === null || (templateValue(message, 'roll') === null && templateValue(message, 'roll1') === null)) return false;
    var label = templateText(message, 'subject') || templateText(message, 'name');
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

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    if (sourceResult) {
      if (sourceResult.ok && sourceResult.payload && options && options.autoTemporaryInsanity)
        sourceResult.payload.autoTemporaryInsanity = true;
      return sourceResult;
    }
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
      schema: checked.data.schema,
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

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
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
      var nextTrail = dictionary();
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
    var sourceResult = sourceContractAction(character, query, secret);
    if (sourceResult) return sourceResult;
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.weapons, query);
    if (!resolved.ok) return resolved;
    var weapon = resolved.item;
    var built = buildAction(activeProfile(), 'weapon', {
      character: character,
      item: weapon,
      secret: !!secret,
      schema: checked.data.schema,
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
    var sourceResult = sourceContractAction(character, query, secret);
    if (sourceResult) return sourceResult;
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var resolved = resolveItem(checked.data.spells, query);
    if (!resolved.ok) return resolved;
    var spell = resolved.item;
    var built = buildAction(activeProfile(), 'spell', {
      character: character,
      item: spell,
      secret: !!secret,
      schema: checked.data.schema,
    });
    if (!built.ok) return built;
    var payload = merge({
      system: activeProfile().id,
      kind: 'spell',
      characterId: characterId,
      key: spell.key,
      label: spell.label,
      cutinKey: resultKey(activeProfile().id, spell.label),
      secret: !!secret,
    }, built.payload);
    if (built.immediate) {
      try {
        sendChat('character|' + character.id, built.content);
        emitResult(payload, null);
        return { ok: true, payload: payload };
      } catch (err) {
        return { ok: false, error: '주문 메시지를 보내지 못했습니다: ' + (err.message || err) };
      }
    }
    return sendSheet(character, built.content, payload);
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    if (sourceResult) return sourceResult;
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

  function specialItem(data, kind, type) {
    return (data.specialDice || []).filter(function (item) {
      return item.kind === kind && (!type || String(item.type || '') === String(type));
    })[0] || null;
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    if (sourceResult) return sourceResult;
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var special = specialItem(checked.data, 'free');
    if (!special) return { ok: false, error: '현재 시트에서 자유 주사위를 찾지 못했습니다.' };
    var customExpression;
    if (expressionOverride !== undefined) {
      customExpression = safeUserRollExpression(characterId, expressionOverride);
      if (!customExpression)
        return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 주사위 식으로 적어 주세요.' };
    }
    var built = buildAction(activeProfile(), 'free', {
      character: character,
      item: special,
      schema: checked.data.schema,
      secret: !!secret,
      expression: customExpression,
      expressionLabel: expressionOverride,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'free',
      characterId: characterId,
      key: special.key,
      label: special.label,
      cutinKey: resultKey(activeProfile().id, special.label),
      secret: !!secret,
    }, built.payload));
  }

  function rollMadness(characterId, forcedType, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractNeedsName(character);
    if (sourceResult) return sourceResult;
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    if (checked.data.schema.officialLegacy && !trim(forcedType))
      return { ok: false, error: '공식 시트의 광기 발작은 !!광기실시간 또는 !!광기요약으로 골라 주세요.' };
    if (!specialItem(checked.data, 'madness'))
      return { ok: false, error: '현재 시트에서 광기 발작 주사위를 찾지 못했습니다.' };
    var built = buildAction(activeProfile(), 'madness', {
      character: character,
      forcedType: forcedType,
      schema: checked.data.schema,
      secret: !!secret,
    });
    if (!built.ok) return built;
    var payload = merge({
      system: activeProfile().id,
      kind: 'madness',
      characterId: characterId,
      key: madnessKey(built.payload && built.payload.madnessType),
      secret: !!secret,
    }, built.payload);
    payload.label = payload.label || '광기 발작';
    payload.cutinKey = resultKey(activeProfile().id, payload.label);
    return sendSheet(character, built.content, payload);
  }

  function rollLuck(characterId, secret) {
    return { ok: false, error: '현재 시트에서 행운 결정 주사위를 찾지 못했습니다.' };
  }

  function rollHitLocation(characterId, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractNeedsName(character);
    if (sourceResult) return sourceResult;
    var checked = ensureSheet(character);
    if (!checked.ok) return checked;
    var special = specialItem(checked.data, 'hit-location');
    if (!special) return { ok: false, error: '현재 시트에서 명중부위 주사위를 찾지 못했습니다.' };
    var built = buildAction(activeProfile(), 'hitLocation', {
      character: character,
      item: special,
      schema: checked.data.schema,
      secret: !!secret,
    });
    if (!built.ok) return built;
    return sendSheet(character, built.content, merge({
      system: activeProfile().id,
      kind: 'hit-location',
      characterId: characterId,
      key: special.key,
      label: special.label,
      cutinKey: resultKey(activeProfile().id, special.label),
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

  function cocMajorWoundAttr(characterId) {
    for (var i = 0; i < cocMajorWoundAttrs.length; i++) {
      if (getAttr(characterId, cocMajorWoundAttrs[i]) !== undefined) return cocMajorWoundAttrs[i];
    }
    return getAttr(characterId, 'showskills') !== undefined ? 'major_wound_toggle' : 'major-wound-toggle';
  }

  function applyCocHealthRules(characterId, before, current) {
    var profile = activeProfile();
    if (!profile || profile.id !== 'coc7') return [];
    var oldHp = asNumber(before);
    var hp = asNumber(current);
    var maximum = asNumber(getAttr(characterId, 'hp_max'));
    if (oldHp === null || hp === null || maximum === null || maximum <= 0) return [];
    var changed = [];
    var majorWoundAttr = cocMajorWoundAttr(characterId);
    var majorWound = enabledValue(getAttr(characterId, majorWoundAttr)) === true;
    if (oldHp > hp && oldHp - hp >= maximum / 2 && !majorWound) {
      setAttribute(characterId, majorWoundAttr, 1);
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

  var cocMadnessHistory = [
    ['current_mental_condition', '현재 정신 상태'],
    ['phobias_manias', '공포증과 집착증'],
    ['injuries_scars', '부상과 흉터'],
    ['encounters_with_strange_entities', '기이한 존재들과의 만남'],
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
    { label: 'ori_other_skills_title', value: 'ori_other_skills', group: '기타 기능' },
  ];

  var cocCommunityAliases = {
    spot_hidden: ['spothidden'],
    fast_talk: ['fasttalk'],
    sleight_of_hand: ['sleightofhand'],
    animal_control: ['animalhandling'],
    mouth_talk: ['readlips'],
    elec_machin: ['electronics'],
    computer: ['computer_use', 'computeruse', 'computer_maint'],
    boom: ['demolitions'],
    mech_repair: ['mechrepair', 'repair/devise'],
    psychology: ['insight'],
    drive_auto: ['drive_wagon', 'drive'],
    natural_world: ['naturalworld'],
    credit_rating: ['status', 'credit'],
    firearms_handgun: ['firearms_handguns'],
    firearms_rifle: ['firearms_r_s'],
    elec_repair: ['elecrepair'],
    op_hv_machine: ['ophvmachine'],
  };

  var cocCommunityFields = [
    { era: '1', attr: 'ownkingdom_da', label: '왕국 지식' },
    { era: '1', attr: 'pilotboat_da', label: '선박 조종' },
    { era: '1', attr: 'religion_da', label: '종교' },
    { era: '1', attr: 'shield_da', labelAttr: 'shield_type_and_name_da', label: '방패' },
    { era: '2', attr: 'acting', label: '연기' },
    { era: '2', attr: 'compute_use', label: '컴퓨터 사용' },
    { era: '2', attr: 'drive_other01', labelAttr: 'drive_other01_name', label: '기타 운전' },
    { era: '2', attr: 'language_other01', labelAttr: 'language_other_name', label: '기타 언어' },
    { era: '2', attr: 'machine_gun', label: '기관총' },
    { era: '2', attr: 'pharmacy', label: '약학' },
    { era: '2', attr: 'submachine_gun', label: '기관단총' },
    { era: '2', attr: 'survival01', labelAttr: 'survival_name', label: '생존술' },
    { era: '3', attr: 'firearms_smg_mdr', label: '사격(기관단총)' },
    { era: '4', attr: 'firearms_s_m_g_et', label: '사격(기관단총)' },
    { era: '4', attr: 'artandcraft_et', labelAttr: 'artandcraft_name_et', label: '예술/공예' },
    { era: '4', attr: 'language(other)_et', labelAttr: 'language(other)_et_name', label: '기타 언어' },
    { era: '4', attr: 'scavenge_et', label: '물자 수색' },
    { era: '4', attr: 'techrepair_et', label: '기술 수리' },
    { era: '5', attr: 'gambling_ow', label: '도박' },
    { era: '5', attr: 'artandcraft_ow', labelAttr: 'artandcraft_name_ow', label: '예술/공예' },
    { era: '5', attr: 'language(other)_ow', labelAttr: 'language(other)_ow_name', label: '기타 언어' },
    { era: '5', attr: 'rope_use_ow', label: '밧줄 사용' },
    { era: '5', attr: 'trap_ow', label: '함정' },
    { era: '6', attr: 'firearms_electr', label: '사격(전자무기)' },
    { era: '6', attr: 'artandcraft_ic', labelAttr: 'artandcraft_name_ic', label: '예술/공예' },
    { era: '6', attr: 'sysops_ic', label: '시스템 운용' },
    { era: '6', attr: 'techrepair_ic', label: '기술 수리' },
    { era: '6', attr: 'zerog_ic', label: '무중력 활동' },
    { era: '7', attr: 'civics_inv', label: '시민학' },
    { era: '7', attr: 'empire_inv', label: '제국 지식' },
    { era: '7', attr: 'pilotboat_inv', label: '선박 조종' },
    { era: '7', attr: 'shield_inv', labelAttr: 'shield_type_and_name_inv', label: '방패' },
  ];

  var cocMajorWoundAttrs = ['major_wound_toggle', 'major-wound-toggle', 'major_wound', 'majorwound'];

  var cocCommunityEras = {
    1: { suffix: '_da', skillSection: 'skillsda', weaponSection: 'weaponsda' },
    2: { suffix: '', skillSection: 'skills', weaponSection: 'weapons' },
    3: { suffix: '_mdr', skillSection: 'skillsmdr', weaponSection: 'weaponsmdr' },
    4: { suffix: '_et', skillSection: 'skillset', weaponSection: 'weaponset' },
    5: { suffix: '_ow', skillSection: 'skillset', weaponSection: 'weaponsow' },
    6: { suffix: '_ic', skillSection: 'skillsic', weaponSection: 'weaponsic' },
    7: { suffix: '_inv', skillSection: 'skillsinv', weaponSection: 'weaponsinv' },
  };

  function cocSchema(read, attributeIndex) {
    var names = Object.keys(attributeIndex || {});
    function has(name) { return own(attributeIndex || {}, name); }
    var isNameSchema = has('showskills') || has('weapon1_name') || has('major_wound_toggle') ||
      has('major_wound') || has('majorwound') ||
      names.some(function (name) {
        return /^repeating_(?:skills|skillsinv|skillsda|skillsmdr|skillsic|skillset|weapons|weaponsinv|weaponsda|weaponsmdr|weaponsic|weaponsow|weaponset|spells)_.+_(?:skillname|weaponname|spellname)(?:_(?:inv|da|ow|mdr|et|ic))?$/.test(name);
      });
    var era = trim(has('showskills') ? read('showskills') : '') || '2';
    var selected = cocCommunityEras[era] || cocCommunityEras[2];
    var selectedEraPresent = selected.suffix ? names.some(function (name) {
      return name.indexOf(selected.suffix) !== -1;
    }) : read('cthulhu_mythos') !== undefined || names.some(function (name) {
      return name.indexOf('repeating_skills_') === 0 || name.indexOf('repeating_weapons_') === 0;
    });
    if (isNameSchema && !selectedEraPresent) {
      var inferredEras = Object.keys(cocCommunityEras).filter(function (id) {
        return read('cthulhu_mythos' + cocCommunityEras[id].suffix) !== undefined;
      });
      if (inferredEras.length === 1) {
        era = inferredEras[0];
        selected = cocCommunityEras[era];
      }
    }
    var majorWound = cocMajorWoundAttrs.filter(has)[0];
    return {
      id: isNameSchema ? 'name' : 'subject',
      officialLegacy: has('showskills'),
      era: era,
      suffix: isNameSchema ? selected.suffix : '',
      skillSection: isNameSchema ? selected.skillSection : '',
      weaponSection: isNameSchema ? selected.weaponSection : '',
      majorWound: majorWound || (isNameSchema ? 'major_wound_toggle' : 'major-wound-toggle'),
    };
  }

  function cocField(definition, read, schema) {
    var roots = [definition[0]].concat(cocCommunityAliases[definition[0]] || []);
    var candidates = roots;
    if (schema.id === 'name' && definition[2] === '기능' && schema.suffix)
      candidates = roots.map(function (name) { return name + schema.suffix; });
    var attr = '';
    var value;
    for (var i = 0; i < candidates.length; i++) {
      value = read(candidates[i]);
      if (value === undefined) continue;
      attr = candidates[i];
      break;
    }
    if (!attr) return null;
    return {
      key: attr,
      attr: attr,
      label: definition[1],
      group: definition[2],
      aliases: definition[3] || [],
      value: value,
      custom: false,
    };
  }

  function cocScan(character, objects) {
    var characterId = character.id;
    var attributeIndex = dictionary();
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
    function readIndexed(name, valueType) {
      var indexed = attributeIndex[name];
      return indexed ? indexed[valueType == 'max' ? 'max' : 'current'] : undefined;
    }
    var schema = cocSchema(read, attributeIndex);
    var subjectTemplate = schema.id === 'subject' ? read('template_common') : undefined;
    schema.hasFreeDice = schema.id === 'subject' && subjectTemplate !== undefined;
    schema.specialTemplate = schema.hasFreeDice && read('template_other') !== undefined ? 'cocOther' : 'coc';
    var fields = cocFields.map(function (definition) {
      return cocField(definition, read, schema);
    }).filter(Boolean);
    var warnings = [];
    function appendRepeatingChecks(definition) {
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
    }
    if (schema.id === 'subject') {
    cocSingleChecks.forEach(function (definition) {
      var label = trim(readIndexed(definition.label));
      var value = readIndexed(definition.value);
        if (!label || value === undefined) return;
        fields.push({ key: definition.value, attr: definition.value, label: label, group: definition.group, aliases: [], value: value, custom: true });
      });
      cocRepeatingChecks.forEach(appendRepeatingChecks);
      appendRepeatingChecks({
        section: 'skills', labels: ['other_skills_title'], value: 'other_skills', group: '기타 기능',
      });
    } else {
      appendRepeatingChecks({
        section: schema.skillSection,
        labels: ['skillname' + schema.suffix],
        value: 'skill' + schema.suffix,
        group: '사용자 기능',
      });
      cocCommunityFields.forEach(function (definition) {
        if (definition.era !== schema.era || readIndexed(definition.attr) === undefined) return;
        var label = trim(definition.labelAttr && readIndexed(definition.labelAttr)) || definition.label;
        fields.push({
          key: definition.attr, attr: definition.attr, label: label, group: '기능',
          aliases: [], value: readIndexed(definition.attr), custom: !!definition.labelAttr,
        });
      });
      Object.keys(attributeIndex).forEach(function (labelAttr) {
        if (!/^(?:artandcraft\d*|fightspec\d+|fighting_other|firearms_other|otherkingdom\d+|otherlanguage\d+|readandwritelang\d+|otherskill\d+)(?:_(?:inv|da|ow|mdr|et|ic))?_name$/.test(labelAttr)) return;
        var valueAttr = labelAttr.substring(0, labelAttr.length - 5);
        var eraSuffix = valueAttr.match(/_(?:inv|da|ow|mdr|et|ic)$/);
        if ((schema.suffix && (!eraSuffix || eraSuffix[0] !== schema.suffix)) || (!schema.suffix && eraSuffix)) return;
        var label = trim(read(labelAttr));
        var value = read(valueAttr);
        if (!label || value === undefined || fields.some(function (item) { return item.attr === valueAttr; })) return;
        fields.push({ key: valueAttr, attr: valueAttr, label: label, group: '사용자 기능', aliases: [], value: value, custom: true });
      });
    }

    var weapons = [];
    var spells = [];
    if (schema.id === 'subject') {
      var weaponFields = ['weapon_name', 'weapon_skill', 'weapon_damage', 'weapon_db', 'weapon_range', 'weapon_attacks', 'weapon_ammo', 'weapon_malf'];
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
      for (var subjectWeaponIndex = 1; subjectWeaponIndex <= 4; subjectWeaponIndex++) {
        var subjectSuffix = '0' + subjectWeaponIndex;
        var subjectName = trim(readIndexed('weapon_name_' + subjectSuffix));
        if (!subjectName) continue;
        weapons.push({
          key: 'weapon_name_' + subjectSuffix, label: subjectName, aliases: [],
          skill: readIndexed('weapon_skill_' + subjectSuffix), damage: readIndexed('weapon_damage_' + subjectSuffix),
          db: readIndexed('weapon_db_' + subjectSuffix), range: readIndexed('weapon_range_' + subjectSuffix),
          attacks: readIndexed('weapon_attacks_' + subjectSuffix), ammo: readIndexed('weapon_ammo_' + subjectSuffix),
          malf: readIndexed('weapon_malf_' + subjectSuffix), ammoAttr: 'weapon_ammo_' + subjectSuffix,
          ammoRef: 'weapon_ammo_' + subjectSuffix,
          details: [
            ['기능', readIndexed('weapon_skill_' + subjectSuffix)],
            ['피해', trim(readIndexed('weapon_damage_' + subjectSuffix)) + trim(readIndexed('weapon_db_' + subjectSuffix))],
            ['사거리', readIndexed('weapon_range_' + subjectSuffix)], ['공격 횟수', readIndexed('weapon_attacks_' + subjectSuffix)],
            ['탄약', readIndexed('weapon_ammo_' + subjectSuffix)], ['고장', readIndexed('weapon_malf_' + subjectSuffix)],
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
          ammo: row.values.weapon_ammo, malf: row.values.weapon_malf,
          ammoAttr: row.names.weapon_ammo || '', ammoRef: row.refs.weapon_ammo || row.names.weapon_ammo || '',
          details: [
            ['기능', row.values.weapon_skill], ['피해', trim(row.values.weapon_damage) + trim(row.values.weapon_db)],
            ['사거리', row.values.weapon_range], ['공격 횟수', row.values.weapon_attacks],
            ['탄약', row.values.weapon_ammo], ['고장', row.values.weapon_malf],
          ],
        });
      });
      collectRows(characterId, 'magic', ['magic_flag', 'magic_name', 'magic_time', 'magic_cost', 'magic_condition', 'magic_desc'], objects).forEach(function (row, index) {
        var name = trim(row.values.magic_name);
        if (!name) {
          if (Object.keys(row.names).length) warnings.push('주문 ' + (index + 1) + ' 이름이 비어 있습니다.');
          return;
        }
        spells.push({
          key: row.names.magic_name || 'repeating_magic_' + row.id + '_magic_name',
          label: name, aliases: [], time: row.values.magic_time, cost: row.values.magic_cost,
          condition: row.values.magic_condition, desc: row.values.magic_desc,
          details: [['시전 시간', row.values.magic_time], ['비용', row.values.magic_cost], ['발동조건', row.values.magic_condition], ['설명', row.values.magic_desc]],
        });
      });
    } else {
      var brawl = fields.filter(function (item) { return item.label === '근접전(격투)'; })[0];
      if (brawl) {
        weapons.push({
          key: 'unarmed', label: '비무장', aliases: [trim(readIndexed('unarmed_txt'))],
          skill: '@{' + brawl.attr + '}', damage: '1d3', db: '+@{damage_bonus}',
          range: '-', attacks: '1', ammo: '-', malf: '-', ammoAttr: '', ammoRef: '',
          details: [['기능', brawl.label], ['피해', '1d3+피해 보너스']],
        });
      }
      for (var weaponIndex = 1; weaponIndex <= 5; weaponIndex++) {
        var fixedPrefix = 'weapon' + weaponIndex + schema.suffix;
        var officialName = trim(readIndexed(fixedPrefix + '_name'));
        if (!officialName) continue;
        weapons.push({
          key: fixedPrefix + '_name', label: officialName, aliases: [],
          skill: readIndexed(fixedPrefix + '_skill'), damage: readIndexed(fixedPrefix + '_damage'), db: readIndexed(fixedPrefix + '_db'),
          range: readIndexed(fixedPrefix + '_range'), attacks: readIndexed(fixedPrefix + '_attacks'),
          ammo: readIndexed(fixedPrefix + '_ammo'), malf: readIndexed(fixedPrefix + '_malf'),
          extraDamage: readIndexed(fixedPrefix + '_extdamage'),
          ammoAttr: fixedPrefix + '_ammo', ammoRef: fixedPrefix + '_ammo',
          details: [
            ['기능', readIndexed(fixedPrefix + '_skill')], ['피해', trim(readIndexed(fixedPrefix + '_damage')) + trim(readIndexed(fixedPrefix + '_db'))],
            ['사거리', readIndexed(fixedPrefix + '_range')], ['공격 횟수', readIndexed(fixedPrefix + '_attacks')],
            ['탄약', readIndexed(fixedPrefix + '_ammo')], ['고장', readIndexed(fixedPrefix + '_malf')],
          ],
        });
      }
      var officialWeaponFields = ['weaponname', 'weaponskill', 'weapondamage', 'weapondb', 'weaponrange', 'weaponattacks', 'weaponammo', 'weaponmalf', 'weaponextdamage']
        .map(function (name) { return name + schema.suffix; });
      collectRows(characterId, schema.weaponSection, officialWeaponFields, objects).forEach(function (row, index) {
        var nameField = 'weaponname' + schema.suffix;
        var skillField = 'weaponskill' + schema.suffix;
        var damageField = 'weapondamage' + schema.suffix;
        var dbField = 'weapondb' + schema.suffix;
        var rangeField = 'weaponrange' + schema.suffix;
        var attacksField = 'weaponattacks' + schema.suffix;
        var ammoField = 'weaponammo' + schema.suffix;
        var malfField = 'weaponmalf' + schema.suffix;
        var extraDamageField = 'weaponextdamage' + schema.suffix;
        var officialName = trim(row.values[nameField]);
        if (!officialName) {
          if (Object.keys(row.names).length) warnings.push('무기 ' + (index + 1) + ' 이름이 비어 있습니다.');
          return;
        }
        weapons.push({
          key: row.names[nameField],
          scopes: ['repeating_' + schema.weaponSection + '_' + row.id + '_', 'repeating_' + schema.weaponSection + '_$' + index + '_'],
          label: officialName, aliases: [], skill: row.values[skillField], damage: row.values[damageField],
          db: row.values[dbField], range: row.values[rangeField], attacks: row.values[attacksField],
          ammo: row.values[ammoField], malf: row.values[malfField],
          extraDamage: row.values[extraDamageField],
          ammoAttr: row.names[ammoField] || '', ammoRef: row.refs[ammoField] || row.names[ammoField] || '',
          details: [
            ['기능', row.values[skillField]], ['피해', trim(row.values[damageField]) + trim(row.values[dbField])],
            ['사거리', row.values[rangeField]], ['공격 횟수', row.values[attacksField]],
            ['탄약', row.values[ammoField]], ['고장', row.values[malfField]],
          ],
        });
      });
      collectRows(characterId, 'spells', ['spellname', 'spellcost', 'spellcastime', 'spelldescription'], objects).forEach(function (row, index) {
        var name = trim(row.values.spellname);
        if (!name) {
          if (Object.keys(row.names).length) warnings.push('주문 ' + (index + 1) + ' 이름이 비어 있습니다.');
          return;
        }
        spells.push({
          key: row.names.spellname, label: name, aliases: [], time: row.values.spellcastime,
          cost: row.values.spellcost, desc: row.values.spelldescription,
          details: [['시전 시간', row.values.spellcastime], ['비용', row.values.spellcost], ['설명', row.values.spelldescription]],
        });
      });
    }

    var armors = [];
    for (var armorIndex = 1; armorIndex <= 7; armorIndex++) {
      var suffix = armorIndex < 10 ? '0' + armorIndex : String(armorIndex);
      var armorName = trim(readIndexed('defense_name_' + suffix));
      if (!armorName) continue;
      armors.push({
        key: 'defense_name_' + suffix, label: armorName, aliases: [],
        part: readIndexed('defense_pice_' + suffix), value: readIndexed('defense_value_' + suffix),
        desc: readIndexed('defense_desc_' + suffix),
        details: [
          ['부위', readIndexed('defense_pice_' + suffix)],
          ['방어', readIndexed('defense_value_' + suffix)],
          ['설명', readIndexed('defense_desc_' + suffix)],
        ],
      });
    }

    var resources = cocResources.map(function (definition) {
      var attr = definition[0] === 'major-wound-toggle' ? schema.majorWound : definition[0];
      var value = read(attr);
      return value === undefined ? null : {
        key: attr, attr: attr, label: definition[1], aliases: definition[2] || [], value: value,
      };
    }).filter(Boolean);
    var specialDice = [];
    if (schema.officialLegacy) {
      if (enabledValue(readIndexed('toggledr')) === true) {
        specialDice.push({ key: 'dice_roll', label: '자유 주사위', kind: 'free', command: '자유주사위' });
        specialDice.push({ key: 'hit-location', label: '명중부위', kind: 'hit-location', command: '명중부위' });
      }
      specialDice.push(
        { key: 'madness-realtime', label: '광기 발작 실시간', kind: 'madness', type: '1', command: '광기실시간' },
        { key: 'madness-summary', label: '광기 발작 요약', kind: 'madness', type: '2', command: '광기요약' },
      );
    } else {
      if (readIndexed('free_dice') !== undefined || schema.hasFreeDice)
        specialDice.push({ key: 'free_dice', label: '자유 주사위', kind: 'free', command: '자유주사위' });
      if (readIndexed('rand_maddess') !== undefined)
        specialDice.push(
          { key: 'madness-realtime', label: '광기 발작 실시간', kind: 'madness', type: '1', command: '광기실시간' },
          { key: 'madness-summary', label: '광기 발작 요약', kind: 'madness', type: '2', command: '광기요약' },
        );
    }
    var madnessHistory = cocMadnessHistory.map(function (definition) {
      var value = readIndexed(definition[0]);
      return value === undefined && !schema.officialLegacy
        ? null
        : { key: definition[0], attr: definition[0], label: definition[1], value: value === undefined ? '' : value };
    }).filter(Boolean);
    return {
      schema: schema, fields: fields, resources: resources, weapons: weapons, spells: spells, armors: armors,
      specialDice: specialDice, madnessHistory: madnessHistory, warnings: warnings,
    };
  }

  function cocCheckAction(context) {
    var mode = modeInfo(context.character.id, context.mode, context.schema);
    var expression = resolvedRollExpression(
      context.character.id,
      context.value,
      context.item.scopes || [],
    );
    if (!expression) return { ok: false, error: context.item.label + ' 판정식을 계산하지 못했습니다.' };
    var nameSchema = context.schema && context.schema.id === 'name';
    var template = context.schema && context.schema.officialLegacy && mode.id === 'normal' ? 'coc-1' : 'coc';
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:' + template + '} ' + commonTemplate(context.character) +
        ' {{' + (nameSchema ? 'name' : 'subject') + '=' + safeTemplateText(context.item.label) + '}}' +
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
    var nameSchema = context.schema && context.schema.id === 'name';
    var mode = modeInfo(characterId, '', context.schema);
    var template = context.schema && context.schema.officialLegacy && mode.id === 'normal'
      ? 'coc-attack-1'
      : (nameSchema ? 'coc-attack' : 'coc');
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:' + template + '} ' + commonTemplate(context.character) +
        ' {{' + (nameSchema ? 'name' : 'subject') + '=' + safeTemplateText(weapon.label) + '}}' +
        ' {{success=[[(' + skill + ')]]}}' +
        ' {{hard=[[floor((' + skill + ')/2)]]}}' +
        ' {{extreme=[[floor((' + skill + ')/5)]]}} ' + mode.fragment +
        ' {{damage=[[' + damage + ']]}}' +
        (trim(weapon.extraDamage) ? ' {{extdamage=' + safeTemplateText(weapon.extraDamage) + '}}' : '') +
        (trim(weapon.malf) ? ' {{malf=' + safeTemplateText(weapon.malf) + '}}' : ''),
      payload: { value: trim(weapon.skill), mode: mode.id },
    };
  }

  function cocSpellAction(context) {
    var spell = context.item;
    if (context.schema && context.schema.id === 'name') {
      return {
        ok: true,
        immediate: true,
        content:
          (context.secret ? '/w gm ' : '') +
          '&{template:default} {{name=' + safeTemplateText(spell.label) + '}}' +
          ' {{시전 시간=' + safeTemplateText(spell.time) + '}}' +
          ' {{비용=' + safeTemplateText(spell.cost) + '}}' +
          ' {{설명=' + safeTemplateText(spell.desc) + '}}',
      };
    }
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:coc} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(spell.label) + '}} {{side_subject=주문}}' +
          ' {{magic_time=' + safeTemplateText(spell.time) + '}}' +
          ' {{magic_cost=' + safeTemplateText(spell.cost) + '}}' +
          (trim(spell.condition) ? ' {{magic_condition=' + safeTemplateText(spell.condition) + '}}' : '') +
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
    var attr = context.item && context.item.key || (context.schema && context.schema.officialLegacy ? 'dice_roll' : 'free_dice');
    var raw = context.expression === undefined ? getAttr(context.character.id, attr) : trim(context.expressionLabel);
    if (raw === undefined) return { ok: false, error: '현재 시트에 자유 주사위 항목이 없습니다.' };
    var expression = context.expression === undefined
      ? resolvedRollExpression(context.character.id, raw, [])
      : context.expression;
    if (!expression) return { ok: false, error: '시트의 자유 주사위 식이 올바르지 않습니다.' };
    if (context.schema && context.schema.officialLegacy)
      return {
        ok: true,
        content:
          (context.secret ? '/w gm ' : '') +
          '&{template:coc-dice-roll} {{name=Rolling ' + safeTemplateText(raw) + '}} {{diceroll=[[' + expression + ']]}}',
        payload: { expression: expression },
      };
    return {
      ok: true,
      content:
        (context.secret ? '/w gm ' : '') +
        '&{template:' + (context.schema && context.schema.specialTemplate || 'coc') + '} ' + commonTemplate(context.character) +
        ' {{subject=' + safeTemplateText(raw) + '}} {{free_roll=[[' + expression + ']]}}',
      payload: { expression: expression },
    };
  }

  function cocMadnessAction(context) {
    if (context.schema && context.schema.officialLegacy) {
      var officialType = trim(context.forcedType || '1');
      if (!/^[12]$/.test(officialType))
        return { ok: false, error: '광기 발작은 실시간 또는 요약으로 골라 주세요.' };
      var isSummary = officialType === '2';
      var era = String(context.schema.era || '2');
      var prefix = 'coc-bomadness-';
      var fields = isSummary
        ? ' {{roll1=[[1d10]]}} {{hours=[[1d10cs1cf10]]}} {{tables=[[1d100cs1cf100]]}} {{under=[[1d10cs1cf10]]}}'
        : ' {{roll1=[[1d10]]}} {{rounds=[[1d10cs1cf10]]}} {{tables=[[1d100cs1cf100]]}} {{under=[[1d10cs1cf10]]}}';
      if (enabledValue(getAttr(context.character.id, 'pulp_bomtoggle')) === true) {
        prefix = 'coc-pulp-bomadness-';
      } else if (era === '2' && enabledValue(getAttr(context.character.id, 'mixedbom')) === true) {
        prefix = 'coc-mixed-bomadness-';
        fields = isSummary
          ? ' {{roll1=[[1d10]]}} {{hours=[[1d10cs1cf10]]}} {{tables=[[1d100cs1cf100]]}} {{under=[[1d10cs1cf10]]}}'
          : ' {{roll1=[[1d15]]}} {{rounds=[[1d10cs1cf10]]}} {{tables=[[1d100cs1cf100]]}} {{under=[[1d10cs1cf10]]}}';
      } else if (['1', '4', '5', '7'].indexOf(era) > -1) {
        prefix = 'coc-bomadness-da-';
        fields = isSummary ? ' {{roll1=[[1D10]]}}' : ' {{roll1=[[1D10]]}} {{rounds=[[1d10]]}}';
      }
      return {
        ok: true,
        content: (context.secret ? '/w gm ' : '') + '&{template:' + prefix + (isSummary ? 'summ' : 'rt') + '}' + fields,
        payload: { label: isSummary ? '광기 발작 요약' : '광기 발작 실시간', madnessType: Number(officialType) },
      };
    }
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
        '&{template:' + (context.schema && context.schema.specialTemplate || 'coc') + '} ' + commonTemplate(context.character) +
        ' {{madness_type=[[' + type + ']]}} {{rand_roll=[[1d10]]}} {{rand_roll2=[[1d10]]}}',
      payload: { label: type === 2 ? '광기 발작 요약' : '광기 발작 실시간', madnessType: type },
    };
  }

  function cocHitLocationAction(context) {
    if (!context.schema || !context.schema.officialLegacy)
      return { ok: false, error: '현재 시트에서 명중부위 주사위를 찾지 못했습니다.' };
    return {
      ok: true,
      content: (context.secret ? '/w gm ' : '') + '&{template:coc-body-hit-loc} {{roll1=[[1D20]]}}',
      payload: { label: '명중부위' },
    };
  }

  registerProfile({
    id: 'coc7',
    name: 'CoC 7판 시트',
    minimumScore: 9,
    markers: { san: 3, cthulhu_mythos: 3, luck: 2, str: 1, dex: 1, pow: 1 },
    markerAliases: {
      cthulhu_mythos: Object.keys(cocCommunityEras).map(function (id) {
        return 'cthulhu_mythos' + cocCommunityEras[id].suffix;
      }).filter(function (name) { return name !== 'cthulhu_mythos'; }),
    },
    tracked: {
      hp: '체력', mp: '마력', san: '이성', luck: '행운', str: '근력', con: '건강', siz: '크기',
      dex: '민첩성', app: '외모', edu: '교육', int: '지능', pow: '정신력', cthulhu_mythos: '크툴루 신화',
      dying: '빈사', 'major-wound-toggle': '중상', major_wound_toggle: '중상', major_wound: '중상', majorwound: '중상',
      temp_insane: '일시적 광기', indef_insane: '장기 광기',
    },
    changeable: ['hp', 'mp', 'san', 'luck', 'dying', 'major-wound-toggle', 'major_wound_toggle', 'major_wound', 'majorwound', 'temp_insane', 'indef_insane'],
    binaryResources: ['dying', 'major-wound-toggle', 'major_wound_toggle', 'major_wound', 'majorwound', 'temp_insane', 'indef_insane'],
    resourceMaximums: { hp: 'hp_max', mp: 'mp_max', san: 'san_start' },
    actions: {
      check: cocCheckAction,
      weapon: cocWeaponAction,
      spell: cocSpellAction,
      armor: cocArmorAction,
      free: cocFreeAction,
      madness: cocMadnessAction,
      hitLocation: cocHitLocationAction,
    },
    result: cocResult,
    relevant: function (name) {
      if (cocFields.some(function (item) { return item[0] === name; })) return true;
      if (cocFields.some(function (item) { return item[0] + '_mod' === name; })) return true;
      if (cocFields.some(function (item) {
        return [item[0]].concat(cocCommunityAliases[item[0]] || []).some(function (root) {
          return ['', '_inv', '_da', '_ow', '_mdr', '_et', '_ic'].some(function (suffix) {
            return name === root + suffix || name === root + suffix + '_mod';
          });
        });
      })) return true;
      if (cocResources.some(function (item) { return item[0] === name; })) return true;
      if (cocMadnessHistory.some(function (item) { return item[0] === name; })) return true;
      if (cocSingleChecks.some(function (item) { return item.label === name || item.value === name; })) return true;
      if (cocSingleChecks.some(function (item) { return item.value + '_mod' === name; })) return true;
      if (cocCommunityFields.some(function (item) { return item.attr === name || item.labelAttr === name; })) return true;
      if (/^(?:showskills|toggledr|dice_roll|free_dice|rand_maddess|template_other|pulp_bomtoggle|mixedbom|major_wound_toggle|major_wound|majorwound)$/.test(name)) return true;
      if (/^(?:weapon[1-5](?:_(?:inv|da|ow|mdr|et|ic))?_(?:name|skill|damage|db|range|attacks|ammo|malf|extdamage))$/.test(name)) return true;
      if (/^weapon_(?:name|skill|damage|db|range|attacks|ammo|malf)_0[1-4]$/.test(name)) return true;
      if (/^(?:artandcraft\d*|fightspec\d+|fighting_other|firearms_other|otherkingdom\d+|otherlanguage\d+|readandwritelang\d+|otherskill\d+)(?:_(?:inv|da|ow|mdr|et|ic))?(?:_name)?$/.test(name)) return true;
      return /^repeating_(?:science|foreign|art|live|other_control|other_weapon|skills|skillsinv|skillsda|skillsmdr|skillsic|skillset|weapon|weapons|weaponsinv|weaponsda|weaponsmdr|weaponsic|weaponsow|weaponset|magic|spells)_/.test(name) ||
        /^_reporder_repeating_(?:science|foreign|art|live|other_control|other_weapon|skills|skillsinv|skillsda|skillsmdr|skillsic|skillset|weapon|weapons|weaponsinv|weaponsda|weaponsmdr|weaponsic|weaponsow|weaponset|magic|spells)$/.test(name) ||
        /^defense_(?:name|pice|value|desc)_\d\d$/.test(name) ||
        /^weapon_(?:name|range|attacks|ammo|malf)_fix$/.test(name);
    },
    scan: cocScan,
  });

  function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: instance.label + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      var instance = entries[index].instance;
      var source = [instance.roll.name, instance.roll.template].map(trim).filter(Boolean).join(' / ') || instance.roll.key;
      choice.label += ' [' + source + ']';
      var distinct = normalize(choice.label);
      used[distinct] = (used[distinct] || 0) + 1;
      if (used[distinct] > 1) choice.label += ' #' + used[distinct];
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var failed = '';
    var expansions = 0;
    function expand(fragment, depth, trail) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        if (!maximum && own(overrides, name)) {
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var actual = getAttr(characterId, fullName, maximum ? 'max' : 'current');
        if (actual !== undefined && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail);
        }
        if (actual !== undefined) return String(actual);
        return '@{' + characterId + '|' + fullName + (maximum ? '|max' : '') + '}';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {});
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 시트 모드가 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트 선택값과 맞는 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractModeLabels(mode) : [];
    var content = qualified.content;
    var profile = activeProfile();
    var system = sheetResultSystem(profile, character.id);
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(system, instance),
      mode: mode ? String(mode.id || '') : '',
      modeLabel: modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched') return { ok: false, error: '현재 캐릭터에서 사용할 시트 정보를 찾지 못했습니다.' };
    if (String(inspection.contract.id) !== String(contractId))
      return { ok: false, error: '선택한 시트 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = contractRolls(characterId, inspection, null, !!includeHidden).filter(function (instance) {
      return String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 시트 롤 또는 반복 행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 시트 롤은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible) {
    var found = dictionary();
    var result = [];
    (instance.aliases || []).forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible) {
    var actionAliases = contractInstanceAliases(instance, compatible);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractModeLabels(mode).filter(function (label) {
        return humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
      }).forEach(function (label) { modeAliases = modeAliases.concat(contractLookupKeys(label, compatible)); });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.key + '|' + String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function preferDirectContractActions(instances, compatible) {
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[candidate.instance.key];
    });
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous') return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched') return { handled: false, result: null };
    var instances = contractRolls(character.id, inspection, null, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; })));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    if (exact.length > 1) return { handled: true, result: contractConflict(exact, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var modes = [];
    instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
    var partialModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
      return contractKeysMatch(candidate.partialValues, wanted, true);
    })));
    var partialActions = preferDirectContractActions(instances.filter(function (instance) {
      if (instance.hidden) return false;
      return contractKeysMatch(contractInstanceAliases(instance, true), wanted, true);
    }), true);
    var partial = uniqueContractCandidates(partialModes.concat(partialActions.map(function (instance) { return { instance: instance }; })));
    if (partial.length === 1)
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = contractRolls(character.id, inspection).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  function contractRollDisplayValue(characterId, instance) {
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var raw = getAttr(characterId, fullName, valueType || 'current');
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 계약목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 계약선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (data.contractMatch && data.contractMatch.status === 'matched') {
      var counts = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data.characterId, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    } else {
      [
        ['check', data.fields],
        ['weapon', data.weapons],
        ['spell', data.spells],
        ['armor', data.armors],
      ].forEach(function (group) {
        (group[1] || []).forEach(function (item) {
          result.push({
            kind: group[0],
            label: item.label,
            aliases: [item.key, item.attr].concat(item.aliases || []),
            value: item.value === undefined ? '' : resolvedResourceValue(data.characterId, item.value).text,
            details: item.details || [],
            command: '!시트 선택|' + encodeURIComponent(data.characterId) + '|' + group[0] + '|' +
              encodeURIComponent(item.key) + '|0|',
          });
        });
      });
      (data.specialDice || []).forEach(function (item) {
        result.push({ kind: 'special', label: item.label, aliases: [item.key], value: '', command: '!!' + item.command });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function visibleResources(data) {
    var profile = activeProfile();
    var pairedMaximums = dictionary();
    Object.keys(profile.resourceMaximums || {}).forEach(function (name) {
      pairedMaximums[profile.resourceMaximums[name]] = true;
    });
    return (data.profileMatched ? data.resources : []).filter(function (item) {
      return !pairedMaximums[item.attr];
    }).map(function (item) {
      return {
        kind: 'resource',
        label: item.label,
        aliases: [item.attr].concat(item.aliases || []),
        value: displayResourceValue(profile, data.characterId, item.attr, item.value),
      };
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat(visibleResources(data));
    if (data.profileMatched)
      (data.madnessHistory || []).forEach(function (item) {
        items.push({ kind: 'record', label: item.label, aliases: [item.key], value: trim(item.value) || '비어 있음' });
      });
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구', special: '주사위', contract: '굴림', resource: '수치', record: '기록' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

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
          : '') + '</td>' +
        '<td style="padding:4px;text-align:right">' +
        (item.value !== undefined ? '<b>' + escapeHtml(item.value) + '</b> ' : '') +
        button('실행', '!시트 내부' + action + '|' + characterId + '|' + item.key, '#287a4b') +
        (extra ? extra(item) : '') + '</td></tr>';
    }).join('') + '</table>';
  }

  function cutinItems() {
    var profile = activeProfile();
    var found = dictionary();
    function add(item, kind, system, key, characterName) {
      system = system || (profile && profile.id) || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    characterObjects().forEach(function (character) {
      if (!profile || (!profileMatches(profile, character.id) && inspectContracts(character.id).status !== 'matched')) return;
      var data = scan(character.id);
      if (data.contractMatch.status === 'matched') {
        var contractSystem = sheetResultSystem(profile, character.id);
        data.contractRolls.forEach(function (instance) {
          add(
            { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
            instance.roll.kind || 'contract',
            contractSystem,
            contractCutinKey(contractSystem, instance),
            character.get('name'),
          );
        });
      } else {
        data.fields.forEach(function (item) { add(item, 'field'); });
        data.weapons.forEach(function (item) { add(item, 'weapon'); });
        data.spells.forEach(function (item) { add(item, 'spell'); });
        data.armors.forEach(function (item) { add(item, 'armor'); });
        data.specialDice.forEach(function (item) { add(item, item.kind); });
      }
    });
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      item.displayLabel = item.label + ' (' + (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function cutinControlsHtml() {
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    return cutin && typeof cutin.sheetControls === 'function'
      ? cutin.sheetControls(cutinItems())
      : '';
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
      var hasContract = selected.contractMatch.status === 'matched';
      if (hasContract) {
        var modesIncomplete = (selected.contractMatch.contract.rolls || []).some(function (roll) {
          return roll && roll.modesIncomplete === true;
        });
        var contractLabelCounts = dictionary();
        selected.contractRolls.forEach(function (instance) {
          var key = normalize(instance.label);
          if (key) contractLabelCounts[key] = (contractLabelCounts[key] || 0) + 1;
        });
        var seenContractLabels = dictionary();
        var contractButtons = selected.contractRolls.filter(function (instance) {
          var key = normalize(instance.label);
          if (!key || seenContractLabels[key]) return false;
          seenContractLabels[key] = true;
          return true;
        });
        var visibleContractButtons = contractButtons.slice(0, 50);
        body += section('시트에서 인식한 항목', '<b>' + escapeHtml(selected.contractMatch.contract.name || selected.contractMatch.contract.id) + '</b><br>' +
          '굴림 ' + selected.contractRolls.length + '개 / 서로 다른 이름 ' + contractButtons.length + '개<br>' +
          (modesIncomplete
            ? '<span style="color:#9b3d2f">일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.</span><br>'
            : '') +
          visibleContractButtons.map(function (instance) {
            var count = contractLabelCounts[normalize(instance.label)] || 1;
            var command = contractSelectionCommand(selected.characterId, instance, count, false);
            return button(
              instance.label + (count > 1 ? ' (' + count + '개)' : ''),
              command,
              '#111',
            );
          }).join(' ') +
          (contractButtons.length > visibleContractButtons.length
            ? '<br><span style="color:#777">외 ' + (contractButtons.length - visibleContractButtons.length) + '개는 <code>!!이름</code>으로 검색할 수 있습니다.</span>'
            : ''));
      } else {
        body += section('판정 항목', itemRows(selected.characterId, selected.fields, '판정'));
        body += section('무기', itemRows(selected.characterId, selected.weapons, '무기', function (item) {
          return item.ammoAttr ? button('탄약', '!시트 내부탄약|' + selected.characterId + '|' + item.key + '|?{변경값|-1}', '#a16d1a') : '';
        }));
        body += section('주문', itemRows(selected.characterId, selected.spells, '주문'));
        body += section('방어구', itemRows(selected.characterId, selected.armors, '방어구'));
        var specialButtons = selected.specialDice.map(function (item) {
          var color = item.kind === 'free' ? '#287a4b' : item.kind === 'madness' ? '#7654a8' : '#53657d';
          return button(item.label, '!시트 내부' + item.command + '|' + selected.characterId, color);
        }).join('');
        if (specialButtons) body += section('시트 주사위', specialButtons);
      }
      if (selected.profileMatched && selected.resources.length)
        body += section('수치', '<table style="width:100%">' + selected.resources.map(function (item) {
          return '<tr><td>' + escapeHtml(item.label) + '</td><td style="text-align:right"><b>' +
            escapeHtml(displayResourceValue(profile, selected.characterId, item.attr, item.value)) + '</b></td></tr>';
        }).join('') + '</table>');
      if (selected.profileMatched && selected.madnessHistory.length)
        body += section('광기 관련 기록', selected.madnessHistory.map(function (item) {
          return '<b>' + escapeHtml(item.label) + '</b><br>' + (trim(item.value) ? escapeHtml(item.value).replace(/\r?\n/g, '<br>') : '<span style="color:#777">비어 있음</span>');
        }).join('<br><br>'));
      var cutinControls = cutinControlsHtml();
      if (cutinControls) body += section('판정 컷인', cutinControls);
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
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 관리 핸드아웃<br>' +
      '<code>!!점검</code> 현재 캐릭터의 시트 인식 상태 확인<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 내 화자로 복귀<br>' +
      '<code>!!명령대상 이름</code> 시트 명령 대상 변경<br>' +
      '<code>!!추적 공개</code> 수치 변화 표시 설정<br>' +
      '<code>!!GM전용추적 끄기</code> GM 전용 캐릭터 변화 숨김</div>';
  }

  function playerHelpHtml() {
    var specialItems = cutinItems().filter(function (item) { return item.command; });
    var contractFree = profileCharacters().some(function (character) {
      return scan(character.id).contractRolls.some(function (instance) {
        return !!contractExpressionRef(character.id, instance);
      });
    });
    var profile = activeProfile();
    var hasLegacyProfile = profile && characterObjects().some(function (character) {
      return profileMatches(profile, character.id);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 선택할이름', '시트에 있는 선택 방식으로 굴립니다. 예: <code>!!관찰력 보너스1</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
    ];
    if (hasLegacyProfile) {
      rows.push(['!!이성 -1d3', '인식된 수치를 변경합니다.']);
      rows.push([':hp+3', '일반 채팅에서 인식된 수치를 변경합니다.']);
    }
    if (contractFree || specialItems.some(function (item) { return item.kind === 'free'; }))
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    specialItems.forEach(function (item) {
      rows.push(['!!' + item.command, escapeHtml(item.label) + ' 굴림']);
    });
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = recognizedRollItems(data);
    var resources = visibleResources(data);
    var modes = sortedUnique(rolls.reduce(function (labels, item) { return labels.concat(item.modes || []); }, []));
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div><div style="padding:8px 10px">인식한 시트: <b>' + escapeHtml(data.profileName) + '</b></div>';
    body += section('굴릴 항목 ' + rolls.length + '개', rolls.length ? rolls.map(function (item) {
      return escapeHtml(item.label) + (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '');
    }).join(', ') : '<span style="color:#777">없음</span>');
    if (modes.length)
      body += section('선택할 수 있는 방식 ' + modes.length + '개', modes.map(escapeHtml).join(', '));
    if (resources.length)
      body += section('수치', '<table style="width:100%;border-collapse:collapse">' + resources.map(function (item) {
        return '<tr><td style="padding:4px;border-bottom:1px solid #ddd">' + escapeHtml(item.label) + '</td><td style="padding:4px;border-bottom:1px solid #ddd;text-align:right"><b>' + escapeHtml(item.value || '-') + '</b></td></tr>';
      }).join('') + '</table>');
    if (data.profileMatched && data.madnessHistory.length)
      body += section('기록', data.madnessHistory.map(function (item) {
        return '<b>' + escapeHtml(item.label) + '</b>: ' + (trim(item.value) ? escapeHtml(item.value).replace(/\r?\n/g, '<br>') : '비어 있음');
      }).join('<br>'));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var rolls = recognizedRollItems(data);
    var modeCount = sortedUnique(rolls.reduce(function (labels, item) { return labels.concat(item.modes || []); }, [])).length;
    var incomplete = data.contractMatch && data.contractMatch.status === 'matched'
      ? (data.contractMatch.contract.rolls || []).filter(function (roll) { return roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', '시트 <b>' + escapeHtml(data.profileName) + '</b><br>굴림 ' + rolls.length + '개 / 선택 방식 ' + modeCount +
        '개 / 수치 ' + visibleResources(data).length + '개') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
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

  function bangBangConflict(candidates, options) {
    var result = {
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
    if (options && options.characterId)
      result.choices = candidates.map(function (candidate) {
        return {
          characterId: options.characterId,
          kind: candidate.kind,
          key: candidate.item.key,
          label: candidate.item.label,
          secret: !!options.secret,
          mode: options.mode || '',
        };
      });
    return result;
  }

  function resolveBangBang(data, query, kinds, options) {
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
    if (exact.length > 1) return bangBangConflict(exact, options);
    var partial = candidates.filter(function (candidate) {
      return candidate.values.some(function (value) {
        var normalized = normalize(value);
        return normalized && (normalized.indexOf(key) > -1 || key.indexOf(normalized) > -1);
      });
    });
    if (partial.length === 1) return { ok: true, candidate: partial[0] };
    if (partial.length > 1) return bangBangConflict(partial, options);
    return {
      ok: false,
      reason: 'missing',
      error:
        '시트에서 ' +
        wanted +
        ' 항목을 찾지 못했습니다. 입력 예: !!관찰력 또는 !!도움말',
    };
  }

  function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 계약선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function bangBangHint(result, example) {
    if (result && result.ok === false)
      result.error += ' 입력 예: ' + example;
    return result;
  }

  function runBangBangItem(character, candidate, secret, mode) {
    if (candidate.kind === 'check')
      return rollCheck(character.id, candidate.item.key, { secret: secret, mode: mode });
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
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환|명령대상|설정|추적|GM전용추적)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var compactSecret = body.match(/^비밀(원본|광기실시간|광기요약|실시간|요약|일시적|장기적|자유주사위|판정|무기|주문|방어구|자유|광기|운결정|명중부위|r)\s*(.*)$/);
    if (compactSecret) {
      secret = true;
      body = compactSecret[1] + (trim(compactSecret[2]) ? ' ' + trim(compactSecret[2]) : '');
    } else if (/^비밀\s+/.test(body)) {
      secret = true;
      body = body.replace(/^비밀\s+/, '');
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) {
      return withCharacter(msg, '', function (character) {
        var contracted = resolveContractAction(character, original[1], secret);
        if (contracted.handled) return contracted.result;
        if (contracted.inspection && contracted.inspection.status === 'matched')
          return { ok: false, error: '현재 시트에서 ' + trim(original[1]) + ' 굴림을 찾지 못했습니다.' };
        return { ok: false, error: '현재 캐릭터에서 사용할 시트 정보를 찾지 못했습니다.' };
      });
    }

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        if (contracted) return contracted;
        return rollFree(character.id, secret, freeExpression[1]);
      });
    }

    var explicit = body.match(/^판정\s*(.+)$/);
    if (explicit) explicit = ['', '판정', explicit[1]];
    else explicit = body.match(/^(무기|주문|방어구)\s+(.+)$/);
    if (explicit) {
      var action = explicit[1];
      var query = trim(explicit[2]);
      return withCharacter(msg, '', function (character) {
        var contracted = resolveContractAction(character, body, secret, { exactOnly: true });
        if (!contracted.handled) contracted = resolveContractAction(character, query, secret);
        if (contracted.handled) return contracted.result;
        if (contracted.inspection && contracted.inspection.status === 'matched')
          return { ok: false, error: '현재 시트에서 ' + query + ' 굴림을 찾지 못했습니다.' };
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
            '!!판정' + query,
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
      ['자유', '자유주사위', '광기', '광기실시간', '광기요약', '실시간', '요약', '일시적', '장기적', '일시광기', '일시적광기', '장기광기', '장기적광기', '운결정', '명중부위'].indexOf(simple) > -1
    ) {
      return withCharacter(msg, '', function (character) {
        var contracted = resolveContractAction(character, body, secret);
        if (contracted.handled) return contracted.result;
        if (contracted.inspection && contracted.inspection.status === 'matched')
          return { ok: false, error: '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.' };
        if (simple === '자유' || simple === '자유주사위') return rollFree(character.id, secret);
        if (simple === '운결정') return rollLuck(character.id, secret);
        if (simple === '명중부위') return rollHitLocation(character.id, secret);
        if (simple === '일시' || simple === '일시적' || simple === '일시광기' || simple === '일시적광기')
          return { ok: false, error: '일시적 광기는 굴림이 아니라 시트 상태입니다. 광기 발작은 !!광기실시간 또는 !!광기요약으로 굴려 주세요.' };
        if (simple === '장기' || simple === '장기적' || simple === '장기광기' || simple === '장기적광기')
          return { ok: false, error: '장기적 광기는 굴림이 아니라 시트 상태입니다. 광기 발작은 !!광기실시간 또는 !!광기요약으로 굴려 주세요.' };
        if (simple === '광기실시간' || simple === '실시간') return rollMadness(character.id, '1', secret);
        if (simple === '광기요약' || simple === '요약') return rollMadness(character.id, '2', secret);
        return rollMadness(character.id, '', secret);
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
      var contracted = resolveContractAction(character, body, secret);
      if (contracted.handled) return contracted.result;
      var contractMatched = contracted.inspection && contracted.inspection.status === 'matched';
      var checked = ensureSheet(character);
      if (!checked.ok)
        return contractMatched
          ? { ok: false, error: '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.' }
          : checked;
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
      var directMode = body.match(
        /^(.+?)\s+((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus[12]|penalty[12]|-?[12])$/i,
      );
      if (directMode && !contractMatched) {
        var directCheck = resolveBangBang(checked.data, directMode[1], ['check'], {
          characterId: character.id, secret: secret, mode: directMode[2],
        });
        if (directCheck.ok)
          return bangBangHint(
            rollCheck(character.id, directMode[1], { secret: secret, mode: directMode[2] }),
            '!!' + trim(directMode[1]) + ' ' + trim(directMode[2]),
          );
        if (directCheck.reason === 'conflict') return directCheck;
      }
      if (contractMatched)
        return { ok: false, error: '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.' };
      var resolved = resolveBangBang(checked.data, body, null, {
        characterId: character.id, secret: secret,
      });
      return resolved.ok
        ? runBangBangItem(character, resolved.candidate, secret, '')
        : resolved;
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, inspectionHtml(checked.data));
        return { ok: true };
      });
    }
    if (action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (inspection.status !== 'matched')
          return { ok: false, error: inspection.error || '현재 캐릭터에서 사용할 시트 정보를 찾지 못했습니다.' };
        var matches = contractRolls(character.id, inspection).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 시트 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '선택') {
      var decodedCharacter = decodeCommandPart(parts[0]);
      var kind = normalize(parts[1]);
      var decodedKey = decodeCommandPart(parts[2]);
      var decodedMode = decodeCommandPart(parts[4]);
      if (!decodedCharacter.ok || !decodedKey.ok || !decodedMode.ok)
        return reportResult(msg, !decodedCharacter.ok ? decodedCharacter : !decodedKey.ok ? decodedKey : decodedMode);
      if (['check', 'weapon', 'spell', 'armor'].indexOf(kind) < 0)
        return reportResult(msg, { ok: false, error: '선택한 시트 항목 종류가 올바르지 않습니다.' });
      return withCharacter(msg, decodedCharacter.value, function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        var group = bangBangGroups(checked.data, [kind])[0];
        var item = group && group.items.filter(function (candidate) {
          return candidate.key === decodedKey.value;
        })[0];
        if (!item) return { ok: false, error: '선택한 항목이 바뀌었습니다. 이름을 다시 입력해 주세요.' };
        return runBangBangItem(character, { kind: kind, item: item }, parts[3] === '1', decodedMode.value);
      });
    }
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
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '명령대상') {
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
      if (internal === '광기실시간') return reportResult(msg, rollMadness(characterId, '1', false));
      if (internal === '광기요약') return reportResult(msg, rollMadness(characterId, '2', false));
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
    if (action === '자유' || action === '자유주사위' || action === '비밀자유' || action === '비밀자유주사위')
      return withCharacter(msg, '', function (character) { return rollFree(character.id, action === '비밀자유' || action === '비밀자유주사위'); });
    if (action === '광기' || action === '비밀광기')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '', action === '비밀광기'); });
    if (action === '광기실시간' || action === '비밀광기실시간')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '1', action === '비밀광기실시간'); });
    if (action === '광기요약' || action === '비밀광기요약')
      return withCharacter(msg, '', function (character) { return rollMadness(character.id, '2', action === '비밀광기요약'); });
    if (action === '일시광기' || action === '일시적광기')
      return withCharacter(msg, '', function () { return { ok: false, error: '일시적 광기는 굴림이 아니라 시트 상태입니다.' }; });
    if (action === '장기광기' || action === '장기적광기')
      return withCharacter(msg, '', function () { return { ok: false, error: '장기적 광기는 굴림이 아니라 시트 상태입니다.' }; });
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
      withCharacter(msg, '', function () { return { ok: false, error: '일시적 광기는 굴림이 아니라 시트 상태입니다.' }; });
      return true;
    }
    if (/^!(?:장기광기|장기적광기|장기)$/.test(content)) {
      withCharacter(msg, '', function () { return { ok: false, error: '장기적 광기는 굴림이 아니라 시트 상태입니다.' }; });
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
    if (!characterId || !profile.tracked[name] || !profileMatches(profile, characterId)) return;
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

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    return sheetContracts().some(function (contract) {
      var index = contractRuntimeIndex(contract);
      return !!index.exact[wanted] || index.prefixes.some(function (prefix) {
        return wanted.indexOf(prefix) === 0;
      });
    });
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var profile = activeProfile();
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    if (previous) trackChange(attribute, previous);
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !(profile && profile.relevant(name)) && !contractRelevant(name))) return;
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
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId, attrObjects(characterId));
  };
  api.contractRolls = function (characterId) {
    var objects = attrObjects(characterId);
    return contractRolls(characterId, inspectContracts(characterId, objects), objects);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
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
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!관리</code> GM용 인식 항목 관리',
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
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
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
