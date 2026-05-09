// lib/screens/project_detail_screen.dart — Project detail. Mirrors ProjectDetailScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';

class ProjectDetailScreen extends StatelessWidget {
  final String projectId;
  const ProjectDetailScreen({super.key, required this.projectId});

  @override
  Widget build(BuildContext context) {
    final proj = mockProjects.where((p) => p.id == projectId).firstOrNull;
    if (proj == null)
      return const Scaffold(body: Center(child: Text('Not found')));

    final stripe = proj.status == 'ongoing'
        ? AppColors.accent
        : proj.status == 'completed'
            ? AppColors.success
            : AppColors.warning;
    final pct = proj.fundingPercent.round();

    return DetailLayout(
      title: 'Project Details',
      onBack: () => context.pop(),
      body: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Title banner
        Container(
          margin: const EdgeInsets.all(AppSpacing.lg),
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border(
                left: BorderSide(color: stripe, width: 4),
                right: const BorderSide(color: AppColors.borderCard),
                top: const BorderSide(color: AppColors.borderCard),
                bottom: const BorderSide(color: AppColors.borderCard)),
            boxShadow: AppShadow.sm,
          ),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Expanded(
                  child: Text(proj.title,
                      style: dmSans(size: 18, weight: FontWeight.w700))),
              StatusBadge(status: proj.status),
            ]),
            const SizedBox(height: 4),
            Text(proj.projectType,
                style:
                    dmSans(size: 13, weight: FontWeight.w600, color: stripe)),
          ]),
        ),

        // Details section
        SectionCard(title: 'Project Information', children: [
          InfoRow(label: 'Location', value: proj.location),
          InfoRow(label: 'Start Date', value: formatDate(proj.startDate)),
          InfoRow(label: 'End Date', value: formatDate(proj.endDate)),
          InfoRow(label: 'Status', value: proj.status, last: true),
        ]),

        // Funding section
        SectionCard(title: 'Funding Progress', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('Current Funding',
                    style: dmSans(size: 13, color: AppColors.textMuted)),
                Text('$pct%',
                    style: dmSans(
                        size: 13,
                        weight: FontWeight.w700,
                        color:
                            pct >= 100 ? AppColors.success : AppColors.accent)),
              ]),
              const SizedBox(height: 8),
              AppProgressBar(
                  current: proj.currentFunding,
                  target: proj.targetFunding,
                  showLabel: true),
              const SizedBox(height: 14),
              Row(children: [
                Expanded(
                    child: _FundStat(
                        label: 'Raised',
                        value: formatCurrency(proj.currentFunding),
                        color: AppColors.success)),
                const SizedBox(width: 10),
                Expanded(
                    child: _FundStat(
                        label: 'Target',
                        value: formatCurrency(proj.targetFunding),
                        color: AppColors.accent)),
                const SizedBox(width: 10),
                Expanded(
                    child: _FundStat(
                        label: 'Remaining',
                        value: formatCurrency(
                            (proj.targetFunding - proj.currentFunding)
                                .clamp(0, double.infinity)),
                        color: AppColors.warning)),
              ]),
            ]),
          ),
        ]),

        // Description section
        SectionCard(title: 'Description', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Text(proj.description,
                style: dmSans(
                    size: 14,
                    color: AppColors.textSecondary,
                    letterSpacing: 0.1)),
          ),
        ]),
        const SizedBox(height: 32),
      ]),
    );
  }
}

class _FundStat extends StatelessWidget {
  final String label, value;
  final Color color;
  const _FundStat(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(AppRadius.md),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: dmSans(size: 10.5, color: color.withOpacity(0.8))),
          const SizedBox(height: 3),
          Text(value,
              style: dmSans(size: 12, weight: FontWeight.w700, color: color)),
        ]),
      );
}
