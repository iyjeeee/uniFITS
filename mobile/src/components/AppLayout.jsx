// src/components/AppLayout.jsx
// ─────────────────────────────────────────────────────────────────────────────
// GENERAL LAYOUT — wraps every screen except LoginScreen.
//
// Provides two layout variants:
//   <AppLayout.Screen>   — tab root screens (Home, Projects, Events, Updates,
//                          Profile). Full-bleed solid-color SafeArea top.
//   <AppLayout.Detail>   — stack screens pushed via navigation (back arrow
//                          header + scrollable content area).
//
// All section cards (white card, accent bar, title) are exported as:
//   <AppLayout.Section>  — standard section block used across every screen.
//   <AppLayout.Row>      — single data row inside a Section.
//   <AppLayout.FilterBar>— horizontal chip scroller (filter tabs).
//   <AppLayout.Empty>    — centered empty-state inside a list.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  StatusBar, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
// back-arrow rendered as text '‹' — avoids circular import with ui.jsx

// ─────────────────────────────────────────────────────────────────────────────
// ScreenLayout — tab root screens: plain solid top, scrollable body
// Usage: wrap the whole screen; pass hero= for the header block and
//        children for the scrollable content below.
// ─────────────────────────────────────────────────────────────────────────────
function ScreenLayout({ hero, children, scrollRef, refreshControl, flatList }) {
  return (
    <SafeAreaView style={styles.screenSafe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {/* If the caller provides a FlatList variant, render hero + list */}
      {flatList
        ? <>{hero}{flatList}</>
        : (
          <ScrollView
            ref={scrollRef}
            style={styles.screenScroll}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
          >
            {hero}
            {children}
          </ScrollView>
        )
      }
    </SafeAreaView>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DetailLayout — stack screens: plain-color bar header + scrollable body
// ─────────────────────────────────────────────────────────────────────────────
function DetailLayout({ title, subtitle, onBack, right, children, style }) {
  return (
    <SafeAreaView style={styles.detailSafe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header bar — plain primary color, no gradient */}
      <View style={styles.detailHeader}>
        <View style={styles.detailHeaderInner}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              style={styles.backBtn}
            >
              <Text style={{ fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 }}>‹</Text>
            </TouchableOpacity>
          )}
          <View style={styles.detailTitles}>
            <Text style={styles.detailTitle} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.detailSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>
          {right ? <View style={styles.detailRight}>{right}</View> : null}
        </View>
      </View>

      {/* Scrollable body */}
      <ScrollView
        style={[styles.detailScroll, style]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section — white card with accent-bar header. THE one section format.
// Props:
//   title     : string — section heading
//   action    : string — optional right-side link text  (e.g. "See all")
//   onAction  : func   — handler for action tap
//   count     : number — optional count badge in header
//   style     : ViewStyle override
//   children  : row content (use Section.Row or custom rows)
// ─────────────────────────────────────────────────────────────────────────────
function Section({ title, action, onAction, count, children, style }) {
  return (
    <View style={[styles.sectionCard, style]}>
      {/* Header row */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {/* Optional count badge */}
        {count != null && (
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{count}</Text>
          </View>
        )}
        {/* Optional "See all" action link */}
        {action && !count && (
          <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
            <Text style={styles.sectionAction}>{action} →</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Row — generic data row inside a Section.
// Renders left icon tray + main content + optional right element.
// Replaces the ad-hoc row styles duplicated across screens.
// ─────────────────────────────────────────────────────────────────────────────
function Row({ iconBg, iconColor, icon, title, subtitle, right, onPress, last, style }) {
  const Container = onPress ? TouchableOpacity : View
  return (
    <Container
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.rowWrap, last && styles.rowLast, style]}
    >
      {/* Left icon tray */}
      {icon && (
        <View style={[styles.rowIcon, { backgroundColor: iconBg || Colors.neutralLight }]}>
          {React.cloneElement(icon, { color: iconColor || Colors.accent, size: 17 })}
        </View>
      )}
      {/* Text block */}
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {/* Right element (badge, amount, chevron, etc.) */}
      {right && <View style={styles.rowRight}>{right}</View>}
    </Container>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FilterBar — horizontal scrolling chip row below hero headers.
// ─────────────────────────────────────────────────────────────────────────────
function FilterBar({ filters, active, onSelect }) {
  const SV = ScrollView
  return (
    <View style={styles.filterBar}>
      <SV
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
            <Text style={[styles.chipText, active === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </SV>
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty — centered empty state for lists / sections.
// ─────────────────────────────────────────────────────────────────────────────
function Empty({ icon, title, subtitle }) {
  return (
    <View style={styles.emptyWrap}>
      {icon && (
        <View style={styles.emptyIcon}>
          {React.cloneElement(icon, { color: Colors.textMuted, size: 28 })}
        </View>
      )}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Compose API — attach sub-components as static properties
// ─────────────────────────────────────────────────────────────────────────────
const AppLayout = {
  Screen:    ScreenLayout,
  Detail:    DetailLayout,
  Section,
  Row,
  FilterBar,
  Empty,
}

export default AppLayout

// ─────────────────────────────────────────────────────────────────────────────
// Shared horizontal content padding — used by all screens
// ─────────────────────────────────────────────────────────────────────────────
export const CONTENT_PAD = Spacing.xl // 20px

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── ScreenLayout ────────────────────────────────────────────────────────────
  screenSafe:   { flex: 1, backgroundColor: Colors.primary }, // solid — no glow circles
  screenScroll: { backgroundColor: Colors.bgApp },

  // ── DetailLayout ────────────────────────────────────────────────────────────
  detailSafe:   { flex: 1, backgroundColor: Colors.primary },
  detailHeader: { backgroundColor: Colors.primary }, // plain solid color
  detailHeaderInner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  detailTitles: { flex: 1, minWidth: 0 },
  detailTitle:  { fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff', lineHeight: 22 },
  detailSubtitle: { fontSize: 12, fontFamily: Typography.body, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  detailRight:  { flexShrink: 0 },
  detailScroll: { backgroundColor: Colors.bgApp },

  // ── Section card (THE unified section format) ────────────────────────────────
  sectionCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionAction:   { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.accent },
  sectionBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full,
  },
  sectionBadgeText: { fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // ── Row ─────────────────────────────────────────────────────────────────────
  rowWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    backgroundColor: Colors.white,
  },
  rowLast:  { borderBottomWidth: 0 },
  rowIcon:  { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowBody:  { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary },
  rowSub:   { fontSize: 12, fontFamily: Typography.body, color: Colors.textMuted, marginTop: 2 },
  rowRight: { flexShrink: 0, alignItems: 'flex-end', gap: 4 },

  // ── FilterBar ────────────────────────────────────────────────────────────────
  filterBar:    { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
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

  // ── Empty state ─────────────────────────────────────────────────────────────
  emptyWrap:  { alignItems: 'center', paddingVertical: 48, paddingHorizontal: CONTENT_PAD },
  emptyIcon:  {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.neutralLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5, textAlign: 'center' },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },
})
