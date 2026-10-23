/// <reference types="node" />
/** P2-0016 этап 5: кэш приложения (sw.js) — закрытые файлы компаний берёт с входом вошедшего; остальное не трогает. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSw } from './sw-harness.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
const SRV = 'https://api.rbi-q.ru';

function setup() {
  const sw = loadSw([]);
  const fetched: N[] = [];
  sw.ctx.fetch = async (url: string, init: N) => { fetched.push({ url, init }); return { ok: true, status: 200, from: 'net' }; };
  sw.ctx.self.clients.matchAll = async () => [];
  sw.ctx.setTimeout = setTimeout;
  const fire = (url: string): Promise<N> | null => {
    let p: Promise<N> | null = null;
    sw.handlers.fetch({ request: { url, method: 'GET' }, respondWith: (x: Promise<N>) => { p = x; }, waitUntil: () => {} });
    return p;
  };
  return { sw, fetched, fire };
}

test('файл компании: …/public/quality-… → …/authenticated/… с токеном вошедшего', async () => {
  const { sw, fetched, fire } = setup();
  await sw.message({ type: 'P2_STORAGE_TOKEN', token: 'TOK' });
  const res = await fire(`${SRV}/storage/v1/object/public/quality-inspection-photos/c1/P/a.jpg`);
  assert.equal(res.from, 'net');
  assert.equal(fetched[0].url, `${SRV}/storage/v1/object/authenticated/quality-inspection-photos/c1/P/a.jpg`);
  assert.equal(fetched[0].init.headers.Authorization, 'Bearer TOK');
});

test('файлы РБИ (публичные бакеты) и чужие серверы — без вмешательства, токен не уходит', () => {
  const { sw, fetched, fire } = setup();
  void sw.message({ type: 'P2_STORAGE_TOKEN', token: 'TOK' });
  assert.equal(fire(`${SRV}/storage/v1/object/public/inspection-photos/P/a.jpg`), null);
  assert.equal(fire(`https://evil.example/storage/v1/object/public/quality-inspection-photos/c1/a.jpg`), null);
  assert.equal(fetched.filter((f) => f.init && f.init.headers && f.init.headers.Authorization).length, 0);
});

test('выход: токен сброшен — запрос без входа (сервер откажет); нет сети — из офлайн-кэша', async () => {
  const { sw, fetched, fire } = setup();
  await sw.message({ type: 'P2_STORAGE_TOKEN', token: null });
  sw.ctx.caches.match = async () => ({ ok: true, from: 'cache' });
  sw.ctx.fetch = async (url: string, init: N) => { fetched.push({ url, init }); throw new Error('offline'); };
  const res = await fire(`${SRV}/storage/v1/object/public/quality-reports/c1/r.pdf`);
  assert.equal(res.from, 'cache');
  assert.equal(JSON.stringify(fetched[0].init.headers), '{}');
});
