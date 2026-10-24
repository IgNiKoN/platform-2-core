/// <reference types="node" />
/** P2-0021 этап 2: красные точки меню из pf_my_inbox — «Факт» = ждёт подтверждения + мои отклонённые, «КС-2» = черновики,
 *  «Входящие» и пункт модуля = сумма; «не выставлено» и «стоят» в точки не идут; обновление при заходе в маршрут, при возврате
 *  на вкладку и после своего действия (решение РП); выход — точки убраны; ошибка сервера — прежние числа. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { settle } from '../../../test-utils/settle.ts';
import { makeFakeSummary, PTO_PROJECT } from './summary-fake.ts';
import type { InboxRow } from '../summary/summary.service.ts';
import type { AuthApi } from '../../../platform/auth/auth.service.ts';

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
const { createElement } = await import('react');
const { flushSync } = await import('react-dom');
const { createRoot } = await import('react-dom/client');
const { PlanfactApp, ROUTE_EVENT } = await import('../PlanfactApp.ts');
const { inboxBadges, rowTasks, withInboxRefresh, INBOX_CHANGED_EVENT } = await import('../inbox/inbox.ts');
const tick = (): Promise<void> => settle();
const last = <T>(a: T[]): T => a[a.length - 1];
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

const row = (o: Partial<InboxRow>): InboxRow => ({ project_id: 'p', name: 'ЖК', code: null, pending: null, my_rejected: null, ks2_drafts: null,
  ks2_gap: null, ks2_gap_money: null, stale: null, stale_days: null, ...o });

test('inboxBadges: только «дела», сумма по объектам; null и 0 — не считаются', () => {
  const rows = [row({ project_id: 'a', pending: 8, my_rejected: 2, ks2_drafts: 1, ks2_gap: 12, stale: 30, stale_days: 14 }),
    row({ project_id: 'b', pending: 0, my_rejected: null, ks2_drafts: 3, ks2_gap: 5 })];
  assert.deepEqual(inboxBadges(rows), { '#/planfact/fact': 10, '#/planfact/ks2': 4, '#/planfact/inbox': 14, 'module:planfact': 14 });
  assert.equal(rowTasks(rows[0]), 11);
  assert.deepEqual(inboxBadges([]), { '#/planfact/fact': 0, '#/planfact/ks2': 0, '#/planfact/inbox': 0, 'module:planfact': 0 });
});

test('withInboxRefresh: событие только после успешного действия из списка', async () => {
  let n = 0; const on = (): void => { n++; };
  win.addEventListener(INBOX_CHANGED_EVENT, on);
  const api = withInboxRefresh({ async decide(ok: boolean) { return ok ? { ok: true } : { ok: false, message: 'нет' }; }, async read() { return { ok: true }; } }, ['decide'])!;
  await api.decide(true); await api.decide(false); await api.read();
  win.removeEventListener(INBOX_CHANGED_EVENT, on);
  assert.equal(n, 1);
  assert.equal(withInboxRefresh(null, []), null);
});

function auth(signed = { v: true }): AuthApi {
  return { async signIn() { return { ok: true }; }, async signOut() { signed.v = false; }, async getEmail() { return signed.v ? 'pm@demo.invalid' : null; },
    async getAccess() { return [{ company: 'Демо-компания', role: 'Руководитель проекта', projectId: null }]; } };
}
const projects = (): N => ({ async myAccess() { return [{ company_id: 'c1', company_name: 'Демо-компания', can_manage_projects: false, can_manage_units: false, can_manage_roles: false }]; } });

function mount(inbox: InboxRow[] | string, a: AuthApi = auth(), comp: N = projects()): { el: N; calls: string[]; badges: (Record<string, number> | null)[]; set: (r: InboxRow[] | string) => void } {
  const badges: (Record<string, number> | null)[] = [];
  (win as N).RBI = { services: { shell: { setNavBadges: (scope: string, map: Record<string, number> | null) => { if (scope === 'planfact') badges.push(map); } } } };
  win.location.hash = '#/planfact';
  const el = win.document.createElement('div'); win.document.body.appendChild(el);
  let cur: InboxRow[] | string = inbox;
  const fake = makeFakeSummary([{ ...PTO_PROJECT }]);
  const api = { ...fake.api, inbox: async () => { fake.calls.push('inbox'); return typeof cur === 'string' ? { ok: false as const, message: cur } : { ok: true as const, value: cur.map((r) => ({ ...r })) }; } };
  flushSync(() => createRoot(el as unknown as HTMLElement).render(createElement(PlanfactApp, { auth: a, data: { works: [] } as N, projects: comp, summary: api } as N)));
  return { el, calls: fake.calls, badges, set: (r) => { cur = r; } };
}

test('вход: числа из pf_my_inbox в меню; после решения РП (событие модуля) и при заходе в маршрут — перечитываются', async () => {
  const m = mount([row({ pending: 2, my_rejected: 1, ks2_drafts: 1, ks2_gap: 40, stale: 9 })]); await tick();
  assert.deepEqual(last(m.badges), { '#/planfact/fact': 3, '#/planfact/ks2': 1, '#/planfact/inbox': 4, 'module:planfact': 4 });
  const before = m.calls.filter((c) => c === 'inbox').length;
  m.set([row({ pending: 1, my_rejected: 1, ks2_drafts: 1, ks2_gap: 40, stale: 9 })]);
  win.dispatchEvent(new win.Event(INBOX_CHANGED_EVENT)); await tick();
  assert.equal(last(m.badges)!['#/planfact/fact'], 2, 'после решения РП — меньше');
  win.dispatchEvent(new win.Event(ROUTE_EVENT)); await tick();
  assert.equal(m.calls.filter((c) => c === 'inbox').length, before + 2, 'заход в маршрут — ещё один запрос');
  // ошибка сервера — прежние числа остаются (новых не ставим)
  const k = m.badges.length;
  m.set('Нет связи'); win.dispatchEvent(new win.Event(INBOX_CHANGED_EVENT)); await tick();
  assert.equal(m.badges.length, k);
});

test('возврат на вкладку браузера — перечитать', async () => {
  const m = mount([row({ ks2_drafts: 2 })]); await tick();
  const before = m.calls.filter((c) => c === 'inbox').length;
  win.document.dispatchEvent(new win.Event('visibilitychange')); await tick();
  assert.equal(m.calls.filter((c) => c === 'inbox').length, before + 1);
});

test('без доступа к компании — точек нет и запроса нет; выход — точки убраны', async () => {
  const none = mount([row({ pending: 5 })], auth(), { async myAccess() { return []; } }); await tick();
  assert.ok(!none.calls.includes('inbox'));
  assert.equal(last(none.badges), null);
  const signed = { v: true };
  const m = mount([row({ pending: 5 })], auth(signed)); await tick();
  assert.equal(last(m.badges)!['module:planfact'], 5);
  (m.el.querySelector('.pf-bar button') as N).click(); await tick();
  assert.equal(last(m.badges), null, 'после «Выйти» — setNavBadges(planfact, null)');
});
