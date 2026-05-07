// src/screens/MyAttendanceScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Member's personal attendance records.
// Layout: plain-color detail header + stats strip + filter bar +
//         unified Section card containing attendance rows.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { MOCK_ATTENDANCES, formatDate } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, AttendanceIcon } from '../components/ui'

const FILTERS = ['All', 'Present', 'Late', 'Absent', 'Excused']

// Status → dot color
const DOT_COLOR = {
  present: Colors.success,
  late:    Colors.warning,
  absent:  Colors.danger,
  excused: Colors.info,
}

// ── Attendance row — memoised ─────────────────────────────────────────────────
const AttRow = React.memo(function AttRow({ att, isLast }) {
  const dotColor = DOT_COLOR[att.status] || Colors.textMuted
  return (
    <View style={[styles.attRow, isLast && styles.attRowLast]}>
      <View style={[styles.indicator, { backgroundColor: dotColor }]} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.attActivity} numberOfLines={1}>{att.activity}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={styles.attType}>{att.activity_type}</Text>
          <Text style={{ fontSize: 10, color: Colors.textMuted }}>·</Text>
          <Text style={styles.attDate}>{formatDate(att.attendance_date)}</Text>
        </View>
        {att.remarks ? <Text style={styles.attRemarks}>{att.remarks}</Text> : null}
      </View>
      <StatusBadge status={att.status} />
    </View>
  )
})

export default function MyAttendanceScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  const all = useMemo(() =>
    MOCK_ATTENDANCES.filter(a => a.user_id === user.id),
    [user.id]
  )
  const shown = useMemo(() =>
    filter === 'All' ? all : all.filter(a => a.status.toLowerCase() === filter.toLowerCase()),
    [all, filter]
  )

  const stats = useMemo(() => {
    const present = all.filter(a => a.status === 'present').length
    const late    = all.filter(a => a.status === 'late').length
    const absent  = all.filter(a => a.status === 'absent').length
    const excused = all.filter(a => a.status === 'excused').length
    const total   = all.length
    const rate    = total ? Math.round(((present + late) / total) * 100) : 0
    return { present, late, absent, excused, total, rate }
  }, [all])

  const renderItem   = useCallback(({ item, index }) => (
    <AttRow att={item} isLast={index === shown.length - 1} />
  ), [shown.length])
  const keyExtractor = useCallback(item => item.id, [])

  const ListHeader = useMemo(() => (
    <>
      {/* Stats strip — 5 cells */}
      <View style={styles.statsStrip}>
        <View style={styles.statCell}>
          <Text style={[styles.statVal, { color: Colors.textPrimary }]}>{stats.rate}%</Text>
          <Text style={styles.statLbl}>Rate</Text>
          <View style={[styles.statBar, { backgroundColor: Colors.info }]} />
        </View>
        <View style={styles.statSep} />
        <View style={styles.statCell}>
          <Text style={[styles.statVal, { color: Colors.success }]}>{stats.present}</Text>
          <Text style={styles.statLbl}>Present</Text>
          <View style={[styles.statBar, { backgroundColor: Colors.success }]} />
        </View>
        <View style={styles.statSep} />
        <View style={styles.statCell}>
          <Text style={[styles.statVal, { color: Colors.warning }]}>{stats.late}</Text>
          <Text style={styles.statLbl}>Late</Text>
          <View style={[styles.statBar, { backgroundColor: Colors.warning }]} />
        </View>
        <View style={styles.statSep} />
        <View style={styles.statCell}>
          <Text style={[styles.statVal, { color: Colors.danger }]}>{stats.absent}</Text>
          <Text style={styles.statLbl}>Absent</Text>
          <View style={[styles.statBar, { backgroundColor: Colors.danger }]} />
        </View>
        <View style={styles.statSep} />
        <View style={styles.statCell}>
          <Text style={[styles.statVal, { color: Colors.info }]}>{stats.excused}</Text>
          <Text style={styles.statLbl}>Excused</Text>
          <View style={[styles.statBar, { backgroundColor: Colors.info }]} />
        </View>
      </View>

      {/* Filter chips */}
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

      {/* Section card header */}
      {shown.length > 0 && (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Attendance Records</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{shown.length}</Text>
          </View>
        </View>
      )}
    </>
  ), [stats, filter, shown.length])

  const ListFooter = useMemo(() => <View style={{ height: 32 }} />, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {/* Plain-color detail header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Attendance</Text>
          <Text style={styles.headerSub}>Your activity attendance records</Text>
        </View>
      </View>

      <FlatList
        data={shown}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}><AttendanceIcon color={Colors.textMuted} size={24} /></View>
            <Text style={styles.emptyTitle}>No records found</Text>
            <Text style={styles.emptySub}>{filter === 'All' ? 'No attendance records yet' : `No ${filter.toLowerCase()} records`}</Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: Spacing.lg, height: 1, backgroundColor: Colors.borderInner }} />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        initialNumToRender={10}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.primary },
  list:  { backgroundColor: Colors.bgApp },

  // Plain-color header
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow:   { fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 },
  headerTitle: { fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff' },
  headerSub:   { fontSize: 12, fontFamily: Typography.body, color: 'rgba(255,255,255,0.5)', marginTop: 1 },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner, ...Shadow.sm,
  },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 2 },
  statVal:  { fontSize: 16, fontFamily: Typography.bodyExtraBold, lineHeight: 20, textAlign: 'center' },
  statLbl:  { fontSize: 9.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginTop: 3, textAlign: 'center' },
  statBar:  { width: 16, height: 2.5, borderRadius: 2, marginTop: 4 },
  statSep:  { width: 1, backgroundColor: Colors.borderInner, marginVertical: 10 },

  // Filter bar
  filterBar:     { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterScroll:  { paddingHorizontal: Spacing.lg, gap: 8 },
  chip:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:      { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive:{ color: '#fff' },

  // Section card header — unified format
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: 1, borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    borderColor: Colors.borderCard,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    ...Shadow.sm,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:    { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // Attendance row — inside section card
  attRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: Spacing.lg, paddingVertical: 13,
    gap: 12, backgroundColor: Colors.white,
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.borderCard,
  },
  attRowLast: { borderBottomWidth: 1, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg },
  indicator:   { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  attActivity: { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  attType:     { fontSize: 11, fontFamily: Typography.bodySemiBold, color: Colors.accent, textTransform: 'capitalize' },
  attDate:     { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted },
  attRemarks:  { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: Colors.textSecondary, marginTop: 3, fontStyle: 'italic' },

  // Empty state
  emptyWrap:  { alignItems: 'center', padding: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
