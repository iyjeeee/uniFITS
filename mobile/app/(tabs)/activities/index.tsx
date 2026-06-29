// app/(tabs)/activities/index.tsx — Activities: Projects + Events

import { useState } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import { AppHeader, LoadingSpinner, ErrorState, EmptyState } from '@/components/ui';
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

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error)     return <ErrorState onRetry={refetch} />;

  // Segmented control rendered inside the dark header
  const segmentedControl = (
    <View style={styles.segmented}>
      {(['projects', 'events'] as Tab[]).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.segBtn, activeTab === tab && styles.segBtnActive]}
          onPress={() => setActiveTab(tab)}
          activeOpacity={0.8}
        >
          <Text style={[styles.segLabel, activeTab === tab && styles.segLabelActive]}>
            {tab === 'projects' ? `Projects  ${projects.length}` : `Events  ${events.length}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Activities"
        subtitle="Projects & upcoming events"
        bottomSlot={segmentedControl}
      />

      {activeTab === 'projects' ? (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProjectCard item={item} onPress={() => router.push(`/(tabs)/activities/projects/${item.id}` as any)} />
          )}
          ListEmptyComponent={<EmptyState icon="📁" title="No projects" subtitle="No projects have been added yet." />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={rP} tintColor={Colors.accent} />}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard item={item} onPress={() => router.push(`/(tabs)/activities/events/${item.id}` as any)} />
          )}
          ListEmptyComponent={<EmptyState icon="📅" title="No events" subtitle="No events scheduled yet." />}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={rE} tintColor={Colors.accent} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bgApp },
  list:   { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md },

  segmented: {
    flexDirection:   'row',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius:    Radius.sm,
    padding:         3,
    gap:             2,
  },
  segBtn: {
    flex:             1,
    paddingVertical:  Spacing.xs + 2,
    alignItems:       'center',
    borderRadius:     Radius.sm - 2,
  },
  segBtnActive:    { backgroundColor: Colors.accent },
  segLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.55)',
  },
  segLabelActive: { color: Colors.textOnDark },
});