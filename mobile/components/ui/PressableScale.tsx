// components/ui/PressableScale.tsx — Shared tap feedback: scale-down + shadow elevation bump + haptic on press
// Wraps any card content so every tappable card in the app (StatCard, AnnouncementCard, ProjectCard,
// EventCard, TransactionRow, Card) gets identical, centralized press feedback — avoids each
// component duplicating its own Animated.Value/press-state boilerplate.

import React, { useRef, useState } from 'react';
import { Pressable, Animated, StyleProp, ViewStyle, AccessibilityRole } from 'react-native';
import { Shadow } from '@/constants/theme';
import { hapticTap } from '@/utils/haptics';

interface PressableScaleProps {
  onPress:             () => void;
  style?:              StyleProp<ViewStyle>;
  children:            React.ReactNode;
  accessibilityRole?:  AccessibilityRole;
  accessibilityLabel?: string;
  testID?:             string;
}

export function PressableScale({
  onPress, style, children, accessibilityRole = 'button', accessibilityLabel, testID,
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  function handlePressIn() {
    setPressed(true);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  }
  function handlePressOut() {
    setPressed(false);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();
  }
  function handlePress() {
    hapticTap();
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <Animated.View style={[style, pressed && Shadow.md, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
