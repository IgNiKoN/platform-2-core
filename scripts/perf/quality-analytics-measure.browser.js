// P2-0024 — замер Аналитики Качества (стенд, без сети).
// Запуск: открыть Качество 2.0 → Аналитика → консоль → вставить файл → await rbiMeasureAnalytics().
// Меряет для периода «Всё время» и каждой подвкладки: самое долгое подвисание главного потока (мс),
// всю работу (сумма задержек > 4 мс), число DOM-узлов на вкладке и «снимок цифр» (все числа видимой секции)
// для сравнения «до = после». Подвисание ловится пингом MessageChannel (видны задачи короче 50 мс).
(function () {
  function lagMonitor() {
    const ch = new MessageChannel();
    let last = performance.now(), max = 0, total = 0, on = true;
    ch.port1.onmessage = () => {
      const now = performance.now();
      const gap = now - last;
      if (gap > max) max = gap;
      if (gap > 4) total += gap;
      last = now;
      if (on) ch.port2.postMessage(0);
    };
    ch.port2.postMessage(0);
    return { stop: () => { on = false; return { max: Math.round(max), total: Math.round(total) }; } };
  }
  const idle = (ms) => new Promise(r => setTimeout(r, ms));
  async function settle(quietMs = 700, capMs = 8000) {
    // ждём, пока не будет задач длиннее 16 мс в течение quietMs
    const t0 = performance.now();
    let lastBusy = performance.now();
    await new Promise(res => {
      let prev = performance.now();
      const ch = new MessageChannel();
      ch.port1.onmessage = () => {
        const now = performance.now();
        if (now - prev > 16) lastBusy = now;
        prev = now;
        if (now - lastBusy > quietMs || now - t0 > capMs) res(); else ch.port2.postMessage(0);
      };
      ch.port2.postMessage(0);
    });
  }
  function numbers(el) {
    if (!el) return '';
    return (el.innerText || '').replace(/\s+/g, ' ').match(/-?\d+(?:[.,]\d+)?%?/g)?.join(' ') || '';
  }
  async function step(label, fn, sectionId) {
    await settle();
    const m = lagMonitor();
    fn();
    await settle();
    const r = m.stop();
    const tab = document.getElementById('tab-analytics');
    const sec = sectionId ? document.getElementById(sectionId) : null;
    return { label, maxMs: r.max, workMs: r.total, nodes: tab ? tab.getElementsByTagName('*').length : 0, nums: numbers(sec) };
  }
  window.rbiMeasureAnalytics = async function (opts) {
    // Скрытая вкладка/панель не даёт кадров (requestAnimationFrame молчит) — подменяем на таймер 16 мс.
    if (!window.__rbiRafShim) { window.__rbiRafShim = true; window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); }
    const o = Object.assign({ tabs: ['sub-contractors', 'sub-onepager', 'sub-history'], rounds: 4 }, opts || {});
    const sel = document.getElementById('global-filter-period');
    const setPeriod = (v) => { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); };
    const raw = [];
    for (let r = 0; r < o.rounds; r++) {
      // каждый круг: «30 дней» → «Всё время» (кэш вкладок сброшен) → обход вкладок
      window.switchAnalyticsSubTab('sub-contractors');
      await settle();
      if (sel) { setPeriod('D30'); await idle(600); await settle(); }
      if (sel) raw.push({ round: r, ...(await step('period D30→ALL', () => setPeriod('ALL'), 'sub-contractors')) });
      for (const t of o.tabs) raw.push({ round: r, ...(await step(t, () => window.switchAnalyticsSubTab(t), t)) });
    }
    // итог: медиана по кругам без первого (прогрев)
    const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor((b.length - 1) / 2)]; };
    const labels = [...new Set(raw.map(x => x.label))];
    const summary = labels.map(label => {
      const rs = raw.filter(x => x.label === label && (o.rounds < 2 || x.round > 0));
      const sec = document.getElementById(label.startsWith('period') ? 'sub-contractors' : label);
      return { label, maxMs: med(rs.map(x => x.maxMs)), maxMsWorst: Math.max(...rs.map(x => x.maxMs)), workMs: med(rs.map(x => x.workMs)),
        tabNodes: rs[rs.length - 1].nodes, sectionNodes: sec ? sec.getElementsByTagName('*').length : 0, nums: rs[rs.length - 1].nums };
    });
    return { summary, raw: raw.map(({ nums, ...x }) => x) };
  };
})();
