// app/(tabs)/index.tsx — Home / Dashboard screen with section cards

import { ScrollView, View, Text, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import { AnnouncementCard }     from '@/components/shared/AnnouncementCard';
import { TransactionRow }       from '@/components/shared/TransactionRow';
import { reportsService }       from '@/services/reports.service';
import { announcementsService } from '@/services/announcements.service';
import { transactionsService }  from '@/services/transactions.service';
import { membersService }       from '@/services/members.service';
import { formatCurrency }       from '@/utils/formatters';
import { useCurrentUser }       from '@/hooks/useCurrentUser';
import { useBottomPadding }     from '@/hooks/useBottomPadding';
import { useRefreshOnFocus }    from '@/hooks/useRefreshOnFocus';
import { useSafeAreaInsets }    from 'react-native-safe-area-context';

// Reusable section wrapper with header strip
function SectionCard({
  title, icon, color, onSeeAll, children,
}: {
  title: string;
  icon:  React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onSeeAll?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.card}>
      {/* Section header strip */}
      <View style={[sectionStyles.header, { borderLeftColor: color }]}>
        <View style={[sectionStyles.iconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={sectionStyles.title}>{title}</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} style={sectionStyles.seeAllBtn}>
            <Text style={[sectionStyles.seeAll, { color }]}>See all</Text>
            <Ionicons name="chevron-forward" size={13} color={color} />
          </TouchableOpacity>
        )}
      </View>
      {/* Section content */}
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     1.5,
    borderColor:     Colors.borderCard,
    overflow:        'hidden',
    shadowColor:     '#4B5EAA',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       3,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing.sm,
    paddingHorizontal: Layout.CARD_PADDING,
    paddingVertical:   Spacing.sm + 2,
    backgroundColor:   Colors.neutralLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInner,
    borderLeftWidth:   4,
  },
  iconWrap: {
    width:          28,
    height:         28,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.base,
    color:      Colors.textPrimary,
    flex:       1,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  seeAll: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
  },
  body: {
    padding: Layout.CARD_PADDING,
    gap:     Spacing.sm,
  },
});

