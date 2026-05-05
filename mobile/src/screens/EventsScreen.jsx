// src/screens/EventsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All org events with status filter pills, funding bar, and date/time meta.
// Uses FlatList for performant rendering.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { MOCK_EVENTS, formatDate, fmt12 } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar, EmptyState, EventsIcon } from '../components/ui'

const FILTERS = ['All', 'Upcoming', 'Completed']

// ── Event card — memoised ─────────────────────────────────────────────────────
const EventCard = React.memo(function EventCard({ ev, onPress }) {
  const statusColor =
    ev.status === 'upcoming'  ? Colors.warning :
    ev.status === 'completed' ? Colors.success : Colors.accent

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.evCard, Shadow.sm]}
    >
      {/* Left colour stripe */}
      <View style={[styles.stripe, { backgroundColor: statusColor }]} />

      <View style={{ flex: 1, padding: Spacing.md }}>
        {/* Title + status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <Text style={styles.evTitle} numberOfLines={2}>{ev.title}</Text>
          <StatusBadge status={ev.status} style={{ marginLeft: 8, flexShrink: 0 }} />
        </View>

        {/* Date / time / location */}
        <View style={{ gap: 3, marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{formatDate(ev.event_date)} · {fmt12(ev.event_time)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={styles.metaDot} />
            <Text style={styles.metaText} numberOfLines={1}>{ev.location}</Text>
          </View>
        </View>

        <Text style={styles.evDesc} numberOfLines={2}>{ev.description}</Text>

        {ev.target_funding > 0 && (
          <ProgressBar
            current={ev.current_funding}
            target={ev.target_funding}
            showLabel
            style={{ marginTop: 10 }}
          />
        )}
      </View>
    </TouchableOpacity>
  )
})

export default function EventsScreen() {
  const navigation = useNavigation()
  const [filter, setFilter] = useState('All')

  // ── Filtered events — memoised ─────────────────────────────────────────────
  const events = useMemo(() =>
    filter === 'All'
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter(e => e.status.toLowerCase() === filter.toLowerCase()),
    [filter]
  )

  const renderItem = useCallback(({ item }) => (
    <EventCard
      ev={item}
      onPress={() => navigation.navigate('EventDetail', { item })}
    />
  ), [navigation])

  const keyExtractor = useCallback(item => item.id, [])

  // ── List header ────────────────────────────────────────────────────────────
  const ListHeader = useMemo(() => (
    <>
      <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <Text style={styles.headerSub}>
          {MOCK_EVENTS.length} total · {MOCK_EVENTS.filter(e => e.status === 'upcoming').length} upcoming
        </Text>
      </LinearGradient>

      <View style={styles.filterRow}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.lg }}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  ), [filter])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon={<EventsIcon />}
            title="No events found"
            subtitle={`No ${filter.toLowerCase()} events at the moment`}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bgApp }}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header:           { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  headerTitle:      { fontSize: 22, fontFamily: Typography.display, color: '#fff' },
  headerSub:        { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginTop: 2 },
  filterRow:        { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterPill:       { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  filterPillActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText:       { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  listContent:      { gap: 12, padding: Spacing.lg, paddingBottom: 32 },
  evCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  stripe:  { width: 5 },
  evTitle: { fontSize: 14.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accent, flexShrink: 0 },
  metaText:{ fontSize: 12, color: Colors.textMuted, fontFamily: Typography.body },
  evDesc:  { fontSize: 12.5, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 17 },
})
