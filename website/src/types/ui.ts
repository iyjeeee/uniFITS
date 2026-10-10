// types/ui.ts — Shared UI prop types reused across components and pages
import type { ReactNode } from 'react'

// ── Badge / Status ────────────────────────────────────────────────────────────

export type BadgeVariant = 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

// ── Button ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// ── Modal ─────────────────────────────────────────────────────────────────────

export type ModalVariant = 'success' | 'danger' | 'warning' | 'info'

// ── DataTable column definition ───────────────────────────────────────────────

// Column<T> — a single column descriptor for DataTable
// Use accessor for direct field display, render for custom cell output
export interface Column<T = Record<string, unknown>> {
  label: string               // thead cell text
  key: string                 // unique key for React reconciliation
  accessor?: keyof T          // direct field key — renders row[accessor]
  render?: (row: T, index: number) => ReactNode  // custom cell renderer
}

// ── KPI tile ─────────────────────────────────────────────────────────────────

// KpiMetric — shape expected by KpiGrid (KPI/index.tsx)
export interface KpiMetric {
  id: string | number
  label: string
  value: string | number
  icon?: ReactNode
  color: string               // color name key from COLOR_MAP in KPI/index.tsx
  trend?: number              // positive=↑ green, negative=↓ red, 0=neutral
  trendLabel?: string
  period?: string
  showBadge?: boolean         // urgency pulse dot in top-right corner
}

// ── Breakpoint ────────────────────────────────────────────────────────────────

// BreakpointResult — return shape of useBreakpoint hook
export interface BreakpointResult {
  width: number
  isMobile: boolean           // < 768px
  isTablet: boolean           // 768px – 1023px
  isDesktop: boolean          // ≥ 1024px
}

// ── Modal state ───────────────────────────────────────────────────────────────

// ModalState<T> — return shape of useModal<T>() hook
export interface ModalState<T> {
  isOpen: boolean
  data: T | null
  open: (payload?: T) => void
  close: () => void
  toggle: () => void
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

// Toast — a single active toast entry, returned by useToast() and rendered by ToastContainer
export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

// ── Navigation ────────────────────────────────────────────────────────────────

// NavigateFn — type of the navigate() prop passed from App.tsx to all pages
export type NavigateFn = (path: string) => void

// NavItem — single sidebar navigation entry
export interface NavItem {
  label: string
  icon: string                // emoji icon
  path?: string               // direct route path
  sub?: NavItem[]             // sub-menu items
}
