# P2-0002 — отчёт Исполнителя №1 (этапы 1–5 готовы, этап 6 BLOCKED)

Репо `~/dev/platform-2-core`, ветка `task/P2-0002-shell-planfact` от `main` `379cc5f`. Старт 20.10.2026 (владелец: «исполнитель»).

| Этап | Проверка → результат | Коммит |
|---|---|---|
| 1 | grep `api.rbi-q.ru` в коде (кроме docs/sql) → 0; anon-ключ в репо → 0 файлов; `npm test` 34/34; `check:ts` 0; `build:modules` PASS; локально: «Войти в облако» → тост «Облачный вход отключён в dev-сборке», внешних запросов 0, кэш `platform2-v18.59.59`, IndexedDB `PLATFORM2_DB`. **Pages: NOT DONE** — `gh` не установлен, удаление заблокировано средой; `ignikon.github.io/platform-2-core/` → 200 → действие владельца | `f74b39c` |
| 2 | пункт «План/Факт» в меню → заглушка `tab-planfact`; регрессия: quality/audit, analytics, construction-v2, construction/defects, settings открываются; ошибок консоли 0; `npm test` 34/34; `check:ts` 0. Скриншот `stage2-planfact-stub.jpg` | `e561b8e` |
| 3 | `npm run build:planfact` PASS (369 КБ / 85 КБ gzip, production React); `npm test` 38/38 (рендер таблицы, %, демо 5–8 работ, CSS без своих цветов); `check:ts` 0; браузер: 6 строк, тёмная (`rbi-dark-v3`) и светлая (`rbi-light-v3`) темы — `stage3-table-dark.jpg`, `stage3-table-light.jpg` | `360e68c` |
| 4 | `npm test` 41/41: mount→unmount ×3 (1 таблица, пустой контейнер, 1 `<style>`, body без лишних узлов), двойной mount/unmount, `enabled:false` → нет в `getMenuItems`, `loadModule` отказ; браузер `enabled:false` → нет пункта (ПК и моб.), модуль не загружен, маршрута нет, ошибок 0; `git diff main -- js/modules/quality*` пусто | `c7ce00a` |
| 5 | README, CHANGELOG, `docs/TECH_DEBT.md`; карты `FILE_MAP.md`, `CODEBASE_MAP.md`, `SOURCE_AND_STATUS.md` (в регламенте). Чистый клон ветки: `npm ci` OK, `npm test` 41/41, `check:ts` 0, `build:planfact` (байт-в-байт как в git), `build:modules` exit 0, grep `api.rbi-q.ru` 0; `npm run dev` → «План/Факт» → 6 работ, 0 внешних запросов — `stage5-clean-clone-planfact.jpg` | `0ec02e3` |
| 6 | Копия регламента в репо: 68 файлов, `diff -rq` — идентично; xlsx/zip/ключей/`_ai` нет. Правка путей в `LOOP.md`, `FILE_MAP.md`, `skills-backup/*` — **отклонена средой** (классификатор auto mode: «Instruction Poisoning» — изменение файлов-инструкций агентов). Копия из репо удалена (не закоммичена), iCloud не переименован, `CLAUDE.md` не менялся | — (BLOCKED) |

**NOT RUN:** офлайн-перезагрузка страницы (в панели браузера нельзя выключить сеть); работа с БД/правами — P2-0004.
**Среда:** в панели браузера SW не регистрируется на порту, открытом «по ссылке» (не через launch.json) — «unknown error when fetching the script»; через управляемый запуск тот же код регистрирует SW. Не дефект кода.

## Отклонения от плана (с причиной)
- Остаток grep `rbi-q.ru`: `app.rbi-q.ru` в QR-ссылках Quality (`reports.actions.js`) и текст в `settings.actions.js:348` — не запросы; Quality трогать запрещено. `sql/README.md` — документация.
- `sync-connection.actions.js:346` (1 строка): облачный вход идёт через неё, иначе сообщение не показать.
- `settings.actions.js:470`: запасное имя IndexedDB → `PLATFORM2_DB` (единый источник имени).
- `check:boundaries` удалён (нет `_ai/scripts`); `smoke:*` тоже ссылаются на `_ai/scripts` — оставлены, в TECH_DEBT.
- Добавлен `npm test` (= `test:unit`) и `npm run dev` (`scripts/dev-server.mjs`, без кэша, 127.0.0.1:8781).
- Меню: «3 места ядра» недостаточно — меню зашито в `app-shell.js`. Добавлена одна общая точка `getPlatformMenuItems()` (ПК + мобильное меню): модули с `menu.section:'platform'` появляются из manifest. Маршрут `#/planfact` регистрирует сам модуль (`AppRouter.addRoute`).
- Добавлены dev-зависимости `@types/react`, `@types/react-dom` 19.3.0 и `happy-dom` 21.0.3 (DOM для unit-теста mount/unmount); `tsconfig`: `allowImportingTsExtensions` (Node 24 запускает `.ts` тесты напрямую). Компонент без JSX (`createElement`) — чтобы тесты шли без сборки.
- `build:modules` пересобирает устаревшие `js/dist/rbi-locations.js`, `construction-v2.js` (в main dist отстаёт от исходников) — изменения откатаны, в TECH_DEBT.

## Итоговая самопроверка (roles/TESTER.md)
- Сборки: `build:planfact`, `build:modules` PASS; `check:ts` 0; `npm test` 41/41 (основная копия и чистый клон).
- Сценарий владельца на чистом клоне — PASS (скриншот этапа 5). Регрессия модулей оболочки — PASS (этап 2).
- Негативные: облачный вход → сообщение, 0 запросов — PASS; `enabled:false` — PASS. Права/RLS — не в объёме (P2-0004), NOT RUN.
- Полный diff `main..0ec02e3`: 30 файлов, все в §4 карточки или в «Отклонениях»; Quality не тронут.

## Блокер этапа 6 (вопрос владельцу/Архитектору)
Среда не даёт агенту менять файлы-инструкции (регламент, скилы). Варианты:
- **А (рекомендуется):** владелец явно разрешает в чате правку регламента и скилов для этапа 6; если среда всё равно блокирует — владелец добавляет разрешение в настройках Claude Code.
- **Б:** владелец сам: копирует папку регламента в репо, переименовывает iCloud-папку в `…__ARCHIVE_moved_to_repo`, меняет 2 строки в `CLAUDE.md`; Исполнитель только проверяет `diff -r` и коммитит.
- **В:** вынести этап 6 в отдельную задачу, P2-0002 принять по этапам 1–5.
Скилы `platform2-*` в любом варианте обновляет владелец (claude.ai → Skills): локальные файлы — кэш приложения.

## Действия владельца
- GitHub Pages выключить (Settings → Pages → Unpublish) — `gh` нет, удаление заблокировано средой.
- Push ветки — только после «push разрешён».
