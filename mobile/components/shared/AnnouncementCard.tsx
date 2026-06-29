// components/shared/AnnouncementCard.tsx — Compact tappable announcement card
// Matches style of ProjectCard / EventCard — left border, key info only, tap to view detail

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { Announcement } from '@/types';
import { relativeTime, truncate } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';

interface AnnouncementCardProps {
  item:    Announcement;
  onPress: () => void;
  style?:  ViewStyle;
}

export function AnnouncementCard({ item, onPress, style }: AnnouncementCardProps) {
  const borderColor = item.is_pinned ? Colors.accent : Colors.info;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: borderColor }, style]}
    >
      {/* Header row: title + pinned badge */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {item.is_pinned && (
          <Badge variant="accent" style={styles.badge}>Pinned</Badge>
        )}
      </View>

      {/* Content preview — 2 lines max */}
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
    </TouchableOpacity>
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
    shadowColor:     '#4B5EAA',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.06,
    shadowRadius:    6,
    elevation:       2,
  },
  headerRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    gap:            Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textPrimary,
    flex:       1,
    lineHeight: 20,
  },
  badge:   { flexShrink: 0 },
  preview: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
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
