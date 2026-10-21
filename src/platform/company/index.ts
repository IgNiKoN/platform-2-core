/**
 * Platform entry: раздел платформы «Компания» (Vite-бандл → js/dist/company/company.js).
 * Контракт: init(ctx) / mount(el) / unmount(). Пункт меню виден только при праве security.roles.assign
 * (флаг RBI.platformMenuAccess.company ставится по ответу сервера; сервер всё равно проверяет каждый вызов).
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
const VIEW_ID = 'tab-company';
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

function ensureView(): HTMLElement {
  let el = document.getElementById(VIEW_ID);
  if (el) return el;
  el = document.createElement('div');
  el.id = VIEW_ID;
  el.className = 'view-section hidden';
  const anchor = document.getElementById('tab-mode-placeholder');
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
  else document.body.appendChild(el);
  return el;
}

/** Маршрут #/company: показать вкладку и смонтировать экран (каждый заход — свежие данные с сервера). */
function showView(): void {
  const el = ensureView();
  document.querySelectorAll('.view-section').forEach((n) => n.classList.remove('active'));
  el.classList.add('active');
  const header = document.getElementById('main-header');
  if (header) header.style.display = 'none';
  mount(el);
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
  if (prev !== allowed && ctx && ctx.shell && typeof ctx.shell.renderSidebar === 'function') ctx.shell.renderSidebar();
}

export async function init(ctx?: ShellCtx): Promise<void> {
  const router = (window as unknown as { AppRouter?: { addRoute?: (p: string, fn: () => void) => void } }).AppRouter;
  if (router && typeof router.addRoute === 'function') {
    router.addRoute(ROUTE, showView);
    if (String(location.hash || '').indexOf(ROUTE) === 0) showView();
  }
  const a = getAuth();
  if (a && a.onAuthChange) a.onAuthChange(() => { void refreshMenu(ctx); });
  else await refreshMenu(ctx);
}
