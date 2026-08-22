// components/ui/Button.tsx — Primary interactive button component
// Variants: primary, secondary, ghost, danger, success
// Sizes: sm, md, lg — supports loading spinner and disabled state

import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, View, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Typography, FontSize, Radius, Spacing } from '@/constants/theme';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type BtnSize    = 'sm' | 'md' | 'lg';

const VARIANT_STYLES: Record<BtnVariant, { bg: string; text: string; border: string; pressedBg: string }> = {
  primary:   { bg: Colors.accent,        text: Colors.white, border: Colors.accent,        pressedBg: Colors.accentPressed },
  secondary: { bg: Colors.neutral,       text: Colors.white, border: Colors.neutralBorder, pressedBg: Colors.neutralBorder },
  ghost:     { bg: 'transparent',        text: Colors.accent, border: 'transparent',        pressedBg: Colors.accentLight },
  danger:    { bg: Colors.danger,        text: Colors.white, border: Colors.danger,        pressedBg: Colors.dangerBorder },
  success:   { bg: Colors.success,       text: Colors.white, border: Colors.success,        pressedBg: Colors.successBorder },
};

const SIZE_STYLES: Record<BtnSize, { paddingV: number; paddingH: number; fontSize: number }> = {
  sm: { paddingV: 6,  paddingH: 12, fontSize: FontSize.sm   },
  md: { paddingV: 9,  paddingH: 18, fontSize: FontSize.base },
  lg: { paddingV: 12, paddingH: 24, fontSize: FontSize.md   },
};

interface ButtonProps {
  title:     string;
  onPress?:  () => void;
  variant?:  BtnVariant;
  size?:     BtnSize;
  loading?:  boolean;
  disabled?: boolean;
  icon?:     React.ReactNode;
  style?:    ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, style, textStyle, fullWidth = false,
}: ButtonProps) {
  const v      = VARIANT_STYLES[variant];
  const s      = SIZE_STYLES[size];
  const isOff  = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isOff}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isOff, busy: loading }}
      style={[
        styles.base,
        {
          paddingVertical:   s.paddingV,
          paddingHorizontal: s.paddingH,
          backgroundColor:   isOff ? Colors.border : v.bg,
          borderColor:       isOff ? Colors.border : v.border,
          alignSelf:         fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {/* Loading spinner replaces icon */}
      {loading ? (
        <ActivityIndicator size="small" color={isOff ? Colors.textMuted : v.text} />
      ) : icon ? (
        <View style={{ marginRight: Spacing.xs }}>{icon}</View>
      ) : null}
      <Text
        style={[
          styles.label,
          {
            fontSize:   s.fontSize,
            color:      isOff ? Colors.textMuted : v.text,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   Radius.sm,
    borderWidth:    1,
    gap:            6,
  },
  label: {
    fontFamily:  Typography.fontBodyMedium,
    letterSpacing: 0.1,
  },
});
