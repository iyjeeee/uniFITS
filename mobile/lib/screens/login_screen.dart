// lib/screens/login_screen.dart — Login screen mirroring LoginScreen.jsx.
// Gradient hero + form sheet + loading overlay.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool   _showPw      = false;
  String _localErr    = '';

  @override
  void dispose() {
    _emailCtrl.dispose(); _passwordCtrl.dispose(); super.dispose();
  }

  Future<void> _handleLogin() async {
    setState(() => _localErr = '');
    final email = _emailCtrl.text.trim();
    final pw    = _passwordCtrl.text.trim();
    if (email.isEmpty) { setState(() => _localErr = 'Email is required.'); return; }
    if (pw.isEmpty)    { setState(() => _localErr = 'Password is required.'); return; }
    await context.read<AuthProvider>().login(email, pw);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final err  = _localErr.isNotEmpty ? _localErr : (auth.error ?? '');

    return Scaffold(
      backgroundColor: AppColors.primary,
      resizeToAvoidBottomInset: true,
      body: Stack(
        children: [
          // ── Hero gradient + form ────────────────────────────────────────────
          SafeArea(
            child: Column(
              children: [
                // Hero panel
                Expanded(
                  flex: 4,
                  child: Stack(
                    children: [
                      // Background gradient
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF161B27), AppColors.primary, Color(0xFF252C3D)],
                            begin: Alignment.topCenter, end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                      // Glow circles
                      Positioned(top: -40, right: -30,
                        child: Container(width: 200, height: 200,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.accent.withOpacity(0.12),
                          ))),
                      Positioned(bottom: 20, left: -60,
                        child: Container(width: 160, height: 160,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.accent.withOpacity(0.08),
                          ))),
                      // Dot grid
                      Positioned.fill(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Wrap(spacing: 20, runSpacing: 20,
                            children: List.generate(20, (_) =>
                              Container(width: 3, height: 3,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.08),
                                  shape: BoxShape.circle,
                                )))),
                        ),
                      ),
                      // Brand + hero text
                      Padding(
                        padding: const EdgeInsets.all(AppSpacing.xl),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Brand row
                            Row(children: [
                              Container(
                                width: 40, height: 40,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(AppRadius.md),
                                ),
                                alignment: Alignment.center,
                                child: const Icon(AppIcons.projects,
                                    color: Colors.white, size: 20),
                              ),
                              const SizedBox(width: 12),
                              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Text('MEMBER PORTAL',
                                    style: dmSans(size: 10, weight: FontWeight.w700,
                                        color: Colors.white.withOpacity(0.5),
                                        letterSpacing: 1.5)),
                                Text('uniFITS',
                                    style: dmSans(size: 20, weight: FontWeight.w800,
                                        color: Colors.white)),
                              ]),
                            ]),
                            const Spacer(),
                            // Hero headline
                            Text('Welcome\nBack.',
                                style: dmSerif(size: 42, color: Colors.white)),
                            const SizedBox(height: 10),
                            Text('Track contributions, projects,\nevents and your records — all here.',
                                style: dmSans(size: 14, color: Colors.white.withOpacity(0.6))),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // ── Form sheet ────────────────────────────────────────────────
                Expanded(
                  flex: 5,
                  child: Container(
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      color: AppColors.white,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                    ),
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Sign in to your account',
                              style: dmSans(size: 20, weight: FontWeight.w700,
                                  color: AppColors.textPrimary)),
                          const SizedBox(height: 6),
                          Text('Enter your credentials to continue',
                              style: dmSans(size: 14, color: AppColors.textMuted)),
                          const SizedBox(height: 24),

                          // Error banner
                          if (err.isNotEmpty) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.dangerLight,
                                borderRadius: BorderRadius.circular(AppRadius.md),
                                border: Border.all(color: AppColors.danger.withOpacity(0.3)),
                              ),
                              child: Text(err,
                                  style: dmSans(size: 13, color: AppColors.danger)),
                            ),
                            const SizedBox(height: 16),
                          ],

                          // Email field
                          AppFormField(
                            label: 'Email Address',
                            child: AppInput(
                              controller: _emailCtrl,
                              placeholder: 'you@example.com',
                              keyboardType: TextInputType.emailAddress,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Password field
                          AppFormField(
                            label: 'Password',
                            child: AppInput(
                              controller: _passwordCtrl,
                              placeholder: '••••••••',
                              obscureText: !_showPw,
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _showPw ? AppIcons.eyeOff : AppIcons.eye,
                                  color: AppColors.textMuted, size: 20,
                                ),
                                onPressed: () => setState(() => _showPw = !_showPw),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Submit button
                          PrimaryButton(
                            label: 'Sign In',
                            onPress: _handleLogin,
                            loading: auth.loading,
                          ),
                          const SizedBox(height: 20),

                          // Footer note
                          Center(
                            child: Text(
                              'Contact your administrator for access.',
                              style: dmSans(size: 12.5, color: AppColors.textMuted),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ── Loading overlay ───────────────────────────────────────────────
          if (auth.loading)
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
                  Icon(AppIcons.projects, color: AppColors.accent, size: 28),
                  const SizedBox(height: 16),
                  const CircularProgressIndicator(color: AppColors.accent),
                  const SizedBox(height: 16),
                  Text('Signing you in…',
                      style: dmSans(size: 16, weight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('Please wait a moment',
                      style: dmSans(size: 13, color: AppColors.textMuted)),
                ]),
              ),
            ),
        ],
      ),
    );
  }
}
