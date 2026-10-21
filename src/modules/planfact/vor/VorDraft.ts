/**
 * Черновик загрузки ВОР (P2-0006): разбор по шагам. Этап 4 — «Места»: места строк-работ → узлы дерева объекта
 * (то же дерево, что «Справочники → Объекты»), список недостающих узлов и «Создать недостающие» (право planfact.projects.manage
 * проверяет сервер в pf_add_location). Привязка сохраняется в строки черновика (pf_vor_resolve_rows).
 */
import { createElement as h, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { ProjectsApi } from '../../../platform/company/projects.service.ts';
import type { PlanNodeType } from '../../../services/locations/types.ts';
import { placeOf, placeNote, bindPlaces, missingList, createMissing } from './places.ts';
import type { Binding, Place, TreeNode } from './places.ts';
import type { Resolution, VorApi, VorImport, VorRow } from './vor.service.ts';

export interface DraftProps {
  api: VorApi; projects: ProjectsApi | null; projectId: string; imp: VorImport;
  canManage: boolean; canProjects: boolean; onBack: () => void; onChanged: () => void;
}

interface PlaceInfo { place: Place; rows: number; binding: Binding | null }

/** Решение строки для сервера: место + уже сохранённые вид работ / ЕИ / цвет (pf_vor_resolve_rows перезаписывает все четыре). */
export function withLocation(r: VorRow, locationId: string | null): Resolution {
  return { row_no: r.row_no, location_id: locationId, work_type_id: r.work_type_id, unit_id: r.unit_id, match: r.match };
}

export function VorDraft(props: DraftProps): ReactElement {
  const { api, projects, projectId, imp, canManage, canProjects, onBack, onChanged } = props;
  const editable = canManage && imp.status === 'draft';
  const [rows, setRows] = useState<VorRow[] | null>(null);
  const [places, setPlaces] = useState<PlaceInfo[] | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const works = (rows || []).filter((r) => r.kind === 'work');

  async function loadChildren(parent: string | null): Promise<TreeNode[]> {
    if (!projects) return [];
    return (await projects.listLocations(projectId, parent)).map((n) => ({ id: n.id, parent_id: n.parent_id, node_type: n.node_type, name: n.name, path: n.path }));
  }

  /** Привязать места строк к дереву; изменившиеся привязки — в черновик (если можно править). */
  async function bind(list: VorRow[]): Promise<void> {
    const uniq = new Map<string, PlaceInfo>();
    for (const r of list) if (r.kind === 'work') {
      const pl = placeOf(r.context || {});
      const cur = uniq.get(pl.key);
      if (cur) cur.rows++; else uniq.set(pl.key, { place: pl, rows: 1, binding: null });
    }
    const infos = Array.from(uniq.values());
    const bindings = await bindPlaces(infos.map((i) => i.place), loadChildren);
    infos.forEach((i, k) => { i.binding = bindings[k]; });
    setPlaces(infos);
    if (!editable) return;
    const byKey = new Map(bindings.map((b) => [b.key, b.nodeId]));
    const changed = list.filter((r) => r.kind === 'work').map((r) => ({ r, loc: byKey.get(placeOf(r.context || {}).key) ?? null }))
      .filter((x) => x.r.location_id !== x.loc);
    if (!changed.length) return;
    const res = await api.resolveRows(imp.id, changed.map((x) => withLocation(x.r, x.loc)));
    if (!res.ok) { setError(res.message); return; }
    setRows(list.map((r) => { const c = changed.find((x) => x.r.row_no === r.row_no); return c ? { ...r, location_id: c.loc } : r; }));
  }

  async function load(): Promise<void> {
    const list = await api.importRows(imp.id);
    setRows(list);
    await bind(list);
  }
  useEffect(() => { void load(); }, [imp.id]);

  async function createAll(): Promise<void> {
    if (!projects || !places || busy) return;
    setBusy('Создаю узлы…'); setError(''); setNotice('');
    try {
      const n = await createMissing(places.map((p) => p.binding as Binding), places.map((p) => p.place), async (parent, type, name) => {
        const r = await projects.addLocation(projectId, parent, type as PlanNodeType, name);
        if (!r.ok) throw new Error(r.message);
        return r.value;
      });
      setNotice(`Создано узлов: ${n}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать узлы');
    }
    setBusy('');
    if (rows) await bind(rows);
    onChanged();
  }

  if (rows === null || places === null) return h('div', { className: 'pf-muted' }, 'Загрузка черновика…');
  const missing = missingList(places.map((p) => p.binding as Binding), places.map((p) => p.place));
  const boundRows = works.filter((r) => r.location_id).length;

  return h('div', { className: 'pj-tab vor-draft', 'data-testid': 'vor-draft' },
    h('div', { className: 'vor-draft-head' },
      h('button', { type: 'button', className: 'pf-btn pf-btn--ghost', onClick: onBack, 'data-testid': 'vor-back' }, '← Загрузки'),
      h('div', { className: 'pj-name' }, h('b', null, imp.file_name), h('span', { className: 'pf-muted' }, `лист «${imp.sheet_name}»`),
        h('span', { className: 'pj-badge' + (imp.status === 'confirmed' ? ' vor-badge--ok' : '') }, imp.status === 'confirmed' ? 'Подтверждён' : 'Черновик'))),
    error ? h('div', { className: 'pf-error', role: 'alert' }, error) : null,
    notice ? h('div', { className: 'pj-notice', role: 'status' }, notice) : null,
    h('h3', { className: 'pf-title un-title' }, 'Места'),
    h('div', { className: 'vor-summary' },
      h('span', { className: 'vor-stat' + (boundRows === works.length ? ' vor-stat--ok' : ' vor-stat--bad'), 'data-testid': 'vor-bound' },
        `Привязано строк-работ: ${boundRows} из ${works.length}`)),
    h('div', { className: 'pf-card pj-list', 'data-testid': 'vor-places' },
      places.map((p) => h('div', { key: p.place.key, className: 'pj-row vor-place-row', 'data-place': p.place.key },
        h('div', { className: 'pj-name' }, h('b', null, p.place.label), h('span', { className: 'pf-muted' }, `${p.rows} строк`)),
        p.binding && p.binding.nodeId
          ? h('span', { className: 'vor-stat--ok' }, '→ ' + p.binding.path)
          : h('span', { className: 'vor-stat--bad' }, 'нет в дереве объекта')))),
    missing.length
      ? h('div', { className: 'pf-card vor-missing', 'data-testid': 'vor-missing' },
          h('div', null, h('b', null, `Не хватает узлов в дереве объекта (${missing.length}):`)),
          h('ul', null, missing.map((m) => h('li', { key: m }, m))),
          editable && canProjects && projects
            ? h('button', { type: 'button', className: 'pf-btn', disabled: !!busy, 'data-testid': 'vor-create-missing', onClick: () => { void createAll(); } },
                busy || 'Создать недостающие')
            : h('div', { className: 'pf-muted', 'data-testid': 'vor-no-create' },
                editable ? 'Создавать узлы может РП или администратор (право «Проекты и дерево локаций») — «Справочники → Объекты».' : 'Просмотр.'))
      : null,
    h('div', { className: 'pf-muted vor-rule' },
      'Правила: «Этажи 4–12» — позиция на секции с пометкой «эт. 4–12»; «кв. 3, 16…» — позиция на ближайшем узле с пометкой квартир; строки без места — на узел «Весь объект».'),
    works.some((r) => placeNote(r.context || {}))
      ? h('div', { className: 'pf-muted' }, `Строк с пометкой (диапазон этажей / квартиры): ${works.filter((r) => placeNote(r.context || {})).length}`)
      : null);
}

export const VOR_DRAFT_CSS = `
.vor-draft-head{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.vor-place-row .vor-stat--ok,.vor-place-row .vor-stat--bad{font-size:12px;overflow-wrap:anywhere}
.vor-missing{padding:12px 14px;display:flex;flex-direction:column;gap:8px;font-size:13px}
.vor-missing ul{margin:0;padding-left:18px}
.vor-rule{font-size:11px}
@media (max-width:600px){.vor-missing .pf-btn{width:100%}}
`;
