// app/(tabs)/announcements/index.tsx — Announcements feed with compact cards
// Uses ScrollView (not FlatList) so Pinned + All Announcements can each sit in their own Section panel

import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, ErrorState, EmptyState, Section, SkeletonList, FadeInUp } from '@/components/ui';
import { AnnouncementCard }     from '@/components/shared/AnnouncementCard';
import { announcementsService } from '@/services/announcements.service';
import { useRefreshOnFocus }    from '@/hooks/useRefreshOnFocus';
import { useBottomPadding }     from '@/hooks/useBottomPadding';

export default function AnnouncementsScreen() {
  const bottomPad = useBottomPadding();

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn:  announcementsService.getAnnouncements,
  });

  useRefreshOnFocus(refetch);

  const pinned  = data.filter((a) => a.is_pinned);
  const regular = data.filter((a) => !a.is_pinned);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Announcements"
        subtitle="News & updates from your organization"
      />

      {isLoading ? (
        <SkeletonList />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : data.length === 0 ? (
        <EmptyState
          icon="megaphone-outline"
          title="No announcements"
          subtitle="Check back later for updates from your organization."
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={Colors.accent} />}
        >
          {pinned.length > 0 && (
            <FadeInUp delay={0}>
              <Section title="Pinned" count={pinned.length}>
                {pinned.map((item) => (
                  <AnnouncementCard
                    key={item.id}
                    item={item}
                    variant="flat"
                    onPress={() => router.push(`/(tabs)/announcements/${item.id}` as any)}
                  />
                ))}
              </Section>
            </FadeInUp>
          )}

          {regular.length > 0 && (
            <FadeInUp delay={pinned.length > 0 ? 100 : 0}>
              <Section title="All Announcements" count={regular.length}>
                {regular.map((item) => (
                  <AnnouncementCard
                    key={item.id}
                    item={item}
                    variant="flat"
                    onPress={() => router.push(`/(tabs)/announcements/${item.id}` as any)}
                  />
                ))}
              </Section>
            </FadeInUp>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: Colors.bgApp },
  content: { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.lg },
});
