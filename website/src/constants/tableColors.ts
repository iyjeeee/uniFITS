// constants/tableColors.ts — Single source of truth for all table status colors
// Covers: active/inactive, completed/cancelled, paid/unpaid/partial,
//         present/absent/late/excused, ongoing/upcoming, pending/approved/rejected/voided
// Edit here → changes propagate to ALL manage pages automatically
import type { CSSProperties } from 'react'

// StatusColorMap — index signature for all status string lookups
type StatusColorMap = Record<string, string>

/* STATUS_BORDER — left border color per status (4px solid strip on each row) */
export const STATUS_BORDER: StatusColorMap = {
  /* Green family — success / done */
  active: '#2E7D52', completed: '#2E7D52', paid:    '#2E7D52',
  present:'#2E7D52', approved:  '#2E7D52',
  /* Blue family — ongoing / neutral */
  ongoing: '#4B5EAA',
  /* Amber family — caution / pending */
  upcoming: '#D4860A', pending: '#D4860A', late:    '#D4860A',
  partial:  '#D4860A',
  /* Red family — error / rejected */
  inactive: '#C0392B', cancelled: '#C0392B', rejected: '#C0392B',
  unpaid:   '#C0392B', absent:    '#C0392B', failed:   '#C0392B',
  /* Grey -- voided (kept in the ledger, never counted) */
  voided: '#6B7280',
}

/* STATUS_BG — tinted row hover background matching the border color family */
export const STATUS_BG: StatusColorMap = {
  active:    'rgba(46,125,82,.12)',  completed: 'rgba(46,125,82,.12)',
  paid:      'rgba(46,125,82,.12)',  present:   'rgba(46,125,82,.12)',
  approved:  'rgba(46,125,82,.12)',
  ongoing:   'rgba(75,94,170,.12)',
  upcoming:  'rgba(212,134,10,.12)', pending:   'rgba(212,134,10,.12)',
  late:      'rgba(212,134,10,.12)', partial:   'rgba(212,134,10,.12)',
  inactive:  'rgba(192,57,43,.12)',  cancelled: 'rgba(192,57,43,.12)',
  rejected:  'rgba(192,57,43,.12)',  unpaid:    'rgba(192,57,43,.12)',
  absent:    'rgba(192,57,43,.12)',  failed:    'rgba(192,57,43,.12)',
  voided:    'rgba(107,114,128,.12)',
}

/* STATUS_ACCENT — CSS variable string for InfoModal accentColor prop */
export const STATUS_ACCENT: StatusColorMap = {
  active:    'var(--success)', completed: 'var(--success)', paid:      'var(--success)',
  approved:  'var(--success)',
  ongoing:   'var(--accent)',
  upcoming:  'var(--warning)', pending:   'var(--warning)',
  inactive:  'var(--danger)',  cancelled: 'var(--danger)',  rejected:  'var(--danger)',
  voided:    'var(--text-secondary)',
}

/** rowStyle — base <tr> inline style: left colored border + cursor + transition */
export function rowStyle(status: string): CSSProperties {
  return {
    borderBottom: '1px solid var(--border-inner)',
    borderLeft:   `4px solid ${STATUS_BORDER[status] ?? 'var(--border-card)'}`,
    cursor:       'pointer',
    transition:   'background .12s ease',
  }
}

/** rowHoverBg — tinted background on hover, matching the status color family */
export function rowHoverBg(status: string): string {
  return STATUS_BG[status] ?? 'rgba(0,0,0,.04)'
}

/** modalAccentColor — border/header accent color string for InfoModal accentColor prop */
export function modalAccentColor(status: string): string {
  return STATUS_ACCENT[status] ?? 'var(--accent)'
}
