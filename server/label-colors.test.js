const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { WebSocket } = require('ws');
const sqlite3 = require('sqlite3');
const AdmZip = require('adm-zip');

test('label colors persist, migrate, notify clients, preserve references and reject unauthorized writes', { timeout: 60000 }, async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'kept-label-colors-'));
  const port = 18000 + Math.floor(Math.random() * 5000);
  const base = `http://127.0.0.1:${port}/api`;
  let child, socket;
  async function api(route, { token, method = 'GET', body, expected = 200 } = {}) {
    const response = await fetch(base + route, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    assert.equal(response.status, expected, `${method} ${route}: ${await response.clone().text()}`);
    return response.status === 204 ? null : response.json();
  }
  async function start() {
    child = spawn(process.execPath, ['server/server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port), DATA_DIR: dir, SQLITE_PATH: path.join(dir, 'test.sqlite') }, stdio: ['ignore', 'pipe', 'pipe'] });
    let log = ''; child.stderr.on('data', data => log += data); child.stdout.on('data', data => log += data);
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(log);
      try { if ((await fetch(base + '/setup/status')).ok) return; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(log);
  }
  async function stop() { const closed = once(child, 'close'); child.kill(); await closed; }
  try {
    await start();
    const credentials = { username: 'colors-admin', password: 'isolated-colors-password' };
    await api('/setup/admin', { method: 'POST', body: credentials, expected: 201 });
    const { token } = await api('/auth/login', { method: 'POST', body: credentials });
    await api('/users', { token, method: 'POST', body: { username: 'other-user', password: 'other-user-password' }, expected: 201 });
    const other = await api('/auth/login', { method: 'POST', body: { username: 'other-user', password: 'other-user-password' } });
    const legacy = await api('/labels', { token, method: 'POST', body: { name: 'Legacy' }, expected: 201 });
    assert.equal(legacy.color, null);
    // Simulate the exact pre-feature schema, then run the additive migration.
    await stop();
    const db = new sqlite3.Database(path.join(dir, 'test.sqlite'));
    await new Promise((resolve, reject) => db.run('ALTER TABLE labels DROP COLUMN color', error => error ? reject(error) : resolve()));
    await new Promise((resolve, reject) => db.close(error => error ? reject(error) : resolve()));
    await start();
    assert.deepEqual((await api('/labels', { token })).find(l => l.id === legacy.id), legacy);
    socket = new WebSocket(`${base.replace('http:', 'ws:')}/realtime?token=${token}`);
    await once(socket, 'open');
    const messages = []; socket.on('message', data => messages.push(JSON.parse(data)));
    const label = await api('/labels', { token, method: 'POST', body: { name: 'Colored', color: '#1E63D5' }, expected: 201 });
    assert.equal(label.color, '#1e63d5');
    const note = await api('/notes', { token, method: 'POST', body: { noteTitle: 'Colored note', labels: [{ id: label.id, name: label.name, added: true }] }, expected: 201 });
    const before = (await api(`/notes/${note.id}`, { token })).labels;
    await api(`/labels/${label.id}`, { token, method: 'PATCH', body: { color: '#d81b60' } });
    assert.deepEqual((await api(`/notes/${note.id}`, { token })).labels, before);
    assert.equal((await api('/sync/bootstrap', { token })).labels.find(l => l.id === label.id).color, '#d81b60');
    assert.equal((await api('/sync/changes?cursor=0', { token })).labels.find(l => l.id === label.id).color, '#d81b60');
    const second = await api('/auth/login', { method: 'POST', body: credentials });
    assert.equal((await api('/labels', { token: second.token })).find(l => l.id === label.id).color, '#d81b60');
    for (let i = 0; i < 20 && !messages.some(m => m.type === 'labels-changed'); i++) await new Promise(r => setTimeout(r, 20));
    assert.ok(messages.some(m => m.type === 'labels-changed'));
    for (const color of ['red', '#fff', 'url(javascript:alert(1))', {}, '#gg0000']) await api(`/labels/${label.id}`, { token, method: 'PATCH', body: { color }, expected: 400 });
    await api(`/labels/${label.id}`, { token: other.token, method: 'PATCH', body: { color: '#ffffff' }, expected: 404 });
    await api('/labels', { expected: 401 });
    const found = await api('/labels/find-or-create', { token, method: 'POST', body: { name: label.name } });
    assert.equal(found.color, '#d81b60');
    await api(`/labels/${label.id}`, { token, method: 'PATCH', body: { name: 'Renamed' } });
    assert.equal((await api('/labels', { token })).find(l => l.id === label.id).color, '#d81b60');
    // Existing Takeout import accepts an optional color on label metadata.
    const zip = new AdmZip();
    zip.addFile('Takeout/Keep/color.json', Buffer.from(JSON.stringify({ title: 'Imported color', textContent: 'Text', labels: [{ name: 'Imported label', color: '#00897b' }] })));
    const form = new FormData(); form.append('takeout', new Blob([zip.toBuffer()], { type: 'application/zip' }), 'takeout.zip');
    const imported = await fetch(base + '/import/google-takeout', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
    assert.equal(imported.status, 200, await imported.clone().text());
    assert.equal((await api('/labels', { token })).find(l => l.name === 'Imported label').color, '#00897b');
    socket.terminate(); socket = null;
    await stop(); await start();
    assert.equal((await api('/labels', { token })).find(l => l.id === label.id).color, '#d81b60');
    await api(`/labels/${label.id}`, { token, method: 'DELETE', expected: 204 });
    assert.equal((await api(`/notes/${note.id}`, { token })).labels.length, 0);
  } finally {
    socket?.terminate();
    if (child && child.exitCode === null && child.signalCode === null) await stop();
    await fs.rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
