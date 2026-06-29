// components/ui/Badge.tsx — Solid colored pill label
// Variants: accent, success, danger, warning, info, neutral
// Mirrors website's Badge component color system exactly

import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, Typography, Radius } from '@/constants/theme';
import { BadgeVariant } from '@/types';

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  accent:  { bg: Colors.accent,   text: '#fff', border: '#3D52A0' },
  success: { bg: Colors.success,  text: '#fff', border: '#256642' },
  danger:  { bg: Colors.danger,   text: '#fff', border: '#A93226' },
  warning: { bg: Colors.warning,  text: '#fff', border: '#B7770D' },
  info:    { bg: Colors.info,     text: '#fff', border: '#1A5C87' },
  neutral: { bg: '#5A6474',       text: '#fff', border: '#4A5264' },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Badge({ variant = 'neutral', children, style }: BadgeProps) {
  const s = BADGE_STYLES[variant];
  return (
    <View style={[styles.container, { backgroundColor: s.bg, borderColor: s.border }, style]}>
      <Text style={[styles.text, { color: s.text }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf:       'flex-start',
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: 9,
    paddingVertical:   2,
    borderRadius:    Radius.full,
    borderWidth:     1,
  },
  text: {
    fontFamily:    Typography.fontBodySemiBold,
    fontSize:      FontSize.xs,
    letterSpacing: 0.2,
  },
});
