// components/ui/StatCard.tsx — Compact KPI stat tile
// White card with 4px left color border, icon, label, value
// Optional onPress: subtle color-tinted background + tap scale/elevation (via PressableScale) + chevron affordance
// Used on Home dashboard screen for summary KPIs

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Shadow, Layout } from '@/constants/theme';
import { PressableScale } from './PressableScale';

interface StatCardProps {
  label:    string;
  value:    string;
  color?:   string;
  icon?:    React.ReactNode;
  onPress?: () => void;
  style?:   ViewStyle;
}

export function StatCard({
  label, value, color = Colors.accent, icon, onPress, style,
}: StatCardProps) {
  const cardStyle = [
    styles.card,
    { borderLeftColor: color, backgroundColor: color + '0A' }, // faint color wash, not just the icon chip
    style,
  ];

  const inner = (
    <>
      <View style={styles.top}>
        {icon && (
          <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
            {icon}
          </View>
        )}
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <View style={styles.labelRow}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        {onPress && <Ionicons name="chevron-forward" size={13} color={Colors.textMuted} />}
      </View>
    </>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={cardStyle} accessibilityLabel={`${label}: ${value}`}>
        {inner}
      </PressableScale>
    );
  }

  return <View style={cardStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    borderLeftWidth: Layout.STATUS_BAR_WIDTH,
    padding:         Layout.CARD_PADDING,
    flex:            1,
    minHeight:       108,   // guarantees all 4 KPI tiles match regardless of value/label text length
    justifyContent:  'space-between',
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
  labelRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
});
