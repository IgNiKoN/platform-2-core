/**
 * «Факт → На подтверждение» (P2-0007): записи, объём которых выше допуска плана. РП подтверждает (запись входит в итог)
 * или отклоняет с комментарием (прораб видит причину). Право planfact.fact.approve проверяет сервер.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { FactApi, FactPendingRow } from './fact.service.ts';
import { fmtQty, percent, fmtPct } from './fact.ts';
import { fmtWhen } from './FactHistory.ts';

export function FactPending(props: { api: FactApi; projectId: string; onChanged: () => void }): ReactElement {
  const { api, projectId, onChanged } = props;
  const [rows, setRows] = useState<FactPendingRow[] | null>(null);
  const [rejectId, setRejectId] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function load(): Promise<void> {
    const r = await api.pending(projectId);
    if (r.ok) { setRows(r.value); setError(''); } else { setRows([]); setError(r.message); }
  }
  useEffect(() => { void load(); }, [projectId]);

  async function decide(e: FactPendingRow, approve: boolean): Promise<void> {
    if (busy) return;
    if (!approve && !note.trim()) { setError('Напишите причину отказа'); return; }
    setBusy(true); setError(''); setNotice('');
    const r = await api.decide(e.id, approve, approve ? '' : note.trim());
    setBusy(false);
    if (!r.ok) { setError(r.message); return; }
    setRejectId(''); setNote(''); setNotice(approve ? 'Подтверждено — объём вошёл в итог' : 'Отклонено — прораб увидит причину');
    await load(); onChanged();
  }

  if (rows === null) return h('div', { className: 'pf-muted' }, 'Загрузка…');
  return h('div', { className: 'pj-tab', 'data-testid': 'ft-pending' },
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    notice ? h('div', { className: 'pj-notice', role: 'status' }, notice) : null,
    rows.length
      ? rows.map((e) => h('div', { key: e.id, className: 'pf-card ft-card', 'data-entry-id': e.id },
          h('div', { className: 'ft-name' }, h('b', null, e.work_name), h('span', { className: 'pf-muted' }, e.location_path)),
          h('div', null, `Внесено ${fmtQty(e.qty)} ${e.unit_code}; уже принято ${fmtQty(e.fact_qty)} из ${fmtQty(e.plan_qty)} (${fmtPct(percent(e.fact_qty, e.plan_qty))}). `,
            e.corrects_id ? null : h('b', { className: 'ft-bad' }, `После подтверждения: ${fmtPct(percent(e.fact_qty + e.qty, e.plan_qty))}`)),
          h('div', { className: 'pf-muted' }, `${e.created_by_email || '—'}, ${fmtWhen(e.created_at)} · ${e.brigade_name}${e.note ? ' · ' + e.note : ''}${e.corrects_id ? ' · исправление: ' + (e.correction_reason || '') : ''}`),
          rejectId === e.id
            ? h('div', { className: 'ft-edit' },
                h('label', { className: 'pf-field pj-grow' }, 'Причина отказа', h('input', { type: 'text', className: 'pj-input', value: note, maxLength: 300, 'data-testid': 'ft-reject-note', onChange: (ev) => setNote((ev.target as HTMLInputElement).value) })),
                h('span', { className: 'pj-actions' },
                  h('button', { type: 'button', className: 'pf-btn un-danger', disabled: busy, 'data-testid': 'ft-reject-yes', onClick: () => { void decide(e, false); } }, 'Отклонить'),
                  h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: () => { setRejectId(''); setNote(''); } }, 'Назад')))
            : h('span', { className: 'pj-actions' },
                h('button', { type: 'button', className: 'pf-btn', disabled: busy, 'data-testid': 'ft-approve', onClick: () => { void decide(e, true); } }, 'Подтвердить'),
                h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', disabled: busy, 'data-testid': 'ft-reject', onClick: () => { setRejectId(e.id); setError(''); } }, 'Отклонить'))))
      : h('div', { className: 'pf-card pj-empty pf-muted', 'data-testid': 'ft-pending-empty' }, 'Нет записей, ожидающих подтверждения.'));
}
