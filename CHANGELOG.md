# Changelog — platform-2-core

## P2-0004 — вход, компании, роли и права на сервере (ветка `task/P2-0004-access-rls`, ждёт приёмки)

- Сервер (общий Supabase, ADR-061): схема `planfact` — компании, проекты, участники, работы, каталог действий (19), 9 ролей-шаблонов, роли компании, назначения «пользователь → роль → проект» со сроком/отзывом, модули компании, журнал аудита (append-only). RLS на всех таблицах; одна функция проверки права `planfact.has_permission`. Миграции `supabase/migrations/001–004` (up/down).
- Доступ приложения — только через `public.pf_*` (схема `planfact` не открыта в PostgREST; настройки сервера не менялись).
- Вход почта + пароль (`src/platform/auth/auth.service.ts`, `@supabase/supabase-js` 2.118.0), форма входа, выход, шапка «почта · компания · роль»; «Работать локально (демо)» сохранён. Ключи `P2_SUPABASE_URL/ANON_KEY` в `config.service.js`; старые `SUPABASE_URL/KEY` пусты.
- «План/Факт» из базы: переключатель проекта, «Добавить работу» (по праву `planfact.works.edit`), колонка суммы (по `planfact.money.view`), журнал изменений (по `planfact.audit.view`).
- Тесты: `npm run test:server` (REST), SQL-тесты `tests/server/002_permissions.sql`, `004_audit_money.sql`; unit — вход и экран работ (всего 53). `sw.js`: кэш 18.59.60.
- `docs/SERVERS.md` переписан: что создано, как применять/откатывать, тестовые данные.

## P2-0002 — оболочка + модуль «План/Факт» на демо-данных (ветка `task/P2-0002-shell-planfact`, ждёт приёмки)

- Оболочка отрезана от боевого сервера: пустой `config.service.js` (единственное место настройки), `report.html` берёт конфиг оттуда; облачный вход → «Облачный вход отключён в dev-сборке».
- Service worker: кэш `platform2-v…`, удаляет только свои кэши, API пропускается по пути (без привязки к хосту). IndexedDB `PLATFORM2_DB`.
- Модуль `planfact` (React 19.3.1 + TS): демо-таблица работ (ед., план, факт, %), темы оболочки через CSS-переменные; контракт `init/mount/unmount`; выключатель `enabled` в manifest.
- Общий пункт меню модулей Platform 2.0 (`getPlatformMenuItems()` в `app-shell.js`).
- Скрипты: `npm run dev`, `npm test`, `npm run build:planfact`; удалён `check:boundaries` (нет `_ai/scripts`).
- Регламент разработки перенесён в репозиторий (`CLAUDE.md`, `AGENTS.md`, `FILE_MAP.md`, `README_START_HERE.md`, `ai-dev/`).
- `docs/SERVERS.md` — старый адрес сервера и порядок подключения (после P2-0004).
