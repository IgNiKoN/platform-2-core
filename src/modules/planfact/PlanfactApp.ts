/**
 * Оболочка экрана «План/Факт»: вход по почте и паролю, шапка «кто · компания · роль», выход.
 * Нет настроек сервера → локальный демо-режим (как в P2-0002). «Работать локально» остаётся всегда.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { AccessEntry, AuthApi } from '../../platform/auth/auth.service.ts';
import { PlanfactTable } from './PlanfactTable.ts';
import type { PlanfactDemo } from './model.ts';

type Mode = 'loading' | 'login' | 'authed' | 'demo';

function accessLabel(entries: AccessEntry[]): string {
  if (!entries.length) return 'нет назначенных ролей';
  const parts = entries.map((e) => `${e.company} · ${e.role}`);
  return Array.from(new Set(parts)).join('; ');
}

export function PlanfactApp(props: { auth: AuthApi | null; data: PlanfactDemo }): ReactElement {
  const { auth, data } = props;
  const [mode, setMode] = useState<Mode>(auth ? 'loading' : 'demo');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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

  async function submit(ev: FormEvent): Promise<void> {
    ev.preventDefault();
    if (!auth || busy) return;
    const form = ev.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (!email.trim() || !password) { setError('Введите почту и пароль'); return; }
    setBusy(true); setError('');
    const res = await auth.signIn(email, password);
    setBusy(false);
    if (!res.ok) { setError(res.message); return; }
    form.reset();
    await enter(auth);
  }

  async function logout(): Promise<void> {
    if (auth) await auth.signOut();
    setWho(''); setAccess([]); setMode('login');
  }

  if (mode === 'loading') return h('div', { className: 'pf-root pf-muted' }, 'Загрузка…');

  if (mode === 'login') {
    return h('div', { className: 'pf-root' },
      h('form', { className: 'pf-login pf-card', onSubmit: submit, 'data-testid': 'pf-login' },
        h('h2', { className: 'pf-title' }, 'Вход в План/Факт'),
        h('label', { className: 'pf-field' }, 'Почта',
          h('input', { type: 'email', name: 'email', autoComplete: 'username' })),
        h('label', { className: 'pf-field' }, 'Пароль',
          h('input', { type: 'password', name: 'password', autoComplete: 'current-password' })),
        error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
        h('button', { type: 'submit', className: 'pf-btn', disabled: busy }, busy ? 'Входим…' : 'Войти'),
        h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => setMode('demo') }, 'Работать локально (демо)')
      )
    );
  }

  const bar = mode === 'authed'
    ? h('div', { className: 'pf-bar', 'data-testid': 'pf-user' },
        h('span', null, h('b', null, who), ' · ', accessLabel(access)),
        h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: logout }, 'Выйти'))
    : auth
      ? h('div', { className: 'pf-bar' }, h('span', null, 'Локальный демо-режим, без входа'),
          h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => setMode('login') }, 'Войти'))
      : null;

  return h('div', null, bar, h(PlanfactTable, { data }));
}

export const PLANFACT_AUTH_CSS = `
.pf-login{max-width:380px;margin:24px auto;padding:20px;display:flex;flex-direction:column;gap:12px}
.pf-field{display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-muted)}
.pf-field input{font-size:14px;padding:9px 12px;border:1px solid var(--card-border);border-radius:10px;background:var(--card-bg);color:var(--text-main)}
.pf-btn{font-size:13px;font-weight:700;padding:10px 14px;border-radius:10px;border:1px solid var(--primary);background:var(--primary);color:var(--card-bg);cursor:pointer}
.pf-btn:disabled{opacity:.6;cursor:default}
.pf-btn--ghost{background:transparent;color:var(--text-main);border-color:var(--card-border)}
.pf-error{font-size:12px;color:var(--color-red)}
.pf-bar{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:10px 24px;font-size:12px;color:var(--text-muted);border-bottom:1px solid var(--card-border)}
.pf-bar b{color:var(--text-main)}
.pf-muted{color:var(--text-muted);font-size:13px}
`;
