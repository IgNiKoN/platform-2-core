/**
 * Расчёт тендерной сметы (P2-0006c) — единственная функция расчёта: экран сметы, КП и снимок редакции КП считают только ею.
 * Работа: объём × расценка (+ объём × «материалы в составе работы», если задано).
 * Материал: объём строки материала × цена; объём — из файла (vor_source_rows.qty, как в 0_СЕБЕС: F материала = F работы × норма),
 * если его нет — объём работы-родителя × норма. Без округления; до копеек — только при выводе и в снимке КП.
 */
import type { EstimateRow } from './estimate.service.ts';

export interface RowCalc { qty: number | null; labor: number; material: number; priced: boolean }
export interface Sums { labor: number; material: number; total: number; rows: number; unpriced: number }

/** Объём строки для расчёта: свой; у материала без своего — объём работы × норма. */
export function rowQty(r: Pick<EstimateRow, 'kind' | 'qty' | 'norm'>, parentQty: number | null): number | null {
  if (r.qty !== null && r.qty !== undefined) return r.qty;
  if (r.kind === 'material' && parentQty !== null && r.norm !== null && r.norm !== undefined) return parentQty * r.norm;
  return null;
}

/** Суммы строк сметы: key = source_row_id. Группы и места — без сумм. */
export function calcRows(rows: EstimateRow[]): Map<string, RowCalc> {
  const qtyOf = new Map<string, number | null>();
  for (const r of rows) if (r.kind === 'work') qtyOf.set(`${r.import_id}:${r.row_no}`, r.qty);
  const out = new Map<string, RowCalc>();
  for (const r of rows) {
    if (r.kind !== 'work' && r.kind !== 'material') continue;
    const parent = r.parent_row_no !== null ? qtyOf.get(`${r.import_id}:${r.parent_row_no}`) ?? null : null;
    const q = rowQty(r, parent);
    const pl = r.kind === 'work' ? r.price_labor : null;
    const pm = r.price_material;
    out.set(r.source_row_id, {
      qty: q,
      labor: q !== null && pl !== null ? q * pl : 0,
      material: q !== null && pm !== null ? q * pm : 0,
      priced: pl !== null || pm !== null
    });
  }
  return out;
}

const empty = (): Sums => ({ labor: 0, material: 0, total: 0, rows: 0, unpriced: 0 });

/** Итоги по загрузкам (листам) и всего. */
export function calcTotals(rows: EstimateRow[], calc: Map<string, RowCalc> = calcRows(rows)): { byImport: Map<string, Sums>; all: Sums } {
  const byImport = new Map<string, Sums>();
  const all = empty();
  for (const r of rows) {
    const c = calc.get(r.source_row_id);
    if (!c) continue;
    const s = byImport.get(r.import_id) || empty();
    for (const t of [s, all]) {
      t.labor += c.labor; t.material += c.material; t.total += c.labor + c.material; t.rows++;
      if (!c.priced) t.unpriced++;
    }
    byImport.set(r.import_id, s);
  }
  return { byImport, all };
}

/** До копеек (для вывода и снимка КП). Как Excel: сначала 15 значащих цифр (снимает хвосты двоичной арифметики: 29499.005·100 = 2949900.4999…), потом округление. */
export const kop = (n: number): number => Math.round(Number((n * 100).toPrecision(15))) / 100;
