// components/ui/Skeleton.tsx — Pulsing placeholder blocks shown while list data loads
// SkeletonBlock: single pulsing rectangle, compose freely for custom layouts (headers, stats)
// SkeletonCard / SkeletonList: pre-built card-shaped placeholders for FlatList/ScrollView screens

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { Colors, Radius, Spacing, Layout } from '@/constants/theme';

/** Looping fade pulse — shared by every skeleton block so they animate in sync */
function usePulse() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return opacity;
}

interface SkeletonBlockProps {
  width?:  DimensionValue;
  height?: number;
  style?:  ViewStyle;
}

export function SkeletonBlock({ width = '100%', height = 14, style }: SkeletonBlockProps) {
  const opacity = usePulse();
  return <Animated.View style={[styles.block, { width, height, opacity }, style]} />;
}

/** SkeletonCard — mimics a list card's shape: title line + two meta lines */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonBlock width="70%" height={16} />
      <SkeletonBlock width="45%" height={12} style={{ marginTop: Spacing.sm }} />
      <SkeletonBlock width="90%" height={12} style={{ marginTop: Spacing.xs }} />
    </View>
  );
}

/** SkeletonList — stack of SkeletonCards; drop-in replacement for <LoadingSpinner fullScreen /> on list screens */
export function SkeletonList({ count = 4, style }: { count?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.list, style]}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: Colors.borderInner,
    borderRadius:    Radius.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    padding:         Layout.CARD_PADDING,
    marginBottom:    Spacing.sm,
  },
  list: {
    padding:    Layout.SCREEN_PADDING_H,
    paddingTop: Spacing.md,
  },
});
