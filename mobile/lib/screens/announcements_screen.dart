// lib/screens/announcements_screen.dart — Announcements list. Mirrors AnnouncementsScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

const _announcementFilters = ['All', 'Pinned', 'General'];

class AnnouncementsScreen extends StatefulWidget {
  const AnnouncementsScreen({super.key});
  @override State<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends State<AnnouncementsScreen> {
  String _filter = 'All';

  List<Announcement> get _filtered {
    final sorted = [...mockAnnouncements]
      ..sort((a,b) => b.createdAt.compareTo(a.createdAt));
    switch (_filter) {
      case 'Pinned':  return sorted.where((a) => a.isPinned).toList();
      case 'General': return sorted.where((a) => !a.isPinned).toList();
      default:        return sorted;
    }
  }

  @override
  Widget build(BuildContext context) {
    final items  = _filtered;
    final pinned = mockAnnouncements.where((a) => a.isPinned).length;

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(child: Column(children: [
        Container(
          color: AppColors.primary,
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, AppSpacing.xl),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Announcements', style: dmSerif(size: 28, color: Colors.white)),
            const SizedBox(height: 4),
            Text('${mockAnnouncements.length} total · $pinned pinned',
                style: dmSans(size: 13, color: Colors.white.withOpacity(0.5))),
          ]),
        ),
        FilterBar(filters: _announcementFilters, active: _filter,
            onSelect: (f) => setState(() => _filter = f)),
        Expanded(
          child: items.isEmpty
              ? const EmptyState(icon: AppIcons.announcements,
                  title: 'No announcements', subtitle: 'Check back later')
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(
                      AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 32),
                  itemCount: items.length,
                  itemBuilder: (_, i) => _AnnouncementCard(
                      item: items[i],
                      onTap: () => context.go('/announcements/${items[i].id}')),
                ),
        ),
      ])),
    );
  }
}

class _AnnouncementCard extends StatelessWidget {
  final Announcement item;
  final VoidCallback onTap;
  const _AnnouncementCard({required this.item, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.borderCard),
          boxShadow: AppShadow.sm,
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            if (item.isPinned) ...[
              const Icon(AppIcons.pin, size: 14, color: AppColors.accent),
              const SizedBox(width: 5),
            ],
            Expanded(child: Text(item.title,
                style: dmSans(size: 15, weight: FontWeight.w700),
                maxLines: 2, overflow: TextOverflow.ellipsis)),
          ]),
          const SizedBox(height: 6),
          Text(item.content,
              style: dmSans(size: 13, color: AppColors.textSecondary),
              maxLines: 2, overflow: TextOverflow.ellipsis),
          const SizedBox(height: 10),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(item.createdBy,
                style: dmSans(size: 12, weight: FontWeight.w600,
                    color: AppColors.accent)),
            Text(relativeTime(item.createdAt),
                style: dmSans(size: 12, color: AppColors.textMuted)),
          ]),
        ]),
      ),
    );
  }
}
