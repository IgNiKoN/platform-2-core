/**
 * Манифест модуля «План/Факт» (Platform 2.0, P2-0002).
 * enabled — единственный выключатель модуля: false → нет пункта меню и модуль не загружается.
 * menu.section 'platform' — пункт рисуется общим блоком меню оболочки (app-shell.renderPlatformMenu).
 */

export const PlanfactManifest = {
    id: 'planfact',
    role: 'module',
    title: 'План/Факт',
    icon: 'table',
    version: '0.1.0',
    status: 'active',
    enabled: true,
    entry: './index.js',
    menu: { section: 'platform', label: 'План/Факт', order: 50, path: '#/planfact' },
    routes: ['/planfact'],
    defaultRoute: '/planfact'
};
