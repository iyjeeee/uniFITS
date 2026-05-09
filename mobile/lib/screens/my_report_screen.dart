// lib/screens/my_report_screen.dart — Mirrors MyReportScreen.jsx.
// Personal financial + attendance summary report.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';

class MyReportScreen extends StatelessWidget {
  const MyReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;
    final myTx = mockTransactions.where((t) => t.userId == user.id).toList();
    final myAtt = mockAttendances.where((a) => a.userId == user.id).toList();

    // Transaction stats
    final totalContrib = myTx
        .where((t) => t.entryType != 'expense')
        .fold(0.0, (s, t) => s + t.amount);
    final completedTx = myTx.where((t) => t.status == 'completed').length;
    final pendingTx = myTx.where((t) => t.status == 'pending').length;

    // Attendance stats
    final attPresent = myAtt.where((a) => a.status == 'present').length;
    final attLate = myAtt.where((a) => a.status == 'late').length;
    final attAbsent = myAtt.where((a) => a.status == 'absent').length;
    final attTotal = myAtt.length;
    final attRate = attTotal > 0
        ? '${((attPresent + attLate) / attTotal * 100).round()}%'
        : '—';

    // Breakdown maps
    final byCategory = <String, double>{};
    final byFund = <String, double>{};
    for (final t in myTx) {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
      byFund[t.fund] = (byFund[t.fund] ?? 0) + t.amount;
    }

