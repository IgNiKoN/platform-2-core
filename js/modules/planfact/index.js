/**
 * Platform entry wrapper: подключает собранный Vite-бандл planfact (React).
 * Исходники — src/modules/planfact/** (TypeScript). Сборка: npm run build:planfact.
 */

export { init, mount, unmount, isMounted } from '../../dist/planfact/planfact.js';
export { PlanfactManifest } from './planfact.manifest.js';
