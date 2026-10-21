# LATEST_ARCHITECT_PLAN — P2-0008 (доработка)

Дата: 21.10.2026. Карточка: `ai-dev/tasks/P2-0008.md` (IN_PROGRESS, §11). Ветка `task/P2-0008-summary`.

**Итог приёмки:** независимое ревью `011_up.sql` — BLOCKER/HIGH нет; владелец: вернуть на доработку, светофор и сроки оставить всем с `fact.view` (без ₽).

**Доработка (миграция `011a_summary_fix.sql`, `create or replace`, сигнатуры те же):**
1. Прогноз дальше 36 500 дней → нет прогноза (red, `no_pace`) — сейчас переполнение роняет портфель.
2. Внешний `order by` в `pf_summary_ks2_gap`.
3. Документы: AUTH_AND_ACCESS (светофор и разрыв КС-2 видны с `fact.view`), TECH_DEBT №63 закрыт решением, SERVERS — 011a.

Проверки: PGlite 011/011a FAIL 0 + регрессия, `npm test`, `check:ts`; 011a на сервер — по решению владельца, затем `test:server`.

STATUS: PLAN_READY
