/**
 * Вкладка «Проекты»: список проектов компании, создать, переименовать, архивировать / вернуть.
 * Без права planfact.projects.manage (can_manage) — только чтение. Адаптивно: строки переносятся на узком экране.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { CompanyAccess, ProjectItem, ProjectsApi } from './projects.service.ts';

export function ProjectsTab(props: { api: ProjectsApi; company: CompanyAccess; onOpen?: (p: ProjectItem) => void }): ReactElement {
  const { api, company, onOpen } = props;
  const [rows, setRows] = useState<ProjectItem[] | null>(null);
  const [editing, setEditing] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  async function load(): Promise<void> { setRows(await api.listProjects(company.company_id)); }
  useEffect(() => { void load(); }, []);

  async function run(p: Promise<{ ok: boolean; message?: string }>, done: string): Promise<boolean> {
    setBusy(true); setError(''); setNotice('');
    const res = await p;
    setBusy(false);
    if (!res.ok) { setError(res.message || 'Не удалось выполнить'); return false; }
    setNotice(done); await load(); return true;
  }

  async function create(ev: FormEvent): Promise<void> {
    ev.preventDefault();
    if (busy) return;
    const form = ev.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const code = (form.elements.namedItem('code') as HTMLInputElement).value.trim();
    if (!name) { setError('Введите название проекта'); return; }
    if (await run(api.createProject(company.company_id, name, code), 'Проект создан')) form.reset();
  }

  async function rename(ev: FormEvent, p: ProjectItem): Promise<void> {
    ev.preventDefault();
    if (busy) return;
    const form = ev.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const code = (form.elements.namedItem('code') as HTMLInputElement).value.trim();
    if (!name) { setError('Введите название проекта'); return; }
    if (await run(api.updateProject(p.id, name, code, null), 'Проект сохранён')) setEditing('');
  }

  if (rows === null) return h('div', { className: 'pf-muted' }, 'Загрузка…');
  const active = rows.filter((p) => !p.archived_at);
  const archived = rows.filter((p) => p.archived_at);
  const shown = showArchive ? rows : active;

  return h('div', { className: 'pj-tab', 'data-testid': 'pj-projects' },
    company.can_manage_projects
      ? h('form', { className: 'pf-card pj-form', onSubmit: create, 'data-testid': 'pj-create' },
          h('label', { className: 'pf-field pj-grow' }, 'Название проекта', h('input', { name: 'name', type: 'text', className: 'pj-input', maxLength: 200 })),
          h('label', { className: 'pf-field' }, 'Код (необязательно)', h('input', { name: 'code', type: 'text', className: 'pj-input', maxLength: 40 })),
          h('button', { type: 'submit', className: 'pf-btn', disabled: busy }, 'Создать проект'))
      : null,
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    notice ? h('div', { className: 'pj-notice', role: 'status' }, notice) : null,
    h('div', { className: 'pf-card pj-list' },
      shown.length ? shown.map((p) => editing === p.id
        ? h('form', { key: p.id, className: 'pj-row pj-row--edit', onSubmit: (e: FormEvent) => { void rename(e, p); }, 'data-project-id': p.id },
            h('input', { name: 'name', type: 'text', className: 'pj-input pj-grow', defaultValue: p.name, maxLength: 200, 'aria-label': 'Название' }),
            h('input', { name: 'code', type: 'text', className: 'pj-input pj-code', defaultValue: p.code || '', maxLength: 40, placeholder: 'Код', 'aria-label': 'Код' }),
            h('button', { type: 'submit', className: 'pf-btn', disabled: busy }, 'Сохранить'),
            h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => { setEditing(''); setError(''); } }, 'Отмена'))
        : h('div', { key: p.id, className: 'pj-row' + (p.archived_at ? ' pj-row--archived' : ''), 'data-project-id': p.id },
            h('div', { className: 'pj-name' }, h('b', null, p.name), p.code ? h('span', { className: 'pj-code-badge' }, p.code) : null,
              p.archived_at ? h('span', { className: 'pj-badge' }, 'в архиве') : null),
            h('div', { className: 'pj-actions' },
              onOpen && !p.archived_at ? h('button', { type: 'button', className: 'pf-btn', 'data-testid': 'pj-open', onClick: () => onOpen(p) }, 'Структура') : null,
              p.can_manage && !p.archived_at ? h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', 'data-testid': 'pj-rename', disabled: busy, onClick: () => { setEditing(p.id); setError(''); setNotice(''); } }, 'Изменить') : null,
              p.can_manage ? h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', 'data-testid': 'pj-archive', disabled: busy,
                onClick: () => { void run(api.updateProject(p.id, p.name, p.code || '', !p.archived_at), p.archived_at ? 'Проект возвращён из архива' : 'Проект перенесён в архив'); } },
                p.archived_at ? 'Вернуть из архива' : 'В архив') : null)))
      : h('div', { className: 'pj-empty pf-muted', 'data-testid': 'pj-empty' },
          company.can_manage_projects ? 'Проектов пока нет — создайте первый выше.' : 'Нет доступных проектов.')),
    archived.length ? h('button', { type: 'button', className: 'pf-btn pf-btn--ghost pj-toggle', onClick: () => setShowArchive(!showArchive) },
      showArchive ? 'Скрыть архив' : `Показать архив (${archived.length})`) : null);
}

export const PROJECTS_CSS = `
.pj-tab{display:flex;flex-direction:column;gap:12px}
.pj-form{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;padding:14px}
.pj-grow{flex:1 1 220px;min-width:0}
.pj-list{display:flex;flex-direction:column}
.pj-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--card-border)}
.pj-row:last-child{border-bottom:0}
.pj-row--archived{color:var(--text-muted)}
.pj-name{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;overflow-wrap:anywhere}
.pj-code-badge,.pj-badge{font-size:10px;font-weight:700;text-transform:uppercase;padding:1px 6px;border-radius:6px;border:1px solid var(--card-border);color:var(--text-muted)}
.pj-actions{display:flex;flex-wrap:wrap;gap:8px}
.pj-code{flex:0 1 120px}
.pj-empty{padding:18px 14px}
.pj-notice{font-size:12px;color:var(--color-green)}
.pj-toggle{align-self:flex-start}
@media (max-width:600px){.pj-actions{width:100%}.pj-actions .pf-btn{flex:1 1 auto}.pj-form .pf-btn{width:100%}}
`;
