/**
 * P2-0023 этап 5: совещания не пропадают.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isUnsentLocal,
  isGlobalProjectName,
  recordProjectNames,
  keepOnPurge,
  meetingPushAllowed,
  cloudMayOverwrite
} from '../../services/sync/sync-merge.policy.js';

const assigned = ['obj-a'];
const inAssigned = (rec) => assigned.includes(rec.project_canonical_key || rec.projectName);

const synced = (o) => Object.assign({ source: 'cloud', syncStatus: 'synced' }, o);

describe('keepOnPurge (смена назначенных объектов)', () => {
  it('«Все объекты» остаётся (раньше удалялось — исключение было только для «Все»)', () => {
    assert.equal(keepOnPurge(synced({ projectName: 'Все объекты', project_canonical_key: '' }), inAssigned), true);
  });
  it('по нескольким объектам — остаётся, если назначен хотя бы один', () => {
    assert.equal(keepOnPurge(synced({ projectName: 'obj-a, obj-b', project_canonical_key: '' }), inAssigned), true);
    assert.equal(keepOnPurge(synced({ projectNames: ['obj-b', 'obj-a'], projectName: 'obj-b, obj-a' }), inAssigned), true);
    assert.equal(keepOnPurge(synced({ projectName: 'obj-b, obj-c' }), inAssigned), false);
  });
  it('неотправленная запись остаётся при любом объекте (pending/needs_attention тоже)', () => {
    for (const st of ['not_synced', 'pending', 'needs_attention']) {
      assert.equal(keepOnPurge({ projectName: 'obj-z', syncStatus: st, source: 'cloud' }, inAssigned), true, st);
    }
  });
  it('чужой объект, отправлено — удаляется (как раньше)', () => {
    assert.equal(keepOnPurge(synced({ project_canonical_key: 'obj-z' }), inAssigned), false);
    assert.equal(keepOnPurge(synced({ project_canonical_key: 'obj-a' }), inAssigned), true);
  });
});

describe('meetingPushAllowed', () => {
  it('автор записан иначе, чем ФИО профиля, но объект назначен — отправляем', () => {
    const meet = { author: 'Иванов И.', project_canonical_key: 'obj-a', projectName: 'obj-a' };
    assert.equal(meetingPushAllowed(meet, { iName: 'Иванов Иван', inAssigned }), true);
  });
  it('«Все объекты» и несколько объектов (хоть один назначен) — отправляем', () => {
    assert.equal(meetingPushAllowed({ author: 'X', projectName: 'Все объекты' }, { iName: 'Y', inAssigned }), true);
    assert.equal(meetingPushAllowed({ author: 'X', projectNames: ['obj-b', 'obj-a'] }, { iName: 'Y', inAssigned }), true);
  });
  it('чужой автор и чужой объект — нет', () => {
    assert.equal(meetingPushAllowed({ author: 'X', project_canonical_key: 'obj-z' }, { iName: 'Y', inAssigned }), false);
  });
  it('своё — да', () => {
    assert.equal(meetingPushAllowed({ author: 'Y', project_canonical_key: 'obj-z' }, { iName: 'Y', inAssigned }), true);
  });
});

describe('cloudMayOverwrite', () => {
  it('неотправленная местная правка не затирается, даже если облако новее', () => {
    assert.equal(cloudMayOverwrite({ local: { syncStatus: 'not_synced' }, cloudTime: 200, localTime: 100 }), false);
    assert.equal(cloudMayOverwrite({ local: { syncStatus: 'not_synced', _deleted: true }, cloudTime: 200, localTime: 100, forceReference: true }), false);
  });
  it('отправленная — как раньше: облако новее/равно → заменяет', () => {
    assert.equal(cloudMayOverwrite({ local: synced({}), cloudTime: 200, localTime: 100 }), true);
    assert.equal(cloudMayOverwrite({ local: synced({}), cloudTime: 100, localTime: 200 }), false);
    assert.equal(cloudMayOverwrite({ local: null, cloudTime: 1, localTime: 0 }), true);
  });
  it('«blocked» (нет прав) — не считается неотправленной, облако может заменить', () => {
    assert.equal(isUnsentLocal({ source: 'local', syncStatus: 'blocked' }), false);
  });
});

describe('вспомогательные', () => {
  it('глобальные имена', () => {
    for (const n of ['', 'Все', 'Все объекты', 'все объекты', 'Системная']) assert.equal(isGlobalProjectName(n), true, n);
    assert.equal(isGlobalProjectName('ЖК Спутник'), false);
  });
  it('список объектов записи', () => {
    assert.deepEqual(recordProjectNames({ projectName: 'A, B' }), ['A', 'B']);
    assert.deepEqual(recordProjectNames({ project_canonical_key: 'k', projectName: 'A' }), ['k']);
    assert.deepEqual(recordProjectNames({ projectNames: ['A'] }), ['A']);
  });
});
