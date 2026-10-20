# platform-2-core

Оболочка Platform 2.0 с модулем «План/Факт СМР».
Источник: локальный снимок `rbi-q-main` (коммит c6f6b02 + незакоммиченные правки на 20.10.2026). Старое приложение (production Quality) этим репозиторием не изменяется.

**Сейчас работает только локально:** облако выключено, к боевому серверу не обращается (см. `docs/SERVERS.md`).

## Как запустить (у себя на компьютере)

Нужен Node.js 24+ (проверить: `node -v`).

1. Скачать проект: `git clone https://github.com/IgNiKoN/platform-2-core.git` и перейти в папку `cd platform-2-core`.
2. Установить зависимости (нужен интернет, один раз): `npm ci`.
3. Запустить: `npm run dev`.
4. Открыть в браузере http://localhost:8781 → нажать **«Работать локально»**.
5. В левом меню выбрать **«План/Факт»** → таблица демо-работ (наименование, ед., план, факт, %).

Остановить сервер — `Ctrl+C` в окне терминала. Другой порт: `PORT=8790 npm run dev`.

## Команды для разработчика

| Команда | Что делает |
|---|---|
| `npm run dev` | локальный сервер без кэша (`scripts/dev-server.mjs`, только 127.0.0.1) |
| `npm test` | unit-тесты (оболочка + модуль planfact) |
| `npm run check:ts` | проверка типов TypeScript |
| `npm run build:planfact` | сборка модуля План/Факт → `js/dist/planfact/planfact.js` |
| `npm run build:modules` | сборка старых TS-модулей оболочки (locations, construction-*) |

После правок в `src/modules/planfact/**` выполнить `npm run build:planfact` — оболочка грузит собранный файл. Если браузер показывает старую версию — service worker: DevTools → Application → Service Workers → Unregister, затем обновить страницу.

## Модуль «План/Факт»

- Исходники: `src/modules/planfact/` (React + TypeScript), демо-данные — `demo-data.json` (вымышленные).
- Описание модуля (manifest): `js/modules/planfact/planfact.manifest.js`. **Выключить модуль** — `enabled: false` там же (пункт меню пропадёт, модуль не загрузится).
- Контракт: `init(ctx)` / `mount(el)` / `unmount()`.
- В меню модуль попадает через общий блок `getPlatformMenuItems()` в `js/core/app-shell.js` (manifest с `menu.section: 'platform'`).

## Регламент

Правила разработки Platform 2.0 — папка регламента (`CLAUDE.md`, `AGENTS.md`, `ai-dev/`).
