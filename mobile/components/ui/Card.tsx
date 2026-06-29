// components/ui/Card.tsx — White rounded content surface
// Base block for all content sections; mirrors website's Card component
// Supports optional press handler for tappable cards

import React from 'react';
import {
  View, TouchableOpacity, StyleSheet, ViewStyle,
} from 'react-native';
import { Colors, Radius, Layout, Shadow } from '@/constants/theme';

interface CardProps {
  children:  React.ReactNode;
  style?:    ViewStyle;
  onPress?:  () => void;
  testID?:   string;
}

export function Card({ children, style, onPress, testID }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        testID={testID}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    overflow:        'hidden',
    ...Shadow.sm,
  },
});
