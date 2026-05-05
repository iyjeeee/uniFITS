// src/screens/ProjectsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All org projects with status filter pills and funding progress bars.
// Uses FlatList for performant rendering of arbitrarily long project lists.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { MOCK_PROJECTS } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar, EmptyState, ProjectsIcon } from '../components/ui'

const FILTERS = ['All', 'Ongoing', 'Upcoming', 'Completed']

// ── Project card — memoised to avoid re-render on filter change ────────────────
const ProjectCard = React.memo(function ProjectCard({ proj, onPress }) {
  const barColor =
    proj.status === 'ongoing'   ? Colors.accent :
    proj.status === 'upcoming'  ? Colors.warning :
    proj.status === 'completed' ? Colors.success : Colors.textMuted

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.projCard, Shadow.sm]}
    >
      {/* Status colour stripe on left edge */}
      <View style={[styles.statusBar, { backgroundColor: barColor }]} />
      <View style={{ flex: 1, padding: Spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <Text style={styles.projTitle} numberOfLines={2}>{proj.title}</Text>
          <StatusBadge status={proj.status} style={{ marginLeft: 8, flexShrink: 0 }} />
        </View>
        <Text style={styles.projType}>{proj.project_type}</Text>
        <Text style={styles.projLoc} numberOfLines={1}>📍 {proj.location}</Text>
        <Text style={styles.projDesc} numberOfLines={2}>{proj.description}</Text>
        <ProgressBar current={proj.current_funding} target={proj.target_funding} showLabel style={{ marginTop: 10 }} />
      </View>
    </TouchableOpacity>
  )
})

export default function ProjectsScreen() {
  const navigation = useNavigation()
  const [filter, setFilter] = useState('All')

  // ── Derived list — memoised so filter change doesn't recompute on every render ─
  const projects = useMemo(() =>
    filter === 'All'
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter(p => p.status.toLowerCase() === filter.toLowerCase()),
    [filter]
  )

  const renderItem = useCallback(({ item }) => (
    <ProjectCard
      proj={item}
      onPress={() => navigation.navigate('ProjectDetail', { item })}
    />
  ), [navigation])

  const keyExtractor = useCallback(item => item.id, [])

  // ── List header: page header + filter pills ────────────────────────────────
  const ListHeader = useMemo(() => (
    <>
      <LinearGradient colors={[Colors.primary, '#252C3D']} style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <Text style={styles.headerSub}>
          {MOCK_PROJECTS.length} total · {MOCK_PROJECTS.filter(p => p.status === 'ongoing').length} ongoing
        </Text>
      </LinearGradient>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.lg, flexWrap: 'nowrap' }}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  ), [filter]) // re-render header only when filter changes

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        data={projects}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon={<ProjectsIcon />}
            title="No projects found"
            subtitle={`No ${filter.toLowerCase()} projects at the moment`}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bgApp }}
        // Performance optimisations
        removeClippedSubviews
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header:           { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  headerTitle:      { fontSize: 22, fontFamily: Typography.display, color: '#fff' },
  headerSub:        { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body, marginTop: 2 },
  filterRow:        { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterPill:       { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  filterPillActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText:       { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  listContent:      { padding: Spacing.lg, gap: 12, paddingBottom: 32 },
  projCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statusBar: { width: 5 },
  projTitle: { fontSize: 14.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
  projType:  { fontSize: 11.5, fontFamily: Typography.bodySemiBold, color: Colors.accent, marginBottom: 2 },
  projLoc:   { fontSize: 12, fontFamily: Typography.body, color: Colors.textMuted, marginBottom: 4 },
  projDesc:  { fontSize: 12.5, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 17 },
})
