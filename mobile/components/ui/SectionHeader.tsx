// components/ui/SectionHeader.tsx — Bold section title with optional count pill

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius } from '@/constants/theme';

interface SectionHeaderProps {
  title:  string;
  count?: number;
  style?: ViewStyle;
}

export function SectionHeader({ title, count, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined && (
        <View style={styles.pill}>
          <Text style={styles.pillText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Spacing.xs,
    marginBottom:   Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
  },
  pill: {
    backgroundColor: Colors.accentLight,
    borderRadius:    Radius.full,
    paddingHorizontal: 7,
    paddingVertical:   1,
  },
  pillText: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.xs,
    color:      Colors.accent,
  },
});
