// components/ui/EmptyState.tsx — Centered empty placeholder for lists
// Shows a tinted icon circle (matches badge/tint pattern used elsewhere) + title + subtitle + optional action

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius } from '@/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?:     IoniconName;       // Ionicons name, shown inside a tinted circle
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
  style?:    ViewStyle;
}

export function EmptyState({ icon = 'file-tray-outline', title, subtitle, action, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={Colors.accent} />
      </View>
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
  iconCircle: {
    width:           64,
    height:          64,
    borderRadius:    Radius.full,
    backgroundColor: Colors.accentLight,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    Spacing.xs,
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
