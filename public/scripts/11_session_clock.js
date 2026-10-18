/*
 * Scene Suite 11 - Session Clock 1.1.0
 * 제작 및 통합: @EOOOOORK
 *
 * 지정한 영역에 게임 속 시간 또는 카운트다운을 표시합니다.
 * 시계는 GM이 직접 조절하고 타이머는 실제 시간에 맞춰 줄어듭니다.
 *
 * 세팅법
 * 1. GM 레이어의 이미지 토큰을 표시할 위치와 크기로 조절합니다.
 * 2. 토큰을 선택하고 !시계 영역등록을 입력합니다.
 * 3. !시계 시간|06:00으로 시간을 정하고 !시계 ON으로 표시합니다.
 *
 * 명령어
 * !시계 설정                         현재 상태와 설정 버튼
 * !시계 시간|06:00                   현재 시간 설정, 24시 기준 입력
 * !시계 간격|1시간30분                기본 증감 간격 설정
 * !시계 증가 / !시계 감소             기본 간격만큼 시간 조절
 * !시계 증가 2시간 / !시계 감소 15분   이번에만 지정한 시간만큼 조절
 * !시계 알림|공개 또는 GM             증감한 현재 시간 알림
 * !시계 표시|배경 또는 그림자         시계와 타이머 표시 방식
 * !시계 불투명도|70                   검정 배경 불투명도 0~100
 * !시계 그림자불투명도|60             그림자 불투명도 0~100
 * !시계 ON / !시계 OFF                표시 켜기 또는 끄기
 * !타이머 설정|00:10:00               시작 시간 설정, 10분 또는 1시간30분도 가능
 * !타이머 시작 / !타이머 일시정지     시작 또는 재개, 남은 시간을 유지하고 정지
 * !타이머 초기화                     정지하고 설정한 시작 시간으로 복원
 * !타이머 ON / !타이머 OFF            타이머 표시 켜기 또는 끄기
 *
 * 01 나레이터와 함께 설치하면 @시계 증가 1시간, @타이머 시작으로 연동합니다.
 * 시계와 타이머는 등록 영역 하나를 함께 사용하며 ON/OFF와 설정은 API 재시작 후에도 유지합니다.
 * 기존 독립 시계와 중복 설치하지 말고 이 코드로 교체하세요. 지원 환경: Roll20 Mod API (pathv2)
 */
