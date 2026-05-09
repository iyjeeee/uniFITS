// lib/screens/announcement_detail_screen.dart — Mirrors AnnouncementDetailScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';

class AnnouncementDetailScreen extends StatelessWidget {
  final String announcementId;
  const AnnouncementDetailScreen({super.key, required this.announcementId});

  @override
  Widget build(BuildContext context) {
    final item = mockAnnouncements.where((a) => a.id == announcementId).firstOrNull;
    if (item == null) return const Scaffold(body: Center(child: Text('Not found')));

    return DetailLayout(
      title: 'Announcement',
      onBack: () => context.pop(),
      body: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Title card
        Container(
          margin: const EdgeInsets.all(AppSpacing.lg),
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppRadius.lg),
            border: Border.all(color: AppColors.borderCard),
            boxShadow: AppShadow.sm,
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (item.isPinned)
              Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentLight,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                ),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(AppIcons.pin, size: 12, color: AppColors.accent),
                  const SizedBox(width: 5),
                  Text('Pinned', style: dmSans(size: 11, weight: FontWeight.w700,
                      color: AppColors.accent)),
                ]),
              ),
            Text(item.title,
                style: dmSans(size: 18, weight: FontWeight.w700)),
            const SizedBox(height: 8),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(item.createdBy,
                  style: dmSans(size: 12.5, weight: FontWeight.w600,
                      color: AppColors.accent)),
              Text(formatDate(item.createdAt),
                  style: dmSans(size: 12, color: AppColors.textMuted)),
            ]),
          ]),
        ),

        // Content
        SectionCard(title: 'Message', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Text(item.content,
                style: dmSans(size: 14, color: AppColors.textSecondary,
                    letterSpacing: 0.1),
                textHeightBehavior: const TextHeightBehavior()),
          ),
        ]),
        const SizedBox(height: 32),
      ]),
    );
  }
}
