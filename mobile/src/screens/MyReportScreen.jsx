// src/screens/MyReportScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Personal summary report: contributions + attendance breakdown.
// Layout: plain-color header + all sections using unified Section card format.
// FlatList for performant rendering of the full report.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useCallback } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  MOCK_TRANSACTIONS, MOCK_ATTENDANCES,
  formatDate, formatCurrency,
} from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, Avatar } from '../components/ui'

// ── KPI box — used in the 2×2 stat grids ──────────────────────────────────────
const KpiBox = React.memo(function KpiBox({ label, value, color }) {
  return (
    <View style={[styles.kpiBox, Shadow.sm]}>
      <View style={{ width: 28, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 8 }} />
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  )
})

// ── Attendance log row ─────────────────────────────────────────────────────────
const AttLogRow = React.memo(function AttLogRow({ att, isLast }) {
  const dotColor =
    att.status === 'present' ? Colors.success :
    att.status === 'late'    ? Colors.warning :
    att.status === 'absent'  ? Colors.danger  : Colors.info
  return (
    <View style={[styles.attRow, isLast && styles.attRowLast]}>
      <View style={[styles.attDot, { backgroundColor: dotColor }]} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.attName} numberOfLines={1}>{att.activity}</Text>
        <Text style={styles.attMeta}>{att.activity_type} · {formatDate(att.attendance_date)}</Text>
        {att.remarks && <Text style={styles.attRemark}>{att.remarks}</Text>}
      </View>
      <StatusBadge status={att.status} />
    </View>
  )
})

// ── Breakdown row — category/fund amount row ───────────────────────────────────
function BreakdownRow({ label, amount, isLast }) {
  return (
    <View style={[styles.bdRow, isLast && styles.bdRowLast]}>
      <StatusBadge status={label} />
      <Text style={styles.bdAmt}>{formatCurrency(amount)}</Text>
    </View>
  )
}

