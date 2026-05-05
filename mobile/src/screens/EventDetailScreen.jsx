// src/screens/EventDetailScreen.jsx
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDate, formatCurrency, fmt12 } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { PageHeader, StatusBadge, ProgressBar, InfoRow, Card } from '../components/ui'

export default function EventDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const ev         = route.params?.item

  if (!ev) return null

  const pct = ev.target_funding > 0
    ? Math.min(100, Math.round((ev.current_funding / ev.target_funding) * 100))
    : 0

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader title="Event Details" onBack={() => navigation.goBack()} />

      <ScrollView style={{ backgroundColor: Colors.bgApp }} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <LinearGradient colors={['#1A2562', '#0F1538']} style={styles.hero}>
          <StatusBadge status={ev.status} style={{ marginBottom: 10 }} />
          <Text style={styles.heroTitle}>{ev.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accent }} />
            <Text style={styles.heroMeta}>{formatDate(ev.event_date)} · {fmt12(ev.event_time)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.accent }} />
            <Text style={styles.heroMeta}>{ev.location}</Text>
          </View>

          {ev.target_funding > 0 && (
            <View style={{ marginTop: 18 }}>
              <ProgressBar current={ev.current_funding} target={ev.target_funding} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body }}>
                  {formatCurrency(ev.current_funding)} raised
                </Text>
                <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body }}>
                  {pct}% of {formatCurrency(ev.target_funding)}
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>

        <View style={{ padding: Spacing.lg, gap: 12 }}>
          {/* Details */}
          <Card>
            <Text style={styles.sectionLabel}>Event Details</Text>
            <InfoRow label="Date"     value={formatDate(ev.event_date)} />
            <InfoRow label="Time"     value={fmt12(ev.event_time)} />
            <InfoRow label="Location" value={ev.location} />
            <InfoRow label="Status"   value={<StatusBadge status={ev.status} />} last />
          </Card>

          {/* Description */}
          <Card style={{ padding: Spacing.lg }}>
            <Text style={styles.sectionLabel2}>About This Event</Text>
            <Text style={{ fontSize: 13.5, color: Colors.textSecondary, lineHeight: 21, fontFamily: Typography.body }}>
              {ev.description}
            </Text>
          </Card>

          {/* Funding */}
          {ev.target_funding > 0 && (
            <LinearGradient
              colors={[Colors.info + '15', Colors.info + '06']}
              style={[styles.fundCard, { borderColor: Colors.info + '30' }]}
            >
              <Text style={{ fontSize: 12, fontFamily: Typography.bodyBold, color: Colors.info, marginBottom: 4 }}>
                Fundraising Status
              </Text>
              <Text style={{ fontSize: 26, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary }}>
                {formatCurrency(ev.current_funding)}
                <Text style={{ fontSize: 14, fontFamily: Typography.body, color: Colors.textMuted }}>
                  {' '}of {formatCurrency(ev.target_funding)}
                </Text>
              </Text>
              <ProgressBar current={ev.current_funding} target={ev.target_funding} style={{ marginTop: 10 }} />
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 6, fontFamily: Typography.body }}>
                {pct >= 100 ? '✓ Goal reached!' : `${100 - pct}% remaining to reach goal`}
              </Text>
            </LinearGradient>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  heroTitle: { fontSize: 22, fontFamily: Typography.display, color: '#fff', lineHeight: 28 },
  heroMeta:  { fontSize: 12.5, color: 'rgba(255,255,255,0.55)', fontFamily: Typography.body },
  sectionLabel: {
    fontSize: 11.5, fontFamily: Typography.bodyBold, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 14, paddingBottom: 2,
  },
  sectionLabel2: {
    fontSize: 11.5, fontFamily: Typography.bodyBold, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  fundCard: {
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
})
