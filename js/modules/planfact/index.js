/**
 * Platform entry wrapper: подключает собранный Vite-бандл planfact (React).
 * Исходники — src/modules/planfact/** (TypeScript). Сборка: npm run build:planfact.
 * Подвкладки (manifest.nav) передаются в init — манифест остаётся единственным источником пунктов меню.
 */
import { PlanfactManifest } from './planfact.manifest.js';
import { init as bundleInit } from '../../dist/planfact/planfact.js';

export { mount, unmount, isMounted } from '../../dist/planfact/planfact.js';
export { PlanfactManifest };
export function init(ctx) {
    return bundleInit(Object.assign({}, ctx || {}, { nav: PlanfactManifest.nav }));
}
