/// <reference types="node" />
/** P2-0013 этап 3: меню = способ входа ∩ модули компании ∩ роль (оболочка js/core/app-shell.js в happy-dom, подставной ответ сервера);
 *  адрес невыключенного модуля — «Модуль не подключён» без загрузки бандла (обёртка js/modules/planfact/index.js). */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { Window } from 'happy-dom';

/* eslint-disable @typescript-eslint/no-explicit-any */
type N = any;
const MENU = [
  { id: 'planfact', label: 'План/Факт', section: 'platform', order: 50, path: '#/planfact', requiresAccess: false, demo: true },
  { id: 'company', label: 'Компания', section: 'settings', order: 60, path: '#/company', requiresAccess: true }
];

function shell(mode: string, access: Record<string, boolean>, qualitySync: unknown = null): N {
  const win: N = new Window({ url: 'http://localhost/#/settings' });
  win.document.body.innerHTML = '<div id="app-sidebar"></div><div class="mobile-module-menu-wrap"><div id="mobile-module-menu" class="hidden"></div></div>';
  win.RBI = {
    moduleLoader: { getMenuItems: () => MENU, getById: (id: string) => ({ id, menu: MENU.find((m) => m.id === id) }) },
    platform2: { getState: () => ({ mode }) },
    platformMenuAccess: access,
    qualitySync,
    services: { permissions: { getAllowedModules: () => ['quality', 'construction', 'knowledge'] } }
  };
  const code = readFileSync(new URL('../../../../js/core/app-shell.js', import.meta.url), 'utf8');
  runInNewContext(code, { window: win, document: win.document, location: win.location, localStorage: win.localStorage, navigator: win.navigator, console });
  return win;
}
const sidebar = (win: N): string[] => Array.from(win.document.querySelectorAll('#app-sidebar button')).map((b: N) => b.getAttribute('title'));
const mobile = (win: N): string[] => { win.RBI.services.shell.renderMobileModuleMenu(); return Array.from(win.document.querySelectorAll('#mobile-module-menu button')).map((b: N) => b.textContent.trim()); };

test('почта, модуль включён и есть право: «План/Факт» + «Настройки»; Quality, Стройконтроль и заглушки скрыты', () => {
  const win = shell('email', { planfact: true, company: false });
  assert.deepEqual(sidebar(win), ['План/Факт', 'Настройки']);
  assert.deepEqual(mobile(win), ['План/Факт']);
});

test('почта, модуль выключен у компании (или нет права): пункта нет — только «Настройки»', () => {
  const win = shell('email', { company: true });
  assert.deepEqual(sidebar(win), ['Настройки']);
  assert.deepEqual(mobile(win), []);
  assert.equal(win.RBI.services.shell.isPlatformModuleAllowed('planfact'), false);
});

test('почта (P2-0016): Качество и Стройконтроль — если модуль включён у компании и хранилище компании подключено', () => {
  const on = shell('email', { quality: true, construction: true }, { active: true });
  const s = sidebar(on);
  assert.ok(s.includes('Качество') && s.includes('Стройконтроль'), s.join(', '));
  assert.ok(!s.includes('База знаний'));
  assert.equal(on.RBI.services.shell.legacyModuleAllowed('construction-v2'), true);
  const onlyQ = sidebar(shell('email', { quality: true }, { active: true }));
  assert.ok(onlyQ.includes('Качество') && !onlyQ.includes('Стройконтроль'), onlyQ.join(', '));
  const noBridge = sidebar(shell('email', { quality: true, construction: true }, null));
  assert.ok(!noBridge.includes('Качество'), 'без подключённого хранилища компании — пункта нет');
});

test('PIN (старый вход): Quality / Стройконтроль как раньше, пунктов Platform 2.0 нет — даже если флаг остался', () => {
  const win = shell('pin', { planfact: true });
  const s = sidebar(win);
  assert.ok(s.includes('Качество') && s.includes('Стройконтроль'));
  assert.ok(!s.includes('План/Факт'));
  assert.equal(win.RBI.services.shell.isPlatformModuleAllowed('planfact'), false);
});

test('демо: как раньше + «План/Факт» (разбор ВОР без сервера); «никто не вошёл» — без модулей Platform 2.0', () => {
  const demo = sidebar(shell('demo', {}));
  assert.ok(demo.includes('Качество') && demo.includes('План/Факт'));
  assert.ok(!sidebar(shell('none', {})).includes('План/Факт'));
});

test('адрес #/planfact без доступа: «Модуль не подключён», файл модуля не запрашивается; разные входы — разные подсказки', async () => {
  const win: N = new Window({ url: 'http://localhost/#/planfact' });
  const g = globalThis as N;
  const saved = { window: g.window, document: g.document, location: g.location };
  g.window = win; g.document = win.document; g.location = win.location;
  let routeFn: (() => void) | null = null;
  let mode = 'email';
  win.AppRouter = { addRoute: (p: string, fn: () => void) => { if (p === '#/planfact') routeFn = fn; } };
  win.RBI = { platform2: { getState: () => ({ mode }) }, services: { shell: { isPlatformModuleAllowed: () => false, platformEntryMode: () => mode } } };
  try {
    const url = new URL('../../../../js/modules/planfact/index.js', import.meta.url).href;
    const mod: N = await import(url);
    mod.init({});
    assert.match(win.document.querySelector('[data-testid=pf-not-connected]')?.textContent || '', /не подключён.*администратору компании/s);
    assert.equal(mod.isMounted(), false, 'бандл не загружен');
    mode = 'pin';
    routeFn!();
    assert.match(win.document.querySelector('[data-testid=pf-not-connected]')?.textContent || '', /входом по почте/);
  } finally {
    g.window = saved.window; g.document = saved.document; g.location = saved.location;
  }
});
