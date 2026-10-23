/**
 * «План/Факт → Факт → Шахматка» (P2-0017): что сделано на каждом этаже. Вид «Этажи × секции» (корпус и вид работ на выбор).
 * Данные — те же pf_fact_positions (план, принятый факт, «ждёт подтверждения» считает сервер) и дерево мест ядра; расчёт ячеек —
 * fact/chessboard.ts. Своих данных экран не хранит. Права (просмотр, ввод) проверяет сервер.
 */
import { createElement as h, useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import type { ProjectsApi } from '../../../platform/core/projects.service.ts';
import type { FactApi, FactPosition } from './fact.service.ts';
import { ChessCell, ChessScale, CHESS_STATE_LABEL } from '../../../platform/ui/index.ts';
import { buildingsOf, cellKey, indexPlaces, loadPlaces, placePositions, sectionGrid, unplacedIn, workTypesOf } from './chessboard.ts';
import type { CellValue, Grid, PlaceIndex, Placement, Ref } from './chessboard.ts';
import { fmtPct, fmtQty, remainder } from './fact.ts';

const ALL = '';

/** Главное число и подпись ячейки: % по объёму или «закрыто X из Y». */
export function cellText(v: CellValue): { main: string; sub: string } {
  if (v.kind === 'empty') return { main: '—', sub: '' };
  if (v.kind === 'volume') return { main: fmtPct(v.pct), sub: `${fmtQty(v.fact)} ${v.unit}` };
  return { main: `${v.closed}/${v.total}`, sub: 'поз.' };
}
/** Подсказка ячейки (title / aria-label): место, статус, план, факт, остаток, позиции, «ждёт подтверждения». */
export function cellLabel(row: string, col: string, v: CellValue): string {
  if (v.kind === 'empty') return `${row} · ${col}: нет работ`;
  const parts = [`${row} · ${col}: ${CHESS_STATE_LABEL[v.state].toLowerCase()}`];
  if (v.kind === 'volume') parts.push(`факт ${fmtQty(v.fact)} из ${fmtQty(v.plan)} ${v.unit} (${fmtPct(v.pct)}), остаток ${fmtQty(remainder(v.plan, v.fact))} ${v.unit}`);
  parts.push(`закрыто позиций ${v.closed} из ${v.total}`);
  if (v.pending) parts.push(`ждёт подтверждения РП: ${v.pending}`);
  if (v.rejected) parts.push(`отклонено РП: ${v.rejected}`);
  return parts.join('; ');
}

interface Sel { row: string; col: string }

/** Таблица шахматки: первая колонка закреплена, прокрутка вбок — внутри таблицы. */
function GridTable(props: { grid: Grid; corner: string; sel: Sel | null; onPick: (s: Sel) => void; testId: string }): ReactElement {
  const { grid, corner, sel, onPick, testId } = props;
  return h('div', { className: 'p2-chess', 'data-testid': testId },
    h('table', { className: 'p2-chess__table' },
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, corner),
        grid.cols.map((c) => h('th', { key: c.id, scope: 'col', title: c.name, className: sel && sel.col === c.id ? 'p2-chess__hot' : undefined }, c.name)))),
      h('tbody', null, grid.rows.map((r) => h('tr', { key: r.key, 'data-row': r.key },
        h('th', { scope: 'row', className: sel && sel.row === r.key ? 'p2-chess__hot' : undefined }, r.label),
        grid.cols.map((c) => {
          const v = grid.cells.get(cellKey(r.key, c.id))!;
          const t = cellText(v);
          const isSel = !!sel && sel.row === r.key && sel.col === c.id;
          return h('td', { key: c.id, 'data-col': c.id },
            h(ChessCell, { state: v.state, main: t.main, sub: t.sub, pending: v.pending, rejected: v.rejected, selected: isSel,
              hot: !!sel && !isSel && (sel.row === r.key || sel.col === c.id), label: cellLabel(r.label, c.name, v), onClick: () => onPick({ row: r.key, col: c.id }) }));
        }))))));
}

/** Сводка выбранной ячейки: план, факт, остаток, позиции, «ждёт подтверждения». */
function CellInfo(props: { title: string; v: CellValue; onClose: () => void }): ReactElement {
  const { title, v, onClose } = props;
  return h('div', { className: 'pf-card cb-info', 'data-testid': 'cb-info' },
    h('div', { className: 'ft-sheet-head' }, h('b', null, title), h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: onClose }, 'Закрыть')),
    h('div', { className: 'cb-info-nums' },
      v.kind === 'volume' ? h('span', null, `План ${fmtQty(v.plan)} ${v.unit}`) : null,
      v.kind === 'volume' ? h('span', null, `Факт ${fmtQty(v.fact)} ${v.unit} · ${fmtPct(v.pct)}`) : null,
      v.kind === 'volume' ? h('span', null, `Остаток ${fmtQty(remainder(v.plan, v.fact))} ${v.unit}`) : null,
      h('span', null, `Закрыто позиций ${v.closed} из ${v.total}`),
      v.pending ? h('span', { className: 'ft-pending' }, `Ждёт подтверждения РП: ${v.pending} поз. (${fmtQty(v.pendingQty)})`) : null,
      v.rejected ? h('span', { className: 'ft-bad' }, `Отклонено РП: ${v.rejected} поз.`) : null));
}

