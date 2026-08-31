const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const scriptsRoot = path.join(root, 'public', 'scripts');
const baselineRevision = '4d6154a';
const scriptIndexes = Array.from({ length: 10 }, (_, index) =>
  String(index).padStart(2, '0'),
);

const allowedRemovals = {
  '05:namedFunctions:wrapText':
    '05의 글자 단위 처리를 없애면서 호출부 안으로 내부화한 함수',
};

function fail(message) {
  throw new Error(`[GitHub 배포본 보존 검사] ${message}`);
}

function runGit(args, purpose) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const detail = String(error.stderr || error.message || '')
      .trim()
      .split(/\r?\n/)[0];
    fail(`${purpose}을(를) 읽지 못했습니다.${detail ? ` ${detail}` : ''}`);
  }
}

function maskComments(source) {
  const output = source.split('');
  let quote = '';

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quote) {
      if (char === '\\') {
        index += 1;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '/' && next === '/') {
      output[index] = ' ';
      output[index + 1] = ' ';
      index += 2;
      while (index < source.length && source[index] !== '\n') {
        output[index] = ' ';
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (char === '/' && next === '*') {
      output[index] = ' ';
      output[index + 1] = ' ';
      index += 2;
      while (
        index < source.length &&
        !(source[index] === '*' && source[index + 1] === '/')
      ) {
        if (source[index] !== '\n' && source[index] !== '\r') {
          output[index] = ' ';
        }
        index += 1;
      }
      if (index < source.length) {
        output[index] = ' ';
        output[index + 1] = ' ';
        index += 1;
      }
    }
  }

  return output.join('');
}

function collectMatches(source, regex, valueAt = 1) {
  const values = new Set();
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(source))) values.add(match[valueAt]);
  return values;
}

