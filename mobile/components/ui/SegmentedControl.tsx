// components/ui/SegmentedControl.tsx — Two-way segmented toggle with animated sliding highlight
// Used inside AppHeader's bottomSlot (Activities, Finances screens)
// Replaces the duplicated inline segmented-tab markup that used to live in each screen

import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, LayoutChangeEvent, ViewStyle,
} from 'react-native';
import { Colors, Typography, FontSize, Radius } from '@/constants/theme';

interface SegmentOption {
  key:   string;
  label: string;
}

interface SegmentedControlProps {
  options:   SegmentOption[];
  activeKey: string;
  onChange:  (key: string) => void;
  style?:    ViewStyle;
}

export function SegmentedControl({ options, activeKey, onChange, style }: SegmentedControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX  = useRef(new Animated.Value(0)).current;
  const activeIndex = Math.max(0, options.findIndex((o) => o.key === activeKey));
  const segWidth    = containerWidth / options.length;

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  // Slide the highlight to the active segment whenever selection or layout changes
  useEffect(() => {
    if (!containerWidth) return;
    Animated.timing(translateX, {
      toValue:         activeIndex * segWidth,
      duration:        220,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, containerWidth]);

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <Animated.View
          style={[styles.indicator, { width: segWidth - 4, transform: [{ translateX }] }]}
        />
      )}
      {options.map((opt) => {
        const active = opt.key === activeKey;
        return (
          <TouchableOpacity
            key={opt.key}
            style={styles.segBtn}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
          >
            <Text style={[styles.segLabel, active && styles.segLabelActive]} numberOfLines={1}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius:    Radius.sm,
    padding:         3,
    gap:             2,
    position:        'relative',
  },
  indicator: {
    position:        'absolute',
    top:             3,
    bottom:          3,
    left:            3,
    backgroundColor: Colors.accent,
    borderRadius:    Radius.sm - 2,
  },
  segBtn: {
    flex:            1,
    paddingVertical: 10,
    alignItems:      'center',
    borderRadius:    Radius.sm - 2,
    zIndex:          1,
  },
  segLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.55)',
  },
  segLabelActive: { color: Colors.textOnDark },
});
