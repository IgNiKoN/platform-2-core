// P2-0013. Сборка «выпуск» (Platform 2.0 вместо старой версии на сервере владельца): копия файлов приложения в указанную папку,
// в копии переключатель js/services/config.service.js → APP_BUILD = 'release' (облако Quality, база RBI_QUALITY_DB, кэш rbi-quality-*).
// Репозиторий не меняется (в нём всегда 'dev' — GitHub Pages). Порядок выкладки и отката — docs/SERVERS.md.
// Перед запуском: npm run build:planfact && npm run build:company && npm run build:platform && npm run build:platform-admin
// Запуск: node scripts/make-release.mjs <папка вне репозитория>
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const out = process.argv[2] ? resolve(process.argv[2]) : '';
if (!out || out === ROOT || out.startsWith(ROOT + '/')) {
  console.error('Укажите папку ВНЕ репозитория: node scripts/make-release.mjs <папка>');
  process.exit(1);
}
// Только файлы приложения: без исходников, тестов, регламента, миграций, секретов и карт исходников.
const SKIP = new Set(['.git', 'node_modules', 'src', 'tests', 'ai-dev', 'supabase', 'scripts', 'docs', 'sql', '.claude', '.cursor', '_ai']);
const skipFile = (name) => name.startsWith('.env') || name.endsWith('.map') || /^(package(-lock)?\.json|tsconfig.*\.json|vite\..*\.ts|[A-Z_]+\.md)$/.test(name);

if (existsSync(out)) rmSync(out, { recursive: true });
for (const name of readdirSync(ROOT)) {
  if (SKIP.has(name) || skipFile(name)) continue;
  cpSync(join(ROOT, name), join(out, name), { recursive: true, filter: (src) => !skipFile(src.split('/').pop() || '') });
}
const cfg = join(out, 'js/services/config.service.js');
const text = readFileSync(cfg, 'utf8');
if (!text.includes("var APP_BUILD = 'dev';")) { console.error('Переключатель APP_BUILD не найден — сборка остановлена'); process.exit(1); }
writeFileSync(cfg, text.replace("var APP_BUILD = 'dev';", "var APP_BUILD = 'release';"));
console.log(`Готово: ${out} (APP_BUILD = 'release'). Проверьте на тестовом коде проекта до выкладки (docs/SERVERS.md).`);
