// components/shared/TransactionRow.tsx — Transaction list row item
// Shows: entry type, fund name, amount, date, status badge; left color border
// PressableScale gives consistent scale + elevation tap feedback (matches other shared cards)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Layout, Shadow } from '@/constants/theme';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { statusBorderColor } from '@/utils/statusColors';
import { StatusBadge } from '@/components/ui';
import { PressableScale } from '@/components/ui/PressableScale';

interface TransactionRowProps {
  item:     Transaction;
  onPress:  () => void;
  variant?: 'elevated' | 'flat';
  style?:   ViewStyle;
}

// Entry type label + color
const ENTRY_LABELS: Record<string, { label: string; color: string }> = {
  contribution: { label: 'Contribution', color: Colors.success },
  income:       { label: 'Income',       color: Colors.info    },
  expense:      { label: 'Expense',      color: Colors.danger  },
};

export function TransactionRow({ item, onPress, variant = 'elevated', style }: TransactionRowProps) {
  const entry        = ENTRY_LABELS[item.entry_type] || { label: item.entry_type, color: Colors.textMuted };
  const borderColor  = statusBorderColor(item.status);
  const isExpense    = item.entry_type === 'expense';
  const isFlat       = variant === 'flat';

  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.row,
        isFlat ? styles.rowFlat : styles.rowElevated,
        { borderLeftColor: borderColor },
        style,
      ]}
      accessibilityLabel={`${entry.label} of ${formatCurrency(item.amount)}, ${item.status}`}
    >
      {/* Left: type + fund + description */}
      <View style={styles.left}>
        <Text style={[styles.entryType, { color: entry.color }]}>{entry.label}</Text>
        <Text style={styles.fund} numberOfLines={1}>{item.fund}</Text>
        {item.description && (
          <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
        )}
      </View>

      {/* Right: amount + date + status */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isExpense ? Colors.danger : Colors.textPrimary }]}>
          {isExpense ? '−' : ''}{formatCurrency(item.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(item.transaction_date, 'short')}</Text>
        <StatusBadge status={item.status} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    borderLeftWidth: Layout.STATUS_BAR_WIDTH,
    padding:         Layout.CARD_PADDING,
    flexDirection:   'row',
    alignItems:      'flex-start',
    justifyContent:  'space-between',
    gap:             Spacing.sm,
  },
  rowElevated: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.sm,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderInner,
    marginBottom:    Spacing.sm,
    ...Shadow.sm,
  },
  rowFlat: {
    backgroundColor: Colors.subCard,
    borderRadius:    Radius.sm,
    marginBottom:    Spacing.xs,
  },
  left: {
    flex: 1,
    gap:  2,
  },
  entryType: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  fund: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.base,
    color:      Colors.textPrimary,
  },
  desc: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
    gap:        Spacing.xs,
  },
  amount: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.md,
  },
  date: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
});
