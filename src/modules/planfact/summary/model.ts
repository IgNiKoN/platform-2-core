/**
 * Сводка (P2-0008, P2-0010): подписи светофора (ТЗ 8.2) и причин, вердикт темпа, форматирование. Чисел не считает — всё приходит с сервера (summary_project).
 */
import type { Light, LightReason, PaceVerdict, SummaryProject } from './summary.service.ts';
import { money } from '../estimate/prices.ts';
import { ruDate } from '../ks2/form.ts';

export const LIGHT_LABEL: Record<Light, string> = { green: 'В срок', yellow: 'Риск', red: 'Отставание', grey: 'Нет данных' };

/** Пояснение к светофору (правило ТЗ 8.2, пороги объекта): почему серый / что значит цвет. Числа — с сервера. */
export function lightText(p: Pick<SummaryProject, 'light' | 'light_reason' | 'lag_pp' | 'lag_days' | 'light_yellow_pp' | 'light_red_pp' | 'light_overdue_days'>): string {
  const r: LightReason = p.light_reason;
  const pp = p.lag_pp !== null ? `${num(p.lag_pp)} п.п.` : '';
  const dd = p.lag_days !== null ? `${num(p.lag_days)} дн.` : '';
  if (r === 'no_kp') return 'Нет договорной КП — выберите её в разделе «КС-2»';
  if (r === 'no_prices') return 'В договорной КП нет цен — готовность по деньгам не считается';
  if (r === 'no_dates') return 'Укажите плановые даты начала и окончания проекта';
  if (r === 'done') return 'Всё по ВОР выполнено';
  if (r === 'lag_red') return `Отставание ${pp || 'от плана'} — больше красного порога ${num(p.light_red_pp)} п.п.`;
  if (r === 'overdue') return 'Плановая дата окончания прошла, а выполнено меньше 100 %';
  if (r === 'finish_near') return `До окончания не больше 5 рабочих дней, отставание больше ${num(p.light_yellow_pp)} п.п.`;
  if (r === 'lag_yellow') return `Отставание ${pp || 'от плана'} — между порогами ${num(p.light_yellow_pp)} и ${num(p.light_red_pp)} п.п.`;
  if (r === 'lag_days') return `Отставание ${dd || 'в днях'} — не меньше порога ${p.light_overdue_days} дн.`;
  return `В графике: отставание не больше ${num(p.light_yellow_pp)} п.п. и меньше ${p.light_overdue_days} дн.`;
}

export const VERDICT_LABEL: Record<PaceVerdict, string> = { faster: 'Ускоряемся', slower: 'Замедляемся', steady: 'Темп ровный' };
/** Вердикт темпа (сервер: темп 7 дней против 14 дней, допуск ±10 %). */
export const verdictText = (v: PaceVerdict | null): string => (v ? VERDICT_LABEL[v] : 'За 14 дней нет выполнения');
/** Отставание в днях (D по ТЗ §9) — целое число дней; опережение — «опережаем на N дн.». */
export function lagDaysText(d: number | null): string {
  if (d === null) return '—';
  const v = Math.round(d);
  return v > 0 ? `${v.toLocaleString('ru-RU')} дн.` : v < 0 ? `опережаем на ${(-v).toLocaleString('ru-RU')} дн.` : 'нет';
}
const num = (v: number): string => v.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

export const rub = (v: number | null): string => (v === null ? '—' : `${money(v)} ₽`);
export const rubDay = (v: number | null): string => (v === null ? '—' : `${money(v)} ₽/дн.`);
export const dateOr = (d: string | null, empty = '—'): string => (d ? ruDate(d) : empty);
export const pctText = (v: number | null): string => (v === null ? '—' : `${v.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} %`);
