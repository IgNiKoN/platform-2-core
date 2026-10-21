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
  check('ПТО не читает журнал компании', !(await rpc('pf_list_company_audit', { p_company: cA }, tok.alfaPto)).ok);
}
console.log(fails ? `ИТОГ: FAIL (${fails})` : 'ИТОГ: PASS');
process.exit(fails ? 1 : 0);
