// app/(tabs)/announcements/[id].tsx — Announcement detail screen

import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import { AppHeader, LoadingSpinner, ErrorState, Badge, Divider } from '@/components/ui';
import { announcementsService } from '@/services/announcements.service';
import { formatDate, relativeTime } from '@/utils/formatters';

export default function AnnouncementDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const insets   = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['announcement', id],
    queryFn:  () => announcementsService.getAnnouncementById(id),
    enabled:  !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) return <ErrorState onRetry={refetch} />;

  return (
    <View style={styles.screen}>
      <AppHeader
        title={data.is_pinned ? 'Pinned Announcement' : 'Announcement'}
        subtitle={data.title}
        showBack
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={[styles.card, data.is_pinned && styles.pinnedCard]}>
          {/* Pinned accent bar */}
          {data.is_pinned && <View style={styles.pinnedBar} />}

          <View style={styles.cardBody}>
            {/* Badges */}
            <View style={styles.badgeRow}>
              {data.is_pinned && <Badge variant="accent">📌 Pinned</Badge>}
            </View>

            {/* Title */}
            <Text style={styles.title}>{data.title}</Text>

            <Divider />

            {/* Full content */}
            <Text style={styles.contentText}>{data.content}</Text>

            <Divider />

            {/* Meta */}
            <View style={styles.meta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Posted by</Text>
                <Text style={styles.metaValue}>{data.created_by}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{formatDate(data.created_at, 'long')}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Time</Text>
                <Text style={styles.metaValue}>{relativeTime(data.created_at)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.bgApp },
  content:    { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md },
  card: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.md,
    borderWidth:     1.5,
    borderColor:     Colors.borderCard,
    overflow:        'hidden',
  },
  pinnedCard: { borderColor: Colors.accent },
  pinnedBar:  { height: 4, backgroundColor: Colors.accent },
  cardBody:   { padding: Layout.CARD_PADDING, gap: Spacing.md },
  badgeRow:   { flexDirection: 'row', gap: Spacing.xs },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textPrimary,
    lineHeight: 30,
  },
  contentText: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textSecondary,
    lineHeight: 24,
  },
  meta:    { gap: Spacing.sm },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textMuted,
  },
  metaValue: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.sm,
    color:      Colors.textPrimary,
    textAlign:  'right',
    flex:       1,
    marginLeft: Spacing.md,
  },
});
