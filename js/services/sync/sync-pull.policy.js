/* Файл: js/services/sync/sync-pull.policy.js — P2-0023 этап 3, P2-0024 этап 1 (параллельная загрузка).
 * Правила загрузки с сервера (чистые функции, unit-тесты — js/shared/__tests__/sync-pull.policy.test.js):
 * - пункты/фото проверок — пачками по проверкам И постранично внутри пачки
 *   (сервер обрезает ответ по лимиту строк, раньше хвост молча терялся);
 * - догрузка «с прошлого раза» — с запасом назад (запись, отправленная во время синхронизации
 *   или с телефона с отстающими часами, иначе не приходила никогда);
 * - при работе через сервер Platform 2.0 видимость решает сервер (quality.row_visible, P2-0018),
 *   клиент её не сужает.
 */
'use strict';

/** Запас назад для догрузки «с прошлого раза». Повторно пришедшие записи безвредны (upsert по id). */
export const PULL_OVERLAP_MS = 15 * 60 * 1000;

/**
 * Время «с какого момента грузить»: прошлая успешная загрузка минус запас.
 * Пусто/мусор → '' (полная загрузка).
 * @param {string} lastPullAt ISO
 * @param {number} [overlapMs]
 */
export function pullSinceWithOverlap(lastPullAt, overlapMs = PULL_OVERLAP_MS) {
    if (!lastPullAt) return '';
    const t = Date.parse(lastPullAt);
    if (!Number.isFinite(t)) return '';
    return new Date(t - Math.max(0, Number(overlapMs) || 0)).toISOString();
}

/** P2-0024: размер пачки проверок и число одновременных запросов при загрузке нового устройства. */
export const PULL_BATCH_SIZE = 200;
export const PULL_CONCURRENCY = 3;

/** Ответ сервера «слишком много запросов / шлюз перегружен» — снижаем параллельность до 1. */
export function isThrottleError(err) {
    const st = Number(err && (err.status || err.code || (err.cause && err.cause.status)));
    if ([429, 502, 503, 504].includes(st)) return true;
    return /\b(429|502|503|504)\b/.test(String((err && err.message) || ''));
}

/**
 * Загрузка строк по списку проверок: пачки id × страницы внутри пачки.
 * P2-0024: пачки — до `concurrency` одновременно; порядок результата = порядок пачек (как при
 * последовательной загрузке). Внутри пачки страницы идут подряд со сдвигом на ФАКТИЧЕСКИ полученное
 * число строк; если сервер отдал общее число (`count`), лишний пустой запрос не делается, а
 * обрезка ответа по лимиту сервера (max-rows) не теряет хвост даже при pageSize больше лимита.
 * Ошибка любой пачки → отказ всей загрузки (частично «загруженных» проверок не бывает).
 * 429/502/503/504 при параллельной загрузке → одна повторная попытка этой пачки, дальше по одной.
 * @param {(ids: string[], from: number, to: number, first: boolean) => Promise<{data?: any[], error?: any, count?: number|null}>} fetchPage
 *        запрос одной страницы (обязательно с устойчивой сортировкой, например по id);
 *        first=true — первая страница пачки (можно запросить общее число строк)
 * @param {string[]} ids
 * @param {{ batchSize?: number, pageSize?: number, concurrency?: number, pause?: () => Promise<void>,
 *           onBatchDone?: (done: number, total: number) => void, onThrottle?: (err: any) => void }} [opts]
 */
