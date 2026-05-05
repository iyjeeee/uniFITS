// src/screens/AnnouncementDetailScreen.jsx
import React from 'react'
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation, useRoute } from '@react-navigation/native'
import { formatDate } from '../api/mockData'
import { Colors, Typography, Spacing, Radius } from '../constants/theme'
import { PageHeader, StarIcon } from '../components/ui'

export default function AnnouncementDetailScreen() {
  const navigation = useNavigation()
  const route      = useRoute()
  const ann        = route.params?.item

  if (!ann) return null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader title="Announcement" onBack={() => navigation.goBack()} />

      <ScrollView style={{ backgroundColor: Colors.bgApp }} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <LinearGradient
          colors={ann.is_pinned ? ['#2C2010', '#1A1508'] : [Colors.primary, '#252C3D']}
          style={styles.hero}
        >
          {ann.is_pinned && (
            <View style={styles.pinnedPill}>
              <StarIcon size={11} color={Colors.warning} />
              <Text style={styles.pinnedText}>Pinned Announcement</Text>
            </View>
          )}
          <Text style={styles.heroTitle}>{ann.title}</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <Text style={styles.heroPill}>By {ann.created_by}</Text>
            <Text style={styles.heroPill}>
              {new Date(ann.created_at).toLocaleDateString('en-PH', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ padding: Spacing.lg }}>
          <View style={styles.contentCard}>
            <Text style={styles.content}>{ann.content}</Text>
          </View>
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
  pinnedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(212,134,10,0.18)',
    borderWidth: 1, borderColor: 'rgba(212,134,10,0.35)',
    borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pinnedText: {
    fontSize: 11, fontFamily: Typography.bodyBold,
    color: Colors.warning, textTransform: 'uppercase', letterSpacing: 0.4,
  },
  heroTitle: {
    fontSize: 24, fontFamily: Typography.display,
    color: '#fff', lineHeight: 30,
  },
  heroPill: {
    fontSize: 12, fontFamily: Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    padding: Spacing.xl,
  },
  content: {
    fontSize: 14.5,
    fontFamily: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
})
