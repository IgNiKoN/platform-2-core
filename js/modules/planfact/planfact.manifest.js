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
    /** Подвкладки модуля: нижний таббар (телефон/планшет) и nav2 (≥1280) — как у Quality. Новые разделы добавляются сюда.
     *  requiresAccess — пункт виден, когда сервер подтвердил доступ (window.RBI.platformMenuAccess[<id>]). */
    nav: [
        { id: 'works', label: 'Работы', path: '#/planfact', icon: 'M3 10h18M3 14h18M10 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z' },
        { id: 'directories', label: 'Справочники', path: '#/planfact/directories', requiresAccess: true,
          icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
    ],
    routes: ['/planfact'],
    defaultRoute: '/planfact'
};
