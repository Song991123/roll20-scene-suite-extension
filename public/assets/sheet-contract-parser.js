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
    var result = { tag: '', classes: [], id: '', attributes: [], checked: false, specificity: 0 };
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
      return !compound.tag && !compound.id && !compound.attributes.length && !compound.checked &&
        compound.classes.length === 1 && compound.classes[0] === 'charsheet' ? { ok: true, atoms: [] } : { ok: false };
    }
    if (compound.tag && compound.tag !== '*' && compound.tag !== node.tag) return { ok: false };
    if (compound.id && compound.id !== (node.attrs.id || '')) return { ok: false };
    var classes = (node.attrs['class'] || '').split(/\s+/).filter(Boolean);
    if (!compound.classes.every(function (name) { return classes.indexOf(name) > -1; })) return { ok: false };
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

  function buildRollVisibility(root, rollNodes, externalCss) {
    var sources = cssSources(root, externalCss);
    if (!sources.length) return { rolls: dictionary(), controls: dictionary() };
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
    sources.forEach(function (source) {
      cssDisplayRules(source).forEach(function (rule) {
        var selector = cssSelector(rule.selector);
        rule.order = globalOrder++;
        if (!selector) {
          var rightmost = rightmostCssCompound(rule.selector);
          if (rightmost) targets.forEach(function (target) {
            if (cssCompoundMatch(target, rightmost).ok) tainted[target._kibSheetNodeId] = true;
          });
          return;
        }
        targets.forEach(function (target) {
          var paths = cleanVisibilityPaths(cssSelectorPaths(target, selector));
          if (!paths.length) return;
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
    var showAtoms = dictionary();
    Object.keys(programs).forEach(function (id) {
      programs[id].filter(function (entry) { return entry.visible && entry.paths.every(function (path) { return path.length; }); }).forEach(function (entry) {
        entry.paths.forEach(function (path) {
          path.forEach(function (atom) { showAtoms[atomKey(atom, true)] = true; });
        });
      });
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
      if (!base.visible) {
        if (conditional.some(function (entry) { return entry.visible; })) selected = conditional.slice();
      } else {
        var pairedHides = conditional.filter(function (entry) {
          return !entry.visible && entry.paths.every(function (path) {
            return path.some(function (atom) { return !!showAtoms[atomKey(atom, true)]; });
          });
        });
        if (pairedHides.length) selected = pairedHides.concat(conditional.filter(function (entry) { return entry.visible; }));
      }
      if (!selected.length) return;
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
    var rollConditions = dictionary();
    rollNodes.forEach(function (roll) {
      var conditions = [];
      var seen = dictionary();
      for (var node = roll; node && node.tag !== '#root'; node = node.parent) {
        var condition = nodeConditions[node._kibSheetNodeId];
        var key = condition && JSON.stringify(condition);
        if (condition && !seen[key]) { seen[key] = true; conditions.push(condition); }
      }
      if (conditions.length) rollConditions[roll._kibSheetNodeId] = visibilityAll(conditions);
    });
    return { rolls: rollConditions, controls: usedControls };
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
    span: true, div: true, strong: true, em: true, b: true, small: true, p: true
  };
  var ADJACENT_SKIP_TAGS = { button: true, input: true, select: true, textarea: true };

  function adjacentLabelDetails(node, translations, parentDepth) {
    var current = node;
    for (var depth = 0; current && current.parent && depth <= parentDepth; depth += 1) {
      var values = [];
      var siblings = current.parent.children;
      var index = siblings.indexOf(current);
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
          if (ADJACENT_SKIP_TAGS[sibling.tag]) {
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
          if (details.aliases.length) result.aliases = details.aliases;
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
    var sections = dictionary();
    Object.keys(sectionGroups).forEach(function (section) {
      sections[section] = buildControls(sectionGroups[section], labelsByFor, translations);
    });
    return {
      global: buildControls(globalGroups, labelsByFor, translations),
      sections: sections,
      nodes: { global: globalGroups, sections: sectionGroups }
    };
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
      var adjacentLabel = ownLabel.label ? { label: '', aliases: [] } : adjacentLabelDetails(node, translations, 1);
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
    var controlScopes = collectControls(tree, translations);
    var globalControls = controlScopes.global;
    var rollNodes = collectRollNodes(tree);
    var visibility = buildRollVisibility(tree, rollNodes, opts.css);
    var rolls = collectRolls(rollNodes, controlScopes, translations, visibility);
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
      (roll.expressionRefs || []).forEach(function (name) { usedControls[name] = true; });
    });
    Object.keys(visibility.controls || {}).forEach(function (name) { usedControls[name] = true; });
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
