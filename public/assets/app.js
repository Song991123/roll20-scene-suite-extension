const MODULES = [
  {
    id: '00',
    file: '00_scene_director.js',
    title: 'Scene Director',
    description: '설치 상태, 공통 시간, 도움말, 기능 연결을 관리합니다.',
    setup: [
      '맵이나 덱 준비 없이 설치할 수 있습니다.',
      '채팅에서 !sd help를 입력해 현재 설치된 기능을 확인합니다.',
      '자동 생성된 [GM] SceneDirector 사용법 핸드아웃에서 공통 설정을 바꿉니다.',
    ],
  },
  {
    id: '01',
    file: '01_narrator_director.js',
    title: 'Narrator Director',
    description: '대사와 여러 연출을 순서대로 같은 타이밍에 실행합니다.',
    setup: [
      '별도 맵이나 덱은 필요하지 않습니다.',
      '/as와 /emas에 쓸 이름을 캐릭터 저널 이름과 맞춥니다.',
      '!... 대사 형식으로 큐를 넣고 줄 끝에 필요한 기능 명령을 붙입니다.',
    ],
  },
  {
    id: '02',
    file: '02_audio_bridge.js',
    title: 'Audio Bridge',
    description: '쥬크박스 음원을 제목으로 재생하고 페이드합니다.',
    setup: [
      'Roll20 쥬크박스의 오디오 관리에서 음원을 추가합니다.',
      '음원 제목은 서로 다르게 정합니다.',
      '자동 생성되는 오디오와 효과음 매크로를 매크로 바에 표시합니다.',
    ],
  },
  {
    id: '03',
    file: '03_visual_dialogue_compatible.js',
    title: 'Visual Dialogue',
    description: '대사창, 스탠딩, 표정, 배경과 타자식 출력을 표시합니다.',
    setup: [
      '표시할 페이지 이름을 page_list에 적습니다.',
      'GM 레이어에 vd_area, vd_name, vd_dialogue 가이드 토큰을 둡니다.',
      '오브젝트 레이어에 vd_panel을 두고 필요하면 vd_dialogue_box도 둡니다.',
      'standings 덱에 캐릭터명과 캐릭터명-표정명 카드를 넣습니다.',
      '배경 전환을 쓰면 background 덱과 vd_background 토큰을 준비합니다.',
    ],
  },
  {
    id: '04',
    file: '04_image_switcher_compatible.js',
    title: 'Image Switcher',
    description: '카드덱과 같은 이름의 토큰 이미지를 바꿉니다.',
    setup: [
      'image로 시작하는 이름의 덱을 만듭니다.',
      '같은 이름의 토큰을 전환할 페이지에 둡니다.',
      '덱 카드 이름을 장면이나 이미지 이름으로 정합니다.',
    ],
  },
  {
    id: '05',
    file: '05_dialog_overlay_compatible.js',
    title: 'Dialog Overlay',
    description: '별도 대사창에 글자가 차례대로 나타납니다.',
    setup: [
      '설치 도구에서 표시 페이지와 발화자 이름을 적습니다.',
      'Roll20 라이브러리의 대사창 배경 이미지 주소를 넣습니다.',
      '!dialog-test 대사로 위치와 크기를 확인합니다.',
    ],
  },
  {
    id: '06',
    file: '06_apng_director.js',
    title: 'APNG Director',
    description: '전체 화면 또는 지정 영역에 애니메이션을 표시합니다.',
    setup: [
      'apng 덱을 만들고 카드 앞면에 애니메이션을 넣습니다.',
      '설치 도구에서 애니메이션을 띄울 페이지 이름을 적습니다.',
      '지정 영역을 쓸 때만 GM 레이어에 apng_area 토큰을 둡니다.',
      '자동 생성되는 APNG 매크로에서 전체 또는 영역을 고릅니다.',
    ],
  },
  {
    id: '07',
    file: '07_handout_director.js',
    title: 'Handout Director',
    description: '핸드아웃 보기 권한과 공개 알림을 관리합니다.',
    setup: [
      '!핸드아웃 관리로 GM 관리 핸드아웃을 만듭니다.',
      '관리할 저널 폴더를 선택합니다.',
      '공개할 자료와 권한을 받을 캐릭터를 고릅니다.',
    ],
  },
  {
    id: '08',
    file: '08_cutin_director.js',
    title: 'Cutin Director',
    description: '카드, URL, 핸드아웃 표지 컷인을 표시합니다.',
    setup: [
      'cutin 덱에 컷인 카드를 넣습니다.',
      '!컷인 관리에서 같은 부류의 크기를 등록합니다.',
      '위치를 제한할 때만 GM 레이어에 cutin_area를 둡니다.',
      '어두운 배경을 쓰면 GM 레이어에 cutin_overlay 토큰을 둡니다.',
      '필요한 카드에 효과음, 대사, 시트 결과를 연결합니다.',
    ],
  },
  {
    id: '09',
    file: '09_avatar_director.js',
    title: 'Avatar Director',
    description: '시트 아바타, 맵 토큰, 스탠딩 표정을 선택 동기화합니다.',
    setup: [
      'avatars 덱에 캐릭터명과 캐릭터명-표정명 카드를 넣습니다.',
      '!아바타 관리에서 시트, 토큰, 비주얼 변경 대상을 고릅니다.',
      '자동 변경에서 뺄 캐릭터는 제외 목록에 추가합니다.',
    ],
  },
];

