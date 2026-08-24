const fs = require('fs');
const path = require('path');

const scriptsRoot = path.resolve(__dirname, '..', 'public', 'scripts');
const target = path.resolve(__dirname, '..', 'public', 'assets', 'sources.js');

function buildSourceCatalog() {
  const sources = {};
  fs.readdirSync(scriptsRoot)
    .filter((name) => /^\d{2}_.+\.js$/.test(name))
    .sort()
    .forEach((name) => {
      sources[name] = fs
        .readFileSync(path.join(scriptsRoot, name), 'utf8')
        .replace(/\r\n?/g, '\n');
    });
  return `window.SCENE_SUITE_SOURCES = ${JSON.stringify(sources)};\n`;
}

if (require.main === module) {
  fs.writeFileSync(target, buildSourceCatalog());
  console.log('Scene Suite source catalog: updated');
}

module.exports = buildSourceCatalog;
