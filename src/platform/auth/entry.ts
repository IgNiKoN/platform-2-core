/**
 * Вход платформы (Vite-бандл → js/dist/platform/platform.js, без React). Подключает оболочка (app-shell.showAuthGate) при открытии.
 * Решает, кто на устройстве: вошедший почтой (сессия Supabase), по старому PIN Quality или демо; иначе — экран «Вход» поверх оболочки.
 * Публикует состояние для меню и Настроек: window.RBI.platformMenuAccess (событие rbi:platform-access) и window.RBI.platform2.
 */
import { createAuthService, getClient, readAuthConfig } from './auth.service.ts';
import { createPlatform } from './platform.service.ts';
import type { Platform, PlatformState } from './platform.service.ts';
import { LOGIN_CSS, renderLoginScreen } from './login-screen.ts';
import { showShellUser, restoreShellUser } from './shell-user.ts';

type Rbi = Record<string, unknown> & {
  services?: { shell?: { renderSidebar?: () => void; renderMobileModuleMenu?: () => void }; config?: { isCloudEnabled?: () => boolean; getCloudDisabledMessage?: () => string } };
};
type Win = Window & { RBI?: Rbi; syncConfig?: { enabled?: boolean }; AppRouter?: { navigate?: (p: string, replace?: boolean) => void }; AppModeManager?: { renderBottomNav?: () => void } };

const OVERLAY_ID = 'auth-gate-overlay';
const STYLE_ID = 'p2-login-style';

let platform: Platform | null = null;
let started: Promise<PlatformState> | null = null;

function w(): Win { return window as Win; }
function rbi(): Rbi { const x = w(); x.RBI = x.RBI || {}; return x.RBI; }

function cloudEnabled(): boolean {
  const c = rbi().services?.config;
  return !!(c && typeof c.isCloudEnabled === 'function' && c.isCloudEnabled());
}

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = LOGIN_CSS + `
.p2-company-switch{max-width:100%;font-size:12px;font-weight:700;min-height:40px;padding:4px 8px;border:1px solid var(--card-border);border-radius:10px;background:var(--card-bg);color:var(--text-main)}`;
  document.head.appendChild(s);
}

function getPlatform(): Platform {
  if (platform) return platform;
  const cfg = readAuthConfig();
  const auth = cfg ? createAuthService(cfg) : null;
  const client = auth ? getClient() : null;
  platform = createPlatform({
    auth,
    rpc: client ? async (fn) => { const r = await client.rpc(fn); return { data: r.data, error: r.error }; } : null,
    storage: (() => { try { return window.localStorage; } catch { return null; } })(),
    // По PIN — только когда облако Quality включено (сборка «выпуск») и прежний код подключился.
    pinActive: () => cloudEnabled() && !!(w().syncConfig && w().syncConfig!.enabled)
  });
  platform.subscribe(apply);
  if (auth && auth.onAuthChange) auth.onAuthChange(() => { void platform!.refresh(); });
  window.addEventListener('platform2:refresh', () => { void platform!.refresh(); });
  return platform;
}

function overlay(): HTMLElement | null { return document.getElementById(OVERLAY_ID); }

function showLogin(): void {
  const o = overlay();
  if (!o) return;
  ensureStyle();
  const host = o.querySelector('[data-p2-login-host]') as HTMLElement | null || o;
  const p = getPlatform();
  renderLoginScreen(host, {
    signIn: async (email, password) => {
      const res = await p.signIn(email, password);
      if (res.ok) goHome();
      return res;
    },
    onDemo: () => { p.chooseDemo(); go('#/planfact/vor'); },
    pinEnabled: cloudEnabled(),
    pinDisabledMessage: rbi().services?.config?.getCloudDisabledMessage?.() || 'Облачный вход отключён'
  });
  o.classList.remove('hidden');
}

function hideLogin(): void {
  const o = overlay();
  if (o) o.classList.add('hidden');
}

/** После входа почтой — первый доступный модуль; без модулей — Настройки. */
function goHome(): void {
  const a = getPlatform().access();
  go(a.planfact ? '#/planfact' : '#/settings');
}

function go(path: string): void {
  const r = w().AppRouter;
  if (r && typeof r.navigate === 'function') r.navigate(path, true); else window.location.hash = path;
}