export default function HomeScreen() {
  const user      = useCurrentUser();
  const insets    = useSafeAreaInsets();
  const bottomPad = useBottomPadding();

  const { data: summary, isLoading, error, refetch: r1 } =
    useQuery({ queryKey: ['fund-summary'],       queryFn: reportsService.getFundSummary });
  const { data: overview, refetch: r2 } =
    useQuery({ queryKey: ['financial-overview'], queryFn: reportsService.getFinancialOverview });
  const { data: announcements = [], refetch: r3 } =
    useQuery({ queryKey: ['announcements'],      queryFn: announcementsService.getAnnouncements });
  const { data: myTransactions = [], refetch: r4 } =
    useQuery({
      queryKey: ['my-transactions', user?.id],
      queryFn:  () => transactionsService.getMyTransactions(user!.id),
      enabled:  !!user,
    });
  const { data: members = [] } =
    useQuery({ queryKey: ['members'], queryFn: membersService.getMembers });

  useRefreshOnFocus(() => { r1(); r2(); r3(); r4(); });

  if (!user)    return null;
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error)     return <ErrorState onRetry={r1} />;

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const recentAnn     = announcements.slice(0, 2);
  const recentTxn     = myTransactions.slice(0, 3);

  const kpis = [
    { label: 'Total Funds',      value: formatCurrency(summary?.totalBalance ?? 0, true),        color: Colors.accent,  icon: 'wallet'      as const },
    { label: 'Active Members',   value: String(activeMembers),                                    color: Colors.success, icon: 'people'      as const },
    { label: 'My Contributions', value: formatCurrency(overview?.totalContributions ?? 0, true), color: Colors.info,    icon: 'trending-up' as const },
    { label: 'Active Funds',     value: String(summary?.activeCount ?? 0),                       color: Colors.warning, icon: 'layers'      as const },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => { r1(); r2(); r3(); r4(); }}
          tintColor={Colors.accent}
        />
      }
    >
      {/* ── Dark brand header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={styles.headerInner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user.first_name} 👋</Text>
            <Text style={styles.role}>{user.role} · {user.department}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{user.first_name[0]}</Text>
          </View>
        </View>
      </View>

      {/* ── Content area ── */}
      <View style={styles.content}>

        {/* ── Overview KPI section ── */}
        <SectionCard
          title="Overview"
          icon="bar-chart"
          color={Colors.accent}
        >
          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <View key={kpi.label} style={[styles.kpiCard, { borderTopColor: kpi.color }]}>
                <View style={[styles.kpiIconWrap, { backgroundColor: kpi.color + '18' }]}>
                  <Ionicons name={kpi.icon} size={16} color={kpi.color} />
                </View>
                <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
                  {kpi.value}
                </Text>
                <Text style={styles.kpiLabel} numberOfLines={2}>{kpi.label}</Text>
              </View>
            ))}
          </View>
        </SectionCard>

        {/* ── Recent Announcements section ── */}
        <SectionCard
          title="Recent Announcements"
          icon="megaphone"
          color={Colors.info}
          onSeeAll={() => router.push('/(tabs)/announcements')}
        >
          {recentAnn.length === 0 ? (
            <Text style={styles.emptyNote}>No announcements yet.</Text>
          ) : (
            recentAnn.map((a) => (
              <AnnouncementCard
                key={a.id}
                item={a}
                onPress={() => router.push(`/(tabs)/announcements/${a.id}` as any)}
                style={{ marginBottom: 0 }}
              />
            ))
          )}
        </SectionCard>

        {/* ── My Transactions section ── */}
        <SectionCard
          title="My Transactions"
          icon="receipt"
          color={Colors.success}
          onSeeAll={() => router.push('/(tabs)/finances')}
        >
          {recentTxn.length === 0 ? (
            <Text style={styles.emptyNote}>No transactions on record.</Text>
          ) : (
            recentTxn.map((t) => (
              <TransactionRow
                key={t.id}
                item={t}
                onPress={() => router.push(`/(tabs)/finances/${t.id}` as any)}
                style={{ marginBottom: 0 }}
              />
            ))
          )}
        </SectionCard>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgApp },

  // Dark brand header
  header: {
    backgroundColor:   Colors.primary,
    paddingHorizontal: Layout.SCREEN_PADDING_H,
    paddingBottom:     Spacing.xxl,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  greeting: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xl,
    color:      Colors.textOnDark,
  },
  role: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.50)',
    marginTop:  2,
  },
  avatarCircle: {
    width:           44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent,
    alignItems:      'center', justifyContent: 'center',
    borderWidth:     2, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarLetter: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.lg,
    color:      Colors.textOnDark,
  },

  // Content overlaps header
  content: {
    marginTop:            -Radius.lg,
    backgroundColor:      Colors.bgApp,
    borderTopLeftRadius:  Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding:              Layout.SCREEN_PADDING_H,
    paddingTop:           Spacing.lg,
    gap:                  Spacing.md,
  },

  // KPI grid inside Overview section card
  kpiGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Spacing.sm,
  },
  kpiCard: {
    flex:            1,
    minWidth:        '45%',
    backgroundColor: Colors.neutralLight,
    borderRadius:    Radius.sm,
    borderWidth:     1,
    borderColor:     Colors.borderInner,
    borderTopWidth:  3,
    padding:         Spacing.sm + 2,
    gap:             4,
  },
  kpiIconWrap: {
    width:          28, height: 28,
    borderRadius:   Radius.sm,
    alignItems:     'center', justifyContent: 'center',
    marginBottom:   2,
  },
  kpiValue: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.lg,
    color:      Colors.textPrimary,
  },
  kpiLabel: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.textMuted,
    lineHeight: 15,
  },

  emptyNote: {
    fontFamily:     Typography.fontBody,
    fontSize:       FontSize.base,
    color:          Colors.textMuted,
    textAlign:      'center',
    paddingVertical: Spacing.md,
  },
});
