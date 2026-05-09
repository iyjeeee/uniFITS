// lib/screens/home_screen.dart — Home dashboard. Mirrors HomeScreen.jsx.
// Greeting hero + contributions card + KPI 2×2 grid + transactions + calendar.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';
import '../data/mock_data.dart';
import '../models/models.dart';

// Time-based greeting
String _greeting() {
  final h = DateTime.now().hour;
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _refreshing = false;

  Future<void> _refresh() async {
    setState(() => _refreshing = true);
    await Future.delayed(const Duration(milliseconds: 600));
    setState(() => _refreshing = false);
  }

  @override
  Widget build(BuildContext context) {
    final user  = context.watch<AuthProvider>().user!;
    final myTx  = mockTransactions.where((t) => t.userId == user.id).toList();
    final pending = myTx.where((t) => t.status == 'pending').toList();
    final totalContrib = myTx
        .where((t) => t.entryType == 'contribution' && t.status == 'completed')
        .fold(0.0, (s, t) => s + t.amount);

    final upcomingEv = mockEvents.where((e) => e.status == 'upcoming').length;
    final myAtt   = mockAttendances.where((a) => a.userId == user.id).toList();
    final present = myAtt.where((a) => a.status == 'present' || a.status == 'late').length;
    final recentTx = (myTx..sort((a,b) => b.transactionDate.compareTo(a.transactionDate)))
        .take(3).toList();

    return Scaffold(
      backgroundColor: AppColors.bgApp,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _refresh,
          color: AppColors.accent,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              children: [
                _buildHero(user, totalContrib, pending, myTx),
                _buildKpiGrid(upcomingEv, myAtt.length, present, myTx, pending),
                _buildTransactions(recentTx),
                _CalendarSection(events: mockEvents, projects: mockProjects),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Hero header ─────────────────────────────────────────────────────────────
  Widget _buildHero(AppUser user, double totalContrib,
      List<Transaction> pending, List<Transaction> myTx) {
    return Container(
      color: AppColors.primary,
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, AppSpacing.xl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(_greeting(),
                    style: dmSans(size: 12.5,
                        color: Colors.white.withOpacity(0.5))),
                const SizedBox(height: 2),
                Text(user.firstName,
                    style: dmSerif(size: 24, color: Colors.white)),
                const SizedBox(height: 8),
                Row(children: [
                  Text(user.role,
                      style: dmSans(size: 12,
                          color: Colors.white.withOpacity(0.4))),
                  Text(' · ', style: dmSans(size: 12,
                      color: Colors.white.withOpacity(0.25))),
                  Text(user.employeeNumber,
                      style: dmSans(size: 12,
                          color: Colors.white.withOpacity(0.4))),
                ]),
              ]),
              AppAvatar(name: user.fullName, size: 46),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Contributions card
          Container(
            padding: const EdgeInsets.all(AppSpacing.lg),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.07),
              borderRadius: BorderRadius.circular(AppRadius.xl),
              border: Border.all(color: Colors.white.withOpacity(0.10)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('My Total Contributions',
                          style: dmSans(size: 11.5,
                              color: Colors.white.withOpacity(0.5))),
                      const SizedBox(height: 4),
                      Text(formatCurrency(totalContrib),
                          style: dmSerif(size: 30, color: Colors.white)),
                    ]),
                    if (pending.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withOpacity(0.18),
                          borderRadius: BorderRadius.circular(AppRadius.full),
                          border: Border.all(
                              color: AppColors.warning.withOpacity(0.3)),
                        ),
                        child: Row(children: [
                          Container(width: 6, height: 6,
                              decoration: const BoxDecoration(
                                  color: AppColors.warning,
                                  shape: BoxShape.circle)),
                          const SizedBox(width: 5),
                          Text('${pending.length} pending',
                              style: dmSans(size: 11.5,
                                  weight: FontWeight.w600,
                                  color: AppColors.warning)),
                        ]),
                      ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(height: 1, color: Colors.white.withOpacity(0.08)),
                const SizedBox(height: 12),
                Row(children: [
                  _contribMeta('Transactions', '${myTx.length}'),
                  Container(width: 1, height: 28,
                      color: Colors.white.withOpacity(0.1),
                      margin: const EdgeInsets.symmetric(horizontal: 10)),
                  _contribMeta('Completed',
                      '${myTx.where((t) => t.status == 'completed').length}'),
                  Container(width: 1, height: 28,
                      color: Colors.white.withOpacity(0.1),
                      margin: const EdgeInsets.symmetric(horizontal: 10)),
                  _contribMeta('Pending', '${pending.length}'),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _contribMeta(String label, String value) => Expanded(
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: dmSans(size: 10.5,
          color: Colors.white.withOpacity(0.4))),
      const SizedBox(height: 3),
      Text(value, style: dmSans(size: 12.5,
          weight: FontWeight.w600, color: Colors.white)),
    ]),
  );

  // ── KPI 2×2 grid ────────────────────────────────────────────────────────────
  Widget _buildKpiGrid(int upcomingEv, int attTotal, int attPresent,
      List<Transaction> myTx, List<Transaction> pending) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0),
      child: GridView.count(
        crossAxisCount: 2, shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 10, crossAxisSpacing: 10,
        childAspectRatio: 1.45,
        children: [
          _KpiCard(label:'Projects',
              value:'${mockProjects.length}',
              sub:'${mockProjects.where((p)=>p.status=='ongoing').length} ongoing',
              color: AppColors.accent, icon: AppIcons.projects),
          _KpiCard(label:'Events',
              value:'${mockEvents.length}',
              sub:'$upcomingEv upcoming',
              color: AppColors.info, icon: AppIcons.events),
          _KpiCard(label:'Attendance',
              value: attTotal > 0 ? '$attPresent/$attTotal' : '—',
              sub: attTotal > 0
                  ? '${(attPresent / attTotal * 100).round()}% rate'
                  : 'No records',
              color: AppColors.success, icon: AppIcons.attendance),
          _KpiCard(label:'Transactions',
              value:'${myTx.length}',
              sub:'${pending.length} pending',
              color: AppColors.warning, icon: AppIcons.money),
        ],
      ),
    );
  }

  // ── Recent Transactions section ──────────────────────────────────────────────
  Widget _buildTransactions(List<Transaction> recentTx) {
    return SectionCard(
      title: 'Recent Transactions',
      action: 'See all',
      onAction: () => context.go('/profile/transactions'),
      children: recentTx.isEmpty
          ? [Padding(
              padding: const EdgeInsets.all(28),
              child: Center(child: Text('No transactions yet',
                  style: dmSans(size: 14, color: AppColors.textMuted))),
            )]
          : recentTx.asMap().entries.map((entry) {
              final tx       = entry.value;
              final isLast   = entry.key == recentTx.length - 1;
              final isCredit = tx.entryType != 'expense';
              return Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg, vertical: 14),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  border: isLast ? null : const Border(
                      bottom: BorderSide(color: AppColors.borderInner)),
                ),
                child: Row(children: [
                  Container(
                    width: 40, height: 40, decoration: BoxDecoration(
                      color: isCredit ? AppColors.successLight : AppColors.dangerLight,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Icon(AppIcons.money,
                        color: isCredit ? AppColors.success : AppColors.danger,
                        size: 15),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(tx.description.isNotEmpty ? tx.description : tx.category,
                          style: dmSans(size: 14, weight: FontWeight.w600),
                          maxLines: 1, overflow: TextOverflow.ellipsis),
                      Text('${formatDate(tx.transactionDate)} · ${tx.paymentMethod}',
                          style: dmSans(size: 12, color: AppColors.textMuted)),
                    ],
                  )),
                  const SizedBox(width: 8),
                  Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    Text('${isCredit ? '+' : '−'}${formatCurrency(tx.amount)}',
                        style: dmSans(size: 14, weight: FontWeight.w700,
                            color: isCredit ? AppColors.success : AppColors.danger)),
                    const SizedBox(height: 4),
                    StatusBadge(status: tx.status),
                  ]),
                ]),
              );
            }).toList(),
    );
  }
}

