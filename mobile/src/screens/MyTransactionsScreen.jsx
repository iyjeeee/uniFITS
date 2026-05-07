// src/screens/MyTransactionsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Member's personal transaction history.
// Proper padding/spacing so rows never touch edges.
// Data sorted most-recent first.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { MOCK_TRANSACTIONS, formatDate, formatCurrency } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { StatusBadge, MoneyIcon } from '../components/ui'

const FILTERS = ['All', 'Completed', 'Pending']

// ── Transaction row — properly spaced, won't touch edges ──────────────────────
const TxRow = React.memo(function TxRow({ tx, isLast }) {
  const isContrib = tx.entry_type !== 'expense'
  const amtColor  = isContrib ? Colors.success : Colors.danger
  return (
    <View style={[styles.txRow, isLast && styles.txRowLast]}>
      {/* Left icon */}
      <View style={[styles.txIcon, { backgroundColor: isContrib ? Colors.successLight : Colors.dangerLight }]}>
        <MoneyIcon color={amtColor} size={15} />
      </View>
      {/* Text block — flex 1 ensures it doesn't push right side off */}
      <View style={styles.txBody}>
        <Text style={styles.txDesc} numberOfLines={1}>{tx.description || tx.category}</Text>
        <Text style={styles.txFund} numberOfLines={1}>{tx.fund}</Text>
        <Text style={styles.txMeta}>{formatDate(tx.transaction_date)} · {tx.payment_method}</Text>
        <Text style={styles.txRef} numberOfLines={1}>{tx.reference_number}</Text>
      </View>
      {/* Right: amount + badges — fixed width so it never overlaps */}
      <View style={styles.txRight}>
        <Text style={[styles.txAmt, { color: amtColor }]}>
          {isContrib ? '+' : '−'}{formatCurrency(tx.amount)}
        </Text>
        <StatusBadge status={tx.status} />
        <StatusBadge status={tx.entry_type} />
      </View>
    </View>
  )
})

