// lib/screens/profile_screen.dart — Profile hub. Mirrors ProfileScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _loggingOut = false;

  Future<void> _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Log Out'),
        content: const Text('Are you sure you want to log out?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true),
              child: Text('Log Out',
                  style: TextStyle(color: AppColors.danger))),
        ],
      ),
    );
    if (confirm != true || !mounted) return;
    setState(() => _loggingOut = true);
    await Future.delayed(const Duration(milliseconds: 900));
    if (!mounted) return;
    context.read<AuthProvider>().logout();
  }

  @override
  Widget build(BuildContext context) {
    final user  = context.watch<AuthProvider>().user!;
    final myTx  = mockTransactions.where((t) => t.userId == user.id).toList();
    final total = myTx.where((t) => t.entryType != 'expense')
        .fold(0.0, (s, t) => s + t.amount);
    final pending = myTx.where((t) => t.status == 'pending').length;
    final myAtt  = mockAttendances.where((a) => a.userId == user.id).toList();
    final present = myAtt.where((a) => a.status == 'present' || a.status == 'late').length;
    final attRate = myAtt.isNotEmpty
        ? '${(present / myAtt.length * 100).round()}%' : '—';

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: Stack(children: [
        SafeArea(
          child: SingleChildScrollView(
            child: Column(children: [
              // ── Hero ────────────────────────────────────────────────────────
              Container(
                color: AppColors.primary,
                padding: const EdgeInsets.fromLTRB(
                    AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, AppSpacing.xl),
                child: Column(children: [
                  // Edit button
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () => context.go('/profile/edit'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          border: Border.all(color: Colors.white.withOpacity(0.2)),
                        ),
                        child: Row(mainAxisSize: MainAxisSize.min, children: [
                          const Icon(AppIcons.edit, size: 13, color: Colors.white),
                          const SizedBox(width: 5),
                          Text('Edit', style: dmSans(size: 13,
                              weight: FontWeight.w600, color: Colors.white)),
                        ]),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Avatar
                  Container(
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                          color: Colors.white.withOpacity(0.25), width: 2.5),
                    ),
                    child: AppAvatar(name: user.fullName, size: 72),
                  ),
                  const SizedBox(height: 12),
                  Text(user.fullName,
                      style: dmSans(size: 20, weight: FontWeight.w700,
                          color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(user.role,
                      style: dmSans(size: 13,
                          color: Colors.white.withOpacity(0.5))),
                  const SizedBox(height: 4),
                  StatusBadge(status: user.status),
                  const SizedBox(height: 16),

                  // Stats strip
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.07),
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      border: Border.all(color: Colors.white.withOpacity(0.10)),
                    ),
                    child: Row(children: [
                      _StatItem(label: 'Contributed',
                          value: formatCurrency(total), color: AppColors.success),
                      Container(width: 1, height: 36,
                          color: Colors.white.withOpacity(0.1)),
                      _StatItem(label: 'Attendance',
                          value: attRate, color: AppColors.info),
                      Container(width: 1, height: 36,
                          color: Colors.white.withOpacity(0.1)),
                      _StatItem(label: 'Pending',
                          value: '$pending', color: AppColors.warning),
                    ]),
                  ),
                ]),
              ),

              // ── Personal Info ──────────────────────────────────────────────
              SectionCard(title: 'Personal Information', children: [
                InfoRow(label: 'Employee #', value: user.employeeNumber),
                InfoRow(label: 'Department', value: user.department),
                InfoRow(label: 'Occupation', value: user.occupation),
                InfoRow(label: 'Gender', value: user.gender),
                InfoRow(label: 'Joined', value: formatDate(user.joined)),
                InfoRow(label: 'City', value: user.addressCity ?? '—'),
                InfoRow(label: 'Province', value: user.addressProvince ?? '—',
                    last: true),
              ]),

              // ── Contact ────────────────────────────────────────────────────
              SectionCard(title: 'Contact', children: [
                InfoRow(label: 'Email', value: user.email),
                InfoRow(label: 'Mobile', value: user.contactNumber, last: true),
              ]),

              // ── Quick links ────────────────────────────────────────────────
              SectionCard(title: 'My Records', children: [
                SectionRow(
                    icon: AppIcons.transaction, iconBg: AppColors.accentLight,
                    iconColor: AppColors.accent,
                    title: 'My Transactions',
                    subtitle: '${myTx.length} records',
                    trailing: const Icon(AppIcons.chevronRight,
                        size: 18, color: AppColors.textMuted),
                    onTap: () => context.go('/profile/transactions')),
                SectionRow(
                    icon: AppIcons.report, iconBg: AppColors.infoLight,
                    iconColor: AppColors.info,
                    title: 'My Financial Report',
                    subtitle: 'Summary & breakdown',
                    trailing: const Icon(AppIcons.chevronRight,
                        size: 18, color: AppColors.textMuted),
                    onTap: () => context.go('/profile/report')),
                SectionRow(
                    icon: AppIcons.attendance,
                    iconBg: AppColors.successLight,
                    iconColor: AppColors.success,
                    title: 'My Attendance',
                    subtitle: '${myAtt.length} records',
                    trailing: const Icon(AppIcons.chevronRight,
                        size: 18, color: AppColors.textMuted),
                    last: true,
                    onTap: () => context.go('/profile/attendance')),
              ]),

              // ── Logout ─────────────────────────────────────────────────────
              Container(
                margin: const EdgeInsets.fromLTRB(
                    AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, 0),
                child: PrimaryButton(
                  label: 'Log Out',
                  variant: BtnVariant.danger,
                  onPress: _handleLogout,
                  icon: const Icon(AppIcons.logout, color: Colors.white, size: 18),
                ),
              ),
              const SizedBox(height: 32),
            ]),
          ),
        ),

        // Logout overlay
        if (_loggingOut)
          Container(
            color: Colors.black.withOpacity(0.45),
            alignment: Alignment.center,
            child: Container(
              width: 220, padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                boxShadow: AppShadow.lg,
              ),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.dangerLight,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(AppIcons.logout, color: AppColors.danger, size: 24),
                ),
                const SizedBox(height: 16),
                const CircularProgressIndicator(color: AppColors.danger),
                const SizedBox(height: 16),
                Text('Logging out…', style: dmSans(size: 16, weight: FontWeight.w700)),
                const SizedBox(height: 4),
                Text('See you next time!',
                    style: dmSans(size: 13, color: AppColors.textMuted)),
              ]),
            ),
          ),
      ]),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label, value;
  final Color color;
  const _StatItem({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Expanded(
    child: Column(children: [
      Text(value, style: dmSans(size: 14, weight: FontWeight.w700,
          color: Colors.white), textAlign: TextAlign.center),
      const SizedBox(height: 3),
      Text(label, style: dmSans(size: 11, color: Colors.white.withOpacity(0.5)),
          textAlign: TextAlign.center),
      const SizedBox(height: 5),
      Container(height: 2, width: 20,
          decoration: BoxDecoration(color: color,
              borderRadius: BorderRadius.circular(1))),
    ]),
  );
}
