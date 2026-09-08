// app/(tabs)/activities/index.tsx — Activities: Projects + Events

import { useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Spacing, Layout } from '@/constants/theme';
import { AppHeader, ErrorState, EmptyState, SegmentedControl, SkeletonList, FadeInUp } from '@/components/ui';
import { ProjectCard }     from '@/components/shared/ProjectCard';
import { EventCard }       from '@/components/shared/EventCard';
import { projectsService } from '@/services/projects.service';
import { eventsService }   from '@/services/events.service';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useBottomPadding }  from '@/hooks/useBottomPadding';

type Tab = 'projects' | 'events';

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const bottomPad = useBottomPadding();

  const { data: projects = [], isLoading: lP, error: eP, refetch: rP } =
    useQuery({ queryKey: ['projects'], queryFn: projectsService.getProjects });
  const { data: events = [],   isLoading: lE, error: eE, refetch: rE } =
    useQuery({ queryKey: ['events'],   queryFn: eventsService.getEvents });

  useRefreshOnFocus(() => { rP(); rE(); });

  const isLoading = activeTab === 'projects' ? lP : lE;
  const error     = activeTab === 'projects' ? eP : eE;
  const refetch   = activeTab === 'projects' ? rP : rE;

  // Segmented control rendered inside the dark header — animated sliding highlight
  const segmentedControl = (
    <SegmentedControl
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key as Tab)}
      options={[
        { key: 'projects', label: `Projects  ${projects.length}` },
        { key: 'events',   label: `Events  ${events.length}` },
      ]}
    />
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Activities"
        subtitle="Projects & upcoming events"
        bottomSlot={segmentedControl}
      />

      {isLoading ? (
        <SkeletonList />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : activeTab === 'projects' ? (
        <FadeInUp key="projects" style={styles.listWrap}>
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProjectCard item={item} onPress={() => router.push(`/(tabs)/activities/projects/${item.id}` as any)} />
            )}
            ListEmptyComponent={<EmptyState icon="folder-open-outline" title="No projects" subtitle="No projects have been added yet." />}
            contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={false} onRefresh={rP} tintColor={Colors.accent} />}
          />
        </FadeInUp>
      ) : (
        <FadeInUp key="events" style={styles.listWrap}>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard item={item} onPress={() => router.push(`/(tabs)/activities/events/${item.id}` as any)} />
            )}
            ListEmptyComponent={<EmptyState icon="calendar-outline" title="No events" subtitle="No events scheduled yet." />}
            contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={false} onRefresh={rE} tintColor={Colors.accent} />}
          />
        </FadeInUp>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: Colors.bgApp },
  list:     { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md },
  listWrap: { flex: 1 },
});
