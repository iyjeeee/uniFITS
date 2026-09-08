// components/ui/StatCard.tsx — Compact KPI stat tile (2026 refresh)
// Plain white rounded card, colored icon chip, value, label — no left border stripe
// (color now lives in the icon chip, not a stripe, matching the HeroStatCard/bento language)
// Optional onPress: tap scale/elevation (via PressableScale) + chevron affordance

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
  const cardStyle = [styles.card, style];

  const inner = (
    <>
      {icon && (
        <View style={[styles.iconWrap, { backgroundColor: color + '1F' }]}>
          {icon}
        </View>
      )}
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
    backgroundColor: Colors.white,
    borderRadius:    Radius.lg,
    padding:         Layout.CARD_PADDING,
    flex:            1,
    minHeight:       108,   // guarantees all tiles in a grid match regardless of value/label text length
    justifyContent:  'space-between',
    ...Shadow.sm,
  },
  iconWrap: {
    width:          36,
    height:         36,
    borderRadius:   Radius.md,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   Spacing.xs,
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
