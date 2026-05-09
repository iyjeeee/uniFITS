// lib/screens/event_detail_screen.dart — Event detail. Mirrors EventDetailScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';

class EventDetailScreen extends StatelessWidget {
  final String eventId;
  const EventDetailScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context) {
    final event = mockEvents.where((e) => e.id == eventId).firstOrNull;
    if (event == null) return const Scaffold(body: Center(child: Text('Not found')));

    final stripe = event.status == 'completed' ? AppColors.success : AppColors.info;
    final pct    = event.fundingPercent.round();

    return DetailLayout(
      title: 'Event Details',
      onBack: () => context.pop(),
      body: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Title banner
        Container(
          margin: const EdgeInsets.all(AppSpacing.lg),
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border(left: BorderSide(color: stripe, width: 4),
                right: const BorderSide(color: AppColors.borderCard),
                top: const BorderSide(color: AppColors.borderCard),
                bottom: const BorderSide(color: AppColors.borderCard)),
            boxShadow: AppShadow.sm,
          ),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Expanded(child: Text(event.title,
                style: dmSans(size: 18, weight: FontWeight.w700),
                maxLines: 2, overflow: TextOverflow.ellipsis)),
            StatusBadge(status: event.status),
          ]),
        ),

        // Details section
        SectionCard(title: 'Event Information', children: [
          InfoRow(label: 'Date', value: formatDate(event.eventDate)),
          InfoRow(label: 'Time', value: fmt12(event.eventTime)),
          InfoRow(label: 'Location', value: event.location),
          InfoRow(label: 'Status', value: event.status, last: true),
        ]),

        // Funding
        SectionCard(title: 'Funding Progress', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text('Funding Progress',
                    style: dmSans(size: 13, color: AppColors.textMuted)),
                Text('$pct%',
                    style: dmSans(size: 13, weight: FontWeight.w700,
                        color: pct >= 100 ? AppColors.success : AppColors.info)),
              ]),
              const SizedBox(height: 8),
              AppProgressBar(current: event.currentFunding,
                  target: event.targetFunding, showLabel: true),
            ]),
          ),
        ]),

        // Description
        SectionCard(title: 'Description', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Text(event.description,
                style: dmSans(size: 14, color: AppColors.textSecondary)),
          ),
        ]),
        const SizedBox(height: 32),
      ]),
    );
  }
}
