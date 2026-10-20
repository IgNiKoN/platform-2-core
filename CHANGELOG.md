# Changelog — platform-2-core

## P2-0002 — оболочка + модуль «План/Факт» на демо-данных (ветка `task/P2-0002-shell-planfact`, ждёт приёмки)

- Оболочка отрезана от боевого сервера: пустой `config.service.js` (единственное место настройки), `report.html` берёт конфиг оттуда; облачный вход → «Облачный вход отключён в dev-сборке».
- Service worker: кэш `platform2-v…`, удаляет только свои кэши, API пропускается по пути (без привязки к хосту). IndexedDB `PLATFORM2_DB`.
- Модуль `planfact` (React 19.3.1 + TS): демо-таблица работ (ед., план, факт, %), темы оболочки через CSS-переменные; контракт `init/mount/unmount`; выключатель `enabled` в manifest.
- Общий пункт меню модулей Platform 2.0 (`getPlatformMenuItems()` в `app-shell.js`).
- Скрипты: `npm run dev`, `npm test`, `npm run build:planfact`; удалён `check:boundaries` (нет `_ai/scripts`).
- `docs/SERVERS.md` — старый адрес сервера и порядок подключения (после P2-0004).
