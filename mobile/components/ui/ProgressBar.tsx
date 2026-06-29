// components/ui/ProgressBar.tsx — Horizontal fill progress bar

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;       // 0–1 float
  color?:   string;
  height?:  number;
  style?:   ViewStyle;
}

export function ProgressBar({
  progress, color = Colors.accent, height = 7, style,
}: ProgressBarProps) {
  const fill = Math.min(1, Math.max(0, progress));
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width: `${fill * 100}%` as any, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: Colors.borderCard,
    borderRadius:    Radius.full,
    overflow:        'hidden',
    width:           '100%',
  },
  fill: {
    borderRadius: Radius.full,
  },
});
