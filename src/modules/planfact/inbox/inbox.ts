/**
 * P2-0021: «Требует моего участия» — числа для красных точек меню (из pf_my_inbox, без своих формул).
 * Решение владельца 24.10.2026: в точки — только «дела»: «Факт» = ждёт подтверждения + мои отклонённые; «КС-2» = черновики;
 * «Входящие» и пункт модуля в боковом меню = сумма этих трёх. «Сделано, не выставлено» и «Стоят» — только на странице.
 * Числа рисует оболочка (RBI.services.shell.setNavBadges): при входе, при возврате на вкладку и после своих действий модуля.
 */
import { useEffect } from 'react';
import type { InboxRow, SummaryApi } from '../summary/summary.service.ts';

export const INBOX_PATH = '#/planfact/inbox';
export const FACT_PATH = '#/planfact/fact';
export const KS2_PATH = '#/planfact/ks2';
/** Событие модуля: своё действие изменило то, что ждёт человека (решение РП, исправление, ввод факта, акт КС-2). */
export const INBOX_CHANGED_EVENT = 'planfact:inbox-changed';

const v = (n: number | null): number => (n && n > 0 ? n : 0);

/** Сумма «дел» объекта (то, что идёт в точку): ждёт подтверждения + мои отклонённые + черновики КС-2. */
export function rowTasks(r: InboxRow): number {
  return v(r.pending) + v(r.my_rejected) + v(r.ks2_drafts);
}

/** Числа точек по всем объектам: { путь: n, 'module:planfact': n }. */
export function inboxBadges(rows: InboxRow[]): Record<string, number> {
  let fact = 0; let ks2 = 0;
  for (const r of rows) { fact += v(r.pending) + v(r.my_rejected); ks2 += v(r.ks2_drafts); }
  const total = fact + ks2;
  return { [FACT_PATH]: fact, [KS2_PATH]: ks2, [INBOX_PATH]: total, 'module:planfact': total };
}

type ShellBadges = { RBI?: { services?: { shell?: { setNavBadges?: (scope: string, map: Record<string, number> | null) => void } } } };

export function setShellBadges(map: Record<string, number> | null): void {
  const sh = (window as unknown as ShellBadges).RBI?.services?.shell;
  if (sh && typeof sh.setNavBadges === 'function') sh.setNavBadges('planfact', map);
}

/** Сообщить модулю, что числа надо перечитать (после своего действия). */
export function notifyInboxChanged(): void {
  window.dispatchEvent(new Event(INBOX_CHANGED_EVENT));
}

/**
 * Держит точки меню в актуальном виде, пока человек вошёл (enabled): читает pf_my_inbox сразу, при заходе в маршрут модуля
 * (routeEvent), при возврате на вкладку браузера и по INBOX_CHANGED_EVENT. Вышел — точки убираются. onRows — строки для страницы.
 */
export function useInboxBadges(api: SummaryApi | null | undefined, enabled: boolean, routeEvent: string, onRows?: (rows: InboxRow[] | null) => void): void {
  useEffect(() => {
    if (!api || !enabled) { setShellBadges(null); if (onRows) onRows(null); return undefined; }
    let alive = true; let seq = 0;
    const load = async (): Promise<void> => {
      const my = ++seq;
      const r = await api.inbox();
      if (!alive || my !== seq || !r.ok) return;   // ошибка сети — прежние числа остаются
      setShellBadges(inboxBadges(r.value));
      if (onRows) onRows(r.value);
    };
    const onVisible = (): void => { if (document.visibilityState === 'visible') void load(); };
    const onEvent = (): void => { void load(); };
    void load();
    window.addEventListener(routeEvent, onEvent);
    window.addEventListener(INBOX_CHANGED_EVENT, onEvent);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.removeEventListener(routeEvent, onEvent);
      window.removeEventListener(INBOX_CHANGED_EVENT, onEvent);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [api, enabled]);
}

/** Обёртка сервиса: после успешного действия из names — notifyInboxChanged() (числа перечитываются, экраны модуля не меняются). */
export function withInboxRefresh<T extends object>(api: T | null, names: (keyof T)[]): T | null {
  if (!api) return api;
  const out = { ...api } as T;
  for (const k of names) {
    const fn = api[k];
    if (typeof fn !== 'function') continue;
    (out as Record<keyof T, unknown>)[k] = async (...args: unknown[]) => {
      const r = await (fn as (...a: unknown[]) => Promise<{ ok?: boolean }>).apply(api, args);
      if (r && r.ok) notifyInboxChanged();
      return r;
    };
  }
  return out;
}
