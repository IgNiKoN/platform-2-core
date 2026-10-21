/**
 * Экран «План/Факт → ВОР» (P2-0006). Этап 1: загрузка Excel, выбор листа, предпросмотр разбора без сохранения.
 * Библиотека Excel и чтение файла подгружаются лениво (import('./xlsx-reader.ts')) — только когда выбран файл.
 */
import { createElement as h, useMemo, useState } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import { parseSheet, contextLabel } from './parse.ts';
import type { ParseResult, ParsedRow, RowKind, SheetData } from './parse.ts';

const KIND_LABEL: Record<RowKind, string> = { work: 'Работа', material: 'Материал', group: 'Группа', context: 'Место', skip: 'Пропуск' };
type Filter = 'all' | RowKind;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' }, { id: 'work', label: 'Работы' }, { id: 'material', label: 'Материалы' },
  { id: 'group', label: 'Группы' }, { id: 'context', label: 'Места' }, { id: 'skip', label: 'Пропуск' }
];

export interface LoadedFile { name: string; sheets: SheetData[] }

/** Читает выбранный файл: лениво грузит модуль чтения Excel. Вынесено для подмены в тестах. */
export async function loadFile(file: File): Promise<LoadedFile> {
  const buf = await file.arrayBuffer();
  const { readWorkbook } = await import('./xlsx-reader.ts');
  const wb = await readWorkbook(buf);
  return { name: file.name, sheets: wb.sheets };
}

const fmt = (n: number | null): string => n === null ? '' : n.toLocaleString('ru-RU', { maximumFractionDigits: 3 });

function RowView(props: { r: ParsedRow }): ReactElement {
  const { r } = props;
  const place = contextLabel(r.context);
  return h('div', { className: `vor-row vor-row--${r.kind}`, 'data-kind': r.kind, 'data-row': r.rowNo },
    h('span', { className: 'vor-c-no' }, String(r.rowNo)),
    h('span', { className: 'vor-c-kind' }, h('span', { className: `vor-kind vor-kind--${r.kind}` }, KIND_LABEL[r.kind])),
    h('span', { className: 'vor-c-name' },
      r.number ? h('span', { className: 'vor-num' }, r.number) : null,
      h('span', null, r.name || '—'),
      place && r.kind !== 'context' ? h('span', { className: 'vor-place' }, place) : null),
    h('span', { className: 'vor-c-unit pf-unit' }, r.unitText || ''),
    h('span', { className: 'vor-c-qty pf-num' }, fmt(r.qty), r.norm !== null ? h('span', { className: 'vor-norm' }, `норма ${fmt(r.norm)}`) : null));
}

