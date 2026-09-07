const MODULES = [
  {
    id: '00',
    file: '00_scene_director.js',
    title: 'Scene Director',
    description: '설치된 기능 연결, 출력 시간과 도움말 관리',
    required: true,
    setup: ['선택한 기능 코드와 함께 설치합니다.', '채팅에 !도움을 입력합니다.', '토큰 이름은 업로드 파일명이 아니라 Roll20 보드에서 선택한 이미지 토큰의 이름입니다.'],
    settings: [
      { id: 'firstDelay', group: '출력 시간', label: '첫 줄 대기(ms)', note: '명령 입력 후 첫 출력까지', type: 'number', value: 500, min: 0, codeKey: 'firstDelay' },
      { id: 'lineInterval', shared: 'lineInterval', group: '출력 시간', label: '대사 간격(ms)', note: '나레이터와 공통', type: 'number', value: 2800, min: 0, codeKey: 'lineInterval' },
      { id: 'visualMinShow', group: '출력 시간', label: '비주얼 최소 표시(ms)', type: 'number', value: 400, min: 0, codeKey: 'visualMinShow' },
      { id: 'visualCharRatio', group: '출력 시간', label: '글자당 추가 시간(ms)', type: 'number', value: 10, min: 0, codeKey: 'visualCharRatio' },
      { id: 'typeSpeed', group: '스크립트', label: '글자 간격(ms)', type: 'number', value: 45, min: 1, codeKey: 'typeSpeed' },
      { id: 'typeHold', group: '스크립트', label: '표시 유지(ms)', type: 'number', value: 2800, min: 0, codeKey: 'typeHold' },
      { id: 'typeAllLines', shared: 'typeAllLines', group: '스크립트', label: '모든 나레이터 줄에 적용', type: 'checkbox', value: true, codeKey: 'typeAllLines' },
      { id: 'createHandout', group: '도움말', label: '사용법 핸드아웃 생성', type: 'checkbox', value: true, codeKey: 'createHandout' },
      { id: 'handoutName', group: '도움말', label: '사용법 핸드아웃 이름', type: 'text', value: '[GM] SceneDirector 사용법', codeKey: 'handoutName' },
    ],
  },
  {
    id: '01',
    file: '01_narrator_director.js',
    title: '나레이터',
    description: '대사 순차 출력, 줄 끝 연출 명령 실행',
    setup: ['캐릭터 대사를 쓸 때 Roll20 캐릭터를 만듭니다.', '/as와 /emas 이름을 캐릭터 이름에 맞춥니다.', '채팅에 !... 대사를 입력합니다.'],
    settings: [
      { id: 'lineInterval', shared: 'lineInterval', group: '출력', label: '대사 간격(ms)', note: 'Scene Director와 공통', type: 'number', value: 2800, min: 0, codeKey: 'interval' },
      { id: 'typeAllLines', shared: 'typeAllLines', group: '출력', label: '모든 줄에 스크립트 적용', type: 'checkbox', value: true, codeKey: 'type_all_lines' },
    ],
  },
  {
    id: '02',
    file: '02_audio_bridge.js',
    title: '오디오',
    description: '쥬크박스 재생, 중지, 반복, 볼륨, 페이드',
    setup: [
      'Roll20 쥬크박스에 음원을 추가합니다.',
      '음원마다 다른 제목을 붙입니다.',
      '자동 생성된 🎵오디오와 🪇효과음 매크로를 사용합니다.',
      '같은 제목의 음원이 하나뿐인데 중복 오류가 나면 Roll20에 유령 음원이 남은 경우입니다. 문제가 되는 음원을 지웠다가 다시 추가해 주세요.',
    ],
    settings: [
      { id: 'driver', group: '기본', label: '오디오 처리 방식', type: 'select', value: 'native', options: [['native', 'Roll20 쥬크박스'], ['roll20am', 'Roll20AM']], codeKey: 'AUDIO_DRIVER' },
      { id: 'command', group: '기본', label: '한국어 명령어', type: 'text', value: '!오디오', codeKey: 'KOREAN_AUDIO_COMMAND' },
      { id: 'bgmMacro', group: '매크로', label: 'BGM 매크로 이름', type: 'text', value: '🎵오디오', codeKey: 'BGM_MACRO_NAME' },
      { id: 'sfxMacro', group: '매크로', label: '효과음 매크로 이름', type: 'text', value: '🪇효과음', codeKey: 'SFX_MACRO_NAME' },
      { id: 'fadeInStep', group: '페이드', label: '페이드인 갱신 간격(ms)', type: 'number', value: 500, min: 50, codeKey: 'FADE_IN_STEP_MS' },
      { id: 'fadeOutStep', group: '페이드', label: '페이드아웃 갱신 간격(ms)', type: 'number', value: 100, min: 50, codeKey: 'FADE_OUT_STEP_MS' },
    ],
  },
  {
    id: '03',
    file: '03_visual_dialogue_compatible.js',
    title: '비주얼 노벨',
    description: '스크립트창, 대사창, 이름, 스탠딩, 표정, 배경 표시',
    setup: ['적용 페이지의 GM 레이어에 이미지 토큰을 놓고 토큰 이름을 각각 vd_area, vd_name, vd_dialogue로 지정합니다.', '오브젝트 레이어에 이미지 토큰을 놓고 토큰 이름을 vd_panel로 지정합니다. 창 분리를 고르면 대사창 이미지 토큰 이름을 vd_dialogue_box로 지정합니다.', 'standings 덱을 만들고 캐릭터명, 캐릭터명-표정명 카드를 넣습니다.', '배경을 쓸 때 background 덱을 만들고 맵 레이어에 배경 이미지 토큰을 놓은 뒤 토큰 이름을 vd_background로 지정합니다.'],
    settings: [
      { id: 'page', shared: 'page', group: '기본', label: '적용할 페이지', note: '쉼표로 여러 페이지 지정, 05와 06 공통', type: 'text', value: 'conversation', codeKey: 'page_list' },
      { id: 'deck', group: '기본', label: '스탠딩 덱 이름', type: 'text', value: 'standings', codeKey: 'deck_name' },
      { id: 'sceneMacro', group: '기본', label: '장면 매크로 이름', type: 'text', value: '📹장면', codeKey: 'background_macro_name' },
      { id: 'requireAs', group: '기본', label: '발화자 지정 필수', type: 'checkbox', value: true, codeKey: 'require_as' },
      { id: 'excludedAs', group: '기본', label: '출력하지 않을 발화자', note: '쉼표로 구분', type: 'text', value: '', codeKey: 'excluded_as_list' },
      { id: 'panelMode', group: '창 구성', label: '사용 방식', type: 'select', value: 'split', options: [['shared', '패널 하나'], ['split', '스크립트창과 대사창 분리']], codeKey: 'dialogue_panel_mode' },
      { id: 'standingCount', group: '스탠딩', label: '동시 표시 수', type: 'number', value: 5, min: 1, codeKey: 'max_number' },
      { id: 'standingWidth', group: '스탠딩', label: '최대 가로', type: 'number', value: 415, min: 1, codeKey: 'width' },
      { id: 'standingHeight', group: '스탠딩', label: '최대 세로', type: 'number', value: 623, min: 1, codeKey: 'height' },
      { id: 'standingFit', group: '스탠딩', label: '맞춤 방식', type: 'select', value: 'contain-top', options: [['contain-top', '비율 유지, 상단 맞춤'], ['stretch', '지정 크기로 늘이기']], codeKey: 'standing_fit' },
      { id: 'font', group: '글자', label: '글꼴', type: 'select', value: 'Arial', options: [['Arial', 'Arial'], ['Patrick Hand', 'Patrick Hand'], ['Contrail One', 'Contrail One'], ['Shadows Into Light', 'Shadows Into Light'], ['Candal', 'Candal']], codeKey: 'font_family' },
      { id: 'nameSize', group: '글자', label: '이름 크기', type: 'number', value: 20, min: 1, codeKey: 'name_font_size' },
      { id: 'nameColor', group: '글자', label: '이름색', type: 'text', value: '#c0c0c0', codeKey: 'name_font_color' },
      { id: 'dialogueSize', group: '글자', label: '대사 크기', type: 'number', value: 18, min: 1, codeKey: 'dialogue_font_size' },
      { id: 'dialogueColor', group: '글자', label: '대사색', type: 'text', value: 'rgb(255, 255, 255)', codeKey: 'dialogue_font_color' },
      { id: 'descSize', group: '글자', label: '강조 크기', type: 'number', value: 22, min: 1, codeKey: 'desc_font_size' },
      { id: 'descColor', group: '글자', label: '강조색', type: 'text', value: '#c0c0c0', codeKey: 'desc_font_color' },
      { id: 'stroke', group: '글자', label: '글자 외곽선', type: 'checkbox', value: false, codeKey: 'stroke_enabled' },
      { id: 'strokeColor', group: '글자', label: '외곽선색', type: 'text', value: '#000000', codeKey: 'stroke_color' },
      { id: 'descOffset', group: '글자', label: '강조 위치(px)', note: '양수는 아래, 음수는 위', type: 'number', value: 0, codeKey: 'desc_offset_y' },
      { id: 'minShow', group: '출력 시간', label: '최소 표시(ms)', type: 'number', value: 400, min: 0, codeKey: 'min_showtime' },
      { id: 'showRatio', group: '출력 시간', label: '글자당 추가 시간(ms)', type: 'number', value: 10, min: 0, codeKey: 'showtime_ratio' },
    ],
  },
  {
    id: '04',
    file: '04_image_switcher_compatible.js',
    title: '이미지 전환',
    description: '카드 이미지로 같은 이름의 토큰 교체',
    setup: ['지정한 키워드로 시작하는 덱을 만듭니다.', 'Roll20 보드에 이미지 토큰을 놓고 토큰 이름을 덱 이름과 같게 지정합니다.', '바꿀 이미지를 카드 앞면에 넣습니다.'],
    settings: [
      { id: 'keyword', group: '기본', label: '덱과 토큰 이름 키워드', type: 'text', value: 'image', codeKey: 'keyword' },
      { id: 'macro', group: '기본', label: '매크로 이름', type: 'text', value: '이미지변경', codeKey: 'macro_name' },
    ],
  },
  {
    id: '05',
    file: '05_dialog_overlay_compatible.js',
    title: '별도 대사창',
    description: '별도 패널에 글자를 한 글자씩 출력',
    setup: ['적용 페이지와 패널 이미지 주소를 입력합니다.', '채팅에 !dialog-test 대사를 입력해 확인합니다.'],
    settings: [
      { id: 'page', shared: 'page', group: '기본', label: '적용할 페이지', note: '03과 06 공통, 첫 페이지 사용', type: 'text', value: 'conversation', codeKey: 'PAGE_NAME', firstOnly: true },
      { id: 'panelImage', group: '대사창', label: '패널 이미지 주소', note: 'Roll20 HTTPS 이미지 주소, max 또는 med 사용 가능', type: 'url', value: '', placeholder: 'https://files.d20.io/.../max.png', codeKey: 'BOX_IMAGE_URL' },
      { id: 'boxWidth', group: '대사창', label: '가로', type: 'number', value: 1320, min: 1, codeKey: 'BOX_WIDTH' },
      { id: 'boxHeight', group: '대사창', label: '세로', type: 'number', value: 220, min: 1, codeKey: 'BOX_HEIGHT' },
      { id: 'bottomMargin', group: '대사창', label: '아래 여백', type: 'number', value: 80, codeKey: 'BOTTOM_MARGIN' },
      { id: 'layer', group: '대사창', label: '표시 레이어', type: 'select', value: 'objects', options: [['objects', '토큰 레이어'], ['foreground', '포그라운드 레이어']], codeKey: 'LAYER' },
      { id: 'textSize', group: '글자', label: '글자 크기', type: 'number', value: 35, min: 1, codeKey: 'TEXT_SIZE' },
      { id: 'textSpeed', group: '글자', label: '글자 간격(ms)', type: 'number', value: 45, min: 1, codeKey: 'TEXT_SPEED' },
      { id: 'holdTime', group: '글자', label: '출력 유지(ms)', type: 'number', value: 2800, min: 0, codeKey: 'HOLD_TIME' },
      { id: 'lineLength', group: '글자', label: '한 줄 글자 수', type: 'number', value: 32, min: 1, codeKey: 'MAX_CHARS_PER_LINE' },
      { id: 'textColor', group: '글자', label: '글자색', type: 'text', value: '#ffffff', codeKey: 'TEXT_COLOR' },
      { id: 'font', group: '글자', label: '글꼴', type: 'text', value: 'Arial', codeKey: 'FONT_FAMILY' },
      { id: 'sfx', group: '효과음', label: '자동 효과음 사용', type: 'checkbox', value: true, codeKey: 'SFX_ENABLED' },
    ],
  },
  {
    id: '06',
    file: '06_apng_director.js',
    title: 'APNG',
    description: '애니메이션 전체 화면 또는 지정 영역 출력',
    setup: ['apng 덱을 만들고 카드 앞면에 애니메이션을 넣습니다.', '지정 영역을 쓸 때 GM 레이어에 이미지 토큰을 놓고 토큰 이름을 apng_area로 지정합니다.', '자동 생성된 📽️apng 매크로를 사용합니다.'],
    settings: [
      { id: 'page', shared: 'page', group: '기본', label: '적용할 페이지', note: '03과 05 공통, 첫 페이지 사용', type: 'text', value: 'conversation', codeKey: 'PAGE_NAME', firstOnly: true },
      { id: 'deck', group: '기본', label: '덱 이름', type: 'text', value: 'apng', codeKey: 'DECK_NAME' },
      { id: 'area', group: '기본', label: '영역 토큰 이름', note: '보드 위 토큰 설정의 이름, 파일명 아님', type: 'text', value: 'apng_area', codeKey: 'AREA_NAME' },
      { id: 'macro', group: '기본', label: '매크로 이름', type: 'text', value: '📽️apng', codeKey: 'MACRO_NAME' },
      { id: 'mode', group: '재생', label: '기본 재생 방식', type: 'select', value: 'once', options: [['once', '1회'], ['loop', '반복']], codeKey: 'DEFAULT_MODE' },
      { id: 'duration', group: '재생', label: '기본 표시 시간(ms)', type: 'number', value: 3000, min: 0, codeKey: 'DEFAULT_DURATION' },
    ],
  },
  {
    id: '07',
    file: '07_handout_director.js',
    title: '핸드아웃',
    description: '보기 권한 관리, 공개 알림 출력',
    setup: ['채팅에 !핸드아웃 관리를 입력합니다.', '관리할 폴더를 선택합니다.', '핸드아웃별 공개 대상을 선택합니다.'],
    settings: [
      { id: 'command', group: '기본', label: '명령어', type: 'text', value: '!핸드아웃', codeKey: 'command' },
      { id: 'manager', group: '기본', label: '관리 핸드아웃 이름', type: 'text', value: '[GM] 핸드아웃 관리', codeKey: 'managerName' },
      { id: 'macro', group: '기본', label: '매크로 이름', type: 'text', value: '🖊️핸드아웃', codeKey: 'macroName' },
    ],
  },
  {
    id: '08',
    file: '08_cutin_director.js',
    title: '컷인',
    description: '이미지와 핸드아웃 표지를 화면 위에 표시(10번과 함께 쓰면 지원되는 판정 결과 연결)',
    setup: ['cutin 덱을 만들고 카드 앞면에 컷인 이미지를 넣습니다.', '채팅에 !컷인 관리를 입력합니다.', '지정 영역을 쓸 때 GM 레이어에 이미지 토큰을 놓고 토큰 이름을 cutin_area로 지정합니다.', '어두운 배경을 쓸 때 GM 레이어에 배경 이미지 토큰을 놓고 토큰 이름을 cutin_overlay로 지정합니다. 파일명은 바꾸지 않아도 되며, 이미지를 저장한 토큰은 자동으로 사라집니다.'],
    settings: [
      { id: 'command', group: '기본', label: '명령어', type: 'text', value: '!컷인', codeKey: 'command' },
      { id: 'deck', group: '기본', label: '덱 이름', type: 'text', value: 'cutin', codeKey: 'deckName' },
      { id: 'macro', group: '기본', label: '매크로 이름', type: 'text', value: '🎬컷인', codeKey: 'macroName' },
      { id: 'manager', group: '기본', label: '관리 핸드아웃 이름', type: 'text', value: '[GM] 컷인 관리', codeKey: 'managerName' },
      { id: 'area', group: '배치', label: '영역 토큰 이름', note: '보드 위 토큰 설정의 이름, 파일명 아님', type: 'text', value: 'cutin_area', codeKey: 'areaName' },
      { id: 'overlay', group: '배치', label: '배경 토큰 이름', note: '보드 위 토큰 설정의 이름, 파일명 아님', type: 'text', value: 'cutin_overlay', codeKey: 'overlayName' },
      { id: 'overlayImage', group: '배치', label: '배경 이미지 주소', note: 'cutin_overlay 토큰을 쓰지 않을 때 입력', type: 'url', value: '', placeholder: 'https://files.d20.io/.../max.png', codeKey: 'overlayImageUrl' },
      { id: 'width', group: '크기', label: '기본 가로', type: 'number', value: 700, min: 1, codeKey: 'defaultWidth' },
      { id: 'height', group: '크기', label: '기본 세로', type: 'number', value: 280, min: 1, codeKey: 'defaultHeight' },
      { id: 'duration', group: '시간', label: '기본 표시 시간(ms)', type: 'number', value: 4000, min: 0, codeKey: 'defaultDuration' },
    ],
  },
  {
    id: '09',
    file: '09_avatar_director.js',
    title: '캐릭터 이미지',
    description: '표정에 맞춰 캐릭터 이미지와 맵 토큰 교체',
    setup: ['avatars 덱을 만들고 캐릭터명, 캐릭터명-표정명 카드를 넣습니다.', '맵 토큰은 캐릭터 시트와 연결되고 토큰 이름이 캐릭터명과 같은 토큰만 변경됩니다.', '채팅에 !아바타 관리를 입력합니다.', '필요한 캐릭터만 자동 변경에서 제외합니다.'],
    settings: [
      { id: 'deck', group: '기본', label: '덱 이름', type: 'text', value: 'avatars', codeKey: 'deck_name' },
      { id: 'manager', group: '기본', label: '관리 핸드아웃 이름', type: 'text', value: '[GM] 캐릭터 이미지 관리', codeKey: 'management_handout_name' },
      { id: 'handoutPrefix', group: '기본', label: '표정 핸드아웃 앞글자', type: 'text', value: '🎭 캐릭터 이미지 | ', codeKey: 'expression_handout_prefix' },
      { id: 'character', group: '변경 대상', label: '캐릭터 시트 이미지', type: 'checkbox', value: true, codeKey: 'update_character_avatar' },
      { id: 'token', group: '변경 대상', label: '맵 토큰 이미지', type: 'checkbox', value: false, codeKey: 'update_map_tokens' },
      { id: 'vd', group: '변경 대상', label: '비주얼 노벨 표정', type: 'checkbox', value: true, codeKey: 'update_visual_dialogue' },
    ],
  },
  {
    id: '10',
    file: '10_sheet_helper.js',
    title: '시트 헬퍼',
    description: '방에 적용된 시트를 인식해 명령어로 실행, 자동 트래킹 기능',
    setup: [
      '채팅에 !!관리를 입력해 인식된 항목을 확인합니다.',
      '!!굴릴항목이름으로 실행하고, !!검색 이름으로 현재 수치와 굴림 버튼을 찾습니다.',
    ],
    settings: [
      { id: 'legacyCommands', group: '명령어', label: '!! 간편 명령어 사용', type: 'checkbox', value: true, codeKey: 'legacy_commands' },
      { id: 'manager', group: '핸드아웃', label: 'GM 관리 핸드아웃 이름', type: 'text', value: '[GM] 시트 헬퍼 관리', codeKey: 'manager_name' },
      { id: 'playerHelp', group: '핸드아웃', label: 'PL 도움말 핸드아웃 이름', type: 'text', value: '[PL] 시트 헬퍼 사용법', codeKey: 'player_help_name' },
      { id: 'refreshDelay', group: '갱신', label: '변경 감지 대기(ms)', type: 'number', value: 700, min: 0, codeKey: 'refresh_delay' },
    ],
  },
];

