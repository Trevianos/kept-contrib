const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { chromium } = require('playwright');

test('built app: label create, color edit, realtime second client, reload and JSON export', { timeout: 90000 }, async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'kept-label-browser-'));
  const port = 21000 + Math.floor(Math.random() * 3000);
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server/server.js'], { cwd: path.resolve(__dirname, '..'), env: { ...process.env, PORT: String(port), DATA_DIR: directory, SQLITE_PATH: path.join(directory, 'kept.sqlite'), BASE_URL: origin }, stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  let output = ''; child.stdout.on('data', b => output += b); child.stderr.on('data', b => output += b);
  try {
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(output);
      try { if ((await fetch(origin + '/api/setup/status')).ok) break; } catch {}
      await new Promise(r => setTimeout(r, 100));
    }
    async function api(route, method = 'GET', body, token) {
      const response = await fetch(origin + '/api' + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
      assert.ok(response.ok, `${route}: ${await response.clone().text()}`);
      return response.json();
    }
    const credentials = { username: 'browser-colors', password: 'isolated-browser-colors' };
    await api('/setup/admin', 'POST', credentials);
    const login = await api('/auth/login', 'POST', credentials);
    const session = { ...login.user, token: login.token };
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true });
    await context.addInitScript(session => localStorage.setItem('gk_session', JSON.stringify(session)), session);
    const page = await context.newPage();
    const second = await context.newPage();
    const errors = []; page.on('pageerror', e => { errors.push(e.message); console.log(e.message); }); second.on('pageerror', e => { errors.push(e.message); console.log(e.message); });
    await page.goto(origin); await second.goto(origin);
    await page.locator('app-navbar').waitFor(); await second.locator('app-navbar').waitFor();
    await page.locator('[aria-label="Edit labels"]').click();
    const modal = page.locator('.label-modal-main:visible');
    await modal.getByRole('button', { name: 'Color for New label', exact: true }).focus();
    await page.keyboard.press('Enter');
    await modal.getByRole('button', { name: 'Blue', exact: true }).focus();
    await page.keyboard.press('Space');
    const input = modal.getByPlaceholder('Create new label');
    await input.fill('Colored work'); await input.press('Enter');
    const dot = p => p.locator('#sidebar-labels .item[title="Colored work"] .label-color-dot');
    const waitColor = async (p, color) => { await p.waitForFunction(({ color }) => { const el = document.querySelector('#sidebar-labels .item[title="Colored work"] .label-color-dot'); return el && getComputedStyle(el).backgroundColor === color; }, { color }); };
    console.log('created blue label');
    await waitColor(page, 'rgb(30, 99, 213)'); await waitColor(second, 'rgb(30, 99, 213)');
    const labels = await api('/labels', 'GET', undefined, login.token);
    const label = labels.find(l => l.name === 'Colored work');
    await api('/notes', 'POST', { noteTitle: 'Color note', bgColor: '#f4b8c9', labels: [{ ...label, added: true }] }, login.token);
    await modal.getByRole('button', { name: 'Color for Colored work', exact: true }).click();
    await modal.getByRole('button', { name: 'Pink', exact: true }).click();
    console.log('updated pink label');
    await waitColor(page, 'rgb(216, 27, 96)'); await waitColor(second, 'rgb(216, 27, 96)');
    await modal.getByText('Done', { exact: true }).click();
    await page.reload(); await waitColor(page, 'rgb(216, 27, 96)');
    await page.waitForFunction(() => [...document.querySelectorAll('app-notes .label')].some(el => el.textContent.includes('Colored work') && getComputedStyle(el.querySelector('.label-color-dot')).backgroundColor === 'rgb(216, 27, 96)'));
    await page.locator('app-notes .note-container').filter({ hasText: 'Color note' }).locator('.title').click();
    await page.waitForFunction(() => [...document.querySelectorAll('app-input .label')].some(el => el.textContent.includes('Colored work') && getComputedStyle(el.querySelector('.label-color-dot')).backgroundColor === 'rgb(216, 27, 96)'));
    await page.locator('app-input .close-btn:visible').first().click();
    for (const width of [360, 1280]) for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(theme => { document.body.classList.toggle('light-theme', theme === 'light');  }, theme);
      // Open via the existing edit action, including on mobile where the drawer starts closed.
      await page.locator('[aria-label="Edit labels"]').evaluate(el => el.click());
      const picker = modal.getByRole('button', { name: 'Color for Colored work', exact: true });
      if (width === 360) await picker.tap(); else await picker.click();
      const palette = modal.locator('.palette:popover-open');
      assert.equal(await palette.evaluate(el => getComputedStyle(el).backgroundColor), theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(40, 41, 44)');
      const rect = await palette.boundingBox(); assert.ok(rect.x >= 0 && rect.x + rect.width <= width);
      assert.equal(await palette.getByRole('button', { name: 'Pink', exact: true }).getAttribute('aria-pressed'), 'true');
      if (process.env.KEPT_LABEL_SCREENSHOTS) await page.screenshot({ path: path.join(process.env.KEPT_LABEL_SCREENSHOTS, `label-picker-${width}-${theme}.png`) });
      await palette.getByRole('button', { name: 'Pink', exact: true }).focus();
      await page.keyboard.press('Escape'); await palette.waitFor({ state: 'hidden' });
      await modal.getByText('Done', { exact: true }).click();
    }
    await page.goto(origin + '/settings');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /JSON/ }).click();
    const download = await downloadPromise;
    const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
    assert.equal(exported.find(n => n.noteTitle === 'Color note').labels[0].color, '#d81b60');
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    if (child.exitCode === null && child.signalCode === null) { const stopped = once(child, 'close'); child.kill(); await stopped; }
    await fs.rm(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
