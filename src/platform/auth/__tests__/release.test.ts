/// <reference types="node" />
/** P2-0013 этап 6: один переключатель «разработка / выпуск» (js/services/config.service.js) — облако Quality, локальная база, кэш приложения. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { loadSw } from './sw-harness.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
const CONFIG = readFileSync(new URL('../../../../js/services/config.service.js', import.meta.url), 'utf8');
const config = (build: string): N => { const ctx: N = { self: {} }; runInNewContext(CONFIG.replace("var APP_BUILD = 'dev';", `var APP_BUILD = '${build}';`), ctx); return ctx.self.APP_CONFIG; };

test('в репозитории всегда «разработка» (GitHub Pages): облако Quality выключено, база PLATFORM2_DB, кэш platform2-', () => {
  assert.match(CONFIG, /var APP_BUILD = 'dev';/);
  const c = config('dev');
  assert.equal(c.SUPABASE_URL, ''); assert.equal(c.SUPABASE_KEY, '');
  assert.equal(c.LOCAL_DB_NAME, 'PLATFORM2_DB'); assert.equal(c.SW_CACHE_PREFIX, 'platform2-');
  assert.ok(c.P2_SUPABASE_URL && c.P2_SUPABASE_ANON_KEY, 'вход Platform 2.0 работает в обеих сборках');
});

test('«выпуск»: облако Quality включено (тот же сервер и ключ), база RBI_QUALITY_DB — черновики людей на месте, кэш rbi-quality-', () => {
  const c = config('release');
  assert.equal(c.SUPABASE_URL, c.P2_SUPABASE_URL); assert.equal(c.SUPABASE_KEY, c.P2_SUPABASE_ANON_KEY);
  assert.equal(c.LOCAL_DB_NAME, 'RBI_QUALITY_DB'); assert.equal(c.SW_CACHE_PREFIX, 'rbi-quality-');
});

test('локальная база берёт имя из переключателя', () => {
  const src = readFileSync(new URL('../../../../js/services/storage/storage-db.core.js', import.meta.url), 'utf8');
  assert.match(src, /const DB_NAME = \(window\.APP_CONFIG && window\.APP_CONFIG\.LOCAL_DB_NAME\) \|\| 'PLATFORM2_DB';/);
});

async function activate(sw: N, names: string[]): Promise<string[]> {
  const left = new Set(names);
  sw.ctx.caches.keys = async () => [...left];
  sw.ctx.caches.delete = async (n: string) => left.delete(n);
  let p: Promise<unknown> = Promise.resolve();
  sw.handlers.activate({ waitUntil: (x: Promise<unknown>) => { p = x; } });
  await p;
  return [...left];
}

test('кэш приложения: «выпуск» заменяет старые кэши rbi-quality-*; «разработка» их не трогает (общий адрес со старым приложением)', async () => {
  const rel = loadSw([], 'release');
  assert.ok(rel.ctx.self.__cacheName.startsWith('rbi-quality-v'));
  assert.deepEqual(await activate(rel, ['rbi-quality-v18.59.59', rel.ctx.self.__cacheName, 'other-app']), [rel.ctx.self.__cacheName, 'other-app']);
  const dev = loadSw([], 'dev');
  assert.ok(dev.ctx.self.__cacheName.startsWith('platform2-v'));
  assert.deepEqual(await activate(dev, ['rbi-quality-v18.59.59', 'platform2-v1', dev.ctx.self.__cacheName]), ['rbi-quality-v18.59.59', dev.ctx.self.__cacheName]);
});
