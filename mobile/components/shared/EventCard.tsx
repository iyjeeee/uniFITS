// components/shared/EventCard.tsx — Tappable event list card
// Shows: title, date/time (12hr), location, status badge, funding progress

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { Event } from '@/types';
import { formatDate, fmt12 } from '@/utils/formatters';
import { statusBorderColor } from '@/utils/statusColors';
import { StatusBadge, FundingProgress } from '@/components/ui';

interface EventCardProps {
  item:    Event;
  onPress: () => void;
  style?:  ViewStyle;
}

export function EventCard({ item, onPress, style }: EventCardProps) {
  const accentColor = statusBorderColor(item.status);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: accentColor }, style]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>

      {/* Date + time */}
      <Text style={styles.datetime}>
        📅 {formatDate(item.event_date, 'long')}  ·  🕐 {fmt12(item.event_time)}
      </Text>

      {/* Location */}
      <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>

      {/* Funding progress */}
      <FundingProgress
        current={item.current_funding}
        target={item.target_funding}
        color={accentColor}
        style={styles.progress}
      />
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
    gap:             Spacing.sm,
  },
  header: {
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
    lineHeight: 22,
  },
  datetime: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
  },
  location: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
  },
  progress: {
    marginTop: Spacing.xs,
  },
});
