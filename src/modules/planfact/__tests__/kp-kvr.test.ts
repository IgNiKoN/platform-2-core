/// <reference types="node" />
/** КП в форму заказчика с КВР / Номенклатурой (P2-0012, этап 3): вымышленный файл с формулами заказчика
 *  (Номенклатура: Цена = материал + работа, Сумма = Цена × Кол-во; КВР: Сумма = SUMIF по «Номенклатура», Цена = Сумма ÷ Кол-во).
 *  Пишутся только «Стоимость материала / работ на ед.» строк Номенклатуры; формулы и строки КВР не трогаются. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { patchXlsx, colLetters } from '../vor/xlsx-writer.ts';
import { readWorkbook } from '../vor/xlsx-reader.ts';
import { parseSheet } from '../vor/parse.ts';
import { guessKpColumns, kpWrites } from '../estimate/kp.ts';
import type { KpSnapshot } from '../estimate/kp.ts';
import { kvrSheet, KVR_COL } from './kvr-fixture.ts';

const L = (c: number): string => colLetters(c);

/** Файл из вымышленного листа + формулы заказчика в «Цена» / «Сумма». */
async function offer(): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Шаблон Excel');
  const sheet = kvrSheet();
  sheet.rows.forEach((r, i) => { ws.getRow(i + 1).values = r.map((v) => (v === null ? undefined : v)) as ExcelJS.CellValue[]; });
  const rows = sheet.rows;
  const kvrRows: number[] = [];
  rows.forEach((r, i) => { if (r[KVR_COL.type] === 'КВР') kvrRows.push(i + 1); });
  rows.forEach((r, i) => {
    const n = i + 1;
    if (r[KVR_COL.type] === 'Номенклатура') {
      ws.getCell(L(KVR_COL.price) + n).value = { formula: `${L(KVR_COL.mat)}${n}+${L(KVR_COL.lab)}${n}`, result: 0 };
      ws.getCell(L(KVR_COL.sum) + n).value = { formula: `${L(KVR_COL.price)}${n}*${L(KVR_COL.qty)}${n}`, result: 0 };
    } else if (r[KVR_COL.type] === 'КВР') {
      const next = kvrRows.find((k) => k > n) || rows.length - 2;
      const rng = (c: number): string => `${L(c)}${n + 1}:${L(c)}${next - 1}`;
      ws.getCell(L(KVR_COL.sum) + n).value = { formula: `SUMIF(${rng(KVR_COL.type)},"Номенклатура",${rng(KVR_COL.sum)})`, result: 0 };
      ws.getCell(L(KVR_COL.price) + n).value = { formula: `${L(KVR_COL.sum)}${n}/${L(KVR_COL.qty)}${n}`, result: 0 };
    }
  });
  return new Uint8Array(await wb.xlsx.writeBuffer());
}

test('КП в форме с КВР: колонки цен узнаны, вписаны только материал/работа Номенклатуры, формулы и КВР целы', async () => {
  const src = await offer();
  const wbIn = await readWorkbook(src);
  const parsed = parseSheet(wbIn.sheets[0]);
  assert.equal(parsed.stats.works, 41);
  const cols = guessKpColumns(parsed.columns!.prices);
  assert.equal(cols.unitMaterial, KVR_COL.mat);
  assert.equal(cols.unitLabor, KVR_COL.lab);
  assert.equal(cols.unitTotal, null, '«Цена» — формула заказчика, не пишется');
  assert.equal(cols.sumTotal, null, '«Сумма» — формула заказчика, не пишется');

  const works = parsed.rows.filter((r) => r.kind === 'work');
  const snap: KpSnapshot = { version: 1, estimate: { id: 'e', name: 'Смета', area_m2: null }, totals: { labor: 0, material: 0, total: 0, unpriced: 0 }, overheads: null,
    rows: works.map((r, k) => ({ import_id: 'i', row_no: r.rowNo, kind: 'work' as const, name: r.name, qty: r.qty, price_labor: 100 + k, price_material: 10 + k,
      labor: (100 + k) * (r.qty || 0), material: (10 + k) * (r.qty || 0) })) };
  const writes = kpWrites(snap, 'i', cols);
  assert.equal(writes.length, 82);
  const res = await patchXlsx(src, 'Шаблон Excel', writes);
  assert.equal(res.written.length, 82);
  assert.deepEqual(res.skippedFormula, []);
  const kvrNos = new Set(parsed.rows.filter((r) => r.kind === 'group').map((r) => r.rowNo));
  assert.ok(res.written.every((a) => /^[LM]\d+$/.test(a) && !kvrNos.has(Number(a.slice(1)))), 'только L/M строк Номенклатуры');

  const out = new ExcelJS.Workbook();
  await out.xlsx.load(res.bytes);
  const ws = out.getWorksheet('Шаблон Excel')!;
  for (const r of parsed.rows.filter((x) => x.kind === 'work' || x.kind === 'group')) {
    for (const c of [KVR_COL.price, KVR_COL.sum]) {
      const v = ws.getCell(L(c) + r.rowNo).value as { formula?: string } | null;
      assert.ok(v && typeof v === 'object' && v.formula, `формула ${L(c)}${r.rowNo} сохранена`);
    }
  }
  const first = works[0].rowNo;
  assert.equal(ws.getCell(L(KVR_COL.mat) + first).value, 10);
  assert.equal(ws.getCell(L(KVR_COL.lab) + first).value, 100);
  assert.match(String((ws.getCell(L(KVR_COL.sum) + 4).value as { formula: string }).formula), /^SUMIF\(/);
});
