async function h() {
  const t = await import("./exceljs.min-Cd0WKM3n.js").then((e) => e.e);
  return t.default && t.default.Workbook ? t.default : t;
}
function u(t) {
  if (t == null) return null;
  if (typeof t == "number") return Number.isFinite(t) ? t : null;
  if (typeof t == "string") return t;
  if (typeof t == "boolean") return t ? "да" : "нет";
  if (t instanceof Date) return t.toISOString().slice(0, 10);
  if (typeof t == "object") {
    const e = t;
    if ("result" in e) return u(e.result);
    if ("formula" in e || "sharedFormula" in e) return null;
    if (Array.isArray(e.richText)) return e.richText.map((s) => s.text).join("");
    if ("text" in e) return u(e.text);
    if ("error" in e) return null;
  }
  return null;
}
function w(t) {
  const e = t instanceof Uint8Array ? t : new Uint8Array(t);
  return e.length > 4 && e[0] === 80 && e[1] === 75;
}
async function d(t) {
  if (!w(t)) throw new Error("Это не файл Excel .xlsx (старый .xls сохраните как .xlsx).");
  const e = await h(), s = new e.Workbook();
  try {
    await s.xlsx.load(t);
  } catch {
    throw new Error("Файл повреждён или это не .xlsx — открыть не удалось.");
  }
  const a = [];
  for (const l of s.worksheets) {
    const n = [], c = l.rowCount || 0;
    for (let r = 1; r <= c; r++) {
      const f = l.getRow(r), i = [];
      f.eachCell({ includeEmpty: !1 }, (o, x) => {
        i[x - 1] = u(o.value);
      });
      for (let o = 0; o < i.length; o++) i[o] === void 0 && (i[o] = null);
      n.push(i);
    }
    for (; n.length && n[n.length - 1].every((r) => r === null || r === ""); ) n.pop();
    a.push({ name: String(l.name), rows: n, hidden: !!l.state && l.state !== "visible" });
  }
  return { sheets: a };
}
export {
  u as cellValue,
  w as looksLikeXlsx,
  d as readWorkbook
};
//# sourceMappingURL=xlsx-reader-BTDt6GKW.js.map
