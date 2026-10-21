/** Расчёты экрана «Факт» (P2-0007): процент, остаток, разбор объёма, разбивка «закрыть этаж» — Σ по ЕИ равна заданному. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fmtQty, parseQty, percent, remainder, round3, splitFloor, sumByUnit, todayMoscow } from '../fact/fact.ts';

test('процент и остаток: 10 из 100 → 10 %, остаток 90; план 0 → 0 %; сверх плана — больше 100', () => {
  assert.equal(percent(10, 100), 10);
  assert.equal(percent(1, 3), 33.3);
  assert.equal(percent(5, 0), 0);
  assert.equal(percent(0, 100), 0);
  assert.equal(percent(105, 100), 105);
  assert.equal(remainder(100, 10), 90);
  assert.equal(remainder(100, 130), 0, 'остаток не бывает отрицательным');
  assert.equal(remainder(0.3, 0.1), 0.2, 'без хвостов двоичной дроби');
});

test('parseQty: запятая и точка, пробелы; пусто, минус, буквы — null', () => {
  assert.equal(parseQty('12,5'), 12.5);
  assert.equal(parseQty(' 1 234.567 '), 1234.567);
  assert.equal(parseQty('0,0004'), 0);
  for (const bad of ['', 'abc', '-3', '1,2,3', '1e3']) assert.equal(parseQty(bad), null, bad);
  assert.equal(fmtQty(1234.5), (1234.5).toLocaleString('ru-RU'));
  assert.equal(round3(1.0005 + 1.0005), 2.001);
});

test('закрыть этаж, 100 %: объём каждой строки = остаток', () => {
  const items = [{ id: 'a', unit: 'м²', plan: 100, fact: 10 }, { id: 'b', unit: 'м²', plan: 20, fact: 20 }, { id: 'c', unit: 'шт.', plan: 7, fact: 0 }];
  assert.deepEqual(splitFloor(items, { kind: 'remainder' }), { a: 90, b: 0, c: 7 });
});

test('закрыть этаж на X %: Σ по ЕИ равна заданному, разница округления уходит в последнюю позицию группы', () => {
  const items = [{ id: 'a', unit: 'м²', plan: 10, fact: 0 }, { id: 'b', unit: 'м²', plan: 10, fact: 0 }, { id: 'c', unit: 'м²', plan: 10, fact: 0 }, { id: 'd', unit: 'шт.', plan: 5, fact: 0 }];
  const r = splitFloor(items, { kind: 'percent', pct: 33.333 });
  const target = round3(30 * 0.33333);
  assert.equal(sumByUnit(items.filter((i) => i.unit === 'м²').map((i) => ({ unit: i.unit, qty: r[i.id] })))['м²'], target);
  assert.equal(r.d, round3(5 * 0.33333), 'другая ЕИ считается отдельно');
  const half = splitFloor([{ id: 'x', unit: 'м²', plan: 1, fact: 0 }, { id: 'y', unit: 'м²', plan: 1, fact: 0 }, { id: 'z', unit: 'м²', plan: 1, fact: 0 }], { kind: 'percent', pct: 50 });
  assert.equal(round3(half.x + half.y + half.z), 1.5);
});

test('закрыть этаж на 100 % от плана равно плану, на 0 % — нули', () => {
  const items = [{ id: 'a', unit: 'м²', plan: 33.333, fact: 5 }, { id: 'b', unit: 'м²', plan: 0.001, fact: 0 }];
  const full = splitFloor(items, { kind: 'percent', pct: 100 });
  assert.equal(round3(full.a + full.b), round3(33.333 + 0.001));
  assert.deepEqual(splitFloor(items, { kind: 'percent', pct: 0 }), { a: 0, b: 0 });
});

test('сегодняшняя дата — по Москве (в 22:30 UTC уже следующие сутки)', () => {
  assert.equal(todayMoscow(new Date('2026-10-21T22:30:00Z')), '2026-10-22');
  assert.equal(todayMoscow(new Date('2026-10-21T10:00:00Z')), '2026-10-21');
});