    return DetailLayout(
      title: 'My Financial Report',
      onBack: () => context.pop(),
      body: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // ── Identity card ─────────────────────────────────────────────────────
        Container(
          margin: const EdgeInsets.all(AppSpacing.lg),
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.accent, AppColors.accentDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(AppRadius.lg),
            boxShadow: AppShadow.md,
          ),
          child: Row(children: [
            AppAvatar(name: user.fullName, size: 52),
            const SizedBox(width: 14),
            Expanded(
                child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.fullName,
                    style: dmSans(
                        size: 16, weight: FontWeight.w700, color: Colors.white),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 3),
                Text('${user.role} · ${user.department}',
                    style: dmSans(
                        size: 12.5, color: Colors.white.withOpacity(0.65)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis),
                const SizedBox(height: 3),
                Text(user.employeeNumber,
                    style:
                        dmSans(size: 12, color: Colors.white.withOpacity(0.5))),
              ],
            )),
          ]),
        ),

        // ── Contribution Summary ──────────────────────────────────────────────
        SectionCard(title: 'Contribution Summary', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              // Total amount hero
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(
                  color: AppColors.accentLight,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                alignment: Alignment.center,
                child: Column(children: [
                  Text(formatCurrency(totalContrib),
                      style: dmSans(
                          size: 28,
                          weight: FontWeight.w800,
                          color: AppColors.accent)),
                  Text('Total Contributed',
                      style: dmSans(size: 12.5, color: AppColors.accent)),
                ]),
              ),
              const SizedBox(height: 14),
              // KPI row
              Row(children: [
                _KpiBox(
                    label: 'Transactions',
                    value: '${myTx.length}',
                    color: AppColors.accent),
                const SizedBox(width: 10),
                _KpiBox(
                    label: 'Completed',
                    value: '$completedTx',
                    color: AppColors.success),
                const SizedBox(width: 10),
                _KpiBox(
                    label: 'Pending',
                    value: '$pendingTx',
                    color: AppColors.warning),
              ]),
            ]),
          ),
        ]),

        // ── By Category ───────────────────────────────────────────────────────
        if (byCategory.isNotEmpty)
          SectionCard(title: 'By Category', children: [
            ...byCategory.entries.toList().asMap().entries.map((e) {
              final isLast = e.key == byCategory.length - 1;
              return _BreakdownRow(
                  label: e.value.key, amount: e.value.value, isLast: isLast);
            }),
          ]),

        // ── By Fund ───────────────────────────────────────────────────────────
        if (byFund.isNotEmpty)
          SectionCard(title: 'By Fund', children: [
            ...byFund.entries.toList().asMap().entries.map((e) {
              final isLast = e.key == byFund.length - 1;
              return _BreakdownRow(
                  label: e.value.key, amount: e.value.value, isLast: isLast);
            }),
          ]),

        // ── Attendance Summary ────────────────────────────────────────────────
        SectionCard(title: 'Attendance Summary', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              // Rate hero
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(
                  color: AppColors.successLight,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                alignment: Alignment.center,
                child: Column(children: [
                  Text(attRate,
                      style: dmSans(
                          size: 28,
                          weight: FontWeight.w800,
                          color: AppColors.success)),
                  Text('Attendance Rate',
                      style: dmSans(size: 12.5, color: AppColors.success)),
                ]),
              ),
              const SizedBox(height: 14),
              Row(children: [
                _KpiBox(
                    label: 'Present',
                    value: '$attPresent',
                    color: AppColors.success),
                const SizedBox(width: 10),
                _KpiBox(
                    label: 'Late', value: '$attLate', color: AppColors.warning),
                const SizedBox(width: 10),
                _KpiBox(
                    label: 'Absent',
                    value: '$attAbsent',
                    color: AppColors.danger),
              ]),
            ]),
          ),
        ]),

        // ── Activity Breakdown ────────────────────────────────────────────────
        if (myAtt.isNotEmpty)
          SectionCard(title: 'Activity Breakdown', children: [
            ...myAtt.asMap().entries.map((e) {
              final att = e.value;
              final isLast = e.key == myAtt.length - 1;
              final dotClr = att.status == 'present'
                  ? AppColors.success
                  : att.status == 'late'
                      ? AppColors.warning
                      : att.status == 'absent'
                          ? AppColors.danger
                          : AppColors.info;
              return Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  border: isLast
                      ? null
                      : const Border(
                          bottom: BorderSide(color: AppColors.borderInner)),
                ),
                child: Row(children: [
                  Container(
                      width: 8,
                      height: 8,
                      margin: const EdgeInsets.only(right: 12, top: 2),
                      decoration:
                          BoxDecoration(color: dotClr, shape: BoxShape.circle)),
                  Expanded(
                      child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(att.activity,
                          style: dmSans(size: 14, weight: FontWeight.w600),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis),
                      Text(
                          '${capitalize(att.activityType)} · ${formatDate(att.attendanceDate)}',
                          style: dmSans(size: 12, color: AppColors.textMuted)),
                      if (att.remarks != null && att.remarks!.isNotEmpty)
                        Text(att.remarks!,
                            style: dmSans(
                                size: 12,
                                color: AppColors.textMuted,
                                letterSpacing: 0.1)),
                    ],
                  )),
                  const SizedBox(width: 8),
                  StatusBadge(status: att.status),
                ]),
              );
            }),
          ]),

        const SizedBox(height: 32),
      ]),
    );
  }
}

// ── KPI box ───────────────────────────────────────────────────────────────────
class _KpiBox extends StatelessWidget {
  final String label, value;
  final Color color;
  const _KpiBox(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Expanded(
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(color: AppColors.borderCard),
            boxShadow: AppShadow.sm,
          ),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
                width: 28,
                height: 3,
                decoration: BoxDecoration(
                    color: color, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 8),
            Text(value,
                style: dmSans(
                    size: 18,
                    weight: FontWeight.w800,
                    color: AppColors.textPrimary)),
            Text(label, style: dmSans(size: 11, color: AppColors.textMuted)),
          ]),
        ),
      );
}

// ── Breakdown row ─────────────────────────────────────────────────────────────
class _BreakdownRow extends StatelessWidget {
  final String label;
  final double amount;
  final bool isLast;
  const _BreakdownRow(
      {required this.label, required this.amount, this.isLast = false});

  @override
  Widget build(BuildContext context) => Container(
        padding:
            const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.white,
          border: isLast
              ? null
              : const Border(bottom: BorderSide(color: AppColors.borderInner)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            StatusBadge(status: label),
            Text(formatCurrency(amount),
                style: dmSans(
                    size: 14,
                    weight: FontWeight.w700,
                    color: AppColors.textPrimary)),
          ],
        ),
      );
}