var KIBScene = KIBScene || {};
KIBScene.handlers = KIBScene.handlers || {};
KIBScene.adapters = KIBScene.adapters || {};
(function () {
  'use strict';
  const COMMAND = /^!(시계|타이머)(?:\s|\||$)/;
  const FONT = 'Rubik Mono One';
  const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59;
  let tickTimer = null, fitTimer = null, generation = 0, fitGeneration = 0, cleaning = false;

  function memory() {
    if (!state.Roll20SessionClock || typeof state.Roll20SessionClock !== 'object' || Array.isArray(state.Roll20SessionClock)) {
      state.Roll20SessionClock = {};
    }
    const s = state.Roll20SessionClock;
    const defaults = { area: null, clockMinutes: 0, stepMinutes: 30, mode: 'clock',
      durationSeconds: 0, remainingMs: 0, deadline: 0, running: false,
      enabled: false, announce: true, backgroundOpacity: 100, shadowOpacity: 100, displayStyle: 'background', objects: [] };
    Object.keys(defaults).forEach(key => { if (s[key] === undefined) s[key] = defaults[key]; });
    if (!Array.isArray(s.objects)) s.objects = [];
    return s;
  }
  function escape(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function notice(text) { sendChat('세션 시계', '/w gm ' + text, null, { noarchive: true }); }
  function publicNotice(text) { sendChat('', '/desc ' + text, null, { noarchive: true }); }
  function reject(text) { const error = new Error(text); error.input = true; throw error; }
  function cancelTimers() {
    generation++;
    fitGeneration++;
    if (tickTimer !== null) clearTimeout(tickTimer);
    if (fitTimer !== null) clearTimeout(fitTimer);
    tickTimer = fitTimer = null;
  }
  function clearDisplay() {
    const s = memory(), remaining = [];
    cleaning = true;
    try {
      s.objects.forEach(ref => {
        if (!ref || !['text', 'pathv2'].includes(ref.type) || typeof ref.id !== 'string') return;
        try { const obj = getObj(ref.type, ref.id); if (obj) obj.remove(); }
        catch (error) { remaining.push(ref); log('[SessionClock cleanup] ' + error.message); }
      });
    } finally { s.objects = remaining; cleaning = false; }
    return remaining.length === 0;
  }
  function off() {
    cancelTimers();
    const s = memory();
    s.enabled = false; s.running = false; s.deadline = 0; s.remainingMs = 0;
    return clearDisplay();
  }
  function guarded(fn, runtime) {
    return function () {
      try { return fn.apply(null, arguments); }
      catch (error) {
        if (error.input && !runtime) { notice(escape(error.message)); return; }
        log('[SessionClock] ' + (error.stack || error.message));
        off();
        notice('시계 중지: Mod 콘솔 확인');
      }
    };
  }
  function pad(value) { return String(value).padStart(2, '0'); }
  function clockText(minutes) {
    const hour = Math.floor(minutes / 60);
    return (hour < 12 ? 'AM ' : 'PM ') + pad(hour % 12 || 12) + ':' + pad(minutes % 60);
  }
  function timerText(ms) {
    const seconds = Math.max(0, Math.ceil(ms / 1000));
    return pad(Math.floor(seconds / 3600)) + ':' + pad(Math.floor(seconds / 60) % 60) + ':' + pad(seconds % 60);
  }
  function remainingMs() {
    const s = memory();
    return s.running ? Math.max(0, s.deadline - Date.now()) : s.remainingMs;
  }
  function textValue() { const s = memory(); return s.mode === 'clock' ? clockText(s.clockMinutes) : timerText(remainingMs()); }
  function spanLabel(minutes) {
    return (Math.floor(minutes / 60) ? Math.floor(minutes / 60) + '시간 ' : '') + (minutes % 60 ? minutes % 60 + '분' : '') || '0분';
  }
  function parseClock(value) {
    const match = String(value).trim().match(/^(\d{1,2})(?::([0-5]\d))?$/);
    if (!match || Number(match[1]) > 24 || (Number(match[1]) === 24 && Number(match[2] || 0) !== 0)) {
      reject('시간은 00:00부터 24:00까지 입력하세요. 예: 06:30');
    }
    return (Number(match[1]) * 60 + Number(match[2] || 0)) % 1440;
  }
  function parseSpan(value, minutesOnly) {
    const source = String(value).replace(/\s+/g, '');
    let seconds;
    const clock = source.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
    const units = source.match(/^(?:(\d+)시간)?(?:(\d+)분)?(?:(\d+)초)?$/);
    if (clock) seconds = Number(clock[1]) * 3600 + Number(clock[2]) * 60 + Number(clock[3] || 0);
    else if (units && source) seconds = Number(units[1] || 0) * 3600 + Number(units[2] || 0) * 60 + Number(units[3] || 0);
    else if (/^\d+$/.test(source)) seconds = Number(source) * 60;
    if (!Number.isSafeInteger(seconds) || seconds <= 0 || seconds > MAX_SECONDS || (minutesOnly && seconds % 60 !== 0)) {
      reject(minutesOnly ? '증감 시간은 시와 분으로 입력하세요. 예: 1시간 30분' : '타이머는 1초부터 99:59:59까지 입력하세요. 예: 10분 또는 00:10:00');
    }
    return seconds;
  }
  function checkedArea() {
    const area = memory().area;
    if (!area || !getObj('page', area.pageId)) reject('GM 레이어의 이미지 토큰을 선택하고 !시계 영역등록');
    if (![area.left, area.top, area.width, area.height].every(Number.isFinite) || area.width < 80 || area.height < 20) {
      reject('시계 영역은 가로 80px, 세로 20px 이상이어야 합니다. 영역을 다시 등록하세요.');
    }
    return area;
  }
  function owned(type, role) {
    const ref = memory().objects.find(entry => entry && entry.type === type && entry.role === role);
    return ref ? getObj(type, ref.id) : null;
  }
  function track(type, attributes, role) {
    const obj = createObj(type, attributes);
    if (!obj) throw new Error(type + ' 생성 실패');
    memory().objects.push({ type: type, id: obj.id, role: role });
    return obj;
  }
  function fontSize(area) {
    // shortcut: 최초 크기는 고정폭 8자로 계산하며 Roll20이 경계값을 제공하면 보정합니다.
    return Math.max(8, Math.floor(Math.min(area.width * 0.96 / 8, area.height * 0.92 / 1.2)));
  }
  function blackColor(opacity) {
    return opacity === 100 ? '#000000' : '#000000' + Math.round(opacity * 255 / 100).toString(16).padStart(2, '0');
  }
  function syncShadow(label) {
    const shadow = owned('text', 'shadow');
    if (!shadow) return;
    shadow.set({ text: label.get('text'), font_family: FONT, font_size: Number(label.get('font_size')), color: blackColor(memory().shadowOpacity),
      left: Number(label.get('left')) + 2, top: Number(label.get('top')) + 2 });
    if (typeof shadow.toBelow === 'function') shadow.toBelow(label);
    else if (typeof toBelow === 'function') toBelow(shadow, label);
    else toFront(label);
  }
  function fitText(attempt, token) {
    const s = memory();
    if (token !== fitGeneration || !s.enabled) return;
    fitTimer = null;
    const obj = owned('text'), area = checkedArea();
    if (!obj) throw new Error('글자 객체 없음');
    const width = Number(obj.get('width')), height = Number(obj.get('height'));
    const current = Number(obj.get('font_size')) || fontSize(area);
    if (width > 0 && height > 0) {
      const next = Math.max(8, Math.floor(current * Math.min(area.width * 0.96 / width, area.height * 0.92 / height)));
      if (Math.abs(next - current) <= 1) { syncShadow(obj); return; }
      obj.set({ font_size: next, font_family: FONT });
    }
    syncShadow(obj);
    if (attempt < 3) fitTimer = setTimeout(guarded(() => fitText(attempt + 1, token), true), 200);
  }
  function layout() {
    const s = memory(), area = checkedArea();
    if (!s.enabled) return;
    if (!clearDisplay()) throw new Error('이전 표시 제거 실패');
    const panel = s.displayStyle === 'background' ? track('pathv2', { pageid: area.pageId, layer: 'objects', shape: 'rec',
      x: area.left, y: area.top, points: JSON.stringify([[0, 0], [area.width, area.height]]),
      fill: blackColor(s.backgroundOpacity),
      stroke: 'transparent', stroke_width: 0, controlledby: '', fadeOnOverlap: false, renderAsScenery: false }) : null;
    const shadow = s.displayStyle === 'shadow' ? track('text', { _pageid: area.pageId, layer: 'objects',
      left: area.left + 2, top: area.top + 2, text: textValue(), font_family: FONT, font_size: fontSize(area),
      color: blackColor(s.shadowOpacity), controlledby: '', rotation: 0, fadeOnOverlap: false, renderAsScenery: false }, 'shadow') : null;
    const label = track('text', { _pageid: area.pageId, layer: 'objects', left: area.left, top: area.top,
      text: textValue(), font_family: FONT, font_size: fontSize(area), color: '#FFFFFF',
      controlledby: '', rotation: 0, fadeOnOverlap: false, renderAsScenery: false });
    if (panel) toFront(panel);
    if (shadow) toFront(shadow);
    toFront(label);
    syncShadow(label);
    if (fitTimer !== null) clearTimeout(fitTimer);
    const token = ++fitGeneration;
    fitTimer = setTimeout(guarded(() => fitText(1, token), true), 200);
  }
  function hasDisplay() {
    return owned('text') && (memory().displayStyle === 'shadow' ? owned('text', 'shadow') : owned('pathv2'));
  }
  function updateDisplay() {
    const s = memory();
    if (!s.enabled) return;
    if (!getObj('page', checkedArea().pageId)) throw new Error('페이지 없음');
    const label = owned('text');
    if (!hasDisplay()) throw new Error('표시 객체 없음');
    const value = textValue();
    if (label.get('text') !== value) label.set({ text: value, font_family: FONT, font_size: Number(label.get('font_size')) || fontSize(s.area) });
    syncShadow(label);
  }
  function pause() {
    const s = memory(), remaining = remainingMs();
    cancelTimers(); s.running = false; s.deadline = 0; s.remainingMs = remaining;
  }
  function tick(token) {
    const s = memory();
    if (token !== generation || !s.enabled || !s.running || s.mode !== 'timer') return;
    tickTimer = null;
    s.remainingMs = remainingMs();
    updateDisplay();
    if (s.remainingMs === 0) {
      s.running = false; s.deadline = 0;
      publicNotice('타이머 종료');
      return;
    }
    tickTimer = setTimeout(guarded(() => tick(token), true), Math.min(1000, s.remainingMs));
  }
  function registerArea(msg) {
    const selected = msg.selected || [];
    if (selected.length !== 1 || selected[0]._type !== 'graphic') reject('영역으로 쓸 이미지 토큰 하나를 선택하세요.');
    const obj = getObj('graphic', selected[0]._id);
    if (!obj || obj.get('layer') !== 'gmlayer') reject('GM 레이어의 이미지 토큰을 선택하세요.');
    if (Number(obj.get('rotation') || 0) % 360 !== 0) reject('영역 토큰의 회전은 0도로 맞추세요.');
    const area = { pageId: obj.get('_pageid'), left: Number(obj.get('left')), top: Number(obj.get('top')),
      width: Number(obj.get('width')), height: Number(obj.get('height')) };
    if (!getObj('page', area.pageId) || ![area.left, area.top, area.width, area.height].every(Number.isFinite) || area.width < 80 || area.height < 20) {
      reject('유효한 페이지에 가로 80px, 세로 20px 이상으로 영역 토큰을 배치하세요.');
    }
    memory().area = area;
    if (memory().enabled) layout();
    notice('시계 영역 등록');
  }
  function clockChange(next, delta) {
    const s = memory();
    pause(); s.mode = 'clock'; s.clockMinutes = next;
    updateDisplay();
    if (delta === undefined) return;
    const change = '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + clockText(next) + '</b></span>';
    if (s.enabled && s.announce) publicNotice(change); else notice(change);
  }
  function button(label, command, color) {
    return '<a href="' + escape(command).replace(/\?/g, '&#63;') + '" style="display:inline-block;margin:2px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold">' + label + '</a>';
  }
  function settings() {
    const s = memory();
    notice('<div style="color:#111;background:#fff;border:1px solid #111"><div style="padding:9px;background:#111;color:#fff"><b>세션 시계</b></div><div style="padding:9px">' +
      '표시: ' + (s.enabled ? 'ON' : 'OFF') + ' / 모드: ' + (s.mode === 'clock' ? '시계' : '타이머') +
      '<br>현재 시간: ' + clockText(s.clockMinutes) + ' / 증감: ' + spanLabel(s.stepMinutes) +
      '<br>타이머: ' + timerText(remainingMs()) + (s.running ? ' 실행 중' : ' 정지') +
      '<br>' +
      button('선택 토큰으로 영역 등록', '!시계 영역등록', '#7654a8') +
      '<hr><b>표시 설정</b><br>' + button('검정 배경' + (s.displayStyle === 'background' ? ' ✓' : ''), '!시계 표시|배경') +
      button('그림자' + (s.displayStyle === 'shadow' ? ' ✓' : ''), '!시계 표시|그림자') +
      button('배경 불투명도 ' + s.backgroundOpacity + '%', '!시계 불투명도|?{배경 불투명도 0~100|' + s.backgroundOpacity + '}') +
      button('그림자 불투명도 ' + s.shadowOpacity + '%', '!시계 그림자불투명도|?{그림자 불투명도 0~100|' + s.shadowOpacity + '}') +
      '<hr><b>시계</b><br>' + button('ON', '!시계 ON', '#287a4b') + button('OFF', '!시계 OFF', '#8b3940') +
      button('시간 설정', '!시계 시간|?{현재 시간 24시 기준|06:00}') +
      button('증감 시간 설정', '!시계 간격|?{시간|0}시간?{분|30}분') + button('증가', '!시계 증가') + button('감소', '!시계 감소') +
      '<br>증감 알림: ' + button('전체 공개' + (s.announce ? ' ✓' : ''), '!시계 알림|공개') +
      button('GM 귓말' + (!s.announce ? ' ✓' : ''), '!시계 알림|GM') +
      '<hr><b>타이머</b><br>' + button('ON', '!타이머 ON', '#287a4b') + button('OFF', '!타이머 OFF', '#8b3940') +
      button('시작 시간 설정', '!타이머 설정 ?{시 분 초 예 00:10:00|00:10:00}') + button('시작', '!타이머 시작', '#287a4b') +
      button('일시정지', '!타이머 일시정지') + button('초기화', '!타이머 초기화') + '</div></div>');
  }
  function prepare(msg, match, s = memory()) {
    const timerCommand = match[1] === '타이머';
    const parts = msg.content.slice(match[0].length).trim().replace(/^\|/, '').split('|');
    const head = (parts.shift() || '설정').trim().split(/\s+/);
    let action = head.shift().toLowerCase();
    let value = head.concat(parts).join(' ').trim();
    if (timerCommand) {
      if (!['설정', '상태', '도움말', 'on', '켜기', 'off', '끄기', '시작', '일시정지', '초기화'].includes(action)) reject('알 수 없는 명령입니다. !시계 설정');
      if (action === '설정' && value) action = '타이머';
    }
    switch (action) {
      case '설정': case '상태': case '도움말': case '영역등록': case 'off': case '끄기': break;
      case 'on': case '켜기': checkedArea(); break;
      case '시간': value = parseClock(value); break;
      case '간격': value = parseSpan(value, true) / 60; break;
      case '증가': case '감소':
        if (s.mode !== 'clock') reject('시계 모드에서 시간을 증감하세요.');
        value = (value ? parseSpan(value, true) / 60 : s.stepMinutes) * (action === '증가' ? 1 : -1);
        break;
      case '모드': if (!['시계', '타이머'].includes(value)) reject('모드는 시계 또는 타이머를 선택하세요.'); break;
      case '타이머': value = parseSpan(value, false); break;
      case '시작':
        checkedArea();
        value = (s.running ? Math.max(0, s.deadline - Date.now()) : s.remainingMs) || s.durationSeconds * 1000;
        if (!Number.isFinite(value) || value <= 0 || value > MAX_SECONDS * 1000) reject('타이머 시작 시간을 먼저 설정하세요.');
        break;
      case '일시정지': case '초기화': if (s.mode !== 'timer') reject('타이머 모드에서 사용하세요.'); break;
      case '알림':
        if (!['공개', 'gm', '켜기', '끄기'].includes(value.toLowerCase())) reject('알림은 공개 또는 GM으로 지정하세요.');
        value = ['공개', '켜기'].includes(value.toLowerCase()); break;
      case '불투명도': case '그림자불투명도':
        if (!/^\d+(?:\.\d+)?$/.test(value) || Number(value) > 100) reject('불투명도는 0부터 100까지 입력하세요.');
        value = Number(value); break;
      case '표시': if (!['배경', '그림자'].includes(value)) reject('표시는 배경 또는 그림자로 지정하세요.'); break;
      default: reject('알 수 없는 명령입니다. !시계 설정');
    }
    return { timerCommand, action, value };
  }
  function handle(msg, match) {
    const { timerCommand, action, value } = prepare(msg, match), s = memory();
    switch (action) {
      case '설정': case '상태': case '도움말': return settings();
      case '영역등록': return registerArea(msg);
      case 'on': case '켜기': {
        checkedArea();
        const mode = timerCommand ? 'timer' : 'clock';
        if (s.mode !== mode) { pause(); s.mode = mode; }
        s.enabled = true; layout(); return notice((timerCommand ? '타이머' : '시계') + ' ON');
      }
      case 'off': case '끄기': return notice(off() ? (timerCommand ? '타이머' : '시계') + ' OFF' : '표시 OFF: 표시 제거 실패, Mod 콘솔 확인 후 OFF 재시도');
      case '시간': return clockChange(value);
      case '간격': s.stepMinutes = value; return notice('증감 시간 ' + spanLabel(s.stepMinutes));
      case '증가': case '감소': {
        return clockChange(((s.clockMinutes + value) % 1440 + 1440) % 1440, value);
      }
      case '모드': {
        pause(); s.mode = value === '시계' ? 'clock' : 'timer'; updateDisplay(); return notice(value + ' 모드');
      }
      case '타이머': {
        pause(); s.mode = 'timer'; s.durationSeconds = value; s.remainingMs = value * 1000;
        updateDisplay(); return notice('타이머 설정 ' + timerText(s.remainingMs));
      }
      case '시작': {
        pause(); s.mode = 'timer'; s.remainingMs = value; s.deadline = Date.now() + value; s.running = true; s.enabled = true;
        if (!hasDisplay()) layout(); else updateDisplay();
        tick(generation); return notice('타이머 시작');
      }
      case '일시정지': pause(); updateDisplay(); return notice('타이머 일시정지');
      case '초기화': pause(); s.remainingMs = s.durationSeconds * 1000; updateDisplay(); return notice('타이머 초기화');
      case '알림':
        s.announce = value;
        return notice('증감 알림 ' + (s.announce ? '전체 공개' : 'GM 귓말'));
      case '불투명도': case '그림자불투명도': {
        s[action === '불투명도' ? 'backgroundOpacity' : 'shadowOpacity'] = value;
        if (s.enabled) layout();
        return settings();
      }
      case '표시':
        s.displayStyle = value === '배경' ? 'background' : 'shadow';
        if (s.enabled) layout();
        return settings();
      default: reject('알 수 없는 명령입니다. !시계 설정');
    }
  }

  function cueMessage(args) {
    if (!['clock', 'timer'].includes(args[0])) reject('시계 또는 타이머 명령을 입력하세요.');
    const msg = { content: '!' + (args[0] === 'timer' ? '타이머' : '시계') + ' ' + args.slice(1).join('|') };
    if (/^!(?:시계|타이머)\s+영역등록(?:\s|\||$)/.test(msg.content)) reject('영역 등록은 토큰을 선택한 뒤 !시계 영역등록으로 실행하세요.');
    return msg;
  }
  function validateCue(args, context = {}) {
    try {
      const msg = cueMessage(args), preview = context.clockPreview || { ...memory() };
      const q = prepare(msg, msg.content.match(COMMAND), preview);
      // 같은 줄의 설정과 시작을 검사하되 실제 시계 상태는 실행 전까지 바꾸지 않습니다.
      if (q.action === '시간') { preview.mode = 'clock'; preview.running = false; }
      if (q.action === '간격') preview.stepMinutes = q.value;
      if (q.action === '타이머') { preview.mode = 'timer'; preview.durationSeconds = q.value; preview.remainingMs = q.value * 1000; preview.running = false; }
      if (q.action === '모드' || ['on', '켜기'].includes(q.action)) {
        const mode = q.action === '모드' ? (q.value === '시계' ? 'clock' : 'timer') : (q.timerCommand ? 'timer' : 'clock');
        if (preview.mode !== mode || q.action === '모드') preview.running = false;
        preview.mode = mode;
      }
      if (q.action === '시작') { preview.mode = 'timer'; preview.running = true; preview.deadline = Date.now() + q.value; }
      if (q.action === '일시정지') { preview.remainingMs = preview.running ? Math.max(0, preview.deadline - Date.now()) : preview.remainingMs; preview.running = false; }
      if (q.action === '초기화') { preview.remainingMs = preview.durationSeconds * 1000; preview.running = false; }
      if (['off', '끄기'].includes(q.action)) { preview.running = false; preview.remainingMs = 0; }
      context.clockPreview = preview;
      return { ok: true };
    } catch (error) { return { ok: false, error: error.message }; }
  }
  function runCue(args) {
    try { const msg = cueMessage(args); handle(msg, msg.content.match(COMMAND)); return { ok: true }; }
    catch (error) {
      if (!error.input) { log('[SessionClock] ' + (error.stack || error.message)); off(); }
      return { ok: false, error: error.message };
    }
  }
  function registerModule() {
    const adapter = {
      meta: { code: '11_session_clock.js', title: '시계와 타이머' },
      aliases: { 시계: 'clock', 타이머: 'timer' }, cue: runCue, validate: validateCue,
      help: [
        '<code>!시계 설정</code> 시계와 타이머 설정',
        '<code>!시계 증가 1시간30분</code> 시와 분으로 증감, 생략하면 기본 간격 사용',
        '<code>!타이머 설정|10분</code> 시작 시간 설정 후 <code>!타이머 시작</code>',
        '<code>@시계 증가 1시간</code> 또는 <code>@타이머 시작</code> 나레이터 연동',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('clock', adapter);
    else { KIBScene.adapters.clock = adapter; KIBScene.handlers.clock = adapter.cue; }
  }

  on('ready', guarded(function () {
    registerModule();
    const s = memory();
    if (!Number.isInteger(s.clockMinutes) || s.clockMinutes < 0 || s.clockMinutes >= 1440) s.clockMinutes = 0;
    if (!Number.isInteger(s.stepMinutes) || s.stepMinutes <= 0) s.stepMinutes = 30;
    if (!Number.isInteger(s.durationSeconds) || s.durationSeconds < 0 || s.durationSeconds > MAX_SECONDS) s.durationSeconds = 0;
    if (!['clock', 'timer'].includes(s.mode)) s.mode = 'clock';
    if (!Number.isFinite(s.backgroundOpacity) || s.backgroundOpacity < 0 || s.backgroundOpacity > 100) s.backgroundOpacity = 100;
    if (!Number.isFinite(s.shadowOpacity) || s.shadowOpacity < 0 || s.shadowOpacity > 100) s.shadowOpacity = 100;
    if (!['background', 'shadow'].includes(s.displayStyle)) s.displayStyle = 'background';
    if (!Number.isFinite(s.remainingMs) || s.remainingMs < 0 || s.remainingMs > MAX_SECONDS * 1000) s.remainingMs = 0;
    cancelTimers();
    s.enabled = s.enabled === true;
    s.running = s.enabled && s.mode === 'timer' && s.running === true && Number.isFinite(s.deadline) &&
      s.deadline > 0 && s.deadline <= Date.now() + MAX_SECONDS * 1000;
    if (!s.running) s.deadline = 0;
    if (s.enabled) {
      layout();
      if (s.running) tick(generation);
    } else if (!off()) notice('시계 OFF: 이전 표시 제거 실패, Mod 콘솔 확인');
    log('Session Clock 1.1.0 ready (' + (s.enabled ? 'ON' : 'OFF') + ')');
  }, true));
  on('chat:message', guarded(function (msg) {
    if (!msg || msg.type !== 'api' || !playerIsGM(msg.playerid)) return;
    const match = String(msg.content || '').match(COMMAND);
    if (match) handle(msg, match);
  }));
  ['text', 'pathv2', 'page'].forEach(type => on('destroy:' + type, guarded(function (obj) {
    const s = memory();
    if (cleaning || !s.enabled) return;
    if ((type === 'page' && s.area && obj.id === s.area.pageId) || s.objects.some(ref => ref && ref.id === obj.id && ref.type === type)) {
      off(); notice('표시 대상 삭제로 시계 OFF');
    }
  })));
})();
