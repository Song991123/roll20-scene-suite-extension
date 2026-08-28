(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KIBSheetContractParser = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var VOID_TAGS = {
    area: true, base: true, br: true, col: true, embed: true, hr: true,
    img: true, input: true, link: true, meta: true, param: true,
    source: true, track: true, wbr: true
  };
  var ENTITIES = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    comma: ',', colon: ':', semi: ';', sol: '/', bsol: '\\', num: '#',
    period: '.', quest: '?', equals: '=', plus: '+', ast: '*', dollar: '$',
    commat: '@', percnt: '%', lbrace: '{', rbrace: '}', vert: '|',
    VerticalLine: '|', verbar: '|'
  };

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function decodeEntities(value) {
    return String(value == null ? '' : value).replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, function (all, entity) {
      if (entity.charAt(0) === '#') {
        var code = entity.charAt(1).toLowerCase() === 'x'
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        if (!isFinite(code) || code < 0 || code > 0x10ffff) return all;
        try { return String.fromCodePoint(code); } catch (_err) { return all; }
      }
      return Object.prototype.hasOwnProperty.call(ENTITIES, entity) ? ENTITIES[entity] : all;
    });
  }

  function normalizeText(value) {
    return decodeEntities(value).replace(/[\s\u00a0]+/g, ' ').trim();
  }

  function shortHash(value) {
    var text = String(value == null ? '' : value);
    var hash = 0x811c9dc5;
    for (var i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    var reverse = 0x811c9dc5;
    for (var j = text.length - 1; j >= 0; j -= 1) {
      reverse ^= text.charCodeAt(j);
      reverse = Math.imul(reverse, 0x01000193) >>> 0;
    }
    return ('00000000' + hash.toString(16)).slice(-8) + ('00000000' + reverse.toString(16)).slice(-8, -4);
  }

  function slug(value) {
    return normalizeText(value).toLowerCase()
      .replace(/[\s.]+/g, '-')
      .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ_-]+/g, '')
      .replace(/^-+|-+$/g, '');
  }

  function findTagEnd(html, start) {
    var quote = '';
    var expectingValue = false;
    var unquotedValue = false;
    for (var i = start + 1; i < html.length; i += 1) {
      var ch = html.charAt(i);
      if (quote) {
        if (ch === quote) quote = '';
      } else if (expectingValue) {
        if (/\s/.test(ch)) continue;
        expectingValue = false;
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === '>') return i;
        else unquotedValue = true;
      } else if (unquotedValue) {
        if (ch === '>') return i;
        if (/\s/.test(ch)) unquotedValue = false;
      } else if (ch === '=') {
        expectingValue = true;
      } else if (ch === '>') {
        return i;
      }
    }
    return html.length - 1;
  }

  function parseOpenTag(body) {
    var i = 0;
    while (/\s/.test(body.charAt(i))) i += 1;
    var nameStart = i;
    while (i < body.length && !/[\s/>]/.test(body.charAt(i))) i += 1;
    var tag = body.slice(nameStart, i).toLowerCase();
    var attrs = dictionary();
    while (i < body.length) {
      while (i < body.length && /\s/.test(body.charAt(i))) i += 1;
      if (i >= body.length || body.charAt(i) === '/') break;
      var attrStart = i;
      while (i < body.length && !/[\s=/>]/.test(body.charAt(i))) i += 1;
      var attrName = body.slice(attrStart, i).toLowerCase();
      while (i < body.length && /\s/.test(body.charAt(i))) i += 1;
      var attrValue = '';
      if (body.charAt(i) === '=') {
        i += 1;
        while (i < body.length && /\s/.test(body.charAt(i))) i += 1;
        var quote = body.charAt(i);
        if (quote === '"' || quote === "'") {
          i += 1;
          var valueStart = i;
          while (i < body.length && body.charAt(i) !== quote) i += 1;
          attrValue = body.slice(valueStart, i);
          if (body.charAt(i) === quote) i += 1;
        } else {
          var bareStart = i;
          while (i < body.length && !/[\s>]/.test(body.charAt(i))) i += 1;
          attrValue = body.slice(bareStart, i);
        }
      }
      if (attrName) attrs[attrName] = decodeEntities(attrValue);
      if (i === attrStart) i += 1;
    }
    return { tag: tag, attrs: attrs, selfClosing: /\/\s*$/.test(body) };
  }

  function parseHtml(html) {
    var source = String(html == null ? '' : html);
    var lower = source.toLowerCase();
    var root = { tag: '#root', attrs: {}, children: [], parent: null };
    var stack = [root];
    var i = 0;
    while (i < source.length) {
      var current = stack[stack.length - 1];
      if ((current.tag === 'script' || current.tag === 'style') && lower.slice(i, i + 2) !== '</') {
        var closeAt = lower.indexOf('</' + current.tag, i);
        if (closeAt < 0) closeAt = source.length;
        if (closeAt > i) current.children.push({ tag: '#text', text: source.slice(i, closeAt), parent: current });
        i = closeAt;
        continue;
      }
      if (source.slice(i, i + 4) === '<!--') {
        var commentEnd = source.indexOf('-->', i + 4);
        i = commentEnd < 0 ? source.length : commentEnd + 3;
        continue;
      }
      if (source.charAt(i) !== '<') {
        var textEnd = source.indexOf('<', i);
        if (textEnd < 0) textEnd = source.length;
        current.children.push({ tag: '#text', text: decodeEntities(source.slice(i, textEnd)), parent: current });
        i = textEnd;
        continue;
      }
      var tagEnd = findTagEnd(source, i);
      var body = source.slice(i + 1, tagEnd);
      if (/^\s*\//.test(body)) {
        var closing = body.replace(/^\s*\//, '').trim().split(/\s/)[0].toLowerCase();
        for (var s = stack.length - 1; s > 0; s -= 1) {
          if (stack[s].tag === closing) {
            stack.length = s;
            break;
          }
        }
      } else if (!/^\s*[!?]/.test(body)) {
        var parsed = parseOpenTag(body);
        if (parsed.tag) {
          if (parsed.tag === 'option' && stack[stack.length - 1].tag === 'option') stack.pop();
          current = stack[stack.length - 1];
          var node = { tag: parsed.tag, attrs: parsed.attrs, children: [], parent: current };
          current.children.push(node);
          if (!parsed.selfClosing && !VOID_TAGS[parsed.tag]) stack.push(node);
        }
      }
      i = tagEnd + 1;
    }
    return root;
  }

  function walk(node, visit) {
    if (node.tag === '#text') return;
    visit(node);
    for (var i = 0; i < node.children.length; i += 1) walk(node.children[i], visit);
  }

  function descendants(node, tag) {
    var found = [];
    walk(node, function (child) {
      if (child !== node && (!tag || child.tag === tag)) found.push(child);
    });
    return found;
  }

  function nodeText(node) {
    // ponytail: labels beyond this bound are layout containers, not useful command names.
    var out = '';
    var visited = 0;
    (function collect(current) {
      if (visited++ >= 200 || out.length >= 300) return;
      for (var i = 0; i < current.children.length; i += 1) {
        if (visited >= 200 || out.length >= 300) break;
        var child = current.children[i];
        if (child.tag === '#text') out += ' ' + child.text;
        else if (child.tag !== 'script' && child.tag !== 'style') collect(child);
      }
    }(node));
    return normalizeText(out).slice(0, 300);
  }

  function labelText(node) {
    var out = '';
    var visited = 0;
    (function collect(current) {
      if (visited++ >= 200 || out.length >= 300) return;
      for (var i = 0; i < current.children.length; i += 1) {
        if (visited >= 200 || out.length >= 300) break;
        var child = current.children[i];
        if (child.tag === '#text') out += ' ' + child.text;
        else if (child.tag !== 'input' && child.tag !== 'select' && child.tag !== 'textarea' && child.tag !== 'button' && child.tag !== 'script' && child.tag !== 'style') collect(child);
      }
    }(node));
    return normalizeText(out).slice(0, 300);
  }

  function hasAttr(node, name) {
    return Object.prototype.hasOwnProperty.call(node.attrs, name);
  }

  function repeatingFieldset(node) {
    for (var current = node.parent; current; current = current.parent) {
      if (current.tag !== 'fieldset') continue;
      var classes = (current.attrs['class'] || '').split(/\s+/);
      for (var i = 0; i < classes.length; i += 1) {
        if (/^repeating_[a-z0-9_-]+$/i.test(classes[i])) return { node: current, section: classes[i] };
      }
    }
    return null;
  }

  function repeatingSection(node) {
    var found = repeatingFieldset(node);
    return found ? found.section : null;
  }

  function adjacentText(node) {
    if (!node.parent) return '';
    var siblings = node.parent.children;
    var index = siblings.indexOf(node);
    for (var direction = 1; direction >= -1; direction -= 2) {
      for (var i = index + direction; i >= 0 && i < siblings.length; i += direction) {
        if (siblings[i].tag !== '#text') break;
        var text = normalizeText(siblings[i].text);
        if (text) return text;
      }
    }
    return '';
  }

  function controlLabel(node, labelsByFor) {
    for (var current = node.parent; current; current = current.parent) {
      if (current.tag === 'label') return labelText(current) || current.attrs['data-i18n'] || '';
    }
    if (node.attrs.id && labelsByFor[node.attrs.id]) return labelsByFor[node.attrs.id];
    return adjacentText(node) || node.attrs['aria-label'] || node.attrs.title || node.attrs['data-i18n'] || '';
  }

  function baseAttrName(value) {
    var name = normalizeText(value);
    return /^attr_/i.test(name) ? name.slice(5) : name;
  }

  function buildControls(groups, labelsByFor) {
    var controls = dictionary();
    Object.keys(groups).sort().forEach(function (name) {
      var nodes = groups[name];
      var selects = nodes.filter(function (node) { return node.tag === 'select'; });
      var select = selects[0];
      var radios = nodes.filter(function (node) { return node.tag === 'input' && (node.attrs.type || '').toLowerCase() === 'radio'; });
      var repeating = repeatingSection(select || radios[0] || nodes[0]);
      if (select) {
        var optionNodes = [];
        selects.forEach(function (item) { optionNodes = optionNodes.concat(descendants(item, 'option')); });
        var optionSeen = dictionary();
        var options = optionNodes.map(function (option) {
          var label = nodeText(option) || option.attrs.label || option.attrs['data-i18n'] || option.attrs.value || '';
          return { label: label, value: hasAttr(option, 'value') ? option.attrs.value : label };
        }).filter(function (option) {
          var key = option.label + '\n' + option.value;
          if (optionSeen[key]) return false;
          optionSeen[key] = true;
          return true;
        });
        var selected = optionNodes.filter(function (option) { return hasAttr(option, 'selected'); })[0];
        controls[name] = {
          type: 'select',
          options: options,
          default: selected ? (hasAttr(selected, 'value') ? selected.attrs.value : nodeText(selected)) : (options[0] ? options[0].value : null)
        };
      } else if (radios.length) {
        var checked = radios.filter(function (radio) { return hasAttr(radio, 'checked'); })[0];
        controls[name] = {
          type: 'radio',
          options: radios.map(function (radio) {
            var value = hasAttr(radio, 'value') ? radio.attrs.value : 'on';
            return { label: controlLabel(radio, labelsByFor) || value, value: value };
          }),
          default: checked ? (hasAttr(checked, 'value') ? checked.attrs.value : 'on') : null
        };
      } else {
        var input = nodes[0];
        var type = input.tag === 'textarea' ? 'textarea' : (input.attrs.type || 'text').toLowerCase();
        controls[name] = {
          type: type,
          options: [],
          default: hasAttr(input, 'value') ? input.attrs.value : (input.tag === 'textarea' ? nodeText(input) : null)
        };
      }
      if (repeating) controls[name].repeating = repeating;
    });
    return controls;
  }

  function collectControls(root) {
    var labelsByFor = dictionary();
    var globalGroups = dictionary();
    var sectionGroups = dictionary();
    walk(root, function (node) {
      if (node.tag === 'label' && node.attrs['for']) labelsByFor[node.attrs['for']] = labelText(node) || node.attrs['data-i18n'] || '';
    });
    walk(root, function (node) {
      if (node.tag !== 'input' && node.tag !== 'select' && node.tag !== 'textarea') return;
      if (!/^attr_/i.test(node.attrs.name || '')) return;
      var name = baseAttrName(node.attrs.name);
      var section = repeatingSection(node);
      var groups = globalGroups;
      if (section) {
        if (!sectionGroups[section]) sectionGroups[section] = dictionary();
        groups = sectionGroups[section];
      }
      if (!groups[name]) groups[name] = [];
      groups[name].push(node);
    });
    var sections = dictionary();
    Object.keys(sectionGroups).forEach(function (section) {
      sections[section] = buildControls(sectionGroups[section], labelsByFor);
    });
    return { global: buildControls(globalGroups, labelsByFor), sections: sections };
  }

  function parseRefContent(content) {
    var parts = content.split('|').map(function (part) { return normalizeText(part); }).filter(Boolean);
    var max = parts.length > 1 && parts[parts.length - 1].toLowerCase() === 'max';
    if (max) parts.pop();
    var name = baseAttrName(parts.length ? parts[parts.length - 1] : '');
    return name ? { name: name, max: max } : null;
  }

  function refTokens(text) {
    var refs = [];
    String(text).replace(/@\{([^{}]+)\}/g, function (token, content, index) {
      var ref = parseRefContent(content);
      if (ref) refs.push({ token: token, start: index, end: index + token.length, name: ref.name, max: ref.max });
      return token;
    });
    return refs;
  }

  function publicRefs(text) {
    var seen = dictionary();
    return refTokens(text).reduce(function (out, ref) {
      var key = ref.name + '|' + ref.max;
      if (!seen[key]) {
        seen[key] = true;
        out.push({ name: ref.name, max: ref.max });
      }
      return out;
    }, []);
  }

  function findBraceEnd(text, start) {
    var depth = 1;
    for (var i = start + 2; i < text.length; i += 1) {
      if (text.charAt(i) === '{') depth += 1;
      else if (text.charAt(i) === '}' && --depth === 0) return i + 1;
    }
    return -1;
  }

  function splitTopLevel(text, separator, once) {
    var parts = [];
    var start = 0;
    var braces = 0;
    var parens = 0;
    var brackets = 0;
    for (var i = 0; i < text.length; i += 1) {
      var ch = text.charAt(i);
      if (ch === '{') braces += 1;
      else if (ch === '}' && braces) braces -= 1;
      else if (ch === '(') parens += 1;
      else if (ch === ')' && parens) parens -= 1;
      else if (ch === '[') brackets += 1;
      else if (ch === ']' && brackets) brackets -= 1;
      else if (ch === separator && !braces && !parens && !brackets) {
        parts.push(text.slice(start, i));
        start = i + 1;
        if (once) break;
      }
    }
    parts.push(text.slice(start));
    return parts;
  }

  function queryTokens(text) {
    var queries = [];
    for (var i = 0; i < text.length - 1; i += 1) {
      if (text.slice(i, i + 2) !== '?{') continue;
      var end = findBraceEnd(text, i);
      if (end < 0) break;
      var raw = text.slice(i, end);
      var parts = splitTopLevel(raw.slice(2, -1), '|', false);
      var options = [];
      if (parts.length > 2) {
        for (var p = 1; p < parts.length; p += 1) {
          var pair = splitTopLevel(parts[p], ',', true);
          var label = normalizeText(pair[0]);
          if (!label) continue;
          options.push({ label: label, value: pair.length > 1 ? pair[1].trim() : pair[0].trim() });
        }
      }
      queries.push({
        start: i,
        end: end,
        raw: raw,
        title: normalizeText(parts[0]) || 'query',
        options: options
      });
      i = end - 1;
    }
    return queries;
  }

  function queryKey(queries, title) {
    if (!Object.prototype.hasOwnProperty.call(queries, title)) return title;
    var index = 2;
    while (Object.prototype.hasOwnProperty.call(queries, title + '#' + index)) index += 1;
    return title + '#' + index;
  }

  function selectableRef(text, controls, querySpans, excluded) {
    var refs = refTokens(text);
    for (var i = 0; i < refs.length; i += 1) {
      var ref = refs[i];
      var insideQuery = querySpans.some(function (query) { return ref.start >= query.start && ref.start < query.end; });
      var control = controls[ref.name];
      if (!insideQuery && !ref.max && !excluded[ref.name] && control && (control.type === 'select' || control.type === 'radio') && control.options.length) {
        return ref;
      }
    }
    return null;
  }

  function replaceRef(text, target, value) {
    return text.replace(/@\{([^{}]+)\}/g, function (token, content) {
      var ref = parseRefContent(content);
      return ref && ref.name === target.name && ref.max === target.max ? value : token;
    });
  }

  function canonicalObject(value) {
    var ordered = dictionary();
    Object.keys(value).sort().forEach(function (key) { ordered[key] = value[key]; });
    return ordered;
  }

  function expandModes(raw, controls) {
    // ponytail: cap one button's nested query variants; raise only after Roll20 payload profiling.
    var MAX_MODES = 200;
    var MAX_EXPANSIONS = 100;
    var modes = [];
    var expansions = 0;
    function finish(state) {
      if (modes.length >= MAX_MODES) return;
      var data = {
        labelPath: state.labelPath,
        overrides: canonicalObject(state.overrides),
        queries: canonicalObject(state.queries)
      };
      data.id = 'mode-' + shortHash(JSON.stringify(data));
      modes.push({ id: data.id, labelPath: data.labelPath, overrides: data.overrides, queries: data.queries });
    }
    function expandQueries(text, state, seen, depth, done) {
      expansions += 1;
      if (modes.length >= MAX_MODES || expansions > MAX_EXPANSIONS || depth > 8) return;
      var marker = text + '\n' + JSON.stringify(canonicalObject(state.queries));
      if (seen[marker]) return;
      seen[marker] = true;
      var choice = queryTokens(text).filter(function (query) { return query.options.length; })[0] || null;
      if (choice) {
        choice.options.forEach(function (option) {
          var nextText = text.slice(0, choice.start) + option.value + text.slice(choice.end);
          if (nextText === text) return;
          var nextQueries = dictionary(state.queries);
          nextQueries[queryKey(nextQueries, choice.title)] = { raw: choice.raw, value: option.value };
          expandQueries(nextText, {
            labelPath: state.labelPath.concat(option.label),
            overrides: dictionary(state.overrides),
            queries: nextQueries
          }, seen, depth + 1, done);
        });
        return;
      }
      done(text, state);
    }
    function expandControlValue(text, state, excluded, seen, depth) {
      expansions += 1;
      if (modes.length >= MAX_MODES || expansions > MAX_EXPANSIONS || depth > 8) return;
      var marker = text + '\n' + JSON.stringify(canonicalObject(state.overrides)) + '\n' + JSON.stringify(canonicalObject(state.queries));
      if (seen[marker]) return;
      seen[marker] = true;
      var queries = queryTokens(text);
      var choice = queries.filter(function (query) { return query.options.length; })[0] || null;
      var ref = selectableRef(text, controls, queries, excluded);
      if (choice && (!ref || choice.start < ref.start)) {
        choice.options.forEach(function (option) {
          var nextText = text.slice(0, choice.start) + option.value + text.slice(choice.end);
          if (nextText === text) return;
          var nextQueries = dictionary(state.queries);
          nextQueries[queryKey(nextQueries, choice.title)] = { raw: choice.raw, value: option.value };
          expandControlValue(nextText, {
            labelPath: state.labelPath.concat(option.label),
            overrides: dictionary(state.overrides),
            queries: nextQueries
          }, excluded, seen, depth + 1);
        });
        return;
      }
      if (ref) {
        controls[ref.name].options.forEach(function (option) {
          var nextOverrides = dictionary(state.overrides);
          nextOverrides[ref.name] = option.value;
          var nextExcluded = dictionary(excluded);
          nextExcluded[ref.name] = true;
          expandControlValue(replaceRef(text, ref, option.value), {
            labelPath: state.labelPath.concat(option.label || option.value),
            overrides: nextOverrides,
            queries: dictionary(state.queries)
          }, nextExcluded, seen, depth + 1);
        });
        return;
      }
      finish(state);
    }
    var variants = [];
    expandQueries(raw, { labelPath: [], overrides: dictionary(), queries: dictionary() }, dictionary(), 0, function (text, state) {
      variants.push({ text: text, state: state });
    });
    variants.forEach(function (variant) {
      if (variant.state.labelPath.length) finish(variant.state);
      var queries = queryTokens(variant.text);
      var roots = dictionary();
      refTokens(variant.text).forEach(function (ref) {
        var insideQuery = queries.some(function (query) { return ref.start >= query.start && ref.start < query.end; });
        var control = controls[ref.name];
        var key = ref.name + '|' + ref.max;
        if (!insideQuery && !roots[key] && !ref.max && control && (control.type === 'select' || control.type === 'radio') && control.options.length)
          roots[key] = { ref: ref, control: control };
      });
      Object.keys(roots).forEach(function (key) {
        var root = roots[key];
        root.control.options.forEach(function (option) {
          var selected = dictionary(variant.state.overrides);
          selected[root.ref.name] = option.value;
          var excluded = dictionary();
          excluded[root.ref.name] = true;
          expandControlValue(option.value, {
            labelPath: variant.state.labelPath.concat(option.label || option.value),
            overrides: selected,
            queries: dictionary(variant.state.queries)
          }, excluded, dictionary(), 0);
        });
      });
    });
    var unique = dictionary();
    return modes.filter(function (mode) {
      var key = JSON.stringify(mode);
      if (unique[key]) return false;
      unique[key] = true;
      return true;
    });
  }

  function compactSignature(controls, rolls) {
    var frequencies = dictionary();
    var tokenFrequencies = dictionary();
    Object.keys(controls).forEach(function (name) {
      name.toLowerCase().split(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+/).filter(Boolean).forEach(function (token) {
        tokenFrequencies[token] = (tokenFrequencies[token] || 0) + 1;
      });
    });
    rolls.forEach(function (roll) {
      var seen = dictionary();
      roll.refs.forEach(function (ref) {
        if (!seen[ref.name]) frequencies[ref.name] = (frequencies[ref.name] || 0) + 1;
        seen[ref.name] = true;
      });
    });
    return Object.keys(controls).filter(function (name) {
      return !controls[name].repeating;
    }).map(function (name) {
      var control = controls[name];
      var macro = /[?@%&]\{|\{\{|\[\[/.test(String(control.default || ''));
      var info = name.toLowerCase().split(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+/).filter(Boolean).reduce(function (score, token) {
        return score + token.length / tokenFrequencies[token];
      }, 0);
      return {
        name: name,
        score: (macro ? 1000000 : 0) + (frequencies[name] ? 100000 : 0) + Math.min(frequencies[name] || 0, 999) * 1000 + Math.round(info * 10) + Math.min(name.length, 100)
      };
    }).sort(function (left, right) {
      return right.score - left.score || left.name.localeCompare(right.name);
    }).slice(0, 32).map(function (entry) { return entry.name; }).sort();
  }

  function templateFields(raw) {
    var fields = [];
    for (var i = 0; i < raw.length - 1; i += 1) {
      if (raw.slice(i, i + 2) !== '{{') continue;
      var cursor = i + 2;
      var equals = -1;
      while (cursor < raw.length - 1) {
        if (raw.slice(cursor, cursor + 2) === '}}') break;
        if (raw.charAt(cursor) === '=' && equals < 0) { equals = cursor; break; }
        cursor += 1;
      }
      if (equals < 0) continue;
      cursor = equals + 1;
      var valueEnd = -1;
      while (cursor < raw.length - 1) {
        if (/[@%?&]\{/.test(raw.slice(cursor, cursor + 2))) {
          var tokenEnd = findBraceEnd(raw, cursor);
          if (tokenEnd > cursor) { cursor = tokenEnd; continue; }
        }
        if (raw.slice(cursor, cursor + 2) === '}}') { valueEnd = cursor; break; }
        cursor += 1;
      }
      if (valueEnd < 0) continue;
      fields.push({ field: normalizeText(raw.slice(i + 2, equals)), value: raw.slice(equals + 1, valueEnd).trim() });
      i = valueEnd + 1;
    }
    return fields;
  }

  function directRef(value) {
    var match = String(value).match(/^@\{([^{}]+)\}$/);
    return match ? parseRefContent(match[1]) : null;
  }

  function inlineExpressionRefs(raw) {
    var names = dictionary();
    String(raw).replace(/\[\[([\s\S]*?)\]\]/g, function (_all, expression) {
      var ref = directRef(expression.trim());
      if (ref && !ref.max) names[ref.name] = true;
      return _all;
    });
    return names;
  }

  function collectRolls(root, controlScopes) {
    var nodes = [];
    walk(root, function (node) {
      if ((node.tag === 'button' || node.tag === 'input') && (node.attrs.type || '').toLowerCase() === 'roll') nodes.push(node);
    });
    var keys = dictionary();
    return nodes.map(function (node) {
      var raw = node.attrs.value || '';
      var htmlName = node.attrs.name || '';
      var name = /^roll_/i.test(htmlName) ? htmlName.slice(5) : null;
      var repeating = repeatingSection(node);
      var rowControls = repeating && controlScopes.sections[repeating] || {};
      var controls = Object.assign(dictionary(), controlScopes.global, rowControls);
      var label = node.tag === 'button'
        ? (nodeText(node) || node.attrs['aria-label'] || node.attrs.title || node.attrs['data-i18n'] || '')
        : (node.attrs['aria-label'] || node.attrs.title || node.attrs['data-i18n'] || name || '');
      var baseKey = [repeating, name || slug(label) || 'roll'].filter(Boolean).join('.');
      if (!name) baseKey += '-' + shortHash(raw);
      var key = baseKey;
      if (keys[key]) key += '-' + shortHash(raw + '|' + keys[key]);
      keys[baseKey] = (keys[baseKey] || 0) + 1;
      var fields = templateFields(raw);
      var labelRefs = [];
      var labelRefSeen = dictionary();
      var staticLabels = [];
      fields.forEach(function (field) {
        var ref = directRef(field.value);
        var refs = ref ? [ref] : publicRefs(field.value.replace(/\[\[[\s\S]*?\]\]/g, ' '));
        refs.forEach(function (item) {
          var key = field.field + '|' + item.name + '|' + item.max;
          if (!labelRefSeen[key]) {
            labelRefSeen[key] = true;
            labelRefs.push({ field: field.field, name: item.name, max: item.max });
          }
        });
        if (!refs.length && field.value && !/[@%?&]\{|\[\[|\$\[\[/.test(field.value))
          staticLabels.push({ field: field.field, value: normalizeText(field.value) });
      });
      var expressionNames = inlineExpressionRefs(raw);
      var expressionRefs = [];
      labelRefs.forEach(function (ref) {
        if (expressionNames[ref.name] && expressionRefs.indexOf(ref.name) < 0) expressionRefs.push(ref.name);
      });
      var repeatingFields = repeating ? Object.keys(rowControls).sort() : [];
      var modes = expandModes(raw, controls);
      var rollControls = dictionary();
      if (repeating) modes.forEach(function (mode) {
        Object.keys(mode.overrides || {}).forEach(function (controlName) {
          if (controls[controlName]) rollControls[controlName] = controls[controlName];
        });
      });
      var templateMatch = raw.match(/&\{\s*template\s*:\s*([^}]+)\}/i);
      return {
        key: key,
        name: name,
        label: label,
        raw: raw,
        template: templateMatch ? normalizeText(templateMatch[1]) : null,
        refs: publicRefs(raw),
        repeating: repeating ? { section: repeating, fields: repeatingFields.sort() } : null,
        staticLabels: staticLabels,
        labelRefs: labelRefs,
        expressionRefs: expressionRefs.sort(),
        controls: Object.keys(rollControls).length ? rollControls : undefined,
        modes: modes
      };
    });
  }

  function parseSheetContract(html, options) {
    var opts = options || {};
    var tree = parseHtml(html);
    var controlScopes = collectControls(tree);
    var globalControls = controlScopes.global;
    var rolls = collectRolls(tree, controlScopes);
    var signature = compactSignature(globalControls, rolls);
    var attributes = dictionary();
    var globalAttributes = dictionary();
    var sections = dictionary();
    Object.keys(globalControls).forEach(function (name) {
      attributes[name] = true;
      globalAttributes[name] = true;
    });
    Object.keys(controlScopes.sections).sort().forEach(function (section) {
      sections[section] = Object.keys(controlScopes.sections[section]).sort();
      sections[section].forEach(function (name) { attributes[name] = true; });
    });
    rolls.forEach(function (roll) {
      var rowFields = roll.repeating && Array.isArray(roll.repeating.fields) ? roll.repeating.fields : [];
      roll.refs.forEach(function (ref) {
        if (!ref.name) return;
        attributes[ref.name] = true;
        if (!roll.repeating || rowFields.indexOf(ref.name) < 0) globalAttributes[ref.name] = true;
      });
    });
    rolls.forEach(function (roll) { delete roll.refs; });
    var usedControls = dictionary();
    rolls.forEach(function (roll) {
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode.overrides || {}).forEach(function (name) { usedControls[name] = true; });
      });
    });
    var controls = dictionary();
    Object.keys(usedControls).sort().forEach(function (name) {
      if (globalControls[name]) controls[name] = globalControls[name];
    });
    var name = normalizeText(opts.name || 'sheet');
    return {
      version: 1,
      id: normalizeText(opts.id || slug(name) || ('sheet-' + shortHash(html))),
      name: name,
      sourceHash: normalizeText(opts.sourceHash || ''),
      signature: signature,
      attributes: Object.keys(attributes).sort(),
      globalAttributes: Object.keys(globalAttributes).sort(),
      sections: sections,
      controls: controls,
      rolls: rolls
    };
  }

  return {
    parseSheetContract: parseSheetContract
  };
}));
