/**
 * Сводка (P2-0008): подписи светофора и причин, форматирование. Чисел не считает — всё приходит с сервера (summary_project).
 */
import type { Light, LightReason, SummaryProject } from './summary.service.ts';
import { money } from '../estimate/prices.ts';
import { ruDate } from '../ks2/form.ts';

export const LIGHT_LABEL: Record<Light, string> = { green: 'В срок', yellow: 'Риск', red: 'Отставание', grey: 'Нет данных' };

/** Пояснение к светофору: почему серый / что значит цвет. */
export function lightText(p: Pick<SummaryProject, 'light' | 'light_reason'>): string {
  const r: LightReason = p.light_reason;
  if (r === 'no_kp') return 'Нет договорной КП — выберите её в разделе «КС-2»';
  if (r === 'no_prices') return 'В договорной КП нет цен — готовность по деньгам не считается';
  if (r === 'no_dates') return 'Укажите плановые даты проекта';
  if (r === 'done') return 'Всё по ВОР выполнено';
  if (r === 'no_pace') return 'За 14 дней нет выполнения — прогноза нет';
  if (r === 'overdue') return 'Плановая дата окончания прошла';
  return p.light === 'green' ? 'Успеваем к плановой дате окончания' : p.light === 'yellow' ? 'Прогноз позже плана не больше чем на 14 дней' : 'Прогноз позже плана больше чем на 14 дней';
}

export const rub = (v: number | null): string => (v === null ? '—' : `${money(v)} ₽`);
export const rubDay = (v: number | null): string => (v === null ? '—' : `${money(v)} ₽/дн.`);
export const dateOr = (d: string | null, empty = '—'): string => (d ? ruDate(d) : empty);
export const pctText = (v: number | null): string => (v === null ? '—' : `${v.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} %`);
