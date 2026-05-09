// lib/screens/my_transactions_screen.dart — Mirrors MyTransactionsScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

const _txFilters = ['All', 'Contribution', 'Income', 'Expense'];

class MyTransactionsScreen extends StatefulWidget {
  const MyTransactionsScreen({super.key});
  @override State<MyTransactionsScreen> createState() => _MyTransactionsScreenState();
}

class _MyTransactionsScreenState extends State<MyTransactionsScreen> {
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final myTx = mockTransactions.where((t) => t.userId == user.id).toList()
      ..sort((a, b) => b.transactionDate.compareTo(a.transactionDate));

    final filtered = _filter == 'All'
        ? myTx
        : myTx.where((t) =>
            t.entryType.toLowerCase() == _filter.toLowerCase()).toList();

    final total = myTx.where((t) => t.entryType != 'expense')
        .fold(0.0, (s, t) => s + t.amount);
    final pending = myTx.where((t) => t.status == 'pending').length;

    return DetailLayout(
      title: 'My Transactions',
      subtitle: '${myTx.length} records',
      onBack: () => context.pop(),
      body: Column(children: [
        // Summary strip
        Container(
          margin: const EdgeInsets.all(AppSpacing.lg),
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.accent, AppColors.accentDark],
              begin: Alignment.topLeft, end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.lg),
            boxShadow: AppShadow.md,
          ),
          child: Row(children: [
            _SummaryItem(label: 'Total Contributed',
                value: formatCurrency(total), light: true),
            Container(width: 1, height: 36,
                color: Colors.white.withOpacity(0.2),
                margin: const EdgeInsets.symmetric(horizontal: 12)),
            _SummaryItem(label: 'Records',
                value: '${myTx.length}', light: true),
            Container(width: 1, height: 36,
                color: Colors.white.withOpacity(0.2),
                margin: const EdgeInsets.symmetric(horizontal: 12)),
            _SummaryItem(label: 'Pending',
                value: '$pending', light: true),
          ]),
        ),

        // Filter bar
        Container(
          decoration: const BoxDecoration(
            color: AppColors.white,
            border: Border(
                bottom: BorderSide(color: AppColors.borderInner)),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xl, vertical: 10),
            child: Row(
              children: _txFilters.map((f) {
                final active = _filter == f;
                return GestureDetector(
                  onTap: () => setState(() => _filter = f),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? AppColors.accent : AppColors.neutralLight,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                      border: Border.all(
                          color: active ? AppColors.accent : AppColors.borderCard),
                    ),
                    child: Text(f,
                        style: dmSans(size: 13, weight: FontWeight.w600,
                            color: active ? Colors.white : AppColors.textSecondary)),
                  ),
                );
              }).toList(),
            ),
          ),
        ),

        // Transaction list
        if (filtered.isEmpty)
          const EmptyState(icon: AppIcons.transaction,
              title: 'No transactions found',
              subtitle: 'Try a different filter')
        else
          ...filtered.asMap().entries.map((entry) =>
              _TxRow(tx: entry.value,
                  isLast: entry.key == filtered.length - 1)),

        const SizedBox(height: 32),
      ]),
    );
  }
}

class _TxRow extends StatelessWidget {
  final Transaction tx;
  final bool isLast;
  const _TxRow({required this.tx, this.isLast = false});

  @override
  Widget build(BuildContext context) {
    final isCredit = tx.entryType != 'expense';
    final amtColor = isCredit ? AppColors.success : AppColors.danger;
    final iconBg   = isCredit ? AppColors.successLight : AppColors.dangerLight;

    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: isLast
              ? BorderSide.none
              : const BorderSide(color: AppColors.borderInner),
        ),
      ),
      child: Row(children: [
        Container(
          width: 40, height: 40,
          decoration: BoxDecoration(color: iconBg, shape: BoxShape.circle),
          alignment: Alignment.center,
          child: Icon(AppIcons.money, color: amtColor, size: 16),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(tx.description.isNotEmpty ? tx.description : tx.category,
                style: dmSans(size: 14, weight: FontWeight.w600),
                maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 2),
            Text('${formatDate(tx.transactionDate)} · ${tx.paymentMethod}',
                style: dmSans(size: 12, color: AppColors.textMuted)),
            const SizedBox(height: 3),
            Text(tx.fund,
                style: dmSans(size: 12, color: AppColors.textMuted),
                maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        )),
        const SizedBox(width: 8),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text('${isCredit ? '+' : '−'}${formatCurrency(tx.amount)}',
              style: dmSans(size: 14, weight: FontWeight.w700, color: amtColor)),
          const SizedBox(height: 4),
          StatusBadge(status: tx.status),
        ]),
      ]),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label, value;
  final bool light;
  const _SummaryItem({required this.label, required this.value, this.light = false});

  @override
  Widget build(BuildContext context) => Expanded(
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label,
          style: dmSans(size: 10.5,
              color: light ? Colors.white.withOpacity(0.6) : AppColors.textMuted)),
      const SizedBox(height: 4),
      Text(value,
          style: dmSans(size: 13, weight: FontWeight.w700,
              color: light ? Colors.white : AppColors.textPrimary),
          maxLines: 1, overflow: TextOverflow.ellipsis),
    ]),
  );
}
