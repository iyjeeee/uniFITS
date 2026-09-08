// components/ui/HeroStatCard.tsx — Large accent-colored hero card for a primary KPI (2026 refresh)
// Solid accent background + decorative offset circle, primary value, optional row of inline sub-stats
// Used on Home dashboard for Fund Balance — gives the most important number visual priority
// instead of competing equally with secondary StatCards

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius } from '@/constants/theme';
import { PressableScale } from './PressableScale';

interface SubStat {
  label: string;
  value: string;
}

interface HeroStatCardProps {
  label:     string;
  value:     string;
  subStats?: SubStat[];
  color?:    string;
  onPress?:  () => void;
  style?:    ViewStyle;
}

export function HeroStatCard({
  label, value, subStats, color = Colors.accent, onPress, style,
}: HeroStatCardProps) {
  const cardStyle = [styles.card, { backgroundColor: color }, style];

  const inner = (
    <>
      {/* Decorative offset circle — gives the flat color block some depth without a gradient dependency */}
      <View style={styles.decorCircle} pointerEvents="none" />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      {subStats && subStats.length > 0 && (
        <View style={styles.subRow}>
          {subStats.map((s) => (
            <View key={s.label} style={styles.subStat}>
              <Text style={styles.subLabel}>{s.label}</Text>
              <Text style={styles.subValue} numberOfLines={1}>{s.value}</Text>
            </View>
          ))}
        </View>
      )}
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
    borderRadius: Radius.xl,
    padding:      Spacing.md + 2,
    overflow:     'hidden',
    position:     'relative',
  },
  decorCircle: {
    position:        'absolute',
    top:             -30,
    right:           -30,
    width:           110,
    height:          110,
    borderRadius:    Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  value: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.xxxl,
    color:      Colors.white,
    marginBottom: Spacing.sm,
  },
  subRow: {
    flexDirection: 'row',
    gap:           Spacing.md,
  },
  subStat: { gap: 1 },
  subLabel: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      'rgba(255,255,255,0.6)',
  },
  subValue: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.md,
    color:      Colors.white,
  },
});
