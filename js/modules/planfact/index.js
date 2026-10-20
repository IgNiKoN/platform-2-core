/**
 * Platform entry: модуль «План/Факт» (этап 2 P2-0002 — заглушка).
 */

const ROUTE = '#/planfact';
const VIEW_ID = 'tab-planfact';

function ensureView() {
    let el = document.getElementById(VIEW_ID);
    if (el) return el;
    el = document.createElement('div');
    el.id = VIEW_ID;
    el.className = 'view-section hidden';
    const anchor = document.getElementById('tab-mode-placeholder');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
    else document.body.appendChild(el);
    return el;
}

function showView() {
    const el = ensureView();
    document.querySelectorAll('.view-section').forEach((n) => n.classList.remove('active'));
    el.classList.add('active');
    const header = document.getElementById('main-header');
    if (header) header.style.display = 'none';
    el.innerHTML = '<div class="p-6"><h2 class="font-black text-[15px] uppercase">Модуль План/Факт</h2></div>';
}

export async function init(ctx) {
    if (window.AppRouter && typeof window.AppRouter.addRoute === 'function') {
        window.AppRouter.addRoute(ROUTE, showView);
        if (String(location.hash || '').indexOf(ROUTE) === 0) showView();
    }
    if (ctx && ctx.shell && typeof ctx.shell.renderSidebar === 'function') ctx.shell.renderSidebar();
}

export { PlanfactManifest } from './planfact.manifest.js';
