// lib/widgets/ui.dart — All shared UI primitives.
// Mirrors ui.jsx exactly: Avatar, StatusBadge, ProgressBar, PrimaryButton,
// FormField, AppIcons, and all icon components.

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/theme.dart';

// ── Text styles ───────────────────────────────────────────────────────────────
TextStyle dmSans(
        {double size = 14,
        FontWeight weight = FontWeight.w400,
        Color? color,
        double? letterSpacing}) =>
    GoogleFonts.dmSans(
        fontSize: size,
        fontWeight: weight,
        color: color ?? AppColors.textPrimary,
        letterSpacing: letterSpacing);

TextStyle dmSerif({double size = 24, Color? color}) =>
    GoogleFonts.dmSerifDisplay(
        fontSize: size, color: color ?? AppColors.textPrimary);

// ── Avatar ────────────────────────────────────────────────────────────────────
String _initials(String name) {
  final parts = name.trim().split(' ').where((w) => w.isNotEmpty).toList();
  if (parts.isEmpty) return '?';
  if (parts.length == 1) return parts[0][0].toUpperCase();
  return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
}

class AppAvatar extends StatelessWidget {
  final String name;
  final double size;
  const AppAvatar({super.key, required this.name, this.size = 42});

  @override
  Widget build(BuildContext context) {
    final bg = AppColors.avatarColor(name);
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: Text(
        _initials(name),
        style: dmSans(
            size: size * 0.36,
            weight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 0.5),
      ),
    );
  }
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
class StatusBadge extends StatelessWidget {
  final String? status;
  const StatusBadge({super.key, this.status});

  @override
  Widget build(BuildContext context) {
    if (status == null || status!.isEmpty) return const SizedBox.shrink();
    final s = AppStatus.get(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
      decoration: BoxDecoration(
          color: s.bg, borderRadius: BorderRadius.circular(AppRadius.full)),
      child: Text(
        status!,
        style: dmSans(
            size: 11,
            weight: FontWeight.w700,
            color: s.text,
            letterSpacing: 0.2),
      ),
    );
  }
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
class AppProgressBar extends StatelessWidget {
  final double current;
  final double target;
  final bool showLabel;
  const AppProgressBar(
      {super.key,
      required this.current,
      required this.target,
      this.showLabel = false});

  @override
  Widget build(BuildContext context) {
    final pct = target > 0 ? (current / target).clamp(0.0, 1.0) : 0.0;
    final pctInt = (pct * 100).round();
    final fillColors = pct >= 1.0
        ? [AppColors.success, const Color(0xFF4CAF81)]
        : [AppColors.accent, const Color(0xFF7B8ED4)];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(3),
          child: SizedBox(
            height: 6,
            child: LinearProgressIndicator(
              value: pct,
              backgroundColor: AppColors.border,
              valueColor: AlwaysStoppedAnimation(fillColors[0]),
            ),
          ),
        ),
        if (showLabel) ...[
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('₱${current.toStringAsFixed(0)} raised',
                  style: dmSans(size: 11, color: AppColors.textMuted)),
              Text('$pctInt% of ₱${target.toStringAsFixed(0)}',
                  style: dmSans(size: 11, color: AppColors.textMuted)),
            ],
          ),
        ],
      ],
    );
  }
}

// ── PrimaryButton ─────────────────────────────────────────────────────────────
enum BtnVariant { accent, success, danger, ghost, outline }

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPress;
  final bool loading;
  final bool disabled;
  final BtnVariant variant;
  final Widget? icon;
  final double? width;
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPress,
    this.loading = false,
    this.disabled = false,
    this.variant = BtnVariant.accent,
    this.icon,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = disabled || loading;
    final Map<BtnVariant, List<Color>> bgMap = {
      BtnVariant.accent: [AppColors.accent, AppColors.accentDark],
      BtnVariant.success: [AppColors.success, const Color(0xFF235F3F)],
      BtnVariant.danger: [AppColors.danger, const Color(0xFF9B2E23)],
      BtnVariant.ghost: [],
      BtnVariant.outline: [],
    };

    final isGradient =
        variant != BtnVariant.ghost && variant != BtnVariant.outline;
    final textColor = isGradient
        ? Colors.white
        : variant == BtnVariant.outline
            ? AppColors.accent
            : AppColors.textPrimary;

    Widget inner = Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: loading
          ? [
              const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                      strokeWidth: 2, color: Colors.white))
            ]
          : [
              if (icon != null) ...[icon!, const SizedBox(width: 8)],
              Text(label,
                  style: dmSans(
                      size: 15, weight: FontWeight.w700, color: textColor)),
            ],
    );

    if (isGradient) {
      inner = Container(
        height: 50,
        width: width ?? double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: bgMap[variant]!),
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        alignment: Alignment.center,
        child: inner,
      );
    } else {
      inner = Container(
        height: 50,
        width: width ?? double.infinity,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: variant == BtnVariant.ghost
              ? AppColors.neutralLight
              : Colors.transparent,
          border: variant == BtnVariant.outline
              ? Border.all(color: AppColors.accent, width: 1.5)
              : null,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
        child: inner,
      );
    }

    return Opacity(
      opacity: isDisabled ? 0.55 : 1.0,
      child: GestureDetector(
        onTap: isDisabled ? null : onPress,
        child: inner,
      ),
    );
  }
}

