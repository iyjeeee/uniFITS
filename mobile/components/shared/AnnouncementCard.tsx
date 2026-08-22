// components/shared/AnnouncementCard.tsx — Compact tappable announcement card
// Matches style of ProjectCard / EventCard — left border, key info only, tap to view detail
// Title/preview given stronger size+color contrast for scannability; PressableScale gives tap feedback

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Layout, Shadow } from '@/constants/theme';
import { Announcement } from '@/types';
import { relativeTime, truncate } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { PressableScale } from '@/components/ui/PressableScale';

interface AnnouncementCardProps {
  item:    Announcement;
  onPress: () => void;
  style?:  ViewStyle;
}

export function AnnouncementCard({ item, onPress, style }: AnnouncementCardProps) {
  const borderColor = item.is_pinned ? Colors.accent : Colors.info;

  return (
    <PressableScale
      onPress={onPress}
      style={[styles.card, { borderLeftColor: borderColor }, style]}
      accessibilityLabel={`${item.is_pinned ? 'Pinned announcement' : 'Announcement'}: ${item.title}`}
    >
      {/* Header row: title + pinned badge */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.is_pinned && (
          <Badge variant="accent" style={styles.badge}>Pinned</Badge>
        )}
      </View>

      {/* Content preview — 2 lines max, muted so the title reads first */}
      <Text style={styles.preview} numberOfLines={2}>
        {truncate(item.content, 120)}
      </Text>

      {/* Footer: author + time + chevron */}
      <View style={styles.footer}>
        <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
        <Text style={styles.author} numberOfLines={1}>{item.created_by}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.time}>{relativeTime(item.created_at)}</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={styles.chevron} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    borderLeftWidth: Layout.STATUS_BAR_WIDTH,
    padding:         Layout.CARD_PADDING,
    marginBottom:    Spacing.sm,
    gap:             Spacing.xs,
    ...Shadow.sm,
  },
  headerRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    gap:            Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontBodyBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
    flex:       1,
    lineHeight: 21,
  },
  badge:   { flexShrink: 0 },
  preview: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
    marginTop:     Spacing.xs,
  },
  author: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.xs,
    color:      Colors.accent,
    flex:       1,
  },
  dot: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.textMuted,
  },
  time: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.textMuted,
  },
  chevron: { marginLeft: 'auto' },
});
