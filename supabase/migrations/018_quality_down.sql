-- P2-0016: откат 018_quality_up.sql. СГЕНЕРИРОВАНО scripts/gen-quality-schema.mjs.
-- Удаляет раздел quality со всеми данными компаний, права модулей Качество/Стройконтроль; модули снова неуправляемые.
-- Раздел quality перед откатом убрать из API (настройка PGRST_DB_SCHEMAS). Применять до 017a_core_review_down.sql.
begin;

drop schema if exists quality cascade;
delete from core.company_role_permissions where action in
  ('quality.view', 'quality.edit', 'quality.manage', 'construction.view', 'construction.edit', 'construction.manage');
delete from core.role_template_permissions where action in
  ('quality.view', 'quality.edit', 'quality.manage', 'construction.view', 'construction.edit', 'construction.manage');
delete from core.permission_catalog where action in
  ('quality.view', 'quality.edit', 'quality.manage', 'construction.view', 'construction.edit', 'construction.manage');
update core.module_catalog set managed = false where code in ('quality', 'construction');

commit;
