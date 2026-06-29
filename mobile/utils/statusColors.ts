// utils/statusColors.ts — Status → color mapping for uniFITS Mobile
// Mirrors website's src/constants/tableColors.js — same logic, React Native values
// Use these helpers everywhere status colors are needed — never hardcode

import { Colors } from '@/constants/theme';
import { StatusType, BadgeVariant } from '@/types';

// ── Status → Border Color (left accent strip on list items) ──────────────────
const STATUS_BORDER: Record<string, string> = {
  // Green family — success / done
  active:    Colors.success,
  completed: Colors.success,
  paid:      Colors.success,
  present:   Colors.success,
  approved:  Colors.success,
  // Blue family — ongoing / neutral
  ongoing:   Colors.accent,
  // Amber family — caution / pending
  upcoming:  Colors.warning,
  pending:   Colors.warning,
  late:      Colors.warning,
  partial:   Colors.warning,
  // Red family — error / rejected
  inactive:  Colors.danger,
  cancelled: Colors.danger,
  rejected:  Colors.danger,
  unpaid:    Colors.danger,
  absent:    Colors.danger,
  failed:    Colors.danger,
  excused:   Colors.info,
};

// ── Status → Background Tint (pressed/selected row state) ────────────────────
const STATUS_BG: Record<string, string> = {
  active:    Colors.successLight,
  completed: Colors.successLight,
  paid:      Colors.successLight,
  present:   Colors.successLight,
  approved:  Colors.successLight,
  ongoing:   Colors.accentLight,
  upcoming:  Colors.warningLight,
  pending:   Colors.warningLight,
  late:      Colors.warningLight,
  partial:   Colors.warningLight,
  inactive:  Colors.dangerLight,
  cancelled: Colors.dangerLight,
  rejected:  Colors.dangerLight,
  unpaid:    Colors.dangerLight,
  absent:    Colors.dangerLight,
  failed:    Colors.dangerLight,
  excused:   Colors.infoLight,
};

// ── Status → Badge Variant ────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, BadgeVariant> = {
  active:    'success',
  completed: 'success',
  paid:      'success',
  present:   'success',
  approved:  'success',
  ongoing:   'accent',
  upcoming:  'warning',
  pending:   'warning',
  late:      'warning',
  partial:   'warning',
  inactive:  'danger',
  cancelled: 'danger',
  rejected:  'danger',
  unpaid:    'danger',
  absent:    'danger',
  failed:    'danger',
  excused:   'info',
};

/** statusBorderColor — hex color for 4px left border strip on list items */
export function statusBorderColor(status: string): string {
  return STATUS_BORDER[status?.toLowerCase()] || Colors.borderCard;
}

/** statusBgColor — rgba tint for pressed/selected list item background */
export function statusBgColor(status: string): string {
  return STATUS_BG[status?.toLowerCase()] || 'rgba(0,0,0,0.04)';
}

/** statusBadgeVariant — badge variant string for StatusBadge component */
export function statusBadgeVariant(status: string): BadgeVariant {
  return STATUS_BADGE[status?.toLowerCase()] || 'neutral';
}
