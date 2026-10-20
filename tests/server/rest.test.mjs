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
const fAdd = await rpc('pf_add_work', { p_project: pA, p_name: 'ВЗЛОМ-ПРОРАБ' }, tok.alfaForeman);
check('прораб: pf_add_work отклонён', !fAdd.ok, `статус ${fAdd.status}`);
const cross = await rpc('pf_add_work', { p_project: pB, p_name: 'ВЗЛОМ-ЧУЖОЙ' }, tok.alfaPto);
check('ПТО Альфы: добавление в проект Беты отклонено', !cross.ok, `статус ${cross.status}`);
const direct = await fetch(`${URL_}/rest/v1/works`, { method: 'POST', headers: { apikey: ANON, Authorization: `Bearer ${tok.alfaPto}`, 'Content-Type': 'application/json', 'Accept-Profile': 'planfact', 'Content-Profile': 'planfact' }, body: '{}' });
check('схема planfact не открыта через REST напрямую', !direct.ok, `статус ${direct.status}`);
console.log(fails ? `ИТОГ: FAIL (${fails})` : 'ИТОГ: PASS');
process.exit(fails ? 1 : 0);
