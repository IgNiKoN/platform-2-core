/**
 * «План/Факт → Сводка» (P2-0008): портфель объектов руководителя — готовность по деньгам договорной КП, темп 7/14 дней,
 * нужный темп, прогноз и светофор, «не выставлено в КС-2»; плановые даты проекта правит РП (право projects.manage).
 * Все числа — с сервера (единый расчёт summary_project); без права money.view сервер не присылает ₽ и общий %.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { SummaryApi, SummaryProject } from './summary.service.ts';
import { LIGHT_LABEL, dateOr, lightText, pctText, rub, rubDay } from './model.ts';

export function SummaryTab(props: { api: SummaryApi }): ReactElement {
  const { api } = props;
  const [list, setList] = useState<SummaryProject[] | null>(null);
  const [error, setError] = useState('');
  const [datesId, setDatesId] = useState('');

  async function load(): Promise<void> {
    setError('');
    const r = await api.portfolio();
    if (!r.ok) { setError(r.message); setList([]); return; }
    setList(r.value);
  }
  useEffect(() => { void load(); }, []);

  if (list === null) return h('div', { className: 'pf-muted' }, 'Загрузка…');
  const anyMoney = list.some((p) => p.can_money);
  return h('div', { className: 'pj-tab sm-tab', 'data-testid': 'sm-tab' },
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    !error && !list.length ? h('div', { className: 'pf-card pj-empty pf-muted', 'data-testid': 'sm-empty' }, 'Нет объектов: сводка видна по проектам, где у вас есть право просмотра факта.') : null,
    list.length && !anyMoney ? h('div', { className: 'pf-muted sm-note', 'data-testid': 'sm-nomoney' }, 'Суммы в рублях и общий % готовности видят РП, ПТО, экономист и руководство. Объёмы — в разделе «Факт».') : null,
    list.map((p) => h(ProjectCard, { key: p.project_id, p, api, editing: datesId === p.project_id,
      onEdit: () => setDatesId(datesId === p.project_id ? '' : p.project_id), onSaved: () => { setDatesId(''); void load(); } })));
}

function ProjectCard(props: { p: SummaryProject; api: SummaryApi; editing: boolean; onEdit: () => void; onSaved: () => void }): ReactElement {
  const { p, api, editing, onEdit, onSaved } = props;
  const pct = p.pct_money;
  const metric = (label: string, value: string, id: string, hint?: string) =>
    h('div', { className: 'sm-metric', 'data-metric': id }, h('span', { className: 'sm-mlabel' }, label), h('b', { className: 'sm-mvalue' }, value), hint ? h('span', { className: 'pf-muted sm-mhint' }, hint) : null);
  return h('div', { className: `pf-card sm-card sm-card--${p.light}`, 'data-project-id': p.project_id },
    h('div', { className: 'sm-head' },
      h('div', { className: 'sm-name' }, h('b', null, p.name), p.code ? h('span', { className: 'pf-muted' }, ` · ${p.code}`) : null),
      h('span', { className: `sm-light sm-light--${p.light}`, 'data-testid': 'sm-light', title: lightText(p) }, h('i', { className: 'sm-dot' }), LIGHT_LABEL[p.light])),
    h('div', { className: 'pf-muted sm-why', 'data-testid': 'sm-why' }, lightText(p)),
    p.can_money && pct !== null
      ? h('div', { className: 'sm-progress' },
          h('div', { className: 'sm-pctline' }, h('b', { className: 'sm-pct', 'data-testid': 'sm-pct' }, pctText(pct)), h('span', { className: 'pf-muted' }, ' готовности по деньгам КП'),
            h('span', { className: 'sm-done', 'data-testid': 'sm-done' }, `${rub(p.done_money)} из ${rub(p.plan_money)}`)),
          h('div', { className: 'ft-bar', role: 'progressbar', 'aria-valuenow': Math.min(100, pct), 'aria-valuemin': 0, 'aria-valuemax': 100 },
            h('div', { className: 'ft-bar-fill', style: { width: `${Math.min(100, pct)}%` } })))
      : null,
    h('div', { className: 'sm-metrics' },
      p.can_money ? metric('Темп 7 дней', rubDay(p.pace7), 'pace7') : null,
      p.can_money ? metric('Темп 14 дней', rubDay(p.pace14), 'pace14') : null,
      p.can_money ? metric('Нужный темп', rubDay(p.need_pace), 'need', p.days_left !== null && p.days_left > 0 ? `до окончания ${p.days_left} дн.` : undefined) : null,
      p.can_money ? metric('Прогноз окончания', dateOr(p.forecast_finish), 'forecast') : null,
      metric('Плановые сроки', p.planned_start || p.planned_finish ? `${dateOr(p.planned_start)} — ${dateOr(p.planned_finish)}` : 'не заданы', 'dates'),
      p.can_money ? metric('Сделано, не выставлено в КС-2', rub(p.gap_money), 'gap', p.issued_money !== null ? `выставлено ${rub(p.issued_money)}` : undefined) : null,
      metric('Позиций ВОР', String(p.positions), 'positions', p.pending ? `ждут подтверждения: ${p.pending}` : undefined)),
    p.can_money && p.unpriced_rows ? h('div', { className: 'ft-warn', 'data-testid': 'sm-unpriced' }, `Строк ВОР без цены в договорной КП: ${p.unpriced_rows} — в готовность по деньгам не входят.`) : null,
    p.can_manage ? h('div', { className: 'pj-actions' }, h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', 'data-testid': 'sm-dates-btn', onClick: onEdit }, editing ? 'Закрыть' : 'Даты проекта')) : null,
    editing ? h(DatesForm, { api, p, onSaved }) : null);
}

function DatesForm(props: { api: SummaryApi; p: SummaryProject; onSaved: () => void }): ReactElement {
  const { api, p, onSaved } = props;
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(ev: FormEvent): Promise<void> {
    ev.preventDefault();
    if (busy) return;
    const f = ev.currentTarget as HTMLFormElement;
    const val = (k: string): string | null => (f.elements.namedItem(k) as HTMLInputElement).value.trim() || null;
    const start = val('start'), finish = val('finish');
    if (start && finish && start > finish) { setError('Дата начала позже даты окончания'); return; }
    setBusy(true); setError('');
    const r = await api.setDates(p.project_id, start, finish);
    setBusy(false);
    if (!r.ok) { setError(r.message); return; }
    onSaved();
  }
  return h('form', { className: 'pj-form sm-dates', onSubmit: (e: FormEvent) => { void submit(e); }, 'data-testid': 'sm-dates-form' },
    h('label', { className: 'pf-field' }, 'Плановое начало', h('input', { name: 'start', type: 'date', className: 'pj-input', defaultValue: p.planned_start || '', 'data-testid': 'sm-start' })),
    h('label', { className: 'pf-field' }, 'Плановое окончание', h('input', { name: 'finish', type: 'date', className: 'pj-input', defaultValue: p.planned_finish || '', 'data-testid': 'sm-finish' })),
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    h('div', { className: 'pj-actions' }, h('button', { type: 'submit', className: 'pf-btn', disabled: busy, 'data-testid': 'sm-dates-save' }, 'Сохранить')));
}

export const SUMMARY_CSS = `
.sm-tab{max-width:1400px}
.sm-note{font-size:12px}
.sm-card{display:flex;flex-direction:column;gap:10px;padding:14px 16px;overflow:visible;border-left:4px solid var(--card-border)}
.sm-card--green{border-left-color:var(--color-green)}
.sm-card--yellow{border-left-color:var(--color-yellow)}
.sm-card--red{border-left-color:var(--color-red)}
.sm-card--yellow .ft-bar-fill{background:var(--color-yellow)}
.sm-card--red .ft-bar-fill{background:var(--color-red)}
.sm-card--grey .ft-bar-fill{background:var(--text-muted)}
.sm-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.sm-name{font-size:15px;min-width:0;overflow-wrap:anywhere}
.sm-light{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:3px 10px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}
.sm-dot{width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block}
.sm-light--green{color:var(--color-green)}
.sm-light--yellow{color:var(--color-yellow)}
.sm-light--red{color:var(--color-red)}
.sm-light--grey{color:var(--text-muted)}
.sm-why{font-size:12px}
.sm-progress{display:flex;flex-direction:column;gap:6px}
.sm-pctline{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 6px;font-size:13px}
.sm-pct{font-size:22px}
.sm-done{margin-left:auto;font-weight:700}
.sm-metrics{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px 16px}
.sm-metric{display:flex;flex-direction:column;gap:2px;min-width:0}
.sm-mlabel{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted)}
.sm-mvalue{font-size:14px;overflow-wrap:anywhere}
.sm-mhint{font-size:11px}
.sm-dates{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:flex-end}
@media (max-width:760px){
.sm-done{margin-left:0;flex-basis:100%}
.sm-metrics{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.sm-dates .pf-field{flex:1 1 140px}
}
`;
