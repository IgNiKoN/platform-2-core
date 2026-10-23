/**
 * P2-0016 (ADR-068). Качество и Стройконтроль при входе почтой: старые экраны и синхронизация без изменений логики,
 * меняется только «куда» и «кто»:
 *  - клиент синхронизации (window.supabaseClient) — раздел quality сервера, заголовок x-company-id = текущая компания,
 *    токен — сессия платформы (одна сессия, свой Auth не создаётся);
 *  - код проекта синхронизации = объект ядра (список — объекты компании), имя инженера = почта;
 *  - роль экрана Качества — из прав компании (quality.my_access), а не из профиля PIN;
 *  - локальная база на устройстве — своя у каждой компании (имя базы читает storage-db.core.js из QUALITY_COMPANY_KEY);
 *    состояние синхронизации (ключи rbi_*) при смене компании откладывается и восстанавливается, страница перезагружается.
 * Старое приложение РБИ (вход по PIN, раздел public) — отдельный код, здесь не участвует.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlatformState } from './platform.service.ts';

export const QUALITY_COMPANY_KEY = 'platform2_quality_company';
const STASH_PREFIX = 'platform2_quality_state_';
const PROJECT_PREFIX = 'platform2_quality_project_';

/** Ключи устройства со состоянием синхронизации Качества — у каждой компании свои. */
export const SYNC_STATE_KEYS = [
  'rbi_sync_config', 'rbi_cloud_dirty', 'rbi_force_full_pull', 'rbi_force_remote_poll',
  'rbi_sync_last_pull_at', 'rbi_sync_last_push_at', 'rbi_sync_last_remote_check_at', 'rbi_last_approved_pull_done',
  'rbi_first_full_offline_cache_done', 'rbi_first_full_offline_cache_started_at', 'rbi_need_full_offline_cache',
  'rbi_last_bg_cache_at', 'rbi_settings_backup'
];

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Компания, для которой работает Качество: вход почтой и у текущей компании включено Качество или Стройконтроль. */
export function qualityCompanyFor(st: PlatformState): string | null {
  if (st.mode !== 'email' || !st.companyId) return null;
  const cur = st.companies.find((c) => c.id === st.companyId);
  return cur && (cur.modules.includes('quality') || cur.modules.includes('construction')) ? cur.id : null;
}

/** Переключить устройство на базу и состояние синхронизации компании (null — без компании). true → нужна перезагрузка. */
export function switchDeviceCompany(store: Store, next: string | null): boolean {
  const cur = store.getItem(QUALITY_COMPANY_KEY) || '';
  const nxt = next || '';
  if (cur === nxt) return false;
  const saved: Record<string, string> = {};
  for (const k of SYNC_STATE_KEYS) {
    const v = store.getItem(k);
    if (v !== null) saved[k] = v;
    store.removeItem(k);
  }
  store.setItem(STASH_PREFIX + cur, JSON.stringify(saved));
  let restore: Record<string, string> = {};
  try { restore = JSON.parse(store.getItem(STASH_PREFIX + nxt) || '{}') as Record<string, string>; } catch { restore = {}; }
  for (const k of SYNC_STATE_KEYS) if (typeof restore[k] === 'string') store.setItem(k, restore[k]);
  store.removeItem(STASH_PREFIX + nxt);
  if (nxt) store.setItem(QUALITY_COMPANY_KEY, nxt); else store.removeItem(QUALITY_COMPANY_KEY);
  return true;
}

/** Роль экрана Качества по правам компании (ROLE_MATRIX permission.service.js). Права всё равно проверяет сервер (RLS). */
export function roleFor(actions: string[], templates: string[]): string {
  const has = (a: string): boolean => actions.includes(a);
  if (has('quality.manage') || has('construction.manage')) return 'manager';
  if (has('quality.edit')) return 'engineer';
  if (templates.includes('contractor_rep') && actions.length > 0) return 'contractor';
  if (has('quality.view') || has('construction.view') || has('construction.edit')) return 'director';
  return 'guest';
}

type CreateClient = (url: string, key: string, opts: Record<string, unknown>) => SupabaseClient;

/** Клиент раздела quality: токен — сессия платформы; .auth — Auth платформы (старый код вызывает auth.getUser). */
export function createQualityClient(createClient: CreateClient, cfg: { url: string; anonKey: string }, companyId: string,
  platformClient: SupabaseClient): SupabaseClient {
  const qc = createClient(cfg.url, cfg.anonKey, {
    accessToken: async () => (await platformClient.auth.getSession()).data.session?.access_token ?? null,
    db: { schema: 'quality' },
    global: { headers: { 'x-company-id': companyId } }
  });
  return new Proxy(qc, {
    get(target, prop, receiver) {
      if (prop === 'auth') return platformClient.auth;
      return Reflect.get(target, prop, receiver);
    }
  });
}

