// components/shared/ProjectCard.tsx — Tappable project list card
// Shows: title, type badge, status badge, location, date range, funding progress

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { Project } from '@/types';
import { formatDate } from '@/utils/formatters';
import { statusBorderColor } from '@/utils/statusColors';
import { Badge, StatusBadge, FundingProgress } from '@/components/ui';

interface ProjectCardProps {
  item:    Project;
  onPress: () => void;
  style?:  ViewStyle;
}

export function ProjectCard({ item, onPress, style }: ProjectCardProps) {
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

      {/* Type + location row */}
      <View style={styles.metaRow}>
        <Badge variant="neutral">{item.project_type}</Badge>
        <Text style={styles.location} numberOfLines={1}>📍 {item.location}</Text>
      </View>

      {/* Date range */}
      <Text style={styles.dates}>
        {formatDate(item.start_date, 'medium')}
        {item.start_date !== item.end_date && ` – ${formatDate(item.end_date, 'medium')}`}
      </Text>

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
  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
    flexWrap:      'wrap',
  },
  location: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
    flex:       1,
  },
  dates: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
  progress: {
    marginTop: Spacing.xs,
  },
});
