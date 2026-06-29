// components/ui/AppHeader.tsx — Consistent dark branded page header for all screens

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Layout } from '@/constants/theme';

interface AppHeaderProps {
  title:        string;
  subtitle?:    string;
  showBack?:    boolean;
  rightSlot?:   React.ReactNode;
  bottomSlot?:  React.ReactNode;   // Extra content inside header (e.g. search, tabs)
  style?:       ViewStyle;
}

export function AppHeader({
  title, subtitle, showBack = false, rightSlot, bottomSlot, style,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.md }, style]}>
      <View style={styles.row}>
        {/* Back button */}
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={Colors.textOnDark} />
          </TouchableOpacity>
        )}

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {/* Right slot */}
        {rightSlot && <View style={styles.right}>{rightSlot}</View>}
      </View>

      {/* Optional bottom slot (e.g. segmented control inside header) */}
      {bottomSlot && <View style={styles.bottomSlot}>{bottomSlot}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor:   Colors.primary,
    paddingHorizontal: Layout.SCREEN_PADDING_H,
    paddingBottom:     Spacing.lg,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Spacing.sm,
    minHeight:      44,
  },
  backBtn: {
    marginLeft: -4,
    padding:    4,
  },
  titleBlock: {
    flex: 1,
    gap:  2,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textOnDark,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.55)',
  },
  right: {
    flexShrink: 0,
  },
  bottomSlot: {
    marginTop: Spacing.md,
  },
});