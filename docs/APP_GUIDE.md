# RBI Platform — обзор приложения

Короткий вход для человека (и агента), который открыл репозиторий впервые.  
Техническая глубина и история рефакторинга — в `_ai/`, не здесь.

---

## Что это

**RBI Platform · Construction OS** — веб-приложение (PWA) для управления качеством и строительным контролем на объектах RBI, с курсом на модульную «ОС производства» (качество → платформа → стройконтроль → сроки/бюджет/гарантия/эксплуатация).

Сейчас в проде по сути живёт бывший **RBI Quality Pro**, постепенно переведённый на целевую схему:

```
index.html → bootstrap / app.entry → Core → Services → Modules
```

Модули общаются через **сервисы** (`ctx.services.*`) и **события**, не напрямую друг с другом. Offline-first: IndexedDB + sync в Supabase.

Живая карта БД (таблицы, RLS, buckets, counts):  
[`_ai/supabase/LIVE_INVENTORY.md`](../_ai/supabase/LIVE_INVENTORY.md).

---

## Для кого

| Роль (в профиле) | Типичный фокус |
|---|---|
| engineer | осмотры, задачи, библиотека, СК-импорт |
| project_manager / director | обзор проекта, отчёты |
| manager / deputy_manager | админ, профили, настройки, полный доступ |
| contractor | свои замечания/задачи (фильтр по подрядчику) |

Точная матрица прав — в коде `permission.service` / ROADMAP §23; UI настроек — `#/settings`.

---

## Модули (как в коде)

Реестр: `js/modules/modules.manifest.js`.

| Модуль | Папка | Зачем |
|---|---|---|
| **quality** | `js/modules/quality/` | Осмотры, история, задачи, отчёты, аналитика, эталон, инженер, график, совещания, вмешательства |
| **sk** | `quality/features/sk/` | Импорт/анализ Excel «строительного контроля» (внешняя выгрузка) — не путать с production-стройконтролем |
| **knowledge** | `js/modules/knowledge/` | Библиотека: TWI, эталоны, документы, узлы, практики, чек-листы (top-level module) |
| **construction** | `js/modules/construction/` | Производственный стройконтроль: дефекты, приёмка, планы — целевой второй production-модуль |
| **planfact** | `js/modules/planfact/`, `src/modules/planfact/` | Platform 2.0: План/Факт — «Работы» и «Справочники» (проекты и структура, единицы измерения); подвкладки — в боковом меню (`manifest.nav`) |
| **company** | `js/modules/company/`, `src/platform/company/` | Platform 2.0: роли, сотрудники, журнал компании — подраздел «Настройки → Компания» |
| **construction-v2** | `js/modules/construction-v2/` | Параллельный/новый контур (Vite/TS), рядом со strangler fig |
| **settings** | `js/modules/settings/` | Chrome платформы: `#/settings/:section` (platform / admin / quality / construction) |
| **gamification** | `quality/features/gamification/` | Рейтинги / игра |
| **ai** | `quality/features/ai/` | Ассистент / KB |

**Глоссарий (частая путаница):**

- «СК» в смысле Excel-аналитики → модуль **`sk`**
- «Стройконтроль» как выдача замечаний на планах / приёмка → **`construction`**
- «Модуль качества» в бизнес-карточках → **`quality`**

---

## Как пользоваться приложением (поверхностно)

1. Логин / профиль инженера (cloud_status `approved`).
2. Выбор проекта / компании в shell.
3. Нижняя навигация (mobile) или sidebar (desktop) — экраны активного модуля.
4. **Настройки** — не экран Quality: desktop footer sidebar, mobile пункт bottom-nav, маршрут `#/settings/...`.
5. Данные пишутся локально и уходят в sync; файлы — в Storage buckets (см. live inventory).

Детали экранов Quality (аудит, история, пины и т.д.) — в feature-файлах модуля и `_ai/CURRENT_STEP.md`, не дублируются здесь.

---

## Карта репозитория `_ai/` (что читать)

| Файл | Когда открывать |
|---|---|
| [`ARCHITECTURE_BRIEF.md`](../_ai/ARCHITECTURE_BRIEF.md) | Ежедневный технический контекст — **первый** |
| [`current_plan.md`](../_ai/current_plan.md) | Текущий блок работы Архитектора |
| [`CURRENT_STEP.md`](../_ai/CURRENT_STEP.md) | История сделанного |
| [`PLATFORM_TARGET_ARCHITECTURE.md`](../_ai/PLATFORM_TARGET_ARCHITECTURE.md) | Целевая архитектура (не каждый день) |
| [`SERVICES_API.md`](../_ai/SERVICES_API.md) | Контракты сервисов вместо чтения кода |
| [`ROADMAP.md`](../_ai/ROADMAP.md) | Очередь эпиков / отложенное |
| [`PROJECT_CARD.md`](../_ai/PROJECT_CARD.md) | Бизнес-вехи, не runtime-детали |
| [`supabase/LIVE_INVENTORY.md`](../_ai/supabase/LIVE_INVENTORY.md) | Живая схема Supabase |
| [`DEV_RUNTIME.md`](../_ai/DEV_RUNTIME.md) | Always-on HTTP `:8765` + Chromium CDP `:9222` |

Рабочий цикл ролей Архитектор / Исполнитель — в корневом [`README.md`](../README.md).

---

## Runtime-цепочка (для отладки)

```
index.html
→ js/core/bootstrap.js / app.entry.js
→ Core (router, views, module-loader, app-shell)
→ js/services/*.service.js
→ js/modules/<module>/… (manifest + entry)
```

Новые модули — через `module-loader` + manifest, без статичных `<script>` «заодно».  
Новый код после `quality` — предпочтительно TypeScript + Vite (см. правила проекта); точечные фиксы в JS не переписывать на TS без нужды.

---

## Данные и безопасность (коротко)

- Клиент ходит в Supabase под anon/authenticated key; **защита = RLS + Storage policies**.
- Снимок 2026-08-09: много переходных/открытых политик (особенно `*_v2` и public buckets) — см. раздел «Suggested follow-ups» в live inventory. Не считать `/sql` миграции истиной «как в проде».

---

## Проверки (unit + Knowledge smoke)

Из корня репозитория:

```bash
# Unit: harness + контракт манифеста/реестра Knowledge
npm run test:unit

# Always-on runtime, затем CDP smoke маршрутов Knowledge
bash _ai/scripts/dev-runtime.sh ensure
npm run smoke:knowledge
# или: node _ai/scripts/smoke-knowledge.mjs --reload
```

HTTP `:8765`, Chromium CDP `:9222` — см. [`_ai/DEV_RUNTIME.md`](../_ai/DEV_RUNTIME.md). Не запускать новый Chromium на каждый прогон.

---

## Что сюда не кладём

Полные спеки экранов, историю каждого SW-бандла, построчные migration maps — они уже в `_ai/`. Этот файл — **ориентир**, не дубль BRIEF.
