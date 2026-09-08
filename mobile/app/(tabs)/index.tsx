// app/(tabs)/index.tsx — Home dashboard (2026 bento refresh)
// HeroStatCard for the primary KPI (fund balance), 2 secondary StatCards below it,
// Section panels with flat sub-card rows for Recent Announcements / Recent Transactions

import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, StatCard, HeroStatCard, Section, ErrorState, EmptyState, SkeletonList, FadeInUp } from '@/components/ui';
import { AnnouncementCard } from '@/components/shared/AnnouncementCard';
import { TransactionRow }   from '@/components/shared/TransactionRow';
import { reportsService }        from '@/services/reports.service';
import { announcementsService }  from '@/services/announcements.service';
import { transactionsService }   from '@/services/transactions.service';
import { useCurrentUser }    from '@/hooks/useCurrentUser';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useBottomPadding }  from '@/hooks/useBottomPadding';
import { formatCurrency, getGreeting } from '@/utils/formatters';
import { Config }            from '@/constants/config';

export default function HomeScreen() {
  const user      = useCurrentUser();
  const bottomPad = useBottomPadding();

  const { data: summary, isLoading: lS, error: eS, refetch: rS } =
    useQuery({ queryKey: ['fund-summary'], queryFn: reportsService.getFundSummary });
  const { data: announcements = [], isLoading: lA, error: eA, refetch: rA } =
    useQuery({ queryKey: ['announcements'], queryFn: announcementsService.getAnnouncements });
  const { data: myTxns = [], isLoading: lT, error: eT, refetch: rT } =
    useQuery({
      queryKey: ['my-transactions', user?.id],
      queryFn:  () => transactionsService.getMyTransactions(user!.id),
      enabled:  !!user,
    });

  const refetchAll = () => { rS(); rA(); rT(); };
  useRefreshOnFocus(refetchAll);

  if (!user) return null;

  const isLoading = lS || lA || lT;
  const hasError  = eS || eA || eT;

  // My completed contributions — same calc pattern as Profile screen
  const myContributions = myTxns.filter((t) => t.entry_type === 'contribution' && t.status === 'completed');
  const totalContributed = myContributions.reduce((s, t) => s + t.amount, 0);

  // Recent lists — most recent 3 of each
  const recentAnnouncements = announcements.slice(0, 3);
  const recentTransactions  = [...myTxns]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 3);

  return (
    <View style={styles.screen}>
      <AppHeader
        title={`${getGreeting()}, ${user.first_name}`}
        subtitle={Config.ORG_NAME}
      />

      {isLoading ? (
        <SkeletonList />
      ) : hasError ? (
        <ErrorState onRetry={refetchAll} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetchAll} tintColor={Colors.accent} />}
        >
          {/* Hero KPI — fund balance gets visual priority instead of competing equally with the rest */}
          <FadeInUp delay={0}>
            <HeroStatCard
              label="Total fund balance"
              value={formatCurrency(summary?.totalBalance ?? 0, true)}
              color={Colors.accent}
              onPress={() => router.push('/(tabs)/finances')}
              subStats={[
                { label: 'Active funds', value: String(summary?.activeCount ?? 0) },
                { label: 'My share',     value: formatCurrency(totalContributed, true) },
              ]}
            />
          </FadeInUp>

          {/* Secondary KPI grid */}
          <FadeInUp delay={80}>
            <View style={styles.kpiRow}>
              <StatCard
                label="My Contributions"
                value={formatCurrency(totalContributed, true)}
                color={Colors.warning}
                icon={<Ionicons name="cash-outline" size={18} color={Colors.warning} />}
                onPress={() => router.push('/(tabs)/finances')}
                style={styles.kpiCard}
              />
              <StatCard
                label="Announcements"
                value={String(announcements.length)}
                color={Colors.info}
                icon={<Ionicons name="megaphone-outline" size={18} color={Colors.info} />}
                onPress={() => router.push('/(tabs)/announcements')}
                style={styles.kpiCard}
              />
            </View>
          </FadeInUp>

          {/* Recent announcements */}
          <FadeInUp delay={160}>
            <Section
              title="Recent Announcements"
              actionLabel="View All"
              onAction={() => router.push('/(tabs)/announcements')}
            >
              {recentAnnouncements.length === 0 ? (
                <EmptyState
                  icon="megaphone-outline"
                  title="No announcements"
                  subtitle="Check back later for updates."
                  style={styles.emptyCompact}
                />
              ) : (
                recentAnnouncements.map((item) => (
                  <AnnouncementCard
                    key={item.id}
                    item={item}
                    variant="flat"
                    onPress={() => router.push(`/(tabs)/announcements/${item.id}` as any)}
                  />
                ))
              )}
            </Section>
          </FadeInUp>

          {/* Recent transactions */}
          <FadeInUp delay={240}>
            <Section
              title="Recent Transactions"
              actionLabel="View All"
              onAction={() => router.push('/(tabs)/finances')}
            >
              {recentTransactions.length === 0 ? (
                <EmptyState
                  icon="receipt-outline"
                  title="No transactions"
                  subtitle="Your transaction history will appear here."
                  style={styles.emptyCompact}
                />
              ) : (
                recentTransactions.map((txn) => (
                  <TransactionRow
                    key={txn.id}
                    item={txn}
                    variant="flat"
                    onPress={() => router.push(`/(tabs)/finances/${txn.id}` as any)}
                  />
                ))
              )}
            </Section>
          </FadeInUp>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.md },

  kpiRow:  { flexDirection: 'row', gap: Spacing.sm },
  kpiCard: { flex: 1 },

  emptyCompact: { flex: undefined, paddingVertical: Spacing.lg },
});
