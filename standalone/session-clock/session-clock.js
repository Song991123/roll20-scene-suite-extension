/*
 * 세션 시계 | Roll20 Session Clock v1.0.4
 *
 * 지정한 영역에 게임 속 시간 또는 카운트다운을 표시합니다.
 * 시계의 시간은 GM이 직접 컨트롤하는 구조입니다.
 *
 * 사용법
 * 1. GM 레이어에 이미지 토큰을 놓고 표시할 위치와 크기로 조절.
 * 2. 토큰을 선택한 뒤 !시계 영역등록을 입력.
 * 3. !시계 시간|06:00으로 시간을 정하고 !시계 ON으로 표시.
 *
 * 명령어
 * !시계 설정                         현재 상태 보기
 * !시계 간격|30분                    디폴트 증감 수치 설정
 * !시계 증가 (n분) / !시계 감소 (n분) 게임 속 시간 수동 조절. 괄호 안은 옵션. 생략하면 디폴트 증감 수치 적용
 * !시계 ON or OFF                    표시 온오프
 * !시계 알림|공개 또는 GM            증감한 현재 시간 알림
 * !시계 불투명도|70                  검정 배경 불투명도 0~100
 * !시계 그림자불투명도|60            그림자 불투명도 0~100
 * !시계 표시|배경 또는 그림자        시계와 타이머 표시 방식
 * !타이머 설정 00:10:00               카운트다운 시작 시간 설정
 * !타이머 시작                       카운트다운 시작 또는 재개
 * !타이머 일시정지                   남은 시간을 유지하고 정지
 * !타이머 초기화                     정지하고 설정한 시작 시간으로 복원
 * !타이머 ON or OFF                  표시 온오프
 *
 * 시간은 24시 기준으로 입력, AM/PM은 자동 표시.
 * 지원 환경: 최신 Roll20 VTT의 Mod API (pathv2 사용)
 */
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
  function handle(msg, match) {
    const timerCommand = match[1] === '타이머';
    const parts = msg.content.slice(match[0].length).trim().replace(/^\|/, '').split('|');
    const head = (parts.shift() || '설정').trim().split(/\s+/);
    let action = head.shift().toLowerCase();
    const value = head.concat(parts).join(' ').trim();
    if (timerCommand) {
      if (!['설정', '상태', '도움말', 'on', '켜기', 'off', '끄기', '시작', '일시정지', '초기화'].includes(action)) reject('알 수 없는 명령입니다. !시계 설정');
      if (action === '설정' && value) action = '타이머';
    }
    const s = memory();
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
      case '시간': return clockChange(parseClock(value));
      case '간격': s.stepMinutes = parseSpan(value, true) / 60; return notice('증감 시간 ' + spanLabel(s.stepMinutes));
      case '증가': case '감소': {
        if (s.mode !== 'clock') reject('시계 모드에서 시간을 증감하세요.');
        const delta = (value ? parseSpan(value, true) / 60 : s.stepMinutes) * (action === '증가' ? 1 : -1);
        return clockChange(((s.clockMinutes + delta) % 1440 + 1440) % 1440, delta);
      }
      case '모드': {
        if (!['시계', '타이머'].includes(value)) reject('모드는 시계 또는 타이머를 선택하세요.');
        pause(); s.mode = value === '시계' ? 'clock' : 'timer'; updateDisplay(); return notice(value + ' 모드');
      }
      case '타이머': {
        const seconds = parseSpan(value, false);
        pause(); s.mode = 'timer'; s.durationSeconds = seconds; s.remainingMs = seconds * 1000;
        updateDisplay(); return notice('타이머 설정 ' + timerText(s.remainingMs));
      }
      case '시작': {
        checkedArea();
        const ms = remainingMs() || s.durationSeconds * 1000;
        if (!Number.isFinite(ms) || ms <= 0 || ms > MAX_SECONDS * 1000) reject('타이머 시작 시간을 먼저 설정하세요.');
        pause(); s.mode = 'timer'; s.remainingMs = ms; s.deadline = Date.now() + ms; s.running = true; s.enabled = true;
        if (!hasDisplay()) layout(); else updateDisplay();
        tick(generation); return notice('타이머 시작');
      }
      case '일시정지': if (s.mode !== 'timer') reject('타이머 모드에서 사용하세요.'); pause(); updateDisplay(); return notice('타이머 일시정지');
      case '초기화': if (s.mode !== 'timer') reject('타이머 모드에서 사용하세요.'); pause(); s.remainingMs = s.durationSeconds * 1000; updateDisplay(); return notice('타이머 초기화');
      case '알림':
        if (!['공개', 'gm', '켜기', '끄기'].includes(value.toLowerCase())) reject('알림은 공개 또는 GM으로 지정하세요.');
        s.announce = ['공개', '켜기'].includes(value.toLowerCase());
        return notice('증감 알림 ' + (s.announce ? '전체 공개' : 'GM 귓말'));
      case '불투명도': case '그림자불투명도': {
        if (!/^\d+(?:\.\d+)?$/.test(value) || Number(value) > 100) reject('불투명도는 0부터 100까지 입력하세요.');
        s[action === '불투명도' ? 'backgroundOpacity' : 'shadowOpacity'] = Number(value);
        if (s.enabled) layout();
        return settings();
      }
      case '표시':
        if (!['배경', '그림자'].includes(value)) reject('표시는 배경 또는 그림자로 지정하세요.');
        s.displayStyle = value === '배경' ? 'background' : 'shadow';
        if (s.enabled) layout();
        return settings();
      default: reject('알 수 없는 명령입니다. !시계 설정');
    }
  }

  on('ready', guarded(function () {
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
    log('Session Clock 1.0.4 ready (' + (s.enabled ? 'ON' : 'OFF') + ')');
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