export function ChessboardTab(props: { api: FactApi; projects: ProjectsApi; projectId: string }): ReactElement {
  const { api, projects, projectId } = props;
  const [data, setData] = useState<{ idx: PlaceIndex; positions: FactPosition[]; pl: Placement } | null>(null);
  const [error, setError] = useState('');
  const [building, setBuilding] = useState<string | null>(null);
  const [work, setWork] = useState(ALL);
  const [sel, setSel] = useState<Sel | null>(null);

  async function load(pid: string): Promise<void> {
    setData(null); setError(''); setSel(null);
    const none = { idx: indexPlaces([]), positions: [], pl: { placed: [], unplaced: [] } };
    try {
      const [nodes, r] = await Promise.all([loadPlaces((parent) => projects.listLocations(pid, parent)), api.positions(pid, null)]);
      if (!r.ok) { setError(r.message); setData(none); return; }
      const idx = indexPlaces(nodes);
      setData({ idx, positions: r.value, pl: placePositions(r.value, idx) });
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Не удалось загрузить места объекта');
      setData(none);
    }
  }
  useEffect(() => { if (projectId) { setBuilding(null); setWork(ALL); void load(projectId); } }, [projectId]);

  const blds: Ref[] = useMemo(() => (data ? buildingsOf(data.idx) : []), [data]);
  const b = building !== null && blds.some((x) => x.id === building) ? building : (blds[0] ? blds[0].id : null);
  const works = useMemo(() => (data ? workTypesOf(data.pl.placed.filter((it) => (it.floor.building ? it.floor.building.id : '') === b).map((it) => it.pos)) : []), [data, b]);
  const w = work && works.some((x) => x.id === work) ? work : null;
  const grid = useMemo(() => (data && b !== null ? sectionGrid(data.idx, data.pl, b, w) : null), [data, b, w]);
  const loose = data && b !== null ? unplacedIn(data.idx, data.pl, b, w) : [];

  if (!data) return h('div', { className: 'pf-muted', 'data-testid': 'cb-loading' }, 'Загрузка…');
  if (error) return h('div', { className: 'pf-error', role: 'alert' }, error);
  if (!grid || !grid.rows.length || !data.pl.placed.length) {
    const n = data.positions.length;
    return h('div', { className: 'pf-card pj-empty pf-muted', 'data-testid': 'cb-empty' },
      !n ? 'Для этого объекта нет работ: позиции появляются после подтверждения ВОР.'
        : `Объёмы этого объекта не разнесены по этажам — шахматку построить не из чего (позиций на корпусах и секциях: ${n}). Факт по ним вносится во вкладке «Ввод».`);
  }
  const rowLabel = (key: string): string => grid.rows.find((r) => r.key === key)?.label || '';
  const colLabel = (id: string): string => grid.cols.find((c) => c.id === id)?.name || '';
  const selV = sel ? grid.cells.get(cellKey(sel.row, sel.col)) : undefined;

  return h('div', { className: 'cb-root', 'data-testid': 'cb-root' },
    h('div', { className: 'cb-filters' },
      blds.length > 1 ? h('label', { className: 'pf-field' }, 'Корпус',
        h('select', { className: 'pj-input', value: b || '', 'data-testid': 'cb-building', onChange: (e) => { setBuilding((e.target as HTMLSelectElement).value); setSel(null); } },
          blds.map((x) => h('option', { key: x.id, value: x.id }, x.name)))) : null,
      h('label', { className: 'pf-field' }, 'Вид работ',
        h('select', { className: 'pj-input', value: w || ALL, 'data-testid': 'cb-work', onChange: (e) => { setWork((e.target as HTMLSelectElement).value); setSel(null); } },
          h('option', { value: ALL }, 'Все виды работ'), works.map((x) => h('option', { key: x.id, value: x.id }, x.name))))),
    h('div', { className: 'pf-muted cb-mode', 'data-testid': 'cb-mode' },
      w ? 'В ячейке — % выполнения по объёму; если у вида работ разные единицы — «закрыто позиций X из Y».' : 'В ячейке — «закрыто позиций X из Y» по всем видам работ.'),
    h(ChessScale, null),
    loose.length ? h('div', { className: 'pf-muted cb-loose', 'data-testid': 'cb-loose' }, `Не разнесено по этажам: ${loose.length} поз. (на корпусе или секции) — в шахматку не входят, факт по ним — во вкладке «Ввод».`) : null,
    h('div', { className: 'cb-layout' + (selV ? ' cb-layout--side' : '') },
      h(GridTable, { grid, corner: 'Этаж', sel, onPick: (s) => setSel(sel && sel.row === s.row && sel.col === s.col ? null : s), testId: 'cb-grid' }),
      selV && sel ? h(CellInfo, { title: `${rowLabel(sel.row)} · ${colLabel(sel.col)}`, v: selV, onClose: () => setSel(null) }) : null));
}

export const CHESSBOARD_CSS = `
.cb-root{display:flex;flex-direction:column;gap:10px;min-width:0}
.cb-filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.cb-mode,.cb-loose{font-size:12px}
.cb-layout{display:flex;flex-direction:column;gap:10px;min-width:0}
.cb-info{display:flex;flex-direction:column;gap:8px;padding:12px 14px}
.cb-info-nums{display:flex;flex-direction:column;gap:4px;font-size:13px;font-variant-numeric:tabular-nums}
@media (min-width:1100px){.cb-layout--side{display:grid;grid-template-columns:minmax(0,1fr) 340px;align-items:start}.cb-layout--side .cb-info{position:sticky;top:12px}}
`;
