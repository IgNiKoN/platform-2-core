/* Файл: js/services/sync/sync-pull.policy.js — P2-0023 этап 3.
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

/**
 * Загрузка строк по списку проверок: пачки id × страницы внутри пачки.
 * @param {(ids: string[], from: number, to: number) => Promise<{data?: any[], error?: any}>} fetchPage
 *        запрос одной страницы (обязательно с устойчивой сортировкой, например по id)
 * @param {string[]} ids
 * @param {{ batchSize?: number, pageSize?: number, pause?: () => Promise<void> }} [opts]
 */
export async function pullPagedByIds(fetchPage, ids, opts) {
    const batchSize = Math.max(1, (opts && opts.batchSize) || 40);
    const pageSize = Math.max(1, (opts && opts.pageSize) || 500);
    const pause = (opts && opts.pause) || null;
    const clean = Array.from(new Set((ids || []).map((x) => String(x)).filter(Boolean)));
    const out = [];
    for (let i = 0; i < clean.length; i += batchSize) {
        const batch = clean.slice(i, i + batchSize);
        for (let from = 0; ; from += pageSize) {
            const { data, error } = await fetchPage(batch, from, from + pageSize - 1);
            if (error) throw error;
            if (Array.isArray(data) && data.length) out.push(...data);
            if (!Array.isArray(data) || data.length < pageSize) break;
        }
        if (pause) await pause();
    }
    return out;
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
    window.RbiSyncPullPolicy = { PULL_OVERLAP_MS, pullSinceWithOverlap, pullPagedByIds, clientScopeMode };
}
