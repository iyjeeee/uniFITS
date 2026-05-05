// src/screens/MyAttendanceScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shows ONLY the logged-in member's own attendance records.
// Uses FlatList for performant rendering.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { MOCK_ATTENDANCES, formatDate } from '../api/mockData'
import { Colors, Typography, Spacing, Radius } from '../constants/theme'
import { PageHeader, StatusBadge, EmptyState, AttendanceIcon } from '../components/ui'

const FILTERS = ['All', 'Present', 'Late', 'Absent', 'Excused']

// ── Attendance row — memoised ─────────────────────────────────────────────────
const AttRow = React.memo(function AttRow({ att, isLast }) {
  const dotColor =
    att.status === 'present' ? Colors.success :
    att.status === 'late'    ? Colors.warning :
    att.status === 'absent'  ? Colors.danger  :
    att.status === 'excused' ? Colors.info    : Colors.textMuted

  return (
    <View style={[styles.attRow, isLast && { borderBottomWidth: 0 }]}>
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

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, color }) {
  return (
    <View style={[styles.statChip, { borderColor: color + '40', backgroundColor: color + '12' }]}>
      <Text style={{ fontSize: 18, fontFamily: Typography.bodyExtraBold, color, lineHeight: 22 }}>{value}</Text>
      <Text style={{ fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted }}>{label}</Text>
    </View>
  )
}

export default function MyAttendanceScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  // ── Member-scoped + filtered data — memoised ──────────────────────────────
  const all = useMemo(() =>
    MOCK_ATTENDANCES.filter(a => a.user_id === user.id),
    [user.id]
  )
  const shown = useMemo(() =>
    filter === 'All' ? all : all.filter(a => a.status.toLowerCase() === filter.toLowerCase()),
    [all, filter]
  )

  // Stats
  const stats = useMemo(() => {
    const present = all.filter(a => a.status === 'present').length
    const late    = all.filter(a => a.status === 'late').length
    const absent  = all.filter(a => a.status === 'absent').length
    const excused = all.filter(a => a.status === 'excused').length
    const total   = all.length
    const rate    = total ? Math.round(((present + late) / total) * 100) : 0
    return { present, late, absent, excused, total, rate }
  }, [all])

  const renderItem = useCallback(({ item, index }) => (
    <AttRow att={item} isLast={index === shown.length - 1} />
  ), [shown.length])

  const keyExtractor = useCallback(item => item.id, [])

  // ── List header ────────────────────────────────────────────────────────────
  const ListHeader = useMemo(() => (
    <>
      {/* Summary hero */}
      <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.hero}>
        <Text style={styles.heroRate}>{stats.rate}%</Text>
        <Text style={styles.heroRateLabel}>Attendance Rate</Text>
        <View style={styles.statRow}>
          <StatChip label="Present" value={stats.present} color={Colors.success} />
          <StatChip label="Late"    value={stats.late}    color={Colors.warning} />
          <StatChip label="Absent"  value={stats.absent}  color={Colors.danger}  />
          <StatChip label="Excused" value={stats.excused} color={Colors.info}    />
        </View>
      </LinearGradient>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.lg, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
              style={[styles.pill, filter === f && styles.pillActive]}>
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card top cap */}
      {shown.length > 0 && (
        <View style={styles.cardTopCap} />
      )}
    </>
  ), [stats, filter, shown.length])

  const ListFooter = useMemo(() => (
    <>
      {shown.length > 0 && <View style={styles.cardBottomCap} />}
      <View style={{ height: 32 }} />
    </>
  ), [shown.length])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader
        title="My Attendance"
        subtitle="Your activity attendance records"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={shown}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={{ padding: Spacing.lg }}>
            <EmptyState
              icon={<AttendanceIcon />}
              title="No records found"
              subtitle={filter === 'All' ? 'No attendance records yet' : `No ${filter.toLowerCase()} records`}
            />
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{ marginHorizontal: Spacing.lg, height: 1, backgroundColor: Colors.borderInner }} />
        )}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bgApp }}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        initialNumToRender={10}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  heroRate:       { fontSize: 52, fontFamily: Typography.bodyExtraBold, color: '#fff', lineHeight: 58 },
  heroRateLabel:  { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.bodyMedium, marginBottom: 20 },
  statRow:        { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  statChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: Radius.md, borderWidth: 1.5,
    alignItems: 'center', minWidth: 70,
  },
  filterRow: { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  pill:          { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  pillActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  pillText:      { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  pillTextActive:{ color: '#fff' },
  cardTopCap: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.borderCard,
    height: Radius.lg,
  },
  cardBottomCap: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg,
    borderWidth: 1, borderTopWidth: 0, borderColor: Colors.borderCard,
    height: Radius.lg,
  },
  attRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: Spacing.lg, paddingVertical: 13,
    gap: 12,
    backgroundColor: Colors.white,
  },
  indicator:   { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  attActivity: { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  attType:     { fontSize: 11, fontFamily: Typography.bodySemiBold, color: Colors.accent, textTransform: 'capitalize' },
  attDate:     { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted },
  attRemarks:  { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: Colors.textSecondary, marginTop: 3, fontStyle: 'italic' },
})
