// lib/screens/projects_screen.dart — Projects list. Mirrors ProjectsScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

const _filters = ['All', 'Ongoing', 'Upcoming', 'Completed'];

Color _stripeColor(String status) {
  switch (status) {
    case 'ongoing':   return AppColors.accent;
    case 'upcoming':  return AppColors.warning;
    case 'completed': return AppColors.success;
    default:          return AppColors.textMuted;
  }
}

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});
  @override State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  String _filter = 'All';

  List<Project> get _filtered {
    final sorted = [...mockProjects]
      ..sort((a,b) => b.startDate.compareTo(a.startDate));
    if (_filter == 'All') return sorted;
    return sorted.where(
        (p) => p.status.toLowerCase() == _filter.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    final projects = _filtered;
    final counts = {
      'All': mockProjects.length,
      'Ongoing':   mockProjects.where((p) => p.status == 'ongoing').length,
      'Upcoming':  mockProjects.where((p) => p.status == 'upcoming').length,
      'Completed': mockProjects.where((p) => p.status == 'completed').length,
    };

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(
        child: Column(children: [
          // Hero header
          Container(
            color: AppColors.primary,
            padding: const EdgeInsets.fromLTRB(
                AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, AppSpacing.xl),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Projects', style: dmSerif(size: 28, color: Colors.white)),
              const SizedBox(height: 4),
              Text('${mockProjects.length} total · '
                  '${counts['Ongoing']} ongoing · ${counts['Upcoming']} upcoming',
                  style: dmSans(size: 13, color: Colors.white.withOpacity(0.5))),
            ]),
          ),
          // Filter bar
          FilterBar(filters: _filters, active: _filter,
              onSelect: (f) => setState(() => _filter = f)),
          // List
          Expanded(
            child: projects.isEmpty
                ? const EmptyState(icon: AppIcons.projects,
                    title: 'No projects found',
                    subtitle: 'Try a different filter')
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(
                        AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 32),
                    itemCount: projects.length,
                    itemBuilder: (_, i) => _ProjectCard(
                        project: projects[i],
                        onTap: () => context.go('/projects/${projects[i].id}')),
                  ),
          ),
        ]),
      ),
    );
  }
}

class _ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;
  const _ProjectCard({required this.project, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final stripe = _stripeColor(project.status);
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
          // Colored left stripe
          Container(
            width: 4,
            decoration: BoxDecoration(
              color: stripe,
              borderRadius: const BorderRadius.horizontal(
                  left: Radius.circular(AppRadius.lg)),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Expanded(child: Text(project.title,
                      style: dmSans(size: 15, weight: FontWeight.w700),
                      maxLines: 2, overflow: TextOverflow.ellipsis)),
                  const SizedBox(width: 8),
                  StatusBadge(status: project.status),
                ]),
                const SizedBox(height: 4),
                Text(project.projectType,
                    style: dmSans(size: 12.5, weight: FontWeight.w600, color: stripe)),
                const SizedBox(height: 4),
                Row(children: [
                  Icon(AppIcons.location, size: 13, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Expanded(child: Text(project.location,
                      style: dmSans(size: 12, color: AppColors.textMuted),
                      maxLines: 1, overflow: TextOverflow.ellipsis)),
                ]),
                const SizedBox(height: 6),
                Text(project.description,
                    style: dmSans(size: 13, color: AppColors.textSecondary),
                    maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 12),
                AppProgressBar(current: project.currentFunding,
                    target: project.targetFunding, showLabel: true),
              ]),
            ),
          ),
        ]),
      ),
    );
  }
}
