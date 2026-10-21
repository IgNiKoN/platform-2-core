/** Подставной сервер сводки (P2-0008) для тестов экрана: числа — как их считает сервер (011_summary.sql), экран их только показывает. */
import type { Ks2GapRow, SummaryApi, SummaryPosition, SummaryProject, SummaryWorkType } from '../summary/summary.service.ts';

/** Проект из SQL-теста 011: план 53 250 ₽, сделано 7 725 ₽ (14,5 %), темп 691,07 / 433,93 ₽/дн., нужный 379,38, выставлено 7 425, разрыв 300. */
export const PTO_PROJECT: SummaryProject = {
  project_id: 'pr1', name: 'ЖК Сводка', code: 'ЖК-1', planned_start: '2026-09-21', planned_finish: '2027-02-18', can_money: true, can_manage: true, has_kp: true,
  plan_money: 53250, done_money: 7725, issued_money: 7425, gap_money: 300, pct_money: 14.5, pace7: 691.07, pace14: 433.93, need_pace: 379.38,
  days_left: 120, forecast_finish: '2027-02-03', light: 'green', light_reason: 'forecast', unpriced_rows: 1, positions: 3, pending: 0,
};

export const WORK_TYPES: SummaryWorkType[] = [
  { work_type_id: 'wt1', work_name: 'Штукатурка стен', positions: 1, plan_money: 41250, done_money: 4125, pct_money: 10, unpriced_rows: 0,
    units: [{ unit: 'м²', plan: 100, fact: 10, pct: 10, rest: 90, fact7: 3, fact14: 6, pending: 0 }] },
  { work_type_id: 'wt3', work_name: 'Установка дверей', positions: 1, plan_money: 12000, done_money: 3600, pct_money: 30, unpriced_rows: 0,
    units: [{ unit: 'шт.', plan: 10, fact: 3, pct: 30, rest: 7, fact7: 3, fact14: 3, pending: 0 }] },
  { work_type_id: 'wt4', work_name: 'Грунтовка', positions: 1, plan_money: 0, done_money: 0, pct_money: null, unpriced_rows: 1,
    units: [{ unit: 'м²', plan: 50, fact: 0, pct: 0, rest: 50, fact7: 0, fact14: 0, pending: 0 }] },
];

export const POSITIONS: SummaryPosition[] = [
  { position_id: 'p12', location_id: 'f5', location_path: '5 этаж', work_type_id: 'wt1', work_name: 'Штукатурка стен', unit_code: 'м²',
    plan_qty: 100, fact_qty: 10, pct: 10, rest_qty: 90, fact7: 3, fact14: 6, pending_qty: 0 },
  { position_id: 'p14', location_id: 'kv', location_path: '5 этаж · Кв. 1', work_type_id: 'wt3', work_name: 'Установка дверей', unit_code: 'шт.',
    plan_qty: 10, fact_qty: 3, pct: 30, rest_qty: 7, fact7: 3, fact14: 3, pending_qty: 0 },
  { position_id: 'p16', location_id: 'f5', location_path: '5 этаж', work_type_id: 'wt4', work_name: 'Грунтовка', unit_code: 'м²',
    plan_qty: 50, fact_qty: 0, pct: 0, rest_qty: 50, fact7: 0, fact14: 0, pending_qty: 0 },
];

export const GAP: Ks2GapRow[] = [
  { source_row_id: 's12', import_id: 'i1', row_no: 12, number: '1.1', name: 'Штукатурка стен', unit_text: 'м2', kind: 'work', work_name: 'Штукатурка стен',
    done_qty: 10, issued_qty: 9, gap_qty: 1, price: 300, done_money: 3000, issued_money: 2700, gap_money: 300 },
  { source_row_id: 's13', import_id: 'i1', row_no: 13, number: '1.1.1', name: 'Смесь «Альфа»', unit_text: 'кг', kind: 'material', work_name: 'Штукатурка стен',
    done_qty: 90, issued_qty: 90, gap_qty: 0, price: 12.5, done_money: 1125, issued_money: 1125, gap_money: 0 },
  { source_row_id: 's14', import_id: 'i1', row_no: 14, number: '1.2', name: 'Установка дверей', unit_text: 'шт', kind: 'work', work_name: 'Установка дверей',
    done_qty: 3, issued_qty: 3, gap_qty: 0, price: 1200, done_money: 3600, issued_money: 3600, gap_money: 0 },
];

export function makeFakeSummary(projects: SummaryProject[], opts: { fail?: string; workTypes?: SummaryWorkType[]; positions?: SummaryPosition[]; gap?: Ks2GapRow[] | string } = {}) {
  const calls: string[] = [];
  const err = (m: string) => ({ ok: false as const, message: m });
  const api: SummaryApi = {
    async portfolio() { calls.push('portfolio'); return opts.fail ? err(opts.fail) : { ok: true, value: projects.map((p) => ({ ...p })) }; },
    async workTypes(p) { calls.push(`workTypes:${p}`); return { ok: true, value: (opts.workTypes || WORK_TYPES).map((w) => ({ ...w })) }; },
    async positions(p, wt) { calls.push(`positions:${p}:${wt}`); return { ok: true, value: (opts.positions || POSITIONS).filter((x) => wt === null || x.work_type_id === wt) }; },
    async ks2Gap(p) { calls.push(`ks2Gap:${p}`); const g = opts.gap ?? GAP; return typeof g === 'string' ? err(g) : { ok: true, value: g.map((r) => ({ ...r })) }; },
    async setDates(p, s, f) { calls.push(`setDates:${p}:${s}:${f}`); return { ok: true, value: null }; },
  };
  return { api, calls };
}
