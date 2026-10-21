/**
 * Platform entry: раздел платформы «Компания» (Vite-бандл → js/dist/company/company.js).
 * Контракт: init(ctx) / mount(el) / unmount(). Экран монтируется в подраздел Настроек «Компания» (RBI.platformPanels.company);
 * подраздел виден при праве security.roles.assign (флаг RBI.platformMenuAccess.company по ответу сервера; сервер проверяет каждый вызов).
 */
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { CompanyApp, COMPANY_CSS } from './CompanyApp.ts';
import { createCompanyService } from './company.service.ts';
import type { CompanyApi } from './company.service.ts';
import { createAuthService, readAuthConfig } from '../auth/auth.service.ts';
import type { AuthApi } from '../auth/auth.service.ts';
import { PLATFORM_AUTH_CSS } from '../auth/LoginForm.ts';

const ROUTE = '#/company';
const STYLE_ID = 'company-style';

let root: Root | null = null;
let mountedEl: HTMLElement | null = null;
let auth: AuthApi | null | undefined;
let api: CompanyApi | null = null;

function getAuth(): AuthApi | null {
  if (auth === undefined) {
    const cfg = readAuthConfig();
    auth = cfg ? createAuthService(cfg) : null;
    api = auth ? createCompanyService() : null;
  }
  return auth;
}

interface ShellCtx {
  shell?: { renderSidebar?: () => void } | null;
}

function ensureStyle(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PLATFORM_AUTH_CSS + COMPANY_CSS;
  doc.head.appendChild(style);
}

export function mount(el: HTMLElement): void {
  if (root) unmount();
  ensureStyle(el.ownerDocument);
  mountedEl = el;
  root = createRoot(el);
  const r = root;
  const a = getAuth();
  flushSync(() => r.render(createElement(CompanyApp, { auth: a, api })));
}

export function unmount(): void {
  if (root) root.unmount();
  root = null;
  if (mountedEl) mountedEl.replaceChildren();
  mountedEl = null;
}

export function isMounted(): boolean {
  return root !== null;
}

/** Старый адрес #/company → подраздел Настроек «Компания» (решение владельца 21.10.2026). */
function showView(): void {
  const router = (window as unknown as { AppRouter?: { navigate?: (p: string, replace?: boolean) => void } }).AppRouter;
  if (router && typeof router.navigate === 'function') router.navigate('#/settings/company', true);
}

/** Видимость пункта меню: спросить сервер, есть ли у вошедшего право управлять ролями хоть в одной компании. */
async function refreshMenu(ctx?: ShellCtx): Promise<void> {
  const a = getAuth();
  let allowed = false;
  if (a && api && (await a.getEmail())) allowed = (await api.myAdminCompanies()).length > 0;
  const w = window as unknown as { RBI?: Record<string, unknown> };
  w.RBI = w.RBI || {};
  const access = (w.RBI.platformMenuAccess as Record<string, boolean> | undefined) || {};
  const prev = access.company === true;
  access.company = allowed;
  w.RBI.platformMenuAccess = access;
  if (prev !== allowed) window.dispatchEvent(new Event('rbi:platform-access'));   // Настройки показывают/прячут подраздел «Компания»
}

export async function init(ctx?: ShellCtx): Promise<void> {
  const rbi = ((window as unknown as { RBI?: Record<string, unknown> }).RBI = (window as unknown as { RBI?: Record<string, unknown> }).RBI || {});
  rbi.platformPanels = Object.assign((rbi.platformPanels as object) || {}, { company: { mount, unmount } });
  const router = (window as unknown as { AppRouter?: { addRoute?: (p: string, fn: () => void) => void } }).AppRouter;
  if (router && typeof router.addRoute === 'function') {
    router.addRoute(ROUTE, showView);
    if (String(location.hash || '').indexOf(ROUTE) === 0) showView();
  }
  const a = getAuth();
  if (a && a.onAuthChange) a.onAuthChange(() => { void refreshMenu(ctx); });
  else await refreshMenu(ctx);
}
