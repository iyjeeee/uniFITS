// src/screens/ProjectDetailScreen.jsx
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDate, formatCurrency } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { PageHeader, StatusBadge, ProgressBar, InfoRow, Card } from '../components/ui'

export default function ProjectDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const proj       = route.params?.item

  if (!proj) return null

  const pct = proj.target_funding > 0
    ? Math.min(100, Math.round((proj.current_funding / proj.target_funding) * 100))
    : 0

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader title="Project Details" onBack={() => navigation.goBack()} />

      <ScrollView style={{ backgroundColor: Colors.bgApp }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#2D3563', '#1A2040']} style={styles.hero}>
          <StatusBadge status={proj.status} style={{ marginBottom: 10 }} />
          <Text style={styles.heroTitle}>{proj.title}</Text>
          <Text style={styles.heroSub}>{proj.project_type} · {proj.location}</Text>
          <ProgressBar current={proj.current_funding} target={proj.target_funding} style={{ marginTop: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: Typography.body }}>
              {formatCurrency(proj.current_funding)} raised
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: Typography.body }}>
              {pct}% of {formatCurrency(proj.target_funding)}
            </Text>
          </View>
        </LinearGradient>

        {/* Info card */}
        <View style={{ padding: Spacing.lg, gap: 12 }}>
          <Card>
            <Text style={styles.cardSectionLabel}>Project Information</Text>
            <InfoRow label="Start Date"    value={formatDate(proj.start_date)} />
            <InfoRow label="End Date"      value={formatDate(proj.end_date)} />
            <InfoRow label="Location"      value={proj.location} />
            <InfoRow label="Project Type"  value={proj.project_type} />
            <InfoRow label="Status"        value={<StatusBadge status={proj.status} />} last />
          </Card>

          <Card style={{ padding: Spacing.lg }}>
            <Text style={styles.cardSectionLabel2}>Description</Text>
            <Text style={{ fontSize: 13.5, color: Colors.textSecondary, lineHeight: 21, fontFamily: Typography.body }}>
              {proj.description}
            </Text>
          </Card>

          {/* Funding summary */}
          <View style={[styles.fundingCard, Shadow.sm]}>
            <LinearGradient colors={[Colors.success + '18', Colors.success + '08']}
              style={{ padding: Spacing.lg, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.success + '30' }}>
              <Text style={{ fontSize: 12, fontFamily: Typography.bodyBold, color: Colors.success, marginBottom: 4 }}>Funding Status</Text>
              <Text style={{ fontSize: 26, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary }}>
                {formatCurrency(proj.current_funding)}
                <Text style={{ fontSize: 14, fontFamily: Typography.body, color: Colors.textMuted }}> of {formatCurrency(proj.target_funding)}</Text>
              </Text>
              <ProgressBar current={proj.current_funding} target={proj.target_funding} style={{ marginTop: 10 }} />
              <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 6, fontFamily: Typography.body }}>
                {pct >= 100 ? '✓ Fully funded' : `${100 - pct}% remaining`}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  hero: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  heroTitle: { fontSize: 22, fontFamily: Typography.display, color: '#fff', lineHeight: 28, marginBottom: 4 },
  heroSub:   { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.body },
  cardSectionLabel: {
    fontSize: 11.5, fontFamily: Typography.bodyBold, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6,
    paddingHorizontal: Spacing.lg, paddingTop: 14, paddingBottom: 2,
  },
  cardSectionLabel2: {
    fontSize: 11.5, fontFamily: Typography.bodyBold, color: Colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  fundingCard: {},
})
