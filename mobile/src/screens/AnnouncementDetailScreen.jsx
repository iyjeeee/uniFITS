// src/screens/AnnouncementDetailScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Announcement / update detail view.
// Layout: plain-color detail header + scrollable unified Section cards.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { relativeTime, formatDate } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StarIcon } from '../components/ui'

export default function AnnouncementDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const ann        = route.params?.item

  if (!ann) return null

  const stripeColor = ann.is_pinned ? Colors.warning : Colors.accent

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Plain-color detail header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {ann.is_pinned ? 'Pinned Update' : 'Update'}
          </Text>
          <Text style={styles.headerSub}>{relativeTime(ann.created_at)}</Text>
        </View>
        {ann.is_pinned && (
          <View style={styles.pinnedChip}>
            <StarIcon size={12} color={Colors.warning} />
            <Text style={styles.pinnedChipText}>Pinned</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Title banner card ──────────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={[styles.bannerStripe, { backgroundColor: stripeColor }]} />
          <View style={styles.bannerBody}>
            {ann.is_pinned && (
              <View style={styles.pinnedRow}>
                <StarIcon size={11} color={Colors.warning} />
                <Text style={styles.pinnedLabel}>PINNED ANNOUNCEMENT</Text>
              </View>
            )}
            <Text style={styles.bannerTitle}>{ann.title}</Text>
            {/* Meta row: author + date */}
            <View style={styles.metaRow}>
              <View style={[styles.metaDot, { backgroundColor: stripeColor }]} />
              <Text style={styles.metaText}>{ann.created_by}</Text>
              <Text style={styles.metaSep}>·</Text>
              <Text style={styles.metaText}>{formatDate(ann.created_at)}</Text>
              <Text style={styles.metaSep}>·</Text>
              <Text style={styles.metaRelative}>{relativeTime(ann.created_at)}</Text>
            </View>
          </View>
        </View>

        {/* ── Content — unified Section card ────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: stripeColor }]} />
              <Text style={styles.sectionTitle}>Content</Text>
            </View>
          </View>
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>{ann.content}</Text>
          </View>
        </View>

        {/* ── Post Details — unified Section card ───────────────────── */}
        <View style={[styles.sectionCard, { marginBottom: 36 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Post Details</Text>
            </View>
          </View>
          {/* Author */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Posted by</Text>
            <Text style={styles.infoValue}>{ann.created_by}</Text>
          </View>
          {/* Date */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(ann.created_at)}</Text>
          </View>
          {/* Time ago */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Posted</Text>
            <Text style={styles.infoValue}>{relativeTime(ann.created_at)}</Text>
          </View>
          {/* Pinned status */}
          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>Pinned</Text>
            <View style={[
              styles.statusChip,
              { backgroundColor: ann.is_pinned ? Colors.warningLight : Colors.neutralLight }
            ]}>
              <Text style={[
                styles.statusChipText,
                { color: ann.is_pinned ? Colors.warning : Colors.textMuted }
              ]}>
                {ann.is_pinned ? 'Yes — Pinned' : 'No'}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  // Plain-color detail header
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  backBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow:    { fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 },
  headerTitle:  { fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff' },
  headerSub:    { fontSize: 12, fontFamily: Typography.body, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  pinnedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(212,134,10,0.18)', borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(212,134,10,0.3)',
  },
  pinnedChipText: { fontSize: 11.5, fontFamily: Typography.bodySemiBold, color: Colors.warning },

  // Title banner card
  banner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },
  bannerStripe: { width: 5 },
  bannerBody:   { flex: 1, padding: Spacing.lg },
  pinnedRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  pinnedLabel:  { fontSize: 10, fontFamily: Typography.bodyBold, color: Colors.warning, letterSpacing: 0.8 },
  bannerTitle:  { fontSize: 20, fontFamily: Typography.display, color: Colors.textPrimary, lineHeight: 26, marginBottom: 12 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  metaDot:      { width: 6, height: 6, borderRadius: 3 },
  metaText:     { fontSize: 12, fontFamily: Typography.bodyMedium, color: Colors.textSecondary },
  metaSep:      { fontSize: 12, color: Colors.textMuted },
  metaRelative: { fontSize: 12, fontFamily: Typography.body, color: Colors.textMuted },

  // Unified section card
  sectionCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },

  // Content body
  contentBody: { paddingHorizontal: Spacing.lg, paddingVertical: 18 },
  contentText: { fontSize: 14.5, color: Colors.textSecondary, lineHeight: 24, fontFamily: Typography.body },

  // InfoRow inside Post Details card
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel:   { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textMuted },
  infoValue:   { fontSize: 13.5, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: 12 },

  // Status chip (pinned yes/no)
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusChipText: { fontSize: 12, fontFamily: Typography.bodySemiBold },
})