export interface QualityProject { id: string; name: string }
export interface QualitySync {
  active: true;
  companyId: string;
  companyName: string;
  email: string;
  projects: QualityProject[];
  projectId: string | null;
  role: string;
  actions: string[];
  selectProject(id: string): Promise<void>;
}

interface SyncWin {
  supabaseClient?: unknown;
  syncConfig?: { enabled?: boolean; engineerName?: string; projectCode?: string; pinHash?: string | null; syncMode?: string };
  appSettings?: Record<string, unknown>;
  applySyncConnect?: (name: string, code: string, pin: string | null) => Promise<void>;
  initSync?: () => Promise<void>;
  renderSyncUI?: () => void;
  RBI?: Record<string, unknown>;
}

export interface BridgeDeps {
  win: SyncWin;
  store: Store;
  reload: () => void;
  platformClient: SupabaseClient | null;
  cfg: { url: string; anonKey: string } | null;
  createClient: CreateClient;
  /** Объекты компании (pf_company_projects) — от имени вошедшего, клиентом платформы. */
  listProjects: (companyId: string) => Promise<QualityProject[]>;
}

/** Применить состояние платформы к Качеству. Возвращает активный мост или null. */
export async function applyQualityBridge(st: PlatformState, deps: BridgeDeps): Promise<QualitySync | null> {
  if (st.mode === 'none' && !deps.store.getItem(QUALITY_COMPANY_KEY)) return null;
  const company = qualityCompanyFor(st);
  if (switchDeviceCompany(deps.store, company)) { deps.reload(); return null; }
  const rbi = (deps.win.RBI = deps.win.RBI || {});
  if (!company || !deps.platformClient || !deps.cfg || !st.email) { rbi.qualitySync = null; return null; }
  const prev = rbi.qualitySync as QualitySync | null | undefined;
  if (prev && prev.companyId === company) return prev;

  const client = createQualityClient(deps.createClient, deps.cfg, company, deps.platformClient);
  deps.win.supabaseClient = client;
  const projects = await deps.listProjects(company).catch(() => [] as QualityProject[]);
  const savedProject = deps.store.getItem(PROJECT_PREFIX + company);
  const projectId = projects.some((p) => p.id === savedProject) ? savedProject
    : projects.length === 1 ? projects[0].id : null;
  const cur = st.companies.find((c) => c.id === company);
  const email = st.email;

  const loadAccess = async (pid: string | null): Promise<{ actions: string[]; templates: string[] }> => {
    const { data, error } = await client.rpc('my_access', { p_project: pid });
    const d = (!error && data && typeof data === 'object' ? data : {}) as { actions?: unknown; templates?: unknown };
    return {
      actions: Array.isArray(d.actions) ? d.actions.map(String) : [],
      templates: Array.isArray(d.templates) ? d.templates.map(String) : []
    };
  };
  const applyRole = (a: { actions: string[]; templates: string[] }): void => {
    sync.actions = a.actions;
    sync.role = roleFor(a.actions, a.templates);
    const s = deps.win.appSettings;
    if (s) { s.userRole = sync.role; s.cloudStatus = 'approved'; s.engineerName = email; }
  };
  const writeConfig = (pid: string | null): void => {
    const c = (deps.win.syncConfig = deps.win.syncConfig || {});
    c.enabled = !!pid;
    c.engineerName = email;
    c.projectCode = pid || '';
    c.pinHash = null;
    if (!c.syncMode) c.syncMode = 'personal';
    deps.store.setItem('rbi_sync_config', JSON.stringify(c));
  };

  const sync: QualitySync = {
    active: true,
    companyId: company,
    companyName: cur ? cur.name : '',
    email,
    projects,
    projectId,
    role: 'guest',
    actions: [],
    async selectProject(id: string) {
      if (!projects.some((p) => p.id === id) || id === sync.projectId) return;
      deps.store.setItem(PROJECT_PREFIX + company, id);
      sync.projectId = id;
      applyRole(await loadAccess(id));
      // Прежний путь подключения (очистка данных старого объекта по подтверждению, полный pull) — без PIN.
      if (deps.win.applySyncConnect) await deps.win.applySyncConnect(email, id, null);
      else writeConfig(id);
      if (deps.win.initSync) await deps.win.initSync();
    }
  };
  rbi.qualitySync = sync;
  writeConfig(projectId);
  applyRole(await loadAccess(projectId));
  if (deps.win.initSync) await deps.win.initSync();
  if (deps.win.renderSyncUI) deps.win.renderSyncUI();
  return sync;
}
