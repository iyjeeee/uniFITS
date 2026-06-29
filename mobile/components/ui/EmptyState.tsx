// components/ui/EmptyState.tsx — Centered empty placeholder for lists
// Shows icon + title + subtitle + optional action button

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '@/constants/theme';

interface EmptyStateProps {
  icon?:     string;           // Emoji or symbol character
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
  style?:    ViewStyle;
}

export function EmptyState({ icon = '📭', title, subtitle, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap:            Spacing.sm,
  },
  icon: {
    fontSize:     40,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
    textAlign:  'center',
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textMuted,
    textAlign:  'center',
    lineHeight: 22,
  },
  action: {
    marginTop: Spacing.md,
  },
});
