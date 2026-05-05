// src/screens/MyTransactionsScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shows ONLY the logged-in member's own transactions.
// Uses FlatList for performant rendering of the transaction list.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet, StatusBar,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { MOCK_TRANSACTIONS, formatDate, formatCurrency } from '../api/mockData'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import { PageHeader, StatusBadge, EmptyState, MoneyIcon, Card } from '../components/ui'

const FILTERS = ['All', 'Completed', 'Pending']

// ── Transaction row — memoised ─────────────────────────────────────────────────
const TxRow = React.memo(function TxRow({ tx, isLast }) {
  const isContrib = tx.entry_type !== 'expense'
  const amtColor  = isContrib ? Colors.success : Colors.danger
  return (
    <View style={[styles.txRow, isLast && { borderBottomWidth: 0 }]}>
      {/* Icon dot */}
      <View style={[styles.txDot, { backgroundColor: isContrib ? Colors.successLight : Colors.dangerLight }]}>
        <MoneyIcon color={amtColor} size={15} />
      </View>

      {/* Info */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.txDesc} numberOfLines={1}>{tx.description || tx.category}</Text>
        <Text style={styles.txFund} numberOfLines={1}>{tx.fund}</Text>
        <Text style={styles.txMeta}>{formatDate(tx.transaction_date)} · {tx.payment_method}</Text>
        <Text style={styles.txRef} numberOfLines={1}>{tx.reference_number}</Text>
      </View>

      {/* Amount + badges */}
      <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
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

  // ── Member-scoped + filtered data — memoised ──────────────────────────────
  const all = useMemo(() =>
    MOCK_TRANSACTIONS.filter(t => t.user_id === user.id),
    [user.id]
  )
  const txns = useMemo(() =>
    filter === 'All' ? all : all.filter(t => t.status.toLowerCase() === filter.toLowerCase()),
    [all, filter]
  )

  const totalPaid    = useMemo(() => all.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0), [all])
  const totalPending = useMemo(() => all.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0), [all])
  const pendingCount = useMemo(() => all.filter(t => t.status === 'pending').length, [all])

  const renderItem = useCallback(({ item, index }) => (
    <TxRow tx={item} isLast={index === txns.length - 1} />
  ), [txns.length])

  const keyExtractor = useCallback(item => item.id, [])

  // ── List header ────────────────────────────────────────────────────────────
  const ListHeader = useMemo(() => (
    <>
      {/* Summary hero */}
      <LinearGradient colors={['#2D3563', '#1A2040']} style={styles.summary}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sumLabel}>Total Paid</Text>
          <Text style={styles.sumAmount}>{formatCurrency(totalPaid)}</Text>
        </View>
        {totalPending > 0 && (
          <View style={styles.sumRight}>
            <Text style={styles.sumLabel}>Pending</Text>
            <Text style={[styles.sumAmount, { color: Colors.warning, fontSize: 22 }]}>
              {formatCurrency(totalPending)}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.lg }}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} activeOpacity={0.75}
              style={[styles.pill, filter === f && styles.pillActive]}>
              <Text style={[styles.pillText, filter === f && styles.pillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Card top border (the Card component handles shadow/border) */}
      {txns.length > 0 && (
        <View style={{ marginHorizontal: Spacing.lg, marginTop: Spacing.lg,
          backgroundColor: Colors.white,
          borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg,
          borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.borderCard,
          ...Shadow.sm,
        }} />
      )}
    </>
  ), [totalPaid, totalPending, filter, txns.length])

  // ── List footer ────────────────────────────────────────────────────────────
  const ListFooter = useMemo(() => (
    <>
      {/* Card bottom border */}
      {txns.length > 0 && (
        <View style={{ marginHorizontal: Spacing.lg,
          backgroundColor: Colors.white,
          borderBottomLeftRadius: Radius.lg, borderBottomRightRadius: Radius.lg,
          borderWidth: 1, borderTopWidth: 0, borderColor: Colors.borderCard,
        }} />
      )}

      {/* Pending notice */}
      {totalPending > 0 && (
        <View style={styles.pendingNotice}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warning, flexShrink: 0, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: Typography.bodyBold, color: Colors.warning, marginBottom: 3 }}>
              Pending Payments
            </Text>
            <Text style={{ fontSize: 12.5, color: Colors.textSecondary, lineHeight: 18, fontFamily: Typography.body }}>
              You have {pendingCount} pending payment{pendingCount > 1 ? 's' : ''} totalling {formatCurrency(totalPending)}. Please coordinate with the Treasurer to settle these.
            </Text>
          </View>
        </View>
      )}
      <View style={{ height: 32 }} />
    </>
  ), [totalPending, pendingCount, txns.length])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <PageHeader
        title="My Transactions"
        subtitle="Your personal contribution history"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={txns}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={{ padding: Spacing.lg }}>
            <EmptyState
              icon={<MoneyIcon />}
              title="No transactions"
              subtitle={filter === 'All' ? "You haven't made any transactions yet" : `No ${filter.toLowerCase()} transactions`}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bgApp }}
        // Render each row inside the card wrapper via renderItem styling
        ItemSeparatorComponent={() => <View style={{ marginHorizontal: Spacing.lg, height: 1, backgroundColor: Colors.borderInner }} />}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        initialNumToRender={10}
        windowSize={5}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: 28,
    gap: 24,
  },
  sumLabel:  { fontSize: 11.5, color: 'rgba(255,255,255,0.5)', fontFamily: Typography.bodyMedium, marginBottom: 4 },
  sumAmount: { fontSize: 28, fontFamily: Typography.display, color: '#fff' },
  sumRight:  { alignItems: 'flex-end' },
  filterRow: { backgroundColor: Colors.white, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderInner },
  pill:          { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.neutralLight, borderWidth: 1, borderColor: Colors.borderCard },
  pillActive:    { backgroundColor: Colors.accent, borderColor: Colors.accent },
  pillText:      { fontSize: 13, fontFamily: Typography.bodySemiBold, color: Colors.textSecondary },
  pillTextActive:{ color: '#fff' },
  txRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginHorizontal: Spacing.lg,
    paddingVertical: 13,
    gap: 12,
    backgroundColor: Colors.white,
  },
  txDot:   { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  txDesc:  { fontSize: 13.5, fontFamily: Typography.bodyBold, color: Colors.textPrimary, marginBottom: 2 },
  txFund:  { fontSize: 12, fontFamily: Typography.bodyMedium, color: Colors.accent, marginBottom: 2 },
  txMeta:  { fontSize: 11.5, color: Colors.textMuted, fontFamily: Typography.body },
  txRef:   { fontSize: 10.5, color: Colors.textMuted, fontFamily: Typography.body, marginTop: 1 },
  txAmt:   { fontSize: 14, fontFamily: Typography.bodyBold },
  pendingNotice: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    backgroundColor: Colors.warningLight,
    borderWidth: 1.5, borderColor: Colors.warning + '40',
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
  },
})
