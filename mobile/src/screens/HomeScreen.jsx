// src/screens/HomeScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Home dashboard.
// Top section: plain primary color, no decorative glow circles.
// Greeting row + My Total Contributions card.
// 2×2 KPI tile grid + Recent Transactions + Calendar sections.
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
  MoneyIcon, AttendanceIcon, ProjectsIcon, EventsIcon, CalendarIcon,
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

// ── Month names for calendar ──────────────────────────────────────────────────
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ── Mini calendar section ─────────────────────────────────────────────────────
function CalendarSection({ events, projects }) {
  const today       = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // Collect all activity dates for the viewed month
  const activityDates = useMemo(() => {
    const set = new Set()
    events.forEach(e => {
      const d = new Date(e.event_date)
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth)
        set.add(d.getDate())
    })
    projects.forEach(p => {
      const s = new Date(p.start_date)
      if (s.getFullYear() === viewYear && s.getMonth() === viewMonth)
        set.add(s.getDate())
    })
    return set
  }, [events, projects, viewYear, viewMonth])

  // Upcoming events in the viewed month
  const monthEvents = useMemo(() => {
    const all = [
      ...events.map(e => ({ date: e.event_date, title: e.title, type: 'event', status: e.status })),
      ...projects.map(p => ({ date: p.start_date, title: p.title, type: 'project', status: p.status })),
    ]
    return all
      .filter(item => {
        const d = new Date(item.date)
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [events, projects, viewYear, viewMonth])

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const firstDay   = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const isToday = (day) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  return (
    <AppLayout.Section title="Calendar" style={styles.calendarSection}>
      {/* Month nav */}
      <View style={styles.calHeader}>
        <TouchableOpacity onPress={prevMonth} activeOpacity={0.7} style={styles.calNavBtn}>
          <Text style={styles.calNavText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.calMonthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} activeOpacity={0.7} style={styles.calNavBtn}>
          <Text style={styles.calNavText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={styles.calDayRow}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={styles.calDayLabel}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calGrid}>
        {calendarDays.map((day, i) => (
          <View key={i} style={styles.calCell}>
            {day !== null && (
              <>
                <View style={[
                  styles.calDayCircle,
                  isToday(day) && styles.calDayToday,
                ]}>
                  <Text style={[styles.calDayNum, isToday(day) && styles.calDayNumToday]}>
                    {day}
                  </Text>
                </View>
                {activityDates.has(day) && (
                  <View style={styles.calDot} />
                )}
              </>
            )}
          </View>
        ))}
      </View>

      {/* Upcoming items for this month */}
      {monthEvents.length > 0 ? (
        <View style={styles.calEvents}>
          {monthEvents.map((item, i) => (
            <View key={i} style={[styles.calEventRow, i < monthEvents.length - 1 && styles.calEventBorder]}>
              <View style={[styles.calEventDot, {
                backgroundColor: item.type === 'event' ? Colors.info : Colors.accent,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.calEventTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.calEventDate}>{formatDate(item.date)}</Text>
              </View>
              <View style={[styles.calTypeBadge, {
                backgroundColor: item.type === 'event' ? Colors.infoLight : Colors.accentLight,
              }]}>
                <Text style={[styles.calTypeBadgeText, {
                  color: item.type === 'event' ? Colors.info : Colors.accent,
                }]}>
                  {item.type === 'event' ? 'Event' : 'Project'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.calEmpty}>
          <Text style={styles.calEmptyText}>No activities this month</Text>
        </View>
      )}
    </AppLayout.Section>
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

  const { myTx, totalContributed, pendingTx, recentTx,
          attPresent, attTotal, upcomingEv } = useMemo(() => {
    const myTx = MOCK_TRANSACTIONS
      .filter(t => t.user_id === user.id)
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)) // most recent first
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
        {/* ── Plain-color header ──────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetText}>{greeting()}</Text>
              <Text style={styles.nameText}>{user.first_name} {user.last_name}</Text>
              <View style={styles.headerMeta}>
                <StatusBadge status={user.status} />
                <Text style={styles.metaText}>{user.department}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} activeOpacity={0.85}>
              <Avatar name={user.full_name} size={50} style={{ borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.22)' }} />
            </TouchableOpacity>
          </View>

          {/* My Total Contributions card — glassmorphism */}
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

        {/* ── Calendar section — below Recent Transactions ────────── */}
        <CalendarSection
          events={MOCK_EVENTS}
          projects={MOCK_PROJECTS}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: Spacing.lg,
  },
  greetText:  { fontSize: 12.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginBottom: 2 },
  nameText:   { fontSize: 24, fontFamily: Typography.display, color: '#fff', marginBottom: 8 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText:   { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body },

  contribCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
  },
  contribTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  contribEyebrow:   { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.bodyMedium, marginBottom: 4 },
  contribAmount:    { fontSize: 30, fontFamily: Typography.display, color: '#fff' },
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

  // Transaction rows inside Section
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

  // Calendar section
  calendarSection: { marginBottom: 0 },
  calHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  calNavBtn:    { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  calNavText:   { fontSize: 22, color: Colors.accent, fontFamily: Typography.bodyBold, lineHeight: 26 },
  calMonthLabel:{ fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },

  calDayRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  calDayLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: Typography.bodySemiBold, color: Colors.textMuted },

  calGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  calCell: {
    width: '14.28%', alignItems: 'center', paddingVertical: 4,
  },
  calDayCircle: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  calDayToday:    { backgroundColor: Colors.accent },
  calDayNum:      { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textPrimary },
  calDayNumToday: { color: '#fff', fontFamily: Typography.bodyBold },
  calDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: Colors.accent, marginTop: 2,
  },

  // Events in this month
  calEvents: { paddingHorizontal: Spacing.lg, paddingBottom: 4 },
  calEventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11,
  },
  calEventBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  calEventDot:    { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  calEventTitle:  { fontSize: 13.5, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary },
  calEventDate:   { fontSize: 11.5, fontFamily: Typography.body, color: Colors.textMuted, marginTop: 1 },
  calTypeBadge:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, flexShrink: 0 },
  calTypeBadgeText:{ fontSize: 10.5, fontFamily: Typography.bodyBold },

  calEmpty: { paddingVertical: 20, alignItems: 'center' },
  calEmptyText: { fontSize: 13, color: Colors.textMuted, fontFamily: Typography.body },
})
