// src/screens/AnnouncementsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Updates / Announcements — full-bleed plain-colour top section.
// Announcement list uses "Recent Transactions" row style from HomeScreen:
//   white card section with accent-bar header, icon + text + badge rows.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MOCK_ANNOUNCEMENTS, relativeTime } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { AnnouncementsIcon, StarIcon, Avatar } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All', 'Pinned', 'Regular']

// Sorted by most recent created_at first
const SORTED_ANNOUNCEMENTS = [...MOCK_ANNOUNCEMENTS].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
)

// ── Single row — mirrors txRow style from HomeScreen Recent Transactions ───────
const AnnRow = React.memo(function AnnRow({ item, isLast, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      style={[styles.annRow, isLast && styles.annRowLast]}
    >
      {/* Left icon bubble */}
      <View style={[
        styles.annIcon,
        { backgroundColor: item.is_pinned ? 'rgba(212,134,10,0.12)' : Colors.accentLight },
      ]}>
        {item.is_pinned
          ? <StarIcon size={16} color={Colors.warning} />
          : <AnnouncementsIcon color={Colors.accent} size={16} />
        }
      </View>

      {/* Text block */}
      <View style={styles.annBody}>
        <Text style={styles.annTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.annPreview} numberOfLines={2}>{item.content}</Text>
        <Text style={styles.annMeta}>{item.created_by} · {relativeTime(item.created_at)}</Text>
      </View>

      {/* Right: pinned badge */}
      {item.is_pinned && (
        <View style={styles.pinnedBadge}>
          <Text style={styles.pinnedBadgeText}>Pinned</Text>
        </View>
      )}
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

  // Filtered & sorted list — pinned floated first in "All"
  const listItems = useMemo(() => {
    if (filter === 'Pinned')  return SORTED_ANNOUNCEMENTS.filter(a =>  a.is_pinned)
    if (filter === 'Regular') return SORTED_ANNOUNCEMENTS.filter(a => !a.is_pinned)
    return [
      ...SORTED_ANNOUNCEMENTS.filter(a =>  a.is_pinned),
      ...SORTED_ANNOUNCEMENTS.filter(a => !a.is_pinned),
    ]
  }, [filter])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Full-bleed plain-colour hero ──────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <View style={styles.eyebrow}>
                <AnnouncementsIcon color={Colors.warning} size={13} />
                <Text style={[styles.eyebrowText, { color: Colors.warning }]}>ORGANIZATION</Text>
              </View>
              <Text style={styles.heroTitle}>Updates</Text>
              {/* Pills — no dots, white text for colored pills */}
              <View style={styles.pills}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{counts.all} Total</Text>
                </View>
                {counts.pinned > 0 && (
                  <View style={[styles.pill, { borderColor: Colors.warning + '55' }]}>
                    <Text style={[styles.pillText, styles.pillWhite]}>{counts.pinned} Pinned</Text>
                  </View>
                )}
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{counts.regular} Updates</Text>
                </View>
              </View>
            </View>
            <Avatar name={user?.full_name ?? ''} size={46} style={styles.avatar} />
          </View>
        </View>

        {/* ── Filter chip bar ───────────────────────────────────────── */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
                style={[styles.chip, filter === f && styles.chipActive]}>
                <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Announcements section card — Recent Transactions style ── */}
        {listItems.length > 0 ? (
          <View style={styles.sectionCard}>
            {/* Section header */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>Announcements</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{listItems.length}</Text>
              </View>
            </View>

            {/* Rows — same structure as Recent Transactions rows */}
            {listItems.map((item, i) => (
              <React.Fragment key={item.id}>
                <AnnRow
                  item={item}
                  isLast={i === listItems.length - 1}
                  onPress={() => navigation.navigate('AnnouncementDetail', { item })}
                />
                {i < listItems.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><AnnouncementsIcon color={Colors.textMuted} size={26} /></View>
            <Text style={styles.emptyTitle}>No announcements</Text>
            <Text style={styles.emptySub}>Check back later for updates</Text>
          </View>
        )}

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  // Full-bleed hero
  hero: { backgroundColor: Colors.primary, paddingBottom: Spacing.xl },
  heroRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
  },
  heroLeft: { flex: 1, marginRight: 12 },
  eyebrow:  { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  eyebrowText: { fontSize: 10, fontFamily: Typography.bodyBold, letterSpacing: 2 },
  heroTitle:   { fontSize: 32, fontFamily: Typography.display, color: '#fff', lineHeight: 36, marginBottom: 14 },
  pills:       { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText:  { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.8)' },
  pillWhite: { color: '#fff' },
  avatar:    { borderWidth: 2, borderColor: 'rgba(255,255,255,0.22)' },

  // Filter chips
  filterBar:      { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterScroll:   { paddingHorizontal: Spacing.xl, paddingVertical: 12, gap: 8 },
  chip:           { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:       { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },

  // Section card — white card matching AppLayout.Section + HomeScreen txRow style
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
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.warning, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:    { backgroundColor: 'rgba(212,134,10,0.10)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.warning },

  // Announcement row — mirrors txRow from HomeScreen exactly
  annRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  annRowLast: {}, // no special bottom style since card has overflow:hidden
  annIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  annBody:   { flex: 1, minWidth: 0 },
  annTitle:  { fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary, marginBottom: 3 },
  annPreview:{ fontSize: 12.5, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 18, marginBottom: 4 },
  annMeta:   { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted },

  // Pinned badge — right side
  pinnedBadge: {
    backgroundColor: 'rgba(212,134,10,0.12)', borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', flexShrink: 0,
  },
  pinnedBadgeText: { fontSize: 10.5, fontFamily: Typography.bodyBold, color: Colors.warning },

  // Row divider inside the card
  rowDivider: { marginHorizontal: Spacing.lg, height: 1, backgroundColor: Colors.borderInner },

  // Empty state
  empty:      { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
