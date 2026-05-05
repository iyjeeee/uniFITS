// src/screens/AnnouncementsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Org-wide announcements split into Pinned and Regular sections.
// Uses FlatList with SectionList-style grouping via ListHeaderComponent +
// section data to keep rendering performant.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { MOCK_ANNOUNCEMENTS, relativeTime } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { EmptyState, AnnouncementsIcon, StarIcon } from '../components/ui'

// ── Announcement card — memoised ──────────────────────────────────────────────
const AnnCard = React.memo(function AnnCard({ ann, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.annCard, ann.is_pinned && styles.annCardPinned, Shadow.sm]}
    >
      {ann.is_pinned && (
        <View style={styles.pinnedRow}>
          <StarIcon size={11} color={Colors.warning} />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}
      <Text style={styles.annTitle} numberOfLines={2}>{ann.title}</Text>
      <Text style={styles.annBody} numberOfLines={3}>{ann.content}</Text>
      <View style={styles.annFooter}>
        <View style={[styles.authorDot, { backgroundColor: Colors.accent }]} />
        <Text style={styles.annMeta}>{ann.created_by}</Text>
        <Text style={styles.annDot}>·</Text>
        <Text style={styles.annMeta}>{relativeTime(ann.created_at)}</Text>
      </View>
    </TouchableOpacity>
  )
})

// ── Section label component ───────────────────────────────────────────────────
function SectionLabel({ label }) {
  return <Text style={styles.groupLabel}>{label}</Text>
}

export default function AnnouncementsScreen() {
  const navigation = useNavigation()

  // ── Build flat data array with section headers embedded ────────────────────
  const listData = useMemo(() => {
    const pinned  = MOCK_ANNOUNCEMENTS.filter(a =>  a.is_pinned)
    const regular = MOCK_ANNOUNCEMENTS.filter(a => !a.is_pinned)
    const rows = []
    if (pinned.length)  { rows.push({ type: 'header', label: '📌 Pinned',  id: 'h-pinned'  }); rows.push(...pinned.map(a  => ({ type: 'item', ...a }))) }
    if (regular.length) { rows.push({ type: 'header', label: 'Recent',     id: 'h-recent'  }); rows.push(...regular.map(a => ({ type: 'item', ...a }))) }
    return rows
  }, [])

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'header') return <SectionLabel label={item.label} />
    return (
      <AnnCard
        ann={item}
        onPress={() => navigation.navigate('AnnouncementDetail', { item })}
      />
    )
  }, [navigation])

  const keyExtractor = useCallback(item => item.id, [])

  const ListHeader = useMemo(() => (
    <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.header}>
      <Text style={styles.headerTitle}>Announcements</Text>
      <Text style={styles.headerSub}>
        {MOCK_ANNOUNCEMENTS.length} total · {MOCK_ANNOUNCEMENTS.filter(a => a.is_pinned).length} pinned
      </Text>
    </LinearGradient>
  ), [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon={<AnnouncementsIcon />}
            title="No announcements yet"
            subtitle="Check back later for updates from the organization"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bgApp }}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header:      { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  headerTitle: { fontSize: 22, fontFamily: Typography.display, color: '#fff' },
  headerSub:   { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginTop: 2 },
  listContent: { paddingBottom: 32 },
  groupLabel: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 18, paddingBottom: 8,
  },
  annCard: {
    marginHorizontal: Spacing.lg, marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.md,
  },
  annCardPinned: {
    borderColor: Colors.warning + '50',
    backgroundColor: Colors.warningLight + 'CC',
  },
  pinnedRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  pinnedText: { fontSize: 10.5, fontFamily: Typography.bodyBold, color: Colors.warning, textTransform: 'uppercase', letterSpacing: 0.3 },
  annTitle:   { fontSize: 14, fontFamily: Typography.bodyBold, color: Colors.textPrimary, marginBottom: 5, lineHeight: 19 },
  annBody:    { fontSize: 12.5, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  annFooter:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  authorDot:  { width: 6, height: 6, borderRadius: 3 },
  annMeta:    { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted },
  annDot:     { fontSize: 11.5, color: Colors.textMuted },
})
