// app/(tabs)/announcements/index.tsx — Announcements feed with compact cards

import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, LoadingSpinner, ErrorState, EmptyState, SectionHeader } from '@/components/ui';
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

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error)     return <ErrorState onRetry={refetch} />;

  const pinned  = data.filter((a) => a.is_pinned);
  const regular = data.filter((a) => !a.is_pinned);

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Announcements"
        subtitle="News & updates from your organization"
      />

      <FlatList
        data={regular}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            {pinned.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title="Pinned" count={pinned.length} />
                {pinned.map((item) => (
                  <AnnouncementCard
                    key={item.id}
                    item={item}
                    onPress={() => router.push(`/(tabs)/announcements/${item.id}` as any)}
                  />
                ))}
              </View>
            )}
            {regular.length > 0 && (
              <SectionHeader
                title="All Announcements"
                count={regular.length}
                style={styles.allHeader}
              />
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <AnnouncementCard
            item={item}
            onPress={() => router.push(`/(tabs)/announcements/${item.id}` as any)}
          />
        )}
        ListEmptyComponent={
          pinned.length === 0 ? (
            <EmptyState
              icon="📢"
              title="No announcements"
              subtitle="Check back later for updates from your organization."
            />
          ) : null
        }
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={Colors.accent} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Colors.bgApp },
  list:      { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md },
  section:   { marginBottom: Spacing.md },
  allHeader: { marginBottom: Spacing.sm },
});
