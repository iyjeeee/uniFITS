// components/ui/FundingProgress.tsx — Combined funding bar + ₱ labels + percent
// Used in project cards, event cards, and their detail screens

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '@/constants/theme';
import { ProgressBar } from './ProgressBar';
import { formatCurrency, fundingPercent } from '@/utils/formatters';

interface FundingProgressProps {
  current: number;
  target:  number;
  color?:  string;
  style?:  ViewStyle;
}

export function FundingProgress({
  current, target, color = Colors.accent, style,
}: FundingProgressProps) {
  const pct      = fundingPercent(current, target);
  const progress = pct / 100;

  return (
    <View style={[styles.wrapper, style]}>
      {/* Amount row */}
      <View style={styles.row}>
        <Text style={styles.label}>Funding Progress</Text>
        <Text style={[styles.percent, { color }]}>{pct}%</Text>
      </View>

      {/* Progress bar */}
      <ProgressBar progress={progress} color={color} />

      {/* ₱ labels */}
      <View style={styles.row}>
        <Text style={styles.current}>{formatCurrency(current, true)}</Text>
        <Text style={styles.target}>of {formatCurrency(target, true)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  label: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
  percent: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.sm,
  },
  current: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.sm,
    color:      Colors.textPrimary,
  },
  target: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
});
