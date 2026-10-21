/**
 * Сводка → «Скачать Excel» (P2-0008, этап 5): листы «Сводка» (итоги объекта и виды работ), «Позиции» (каждая позиция с местом),
 * «КС-2» (сделано ↔ выставлено по строкам заказчика). Числа — как пришли с сервера (те же, что на экране, до копеек), ничего не пересчитывается.
 * Без права money.view колонок и строк в ₽ нет (сервер их и не присылает). Excel (exceljs) подгружается лениво.
 */
import type { Ks2GapRow, SummaryPosition, SummaryProject, SummaryWorkType } from './summary.service.ts';
import { LIGHT_LABEL, lightText } from './model.ts';
import { ruDate } from '../ks2/form.ts';

export interface SummaryExport {
  project: SummaryProject; workTypes: SummaryWorkType[]; positions: SummaryPosition[];
  gap: Ks2GapRow[] | null; gapError: string; today: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function loadExcel(): Promise<{ Workbook: new () => any }> {
  const mod: any = await import('exceljs');
  return mod.default && mod.default.Workbook ? mod.default : mod;
}

const MONEY = '#,##0.00';
const QTY = '#,##0.###';
const PCT = '0.0';
const bold = { bold: true };

/** Имя файла: «Сводка <проект> <дата>.xlsx» без символов, запрещённых в именах файлов. */
export const summaryFileName = (p: SummaryProject, today: string): string =>
  `Сводка ${p.name} ${ruDate(today)}.xlsx`.replace(/[«»"]/g, '').replace(/[\\/:*?<>|]+/g, ' ').replace(/\s+/g, ' ');

export async function buildSummaryXlsx(x: SummaryExport): Promise<Uint8Array> {
  const { Workbook } = await loadExcel();
  const wb = new Workbook();
  const p = x.project;
  const m = p.can_money;

  // Лист «Сводка»
  const s = wb.addWorksheet('Сводка');
  s.columns = [{ width: 36 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 10 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 18 }, { width: 18 }, { width: 10 }];
  s.addRow([`Сводка: ${p.name}${p.code ? ` (${p.code})` : ''}`]).font = { bold: true, size: 14 };
  s.addRow([`Выгружено ${ruDate(x.today)}`]);
  s.addRow([]);
  const kv = (label: string, value: string | number | null, fmt?: string): void => {
    const r = s.addRow([label, value === null ? '—' : value]);
    r.getCell(1).font = bold;
    if (fmt && typeof value === 'number') r.getCell(2).numFmt = fmt;
  };
  kv('Светофор', `${LIGHT_LABEL[p.light]} — ${lightText(p)}`);
  kv('Плановое начало', p.planned_start ? ruDate(p.planned_start) : null);
  kv('Плановое окончание', p.planned_finish ? ruDate(p.planned_finish) : null);
  if (m) {
    kv('Готовность по деньгам договорной КП, %', p.pct_money, PCT);
    kv('Стоимость ВОР по договорной КП, ₽', p.plan_money, MONEY);
    kv('Сделано, ₽', p.done_money, MONEY);
    kv('Выставлено в КС-2, ₽', p.issued_money, MONEY);
    kv('Сделано, не выставлено в КС-2, ₽', p.gap_money, MONEY);
    kv('Темп за 7 дней, ₽/день', p.pace7, MONEY);
    kv('Темп за 14 дней, ₽/день', p.pace14, MONEY);
    kv('Нужный темп до окончания, ₽/день', p.need_pace, MONEY);
    kv('Прогноз окончания', p.forecast_finish ? ruDate(p.forecast_finish) : null);
    kv('Строк ВОР без цены в договорной КП', p.unpriced_rows);
  }
  kv('Позиций ВОР', p.positions);
  s.addRow([]);
  s.addRow(['Виды работ']).font = bold;
  const wtHead = ['Вид работ', 'ЕИ', 'План', 'Факт', '%', 'Остаток', 'Факт за 7 дн.', 'Факт за 14 дн.'].concat(m ? ['План, ₽', 'Сделано, ₽', '% по ₽'] : []);
  s.addRow(wtHead).font = bold;
  for (const w of x.workTypes) {
    const units = w.units.length ? w.units : [null];
    units.forEach((u, i) => {
      const row = [w.work_name, u ? u.unit : '', u ? u.plan : null, u ? u.fact : null, u ? u.pct : null, u ? u.rest : null, u ? u.fact7 : null, u ? u.fact14 : null];
      // ₽ вида работ — один раз, в первой строке (разные ЕИ — отдельные строки, деньги не дублируются)
      const money = m ? (i === 0 ? [w.plan_money, w.done_money, w.pct_money] : [null, null, null]) : [];
      const r = s.addRow([...row, ...money]);
      [3, 4, 6, 7, 8].forEach((c) => { r.getCell(c).numFmt = QTY; });
      r.getCell(5).numFmt = PCT;
      if (m) { r.getCell(9).numFmt = MONEY; r.getCell(10).numFmt = MONEY; r.getCell(11).numFmt = PCT; }
    });
  }

  // Лист «Позиции»
  const ps = wb.addWorksheet('Позиции');
  ps.columns = [{ width: 40 }, { width: 30 }, { width: 8 }, { width: 12 }, { width: 12 }, { width: 8 }, { width: 12 }, { width: 14 }, { width: 14 }, { width: 18 }];
  ps.addRow(['Место', 'Вид работ', 'ЕИ', 'План', 'Факт', '%', 'Остаток', 'Факт за 7 дн.', 'Факт за 14 дн.', 'Ждёт подтверждения']).font = bold;
  for (const q of x.positions) {
    const r = ps.addRow([q.location_path, q.work_name, q.unit_code, q.plan_qty, q.fact_qty, q.pct, q.rest_qty, q.fact7, q.fact14, q.pending_qty]);
    [4, 5, 7, 8, 9, 10].forEach((c) => { r.getCell(c).numFmt = QTY; });
    r.getCell(6).numFmt = PCT;
  }
  ps.views = [{ state: 'frozen', ySplit: 1 }];

  // Лист «КС-2»
  const ks = wb.addWorksheet('КС-2');
  ks.columns = [{ width: 8 }, { width: 10 }, { width: 44 }, { width: 28 }, { width: 8 }, { width: 12 }, { width: 12 }, { width: 12 }].concat(m ? [{ width: 12 }, { width: 16 }, { width: 16 }, { width: 16 }] : []);
  if (!x.gap) {
    ks.addRow([x.gapError || 'Нет данных']);
  } else {
    ks.addRow(['Стр.', '№', 'Наименование', 'Вид работ', 'ЕИ', 'Сделано', 'Выставлено', 'Разрыв'].concat(m ? ['Цена, ₽', 'Сделано, ₽', 'Выставлено, ₽', 'Разрыв, ₽'] : [])).font = bold;
    for (const g of x.gap) {
      const cells: (string | number | null)[] = [g.row_no, g.number || '', g.kind === 'material' ? `${g.name} (материал)` : g.name, g.work_name || '', g.unit_text || '', g.done_qty, g.issued_qty, g.gap_qty];
      if (m) cells.push(g.price, g.done_money, g.issued_money, g.gap_money);
      const r = ks.addRow(cells);
      [6, 7, 8].forEach((c) => { r.getCell(c).numFmt = QTY; });
      if (m) [9, 10, 11, 12].forEach((c) => { r.getCell(c).numFmt = MONEY; });
    }
    if (m) {
      const t = ks.addRow(['', '', 'Итого по объекту: сделано, не выставлено в КС-2, ₽', '', '', '', '', '', '', '', '', p.gap_money]);
      t.font = bold; t.getCell(12).numFmt = MONEY;
    }
    ks.views = [{ state: 'frozen', ySplit: 1 }];
  }
  return new Uint8Array(await wb.xlsx.writeBuffer());
}