export default function MyReportScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()

  const { myTx, myAtt, txStats, attStats, byCategory, byFund } = useMemo(() => {
    const myTx  = MOCK_TRANSACTIONS.filter(t => t.user_id === user.id)
    const myAtt = MOCK_ATTENDANCES.filter(a => a.user_id === user.id)
    const totalContrib = myTx.filter(t => t.entry_type !== 'expense').reduce((s,t) => s + t.amount, 0)
    const completedTx  = myTx.filter(t => t.status === 'completed').length
    const pendingTx    = myTx.filter(t => t.status === 'pending').length
    const attPresent   = myAtt.filter(a => a.status === 'present').length
    const attLate      = myAtt.filter(a => a.status === 'late').length
    const attAbsent    = myAtt.filter(a => a.status === 'absent').length
    const attTotal     = myAtt.length
    const attRate      = attTotal ? Math.round(((attPresent + attLate) / attTotal) * 100) : 0
    const byCategory   = myTx.reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})
    const byFund       = myTx.reduce((acc, t) => ({ ...acc, [t.fund]: (acc[t.fund] || 0) + t.amount }), {})
    return {
      myTx, myAtt,
      txStats:  { totalContrib, completedTx, pendingTx, total: myTx.length },
      attStats: { attPresent, attLate, attAbsent, attTotal, attRate },
      byCategory, byFund,
    }
  }, [user.id])

  // Build flat list data: type-tagged rows for each section
  const listData = useMemo(() => {
    const rows = [
      { type: 'identity',     id: 'identity' },
      { type: 'secHeader',    id: 'sh-contrib', label: 'Contribution Summary' },
      { type: 'txKpis',       id: 'tx-kpis' },
    ]
    const catEntries = Object.entries(byCategory)
    if (catEntries.length) {
      rows.push({ type: 'secHeader', id: 'sh-cat', label: 'By Category' })
      rows.push({ type: 'breakdown', id: 'bd-cat', entries: catEntries })
    }
    const fundEntries = Object.entries(byFund)
    if (fundEntries.length) {
      rows.push({ type: 'secHeader', id: 'sh-fund', label: 'By Fund' })
      rows.push({ type: 'breakdown', id: 'bd-fund', entries: fundEntries })
    }
    rows.push({ type: 'secHeader', id: 'sh-att', label: 'Attendance Summary' })
    rows.push({ type: 'attKpis',   id: 'att-kpis' })
    if (myAtt.length) {
      rows.push({ type: 'secHeader', id: 'sh-attlog', label: 'Activity Breakdown' })
      // Wrap all att rows in one block-type for cleaner card rendering
      rows.push({ type: 'attLog', id: 'att-log', items: myAtt })
    }
    rows.push({ type: 'footer', id: 'footer' })
    return rows
  }, [myTx, myAtt, byCategory, byFund])

  const renderItem = useCallback(({ item }) => {
    switch (item.type) {

      // ── Member identity card ─────────────────────────────────────────────
      case 'identity':
        return (
          <View style={styles.identCard}>
            <View style={styles.identLeft}>
              <Avatar name={user.full_name} size={52} style={styles.identAvatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.identName}>{user.full_name}</Text>
              <Text style={styles.identMeta}>{user.role} · {user.department}</Text>
              <Text style={styles.identMeta}>{user.employee_number}</Text>
              <View style={{ marginTop: 6 }}><StatusBadge status={user.status} /></View>
            </View>
          </View>
        )

      // ── Section header label ─────────────────────────────────────────────
      case 'secHeader':
        return <Text style={styles.secHeader}>{item.label}</Text>

      // ── Contribution KPI grid ────────────────────────────────────────────
      case 'txKpis':
        return (
          <View style={styles.kpiGrid}>
            <KpiBox label="Total Contributed" value={formatCurrency(txStats.totalContrib)} color={Colors.success} />
            <KpiBox label="Completed"         value={String(txStats.completedTx)}          color={Colors.accent}  />
            <KpiBox label="Pending"           value={String(txStats.pendingTx)}            color={Colors.warning} />
            <KpiBox label="Transactions"      value={String(txStats.total)}                color={Colors.info}    />
          </View>
        )

      // ── Attendance KPI grid ──────────────────────────────────────────────
      case 'attKpis':
        return (
          <View style={styles.kpiGrid}>
            <KpiBox label="Present"  value={String(attStats.attPresent)} color={Colors.success} />
            <KpiBox label="Late"     value={String(attStats.attLate)}    color={Colors.warning} />
            <KpiBox label="Absent"   value={String(attStats.attAbsent)}  color={Colors.danger}  />
            <KpiBox label="Rate"     value={`${attStats.attRate}%`}      color={Colors.info}    />
          </View>
        )

      // ── Category / fund breakdown — unified Section card ─────────────────
      case 'breakdown':
        return (
          <View style={styles.sectionCard}>
            {item.entries.map(([key, amt], i) => (
              <BreakdownRow key={key} label={key} amount={amt} isLast={i === item.entries.length - 1} />
            ))}
          </View>
        )

      // ── Attendance log — unified Section card ────────────────────────────
      case 'attLog':
        return (
          <View style={styles.sectionCard}>
            {item.items.map((att, i) => (
              <AttLogRow key={att.id} att={att} isLast={i === item.items.length - 1} />
            ))}
          </View>
        )

      case 'footer':
        return <View style={{ height: 40 }} />

      default: return null
    }
  }, [user, txStats, attStats])

  const keyExtractor = useCallback(item => item.id, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {/* Plain-color detail header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Report</Text>
          <Text style={styles.headerSub}>Personal contribution & attendance summary</Text>
        </View>
      </View>

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={8}
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

  // Identity card — shows user info at top of report
  identCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.lg, ...Shadow.sm,
  },
  identLeft:   { flexShrink: 0 },
  identAvatar: { borderWidth: 2.5, borderColor: Colors.borderCard },
  identName:   { fontSize: 17, fontFamily: Typography.display, color: Colors.textPrimary, lineHeight: 22 },
  identMeta:   { fontSize: 12, color: Colors.textSecondary, fontFamily: Typography.body, marginTop: 2 },

  // Section header label
  secHeader: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 20, paddingBottom: 8,
  },

  // KPI 2×2 grid
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, gap: 10, marginBottom: 4,
  },
  kpiBox: {
    flex: 1, minWidth: '44%',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.md,
  },
  kpiValue: { fontSize: 22, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, lineHeight: 26 },
  kpiLabel: { fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginTop: 3 },

  // Unified section card (breakdown + attLog rows live inside)
  sectionCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },

  // Breakdown row — category/fund
  bdRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  bdRowLast: { borderBottomWidth: 0 },
  bdAmt:     { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },

  // Attendance log row
  attRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    gap: 10,
  },
  attRowLast: { borderBottomWidth: 0 },
  attDot:     { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  attName:    { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  attMeta:    { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body, marginTop: 1, textTransform: 'capitalize' },
  attRemark:  { fontSize: 11.5, color: Colors.textSecondary, fontFamily: Typography.bodyMedium, fontStyle: 'italic', marginTop: 2 },
})
