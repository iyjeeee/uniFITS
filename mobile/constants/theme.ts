// constants/theme.ts — Single source of truth for all visual design tokens
// Mobile equivalent of website's src/index.css CSS custom properties
// ALL components and screens must reference these — never hardcode hex/px values

import { Platform } from 'react-native';

// ── Colors ────────────────────────────────────────────────────────────────────
// Mirrors website CSS custom properties exactly
export const Colors = {
  // Brand / structural
  primary:       '#1E2128',            // --primary: tab bar bg, dark surfaces
  accent:        '#4B5EAA',            // --accent: buttons, active states, links
  accentLight:   'rgba(75,94,170,0.08)', // --accent-light: pressed/selected bg

  // Status colors
  success:       '#2E7D52',            // --success: active, completed, paid, present
  successLight:  'rgba(46,125,82,0.08)',
  danger:        '#C0392B',            // --danger: inactive, cancelled, rejected
  dangerLight:   'rgba(192,57,43,0.08)',
  warning:       '#D4860A',            // --warning: upcoming, pending, late
  warningLight:  'rgba(212,134,10,0.08)',
  info:          '#2471A3',            // --info: ongoing / informational
  infoLight:     'rgba(36,113,163,0.08)',

  // Neutral backgrounds
  white:         '#FFFFFF',            // --white: cards, inputs, modals
  bgApp:         '#EEF2F8',            // --bg-app: main screen background (blue-gray)
  neutralLight:  '#F2F5FB',           // --neutral-light: list pressed state
  subCard:       '#F7F9FC',           // flat nested row bg inside a Section panel (2026 refresh)

  // Borders (blue-tinted, weakest → strongest)
  border:        '#E5E9EF',            // --border: misc separators
  borderCard:    '#C8D3E8',            // --border-card: card outer border
  borderInner:   '#D8DFF0',            // --border-inner: section dividers, row separators
  borderTable:   '#B8C4DC',            // --border-table: section headers

  // Table / section headers
  tableHeadBg:   '#3D52A0',            // --table-head-bg: dark accent blue for headers
  tableHeadFg:   '#FFFFFF',            // --table-head-fg: white text on dark headers

  // Text
  textPrimary:   '#1E2128',            // --text-primary: main content
  textSecondary: '#4B5563',            // --text-secondary: labels, subtitles
  textMuted:     '#9CA3AF',            // --text-muted: timestamps, placeholders
  textOnDark:    '#F9FAFB',            // --text-on-dark: text on dark surfaces (tab bar)

  // Overlay (for modals/backdrops)
  overlay:       'rgba(15,18,30,0.55)',

  // Neutral (secondary buttons, neutral badges)
  neutral:       '#5A6474',            // --neutral: secondary button / neutral badge bg
  neutralBorder: '#4A5264',            // --neutral-border: secondary button / neutral badge border, pressed bg

  // Pressed / border shades (darker variant of each status color, used for
  // button pressed states and badge borders — keeps every color traceable to this file)
  accentPressed:  '#3A4D99',           // Button primary pressed bg
  successBorder:  '#256642',           // Badge success border / Button success pressed bg
  dangerBorder:   '#A93226',           // Badge danger border / Button danger pressed bg
  warningBorder:  '#B7770D',           // Badge warning border
  infoBorder:     '#1A5C87',           // Badge info border
} as const;

// ── Avatar Colors (deterministic by first char of name) ───────────────────────
export const AVATAR_COLORS = [
  '#4B5EAA', '#2E7D52', '#C0392B', '#D4860A',
  '#2471A3', '#7D3C98', '#117A65',
] as const;

// ── Typography ────────────────────────────────────────────────────────────────
// Font family strings matching loaded Google Fonts packages
export const Typography = {
  fontBody:         'DMSans_400Regular',
  fontBodyMedium:   'DMSans_500Medium',
  fontBodySemiBold: 'DMSans_600SemiBold',
  fontBodyBold:     'DMSans_700Bold',
  fontDisplay:      'DMSerifDisplay_400Regular', // Used for headings like website h1-h4
} as const;

// ── Font Sizes ────────────────────────────────────────────────────────────────
export const FontSize = {
  xs:   11,   // badge labels, fine print
  sm:   12,   // timestamps, hints, secondary labels
  base: 14,   // body text default
  md:   15,   // slightly larger body
  lg:   16,   // section titles
  xl:   18,   // screen section headers (h3 equivalent)
  xxl:  22,   // screen titles (h2 equivalent)
  xxxl: 28,   // hero values, large display (h1 equivalent)
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// ── Border Radius ─────────────────────────────────────────────────────────────
// Bumped softer/larger (2026 refresh) — this cascades to every card, button, badge, input in the app
export const Radius = {
  sm:   8,
  md:   14,
  lg:   18,
  xl:   22,    // hero cards, section panels
  full: 999,   // For pill badges and circular avatars
} as const;

// ── Shadows (platform-specific) ───────────────────────────────────────────────
// Blue-tinted shadows for brand cohesion, matching website --shadow-sm/md
export const Shadow = {
  sm: Platform.select({
    ios: {
      shadowColor:   '#4B5EAA',
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius:  3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor:   '#4B5EAA',
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius:  12,
    },
    android: { elevation: 5 },
    default: {},
  }),
} as const;

// ── Layout Constants ──────────────────────────────────────────────────────────
export const Layout = {
  TAB_BAR_HEIGHT:    60,   // Custom bottom tab bar height
  HEADER_HEIGHT:     56,   // Screen header height
  CARD_PADDING:      16,   // Inner card padding (all sides)
  SCREEN_PADDING_H:  16,   // Horizontal screen padding
  SCREEN_PADDING_V:  20,   // Vertical screen padding
  BORDER_WIDTH:      1.5,  // Standard border width (cards, inputs)
  STATUS_BAR_WIDTH:  4,    // Left status color strip width on list items
} as const;
