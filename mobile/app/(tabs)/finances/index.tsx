// app/(tabs)/finances/index.tsx — Finances screen

import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import { AppHeader, LoadingSpinner, ErrorState, EmptyState, SectionHeader } from '@/components/ui';
import { FundCard }       from '@/components/shared/FundCard';
import { TransactionRow } from '@/components/shared/TransactionRow';
import { fundsService }        from '@/services/funds.service';
import { transactionsService } from '@/services/transactions.service';
import { reportsService }      from '@/services/reports.service';
import { useCurrentUser }      from '@/hooks/useCurrentUser';
import { useRefreshOnFocus }   from '@/hooks/useRefreshOnFocus';
import { useBottomPadding }    from '@/hooks/useBottomPadding';
import { formatCurrency }      from '@/utils/formatters';

type Tab = 'funds' | 'transactions';

export default function FinancesScreen() {
  const user      = useCurrentUser();
  const bottomPad = useBottomPadding();
  const [activeTab, setActiveTab] = useState<Tab>('funds');

  const { data: funds = [],  isLoading: lF, error: eF, refetch: rF } =
    useQuery({ queryKey: ['funds'], queryFn: fundsService.getFunds });
  const { data: myTxns = [], isLoading: lT, error: eT, refetch: rT } =
    useQuery({
      queryKey: ['my-transactions', user?.id],
      queryFn:  () => transactionsService.getMyTransactions(user!.id),
      enabled:  !!user,
    });
  const { data: overview } =
    useQuery({ queryKey: ['financial-overview'], queryFn: reportsService.getFinancialOverview });

  useRefreshOnFocus(() => { rF(); rT(); });

  if (!user)               return null;
  if (lF || lT)            return <LoadingSpinner fullScreen />;
  if (eF)                  return <ErrorState onRetry={rF} />;

  const totalBalance = funds.reduce((s, f) => s + f.balance, 0);

  const segControl = (
    <View style={styles.segmented}>
      {(['funds', 'transactions'] as Tab[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.segBtn, activeTab === tab && styles.segBtnActive]}
          onPress={() => setActiveTab(tab)}
          activeOpacity={0.8}
        >
          <Text style={[styles.segLabel, activeTab === tab && styles.segLabelActive]}>
            {tab === 'funds' ? `Funds  ${funds.length}` : `My Transactions  ${myTxns.length}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title={formatCurrency(totalBalance)}
        subtitle="Total Fund Balance"
        bottomSlot={segControl}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { rF(); rT(); }} tintColor={Colors.accent} />}
      >
        {activeTab === 'funds' ? (
          funds.length === 0
            ? <EmptyState icon="💰" title="No funds" subtitle="No funds have been created yet." />
            : funds.map((fund) => <FundCard key={fund.id} item={fund} />)
        ) : (
          myTxns.length === 0
            ? <EmptyState icon="🧾" title="No transactions" subtitle="You have no transaction records yet." />
            : myTxns.map((txn) => (
              <TransactionRow key={txn.id} item={txn} onPress={() => router.push(`/(tabs)/finances/${txn.id}` as any)} />
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.xs },
  segmented: {
    flexDirection:   'row',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius:    Radius.sm,
    padding:         3,
    gap:             2,
  },
  segBtn:        { flex: 1, paddingVertical: Spacing.xs + 2, alignItems: 'center', borderRadius: Radius.sm - 2 },
  segBtnActive:  { backgroundColor: Colors.accent },
  segLabel:      { fontFamily: Typography.fontBodyMedium, fontSize: FontSize.sm, color: 'rgba(249,250,251,0.55)' },
  segLabelActive:{ color: Colors.textOnDark },
});