export function VorTab(props: { load?: (f: File) => Promise<LoadedFile> }): ReactElement {
  const load = props.load || loadFile;
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [sheet, setSheet] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const results = useMemo<Record<string, ParseResult>>(() => {
    const out: Record<string, ParseResult> = {};
    if (file) for (const s of file.sheets) out[s.name] = parseSheet(s);
    return out;
  }, [file]);
  const res = sheet ? results[sheet] : null;

  async function pick(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const f = ev.currentTarget.files && ev.currentTarget.files[0];
    if (!f) return;
    setBusy(true); setError(''); setFile(null); setSheet(''); setFilter('all');
    try {
      if (!/\.xlsx$/i.test(f.name)) throw new Error('Нужен файл Excel .xlsx (старый .xls сохраните как .xlsx).');
      const lf = await load(f);
      setFile(lf);
      const parsed = lf.sheets.map((s) => ({ s, r: parseSheet(s) }));
      const first = parsed.filter((x) => x.r.isVor).sort((a, b) => Number(!!a.s.hidden) - Number(!!b.s.hidden))[0];
      setSheet(first ? first.s.name : (lf.sheets[0] ? lf.sheets[0].name : ''));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось прочитать файл');
    } finally {
      setBusy(false);
      ev.target.value = '';
    }
  }

  const rows = res ? res.rows.filter((r) => filter === 'all' || r.kind === filter) : [];
  const bad = res ? res.checks.filter((c) => !c.ok) : [];

  return h('div', { className: 'pj-tab vor-tab', 'data-testid': 'vor-tab' },
    h('div', { className: 'pf-card pj-form' },
      h('label', { className: 'pf-btn vor-file' + (busy ? ' vor-file--busy' : '') },
        busy ? 'Читаю файл…' : 'Загрузить Excel (.xlsx)',
        h('input', { type: 'file', accept: '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', disabled: busy, onChange: pick, 'data-testid': 'vor-file' })),
      file
        ? h('label', { className: 'pf-field pj-grow' }, `Лист файла «${file.name}»`,
            h('select', { className: 'pj-input', value: sheet, 'data-testid': 'vor-sheet', onChange: (e: ChangeEvent<HTMLSelectElement>) => { setSheet(e.currentTarget.value); setFilter('all'); } },
              file.sheets.map((s) => h('option', { key: s.name, value: s.name },
                s.name + (s.hidden ? ' (скрытый)' : '') + (results[s.name] && !results[s.name].isVor ? ' — не похоже на ВОР' : '')))))
        : h('span', { className: 'pf-muted pj-grow' }, 'Файл заказчика в его форме: ФКП, себестоимость, ведомость договорной цены. Сохранения пока нет — только просмотр разбора.')),
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    res && !res.isVor ? h('div', { className: 'pf-error', role: 'alert', 'data-testid': 'vor-notvor' }, `Лист «${res.sheet}» не похож на ВОР: ${res.reason}`) : null,
    res && res.isVor
      ? h('div', { className: 'vor-summary', 'data-testid': 'vor-summary' },
          h('span', { className: 'vor-stat' }, h('b', null, res.stats.works), ' работ'),
          h('span', { className: 'vor-stat' }, h('b', null, res.stats.materials), ' материалов'),
          h('span', { className: 'vor-stat' }, h('b', null, res.stats.groups), ' групп'),
          h('span', { className: 'vor-stat' }, h('b', null, res.stats.context), ' заголовков мест'),
          h('span', { className: 'vor-stat' + (res.stats.worksWithUnit < res.stats.works ? ' vor-stat--warn' : '') },
            'с ЕИ ', h('b', null, `${res.stats.worksWithUnit} из ${res.stats.works}`)),
          h('span', { className: 'vor-stat pf-muted' }, `шапка: строки ${res.headerRows.join(', ')}`),
          res.checks.length
            ? h('span', { className: 'vor-stat ' + (bad.length ? 'vor-stat--bad' : 'vor-stat--ok'), 'data-testid': 'vor-checks' },
                bad.length ? `итоги не сходятся: ${bad.length} из ${res.checks.length}` : `итоги сходятся (${res.checks.length})`)
            : h('span', { className: 'vor-stat pf-muted' }, 'итогов с числами в файле нет'))
      : null,
    bad.length
      ? h('div', { className: 'pf-card vor-bad', 'data-testid': 'vor-bad' }, bad.slice(0, 5).map((c) => h('div', { key: c.rowNo + c.label },
          `Строка ${c.rowNo}, «${c.label}»: в файле ${fmt(c.expected)}, по строкам ${fmt(c.actual)}`)))
      : null,
    res && res.isVor
      ? h('div', { className: 'pf-seg vor-filter', role: 'tablist' }, FILTERS.map((f) => h('button', { key: f.id, type: 'button', role: 'tab',
          'aria-selected': filter === f.id, className: 'pf-seg-btn' + (filter === f.id ? ' pf-seg-btn--active' : ''), onClick: () => setFilter(f.id) }, f.label)))
      : null,
    res && res.isVor
      ? h('div', { className: 'pf-card vor-list', 'data-testid': 'vor-rows' },
          h('div', { className: 'vor-row vor-row--head' },
            h('span', { className: 'vor-c-no' }, 'Стр.'), h('span', { className: 'vor-c-kind' }, 'Тип'), h('span', { className: 'vor-c-name' }, 'Наименование · место'),
            h('span', { className: 'vor-c-unit' }, 'ЕИ'), h('span', { className: 'vor-c-qty pf-num' }, 'Объём')),
          rows.length ? rows.map((r) => h(RowView, { key: r.rowNo, r })) : h('div', { className: 'pj-empty pf-muted' }, 'Нет строк этого типа.'))
      : null);
}

export const VOR_CSS = `
.vor-file{position:relative;overflow:hidden;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;min-height:40px}
.vor-file input{position:absolute;inset:0;opacity:0;cursor:pointer}
.vor-file--busy{opacity:.7;cursor:progress}
.vor-summary{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px}
.vor-stat b{font-variant-numeric:tabular-nums}
.vor-stat--ok{color:var(--color-green)}
.vor-stat--bad{color:var(--color-red);font-weight:700}
.vor-stat--warn b{color:var(--color-yellow)}
.vor-bad{padding:10px 14px;font-size:12px;color:var(--color-red);display:flex;flex-direction:column;gap:4px}
.vor-list{display:flex;flex-direction:column;font-size:13px}
.vor-row{display:grid;grid-template-columns:52px 92px minmax(0,1fr) 72px 120px;gap:10px;align-items:start;padding:8px 14px;border-bottom:1px solid var(--card-border)}
.vor-row:last-child{border-bottom:0}
.vor-row--head{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted)}
.vor-row--group .vor-c-name{font-weight:700}
.vor-row--context{background:var(--hover-bg)}
.vor-row--context .vor-c-name{font-weight:900}
.vor-row--material{color:var(--text-muted)}
.vor-row--material .vor-c-name{padding-left:14px}
.vor-row--skip{opacity:.55}
.vor-c-no{color:var(--text-muted);font-variant-numeric:tabular-nums}
.vor-c-name{display:flex;flex-direction:column;gap:2px;min-width:0;overflow-wrap:anywhere}
.vor-num{font-size:11px;color:var(--text-muted)}
.vor-place{font-size:11px;color:var(--primary)}
.vor-norm{display:block;font-size:11px;color:var(--text-muted)}
.vor-kind{display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;padding:1px 6px;border-radius:6px;border:1px solid var(--card-border);color:var(--text-muted)}
.vor-kind--work{border-color:var(--primary);color:var(--primary)}
.vor-kind--context{border-color:var(--color-green);color:var(--color-green)}
.vor-kind--group{color:var(--text-main)}
@media (max-width:600px){
  .vor-row{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"kind kind no" "name name name" "unit qty qty";gap:4px 8px;padding:10px 12px}
  .vor-row--head{display:none}
  .vor-c-no{grid-area:no;text-align:right}.vor-c-kind{grid-area:kind}.vor-c-name{grid-area:name}.vor-c-unit{grid-area:unit}.vor-c-qty{grid-area:qty}
  .vor-row--material .vor-c-name{padding-left:0}
  .vor-file{width:100%}
}
`;
