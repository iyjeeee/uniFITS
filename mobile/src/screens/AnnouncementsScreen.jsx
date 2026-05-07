// src/screens/AnnouncementsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Updates / Announcements — full-bleed plain-colour top section (no gradient,
// no circles, no side margin). Matches Home and Profile hero style exactly.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MOCK_ANNOUNCEMENTS, relativeTime, formatDate } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { AnnouncementsIcon, StarIcon, Avatar } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All', 'Pinned', 'Regular']

// ── Announcement card ─────────────────────────────────────────────────────────
const AnnCard = React.memo(function AnnCard({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.card, item.is_pinned && styles.cardPinned]}
    >
      {item.is_pinned && (
        <View style={styles.pinnedRow}>
          <StarIcon size={11} color={Colors.warning} />
          <Text style={styles.pinnedLabel}>PINNED</Text>
        </View>
      )}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardBody} numberOfLines={3}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <View style={[styles.footerDot, { backgroundColor: item.is_pinned ? Colors.warning : Colors.accent }]} />
        <Text style={styles.footerText}>{item.created_by}</Text>
        <Text style={styles.footerSep}>·</Text>
        <Text style={styles.footerText}>{relativeTime(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  )
})

export default function AnnouncementsScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  const counts = useMemo(() => ({
    all:     MOCK_ANNOUNCEMENTS.length,
    pinned:  MOCK_ANNOUNCEMENTS.filter(a =>  a.is_pinned).length,
    regular: MOCK_ANNOUNCEMENTS.filter(a => !a.is_pinned).length,
  }), [])

  const announcements = useMemo(() => {
    if (filter === 'Pinned')  return MOCK_ANNOUNCEMENTS.filter(a =>  a.is_pinned)
    if (filter === 'Regular') return MOCK_ANNOUNCEMENTS.filter(a => !a.is_pinned)
    // All: pinned first, then regular
    return [
      ...MOCK_ANNOUNCEMENTS.filter(a =>  a.is_pinned),
      ...MOCK_ANNOUNCEMENTS.filter(a => !a.is_pinned),
    ]
  }, [filter])

  // Section divider data injected into flat list
  const listData = useMemo(() => {
    if (filter !== 'All') return announcements.map(a => ({ ...a, _type: 'item' }))
    const pinned  = announcements.filter(a =>  a.is_pinned)
    const regular = announcements.filter(a => !a.is_pinned)
    const rows = []
    if (pinned.length)  rows.push({ _type: 'header', _id: 'h-pinned',  label: 'Pinned',  count: pinned.length  }, ...pinned.map(a => ({ ...a, _type: 'item' })))
    if (regular.length) rows.push({ _type: 'header', _id: 'h-regular', label: 'Recent',  count: regular.length }, ...regular.map(a => ({ ...a, _type: 'item' })))
    return rows
  }, [announcements, filter])

  const renderItem = useCallback(({ item }) => {
    if (item._type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{item.label}</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{item.count}</Text>
          </View>
        </View>
      )
    }
    return (
      <AnnCard
        item={item}
        onPress={() => navigation.navigate('AnnouncementDetail', { item })}
      />
    )
  }, [navigation])

  const keyExtractor = useCallback(item => item._id ?? item.id, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        style={styles.list}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Full-bleed plain-colour hero */}
            <View style={styles.hero}>
              <View style={styles.heroRow}>
                <View style={styles.heroLeft}>
                  <View style={styles.eyebrow}>
                    <AnnouncementsIcon color={Colors.warning} size={13} />
                    <Text style={[styles.eyebrowText, { color: Colors.warning }]}>ORGANIZATION</Text>
                  </View>
                  <Text style={styles.heroTitle}>Updates</Text>
                  <View style={styles.pills}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{counts.all} total</Text>
                    </View>
                    {counts.pinned > 0 && (
                      <View style={[styles.pill, { borderColor: Colors.warning + '55' }]}>
                        <StarIcon size={10} color={Colors.warning} />
                        <Text style={[styles.pillText, { color: Colors.warning }]}>{counts.pinned} pinned</Text>
                      </View>
                    )}
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{counts.regular} updates</Text>
                    </View>
                  </View>
                </View>
                <Avatar name={user?.full_name ?? ''} size={46} style={styles.avatar} />
              </View>
            </View>
            {/* Filter chips */}
            <View style={styles.filterBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTERS.map(f => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFilter(f)}
                    activeOpacity={0.75}
                    style={[styles.chip, filter === f && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><AnnouncementsIcon color={Colors.textMuted} size={26} /></View>
            <Text style={styles.emptyTitle}>No announcements</Text>
            <Text style={styles.emptySub}>Check back later for updates</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  list: { backgroundColor: Colors.bgApp },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 36, gap: 10 },

  // Full-bleed plain-colour hero
  hero: {
    backgroundColor: Colors.primary,
    marginHorizontal: -Spacing.lg,
    marginTop: -Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
  },
  heroLeft: { flex: 1, marginRight: 12 },
  eyebrow:  { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  eyebrowText: { fontSize: 10, fontFamily: Typography.bodyBold, letterSpacing: 2 },
  heroTitle:   { fontSize: 32, fontFamily: Typography.display, color: '#fff', lineHeight: 36, marginBottom: 14 },
  pills:    { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.8)' },
  avatar:   { borderWidth: 2, borderColor: 'rgba(255,255,255,0.22)' },

  // Filter chips
  filterBar: {
    backgroundColor: Colors.white,
    marginHorizontal: -Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  filterScroll:  { paddingHorizontal: Spacing.xl, paddingVertical: 12, gap: 8 },
  chip:          { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:      { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive:{ color: '#fff' },

  // Section divider header (Pinned / Recent)
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    ...Shadow.sm,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:    { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // Announcement card
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.lg, ...Shadow.sm,
  },
  cardPinned:  { backgroundColor: '#FFFEF8', borderLeftWidth: 3, borderLeftColor: Colors.warning },
  pinnedRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  pinnedLabel: { fontSize: 10, fontFamily: Typography.bodyBold, color: Colors.warning, letterSpacing: 1 },
  cardTitle:   { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary, marginBottom: 6, lineHeight: 21 },
  cardBody:    { fontSize: 13.5, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  cardFooter:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerDot:   { width: 6, height: 6, borderRadius: 3 },
  footerText:  { fontSize: 12, fontFamily: Typography.bodyMedium, color: Colors.textMuted },
  footerSep:   { fontSize: 12, color: Colors.textMuted },

  // Empty state
  empty:      { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
