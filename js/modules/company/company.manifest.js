/**
 * Манифест раздела платформы «Компания» (Platform 2.0, P2-0004b): роли и сотрудники компании.
 * menu.requiresAccess — пункт виден только когда раздел сам подтвердил право с сервера
 * (window.RBI.platformMenuAccess.company === true, право security.roles.assign). Сервер проверяет каждый вызов.
 */

export const CompanyManifest = {
    id: 'company',
    role: 'module',
    title: 'Компания',
    icon: 'users',
    version: '0.1.0',
    status: 'active',
    enabled: true,
    entry: './index.js',
    menu: { section: 'platform', label: 'Компания', order: 60, path: '#/company', requiresAccess: true },
    routes: ['/company'],
    defaultRoute: '/company'
};
