// components/shared/EventCard.tsx — Tappable event list card
// Shows: title, date/time (12hr), location, status badge, funding progress
// PressableScale gives consistent scale + elevation tap feedback (matches other shared cards)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Layout, Shadow } from '@/constants/theme';
import { Event } from '@/types';
import { formatDate, fmt12 } from '@/utils/formatters';
import { statusBorderColor } from '@/utils/statusColors';
import { StatusBadge, FundingProgress } from '@/components/ui';
import { PressableScale } from '@/components/ui/PressableScale';

interface EventCardProps {
  item:     Event;
  onPress:  () => void;
  variant?: 'elevated' | 'flat';
  style?:   ViewStyle;
}

export function EventCard({ item, onPress, variant = 'elevated', style }: EventCardProps) {
  const accentColor = statusBorderColor(item.status);
  const isFlat       = variant === 'flat';

  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.card,
        isFlat ? styles.cardFlat : styles.cardElevated,
        { borderLeftColor: accentColor },
        style,
      ]}
      accessibilityLabel={`Event: ${item.title}, ${item.status}`}
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
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: Layout.STATUS_BAR_WIDTH,
    padding:         Layout.CARD_PADDING,
    gap:             Spacing.sm,
  },
  cardElevated: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     Layout.BORDER_WIDTH,
    borderColor:     Colors.borderCard,
    marginBottom:    Spacing.sm,
    ...Shadow.sm,
  },
  cardFlat: {
    backgroundColor: Colors.subCard,
    borderRadius:    Radius.md,
    marginBottom:    Spacing.xs,
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
