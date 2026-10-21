// P2-0004: проверка через настоящий REST/Auth сервера. Читает .env.local; без него — SKIP (не PASS).
import { readFileSync, existsSync } from 'node:fs';
const envFile = new URL('../../.env.local', import.meta.url);
if (!existsSync(envFile)) { console.log('SKIP: нет .env.local (NOT RUN)'); process.exit(0); }
const env = Object.fromEntries(readFileSync(envFile, 'utf8').split('\n').filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const URL_ = env.P2_SUPABASE_URL, ANON = env.P2_SUPABASE_ANON_KEY;
let fails = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`); if (!ok) fails++; };
const rpc = (fn, body, token) => fetch(`${URL_}/rest/v1/rpc/${fn}`, { method: 'POST', headers: { apikey: ANON, Authorization: `Bearer ${token || ANON}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
async function login(email, password) {
  const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return { status: r.status, json: await r.json() };
}
const users = { alfaAdmin: ['alfa-admin@test.invalid', env.P2_TEST_ALFA_ADMIN_PASSWORD], alfaPto: ['alfa-pto@test.invalid', env.P2_TEST_ALFA_PTO_PASSWORD],
  alfaForeman: ['alfa-foreman@test.invalid', env.P2_TEST_ALFA_FOREMAN_PASSWORD], betaPto: ['beta-pto@test.invalid', env.P2_TEST_BETA_PTO_PASSWORD] };
const tok = {};
for (const [k, [e, p]] of Object.entries(users)) { const r = await login(e, p); tok[k] = r.json.access_token; check(`вход ${e}`, r.status === 200 && !!tok[k]); }
const bad = await login('alfa-pto@test.invalid', 'wrong-password-123');
check('неверный пароль отклонён', bad.status === 400 && !bad.json.access_token, `статус ${bad.status}`);
const an = await rpc('pf_my_projects', {}); check('anon не вызывает pf_my_projects', an.status === 401 || an.status === 403, `статус ${an.status}`);
const projs = {};
for (const k of Object.keys(tok)) { const r = await rpc('pf_my_projects', {}, tok[k]); projs[k] = r.ok ? await r.json() : []; }
check('Альфа-ПТО видит 1 проект Альфы', projs.alfaPto.length === 1 && projs.alfaPto[0].name.startsWith('Альфа'));
check('Бета-ПТО видит 1 проект Беты', projs.betaPto.length === 1 && projs.betaPto[0].name.startsWith('Бета'));
const pA = projs.alfaPto[0]?.id, pB = projs.betaPto[0]?.id;
const wl = async (k, p) => (await (await rpc('pf_list_works', { p_project: p }, tok[k])).json());
check('Альфа-ПТО видит 2 работы Альфы', (await wl('alfaPto', pA)).length >= 2);
check('Альфа-ПТО не видит работ Беты', (await wl('alfaPto', pB)).length === 0);
check('Бета-ПТО не видит работ Альфы', (await wl('betaPto', pA)).length === 0);
const perms = async (k, p) => (await (await rpc('pf_my_permissions', { p_project: p }, tok[k])).json());
const fp = await perms('alfaForeman', pA);
check('прораб: нет works.edit и money.view, есть fact.create', !fp.includes('planfact.works.edit') && !fp.includes('planfact.money.view') && fp.includes('planfact.fact.create'));
check('ПТО: есть works.edit', (await perms('alfaPto', pA)).includes('planfact.works.edit'));
const ctxOf = async (k) => (await (await rpc('pf_my_context', {}, tok[k])).json());
const cp = await ctxOf('alfaPto'), cf = await ctxOf('alfaForeman'), cb = await ctxOf('betaPto');
check('шапка: ПТО Альфы = Альфа · Инженер ПТО', cp.length === 1 && cp[0].company_name === 'Альфа' && cp[0].role_name === 'Инженер ПТО');
check('шапка: прораб = Альфа · Прораб / мастер', cf.length === 1 && cf[0].role_name === 'Прораб / мастер');
check('шапка: ПТО Беты видит только Бету', cb.length === 1 && cb[0].company_name === 'Бета');
const anCtx = await rpc('pf_my_context', {}); check('anon не вызывает pf_my_context', anCtx.status === 401 || anCtx.status === 403);
const fAdd = await rpc('pf_add_work', { p_project: pA, p_name: 'ВЗЛОМ-ПРОРАБ' }, tok.alfaForeman);
check('прораб: pf_add_work отклонён', !fAdd.ok, `статус ${fAdd.status}`);
const cross = await rpc('pf_add_work', { p_project: pB, p_name: 'ВЗЛОМ-ЧУЖОЙ' }, tok.alfaPto);
check('ПТО Альфы: добавление в проект Беты отклонено', !cross.ok, `статус ${cross.status}`);
const direct = await fetch(`${URL_}/rest/v1/works`, { method: 'POST', headers: { apikey: ANON, Authorization: `Bearer ${tok.alfaPto}`, 'Content-Type': 'application/json', 'Accept-Profile': 'planfact', 'Content-Profile': 'planfact' }, body: '{}' });
check('схема planfact не открыта через REST напрямую', !direct.ok, `статус ${direct.status}`);
// --- этап 4: суммы, журнал, добавление ---
const stamp = 'REST-тест ' + new Date().toISOString();
const addOk = await rpc('pf_add_work', { p_project: pA, p_name: stamp, p_unit: 'шт', p_plan_qty: 1 }, tok.alfaPto);
check('ПТО добавил работу через pf_add_work', addOk.ok, `статус ${addOk.status}`);
const wPto = await wl('alfaPto', pA), wFor = await wl('alfaForeman', pA), wAdm = await wl('alfaAdmin', pA);
check('новая работа видна в списке ПТО', wPto.some((w) => w.name === stamp));
check('ПТО видит суммы (есть money.view)', wPto.some((w) => w.plan_amount !== null));
check('прораб не видит ни одной суммы', wFor.length > 0 && wFor.every((w) => w.plan_amount === null));
check('администратор не видит ни одной суммы', wAdm.length > 0 && wAdm.every((w) => w.plan_amount === null));
const aud = async (k, p) => (await (await rpc('pf_list_audit', { p_project: p }, tok[k])).json());
const audAdm = await aud('alfaAdmin', pA);
check('админ видит в журнале запись: кто=alfa-pto, что=INSERT', audAdm.some((r) => r.actor_email === 'alfa-pto@test.invalid' && r.action === 'INSERT' && r.new_data?.name === stamp));
check('в журнале у админа нет сумм', audAdm.every((r) => !r.new_data || !('plan_amount' in r.new_data)));
check('ПТО не видит журнал', (await aud('alfaPto', pA)).length === 0);
check('прораб не видит журнал', (await aud('alfaForeman', pA)).length === 0);
check('ПТО Беты не видит журнал Альфы', (await aud('betaPto', pA)).length === 0);
const tamper = await fetch(`${URL_}/rest/v1/audit_log`, { method: 'DELETE', headers: { apikey: ANON, Authorization: `Bearer ${tok.alfaAdmin}`, 'Content-Profile': 'planfact' } });
check('журнал не удалить через REST', !tamper.ok, `статус ${tamper.status}`);
// --- P2-0004b: конструктор ролей (миграция 005) ---
const j = async (r) => { const t = await r.text(); try { return JSON.parse(t); } catch { return t; } };
const probe = await rpc('pf_my_admin_companies', {}, tok.alfaAdmin);
if (probe.status === 404) { console.log('NOT RUN: миграция 005 не применена — проверки конструктора ролей пропущены'); fails++; }
else {
  const adm = await j(probe);
  check('админ Альфы управляет 1 компанией (Альфа)', Array.isArray(adm) && adm.length === 1 && adm[0].company_name === 'Альфа');
  const cA = adm[0]?.company_id;
  check('ПТО: раздел «Компания» недоступен', (await j(await rpc('pf_my_admin_companies', {}, tok.alfaPto))).length === 0);
  check('ПТО: список ролей отклонён', !(await rpc('pf_list_company_roles', { p_company: cA }, tok.alfaPto)).ok);
  check('anon: каталог действий закрыт', !(await rpc('pf_permission_catalog', {})).ok);
  const roles = await j(await rpc('pf_list_company_roles', { p_company: cA }, tok.alfaAdmin));
  const tplFor = roles.find((r) => r.template_code === 'foreman');
  check('админ видит 9+ ролей, есть шаблон «Прораб / мастер»', roles.length >= 9 && !!tplFor);
  check('шаблон не переименовать', !(await rpc('pf_rename_role', { p_role: tplFor.id, p_name: 'взлом' }, tok.alfaAdmin)).ok);
  const roleName = 'REST-роль ' + new Date().toISOString();
  const cr = await rpc('pf_create_role', { p_source_role: tplFor.id, p_name: roleName }, tok.alfaAdmin);
  const newRole = await j(cr);
  check('копия шаблона создана', cr.ok && typeof newRole === 'string', `статус ${cr.status}`);
  let asg = null;
  try {
    const sa = await rpc('pf_set_role_actions', { p_role: newRole, p_actions: [...tplFor.actions, 'planfact.works.edit'] }, tok.alfaAdmin);
    check('админ отметил «Добавление и правка работ»', sa.ok, `статус ${sa.status}`);
    check('неизвестное действие отклонено', !(await rpc('pf_set_role_actions', { p_role: newRole, p_actions: ['planfact.no.such'] }, tok.alfaAdmin)).ok);
    check('ПТО Беты не меняет роль Альфы', !(await rpc('pf_rename_role', { p_role: newRole, p_name: 'взлом' }, tok.betaPto)).ok);
    const members = await j(await rpc('pf_list_company_members', { p_company: cA }, tok.alfaAdmin));
    const fUser = members.find((m) => m.email === 'alfa-foreman@test.invalid')?.user_id;
    const aUser = members.find((m) => m.email === 'alfa-admin@test.invalid')?.user_id;
    check('в «Сотрудниках» есть alfa-foreman', !!fUser);
    check('самоназначение отклонено', !(await rpc('pf_assign_role', { p_user: aUser, p_role: newRole, p_project: pA }, tok.alfaAdmin)).ok);
    const ar = await rpc('pf_assign_role', { p_user: fUser, p_role: newRole, p_project: pA }, tok.alfaAdmin);
    asg = await j(ar);
    check('роль назначена прорабу на проект', ar.ok, `статус ${ar.status}`);
    check('прораб сразу получил works.edit (без повторного входа)', (await perms('alfaForeman', pA)).includes('planfact.works.edit'));
    check('прораб добавил работу', (await rpc('pf_add_work', { p_project: pA, p_name: 'REST-прораб ' + roleName }, tok.alfaForeman)).ok);
    check('роль с назначением не удалить', !(await rpc('pf_delete_role', { p_role: newRole }, tok.alfaAdmin)).ok);
    const rv = await rpc('pf_revoke_assignment', { p_assignment: asg }, tok.alfaAdmin); asg = rv.ok ? null : asg;
    check('назначение отозвано', rv.ok, `статус ${rv.status}`);
    check('после отзыва works.edit нет', !(await perms('alfaForeman', pA)).includes('planfact.works.edit'));
    check('после отзыва добавление отклонено сервером', !(await rpc('pf_add_work', { p_project: pA, p_name: 'ВЗЛОМ-после-отзыва' }, tok.alfaForeman)).ok);
  } finally {
    if (asg) await rpc('pf_revoke_assignment', { p_assignment: asg }, tok.alfaAdmin);
    check('роль удалена', (await rpc('pf_delete_role', { p_role: newRole }, tok.alfaAdmin)).ok);
  }
  const ca = await j(await rpc('pf_list_company_audit', { p_company: cA, p_limit: 20 }, tok.alfaAdmin));
  check('журнал: создание роли — автор alfa-admin', ca.some((r) => r.action === 'ROLE_CREATE' && r.actor_email === 'alfa-admin@test.invalid' && r.new_data?.name === roleName));
  check('журнал: назначение и отзыв для alfa-foreman', ['ASSIGN', 'REVOKE'].every((a) => ca.some((r) => r.action === a && r.subject_email === 'alfa-foreman@test.invalid')));
  check('журнал проекта «План/Факт» — только работы (без назначений)', (await aud('alfaAdmin', pA)).every((r) => ['INSERT', 'UPDATE', 'DELETE'].includes(r.action)));
  check('ПТО не читает журнал компании', !(await rpc('pf_list_company_audit', { p_company: cA }, tok.alfaPto)).ok);
}
// --- P2-0005: проекты, локации, единицы (миграция 006) ---
const acc = await rpc('pf_my_company_access', {}, tok.alfaAdmin);
if (acc.status === 404) { console.log('NOT RUN: миграция 006 не применена — проверки проектов/локаций/единиц пропущены'); fails++; }
else {
  const accA = await j(acc);
  check('админ Альфы: доступ к проектам, единицам и ролям', accA.length === 1 && accA[0].can_manage_projects && accA[0].can_manage_units && accA[0].can_manage_roles);
  const cA5 = accA[0]?.company_id;
  const accF = await j(await rpc('pf_my_company_access', {}, tok.alfaForeman));
  check('прораб: доступ есть, права править нет', accF.length === 1 && !accF[0].can_manage_projects && !accF[0].can_manage_units);
  const accB = await j(await rpc('pf_my_company_access', {}, tok.betaPto));
  check('Бета-ПТО видит только свою компанию', accB.length === 1 && accB[0].company_name === 'Бета');
  check('anon: pf_my_company_access закрыт', !(await rpc('pf_my_company_access', {})).ok);
  const stamp5 = 'REST-проект ' + new Date().toISOString();
  let pid = null, bld5 = null, unitId = null;
  try {
    check('прораб: создать проект нельзя', !(await rpc('pf_create_project', { p_company: cA5, p_name: 'ВЗЛОМ-прораб' }, tok.alfaForeman)).ok);
    check('Бета-ПТО: создать проект в Альфе нельзя', !(await rpc('pf_create_project', { p_company: cA5, p_name: 'ВЗЛОМ-бета' }, tok.betaPto)).ok);
    const cp5 = await rpc('pf_create_project', { p_company: cA5, p_name: stamp5, p_code: 'REST' }, tok.alfaAdmin);
    pid = await j(cp5);
    check('админ создал проект', cp5.ok && typeof pid === 'string', `статус ${cp5.status}`);
    const pl = await j(await rpc('pf_company_projects', { p_company: cA5 }, tok.alfaAdmin));
    check('проект в списке, can_manage = true', pl.some((x) => x.id === pid && x.name === stamp5 && x.can_manage));
    check('Бета-ПТО не видит проектов Альфы', (await j(await rpc('pf_company_projects', { p_company: cA5 }, tok.betaPto))).length === 0);
    const gb = await rpc('pf_generate_building', { p_project: pid, p_parent: null, p_name: 'Корпус REST', p_sections: 2, p_floors: 5, p_apartments_per_floor: 4, p_first_floor: 1 }, tok.alfaAdmin);
    bld5 = await j(gb);
    check('генератор 2×5×4 выполнен', gb.ok && typeof bld5 === 'string', `статус ${gb.status}`);
    const lst = async (k, parent) => j(await rpc('pf_list_locations', { p_project: pid, p_parent: parent }, tok[k]));
    const secs = await lst('alfaAdmin', bld5);
    check('в корпусе 2 секции', Array.isArray(secs) && secs.length === 2);
    const fls = await lst('alfaAdmin', secs[1].id);
    check('в секции 5 этажей', fls.length === 5);
    const aps = await lst('alfaAdmin', fls[0].id);
    check('на этаже 4 квартиры, сквозная нумерация: секция 2, эт. 1 → кв. 21', aps.length === 4 && aps[0].name === 'кв. 21');
    check('путь квартиры строкой', aps[0].path === 'Корпус REST · Секция 2 · эт. 1 · кв. 21', aps[0].path);
    check('Бета-ПТО не читает дерево проекта Альфы', !(await rpc('pf_list_locations', { p_project: pid, p_parent: null }, tok.betaPto)).ok);
    check('Бета-ПТО не добавляет узел в Альфу', !(await rpc('pf_add_location', { p_project: pid, p_parent: null, p_type: 'other', p_name: 'ВЗЛОМ' }, tok.betaPto)).ok);
    check('прораб не добавляет узел', !(await rpc('pf_add_location', { p_project: pid, p_parent: null, p_type: 'other', p_name: 'ВЗЛОМ' }, tok.alfaForeman)).ok);
    check('дубль имени на уровне отклонён', !(await rpc('pf_add_location', { p_project: pid, p_parent: null, p_type: 'building', p_name: 'корпус  rest' }, tok.alfaAdmin)).ok);
    check('> 5000 узлов отклонено', !(await rpc('pf_generate_building', { p_project: pid, p_parent: null, p_name: 'Огромный', p_sections: 10, p_floors: 100, p_apartments_per_floor: 10, p_first_floor: 1 }, tok.alfaAdmin)).ok);
    const un = await j(await rpc('pf_list_units', { p_company: cA5 }, tok.alfaAdmin));
    check('общих единиц ≥ 9 (м², м³, м.п., шт. …)', un.filter((u) => u.is_common).length >= 9 && ['м²', 'м.п.', 'шт.'].every((c) => un.some((u) => u.code === c)));
    const common = un.find((u) => u.is_common);
    check('общую единицу удалить нельзя', !(await rpc('pf_delete_unit', { p_unit: common.id }, tok.alfaAdmin)).ok);
    const unitCode = 'rest' + Date.now();
    const au = await rpc('pf_add_unit', { p_company: cA5, p_code: unitCode, p_name: 'REST единица' }, tok.alfaAdmin);
    unitId = await j(au);
    check('админ добавил свою единицу', au.ok && typeof unitId === 'string', `статус ${au.status}`);
    check('дубль единицы отклонён', !(await rpc('pf_add_unit', { p_company: cA5, p_code: unitCode.toUpperCase(), p_name: 'дубль' }, tok.alfaAdmin)).ok);
    check('прораб не добавляет единицу', !(await rpc('pf_add_unit', { p_company: cA5, p_code: 'взлом', p_name: 'взлом' }, tok.alfaForeman)).ok);
    check('прораб видит свою единицу компании (только чтение)', (await j(await rpc('pf_list_units', { p_company: cA5 }, tok.alfaForeman))).some((u) => u.code === unitCode));
    check('Бета не читает единицы Альфы', !(await rpc('pf_list_units', { p_company: cA5 }, tok.betaPto)).ok);
    const cbId = accB[0]?.company_id;
    check('Бета не видит своих единиц Альфы в своём списке', !(await j(await rpc('pf_list_units', { p_company: cbId }, tok.betaPto))).some((u) => u.code === unitCode));
    const aud5 = await j(await rpc('pf_list_company_audit', { p_company: cA5, p_limit: 50 }, tok.alfaAdmin));
    check('журнал компании: проект, локации, единицы', ['projects', 'locations', 'units'].every((t) => aud5.some((r) => r.table_name === t)));
  } finally {
    if (bld5) check('ветка корпуса удалена (53 узла)', (await j(await rpc('pf_delete_location', { p_location: bld5, p_cascade: true }, tok.alfaAdmin))) === 53);
    if (unitId) check('своя единица удалена', (await rpc('pf_delete_unit', { p_unit: unitId }, tok.alfaAdmin)).ok);
    if (pid) check('проект отправлен в архив', (await rpc('pf_update_project', { p_project: pid, p_name: stamp5, p_code: 'REST', p_archived: true }, tok.alfaAdmin)).ok);
  }
}
// --- P2-0006: ВОР (миграция 007) — права, изоляция компаний, подтверждение, неизменяемость. Данные помечены «REST-ВОР …». ---
const vorProbe = await rpc('pf_vor_list_imports', { p_project: pA }, tok.alfaPto);
if (vorProbe.status === 404) { console.log('NOT RUN: миграция 007 не применена — проверки ВОР пропущены'); fails++; }
else {
  check('ПТО читает загрузки ВОР своего проекта', vorProbe.ok, `статус ${vorProbe.status}`);
  const accV = await j(await rpc('pf_my_company_access', {}, tok.alfaAdmin));
  const cV = accV[0]?.company_id;
  const stampV = 'REST-ВОР ' + new Date().toISOString();
  let pv = null, imp = null; const asgV = [];
  try {
    pv = await j(await rpc('pf_create_project', { p_company: cV, p_name: stampV }, tok.alfaAdmin));
    const sec = await j(await rpc('pf_add_location', { p_project: pv, p_parent: null, p_type: 'section', p_name: 'Секция 1' }, tok.alfaAdmin));
    // Тестовые ПТО и прораб назначены на основной проект Альфы — на время теста назначаем их и на проект REST-ВОР (в конце — отзыв).
    const rolesV = await j(await rpc('pf_list_company_roles', { p_company: cV }, tok.alfaAdmin));
    const membersV = await j(await rpc('pf_list_company_members', { p_company: cV }, tok.alfaAdmin));
    for (const [email, tpl] of [['alfa-pto@test.invalid', 'pto'], ['alfa-foreman@test.invalid', 'foreman']]) {
      const u = membersV.find((m) => m.email === email)?.user_id, r = rolesV.find((x) => x.template_code === tpl)?.id;
      const a = await rpc('pf_assign_role', { p_user: u, p_role: r, p_project: pv }, tok.alfaAdmin);
      check(`назначение ${tpl} на проект REST-ВОР`, a.ok, `статус ${a.status}`);
      if (a.ok) asgV.push(await j(a));
    }
    check('ПТО: право planfact.vor.manage в проекте', (await perms('alfaPto', pv)).includes('planfact.vor.manage'));
    check('прораб: права planfact.vor.manage нет', !(await perms('alfaForeman', pv)).includes('planfact.vor.manage'));
    const sha = 'e'.repeat(64);
    check('прораб не создаёт загрузку', !(await rpc('pf_vor_create_import', { p_project: pv, p_file_name: 'x.xlsx', p_sha256: sha, p_sheet: 'Лист' }, tok.alfaForeman)).ok);
    check('Бета-ПТО не создаёт загрузку в проекте Альфы', !(await rpc('pf_vor_create_import', { p_project: pv, p_file_name: 'x.xlsx', p_sha256: sha, p_sheet: 'Лист' }, tok.betaPto)).ok);
    const ci = await rpc('pf_vor_create_import', { p_project: pv, p_file_name: stampV + '.xlsx', p_sha256: sha, p_sheet: 'ФКП', p_profile: null, p_totals: {} }, tok.alfaPto);
    imp = await j(ci);
    check('ПТО создал черновик загрузки', ci.ok && typeof imp === 'string', `статус ${ci.status}`);
    const rowsV = [
      { row_no: 10, kind: 'context', name: 'Секция 1', context: { section: '1' } },
      { row_no: 11, kind: 'work', name: stampV + ' устройство пола', unit_text: 'м2', qty: 399.89, context: { section: '1', apartments: 'кв. 3, 16' } },
      { row_no: 12, kind: 'material', name: 'Смесь', unit_text: 'кг', qty: 75, norm: 7.5, parent_row_no: 11, context: { section: '1' } }];
    const big = Array.from({ length: 900 }, (_, i) => ({ row_no: 100 + i, kind: i % 2 ? 'material' : 'work', name: 'Строка ' + i, unit_text: 'м2', qty: i, parent_row_no: i % 2 ? 99 + i : null, context: {} }));
    const ar = await rpc('pf_vor_add_rows', { p_import: imp, p_rows: rowsV }, tok.alfaPto);
    check('строки сохранены', ar.ok && (await j(ar)) === 3, `статус ${ar.status}`);
    const imp2 = await j(await rpc('pf_vor_create_import', { p_project: pv, p_file_name: 'большой.xlsx', p_sha256: sha, p_sheet: 'Лист' }, tok.alfaPto));
    const tb = Date.now();
    const br = await rpc('pf_vor_add_rows', { p_import: imp2, p_rows: big }, tok.alfaPto);
    const msBig = Date.now() - tb;
    check('900 строк одной порцией < 10 с', br.ok && msBig < 10000, `${msBig} мс, статус ${br.status}`);
    check('черновик удалён', (await rpc('pf_vor_delete_import', { p_import: imp2 }, tok.alfaPto)).ok);
    check('прораб читает строки', (await j(await rpc('pf_vor_import_rows', { p_import: imp }, tok.alfaForeman))).length === 3);
    check('Бета-ПТО не читает строки Альфы', !(await rpc('pf_vor_import_rows', { p_import: imp }, tok.betaPto)).ok);
    check('Бета-ПТО не читает загрузки Альфы', !(await rpc('pf_vor_list_imports', { p_project: pv }, tok.betaPto)).ok);
    check('Бета-ПТО не пишет строки в загрузку Альфы', !(await rpc('pf_vor_add_rows', { p_import: imp, p_rows: [{ row_no: 50, kind: 'work', name: 'ВЗЛОМ' }] }, tok.betaPto)).ok);
    const units = await j(await rpc('pf_list_units', { p_company: cV }, tok.alfaPto));
    const m2 = units.find((u) => u.code === 'м²')?.id;
    const wt = await j(await rpc('pf_vor_add_work_type', { p_project: pv, p_name: stampV + ' Устройство пола', p_unit: m2, p_code: null }, tok.alfaPto));
    check('ПТО создал вид работ', typeof wt === 'string');
    check('прораб не создаёт вид работ', !(await rpc('pf_vor_add_work_type', { p_project: pv, p_name: 'ВЗЛОМ', p_unit: m2, p_code: null }, tok.alfaForeman)).ok);
    check('Бета-ПТО не видит виды работ Альфы', !(await rpc('pf_vor_list_work_types', { p_project: pv }, tok.betaPto)).ok);
    check('словарь пополнен', (await rpc('pf_vor_learn', { p_project: pv, p_items: [{ name: stampV + ' устройство пола', unit_text: 'м2', work_type_id: wt }] }, tok.alfaPto)).ok);
    check('Бета-ПТО не читает словарь Альфы', !(await rpc('pf_vor_dictionary', { p_project: pv }, tok.betaPto)).ok);
    check('нельзя подтвердить неразобранный ВОР', !(await rpc('pf_vor_confirm', { p_import: imp }, tok.alfaPto)).ok);
    check('решения строки сохранены', (await rpc('pf_vor_resolve_rows', { p_import: imp, p_items: [{ row_no: 11, location_id: sec, work_type_id: wt, unit_id: m2, match: 'green' }] }, tok.alfaPto)).ok);
    check('прораб не подтверждает ВОР', !(await rpc('pf_vor_confirm', { p_import: imp }, tok.alfaForeman)).ok);
    const cf = await rpc('pf_vor_confirm', { p_import: imp }, tok.alfaPto);
    check('ВОР подтверждён: 1 позиция', cf.ok && (await j(cf)) === 1, `статус ${cf.status}`);
    const pos = await j(await rpc('pf_vor_positions', { p_project: pv, p_location: null }, tok.alfaForeman));
    check('прораб видит позицию «Секция 1 · вид работ · м² · 399,89 · кв.»', pos.length === 1 && pos[0].location_path === 'Секция 1' && pos[0].unit_code === 'м²' && Number(pos[0].qty) === 399.89 && pos[0].apartments_note === 'кв. 3, 16');
    check('подтверждённый: строки не дописать', !(await rpc('pf_vor_add_rows', { p_import: imp, p_rows: [{ row_no: 60, kind: 'work', name: 'x' }] }, tok.alfaPto)).ok);
    check('подтверждённый: не удалить', !(await rpc('pf_vor_delete_import', { p_import: imp }, tok.alfaPto)).ok);
    check('Бета-ПТО не видит позиции Альфы', !(await rpc('pf_vor_positions', { p_project: pv, p_location: null }, tok.betaPto)).ok);
    // --- P2-0006c: цены, смета, КП (миграция 008) — прораб цены не видит, Бета не видит Альфу, редакции КП неизменяемы. ---
    const prProbe = await rpc('pf_price_list', { p_company: cV }, tok.alfaPto);
    if (prProbe.status === 404) { console.log('NOT RUN: миграция 008 не применена — проверки цен и смет пропущены'); fails++; }
    else {
      check('ПТО читает справочник цен', prProbe.ok, `статус ${prProbe.status}`);
      check('ПТО: право planfact.estimate.manage в проекте', (await perms('alfaPto', pv)).includes('planfact.estimate.manage'));
      check('прораб: права planfact.estimate.manage нет', !(await perms('alfaForeman', pv)).includes('planfact.estimate.manage'));
      const up = await rpc('pf_price_upsert', { p_company: cV, p_source: 'import:' + imp, p_items: [
        { kind: 'work', work_type_id: wt, price_labor: 10, price_material: 1.5 },
        { kind: 'material', name: stampV + ' смесь', unit_text: 'кг', price_material: 2 }] }, tok.alfaPto);
      const upJ = await j(up);
      check('ПТО записал цены (работа + материал) с источником «загрузка ВОР»', up.ok && upJ.created + upJ.updated === 2, `статус ${up.status}`);
      check('прораб не читает цены', !(await rpc('pf_price_list', { p_company: cV }, tok.alfaForeman)).ok);
      check('прораб не пишет цены', !(await rpc('pf_price_upsert', { p_company: cV, p_items: [], p_source: 'manual' }, tok.alfaForeman)).ok);
      check('Бета-ПТО не читает цены Альфы', !(await rpc('pf_price_list', { p_company: cV }, tok.betaPto)).ok);
      check('Бета-ПТО не пишет цены Альфы', !(await rpc('pf_price_upsert', { p_company: cV, p_items: [], p_source: 'manual' }, tok.betaPto)).ok);
      check('шаблон надбавок компании открывается', (await j(await rpc('pf_overhead_template', { p_company: cV }, tok.alfaPto))).length > 0);
      check('прораб не читает шаблон надбавок', !(await rpc('pf_overhead_template', { p_company: cV }, tok.alfaForeman)).ok);
      check('прораб не создаёт смету', !(await rpc('pf_estimate_create', { p_project: pv, p_name: 'x', p_imports: [imp], p_area: null }, tok.alfaForeman)).ok);
      check('Бета-ПТО не создаёт смету по ВОР Альфы', !(await rpc('pf_estimate_create', { p_project: pv, p_name: 'x', p_imports: [imp], p_area: null }, tok.betaPto)).ok);
      const ce = await rpc('pf_estimate_create', { p_project: pv, p_name: stampV + ' смета', p_imports: [imp], p_area: 100 }, tok.alfaPto);
      const est = await j(ce);
      check('ПТО создал смету по подтверждённому ВОР', ce.ok && typeof est === 'string', `статус ${ce.status}`);
      const er = await j(await rpc('pf_estimate_rows', { p_estimate: est }, tok.alfaPto));
      const w11 = er.find((r) => r.row_no === 11), m12 = er.find((r) => r.row_no === 12);
      check('цены подставлены из справочника (работа 10 / 1,5, материал 2)', Number(w11?.price_labor) === 10 && Number(w11?.price_material) === 1.5 && Number(m12?.price_material) === 2 && w11?.price_source === 'reference');
      check('ручная цена сохранена', (await rpc('pf_estimate_set_prices', { p_estimate: est, p_items: [{ source_row_id: w11?.source_row_id, price_labor: 11, price_material: 1.5 }] }, tok.alfaPto)).ok);
      const er2 = await j(await rpc('pf_estimate_rows', { p_estimate: est }, tok.alfaPto));
      check('ручная цена помечена, справочник не изменился', er2.some((r) => r.row_no === 11 && Number(r.price_labor) === 11 && r.price_source === 'manual' && Number(r.ref_labor) === 10));
      check('прораб не читает смету', !(await rpc('pf_estimate_rows', { p_estimate: est }, tok.alfaForeman)).ok);
      check('Бета-ПТО не читает смету Альфы', !(await rpc('pf_estimate_rows', { p_estimate: est }, tok.betaPto)).ok);
      check('КП по другому файлу отклонено', !(await rpc('pf_kp_create', { p_estimate: est, p_file_sha256: 'f'.repeat(64), p_snapshot: {}, p_total: 1, p_note: null }, tok.alfaPto)).ok);
      const k1 = await rpc('pf_kp_create', { p_estimate: est, p_file_sha256: sha, p_snapshot: { rows: [{ row_no: 11, price_labor: 11 }] }, p_total: 4398.79, p_note: null }, tok.alfaPto);
      const k1J = await j(k1);
      check('редакция КП 1 создана', k1.ok && k1J.revision_no === 1, `статус ${k1.status}`);
      check('прораб не читает КП', !(await rpc('pf_kp_get', { p_revision: k1J.id }, tok.alfaForeman)).ok);
      check('Бета-ПТО не читает КП Альфы', !(await rpc('pf_kp_list', { p_estimate: est }, tok.betaPto)).ok);
      const directK = await fetch(`${URL_}/rest/v1/kp_revisions?id=eq.${k1J.id}`, { method: 'PATCH', headers: { apikey: ANON, Authorization: `Bearer ${tok.alfaPto}`, 'Content-Type': 'application/json', 'Accept-Profile': 'planfact', 'Content-Profile': 'planfact' }, body: '{"total": 1}' });
      check('редакцию КП не изменить через REST', !directK.ok, `статус ${directK.status}`);
      check('редакция КП после попытки изменения — прежняя', Number((await j(await rpc('pf_kp_get', { p_revision: k1J.id }, tok.alfaPto)))?.total) === 4398.79);
      const audE = await j(await rpc('pf_list_company_audit', { p_company: cV, p_limit: 200 }, tok.alfaAdmin));
      check('журнал компании: цены, смета, КП', ['price_items', 'estimates', 'kp_revisions'].every((t) => audE.some((r) => r.table_name === t)));
      check('anon: pf_price_list закрыт', !(await rpc('pf_price_list', { p_company: cV })).ok);
    }
    const audV = await j(await rpc('pf_list_company_audit', { p_company: cV, p_limit: 100 }, tok.alfaAdmin));
    check('журнал компании: загрузка и подтверждение ВОР', audV.some((r) => r.table_name === 'vor_imports' && r.action === 'INSERT') && audV.some((r) => r.table_name === 'vor_imports' && r.new_data?.status === 'confirmed'));
    const directV = await fetch(`${URL_}/rest/v1/vor_imports`, { headers: { apikey: ANON, Authorization: `Bearer ${tok.alfaPto}`, 'Accept-Profile': 'planfact' } });
    check('таблицы ВОР не открыты через REST напрямую', !directV.ok, `статус ${directV.status}`);
    check('anon: pf_vor_list_imports закрыт', !(await rpc('pf_vor_list_imports', { p_project: pv })).ok);
  } finally {
    for (const a of asgV) check('назначение на проект REST-ВОР отозвано', (await rpc('pf_revoke_assignment', { p_assignment: a }, tok.alfaAdmin)).ok);
    if (pv) check('проект REST-ВОР отправлен в архив', (await rpc('pf_update_project', { p_project: pv, p_name: stampV, p_code: null, p_archived: true }, tok.alfaAdmin)).ok);
  }
}
console.log(fails ? `ИТОГ: FAIL (${fails})` : 'ИТОГ: PASS');
process.exit(fails ? 1 : 0);
