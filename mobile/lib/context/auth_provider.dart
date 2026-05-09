// lib/context/auth_provider.dart — Authentication state management.
// DEV: accepts any email + password (mock). PROD: swap login() with Supabase auth.

import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../data/mock_data.dart';

class AuthProvider extends ChangeNotifier {
  AppUser? _user;
  bool     _loading = false;
  String?  _error;

  AppUser? get user    => _user;
  bool     get loading => _loading;
  String?  get error   => _error;
  bool     get isLoggedIn => _user != null;

  // login — DEV: matches mock user by email; falls back to first mock user.
  // PROD: replace body with → supabase.auth.signInWithPassword(email, password)
  Future<bool> login(String email, String password) async {
    _error = null;
    if (email.trim().isEmpty || password.trim().isEmpty) {
      _error = 'Please enter your email and password.';
      notifyListeners();
      return false;
    }
    _loading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 700)); // simulate latency

    final found = mockUsers.where(
      (u) => u.email.toLowerCase() == email.trim().toLowerCase()
    ).firstOrNull;

    _user    = found ?? mockUsers[0].copyWith(email: email.trim());
    _loading = false;
    notifyListeners();
    return true;
  }

  void logout() {
    _user  = null;
    _error = null;
    notifyListeners();
  }

  // updateUser — for EditProfileScreen local state updates (no DB yet)
  void updateUser(AppUser updated) {
    _user = updated;
    notifyListeners();
  }
}
