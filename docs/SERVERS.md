# Серверы Platform 2.0

**Сейчас (P2-0004):** «План/Факт» подключён к общему self-hosted Supabase `https://api.rbi-q.ru` (ADR-061, ADR-061a). Адрес и публичный anon-ключ Platform 2.0 — в `js/services/config.service.js`, ключи `P2_SUPABASE_URL` / `P2_SUPABASE_ANON_KEY`. Старые `SUPABASE_URL` / `SUPABASE_KEY` **остаются пустыми**: иначе старая синхронизация Quality начнёт писать в боевые таблицы.

## Что создано на сервере (только новое)

| Миграция | Что добавляет |
|---|---|
| `001` | Схема `planfact`: companies, company_members, projects, project_members*, works; RLS (deny-by-default); функции `public.pf_my_projects`, `pf_list_works`, `pf_add_work` |
| `002` | Каталог действий (19), 9 шаблонов ролей, роли компании, назначения, модули компании, `planfact.has_permission` / `has_company_permission`; триггер копирования шаблонов в новую компанию; `pf_my_permissions`, `pf_assign_role`, `pf_revoke_assignment`. Таблица `project_members` удалена (доступ к проекту = назначения роли) |
| `003` | `public.pf_my_context` — «компания · роль» для шапки |
| `005` | Конструктор ролей (P2-0004b): `pf_my_admin_companies`, `pf_permission_catalog`, `pf_list_company_roles`, `pf_list_company_members`, `pf_create_role`, `pf_rename_role`, `pf_set_role_actions`, `pf_delete_role`, `pf_list_company_audit`; `pf_assign_role` / `pf_revoke_assignment` с правилами защиты и записью в журнал; служебные `planfact.require_roles_admin`, `assert_company_has_admin`, `log_admin_change`, `role_snapshot`, `editable_role`, `check_role_name`. `audit_log.project_id` необязателен (события компании), прямой SELECT журнала у `authenticated` отозван; `pf_list_audit` — только работы. Применена 21.10.2026 |
| `004` | `works.plan_amount` (только при `planfact.money.view`), `planfact.audit_log` (append-only, пишет триггер), `pf_list_works` (переписана), `pf_list_audit` |

Файлы: `supabase/migrations/NNN_up.sql` / `NNN_down.sql`. Схема `planfact` в PostgREST **не открыта**: приложение работает только через `public.pf_*` (права вызывающего, RLS действует). Объекты RBI/Quality и настройки Auth/JWT/PostgREST не менялись.

Состояние сервера до работ (разведка 20.10.2026): PostgreSQL 15.8, `public`: 74 таблицы и 43 функции, БД 1712 MB. После: 74 таблицы, 46+ функций (`pf_*` добавлены).

## Как применять миграции

Каждую — только по явному разрешению владельца, после снэпшота сервера: выполнить `NNN_up.sql` в SQL Editor сервера. Повторное применение безопасно (`if not exists`, `or replace`). Откат — `NNN_down.sql` в обратном порядке (005 → 001); откат 005 оставляет созданные роли и назначения (данные) и строки журнала, удаляет функции экранов; откат 002 теряет назначения ролей, откат 004 — журнал и суммы. **Откат на копии базы не проверялся** (см. `TECH_DEBT.md`).

## Тестовые данные

Компании «Альфа» и «Бета» (`is_test = true`), пользователи `alfa-admin`, `alfa-pto`, `alfa-foreman`, `beta-pto` (`@test.invalid`). Пароли — только в `.env.local` (`P2_TEST_*_PASSWORD`). Создание пользователей — SQL-скрипт этапа 3 (запись в `auth.users` / `auth.identities`); для удаления: `delete from auth.users where email like '%@test.invalid'` и `delete from planfact.companies where is_test` (журнал `audit_log` защищён триггером: перед удалением компаний его надо временно отключить владельцем базы).

## Проверки

- `npm run test:server` — вход и запросы через настоящий REST (нужен `.env.local`; без него SKIP, не PASS). Каждый запуск добавляет тестовую работу «REST-тест …» в проект Альфы.
- SQL-тесты в SQL Editor (с откатом, отчёт приходит как `ERROR P0001`): `tests/server/002_permissions.sql` (26 проверок), `tests/server/004_audit_money.sql` (13), `tests/server/005_role_builder.sql` (48; можно вставить после `005_up.sql` в одно окно). Снимок объектов RBI до/после — `tests/server/005_rbi_snapshot.sql` (21.10.2026: до и после 005 совпали).
