// components/ui/Card.tsx — White rounded content surface
// Base block for all content sections; mirrors website's Card component
// Supports optional press handler for tappable cards (uses PressableScale for tap feedback)

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Layout, Shadow } from '@/constants/theme';
import { PressableScale } from './PressableScale';

interface CardProps {
  children:  React.ReactNode;
  style?:    ViewStyle;
  onPress?:  () => void;
  testID?:   string;
}

export function Card({ children, style, onPress, testID }: CardProps) {
  if (onPress) {
    return (
      <PressableScale onPress={onPress} testID={testID} style={[styles.card, style]}>
        {children}
      </PressableScale>
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