export default function MyTransactionsScreen() {
  const navigation = useNavigation()
  const { user }   = useAuth()
  const [filter, setFilter] = useState('All')

  // Sort all user transactions most-recent first
  const all = useMemo(() =>
    MOCK_TRANSACTIONS
      .filter(t => t.user_id === user.id)
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)),
    [user.id]
  )
  const txns = useMemo(() =>
    filter === 'All' ? all : all.filter(t => t.status.toLowerCase() === filter.toLowerCase()),
    [all, filter]
  )

  const totalPaid    = useMemo(() => all.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0), [all])
  const totalPending = useMemo(() => all.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0), [all])
  const pendingCount = useMemo(() => all.filter(t => t.status === 'pending').length, [all])

  const renderItem   = useCallback(({ item, index }) => (
    <TxRow tx={item} isLast={index === txns.length - 1} />
  ), [txns.length])
  const keyExtractor = useCallback(item => item.id, [])

  const ListHeader = useMemo(() => (
    <>
      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
        </View>
        {totalPending > 0 && (
          <>
            <View style={styles.summarySep} />
            <View style={styles.summaryCell}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={[styles.summaryValue, { color: Colors.warning }]}>{formatCurrency(totalPending)}</Text>
            </View>
          </>
        )}
        <View style={styles.summarySep} />
        <View style={styles.summaryCell}>
          <Text style={styles.summaryLabel}>Records</Text>
          <Text style={styles.summaryValue}>{all.length}</Text>
        </View>
      </View>

      {/* Filter chips */}
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

      {/* Section card header */}
      {txns.length > 0 && (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Transactions</Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{txns.length}</Text>
          </View>
        </View>
      )}
    </>
  ), [totalPaid, totalPending, filter, txns.length, all.length])

  const ListFooter = useMemo(() => (
    <>
      {totalPending > 0 && (
        <View style={styles.pendingNotice}>
          <View style={styles.pendingDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pendingTitle}>Pending Payments</Text>
            <Text style={styles.pendingBody}>
              You have {pendingCount} pending payment{pendingCount > 1 ? 's' : ''} totalling {formatCurrency(totalPending)}. Please coordinate with the Treasurer to settle these.
            </Text>
          </View>
        </View>
      )}
      <View style={{ height: 32 }} />
    </>
  ), [totalPending, pendingCount])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My Transactions</Text>
          <Text style={styles.headerSub}>Your personal contribution history</Text>
        </View>
      </View>

      <FlatList
        data={txns}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}><MoneyIcon color={Colors.textMuted} size={24} /></View>
            <Text style={styles.emptyTitle}>No transactions</Text>
            <Text style={styles.emptySub}>{filter === 'All' ? "You haven't made any transactions yet" : `No ${filter.toLowerCase()} transactions`}</Text>
          </View>
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
        // Row separator
        ItemSeparatorComponent={() => (
          <View style={styles.rowSeparator} />
        )}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        initialNumToRender={10}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  list: { backgroundColor: Colors.bgApp },

  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
  },
  backBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  backArrow:   { fontSize: 22, color: '#fff', lineHeight: 26, marginLeft: -1 },
  headerTitle: { fontSize: 17, fontFamily: Typography.bodyBold, color: '#fff' },
  headerSub:   { fontSize: 12, fontFamily: Typography.body, color: 'rgba(255,255,255,0.5)', marginTop: 1 },

  summaryStrip: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderInner, ...Shadow.sm,
  },
  summaryCell:  { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  summaryLabel: { fontSize: 10.5, fontFamily: Typography.bodyMedium, color: Colors.textMuted, marginBottom: 3, textAlign: 'center' },
  summaryValue: { fontSize: 16, fontFamily: Typography.bodyExtraBold, color: Colors.textPrimary, textAlign: 'center' },
  summarySep:   { width: 1, backgroundColor: Colors.borderInner, marginVertical: 10 },

  filterBar:     { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  filterScroll:  { paddingHorizontal: Spacing.lg, gap: 8 },
  chip:          { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  chipActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText:      { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  chipTextActive:{ color: '#fff' },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: Spacing.lg, marginTop: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
    borderWidth: 1, borderBottomWidth: 1, borderBottomColor: Colors.borderInner,
    borderColor: Colors.borderCard,
    paddingHorizontal: Spacing.lg, paddingVertical: 14,
    ...Shadow.sm,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccent:   { width: 4, height: 18, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle:    { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textPrimary },
  sectionBadge:    { backgroundColor: Colors.accentLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  sectionBadgeText:{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent },

  // Transaction row — even padding left/right so content never touches edges
  txRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: Spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg, // even horizontal padding
    gap: 12,
    backgroundColor: Colors.white,
    borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.borderCard,
  },
  txRowLast: {
    borderBottomWidth: 1, borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg,
  },
  txIcon:  { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  txBody:  { flex: 1, minWidth: 0 }, // flex 1 + minWidth 0 prevents overflow
  txDesc:  { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary, marginBottom: 2 },
  txFund:  { fontSize: 12, fontFamily: Typography.bodyMedium, color: Colors.accent, marginBottom: 2 },
  txMeta:  { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body },
  txRef:   { fontSize: 10.5, color: Colors.textMuted, fontFamily: Typography.body, marginTop: 1 },
  // Right column — fixed maxWidth so badges fit without squeezing the text
  txRight: { alignItems: 'flex-end', gap: 4, flexShrink: 0, maxWidth: 120 },
  txAmt:   { fontSize: 13.5, fontFamily: Typography.bodyBold, textAlign: 'right' },

  // Row separator — stays within card boundaries (matches marginHorizontal of txRow)
  rowSeparator: { marginHorizontal: Spacing.lg * 2 + Spacing.lg, height: 1, backgroundColor: Colors.borderInner },

  pendingNotice: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    backgroundColor: Colors.warningLight,
    borderWidth: 1.5, borderColor: Colors.warning + '40',
    borderRadius: Radius.md, padding: Spacing.md,
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
  },
  pendingDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning, flexShrink: 0, marginTop: 2 },
  pendingTitle:{ fontSize: 13, fontFamily: Typography.bodyBold, color: Colors.warning, marginBottom: 3 },
  pendingBody: { fontSize: 12.5, color: Colors.textSecondary, lineHeight: 18, fontFamily: Typography.body },

  emptyWrap:  { alignItems: 'center', padding: 48 },
  emptyIcon:  { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.neutralLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 15, fontFamily: Typography.bodyBold, color: Colors.textSecondary, marginBottom: 5 },
  emptySub:   { fontSize: 13, fontFamily: Typography.body, color: Colors.textMuted, textAlign: 'center' },
})
