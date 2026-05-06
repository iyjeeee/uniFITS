// src/components/ScreenLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// SHARED LAYOUT used by Projects, Events, and Updates screens.
//
// Structure:
//   <SafeAreaView>           ← bg = Colors.primary (dark) so status bar matches
//     <LinearGradient>       ← FULL BLEED hero, zero horizontal margin/padding
//       heroContent          ← caller renders: eyebrow, title, stat pills, avatar
//     </LinearGradient>
//     <filterBar?>           ← optional horizontal chip scroller (white strip)
//     <FlatList / content>   ← caller provides list or scroll content
//   </SafeAreaView>
//
// KEY RULE: the LinearGradient has NO paddingHorizontal — it goes wall-to-wall.
// All inner content uses CONTENT_PAD (20px) applied per-element, not on the
// container, so the dark background truly fills the full device width.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import {
  View, Text, StyleSheet, StatusBar,
  TouchableOpacity, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { Avatar, StarIcon } from './ui'

// Inner content horizontal padding — applied on elements, NOT on the gradient
export const CONTENT_PAD = Spacing.xl // 20px

// ── ScreenHero — full-bleed gradient header ───────────────────────────────────
// eyebrowIcon : React element (icon component)
// eyebrowText : string   e.g. 'ORGANIZATION'
// eyebrowColor: string   color of the eyebrow text/icon
// title       : string   large serif page title
// pills       : array of { label, value, color? } — stat pill items
// user        : auth user object  (for avatar)
export function ScreenHero({ eyebrowIcon, eyebrowText, eyebrowColor, title, pills, user }) {
  return (
    <LinearGradient
      colors={[Colors.primary, '#252C3D']}
      style={styles.hero}
    >
      {/* Decorative glow — positioned absolute, no layout impact */}
      <View style={styles.heroGlow} />

      {/* Content row: left column + avatar — padded here, not on gradient */}
      <View style={styles.heroContent}>
        <View style={styles.heroLeft}>
          {/* Eyebrow row: icon + label */}
          <View style={styles.eyeRow}>
            {eyebrowIcon}
            <Text style={[styles.eyeText, { color: eyebrowColor }]}>
              {eyebrowText}
            </Text>
          </View>

          {/* Page title */}
          <Text style={styles.heroTitle}>{title}</Text>

          {/* Stat pills row */}
          <View style={styles.pillRow}>
            {pills.map((pill, i) => (
              <View
                key={i}
                style={[
                  styles.pill,
                  pill.color && { borderColor: pill.color + '55' },
                ]}
              >
                {pill.dot && (
                  <View style={[styles.pillDot, { backgroundColor: pill.color || Colors.accent }]} />
                )}
                {pill.icon}
                <Text style={[styles.pillText, pill.color && { color: pill.color }]}>
                  {pill.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Avatar */}
        <Avatar
          name={user?.full_name ?? ''}
          size={46}
          style={styles.avatar}
        />
      </View>
    </LinearGradient>
  )
}

// ── FilterBar — horizontal scrolling chip row ─────────────────────────────────
export function FilterBar({ filters, active, onSelect }) {
  return (
    <View style={styles.filterBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => onSelect(f)}
            activeOpacity={0.75}
            style={[styles.chip, active === f && styles.chipActive]}
          >
            <Text style={[styles.chipText, active === f && styles.chipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

// ── SectionCard — white card with padded header row ───────────────────────────
// Matches HomeScreen's Recent Transactions section exactly:
//   4px accent bar | bold title | optional count badge | borderBottom
export function SectionCard({ title, count, children, style }) {
  return (
    <View style={[styles.sectionCard, style]}>
      {/* Header row */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {count != null && (
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{count}</Text>
          </View>
        )}
      </View>
      {/* Children render inside the card below the header */}
      {children}
    </View>
  )
}

// ── ItemWrapper — attaches item rows below a SectionCard header ───────────────
// Shares the card's left/right/bottom border. Last item gets rounded corners.
export function ItemWrapper({ children, isLast, style }) {
  return (
    <View style={[styles.itemWrapper, isLast && styles.itemWrapperLast, style]}>
      {children}
    </View>
  )
}

// ── EmptyBlock — centred empty state inside list content area ─────────────────
export function EmptyBlock({ icon, title, subtitle }) {
  return (
    <View style={styles.emptyBlock}>
      <View style={styles.emptyIcon}>{icon}</View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  // ── Hero — NO paddingHorizontal so gradient fills wall-to-wall ────────────
  hero: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(75,94,170,0.22)',
  },
  // Content inside hero — THIS is where horizontal padding lives
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: CONTENT_PAD, // only content is inset, not the background
    zIndex: 1,
  },
  heroLeft: { flex: 1, marginRight: 12 },
  eyeRow:   { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  eyeText:  { fontSize: 10, fontFamily: Typography.bodyBold, letterSpacing: 2 },
  heroTitle: {
    fontSize: 32, fontFamily: Typography.display,
    color: '#fff', marginBottom: 14, lineHeight: 36,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillDot:  { width: 5, height: 5, borderRadius: 2.5 },
  pillText: { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.75)' },
  avatar:   { borderWidth: 2, borderColor: 'rgba(255,255,255,0.22)' },

  // ── Filter chip bar ───────────────────────────────────────────────────────
  filterBar:    {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  filterScroll: { paddingHorizontal: CONTENT_PAD, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.neutralLight,
    borderWidth: 1, borderColor: Colors.borderCard,
  },
  chipActive:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:       { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },

  // ── Section card — header + content ──────────────────────────────────────
  sectionCard: {
    marginHorizontal: CONTENT_PAD,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full,
  },
  sectionBadgeText: { fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // ── Item wrapper ──────────────────────────────────────────────────────────
  itemWrapper: {
    marginHorizontal: CONTENT_PAD,
    backgroundColor: Colors.white,
    borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: Colors.borderCard,
  },
  itemWrapperLast: {
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyBlock: {
    alignItems: 'center', paddingVertical: 48,
    paddingHorizontal: CONTENT_PAD,
  },
  emptyIcon:     { marginBottom: 14, opacity: 0.35 },
  emptyTitle:    { fontSize: 16, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
})
