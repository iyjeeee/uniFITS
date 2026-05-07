// src/screens/ProfileScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Profile hub — plain primary-color hero (no glow circles), stats strip,
// then three section cards using the unified AppLayout.Section format.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import {
  MOCK_TRANSACTIONS, MOCK_ATTENDANCES,
  formatDate, formatCurrency,
} from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import {
  Avatar, StatusBadge, InfoRow,
  EditIcon, MoneyIcon, AttendanceIcon, ReportIcon, LogoutIcon,
} from '../components/ui'
import AppLayout from '../components/AppLayout'

// ── StatItem — one cell in the horizontal stats strip ────────────────────────
function StatItem({ label, value, color }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={[styles.statBar, { backgroundColor: color }]} />
    </View>
  )
}

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  const stats = useMemo(() => {
    const myTx = MOCK_TRANSACTIONS.filter(t => t.user_id === user.id)
    const totalContributed = myTx
      .filter(t => t.entry_type !== 'expense')
      .reduce((s, t) => s + t.amount, 0)
    const pendingCount = myTx.filter(t => t.status === 'pending').length
    const myAttend   = MOCK_ATTENDANCES.filter(a => a.user_id === user.id)
    const attPresent = myAttend.filter(a => a.status === 'present').length
    const attLate    = myAttend.filter(a => a.status === 'late').length
    const attTotal   = myAttend.length
    const attRate    = attTotal
      ? `${Math.round(((attPresent + attLate) / attTotal) * 100)}%`
      : '—'
    return { myTx, totalContributed, pendingCount, attPresent, attLate, attTotal, attRate }
  }, [user.id])

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Plain-color hero — no glow circles ──────────────────── */}
        <View style={styles.hero}>
          {/* Edit button — top right */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editBtn}
            activeOpacity={0.75}
          >
            <EditIcon color="#fff" size={14} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>

          {/* Centered avatar block */}
          <View style={styles.heroCenter}>
            <View style={styles.avatarWrap}>
              <Avatar name={user.full_name} size={82} style={styles.avatar} />
              {user.status === 'active' && <View style={styles.activeDot} />}
            </View>
            <Text style={styles.heroName}>{user.full_name}</Text>
            <Text style={styles.heroRole}>{user.role} · {user.department}</Text>
            <View style={styles.heroMetaRow}>
              <StatusBadge status={user.status} />
              <Text style={styles.heroMetaDot}>·</Text>
              <Text style={styles.heroMetaText}>{user.employee_number}</Text>
              <Text style={styles.heroMetaDot}>·</Text>
              <Text style={styles.heroMetaText}>Since {formatDate(user.joined)}</Text>
            </View>
          </View>
        </View>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <View style={styles.statsStrip}>
          <StatItem label="Contributed" value={formatCurrency(stats.totalContributed)} color={Colors.success} />
          <View style={styles.statsDivider} />
          <StatItem label="Transactions" value={String(stats.myTx.length)} color={Colors.accent} />
          <View style={styles.statsDivider} />
          <StatItem
            label="Attendance"
            value={stats.attTotal ? `${stats.attPresent + stats.attLate}/${stats.attTotal}` : '—'}
            color={Colors.info}
          />
          <View style={styles.statsDivider} />
          <StatItem label="Rate" value={stats.attRate} color={Colors.warning} />
        </View>

        {/* ── Personal Information — unified Section ────────────────── */}
        <AppLayout.Section title="Personal Information" style={{ marginTop: Spacing.xl }}>
          <InfoRow label="Full Name"  value={user.full_name} />
          <InfoRow label="Email"      value={user.email} />
          <InfoRow label="Contact"    value={user.contact_number} />
          <InfoRow label="Gender"     value={user.gender} />
          <InfoRow label="City"       value={user.address_city} />
          <InfoRow label="Province"   value={user.address_province} />
          <InfoRow label="Occupation" value={user.occupation} last />
        </AppLayout.Section>

        {/* ── My Records — unified Section ─────────────────────────── */}
        <AppLayout.Section title="My Records">
          <AppLayout.Row
            icon={<MoneyIcon size={17} />}
            iconBg={Colors.successLight} iconColor={Colors.success}
            title="My Transactions"
            subtitle={`${stats.myTx.length} record${stats.myTx.length !== 1 ? 's' : ''}${stats.pendingCount > 0 ? ` · ${stats.pendingCount} pending` : ''}`}
            onPress={() => navigation.navigate('MyTransactions')}
            right={<Text style={styles.rowChevron}>›</Text>}
          />
          <AppLayout.Row
            icon={<AttendanceIcon size={17} />}
            iconBg={Colors.infoLight} iconColor={Colors.info}
            title="My Attendance"
            subtitle={`${stats.attTotal} record${stats.attTotal !== 1 ? 's' : ''} · ${stats.attRate} rate`}
            onPress={() => navigation.navigate('MyAttendance')}
            right={<Text style={styles.rowChevron}>›</Text>}
          />
          <AppLayout.Row
            icon={<ReportIcon size={17} />}
            iconBg={Colors.accentLight} iconColor={Colors.accent}
            title="My Report"
            subtitle="Personal summary & contribution history"
            onPress={() => navigation.navigate('MyReport')}
            right={<Text style={styles.rowChevron}>›</Text>}
            last
          />
        </AppLayout.Section>

        {/* ── Account — unified Section ─────────────────────────────── */}
        <AppLayout.Section title="Account" style={{ marginBottom: Spacing.xxxl }}>
          <AppLayout.Row
            icon={<EditIcon size={17} />}
            iconBg={Colors.accentLight} iconColor={Colors.accent}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => navigation.navigate('EditProfile')}
            right={<Text style={styles.rowChevron}>›</Text>}
          />
          <AppLayout.Row
            icon={<LogoutIcon size={17} />}
            iconBg={Colors.dangerLight} iconColor={Colors.danger}
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            right={<Text style={[styles.rowChevron, { color: Colors.danger }]}>›</Text>}
            last
          />
        </AppLayout.Section>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  // Hero — plain primary color, no gradient, no glow circles
  hero: {
    backgroundColor: Colors.primary, // solid flat color
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl,
    paddingBottom: 36,
  },
  editBtn: {
    position: 'absolute', top: Spacing.xl, right: Spacing.xl,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', zIndex: 2,
  },
  editBtnText: { fontSize: 12.5, fontFamily: Typography.bodySemiBold, color: '#fff' },
  heroCenter:  { alignItems: 'center', paddingTop: 8 },
  avatarWrap:  { position: 'relative', marginBottom: 14 },
  avatar:      { borderWidth: 3, borderColor: 'rgba(255,255,255,0.22)' },
  activeDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.success, borderWidth: 2.5, borderColor: '#fff',
  },
  heroName: { fontSize: 24, fontFamily: Typography.display, color: '#fff', textAlign: 'center', marginBottom: 4 },
  heroRole: { fontSize: 13.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 12 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  heroMetaDot: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
  heroMetaText:{ fontSize: 12, fontFamily: Typography.body, color: 'rgba(255,255,255,0.45)' },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner, ...Shadow.sm,
  },
  statItem:  { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4 },
  statValue: { fontSize: 15, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, lineHeight: 20, textAlign: 'center' },
  statLabel: { fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginTop: 3, textAlign: 'center' },
  statBar:   { width: 18, height: 2.5, borderRadius: 2, marginTop: 5 },
  statsDivider: { width: 1, backgroundColor: Colors.borderInner, marginVertical: 10 },

  // Row chevron indicator
  rowChevron: { fontSize: 20, color: Colors.textMuted, lineHeight: 24 },
})
