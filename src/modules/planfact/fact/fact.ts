/**
 * Расчёты экрана «Факт» (P2-0007): процент выполнения, остаток, разбивка «закрыть этаж целиком».
 * Накопленный факт и план приходят с сервера (pf_fact_positions — единый расчёт Σ принятых записей); здесь только отображение
 * и подготовка пачки. Чистые функции — без обращения к серверу и DOM.
 */

/** Округление объёма до 3 знаков (как на сервере). */
export const round3 = (v: number): number => Math.round((v + Number.EPSILON) * 1000) / 1000;

/** Процент выполнения (факт / план). План 0 или меньше → 0. Один знак после запятой. */
export function percent(fact: number, plan: number): number {
  if (!(plan > 0) || !(fact > 0)) return 0;
  return Math.round((fact / plan) * 1000) / 10;
}

/** Остаток до плана (не меньше 0), 3 знака. */
export const remainder = (plan: number, fact: number): number => Math.max(0, round3(plan - fact));

/** Число для показа: пробел-разделитель тысяч, запятая, без лишних нулей (до 3 знаков). */
export function fmtQty(v: number): string {
  return round3(v).toLocaleString('ru-RU', { maximumFractionDigits: 3 });
}
export const fmtPct = (v: number): string => v.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' %';

/** Разбор введённого объёма: «12,5» / «12.5» → 12.5; пусто или не число → null. */
export function parseQty(text: string): number | null {
  const s = String(text ?? '').replace(/\s/g, '').replace(',', '.');
  if (s === '' || !/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? round3(n) : null;
}

export interface FloorItem { id: string; unit: string; plan: number; fact: number }
export type FloorMode = { kind: 'remainder' } | { kind: 'percent'; pct: number };

/**
 * Разбивка «закрыть этаж/секцию целиком»: объём каждой позиции пачки.
 *  · remainder — «100 % этажа»: остаток каждой позиции (план − факт);
 *  · percent X — X % от плана каждой позиции.
 * Позиции с разными ЕИ не суммируются: в режиме percent каждая группа по ЕИ имеет заданный итог round3(Σ план × X / 100),
 * разница округлений уходит в последнюю позицию группы — Σ объёмов группы всегда равна заданному.
 */
export function splitFloor(items: FloorItem[], mode: FloorMode): Record<string, number> {
  const out: Record<string, number> = {};
  if (mode.kind === 'remainder') {
    for (const it of items) out[it.id] = remainder(it.plan, it.fact);
    return out;
  }
  const k = Math.max(0, mode.pct) / 100;
  const groups = new Map<string, FloorItem[]>();
  for (const it of items) groups.set(it.unit, [...(groups.get(it.unit) || []), it]);
  for (const list of groups.values()) {
    const target = round3(list.reduce((s, it) => s + it.plan, 0) * k);
    let acc = 0;
    list.forEach((it, i) => {
      if (i === list.length - 1) { out[it.id] = round3(Math.max(0, target - acc)); return; }
      const q = round3(it.plan * k);
      out[it.id] = q;
      acc = round3(acc + q);
    });
  }
  return out;
}

/** Итог по ЕИ для строки «Итого» перед отправкой пачки: ЕИ → Σ объёма. */
export function sumByUnit(rows: { unit: string; qty: number }[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) out[r.unit] = round3((out[r.unit] || 0) + r.qty);
  return out;
}

/** Сегодняшняя дата (Москва) в формате YYYY-MM-DD — та же граница «не в будущем», что на сервере. */
export function todayMoscow(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
