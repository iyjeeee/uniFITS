// lib/widgets/app_layout.dart — Shared layout components.
// Mirrors AppLayout.jsx: Screen, Detail, Section, SectionRow, FilterBar, Empty.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/theme.dart';
import 'ui.dart';

// ── ScreenLayout — tab root screens (full-bleed primary top) ─────────────────
class ScreenLayout extends StatelessWidget {
  final Widget hero;
  final Widget body;
  final bool useScroll;
  final RefreshCallback? onRefresh;
  const ScreenLayout({
    super.key, required this.hero, required this.body,
    this.useScroll = true, this.onRefresh,
  });

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: AppColors.primary,
      statusBarIconBrightness: Brightness.light,
    ));

    final content = useScroll
        ? (onRefresh != null
            ? RefreshIndicator(
                onRefresh: onRefresh!,
                color: AppColors.accent,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  child: Column(children: [hero, body]),
                ),
              )
            : SingleChildScrollView(child: Column(children: [hero, body])))
        : Column(children: [hero, Expanded(child: body)]);

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(
        child: Container(
          color: AppColors.primary, // ensures top area matches hero
          child: content,
        ),
      ),
    );
  }
}

// ── DetailLayout — stack screens (back arrow + scrollable body) ───────────────
class DetailLayout extends StatelessWidget {
  final String title;
  final String? subtitle;
  final VoidCallback? onBack;
  final Widget? trailing;
  final Widget body;
  const DetailLayout({
    super.key, required this.title, this.subtitle,
    this.onBack, this.trailing, required this.body,
  });

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: AppColors.primary,
      statusBarIconBrightness: Brightness.light,
    ));

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(
        child: Column(
          children: [
            // Header bar — plain primary color
            Container(
              color: AppColors.primary,
              padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.lg, vertical: 14),
              child: Row(
                children: [
                  if (onBack != null) ...[
                    GestureDetector(
                      onTap: onBack,
                      child: Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.chevron_left_rounded,
                            color: Colors.white, size: 24),
                      ),
                    ),
                    const SizedBox(width: 10),
                  ],
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title,
                            style: dmSans(
                                size: 17, weight: FontWeight.w700,
                                color: Colors.white),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                        if (subtitle != null)
                          Text(subtitle!,
                              style: dmSans(
                                  size: 12,
                                  color: Colors.white.withOpacity(0.5)),
                              maxLines: 1, overflow: TextOverflow.ellipsis),
                      ],
                    ),
                  ),
                  if (trailing != null) trailing!,
                ],
              ),
            ),
            // Scrollable body
            Expanded(
              child: SingleChildScrollView(
                child: body,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── SectionCard — white card with accent-bar header ───────────────────────────
class SectionCard extends StatelessWidget {
  final String title;
  final String? action;
  final VoidCallback? onAction;
  final int? count;
  final List<Widget> children;
  final EdgeInsetsGeometry? margin;
  const SectionCard({
    super.key, required this.title, this.action, this.onAction,
    this.count, required this.children, this.margin,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ??
          const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, 0),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border.all(color: AppColors.borderCard),
        boxShadow: AppShadow.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.lg, vertical: 14),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.borderInner)),
            ),
            child: Row(
              children: [
                // Accent bar
                Container(
                  width: 4, height: 18,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(title,
                      style: dmSans(
                          size: 15, weight: FontWeight.w700,
                          color: AppColors.textPrimary)),
                ),
                // Count badge
                if (count != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.accentLight,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Text('$count',
                        style: dmSans(
                            size: 11, weight: FontWeight.w700,
                            color: AppColors.accent)),
                  ),
                // Action link
                if (action != null && count == null)
                  GestureDetector(
                    onTap: onAction,
                    child: Text('$action →',
                        style: dmSans(
                            size: 13, weight: FontWeight.w600,
                            color: AppColors.accent)),
                  ),
              ],
            ),
          ),
          ...children,
        ],
      ),
    );
  }
}

// ── SectionRow — generic data row inside a SectionCard ───────────────────────
class SectionRow extends StatelessWidget {
  final Color? iconBg;
  final Color? iconColor;
  final IconData? icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool last;
  const SectionRow({
    super.key, this.iconBg, this.iconColor, this.icon,
    required this.title, this.subtitle, this.trailing,
    this.onTap, this.last = false,
  });

  @override
  Widget build(BuildContext context) {
    final content = Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg, vertical: 13),
      decoration: BoxDecoration(
        color: AppColors.white,
        border: last ? null : const Border(
            bottom: BorderSide(color: AppColors.borderInner)),
      ),
      child: Row(
        children: [
          if (icon != null) ...[
            Container(
              width: 38, height: 38,
              decoration: BoxDecoration(
                color: iconBg ?? AppColors.neutralLight,
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              alignment: Alignment.center,
              child: Icon(icon, color: iconColor ?? AppColors.accent, size: 17),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: dmSans(
                        size: 14, weight: FontWeight.w600,
                        color: AppColors.textPrimary),
                    maxLines: 1, overflow: TextOverflow.ellipsis),
                if (subtitle != null)
                  Text(subtitle!,
                      style: dmSans(size: 12, color: AppColors.textMuted),
                      maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          if (trailing != null) ...[const SizedBox(width: 8), trailing!],
        ],
      ),
    );

    return onTap != null
        ? GestureDetector(onTap: onTap, child: content)
        : content;
  }
}

// ── FilterBar — horizontal chip scroller ─────────────────────────────────────
class FilterBar extends StatelessWidget {
  final List<String> filters;
  final String active;
  final ValueChanged<String> onSelect;
  const FilterBar({
    super.key, required this.filters,
    required this.active, required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        border: Border(bottom: BorderSide(color: AppColors.borderInner)),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl, vertical: 12),
        child: Row(
          children: filters.map((f) {
            final isActive = active == f;
            return GestureDetector(
              onTap: () => onSelect(f),
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
                decoration: BoxDecoration(
                  color: isActive ? AppColors.accent : AppColors.neutralLight,
                  borderRadius: BorderRadius.circular(AppRadius.full),
                  border: Border.all(
                    color: isActive ? AppColors.accent : AppColors.borderCard,
                  ),
                ),
                child: Text(f,
                    style: dmSans(
                        size: 13, weight: FontWeight.w600,
                        color: isActive ? Colors.white : AppColors.textSecondary)),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

// ── EmptyState — centered empty state ────────────────────────────────────────
class EmptyState extends StatelessWidget {
  final IconData? icon;
  final String title;
  final String? subtitle;
  const EmptyState({super.key, this.icon, required this.title, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.xl, vertical: 48),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Container(
                width: 56, height: 56,
                decoration: BoxDecoration(
                  color: AppColors.neutralLight,
                  borderRadius: BorderRadius.circular(28),
                ),
                alignment: Alignment.center,
                child: Icon(icon, color: AppColors.textMuted, size: 28),
              ),
              const SizedBox(height: 14),
            ],
            Text(title,
                style: dmSans(
                    size: 15, weight: FontWeight.w700,
                    color: AppColors.textSecondary),
                textAlign: TextAlign.center),
            if (subtitle != null) ...[
              const SizedBox(height: 5),
              Text(subtitle!,
                  style: dmSans(size: 13, color: AppColors.textMuted),
                  textAlign: TextAlign.center),
            ],
          ],
        ),
      ),
    );
  }
}
