// components/ui/LoadingSpinner.tsx — Centered ActivityIndicator
// fullScreen prop centers vertically in available space

import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  color?:      string;
  size?:       'small' | 'large';
  style?:      ViewStyle;
}

export function LoadingSpinner({
  fullScreen = false, color = Colors.accent, size = 'large', style,
}: LoadingSpinnerProps) {
  return (
    <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  inline: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
});
