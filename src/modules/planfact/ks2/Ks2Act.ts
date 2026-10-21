/**
 * Акт КС-2 (P2-0008b): шапка-реквизиты и строки заказчика — «с начала работ», «выставлено ранее», «по системе» (с сервера)
 * и итог ПТО («в акт», цена, исключить). «Сохранить» — новая неизменяемая редакция; сервер пересчитывает предложение.
 * Выданный и аннулированный акт — только просмотр своей редакции.
 */
import { createElement as h, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { Ks2ActData, Ks2Api } from './ks2.service.ts';
import { actTotal, emptyKs2Header, isEdited, ks2Problems, rowCost, ruDate, type Ks2Header, type Ks2Row } from './form.ts';
import { actHeader, actRowsOf, snapshotOf, STATUS_LABEL, toEdits } from './model.ts';
import { money } from '../estimate/prices.ts';
import { fmtQty, parseQty } from '../fact/fact.ts';

const FIELDS: { key: keyof Ks2Header; label: string; date?: boolean; wide?: boolean }[] = [
  { key: 'customer', label: 'Заказчик (генподрядчик)', wide: true }, { key: 'contractor', label: 'Подрядчик (субподрядчик)', wide: true },
  { key: 'investor', label: 'Инвестор', wide: true }, { key: 'construction', label: 'Стройка', wide: true }, { key: 'object', label: 'Объект', wide: true },
  { key: 'contract_no', label: 'Договор №' }, { key: 'contract_date', label: 'Дата договора', date: true },
  { key: 'act_no', label: '№ акта' }, { key: 'act_date', label: 'Дата акта', date: true },
  { key: 'contractor_signer', label: 'Сдал (должность, ФИО)', wide: true }, { key: 'customer_signer', label: 'Принял (должность, ФИО)', wide: true },
];
const numText = (v: number | null): string => (v === null ? '' : String(v).replace('.', ','));

export function Ks2Act(props: { api: Ks2Api; actId: string; canEdit: boolean; onBack: () => void }): ReactElement {
  const { api, actId, canEdit, onBack } = props;
  const [data, setData] = useState<Ks2ActData | null>(null);
  const [rows, setRows] = useState<Ks2Row[]>([]);
  const [header, setHeader] = useState<Ks2Header>(emptyKs2Header());
  const [text, setText] = useState<Record<string, { qty: string; price: string }>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function load(): Promise<void> {
    const r = await api.act(actId);
    if (!r.ok) { setError(r.message); return; }
    const rs = actRowsOf(r.value);
    setData(r.value); setRows(rs); setHeader(actHeader(r.value)); setDirty(false);
    setText(Object.fromEntries(rs.map((x) => [x.source_row_id, { qty: numText(x.qty), price: numText(x.price) }])));
  }
  useEffect(() => { void load(); }, [actId]);

  if (!data) return h('div', { className: 'pj-tab' }, error ? h('div', { className: 'pf-error', role: 'alert' }, error) : h('div', { className: 'pf-muted' }, 'Загрузка…'));

  const act = data.act;
  const editable = canEdit && act.status === 'draft';
  const snap = snapshotOf(header, rows);
  const total = actTotal(snap);
  const problems = ks2Problems(snap);
  const edited = rows.filter(isEdited).length;

  const patchRow = (id: string, f: (r: Ks2Row) => Ks2Row): void => { setRows(rows.map((r) => (r.source_row_id === id ? f(r) : r))); setDirty(true); setNotice(''); };
  function onNum(id: string, field: 'qty' | 'price', value: string): void {
    setText({ ...text, [id]: { ...text[id], [field]: value } });
    const v = value.trim() === '' ? null : parseQty(value);
    if (field === 'qty') patchRow(id, (r) => ({ ...r, qty: v === null || v < 0 ? r.qty : v }));
    else patchRow(id, (r) => ({ ...r, price: value.trim() === '' ? null : v === null || v < 0 ? r.price : Math.round(v * 100) / 100 }));
  }
  function resetRow(r: Ks2Row): void {
    patchRow(r.source_row_id, (x) => ({ ...x, qty: x.sys_qty, price: x.sys_price, excluded: false }));
    setText({ ...text, [r.source_row_id]: { qty: numText(r.sys_qty), price: numText(r.sys_price) } });
  }

  async function save(): Promise<void> {
    if (busy) return;
    const bad = rows.find((r) => { const t = text[r.source_row_id]; return t && t.qty.trim() !== '' && parseQty(t.qty) === null; });
    if (bad) { setError(`Неверный объём в строке «${bad.name}»`); return; }
    setBusy(true); setError('');
    const r = await api.save(actId, header, toEdits(rows), '');
    setBusy(false);
    if (!r.ok) { setError(r.message); return; }
    await load();
    setNotice(`Сохранена редакция ${r.value}`);
  }

  const headForm = h('details', { className: 'pf-card k2-head', 'data-testid': 'k2-head' },
    h('summary', null, h('b', null, 'Реквизиты шапки'), h('span', { className: header.customer ? 'pf-muted' : 'ft-warn' }, ` ${header.customer || 'заказчик не указан'} · договор ${header.contract_no || '—'}`)),
    h('div', { className: 'k2-head-grid' }, FIELDS.map((f) => h('label', { key: f.key, className: 'pf-field' + (f.wide ? ' k2-wide' : '') }, f.label,
      h('input', { className: 'pj-input', type: f.date ? 'date' : 'text', value: header[f.key], disabled: !editable, maxLength: 500, 'data-field': f.key,
        onChange: (e) => { setHeader({ ...header, [f.key]: (e.target as HTMLInputElement).value }); setDirty(true); setNotice(''); } })))),
    h('div', { className: 'pf-muted k2-hint' }, 'Реквизиты запоминаются для следующих актов проекта.'));

  const table = h('div', { className: 'pf-card k2-rows', 'data-testid': 'k2-rows' },
    h('div', { className: 'k2-row k2-row--head' }, h('span', null, '№'), h('span', null, 'Наименование (как у заказчика)'), h('span', null, 'ЕИ'),
      h('span', { className: 'pf-num' }, 'С начала работ'), h('span', { className: 'pf-num' }, 'Выставлено ранее'), h('span', { className: 'pf-num' }, 'По системе'),
      h('span', { className: 'pf-num' }, 'В акт'), h('span', { className: 'pf-num' }, 'Цена, ₽'), h('span', { className: 'pf-num' }, 'Сумма, ₽'), h('span', null)),
    rows.map((r) => {
      const ed = isEdited(r);
      const t = text[r.source_row_id] || { qty: '', price: '' };
      return h('div', { key: r.source_row_id, className: `k2-row k2-row--${r.kind}${ed ? ' k2-row--edited' : ''}${r.excluded ? ' k2-row--excluded' : ''}${r.price === null && !r.excluded && r.qty > 0 ? ' k2-row--unpriced' : ''}`, 'data-row': r.row_no },
        h('span', { className: 'k2-c-no' }, r.number || String(r.row_no)),
        h('span', { className: 'k2-c-name' }, r.name,
          ed ? h('span', { className: 'k2-edited', title: `система: ${fmtQty(r.sys_qty)} × ${r.sys_price === null ? 'нет цены' : money(r.sys_price)}`, 'data-testid': 'k2-edited' }, r.excluded ? 'исключена' : 'правка ПТО') : null,
          r.price === null && !r.excluded && r.qty > 0 ? h('span', { className: 'es-badge es-badge--none' }, 'без цены') : null),
        h('span', { className: 'k2-c-unit pf-unit' }, r.unit),
        h('span', { className: 'pf-num k2-c-total' }, fmtQty(r.total_qty)),
        h('span', { className: 'pf-num k2-c-prev' }, fmtQty(r.prev_qty)),
        h('span', { className: 'pf-num k2-c-sys' }, fmtQty(r.sys_qty)),
        h('span', { className: 'pf-num k2-c-qty' }, editable && !r.excluded
          ? h('input', { className: 'pj-input pf-num k2-in', inputMode: 'decimal', value: t.qty, 'aria-label': 'В акт', 'data-testid': 'k2-qty', onChange: (e) => onNum(r.source_row_id, 'qty', (e.target as HTMLInputElement).value) })
          : fmtQty(r.qty)),
        h('span', { className: 'pf-num k2-c-price' }, editable && !r.excluded
          ? h('input', { className: 'pj-input pf-num k2-in', inputMode: 'decimal', value: t.price, 'aria-label': 'Цена', 'data-testid': 'k2-price', onChange: (e) => onNum(r.source_row_id, 'price', (e.target as HTMLInputElement).value) })
          : (r.price === null ? '—' : money(r.price))),
        h('span', { className: 'pf-num k2-c-sum' }, r.excluded ? '—' : money(rowCost(r))),
        h('span', { className: 'k2-c-act' }, editable
          ? [h('button', { key: 'x', type: 'button', className: 'pf-btn pf-btn--ghost k2-small', 'data-testid': 'k2-exclude', onClick: () => patchRow(r.source_row_id, (x) => ({ ...x, excluded: !x.excluded })) }, r.excluded ? 'Вернуть' : 'Исключить'),
             ed && !r.excluded ? h('button', { key: 'r', type: 'button', className: 'pf-btn pf-btn--ghost k2-small', 'data-testid': 'k2-reset', title: 'Вернуть объём и цену системы', onClick: () => resetRow(r) }, 'Как система') : null]
          : null));
    }),
    !rows.length ? h('div', { className: 'pj-empty pf-muted', 'data-testid': 'k2-norows' }, 'Нет принятого факта по дату окончания периода, ещё не вошедшего в выданные акты.') : null,
    h('div', { className: 'k2-total', 'data-testid': 'k2-total' }, h('span', null, 'Итого по акту'), h('b', { className: 'pf-num' }, `${money(total)} ₽`)));

  return h('div', { className: 'pj-tab k2-act', 'data-testid': 'k2-act' },
    h('div', { className: 'k2-act-top' },
      h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', 'data-testid': 'k2-back', onClick: onBack }, '← К списку актов'),
      h('h3', { className: 'k2-act-title' }, `Акт № ${act.act_no} от ${ruDate(act.act_date)}`,
        h('span', { className: 'pf-muted' }, ` · период ${ruDate(act.period_from)} — ${ruDate(act.period_to)} · `),
        h('span', { className: `k2-badge k2-badge--${act.status}` }, STATUS_LABEL[act.status])),
      h('div', { className: 'pf-muted' }, data.last_revision ? `Редакция ${data.last_revision.revision_no} от ${new Date(data.last_revision.created_at).toLocaleString('ru-RU')}` : 'Ещё не сохранён',
        edited ? ` · правок ПТО: ${edited}` : '', dirty ? ' · есть несохранённые изменения' : '')),
    act.status === 'annulled' && act.annul_reason ? h('div', { className: 'pf-error' }, `Аннулирован: ${act.annul_reason}`) : null,
    headForm, table,
    editable && problems.length ? h('div', { className: 'ft-warn', 'data-testid': 'k2-problems' }, problems.join(' ')) : null,
    notice ? h('div', { className: 'pj-notice', role: 'status', 'data-testid': 'k2-notice' }, notice) : null,
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    editable ? h('div', { className: 'pj-actions k2-actions' },
      h('button', { type: 'button', className: 'pf-btn', disabled: busy, 'data-testid': 'k2-save', onClick: () => { void save(); } }, 'Сохранить редакцию')) : null);
}

export const KS2_ACT_CSS = `
.k2-act{container-type:inline-size;container-name:k2act}
.k2-act-top{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.k2-act-title{margin:0;font-size:18px;overflow-wrap:anywhere}
.k2-head{padding:12px 14px;overflow:visible}
.k2-head summary{cursor:pointer;min-height:32px;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center}
.k2-head-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:10px 0 6px}
.k2-head-grid .k2-wide{grid-column:span 2}
.k2-rows{display:flex;flex-direction:column;max-height:70vh;overflow:auto;overscroll-behavior:contain}
.k2-row{display:grid;grid-template-columns:56px minmax(240px,1fr) 48px 92px 92px 92px 104px 112px 120px 128px;gap:4px 8px;align-items:center;padding:6px 12px;border-bottom:1px solid var(--card-border);font-size:13px}
.k2-row--head{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted);position:sticky;top:0;background:var(--card-bg);z-index:1}
.k2-row--material .k2-c-name{padding-left:14px;color:var(--text-muted)}
.k2-row--edited{box-shadow:inset 3px 0 0 var(--primary)}
.k2-row--unpriced{box-shadow:inset 3px 0 0 var(--color-yellow)}
.k2-row--excluded .k2-c-name,.k2-row--excluded .k2-c-qty{text-decoration:line-through;color:var(--text-muted)}
.k2-c-no{font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.k2-c-name{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;min-width:0;overflow-wrap:anywhere}
.k2-c-act{display:flex;flex-direction:column;gap:4px;align-items:stretch}
.k2-edited{font-size:10px;font-weight:700;text-transform:uppercase;padding:1px 6px;border-radius:6px;border:1px solid var(--primary);color:var(--primary)}
.k2-in{width:100%;min-height:32px;padding:4px 8px;font-size:14px;box-sizing:border-box}
.k2-small{min-height:30px;padding:3px 8px;font-size:12px}
.k2-total{display:flex;justify-content:space-between;gap:12px;padding:12px 14px;font-size:15px;position:sticky;bottom:0;background:var(--card-bg);border-top:1px solid var(--card-border)}
@container k2act (max-width:1180px){
.k2-row{grid-template-columns:56px repeat(6,minmax(0,1fr)) 128px}
.k2-c-name{grid-column:2/-1}
.k2-row--head>span:nth-child(2){grid-column:2/-1}
}
@container k2act (max-width:700px){
.k2-rows{max-height:none;overflow:visible}
.k2-row--head{display:none}
.k2-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr);padding:10px 12px}
.k2-c-no,.k2-c-name,.k2-c-act{grid-column:1/-1}
.k2-c-act{flex-direction:row;flex-wrap:wrap}
.k2-row .pf-num{text-align:left}
.k2-c-unit::before{content:'ЕИ: '}
.k2-c-total::before{content:'С начала работ: '}
.k2-c-prev::before{content:'Выставлено ранее: '}
.k2-c-sys::before{content:'По системе: '}
.k2-c-sum::before{content:'Сумма: '}
.k2-c-qty,.k2-c-price{display:flex;flex-direction:column;gap:2px}
.k2-c-qty::before{content:'В акт';font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted)}
.k2-c-price::before{content:'Цена, ₽';font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted)}
.k2-head-grid .k2-wide{grid-column:1/-1}
}
`;
