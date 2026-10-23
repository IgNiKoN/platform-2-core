# P2-0018 этап 4 — общий сервер (23.10.2026, разрешение владельца «Да, весь этап 4»)

SQL Editor в Chrome владельца; файл → буфер в UTF-8, md5 буфера = md5 файла.

| Шаг | Результат |
|---|---|
| №99/118 (только чтение) | `authenticator.rolconfig`: `pgrst.db_schemas=public, storage, graphql_public, quality` (+ safeupdate, statement_timeout=8s, lock_timeout=8s). REST: `Accept-Profile: nonexistent_schema` → 406 «Only the following schemas are exposed: public, storage, graphql_public, quality». Схемы с USAGE у anon/authenticated: auth, core, extensions, graphql, graphql_public, net, planfact, public, quality, realtime, storage, supabase_functions — других пользовательских разделов для API нет, значит 018b ничего не «выключила» (стандарт сервера public, storage, graphql_public). Без RLS и с SELECT у anon: `net._http_response`, `net.http_request_queue`, `realtime.schema_migrations`, `realtime.subscription`, `supabase_functions.hooks`, `supabase_functions.migrations` — схемы не в `db_schemas`, через REST недоступны. **019 не нужна.** |
| Снимок RBI до | 74 \| 43 \| f926b2db… \| a920ba97… \| d09a3113… \| pf-функций 105 |
| `020_quality_scope_up.sql` | md5 `2307c9182d3df9ff313a685310df91e0`; предупреждение «destructive» (drop policy/function своих объектов Качества) → Run this query → «Success. No rows returned» |
| `tests/server/020_quality_scope.sql` | md5 `4154e577…`; «ОТЧЁТ (откат): FAIL всего: 0» |
| `021_quality_keys_up.sql` | md5 `5004b10fbfa9fc6016242544463b3aa9`; «destructive» (drop constraint/index своих таблиц) → «Success. No rows returned» |
| `tests/server/021_quality_keys.sql` | md5 `4958a061…`; «ОТЧЁТ (откат), таблиц 55: FAIL всего: 0» |
| `npm run test:server` | 1-й прогон: 324 PASS, 1 FAIL — ошибка теста (у alfa-foreman есть постоянное назначение на другой объект, `projects` = 2 объекта; проверка исправлена на «содержит объект автопроверок»). 2-й прогон: **325 PASS, ИТОГ: PASS** (в т.ч. 24 проверки матрицы P2-0018) |
| Снимок RBI после | 74 \| 43 \| f926b2db… \| a920ba97… \| d09a3113… — **= до** |