const PRESETS = {
  all: MODULES.map(module => module.id),
  novel: ['00', '01', '02', '03', '04', '09'],
  sound: ['00', '01', '02', '05', '06', '08'],
  handout: ['00', '01', '02', '07', '08'],
  clear: [],
};

const selected = new Set(PRESETS.all);
const sourceCache = new Map();
const moduleList = document.querySelector('#module-list');
const setupList = document.querySelector('#setup-list');
const selectedList = document.querySelector('#selected-list');
const buildSummary = document.querySelector('#build-summary');
const buildStatus = document.querySelector('#build-status');
const copyButton = document.querySelector('#copy-bundle');
const downloadButton = document.querySelector('#download-bundle');

function renderModules() {
  moduleList.innerHTML = MODULES.map(module => `
    <label class="module-card${selected.has(module.id) ? ' selected' : ''}">
      <input type="checkbox" value="${module.id}" ${selected.has(module.id) ? 'checked' : ''}>
      <span>
        <span class="module-code">${module.id}</span>
        <h3>${module.title}</h3>
        <p>${module.description}</p>
        <span class="module-badge">단독 사용 가능</span>
      </span>
    </label>
  `).join('');

  moduleList.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', event => {
      event.target.checked ? selected.add(event.target.value) : selected.delete(event.target.value);
      renderModules();
      updateBuildSummary();
    });
  });
}

function renderSetup() {
  setupList.innerHTML = MODULES.map(module => `
    <details class="setup-item">
      <summary>
        <span class="setup-index">${module.id}</span>
        <span class="setup-title"><strong>${module.title}</strong><small>${module.file}</small></span>
      </summary>
      <div class="setup-body">
        <ol>${module.setup.map(step => `<li>${step}</li>`).join('')}</ol>
        <a href="scripts/${module.file}" target="_blank" rel="noreferrer">이 파일 보기</a>
      </div>
    </details>
  `).join('');
}

function updateBuildSummary() {
  const chosen = MODULES.filter(module => selected.has(module.id));
  buildSummary.textContent = `${chosen.length}개 모듈을 한 파일로 묶습니다.`;
  selectedList.innerHTML = chosen.map(module => `<li>${module.file}</li>`).join('');
  copyButton.disabled = chosen.length === 0;
  downloadButton.disabled = chosen.length === 0;
  buildStatus.textContent = '';
}

function jsString(value) {
  return JSON.stringify(String(value || '').trim());
}

