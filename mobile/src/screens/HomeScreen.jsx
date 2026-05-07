// src/screens/HomeScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Home dashboard.
// Top section: plain primary color, no decorative glow circles.
// Greeting row + My Total Contributions card.
// 2×2 KPI tile grid + Recent Transactions section.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  MOCK_TRANSACTIONS, MOCK_PROJECTS,
  MOCK_EVENTS, MOCK_ATTENDANCES,
  formatCurrency, formatDate,
} from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import {
  Avatar, StatusBadge,
  MoneyIcon, AttendanceIcon, ProjectsIcon, EventsIcon,
} from '../components/ui'
import AppLayout from '../components/AppLayout'

// Greeting — time-based salutation
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── KPI tile — one of four 2×2 grid cells ────────────────────────────────────
function KpiCard({ label, value, sub, color, icon }) {
  return (
    <View style={[styles.kpiCard, { borderTopColor: color }]}>
      <View style={[styles.kpiIconWrap, { backgroundColor: color + '18' }]}>
        {React.cloneElement(icon, { color, size: 18 })}
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiSub}>{sub}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 900)
  }, [])

  // All derived data memoised
  const { myTx, totalContributed, pendingTx, recentTx,
          attPresent, attTotal, upcomingEv } = useMemo(() => {
    const myTx = MOCK_TRANSACTIONS.filter(t => t.user_id === user.id)
    const totalContributed = myTx
      .filter(t => t.entry_type !== 'expense')
      .reduce((s, t) => s + t.amount, 0)
    const pendingTx  = myTx.filter(t => t.status === 'pending')
    const recentTx   = myTx.slice(0, 3)
    const myAttend   = MOCK_ATTENDANCES.filter(a => a.user_id === user.id)
    const attPresent = myAttend.filter(a => a.status === 'present' || a.status === 'late').length
    const attTotal   = myAttend.length
    const upcomingEv = MOCK_EVENTS.filter(e => e.status === 'upcoming').length
    return { myTx, totalContributed, pendingTx, recentTx, attPresent, attTotal, upcomingEv }
  }, [user.id])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
        }
      >
        {/* ── Plain-color header — no glow circles ───────────────────── */}
        <View style={styles.header}>
          {/* Top row: greeting left, avatar right */}
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetText}>{greeting()}</Text>
              <Text style={styles.nameText}>{user.first_name} {user.last_name}</Text>
              <View style={styles.headerMeta}>
                <StatusBadge status={user.status} />
                <Text style={styles.metaText}>{user.department}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileTab')}
              activeOpacity={0.85}
            >
              <Avatar
                name={user.full_name}
                size={50}
                style={{ borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.22)' }}
              />
            </TouchableOpacity>
          </View>

          {/* ── My Total Contributions card — glassmorphism ─────────── */}
          <View style={styles.contribCard}>
            <View style={styles.contribTop}>
              <View>
                <Text style={styles.contribEyebrow}>My Total Contributions</Text>
                <Text style={styles.contribAmount}>{formatCurrency(totalContributed)}</Text>
              </View>
              {pendingTx.length > 0 && (
                <View style={styles.pendingBadge}>
                  <View style={styles.pendingDot} />
                  <Text style={styles.pendingText}>{pendingTx.length} pending</Text>
                </View>
              )}
            </View>
            <View style={styles.contribDivider} />
            <View style={styles.contribMeta}>
              <View style={styles.contribMetaItem}>
                <Text style={styles.contribMetaLabel}>Since</Text>
                <Text style={styles.contribMetaValue}>{formatDate(user.joined)}</Text>
              </View>
              <View style={styles.contribMetaSep} />
              <View style={styles.contribMetaItem}>
                <Text style={styles.contribMetaLabel}>ID</Text>
                <Text style={styles.contribMetaValue}>{user.employee_number}</Text>
              </View>
              <View style={styles.contribMetaSep} />
              <View style={styles.contribMetaItem}>
                <Text style={styles.contribMetaLabel}>Role</Text>
                <Text style={styles.contribMetaValue}>{user.role}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── KPI 2×2 grid ─────────────────────────────────────────── */}
        <View style={styles.kpiGrid}>
          <KpiCard
            label="Projects" value={MOCK_PROJECTS.length}
            sub={`${MOCK_PROJECTS.filter(p => p.status === 'ongoing').length} ongoing`}
            color={Colors.accent} icon={<ProjectsIcon />}
          />
          <KpiCard
            label="Events" value={MOCK_EVENTS.length}
            sub={`${upcomingEv} upcoming`}
            color={Colors.info} icon={<EventsIcon />}
          />
          <KpiCard
            label="Attendance"
            value={attTotal ? `${attPresent}/${attTotal}` : '—'}
            sub={attTotal ? `${Math.round((attPresent / attTotal) * 100)}% rate` : 'No records'}
            color={Colors.success} icon={<AttendanceIcon />}
          />
          <KpiCard
            label="Transactions" value={myTx.length}
            sub={`${pendingTx.length} pending`}
            color={Colors.warning} icon={<MoneyIcon />}
          />
        </View>

        {/* ── Recent Transactions — unified Section format ─────────── */}
        <AppLayout.Section
          title="Recent Transactions"
          action="See all"
          onAction={() => navigation.navigate('ProfileTab', { screen: 'MyTransactions' })}
          style={{ marginBottom: 32 }}
        >
          {recentTx.length === 0 ? (
            <View style={styles.txEmpty}>
              <Text style={styles.txEmptyText}>No transactions yet</Text>
            </View>
          ) : recentTx.map((tx, i) => {
            const isContrib = tx.entry_type !== 'expense'
            return (
              <View key={tx.id} style={[styles.txRow, i < recentTx.length - 1 && styles.txBorder]}>
                <View style={[styles.txIcon, { backgroundColor: isContrib ? Colors.successLight : Colors.dangerLight }]}>
                  <MoneyIcon color={isContrib ? Colors.success : Colors.danger} size={15} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.txTitle} numberOfLines={1}>{tx.description || tx.category}</Text>
                  <Text style={styles.txMeta}>{formatDate(tx.transaction_date)} · {tx.payment_method}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[styles.txAmount, { color: isContrib ? Colors.success : Colors.danger }]}>
                    {isContrib ? '+' : '−'}{formatCurrency(tx.amount)}
                  </Text>
                  <StatusBadge status={tx.status} />
                </View>
              </View>
            )
          })}
        </AppLayout.Section>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  // Header — plain primary color, no decorative circles
  header: {
    backgroundColor: Colors.primary, // solid, no gradient, no glow
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: Spacing.lg,
  },
  greetText: { fontSize: 12.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginBottom: 2 },
  nameText:  { fontSize: 24, fontFamily: Typography.display, color: '#fff', marginBottom: 8 },
  headerMeta:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText:  { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body },

  // Contributions glassmorphism card inside header
  contribCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  contribTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  contribEyebrow: { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.bodyMedium, marginBottom: 4 },
  contribAmount:  { fontSize: 30, fontFamily: Typography.display, color: '#fff' },
  pendingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(212,134,10,0.18)', borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(212,134,10,0.3)',
  },
  pendingDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.warning },
  pendingText: { fontSize: 11.5, fontFamily: Typography.bodySemiBold, color: Colors.warning },
  contribDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 12 },
  contribMeta:      { flexDirection: 'row' },
  contribMetaItem:  { flex: 1 },
  contribMetaSep:   { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 10 },
  contribMetaLabel: { fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body, marginBottom: 3 },
  contribMetaValue: { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: '#fff' },

  // KPI grid
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg,
    gap: 10, marginBottom: 4,
  },
  kpiCard: {
    flex: 1, flexBasis: '47%',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.lg, borderTopWidth: 3,
    borderWidth: 1, borderColor: Colors.borderCard, ...Shadow.sm,
  },
  kpiIconWrap: {
    width: 36, height: 36, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  kpiValue: { fontSize: 22, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, marginBottom: 2 },
  kpiLabel: { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary, marginBottom: 2 },
  kpiSub:   { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted },

  // Transaction rows inside the unified Section
  txEmpty:     { padding: 28, alignItems: 'center' },
  txEmptyText: { fontSize: 14, color: Colors.textMuted },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  txIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  txTitle:  { fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary },
  txMeta:   { fontSize: 12, fontFamily: Typography.body, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: 14, fontFamily: Typography.bodyBold },
})
