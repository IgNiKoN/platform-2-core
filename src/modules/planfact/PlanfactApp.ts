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
import type { CompanyAccess, ProjectsApi } from '../../platform/company/projects.service.ts';
import type { DataApi } from './data.service.ts';
import type { PlanfactDemo } from './model.ts';

type Mode = 'loading' | 'login' | 'authed' | 'demo';
type Tab = 'works' | 'projects';

const BASE = '#/planfact';
const TAB_LABELS: Record<Tab, string> = { works: 'Работы', projects: 'Проекты' };

/** Подвкладка из адреса #/planfact/<slug> (как у Quality); неизвестная → «Работы». */
export function tabFromHash(hash: string): Tab {
  const slug = String(hash || '').replace(/^#\/planfact\/?/, '').split('/')[0];
  return slug === 'projects' ? 'projects' : 'works';
}

function accessLabel(entries: AccessEntry[]): string {
  if (!entries.length) return 'нет назначенных ролей';
  const parts = entries.map((e) => `${e.company} · ${e.role}`);
  return Array.from(new Set(parts)).join('; ');
}

export function PlanfactApp(props: { auth: AuthApi | null; data: PlanfactDemo; api?: DataApi | null; projects?: ProjectsApi | null }): ReactElement {
  const { auth, data, api, projects } = props;
  const [mode, setMode] = useState<Mode>(auth ? 'loading' : 'demo');
  const [who, setWho] = useState('');
  const [access, setAccess] = useState<AccessEntry[]>([]);
  const [tab, setTabState] = useState<Tab>(tabFromHash(window.location.hash));
  const [companies, setCompanies] = useState<CompanyAccess[]>([]);

  useEffect(() => {
    const onHash = (): void => setTabState(tabFromHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function setTab(t: Tab): void {
    setTabState(t);
    window.location.hash = t === 'works' ? BASE : `${BASE}/${t}`;
  }

  async function enter(a: AuthApi): Promise<void> {
    const mail = await a.getEmail();
    if (!mail) { setMode('login'); return; }
    setWho(mail);
    setAccess(await a.getAccess());
    setCompanies(projects ? await projects.myAccess() : []);
    setMode('authed');
  }

  useEffect(() => {
    if (auth) void enter(auth);
  }, []);

  async function logout(): Promise<void> {
    if (auth) await auth.signOut();
    setWho(''); setAccess([]); setMode('login');
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

  // Подвкладки: «Проекты» видны, только если у пользователя есть доступ к компании (сервер решает; админ видит все).
  const tabs: Tab[] = mode === 'authed' && projects && companies.length ? ['works', 'projects'] : ['works'];
  const current: Tab = tabs.includes(tab) ? tab : 'works';
  const nav = tabs.length > 1
    ? h('div', { className: 'pf-tabs', role: 'tablist', 'data-testid': 'pf-tabs' },
        tabs.map((t) => h('button', { key: t, type: 'button', role: 'tab', 'aria-selected': current === t, 'data-tab': t,
          className: 'pf-tab' + (current === t ? ' pf-tab--active' : ''), onClick: () => setTab(t) }, TAB_LABELS[t])))
    : null;

  const body = mode === 'authed' && projects && current === 'projects'
    ? h(CompanyScope, { api: projects, render: (c) => h(ProjectsTab, { api: projects, company: c }) })
    : mode === 'authed' && api ? h(PlanfactWorks, { api }) : h(PlanfactTable, { data });
  return h('div', null, bar, nav, body);
}

export const PLANFACT_TABS_CSS = `
.pf-tabs{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 0 14px;padding-bottom:2px}
.pf-tab{flex:0 0 auto;font-size:13px;font-weight:700;padding:10px 16px;min-height:40px;border-radius:10px;border:1px solid var(--card-border);background:transparent;color:var(--text-muted);cursor:pointer;white-space:nowrap}
.pf-tab--active{background:var(--primary);border-color:var(--primary);color:var(--card-bg)}
`;

/** Стили входа перенесены в платформенный слой (LoginForm); имя сохранено для index.ts. */
export const PLANFACT_AUTH_CSS = PLATFORM_AUTH_CSS;