// ── KPI card widget ───────────────────────────────────────────────────────────
class _KpiCard extends StatelessWidget {
  final String label, value, sub;
  final Color color;
  final IconData icon;
  const _KpiCard({required this.label, required this.value, required this.sub,
      required this.color, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppRadius.lg),
        border: Border(
          top: BorderSide(color: color, width: 3),
          left: const BorderSide(color: AppColors.borderCard),
          right: const BorderSide(color: AppColors.borderCard),
          bottom: const BorderSide(color: AppColors.borderCard),
        ),
        boxShadow: AppShadow.sm,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(
          width: 36, height: 36,
          decoration: BoxDecoration(
            color: color.withOpacity(0.12),
            borderRadius: BorderRadius.circular(AppRadius.md),
          ),
          alignment: Alignment.center,
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(height: 10),
        Text(value, style: dmSans(size: 22, weight: FontWeight.w800)),
        Text(label, style: dmSans(size: 12.5, weight: FontWeight.w600,
            color: AppColors.textSecondary)),
        Text(sub, style: dmSans(size: 11.5, color: AppColors.textMuted)),
      ]),
    );
  }
}

// ── Calendar section ──────────────────────────────────────────────────────────
class _CalendarSection extends StatefulWidget {
  final List<dynamic> events, projects;
  const _CalendarSection({required this.events, required this.projects});
  @override State<_CalendarSection> createState() => _CalendarSectionState();
}

