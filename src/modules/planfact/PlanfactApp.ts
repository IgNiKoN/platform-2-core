/**
 * Оболочка экрана «План/Факт»: вход (общая форма платформы LoginForm), шапка «кто · компания · роль», выход.
 * Нет настроек сервера → локальный демо-режим (как в P2-0002). «Работать локально» остаётся всегда.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { AccessEntry, AuthApi } from '../../platform/auth/auth.service.ts';
import { LoginForm, PLATFORM_AUTH_CSS } from '../../platform/auth/LoginForm.ts';
import { PlanfactTable } from './PlanfactTable.ts';
import { PlanfactWorks } from './PlanfactWorks.ts';
import { CompanyScope } from '../../platform/company/CompanyScope.ts';
import { ProjectsTab } from '../../platform/company/ProjectsTab.ts';
import { UnitsTab } from '../../platform/company/UnitsTab.ts';
import type { CompanyAccess, ProjectsApi } from '../../platform/company/projects.service.ts';
import type { DataApi } from './data.service.ts';
import type { PlanfactDemo } from './model.ts';

type Mode = 'loading' | 'login' | 'authed' | 'demo';
const BASE = '#/planfact';
/** Событие модуля: маршрут #/planfact… показан (его шлёт index.ts при каждом переходе роутера). */
export const ROUTE_EVENT = 'planfact:route';
type Page = 'works' | 'directories';
type Sub = 'objects' | 'units';
const SUBS: { id: Sub; label: string }[] = [{ id: 'objects', label: 'Объекты' }, { id: 'units', label: 'Единицы' }];

/** Адрес #/planfact[/directories[/objects]] → страница и вкладка справочников. Пункты верхнего уровня — в боковом меню (манифест модуля). */
export function routeFromHash(hash: string): { page: Page; sub: Sub } {
  const parts = String(hash || '').replace(/^#\/planfact\/?/, '').split('/');
  return { page: parts[0] === 'directories' ? 'directories' : 'works', sub: parts[1] === 'units' ? 'units' : 'objects' };
}

function accessLabel(entries: AccessEntry[]): string {
  if (!entries.length) return 'нет назначенных ролей';
  const parts = entries.map((e) => `${e.company} · ${e.role}`);
  return Array.from(new Set(parts)).join('; ');
}

export function PlanfactApp(props: { auth: AuthApi | null; data: PlanfactDemo; api?: DataApi | null; projects?: ProjectsApi | null; onAccess?: (hasDirectories: boolean) => void }): ReactElement {
  const { auth, data, api, projects, onAccess } = props;
  const [mode, setMode] = useState<Mode>(auth ? 'loading' : 'demo');
  const [who, setWho] = useState('');
  const [access, setAccess] = useState<AccessEntry[]>([]);
  const [route, setRoute] = useState(routeFromHash(window.location.hash));
  const [companies, setCompanies] = useState<CompanyAccess[]>([]);

  useEffect(() => {
    const onHash = (): void => setRoute(routeFromHash(window.location.hash));
    // Роутер оболочки переходит через history.pushState — hashchange при этом НЕ приходит; модуль шлёт planfact:route на каждый заход в маршрут.
    window.addEventListener('hashchange', onHash);
    window.addEventListener(ROUTE_EVENT, onHash);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener(ROUTE_EVENT, onHash); };
  }, []);

  async function enter(a: AuthApi): Promise<void> {
    const mail = await a.getEmail();
    if (!mail) { setMode('login'); return; }
    setWho(mail);
    setAccess(await a.getAccess());
    const comp = projects ? await projects.myAccess() : [];
    setCompanies(comp);
    if (onAccess) onAccess(comp.length > 0);
    setMode('authed');
  }

  useEffect(() => {
    if (auth) void enter(auth);
  }, []);

  async function logout(): Promise<void> {
    if (auth) await auth.signOut();
    setWho(''); setAccess([]); setCompanies([]); if (onAccess) onAccess(false); setMode('login');
  }

  if (mode === 'loading') return h('div', { className: 'pf-root pf-muted' }, 'Загрузка…');

  if (mode === 'login' && auth) {
    return h(LoginForm, { auth, title: 'Вход в План/Факт', onDone: () => { void enter(auth); },
      extra: h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => setMode('demo') }, 'Работать локально (демо)') });
  }

  const bar = mode === 'authed'
    ? h('div', { className: 'pf-bar', 'data-testid': 'pf-user' },
        h('span', null, h('b', null, who), ' · ', accessLabel(access)),
        h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: logout }, 'Выйти'))
    : auth
      ? h('div', { className: 'pf-bar' }, h('span', null, 'Локальный демо-режим, без входа'),
          h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => setMode('login') }, 'Войти'))
      : null;

  // «Справочники» открываются, только если сервер дал доступ к компании (пункт меню показывается по тому же признаку).
  const dirs = mode === 'authed' && projects && companies.length > 0 && route.page === 'directories';
  const go = (sub: Sub): void => {
    const path = `${BASE}/directories/${sub}`;
    const r = (window as unknown as { AppRouter?: { navigate?: (p: string) => void } }).AppRouter;
    if (r && typeof r.navigate === 'function') r.navigate(path); else window.location.hash = path;
  };
  const body = dirs && projects
    ? h(CompanyScope, { api: projects, render: (c) => route.sub === 'units' ? h(UnitsTab, { api: projects, company: c }) : h(ProjectsTab, { api: projects, company: c }) })
    : mode === 'authed' && api ? h(PlanfactWorks, { api }) : h(PlanfactTable, { data });
  const head = dirs
    ? h('div', { className: 'pf-root pf-dirhead' },
        h('h2', { className: 'pf-title' }, 'Справочники'),
        h('div', { className: 'pf-seg', role: 'tablist', 'data-testid': 'pf-dirtabs' },
          SUBS.map((t) => h('button', { key: t.id, type: 'button', role: 'tab', 'aria-selected': route.sub === t.id, 'data-sub': t.id,
            className: 'pf-seg-btn' + (route.sub === t.id ? ' pf-seg-btn--active' : ''), onClick: () => go(t.id) }, t.label))))
    : null;
  return h('div', null, bar, head, body);
}

export const PLANFACT_TABS_CSS = `
.pf-dirhead{padding-bottom:0;display:flex;flex-direction:column;gap:12px}
.pf-seg{display:flex;flex-wrap:nowrap;gap:var(--rbi-subtab-gap,6px);padding:4px;border:1px solid var(--card-border);border-radius:12px;background:var(--card-bg);overflow-x:auto;-webkit-overflow-scrolling:touch}
.pf-seg-btn{flex:1 1 0;min-width:5rem;min-height:40px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;padding:8px 12px;border-radius:8px;border:0;background:transparent;color:var(--text-muted);cursor:pointer;white-space:nowrap;text-align:center}
.pf-seg-btn--active{background:var(--accent,var(--primary));color:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}
`;

/** Стили входа перенесены в платформенный слой (LoginForm); имя сохранено для index.ts. */
export const PLANFACT_AUTH_CSS = PLATFORM_AUTH_CSS;
