// components/ui/SectionHeader.tsx — Section title with accent bar, count pill, bottom divider,
// and optional "View All" action. Gives list sections (Pinned, Recent Announcements, etc.)
// clear visual separation instead of floating plain text on the screen background.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius } from '@/constants/theme';

interface SectionHeaderProps {
  title:        string;
  count?:       number;
  actionLabel?: string;      // e.g. "View All" — renders a right-aligned link with chevron
  onAction?:    () => void;
  style?:       ViewStyle;
}

export function SectionHeader({ title, count, actionLabel, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.leftGroup}>
        <View style={styles.accentBar} />
        <Text style={styles.title}>{title}</Text>
        {count !== undefined && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{count}</Text>
          </View>
        )}
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={styles.actionBtn}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    marginBottom:       Spacing.sm,
    paddingBottom:      Spacing.xs,
    borderBottomWidth:  1.5,
    borderBottomColor:  Colors.borderInner,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.xs,
  },
  accentBar: {
    width:           4,
    height:          16,
    borderRadius:    Radius.full,
    backgroundColor: Colors.accent,
  },
  title: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
  },
  pill: {
    backgroundColor:   Colors.accentLight,
    borderRadius:      Radius.full,
    paddingHorizontal: 7,
    paddingVertical:   1,
  },
  pillText: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.xs,
    color:      Colors.accent,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           2,
  },
  actionText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.accent,
  },
});
