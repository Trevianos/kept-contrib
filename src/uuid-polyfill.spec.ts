import { installRandomUUID } from './uuid-polyfill';
import { OfflineStoreService } from './app/services/offline-store.service';
import { NoteI } from './app/interfaces/notes';

describe('HTTP UUID compatibility', () => {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  it('uses secure random bytes and sets UUID version and variant', () => {
    const getRandomValues = jasmine.createSpy().and.callFake((bytes: Uint8Array) => bytes.fill(255));
    const target = { getRandomValues } as unknown as Crypto;
    installRandomUUID(target);
    expect(target.randomUUID()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
    expect(getRandomValues).toHaveBeenCalled();
  });

  it('preserves native HTTPS UUID generation and is idempotent', () => {
    const native = crypto.randomUUID;
    installRandomUUID();
    expect(crypto.randomUUID).toBe(native);
    const target = { getRandomValues: crypto.getRandomValues.bind(crypto) } as Crypto;
    installRandomUUID(target);
    const fallback = target.randomUUID;
    installRandomUUID(target);
    expect(target.randomUUID).toBe(fallback);
    const values = new Set(Array.from({ length: 1000 }, () => target.randomUUID()));
    expect(values.size).toBe(1000);
    expect([...values].every(value => uuid.test(value))).toBeTrue();
  });

  it('does not introduce an insecure random source when Crypto is absent', () => {
    expect(() => installRandomUUID(null!)).not.toThrow();
    const target = {} as Crypto;
    installRandomUUID(target);
    expect(target.randomUUID).toBeUndefined();
  });

  it('saves a Czech note and sync outbox with native randomUUID unavailable', async () => {
    const original = Object.getOwnPropertyDescriptor(crypto, 'randomUUID');
    const deviceKey = 'kept_offline_device_id';
    const device = localStorage.getItem(deviceKey);
    const store = new OfflineStoreService();
    const partition = `uuid-test-${Date.now()}`;
    try {
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, writable: true, configurable: true });
      localStorage.removeItem(deviceKey);
      installRandomUUID();
      const note: NoteI = { id: -1, noteTitle: 'Příliš žluťoučký kůň', noteBody: 'Úkoly: čaj, řepa, ů, ď, ť', pinned: false, bgColor: '', bgImage: '', isCbox: false, labels: [], archived: false, trashed: false };
      const identity = store.ensureNoteIdentity(note);
      const stamp = store.nextStamp();
      await store.putNote(partition, note);
      await store.enqueue(partition, 'note.upsert', identity, note, stamp);
      expect((await store.listNotes(partition))[0].noteTitle).toBe(note.noteTitle);
      const pending = await store.listOutbox(partition);
      expect(pending.length).toBe(1);
      expect(pending[0].operationId).toMatch(uuid);
      expect(stamp.deviceId).toMatch(uuid);
      expect(identity).toMatch(/^note-[0-9a-f-]{36}$/);
    } finally {
      if (original) Object.defineProperty(crypto, 'randomUUID', original);
      else delete (crypto as Partial<Crypto>).randomUUID;
      if (device === null) localStorage.removeItem(deviceKey);
      else localStorage.setItem(deviceKey, device);
      await store.purgePartition(partition);
      (await (store as any).database)?.close();
    }
  });
});