class _CalendarSectionState extends State<_CalendarSection> {
  late int _year, _month;
  final _monthNames = ['Jan','Feb','Mar','Apr','May','Jun',
                       'Jul','Aug','Sep','Oct','Nov','Dec'];
  final _dayNames   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _year = now.year; _month = now.month;
  }

  void _prev() => setState(() {
    if (_month == 1) { _year--; _month = 12; } else _month--;
  });
  void _next() => setState(() {
    if (_month == 12) { _year++; _month = 1; } else _month++;
  });

  Set<int> get _activityDays {
    final days = <int>{};
    for (final e in widget.events) {
      final d = DateTime.tryParse(e.eventDate);
      if (d != null && d.year == _year && d.month == _month) days.add(d.day);
    }
    for (final p in widget.projects) {
      final d = DateTime.tryParse(p.startDate);
      if (d != null && d.year == _year && d.month == _month) days.add(d.day);
    }
    return days;
  }

  List<Map<String, dynamic>> get _monthItems {
    final items = <Map<String, dynamic>>[];
    for (final e in widget.events) {
      final d = DateTime.tryParse(e.eventDate);
      if (d != null && d.year == _year && d.month == _month)
        items.add({'date': e.eventDate, 'title': e.title,
            'type': 'event', 'status': e.status});
    }
    for (final p in widget.projects) {
      final d = DateTime.tryParse(p.startDate);
      if (d != null && d.year == _year && d.month == _month)
        items.add({'date': p.startDate, 'title': p.title,
            'type': 'project', 'status': p.status});
    }
    items.sort((a,b) => a['date'].compareTo(b['date']));
    return items;
  }

  List<int?> get _calCells {
    final first    = DateTime(_year, _month, 1).weekday % 7;
    final daysInMo = DateTime(_year, _month + 1, 0).day;
    return [...List.filled(first, null),
            ...List.generate(daysInMo, (i) => i + 1)];
  }

  @override
  Widget build(BuildContext context) {
    final now      = DateTime.now();
    final cells    = _calCells;
    final activity = _activityDays;
    final items    = _monthItems;

    return SectionCard(
      title: 'Calendar',
      children: [
        // Month nav
        Container(
          padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg, vertical: 12),
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.borderInner))),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(onTap: _prev,
                child: const SizedBox(width: 32, height: 32,
                  child: Icon(Icons.chevron_left_rounded,
                      color: AppColors.accent, size: 24))),
              Text('${_monthNames[_month-1]} $_year',
                  style: dmSans(size: 15, weight: FontWeight.w700)),
              GestureDetector(onTap: _next,
                child: const SizedBox(width: 32, height: 32,
                  child: Icon(Icons.chevron_right_rounded,
                      color: AppColors.accent, size: 24))),
            ],
          ),
        ),
        // Day labels
        Container(
          padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg, vertical: 8),
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.borderInner))),
          child: Row(children: _dayNames.map((d) => Expanded(
            child: Text(d, textAlign: TextAlign.center,
                style: dmSans(size: 11, weight: FontWeight.w600,
                    color: AppColors.textMuted)),
          )).toList()),
        ),
        // Calendar grid
        Container(
          padding: const EdgeInsets.fromLTRB(
              AppSpacing.lg, 8, AppSpacing.lg, 8),
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: AppColors.borderInner))),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 7, childAspectRatio: 1),
            itemCount: cells.length,
            itemBuilder: (_, i) {
              final day = cells[i];
              if (day == null) return const SizedBox();
              final isToday = day == now.day && _month == now.month
                  && _year == now.year;
              final hasDot  = activity.contains(day);
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 30, height: 30,
                    decoration: BoxDecoration(
                      color: isToday ? AppColors.accent : Colors.transparent,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Text('$day', style: dmSans(
                        size: 13,
                        weight: isToday ? FontWeight.w700 : FontWeight.w500,
                        color: isToday ? Colors.white : AppColors.textPrimary)),
                  ),
                  if (hasDot)
                    Container(width: 4, height: 4,
                        margin: const EdgeInsets.only(top: 2),
                        decoration: const BoxDecoration(
                            color: AppColors.accent, shape: BoxShape.circle)),
                ],
              );
            },
          ),
        ),
        // Month events list
        if (items.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            child: Center(child: Text('No activities this month',
                style: dmSans(size: 13, color: AppColors.textMuted))),
          )
        else
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Column(children: items.asMap().entries.map((entry) {
              final item  = entry.value;
              final isLast = entry.key == items.length - 1;
              final isEvt  = item['type'] == 'event';
              final dotClr = isEvt ? AppColors.info : AppColors.accent;
              return Container(
                padding: const EdgeInsets.symmetric(vertical: 11),
                decoration: BoxDecoration(border: isLast ? null : const Border(
                    bottom: BorderSide(color: AppColors.borderInner))),
                child: Row(children: [
                  Container(width: 8, height: 8,
                      decoration: BoxDecoration(color: dotClr, shape: BoxShape.circle)),
                  const SizedBox(width: 10),
                  Expanded(child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['title'], style: dmSans(
                          size: 13.5, weight: FontWeight.w600)),
                      Text(formatDate(item['date']),
                          style: dmSans(size: 11.5,
                              color: AppColors.textMuted)),
                    ],
                  )),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isEvt ? AppColors.infoLight : AppColors.accentLight,
                      borderRadius: BorderRadius.circular(AppRadius.full),
                    ),
                    child: Text(item['type'],
                        style: dmSans(size: 10.5, weight: FontWeight.w700,
                            color: isEvt ? AppColors.info : AppColors.accent)),
                  ),
                ]),
              );
            }).toList()),
          ),
      ],
    );
  }
}
