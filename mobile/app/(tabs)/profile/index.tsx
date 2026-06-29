// app/(tabs)/profile/index.tsx — Profile screen, fixed header overlap

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import { LoadingSpinner, ErrorState, Avatar, StatusBadge, Divider, InfoRow } from '@/components/ui';
import { membersService }      from '@/services/members.service';
import { transactionsService } from '@/services/transactions.service';
import { useCurrentUser }      from '@/hooks/useCurrentUser';
import { useRefreshOnFocus }   from '@/hooks/useRefreshOnFocus';
import { useBottomPadding }    from '@/hooks/useBottomPadding';
import { useAuthStore }        from '@/store/authStore';
import { formatDate, formatCurrency } from '@/utils/formatters';

export default function ProfileScreen() {
  const user      = useCurrentUser();
  const insets    = useSafeAreaInsets();
  const bottomPad = useBottomPadding();
  const logout    = useAuthStore((s) => s.logout);

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn:  () => membersService.getMyProfile(user!.id),
    enabled:  !!user,
  });
  const { data: myTxns = [] } = useQuery({
    queryKey: ['my-transactions', user?.id],
    queryFn:  () => transactionsService.getMyTransactions(user!.id),
    enabled:  !!user,
  });

  useRefreshOnFocus(refetch);

  if (!user)              return null;
  if (isLoading)          return <LoadingSpinner fullScreen />;
  if (error || !profile)  return <ErrorState onRetry={refetch} />;

  const contributions    = myTxns.filter((t) => t.entry_type === 'contribution' && t.status === 'completed');
  const totalContributed = contributions.reduce((s, t) => s + t.amount, 0);

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await logout();
          // Auth guard in _layout.tsx handles redirect automatically
        },
      },
    ]);
  }

  return (
    <View style={styles.screen}>
      {/* Dark header with avatar */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/edit' as any)}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={20} color={Colors.textOnDark} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <Avatar name={profile.full_name} src={profile.photo_url} size={68} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.full_name}</Text>
            <Text style={styles.empNum}>{profile.employee_number}</Text>
            <View style={styles.roleRow}>
              <Text style={styles.roleText}>{profile.role} · {profile.department}</Text>
            </View>
            <View style={{ marginTop: Spacing.xs }}>
              <StatusBadge status={profile.status} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat strip */}
        <View style={styles.statStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{contributions.length}</Text>
            <Text style={styles.statLabel}>Contributions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(totalContributed, true)}</Text>
            <Text style={styles.statLabel}>Total Paid</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{myTxns.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Divider style={{ marginVertical: Spacing.sm }} />
          <InfoRow label="Full Name"    value={profile.full_name} />
          <Divider />
          <InfoRow label="Email"        value={profile.email} />
          <Divider />
          <InfoRow label="Contact No."  value={profile.contact_number} />
          <Divider />
          <InfoRow label="Gender"       value={profile.gender} />
          <Divider />
          <InfoRow label="Occupation"   value={profile.occupation} />
          <Divider />
          <InfoRow label="City"         value={profile.address_city} />
          <Divider />
          <InfoRow label="Province"     value={profile.address_province} />
          <Divider />
          <InfoRow label="Member Since" value={formatDate(profile.joined, 'medium')} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgApp },

  // Dark header
  header: {
    backgroundColor:   Colors.primary,
    paddingHorizontal: Layout.SCREEN_PADDING_H,
    paddingBottom:     Spacing.xl,
    gap:               Spacing.md,
  },
  headerTop: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textOnDark,
  },
  editBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical:   6,
    borderRadius:    Radius.full,
  },
  editBtnText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textOnDark,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           Spacing.md,
  },
  name: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.lg,
    color:      Colors.textOnDark,
    lineHeight: 24,
  },
  empNum: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.45)',
    marginTop:  2,
  },
  roleRow: { marginTop: 4 },
  roleText: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.65)',
  },

  // Content starts right below header — NO negative margin
  content: {
    padding: Layout.SCREEN_PADDING_H,
    gap:     Spacing.md,
  },

  // Stat strip — sits at top of scroll content
  statStrip: {
    flexDirection:     'row',
    backgroundColor:   Colors.white,
    borderRadius:      Radius.md,
    borderWidth:       1.5,
    borderColor:       Colors.borderCard,
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.md,
    alignItems:        'center',
    shadowColor:       '#4B5EAA',
    shadowOffset:      { width: 0, height: 2 },
    shadowOpacity:     0.07,
    shadowRadius:      6,
    elevation:         3,
  },
  statItem:    { flex: 1, alignItems: 'center', gap: 2 },
  statValue:   { fontFamily: Typography.fontBodyBold, fontSize: FontSize.lg, color: Colors.textPrimary },
  statLabel:   { fontFamily: Typography.fontBody, fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.borderInner },

  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     1.5,
    borderColor:     Colors.borderCard,
    padding:         Layout.CARD_PADDING,
  },
  cardTitle: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
  },

  logoutBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.sm,
    backgroundColor: Colors.dangerLight,
    borderWidth:     1.5,
    borderColor:     Colors.danger,
    borderRadius:    Radius.sm,
    paddingVertical: Spacing.sm + 2,
  },
  logoutText: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.base,
    color:      Colors.danger,
  },
});