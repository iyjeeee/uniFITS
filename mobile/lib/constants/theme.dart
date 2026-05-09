// lib/constants/theme.dart — Single source of truth for all design tokens.
// Mirrors theme.js exactly so web and mobile stay visually consistent.

import 'package:flutter/material.dart';

// ── Colors ────────────────────────────────────────────────────────────────────
class AppColors {
  // Brand
  static const Color primary     = Color(0xFF1E2128); // dark navy — header, nav
  static const Color accent      = Color(0xFF4B5EAA); // indigo blue — buttons, links
  static const Color accentDark  = Color(0xFF3D52A0); // pressed / table header
  static const Color accentLight = Color(0x144B5EAA); // 8% opacity
  static const Color accentMid   = Color(0x264B5EAA); // 15% opacity

  // Status
  static const Color success      = Color(0xFF2E7D52);
  static const Color successLight = Color(0x142E7D52);
  static const Color danger       = Color(0xFFC0392B);
  static const Color dangerLight  = Color(0x14C0392B);
  static const Color warning      = Color(0xFFD4860A);
  static const Color warningLight = Color(0x14D4860A);
  static const Color info         = Color(0xFF2471A3);
  static const Color infoLight    = Color(0x142471A3);

  // Backgrounds
  static const Color white       = Color(0xFFFFFFFF);
  static const Color bgApp       = Color(0xFFEEF2F8); // page background
  static const Color neutralLight= Color(0xFFF2F5FB);

  // Borders
  static const Color border      = Color(0xFFE5E9EF);
  static const Color borderCard  = Color(0xFFC8D3E8);
  static const Color borderInner = Color(0xFFD8DFF0);

  // Text
  static const Color textPrimary   = Color(0xFF1E2128);
  static const Color textSecondary = Color(0xFF4B5563);
  static const Color textMuted     = Color(0xFF9CA3AF);
  static const Color textOnDark    = Color(0xFFF9FAFB);

  // Tab / nav
  static const Color tabActive   = Color(0xFF4B5EAA);
  static const Color tabInactive = Color(0xFF9CA3AF);
  static const Color tabBar      = Color(0xFFFFFFFF);

  // Avatar palette — deterministic color from name hash
  static const List<Color> avatarColors = [
    Color(0xFF4B5EAA), Color(0xFF2E7D52), Color(0xFFD4860A),
    Color(0xFF2471A3), Color(0xFF7B3FA0), Color(0xFFC05621),
  ];

  static Color avatarColor(String name) {
    if (name.isEmpty) return avatarColors[0];
    final sum = name.codeUnits.fold(0, (a, c) => a + c);
    return avatarColors[sum % avatarColors.length];
  }
}

// ── Status badge color map ─────────────────────────────────────────────────────
class StatusStyle {
  final Color bg;
  final Color text;
  const StatusStyle(this.bg, this.text);
}

class AppStatus {
  static const Map<String, StatusStyle> colors = {
    'active':       StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'completed':    StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'paid':         StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'present':      StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'approved':     StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'ongoing':      StatusStyle(Color(0x1A4B5EAA), Color(0xFF4B5EAA)),
    'upcoming':     StatusStyle(Color(0x1AD4860A), Color(0xFFD4860A)),
    'pending':      StatusStyle(Color(0x1AD4860A), Color(0xFFD4860A)),
    'late':         StatusStyle(Color(0x1AD4860A), Color(0xFFD4860A)),
    'partial':      StatusStyle(Color(0x1AD4860A), Color(0xFFD4860A)),
    'inactive':     StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'cancelled':    StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'rejected':     StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'unpaid':       StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'absent':       StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'failed':       StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'excused':      StatusStyle(Color(0x1A2471A3), Color(0xFF2471A3)),
    'contribution': StatusStyle(Color(0x1A2E7D52), Color(0xFF2E7D52)),
    'expense':      StatusStyle(Color(0x1AC0392B), Color(0xFFC0392B)),
    'income':       StatusStyle(Color(0x1A2471A3), Color(0xFF2471A3)),
    'fund':         StatusStyle(Color(0x1AD4860A), Color(0xFFD4860A)),
    'project':      StatusStyle(Color(0x1A4B5EAA), Color(0xFF4B5EAA)),
    'event':        StatusStyle(Color(0x1A2471A3), Color(0xFF2471A3)),
  };

  static StatusStyle get(String? status) {
    return colors[status?.toLowerCase()] ??
        const StatusStyle(Color(0x1F9CA3AF), Color(0xFF9CA3AF));
  }
}

// ── Spacing ───────────────────────────────────────────────────────────────────
class AppSpacing {
  static const double xs   = 4;
  static const double sm   = 8;
  static const double md   = 12;
  static const double lg   = 16;
  static const double xl   = 20;
  static const double xxl  = 28;
  static const double xxxl = 40;
  static const double contentPad = xl; // shared horizontal padding
}

// ── Radius ────────────────────────────────────────────────────────────────────
class AppRadius {
  static const double sm   = 6;
  static const double md   = 10;
  static const double lg   = 16;
  static const double xl   = 22;
  static const double full = 9999;
}

// ── Shadows ───────────────────────────────────────────────────────────────────
class AppShadow {
  static List<BoxShadow> get sm => [
    BoxShadow(color: AppColors.accent.withOpacity(0.07),
        offset: const Offset(0,1), blurRadius: 3),
  ];
  static List<BoxShadow> get md => [
    BoxShadow(color: AppColors.accent.withOpacity(0.10),
        offset: const Offset(0,4), blurRadius: 10),
  ];
  static List<BoxShadow> get lg => [
    BoxShadow(color: AppColors.accent.withOpacity(0.13),
        offset: const Offset(0,8), blurRadius: 18),
  ];
}

// ── MaterialApp ThemeData ─────────────────────────────────────────────────────
ThemeData buildAppTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.accent,
      primary: AppColors.accent,
      surface: AppColors.white,
    ),
    scaffoldBackgroundColor: AppColors.bgApp,
    fontFamily: 'DMSans', // loaded via google_fonts
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.textOnDark,
      elevation: 0,
      centerTitle: false,
    ),
    dividerColor: AppColors.borderInner,
  );
}
