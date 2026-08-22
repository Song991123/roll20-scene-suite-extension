const MODULES = [
  {
    id: '00',
    file: '00_scene_director.js',
    title: 'Scene Director',
    description: '선택한 기능을 서로 연결하고 시간과 도움말을 관리합니다.',
    required: true,
    setup: [
      '다른 코드와 함께 넣으면 자동으로 연결됩니다.',
      '채팅에서 !sd help를 입력하면 설치된 기능만 안내합니다.',
    ],
  },
  {
    id: '01',
    file: '01_narrator_director.js',
    title: 'Narrator',
    description: '대사를 순서대로 보내고 줄 끝의 연출 명령을 함께 실행합니다.',
    setup: [
      '캐릭터 대사를 쓸 경우 Roll20에 캐릭터를 만듭니다.',
      '/as와 /emas의 이름을 캐릭터 이름과 같게 적습니다.',
      '!... 대사 형식으로 사용합니다.',
    ],
  },
  {
    id: '02',
    file: '02_audio_bridge.js',
    title: '오디오',
    description: '쥬크박스 음원을 재생, 중지, 반복, 볼륨, 페이드합니다.',
    setup: [
      'Roll20 쥬크박스에 음원을 추가합니다.',
      '각 음원의 제목을 서로 다르게 정합니다.',
      '자동 생성된 오디오와 효과음 매크로를 사용합니다.',
    ],
  },
  {
    id: '03',
    file: '03_visual_dialogue_compatible.js',
    title: '비주얼 노벨',
    description: '대사창, 이름, 스탠딩, 표정, 배경을 화면에 표시합니다.',
    setup: [
      'GM 레이어에 vd_area, vd_name, vd_dialogue를 둡니다.',
      '오브젝트 레이어에 vd_panel을 둡니다.',
      'standings 덱에 캐릭터명과 캐릭터명-표정명 카드를 넣습니다.',
      '배경을 바꿀 경우 background 덱과 vd_background 토큰을 준비합니다.',
    ],
  },
  {
    id: '04',
    file: '04_image_switcher_compatible.js',
    title: '이미지 전환',
    description: '카드덱에서 고른 이미지로 같은 이름의 토큰을 바꿉니다.',
    setup: [
      'image로 시작하는 이름의 덱을 만듭니다.',
      '같은 이름의 토큰을 맵에 둡니다.',
      '덱에 전환할 이미지를 카드로 넣습니다.',
    ],
  },
  {
    id: '05',
    file: '05_dialog_overlay_compatible.js',
    title: '별도 대사창',
    description: '별도 대사창에 글자를 한 글자씩 표시합니다.',
    setup: [
      '사용자 설정에 적용 페이지와 대사창 이미지 주소를 적습니다.',
      '!dialog-test 대사로 표시 위치를 확인합니다.',
    ],
  },
  {
    id: '06',
    file: '06_apng_director.js',
    title: 'APNG',
    description: '애니메이션을 전체 화면이나 지정한 위치에 표시합니다.',
    setup: [
      'apng 덱을 만들고 애니메이션 카드를 넣습니다.',
      '지정한 위치에만 표시할 경우 GM 레이어에 apng_area를 둡니다.',
      '자동 생성된 APNG 매크로를 사용합니다.',
    ],
  },
  {
    id: '07',
    file: '07_handout_director.js',
    title: '핸드아웃',
    description: '핸드아웃 보기 권한을 주고 공개 알림을 보냅니다.',
    setup: [
      '!핸드아웃 관리 명령을 입력합니다.',
      '관리할 폴더를 고릅니다.',
      '공개할 자료와 보여줄 캐릭터를 선택합니다.',
    ],
  },
  {
    id: '08',
    file: '08_cutin_director.js',
    title: '컷인',
    description: '이미지와 핸드아웃 표지를 화면 위에 표시합니다.',
    setup: [
      'cutin 덱에 이미지를 카드로 넣습니다.',
      '!컷인 관리에서 표시 크기를 정합니다.',
      '위치를 제한할 경우 GM 레이어에 cutin_area를 둡니다.',
      '어두운 배경을 쓸 경우 GM 레이어에 cutin_overlay를 둡니다.',
    ],
  },
  {
    id: '09',
    file: '09_avatar_director.js',
    title: '캐릭터 이미지',
    description: '표정에 맞춰 캐릭터 이미지와 맵 토큰을 바꿉니다.',
    setup: [
      'avatars 덱에 캐릭터명과 캐릭터명-표정명 카드를 넣습니다.',
      '!아바타 관리에서 바꿀 대상을 고릅니다.',
      '자동 변경하지 않을 캐릭터는 제외 목록에 넣습니다.',
    ],
  },
];

const selected = new Set(MODULES.map((module) => module.id));
const sourceCache = new Map();
const moduleList = document.querySelector('#module-list');
const setupList = document.querySelector('#setup-list');
const buildSummary = document.querySelector('#build-summary');
const buildStatus = document.querySelector('#build-status');
const copyButton = document.querySelector('#copy-bundle');
const downloadButton = document.querySelector('#download-bundle');
const pageSetting = document.querySelector('#page-setting');
const dialogImageSetting = document.querySelector('#dialog-image-setting');
const noSettings = document.querySelector('#no-settings');

