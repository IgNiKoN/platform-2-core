/// <reference types="node" />
/** Черновик ВОР, «Места» (P2-0006, этап 4): привязка к дереву, список недостающих, «Создать недостающие» по праву, сохранение привязки. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { VorDraft, withLocation } from '../vor/VorDraft.ts';
import type { Resolution, VorApi, VorImport, VorRow } from '../vor/vor.service.ts';
import type { LocationNode, ProjectsApi } from '../../../platform/company/projects.service.ts';

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
before(() => {
  g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
  g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
});
const tick = () => new Promise((r) => setTimeout(r, 40));
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;

const IMP: VorImport = { id: 'i1', file_name: 'ФКП.xlsx', sheet_name: '142', status: 'draft', row_count: 4, works: 3, positions: 0,
  created_at: '2026-10-21T10:00:00Z', created_by_email: null, confirmed_at: null, profile_id: null };
const R = (row_no: number, kind: VorRow['kind'], context: VorRow['context']): VorRow => ({ id: 'r' + row_no, row_no, kind, number: null, name: 'Работа ' + row_no,
  unit_text: 'м2', qty: 1, norm: null, prices: {}, context, parent_row_no: null, location_id: null, work_type_id: null, unit_id: null, match: null });
const ROWS = [R(10, 'context', { building: '7', section: '1' }), R(11, 'work', { building: '7', section: '1', apartments: 'кв. 3' }),
  R(12, 'work', { building: '7', section: '2' }), R(13, 'work', { section: '4', floor: { from: 4, to: 12 } })];

function setup(nodes: LocationNode[]) {
  const resolved: Resolution[] = [];
  const created: string[] = [];
  const api = {
    async importRows() { return ROWS.map((r) => ({ ...r })); },
    async resolveRows(_i: string, items: Resolution[]) { resolved.push(...items); return { ok: true, value: items.length }; }
  } as unknown as VorApi;
  let seq = 0;
  const projects = {
    async listLocations(_p: string, parent: string | null) { return nodes.filter((n) => n.parent_id === parent); },
    async addLocation(_p: string, parent: string | null, type: LocationNode['node_type'], name: string) {
      const pp = nodes.find((n) => n.id === parent);
      const id = 'n' + (++seq);
      nodes.push({ id, parent_id: parent, node_type: type, name, sort_order: 0, area: null, depth: 1, path: pp ? `${pp.path} · ${name}` : name, child_count: 0 });
      created.push((pp ? pp.name + ' → ' : '') + name);
      return { ok: true, value: id };
    }
  } as unknown as ProjectsApi;
  return { api, projects, resolved, created };
}

function mount(props: Record<string, unknown>) {
  const el = win.document.createElement('div');
  win.document.body.appendChild(el);
  const root = createRoot(el as unknown as HTMLElement);
  flushSync(() => root.render(createElement(VorDraft, { projectId: 'p1', imp: IMP, onBack: () => undefined, onChanged: () => undefined, ...props } as N)));
  return el as N;
}

test('решение строки: место + сохранённые вид работ / ЕИ / цвет', () => {
  assert.deepEqual(withLocation({ ...ROWS[1], work_type_id: 'w', unit_id: 'u', match: 'green' }, 'L'),
    { row_no: 11, location_id: 'L', work_type_id: 'w', unit_id: 'u', match: 'green' });
});

test('пустое дерево: список недостающих → «Создать недостающие» → 100 % строк привязаны, привязка сохранена, дублей нет', async () => {
  const nodes: LocationNode[] = [];
  const { api, projects, resolved, created } = setup(nodes);
  const el = mount({ api, projects, canManage: true, canProjects: true });
  await tick();
  assert.match(el.querySelector('[data-testid="vor-bound"]').textContent, /0 из 3/);
  assert.deepEqual(Array.from(el.querySelectorAll('[data-testid="vor-missing"] li') as N[]).map((li: N) => li.textContent),
    ['Корпус 7 → Секция 1', 'Корпус 7 → Секция 2', 'Секция 4']);
  el.querySelector('[data-testid="vor-create-missing"]').click(); await tick(); await tick();
  assert.deepEqual(created, ['Корпус 7', 'Корпус 7 → Секция 1', 'Корпус 7 → Секция 2', 'Секция 4']);
  assert.match(el.querySelector('[data-testid="vor-bound"]').textContent, /3 из 3/);
  assert.equal(el.querySelector('[data-testid="vor-missing"]'), null);
  assert.equal(resolved.length, 3);
  assert.equal(resolved.find((x) => x.row_no === 13)!.location_id, nodes.find((n) => n.name === 'Секция 4')!.id, '«Этажи 4–12» → секция');
  assert.match(el.querySelector('[data-testid="vor-places"]').textContent, /→ Корпус 7 · Секция 2/);
});

test('дерево есть (генератор: «эт. 2»): привязка без создания; без права на дерево кнопки «Создать» нет', async () => {
  const L = (id: string, parent: string | null, type: LocationNode['node_type'], name: string, path: string): LocationNode =>
    ({ id, parent_id: parent, node_type: type, name, sort_order: 0, area: null, depth: 1, path, child_count: 0 });
  const nodes = [L('b', null, 'building', 'Корпус 7', 'Корпус 7'), L('s1', 'b', 'section', 'Секция 1', 'Корпус 7 · Секция 1')];
  const { api, projects, created } = setup(nodes);
  const el = mount({ api, projects, canManage: true, canProjects: false });
  await tick();
  assert.match(el.querySelector('[data-testid="vor-bound"]').textContent, /1 из 3/);
  assert.equal(el.querySelector('[data-testid="vor-create-missing"]'), null);
  assert.ok(el.querySelector('[data-testid="vor-no-create"]'));
  assert.equal(created.length, 0);
});
