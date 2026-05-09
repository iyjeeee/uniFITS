// lib/screens/my_attendance_screen.dart — Mirrors MyAttendanceScreen.jsx.
// Personal attendance records with stats strip and status filter chips.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

const _attFilters = ['All', 'Present', 'Late', 'Absent', 'Excused'];

Color _dotColor(String status) {
  switch (status) {
    case 'present': return AppColors.success;
    case 'late':    return AppColors.warning;
    case 'absent':  return AppColors.danger;
    case 'excused': return AppColors.info;
    default:        return AppColors.textMuted;
  }
}

class MyAttendanceScreen extends StatefulWidget {
  const MyAttendanceScreen({super.key});
  @override State<MyAttendanceScreen> createState() => _MyAttendanceScreenState();
}

class _MyAttendanceScreenState extends State<MyAttendanceScreen> {
  String _filter = 'All';

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user!;

    // All records sorted most-recent first
    final all = mockAttendances
        .where((a) => a.userId == user.id)
        .toList()
      ..sort((a, b) => b.attendanceDate.compareTo(a.attendanceDate));

    final shown = _filter == 'All'
        ? all
        : all.where((a) =>
            a.status.toLowerCase() == _filter.toLowerCase()).toList();

    // Stats
    final present = all.where((a) => a.status == 'present').length;
    final late    = all.where((a) => a.status == 'late').length;
    final absent  = all.where((a) => a.status == 'absent').length;
    final excused = all.where((a) => a.status == 'excused').length;
    final total   = all.length;
    final rate    = total > 0
        ? '${((present + late) / total * 100).round()}%' : '—';

    return DetailLayout(
      title: 'My Attendance',
      subtitle: '$total records',
      onBack: () => context.pop(),
      body: Column(children: [
        // ── Stats strip ───────────────────────────────────────────────────────
        Container(
          color: AppColors.white,
          padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg, vertical: AppSpacing.lg),
          child: Row(children: [
            _StatCell(label: 'Rate',    value: rate,     color: AppColors.info),
            _Divider(),
            _StatCell(label: 'Present', value: '$present', color: AppColors.success),
            _Divider(),
            _StatCell(label: 'Late',    value: '$late',    color: AppColors.warning),
            _Divider(),
            _StatCell(label: 'Absent',  value: '$absent',  color: AppColors.danger),
            _Divider(),
            _StatCell(label: 'Excused', value: '$excused', color: AppColors.info),
          ]),
        ),

        // ── Filter chips ──────────────────────────────────────────────────────
        Container(
          decoration: const BoxDecoration(
            color: AppColors.white,
            border: Border(
                top: BorderSide(color: AppColors.borderInner),
                bottom: BorderSide(color: AppColors.borderCard)),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xl, vertical: 10),
            child: Row(
              children: _attFilters.map((f) {
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

        // ── Attendance list ───────────────────────────────────────────────────
        if (shown.isEmpty)
          const EmptyState(
              icon: AppIcons.attendance,
              title: 'No records found',
              subtitle: 'Try a different filter')
        else
          Container(
            color: AppColors.white,
            margin: const EdgeInsets.fromLTRB(
                AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(AppRadius.lg),
              border: Border.all(color: AppColors.borderCard),
              boxShadow: AppShadow.sm,
            ),
            child: Column(
              children: shown.asMap().entries.map((entry) {
                final att    = entry.value;
                final isLast = entry.key == shown.length - 1;
                return _AttRow(att: att, isLast: isLast);
              }).toList(),
            ),
          ),

        const SizedBox(height: 32),
      ]),
    );
  }
}

// ── Attendance row ────────────────────────────────────────────────────────────
class _AttRow extends StatelessWidget {
  final Attendance att;
  final bool isLast;
  const _AttRow({required this.att, this.isLast = false});

  @override
  Widget build(BuildContext context) {
    final dot = _dotColor(att.status);
    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg, vertical: 13),
      decoration: BoxDecoration(
        border: isLast
            ? null
            : const Border(bottom: BorderSide(color: AppColors.borderInner)),
      ),
      child: Row(children: [
        // Status indicator bar
        Container(
          width: 4, height: 44,
          margin: const EdgeInsets.only(right: 12),
          decoration: BoxDecoration(
              color: dot, borderRadius: BorderRadius.circular(2)),
        ),
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(att.activity,
                style: dmSans(size: 14, weight: FontWeight.w600),
                maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 3),
            Row(children: [
              Text(capitalize(att.activityType),
                  style: dmSans(size: 12, weight: FontWeight.w600,
                      color: AppColors.textMuted)),
              Text(' · ', style: dmSans(size: 12, color: AppColors.textMuted)),
              Text(formatDate(att.attendanceDate),
                  style: dmSans(size: 12, color: AppColors.textMuted)),
            ]),
            if (att.remarks != null && att.remarks!.isNotEmpty) ...[
              const SizedBox(height: 3),
              Text(att.remarks!,
                  style: dmSans(size: 12, color: AppColors.textMuted,
                      letterSpacing: 0.1),
                  maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          ],
        )),
        const SizedBox(width: 10),
        StatusBadge(status: att.status),
      ]),
    );
  }
}

// ── Stat cell ─────────────────────────────────────────────────────────────────
class _StatCell extends StatelessWidget {
  final String label, value;
  final Color color;
  const _StatCell({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Expanded(
    child: Column(children: [
      Text(value,
          style: dmSans(size: 15, weight: FontWeight.w800, color: color),
          textAlign: TextAlign.center),
      const SizedBox(height: 3),
      Text(label,
          style: dmSans(size: 10.5, color: AppColors.textMuted),
          textAlign: TextAlign.center),
      const SizedBox(height: 6),
      Container(height: 2, width: 18,
          decoration: BoxDecoration(color: color,
              borderRadius: BorderRadius.circular(1))),
    ]),
  );
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Container(
      width: 1, height: 36,
      color: AppColors.borderInner,
      margin: const EdgeInsets.symmetric(horizontal: 4));
}
