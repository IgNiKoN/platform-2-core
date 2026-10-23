/// <reference types="node" />
/** Экран «Факт → Шахматка» (P2-0017, этапы 2–4) на подставном сервере: сетка «этажи × секции», легенда, выбор ячейки,
 *  пустые состояния («нет работ», «не разнесено по этажам»), подвкладка в адресе. Наименования вымышленные. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { makeFakeFact } from './fact-fake.ts';
import type { FakePos } from './fact-fake.ts';
import { settle } from '../../../test-utils/settle.ts';

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
const { createElement } = await import('react');
const { flushSync } = await import('react-dom');
const { createRoot } = await import('react-dom/client');
const { FactTab } = await import('../fact/FactTab.ts');
const { canonicalHash, factSubFromHash } = await import('../PlanfactApp.ts');
const tick = (): Promise<void> => settle();
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

const loc = (id: string, parent: string | null, type: string, name: string, path: string, children: number) =>
  ({ id, parent_id: parent, node_type: type, name, sort_order: 1, area: null, depth: 1, path, child_count: children });
/** Корпус 1 → Секция 1, Секция 2 → эт. 1, эт. 2; квартиры только в путях позиций. */
const NODES: Record<string, any[]> = {
  root: [loc('b1', null, 'building', 'Корпус 1', 'Корпус 1', 2)],
  b1: [loc('s1', 'b1', 'section', 'Секция 1', 'Корпус 1 · Секция 1', 2), loc('s2', 'b1', 'section', 'Секция 2', 'Корпус 1 · Секция 2', 2)],
  s1: [loc('f11', 's1', 'floor', 'эт. 1', 'Корпус 1 · Секция 1 · эт. 1', 2), loc('f12', 's1', 'floor', 'эт. 2', 'Корпус 1 · Секция 1 · эт. 2', 0)],
  s2: [loc('f21', 's2', 'floor', 'эт. 1', 'Корпус 1 · Секция 2 · эт. 1', 0), loc('f22', 's2', 'floor', 'эт. 2', 'Корпус 1 · Секция 2 · эт. 2', 0)]
};
const POS: FakePos[] = [
  { id: 'pa1', ancestors: [], location_id: 'a1', location_path: 'Корпус 1 · Секция 1 · эт. 1 · кв. 1', location_type: 'apartment', work: 'Окраска стен', unit: 'м²', plan: 20 },
  { id: 'pa2', ancestors: [], location_id: 'a2', location_path: 'Корпус 1 · Секция 1 · эт. 1 · кв. 2', location_type: 'apartment', work: 'Окраска стен', unit: 'м²', plan: 20 },
  { id: 'pf12', ancestors: [], location_id: 'f12', location_path: 'Корпус 1 · Секция 1 · эт. 2', location_type: 'floor', work: 'Стяжка', unit: 'м²', plan: 100 },
  { id: 'pf21', ancestors: [], location_id: 'f21', location_path: 'Корпус 1 · Секция 2 · эт. 1', location_type: 'floor', work: 'Стяжка', unit: 'м²', plan: 50 },
  { id: 'pb', ancestors: [], location_id: 'b1', location_path: 'Корпус 1', location_type: 'building', work: 'Кровля', unit: 'м²', plan: 500 }];
const FOREMAN = ['planfact.fact.view', 'planfact.fact.create'];

function setup(pos = POS, nodes = NODES, perms = FOREMAN) {
  const f = makeFakeFact(pos);
  f.brigades.push({ id: 'b1', name: 'Иванов', leader_name: null, phone: null, archived_at: null, can_manage: true });
  const vor = { async listProjects() { return [{ id: 'pr1', name: 'ЖК Тест', company_id: 'c1' }]; }, async permissions() { return perms; } } as any;
  const projects = { async listLocations(_p: string, parent: string | null) { return nodes[parent || 'root'] || []; } } as any;
  return { ...f, vor, projects };
}
async function mount(s: any) {
  const el = win.document.createElement('div');
  win.document.body.appendChild(el);
  flushSync(() => createRoot(el as unknown as HTMLElement).render(createElement(FactTab, { api: s.api, vor: s.vor, projects: s.projects, me: 'foreman@test.invalid', mode: 'chessboard' } as N)));
  for (let i = 0; i < 6; i++) await tick();
  return el as N;
}
const cell = (el: N, row: string, col: string) => el.querySelector(`tr[data-row="${row}"] td[data-col="${col}"] [data-testid="p2-chess-cell"]`);

test('этажи × секции: строки сверху вниз, колонки — секции, «все виды» — X/Y, легенда и «не разнесено»', async () => {
  const s = setup();
  await s.api.add('pa1', { brigadeId: 'b1', date: '2026-10-20', qty: 20, workers: null, manHours: null, note: '' });
  const el = await mount(s);
  const grid = el.querySelector('[data-testid="cb-grid"]');
  assert.ok(grid, 'сетка есть');
  assert.deepEqual([...grid.querySelectorAll('tbody th')].map((t: N) => t.textContent), ['эт. 2', 'эт. 1']);
  assert.deepEqual([...grid.querySelectorAll('thead th')].map((t: N) => t.textContent), ['Этаж', 'Секция 1', 'Секция 2']);
  const c = cell(el, 'эт. 1', 's1');
  assert.equal(c.getAttribute('data-state'), 'progress');
  assert.match(c.textContent, /1\/2/);
  assert.equal(cell(el, 'эт. 2', 's2').getAttribute('data-state'), 'none', 'нет работ — пустая клетка');
  assert.ok(el.querySelector('[data-testid="p2-chess-scale"]'), 'легенда');
  assert.match(el.querySelector('[data-testid="cb-loose"]').textContent, /Не разнесено по этажам: 1/);
  assert.match(el.querySelector('[data-testid="cb-mode"]').textContent, /X из Y/);
});

