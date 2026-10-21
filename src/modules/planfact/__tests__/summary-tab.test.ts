/// <reference types="node" />
/** Экран «Сводка» (P2-0008, этап 2) на подставном сервере: портфель, светофор и причина, ₽ только при праве (сервер присылает null —
 *  экран не показывает рублёвых показателей), даты проекта (проверка «начало ≤ окончания», сохранение, обновление). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { settle } from '../../../test-utils/settle.ts';
import type { SummaryProject } from '../summary/summary.service.ts';
import { makeFakeSummary, PTO_PROJECT } from './summary-fake.ts';

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
const { createElement } = await import('react');
const { flushSync } = await import('react-dom');
const { createRoot } = await import('react-dom/client');
const { SummaryTab } = await import('../summary/SummaryTab.ts');
const tick = (): Promise<void> => settle();
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

function mount(api: N): N {
  const el = win.document.createElement('div');
  win.document.body.appendChild(el);
  flushSync(() => createRoot(el as unknown as HTMLElement).render(createElement(SummaryTab, { api } as N)));
  return el;
}
function typeIn(input: N, value: string): void {
  Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new win.Event('input', { bubbles: true }));
}
const submit = (f: N) => f.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
const metric = (card: N, id: string) => String(card.querySelector(`[data-metric="${id}"] .sm-mvalue`)?.textContent || '');

test('ПТО: готовность по деньгам, ₽, темп, прогноз, светофор и разрыв КС-2', async () => {
  const f = makeFakeSummary([PTO_PROJECT]);
  const el = mount(f.api);
  await tick();
  const card = el.querySelector(`[data-project-id="${PTO_PROJECT.project_id}"]`);
  assert.ok(card);
  assert.equal(card.querySelector('[data-testid="sm-pct"]').textContent, '14,5 %');
  assert.match(card.querySelector('[data-testid="sm-done"]').textContent, /7\s725,00 ₽ из 53\s250,00 ₽/);
  assert.match(metric(card, 'pace7'), /691,07 ₽\/дн\./);
  assert.match(metric(card, 'pace14'), /433,93/);
  assert.match(metric(card, 'need'), /379,38/);
  assert.equal(metric(card, 'forecast'), '03.02.2027');
  assert.match(metric(card, 'gap'), /300,00 ₽/);
  assert.equal(card.querySelector('[data-testid="sm-light"]').textContent, 'В срок');
  assert.ok(card.className.includes('sm-card--green'));
  assert.match(card.querySelector('[data-testid="sm-unpriced"]').textContent, /без цены в договорной КП: 1/);
  assert.equal(el.querySelector('[data-testid="sm-nomoney"]'), null);
});

test('прораб: ₽ не приходят — рублёвых показателей нет, светофор и сроки есть, подсказка про права', async () => {
  const fore: SummaryProject = { ...PTO_PROJECT, can_money: false, can_manage: false, plan_money: null, done_money: null, issued_money: null, gap_money: null,
    pct_money: null, pace7: null, pace14: null, need_pace: null, forecast_finish: null };
  const el = mount(makeFakeSummary([fore]).api);
  await tick();
  const card = el.querySelector('.sm-card');
  assert.equal(card.querySelector('[data-testid="sm-pct"]'), null);
  for (const id of ['pace7', 'pace14', 'need', 'forecast', 'gap']) assert.equal(card.querySelector(`[data-metric="${id}"]`), null, id);
  assert.equal(card.querySelector('[data-testid="sm-unpriced"]'), null);
  assert.ok(!/₽/.test(card.textContent), 'на карточке прораба нет рублей');
  assert.equal(card.querySelector('[data-testid="sm-light"]').textContent, 'В срок');
  assert.equal(metric(card, 'dates'), '21.09.2026 — 18.02.2027');
  assert.ok(el.querySelector('[data-testid="sm-nomoney"]'));
  assert.equal(card.querySelector('[data-testid="sm-dates-btn"]'), null, 'прораб не правит даты');
});

test('серый светофор: без договорной КП — причина и подсказка, куда идти', async () => {
  const el = mount(makeFakeSummary([{ ...PTO_PROJECT, light: 'grey', light_reason: 'no_kp', has_kp: false, pct_money: null, plan_money: null, done_money: null }]).api);
  await tick();
  assert.equal(el.querySelector('[data-testid="sm-light"]').textContent, 'Нет данных');
  assert.match(el.querySelector('[data-testid="sm-why"]').textContent, /Нет договорной КП.*КС-2/);
  assert.equal(el.querySelector('[data-testid="sm-pct"]'), null);
});

test('даты проекта: начало позже окончания — отказ без запроса; сохранение — запрос и обновление сводки', async () => {
  const f = makeFakeSummary([PTO_PROJECT]);
  const el = mount(f.api);
  await tick();
  el.querySelector('[data-testid="sm-dates-btn"]').click(); await tick();
  const form = el.querySelector('[data-testid="sm-dates-form"]');
  typeIn(form.querySelector('[name="start"]'), '2027-03-01');
  typeIn(form.querySelector('[name="finish"]'), '2027-02-01');
  submit(form); await tick();
  assert.match(el.querySelector('[role="alert"]').textContent, /позже/);
  assert.ok(!f.calls.some((c) => c.startsWith('setDates')));
  typeIn(form.querySelector('[name="start"]'), '2026-09-21');
  typeIn(form.querySelector('[name="finish"]'), '2027-01-15');
  submit(form); await tick(); await tick();
  assert.ok(f.calls.includes(`setDates:${PTO_PROJECT.project_id}:2026-09-21:2027-01-15`));
  assert.equal(f.calls.filter((c) => c === 'portfolio').length, 2, 'после сохранения сводка перечитана с сервера');
  assert.equal(el.querySelector('[data-testid="sm-dates-form"]'), null);
});

test('ошибка сервера и пустой портфель — понятные сообщения', async () => {
  const f = makeFakeSummary([]);
  const el = mount(f.api);
  await tick();
  assert.ok(el.querySelector('[data-testid="sm-empty"]'));
  const bad = makeFakeSummary([], { fail: 'Нет связи с сервером. Попробуйте позже' });
  const el2 = mount(bad.api);
  await tick();
  assert.match(el2.querySelector('[role="alert"]').textContent, /Нет связи/);
});
