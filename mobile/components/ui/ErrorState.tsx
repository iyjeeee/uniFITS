// components/ui/ErrorState.tsx — Error placeholder with retry button

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing } from '@/constants/theme';
import { Button } from './Button';

interface ErrorStateProps {
  message?:  string;
  onRetry?:  () => void;
  style?:    ViewStyle;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} variant="ghost" size="sm" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical:   Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap:               Spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  message: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
  },
});
