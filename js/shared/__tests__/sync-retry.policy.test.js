/**
 * P2-0023 этап 4: синхронизация без круга.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  makeMissingFileError,
  isMissingFileError,
  completionFlags,
  isTransientSyncError,
  retryDelayMs,
  autoSyncAllowed,
  isAttention,
  markAttention,
  shouldShowErrorOnce,
  humanSyncReason,
  ATTENTION_STATUS
} from '../../services/sync/sync-retry.policy.js';

describe('completionFlags', () => {
  it('ошибка отправки НЕ включает полную загрузку, метка загрузки ставится', () => {
    const f = completionFlags({ pushErrors: 1, pullErrors: 0, referencePullErrors: 0, referenceOk: true });
    assert.equal(f.setLastPull, true);
    assert.equal(f.clearForceFullPull, true);
    assert.equal(f.dirty, true);
  });
  it('ошибка загрузки — метку не ставим (догрузка начнётся с прошлой), отправлять нечего', () => {
    const f = completionFlags({ pushErrors: 0, pullErrors: 2, referencePullErrors: 0, referenceOk: true });
    assert.equal(f.setLastPull, false);
    assert.equal(f.dirty, false);
  });
  it('всё хорошо — чисто', () => {
    assert.deepEqual(completionFlags({ pushErrors: 0, pullErrors: 0, referencePullErrors: 0, referenceOk: true }),
      { pullOk: true, pushOk: true, setLastPull: true, clearForceFullPull: true, pause: false, dirty: false });
  });
  it('доработка 5: сервер отклонил запись (права/данные) — без паузы и без круга каждую минуту', () => {
    const f = completionFlags({ pushErrors: 2, transientPushErrors: 0, pullErrors: 0, referencePullErrors: 0, referenceOk: true });
    assert.equal(f.pushOk, false);
    assert.equal(f.pause, false);
    assert.equal(f.dirty, false);
    assert.equal(f.setLastPull, true);
  });
  it('доработка 5: сеть/сервер при отправке или ошибка загрузки — пауза', () => {
    assert.equal(completionFlags({ pushErrors: 2, transientPushErrors: 1, pullErrors: 0, referencePullErrors: 0, referenceOk: true }).pause, true);
    assert.equal(completionFlags({ pushErrors: 0, transientPushErrors: 0, pullErrors: 1, referencePullErrors: 0, referenceOk: true }).pause, true);
  });
});

describe('isTransientSyncError (доработка 5)', () => {
  it('сеть, 5xx, 429, таймаут, неизвестное — временные', () => {
    assert.equal(isTransientSyncError(new TypeError('Failed to fetch')), true);
    assert.equal(isTransientSyncError({ status: 502, message: 'Bad gateway' }), true);
    assert.equal(isTransientSyncError({ status: 429 }), true);
    assert.equal(isTransientSyncError({ code: '57014', message: 'canceling statement due to statement timeout' }), true);
    assert.equal(isTransientSyncError(new Error('что-то странное')), true);
  });
  it('права RLS, неверные данные, «нет файла» — не временные', () => {
    assert.equal(isTransientSyncError({ code: '42501', message: 'new row violates row-level security policy' }), false);
    assert.equal(isTransientSyncError({ code: '23505', message: 'duplicate key value' }), false);
    assert.equal(isTransientSyncError({ code: '22P02', message: 'invalid input syntax for type uuid' }), false);
    assert.equal(isTransientSyncError({ code: 'PGRST204', message: 'column not found' }), false);
    assert.equal(isTransientSyncError({ status: 403, message: 'forbidden' }), false);
    assert.equal(isTransientSyncError(makeMissingFileError('local://x')), false);
  });
});

describe('повтор с паузой', () => {
  it('2 → 5 → 10 → 30 мин, дальше 30', () => {
    assert.deepEqual([1, 2, 3, 4, 5, 9].map(n => retryDelayMs(n) / 60000), [2, 5, 10, 30, 30, 30]);
  });
  it('один «плохой» объект: за 10 минут не больше 3 автоповторов (было 10 — каждую минуту)', () => {
    let now = 0, retryAfter = 0, fails = 0, runs = 0;
    for (let minute = 1; minute <= 10; minute++) {
      now = minute * 60000;
      if (!autoSyncAllowed({ now, retryAfter })) continue;
      runs++;
      fails++;
      retryAfter = now + retryDelayMs(fails); // синхронизация снова неудачна
    }
    assert.ok(runs <= 3, 'автоповторов: ' + runs);
  });
  it('без паузы — можно', () => {
    assert.equal(autoSyncAllowed({ now: 5, retryAfter: 0 }), true);
    assert.equal(autoSyncAllowed({ now: 5, retryAfter: 10 }), false);
  });
});

describe('нужно внимание', () => {
  it('ошибка «нет файла» распознаётся (новая и старая формулировка)', () => {
    assert.equal(isMissingFileError(makeMissingFileError('local://x')), true);
    assert.equal(isMissingFileError(new Error('[Sync] Локальный файл не найден в IndexedDB (возможна гонка записи): local://x')), true);
    assert.equal(isMissingFileError(new Error('Failed to fetch')), false);
  });
  it('пометка и пропуск до правки пользователем', () => {
    const rec = { id: 1, syncStatus: 'not_synced' };
    markAttention(rec);
    assert.equal(isAttention(rec), true);
    assert.equal(rec.sync_status, ATTENTION_STATUS);
    assert.match(rec.syncBlockReason, /Нужно внимание/);
    rec.syncStatus = 'not_synced'; rec.sync_status = 'not_synced'; // пользователь изменил запись
    assert.equal(isAttention(rec), false);
  });
});

describe('сообщение один раз', () => {
  it('та же причина второй раз не показывается; новая — показывается', () => {
    assert.equal(shouldShowErrorOnce('', 'tasks:нет связи'), true);
    assert.equal(shouldShowErrorOnce('tasks:нет связи', 'tasks:нет связи'), false);
    assert.equal(shouldShowErrorOnce('tasks:нет связи', 'tasks:нет прав'), true);
  });
  it('понятная причина', () => {
    assert.match(humanSyncReason(makeMissingFileError('local://x')), /нужно внимание/);
    assert.match(humanSyncReason(new TypeError('Failed to fetch')), /нет связи/);
    assert.match(humanSyncReason({ message: 'new row violates row-level security policy' }), /нет прав/);
  });
});
