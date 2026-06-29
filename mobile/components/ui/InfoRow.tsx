// components/ui/InfoRow.tsx — Label + value horizontal pair for detail screens
// Used in profile, project detail, event detail, transaction detail

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '@/constants/theme';

interface InfoRowProps {
  label:    string;
  value:    string | React.ReactNode;
  icon?:    React.ReactNode;
  style?:   ViewStyle;
}

export function InfoRow({ label, value, icon, style }: InfoRowProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.labelCol}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.label}>{label}</Text>
      </View>
      {typeof value === 'string' ? (
        <Text style={styles.value} numberOfLines={2}>{value || '—'}</Text>
      ) : (
        <View style={styles.valueNode}>{value}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap:             Spacing.md,
  },
  labelCol: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.xs,
    flex:          1,
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
    flexShrink: 1,
  },
  value: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.base,
    color:      Colors.textPrimary,
    textAlign:  'right',
    flex:       1.5,
  },
  valueNode: {
    alignItems: 'flex-end',
  },
});
