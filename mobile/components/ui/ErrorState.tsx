// components/ui/ErrorState.tsx — Error placeholder with retry button
// Uses a tinted danger icon circle instead of a raw emoji, matching EmptyState

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius } from '@/constants/theme';
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
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={28} color={Colors.danger} />
      </View>
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
  iconCircle: {
    width:           64,
    height:          64,
    borderRadius:    Radius.full,
    backgroundColor: Colors.dangerLight,
    alignItems:      'center',
    justifyContent:  'center',
  },
  message: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
  },
});
