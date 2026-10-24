/**
 * history.state.js
 * Изолированное состояние модуля History.
 *
 * Единый источник правды для данных истории проверок.
 * Все модули читают данные через window.HistoryState.allRecords.
 */

/**
 * P2-0024: список Журнала из истории в памяти — тот же набор и порядок, что даёт индекс by_date
 * (direction 'prev'): только живые записи с ключом даты (строка/число), новые сверху; числа ниже строк
 * (порядок ключей IndexedDB), при равной дате — по id по убыванию. Объекты общие с contractorArray (без копий).
 */
function _idbKeyCmp(a, b) {
    const ta = typeof a === 'number' ? 0 : 1, tb = typeof b === 'number' ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return a < b ? -1 : (a > b ? 1 : 0);
}
export function historyListFromMemory(arr) {
    const list = [];
    for (const i of arr || []) {
        if (!i || i._deleted === true || i.is_deleted === true) continue;
        const d = i.date;
        if (typeof d !== 'string' && !(typeof d === 'number' && Number.isFinite(d))) continue;
        list.push(i);
    }
    list.sort((x, y) => _idbKeyCmp(y.date, x.date) || _idbKeyCmp(y.id, x.id));
    return list;
}

export const HistoryState = {

    records: [],
    allRecords: [],
    selectedIds: [],

    filters: {
        period: 'all',
        contractor: '',
        object: '',
        status: '',
        searchText: ''
    },

    visibleGroupCount: 20,
    hasMore: false,

    // Постраничная (курсорная) загрузка Журнала (см. отчёт по оптимизации
    // журнала/аналитики). pageCursorKey — значение поля `date` последней
    // полученной записи, pageCursorPrimaryKey — её id (используются ВМЕСТЕ как
    // точная граница для следующей страницы через индекс by_date — см.
    // dbGetPageByIndex, storage-db.core.js: одного только значения даты
    // недостаточно при совпадающих датах у нескольких записей).
    // pageHasMore — есть ли ещё записи в базе за текущим курсором.
    // isLoadingPage — защита от повторного параллельного запроса следующей страницы.
    // initialObjectTarget — сколько верхнеуровневых объектов (площадок) набрать
    // при первом заходе, докручивая страницы без участия пользователя.
    pageCursorKey: null,
    pageCursorPrimaryKey: null,
    pageHasMore: false,
    isLoadingPage: false,
    pageSize: 50,
    initialObjectTarget: 20,

    /* ── Сеттеры ─────────────────────────────────────────────────────── */

    setRecords(arr) {
        this.allRecords = arr || [];
        this.records = this.allRecords;
    },

    appendRecords(arr) {
        var toAppend = arr || [];
        this.allRecords = this.allRecords.concat(toAppend);
        this.records = this.allRecords;
    },

    setPageState(patch) {
        if (patch && typeof patch === 'object') {
            Object.assign(this, patch);
        }
    },

    /**
     * P2-0024: список Журнала из истории в памяти (вместо порций-копий из базы), если она уже загружена,
     * а список ещё порционный. Возвращает true, если список заменён.
     */
    useMemoryHistoryIfReady() {
        const mem = (typeof window !== 'undefined' && Array.isArray(window.contractorArray)) ? window.contractorArray : null;
        if (!mem || !mem.length || !this.pageHasMore) return false;
        this.setRecords(historyListFromMemory(mem));
        this.pageCursorKey = null;
        this.pageCursorPrimaryKey = null;
        this.pageHasMore = false;
        return true;
    },

    resetPagination() {
        this.pageCursorKey = null;
        this.pageCursorPrimaryKey = null;
        this.pageHasMore = false;
        this.isLoadingPage = false;
    },

    setFilters(patch) {
        if (patch && typeof patch === 'object') {
            Object.assign(this.filters, patch);
        }
    },

    resetFilters() {
        this.filters = {
            period: 'all',
            contractor: '',
            object: '',
            status: '',
            searchText: ''
        };
    },

    setSelectedIds(ids) {
        this.selectedIds = Array.isArray(ids) ? ids : [];
    },

    setVisibleGroupCount(n) {
        this.visibleGroupCount = typeof n === 'number' && n > 0 ? n : 20;
    }
};

if (typeof window !== 'undefined') {
    window.HistoryState = HistoryState;
}

console.log('[HistoryState] history.state.js loaded');