export async function pullPagedByIds(fetchPage, ids, opts) {
    const o = opts || {};
    const batchSize = Math.max(1, o.batchSize || 40);
    const pageSize = Math.max(1, o.pageSize || 500);
    let concurrency = Math.max(1, Math.floor(o.concurrency || 1));
    const pause = o.pause || null;
    const clean = Array.from(new Set((ids || []).map((x) => String(x)).filter(Boolean)));
    const batches = [];
    for (let i = 0; i < clean.length; i += batchSize) batches.push(clean.slice(i, i + batchSize));
    const results = new Array(batches.length);
    let next = 0;
    let done = 0;
    let failed = null;

    async function loadBatch(batch) {
        const rows = [];
        let total = null;
        for (let from = 0, first = true; ; first = false) {
            const res = await fetchPage(batch, from, from + pageSize - 1, first);
            if (res && res.error) {
                // supabase-js: код HTTP — в самом ответе (res.status), а не в ошибке
                const e = res.error;
                if (e && typeof e === 'object' && e.status == null && res.status) e.status = res.status;
                throw e;
            }
            const data = res && Array.isArray(res.data) ? res.data : [];
            if (first && res && Number.isFinite(res.count)) total = Number(res.count);
            if (data.length) rows.push(...data);
            from += data.length;
            if (!data.length) break;
            if (total != null ? rows.length >= total : data.length < pageSize) break;
        }
        return rows;
    }

    async function worker() {
        while (!failed && next < batches.length) {
            const idx = next++;
            try {
                results[idx] = await loadBatch(batches[idx]);
            } catch (err) {
                if (failed) return;
                if (concurrency > 1 && isThrottleError(err)) {
                    concurrency = 1;
                    if (o.onThrottle) o.onThrottle(err);
                    try { results[idx] = await loadBatch(batches[idx]); } catch (err2) { failed = failed || err2; return; }
                } else {
                    failed = err;
                    return;
                }
            }
            done++;
            if (o.onBatchDone) o.onBatchDone(done, batches.length);
            if (pause) await pause();
            // после снижения параллельности лишние «работники» выходят, остаётся один
            if (concurrency === 1 && worker.active > 1) { worker.active--; return; }
        }
    }
    worker.active = Math.min(concurrency, batches.length);
    await Promise.all(Array.from({ length: worker.active }, () => worker()));
    if (failed) throw failed;
    const out = [];
    for (const r of results) if (r && r.length) out.push(...r);
    return out;
}

/**
 * Локальные записи истории одной выборкой (вместо dbGet на каждую пришедшую проверку).
 * Строковый id главнее; запись со старым числовым id отдаётся как дубль на удаление.
 * @param {any[]} records все записи app_history
 * @returns {(id: string) => { record: any, numericDup: boolean } | null}
 */
export function indexLocalHistory(records) {
    const byStr = new Map();
    const byNum = new Map();
    for (const r of records || []) {
        if (!r || r.id == null) continue;
        if (typeof r.id === 'number') byNum.set(String(r.id), r);
        else byStr.set(String(r.id), r);
    }
    return (id) => {
        const k = String(id);
        if (byStr.has(k)) return { record: byStr.get(k), numericDup: false };
        if (byNum.has(k)) return { record: byNum.get(k), numericDup: true };
        return null;
    };
}

/**
 * Оставить локальную версию, а облачную пропустить: локальная не старее облачной
 * (неотправленная правка, локальное удаление). Правило — как было в sync-engine.core.js.
 */
export function keepLocalOverCloud(existingLocal, cloudRow) {
    if (!existingLocal) return false;
    const localTime = new Date(existingLocal.updatedAt || existingLocal._deletedAt || 0).getTime();
    const cloudTime = new Date((cloudRow && cloudRow.updated_at) || 0).getTime();
    return localTime >= cloudTime;
}

/**
 * Нужен ли клиентский фильтр видимости проверок/задач поверх сервера.
 * Через сервер Platform 2.0 (вход почтой, P2-0016/0018) — нет: сервер уже отдал ровно видимое,
 * а клиентское «ФИО совпадает буква в букву» отбрасывало свои же записи.
 * Гостевой/неподтверждённый доступ режется всегда.
 * @param {{ serverScoped: boolean, dataScope: string, approved: boolean }} p
 * @returns {'block'|'none'|'client'}
 */
export function clientScopeMode(p) {
    if (!p || p.dataScope === 'none' || !p.approved) return 'block';
    if (p.serverScoped) return 'none';
    return 'client';
}

if (typeof window !== 'undefined') {
    window.RbiSyncPullPolicy = { PULL_OVERLAP_MS, PULL_BATCH_SIZE, PULL_CONCURRENCY, pullSinceWithOverlap, pullPagedByIds, isThrottleError, indexLocalHistory, keepLocalOverCloud, clientScopeMode };
}
