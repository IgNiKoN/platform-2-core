/// <reference types="node" />
/** Расчёт сметы (P2-0006c, этап 4): работа = объём × расценка; материал = объём строки × цена, без объёма — объём работы × норма;
 *  итоги по листам; строки без цены; округление только при выводе. Синтетические данные. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcRows, calcTotals, kop, rowQty } from '../estimate/calc.ts';
import type { EstimateRow } from '../estimate/estimate.service.ts';

function r(p: Partial<EstimateRow> & { row_no: number; kind: EstimateRow['kind'] }): EstimateRow {
  return { source_row_id: `${p.import_id || 'i1'}:${p.row_no}`, import_id: 'i1', number: null, name: 'строка ' + p.row_no, unit_text: null, qty: null, norm: null,
    parent_row_no: null, work_type_id: null, price_labor: null, price_material: null, price_source: 'reference', ref_item_id: null, ref_labor: null,
    ref_material: null, ref_date: null, ...p };
}

test('rowQty: свой объём; у материала без объёма — объём работы × норма', () => {
  assert.equal(rowQty({ kind: 'material', qty: 5, norm: 2 }, 100), 5);
  assert.equal(rowQty({ kind: 'material', qty: null, norm: 7.5 }, 100), 750);
  assert.equal(rowQty({ kind: 'material', qty: null, norm: null }, 100), null);
  assert.equal(rowQty({ kind: 'work', qty: null, norm: 2 }, 100), null);
});

test('calcRows / calcTotals: суммы строк и листов как в Excel (без промежуточного округления)', () => {
  const rows = [
    r({ row_no: 4, kind: 'group' }),
    r({ row_no: 6, kind: 'work', qty: 83.32999999999998, price_labor: 300 }),
    r({ row_no: 7, kind: 'material', qty: 8.332999999999998, norm: 0.1, parent_row_no: 6, price_material: 12700 }),
    r({ row_no: 9, kind: 'material', qty: null, norm: 1.12, parent_row_no: 6, price_material: 48 }),
    r({ row_no: 10, kind: 'work', qty: 10, price_labor: 450, price_material: 450 }),       // «материалы в составе работы»
    r({ row_no: 11, kind: 'work', qty: 3, price_labor: null }),                            // без цены
    r({ row_no: 6, kind: 'work', import_id: 'i2', qty: 1, price_labor: 0.005 })
  ];
  const c = calcRows(rows);
  assert.equal(c.has('i1:4'), false, 'у группы сумм нет');
  assert.ok(Math.abs(c.get('i1:6')!.labor - 24999) < 1e-9);
  assert.ok(Math.abs(c.get('i1:7')!.material - 105829.1) < 1e-6);
  assert.ok(Math.abs(c.get('i1:9')!.qty! - 93.3296) < 1e-9, 'объём материала = объём работы × норма');
  assert.deepEqual([c.get('i1:10')!.labor, c.get('i1:10')!.material], [4500, 4500]);
  assert.equal(c.get('i1:11')!.priced, false);
  const t = calcTotals(rows, c);
  const i1 = t.byImport.get('i1')!;
  assert.equal(kop(i1.labor), 29499);
  assert.equal(kop(i1.material), kop(105829.1 + 93.3296 * 48 + 4500));
  assert.equal(i1.unpriced, 1);
  assert.equal(t.byImport.get('i2')!.labor, 0.005);
  assert.equal(kop(t.all.labor), 29499.01, 'округление — только итога');
  assert.equal(t.all.rows, 6);
});

test('kop: до копеек', () => {
  assert.equal(kop(26417036.792499997), 26417036.79);
  assert.equal(kop(1.005), 1.01);
  assert.equal(kop(213850266.75460497), 213850266.75);
});