function renderModules() {
  moduleList.innerHTML = MODULES.map(
    (module) => `
    <label class="module-row">
      <input type="checkbox" value="${module.id}" ${selected.has(module.id) ? 'checked' : ''} ${module.required ? 'disabled' : ''}>
      <span class="module-number">${module.id}</span>
      <span class="module-name"><strong>${module.title}</strong><small>${module.file}</small></span>
      <span class="module-description">${module.description}</span>
      <span class="module-tag${module.required ? ' required' : ''}">${module.required ? '필수' : '단독 사용'}</span>
    </label>
  `,
  ).join('');

  moduleList.querySelectorAll('input:not(:disabled)').forEach((input) => {
    input.addEventListener('change', (event) => {
      event.target.checked
        ? selected.add(event.target.value)
        : selected.delete(event.target.value);
      updatePage();
    });
  });
}

function renderSetup() {
  setupList.innerHTML = MODULES.map(
    (module) => `
    <details class="setup-item">
      <summary>
        <span class="module-number">${module.id}</span>
        <strong>${module.title}</strong>
        <span class="setup-summary">${module.description}</span>
      </summary>
      <div class="setup-body">
        <ol>${module.setup.map((step) => `<li>${step}</li>`).join('')}</ol>
        <a href="scripts/${module.file}" target="_blank" rel="noreferrer">코드 보기</a>
      </div>
    </details>
  `,
  ).join('');
}

function updatePage() {
  const usesPage = ['03', '05', '06'].some((id) => selected.has(id));
  pageSetting.hidden = !usesPage;
  dialogImageSetting.hidden = !selected.has('05');
  noSettings.style.display = usesPage ? 'none' : 'block';
  buildSummary.textContent = `필수 코드 포함 ${selected.size}개를 한 파일로 묶습니다.`;
  buildStatus.textContent = '';
}

function jsString(value) {
  return JSON.stringify(String(value || '').trim());
}

function configuredSource(module, source) {
  const pageValue =
    document.querySelector('#setting-page').value.trim() || 'conversation';
  const firstPage = pageValue.split(',')[0].trim() || 'conversation';
  if (module.id === '03') {
    source = source.replace(
      /page_list:\s*(['"])[^'"]*\1,/,
      `page_list: ${jsString(pageValue)},`,
    );
  }
  if (module.id === '05') {
    const image = document.querySelector('#setting-dialog-image').value.trim();
    source = source
      .replace(
        /PAGE_NAME:\s*(['"])[^'"]*\1,/,
        `PAGE_NAME: ${jsString(firstPage)},`,
      )
      .replace(
        /BOX_IMAGE_URL:\s*(['"])[^'"]*\1,/,
        `BOX_IMAGE_URL: ${jsString(image)},`,
      );
  }
  if (module.id === '06') {
    source = source.replace(
      /PAGE_NAME:\s*(['"])[^'"]*\1,/,
      `PAGE_NAME: ${jsString(firstPage)},`,
    );
  }
  return source;
}

async function moduleSource(module) {
  if (!sourceCache.has(module.file)) {
    const response = await fetch(`scripts/${module.file}`, {
      cache: 'no-store',
    });
    if (!response.ok)
      throw new Error(`${module.title} 코드를 불러오지 못했습니다.`);
    sourceCache.set(module.file, await response.text());
  }
  return configuredSource(module, sourceCache.get(module.file));
}

async function buildBundle() {
  const chosen = MODULES.filter((module) => selected.has(module.id));
  const sources = await Promise.all(
    chosen.map(async (module) => ({
      module,
      source: await moduleSource(module),
    })),
  );
  const header = [
    '/*',
    ' * Scene Suite 확장 버전 통합 파일',
    ' * 제작 및 통합: @EOOOOORK',
    ' */',
  ].join('\n');
  return `${header}\n\n${sources
    .map(({ module, source }) =>
      [
        '/* ============================================================',
        ` * ${module.file}`,
        ' * ============================================================ */',
        source.trim(),
      ].join('\n'),
    )
    .join('\n\n')}\n`;
}

async function copyBundle() {
  setBusy(true, '코드를 만드는 중입니다.');
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
    buildStatus.textContent = '코드를 복사했습니다.';
  } catch (error) {
    buildStatus.textContent =
      window.location.protocol === 'file:'
        ? '웹 주소로 연 설치 페이지에서 다시 시도하세요.'
        : error.message;
  } finally {
    setBusy(false);
  }
}

async function downloadBundle() {
  setBusy(true, '파일을 만드는 중입니다.');
  try {
    const bundle = await buildBundle();
    const url = URL.createObjectURL(
      new Blob([bundle], { type: 'text/javascript;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene-suite-extension.js';
    link.click();
    URL.revokeObjectURL(url);
    buildStatus.textContent = '파일을 받았습니다.';
  } catch (error) {
    buildStatus.textContent =
      window.location.protocol === 'file:'
        ? '웹 주소로 연 설치 페이지에서 다시 시도하세요.'
        : error.message;
  } finally {
    setBusy(false);
  }
}

function setBusy(busy, message) {
  copyButton.disabled = busy;
  downloadButton.disabled = busy;
  if (message) buildStatus.textContent = message;
}

document.querySelector('#select-all').addEventListener('click', () => {
  MODULES.forEach((module) => selected.add(module.id));
  renderModules();
  updatePage();
});

document.querySelector('#clear-selection').addEventListener('click', () => {
  selected.clear();
  selected.add('00');
  renderModules();
  updatePage();
});

copyButton.addEventListener('click', copyBundle);
downloadButton.addEventListener('click', downloadBundle);
renderModules();
renderSetup();
updatePage();
