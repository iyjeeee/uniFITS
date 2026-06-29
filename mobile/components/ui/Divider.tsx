// components/ui/Divider.tsx — Thin horizontal section separator

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height:          1,
    backgroundColor: Colors.borderInner,
    width:           '100%',
  },
});
