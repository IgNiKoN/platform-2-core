-- Откат P2-0004b этап 1 (005). Свои роли компаний и назначения остаются (данные), функции экранов удаляются,
-- pf_assign_role / pf_revoke_assignment возвращаются к версии 002, прямой SELECT журнала — как после 004.
-- project_id журнала остаётся необязательным: строки событий компании (без проекта) неизменяемы (append-only).
drop function if exists public.pf_list_company_audit(uuid, int);
drop function if exists public.pf_delete_role(uuid);
drop function if exists public.pf_set_role_actions(uuid, text[]);
drop function if exists public.pf_rename_role(uuid, text);
drop function if exists public.pf_create_role(uuid, text);
drop function if exists public.pf_list_company_members(uuid);
drop function if exists public.pf_list_company_roles(uuid);
drop function if exists public.pf_permission_catalog();
drop function if exists public.pf_my_admin_companies();

create or replace function public.pf_assign_role(p_user uuid, p_role uuid, p_project uuid default null, p_valid_to timestamptz default null)
returns uuid language plpgsql security definer set search_path = pg_catalog, planfact as $$
declare v_company uuid; v_id uuid;
begin
  select company_id into v_company from planfact.company_roles where id = p_role;
  if v_company is null or not planfact.has_company_permission(v_company, 'security.roles.assign') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_user = auth.uid() then
    raise exception 'cannot assign a role to yourself' using errcode = '42501';
  end if;
  insert into planfact.role_assignments(company_id, user_id, role_id, project_id, valid_to, created_by)
  values (v_company, p_user, p_role, p_project, p_valid_to, auth.uid())
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.pf_revoke_assignment(p_assignment uuid)
returns void language plpgsql security definer set search_path = pg_catalog, planfact as $$
declare v_company uuid;
begin
  select company_id into v_company from planfact.role_assignments where id = p_assignment;
  if v_company is null or not planfact.has_company_permission(v_company, 'security.roles.assign') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update planfact.role_assignments set revoked_at = now(), revoked_by = auth.uid()
   where id = p_assignment and revoked_at is null;
end $$;

drop function if exists planfact.check_role_name(uuid, text, uuid);
drop function if exists planfact.editable_role(uuid);
drop function if exists planfact.role_snapshot(uuid);
drop function if exists planfact.log_admin_change(uuid, uuid, text, uuid, text, jsonb, jsonb);
drop function if exists planfact.assert_company_has_admin(uuid);
drop function if exists planfact.require_roles_admin(uuid);
drop index if exists planfact.audit_log_company_idx;
grant select on planfact.audit_log to authenticated;
