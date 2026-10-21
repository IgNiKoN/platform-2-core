/**
 * «Компания → Сотрудники»: участники компании (почта), их назначения (роль, проект или «все проекты», срок),
 * «Назначить роль», «Отозвать». Добавления новых людей нет (решение владельца 21.10.2026). Всё — через pf_*.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { CompanyApi, MemberRow, ProjectRef, RoleRow } from './company.service.ts';

const DAY = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short' });

interface Person { user_id: string; email: string; items: MemberRow[] }

function people(rows: MemberRow[]): Person[] {
  const map = new Map<string, Person>();
  for (const r of rows) {
    const p = map.get(r.user_id) || { user_id: r.user_id, email: r.email || '—', items: [] };
    if (r.assignment_id) p.items.push(r);
    map.set(r.user_id, p);
  }
  return Array.from(map.values());
}

function status(r: MemberRow): string {
  if (r.is_active) return r.valid_to ? `до ${DAY.format(new Date(r.valid_to))}` : 'бессрочно';
  if (r.valid_to && new Date(r.valid_to) <= new Date()) return `истекло ${DAY.format(new Date(r.valid_to))}`;
  return r.valid_from ? `с ${DAY.format(new Date(r.valid_from))}` : 'не действует';
}

/** Дата из поля «Срок до» → конец этого дня по местному времени. Пусто → бессрочно. */
export function endOfDayIso(date: string): string | null {
  if (!date) return null;
  const d = new Date(`${date}T23:59:59`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function CompanyMembers(props: { api: CompanyApi; companyId: string; me: string }): ReactElement {
  const { api, companyId, me } = props;
  const [rows, setRows] = useState<MemberRow[] | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [projects, setProjects] = useState<ProjectRef[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState('');

  async function load(): Promise<void> {
    const [m, r, p] = await Promise.all([api.listMembers(companyId), api.listRoles(companyId), api.listProjects()]);
    setRows(m); setRoles(r); setProjects(p.filter((x) => x.company_id === companyId));
  }
  useEffect(() => { setRows(null); void load(); }, [companyId]);

  async function assign(ev: FormEvent): Promise<void> {
    ev.preventDefault();
    if (busy) return;
    const form = ev.currentTarget as HTMLFormElement;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement).value;
    const user = val('user'), role = val('role'), project = val('project'), until = val('until');
    if (!user || !role) { setError('Выберите сотрудника и роль'); return; }
    setBusy(true); setError(''); setNotice('');
    const res = await api.assignRole(user, role, project || null, endOfDayIso(until));
    setBusy(false);
    if (!res.ok) { setError(res.message); return; }
    form.reset();
    setNotice('Роль назначена — права действуют со следующего запроса');
    await load();
  }

  async function revoke(id: string): Promise<void> {
    if (busy) return;
    setConfirmRevoke(''); setBusy(true); setError(''); setNotice('');
    const res = await api.revoke(id);
    setBusy(false);
    if (!res.ok) { setError(res.message); return; }
    setNotice('Назначение отозвано');
    await load();
  }

  if (rows === null) return h('div', { className: 'pf-muted' }, 'Загрузка…');
  const list = people(rows);

  return h('div', { className: 'co-members', 'data-testid': 'co-members' },
    h('form', { className: 'co-panel co-row', onSubmit: assign, 'data-testid': 'co-assign' },
      h('label', { className: 'pf-field co-grow' }, 'Сотрудник',
        h('select', { name: 'user', className: 'co-input', defaultValue: '' },
          h('option', { value: '' }, '— выберите —'),
          list.map((p) => h('option', { key: p.user_id, value: p.user_id, disabled: p.email === me }, p.email === me ? `${p.email} (вы)` : p.email)))),
      h('label', { className: 'pf-field co-grow' }, 'Роль',
        h('select', { name: 'role', className: 'co-input', defaultValue: '' },
          h('option', { value: '' }, '— выберите —'),
          roles.map((r) => h('option', { key: r.id, value: r.id }, r.name)))),
      h('label', { className: 'pf-field co-grow' }, 'Проект',
        h('select', { name: 'project', className: 'co-input', defaultValue: '' },
          h('option', { value: '' }, 'Все проекты компании'),
          projects.map((p) => h('option', { key: p.id, value: p.id }, p.name)))),
      h('label', { className: 'pf-field' }, 'Срок до (необязательно)', h('input', { name: 'until', type: 'date', className: 'co-input' })),
      h('button', { type: 'submit', className: 'pf-btn', disabled: busy }, 'Назначить роль')),
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    notice ? h('div', { className: 'co-notice', role: 'status' }, notice) : null,
    h('div', { className: 'co-card' },
      h('table', { className: 'co-table' },
        h('thead', null, h('tr', null, h('th', null, 'Сотрудник'), h('th', null, 'Роль'), h('th', null, 'Проект'), h('th', null, 'Срок'), h('th', null, ''))),
        h('tbody', null, list.flatMap((p) => (p.items.length ? p.items : [null]).map((r, i) =>
          h('tr', { key: p.user_id + (r ? r.assignment_id : ''), 'data-assignment-id': r ? r.assignment_id : undefined, className: r && !r.is_active ? 'co-inactive' : '' },
            h('td', null, i === 0 ? p.email + (p.email === me ? ' (вы)' : '') : ''),
            h('td', null, r ? r.role_name : h('span', { className: 'pf-muted' }, 'нет ролей')),
            h('td', null, r ? (r.project_name || 'Все проекты') : ''),
            h('td', { className: 'co-nowrap' }, r ? status(r) : ''),
            h('td', { className: 'co-nowrap' }, !r ? null : confirmRevoke === r.assignment_id
              ? h('span', { className: 'co-row' },
                  h('button', { type: 'button', className: 'pf-btn co-danger co-btn-sm', 'data-testid': 'co-revoke-yes', onClick: () => { void revoke(r.assignment_id!); } }, 'Да, отозвать'),
                  h('button', { type: 'button', className: 'pf-btn pf-btn--ghost co-btn-sm', onClick: () => setConfirmRevoke('') }, 'Нет'))
              : h('button', { type: 'button', className: 'pf-btn pf-btn--ghost co-btn-sm', 'data-testid': 'co-revoke', disabled: busy, onClick: () => setConfirmRevoke(r.assignment_id!) }, 'Отозвать'))))))))
  );
}

export const COMPANY_MEMBERS_CSS = `
.co-members{display:flex;flex-direction:column;gap:12px}
.co-input{font-size:14px;padding:9px 12px;border:1px solid var(--card-border);border-radius:10px;background:var(--card-bg);color:var(--text-main);text-transform:none;font-weight:400}
.co-card{overflow-x:auto}
.co-table{width:100%;border-collapse:collapse;font-size:13px}
.co-table th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted);padding:10px 14px;border-bottom:1px solid var(--card-border);white-space:nowrap}
.co-table td{padding:8px 14px;border-bottom:1px solid var(--card-border);vertical-align:middle}
.co-table tbody tr:last-child td{border-bottom:0}
.co-inactive td{color:var(--text-muted)}
.co-nowrap{white-space:nowrap}
.co-btn-sm{padding:6px 10px;font-size:12px}
`;
