-- P2-0016: откат 018d_quality_storage_up.sql. Удаляет бакеты quality-* вместе с файлами компаний, политики quality_files_*,
-- функции has_actions/storage_can; quality.can — как в 018. Применять до 018c_quality_access_down.sql.
begin;

drop policy if exists quality_files_select on storage.objects;
drop policy if exists quality_files_insert on storage.objects;
drop policy if exists quality_files_update on storage.objects;
drop policy if exists quality_files_delete on storage.objects;
delete from storage.objects where bucket_id like 'quality-%';
delete from storage.buckets where id like 'quality-%';

create or replace function quality.can(p_company uuid, p_project uuid, p_actions text[])
returns boolean language sql stable security definer set search_path = pg_catalog, core, planfact as $$
  select p_company is not null and p_company = quality.request_company() and exists (
    select 1 from unnest(p_actions) act
    join core.permission_catalog pc on pc.action = act
    join core.company_modules cm on cm.company_id = p_company and cm.module = split_part(act, '.', 1) and cm.enabled
    where planfact.is_platform_admin() or exists (
      select 1 from core.role_assignments a
      join core.company_role_permissions rp on rp.role_id = a.role_id and rp.company_id = a.company_id and rp.action = act
      where a.company_id = p_company and a.user_id = auth.uid()
        and (p_project is null or a.project_id is null or a.project_id = p_project)
        and a.revoked_at is null and a.valid_from <= now() and (a.valid_to is null or a.valid_to > now())));
$$;
revoke all on function quality.can(uuid, uuid, text[]) from public, anon, authenticated;
grant execute on function quality.can(uuid, uuid, text[]) to authenticated;
drop function if exists quality.storage_can(text, text, boolean);
drop function if exists quality.has_actions(uuid, uuid, text[]);

commit;