const selected = new Set(MODULES.map((module) => module.id));
const values = new Map();
const sourceCache = new Map();
const moduleList = document.querySelector('#module-list');
const buildStatus = document.querySelector('#build-status');
const copyButton = document.querySelector('#copy-bundle');
const downloadButton = document.querySelector('#download-bundle');

MODULES.forEach((module) =>
  module.settings.forEach((setting) => {
    const key = settingKey(module, setting);
    if (!values.has(key)) values.set(key, setting.value);
  }),
);

function settingKey(module, setting) {
  return setting.shared || `${module.id}.${setting.id}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderModules() {
  moduleList.innerHTML = MODULES.map(moduleHtml).join('');
  moduleList.querySelectorAll('.module-toggle').forEach((input) => {
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('keydown', (event) => event.stopPropagation());
    input.addEventListener('change', () => {
      input.checked ? selected.add(input.value) : selected.delete(input.value);
      updateSelection();
    });
  });
  moduleList.querySelectorAll('[data-setting-key]').forEach((input) => {
    input.addEventListener('input', () => {
      values.set(input.dataset.settingKey, input.type === 'checkbox' ? input.checked : input.value);
      syncSettingInputs(input);
      buildStatus.textContent = '';
      refreshOpenCode();
    });
  });
  moduleList.querySelectorAll('.code-view').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) renderCode(details);
    });
  });
}

function moduleHtml(module) {
  const checked = selected.has(module.id) ? 'checked' : '';
  const disabled = module.required ? 'disabled' : '';
  return `
    <details class="module-item${selected.has(module.id) ? ' selected' : ''}" data-module="${module.id}">
      <summary>
        <input class="module-toggle" type="checkbox" value="${module.id}" aria-label="${escapeHtml(module.title)} 선택" ${checked} ${disabled}>
        <span class="module-number">${module.id}</span>
        <span class="module-name"><strong>${escapeHtml(module.title)}</strong><small>${escapeHtml(module.file)}</small></span>
        <span class="module-description">${escapeHtml(module.description)}</span>
        <span class="module-tag${module.required ? ' required' : ''}">${module.required ? '필수' : '단독 사용 가능'}</span>
      </summary>
      <div class="module-body">
        <div class="module-setup"><h2>세팅법</h2><ol>${module.setup.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div>
        <div class="module-settings"><h2>설정</h2>${settingsHtml(module)}</div>
        <details class="code-view" data-module="${module.id}">
          <summary>코드 보기</summary>
          <pre><code>코드를 불러오는 중</code></pre>
        </details>
      </div>
    </details>`;
}

function settingsHtml(module) {
  const groups = new Map();
  module.settings.forEach((setting) => {
    const group = setting.group || '기본';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(setting);
  });
  return [...groups].map(([group, settings]) => `
    <fieldset>
      <legend>${escapeHtml(group)}</legend>
      <div class="setting-grid">${settings.map((setting) => settingHtml(module, setting)).join('')}</div>
    </fieldset>`).join('');
}

function settingHtml(module, setting) {
  const key = settingKey(module, setting);
  const value = values.get(key);
  const id = `setting-${module.id}-${setting.id}`;
  const note = setting.note ? `<small>${escapeHtml(setting.note)}</small>` : '';
  if (setting.type === 'checkbox') {
    return `<label class="setting-check" for="${id}"><input id="${id}" data-setting-key="${escapeHtml(key)}" type="checkbox" ${value ? 'checked' : ''}><span>${escapeHtml(setting.label)}${note}</span></label>`;
  }
  if (setting.type === 'select') {
    return `<label for="${id}"><span>${escapeHtml(setting.label)}</span><select id="${id}" data-setting-key="${escapeHtml(key)}">${setting.options.map(([optionValue, label]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHtml(label)}</option>`).join('')}</select>${note}</label>`;
  }
  const bounds = [
    setting.min === undefined ? '' : `min="${setting.min}"`,
    setting.max === undefined ? '' : `max="${setting.max}"`,
    setting.step === undefined ? '' : `step="${setting.step}"`,
  ].filter(Boolean).join(' ');
  return `<label for="${id}"><span>${escapeHtml(setting.label)}</span><input id="${id}" data-setting-key="${escapeHtml(key)}" type="${setting.type}" value="${escapeHtml(value)}" ${bounds} placeholder="${escapeHtml(setting.placeholder || '')}" autocomplete="off">${note}</label>`;
}

function syncSettingInputs(changed) {
  moduleList.querySelectorAll('[data-setting-key]').forEach((input) => {
    if (input === changed || input.dataset.settingKey !== changed.dataset.settingKey) return;
    if (input.type === 'checkbox') input.checked = changed.checked;
    else input.value = changed.value;
  });
}

function updateSelection() {
  moduleList.querySelectorAll('.module-item').forEach((item) => {
    const checked = selected.has(item.dataset.module);
    item.classList.toggle('selected', checked);
    item.querySelector('.module-toggle').checked = checked;
  });
  buildStatus.textContent = '';
}

function jsString(value) {
  return JSON.stringify(String(value || '').trim());
}

function settingValue(module, setting) {
  let value = values.get(settingKey(module, setting));
  if (setting.firstOnly) value = String(value || '').split(',')[0].trim();
  return value;
}

function codeValue(setting, value) {
  if (setting.type === 'checkbox') return value === true ? 'true' : 'false';
  if (setting.type === 'number') {
    const number = Number(value);
    return Number.isFinite(number) ? String(number) : String(setting.value);
  }
  if (setting.id === 'handoutPrefix') return JSON.stringify(String(value || ''));
  return jsString(value);
}

function replaceCodeValue(source, codeKey, value, setting = {}) {
  const escapedKey = codeKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const literal = `(?:'(?:\\\\.|[^'\\\\])*'|"(?:\\\\.|[^"\\\\])*"|true|false|-?\\d+(?:\\.\\d+)?)`;
  const pattern = new RegExp(`(${escapedKey}\\s*:\\s*)${literal}`);
  return source.replace(pattern, (_, prefix) => prefix + codeValue(setting, value));
}

function configuredSource(module, source) {
  module.settings.forEach((setting) => {
    source = replaceCodeValue(source, setting.codeKey, settingValue(module, setting), setting);
  });
  if (module.id === '00') {
    const flags = { audio: '02', vd: '03', image: '04', type: '05', apng: '06', handout: '07', cutin: '08', avatar: '09', sheet: '10' };
    Object.keys(flags).forEach((key) => {
      source = replaceCodeValue(source, key, selected.has(flags[key]), { type: 'checkbox' });
    });
  }
  if (module.id === '01') {
    const flags = { use_audio: '02', use_visual_dialogue: '03', use_image_switcher: '04', use_dialog_overlay: '05', use_apng: '06', use_handout: '07', use_cutin: '08', use_avatar: '09' };
    Object.keys(flags).forEach((key) => {
      source = replaceCodeValue(source, key, selected.has(flags[key]), { type: 'checkbox' });
    });
  }
  return source;
}

async function moduleSource(module) {
  if (!sourceCache.has(module.file)) {
    const bundled = window.SCENE_SUITE_SOURCES?.[module.file];
    if (bundled) {
      sourceCache.set(module.file, bundled);
    } else {
      const response = await fetch(`scripts/${module.file}`, {
        cache: 'no-store',
      });
      if (!response.ok)
        throw new Error(`${module.title} 코드를 불러오지 못했습니다.`);
      sourceCache.set(module.file, await response.text());
    }
  }
  return configuredSource(module, sourceCache.get(module.file));
}

async function renderCode(details) {
  const code = details.querySelector('code');
  const module = MODULES.find((item) => item.id === details.dataset.module);
  code.textContent = '코드를 불러오는 중';
  try {
    code.textContent = await moduleSource(module);
  } catch (error) {
    code.textContent = error.message;
  }
}

function refreshOpenCode() {
  moduleList.querySelectorAll('.code-view[open]').forEach(renderCode);
}

async function buildBundle() {
  const chosen = MODULES.filter((module) => selected.has(module.id));
  const sources = await Promise.all(chosen.map(async (module) => ({ module, source: await moduleSource(module) })));
  const header = ['/*', ' * Scene Suite', ' * 제작: @EOOOOORK', ` * 포함 코드: ${chosen.map((module) => module.id).join(', ')}`, ' */'].join('\n');
  return `${header}\n\n${sources.map(({ module, source }) => ['/* ============================================================', ` * ${module.file}`, ' * ============================================================ */', source.trim()].join('\n')).join('\n\n')}\n`;
}

async function copyBundle() {
  setBusy(true, '코드 만드는 중');
  try {
    const bundle = await buildBundle();
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(bundle);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = bundle;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    buildStatus.textContent = '복사 완료';
  } catch (error) {
    buildStatus.textContent = window.location.protocol === 'file:' ? '웹 주소로 연 설치 페이지에서 다시 시도' : error.message;
  } finally {
    setBusy(false);
  }
}

async function downloadBundle() {
  setBusy(true, '파일 만드는 중');
  try {
    const bundle = await buildBundle();
    downloadText(bundle, 'scene-suite-extension.js');
    buildStatus.textContent = '파일 받기 완료';
  } catch (error) {
    buildStatus.textContent = window.location.protocol === 'file:' ? '웹 주소로 연 설치 페이지에서 다시 시도' : error.message;
  } finally {
    setBusy(false);
  }
}

function downloadText(source, filename) {
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setBusy(busy, message) {
  copyButton.disabled = busy;
  downloadButton.disabled = busy;
  if (message) buildStatus.textContent = message;
}

document.querySelector('#select-all').addEventListener('click', () => {
  MODULES.forEach((module) => selected.add(module.id));
  updateSelection();
  refreshOpenCode();
});
document.querySelector('#clear-selection').addEventListener('click', () => {
  selected.clear();
  selected.add('00');
  updateSelection();
  refreshOpenCode();
});
copyButton.addEventListener('click', copyBundle);
downloadButton.addEventListener('click', downloadBundle);
renderModules();
