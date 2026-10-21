/// <reference types="node" />
/** Excel сводки (P2-0008, этап 5): три листа, числа = данным сервера (как на экране) до копеек, без права money.view — ни одной колонки в ₽. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { buildSummaryXlsx, summaryFileName } from '../summary/xlsx.ts';
import type { SummaryProject } from '../summary/summary.service.ts';
import { GAP, POSITIONS, PTO_PROJECT, WORK_TYPES } from './summary-fake.ts';

/* eslint-disable @typescript-eslint/no-explicit-any */
async function read(bytes: Uint8Array): Promise<any> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(Buffer.from(bytes) as any);
  return wb;
}
const findRow = (ws: any, label: string): any => { let out: any = null; ws.eachRow((r: any) => { if (r.getCell(1).value === label) out = r; }); return out; };
const texts = (ws: any): string => { const a: string[] = []; ws.eachRow((r: any) => r.eachCell((c: any) => a.push(String(c.value)))); return a.join('|'); };

test('ПТО: листы «Сводка», «Позиции», «КС-2»; деньги и объёмы — как на экране, до копеек', async () => {
  const wb = await read(await buildSummaryXlsx({ project: PTO_PROJECT, workTypes: WORK_TYPES, positions: POSITIONS, gap: GAP, gapError: '', today: '2026-10-21' }));
  assert.deepEqual(wb.worksheets.map((w: any) => w.name), ['Сводка', 'Позиции', 'КС-2']);
  const s = wb.getWorksheet('Сводка');
  assert.equal(findRow(s, 'Готовность по деньгам договорной КП, %').getCell(2).value, 14.5);
  assert.equal(findRow(s, 'Сделано, ₽').getCell(2).value, 7725);
  assert.equal(findRow(s, 'Сделано, не выставлено в КС-2, ₽').getCell(2).value, 300);
  assert.equal(findRow(s, 'Темп за 7 дней, ₽/день').getCell(2).value, 691.07);
  assert.equal(findRow(s, 'Прогноз окончания').getCell(2).value, '03.02.2027');
  assert.equal(findRow(s, 'Сделано, ₽').getCell(2).numFmt, '#,##0.00');
  const plas = findRow(s, 'Штукатурка стен');
  assert.deepEqual([2, 3, 4, 5, 9, 10].map((c) => plas.getCell(c).value), ['м²', 100, 10, 10, 41250, 4125]);
  const p = wb.getWorksheet('Позиции');
  assert.equal(p.rowCount, 1 + POSITIONS.length, 'каждая позиция — строкой');
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7].map((c) => p.getRow(3).getCell(c).value), ['5 этаж · Кв. 1', 'Установка дверей', 'шт.', 10, 3, 30, 7]);
  const k = wb.getWorksheet('КС-2');
  assert.deepEqual([1, 6, 7, 8, 9, 12].map((c) => k.getRow(2).getCell(c).value), [12, 10, 9, 1, 300, 300]);
  assert.equal(k.getRow(2 + GAP.length).getCell(12).value, 300, 'итог разрыва объекта — из сводки');
});

test('без права money.view: в файле нет ни одной колонки и строки в ₽', async () => {
  const fore: SummaryProject = { ...PTO_PROJECT, can_money: false, plan_money: null, done_money: null, issued_money: null, gap_money: null, pct_money: null,
    pace7: null, pace14: null, need_pace: null, forecast_finish: null };
  const wt = WORK_TYPES.map((w) => ({ ...w, plan_money: null, done_money: null, pct_money: null }));
  const gap = GAP.map((r) => ({ ...r, price: null, done_money: null, issued_money: null, gap_money: null }));
  const wb = await read(await buildSummaryXlsx({ project: fore, workTypes: wt, positions: POSITIONS, gap, gapError: '', today: '2026-10-21' }));
  for (const ws of wb.worksheets) assert.ok(!/₽|Готовность по деньгам|Прогноз/.test(texts(ws)), ws.name);
  assert.equal(wb.getWorksheet('КС-2').getRow(1).cellCount, 8);
  assert.equal(wb.getWorksheet('КС-2').getRow(2).getCell(8).value, 1, 'объём разрыва есть');
});

test('без договорной КП — на листе «КС-2» понятное сообщение; имя файла без запрещённых символов', async () => {
  const wb = await read(await buildSummaryXlsx({ project: PTO_PROJECT, workTypes: WORK_TYPES, positions: POSITIONS, gap: null, gapError: 'Выберите договорную редакцию КП проекта', today: '2026-10-21' }));
  assert.equal(wb.getWorksheet('КС-2').getRow(1).getCell(1).value, 'Выберите договорную редакцию КП проекта');
  assert.equal(summaryFileName({ ...PTO_PROJECT, name: 'ЖК «Северный»/1' }, '2026-10-21'), 'Сводка ЖК Северный 1 21.10.2026.xlsx');
});