function configuredSource(module, source) {
  if (module.id === '03') {
    const pages = document.querySelector('#setting-vd-pages').value.trim() || 'conversation';
    source = source.replace(/page_list:\s*(['"])[^'"]*\1,/, `page_list: ${jsString(pages)},`);
  }
  if (module.id === '05') {
    const page = document.querySelector('#setting-overlay-page').value.trim() || 'Start';
    const speakers = document.querySelector('#setting-overlay-speakers').value
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const image = document.querySelector('#setting-overlay-image').value.trim();
    source = source
      .replace(/PAGE_NAME:\s*(['"])[^'"]*\1,/, `PAGE_NAME: ${jsString(page)},`)
      .replace(/ALLOWED_NAMES:\s*\[[^\]]*\],/, `ALLOWED_NAMES: ${JSON.stringify(speakers.length ? speakers : ['▶'])},`)
      .replace(/BOX_IMAGE_URL:\s*(['"])[^'"]*\1,/, `BOX_IMAGE_URL: ${jsString(image)},`);
  }
  if (module.id === '06') {
    const page = document.querySelector('#setting-apng-page').value.trim() || 'conversation';
    source = source.replace(/PAGE_NAME:\s*(['"])[^'"]*\1,/, `PAGE_NAME: ${jsString(page)},`);
  }
  if (module.id === '08') {
    const image = document.querySelector('#setting-cutin-overlay').value.trim();
    source = source.replace(/overlayImageUrl:\s*(['"])[^'"]*\1,/, `overlayImageUrl: ${jsString(image)},`);
  }
  return source;
}

async function moduleSource(module) {
  if (!sourceCache.has(module.file)) {
    const response = await fetch(`scripts/${module.file}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${module.file}을 불러오지 못했습니다.`);
    sourceCache.set(module.file, await response.text());
  }
  return configuredSource(module, sourceCache.get(module.file));
}

async function buildBundle() {
  const chosen = MODULES.filter(module => selected.has(module.id));
  if (!chosen.length) throw new Error('모듈을 하나 이상 선택하세요.');
  const sources = await Promise.all(chosen.map(async module => ({ module, source: await moduleSource(module) })));
  const header = [
    '/*',
    ' * Scene Suite 확장 버전 통합 파일',
    ' * 제작 및 통합: @EOOOOORK',
    ' * 선택한 모듈은 각각 단독으로도 사용할 수 있습니다.',
    ' */',
  ].join('\n');
  return `${header}\n\n${sources.map(({ module, source }) => [
    '/* ============================================================',
    ` * ${module.file}`,
    ' * ============================================================ */',
    source.trim(),
  ].join('\n')).join('\n\n')}\n`;
}

async function copyBundle() {
  setBusy(true, '통합 코드를 만드는 중입니다.');
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
    buildStatus.textContent = '통합 코드를 복사했습니다.';
  } catch (error) {
    buildStatus.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

async function downloadBundle() {
  setBusy(true, '통합 파일을 만드는 중입니다.');
  try {
    const bundle = await buildBundle();
    const url = URL.createObjectURL(new Blob([bundle], { type: 'text/javascript;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene-suite-extension.js';
    link.click();
    URL.revokeObjectURL(url);
    buildStatus.textContent = '통합 파일을 내려받았습니다.';
  } catch (error) {
    buildStatus.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

function setBusy(busy, message) {
  copyButton.disabled = busy || selected.size === 0;
  downloadButton.disabled = busy || selected.size === 0;
  if (message) buildStatus.textContent = message;
}

document.querySelectorAll('[data-preset]').forEach(button => {
  button.addEventListener('click', () => {
    selected.clear();
    PRESETS[button.dataset.preset].forEach(id => selected.add(id));
    renderModules();
    updateBuildSummary();
  });
});

copyButton.addEventListener('click', copyBundle);
downloadButton.addEventListener('click', downloadBundle);
renderModules();
renderSetup();
updateBuildSummary();