/** «Компания: …» в «Настройки → Платформа» (вызывают Настройки при показе). Одна компания — переключателя нет. */
function renderCompanySwitch(host: HTMLElement | null): void {
  if (!host) return;
  const st = getPlatform().getState();
  ensureStyle();
  let sel = host.querySelector('select');
  if (st.mode !== 'email' || st.companies.length < 2) { if (sel) sel.remove(); return; }
  if (!sel) {
    sel = document.createElement('select');
    sel.className = 'p2-company-switch';
    sel.setAttribute('aria-label', 'Компания');
    sel.setAttribute('data-testid', 'p2-company-switch');
    sel.addEventListener('change', () => getPlatform().setCompany(sel!.value));
    host.appendChild(sel);
  }
  sel.replaceChildren(...st.companies.map((c) => { const o = document.createElement('option'); o.value = c.id; o.textContent = 'Компания: ' + c.name; return o; }));
  sel.value = st.companyId || '';
}

function apply(st: PlatformState): void {
  const r = rbi();
  r.platformMenuAccess = getPlatform().access();
  r.platform2 = api;
  window.dispatchEvent(new Event('rbi:platform-access'));
  const shell = r.services?.shell;
  if (shell && typeof shell.renderSidebar === 'function') shell.renderSidebar();
  if (shell && typeof shell.renderMobileModuleMenu === 'function') shell.renderMobileModuleMenu();
  const amm = w().AppModeManager;
  if (amm && typeof amm.renderBottomNav === 'function') amm.renderBottomNav();   // подвкладки: вошедшему почтой — без старого Quality
  if (st.mode === 'email' && st.email) {
    const cur = st.companies.find((c) => c.id === st.companyId);
    showShellUser(st.email, cur ? cur.name + (cur.roles[0] ? ' · ' + cur.roles[0] : '') : (st.isPlatformAdmin ? 'администратор платформы' : ''));
  } else {
    restoreShellUser();
  }
  if (st.mode === 'none') showLogin(); else hideLogin();
  postCacheAllowlist();
}

/** Кэш приложения (sw.js): файлы модулей Platform 2.0 — только положенных этому входу, остальные удаляются. */
function postCacheAllowlist(): void {
  const sh = rbi().services?.shell as { isPlatformModuleAllowed?: (id: string) => boolean } | undefined;
  const a = getPlatform().access();
  const modules: string[] = [];
  if (sh && typeof sh.isPlatformModuleAllowed === 'function' && sh.isPlatformModuleAllowed('planfact')) modules.push('planfact');
  if (a.company) modules.push('company');
  if (a.platformAdmin) modules.push('platform-admin');
  try {
    const c = navigator.serviceWorker && navigator.serviceWorker.controller;
    if (c) c.postMessage({ type: 'P2_SW_ALLOWLIST', modules });
  } catch { /* без кэша приложения — ничего */ }
}

/** Запуск при открытии (оболочка). Повторный вызов — то же состояние; экран входа показывается, если никто не вошёл. */
export function start(): Promise<PlatformState> {
  if (!started) started = getPlatform().boot();
  else void started.then((st) => { if (st.mode === 'none') showLogin(); });
  return started;
}

export const api = {
  start,
  getState: (): PlatformState => getPlatform().getState(),
  access: () => getPlatform().access(),
  setCompany: (id: string): void => getPlatform().setCompany(id),
  refresh: (): Promise<PlatformState> => getPlatform().refresh(),
  /** «Выйти» (Настройки → Платформа, полоса раздела): сессия завершается, экран «Вход». */
  signOut: async (): Promise<void> => { await getPlatform().signOut(); },
  showLogin,
  renderCompanySwitch,
  /** Вызов функции сервера от имени вошедшего (одно соединение платформы; раздел администрирования своего клиента не создаёт). */
  rpc: async (fn: string, args?: Record<string, unknown>): Promise<{ data: unknown; error: { message: string; code?: string } | null }> => {
    getPlatform();
    const c = getClient();
    if (!c) return { data: null, error: { message: 'Сервер не настроен' } };
    const r = await c.rpc(fn, args || {});
    return { data: r.data, error: r.error ? { message: r.error.message, code: r.error.code } : null };
  }
};
