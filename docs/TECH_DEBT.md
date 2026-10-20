# Технический долг platform-2-core

| # | Что | Где | Откуда | Когда решать |
|---|---|---|---|---|
| 1 | GitHub Pages ещё включены (сайт отвечает 200); SW и кэш на общем origin `ignikon.github.io` | Settings → Pages | P2-0002 этап 1 | владелец, сразу |
| 2 | `smoke:knowledge`, `smoke:construction-knowledge` ссылаются на отсутствующий `_ai/scripts` | `package.json` | P2-0001/P2-0002 | при ревизии скриптов |
| 3 | Закоммиченные `js/dist/rbi-locations.js`, `construction-v2.js` отстают от исходников: `build:modules` их меняет | `js/dist/` | P2-0002 | отдельной задачей (пересобрать и закоммитить) |
| 4 | Ссылки `app.rbi-q.ru` в QR отчётов Quality и текст в настройках | `quality/features/reports/reports.actions.js`, `settings/settings.actions.js:348` | P2-0002 | при отделении Quality |
| 5 | Меню старых модулей зашито в `app-shell.js` (BUSINESS_MODULES, construction-v2); общий путь только для `menu.section:'platform'` | `js/core/app-shell.js` | P2-0002 | при переводе старых модулей |
| 6 | Модуль `planfact` переключает вкладку сам (копия логики `switchViewNode` из `views.js`, она не экспортирована); при уходе с вкладки экран не размонтируется | `src/modules/planfact/index.ts` | P2-0002 | при появлении `ctx.shell.showView` |
| 7 | Нижняя навигация режима Quality видна и на вкладке «План/Факт» | оболочка | P2-0002 | при собственной навигации модуля |
| 8 | Бандл planfact 369 КБ (85 КБ gzip) — React внутри бандла | `js/dist/planfact/` | P2-0002 | при втором React-модуле (общий vendor) |
