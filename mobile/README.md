# uniFITS Mobile — Flutter

Mobile app for the uniFITS Member Portal. Built with Flutter + Dart.

## Stack
- **Framework:** Flutter 3.x (Dart)
- **Navigation:** go_router
- **State:** Provider (ChangeNotifier)
- **Fonts:** google_fonts (DM Sans, DM Serif Display)
- **Database (PROD):** supabase_flutter

## Project structure
```
lib/
├── main.dart                  # Entry point
├── constants/
│   └── theme.dart             # Colors, spacing, radius, shadows
├── models/
│   └── models.dart            # All data models
├── data/
│   └── mock_data.dart         # Mock data + formatters
├── context/
│   └── auth_provider.dart     # Auth state (Provider)
├── navigation/
│   └── router.dart            # go_router config + bottom tab shell
├── widgets/
│   ├── ui.dart                # Avatar, StatusBadge, ProgressBar, Buttons, Inputs
│   └── app_layout.dart        # ScreenLayout, DetailLayout, SectionCard, FilterBar
└── screens/
    ├── login_screen.dart
    ├── home_screen.dart
    ├── projects_screen.dart
    ├── project_detail_screen.dart
    ├── events_screen.dart
    ├── event_detail_screen.dart
    ├── announcements_screen.dart
    ├── announcement_detail_screen.dart
    ├── profile_screen.dart
    ├── edit_profile_screen.dart
    ├── my_transactions_screen.dart
    ├── my_report_screen.dart
    └── my_attendance_screen.dart
```

## Getting started

### 1. Install Flutter
See FLUTTER_SETUP.md in the project root.

### 2. Install dependencies
```bash
flutter pub get
```

### 3. Run the app
```bash
# Android emulator or connected device
flutter run

# iOS simulator (macOS only)
flutter run -d ios
```

## Switching to Supabase (PROD)
1. In `lib/main.dart`, uncomment and fill in:
   ```dart
   await Supabase.initialize(url: 'YOUR_URL', anonKey: 'YOUR_KEY');
   ```
2. In `lib/context/auth_provider.dart`, replace the `login()` mock with:
   ```dart
   await supabase.auth.signInWithPassword(email: email, password: password);
   ```
3. Replace mock data calls in each screen with Supabase queries.
