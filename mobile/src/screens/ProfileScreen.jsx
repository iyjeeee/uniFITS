// src/screens/ProfileScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Member profile hub: hero, quick stats, personal info, navigation to
// sub-screens (My Transactions, My Report, My Attendance, Edit Profile).
// Only shows THIS member's own data — not other members'.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, StatusBar,
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
  Avatar, StatusBadge, Card, InfoRow, RowItem,
  EditIcon, MoneyIcon, AttendanceIcon, ReportIcon,
  LogoutIcon,
} from '../components/ui'

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  // ── Member-specific computed stats ──────────────────────────────────────
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

  function handleLogout() {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={{ backgroundColor: Colors.bgApp }} showsVerticalScrollIndicator={false}>

        {/* ── Profile hero ─────────────────────────────────────────── */}
        <LinearGradient colors={[Colors.primary, '#2D3563']} style={styles.hero}>
          {/* Glow */}
          <View style={styles.heroGlow} />

          {/* Edit button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editBtn}
            activeOpacity={0.75}
          >
            <EditIcon color="#fff" size={15} />
            <Text style={{ fontSize: 12, fontFamily: Typography.bodySemiBold, color: '#fff' }}>Edit</Text>
          </TouchableOpacity>

          {/* Avatar + name */}
          <View style={{ alignItems: 'center' }}>
            <Avatar
              name={user.full_name}
              size={76}
              style={{ borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 12 }}
            />
            <Text style={styles.heroName}>{user.full_name}</Text>
            <Text style={styles.heroRole}>{user.role} · {user.department}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <StatusBadge status={user.status} />
              <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body }}>
                {user.employee_number}
              </Text>
              <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', fontFamily: Typography.body }}>
                Joined {formatDate(user.joined)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Quick stats row ───────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatPill label="Contributed"   value={formatCurrency(totalContributed)} color={Colors.success} />
          <View style={styles.statDivider} />
          <StatPill label="Transactions"  value={String(myTx.length)} color={Colors.accent} />
          <View style={styles.statDivider} />
          <StatPill label="Attendance"    value={attTotal ? `${attPresent + attLate}/${attTotal}` : '—'} color={Colors.info} />
          <View style={styles.statDivider} />
          <StatPill label="Attend. Rate"  value={attRate} color={Colors.warning} />
        </View>

        {/* ── Personal info card ────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Personal Information</Text>
        <Card style={{ marginHorizontal: Spacing.lg }}>
          <InfoRow label="Full Name"  value={user.full_name} />
          <InfoRow label="Email"      value={user.email} />
          <InfoRow label="Contact"    value={user.contact_number} />
          <InfoRow label="Gender"     value={user.gender} />
          <InfoRow label="City"       value={user.address_city} />
          <InfoRow label="Province"   value={user.address_province} />
          <InfoRow label="Occupation" value={user.occupation} last />
        </Card>

        {/* ── My records ───────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>My Records</Text>
        <Card style={{ marginHorizontal: Spacing.lg }}>
          <RowItem
            icon={<MoneyIcon size={17} />}
            iconBg={Colors.successLight}
            iconColor={Colors.success}
            title="My Transactions"
            subtitle={`${myTx.length} record${myTx.length !== 1 ? 's' : ''}${pendingCount > 0 ? ` · ${pendingCount} pending` : ''}`}
            onPress={() => navigation.navigate('MyTransactions')}
          />
          <RowItem
            icon={<AttendanceIcon size={17} />}
            iconBg={Colors.infoLight}
            iconColor={Colors.info}
            title="My Attendance"
            subtitle={`${attTotal} record${attTotal !== 1 ? 's' : ''} · ${attRate} rate`}
            onPress={() => navigation.navigate('MyAttendance')}
          />
          <RowItem
            icon={<ReportIcon size={17} />}
            iconBg={Colors.accentLight}
            iconColor={Colors.accent}
            title="My Report"
            subtitle="Personal summary & contribution history"
            onPress={() => navigation.navigate('MyReport')}
            bordered={false}
          />
        </Card>

        {/* ── Account ──────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>Account</Text>
        <Card style={{ marginHorizontal: Spacing.lg, marginBottom: Spacing.xxxl }}>
          <RowItem
            icon={<EditIcon size={17} />}
            iconBg={Colors.accentLight}
            iconColor={Colors.accent}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <RowItem
            icon={<LogoutIcon size={17} />}
            iconBg={Colors.dangerLight}
            iconColor={Colors.danger}
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            bordered={false}
            danger
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

// ── Mini stat pill ─────────────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
      <Text style={{ fontSize: 16, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, lineHeight: 20 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginTop: 3, textAlign: 'center' }}>
        {label}
      </Text>
      <View style={{ width: 20, height: 2, backgroundColor: color, borderRadius: 1, marginTop: 5 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(75,94,170,0.22)',
  },
  editBtn: {
    position: 'absolute', top: Spacing.xl, right: Spacing.xl,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  heroName: {
    fontSize: 22, fontFamily: Typography.display,
    color: '#fff', textAlign: 'center',
  },
  heroRole: {
    fontSize: 13, fontFamily: Typography.bodyMedium,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center', marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInner,
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderInner,
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 20, paddingBottom: 8,
  },
})
