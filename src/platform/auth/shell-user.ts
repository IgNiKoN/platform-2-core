/**
 * Шапка оболочки показывает того, кто вошёл в Platform 2.0 (P2-0009, находка К4): без этого в шапке оставался
 * локальный пользователь Quality («Инженер»), а в разделе — прораб. Рисует общая функция оболочки
 * window.RBI.services.shell.renderUserBlock (второй шапки нет); при выходе — прежние надписи возвращаются.
 */
type ShellUser = { name: string; role: string };
type RbiShell = { RBI?: { services?: { shell?: { renderUserBlock?: (u: ShellUser) => void } } } };

const IDS = ['desk-user-name', 'desk-user-avatar', 'header-user-block'];
let saved: Record<string, string> | null = null;

/** Показать в шапке оболочки почту и роль вошедшего. Без оболочки (тесты, отдельная страница) — ничего не делает. */
export function showShellUser(email: string, role: string): void {
  if (typeof document === 'undefined') return;
  const shell = (window as unknown as RbiShell).RBI?.services?.shell;
  if (!shell || typeof shell.renderUserBlock !== 'function') return;
  if (!saved) {
    saved = {};
    for (const id of IDS) { const el = document.getElementById(id); if (el) saved[id] = el.textContent || ''; }
  }
  shell.renderUserBlock({ name: email, role: role || 'нет роли' });
}

/** Вернуть шапку оболочки, как была до входа. */
export function restoreShellUser(): void {
  if (!saved || typeof document === 'undefined') return;
  for (const id of IDS) { const el = document.getElementById(id); if (el && id in saved) el.textContent = saved[id]; }
  saved = null;
}
