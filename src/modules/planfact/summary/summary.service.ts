/**
 * Сводка руководителю с сервера (P2-0008): только функции public.pf_summary_* и pf_project_set_dates миграции 011.
 * Готовность по деньгам договорной КП, темп, прогноз, светофор, «сделано ↔ КС-2» считает сервер (единый расчёт summary_project);
 * поля в ₽, общий % и прогноз приходят только при праве planfact.money.view (иначе null). Экран ничего не пересчитывает.
 */
import { getClient } from '../../../platform/auth/auth.service.ts';
import { mapCompanyError } from '../../../platform/company/company.service.ts';
import type { Result } from '../../../platform/company/company.service.ts';

export type Light = 'green' | 'yellow' | 'red' | 'grey';
export type LightReason = 'no_kp' | 'no_prices' | 'no_dates' | 'done' | 'no_pace' | 'overdue' | 'forecast';

export interface SummaryProject {
  project_id: string; name: string; code: string | null; planned_start: string | null; planned_finish: string | null;
  can_money: boolean; can_manage: boolean; has_kp: boolean;
  plan_money: number | null; done_money: number | null; issued_money: number | null; gap_money: number | null; pct_money: number | null;
  pace7: number | null; pace14: number | null; need_pace: number | null; days_left: number | null; forecast_finish: string | null;
  light: Light; light_reason: LightReason; unpriced_rows: number; positions: number; pending: number;
}
export interface UnitVolume { unit: string; plan: number; fact: number; pct: number | null; rest: number; fact7: number; fact14: number; pending: number }
export interface SummaryWorkType {
  work_type_id: string | null; work_name: string; units: UnitVolume[]; positions: number;
  plan_money: number | null; done_money: number | null; pct_money: number | null; unpriced_rows: number;
}
export interface SummaryPosition {
  position_id: string; location_id: string; location_path: string; work_type_id: string; work_name: string; unit_code: string;
  plan_qty: number; fact_qty: number; pct: number | null; rest_qty: number; fact7: number; fact14: number; pending_qty: number;
}
export interface Ks2GapRow {
  source_row_id: string; import_id: string; row_no: number; number: string | null; name: string; unit_text: string | null; kind: 'work' | 'material';
  work_name: string | null; done_qty: number; issued_qty: number; gap_qty: number;
  price: number | null; done_money: number | null; issued_money: number | null; gap_money: number | null;
}

export interface SummaryApi {
  portfolio(): Promise<Result<SummaryProject[]>>;
  workTypes(projectId: string): Promise<Result<SummaryWorkType[]>>;
  positions(projectId: string, workTypeId: string | null): Promise<Result<SummaryPosition[]>>;
  ks2Gap(projectId: string): Promise<Result<Ks2GapRow[]>>;
  setDates(projectId: string, start: string | null, finish: string | null): Promise<Result>;
}

const n = (v: unknown): number => Number(v ?? 0);
const nn = (v: unknown): number | null => (v === null || v === undefined ? null : Number(v));
export const normProject = (p: SummaryProject): SummaryProject => ({
  ...p, plan_money: nn(p.plan_money), done_money: nn(p.done_money), issued_money: nn(p.issued_money), gap_money: nn(p.gap_money),
  pct_money: nn(p.pct_money), pace7: nn(p.pace7), pace14: nn(p.pace14), need_pace: nn(p.need_pace), days_left: nn(p.days_left),
  unpriced_rows: n(p.unpriced_rows), positions: n(p.positions), pending: n(p.pending) });
export const normWorkType = (w: SummaryWorkType): SummaryWorkType => ({
  ...w, positions: n(w.positions), plan_money: nn(w.plan_money), done_money: nn(w.done_money), pct_money: nn(w.pct_money), unpriced_rows: n(w.unpriced_rows),
  units: (w.units || []).map((u) => ({ unit: u.unit, plan: n(u.plan), fact: n(u.fact), pct: nn(u.pct), rest: n(u.rest), fact7: n(u.fact7), fact14: n(u.fact14), pending: n(u.pending) })) });
export const normPosition = (p: SummaryPosition): SummaryPosition => ({
  ...p, plan_qty: n(p.plan_qty), fact_qty: n(p.fact_qty), pct: nn(p.pct), rest_qty: n(p.rest_qty), fact7: n(p.fact7), fact14: n(p.fact14), pending_qty: n(p.pending_qty) });
export const normGap = (r: Ks2GapRow): Ks2GapRow => ({
  ...r, row_no: n(r.row_no), done_qty: n(r.done_qty), issued_qty: n(r.issued_qty), gap_qty: n(r.gap_qty),
  price: nn(r.price), done_money: nn(r.done_money), issued_money: nn(r.issued_money), gap_money: nn(r.gap_money) });

export function createSummaryService(): SummaryApi | null {
  const c = getClient();
  if (!c) return null;
  async function call<T = null>(fn: string, args: Record<string, unknown>): Promise<Result<T>> {
    try {
      const { data, error } = await c!.rpc(fn, args);
      return error ? { ok: false, message: mapCompanyError(error) } : { ok: true, value: (data ?? null) as T };
    } catch (e) {
      return { ok: false, message: mapCompanyError({ message: e instanceof Error ? e.message : '' }) };
    }
  }
  const list = async <T>(r: Promise<Result<T[]>>, f: (v: T) => T): Promise<Result<T[]>> => { const x = await r; return x.ok ? { ok: true, value: (x.value || []).map(f) } : x; };
  return {
    portfolio: () => list(call<SummaryProject[]>('pf_summary_portfolio', {}), normProject),
    workTypes: (p) => list(call<SummaryWorkType[]>('pf_summary_worktypes', { p_project: p }), normWorkType),
    positions: (p, wt) => list(call<SummaryPosition[]>('pf_summary_positions', { p_project: p, p_work_type: wt }), normPosition),
    ks2Gap: (p) => list(call<Ks2GapRow[]>('pf_summary_ks2_gap', { p_project: p }), normGap),
    setDates: (p, s, f) => call('pf_project_set_dates', { p_project: p, p_start: s, p_finish: f }),
  };
}
