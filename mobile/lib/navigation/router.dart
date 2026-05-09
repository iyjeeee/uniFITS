// lib/navigation/router.dart — Root navigation using go_router.
// Mirrors AppNavigator.jsx: Login gate, bottom tabs, stack screens.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../context/auth_provider.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/projects_screen.dart';
import '../screens/project_detail_screen.dart';
import '../screens/events_screen.dart';
import '../screens/event_detail_screen.dart';
import '../screens/announcements_screen.dart';
import '../screens/announcement_detail_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/edit_profile_screen.dart';
import '../screens/my_transactions_screen.dart';
import '../screens/my_report_screen.dart';
import '../screens/my_attendance_screen.dart';
import '../constants/theme.dart';
import 'package:google_fonts/google_fonts.dart';

// ── Bottom tab shell ───────────────────────────────────────────────────────────
class MainShell extends StatefulWidget {
  final StatefulNavigationShell navigationShell;
  const MainShell({super.key, required this.navigationShell});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final List<({IconData icon, String label})> _tabs = const [
    (icon: Icons.home_rounded, label: 'Home'),
    (icon: Icons.volunteer_activism_rounded, label: 'Projects'),
    (icon: Icons.event_rounded, label: 'Events'),
    (icon: Icons.campaign_rounded, label: 'Updates'),
    (icon: Icons.person_rounded, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.navigationShell,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.tabBar,
          border: const Border(top: BorderSide(color: AppColors.borderCard)),
          boxShadow: AppShadow.md,
        ),
        child: SafeArea(
          child: SizedBox(
            height: 56,
            child: Row(
              children: List.generate(_tabs.length, (i) {
                final focused = widget.navigationShell.currentIndex == i;
                final color =
                    focused ? AppColors.tabActive : AppColors.tabInactive;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => widget.navigationShell.goBranch(i,
                        initialLocation:
                            i == widget.navigationShell.currentIndex),
                    behavior: HitTestBehavior.opaque,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_tabs[i].icon, color: color, size: 22),
                        const SizedBox(height: 3),
                        Text(_tabs[i].label,
                            style: GoogleFonts.dmSans(
                              fontSize: 10,
                              fontWeight:
                                  focused ? FontWeight.w700 : FontWeight.w500,
                              color: color,
                              letterSpacing: 0.1,
                            )),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Router factory ─────────────────────────────────────────────────────────────
GoRouter buildRouter(AuthProvider auth) {
  return GoRouter(
    initialLocation: '/home',
    redirect: (context, state) {
      final loggedIn = auth.isLoggedIn;
      final onLogin = state.matchedLocation == '/login';
      if (!loggedIn && !onLogin) return '/login';
      if (loggedIn && onLogin) return '/home';
      return null;
    },
    refreshListenable: auth,
    routes: [
      // Login — outside shell
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),

      // Main shell with bottom tabs
      StatefulShellRoute.indexedStack(
        builder: (_, __, shell) => MainShell(navigationShell: shell),
        branches: [
          // ── Home tab
          StatefulShellBranch(routes: [
            GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
          ]),
          // ── Projects tab
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/projects',
              builder: (_, __) => const ProjectsScreen(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (_, state) => ProjectDetailScreen(
                      projectId: state.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          // ── Events tab
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/events',
              builder: (_, __) => const EventsScreen(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (_, state) =>
                      EventDetailScreen(eventId: state.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          // ── Announcements tab
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/announcements',
              builder: (_, __) => const AnnouncementsScreen(),
              routes: [
                GoRoute(
                  path: ':id',
                  builder: (_, state) => AnnouncementDetailScreen(
                      announcementId: state.pathParameters['id']!),
                ),
              ],
            ),
          ]),
          // ── Profile tab (+ sub-screens)
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/profile',
              builder: (_, __) => const ProfileScreen(),
              routes: [
                GoRoute(
                    path: 'edit',
                    builder: (_, __) => const EditProfileScreen()),
                GoRoute(
                    path: 'transactions',
                    builder: (_, __) => const MyTransactionsScreen()),
                GoRoute(
                    path: 'report', builder: (_, __) => const MyReportScreen()),
                GoRoute(
                    path: 'attendance',
                    builder: (_, __) => const MyAttendanceScreen()),
              ],
            ),
          ]),
        ],
      ),
    ],
  );
}