// ── FormField wrapper ─────────────────────────────────────────────────────────
class AppFormField extends StatelessWidget {
  final String? label;
  final String? error;
  final String? hint;
  final Widget child;
  const AppFormField(
      {super.key, this.label, this.error, this.hint, required this.child});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label != null) ...[
          Text(label!,
              style: dmSans(
                  size: 13,
                  weight: FontWeight.w600,
                  color: AppColors.textSecondary)),
          const SizedBox(height: 5),
        ],
        child,
        if (hint != null && error == null) ...[
          const SizedBox(height: 4),
          Text(hint!, style: dmSans(size: 11.5, color: AppColors.textMuted)),
        ],
        if (error != null) ...[
          const SizedBox(height: 4),
          Text(error!, style: dmSans(size: 11.5, color: AppColors.danger)),
        ],
      ],
    );
  }
}

// ── Input ─────────────────────────────────────────────────────────────────────
class AppInput extends StatefulWidget {
  final String? value;
  final ValueChanged<String>? onChanged;
  final String? placeholder;
  final bool obscureText;
  final TextInputType? keyboardType;
  final bool enabled;
  final bool multiline;
  final String? error;
  final Widget? suffixIcon;
  final TextEditingController? controller;
  const AppInput({
    super.key,
    this.value,
    this.onChanged,
    this.placeholder,
    this.obscureText = false,
    this.keyboardType,
    this.enabled = true,
    this.multiline = false,
    this.error,
    this.suffixIcon,
    this.controller,
  });
  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  bool _focused = false;
  // Internal controller used when no external controller is provided
  TextEditingController? _internalCtrl;

  @override
  void initState() {
    super.initState();
    if (widget.controller == null) {
      _internalCtrl = TextEditingController(text: widget.value ?? '');
    }
  }

  @override
  void dispose() {
    _internalCtrl?.dispose();
    super.dispose();
  }

  TextEditingController get _ctrl => widget.controller ?? _internalCtrl!;

  @override
  Widget build(BuildContext context) {
    final borderColor = widget.error != null
        ? AppColors.danger
        : _focused
            ? AppColors.accent
            : AppColors.borderCard;

    return Focus(
      onFocusChange: (f) => setState(() => _focused = f),
      child: TextField(
        controller: _ctrl,
        onChanged: widget.onChanged,
        obscureText: widget.obscureText,
        keyboardType:
            widget.multiline ? TextInputType.multiline : widget.keyboardType,
        maxLines: widget.multiline ? 4 : 1,
        enabled: widget.enabled,
        autocorrect: false,
        style: dmSans(size: 14.5, color: AppColors.textPrimary),
        decoration: InputDecoration(
          hintText: widget.placeholder,
          hintStyle: dmSans(size: 14.5, color: AppColors.textMuted),
          suffixIcon: widget.suffixIcon,
          filled: true,
          fillColor: widget.enabled ? AppColors.white : AppColors.neutralLight,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: BorderSide(color: borderColor),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: BorderSide(color: borderColor),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: BorderSide(color: AppColors.accent, width: 1.5),
          ),
          disabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(AppRadius.md),
            borderSide: const BorderSide(color: AppColors.borderCard),
          ),
        ),
      ),
    );
  }
}

// ── InfoRow — key/value row inside a section card ─────────────────────────────
class InfoRow extends StatelessWidget {
  final String label;
  final String? value;
  final bool last;
  const InfoRow(
      {super.key, required this.label, this.value, this.last = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding:
          const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 13),
      decoration: BoxDecoration(
        border: last
            ? null
            : const Border(
                bottom: BorderSide(color: AppColors.borderInner),
              ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(label,
                style: dmSans(size: 13, color: AppColors.textMuted)),
          ),
          Expanded(
            child: Text(
              value?.isNotEmpty == true ? value! : '—',
              style: dmSans(
                  size: 13,
                  weight: FontWeight.w600,
                  color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }
}

// ── App Icons — custom SVG-like icons using CustomPainter / Icon ───────────────
// Using Material Icons as equivalents for each tab icon
class AppIcons {
  static const IconData home = Icons.home_rounded;
  static const IconData projects = Icons.volunteer_activism_rounded;
  static const IconData events = Icons.event_rounded;
  static const IconData announcements = Icons.campaign_rounded;
  static const IconData profile = Icons.person_rounded;
  static const IconData money = Icons.payments_rounded;
  static const IconData attendance = Icons.fact_check_rounded;
  static const IconData calendar = Icons.calendar_month_rounded;
  static const IconData eye = Icons.visibility_rounded;
  static const IconData eyeOff = Icons.visibility_off_rounded;
  static const IconData edit = Icons.edit_rounded;
  static const IconData logout = Icons.logout_rounded;
  static const IconData location = Icons.location_on_rounded;
  static const IconData date = Icons.calendar_today_rounded;
  static const IconData time = Icons.schedule_rounded;
  static const IconData report = Icons.bar_chart_rounded;
  static const IconData transaction = Icons.receipt_long_rounded;
  static const IconData pin = Icons.push_pin_rounded;
  static const IconData chevronRight = Icons.chevron_right_rounded;
  static const IconData back = Icons.arrow_back_ios_rounded;
  static const IconData person = Icons.badge_rounded;
  static const IconData phone = Icons.phone_rounded;
  static const IconData email = Icons.email_rounded;
  static const IconData department = Icons.business_rounded;
  static const IconData fund = Icons.account_balance_wallet_rounded;
}
