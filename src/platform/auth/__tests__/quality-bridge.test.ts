/// <reference types="node" />
/** P2-0016 этапы 3–4: мост Качества при входе почтой — цель синхронизации всегда раздел quality с компанией,
 *  объект из ядра, роль из прав компании, локальное состояние компаний не смешивается. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyQualityBridge, companyConflict, qualityCompanyFor, roleFor, switchDeviceCompany, QUALITY_COMPANY_KEY } from '../quality-bridge.ts';
import type { PlatformState } from '../platform.service.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
const A = '0f0e0d0c-0b0a-4908-8706-0504030201aa', B = '0f0e0d0c-0b0a-4908-8706-0504030201bb';
const P1 = '11111111-1111-4111-8111-111111111111', P2 = '22222222-2222-4222-8222-222222222222';

function memStore(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return { m, getItem: (k: string) => (m.has(k) ? m.get(k)! : null), setItem: (k: string, v: string) => { m.set(k, String(v)); }, removeItem: (k: string) => { m.delete(k); } };
}
const st = (over: Partial<PlatformState> = {}): PlatformState => ({
  mode: 'email', email: 'tn@alfa.test', isPlatformAdmin: false, companyId: A,
  companies: [{ id: A, name: 'Альфа', is_test: true, roles: [], modules: ['planfact', 'quality'], can_manage_company: false },
              { id: B, name: 'Бета', is_test: true, roles: [], modules: ['planfact'], can_manage_company: false }], ...over
});

test('компания Качества: только вход почтой и модуль quality/construction у текущей компании', () => {
  assert.equal(qualityCompanyFor(st()), A);
  assert.equal(qualityCompanyFor(st({ companyId: B })), null, 'у Беты модуля нет');
  assert.equal(qualityCompanyFor(st({ mode: 'demo' })), null);
  assert.equal(qualityCompanyFor(st({ mode: 'pin' })), null);
  assert.equal(qualityCompanyFor(st({ mode: 'none', companyId: null })), null);
});

test('роль экрана Качества — из действий компании', () => {
  assert.equal(roleFor(['quality.view', 'quality.edit', 'quality.manage'], ['company_admin']), 'manager');
  assert.equal(roleFor(['quality.view', 'quality.edit', 'construction.view'], ['qc_engineer']), 'engineer');
  assert.equal(roleFor(['quality.view', 'construction.view', 'construction.edit'], ['contractor_rep']), 'contractor');
  assert.equal(roleFor(['quality.view', 'construction.view', 'construction.edit'], ['foreman']), 'director');
  assert.equal(roleFor(['quality.view'], ['customer']), 'director');
  assert.equal(roleFor([], ['economist']), 'guest');
});

test('смена компании на устройстве: состояние синхронизации откладывается и возвращается, ключи не смешиваются', () => {
  const s = memStore({ rbi_sync_config: '{"projectCode":"A-obj"}', rbi_sync_last_pull_at: 't-A', rbi_theme_preference: 'dark' });
  s.setItem(QUALITY_COMPANY_KEY, A);
  assert.equal(switchDeviceCompany(s, A), false, 'та же компания — без перезагрузки');
  assert.equal(switchDeviceCompany(s, B), true);
  assert.equal(s.getItem(QUALITY_COMPANY_KEY), B);
  assert.equal(s.getItem('rbi_sync_config'), null, 'у Беты своё (пустое) состояние');
  assert.equal(s.getItem('rbi_theme_preference'), 'dark', 'общие настройки устройства не трогаются');
  s.setItem('rbi_sync_last_pull_at', 't-B');
  assert.equal(switchDeviceCompany(s, null), true, 'выход — без компании');
  assert.equal(s.getItem(QUALITY_COMPANY_KEY), null);
  assert.equal(s.getItem('rbi_sync_last_pull_at'), null);
  switchDeviceCompany(s, A);
  assert.equal(s.getItem('rbi_sync_config'), '{"projectCode":"A-obj"}');
  assert.equal(s.getItem('rbi_sync_last_pull_at'), 't-A');
  switchDeviceCompany(s, B);
  assert.equal(s.getItem('rbi_sync_last_pull_at'), 't-B');
});

function deps(over: N = {}) {
  const created: N[] = [];
  const rpcCalls: N[] = [];
  const platformAuth = { getSession: async () => ({ data: { session: { access_token: 'TOKEN-1' } } }), getUser: async () => ({}) };
  const win: N = { appSettings: {}, syncConfig: { enabled: false }, RBI: {}, initSync: async () => { win.inits = (win.inits || 0) + 1; } };
  const store = memStore({ [QUALITY_COMPANY_KEY]: A });
  let reloads = 0;
  const d: N = {
    win, store, reload: () => { reloads++; },
    platformClient: { auth: platformAuth },
    cfg: { url: 'https://srv', anonKey: 'anon' },
    createClient: (url: string, key: string, opts: N) => {
      const c = { url, key, opts, from: (t: string) => ({ table: t, schema: opts.db.schema }),
        rpc: async (fn: string, args: N) => { rpcCalls.push({ fn, args }); return { data: over.access || { actions: ['quality.view', 'quality.edit'], templates: ['qc_engineer'] }, error: null }; } };
      created.push(c); return c;
    },
    listProjects: async () => over.projects || [{ id: P1, name: 'Спутник' }],
    ...over.deps
  };
  return { d, win, store, created, rpcCalls, reloads: () => reloads };
}

test('мост: клиент синхронизации — раздел quality, заголовок компании, токен платформы; .auth — Auth платформы', async () => {
  const { d, win, created } = deps();
  const sync = await applyQualityBridge(st(), d);
  assert.ok(sync);
  assert.equal(created.length, 1);
  const o = created[0].opts;
  assert.equal(o.db.schema, 'quality');
  assert.deepEqual(o.global.headers, { 'x-company-id': A });
  assert.equal(await o.accessToken(), 'TOKEN-1');
  assert.equal(win.supabaseClient.from('rbi_inspections').schema, 'quality', 'любая таблица — в quality, не в public');
  assert.equal(win.supabaseClient.auth, d.platformClient.auth);
});

test('мост: один объект — выбран сам; код проекта = id объекта ядра, имя инженера = почта, PIN нет; роль из прав', async () => {
  const { d, win, store, rpcCalls } = deps();
  const sync = await applyQualityBridge(st(), d);
  assert.equal(sync!.projectId, P1);
  assert.equal(win.syncConfig.enabled, true);
  assert.equal(win.syncConfig.projectCode, P1);
  assert.equal(win.syncConfig.engineerName, 'tn@alfa.test');
  assert.equal(win.syncConfig.pinHash, null);
  assert.equal(JSON.parse(store.getItem('rbi_sync_config')!).projectCode, P1);
  assert.deepEqual(rpcCalls[0], { fn: 'my_access', args: { p_project: P1 } });
  assert.equal(win.appSettings.userRole, 'engineer');
  assert.equal(win.appSettings.cloudStatus, 'approved');
  assert.equal(win.inits, 1);
});

test('мост: несколько объектов — синхронизация ждёт выбора; выбор чужого id игнорируется; выбор своего — через прежнее подключение без PIN', async () => {
  const { d, win } = deps({ projects: [{ id: P1, name: 'Спутник' }, { id: P2, name: 'Второй' }] });
  const calls: N[] = [];
  win.applySyncConnect = async (name: string, code: string, pin: N) => { calls.push([name, code, pin]); };
  const sync = await applyQualityBridge(st(), d);
  assert.equal(sync!.projectId, null);
  assert.equal(win.syncConfig.enabled, false);
  await sync!.selectProject('чужой');
  assert.deepEqual(calls, []);
  await sync!.selectProject(P2);
  assert.deepEqual(calls, [['tn@alfa.test', P2, null]]);
  assert.equal(d.store.getItem('platform2_quality_project_' + A), P2);
});

test('мост: смена компании / выход — перезагрузка (своя база компании); вход без модуля — Качества нет', async () => {
  const x = deps();
  assert.equal(await applyQualityBridge(st({ companyId: B }), x.d), null);
  assert.equal(x.reloads(), 1, 'Бета без модуля: база устройства — общая, перезагрузка');
  const y = deps();
  assert.equal(await applyQualityBridge({ ...st(), mode: 'none', email: null, companies: [], companyId: null }, y.d), null);
  assert.equal(y.reloads(), 1, 'выход: данные компании не остаются открытыми');
  const z = deps();
  z.store.removeItem(QUALITY_COMPANY_KEY);
  assert.equal(await applyQualityBridge({ ...st(), mode: 'demo', email: null, companies: [], companyId: null }, z.d), null);
  assert.equal(z.reloads(), 0, 'демо без прежней компании — без перезагрузки');
  assert.equal(z.created.length, 0, 'клиент хранилища не создаётся');
});

// --- этап 5: файлы компании ---
import { companyStorage, companyPath, companyBucket } from '../quality-bridge.ts';

test('файлы: бакет РБИ → закрытый бакет компании, путь всегда с id компании (без удвоения)', async () => {
  assert.equal(companyBucket('inspection-photos'), 'quality-inspection-photos');
  assert.equal(companyBucket('quality-reports'), 'quality-reports');
  assert.equal(companyPath(A, 'P/inspection/1/a.jpg'), A + '/P/inspection/1/a.jpg');
  assert.equal(companyPath(A, A + '/x.jpg'), A + '/x.jpg');
  assert.equal(companyPath(A, '/x.jpg'), A + '/x.jpg');
  const calls: N[] = [];
  const raw = { from: (b: string) => {
    const api: N = { bucket: b };
    for (const m of ['upload', 'getPublicUrl', 'list', 'remove', 'move', 'download', 'createSignedUrls']) api[m] = function (this: N, ...args: N[]) { calls.push([this.bucket, m, args]); return m; };
    return api;
  } };
  const st = companyStorage(raw as N, A);
  st.from('inspection-photos').upload('P/1.jpg', 'BLOB', { upsert: true });
  st.from('reports').getPublicUrl('r1.pdf');
  st.from('inspection-photos').list('P', { search: 'x' });
  st.from('inspection-photos').remove(['P/1.jpg', A + '/P/2.jpg']);
  st.from('library-docs').move('a', 'b');
  assert.deepEqual(calls, [
    ['quality-inspection-photos', 'upload', [A + '/P/1.jpg', 'BLOB', { upsert: true }]],
    ['quality-reports', 'getPublicUrl', [A + '/r1.pdf']],
    ['quality-inspection-photos', 'list', [A + '/P', { search: 'x' }]],
    ['quality-inspection-photos', 'remove', [[A + '/P/1.jpg', A + '/P/2.jpg']]],
    ['quality-library-docs', 'move', [A + '/a', A + '/b']]
  ]);
});

test('файлы: клиент моста отдаёт обёрнутый Storage; токен — кэшу приложения (сразу и по запросу)', async () => {
  const { d, win } = deps();
  const posted: N[] = [];
  let onMsg: ((e: N) => void) | null = null;
  d.serviceWorker = { controller: { postMessage: (m: N) => posted.push(m) }, addEventListener: (_t: string, cb: N) => { onMsg = cb; } };
  d.platformClient.auth.onAuthStateChange = () => ({ data: { subscription: { unsubscribe() {} } } });
  d.createClient = (url: string, key: string, opts: N) => ({ opts, rpc: async () => ({ data: {}, error: null }),
    storage: { from: (b: string) => ({ getPublicUrl: (p: string) => ({ data: { publicUrl: `${url}/storage/v1/object/public/${b}/${p}` } }) }) } });
  await applyQualityBridge(st(), d);
  assert.equal(win.supabaseClient.storage.from('inspection-photos').getPublicUrl('P/a.jpg').data.publicUrl,
    `https://srv/storage/v1/object/public/quality-inspection-photos/${A}/P/a.jpg`);
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(posted, [{ type: 'P2_STORAGE_TOKEN', token: 'TOKEN-1' }]);
  onMsg!({ data: { type: 'P2_STORAGE_TOKEN_REQUEST' } });
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(posted.length, 2);
});

test('ключи по компании (021): цель upsert старого клиента дополняется core_company_id, прочее — без изменений', async () => {
  assert.equal(companyConflict('id'), 'core_company_id,id');
  assert.equal(companyConflict('project_code, raw_name'), 'core_company_id,project_code,raw_name');
  assert.equal(companyConflict('core_company_id,id'), 'core_company_id,id');
  assert.equal(companyConflict(undefined), undefined);
  const { d, win } = deps();
  const calls: N[] = [];
  d.createClient = (_u: string, _k: string, opts: N) => ({ opts, rpc: async () => ({ data: {}, error: null }), storage: { from: () => ({}) },
    from: (t: string) => ({ t, schema: 'quality', upsert: (v: N, o: N) => { calls.push({ t, v, o }); return 'q'; }, select: () => 'sel' }) });
  await applyQualityBridge(st(), d);
  assert.equal(win.supabaseClient.from('rbi_inspections').upsert([{ id: 'x' }], { onConflict: 'id', ignoreDuplicates: false }), 'q');
  win.supabaseClient.from('project_settings').upsert({ project_code: P1 }, { onConflict: 'project_code' });
  win.supabaseClient.from('rbi_tasks').upsert([{ id: 'y' }]);
  assert.deepEqual(calls.map((c) => [c.t, c.o]), [['rbi_inspections', { onConflict: 'core_company_id,id', ignoreDuplicates: false }],
    ['project_settings', { onConflict: 'core_company_id,project_code' }], ['rbi_tasks', undefined]]);
  assert.equal(win.supabaseClient.from('rbi_tasks').select(), 'sel');
});
