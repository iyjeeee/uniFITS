// src/screens/ProjectDetailScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Project detail view.
// Status InfoRow: StatusBadge overridden with alignSelf:'flex-end' so it
// sits flush on the right side inside the infoValue container.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDate, formatCurrency } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar } from '../components/ui'

// ── InfoRow — label left, value right-aligned ─────────────────────────────────
function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      {/* infoValue: flex-end so both text and badge nodes sit at the right */}
      <View style={styles.infoValue}>
        {typeof value === 'string' || typeof value === 'number'
          ? <Text style={styles.infoText}>{value || '—'}</Text>
          : value
        }
      </View>
    </View>
  )
}

export default function ProjectDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const proj       = route.params?.item

  if (!proj) return null

  const pct = proj.target_funding > 0
    ? Math.min(100, Math.round((proj.current_funding / proj.target_funding) * 100))
    : 0

  const stripeColor =
    proj.status === 'ongoing'   ? Colors.accent :
    proj.status === 'completed' ? Colors.success : Colors.warning

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Plain-color header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Project Details</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Title banner */}
        <View style={styles.banner}>
          <View style={[styles.bannerStripe, { backgroundColor: stripeColor }]} />
          <View style={styles.bannerBody}>
            <StatusBadge status={proj.status} style={{ marginBottom: 10 }} />
            <Text style={styles.bannerTitle}>{proj.title}</Text>
            <Text style={styles.bannerSub}>{proj.project_type} · {proj.location}</Text>
            <ProgressBar current={proj.current_funding} target={proj.target_funding} style={{ marginTop: 16 }} />
            <View style={styles.bannerFundRow}>
              <Text style={styles.bannerFundText}>{formatCurrency(proj.current_funding)} raised</Text>
              <Text style={styles.bannerFundText}>{pct}% of {formatCurrency(proj.target_funding)}</Text>
            </View>
          </View>
        </View>

        {/* Project Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Project Information</Text>
            </View>
          </View>
          <InfoRow label="Start Date"   value={formatDate(proj.start_date)} />
          <InfoRow label="End Date"     value={formatDate(proj.end_date)} />
          <InfoRow label="Location"     value={proj.location} />
          <InfoRow label="Project Type" value={proj.project_type} />
          {/* Status: pass alignSelf:'flex-end' to override badge's default flex-start */}
          <InfoRow
            label="Status"
            value={<StatusBadge status={proj.status} style={styles.badgeRight} />}
            last
          />
        </View>

        {/* Funding Status */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionAccent, { backgroundColor: Colors.success }]} />
              <Text style={styles.sectionTitle}>Funding Status</Text>
            </View>
            <View style={[styles.sectionBadge, { backgroundColor: Colors.successLight }]}>
              <Text style={[styles.sectionBadgeText, { color: Colors.success }]}>{pct}%</Text>
            </View>
          </View>
          <View style={styles.fundingRow}>
            <View>
              <Text style={styles.fundingLabel}>Raised</Text>
              <Text style={styles.fundingAmount}>{formatCurrency(proj.current_funding)}</Text>
            </View>
            <View style={styles.fundingSep} />
            <View>
              <Text style={styles.fundingLabel}>Target</Text>
              <Text style={styles.fundingAmount}>{formatCurrency(proj.target_funding)}</Text>
            </View>
            <View style={styles.fundingSep} />
            <View>
              <Text style={styles.fundingLabel}>Status</Text>
              <Text style={[styles.fundingStatus, { color: pct >= 100 ? Colors.success : Colors.warning }]}>
                {pct >= 100 ? 'Fully funded' : `${100 - pct}% left`}
              </Text>
            </View>
          </View>
          <View style={styles.fundingBarWrap}>
            <ProgressBar current={proj.current_funding} target={proj.target_funding} />
          </View>
        </View>

        {/* Description */}
        <View style={[styles.sectionCard, { marginBottom: 36 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
          </View>
          <View style={styles.descBody}>
            <Text style={styles.descText}>{proj.description}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.primary },
  scroll: { backgroundColor: Colors.bgApp },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow:   { fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff' },

  banner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },
  bannerStripe:   { width: 5 },
  bannerBody:     { flex: 1, padding: Spacing.lg },
  bannerTitle:    { fontSize: 20, fontFamily: Typography.display, color: Colors.textPrimary, lineHeight: 26, marginBottom: 5 },
  bannerSub:      { fontSize: 12, color: Colors.textMuted, fontFamily: Typography.body },
  bannerFundRow:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  bannerFundText: { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body },

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
  sectionTitleRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:    { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:     { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:     { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText: { fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // InfoRow — label left, value right
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel:   { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textMuted, flex: 1 },
  // infoValue: flex-end aligns child text AND StatusBadge to the right
  infoValue:   { flex: 1.5, alignItems: 'flex-end' },
  infoText:    { fontSize: 13.5, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary, textAlign: 'right' },
  // Override StatusBadge's default alignSelf:'flex-start' → 'flex-end'
  badgeRight:  { alignSelf: 'flex-end' },

  fundingRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  fundingSep:    { width: 1, backgroundColor: Colors.borderInner, marginHorizontal: 16, alignSelf: 'stretch' },
  fundingLabel:  { fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginBottom: 4 },
  fundingAmount: { fontSize: 15, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary },
  fundingStatus: { fontSize: 13, fontFamily: Typography.bodyBold },
  fundingBarWrap:{ paddingHorizontal: Spacing.lg, paddingVertical: 14 },

  descBody: { paddingHorizontal: Spacing.lg, paddingVertical: 16 },
  descText:  { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 22, fontFamily: Typography.body },
})
