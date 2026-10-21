/**
 * Общая форма входа Platform 2.0 (почта + пароль). Используется разделами «План/Факт» и «Компания».
 * Сессия одна на страницу (auth.service): вошли в одном разделе — вошли во всех.
 */
import { createElement as h, useState } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import type { AuthApi } from './auth.service.ts';

export function LoginForm(props: { auth: AuthApi; title: string; onDone: () => void; extra?: ReactNode }): ReactElement {
  const { auth, title, onDone, extra } = props;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(ev: FormEvent): Promise<void> {
    ev.preventDefault();
    if (busy) return;
    const form = ev.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (!email.trim() || !password) { setError('Введите почту и пароль'); return; }
    setBusy(true); setError('');
    const res = await auth.signIn(email, password);
    setBusy(false);
    if (!res.ok) { setError(res.message); return; }
    form.reset();
    onDone();
  }

  return h('div', { className: 'pf-root' },
    h('form', { className: 'pf-login pf-card', onSubmit: submit, 'data-testid': 'pf-login' },
      h('h2', { className: 'pf-title' }, title),
      h('label', { className: 'pf-field' }, 'Почта',
        h('input', { type: 'email', name: 'email', autoComplete: 'username' })),
      h('label', { className: 'pf-field' }, 'Пароль',
        h('input', { type: 'password', name: 'password', autoComplete: 'current-password' })),
      error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
      h('button', { type: 'submit', className: 'pf-btn', disabled: busy }, busy ? 'Входим…' : 'Войти'),
      extra || null
    )
  );
}

/** Общие стили входа и базовых элементов (токены оболочки, светлая/тёмная тема). */
export const PLATFORM_AUTH_CSS = `
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
