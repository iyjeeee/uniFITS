// components/ui/Avatar.tsx — Circular avatar with initials fallback
// Deterministic color from name charCode; shows photo Image if src provided
// Mirrors website's Avatar component logic exactly

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { AVATAR_COLORS, Typography } from '@/constants/theme';
import { getInitials } from '@/utils/formatters';

interface AvatarProps {
  name?: string;
  src?:  string | null;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ name = '?', src, size = 40, style }: AvatarProps) {
  // Deterministic color: same algorithm as website (charCode of first char)
  const color    = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.37);

  return (
    <View
      style={[
        styles.container,
        {
          width:           size,
          height:          size,
          borderRadius:    size / 2,
          backgroundColor: src ? 'transparent' : color,
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: '#fff' }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:      'center',
    justifyContent:  'center',
    overflow:        'hidden',
    flexShrink:      0,
  },
  initials: {
    fontFamily: Typography.fontBodyBold,
    color:      '#fff',
  },
});
