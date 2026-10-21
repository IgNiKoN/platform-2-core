/// <reference types="node" />
/** «Проекты» (P2-0005): список, создать, переименовать, архив, только чтение, подвкладки «План/Факт». Подставной API, DOM — happy-dom. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { CompanyScope } from '../CompanyScope.ts';
import { ProjectsTab } from '../ProjectsTab.ts';
import { PlanfactApp, routeFromHash } from '../../../modules/planfact/PlanfactApp.ts';
import type { CompanyAccess, ProjectItem, ProjectsApi } from '../projects.service.ts';
import type { Result } from '../company.service.ts';
import type { AuthApi } from '../../auth/auth.service.ts';
import type { PlanfactDemo } from '../../../modules/planfact/model.ts';
import demo from '../../../modules/planfact/demo-data.json' with { type: 'json' };

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
before(() => {
  g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
  g.HTMLInputElement = win.HTMLInputElement; g.HTMLSelectElement = win.HTMLSelectElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
});
const tick = () => new Promise((r) => setTimeout(r, 30));
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
const click = (b: N) => b.dispatchEvent(new win.Event('click', { bubbles: true }));
const submit = (f: N) => f.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));

export const ACCESS_ADMIN: CompanyAccess = { company_id: 'c1', company_name: 'Альфа', can_manage_projects: true, can_manage_units: true, can_manage_roles: true };
export const ACCESS_READ: CompanyAccess = { company_id: 'c1', company_name: 'Альфа', can_manage_projects: false, can_manage_units: false, can_manage_roles: false };

const P = (id: string, name: string, over: Partial<ProjectItem> = {}): ProjectItem =>
  ({ id, name, code: null, archived_at: null, created_at: '2026-10-21T00:00:00Z', can_manage: true, ...over });

export function fakeApi(opts: { fail?: string; access?: CompanyAccess[]; projects?: ProjectItem[] } = {}) {
  const calls: string[] = [];
  let projects = opts.projects || [P('p1', 'ЖК Тест', { code: 'T-1' })];
  const res = <T = null>(value: T): Result<T> => opts.fail ? { ok: false, message: opts.fail } : { ok: true, value };
  const api: ProjectsApi = {
    async myAccess() { return opts.access || [ACCESS_ADMIN]; },
    async listProjects() { return projects; },
    async createProject(_c, name, code) { calls.push(`create:${name}:${code}`); if (!opts.fail) projects = [...projects, P('p-new', name, { code: code || null })]; return res('p-new'); },
    async updateProject(id, name, code, archived) {
      calls.push(`update:${id}:${name}:${code}:${archived}`);
      if (!opts.fail) projects = projects.map((p) => p.id !== id ? p : { ...p, name, code: code || null, archived_at: archived === null ? p.archived_at : archived ? '2026-10-21T01:00:00Z' : null });
      return res(null);
    },
    async listLocations() { return []; }, async addLocation() { return res(''); }, async renameLocation() { return res(null); },
    async deleteLocation() { return res(0); }, async generateBuilding() { return res(''); },
    async listUnits() { return []; }, async addUnit() { return res(''); }, async deleteUnit() { return res(null); }
  };
  return { api, calls };
}

function mountTab(api: ProjectsApi, company: CompanyAccess) {
  const el = win.document.createElement('div'); win.document.body.appendChild(el);
  const root = createRoot(el as unknown as HTMLElement);
  flushSync(() => root.render(createElement(ProjectsTab, { api, company })));
  return el;
}

test('список проектов компании; код виден', async () => {
  const el: N = mountTab(fakeApi().api, ACCESS_ADMIN); await tick();
  assert.equal(el.querySelectorAll('[data-project-id]').length, 1);
  assert.ok(el.textContent.includes('ЖК Тест') && el.textContent.includes('T-1'));
});

test('создать проект: название и код уходят на сервер, проект появляется в списке', async () => {
  const { api, calls } = fakeApi(); const el: N = mountTab(api, ACCESS_ADMIN); await tick();
  const form: N = el.querySelector('[data-testid="pj-create"]');
  form.elements.namedItem('name').value = '  ЖК Новый '; form.elements.namedItem('code').value = 'N-2';
  submit(form); await tick();
  assert.deepEqual(calls, ['create:ЖК Новый:N-2']);
  assert.equal(el.querySelectorAll('[data-project-id]').length, 2);
  assert.ok(el.querySelector('[role="status"]'));
});

test('пустое название — ошибка, на сервер не уходит', async () => {
  const { api, calls } = fakeApi(); const el: N = mountTab(api, ACCESS_ADMIN); await tick();
  submit(el.querySelector('[data-testid="pj-create"]')); await tick();
  assert.deepEqual(calls, []);
  assert.ok(el.querySelector('[role="alert"]').textContent.includes('название'));
});

test('переименование проекта', async () => {
  const { api, calls } = fakeApi(); const el: N = mountTab(api, ACCESS_ADMIN); await tick();
  click(el.querySelector('[data-testid="pj-rename"]')); await tick();
  const form: N = el.querySelector('.pj-row--edit');
  form.elements.namedItem('name').value = 'ЖК Тест 2'; form.elements.namedItem('code').value = 'T-1';
  submit(form); await tick();
  assert.deepEqual(calls, ['update:p1:ЖК Тест 2:T-1:null']);
  assert.ok(el.textContent.includes('ЖК Тест 2'));
});

test('архив: проект уходит из списка, «Показать архив» возвращает его; из архива можно вернуть', async () => {
  const { api, calls } = fakeApi(); const el: N = mountTab(api, ACCESS_ADMIN); await tick();
  click(el.querySelector('[data-testid="pj-archive"]')); await tick();
  assert.deepEqual(calls, ['update:p1:ЖК Тест:T-1:true']);
  assert.equal(el.querySelectorAll('[data-project-id]').length, 0);
  assert.ok(el.querySelector('[data-testid="pj-empty"]'));
  click(el.querySelector('.pj-toggle')); await tick();
  assert.ok(el.textContent.includes('в архиве'));
  click(el.querySelector('[data-testid="pj-archive"]')); await tick();
  assert.equal(calls[1], 'update:p1:ЖК Тест:T-1:false');
});

test('без права — только чтение: нет формы создания и кнопок правки', async () => {
  const { api } = fakeApi({ projects: [P('p1', 'ЖК Тест', { can_manage: false })] });
  const el: N = mountTab(api, ACCESS_READ); await tick();
  assert.ok(el.querySelector('[data-project-id]'));
  assert.ok(!el.querySelector('[data-testid="pj-create"]'));
  assert.ok(!el.querySelector('[data-testid="pj-rename"]') && !el.querySelector('[data-testid="pj-archive"]'));
});

test('отказ сервера показан текстом сервера', async () => {
  const { api } = fakeApi({ fail: 'Нет права управлять проектами' }); const el: N = mountTab(api, ACCESS_ADMIN); await tick();
  const form: N = el.querySelector('[data-testid="pj-create"]');
  form.elements.namedItem('name').value = 'X'; submit(form); await tick();
  assert.equal(el.querySelector('[role="alert"]').textContent, 'Нет права управлять проектами');
});

test('нет доступа ни к одной компании — сообщение', async () => {
  const el: N = win.document.createElement('div'); win.document.body.appendChild(el);
  const { api } = fakeApi({ access: [] });
  flushSync(() => createRoot(el).render(createElement(CompanyScope, { api, render: () => createElement('div') }))); await tick();
  assert.ok(el.querySelector('[data-testid="pj-noaccess"]'));
});

test('адрес → страница модуля', () => {
  assert.deepEqual(routeFromHash('#/planfact'), { page: 'works', sub: 'objects' });
  assert.equal(routeFromHash('#/planfact/directories').page, 'directories');
  assert.equal(routeFromHash('#/planfact/directories/objects').page, 'directories');
  assert.equal(routeFromHash('#/planfact/что-то').page, 'works');
});

function fakeAuth(): AuthApi {
  return { async signIn() { return { ok: true }; }, async signOut() { /* нет */ }, async getEmail() { return 'adm@test.invalid'; },
    async getAccess() { return [{ company: 'Альфа', role: 'Администратор компании', projectId: null }]; } };
}
function mountApp(projects: ProjectsApi | null, onAccess?: (h: boolean) => void) {
  const el: N = win.document.createElement('div'); win.document.body.appendChild(el);
  flushSync(() => createRoot(el).render(createElement(PlanfactApp, { auth: fakeAuth(), data: demo as PlanfactDemo, api: null, projects, onAccess })));
  return el;
}

