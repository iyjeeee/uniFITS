// src/screens/ProjectsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Projects list — full-bleed plain-colour top section.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, StatusBar, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { MOCK_PROJECTS } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar, ProjectsIcon, Avatar } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All', 'Ongoing', 'Upcoming', 'Completed']
const STRIPE  = { ongoing: Colors.accent, upcoming: Colors.warning, completed: Colors.success }

// Sorted by most recent start_date first
const SORTED_PROJECTS = [...MOCK_PROJECTS].sort(
  (a, b) => new Date(b.start_date) - new Date(a.start_date)
)

// ── Project card ──────────────────────────────────────────────────────────────
const ProjectCard = React.memo(function ProjectCard({ item, onPress }) {
  const stripe = STRIPE[item.status] || Colors.textMuted
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={styles.card}>
      <View style={[styles.cardStripe, { backgroundColor: stripe }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <StatusBadge status={item.status} style={styles.badge} />
        </View>
        <Text style={[styles.cardType, { color: stripe }]}>{item.project_type}</Text>
        <Text style={styles.cardLoc} numberOfLines={1}>📍 {item.location}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        <ProgressBar current={item.current_funding} target={item.target_funding} showLabel style={{ marginTop: 12 }} />
      </View>
    </TouchableOpacity>
  )
})

export default function ProjectsScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  const projects = useMemo(() =>
    filter === 'All'
      ? SORTED_PROJECTS
      : SORTED_PROJECTS.filter(p => p.status.toLowerCase() === filter.toLowerCase()),
    [filter]
  )

  const counts = useMemo(() => ({
    all:       MOCK_PROJECTS.length,
    ongoing:   MOCK_PROJECTS.filter(p => p.status === 'ongoing').length,
    upcoming:  MOCK_PROJECTS.filter(p => p.status === 'upcoming').length,
    completed: MOCK_PROJECTS.filter(p => p.status === 'completed').length,
  }), [])

  const renderItem   = useCallback(({ item }) => (
    <ProjectCard item={item} onPress={() => navigation.navigate('ProjectDetail', { item })} />
  ), [navigation])
  const keyExtractor = useCallback(item => item.id, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <FlatList
        style={styles.list}
        data={projects}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroRow}>
                {/* Left: eyebrow + title + pills row */}
                <View style={styles.heroLeft}>
                  <View style={styles.eyebrow}>
                    <ProjectsIcon color={Colors.accent} size={13} />
                    <Text style={[styles.eyebrowText, { color: Colors.accent }]}>ORGANIZATION</Text>
                  </View>
                  <Text style={styles.heroTitle}>Projects</Text>
                  {/* Pills — no bullet dots, white text for status pills */}
                  <View style={styles.pills}>
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{counts.all} Total</Text>
                    </View>
                    <View style={[styles.pill, { borderColor: Colors.accent + '55' }]}>
                      <Text style={[styles.pillText, styles.pillWhite]}>{counts.ongoing} Ongoing</Text>
                    </View>
                    <View style={[styles.pill, { borderColor: Colors.success + '55' }]}>
                      <Text style={[styles.pillText, styles.pillWhite]}>{counts.completed} Completed</Text>
                    </View>
                  </View>
                </View>
                {/* Right: avatar + Upcoming pill below it */}
                <View style={styles.heroRight}>
                  <Avatar name={user?.full_name ?? ''} size={46} style={styles.avatar} />
                  <View style={[styles.pill, { borderColor: Colors.warning + '55', marginTop: 8 }]}>
                    <Text style={[styles.pillText, styles.pillWhite]}>{counts.upcoming} Upcoming</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.filterBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTERS.map(f => (
                  <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
                    style={[styles.chip, filter === f && styles.chipActive]}>
                    <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><ProjectsIcon color={Colors.textMuted} size={26} /></View>
            <Text style={styles.emptyTitle}>No projects found</Text>
            <Text style={styles.emptySub}>No {filter.toLowerCase()} projects at the moment</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  list: { backgroundColor: Colors.bgApp },
  listContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: 36, gap: 12 },

  hero: {
    backgroundColor: Colors.primary,
    marginHorizontal: -Spacing.lg, marginTop: -Spacing.lg, paddingBottom: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
  },
  heroLeft:  { flex: 1, marginRight: 12 },
  heroRight: { alignItems: 'flex-end' }, // avatar + Upcoming pill stacked right
  eyebrow:   { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  eyebrowText: { fontSize: 10, fontFamily: Typography.bodyBold, letterSpacing: 2 },
  heroTitle:   { fontSize: 32, fontFamily: Typography.display, color: '#fff', lineHeight: 36, marginBottom: 14 },
  pills:       { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.09)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText:  { fontSize: 11.5, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.8)' },
  pillWhite: { color: '#fff' }, // white text for Ongoing/Completed/Upcoming
  avatar:    { borderWidth: 2, borderColor: 'rgba(255,255,255,0.22)' },

  filterBar:      { backgroundColor: Colors.white, marginHorizontal: -Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterScroll:   { paddingHorizontal: Spacing.xl, paddingVertical: 12, gap: 8 },
  chip:           { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:       { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },

  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    flexDirection: 'row', overflow: 'hidden', ...Shadow.sm,
  },
  cardStripe: { width: 5 },
  cardBody:   { flex: 1, padding: Spacing.lg },
  cardTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  cardTitle:  { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary, flex: 1, lineHeight: 21 },
  badge:      { marginLeft: 8, flexShrink: 0 },
  cardType:   { fontSize: 11.5, fontFamily: Typography.bodySemiBold, marginBottom: 3, textTransform: 'capitalize' },
  cardLoc:    { fontSize: 12, fontFamily: Typography.body, color: Colors.textMuted, marginBottom: 6 },
  cardDesc:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textSecondary, lineHeight: 18 },

  empty:      { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
