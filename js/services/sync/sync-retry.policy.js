/* Файл: js/services/sync/sync-retry.policy.js — P2-0023 этап 4.
 * Синхронизация без бесконечного круга (чистые функции, unit-тесты — js/shared/__tests__/sync-retry.policy.test.js):
 * - ошибка отправки больше не включает полную загрузку; успешная загрузка ставит метку даже при ошибке отправки;
 * - повтор после ошибки — с нарастающей паузой, а не каждую минуту;
 * - объект с фото, которого нет на устройстве, помечается «нужно внимание» и не роняет синхронизацию снова;
 * - одно и то же сообщение об ошибке показывается один раз.
 */
'use strict';

export const MISSING_LOCAL_FILE = 'RBI_MISSING_LOCAL_FILE';
export const ATTENTION_STATUS = 'needs_attention';
export const ATTENTION_REASON_MISSING_PHOTO = 'Нужно внимание: фото не найдено на устройстве — переснимите или удалите его';

/** Ошибка «локального файла нет» (а не сеть/сервер). */
export function makeMissingFileError(ref) {
    const e = new Error('Фото не найдено на устройстве: ' + String(ref || ''));
    e.code = MISSING_LOCAL_FILE;
    return e;
}

export function isMissingFileError(e) {
    return !!(e && (e.code === MISSING_LOCAL_FILE || /Локальный файл не найден в IndexedDB/.test(String(e.message || ''))));
}

/**
 * Флаги после синхронизации. Раньше любая ошибка ставила rbi_force_full_pull, а метка
 * последней загрузки не ставилась → полная загрузка каждую минуту и «первый запуск» навсегда.
 * @param {{ pushErrors: number, pullErrors: number, referencePullErrors: number, referenceOk: boolean }} r
 * @param {{ transientPushErrors?: number }} r  из них — сеть/сервер (доработка 5)
 * @returns {{ pullOk: boolean, pushOk: boolean, setLastPull: boolean, clearForceFullPull: boolean, pause: boolean, dirty: boolean }}
 */
export function completionFlags(r) {
    const pullOk = !(r && (r.pullErrors > 0 || r.referencePullErrors > 0)) && !!(r && r.referenceOk !== false);
    const pushOk = !(r && r.pushErrors > 0);
    // Доработка 5: transientPushErrors не передан (старый вызов) — считаем все ошибки отправки сетевыми.
    const transient = r && r.transientPushErrors !== undefined ? Number(r.transientPushErrors) || 0 : (r && r.pushErrors) || 0;
    return {
        pullOk,
        pushOk,
        // загрузка прошла — метку ставим независимо от отправки; не прошла — следующая
        // догрузка начнётся с прошлой метки (полная загрузка для этого не нужна)
        setLastPull: pullOk,
        clearForceFullPull: pullOk,
        // пауза автоповтора — только если не удалась загрузка или отправка упала по сети/серверу;
        // отклонённые сервером записи (права, данные) паузу не ставят
        pause: !pullOk || transient > 0,
        dirty: !pushOk && transient > 0
    };
}

/**
 * Доработка 5: временная ли ошибка (сеть/сервер → повтор с паузой) или сервер отклонил запись
 * (права RLS, неверные данные → пауза не нужна, запись остаётся неотправленной).
 * Неизвестная ошибка считается временной — безопаснее подождать, чем крутить круг.
 */
export function isTransientSyncError(e) {
    if (!e) return true;
    if (isMissingFileError(e)) return false;
    const status = Number(e.status || e.statusCode || 0);
    if (status) return status >= 500 || status === 408 || status === 429;
    const code = String(e.code || '');
    if (/^PGRST/.test(code)) return false;
    // код Postgres (SQLSTATE): 08 связь, 40 откат/взаимоблокировка, 53 ресурсы, 57 сервер — временные
    if (/^[0-9A-Z]{5}$/.test(code)) return /^(08|40|53|57)/.test(code);
    const m = String(e.message || e || '');
    if (/row-level security|permission denied|violates|invalid input|duplicate key/i.test(m)) return false;
    return true;
}

/** Пауза перед автоповтором после n-й подряд неудачной синхронизации (мс): 2, 5, 10, 30 мин. */
export function retryDelayMs(failCount) {
    const steps = [2, 5, 10, 30];
    const n = Math.max(1, Number(failCount) || 1);
    return steps[Math.min(n, steps.length) - 1] * 60 * 1000;
}

/**
 * Можно ли автоматически (таймер/возврат в приложение) запускать синхронизацию сейчас.
 * Ручной запуск пользователем не ограничивается.
 * @param {{ now: number, retryAfter: number }} p
 */
export function autoSyncAllowed(p) {
    const retryAfter = Number(p && p.retryAfter) || 0;
    return !retryAfter || (Number(p && p.now) || 0) >= retryAfter;
}

/** Объекты «нужно внимание» не отправляются повторно, пока пользователь их не изменит. */
export function isAttention(rec) {
    if (!rec) return false;
    return rec.syncStatus === ATTENTION_STATUS || rec.sync_status === ATTENTION_STATUS;
}

/** Пометить объект «нужно внимание» (сохранять вызывающему). */
export function markAttention(rec, reason) {
    if (!rec) return rec;
    rec.syncStatus = ATTENTION_STATUS;
    rec.sync_status = ATTENTION_STATUS;
    rec.syncBlockReason = reason || ATTENTION_REASON_MISSING_PHOTO;
    rec.sync_block_reason = rec.syncBlockReason;
    return rec;
}

/**
 * Показывать ли сообщение об ошибке: одна и та же причина — один раз, пока не было успеха.
 * @param {string} lastShownKey ключ последнего показанного сообщения ('' — после успеха)
 * @param {string} key ключ текущей ошибки
 */
export function shouldShowErrorOnce(lastShownKey, key) {
    return !!key && String(lastShownKey || '') !== String(key);
}

/** Понятная причина ошибки отправки для пользователя. */
export function humanSyncReason(e) {
    if (isMissingFileError(e)) return 'фото не найдено на устройстве — запись помечена «нужно внимание»';
    const m = String((e && e.message) || e || '').trim();
    if (/Failed to fetch|NetworkError|network/i.test(m)) return 'нет связи с сервером, повторим позже';
    if (/row-level security|RLS|permission|42501/i.test(m)) return 'нет прав на отправку этой записи';
    return m ? m.substring(0, 80) : 'сбой отправки';
}

if (typeof window !== 'undefined') {
    window.RbiSyncRetryPolicy = {
        MISSING_LOCAL_FILE, ATTENTION_STATUS, ATTENTION_REASON_MISSING_PHOTO,
        makeMissingFileError, isMissingFileError, isTransientSyncError, completionFlags, retryDelayMs,
        autoSyncAllowed, isAttention, markAttention, shouldShowErrorOnce, humanSyncReason
    };
}
