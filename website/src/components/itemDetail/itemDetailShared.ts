// itemDetail/itemDetailShared.ts — Kind and attendance color maps for the Project/Event detail panel
// Kind-specific accent colors — project=blue, event=green
export const KIND_COLOR: Record<string, string> = { project: '#4B5EAA', event: '#2E7D52' }
export const KIND_BG:    Record<string, string> = { project: 'var(--accent-light)', event: 'var(--success-light)' }

// AttendanceStatus color maps — local to this component
export const ATT_COLOR: Record<string, string> = { present: '#2E7D52', late: '#D4860A', absent: '#C0392B', excused: '#2471A3' }

export type ItemKind = 'project' | 'event'
