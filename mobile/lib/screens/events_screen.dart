// lib/screens/events_screen.dart — Events list. Mirrors EventsScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

const _eventFilters = ['All', 'Upcoming', 'Completed'];

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});
  @override State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  String _filter = 'All';

  List<AppEvent> get _filtered {
    final sorted = [...mockEvents]
      ..sort((a,b) => b.eventDate.compareTo(a.eventDate));
    if (_filter == 'All') return sorted;
    return sorted.where(
        (e) => e.status.toLowerCase() == _filter.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    final events   = _filtered;
    final upcoming = mockEvents.where((e) => e.status == 'upcoming').length;

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(child: Column(children: [
        // Hero
        Container(
          color: AppColors.primary,
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, AppSpacing.xl),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Events', style: dmSerif(size: 28, color: Colors.white)),
            const SizedBox(height: 4),
            Text('${mockEvents.length} total · $upcoming upcoming',
                style: dmSans(size: 13, color: Colors.white.withOpacity(0.5))),
          ]),
        ),
        FilterBar(filters: _eventFilters, active: _filter,
            onSelect: (f) => setState(() => _filter = f)),
        Expanded(
          child: events.isEmpty
              ? const EmptyState(icon: AppIcons.events,
                  title: 'No events found',
                  subtitle: 'Try a different filter')
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(
                      AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 32),
                  itemCount: events.length,
                  itemBuilder: (_, i) => _EventCard(
                      event: events[i],
                      onTap: () => context.go('/events/${events[i].id}')),
                ),
        ),
      ])),
    );
  }
}

class _EventCard extends StatelessWidget {
  final AppEvent event;
  final VoidCallback onTap;
  const _EventCard({required this.event, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isUpcoming = event.status == 'upcoming';
    final stripe = isUpcoming ? AppColors.info : AppColors.success;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: AppColors.borderCard),
          boxShadow: AppShadow.sm,
        ),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(width: 4,
            decoration: BoxDecoration(color: stripe,
                borderRadius: const BorderRadius.horizontal(
                    left: Radius.circular(AppRadius.lg)))),
          Expanded(child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text(event.title,
                    style: dmSans(size: 15, weight: FontWeight.w700),
                    maxLines: 2, overflow: TextOverflow.ellipsis)),
                const SizedBox(width: 8),
                StatusBadge(status: event.status),
              ]),
              const SizedBox(height: 8),
              Row(children: [
                Icon(AppIcons.date, size: 13, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Text(formatDate(event.eventDate),
                    style: dmSans(size: 12.5, color: AppColors.textMuted)),
                const SizedBox(width: 12),
                Icon(AppIcons.time, size: 13, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Text(fmt12(event.eventTime),
                    style: dmSans(size: 12.5, color: AppColors.textMuted)),
              ]),
              const SizedBox(height: 4),
              Row(children: [
                Icon(AppIcons.location, size: 13, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Expanded(child: Text(event.location,
                    style: dmSans(size: 12.5, color: AppColors.textMuted),
                    maxLines: 1, overflow: TextOverflow.ellipsis)),
              ]),
              const SizedBox(height: 10),
              AppProgressBar(current: event.currentFunding,
                  target: event.targetFunding, showLabel: true),
            ]),
          )),
        ]),
      ),
    );
  }
}
