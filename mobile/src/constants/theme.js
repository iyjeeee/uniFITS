// src/constants/theme.js
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for ALL design tokens.
// Mirrors the website's CSS custom properties exactly so both platforms
// stay visually consistent.
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  primary:       '#1E2128',   // --primary  (dark navy — header, sidebar)
  accent:        '#4B5EAA',   // --accent   (indigo blue — buttons, links)
  accentDark:    '#3D52A0',   // table header text / pressed state
  accentLight:   'rgba(75,94,170,0.08)',
  accentMid:     'rgba(75,94,170,0.15)',

  // ── Status ────────────────────────────────────────────────────────────────
  success:       '#2E7D52',
  successLight:  'rgba(46,125,82,0.08)',
  successMid:    'rgba(46,125,82,0.15)',

  danger:        '#C0392B',
  dangerLight:   'rgba(192,57,43,0.08)',

  warning:       '#D4860A',
  warningLight:  'rgba(212,134,10,0.08)',

  info:          '#2471A3',
  infoLight:     'rgba(36,113,163,0.08)',

  // ── Backgrounds ───────────────────────────────────────────────────────────
  white:         '#FFFFFF',
  bgApp:         '#EEF2F8',   // --bg-app  (page background)
  neutralLight:  '#F2F5FB',   // --neutral-light

  // ── Borders ───────────────────────────────────────────────────────────────
  border:        '#E5E9EF',
  borderCard:    '#C8D3E8',   // --border-card  (card outer)
  borderInner:   '#D8DFF0',   // --border-inner (row dividers)

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary:   '#1E2128',
  textSecondary: '#4B5563',
  textMuted:     '#9CA3AF',
  textOnDark:    '#F9FAFB',

  // ── Tab / nav ─────────────────────────────────────────────────────────────
  tabActive:     '#4B5EAA',
  tabInactive:   '#9CA3AF',
  tabBar:        '#FFFFFF',
}

export const Typography = {
  // DM Serif Display — headings, hero text
  display: 'DMSerifDisplay_400Regular',
  // DM Sans — all body, labels, buttons
  body:         'DMSans_400Regular',
  bodyMedium:   'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold:     'DMSans_700Bold',
  bodyExtraBold:'DMSans_800ExtraBold',
}

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
  xxxl:40,
}

export const Radius = {
  sm:  6,
  md:  10,
  lg:  16,
  xl:  22,
  full: 9999,
}

export const Shadow = {
  sm: {
    shadowColor: '#4B5EAA',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#4B5EAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#4B5EAA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 9,
  },
}

// ── Status badge color map ─────────────────────────────────────────────────
// Mirrors tableColors.js STATUS_BORDER / STATUS_BG exactly
export const StatusColors = {
  active:    { bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },
  completed: { bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },
  paid:      { bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },
  present:   { bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },
  approved:  { bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },

  ongoing:   { bg: 'rgba(75,94,170,0.10)',  text: '#4B5EAA' },

  upcoming:  { bg: 'rgba(212,134,10,0.10)', text: '#D4860A' },
  pending:   { bg: 'rgba(212,134,10,0.10)', text: '#D4860A' },
  late:      { bg: 'rgba(212,134,10,0.10)', text: '#D4860A' },
  partial:   { bg: 'rgba(212,134,10,0.10)', text: '#D4860A' },

  inactive:  { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  cancelled: { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  rejected:  { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  unpaid:    { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  absent:    { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  failed:    { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  excused:   { bg: 'rgba(36,113,163,0.10)', text: '#2471A3' },

  contribution:{ bg: 'rgba(46,125,82,0.10)',  text: '#2E7D52' },
  expense:     { bg: 'rgba(192,57,43,0.10)',  text: '#C0392B' },
  income:      { bg: 'rgba(36,113,163,0.10)', text: '#2471A3' },
  fund:        { bg: 'rgba(212,134,10,0.10)', text: '#D4860A' },
  project:     { bg: 'rgba(75,94,170,0.10)',  text: '#4B5EAA' },
  event:       { bg: 'rgba(36,113,163,0.10)', text: '#2471A3' },
}

export default { Colors, Typography, Spacing, Radius, Shadow, StatusColors }
