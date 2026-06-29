// components/shared/MemberStatRow.tsx — Single stat row with icon + label + value
// Used in profile screen stats and any member-level summary display

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '@/constants/theme';

interface MemberStatRowProps {
  icon?:   string;           // Emoji icon
  label:   string;
  value:   string;
  style?:  ViewStyle;
}

export function MemberStatRow({ icon, label, value, style }: MemberStatRowProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap:            Spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    flex:          1,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.base,
    color:      Colors.textSecondary,
    flex:       1,
  },
  value: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.base,
    color:      Colors.textPrimary,
  },
});
