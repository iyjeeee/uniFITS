// src/components/ScreenLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatibility shim — existing screens that import ScreenHero,
// FilterBar, SectionCard, ItemWrapper, EmptyBlock still work unchanged.
// New screens should import from AppLayout instead.
// ─────────────────────────────────────────────────────────────────────────────
export { CONTENT_PAD } from './AppLayout'

import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { Avatar } from './ui'

export const CONTENT_PAD_LEGACY = Spacing.xl

// ── ScreenHero ────────────────────────────────────────────────────────────────
export function ScreenHero({ eyebrowIcon, eyebrowText, eyebrowColor, title, pills, user }) {
  return (
    <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.hero}>
      <View style={styles.heroContent}>
        <View style={styles.heroLeft}>
          <View style={styles.eyeRow}>
            {eyebrowIcon}
            <Text style={[styles.eyeText, { color: eyebrowColor }]}>{eyebrowText}</Text>
          </View>
          <Text style={styles.heroTitle}>{title}</Text>
          <View style={styles.pillRow}>
            {pills.map((pill, i) => (
              <View key={i} style={[styles.pill, pill.color && { borderColor: pill.color + '55' }]}>
                {pill.dot && <View style={[styles.pillDot, { backgroundColor: pill.color || Colors.accent }]} />}
                {pill.icon}
                <Text style={[styles.pillText, pill.color && { color: pill.color }]}>{pill.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <Avatar name={user?.full_name ?? ''} size={46} style={styles.avatar} />
      </View>
    </LinearGradient>
  )
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
export function FilterBar({ filters, active, onSelect }) {
  return (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => onSelect(f)} activeOpacity={0.75}
            style={[styles.chip, active === f && styles.chipActive]}>
            <Text style={[styles.chipText, active === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

// ── SectionCard ───────────────────────────────────────────────────────────────
export function SectionCard({ title, count, children, style }) {
  return (
    <View style={[styles.sectionCard, style]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {count != null && (
          <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>{count}</Text></View>
        )}
      </View>
      {children}
    </View>
  )
}

// ── ItemWrapper ───────────────────────────────────────────────────────────────
export function ItemWrapper({ children, isLast, style }) {
  return (
    <View style={[styles.itemWrapper, isLast && styles.itemWrapperLast, style]}>
      {children}
    </View>
  )
}

// ── EmptyBlock ────────────────────────────────────────────────────────────────
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
  hero:         { paddingTop: Spacing.lg, paddingBottom: Spacing.xl, overflow: 'hidden' },
  heroContent:  { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: CONTENT_PAD_LEGACY, zIndex: 1 },
  heroLeft:     { flex: 1, marginRight: 12 },
  eyeRow:       { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  eyeText:      { fontSize: 10, fontFamily: Typography.bodyBold, letterSpacing: 2 },
  heroTitle:    { fontSize: 32, fontFamily: Typography.display, color: '#fff', marginBottom: 14, lineHeight: 36 },
  pillRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill:         { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillDot:      { width: 5, height: 5, borderRadius: 2.5 },
  pillText:     { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.75)' },
  avatar:       { borderWidth: 2, borderColor: 'rgba(255,255,255,0.22)' },
  filterBar:    { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterScroll: { paddingHorizontal: CONTENT_PAD_LEGACY, paddingVertical: 12, gap: 8 },
  chip:         { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:   { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:     { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive:{ color: '#fff' },
  sectionCard:  { marginHorizontal: CONTENT_PAD_LEGACY, marginTop: Spacing.lg, backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.borderCard, overflow: 'hidden', ...Shadow.sm },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent: { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:  { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:  { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },
  itemWrapper:   { marginHorizontal: CONTENT_PAD_LEGACY, backgroundColor: Colors.white, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: Colors.borderCard },
  itemWrapperLast:{ borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg },
  emptyBlock:    { alignItems: 'center', paddingVertical: 48, paddingHorizontal: CONTENT_PAD_LEGACY },
  emptyIcon:     { marginBottom: 14, opacity: 0.35 },
  emptyTitle:    { fontSize: 16, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
})
