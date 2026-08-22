// app/(tabs)/finances/index.tsx — Finances screen

import { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, ErrorState, EmptyState, SegmentedControl, SkeletonList } from '@/components/ui';
import { FundCard }       from '@/components/shared/FundCard';
import { TransactionRow } from '@/components/shared/TransactionRow';
import { fundsService }        from '@/services/funds.service';
import { transactionsService } from '@/services/transactions.service';
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

  useRefreshOnFocus(() => { rF(); rT(); });

  if (!user) return null;

  const isLoading     = lF || lT;
  const totalBalance  = funds.reduce((s, f) => s + f.balance, 0);

  const segControl = (
    <SegmentedControl
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key as Tab)}
      options={[
        { key: 'funds',        label: `Funds  ${funds.length}` },
        { key: 'transactions', label: `My Transactions  ${myTxns.length}` },
      ]}
    />
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        // Compact format (e.g. ₱1.2M) keeps large balances from wrapping on smaller devices
        title={formatCurrency(totalBalance, true)}
        subtitle="Total Fund Balance"
        bottomSlot={segControl}
      />

      {isLoading ? (
        <SkeletonList />
      ) : eF ? (
        <ErrorState onRetry={rF} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => { rF(); rT(); }} tintColor={Colors.accent} />}
        >
          {activeTab === 'funds' ? (
            funds.length === 0
              ? <EmptyState icon="wallet-outline" title="No funds" subtitle="No funds have been created yet." />
              : funds.map((fund) => <FundCard key={fund.id} item={fund} />)
          ) : (
            myTxns.length === 0
              ? <EmptyState icon="receipt-outline" title="No transactions" subtitle="You have no transaction records yet." />
              : myTxns.map((txn) => (
                <TransactionRow key={txn.id} item={txn} onPress={() => router.push(`/(tabs)/finances/${txn.id}` as any)} />
              ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.xs },
});
