// src/screens/EventsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Events list — full-bleed plain-colour top section (no gradient, no circles,
// no side margin). Matches the Home and Profile hero style exactly.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MOCK_EVENTS, formatDate, fmt12 } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar, EventsIcon, CalendarIcon, MapPinIcon, Avatar } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All', 'Upcoming', 'Completed']

const STRIPE = { upcoming: Colors.warning, completed: Colors.success }

// ── Event card ────────────────────────────────────────────────────────────────
const EventCard = React.memo(function EventCard({ item, onPress }) {
  const stripe = STRIPE[item.status] || Colors.accent
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={styles.card}>
      <View style={[styles.cardStripe, { backgroundColor: stripe }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <StatusBadge status={item.status} style={styles.badge} />
        </View>
        <View style={styles.metaBlock}>
          <View style={styles.metaRow}>
            <CalendarIcon color={stripe} size={13} />
            <Text style={styles.metaText}>{formatDate(item.event_date)} · {fmt12(item.event_time)}</Text>
          </View>
          <View style={styles.metaRow}>
            <MapPinIcon color={stripe} size={13} />
            <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        {item.target_funding > 0 && (
          <ProgressBar
            current={item.current_funding}
            target={item.target_funding}
            showLabel
            style={{ marginTop: 12 }}
          />
        )}
      </View>
    </TouchableOpacity>
  )
})

export default function EventsScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  const events = useMemo(() =>
    filter === 'All'
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter(e => e.status.toLowerCase() === filter.toLowerCase()),
    [filter]
  )

  const counts = useMemo(() => ({
    all:       MOCK_EVENTS.length,
    upcoming:  MOCK_EVENTS.filter(e => e.status === 'upcoming').length,
    completed: MOCK_EVENTS.filter(e => e.status === 'completed').length,
  }), [])

  const renderItem   = useCallback(({ item }) => (
    <EventCard item={item} onPress={() => navigation.navigate('EventDetail', { item })} />
  ), [navigation])

  const keyExtractor = useCallback(item => item.id, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        style={styles.list}
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Full-bleed plain-colour hero */}
            <View style={styles.hero}>
              <View style={styles.heroRow}>
                <View style={styles.heroLeft}>
                  <View style={styles.eyebrow}>
                    <EventsIcon color={Colors.info} size={13} />
                    <Text style={[styles.eyebrowText, { color: Colors.info }]}>ORGANIZATION</Text>
                  </View>
                  <Text style={styles.heroTitle}>Events</Text>
                  <View style={styles.pills}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{counts.all} total</Text>
                    </View>
                    <View style={[styles.pill, { borderColor: Colors.warning + '55' }]}>
                      <View style={[styles.pillDot, { backgroundColor: Colors.warning }]} />
                      <Text style={[styles.pillText, { color: Colors.warning }]}>{counts.upcoming} upcoming</Text>
                    </View>
                    <View style={[styles.pill, { borderColor: Colors.success + '55' }]}>
                      <Text style={[styles.pillText, { color: Colors.success }]}>{counts.completed} completed</Text>
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
            <View style={styles.emptyIcon}><EventsIcon color={Colors.textMuted} size={26} /></View>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySub}>No {filter.toLowerCase()} events at the moment</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  list: { backgroundColor: Colors.bgApp },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 36, gap: 12 },

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
  pillDot:  { width: 5, height: 5, borderRadius: 3 },
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

  // Event card
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    flexDirection: 'row', overflow: 'hidden', ...Shadow.sm,
  },
  cardStripe: { width: 5 },
  cardBody:   { flex: 1, padding: Spacing.lg },
  cardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitle:  { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary, flex: 1, lineHeight: 21 },
  badge:      { marginLeft: 8, flexShrink: 0 },
  metaBlock:  { gap: 5, marginBottom: 10 },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText:   { fontSize: 12.5, fontFamily: Typography.bodyMedium, color: Colors.textSecondary, flex: 1 },
  cardDesc:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, lineHeight: 18 },

  // Empty state
  empty:      { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
