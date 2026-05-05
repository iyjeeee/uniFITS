// src/screens/HomeScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Member dashboard: personalized greeting, contribution hero card,
// KPI grid, pinned announcements, active projects preview, recent txns.
// Only shows data related to the logged-in member.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  MOCK_TRANSACTIONS, MOCK_ANNOUNCEMENTS, MOCK_PROJECTS,
  MOCK_EVENTS, MOCK_ATTENDANCES,
  formatCurrency, formatDate, relativeTime,
} from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import {
  Avatar, StatusBadge, ProgressBar, Card, SectionHeader,
  KpiTile, AnnouncementsIcon, MoneyIcon,
  AttendanceIcon, ProjectsIcon, EventsIcon, StarIcon,
} from '../components/ui'

// ── Greeting helper ────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 900)
  }, [])

  // ── Member-specific data — memoised so it only recomputes when user changes ──
  const { myTx, totalContributed, pendingTx, recentTx,
          myAttend, attPresent, attTotal,
          pinnedAnn, activeProj, upcomingEv } = useMemo(() => {
    const myTx = MOCK_TRANSACTIONS.filter(t => t.user_id === user.id)
    const totalContributed = myTx
      .filter(t => t.entry_type !== 'expense')
      .reduce((s, t) => s + t.amount, 0)
    const pendingTx  = myTx.filter(t => t.status === 'pending')
    const recentTx   = myTx.slice(0, 3)
    const myAttend   = MOCK_ATTENDANCES.filter(a => a.user_id === user.id)
    const attPresent = myAttend.filter(a => a.status === 'present' || a.status === 'late').length
    const attTotal   = myAttend.length
    const pinnedAnn  = MOCK_ANNOUNCEMENTS.filter(a => a.is_pinned).slice(0, 2)
    const activeProj = MOCK_PROJECTS.filter(p => p.status === 'ongoing' || p.status === 'upcoming').slice(0, 2)
    const upcomingEv = MOCK_EVENTS.filter(e => e.status === 'upcoming').length
    return { myTx, totalContributed, pendingTx, recentTx,
             myAttend, attPresent, attTotal,
             pinnedAnn, activeProj, upcomingEv }
  }, [user.id])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView
        style={{ backgroundColor: Colors.bgApp }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.header}>
          {/* Glow */}
          <View style={styles.headerGlow} />

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, alignItems: 'center' }}>
                <StatusBadge status={user.status} />
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body }}>
                  {user.employee_number} · {user.department}
                </Text>
              </View>
            </View>
            <Avatar name={user.full_name} size={46} style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          </View>
        </LinearGradient>

        {/* ── Hero contribution card ──────────────────────────────── */}
        <View style={{ paddingHorizontal: Spacing.lg, marginTop: -12 }}>
          <LinearGradient
            colors={['#2D3563', '#1A2040']}
            style={styles.heroCard}
          >
            <View style={styles.heroGlow} />
            <Text style={styles.heroLabel}>My Total Contributions</Text>
            <Text style={styles.heroAmount}>{formatCurrency(totalContributed)}</Text>
            <View style={styles.heroRow}>
              <View style={styles.heroItem}>
                <Text style={styles.heroItemLabel}>Member Since</Text>
                <Text style={styles.heroItemValue}>{formatDate(user.joined)}</Text>
              </View>
              <View style={styles.heroItem}>
                <Text style={styles.heroItemLabel}>Member ID</Text>
                <Text style={styles.heroItemValue}>{user.employee_number}</Text>
              </View>
              <View style={styles.heroItem}>
                <Text style={styles.heroItemLabel}>Role</Text>
                <Text style={styles.heroItemValue}>{user.role}</Text>
              </View>
            </View>
            {pendingTx.length > 0 && (
              <View style={styles.pendingPill}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.warning }} />
                <Text style={{ fontSize: 11.5, fontFamily: Typography.bodySemiBold, color: Colors.warning }}>
                  {pendingTx.length} pending payment{pendingTx.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* ── KPI grid ────────────────────────────────────────────── */}
        <View style={styles.kpiGrid}>
          <KpiTile
            label="Projects" value={MOCK_PROJECTS.length}
            sub={`${MOCK_PROJECTS.filter(p => p.status === 'ongoing').length} ongoing`}
            color={Colors.accent} icon={<ProjectsIcon size={16} />}
            style={{ flex: 1 }}
          />
          <KpiTile
            label="Events" value={MOCK_EVENTS.length}
            sub={`${upcomingEv} upcoming`}
            color={Colors.info} icon={<EventsIcon size={16} />}
            style={{ flex: 1 }}
          />
          <KpiTile
            label="My Attendance"
            value={attTotal ? `${attPresent}/${attTotal}` : '—'}
            sub={attTotal ? `${Math.round((attPresent / attTotal) * 100)}% rate` : 'No records'}
            color={Colors.success} icon={<AttendanceIcon size={16} />}
            style={{ flex: 1 }}
          />
          <KpiTile
            label="My Transactions" value={myTx.length}
            sub={`${pendingTx.length} pending`}
            color={Colors.warning} icon={<MoneyIcon size={16} />}
            style={{ flex: 1 }}
          />
        </View>

        {/* ── Pinned Announcements ─────────────────────────────────── */}
        <SectionHeader
          title="Pinned Updates"
          action="See all"
          onAction={() => navigation.navigate('UpdatesTab', {
            screen: 'AnnouncementsList',
          })}
        />
        {pinnedAnn.map(ann => (
          <TouchableOpacity key={ann.id} activeOpacity={0.8}
            onPress={() => navigation.navigate('UpdatesTab', {
              screen: 'AnnouncementDetail',
              params: { item: ann },
            })}
            style={[styles.annCard, Shadow.sm]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <StarIcon size={12} />
              <Text style={{ fontSize: 10.5, fontFamily: Typography.bodyBold, color: Colors.warning, textTransform: 'uppercase', letterSpacing: 0.3 }}>Pinned</Text>
            </View>
            <Text style={styles.annTitle} numberOfLines={1}>{ann.title}</Text>
            <Text style={styles.annBody} numberOfLines={2}>{ann.content}</Text>
            <Text style={styles.annMeta}>{ann.created_by} · {relativeTime(ann.created_at)}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Active Projects ──────────────────────────────────────── */}
        <SectionHeader
          title="Active Projects"
          action="See all"
          onAction={() => navigation.navigate('ProjectsTab', {
            screen: 'ProjectsList',
          })}
        />
        <View style={{ paddingHorizontal: Spacing.lg, gap: 10, marginBottom: 4 }}>
          {activeProj.map(proj => {
            return (
              <Card key={proj.id} onPress={() => navigation.navigate('ProjectsTab', {
                screen: 'ProjectDetail',
                params: { item: proj },
              })}>
                <View style={{ padding: Spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <Text style={styles.projTitle} numberOfLines={1}>{proj.title}</Text>
                    <StatusBadge status={proj.status} style={{ marginLeft: 8 }} />
                  </View>
                  <Text style={styles.projSub} numberOfLines={1}>{proj.project_type} · {proj.location}</Text>
                  <ProgressBar current={proj.current_funding} target={proj.target_funding} showLabel style={{ marginTop: 10 }} />
                </View>
              </Card>
            )
          })}
        </View>

        {/* ── My Recent Transactions ───────────────────────────────── */}
        <SectionHeader
          title="My Recent Transactions"
          action="See all"
          onAction={() => navigation.navigate('ProfileTab', {
            screen: 'MyTransactions',
          })}
        />
        <Card style={{ marginHorizontal: Spacing.lg, marginBottom: Spacing.xl }}>
          {recentTx.length === 0 ? (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: Colors.textMuted }}>No transactions yet</Text>
            </View>
          ) : (
            recentTx.map((tx, i) => {
              const isContrib = tx.entry_type !== 'expense'
              return (
                <View key={tx.id} style={[styles.txRow, i === recentTx.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.txDot, { backgroundColor: isContrib ? Colors.successLight : Colors.dangerLight }]}>
                    <MoneyIcon color={isContrib ? Colors.success : Colors.danger} size={14} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.txTitle} numberOfLines={1}>{tx.description || tx.category}</Text>
                    <Text style={styles.txMeta}>{formatDate(tx.transaction_date)} · {tx.payment_method}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 3 }}>
                    <Text style={[styles.txAmount, { color: isContrib ? Colors.success : Colors.danger }]}>
                      {isContrib ? '+' : '−'}{formatCurrency(tx.amount)}
                    </Text>
                    <StatusBadge status={tx.status} />
                  </View>
                </View>
              )
            })
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: -60, right: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(75,94,170,0.25)',
  },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginBottom: 2 },
  name:     { fontSize: 24, fontFamily: Typography.display, color: '#fff' },
  heroCard: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  heroGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(75,94,170,0.3)',
  },
  heroLabel:  { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.bodyMedium, marginBottom: 4 },
  heroAmount: { fontSize: 32, fontFamily: Typography.display, color: '#fff', marginBottom: 16 },
  heroRow:    { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  heroItem:   {},
  heroItemLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: Typography.body, marginBottom: 2 },
  heroItemValue: { fontSize: 13, fontFamily: Typography.bodySemiBold, color: '#fff' },
  pendingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 14,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: 'rgba(212,134,10,0.15)',
    borderRadius: Radius.full,
    borderWidth: 1, borderColor: 'rgba(212,134,10,0.3)',
    alignSelf: 'flex-start',
  },
  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: 10, marginBottom: 4,
  },
  annCard: {
    marginHorizontal: Spacing.lg, marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    padding: Spacing.md,
  },
  annTitle: { fontSize: 13.5, fontFamily: Typography.bodyBold,   color: Colors.textPrimary, marginBottom: 4 },
  annBody:  { fontSize: 12,   fontFamily: Typography.body,       color: Colors.textSecondary, lineHeight: 17, marginBottom: 8 },
  annMeta:  { fontSize: 11,   fontFamily: Typography.body,       color: Colors.textMuted },
  projTitle: { fontSize: 14, fontFamily: Typography.bodyBold, color: Colors.textPrimary, flex: 1 },
  projSub:   { fontSize: 12, fontFamily: Typography.body,    color: Colors.textMuted },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  txDot:    { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txTitle:  { fontSize: 13.5, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary },
  txMeta:   { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted, marginTop: 1 },
  txAmount: { fontSize: 13.5, fontFamily: Typography.bodyBold },
})
