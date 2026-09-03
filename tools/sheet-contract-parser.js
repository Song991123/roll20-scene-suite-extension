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

  function directLabelText(node) {
    return normalizeText((node && node.children || []).filter(function (child) {
      return child.tag === '#text';
    }).map(function (child) { return child.text; }).join(' ')).slice(0, 300);
  }

  function hasAttr(node, name) {
    return Object.prototype.hasOwnProperty.call(node.attrs, name);
  }

  function jsObjectProperties(source, openAt) {
    var parts = [];
    var start = openAt + 1;
    var braces = 1;
    var brackets = 0;
    var parens = 0;
    var quote = '';
    var lineComment = false;
    var blockComment = false;
    for (var i = start; i < source.length; i += 1) {
      var ch = source.charAt(i);
      var next = source.charAt(i + 1);
      if (lineComment) {
        if (ch === '\n' || ch === '\r') lineComment = false;
        continue;
      }
      if (blockComment) {
        if (ch === '*' && next === '/') { blockComment = false; i += 1; }
        continue;
      }
      if (quote) {
        if (ch === '\\') i += 1;
        else if (ch === quote) quote = '';
        continue;
      }
      if (ch === '/' && next === '/') { lineComment = true; i += 1; continue; }
      if (ch === '/' && next === '*') { blockComment = true; i += 1; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
      if (ch === '{') braces += 1;
      else if (ch === '}' && --braces === 0) {
        parts.push(source.slice(start, i));
        return { parts: parts, end: i };
      } else if (ch === '[') brackets += 1;
      else if (ch === ']' && brackets) brackets -= 1;
      else if (ch === '(') parens += 1;
      else if (ch === ')' && parens) parens -= 1;
      else if (ch === ',' && braces === 1 && !brackets && !parens) {
        parts.push(source.slice(start, i));
        start = i + 1;
      }
    }
    return { parts: [], end: source.length };
  }

  function workerStoredAttributes(root, translations) {
    var found = dictionary();
    var defaults = dictionary();
    walk(root, function (node) {
      if (node.tag !== 'script' || normalizeText(node.attrs.type).toLowerCase() !== 'text/worker') return;
      var source = (node.children || []).filter(function (child) { return child.tag === '#text'; })
        .map(function (child) { return child.text; }).join('\n');
      var pattern = /\bsetAttrs\s*\(\s*\{/g;
      var match;
      while ((match = pattern.exec(source))) {
        var openAt = source.indexOf('{', match.index);
        var object = jsObjectProperties(source, openAt);
        object.parts.forEach(function (part) {
          var clean = part.replace(/^(?:\s|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*(?:\r?\n|$))+/, '');
          var key = clean.match(/^(?:["']([^"']+)["']|\[\s*["']([^"']+)["']\s*\]|([A-Za-z_$\u0080-\uFFFF][\w$\u0080-\uFFFF-]*))\s*(?=:|$)/);
          var name = baseAttrName(key && (key[1] || key[2] || key[3]) || '');
          if (!name) return;
          found[name] = true;
          var translated = clean.match(/:\s*getTranslationByKey\s*\(\s*["']([^"']+)["']\s*\)/);
          if (translated) (translations || []).some(function (messages) {
            if (!Object.prototype.hasOwnProperty.call(messages, translated[1]) ||
              typeof messages[translated[1]] !== 'string') return false;
            defaults[name] = messages[translated[1]];
            return true;
          });
        });
        pattern.lastIndex = object.end + 1;
      }
    });
    return { names: Object.keys(found).sort(), defaults: defaults };
  }

  function elementChildren(node) {
    return (node && node.children || []).filter(function (child) { return child.tag !== '#text'; });
  }

  function cssList(value) {
    var result = [];
    var start = 0;
    var quote = '';
    var brackets = 0;
    var parens = 0;
    for (var i = 0; i <= value.length; i += 1) {
      var ch = value.charAt(i);
      if (quote) {
        if (ch === quote && value.charAt(i - 1) !== '\\') quote = '';
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '[') brackets += 1;
      else if (ch === ']' && brackets) brackets -= 1;
      else if (ch === '(') parens += 1;
      else if (ch === ')' && parens) parens -= 1;
      else if ((ch === ',' || i === value.length) && !brackets && !parens) {
        var part = value.slice(start, i).trim();
        if (part) result.push(part);
        start = i + 1;
      }
    }
    return result;
  }

  function cssDisplayRules(source) {
    var rules = [];
    var order = 0;
    String(source || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/@(?:import|charset)[^;]*;/gi, '').replace(/([^{}]+)\{([\s\S]*?)\}/g, function (_all, header, body) {
      if (/^\s*@/.test(header)) return _all;
      var display = null;
      String(body).replace(/(?:^|;)\s*display\s*:\s*([a-z-]+)\s*(!important)?\s*(?=;|$)/gi, function (_match, value, important) {
        if (/^(?:none|block|inline|inline-block|flex|inline-flex|grid|inline-grid|table|table-row|table-cell|list-item|contents)$/.test(value.toLowerCase()))
          display = { visible: value.toLowerCase() !== 'none', important: !!important };
        return _match;
      });
      if (!display) return _all;
      cssList(header).forEach(function (selector) {
        rules.push({ selector: selector, visible: display.visible, important: display.important, order: order++ });
      });
      return _all;
    });
    return rules;
  }

  function cssAttribute(value) {
    var match = String(value).match(/^\s*([a-z0-9_-]+)\s*(?:(\^=|\$=|\*=|~=|\|=|=)\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?\s*$/i);
    if (!match) return null;
    return { name: match[1].toLowerCase(), op: match[2] || '', value: match[3] !== undefined ? match[3] : match[4] !== undefined ? match[4] : match[5] || '' };
  }

  function cssCompound(value) {
    var source = value.trim();
    var result = { tag: '', classes: [], notClasses: [], id: '', attributes: [], checked: false, specificity: 0 };
    var tag = source.match(/^(\*|[a-z][a-z0-9_-]*)/i);
    var i = 0;
    if (tag) {
      result.tag = tag[1].toLowerCase();
      if (result.tag !== '*') result.specificity += 1;
      i = tag[0].length;
    }
    while (i < source.length) {
      var ch = source.charAt(i);
      if (ch === '.' || ch === '#') {
        var token = source.slice(i + 1).match(/^[a-z0-9_-]+/i);
        if (!token) return null;
        if (ch === '.') result.classes.push(token[0]);
        else result.id = token[0];
        result.specificity += ch === '#' ? 100 : 10;
        i += token[0].length + 1;
        continue;
      }
      if (ch === '[') {
        var close = source.indexOf(']', i + 1);
        if (close < 0) return null;
        var attribute = cssAttribute(source.slice(i + 1, close));
        if (!attribute) return null;
        attribute.not = false;
        result.attributes.push(attribute);
        result.specificity += 10;
        i = close + 1;
        continue;
      }
      if (source.slice(i, i + 8).toLowerCase() === ':checked') {
        result.checked = true;
        result.specificity += 10;
        i += 8;
        continue;
      }
      if (source.slice(i, i + 5).toLowerCase() === ':not(') {
        var end = source.indexOf(')', i + 5);
        if (end < 0) return null;
        var inner = source.slice(i + 5, end).trim();
        if (/^\.[a-z0-9_-]+$/i.test(inner)) {
          result.notClasses.push(inner.slice(1));
          result.specificity += 10;
          i = end + 1;
          continue;
        }
        if (inner.charAt(0) !== '[' || inner.charAt(inner.length - 1) !== ']') return null;
        var negated = cssAttribute(inner.slice(1, -1));
        if (!negated) return null;
        negated.not = true;
        result.attributes.push(negated);
        result.specificity += 10;
        i = end + 1;
        continue;
      }
      return null;
    }
    return result;
  }

  function cssSelector(value) {
    var compounds = [];
    var combinators = [];
    var buffer = '';
    var pending = '';
    var quote = '';
    var brackets = 0;
    var parens = 0;
    function begin() {
      if (!buffer && pending && compounds.length) {
        combinators.push(pending);
        pending = '';
      }
    }
    function finish() {
      var text = buffer.trim();
      if (!text) return true;
      var parsed = cssCompound(text);
      if (!parsed) return false;
      compounds.push(parsed);
      buffer = '';
      return true;
    }
    for (var i = 0; i < value.length; i += 1) {
      var ch = value.charAt(i);
      if (quote) {
        buffer += ch;
        if (ch === quote && value.charAt(i - 1) !== '\\') quote = '';
        continue;
      }
      if (ch === '"' || ch === "'") { begin(); buffer += ch; quote = ch; continue; }
      if (ch === '[') { begin(); buffer += ch; brackets += 1; continue; }
      if (ch === ']') { buffer += ch; if (brackets) brackets -= 1; continue; }
      if (ch === '(') { begin(); buffer += ch; parens += 1; continue; }
      if (ch === ')') { buffer += ch; if (parens) parens -= 1; continue; }
      if (!brackets && !parens && /\s/.test(ch)) {
        if (buffer && !finish()) return null;
        if (compounds.length && !pending) pending = ' ';
        continue;
      }
      if (!brackets && !parens && (ch === '>' || ch === '+' || ch === '~')) {
        if (buffer && !finish()) return null;
        pending = ch;
        continue;
      }
      begin();
      buffer += ch;
    }
    if (buffer && !finish()) return null;
    if (!compounds.length || combinators.length !== compounds.length - 1) return null;
    return {
      compounds: compounds,
      combinators: combinators,
      specificity: compounds.reduce(function (total, compound) { return total + compound.specificity; }, 0)
    };
  }

  function cssValueMatches(actual, operator, expected) {
    actual = String(actual == null ? '' : actual);
    expected = String(expected == null ? '' : expected);
    if (!operator) return actual !== undefined;
    if (operator === '=') return actual === expected;
    if (operator === '^=') return actual.indexOf(expected) === 0;
    if (operator === '$=') return actual.slice(-expected.length) === expected;
    if (operator === '*=') return actual.indexOf(expected) > -1;
    if (operator === '~=') return actual.split(/\s+/).indexOf(expected) > -1;
    if (operator === '|=') return actual === expected || actual.indexOf(expected + '-') === 0;
    return false;
  }

  function visibilityAtom(node, attribute) {
    var name = baseAttrName(node.attrs.name || '');
    if (!name || !/^attr_/i.test(node.attrs.name || '')) return null;
    var operator = attribute.op;
    var op = operator === '=' ? 'eq' : operator === '^=' ? 'starts' : operator === '$=' ? 'ends' : operator === '*=' ? 'contains' : operator === '~=' ? 'token' : operator === '|=' ? 'dash' : '';
    if (!op) return null;
    if (attribute.not) op = 'not-' + op;
    return {
      name: name, op: op, value: attribute.value,
      scope: node.parent && node.parent._kibSheetNodeId || 0,
      fieldScope: repeatingSection(node) ? 'row' : 'global'
    };
  }

  function cssCompoundMatch(node, compound) {
    if (node.tag === '#root') {
      return !compound.tag && !compound.id && !compound.attributes.length && !compound.checked && !compound.notClasses.length &&
        compound.classes.length === 1 && compound.classes[0] === 'charsheet' ? { ok: true, atoms: [] } : { ok: false };
    }
    if (compound.tag && compound.tag !== '*' && compound.tag !== node.tag) return { ok: false };
    if (compound.id && compound.id !== (node.attrs.id || '')) return { ok: false };
    var classes = (node.attrs['class'] || '').split(/\s+/).filter(Boolean);
    if (!compound.classes.every(function (name) { return classes.indexOf(name) > -1; })) return { ok: false };
    if (compound.notClasses.some(function (name) { return classes.indexOf(name) > -1; })) return { ok: false };
    var type = (node.attrs.type || '').toLowerCase();
    var optionControl = node.tag === 'input' && (type === 'checkbox' || type === 'radio');
    var namedControl = /^attr_/i.test(node.attrs.name || '');
    var atoms = [];
    for (var i = 0; i < compound.attributes.length; i += 1) {
      var attribute = compound.attributes[i];
      if (attribute.name === 'value' && namedControl && !optionControl && attribute.op) {
        var dynamic = visibilityAtom(node, attribute);
        if (!dynamic) return { ok: false };
        atoms.push(dynamic);
        continue;
      }
      var present = hasAttr(node, attribute.name);
      var matches = present && cssValueMatches(node.attrs[attribute.name], attribute.op, attribute.value);
      if (attribute.not) matches = !matches;
      if (!matches) return { ok: false };
    }
    if (compound.checked) {
      if (!namedControl || !optionControl) return { ok: false };
      atoms.push({
        name: baseAttrName(node.attrs.name), op: 'eq', value: hasAttr(node, 'value') ? node.attrs.value : 'on',
        scope: node.parent && node.parent._kibSheetNodeId || 0,
        fieldScope: repeatingSection(node) ? 'row' : 'global'
      });
    }
    return { ok: true, atoms: atoms };
  }

  function precedingElements(node, adjacent) {
    if (!node.parent) return [];
    var siblings = elementChildren(node.parent);
    var index = siblings.indexOf(node);
    if (index <= 0) return [];
    return adjacent ? [siblings[index - 1]] : siblings.slice(0, index).reverse();
  }

  function cssSelectorPaths(node, selector) {
    // ponytail: cap pathological selector backtracking; unsupported ambiguity stays visible at runtime.
    var maximum = 64;
    function match(current, index) {
      if (!current || maximum <= 0) return [];
      var ownMatch = cssCompoundMatch(current, selector.compounds[index]);
      if (!ownMatch.ok) return [];
      if (index === 0) {
        maximum -= 1;
        return [{ atoms: ownMatch.atoms }];
      }
      var relation = selector.combinators[index - 1];
      var candidates = [];
      if (relation === '>') candidates = current.parent ? [current.parent] : [];
      else if (relation === '+') candidates = precedingElements(current, true);
      else if (relation === '~') candidates = precedingElements(current, false);
      else for (var parent = current.parent; parent; parent = parent.parent) candidates.push(parent);
      var paths = [];
      for (var i = 0; i < candidates.length && maximum > 0; i += 1) {
        match(candidates[i], index - 1).forEach(function (path) {
          paths.push({ atoms: path.atoms.concat(ownMatch.atoms) });
        });
      }
      return paths;
    }
    return match(node, selector.compounds.length - 1);
  }

  function atomKey(atom, scoped) {
    return (scoped ? String(atom.scope || 0) + '|' : '') + [atom.name, atom.op, atom.value].join('|');
  }

  function cleanVisibilityPaths(paths) {
    var seenPaths = dictionary();
    return (paths || []).map(function (path) {
      var seen = dictionary();
      var atoms = [];
      (path.atoms || []).forEach(function (atom) {
        var key = atomKey(atom, true);
        if (!seen[key]) { seen[key] = true; atoms.push(atom); }
      });
      return atoms;
    }).filter(function (atoms) {
      var key = atoms.map(function (atom) { return atomKey(atom, true); }).sort().join('\n');
      if (seenPaths[key]) return false;
      seenPaths[key] = true;
      return true;
    });
  }

  function publicVisibilityAtom(atom) {
    return { name: atom.name, op: atom.op, value: atom.value, scope: atom.fieldScope || 'global' };
  }

  function visibilityAll(items) {
    items = (items || []).filter(Boolean);
    if (!items.length) return null;
    return items.length === 1 ? items[0] : { all: items };
  }

  function visibilityAny(items) {
    items = (items || []).filter(Boolean);
    if (!items.length) return null;
    return items.length === 1 ? items[0] : { any: items };
  }

  function visibilityCondition(paths) {
    return visibilityAny(paths.map(function (atoms) {
      return visibilityAll(atoms.map(publicVisibilityAtom));
    }));
  }

  function cssSources(root, external) {
    var sources = [];
    walk(root, function (node) {
      if (node.tag !== 'style') return;
      var value = node.children.map(function (child) { return child.tag === '#text' ? child.text : ''; }).join('');
      if (value.trim()) sources.push(value);
    });
    if (Array.isArray(external)) sources = sources.concat(external);
    else if (external) sources.push(external);
    return sources.map(String).filter(function (value) { return !!value.trim(); });
  }

  function cssPriority(entry) {
    return (entry.important ? 1000000 : 0) + entry.specificity;
  }

  function visibilityNot(value) {
    if (value === true) return false;
    if (value === false) return true;
    if (!value) return null;
    return value.not ? value.not : { not: value };
  }

  function visibilityAnd(left, right) {
    if (left === false || right === false) return false;
    if (left === true) return right;
    if (right === true) return left;
    if (!left || !right) return null;
    var items = [];
    if (Array.isArray(left.all)) items = items.concat(left.all); else items.push(left);
    if (Array.isArray(right.all)) items = items.concat(right.all); else items.push(right);
    return visibilityAll(items);
  }

  function visibilityOr(left, right) {
    if (left === true || right === true) return true;
    if (left === false) return right;
    if (right === false) return left;
    if (!left || !right) return null;
    var items = [];
    if (Array.isArray(left.any)) items = items.concat(left.any); else items.push(left);
    if (Array.isArray(right.any)) items = items.concat(right.any); else items.push(right);
    return visibilityAny(items);
  }

  function visibilityWhen(paths) {
    if ((paths || []).some(function (path) { return !path.length; })) return true;
    return visibilityCondition(paths || []);
  }

  function rightmostCssCompound(selector) {
    var source = String(selector || '').trim();
    var quote = '';
    var brackets = 0;
    var parens = 0;
    for (var i = source.length - 1; i >= 0; i -= 1) {
      var ch = source.charAt(i);
      if (quote) {
        if (ch === quote && source.charAt(i - 1) !== '\\') quote = '';
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ']') brackets += 1;
      else if (ch === '[' && brackets) brackets -= 1;
      else if (ch === ')') parens += 1;
      else if (ch === '(' && parens) parens -= 1;
      else if (!brackets && !parens && (ch === '>' || ch === '+' || ch === '~' || /\s/.test(ch)))
        return cssCompound(source.slice(i + 1).trim());
    }
    return cssCompound(source);
  }

  function uncertainDisplaySource(source) {
    var clean = String(source || '').replace(/\/\*[\s\S]*?\*\//g, '');
    if (/@(?:import|media|supports|container|layer|document|scope|(?:-[a-z]+-)?keyframes)\b/i.test(clean)) return true;
    var uncertain = false;
    clean.replace(/(?:^|[;{])\s*display\s*:\s*([^;}]+)/gi, function (match, declaration) {
      if (!/^(?:none|block|inline|inline-block|flex|inline-flex|grid|inline-grid|table|table-row|table-cell|list-item|contents)\s*(?:!important\s*)?$/i.test(declaration.trim())) uncertain = true;
      return match;
    });
    return uncertain;
  }

  function buildRollVisibility(root, rollNodes, externalCss, legacy) {
    var sources = cssSources(root, externalCss);
    var nextId = 1;
    walk(root, function (node) { node._kibSheetNodeId = nextId++; });
    var targets = [];
    var targetSeen = dictionary();
    rollNodes.forEach(function (roll) {
      for (var node = roll; node && node.tag !== '#root'; node = node.parent) {
        if (!targetSeen[node._kibSheetNodeId]) {
          targetSeen[node._kibSheetNodeId] = true;
          targets.push(node);
        }
      }
    });
    var programs = dictionary();
    var globalOrder = 0;
    var tainted = dictionary();
    var unreachableShows = dictionary();
    var uncertainPermanentNodes = dictionary();
    var uncertainPermanent = sources.some(uncertainDisplaySource);
    sources.forEach(function (source) {
      cssDisplayRules(source).forEach(function (rule) {
        var selector = cssSelector(rule.selector);
        rule.order = globalOrder++;
        if (!selector) {
          var rightmost = rightmostCssCompound(rule.selector);
          if (!rightmost && rule.visible) uncertainPermanent = true;
          if (rightmost) targets.forEach(function (target) {
            if (cssCompoundMatch(target, rightmost).ok) tainted[target._kibSheetNodeId] = true;
          });
          return;
        }
        targets.forEach(function (target) {
          var paths = cleanVisibilityPaths(cssSelectorPaths(target, selector));
          if (!paths.length) {
            if (rule.visible && selector.compounds.some(function (compound) { return compound.checked; }) &&
                cssCompoundMatch(target, selector.compounds[selector.compounds.length - 1]).ok)
              unreachableShows[target._kibSheetNodeId] = true;
            return;
          }
          var id = target._kibSheetNodeId;
          if (!programs[id]) programs[id] = [];
          programs[id].push({
            visible: rule.visible, important: rule.important, order: rule.order,
            specificity: selector.specificity, paths: paths
          });
        });
      });
    });
    targets.forEach(function (target) {
      var style = target.attrs && target.attrs.style || '';
      if (uncertainDisplaySource(style)) uncertainPermanentNodes[target._kibSheetNodeId] = true;
      var display = null;
      style.replace(/(?:^|;)\s*display\s*:\s*([a-z-]+)\s*(!important)?\s*(?=;|$)/gi, function (_match, value, important) {
        if (/^(?:none|block|inline|inline-block|flex|inline-flex|grid|inline-grid|table|table-row|table-cell|list-item|contents)$/.test(value.toLowerCase()))
          display = { visible: value.toLowerCase() !== 'none', important: !!important };
        return _match;
      });
      if (display) {
        if (!programs[target._kibSheetNodeId]) programs[target._kibSheetNodeId] = [];
        programs[target._kibSheetNodeId].push({ visible: display.visible, important: display.important, order: 1000000000, specificity: 1000, paths: [[]] });
      }
    });
    var nodeConditions = dictionary();
    var usedControls = dictionary();
    Object.keys(programs).forEach(function (id) {
      if (tainted[id]) return;
      var entries = programs[id];
      var base = { visible: true, important: false, order: -1, specificity: -1 };
      entries.filter(function (entry) { return entry.paths.some(function (path) { return !path.length; }); }).forEach(function (entry) {
        var currentPriority = cssPriority(base);
        var nextPriority = cssPriority(entry);
        if (nextPriority > currentPriority || (nextPriority === currentPriority && entry.order >= base.order)) base = entry;
      });
      var conditional = entries.filter(function (entry) { return entry.paths.every(function (path) { return path.length; }); });
      var selected = [];
      if (base.visible || conditional.some(function (entry) { return entry.visible; }))
        selected = conditional.slice();
      if (!selected.length) {
        // A missing opening control proves only an unreachable panel, not a hidden auxiliary roll.
        if (!uncertainPermanent && !uncertainPermanentNodes[id] && !base.visible && unreachableShows[id]) {
          var target = targets.find(function (node) { return String(node._kibSheetNodeId) === id; });
          if (target && /^(?:div|fieldset|section|article|aside|main|table|tbody|thead|tfoot|tr|td|th|ul|ol|li|form)$/.test(target.tag))
            nodeConditions[id] = { never: true };
        }
        return;
      }
      var cascade = entries.filter(function (entry) {
        return entry.paths.some(function (path) { return !path.length; }) || selected.indexOf(entry) > -1;
      }).slice().sort(function (left, right) {
        if (left.important !== right.important) return left.important ? 1 : -1;
        if (left.specificity !== right.specificity) return left.specificity - right.specificity;
        return left.order - right.order;
      });
      var condition = true;
      cascade.forEach(function (entry) {
        var when = visibilityWhen(entry.paths);
        condition = entry.visible
          ? visibilityOr(when, visibilityAnd(visibilityNot(when), condition))
          : visibilityAnd(visibilityNot(when), condition);
      });
      // Constant/unsupported outcomes are retained rather than treated as definitely hidden.
      if (!condition || condition === true || condition === false) return;
      nodeConditions[id] = condition;
      selected.forEach(function (entry) {
        entry.paths.forEach(function (path) { path.forEach(function (atom) { usedControls[atom.name] = true; }); });
      });
    });
    workerPanelVisibility(root, targets, sources, legacy).forEach(function (entry) {
      var id = entry.node._kibSheetNodeId;
      nodeConditions[id] = nodeConditions[id]
        ? visibilityAll([nodeConditions[id], entry.condition]) : entry.condition;
      usedControls[entry.condition.name || entry.condition.not.name] = true;
    });
    var rollConditions = dictionary();
    rollNodes.forEach(function (roll) {
      var conditions = [];
      var seen = dictionary();
      for (var node = roll; node && node.tag !== '#root'; node = node.parent) {
        var condition = nodeConditions[node._kibSheetNodeId];
        var key = condition && JSON.stringify(condition);
        if (condition && !seen[key]) { seen[key] = true; conditions.push(condition); }
      }
      if (conditions.length) rollConditions[roll._kibSheetNodeId] = conditions.some(function (condition) {
        return condition.never === true;
      }) ? { never: true } : visibilityAll(conditions);
    });
    return { rolls: rollConditions, controls: usedControls };
  }

  function workerPanelVisibility(root, targets, sources, legacy) {
    var result = [];
    var fields = dictionary();
    walk(root, function (node) {
      if (/^attr_/i.test(node.attrs.name || '') && !repeatingSection(node)) {
        var name = baseAttrName(node.attrs.name);
        if (!fields[name]) fields[name] = [];
        fields[name].push(node);
      }
    });
    // Roll20 supplies .hidden; other hiding classes must be declared by the sheet CSS.
    var hiding = dictionary({ hidden: true });
    var showing = dictionary();
    sources.forEach(function (source) {
      cssDisplayRules(source).forEach(function (rule) {
        var match = rule.selector.match(/^(?:\.charsheet\s+)?\.([\w-]+)$/);
        if (match) {
          if (rule.visible) showing[match[1]] = true;
          else hiding[match[1]] = true;
        }
      });
    });
    walk(root, function (node) {
      if (node.tag !== 'script' || normalizeText(node.attrs.type).toLowerCase() !== 'text/worker') return;
      var source = node.children.filter(function (child) { return child.tag === '#text'; })
        .map(function (child) { return child.text; }).join('\n');
      // Mask comments and literals only for locating real calls, never execute sheet workers.
      var code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g,
        function (text) { return text.replace(/[^\r\n]/g, ' '); });
      var calls = /\bgetAttrs\s*\(/g;
      var call;
      while ((call = calls.exec(code))) {
        var head = source.slice(call.index).match(/^getAttrs\s*\(\s*\[\s*['"]([\w-]+)['"]\s*\]\s*,\s*function\s*\(\s*(\w+)\s*\)\s*\{/);
        if (!head || !fields[baseAttrName(head[1])]) continue;
        var event = source.slice(0, call.index).match(/\bon\(\s*['"]([^'"]+)['"]\s*,\s*function\s*\(\s*\)\s*\{\s*$/);
        if (!event || event[1].split(/\s+/).indexOf('sheet:opened') < 0 ||
            event[1].split(/\s+/).indexOf('change:' + head[1]) < 0) continue;
        if (fields[baseAttrName(head[1])].some(function (field) {
          return field.tag !== 'input' || !/^(?:checkbox|radio)$/.test(fieldNodeType(field)) ||
            !/^(?:0|[1-9]\d*)$/.test(field.attrs.value || '');
        })) continue;
        var start = call.index + head[0].length - 1;
        var end = jsObjectProperties(source, start).end;
        var body = source.slice(start + 1, end).trim();
        // ponytail: only complete, single-attribute if/else class switches are proven here.
        // More complex workers remain available until a source-backed parser case is added.
        var branch = body.match(/^(?:var|let|const)\s+(\w+)\s*=\s*parseInt\(\s*(\w+)\.([\w-]+)\s*\)\s*;\s*if\s*\(\s*(\w+)\s*==={0,1}\s*(\d+)\s*\)\s*\{([^{}]*)\}\s*else\s*\{([^{}]*)\}\s*;?$/);
        if (!branch || branch[1] !== branch[4] || branch[2] !== head[2] || branch[3] !== head[1]) continue;
        function mutations(text) {
          var entries = [];
          var rest = text.replace(/\$20\(\s*['"]([.#][\w-]+)['"]\s*\)\.(addClass|removeClass)\(\s*['"]([\w-]+)['"]\s*\)\s*;/g,
            function (_all, selector, operation, className) {
              entries.push({ selector: selector, hide: operation === 'addClass', className: className });
              return '';
            });
          return rest.trim() ? [] : entries;
        }
        var yes = mutations(branch[6]);
        var no = mutations(branch[7]);
        if (!yes.length || yes.length !== no.length) continue;
        yes.forEach(function (change) {
          if (!hiding[change.className] || showing[change.className] || yes.filter(function (entry) { return entry.selector === change.selector; }).length !== 1 ||
              no.filter(function (entry) { return entry.selector === change.selector && entry.className === change.className && entry.hide !== change.hide; }).length !== 1) return;
          var writes = 0;
          source.replace(/\$20\(\s*['"]([.#][\w-]+)['"]\s*\)\.(?:addClass|removeClass)\(\s*['"]([\w-]+)['"]\s*\)/g,
            function (all, selector, className, offset) {
              if (code.slice(offset, offset + 3) === '$20' && selector === change.selector && className === change.className) writes += 1;
              return all;
            });
          if (writes !== 2) return;
          var selector = cssSelector(change.selector);
          var matches = targets.filter(function (target) { return cssSelectorPaths(target, selector).length; });
          // Legacy Roll20 prefixes class/id selectors; prefer exact original matches.
          if (!matches.length && legacy === true && /^[.#]sheet-/.test(change.selector)) {
            selector = cssSelector(change.selector.replace(/^([.#])sheet-/, '$1'));
            matches = targets.filter(function (target) { return cssSelectorPaths(target, selector).length; });
          }
          matches.forEach(function (target) {
            var when = { name: baseAttrName(head[1]), op: 'eq', value: branch[5], scope: 'global', required: true };
            result.push({ node: target, condition: change.hide ? visibilityNot(when) : when });
          });
        });
      }
    });
    return result;
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

  function uniqueTexts(values, maximum) {
    var found = dictionary();
    return (values || []).map(normalizeText).filter(function (value) {
      if (!value || value.length > (maximum || 100) || found[value]) return false;
      found[value] = true;
      return true;
    });
  }

  function translationMaps(source) {
    if (!source) return [];
    if (Array.isArray(source)) return source.filter(function (entry) {
      return entry && typeof entry === 'object' && !Array.isArray(entry);
    });
    if (typeof source !== 'object') return [];
    var nested = Object.keys(source).map(function (key) { return source[key]; }).filter(function (entry) {
      return entry && typeof entry === 'object' && !Array.isArray(entry);
    });
    return nested.length ? nested : [source];
  }

  function i18nAliases(node, translations) {
    var keys = [];
    var visited = 0;
    (function collect(current) {
      if (!current || current.tag === '#text' || visited++ >= 50) return;
      ['data-i18n', 'data-i18n-placeholder'].forEach(function (attribute) {
        var key = normalizeText(current.attrs && current.attrs[attribute]);
        if (key && keys.indexOf(key) < 0) keys.push(key);
      });
      for (var i = 0; i < current.children.length && visited < 50; i += 1) collect(current.children[i]);
    }(node));
    var values = [];
    keys.forEach(function (key) {
      translations.forEach(function (messages) {
        if (Object.prototype.hasOwnProperty.call(messages, key) && typeof messages[key] === 'string')
          values.push(messages[key]);
      });
    });
    return { translated: uniqueTexts(values), keys: uniqueTexts(keys) };
  }

  function labelDetails(node, translations, reader) {
    if (!node) return { label: '', aliases: [] };
    var translated = i18nAliases(node, translations);
    var values = translated.translated.concat([
      reader ? reader(node) : labelText(node),
      node.attrs && node.attrs['aria-label'],
      node.attrs && node.attrs.title,
      node.attrs && node.attrs.placeholder,
    ]).concat(translated.keys);
    var labels = uniqueTexts(values);
    return { label: labels[0] || '', aliases: labels.slice(1) };
  }

  var ADJACENT_LABEL_TAGS = {
    span: true, div: true, strong: true, em: true, b: true, small: true, p: true,
    h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, legend: true, caption: true
  };
  var ADJACENT_SKIP_TAGS = { button: true, input: true, select: true, textarea: true };

  function hiddenLabelNode(node) {
    if (!node || node.tag === '#text') return false;
    if (hasAttr(node, 'hidden')) return true;
    if (/(?:^|;)\s*display\s*:\s*none(?:\s*!important)?\s*(?:;|$)/i.test(node.attrs.style || '')) return true;
    return (node.attrs['class'] || '').split(/\s+/).some(function (name) {
      return /^(?:sheet-)?(?:hidden|hide)$/i.test(name);
    });
  }

  function adjacentLabelDetails(node, translations, parentDepth, rollRefs) {
    function siblingRollValue(button) {
      return String(button.attrs.value || '')
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
    }
    var inlineNames = rollRefs && rollRefs.length
      ? inlineExpressionRefs(node.attrs.value || '') : dictionary();
    function onlyReferencedInput(wrapper, input) {
      if (!input || !inlineNames[baseAttrName(input.attrs.name)]) return false;
      var found = false;
      var blocked = false;
      walk(wrapper, function (child) {
        if (child === input) { found = true; return; }
        if (!/^(?:div|span)$/.test(child.tag) || directLabelText(child) || Object.keys(child.attrs).some(function (name) {
          return /^(?:name|title|placeholder|aria-label|data-i18n(?:-.+)?)$/.test(name) &&
            normalizeText(child.attrs[name]);
        })) blocked = true;
      });
      return found && !blocked;
    }
    var current = node;
    for (var depth = 0; current && current.parent && depth <= parentDepth; depth += 1) {
      var values = [];
      var siblings = current.parent.children;
      var index = siblings.indexOf(current);
      var referencedInput = null;
      if (depth <= 1 && rollRefs && rollRefs.length) {
        var inputs = [];
        walk(current.parent, function (child) {
          if (child.tag !== 'input' || !/^(?:text|number|range)$/.test(fieldNodeType(child))) return;
          for (var ancestor = child; ancestor && ancestor !== current.parent; ancestor = ancestor.parent)
            if (hiddenLabelNode(ancestor) || suppressedDefaultNode(ancestor)) return;
          inputs.push(child);
        });
        // 이름칸이나 다른 수치가 함께 있으면 이 묶음의 제목을 한 굴림에 연결하지 않는다.
        var scalar = inputs.length === 1 && inputs[0];
        var scalarValue = scalar && normalizeText(scalar.attrs.value);
        var numericText = scalar && fieldNodeType(scalar) === 'text' &&
          /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(scalarValue) && isFinite(Number(scalarValue)) &&
          inlineNames[baseAttrName(scalar.attrs.name)];
        if (scalar && (fieldNodeType(scalar) === 'number' || numericText) && rollRefs.some(function (ref) {
          return ref && !ref.max && ref.name === baseAttrName(inputs[0].attrs.name);
        })) referencedInput = inputs[0];
      }
      // 같은 국소 입력에 명시적으로 연결된 제목은 별도 일반·보너스 버튼에도 유효하다.
      if (referencedInput && referencedInput.attrs.id && inlineNames[baseAttrName(referencedInput.attrs.name)]) {
        var explicitLabels = siblings.filter(function (sibling) {
          return sibling.tag === 'label' && sibling.attrs.for === referencedInput.attrs.id &&
            !hiddenLabelNode(sibling) && !hasRollControl(sibling);
        });
        if (explicitLabels.length === 1) {
          var explicitLabel = labelDetails(explicitLabels[0], translations, labelText);
          if (explicitLabel.label) return explicitLabel;
        }
      }
      [1, -1].forEach(function (direction) {
        for (var i = index + direction; i >= 0 && i < siblings.length; i += direction) {
          var sibling = siblings[i];
          if (sibling.tag === '#text') {
            var text = normalizeText(sibling.text);
            if (text && text.length <= 100) {
              values.push(text);
              break;
            }
            continue;
          }
          if (hiddenLabelNode(sibling)) continue;
          if (onlyReferencedInput(sibling, referencedInput)) continue;
          if (ADJACENT_SKIP_TAGS[sibling.tag]) {
            if (sibling.tag === 'input' &&
              (hasAttr(sibling, 'hidden') || (sibling.attrs.type || '').toLowerCase() === 'hidden')) continue;
            if (sibling === referencedInput) continue;
            if (depth === 0 && current.tag === 'button' && sibling.tag === 'button' &&
                normalizeText(current.attrs.name) && current.attrs.name === sibling.attrs.name &&
                (current.attrs.type || '').toLowerCase() === 'roll' &&
                (sibling.attrs.type || '').toLowerCase() === 'roll' &&
                siblingRollValue(current) === siblingRollValue(sibling)) continue;
            if (depth === 0 && sibling.tag !== 'button') continue;
            break;
          }
          if (ADJACENT_LABEL_TAGS[sibling.tag]) {
            var blocked = hasRollControl(sibling);
            if (!blocked) walk(sibling, function (child) {
              if (ADJACENT_SKIP_TAGS[child.tag]) blocked = true;
            });
            if (blocked) break;
            var details = labelDetails(sibling, translations, labelText);
            if (details.label) values.push(details.label);
            values = values.concat(details.aliases);
          }
          break;
        }
      });
      values = uniqueTexts(values).filter(searchableLabelText);
      if (values.length) return { label: values[0], aliases: values.slice(1) };
      current = current.parent;
    }
    return { label: '', aliases: [] };
  }

  function searchableLabelText(value) {
    var label = normalizeText(value);
    if (!label || label.length > 100) return false;
    return !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '');
  }

  function valueLikePlaceholder(value) {
    var text = normalizeText(value).replace(/\s+/g, '');
    return !!text && (
      /^[\d.,%()+\-*/]+$/.test(text) ||
      /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(text) ||
      /[@%?&]\{|\[\[|\]\]/.test(text)
    );
  }

  function referencedControlLabelDetails(node, translations) {
    var translated = i18nAliases(node, translations);
    var placeholder = normalizeText(node && node.attrs && node.attrs.placeholder);
    var values = translated.translated.concat([
      node && node.attrs && node.attrs['aria-label'],
      node && node.attrs && node.attrs.title,
      valueLikePlaceholder(placeholder) ? '' : placeholder,
    ]).concat(translated.keys);
    var labels = uniqueTexts(values).filter(searchableLabelText);
    return { label: labels[0] || '', aliases: labels.slice(1) };
  }

  function hasRollControl(node) {
    var found = false;
    walk(node, function (child) {
      if ((child.tag === 'button' || child.tag === 'input') && (child.attrs.type || '').toLowerCase() === 'roll')
        found = true;
    });
    return found;
  }

  function hasSemanticLabel(node) {
    var found = node.tag === 'th' || node.tag === 'label' || !!normalizeText(node.attrs && node.attrs['data-i18n']);
    if (found) return true;
    walk(node, function (child) {
      if (child.tag === 'label' || normalizeText(child.attrs && child.attrs['data-i18n'])) found = true;
    });
    return found;
  }

  function tableRowLabelDetails(node, translations, refs) {
    var cell = node;
    while (cell && cell.tag !== 'td' && cell.tag !== 'th') cell = cell.parent;
    if (!cell || !cell.parent || cell.parent.tag !== 'tr') return { label: '', aliases: [] };
    var cells = elementChildren(cell.parent).filter(function (item) { return item.tag === 'td' || item.tag === 'th'; });
    var referenced = dictionary();
    (refs || []).forEach(function (ref) { if (ref && ref.name) referenced[ref.name] = true; });
    var fallback = null;
    for (var index = cells.indexOf(cell) - 1; index >= 0; index -= 1) {
      if (hasRollControl(cells[index])) continue;
      var referencedLabels = [];
      walk(cells[index], function (child) {
        if (child.tag !== 'input' && child.tag !== 'select' && child.tag !== 'textarea') return;
        var name = baseAttrName(child.attrs && child.attrs.name);
        if (!referenced[name]) return;
        var controlDetails = referencedControlLabelDetails(child, translations);
        referencedLabels = referencedLabels.concat([controlDetails.label]).concat(controlDetails.aliases || []);
      });
      referencedLabels = uniqueTexts(referencedLabels).filter(searchableLabelText);
      if (referencedLabels.length) return { label: referencedLabels[0], aliases: referencedLabels.slice(1) };
      var details = labelDetails(cells[index], translations, labelText);
      var values = uniqueTexts([details.label].concat(details.aliases || [])).filter(searchableLabelText);
      if (!values.length) continue;
      var candidate = { label: values[0], aliases: values.slice(1) };
      if (hasSemanticLabel(cells[index])) return candidate;
      if (!fallback) fallback = candidate;
    }
    return fallback || { label: '', aliases: [] };
  }

  function mergeLabelDetails(primary, secondary) {
    var labels = uniqueTexts([primary && primary.label]
      .concat(primary && primary.aliases || [])
      .concat([secondary && secondary.label])
      .concat(secondary && secondary.aliases || []));
    return { label: labels[0] || '', aliases: labels.slice(1) };
  }

  function controlLabel(node, labelsByFor, translations) {
    for (var current = node.parent; current; current = current.parent) {
      if (current.tag === 'label') return labelDetails(current, translations, labelText);
    }
    if (node.attrs.id && labelsByFor[node.attrs.id]) return labelsByFor[node.attrs.id];
    var adjacent = adjacentLabelDetails(node, translations, 0);
    var ownLabel = labelDetails(node, translations, function () { return ''; });
    return mergeLabelDetails(adjacent, ownLabel);
  }

  function baseAttrName(value) {
    var name = normalizeText(value);
    return /^attr_/i.test(name) ? name.slice(5) : name;
  }

  function selectOptionContextAliases(option, label) {
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(normalizeText(label))) return [];
    var select = option && option.parent;
    while (select && select.tag !== 'select') select = select.parent;
    var container = select && select.parent;
    var children = container && elementChildren(container) || [];
    if (!container || children.length !== 1 || children[0] !== select ||
        !searchableLabelText(directLabelText(container))) return [];
    // 선택 항목만 대입해 앞 문맥과 뒤 단위의 원본 순서를 보존한다.
    var selected = { children: container.children.map(function (child) {
      return child === select ? { tag: '#text', text: label } : child;
    }) };
    return uniqueTexts([directLabelText(selected)]).filter(function (alias) {
      return alias !== normalizeText(label);
    });
  }

  function buildControls(groups, labelsByFor, translations) {
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
          var details = labelDetails(option, translations, nodeText);
          var label = details.label || option.attrs.label || option.attrs.value || '';
          var result = { label: label, value: hasAttr(option, 'value') ? option.attrs.value : label };
          var aliases = uniqueTexts(details.aliases.concat(selectOptionContextAliases(option, label)));
          if (aliases.length) result.aliases = aliases;
          return result;
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
            var details = controlLabel(radio, labelsByFor, translations);
            var result = { label: details.label || value, value: value };
            if (details.aliases.length) result.aliases = details.aliases;
            return result;
          }),
          default: checked ? (hasAttr(checked, 'value') ? checked.attrs.value : 'on') : null
        };
        if (radios.every(function (radio) {
          for (var parent = radio.parent; parent; parent = parent.parent) {
            if (parent.tag === 'nav' || /^(?:navigation|tablist)$/.test(parent.attrs.role || '') ||
                /(?:^|\s)(?:sheet-)?(?:navigation|tabs|tab-bar)(?:\s|$|__)/.test(parent.attrs['class'] || '')) return true;
          }
          return false;
        })) controls[name].navigation = true;
      } else if (nodes.some(function (node) { return node.tag === 'input' && (node.attrs.type || '').toLowerCase() === 'checkbox'; })) {
        var checkboxes = nodes.filter(function (node) { return node.tag === 'input' && (node.attrs.type || '').toLowerCase() === 'checkbox'; });
        var checkedBox = checkboxes.filter(function (checkbox) { return hasAttr(checkbox, 'checked'); })[0];
        var checkboxSeen = dictionary();
        controls[name] = {
          type: 'checkbox',
          options: checkboxes.map(function (checkbox) {
            var value = hasAttr(checkbox, 'value') ? checkbox.attrs.value : 'on';
            var details = controlLabel(checkbox, labelsByFor, translations);
            var result = { label: details.label || value, value: value };
            if (details.aliases.length) result.aliases = details.aliases;
            return result;
          }).filter(function (option) {
            if (checkboxSeen[option.value]) return false;
            checkboxSeen[option.value] = true;
            return true;
          }),
          // An unchecked Roll20 checkbox is unset/0, not its HTML value.
          default: checkedBox ? (hasAttr(checkedBox, 'value') ? checkedBox.attrs.value : 'on') : null
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

  function fieldNodeType(node) {
    if (node.tag === 'textarea' || node.tag === 'select') return node.tag;
    return (node.attrs.type || 'text').toLowerCase();
  }

  function hiddenFieldNode(node) {
    return hasAttr(node, 'hidden') || fieldNodeType(node) === 'hidden';
  }

  function suppressedDefaultNode(node) {
    return /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\.0*)?)\s*(?:!important\s*)?(?:;|$)/i
      .test(node && node.attrs && node.attrs.style || '');
  }

  function nearbyRollLabelDetails(node, translations) {
    var current = node && node.parent;
    for (var depth = 0; current && depth < 2; depth += 1, current = current.parent) {
      var rolls = [];
      var values = [];
      walk(current, function (child) {
        if ((child.tag === 'button' || child.tag === 'input') &&
          (child.attrs.type || '').toLowerCase() === 'roll') rolls.push(child);
        if (child.tag === 'input' && /^(?:text|number|range)$/.test(fieldNodeType(child)) &&
          !hasAttr(child, 'readonly') && !hasAttr(child, 'disabled') && !hiddenFieldNode(child))
          values.push(child);
      });
      if (rolls.length === 1 && values.length === 1 && values[0] === node) {
        var details = labelDetails(rolls[0], translations, nodeText);
        var labels = uniqueTexts([details.label].concat(details.aliases || [])).filter(searchableLabelText);
        return { label: labels[0] || '', aliases: labels.slice(1) };
      }
      // 더 넓은 부모에서는 후보 수가 줄지 않으므로, 다른 입력·굴림과 섞인 순간 중단한다.
      if (rolls.length > 1 || values.length > 1) break;
    }
    return { label: '', aliases: [] };
  }

  function singleValueContainerLabelDetails(node, translations) {
    var current = node;
    for (var depth = 0; current && current.parent && depth < 3; depth += 1) {
      var container = current.parent;
      var values = [];
      var scalars = [];
      walk(container, function (child) {
        if (child.tag !== 'input' || !/^(?:text|number|range)$/.test(fieldNodeType(child)) || hiddenFieldNode(child)) return;
        scalars.push(child);
        if (!hasAttr(child, 'readonly') && !hasAttr(child, 'disabled')) values.push(child);
      });
      if (values.length === 1 && scalars.indexOf(node) > -1) {
        var siblings = container.children;
        var index = siblings.indexOf(current);
        for (var i = index - 1; i >= 0; i -= 1) {
          var sibling = siblings[i];
          if (sibling.tag === '#text') {
            var text = normalizeText(sibling.text);
            if (!text) continue;
            if (searchableLabelText(text)) return { label: text, aliases: [] };
            break;
          }
          if (sibling.tag === 'input' && hiddenFieldNode(sibling)) continue;
          if (sibling.tag === 'input' || sibling.tag === 'select' || sibling.tag === 'textarea') break;
          var details = labelDetails(sibling, translations, directLabelText);
          if (!details.label)
            details = labelDetails(sibling, translations, labelText);
          var labels = uniqueTexts([details.label].concat(details.aliases || [])).filter(searchableLabelText);
          if (labels.length) return { label: labels[0], aliases: labels.slice(1) };
          break;
        }
      }
      current = container;
    }
    return { label: '', aliases: [] };
  }

  function fieldContextLabelDetails(node, translations) {
    // 한 겹 위의 라벨은 그 묶음 안에 편집 가능한 값 입력이 현재 입력 하나뿐일
    // 때만 읽는다. 큰 탭·무기 목록처럼 여러 입력을 품은 컨테이너의 제목과
    // 번역 문자열 전체가 개별 필드 별칭으로 번지는 것을 막는다.
    var details = adjacentLabelDetails(node, translations, 0);
    var container = node && node.parent && node.parent.parent;
    if (container) {
      var values = [];
      walk(container, function (child) {
        if ((child.tag === 'input' || child.tag === 'select' || child.tag === 'textarea') &&
          !hasAttr(child, 'readonly') && !hasAttr(child, 'disabled') && !hiddenFieldNode(child))
          values.push(child);
      });
      if (values.length === 1 && values[0] === node)
        details = mergeLabelDetails(details, adjacentLabelDetails(node, translations, 1));
    }
    details = mergeLabelDetails(details, singleValueContainerLabelDetails(node, translations));
    details = mergeLabelDetails(details, nearbyRollLabelDetails(node, translations));
    return mergeLabelDetails(details, tableRowLabelDetails(node, translations, []));
  }

  function applyFieldRollLabels(controlScopes, rolls) {
    var fields = controlScopes.fields || [];
    var global = dictionary();
    var sections = dictionary();
    fields.forEach(function (field) {
      if (field.section) {
        if (!sections[field.section]) sections[field.section] = dictionary();
        sections[field.section][field.name] = field;
      } else global[field.name] = field;
    });
    (rolls || []).forEach(function (roll) {
      var section = roll.repeating && roll.repeating.section;
      var seen = dictionary();
      var candidates = [];
      (roll.refs || []).forEach(function (ref) {
        if (!ref || ref.max) return;
        var field = section && sections[section] && sections[section][ref.name] || global[ref.name];
        if (!field || !field.numericCandidate) return;
        var key = (field.section || '') + '|' + field.name;
        if (seen[key]) return;
        seen[key] = true;
        candidates.push(field);
      });
      if (candidates.length !== 1) return;
      var labels = uniqueTexts((roll.staticLabels || []).map(function (entry) { return entry && entry.value; })
        .concat(roll.aliases || [])
        .concat([roll.label]))
        .filter(searchableLabelText);
      if (!labels.length) return;
      var field = candidates[0];
      var current = normalizeText(field.label);
      if (!current || current === normalizeText(field.name)) {
        field.label = labels[0];
        field.aliases = uniqueTexts((field.aliases || []).concat(labels.slice(1)));
      } else field.aliases = uniqueTexts((field.aliases || []).concat(labels));
    });
  }

  function resourceQualifier(field) {
    var roles = dictionary();
    var labels = uniqueTexts([field && field.label].concat(field && field.aliases || []));
    labels.forEach(function (label) {
      var compact = normalizeText(label).toLowerCase().replace(/[\s_.:()"'\-]+/g, '');
      var role = '';
      if (/^(?:현재.+|.+현재)$/.test(compact) || /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/.test(compact)) role = 'current';
      else if (/^(?:최대.+|.+최대)$/.test(compact) || /^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/.test(compact)) role = 'maximum';
      else if (/^(?:시작|초기).+|.+(?:시작|초기)$/.test(compact) || /^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/.test(compact)) role = 'start';
      else if (/^(?:4\/5|80%|threshold|문턱값|기준값)$/.test(compact)) role = 'threshold';
      if (!role) return;
      if (!roles[role]) roles[role] = [];
      roles[role].push(label);
    });
    var names = Object.keys(roles);
    return names.length === 1 ? { role: names[0], labels: uniqueTexts(roles[names[0]]) } : null;
  }

  function resourceHeadingDetails(node, translations) {
    var headingTags = {
      h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
      legend: true, caption: true, strong: true, b: true
    };
    function headingNode(candidate) {
      if (!candidate || candidate.tag === '#text') return false;
      var classes = normalizeText(candidate.attrs && candidate.attrs['class']).toLowerCase();
      return (candidate.tag === 'img' && !!normalizeText(candidate.attrs.alt)) ||
        !!headingTags[candidate.tag] || /(?:^|\s)(?:sheet-)?[^\s]*(?:head|header|title|tit|label)(?:\s|$)/.test(classes);
    }
    function usable(details) {
      var values = uniqueTexts([details && details.label].concat(details && details.aliases || [])).filter(function (label) {
        return searchableLabelText(label) && !valueLikePlaceholder(label) &&
          !resourceQualifier({ label: label, aliases: [] });
      });
      return { label: values[0] || '', aliases: values.slice(1) };
    }
    function read(candidate) {
      if (!headingNode(candidate)) return { label: '', aliases: [] };
      var details = usable(labelDetails(candidate, translations, candidate.tag === 'img'
        ? function (image) { return image.attrs.alt; } : directLabelText));
      return details.label ? details : usable(labelDetails(candidate, translations, labelText));
    }
    var direct = read(node);
    if (direct.label) return direct;
    var children = elementChildren(node);
    for (var index = 0; index < children.length; index += 1) {
      var child = read(children[index]);
      if (child.label) return child;
      var grandchildren = elementChildren(children[index]);
      for (var nested = 0; nested < grandchildren.length; nested += 1) {
        child = read(grandchildren[nested]);
        if (child.label) return child;
      }
    }
    return { label: '', aliases: [] };
  }

  function resourceRollLabelDetails(container) {
    var strong = [];
    var weak = [];
    walk(container, function (node) {
      if ((node.tag !== 'button' && node.tag !== 'input') ||
        (node.attrs.type || '').toLowerCase() !== 'roll') return;
      templateFields(node.attrs.value || '').forEach(function (field) {
        if (!/^(?:subject|name|title|label|skill|attribute)$/i.test(field.field) ||
          /[@%?&^]\{|\[\[|\$\[\[/.test(field.value)) return;
        var label = normalizeText(field.value);
        if (searchableLabelText(label) && !valueLikePlaceholder(label) &&
          !resourceQualifier({ label: label, aliases: [] }))
          (/^(?:subject|skill|attribute)$/i.test(field.field) ? strong : weak).push(label);
      });
    });
    strong = uniqueTexts(strong);
    weak = uniqueTexts(weak);
    if (strong.length === 1) return { label: strong[0], aliases: [], strong: true };
    return weak.length === 1 ? { label: weak[0], aliases: [], strong: false } : { label: '', aliases: [] };
  }

  function resourceHeadingBranch(node) {
    var control = false;
    if (node) walk(node, function (child) {
      if (/^(?:input|select|textarea)$/.test(child.tag) && /^attr_/i.test(child.attrs.name || '')) control = true;
    });
    return !!node && !control;
  }

  function resourceGroupLabelDetails(container, translations) {
    var fallback = null;
    var branch = container;
    for (var depth = 0; branch && branch.tag !== '#root' && depth < 4; depth += 1) {
      var details = resourceHeadingDetails(branch, translations);
      if (details.label) return details;
      details = resourceRollLabelDetails(branch);
      if (details.label && details.strong) return details;
      if (!fallback && details.label) fallback = details;
      var siblings = branch.parent ? elementChildren(branch.parent) : [];
      var preceding = siblings[siblings.indexOf(branch) - 1];
      if (resourceHeadingBranch(preceding)) {
        details = resourceHeadingDetails(preceding, translations);
        if (details.label) return details;
      }
      branch = branch.parent;
    }
    return fallback || { label: '', aliases: [] };
  }

  function applyResourceGroupLabels(controlScopes, translations) {
    function apply(fields, groups) {
      var candidates = new Map();
      (fields || []).forEach(function (field) {
        if (!/^(?:text|number|range)$/.test(field.type) || field.hidden) return;
        var qualifier = resourceQualifier(field);
        if (!qualifier) return;
        (groups && groups[field.name] || []).forEach(function (node) {
          if (hiddenFieldNode(node)) return;
          var container = node.parent;
          for (var distance = 0; container && container.tag !== '#root' && distance < 4;
            distance += 1, container = container.parent) {
            if (!candidates.has(container)) candidates.set(container, []);
            candidates.get(container).push({ field: field, qualifier: qualifier, distance: distance });
          }
        });
      });

      var groupsToApply = [];
      candidates.forEach(function (entries, container) {
        var byField = dictionary();
        entries.forEach(function (entry) {
          var current = byField[entry.field.name];
          if (!current || entry.distance < current.distance) byField[entry.field.name] = entry;
        });
        var unique = Object.keys(byField).map(function (name) { return byField[name]; });
        var byRole = dictionary();
        unique.forEach(function (entry) {
          var role = entry.qualifier.role;
          if (!byRole[role]) byRole[role] = [];
          byRole[role].push(entry);
        });
        if (!byRole.current || byRole.current.length !== 1 || unique.length < 2 ||
          !(byRole.maximum || byRole.start || byRole.threshold)) return;
        if (Object.keys(byRole).some(function (role) { return byRole[role].length > 1; })) return;
        var scalarNames = dictionary();
        walk(container, function (node) {
          if (node.tag !== 'input' || !/^(?:text|number|range)$/.test(fieldNodeType(node)) || hiddenFieldNode(node)) return;
          var name = baseAttrName(node.attrs.name);
          if (name) scalarNames[name] = true;
        });
        if (Object.keys(scalarNames).length > 12) return;
        groupsToApply.push({
          container: container,
          entries: unique,
          roles: Object.keys(byRole).length,
          maximumDistance: unique.reduce(function (maximum, entry) {
            return Math.max(maximum, entry.distance);
          }, 0)
        });
      });
      groupsToApply.sort(function (left, right) {
        return right.roles - left.roles || right.entries.length - left.entries.length ||
          left.maximumDistance - right.maximumDistance;
      });

      var assigned = dictionary();
      groupsToApply.forEach(function (group) {
        if (group.entries.some(function (entry) { return assigned[entry.field.name]; })) return;
        var details = resourceGroupLabelDetails(group.container, translations);
        if (!details.label) return;
        group.entries.forEach(function (entry) {
          // 검색·수치 변경 별칭과 분리한다. 같은 `이성` alias를 현재값과
          // 시작값 모두에 넣으면 `:이성-5`가 모호해지므로, 원본 UI 묶음은
          // 선택 메타데이터로만 보존한다.
          entry.field.groupLabel = details.label;
          assigned[entry.field.name] = true;
        });
      });
    }

    var globalFields = (controlScopes.fields || []).filter(function (field) { return !field.section; });
    apply(globalFields, controlScopes.nodes.global);
    Object.keys(controlScopes.nodes.sections || {}).forEach(function (section) {
      apply((controlScopes.fields || []).filter(function (field) { return field.section === section; }),
        controlScopes.nodes.sections[section]);
    });
  }

  function applyNamedResourcePairGroups(controlScopes, translations) {
    var headingTags = {
      h1: true, h2: true, h3: true, h4: true, h5: true, h6: true,
      legend: true, caption: true, strong: true, b: true
    };
    var ignoredSourceTokens = dictionary({
      attr: true, class: true, current: true, data: true, field: true,
      head: true, header: true, i18n: true, input: true, max: true,
      maximum: true, name: true, number: true, resource: true, row: true,
      section: true, sheet: true, text: true, tit: true, title: true,
      type: true, value: true
    });

    function sourceTokens(values) {
      var found = dictionary();
      (values || []).forEach(function (value) {
        normalizeText(value).replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
          .split(/[^a-z0-9가-힣]+/).forEach(function (part) {
            if (part.length < 2 || ignoredSourceTokens[part]) return;
            found[part] = true;
          });
      });
      return Object.keys(found);
    }

    function nodeSourceTokens(node, parentDepth) {
      var values = [];
      for (var depth = 0; node && node.tag !== '#root' && depth <= parentDepth;
        depth += 1, node = node.parent) {
        Object.keys(node.attrs || {}).forEach(function (name) {
          if (/^(?:class|id|name|data-[a-z0-9_-]+)$/i.test(name)) values.push(name, node.attrs[name]);
        });
      }
      return sourceTokens(values);
    }

    function headingNode(candidate) {
      if (!candidate || candidate.tag === '#text') return false;
      var classes = normalizeText(candidate.attrs && candidate.attrs['class']).toLowerCase();
      return (candidate.tag === 'img' && !!normalizeText(candidate.attrs.alt)) || !!headingTags[candidate.tag] ||
        /(?:^|\s)(?:sheet-)?[^\s]*(?:head|header|title|tit|label)(?:\s|$)/.test(classes);
    }

    function collectHeadingCandidates(node, distance, nestedDepth, found) {
      if (!node || nestedDepth > 4) return;
      if (headingNode(node)) {
        var details = resourceHeadingDetails(node, translations);
        if (details.label) found.push({
          details: details,
          distance: distance + nestedDepth,
          tokens: nodeSourceTokens(node, 1)
        });
        return;
      }
      elementChildren(node).forEach(function (child) {
        collectHeadingCandidates(child, distance, nestedDepth + 1, found);
      });
    }

    function directBranch(container, node) {
      while (node && node.parent !== container) node = node.parent;
      return node && node.parent === container ? node : null;
    }

    function tokenAffinity(pairTokens, headingTokens) {
      var best = 0;
      pairTokens.forEach(function (pairToken) {
        headingTokens.forEach(function (headingToken) {
          if (pairToken === headingToken) best = Math.max(best, 100 + pairToken.length);
          else if ((pairToken.length === 2 && headingToken.indexOf(pairToken) === 0) ||
            (pairToken.length >= 3 && headingToken.indexOf(pairToken) >= 0))
            best = Math.max(best, 50 + pairToken.length);
          else if ((headingToken.length === 2 && pairToken.indexOf(headingToken) === 0) ||
            (headingToken.length >= 3 && pairToken.indexOf(headingToken) >= 0))
            best = Math.max(best, 25 + headingToken.length);
        });
      });
      return best;
    }

    function selectHeadingCandidate(candidates, pairTokens) {
      var byLabel = dictionary();
      (candidates || []).forEach(function (candidate) {
        var key = normalizeText(candidate.details.label).toLowerCase();
        if (!key) return;
        var affinity = tokenAffinity(pairTokens, candidate.tokens);
        if (!byLabel[key] || affinity > byLabel[key].affinity ||
          (affinity === byLabel[key].affinity && candidate.distance < byLabel[key].distance)) {
          byLabel[key] = { details: candidate.details, affinity: affinity, distance: candidate.distance };
        }
      });
      var unique = Object.keys(byLabel).map(function (key) { return byLabel[key]; });
      if (unique.length === 1) return unique[0].details;
      if (!unique.length) return { label: '', aliases: [] };
      unique.sort(function (left, right) {
        return right.affinity - left.affinity || left.distance - right.distance;
      });
      if (!unique[0].affinity ||
        (unique[1] && unique[0].affinity === unique[1].affinity &&
          unique[0].distance === unique[1].distance)) return { label: '', aliases: [] };
      return unique[0].details;
    }

    function pairGroupDetails(container, left, right, fieldName) {
      var candidates = [];
      var pairTokens = sourceTokens([fieldName]).concat(nodeSourceTokens(left, 7), nodeSourceTokens(right, 7));
      for (var depth = 0; container && container.tag !== '#root' && depth < 6;
        depth += 1, container = container.parent) {
        var children = elementChildren(container);
        var leftBranch = directBranch(container, left);
        var rightBranch = directBranch(container, right);
        var leftIndex = children.indexOf(leftBranch);
        var rightIndex = children.indexOf(rightBranch);
        if (leftIndex < 0 || rightIndex < 0) continue;
        var cutoff = Math.min(leftIndex, rightIndex);
        // 입력란 없는 바로 앞 제목 묶음은 먼 이웃 자원의 제목보다 우선한다.
        // 병렬 제목이 여럿이면 기존 소스 토큰 판별을 그대로 적용한다.
        var adjacent = [];
        if (cutoff > 0 && resourceHeadingBranch(children[cutoff - 1]))
          collectHeadingCandidates(children[cutoff - 1], depth * 10 + 1, 0, adjacent);
        if (adjacent.length) return selectHeadingCandidate(adjacent, uniqueTexts(pairTokens));
        for (var index = 0; index < cutoff; index += 1) {
          collectHeadingCandidates(children[index], depth * 10 + cutoff - index, 0, candidates);
        }
      }
      return selectHeadingCandidate(candidates, uniqueTexts(pairTokens));
    }

    function sharedGroupDetails(leftNodes, rightNodes, fieldName) {
      var best = [];
      (leftNodes || []).forEach(function (left) {
        var ancestors = new Map();
        var node = left && left.parent;
        for (var distance = 0; node && node.tag !== '#root' && distance < 8;
          distance += 1, node = node.parent) ancestors.set(node, distance);
        (rightNodes || []).forEach(function (right) {
          var candidate = right && right.parent;
          for (var rightDistance = 0; candidate && candidate.tag !== '#root' && rightDistance < 8;
            rightDistance += 1, candidate = candidate.parent) {
            if (!ancestors.has(candidate)) continue;
            var score = ancestors.get(candidate) + rightDistance;
            var scalarCount = 0;
            walk(candidate, function (child) {
              if ((child.tag === 'input' || child.tag === 'textarea' || child.tag === 'select') &&
                /^(?:text|number|range)$/.test(fieldNodeType(child)) && !hiddenFieldNode(child)) scalarCount += 1;
            });
            if (scalarCount > 4) break;
            var details = pairGroupDetails(candidate, left, right, fieldName);
            if (details.label) best.push({ score: score, details: details });
            break;
          }
        });
      });
      best.sort(function (left, right) { return left.score - right.score; });
      if (!best.length) return null;
      var nearest = best.filter(function (entry) { return entry.score === best[0].score; });
      var labels = uniqueTexts(nearest.map(function (entry) { return entry.details.label; }));
      return labels.length === 1 ? nearest[0].details : null;
    }

    function apply(fields, nodes) {
      var byName = dictionary();
      (fields || []).forEach(function (field) { byName[field.name] = field; });
      (fields || []).forEach(function (maximum) {
        var match = /^(.+)_max$/i.exec(maximum.name || '');
        if (!match || maximum.hidden || !/^(?:text|number|range)$/.test(maximum.type)) return;
        var current = byName[match[1]];
        if (!current || current.hidden || !current.numericCandidate ||
          !/^(?:text|number|range)$/.test(current.type)) return;
        var details = sharedGroupDetails(nodes[current.name], nodes[maximum.name], current.name);
        if (!details || !details.label) return;
        [current, maximum].forEach(function (field) {
          if (!field.groupLabel) field.groupLabel = details.label;
        });
      });
    }

    var globalFields = (controlScopes.fields || []).filter(function (field) { return !field.section; });
    apply(globalFields, controlScopes.nodes.global);
    Object.keys(controlScopes.nodes.sections || {}).forEach(function (section) {
      apply((controlScopes.fields || []).filter(function (field) { return field.section === section; }),
        controlScopes.nodes.sections[section]);
    });
  }

  function applyResourcePairLabels(controlScopes) {
    var fields = controlScopes.fields || [];
    var global = dictionary();
    var sections = dictionary();
    fields.forEach(function (field) {
      if (field.section) {
        if (!sections[field.section]) sections[field.section] = dictionary();
        sections[field.section][field.name] = field;
      } else global[field.name] = field;
    });
    fields.filter(function (field) { return field.numericCandidate; }).forEach(function (field) {
      var groups = field.section ? controlScopes.nodes.sections[field.section] : controlScopes.nodes.global;
      var fieldMap = field.section ? sections[field.section] : global;
      (groups && groups[field.name] || []).forEach(function (node) {
        var siblings = (node.parent && node.parent.children || []).filter(function (child) {
          return child.tag === 'input' && /^(?:text|number|range)$/.test(fieldNodeType(child)) && !hiddenFieldNode(child);
        });
        var siblingFields = uniqueTexts(siblings.map(function (child) { return baseAttrName(child.attrs.name); }))
          .map(function (name) { return fieldMap[name]; }).filter(Boolean);
        if (siblingFields.filter(function (candidate) { return candidate.numericCandidate; }).length !== 1) return;
        var labels = uniqueTexts([field.label].concat(field.aliases || [])).filter(function (label) {
          var normalized = normalizeText(label);
          return searchableLabelText(label) && !valueLikePlaceholder(label) &&
            normalized !== normalizeText(field.name) &&
            !/^(?:현재|최대|시작|current|maximum|max|start|value|score|값|수치|점수)$/i.test(normalized);
        });
        if (!labels.length) return;
        siblingFields.forEach(function (candidate) {
          if (candidate.name !== field.name + '_max' || !(candidate.disabled || candidate.readonly) ||
            normalizeText(candidate.label) !== normalizeText(candidate.name) ||
            (candidate.aliases || []).some(function (alias) {
              return normalizeText(alias) && normalizeText(alias) !== normalizeText(candidate.name);
            })) return;
          // 같은 부모의 유일한 현재값과 명시적으로 짝지어진 무명 최대 선언만 보완한다.
          candidate.label = '최대';
          if (!candidate.groupLabel) candidate.groupLabel = labels[0];
        });
        siblingFields.filter(function (candidate) {
          return candidate !== field && /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalizeText(candidate.label));
        }).forEach(function (maximum) {
          maximum.aliases = uniqueTexts((maximum.aliases || []).concat(labels));
        });
      });
    });
  }

  function buildFields(groups, controls, labelsByFor, translations, section) {
    return Object.keys(groups).sort().map(function (name) {
      var nodes = groups[name];
      var labels = { label: '', aliases: [] };
      nodes.forEach(function (node) {
        labels = mergeLabelDetails(labels, controlLabel(node, labelsByFor, translations));
        // 현재/최대처럼 짧은 입력 라벨만 있는 시트도 같은 행·셀에 결속된
        // 사용자 표시명을 함께 보존한다. 먼 상위 묶음의 설명·제작자 표기는 읽지 않는다.
        if (!hiddenFieldNode(node))
          labels = mergeLabelDetails(labels, fieldContextLabelDetails(node, translations));
      });
      var candidates = nodes.filter(function (node) {
        return node.tag === 'input' && /^(?:text|number|range)$/.test(fieldNodeType(node)) &&
          !hasAttr(node, 'readonly') && !hasAttr(node, 'disabled') && !hiddenFieldNode(node);
      });
      var visibleCandidates = candidates.filter(function (node) { return !suppressedDefaultNode(node); });
      var candidate = visibleCandidates[0] || candidates[0];
      var trackable = nodes.some(function (node) {
        return node.tag === 'input' && /^(?:text|number|range|checkbox|radio)$/.test(fieldNodeType(node)) &&
          !hasAttr(node, 'readonly') && !hasAttr(node, 'disabled') && !hiddenFieldNode(node);
      });
      var persistable = nodes.some(function (node) {
        return (node.tag === 'input' || node.tag === 'select' || node.tag === 'textarea') &&
          !hasAttr(node, 'readonly') && !hasAttr(node, 'disabled') && !hiddenFieldNode(node);
      });
      var field = {
        name: name,
        type: candidate ? fieldNodeType(candidate) : controls[name].type,
        label: labels.label || name,
        aliases: labels.aliases,
        section: section || null,
        default: controls[name] && controls[name].default,
        max: candidate && candidate.attrs.max || '',
        onValue: controls[name] && controls[name].options && controls[name].options[0]
          ? controls[name].options[0].value : '',
        readonly: nodes.every(function (node) { return hasAttr(node, 'readonly'); }),
        disabled: nodes.every(function (node) { return hasAttr(node, 'disabled'); }),
        hidden: nodes.every(hiddenFieldNode),
        numericCandidate: !!candidate,
        trackCandidate: trackable,
        persistCandidate: persistable
      };
      if (candidate && visibleCandidates.length) {
        var explicitVisibleDefault = hasAttr(candidate, 'value');
        var visibleDefault = explicitVisibleDefault ? candidate.attrs.value : '';
        var suppressedDefaults = nodes.filter(function (node) {
          return node !== candidate && (suppressedDefaultNode(node) ||
            (explicitVisibleDefault && hiddenFieldNode(node)));
        });
        var alternateDefaults = uniqueTexts(suppressedDefaults.map(function (node) {
          return hasAttr(node, 'value') ? node.attrs.value : '';
        })).filter(function (value) { return value !== normalizeText(visibleDefault); });
        if (suppressedDefaults.length) field.default = visibleDefault;
        if (alternateDefaults.length) {
          field.defaultVariants = [visibleDefault].concat(alternateDefaults);
        }
      }
      return field;
    });
  }

  function applyNumericRadioFields(controlScopes, translations, visibility) {
    (controlScopes.fields || []).forEach(function (field) {
      if (field.section || field.type !== 'radio' || field.hidden || field.readonly || field.disabled ||
          visibility.controls[field.name]) return;
      var nodes = controlScopes.nodes.global[field.name] || [];
      var control = controlScopes.global[field.name];
      if (nodes.length < 3 || !control || control.options.length !== nodes.length ||
          nodes.some(function (node) {
            for (var ancestor = node; ancestor && ancestor.tag !== '#root'; ancestor = ancestor.parent) {
              if (hiddenFieldNode(ancestor) || suppressedDefaultNode(ancestor)) return true;
            }
            return node.tag !== 'input' || fieldNodeType(node) !== 'radio' ||
              hasAttr(node, 'readonly') || hasAttr(node, 'disabled');
          })) return;
      var numbers = [];
      if (control.options.some(function (option) {
        var value = String(option.value);
        var number = Number(value);
        if (!/^-?(?:0|[1-9]\d*)$/.test(value) || !isFinite(number) ||
            Math.abs(number) > 9007199254740991 || String(number) !== value ||
            !/^[+-]?\d+$/.test(normalizeText(option.label)) ||
            Number(normalizeText(option.label)) !== number) return true;
        numbers.push(number);
        return false;
      })) return;
      numbers.sort(function (left, right) { return left - right; });
      if (numbers.some(function (number, index) { return index && number !== numbers[index - 1] + 1; })) return;
      var container = nodes[0].parent;
      for (var depth = 0; container && container.tag !== '#root' && depth < 4;
        depth += 1, container = container.parent) {
        var members = [];
        var companions = [];
        var unsupported = false;
        walk(container, function (node) {
          if (hiddenFieldNode(node) || suppressedDefaultNode(node)) unsupported = true;
          if (node.tag === 'button' || node.tag === 'input' && fieldNodeType(node) === 'roll') {
            if (fieldNodeType(node) !== 'roll') unsupported = true;
            return;
          }
          if (!/^(?:input|select|textarea)$/.test(node.tag)) return;
          if (nodes.indexOf(node) >= 0) members.push(node);
          else if (node.tag === 'input' && /^(?:number|range)$/.test(fieldNodeType(node)) &&
              !hiddenFieldNode(node) && /^attr_/i.test(node.attrs.name || ''))
            companions.push(node);
          else unsupported = true;
        });
        if (members.length !== nodes.length || unsupported || companions.length !== 1) continue;
        var companionName = baseAttrName(companions[0].attrs.name).toLowerCase();
        var name = field.name.toLowerCase();
        // A unique same-group scalar with the exact attribute suffix is related evidence, not a maximum.
        if (companionName.length <= name.length || companionName.slice(-name.length) !== name) continue;
        var headings = elementChildren(container).filter(function (node) {
          return /^(?:h[1-6]|legend|caption)$/.test(node.tag) && resourceHeadingBranch(node);
        }).map(function (node) { return resourceHeadingDetails(node, translations); })
          .filter(function (details) { return !!details.label; });
        if (headings.length !== 1) continue;
        field.label = headings[0].label;
        field.aliases = headings[0].aliases.slice();
        field.groupLabel = headings[0].label;
        field.numericCandidate = true;
        field.radioRange = [numbers[0], numbers[numbers.length - 1]];
        return;
      }
    });
  }

  function collectControls(root, translations) {
    var labelsByFor = dictionary();
    var globalGroups = dictionary();
    var sectionGroups = dictionary();
    walk(root, function (node) {
      if (node.tag === 'label' && node.attrs['for']) labelsByFor[node.attrs['for']] = labelDetails(node, translations, labelText);
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
    var global = buildControls(globalGroups, labelsByFor, translations);
    var sections = dictionary();
    var fields = buildFields(globalGroups, global, labelsByFor, translations, null);
    Object.keys(sectionGroups).sort().forEach(function (section) {
      sections[section] = buildControls(sectionGroups[section], labelsByFor, translations);
      fields = fields.concat(buildFields(sectionGroups[section], sections[section], labelsByFor, translations, section));
    });
    return {
      global: global,
      sections: sections,
      fields: fields,
      nodes: { global: globalGroups, sections: sectionGroups }
    };
  }

  function applySettingsControls(root, controlScopes, userOptions) {
    var options = dictionary();
    (Array.isArray(userOptions) ? userOptions : []).forEach(function (option) {
      var name = baseAttrName(option && option.attribute || '');
      if (name && controlScopes.global[name]) options[name] = true;
    });
    if (!Object.keys(options).length) return;
    function settingsClass(node) {
      return /(?:^|[\s_-])(?:config|configuration|settings|options)(?:$|[\s_-])/i.test(
        String(node.attrs['class'] || '').replace(/([a-z])([A-Z])/g, '$1-$2'));
    }
    var panels = new Set();
    walk(root, function (node) {
      if (!/^(?:div|fieldset|section|aside)$/.test(node.tag) || !settingsClass(node)) return;
      var declared = dictionary();
      var gameplay = false;
      walk(node, function (child) {
        var name = baseAttrName(child.attrs.name || '');
        if (options[name]) declared[name] = true;
        if (child.tag === 'button' && /^(?:roll|action)$/.test(child.attrs.type || '') ||
            /^repeating_/.test(child.attrs['class'] || '') ||
            child.tag === 'input' && !hiddenFieldNode(child) && !/^(?:checkbox|radio)$/.test(fieldNodeType(child))) gameplay = true;
      });
      // Author-declared options anchor a settings-only panel; do not infer from a class alone.
      if (!gameplay && Object.keys(declared).length >= 2) panels.add(node);
    });
    controlScopes.fields.forEach(function (field) {
      if (field.section || !/^(?:checkbox|radio)$/.test(field.type)) return;
      var nodes = controlScopes.nodes.global[field.name] || [];
      if (options[field.name] || nodes.length && nodes.every(function (node) {
        if (panels.size && settingsClass(node)) return true;
        for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent)
          if (panels.has(ancestor)) return true;
        return false;
      })) field.trackCandidate = false;
    });
  }

  function applyFieldVisibility(controlScopes, conditions) {
    (controlScopes.fields || []).forEach(function (field) {
      if (!field.trackCandidate) return;
      var groups = field.section
        ? controlScopes.nodes.sections[field.section]
        : controlScopes.nodes.global;
      var nodes = groups && groups[field.name] || [];
      var seen = dictionary();
      var conditionalNodes = 0;
      var visibleWhen = nodes.map(function (node) {
        var condition = conditions[node._kibSheetNodeId];
        if (condition) conditionalNodes += 1;
        return condition;
      }).filter(function (condition) {
        if (!condition) return false;
        var key = JSON.stringify(condition);
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
      // One unconditional copy means the shared Roll20 attribute is always available.
      if (nodes.length && conditionalNodes === nodes.length)
        field.visibility = visibilityAny(visibleWhen);
    });
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

  function escapedClosingBrace(text, index) {
    var match = text.charAt(index) === '&' && text.slice(index).match(/^&(?:amp;)*(?:#(?:0*125|x0*7d)|rbrace);/i);
    return match ? match[0].length : 0;
  }

  function findBraceEnd(text, start) {
    var depth = 1;
    for (var i = start + 2; i < text.length; i += 1) {
      var escaped = depth > 1 && escapedClosingBrace(text, i);
      if (escaped) { depth -= 1; i += escaped - 1; }
      else if (text.charAt(i) === '{') depth += 1;
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
      var escaped = braces && escapedClosingBrace(text, i);
      if (escaped) { braces -= 1; i += escaped - 1; }
      else if (ch === '{') braces += 1;
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
          options.push({ label: label, value: decodeEntities(pair.length > 1 ? pair[1].trim() : pair[0].trim()) });
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

  function selectableRef(text, controls, querySpans, excluded, selectable) {
    var refs = refTokens(text);
    for (var i = 0; i < refs.length; i += 1) {
      var ref = refs[i];
      var insideQuery = querySpans.some(function (query) { return ref.start >= query.start && ref.start < query.end; });
      var control = controls[ref.name];
      if (!insideQuery && !ref.max && !excluded[ref.name] && selectable[ref.name] && control && (control.type === 'select' || control.type === 'radio') && control.options.length) {
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

  function optionLabelChoices(option) {
    return uniqueTexts([option && (option.label || option.value)].concat(option && option.aliases || []));
  }

  function expandedLabelAliases(labelChoices, primaryPath) {
    var paths = [[]];
    (labelChoices || []).forEach(function (choices) {
      var next = [];
      (choices && choices.length ? choices : ['']).forEach(function (choice) {
        paths.forEach(function (path) {
          if (next.length < 32) next.push(path.concat(choice));
        });
      });
      paths = next.length ? next : paths;
    });
    var primary = normalizeText((primaryPath || []).join(' '));
    return uniqueTexts(paths.map(function (path) { return path.join(' '); })).filter(function (alias) {
      return normalizeText(alias) !== primary;
    });
  }

  function expandModes(raw, controls, selectable) {
    // ponytail: cap one button's nested query variants; raise only after Roll20 payload profiling.
    var MAX_MODES = 200;
    var MAX_EXPANSIONS = 100;
    var modes = [];
    var expansions = 0;
    var incomplete = false;
    function finish(state) {
      if (modes.length >= MAX_MODES) {
        incomplete = true;
        return;
      }
      var data = {
        labelPath: state.labelPath,
        overrides: canonicalObject(state.overrides),
        queries: canonicalObject(state.queries)
      };
      data.id = 'mode-' + shortHash(JSON.stringify(data));
      var aliases = uniqueTexts((state.aliases || []).concat(expandedLabelAliases(state.labelChoices, data.labelPath)));
      var mode = { id: data.id, labelPath: data.labelPath, overrides: data.overrides, queries: data.queries };
      if (aliases.length) mode.aliases = aliases;
      modes.push(mode);
    }
    function expandQueries(text, state, seen, depth, done) {
      expansions += 1;
      if (modes.length >= MAX_MODES || expansions > MAX_EXPANSIONS || depth > 8) {
        incomplete = true;
        return;
      }
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
            labelChoices: state.labelChoices.concat([optionLabelChoices(option)]),
            aliases: state.aliases.concat(choice.title + ' ' + option.label),
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
      if (modes.length >= MAX_MODES || expansions > MAX_EXPANSIONS || depth > 8) {
        incomplete = true;
        return;
      }
      var marker = text + '\n' + JSON.stringify(canonicalObject(state.overrides)) + '\n' + JSON.stringify(canonicalObject(state.queries));
      if (seen[marker]) return;
      seen[marker] = true;
      var queries = queryTokens(text);
      var choice = queries.filter(function (query) { return query.options.length; })[0] || null;
      var ref = selectableRef(text, controls, queries, excluded, selectable);
      if (choice && (!ref || choice.start < ref.start)) {
        choice.options.forEach(function (option) {
          var nextText = text.slice(0, choice.start) + option.value + text.slice(choice.end);
          if (nextText === text) return;
          var nextQueries = dictionary(state.queries);
          nextQueries[queryKey(nextQueries, choice.title)] = { raw: choice.raw, value: option.value };
          expandControlValue(nextText, {
            labelPath: state.labelPath.concat(option.label),
            labelChoices: state.labelChoices.concat([optionLabelChoices(option)]),
            aliases: state.aliases.concat(choice.title + ' ' + option.label),
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
            labelChoices: state.labelChoices.concat([optionLabelChoices(option)]),
            aliases: state.aliases.concat(option.aliases || []),
            overrides: nextOverrides,
            queries: dictionary(state.queries)
          }, nextExcluded, seen, depth + 1);
        });
        return;
      }
      finish(state);
    }
    var variants = [];
    expandQueries(raw, { labelPath: [], labelChoices: [], aliases: [], overrides: dictionary(), queries: dictionary() }, dictionary(), 0, function (text, state) {
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
        if (!insideQuery && !roots[key] && !ref.max && selectable[ref.name] && control && (control.type === 'select' || control.type === 'radio') && control.options.length)
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
            labelChoices: variant.state.labelChoices.concat([optionLabelChoices(option)]),
            aliases: variant.state.aliases.concat(option.aliases || []),
            overrides: selected,
            queries: dictionary(variant.state.queries)
          }, excluded, dictionary(), 0);
        });
      });
    });
    var unique = dictionary();
    var result = modes.filter(function (mode) {
      var key = JSON.stringify(mode);
      if (unique[key]) return false;
      unique[key] = true;
      return true;
    });
    result.incomplete = incomplete;
    return result;
  }

  function compactSignature(controls, rolls, fields) {
    var frequencies = dictionary();
    var tokenFrequencies = dictionary();
    var persistable = dictionary();
    (fields || []).forEach(function (field) {
      if (!field.section && field.persistCandidate) persistable[field.name] = true;
    });
    Object.keys(controls).filter(function (name) { return persistable[name]; }).forEach(function (name) {
      name.toLowerCase().split(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+/).filter(Boolean).forEach(function (token) {
        tokenFrequencies[token] = (tokenFrequencies[token] || 0) + 1;
      });
    });
    rolls.forEach(function (roll) {
      var seen = dictionary();
      function count(name, depth) {
        if (!name || seen[name] || depth > 8) return;
        seen[name] = true;
        if (persistable[name]) {
          frequencies[name] = (frequencies[name] || 0) + 1;
          return;
        }
        var control = controls[name];
        if (!control) return;
        refTokens(String(control.default || '')).forEach(function (ref) {
          if (!ref.max) count(ref.name, depth + 1);
        });
      }
      roll.refs.forEach(function (ref) {
        if (!ref.max) count(ref.name, 0);
      });
    });
    return Object.keys(controls).filter(function (name) {
      return !controls[name].repeating && persistable[name];
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
        if (/[@%?&^]\{/.test(raw.slice(cursor, cursor + 2))) {
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

  function resultOutcomeFromAttributes(node) {
    var i18n = normalizeText(node && node.attrs && node.attrs['data-i18n']).toLowerCase();
    if (i18n === 'critical') return 'critical';
    if (i18n === 'fumble') return 'fumble';
    var classes = normalizeText(node && node.attrs && node.attrs['class']).toLowerCase().split(/\s+/);
    for (var i = 0; i < classes.length; i += 1) {
      var name = classes[i].replace(/^sheet-/, '');
      if (name === 'critical') return 'critical';
      if (name === 'fumble') return 'fumble';
    }
    return null;
  }

  function resultOutcomeFromText(value) {
    var text = normalizeText(value).toLowerCase().replace(/[.!:：]+$/g, '');
    if (text === 'critical' || text === 'critical success' || text === '대성공') return 'critical';
    if (text === 'fumble' || text === '대실패') return 'fumble';
    return null;
  }

  function rollTemplateName(node) {
    var classes = normalizeText(node && node.attrs && node.attrs['class']).split(/\s+/);
    for (var i = 0; i < classes.length; i += 1) {
      var match = classes[i].match(/^sheet-rolltemplate-(.+)$/i);
      if (match) return normalizeText(match[1]);
    }
    return '';
  }

  function resultGroup(node, templateNode) {
    var current = node && node.tag === '#text' ? node.parent : node;
    while (current && current !== templateNode) {
      if (current.tag === 'tr') {
        var children = elementChildren(current);
        for (var i = 0; i < children.length; i += 1) {
          var classes = normalizeText(children[i].attrs && children[i].attrs['class']).toLowerCase().split(/\s+/);
          if (!classes.some(function (name) { return name.replace(/^sheet-/, '') === 'template_label'; })) continue;
          var match = nodeText(children[i]).replace(/[\s:：]+/g, '').match(/^([+-]?\d+)$/);
          if (match) return match[1];
        }
      }
      current = current.parent;
    }
    return null;
  }

  function resultConditionToken(raw) {
    var body = normalizeText(raw);
    var marker = body.charAt(0);
    if (marker !== '#' && marker !== '^' && marker !== '/') return null;
    body = normalizeText(body.slice(1));
    var inverted = marker === '^';
    if (body.charAt(0) === '^') {
      inverted = true;
      body = normalizeText(body.slice(1));
    }
    var nameMatch = body.match(/^([^\s(]+)(?:\(\))?/);
    if (!nameMatch) return { close: marker === '/', name: '', unsupported: true };
    var name = nameMatch[1];
    if (marker === '/') return { close: true, name: name.toLowerCase() };
    var rest = normalizeText(body.slice(nameMatch[0].length));
    var args = rest ? rest.split(/\s+/).map(function (value) {
      return value.replace(/^(['"])([\s\S]*)\1$/, '$2');
    }) : [];
    var helper = name.toLowerCase();
    var condition = null;
    if (!args.length) condition = { op: 'present', args: [name], not: inverted };
    else if (helper === 'rolltotal' && args.length === 2) condition = { op: 'eq', args: args, not: inverted };
    else if (helper === 'rollbetween' && args.length === 3) condition = { op: 'between', args: args, not: inverted };
    else if (helper === 'rollgreater' && args.length === 2) condition = { op: 'gt', args: args, not: inverted };
    else if (helper === 'rollless' && args.length === 2) condition = { op: 'lt', args: args, not: inverted };
    return {
      close: false,
      name: helper,
      condition: condition,
      unsupported: !condition
    };
  }

  function collectResultTemplates(root, rolls) {
    var used = dictionary();
    (rolls || []).forEach(function (roll) {
      var name = normalizeText(roll && roll.template);
      if (name) used[name.toLowerCase()] = name;
    });
    var result = dictionary();
    walk(root, function (templateNode) {
      if (templateNode.tag !== 'rolltemplate') return;
      var sourceName = rollTemplateName(templateNode);
      var template = used[sourceName.toLowerCase()];
      if (!template) return;
      var stack = [];
      var rules = [];
      var seen = dictionary();

      function capture(outcome, markerNode) {
        if (!outcome || !stack.length || stack.some(function (entry) { return entry.unsupported; })) return;
        var conditions = stack.map(function (entry) { return entry.condition; }).filter(Boolean);
        if (!conditions.length) return;
        var valueField = '';
        for (var index = conditions.length - 1; index >= 0; index -= 1) {
          var args = conditions[index].args || [];
          if (conditions[index].op !== 'present' && args.length && !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(args[0])) {
            valueField = args[0];
            break;
          }
        }
        if (!valueField) return;
        var rule = {
          outcome: outcome,
          valueField: valueField,
          conditions: conditions
        };
        var group = resultGroup(markerNode, templateNode);
        if (group !== null) rule.group = group;
        var key = JSON.stringify(rule);
        if (!seen[key]) {
          seen[key] = true;
          rules.push(rule);
        }
      }

      function processText(textNode) {
        var text = String(textNode.text || '');
        var pattern = /\{\{\s*([\s\S]*?)\s*\}\}/g;
        var cursor = 0;
        var match;
        while ((match = pattern.exec(text))) {
          capture(resultOutcomeFromText(text.slice(cursor, match.index)), textNode);
          var token = resultConditionToken(match[1]);
          if (token && token.close) {
            for (var index = stack.length - 1; index >= 0; index -= 1) {
              if (stack[index].name === token.name) {
                stack.splice(index, 1);
                break;
              }
            }
          } else if (token) stack.push(token);
          cursor = pattern.lastIndex;
        }
        capture(resultOutcomeFromText(text.slice(cursor)), textNode);
      }

      function visit(node) {
        if (node.tag === '#text') {
          processText(node);
          return;
        }
        capture(resultOutcomeFromAttributes(node), node);
        for (var i = 0; i < node.children.length; i += 1) visit(node.children[i]);
      }

      for (var i = 0; i < templateNode.children.length; i += 1) visit(templateNode.children[i]);
      if (rules.length) result[template] = { rules: rules };
    });
    return result;
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

  function collectRollNodes(root) {
    var nodes = [];
    walk(root, function (node) {
      if ((node.tag === 'button' || node.tag === 'input') && (node.attrs.type || '').toLowerCase() === 'roll') nodes.push(node);
    });
    return nodes;
  }

  function visibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (typeof condition.name === 'string') found[condition.name] = true;
    ['all', 'any'].forEach(function (key) {
      if (Array.isArray(condition[key])) condition[key].forEach(function (item) { visibilityNames(item, found); });
    });
    if (condition.not) visibilityNames(condition.not, found);
    return found;
  }

  function modeControlNames(rollNode, refs, controls, controlNodes) {
    var result = dictionary();
    var referenced = dictionary();
    (refs || []).forEach(function (ref) {
      if (ref && ref.name && !ref.max) referenced[ref.name] = true;
    });
    function nearby(controlNode) {
      var left = rollNode && rollNode.parent;
      for (var leftDepth = 1; left && leftDepth <= 2; leftDepth += 1, left = left.parent) {
        if (left.tag === '#root') break;
        var right = controlNode && controlNode.parent;
        for (var rightDepth = 1; right && rightDepth <= 2; rightDepth += 1, right = right.parent) {
          if (right.tag === '#root') break;
          if (left === right) return true;
        }
      }
      return false;
    }
    Object.keys(controls).forEach(function (name) {
      var control = controls[name];
      if (!control || (control.type !== 'select' && control.type !== 'radio')) return;
      if (referenced[name] || (control.options || []).some(function (option) {
        return /[?%&]\{|\{\{|\[\[/.test(String(option && option.value || ''));
      }) || (controlNodes[name] || []).some(nearby)) result[name] = true;
    });
    var changed = true;
    while (changed) {
      changed = false;
      Object.keys(result).forEach(function (name) {
        (controls[name].options || []).forEach(function (option) {
          var value = String(option && option.value || '');
          if (!/[?%&]\{|\{\{|\[\[/.test(value)) return;
          refTokens(value).forEach(function (ref) {
            var nested = controls[ref.name];
            if (!result[ref.name] && nested && (nested.type === 'select' || nested.type === 'radio') && nested.options.length) {
              result[ref.name] = true;
              changed = true;
            }
          });
        });
      });
    }
    return result;
  }

  function applySharedRollLabels(rolls) {
    var groups = dictionary();
    rolls.forEach(function (roll) {
      if (!roll.name) return;
      var key = JSON.stringify([roll.name, roll.raw, roll.repeating && roll.repeating.section || '']);
      if (!groups[key]) groups[key] = [];
      groups[key].push(roll);
    });
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var labels = group.map(function (roll) {
        var alias = roll.label === roll.name ? normalizeText(roll.name.replace(/_/g, ' ')) : roll.label;
        var candidates = uniqueTexts(group.filter(function (peer) {
          return peer.label !== roll.label && ((peer.aliases || []).indexOf(roll.label) > -1 ||
              (peer.aliases || []).indexOf(alias) > -1) &&
            (roll.aliases || []).indexOf(peer.label) < 0;
        }).map(function (peer) { return peer.label; }));
        return candidates.length === 1 ? candidates[0] : '';
      });
      group.forEach(function (roll, index) {
        if (!labels[index]) return;
        roll.aliases = uniqueTexts([roll.label].concat(roll.aliases || []));
        roll.label = labels[index];
      });
    });
  }

  function collectRolls(nodes, controlScopes, translations, visibility) {
    var keys = dictionary();
    return nodes.map(function (node) {
      var raw = node.attrs.value || '';
      var htmlName = node.attrs.name || '';
      var name = /^roll_/i.test(htmlName) ? htmlName.slice(5) : null;
      var repeating = repeatingSection(node);
      var rowControls = repeating && controlScopes.sections[repeating] || {};
      var controls = Object.assign(dictionary(), controlScopes.global, rowControls);
      var rowControlNodes = repeating && controlScopes.nodes.sections[repeating] || {};
      var controlNodes = Object.assign(dictionary(), controlScopes.nodes.global, rowControlNodes);
      var rawRefs = publicRefs(raw);
      var ownLabel = labelDetails(node, translations, node.tag === 'button' ? nodeText : function () { return ''; });
      if (!htmlName && node.tag === 'button' && !nodeText(node) &&
          ownLabel.label && ownLabel.label === normalizeText(node.attrs.title))
        ownLabel = mergeLabelDetails(resourceRollLabelDetails(node), ownLabel);
      var adjacentLabel = ownLabel.label ? { label: '', aliases: [] } : adjacentLabelDetails(node, translations, 1, rawRefs);
      var rowLabel = tableRowLabelDetails(node, translations, rawRefs);
      var labelInfo = mergeLabelDetails(mergeLabelDetails(ownLabel, adjacentLabel), rowLabel);
      var label = labelInfo.label || name || '';
      var baseKey = [repeating, name || ('roll-' + shortHash(raw))].filter(Boolean).join('.');
      var key = baseKey;
      if (keys[key]) key += '-' + shortHash(raw + '|' + keys[key]);
      keys[baseKey] = (keys[baseKey] || 0) + 1;
      var fields = templateFields(raw);
      var labelRefs = [];
      var labelRefSeen = dictionary();
      var staticLabels = [];
      fields.forEach(function (field) {
        var translated = field.value.match(/^\^\{([^{}]+)\}$/);
        var translatedLabels = translated ? uniqueTexts(translations.map(function (messages) {
          return typeof messages[translated[1]] === 'string' ? messages[translated[1]] : '';
        })) : [];
        if (translatedLabels.length) {
          field.value = translatedLabels[0];
          if (!ownLabel.label && /^(?:name|subject|title|label|skill|skill_name|weapon_name|attribute|header)$/i.test(field.field)) {
            labelInfo.aliases = uniqueTexts([label].concat(labelInfo.aliases, translatedLabels.slice(1)));
            label = field.value;
          }
        }
        var ref = directRef(field.value);
        var refs = ref ? [ref] : publicRefs(field.value.replace(/\[\[[\s\S]*?\]\]/g, ' '));
        refs.forEach(function (item) {
          var key = field.field + '|' + item.name + '|' + item.max;
          if (!labelRefSeen[key]) {
            labelRefSeen[key] = true;
            labelRefs.push({ field: field.field, name: item.name, max: item.max });
          }
        });
        if (!refs.length && field.value && !/[@%?&^]\{|\[\[|\$\[\[/.test(field.value))
          staticLabels.push({ field: field.field, value: normalizeText(field.value) });
      });
      var expressionNames = inlineExpressionRefs(raw);
      var expressionRefs = [];
      labelRefs.forEach(function (ref) {
        var control = controls[ref.name];
        if (control && (control.type === 'text' || control.type === 'textarea') && expressionNames[ref.name] && expressionRefs.indexOf(ref.name) < 0)
          expressionRefs.push(ref.name);
      });
      var repeatingFields = repeating ? Object.keys(rowControls).sort() : [];
      var modes = expandModes(raw, controls, modeControlNames(node, rawRefs, controls, controlNodes));
      var rollControls = dictionary();
      expressionRefs.forEach(function (controlName) {
        if (controls[controlName] && controls[controlName].repeating) rollControls[controlName] = controls[controlName];
      });
      if (repeating) modes.forEach(function (mode) {
        Object.keys(mode.overrides || {}).forEach(function (controlName) {
          if (controls[controlName] && controls[controlName].repeating) rollControls[controlName] = controls[controlName];
        });
      });
      var templateMatch = raw.match(/&\{\s*template\s*:\s*([^}]+)\}/i);
      if (!templateMatch) {
        var referencedTemplates = uniqueTexts(rawRefs.map(function (ref) {
          var control = !ref.max && controls[ref.name];
          var found = control && control.type === 'hidden' &&
            String(control.default || '').match(/&\{\s*template\s*:\s*([^}]+)\}/i);
          return found ? normalizeText(found[1]) : '';
        }).filter(Boolean));
        if (referencedTemplates.length === 1) templateMatch = [null, referencedTemplates[0]];
      }
      var result = {
        key: key,
        name: name,
        label: label,
        aliases: labelInfo.aliases,
        raw: raw,
        template: templateMatch ? normalizeText(templateMatch[1]) : null,
        refs: rawRefs,
        repeating: repeating ? { section: repeating, fields: repeatingFields.sort() } : null,
        staticLabels: staticLabels,
        labelRefs: labelRefs,
        expressionRefs: expressionRefs.sort(),
        controls: Object.keys(rollControls).length ? rollControls : undefined,
        modes: modes
      };
      if (modes.incomplete) result.modesIncomplete = true;
      var condition = visibility && visibility.rolls && visibility.rolls[node._kibSheetNodeId];
      if (condition) {
        result.visibility = condition;
        Object.keys(visibilityNames(condition)).forEach(function (controlName) {
          if (controls[controlName] && controls[controlName].repeating) rollControls[controlName] = controls[controlName];
        });
        if (Object.keys(rollControls).length) result.controls = rollControls;
      }
      return result;
    });
  }

  function parseSheetContract(html, options) {
    var opts = options || {};
    var translations = translationMaps(opts.translations);
    var tree = parseHtml(html);
    var storedByWorker = workerStoredAttributes(tree, translations);
    var controlScopes = collectControls(tree, translations);
    (controlScopes.fields || []).forEach(function (field) {
      if (!Object.prototype.hasOwnProperty.call(storedByWorker.defaults, field.name)) return;
      var translated = normalizeText(storedByWorker.defaults[field.name]);
      if (!translated || translated === normalizeText(field.default)) return;
      field.defaultVariants = uniqueTexts([translated].concat(field.defaultVariants || [], [field.default]));
      field.default = translated;
    });
    var globalControls = controlScopes.global;
    var rollNodes = collectRollNodes(tree);
    var visibilityNodes = rollNodes.slice();
    var visibilitySeen = new Set(visibilityNodes);
    (controlScopes.fields || []).filter(function (field) { return field.trackCandidate; }).forEach(function (field) {
      var groups = field.section ? controlScopes.nodes.sections[field.section] : controlScopes.nodes.global;
      (groups && groups[field.name] || []).forEach(function (node) {
        if (!visibilitySeen.has(node)) { visibilitySeen.add(node); visibilityNodes.push(node); }
      });
    });
    var visibility = visibilityNodes.length
      ? buildRollVisibility(tree, visibilityNodes, opts.css, opts.legacy)
      : { rolls: dictionary(), controls: dictionary() };
    applyFieldVisibility(controlScopes, visibility.rolls);
    applySettingsControls(tree, controlScopes, opts.userOptions);
    var rolls = collectRolls(rollNodes, controlScopes, translations, visibility);
    applySharedRollLabels(rolls);
    applyFieldRollLabels(controlScopes, rolls);
    applyResourceGroupLabels(controlScopes, translations);
    applyNamedResourcePairGroups(controlScopes, translations);
    applyResourcePairLabels(controlScopes);
    applyNumericRadioFields(controlScopes, translations, visibility);
    var resultTemplates = collectResultTemplates(tree, rolls);
    var signature = compactSignature(globalControls, rolls, controlScopes.fields);
    controlScopes.fields.forEach(function (field) { delete field.persistCandidate; });
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
    storedByWorker.names.forEach(function (name) {
      attributes[name] = true;
      globalAttributes[name] = true;
    });
    rolls.forEach(function (roll) { delete roll.refs; });
    var usedControls = dictionary();
    rolls.forEach(function (roll) {
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode.overrides || {}).forEach(function (name) { usedControls[name] = true; });
      });
      (roll.expressionRefs || []).forEach(function (name) { usedControls[name] = true; });
    });
    Object.keys(visibility.controls || {}).forEach(function (name) { usedControls[name] = true; });
    var controls = dictionary();
    Object.keys(usedControls).sort().forEach(function (name) {
      if (globalControls[name]) controls[name] = globalControls[name];
    });
    var name = normalizeText(opts.name || 'sheet');
    var contract = {
      version: 1,
      id: normalizeText(opts.id || slug(name) || ('sheet-' + shortHash(html))),
      name: name,
      sourceHash: normalizeText(opts.sourceHash || ''),
      signature: signature,
      attributes: Object.keys(attributes).sort(),
      globalAttributes: Object.keys(globalAttributes).sort(),
      sections: sections,
      fields: controlScopes.fields,
      controls: controls,
      rolls: rolls
    };
    if (Object.keys(resultTemplates).length) contract.resultTemplates = resultTemplates;
    return contract;
  }

  return {
    parseSheetContract: parseSheetContract
  };
}));
