const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const AdmZip = require('adm-zip');
const { WebSocket } = require('ws');

test('ZIP compatibility fallback bounds inflated data', async () => {
  // Run the production reader with small caps and force the compatibility path.
  // This avoids creating a hundreds-of-MB ZIP bomb in the regression suite.
  const source = await fs.readFile(path.join(__dirname, 'server.js'), 'utf8');
  const reader = source.slice(source.indexOf('async function readZipEntries('), source.indexOf("app.post('/api/import/google-takeout'"));
  const context = {
    require: name => { if (name === 'adm-zip') throw new Error('compatibility fixture'); return require(name); },
    Buffer, console, TAKEOUT_MAX_ENTRIES: 10, TAKEOUT_MAX_PER_ENTRY_BYTES: 1024,
    TAKEOUT_MAX_TOTAL_BYTES: 2048, normalizeZipEntryName: name => name,
    isUnsafeZipPath: () => false, formatBytes: String
  };
  const read = vm.runInNewContext(`${reader}; readZipEntries`, context);
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'kept-zip-'));
  try {
    const compatible = new AdmZip();
    compatible.addFile('regular.json', Buffer.from('České poznámky'));
    const compatibleFile = path.join(dir, 'compatible.zip');
    await fs.writeFile(compatibleFile, compatible.toBuffer());
    assert.equal((await (await read(compatibleFile))[0].getData()).toString(), 'České poznámky');

    const cumulative = new AdmZip();
    for (let i = 0; i < 4; i++) cumulative.addFile(`${i}.json`, Buffer.alloc(600, 65));
    const cumulativeFile = path.join(dir, 'cumulative.zip');
    await fs.writeFile(cumulativeFile, cumulative.toBuffer());
    const cumulativeEntries = await read(cumulativeFile);
    for (let i = 0; i < 3; i++) assert.equal((await cumulativeEntries[i].getData()).length, 600);
    await assert.rejects(cumulativeEntries[3].getData(), /too large/);

    const zip = new AdmZip();
    zip.addFile('note.json', Buffer.alloc(4096, 65));
    const bytes = zip.toBuffer();
    // Lie in both headers so only the streaming output cap can stop the bomb.
    bytes.writeUInt32LE(1, bytes.indexOf(Buffer.from('PK\x03\x04')) + 22);
    bytes.writeUInt32LE(1, bytes.indexOf(Buffer.from('PK\x01\x02')) + 24);
    const file = path.join(dir, 'bomb.zip');
    await fs.writeFile(file, bytes);
    const entries = await read(file);
    await assert.rejects(entries[0].getData(), /zip bomb/);
  } finally {
    await fs.rm(dir, { recursive: true, force: true, maxRetries: 5 });
  }
});

