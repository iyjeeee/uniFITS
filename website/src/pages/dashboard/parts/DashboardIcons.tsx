// parts/DashboardIcons.tsx — SVG icons for the dashboard KPI cards (called with the stroke color)
export const Ico: Record<string, (c: string) => React.ReactElement> = {
  members:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  fund:     c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  project:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  event:    c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><rect x={3} y={4} width={18} height={18} rx={2}/><line x1={16} y1={2} x2={16} y2={6}/><line x1={8} y1={2} x2={8} y2={6}/><line x1={3} y1={10} x2={21} y2={10}/></svg>,
  income:   c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  expense:  c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  txn:      c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  complete: c => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
}
