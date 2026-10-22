/* Файл: js/services/config.service.js */
/* Config Service v0.1 — платформенный доступ к window.APP_CONFIG (перенесён из js/config.js) */

/* P2-0013. ЕДИНСТВЕННЫЙ переключатель сборки «разработка / выпуск» (порядок выпуска и отката — docs/SERVERS.md):
   'dev'     — GitHub Pages и разработка: облако Quality выключено, локальная база PLATFORM2_DB, кэш приложения platform2-*
               (на общем адресе ignikon.github.io копия не делит базу и кэш со старым приложением);
   'release' — сервер владельца ВМЕСТО старой версии: облако Quality включено (тот же сервер и публичный ключ, что у Platform 2.0),
               локальная база RBI_QUALITY_DB (черновики и фото людей на месте), старые кэши rbi-quality-* заменяются новым.
   Файл читают и страница, и кэш приложения (sw.js, importScripts) — поэтому без import/export и без обращения к window вне проверки. */
var APP_BUILD = 'dev';

(function (root) {
    var release = APP_BUILD === 'release';
    root.APP_CONFIG = {
        BUILD: APP_BUILD,
        /* Platform 2.0 (P2-0004): вход и данные План/Факт. Публичный anon-ключ (виден в браузере по своей природе); права проверяет сервер (RLS). */
        P2_SUPABASE_URL: 'https://api.rbi-q.ru',
        P2_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc3NTA3MjAwLCJleHAiOjE5MzUyNzM2MDB9.f2s_pInfJu74ptaavpJx7J3I6Arwavcjnkzl1z39wPk',
        CLOUD_DISABLED_MESSAGE: 'Облачный вход отключён в dev-сборке',
        LOCAL_DB_NAME: release ? 'RBI_QUALITY_DB' : 'PLATFORM2_DB',
        SW_CACHE_PREFIX: release ? 'rbi-quality-' : 'platform2-'
    };
    /* Облако старого Quality (вход по PIN, синхронизация): только в выпуске. В разработке пусто — запись в данные Quality невозможна. */
    root.APP_CONFIG.SUPABASE_URL = release ? root.APP_CONFIG.P2_SUPABASE_URL : '';
    root.APP_CONFIG.SUPABASE_KEY = release ? root.APP_CONFIG.P2_SUPABASE_ANON_KEY : '';
}(typeof window !== 'undefined' ? window : self));

(function () {
    'use strict';
    if (typeof window === 'undefined') return;   // кэш приложения читает только APP_CONFIG

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
