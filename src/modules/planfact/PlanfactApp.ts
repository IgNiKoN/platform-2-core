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
import type { DataApi } from './data.service.ts';
import type { PlanfactDemo } from './model.ts';

type Mode = 'loading' | 'login' | 'authed' | 'demo';

function accessLabel(entries: AccessEntry[]): string {
  if (!entries.length) return 'нет назначенных ролей';
  const parts = entries.map((e) => `${e.company} · ${e.role}`);
  return Array.from(new Set(parts)).join('; ');
}

export function PlanfactApp(props: { auth: AuthApi | null; data: PlanfactDemo; api?: DataApi | null }): ReactElement {
  const { auth, data, api } = props;
  const [mode, setMode] = useState<Mode>(auth ? 'loading' : 'demo');
  const [who, setWho] = useState('');
  const [access, setAccess] = useState<AccessEntry[]>([]);

  async function enter(a: AuthApi): Promise<void> {
    const mail = await a.getEmail();
    if (!mail) { setMode('login'); return; }
    setWho(mail);
    setAccess(await a.getAccess());
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

  return h('div', null, bar, mode === 'authed' && api ? h(PlanfactWorks, { api }) : h(PlanfactTable, { data }));
}

/** Стили входа перенесены в платформенный слой (LoginForm); имя сохранено для index.ts. */
export const PLANFACT_AUTH_CSS = PLATFORM_AUTH_CSS;
