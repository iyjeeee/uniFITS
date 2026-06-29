// components/shared/FundCard.tsx — Fund overview card for Finances screen
// Shows: fund name, type badge, balance, status, description

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { Fund } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Badge, StatusBadge } from '@/components/ui';

interface FundCardProps {
  item:   Fund;
  style?: ViewStyle;
}

export function FundCard({ item, style }: FundCardProps) {
  return (
    <View style={[styles.card, style]}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.namePill}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Balance */}
      <Text style={styles.balance}>{formatCurrency(item.balance)}</Text>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <Badge variant={item.fund_type === 'external' ? 'info' : 'neutral'}>
          {item.fund_type === 'external' ? 'External' : 'Internal'}
        </Badge>
        {item.is_required && <Badge variant="warning">Required</Badge>}
      </View>

      {/* Description */}
      {item.description && (
        <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    borderLeftWidth: Layout.STATUS_BAR_WIDTH,
    borderLeftColor: Colors.accent,
    padding:         Layout.CARD_PADDING,
    marginBottom:    Spacing.sm,
    gap:             Spacing.sm,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            Spacing.sm,
  },
  namePill: {
    flex: 1,
  },
  name: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
  },
  balance: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.xxl,
    color:      Colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    gap:           Spacing.xs,
    flexWrap:      'wrap',
  },
  desc: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
    lineHeight: 20,
  },
});
