// app/(tabs)/activities/projects/[id].tsx — Project detail screen

import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, FontSize, Spacing, Layout, Radius } from '@/constants/theme';
import {
  AppHeader, LoadingSpinner, ErrorState,
  StatusBadge, Badge, FundingProgress, Divider, InfoRow,
} from '@/components/ui';
import { projectsService } from '@/services/projects.service';
import { formatDate, formatCurrency } from '@/utils/formatters';

export default function ProjectDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const insets  = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn:  () => projectsService.getProjectById(id),
    enabled:  !!id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) return <ErrorState onRetry={refetch} />;

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Project Details"
        subtitle={data.title}
        showBack
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <StatusBadge status={data.status} />
            <Badge variant="neutral">{data.project_type}</Badge>
          </View>
          <Text style={styles.cardTitle}>{data.title}</Text>
          <Text style={styles.cardDesc}>{data.description}</Text>
        </View>

        {/* Funding card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Funding Status</Text>
          <FundingProgress
            current={data.current_funding}
            target={data.target_funding}
            style={{ marginTop: Spacing.sm }}
          />
          <View style={styles.fundRow}>
            <View style={styles.fundItem}>
              <Text style={styles.fundLabel}>Raised</Text>
              <Text style={[styles.fundValue, { color: Colors.success }]}>
                {formatCurrency(data.current_funding)}
              </Text>
            </View>
            <View style={styles.fundItem}>
              <Text style={styles.fundLabel}>Target</Text>
              <Text style={styles.fundValue}>{formatCurrency(data.target_funding)}</Text>
            </View>
          </View>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <Divider style={{ marginVertical: Spacing.sm }} />
          <InfoRow label="Location"   value={data.location} />
          <Divider />
          <InfoRow label="Start Date" value={formatDate(data.start_date, 'long')} />
          <Divider />
          <InfoRow label="End Date"   value={formatDate(data.end_date, 'long')} />
          <Divider />
          <InfoRow label="Type"       value={data.project_type} />
          <Divider />
          <InfoRow label="Status"     value={<StatusBadge status={data.status} />} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.bgApp },
  content:    { padding: Layout.SCREEN_PADDING_H, paddingTop: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.borderCard,
    padding: Layout.CARD_PADDING, gap: Spacing.sm,
  },
  badgeRow:   { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  cardTitle:  { fontFamily: Typography.fontDisplay, fontSize: FontSize.xl, color: Colors.textPrimary, lineHeight: 28 },
  cardDesc:   { fontFamily: Typography.fontBody, fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22 },
  sectionTitle: { fontFamily: Typography.fontBodySemiBold, fontSize: FontSize.md, color: Colors.textPrimary },
  fundRow:    { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  fundItem:   { flex: 1, gap: 2 },
  fundLabel:  { fontFamily: Typography.fontBody, fontSize: FontSize.sm, color: Colors.textMuted },
  fundValue:  { fontFamily: Typography.fontBodyBold, fontSize: FontSize.lg, color: Colors.textPrimary },
});
