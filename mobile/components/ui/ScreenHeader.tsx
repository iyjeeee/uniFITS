// components/ui/ScreenHeader.tsx — Screen title bar for custom headers
// Shows title, optional subtitle, optional back button, optional right action

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, FontSize, Spacing, Layout } from '@/constants/theme';

interface ScreenHeaderProps {
  title:        string;
  subtitle?:    string;
  showBack?:    boolean;
  rightAction?: React.ReactNode;
  style?:       ViewStyle;
  dark?:        boolean;    // Dark variant for auth screens
}

export function ScreenHeader({
  title, subtitle, showBack = false, rightAction, style, dark = false,
}: ScreenHeaderProps) {
  const insets   = useSafeAreaInsets();
  const textColor = dark ? Colors.textOnDark : Colors.textPrimary;
  const subColor  = dark ? 'rgba(249,250,251,0.65)' : Colors.textMuted;

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + Spacing.sm },
      dark && { backgroundColor: Colors.primary },
      style,
    ]}>
      <View style={styles.inner}>
        {/* Back button */}
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            {/* Chevron left SVG via unicode — no icon lib needed */}
            <Text style={[styles.backIcon, { color: textColor }]}>‹</Text>
          </TouchableOpacity>
        )}

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: subColor }]} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {/* Right action slot */}
        {rightAction ? (
          <View style={styles.right}>{rightAction}</View>
        ) : (
          showBack && <View style={styles.rightPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderInner,
    paddingBottom:     Spacing.sm,
    paddingHorizontal: Layout.SCREEN_PADDING_H,
  },
  inner: {
    flexDirection:  'row',
    alignItems:     'center',
    minHeight:      Layout.HEADER_HEIGHT - Spacing.sm,
    gap:            Spacing.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  backIcon: {
    fontSize:   28,
    lineHeight: 32,
    fontFamily: Typography.fontBody,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xl,
  },
  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    marginTop:  2,
  },
  right: {
    flexShrink: 0,
  },
  rightPlaceholder: {
    width: 32,
  },
});
