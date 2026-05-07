// src/screens/EventDetailScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Event detail view.
// Layout: plain-color detail header + scrollable content with unified
//         Section card format for all data sections.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDate, formatCurrency, fmt12 } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, ProgressBar, CalendarIcon, MapPinIcon } from '../components/ui'

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValue}>
        {typeof value === 'string' || typeof value === 'number'
          ? <Text style={styles.infoText}>{value || '—'}</Text>
          : value
        }
      </View>
    </View>
  )
}

export default function EventDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const ev         = route.params?.item

  if (!ev) return null

  const pct = ev.target_funding > 0
    ? Math.min(100, Math.round((ev.current_funding / ev.target_funding) * 100))
    : 0

  const stripeColor = ev.status === 'upcoming' ? Colors.warning : Colors.success

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Plain-color detail header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Event Details</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Title banner — white card with left color stripe ────── */}
        <View style={styles.banner}>
          <View style={[styles.bannerStripe, { backgroundColor: stripeColor }]} />
          <View style={styles.bannerBody}>
            <StatusBadge status={ev.status} style={{ marginBottom: 10 }} />
            <Text style={styles.bannerTitle}>{ev.title}</Text>
            {/* Date + location meta */}
            <View style={styles.bannerMeta}>
              <View style={styles.bannerMetaRow}>
                <CalendarIcon color={stripeColor} size={13} />
                <Text style={styles.bannerMetaText}>{formatDate(ev.event_date)} · {fmt12(ev.event_time)}</Text>
              </View>
              <View style={styles.bannerMetaRow}>
                <MapPinIcon color={stripeColor} size={13} />
                <Text style={styles.bannerMetaText}>{ev.location}</Text>
              </View>
            </View>
            {/* Funding progress if applicable */}
            {ev.target_funding > 0 && (
              <View style={{ marginTop: 14 }}>
                <ProgressBar current={ev.current_funding} target={ev.target_funding} />
                <View style={styles.bannerFundRow}>
                  <Text style={styles.bannerFundText}>{formatCurrency(ev.current_funding)} raised</Text>
                  <Text style={styles.bannerFundText}>{pct}% of {formatCurrency(ev.target_funding)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Event Details — unified Section card ─────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Event Details</Text>
            </View>
          </View>
          <InfoRow label="Date"     value={formatDate(ev.event_date)} />
          <InfoRow label="Time"     value={fmt12(ev.event_time)} />
          <InfoRow label="Location" value={ev.location} />
          <InfoRow label="Status"   value={<StatusBadge status={ev.status} />} last />
        </View>

        {/* ── Fundraising Status — shown only when target > 0 ─────── */}
        {ev.target_funding > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionAccent, { backgroundColor: Colors.info }]} />
                <Text style={styles.sectionTitle}>Fundraising Status</Text>
              </View>
              <View style={[styles.sectionBadge, { backgroundColor: Colors.infoLight }]}>
                <Text style={[styles.sectionBadgeText, { color: Colors.info }]}>{pct}%</Text>
              </View>
            </View>
            <View style={styles.fundingRow}>
              <View>
                <Text style={styles.fundingLabel}>Raised</Text>
                <Text style={styles.fundingAmount}>{formatCurrency(ev.current_funding)}</Text>
              </View>
              <View style={styles.fundingSep} />
              <View>
                <Text style={styles.fundingLabel}>Target</Text>
                <Text style={styles.fundingAmount}>{formatCurrency(ev.target_funding)}</Text>
              </View>
              <View style={styles.fundingSep} />
              <View>
                <Text style={styles.fundingLabel}>Status</Text>
                <Text style={[styles.fundingStatus, { color: pct >= 100 ? Colors.success : Colors.warning }]}>
                  {pct >= 100 ? 'Goal reached!' : `${100 - pct}% left`}
                </Text>
              </View>
            </View>
            <View style={styles.fundingBarWrap}>
              <ProgressBar current={ev.current_funding} target={ev.target_funding} />
            </View>
          </View>
        )}

        {/* ── About This Event — unified Section card ───────────────── */}
        <View style={[styles.sectionCard, { marginBottom: 36 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>About This Event</Text>
            </View>
          </View>
          <View style={styles.descBody}>
            <Text style={styles.descText}>{ev.description}</Text>
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
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow:   { fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff' },

  // Title banner
  banner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.borderCard,
    overflow: 'hidden', ...Shadow.sm,
  },
  bannerStripe:   { width: 5 },
  bannerBody:     { flex: 1, padding: Spacing.lg },
  bannerTitle:    { fontSize: 20, fontFamily: Typography.display, color: Colors.textPrimary, lineHeight: 26, marginBottom: 10 },
  bannerMeta:     { gap: 6 },
  bannerMetaRow:  { flexDirection: 'row', alignItems: 'center', gap: 7 },
  bannerMetaText: { fontSize: 12.5, fontFamily: Typography.bodyMedium, color: Colors.textSecondary, flex: 1 },
  bannerFundRow:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  bannerFundText: { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body },

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
  sectionBadge:    { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // InfoRow
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel:   { fontSize: 13, fontFamily: Typography.bodyMedium, color: Colors.textMuted, flex: 1 },
  infoValue:   { flex: 1.5, alignItems: 'flex-end' },
  infoText:    { fontSize: 13.5, fontFamily: Typography.bodySemiBold, color: Colors.textPrimary, textAlign: 'right' },

  // Funding status
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

  // Description
  descBody: { paddingHorizontal: Spacing.lg, paddingVertical: 16 },
  descText:  { fontSize: 13.5, color: Colors.textSecondary, lineHeight: 22, fontFamily: Typography.body },
})