test('runtime: ZIP import, multipart handling, WebSockets and user isolation', { timeout: 60_000 }, async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'kept-security-'));
  const port = 32000 + Math.floor(Math.random() * 3000);
  const base = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server/server.js'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: String(port), DATA_DIR: dir, SQLITE_PATH: path.join(dir, 'kept.sqlite'),
      UPLOAD_DIR: path.join(dir, 'uploads'), ATTACHMENT_DIR: path.join(dir, 'attachments'),
      TAKEOUT_TMP_DIR: path.join(dir, 'imports'), BASE_URL: base },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  const sockets = [];
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const api = async (route, { token, method = 'GET', body, expected = 200 } = {}) => {
    const response = await fetch(`${base}/api${route}`, {
      method, headers: { ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'content-type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
    const payload = await response.json();
    assert.equal(response.status, expected, `${route}: ${JSON.stringify(payload)}`);
    return payload;
  };
  const upload = async (bytes, token) => {
    const body = new FormData();
    body.append('takeout', new Blob([bytes], { type: 'application/zip' }), 'takeout.zip');
    return fetch(`${base}/api/import/google-takeout`, { method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {}, body });
  };
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(output);
      try { if ((await fetch(`${base}/api/setup/status`)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, output);
    const credentials = { username: 'security-admin', password: 'isolated-test-password' };
    await api('/setup/admin', { method: 'POST', body: credentials, expected: 201 });
    const admin = await api('/auth/login', { method: 'POST', body: credentials });
    const regular = { username: 'security-user', password: 'isolated-user-password' };
    await api('/users', { token: admin.token, method: 'POST', body: regular, expected: 201 });
    const user = await api('/auth/login', { method: 'POST', body: regular });
    await api('/users', { token: user.token, expected: 403 });
    await api('/users', { token: user.token, method: 'POST', body: { username: 'forbidden' }, expected: 403 });

    const zip = new AdmZip();
    zip.addFile('Takeout/Keep/note.json', Buffer.from(JSON.stringify({ title: 'Příliš žluťoučký kůň', textContent: 'Čaj, řepa, ů, ď, ť', isPinned: true, createdTimestampUsec: 1700000000000000 })));
    const bytes = zip.toBuffer();
    assert.equal((await upload(bytes)).status, 401);
    const imported = await upload(bytes, admin.token);
    assert.equal(imported.status, 200, await imported.clone().text());
    const importResult = await imported.json();
    assert.equal(importResult.imported, 1, `${JSON.stringify(importResult)}\n${output}`);
    const notes = await api('/notes', { token: admin.token });
    const note = notes.find(n => n.noteTitle === 'Příliš žluťoučký kůň');
    assert.ok(note);
    assert.match(note.noteBody, /Čaj, řepa, ů, ď, ť/);
    assert.equal(Boolean(note.pinned), true);
    await api(`/notes/${note.id}`, { token: user.token, expected: 404 });
    assert.equal((await (await upload(bytes, admin.token)).json()).deduped, 1);

    const huge = Buffer.from(bytes);
    huge.writeUInt32LE(0x7fffffff, huge.indexOf(Buffer.from('PK\x01\x02')) + 24);
    const rejected = await upload(huge, admin.token);
    assert.equal(rejected.status, 200); // Existing API reports per-note read errors.
    assert.equal((await rejected.json()).errors, 1);

    const duplicates = new AdmZip();
    duplicates.addFile('Takeout/Keep/a.json', Buffer.from('{}'));
    duplicates.addFile('Takeout/Keep/b.json', Buffer.from('{}'));
    const repeated = Buffer.from(duplicates.toBuffer().toString('hex').replaceAll(Buffer.from('b.json').toString('hex'), Buffer.from('a.json').toString('hex')), 'hex');
    const duplicateResponse = await upload(repeated, admin.token);
    assert.equal(duplicateResponse.status, 400);
    assert.match((await duplicateResponse.json()).error, /duplicate/);

    const form = new FormData();
    form.append('a[999999999999999999999999999]', 'x');
    form.append('image', new Blob([Buffer.from('x')], { type: 'image/png' }), 'image.png');
    const malformed = await fetch(`${base}/api/uploads/images`, { method: 'POST', headers: { authorization: `Bearer ${admin.token}` }, body: form });
    // The patched parser safely treats the oversized index as an ordinary
    // unused field; the legitimate image upload must retain its API contract.
    assert.equal(malformed.status, 201, `multipart status ${malformed.status}`);
    assert.match((await malformed.json()).url, /uploads/);
    await api('/setup/status');

    const unauthenticated = new WebSocket(`${base.replace('http:', 'ws:')}/api/realtime`);
    sockets.push(unauthenticated);
    const closed = once(unauthenticated, 'close');
    assert.equal((await closed)[0], 1008);
    const socket = new WebSocket(`${base.replace('http:', 'ws:')}/api/realtime?token=${admin.token}`);
    sockets.push(socket);
    const message = once(socket, 'message');
    assert.equal(JSON.parse((await message)[0]).type, 'ready');
    // Exercise normal fragmented client messages after the ws DoS fix.
    socket.send('{"type":"leave-', { fin: false });
    socket.send('note","noteId":0}', { fin: true });
    const pong = once(socket, 'pong');
    socket.ping('healthy');
    assert.equal((await pong)[0].toString(), 'healthy');
  } finally {
    for (const socket of sockets) socket.terminate();
    if (child.exitCode === null && child.signalCode === null) {
      const stopped = once(child, 'close'); child.kill(); await stopped;
    }
    await fs.rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
