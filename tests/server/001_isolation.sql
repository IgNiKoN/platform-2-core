-- P2-0004 этап 1: негативные тесты изоляции компаний. Выполняется в SQL Editor, всё откатывается (отчёт приходит как ERROR P0001).
do $$
declare
  ua uuid := gen_random_uuid(); ub uuid := gen_random_uuid();
  ca uuid := gen_random_uuid(); cb uuid := gen_random_uuid();
  pa uuid := gen_random_uuid(); pb uuid := gen_random_uuid();
  n int; res text := '';
begin
  insert into auth.users(id, email) values (ua, 'a@test.invalid'), (ub, 'b@test.invalid');
  insert into planfact.companies(id, name, is_test) values (ca, 'Альфа', true), (cb, 'Бета', true);
  insert into planfact.company_members(company_id, user_id) values (ca, ua), (cb, ub);
  insert into planfact.projects(id, company_id, name) values (pa, ca, 'Проект А'), (pb, cb, 'Проект Б');
  insert into planfact.project_members(project_id, company_id, user_id) values (pa, ca, ua), (pb, cb, ub);
  insert into planfact.works(company_id, project_id, name, created_by) values (ca, pa, 'Работа А', ua), (cb, pb, 'Работа Б', ub);
  perform set_config('request.jwt.claim.sub', ua::text, true);
  perform set_config('request.jwt.claims', json_build_object('sub', ua, 'role', 'authenticated')::text, true);
  set local role authenticated;
  select count(*) into n from planfact.works; res := res || format(E'1 works видит Альфа (1): %s\n', n);
  select count(*) into n from planfact.works where project_id = pb; res := res || format(E'2 works Беты (0): %s\n', n);
  select count(*) into n from planfact.companies; res := res || format(E'3 companies (1): %s\n', n);
  select count(*) into n from public.pf_my_projects(); res := res || format(E'4 projects (1): %s\n', n);
  begin insert into planfact.works(company_id, project_id, name, created_by) values (cb, pb, 'x', ua); res := res || E'5 FAIL\n';
  exception when others then res := res || E'5 OK ' || sqlerrm || E'\n'; end;
  begin insert into planfact.works(company_id, project_id, name, created_by) values (cb, pa, 'x', ua); res := res || E'6 FAIL\n';
  exception when others then res := res || E'6 OK ' || sqlerrm || E'\n'; end;
  begin perform public.pf_add_work(pb, 'x'); res := res || E'7 FAIL\n';
  exception when others then res := res || E'7 OK ' || sqlerrm || E'\n'; end;
  begin perform public.pf_add_work(pa, 'x'); res := res || E'8 OK\n';
  exception when others then res := res || E'8 FAIL ' || sqlerrm || E'\n'; end;
  begin update planfact.works set name = 'x'; res := res || E'9 FAIL\n';
  exception when others then res := res || E'9 OK ' || sqlerrm || E'\n'; end;
  begin delete from planfact.works; res := res || E'10 FAIL\n';
  exception when others then res := res || E'10 OK ' || sqlerrm || E'\n'; end;
  reset role;
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claims', '', true);
  set local role anon;
  begin select count(*) into n from planfact.works; res := res || E'11 FAIL\n';
  exception when others then res := res || E'11 OK ' || sqlerrm || E'\n'; end;
  begin select count(*) into n from public.pf_my_projects(); res := res || E'12 FAIL\n';
  exception when others then res := res || E'12 OK ' || sqlerrm || E'\n'; end;
  reset role;
  raise exception E'ОТЧЁТ (откат):\n%', res;
end $$;
