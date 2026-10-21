/// <reference types="node" />
/** Вход/выход/шапка экрана «План/Факт» с подставным AuthApi (без сети). DOM — happy-dom. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { PlanfactApp } from '../PlanfactApp.ts';
import { mapAuthError } from '../../../platform/auth/auth.service.ts';
import type { AuthApi } from '../../../platform/auth/auth.service.ts';
import type { PlanfactDemo } from '../model.ts';
import demo from '../demo-data.json' with { type: 'json' };

const win = new Window({ url: 'http://localhost/' });
const g = globalThis as Record<string, unknown>;
before(() => {
  g.window = win; g.document = win.document; g.HTMLElement = win.HTMLElement; g.Node = win.Node;
  g.HTMLInputElement = win.HTMLInputElement; g.Event = win.Event; g.IS_REACT_ACT_ENVIRONMENT = false;
});
const tick = () => new Promise((r) => setTimeout(r, 20));

function fakeAuth(opts: { password: string; signedIn?: boolean }): AuthApi & { calls: string[] } {
  let signed = !!opts.signedIn;
  const calls: string[] = [];
  return {
    calls,
    async signIn(email, password) { calls.push('signIn'); if (password === opts.password) { signed = true; return { ok: true }; } return { ok: false, message: 'Неверная почта или пароль' }; },
    async signOut() { calls.push('signOut'); signed = false; },
    async getEmail() { return signed ? 'pto@test.invalid' : null; },
    async getAccess() { return [{ company: 'Альфа', role: 'Инженер ПТО', projectId: null }]; }
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
function setValue(el: N, value: string): void {
  el.value = value;
}
function click(el: N): void { el.dispatchEvent(new win.Event("click", { bubbles: true })); }
function mount(auth: AuthApi | null) {
  const el = win.document.createElement('div'); win.document.body.appendChild(el);
  const root = createRoot(el as unknown as HTMLElement);
  flushSync(() => root.render(createElement(PlanfactApp, { auth, data: demo as PlanfactDemo })));
  return { el, root };
}

test('без настроек сервера — сразу локальный демо-режим с таблицей', () => {
  const { el } = mount(null);
  assert.ok(el.querySelector('[data-work-id]'));
  assert.ok(!el.querySelector('[data-testid="pf-login"]'));
});

test('есть сервер, нет сессии → форма входа; данные не показаны', async () => {
  const { el } = mount(fakeAuth({ password: 'ok' }));
  await tick();
  assert.ok(el.querySelector('[data-testid="pf-login"]'));
  assert.ok(!el.querySelector('[data-work-id]'));
});

test('неверный пароль → понятное сообщение, форма остаётся', async () => {
  const { el } = mount(fakeAuth({ password: 'ok' }));
  await tick();
  setValue(el.querySelector('input[name=email]')!, 'a@b.c');
  setValue(el.querySelector('input[name=password]')!, 'bad');
  (el.querySelector("form") as N).dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true }));
  await tick();
  assert.match(el.textContent || '', /Неверная почта или пароль/);
  assert.ok(el.querySelector('[data-testid="pf-login"]'));
});

test('верный пароль → шапка «почта · компания · роль» и таблица; выход скрывает данные', async () => {
  const auth = fakeAuth({ password: 'ok' });
  const { el } = mount(auth);
  await tick();
  setValue(el.querySelector('input[name=email]')!, 'pto@test.invalid');
  setValue(el.querySelector('input[name=password]')!, 'ok');
  (el.querySelector("form") as N).dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true }));
  await tick();
  const bar = el.querySelector('[data-testid="pf-user"]');
  assert.ok(bar && /pto@test\.invalid/.test(bar.textContent || '') && /Альфа · Инженер ПТО/.test(bar.textContent || ''));
  assert.ok(el.querySelector('[data-work-id]'));
  const out = Array.from(el.querySelectorAll('button')).find((b) => b.textContent === 'Выйти')!;
  click(out);
  await tick();
  assert.deepEqual(auth.calls.includes('signOut'), true);
  assert.ok(el.querySelector('[data-testid="pf-login"]'));
  assert.ok(!el.querySelector('[data-work-id]'));
});

test('«Работать локально» открывает демо без входа', async () => {
  const { el } = mount(fakeAuth({ password: 'ok' }));
  await tick();
  click(Array.from(el.querySelectorAll('button')).find((b) => /Работать локально/.test(b.textContent || ''))!);
  await tick();
  assert.ok(el.querySelector('[data-work-id]'));
});

test('mapAuthError: понятные сообщения', () => {
  assert.equal(mapAuthError('Invalid login credentials'), 'Неверная почта или пароль');
  assert.match(mapAuthError('Failed to fetch'), /Нет связи/);
});
