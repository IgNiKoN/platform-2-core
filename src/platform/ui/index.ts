/** Публичный вход дизайн-системы Platform 2.0 (P2-0010): токены, примитивы, графики, форматы подписей. */
export { P2_UI_CSS, P2_DARK_THEMES } from './tokens.ts';
export { KpiTile, ProgressBar, StatusBadge, Legend, seriesColor } from './primitives.ts';
export type { Status, SeriesKind, LegendItem } from './primitives.ts';
export { ChartCard, LineChart, BarChart } from './charts.ts';
export type { ChartTable, LineSeries, Bar } from './charts.ts';
export { compactNumber, compactRub, dayMonth, monthLabel, daysBetween, niceStep } from './format.ts';
export { ChessCell, ChessScale, CHESS_STATE_LABEL, P2_CHESS_CSS } from './chess.ts';
export type { ChessState } from './chess.ts';
