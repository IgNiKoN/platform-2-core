/// <reference types="node" />
/** Экран «ВОР» (P2-0006, этап 1): выбор файла → лист-ВОР выбран сам, счётчики, фильтр по типу, «не похоже на ВОР», ошибка чтения. DOM — happy-dom. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { VorTab } from '../vor/VorTab.ts';
import type { LoadedFile } from '../vor/VorTab.ts';
import { routeFromHash } from '../PlanfactApp.ts';

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
before(() => {
  g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
  g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
});
const tick = () => new Promise((r) => setTimeout(r, 30));
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

const BOOK: LoadedFile = { name: 'вор.xlsx', sheets: [
  { name: 'График', rows: [[null, '№', 'Наименование работ', 'Ед. изм.', 'Количество', 'Норма выработки']] },
  { name: 'ВОР', hidden: true, rows: [
    ['№', 'Наименование работ', 'Ед. изм.', 'Норма расхода', 'Объём'],
    [1, 'Секция 1'],
    [2, 'Устройство пола «Альфа»', 'м2', null, 10],
    [3, 'Смесь «Бета»', 'кг', 7.5, 75]
  ] }
] };

function mount(load: (f: File) => Promise<LoadedFile>) {
  const el = win.document.createElement('div');
  win.document.body.appendChild(el);
  const root = createRoot(el as unknown as HTMLElement);
  flushSync(() => root.render(createElement(VorTab, { load })));
  return el as N;
}

async function choose(el: N, name: string) {
  const input = el.querySelector('[data-testid="vor-file"]');
  const file = new win.File(['x'], name);
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  await tick();
}

test('маршрут #/planfact/vor → страница «ВОР»', () => {
  assert.equal(routeFromHash('#/planfact/vor').page, 'vor');
  assert.equal(routeFromHash('#/planfact').page, 'works');
});

test('файл выбран → открыт лист-ВОР (даже скрытый), график помечен «не похоже на ВОР», счётчики и строки с местом', async () => {
  const el = mount(async () => BOOK);
  await choose(el, 'вор.xlsx');
  const sel = el.querySelector('[data-testid="vor-sheet"]');
  assert.equal(sel.value, 'ВОР');
  assert.match(sel.textContent, /График — не похоже на ВОР/);
  assert.match(sel.textContent, /ВОР \(скрытый\)/);
  assert.match(el.querySelector('[data-testid="vor-summary"]').textContent, /1 работ.*1 материалов/);
  const work = el.querySelector('[data-kind="work"]');
  assert.match(work.textContent, /Устройство пола «Альфа»/);
  assert.match(work.textContent, /Секция 1/);
  // фильтр «Материалы»
  const tab = Array.from(el.querySelectorAll('.vor-filter button') as N[]).find((b: N) => b.textContent === 'Материалы') as N;
  tab.click(); await tick();
  assert.equal(el.querySelectorAll('[data-kind="work"]').length, 0);
  assert.equal(el.querySelectorAll('[data-kind="material"]').length, 1);
  // переключение на график → понятная причина
  sel.value = 'График';
  sel.dispatchEvent(new win.Event('change', { bubbles: true })); await tick();
  assert.match(el.querySelector('[data-testid="vor-notvor"]').textContent, /не похож на ВОР/);
});

test('не .xlsx и повреждённый файл → понятная ошибка, без падения', async () => {
  const el = mount(async () => { throw new Error('Файл повреждён или это не .xlsx — открыть не удалось.'); });
  await choose(el, 'смета.xls');
  assert.match(el.querySelector('[role="alert"]').textContent, /Нужен файл Excel \.xlsx/);
  await choose(el, 'битый.xlsx');
  assert.match(el.querySelector('[role="alert"]').textContent, /повреждён/);
});
