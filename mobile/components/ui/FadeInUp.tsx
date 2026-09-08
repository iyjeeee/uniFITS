// components/ui/FadeInUp.tsx — Fade + slide-up entrance animation on mount
// Wrap a screen's top-level blocks (hero card, KPI row, sections) with staggered `delay`
// values to give the page a gentle cascading-in feel instead of just appearing instantly.
// Runs once per mount — cheap, no dependency on reanimated.

import React, { useRef, useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeInUpProps {
  children: React.ReactNode;
  delay?:   number;    // ms before this block starts animating in
  style?:   ViewStyle;
}

export function FadeInUp({ children, delay = 0, style }: FadeInUpProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, speed: 16, bounciness: 4 }),
    ]);
    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