test('один вид работ — % по объёму; нажатие на ячейку — сводка и подсветка строки и столбца', async () => {
  const s = setup();
  await s.api.add('pa1', { brigadeId: 'b1', date: '2026-10-20', qty: 10, workers: null, manHours: null, note: '' });
  const el = await mount(s);
  const sel = el.querySelector('[data-testid="cb-work"]');
  Object.getOwnPropertyDescriptor(win.HTMLSelectElement.prototype, 'value')!.set!.call(sel, 'wt');
  sel.dispatchEvent(new win.Event('change', { bubbles: true })); await tick();
  const c = cell(el, 'эт. 1', 's1');
  assert.match(c.textContent, /25 %/, '10 из 40 м²');
  assert.match(c.getAttribute('title'), /факт 10 из 40 м²/);
  c.click(); await tick();
  assert.match(el.querySelector('[data-testid="cb-info"]').textContent, /Остаток 30 м²/);
  assert.equal(el.querySelector('tr[data-row="эт. 1"] th').className, 'p2-chess__hot', 'строка подсвечена');
  assert.equal(el.querySelectorAll('thead th.p2-chess__hot').length, 1, 'столбец подсвечен');
  assert.match(cell(el, 'эт. 2', 's1').className, /p2-chess__cell--hot/);
});

test('пустые состояния: объект без работ; «Спутник» — позиции только на корпусе', async () => {
  const empty = await mount(setup([]));
  assert.match(empty.querySelector('[data-testid="cb-empty"]').textContent, /нет работ/);
  const flat = { root: [loc('b1', null, 'building', 'Корпус 1', 'Корпус 1', 0)] };
  const sp = await mount(setup([POS[4]], flat));
  assert.match(sp.querySelector('[data-testid="cb-empty"]').textContent, /не разнесены по этажам.*1/);
});

test('подвкладка «Шахматка» в адресе: #/planfact/fact/chessboard; неизвестная → «Ввод»', () => {
  assert.equal(factSubFromHash('#/planfact/fact/chessboard'), 'chessboard');
  assert.equal(factSubFromHash('#/planfact/fact'), 'entry');
  const all = { company: true, estimate: true, ks2: true, fact: true, brigades: true };
  assert.equal(canonicalHash('#/planfact/fact/chessboard', all), null);
  assert.equal(canonicalHash('#/planfact/fact/xyz', all), '#/planfact/fact');
  assert.equal(canonicalHash('#/planfact/fact/chessboard', { ...all, fact: false }), '#/planfact');
});

test('«Этажи × виды работ»: колонки — виды, этаж раскрывается до квартир, % по объёму; выбор вида запоминается', async () => {
  win.localStorage.removeItem('pf-chess-view');
  const s = setup();
  await s.api.add('pa1', { brigadeId: 'b1', date: '2026-10-20', qty: 20, workers: null, manHours: null, note: '' });
  const el = await mount(s);
  el.querySelector('[data-view="works"]').click(); await tick();
  assert.equal(win.localStorage.getItem('pf-chess-view'), 'works');
  const grid = el.querySelector('[data-testid="cb-grid"]');
  assert.deepEqual([...grid.querySelectorAll('thead th')].map((t: N) => t.textContent), ['Этаж / квартира', 'Окраска стен'], 'подставной сервер даёт всем позициям один вид работ (wt) — одна колонка');
  assert.ok(el.querySelector('[data-testid="cb-section"]'), 'выбор секции');
  assert.equal(grid.querySelectorAll('tr.cb-sub').length, 0, 'квартиры свёрнуты');
  const tg = grid.querySelector('tr[data-row="эт. 1"] [data-testid="cb-toggle"]');
  assert.match(tg.textContent, /эт\. 1.*2/);
  tg.click(); await tick();
  const subs = [...grid.querySelectorAll('tr.cb-sub th')].map((t: N) => t.textContent);
  assert.deepEqual(subs, ['Секция 1 · кв. 1', 'Секция 1 · кв. 2']);
  const kv1 = el.querySelector('tr.cb-sub td [data-testid="p2-chess-cell"]');
  assert.equal(kv1.getAttribute('data-state'), 'done');
  assert.ok(el.querySelector('.p2-chess').className.includes('p2-chess'), 'прокрутка вбок — внутри обёртки таблицы');
  // Повторное открытие — тот же вид.
  const again = await mount(setup());
  assert.equal(again.querySelector('[data-view="works"]').getAttribute('aria-selected'), 'true');
  win.localStorage.removeItem('pf-chess-view');
});