function extractStringLiterals(source) {
  const values = [];
  const regex = /(["'])((?:\\[\s\S]|(?!\1)[^\\\r\n])*)\1/g;
  let match;
  while ((match = regex.exec(source))) values.push(match[2]);
  return values;
}

function extractRoll20Events(source) {
  return new Set(
    extractStringLiterals(source).filter((value) =>
      /^(?:ready|chat:message|(?:add|change|destroy):[A-Za-z0-9_:-]+)$/.test(
        value,
      ),
    ),
  );
}

function extractStateKeys(source) {
  const values = new Set();
  const regex =
    /\bstate\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*(["'])([^"']+)\2\s*\])/g;
  let match;
  while ((match = regex.exec(source))) values.add(match[1] || match[3]);
  return values;
}

function extractManagementHandoutNames(source) {
  const values = new Set();
  const regex =
    /\b([A-Za-z_$][\w$]*)\s*[:=]\s*(["'])((?:\\[\s\S]|(?!\2)[^\\\r\n])*)\2/g;
  let match;
  while ((match = regex.exec(source))) {
    const key = match[1].replace(/_/g, '').toLowerCase();
    if (key === 'managername' || /handout.*name/.test(key)) {
      values.add(match[3]);
    }
  }
  return values;
}

function extractApiCommandPrefixes(source) {
  const values = new Set();
  const literalBody = '((?:\\\\[\\s\\S]|[^\\\\"\'\\r\\n])*)';
  const patterns = [
    new RegExp(
      `\\b([A-Za-z_$][\\w$]*)\\s*[:=]\\s*(["'])${literalBody}\\2`,
      'g',
    ),
    /\.\s*(?:indexOf|startsWith|substring)\s*\(\s*(["'])((?:\\[\s\S]|(?!\1)[^\\\r\n])*)\1/g,
    /(?:===?|!==?)\s*(["'])((?:\\[\s\S]|(?!\1)[^\\\r\n])*)\1/g,
    /(["'])((?:\\[\s\S]|(?!\1)[^\\\r\n])*)\1\s*(?:===?|!==?)/g,
  ];

  let match;
  while ((match = patterns[0].exec(source))) {
    if (/command/i.test(match[1]) && match[3].startsWith('!')) {
      values.add(match[3]);
    }
  }
  patterns.slice(1).forEach((regex) => {
    while ((match = regex.exec(source))) {
      if (match[2].startsWith('!')) values.add(match[2]);
    }
  });

  const anchoredRegex = /\/\^(![A-Za-z0-9_.#@\-\u3131-\u318e\uac00-\ud7a3]+)/g;
  while ((match = anchoredRegex.exec(source))) values.add(match[1]);
  return values;
}

function extractNamedFunctions(source) {
  return collectMatches(
    source,
    /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g,
  );
}

const categories = [
  ['roll20Events', 'Roll20 이벤트명', extractRoll20Events],
  ['stateKeys', 'state 키', extractStateKeys],
  ['managementHandouts', '관리 핸드아웃명', extractManagementHandoutNames],
  ['apiCommands', 'API 명령 접두어', extractApiCommandPrefixes],
  ['namedFunctions', '이름 있는 함수', extractNamedFunctions],
];

function baselineFiles() {
  runGit(['rev-parse', '--verify', `${baselineRevision}^{commit}`], '기준 커밋');
  const files = runGit(
    ['ls-tree', '-r', '--name-only', baselineRevision, '--', 'public/scripts'],
    '기준 커밋의 스크립트 목록',
  )
    .split(/\r?\n/)
    .filter(Boolean);

  return scriptIndexes.map((index) => {
    const matches = files.filter((file) =>
      new RegExp(`^public/scripts/${index}_.+\\.js$`).test(file),
    );
    if (matches.length !== 1) {
      fail(
        `기준 커밋의 ${index}번 스크립트가 ${matches.length}개입니다. 정확히 1개여야 합니다.`,
      );
    }
    return matches[0];
  });
}

function currentFiles() {
  let files;
  try {
    files = fs.readdirSync(scriptsRoot);
  } catch (error) {
    fail(`현재 스크립트 폴더를 읽지 못했습니다. ${error.message}`);
  }

  return scriptIndexes.map((index) => {
    const matches = files.filter((file) =>
      new RegExp(`^${index}_.+\\.js$`).test(file),
    );
    if (matches.length !== 1) {
      fail(`현재 ${index}번 스크립트가 ${matches.length}개입니다. 정확히 1개여야 합니다.`);
    }
    return path.join(scriptsRoot, matches[0]);
  });
}

function main() {
  const oldFiles = baselineFiles();
  const newFiles = currentFiles();
  const missing = [];
  const allowed = [];
  const totals = Object.fromEntries(categories.map(([key]) => [key, 0]));

  scriptIndexes.forEach((index, fileIndex) => {
    const baselinePath = oldFiles[fileIndex];
    const currentPath = newFiles[fileIndex];
    const baselineSource = maskComments(
      runGit(
        ['show', `${baselineRevision}:${baselinePath}`],
        `${baselineRevision}의 ${baselinePath}`,
      ),
    );
    let currentSource;
    try {
      currentSource = maskComments(fs.readFileSync(currentPath, 'utf8'));
    } catch (error) {
      fail(`현재 ${path.basename(currentPath)}을(를) 읽지 못했습니다. ${error.message}`);
    }

    categories.forEach(([key, label, extract]) => {
      const baselineValues = extract(baselineSource);
      const currentValues = extract(currentSource);
      totals[key] += baselineValues.size;
      baselineValues.forEach((value) => {
        if (currentValues.has(value)) return;
        const exceptionKey = `${index}:${key}:${value}`;
        if (allowedRemovals[exceptionKey]) {
          allowed.push(`${path.basename(currentPath)} / ${label} ${value}`);
          return;
        }
        missing.push(
          `${path.basename(currentPath)} / ${label}: ${JSON.stringify(value)}`,
        );
      });
    });
  });

  if (missing.length) {
    fail(
      `기준 배포본 ${baselineRevision}에서 사라진 연결점이 있습니다:\n- ${missing.join('\n- ')}`,
    );
  }

  const summary = categories
    .map(([key, label]) => `${label} ${totals[key]}개`)
    .join(', ');
  console.log(
    `GitHub 배포본 보존 검사 통과 (00~09, 기준 ${baselineRevision}): ${summary}`,
  );
  if (allowed.length) {
    console.log(`의도적 예외 ${allowed.length}개: ${allowed.join(', ')}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
