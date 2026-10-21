/**
 * Platform entry: модуль «План/Факт» (Vite-бандл → js/dist/planfact/planfact.js).
 * Контракт модуля: init(ctx) / mount(el) / unmount(). Выключатель — manifest.enabled.
 */
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { PLANFACT_CSS } from './PlanfactTable.ts';
import { PlanfactApp, PLANFACT_AUTH_CSS, PLANFACT_TABS_CSS, ROUTE_EVENT } from './PlanfactApp.ts';
import { SCOPE_CSS } from '../../platform/company/CompanyScope.ts';
import { PROJECTS_CSS } from '../../platform/company/ProjectsTab.ts';
import { LOCATIONS_CSS } from '../../platform/company/LocationsTree.ts';
import { UNITS_CSS } from '../../platform/company/UnitsTab.ts';
import { createProjectsService } from '../../platform/company/projects.service.ts';
import type { ProjectsApi } from '../../platform/company/projects.service.ts';
import { PLANFACT_WORKS_CSS } from './PlanfactWorks.ts';
import { VOR_CSS } from './vor/VorTab.ts';
import { VOR_COLUMNS_CSS } from './vor/VorColumns.ts';
import { VOR_DRAFT_CSS } from './vor/VorDraft.ts';
import { VOR_WORKS_CSS } from './vor/VorWorks.ts';
import { createVorService } from './vor/vor.service.ts';
import type { VorApi } from './vor/vor.service.ts';
import { createDataService } from './data.service.ts';
import type { DataApi } from './data.service.ts';
import { createAuthService, readAuthConfig } from '../../platform/auth/auth.service.ts';
import type { AuthApi } from '../../platform/auth/auth.service.ts';
import type { PlanfactDemo } from './model.ts';
import demo from './demo-data.json' with { type: 'json' };

const ROUTE = '#/planfact';
const VIEW_ID = 'tab-planfact';
const STYLE_ID = 'planfact-style';

let root: Root | null = null;
let mountedEl: HTMLElement | null = null;
let auth: AuthApi | null | undefined;
let dataApi: DataApi | null = null;
let projectsApi: ProjectsApi | null = null;
let vorApi: VorApi | null = null;

function getAuth(): AuthApi | null {
  if (auth === undefined) {
    const cfg = readAuthConfig();
    auth = cfg ? createAuthService(cfg) : null;
    dataApi = auth ? createDataService() : null;
    projectsApi = auth ? createProjectsService() : null;
    vorApi = auth ? createVorService() : null;
  }
  return auth;
}

interface NavItem { id: string; label: string; path: string; icon?: string; requiresAccess?: boolean }
interface ShellCtx {
  shell?: { renderSidebar?: () => void } | null;
  nav?: NavItem[];   // подвкладки из манифеста (js/modules/planfact/planfact.manifest.js) — единственный источник
}

type RbiGlobal = { RBI?: { platformNav?: { id: string; title: string; items: { path: string; label: string; icon?: string }[] } | null } };
type ModeMgr = { AppModeManager?: { renderBottomNav?: () => void } };
let navItems: NavItem[] = [];
let hasDirectories = false;
let navActive = false;

/** Подвкладки модуля в нижнем таббаре (телефон/планшет) и nav2 (≥1280) — общий механизм оболочки window.RBI.platformNav. */
function syncPlatformNav(): void {
  const w = window as unknown as RbiGlobal & ModeMgr;
  w.RBI = w.RBI || {};
  w.RBI.platformNav = navActive
    ? { id: 'planfact', title: 'План/Факт', items: navItems.filter((i) => !i.requiresAccess || hasDirectories).map((i) => ({ path: i.path, label: i.label, icon: i.icon })) }
    : null;
  if (w.AppModeManager && typeof w.AppModeManager.renderBottomNav === 'function') w.AppModeManager.renderBottomNav();
}

function onAccess(has: boolean): void {
  if (has === hasDirectories) return;
  hasDirectories = has;
  if (navActive) syncPlatformNav();
}

function ensureStyle(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PLANFACT_CSS + PLANFACT_AUTH_CSS + PLANFACT_WORKS_CSS + PLANFACT_TABS_CSS + SCOPE_CSS + PROJECTS_CSS + LOCATIONS_CSS + UNITS_CSS + VOR_CSS + VOR_COLUMNS_CSS + VOR_DRAFT_CSS + VOR_WORKS_CSS;
  doc.head.appendChild(style);
}

/** Монтирует React-экран в el (синхронно: после вызова таблица уже в DOM). Повторный mount сначала размонтирует предыдущий. */
export function mount(el: HTMLElement): void {
  if (root) unmount();
  ensureStyle(el.ownerDocument);
  mountedEl = el;
  root = createRoot(el);
  const r = root;
  flushSync(() => r.render(createElement(PlanfactApp, { auth: getAuth(), data: demo as PlanfactDemo, api: dataApi, projects: projectsApi, vor: vorApi, onAccess })));
}

/** Снимает React-экран и очищает контейнер. Безопасен при повторном вызове. */
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

/** Маршрут #/planfact: показать вкладку модуля (как switchViewNode оболочки) и смонтировать экран. */
function showView(): void {
  const el = ensureView();
  document.querySelectorAll('.view-section').forEach((n) => n.classList.remove('active'));
  el.classList.add('active');
  const header = document.getElementById('main-header');
  if (header) header.style.display = 'none';
  if (mountedEl !== el || !root) mount(el);
  navActive = true;
  syncPlatformNav();
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export async function init(ctx?: ShellCtx): Promise<void> {
  if (ctx && Array.isArray(ctx.nav)) navItems = ctx.nav;
  window.addEventListener('hashchange', () => {
    if (navActive && String(location.hash || '').indexOf(ROUTE) !== 0) { navActive = false; syncPlatformNav(); }
  });
  const router = (window as unknown as { AppRouter?: { addRoute?: (p: string, fn: () => void) => void } }).AppRouter;
  if (router && typeof router.addRoute === 'function') {
    router.addRoute(ROUTE, showView);
    if (String(location.hash || '').indexOf(ROUTE) === 0) showView();
  }
  if (ctx && ctx.shell && typeof ctx.shell.renderSidebar === 'function') ctx.shell.renderSidebar();
}
