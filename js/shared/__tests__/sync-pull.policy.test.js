/**
 * P2-0023 этап 3: новое устройство — постраничная загрузка, запас по времени, видимость решает сервер.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PULL_OVERLAP_MS,
  pullSinceWithOverlap,
  pullPagedByIds,
  clientScopeMode
} from '../../services/sync/sync-pull.policy.js';

// Подставной сервер: строки отсортированы по id, ответ обрезается по лимиту строк (как PostgREST max-rows).
function fakeServer(rows, maxRows = 1000) {
  const calls = [];
  const fetchPage = async (ids, from, to) => {
    calls.push({ ids: ids.length, from, to });
    const set = new Set(ids);
    const matched = rows.filter(r => set.has(r.inspection_id)).sort((a, b) => (a.id < b.id ? -1 : 1));
    const end = Math.min(to + 1, from + maxRows);
    return { data: matched.slice(from, end) };
  };
  return { fetchPage, calls };
}

function makeRows(inspections, perInspection) {
  const rows = [];
  for (let i = 0; i < inspections; i++) {
    for (let k = 0; k < perInspection; k++) {
      rows.push({ id: `insp${String(i).padStart(4, '0')}_${String(k).padStart(3, '0')}`, inspection_id: `insp${i}`.replace(/^insp(\d+)$/, (m, n) => 'insp' + String(n).padStart(4, '0')) });
    }
  }
  return rows;
}

describe('pullPagedByIds', () => {
  it('40 проверок × 60 пунктов = 2400 строк при лимите сервера 1000 — приходят все', async () => {
    const rows = makeRows(40, 60);
    const ids = Array.from(new Set(rows.map(r => r.inspection_id)));
    const srv = fakeServer(rows, 1000);
    const got = await pullPagedByIds(srv.fetchPage, ids, { batchSize: 40, pageSize: 500 });
    assert.equal(got.length, 2400);
    assert.equal(new Set(got.map(r => r.id)).size, 2400, 'без дублей');
  });

  it('раньше (один запрос на пачку) терялся хвост — модель старого поведения', async () => {
    const rows = makeRows(40, 60);
    const ids = Array.from(new Set(rows.map(r => r.inspection_id)));
    const srv = fakeServer(rows, 1000);
    const { data } = await srv.fetchPage(ids, 0, 1e9);
    assert.equal(data.length, 1000);
  });

  it('страница меньше лимита сервера тоже работает; пустой список — без запросов', async () => {
    const rows = makeRows(90, 7); // 630 строк, 3 пачки по 40
    const ids = Array.from(new Set(rows.map(r => r.inspection_id)));
    const srv = fakeServer(rows, 1000);
    const got = await pullPagedByIds(srv.fetchPage, ids, { batchSize: 40, pageSize: 100 });
    assert.equal(got.length, 630);
    const empty = fakeServer([], 1000);
    assert.deepEqual(await pullPagedByIds(empty.fetchPage, [], {}), []);
    assert.equal(empty.calls.length, 0);
  });

  it('ошибка сервера не глотается (иначе запись станет «загруженной» без пунктов)', async () => {
    await assert.rejects(pullPagedByIds(async () => ({ error: new Error('502') }), ['a'], {}), /502/);
  });

  it('повторяющиеся id проверок не дают дублей строк', async () => {
    const rows = makeRows(2, 3);
    const srv = fakeServer(rows, 1000);
    const got = await pullPagedByIds(srv.fetchPage, ['insp0000', 'insp0000', 'insp0001'], {});
    assert.equal(got.length, 6);
  });
});

describe('pullSinceWithOverlap', () => {
  it('отступает на 15 минут назад', () => {
    assert.equal(PULL_OVERLAP_MS, 15 * 60 * 1000);
    assert.equal(pullSinceWithOverlap('2026-10-24T12:00:00.000Z'), '2026-10-24T11:45:00.000Z');
  });
  it('запись, отправленная во время прошлой синхронизации, попадает в следующую', () => {
    const lastPullAt = '2026-10-24T12:00:00.000Z';      // конец прошлой загрузки
    const lateRowUpdatedAt = '2026-10-24T11:58:30.000Z'; // отправлена, пока шла загрузка / часы отстают
    assert.ok(lateRowUpdatedAt > pullSinceWithOverlap(lastPullAt));
    assert.ok(!(lateRowUpdatedAt > lastPullAt), 'без запаса — терялась');
  });
  it('пусто/мусор → полная загрузка', () => {
    assert.equal(pullSinceWithOverlap(''), '');
    assert.equal(pullSinceWithOverlap('abc'), '');
    assert.equal(pullSinceWithOverlap(null), '');
  });
});

describe('clientScopeMode', () => {
  it('через сервер Platform 2.0 клиент видимость не сужает', () => {
    assert.equal(clientScopeMode({ serverScoped: true, dataScope: 'ownProjectOrOwnRecords', approved: true }), 'none');
    assert.equal(clientScopeMode({ serverScoped: true, dataScope: 'ownContractor', approved: true }), 'none');
  });
  it('гость/неподтверждённый — всегда блок, даже через сервер', () => {
    assert.equal(clientScopeMode({ serverScoped: true, dataScope: 'none', approved: true }), 'block');
    assert.equal(clientScopeMode({ serverScoped: true, dataScope: 'all', approved: false }), 'block');
  });
  it('без сервера Platform 2.0 — старый клиентский фильтр', () => {
    assert.equal(clientScopeMode({ serverScoped: false, dataScope: 'ownProjectOrOwnRecords', approved: true }), 'client');
  });
});