test('План/Факт: «Справочники» (#/planfact/directories) показывают проекты; модуль сообщает оболочке, что доступ есть', async () => {
  win.location.hash = '#/planfact/directories';
  const seen: boolean[] = [];
  const el = mountApp(fakeApi().api, (h) => seen.push(h)); await tick();
  assert.deepEqual(seen, [true]);
  assert.ok(el.querySelector('[data-testid="pj-projects"]'));
  assert.ok(el.textContent.includes('Справочники'));
  assert.ok(!el.querySelector('[data-testid="pf-tabs"]'), 'внутри страницы нет собственной панели вкладок — пункты в боковом меню');
});

test('План/Факт: «Работы» (#/planfact) — таблица; смена адреса переключает страницу', async () => {
  win.location.hash = '#/planfact';
  const el = mountApp(fakeApi().api); await tick();
  assert.ok(!el.querySelector('[data-testid="pj-projects"]'));
  win.location.hash = '#/planfact/directories'; win.dispatchEvent(new win.Event('hashchange')); await tick();
  assert.ok(el.querySelector('[data-testid="pj-projects"]'));
});

test('План/Факт: нет доступа к компании — справочники не открываются, оболочке сообщено «нет»', async () => {
  win.location.hash = '#/planfact/directories';
  const seen: boolean[] = [];
  const el = mountApp(fakeApi({ access: [] }).api, (h) => seen.push(h)); await tick();
  assert.deepEqual(seen, [false]);
  assert.ok(!el.querySelector('[data-testid="pj-projects"]'));
});
