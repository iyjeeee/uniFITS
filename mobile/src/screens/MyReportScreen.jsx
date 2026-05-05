// src/screens/MyReportScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Personal summary report: contributions + attendance breakdown.
// Uses FlatList for the attendance log section; rest is static summary.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo, useCallback } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  MOCK_TRANSACTIONS, MOCK_ATTENDANCES,
  formatDate, formatCurrency,
} from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import {
  PageHeader, StatusBadge, Avatar, Card,
  MoneyIcon, AttendanceIcon,
} from '../components/ui'

// ── KPI box — memoised ────────────────────────────────────────────────────────
const KpiBox = React.memo(function KpiBox({ label, value, color }) {
  return (
    <View style={[styles.kpiBox, Shadow.sm]}>
      <View style={{ width: 32, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 8 }} />
      <Text style={{ fontSize: 22, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, lineHeight: 26 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginTop: 3 }}>
        {label}
      </Text>
    </View>
  )
})

// ── Attendance row in the log section ─────────────────────────────────────────
const AttLogRow = React.memo(function AttLogRow({ att, isLast }) {
  const dotColor =
    att.status === 'present' ? Colors.success :
    att.status === 'late'    ? Colors.warning :
    att.status === 'absent'  ? Colors.danger  : Colors.info
  return (
    <View style={[styles.attRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.attName} numberOfLines={1}>{att.activity}</Text>
        <Text style={styles.attMeta}>{att.activity_type} · {formatDate(att.attendance_date)}</Text>
        {att.remarks && <Text style={styles.attRemark}>{att.remarks}</Text>}
      </View>
      <StatusBadge status={att.status} />
    </View>
  )
})

export default function MyReportScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()

  // ── Compute all stats — memoised ──────────────────────────────────────────
  const { myTx, myAtt, txStats, attStats, byCategory, byFund } = useMemo(() => {
    const myTx  = MOCK_TRANSACTIONS.filter(t => t.user_id === user.id)
    const myAtt = MOCK_ATTENDANCES.filter(a => a.user_id === user.id)

    const totalContrib  = myTx.filter(t => t.entry_type !== 'expense').reduce((s,t) => s + t.amount, 0)
    const completedTx   = myTx.filter(t => t.status === 'completed').length
    const pendingTx     = myTx.filter(t => t.status === 'pending').length

    const attPresent = myAtt.filter(a => a.status === 'present').length
    const attLate    = myAtt.filter(a => a.status === 'late').length
    const attAbsent  = myAtt.filter(a => a.status === 'absent').length
    const attTotal   = myAtt.length
    const attRate    = attTotal ? Math.round(((attPresent + attLate) / attTotal) * 100) : 0

    const byCategory = myTx.reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] || 0) + t.amount }), {})
    const byFund     = myTx.reduce((acc, t) => ({ ...acc, [t.fund]:     (acc[t.fund]     || 0) + t.amount }), {})

    return {
      myTx, myAtt,
      txStats:  { totalContrib, completedTx, pendingTx, total: myTx.length },
      attStats: { attPresent, attLate, attAbsent, attTotal, attRate },
      byCategory, byFund,
    }
  }, [user.id])

  // ── Build flat data for FlatList — static sections + att log rows ─────────
  const listData = useMemo(() => {
    const rows = [
      { type: 'hero' },
      { type: 'sectionLabel', label: 'Contribution Summary', id: 'sl-contrib' },
      { type: 'txKpis' },
    ]

    if (Object.keys(byCategory).length > 0) {
      rows.push({ type: 'sectionLabel', label: 'By Category', id: 'sl-cat' })
      rows.push({ type: 'breakdown', data: byCategory, id: 'bd-cat' })
    }
    if (Object.keys(byFund).length > 0) {
      rows.push({ type: 'sectionLabel', label: 'By Fund', id: 'sl-fund' })
      rows.push({ type: 'breakdown', data: byFund, id: 'bd-fund' })
    }

    rows.push({ type: 'sectionLabel', label: 'Attendance Summary', id: 'sl-att' })
    rows.push({ type: 'attKpis' })

    if (myAtt.length > 0) {
      rows.push({ type: 'sectionLabel', label: 'Activity Breakdown', id: 'sl-attlog' })
      myAtt.forEach((att, i) => rows.push({ type: 'attRow', att, isLast: i === myAtt.length - 1, id: `att-${att.id}` }))
    }

    rows.push({ type: 'footer' })
    return rows
  }, [myTx, myAtt, byCategory, byFund])

  const renderItem = useCallback(({ item }) => {
    switch (item.type) {
      case 'hero':
        return (
          <LinearGradient colors={[Colors.primary, '#2D3563']} style={styles.hero}>
            <View style={styles.heroGlow} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Avatar name={user.full_name} size={58} style={{ borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.2)' }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.heroName}>{user.full_name}</Text>
                <Text style={styles.heroMeta}>{user.role} · {user.department}</Text>
                <Text style={styles.heroMeta}>{user.employee_number}</Text>
                <View style={{ marginTop: 6 }}><StatusBadge status={user.status} /></View>
              </View>
            </View>
          </LinearGradient>
        )

      case 'sectionLabel':
        return <Text style={styles.sectionLabel}>{item.label}</Text>

      case 'txKpis':
        return (
          <View style={styles.kpiRow}>
            <KpiBox label="Total Contributed" value={formatCurrency(txStats.totalContrib)} color={Colors.success} />
            <KpiBox label="Completed"         value={String(txStats.completedTx)}          color={Colors.accent}  />
            <KpiBox label="Pending"           value={String(txStats.pendingTx)}            color={Colors.warning} />
            <KpiBox label="Transactions"      value={String(txStats.total)}                color={Colors.info}    />
          </View>
        )

      case 'attKpis':
        return (
          <View style={styles.kpiRow}>
            <KpiBox label="Present"  value={String(attStats.attPresent)} color={Colors.success} />
            <KpiBox label="Late"     value={String(attStats.attLate)}    color={Colors.warning} />
            <KpiBox label="Absent"   value={String(attStats.attAbsent)}  color={Colors.danger}  />
            <KpiBox label="Rate"     value={`${attStats.attRate}%`}      color={Colors.info}    />
          </View>
        )

      case 'breakdown':
        return (
          <Card style={{ marginHorizontal: Spacing.lg }}>
            {Object.entries(item.data).map(([key, amt], i, arr) => (
              <View key={key} style={[styles.breakdownRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                <StatusBadge status={key} />
                <Text style={styles.breakdownAmt}>{formatCurrency(amt)}</Text>
              </View>
            ))}
          </Card>
        )

      case 'attRow':
        return <AttLogRow att={item.att} isLast={item.isLast} />

      case 'footer':
        return <View style={{ height: 40 }} />

      default:
        return null
    }
  }, [user, txStats, attStats])

  const keyExtractor = useCallback(item => item.id || item.type, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader
        title="My Report"
        subtitle="Personal contribution & attendance summary"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
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
  hero: {
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl,
    overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -50, right: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(75,94,170,0.22)',
  },
  heroName: { fontSize: 18, fontFamily: Typography.display, color: '#fff', lineHeight: 22 },
  heroMeta: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 20, paddingBottom: 8,
  },
  kpiRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, gap: 10, marginBottom: 4,
  },
  kpiBox: {
    flex: 1, minWidth: '44%',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  breakdownAmt:   { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  attRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    gap: 10,
    backgroundColor: Colors.white,
  },
  dot:      { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  attName:  { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  attMeta:  { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body, marginTop: 1, textTransform: 'capitalize' },
  attRemark:{ fontSize: 11.5, color: Colors.textSecondary, fontFamily: Typography.bodyMedium, fontStyle: 'italic', marginTop: 2 },
})
