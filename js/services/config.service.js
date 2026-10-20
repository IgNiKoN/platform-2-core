/* Файл: js/services/config.service.js */
/* Config Service v0.1 — платформенный доступ к window.APP_CONFIG (перенесён из js/config.js) */

/* Platform 2.0 (P2-0002): облако выключено — адрес и ключ пустые.
   Единственное место настройки сервера. Старый адрес и порядок подключения — docs/SERVERS.md
   (подключать только после P2-0004, иначе запись пойдёт в таблицы Quality). */
window.APP_CONFIG = {
    SUPABASE_URL: '',
    SUPABASE_KEY: '',
    /* Platform 2.0 (P2-0004): вход и данные План/Факт. Публичный anon-ключ (виден в браузере по своей природе); права проверяет сервер (RLS). Старые SUPABASE_URL/KEY остаются пустыми — старая синхронизация Quality не включается. */
    P2_SUPABASE_URL: 'https://api.rbi-q.ru',
    P2_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc3NTA3MjAwLCJleHAiOjE5MzUyNzM2MDB9.f2s_pInfJu74ptaavpJx7J3I6Arwavcjnkzl1z39wPk',
    CLOUD_DISABLED_MESSAGE: 'Облачный вход отключён в dev-сборке'
};

(function () {
    'use strict';

    window.RBI = window.RBI || {};
    window.RBI.services = window.RBI.services || {};

    window.RBI.services.config = {

        getSupabaseUrl: function () {
            return window.APP_CONFIG.SUPABASE_URL;
        },

        getSupabaseKey: function () {
            return window.APP_CONFIG.SUPABASE_KEY;
        },

        isCloudEnabled: function () {
            return !!(window.APP_CONFIG.SUPABASE_URL && window.APP_CONFIG.SUPABASE_KEY);
        },

        getCloudDisabledMessage: function () {
            return window.APP_CONFIG.CLOUD_DISABLED_MESSAGE;
        },

        getConfig: function () {
            return window.APP_CONFIG;
        }
    };

    if (window.RBI.registry) {
        window.RBI.registry.register('service.config', window.RBI.services.config);
    }

    console.log('[RBI Service] config loaded');
}());
