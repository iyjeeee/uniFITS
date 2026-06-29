// components/ui/StatCard.tsx — Compact KPI stat tile
// White card with 4px left color border, icon, label, value
// Used on Home dashboard screen for summary KPIs

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow, Layout } from '@/constants/theme';

interface StatCardProps {
  label:   string;
  value:   string;
  color?:  string;
  icon?:   React.ReactNode;
  style?:  ViewStyle;
}

export function StatCard({
  label, value, color = Colors.accent, icon, style,
}: StatCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color }, style]}>
      <View style={styles.top}>
        {icon && (
          <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
            {icon}
          </View>
        )}
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
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
    padding:         Layout.CARD_PADDING,
    flex:            1,
    gap:             Spacing.xs,
    ...Shadow.sm,
  },
  top: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    marginBottom:   Spacing.xs,
  },
  iconWrap: {
    width:          34,
    height:         34,
    borderRadius:   Radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.xl,
    color:      Colors.textPrimary,
    lineHeight: 26,
  },
  label: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
});
