// app/(tabs)/finances/[id].tsx — Transaction detail screen

import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import {
  AppHeader, LoadingSpinner, ErrorState,
  StatusBadge, Badge, Divider, InfoRow,
} from '@/components/ui';
import { transactionsService } from '@/services/transactions.service';
import { formatDate, formatCurrency } from '@/utils/formatters';

const ENTRY_VARIANT: Record<string, 'success' | 'info' | 'danger'> = {
  contribution: 'success',
  income:       'info',
  expense:      'danger',
};

export default function TransactionDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const insets  = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['transaction', id],
    queryFn:  () => transactionsService.getTransactionById(id),
    enabled:  !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) return <ErrorState onRetry={refetch} />;

  const isExpense   = data.entry_type === 'expense';
  const amountColor = isExpense ? Colors.danger : Colors.success;

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Transaction Details"
        subtitle={data.fund}
        showBack
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount hero card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <Badge variant={ENTRY_VARIANT[data.entry_type] ?? 'neutral'}>
              {data.entry_type.charAt(0).toUpperCase() + data.entry_type.slice(1)}
            </Badge>
            <StatusBadge status={data.status} />
          </View>
          <Text style={[styles.amount, { color: amountColor }]}>
            {isExpense ? '−' : '+'}{formatCurrency(data.amount)}
          </Text>
          <Text style={styles.fundName}>{data.fund}</Text>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <Divider style={{ marginVertical: Spacing.sm }} />
          <InfoRow label="Reference No."  value={data.reference_number} />
          <Divider />
          <InfoRow label="Date"           value={formatDate(data.transaction_date, 'long')} />
          <Divider />
          <InfoRow label="Payment Method" value={data.payment_method} />
          <Divider />
          <InfoRow label="Category"       value={data.category.charAt(0).toUpperCase() + data.category.slice(1)} />
          <Divider />
          <InfoRow label="Status"         value={<StatusBadge status={data.status} />} />
          {!!data.description && (
            <>
              <Divider />
              <InfoRow label="Description" value={data.description} />
            </>
          )}
          {!!data.user_name && (
            <>
              <Divider />
              <InfoRow label="Member" value={data.user_name} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.bgApp },
  content:     { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderCard,
    padding: Layout.CARD_PADDING, gap: Spacing.sm,
  },
  badgeRow:     { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  amount:       { fontFamily: Typography.fontDisplay, fontSize: FontSize.xxxl, lineHeight: 38 },
  fundName:     { fontFamily: Typography.fontBodyMedium, fontSize: FontSize.base, color: Colors.textSecondary },
  sectionTitle: { fontFamily: Typography.fontBodySemiBold, fontSize: FontSize.md, color: Colors.textPrimary },
});
