const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash, webcrypto } = require('node:crypto');
const ts = require('typescript');

const hashes = {
  'assets/images/keep2x.fw.png': '73dc6efed7b8e2b403a8c39d93cb3a789fdacf72599cc70cb98c7d75d8907b1d',
  'assets/images/kept-icon-180.png': '70001c6a3ebfba37a0a30961d13d6603c9408f4614d85a84de9afc3746c47c60',
  'assets/images/kept-icon-192.png': 'bf48fa0f31712e2062174e4a2b3e03871afe02849a7c619198d06787742477a7',
  'assets/images/kept-icon-512.png': '66d5595080cd46e9d1f22cb07b31fe0db17bef2a89ea790d8060f78e20c7dd4b',
  'favicon.ico': '5865477f1cc068182ec13d1e6ddfe76ae7f8fa71652ff3ee75a8ab1fb2a0af71'
};

test('source and production output contain the exact five branding assets', () => {
  for (const [file, expected] of Object.entries(hashes)) {
    for (const root of ['src', 'dist/keep']) {
      const bytes = fs.readFileSync(path.join(root, file));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, `${root}/${file}`);
      if (file.endsWith('.png')) {
        const size = file.includes('keep2x') ? 128 : Number(file.match(/(\d+)\.png$/)[1]);
        assert.equal(bytes.readUInt32BE(16), size);
        assert.equal(bytes.readUInt32BE(20), size);
      }
    }
  }
  const manifest = JSON.parse(fs.readFileSync('dist/keep/manifest.webmanifest'));
  assert.equal(manifest.theme_color, '#FFA726');
  for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join('dist/keep', icon.src)));
  const html = fs.readFileSync('dist/keep/index.html', 'utf8');
  assert.match(html, /sizes="180x180" href="\/assets\/images\/kept-icon-180.png"/);
  assert.ok(fs.existsSync('dist/keep/kept-push-sw.js'));
  for (const file of ['KeptSans.woff2', 'KeptSans-Italic.woff2', 'OFL.txt', 'TRADEMARKS.txt']) {
    assert.deepEqual(fs.readFileSync(`src/assets/fonts/${file}`), fs.readFileSync(`dist/keep/assets/fonts/${file}`));
  }
  assert.deepEqual(fs.readFileSync('src/assets/licenses/google-keep-clone-MIT.txt'), fs.readFileSync('dist/keep/assets/licenses/google-keep-clone-MIT.txt'));
});

test('UUID startup works in a worker global without window and preserves native Crypto', () => {
  const code = ts.transpileModule(fs.readFileSync('src/uuid-polyfill.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const crypto = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) };
  const worker = { crypto, exports: {} };
  vm.runInNewContext(code, worker);
  assert.match(crypto.randomUUID(), /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  const native = webcrypto.randomUUID;
  vm.runInNewContext(code, { crypto: webcrypto, exports: {} });
  assert.equal(webcrypto.randomUUID, native);
  assert.doesNotThrow(() => vm.runInNewContext(code, { exports: {} }));
});
