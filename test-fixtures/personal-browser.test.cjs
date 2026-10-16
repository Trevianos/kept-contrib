// Real production Angular output + isolated API/SQLite. No production access.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const http = require('node:http');
const https = require('node:https');
const { createHash, X509Certificate } = require('node:crypto');
const selfsigned = require('selfsigned');
const { chromium, devices } = require('playwright');

test('built app: insecure HTTP note save, both themes, local fonts and native HTTPS Crypto', { timeout: 90000 }, async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'kept-personal-'));
  const port = 25000 + Math.floor(Math.random() * 3000);
  const origin = `http://kept-http.test:${port}`;
  const local = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server/server.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: String(port), DATA_DIR: directory, SQLITE_PATH: path.join(directory, 'kept.sqlite'), BASE_URL: origin },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let browser, tlsServer;
  let output = '';
  child.stdout.on('data', b => { output += b; });
  child.stderr.on('data', b => { output += b; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (child.exitCode !== null) throw new Error(output);
      try { if ((await fetch(`${local}/api/setup/status`)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, output);
    const post = async (route, body) => {
      const response = await fetch(`${local}/api${route}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      assert.ok(response.ok, `${route}: ${response.status}`);
      return response.json();
    };
    const credentials = { username: 'integration-test', displayName: 'Český test', password: 'isolated-test-password' };
    await post('/setup/admin', credentials);
    const login = await post('/auth/login', credentials);
    const session = { ...login.user, token: login.token };
    const certificate = await selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { keySize: 2048, days: 1 });
    const spki = new X509Certificate(certificate.cert).publicKey.export({ type: 'spki', format: 'der' });
    const trustedKey = createHash('sha256').update(spki).digest('base64');
    browser = await chromium.launch({
      ...(process.env.KEPT_BROWSER_CHANNEL ? { channel: process.env.KEPT_BROWSER_CHANNEL } : {}),
      headless: true, args: ['--host-resolver-rules=MAP kept-http.test 127.0.0.1', '--no-proxy-server', `--ignore-certificate-errors-spki-list=${trustedKey}`]
    });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true });
    await context.addInitScript(session => localStorage.setItem('gk_session', JSON.stringify(session)), session);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin);
    await page.locator('app-navbar').waitFor();
    assert.equal(await page.evaluate(() => isSecureContext), false, 'exercise actual insecure HTTP context');
    assert.equal(await page.evaluate(() => typeof crypto.randomUUID), 'function', 'fallback installed before Angular');
    await page.locator('app-input .placeholder').click();
    const title = page.locator('app-input .note-title[contenteditable=true]').first();
    assert.ok((await title.evaluate(el => getComputedStyle(el).fontFamily)).includes('Kept Sans'));
    await title.fill('Příliš žluťoučký kůň');
    await page.locator('app-input .note-body[contenteditable=true]:visible').first().fill('Úkoly: čaj, řepa, ů, ď, ť');
    const body = page.locator('app-input .note-body[contenteditable=true]:visible').first();
    const floating = page.locator('app-input .selection-format-toolbar');
    const selectBody = async () => body.evaluate(el => {
      el.focus();
      const range = document.createRange(); range.selectNodeContents(el);
      const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
    });
    await selectBody();
    await floating.waitFor();
    await floating.getByRole('button', { name: 'H1', exact: true }).click();
    await floating.getByRole('button', { name: 'B', exact: true }).click();
    await floating.getByRole('button', { name: 'I', exact: true }).click();
    await floating.getByRole('button', { name: 'U', exact: true }).click();
    assert.equal(await body.locator('h1').count(), 1);
    assert.ok(await page.evaluate(() => ['italic', 'underline'].every(command => document.queryCommandState(command))));
    const selectedText = await page.evaluate(() => getSelection().toString());
    await floating.getByRole('button', { name: 'Clear formatting' }).click();
    assert.equal(await body.locator('h1,h2,b,strong,i,em,u').count(), 0);
    assert.equal(await page.evaluate(() => getSelection().toString()), selectedText);
    await page.keyboard.press('Escape');
    await floating.waitFor({ state: 'hidden' });
    await page.evaluate(() => document.dispatchEvent(new Event('selectionchange')));
    await page.waitForTimeout(50);
    assert.equal(await floating.count(), 0, 'stale selection must not reopen dismissed toolbar');
    await body.click();
    await selectBody();
    await floating.waitFor();
    await body.click();
    await floating.waitFor({ state: 'hidden' });
    await selectBody();
    await floating.waitFor();
    const formatTrigger = page.locator('app-input .text-format-trigger');
    await formatTrigger.hover();
    const tooltipAnchor = await formatTrigger.evaluate(el => {
      const rect = el.getBoundingClientRect(), tip = getComputedStyle(el, '::before');
      return { position: getComputedStyle(el).position, content: tip.content, left: parseFloat(tip.left), top: parseFloat(tip.top), width: rect.width };
    });
    assert.equal(tooltipAnchor.position, 'relative', 'Formatting options remains anchored to its own button');
    assert.equal(tooltipAnchor.content, '"Formatting options"');
    assert.ok(Math.abs(tooltipAnchor.left - tooltipAnchor.width / 2) < 1);
    assert.equal(tooltipAnchor.top, 37);
    await formatTrigger.click();
    assert.equal(await page.locator('app-input .text-format-toolbar:visible').count(), 1);
    await page.locator('app-input .text-format-trigger').click();
    await floating.waitFor({ state: 'hidden' });
    await page.locator('app-input .close-btn').first().click();
    await page.waitForFunction(() => document.querySelector('app-notes')?.textContent?.includes('Příliš žluťoučký kůň'));
    // Check persistence through the API, rather than only optimistic Angular state.
    let saved = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      const response = await fetch(`${local}/api/notes`, { headers: { authorization: `Bearer ${login.token}` } });
      const notes = await response.json();
      const note = notes.find(note => note.noteTitle === 'Příliš žluťoučký kůň');
      if (note) {
        assert.ok(note.noteBody.includes(selectedText), 'Clear preserves persisted text');
        assert.doesNotMatch(note.noteBody, /<\/?(?:h1|h2|b|strong|i|em|u)(?:\s|>)/i);
        saved = true; break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(saved, 'HTTP note reaches SQLite');
    await page.reload();
    await page.waitForFunction(() => document.querySelector('app-notes')?.textContent?.includes('Příliš žluťoučký kůň'));
    // Start a real mobile browser context so platform detection and the fullscreen
    // editor initialize in mobile mode, rather than resizing a desktop session.
    const mobileContext = await browser.newContext({ ...devices['Pixel 7'] });
    await mobileContext.addInitScript(session => localStorage.setItem('gk_session', JSON.stringify(session)), session);
    const mobilePage = await mobileContext.newPage();
    mobilePage.on('pageerror', error => errors.push(error.message));
    await mobilePage.goto(origin);
    await mobilePage.locator('app-notes').getByText('Příliš žluťoučký kůň', { exact: true }).first().tap();
    const mobileBody = mobilePage.locator('app-input .note-body[contenteditable=true]:visible').first();
    await mobileBody.evaluate(el => {
      el.focus(); const range = document.createRange(); range.selectNodeContents(el);
      getSelection().removeAllRanges(); getSelection().addRange(range);
    });
    await mobilePage.locator('app-input .mobile-icon.format:visible').tap();
    const mobileBar = mobilePage.locator('app-input .mobile-format-toolbar:visible');
    await mobileBar.waitFor();
    await mobileBar.getByRole('button', { name: 'H2', exact: true }).tap();
    assert.equal(await mobileBody.locator('h2').count(), 1);
    await mobileBar.getByRole('button', { name: 'Clear formatting' }).tap();
    assert.equal(await mobileBody.locator('h1,h2').count(), 0);
    await mobilePage.keyboard.press('Escape');
    await mobileBar.waitFor({ state: 'hidden' });
    await mobilePage.locator('app-input .mobile-top-bar .back:visible').tap();
    await mobileContext.close();
    for (const light of [false, true]) {
      await page.evaluate(light => document.body.classList.toggle('light-theme', light), light);
      const style = await page.locator('app-navbar .first-col .text').evaluate(el => {
        const s = getComputedStyle(el); return { color: s.color, font: s.fontFamily, weight: s.fontWeight, size: s.fontSize, shadow: s.textShadow };
      });
      assert.deepEqual(style, { color: 'rgb(255, 167, 38)', font: 'Arial, Helvetica, sans-serif', weight: '600', size: '26px', shadow: 'none' });
    }
    assert.ok(await page.evaluate(async () => {
      const regular = await document.fonts.load('400 16px "Kept Sans"', 'Příliš žluťoučký kůň');
      const italic = await document.fonts.load('italic 700 16px "Kept Sans"', 'České poznámky');
      const faces = [...document.fonts].filter(f => f.family.includes('Kept Sans'));
      return regular.length > 0 && italic.length > 0 && faces.length === 2 && faces.every(f => f.status === 'loaded');
    }), 'both local font faces load');
    assert.deepEqual(errors, []);

    // TLS terminates locally with an ephemeral test-only certificate.
    tlsServer = https.createServer({ key: certificate.private, cert: certificate.cert }, (request, response) => {
      const upstream = http.request(`${local}${request.url}`, { method: request.method, headers: request.headers }, result => {
        response.writeHead(result.statusCode, result.headers); result.pipe(response);
      });
      upstream.on('error', () => { response.writeHead(502); response.end(); });
      request.pipe(upstream);
    });
    await new Promise(resolve => tlsServer.listen(0, '127.0.0.1', resolve));
    const secure = await browser.newContext({ ignoreHTTPSErrors: true });
    await secure.addInitScript(() => { globalThis.__nativeUUID = crypto.randomUUID; });
    const securePage = await secure.newPage();
    await securePage.goto(`https://127.0.0.1:${tlsServer.address().port}/login`);
    await securePage.locator('app-root form').waitFor();
    assert.ok(await securePage.evaluate(() => isSecureContext && crypto.randomUUID === globalThis.__nativeUUID));
    const workerId = await securePage.evaluate(() => new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob(['postMessage(crypto.randomUUID())'], { type: 'text/javascript' }));
      const worker = new Worker(url);
      worker.onmessage = event => { worker.terminate(); URL.revokeObjectURL(url); resolve(event.data); };
      worker.onerror = reject;
    }));
    assert.match(workerId, /^[a-f0-9-]{36}$/);
    const sw = await securePage.evaluate(async () => {
      const registration = await navigator.serviceWorker.register('/kept-push-sw.js');
      await navigator.serviceWorker.ready;
      return registration.unregister();
    });
    assert.ok(sw, 'PWA worker still registers on HTTPS');
  } finally {
    await browser?.close();
    if (tlsServer) { tlsServer.closeAllConnections(); await new Promise(resolve => tlsServer.close(resolve)); }
    if (child.exitCode === null && child.signalCode === null) { const stopped = once(child, 'close'); child.kill(); await stopped; }
    await fs.rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
