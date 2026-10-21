/**
 * Platform entry wrapper: подключает собранный Vite-бандл раздела «Компания» (React).
 * Исходники — src/platform/company/** (TypeScript). Сборка: npm run build:company.
 */

export { init, mount, unmount, isMounted } from '../../dist/company/company.js';
export { CompanyManifest } from './company.manifest.js';
