// lib/screens/edit_profile_screen.dart — Mirrors EditProfileScreen.jsx.

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../context/auth_provider.dart';
import '../constants/theme.dart';
import '../widgets/ui.dart';
import '../widgets/app_layout.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});
  @override State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late final TextEditingController _firstCtrl, _lastCtrl, _emailCtrl,
      _phoneCtrl, _cityCtrl, _provinceCtrl, _occupationCtrl;
  String? _gender;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user!;
    _firstCtrl    = TextEditingController(text: user.firstName);
    _lastCtrl     = TextEditingController(text: user.lastName);
    _emailCtrl    = TextEditingController(text: user.email);
    _phoneCtrl    = TextEditingController(text: user.contactNumber);
    _cityCtrl     = TextEditingController(text: user.addressCity ?? '');
    _provinceCtrl = TextEditingController(text: user.addressProvince ?? '');
    _occupationCtrl = TextEditingController(text: user.occupation);
    _gender       = user.gender;
  }

  @override
  void dispose() {
    for (final c in [_firstCtrl, _lastCtrl, _emailCtrl, _phoneCtrl,
                     _cityCtrl, _provinceCtrl, _occupationCtrl]) c.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() { _error = null; _saving = true; });
    if (_firstCtrl.text.trim().isEmpty || _lastCtrl.text.trim().isEmpty) {
      setState(() { _error = 'First and last name are required.'; _saving = false; });
      return;
    }
    await Future.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    final updated = auth.user!.copyWith(
      firstName: _firstCtrl.text.trim(),
      lastName:  _lastCtrl.text.trim(),
      fullName:  '${_firstCtrl.text.trim()} ${_lastCtrl.text.trim()}',
      email:     _emailCtrl.text.trim(),
      contactNumber: _phoneCtrl.text.trim(),
      addressCity:     _cityCtrl.text.trim(),
      addressProvince: _provinceCtrl.text.trim(),
      occupation: _occupationCtrl.text.trim(),
      gender: _gender,
    );
    auth.updateUser(updated);
    setState(() => _saving = false);
    if (mounted) context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return DetailLayout(
      title: 'Edit Profile',
      onBack: () => context.pop(),
      body: Column(children: [
        if (_error != null)
          Container(
            margin: const EdgeInsets.fromLTRB(
                AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.dangerLight,
              borderRadius: BorderRadius.circular(AppRadius.md),
              border: Border.all(color: AppColors.danger.withOpacity(0.3)),
            ),
            child: Text(_error!, style: dmSans(size: 13, color: AppColors.danger)),
          ),

        SectionCard(title: 'Personal Information', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              Row(children: [
                Expanded(child: AppFormField(label: 'First Name',
                    child: AppInput(controller: _firstCtrl, placeholder: 'First name'))),
                const SizedBox(width: 10),
                Expanded(child: AppFormField(label: 'Last Name',
                    child: AppInput(controller: _lastCtrl, placeholder: 'Last name'))),
              ]),
              const SizedBox(height: 14),
              AppFormField(label: 'Gender', child: _GenderSelector(
                  value: _gender, onChanged: (g) => setState(() => _gender = g))),
              const SizedBox(height: 14),
              AppFormField(label: 'Occupation',
                  child: AppInput(controller: _occupationCtrl, placeholder: 'Your occupation')),
            ]),
          ),
        ]),

        SectionCard(title: 'Contact', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              AppFormField(label: 'Email',
                  child: AppInput(controller: _emailCtrl,
                      placeholder: 'email@example.com',
                      keyboardType: TextInputType.emailAddress)),
              const SizedBox(height: 14),
              AppFormField(label: 'Mobile Number',
                  child: AppInput(controller: _phoneCtrl,
                      placeholder: '09XXXXXXXXX',
                      keyboardType: TextInputType.phone)),
            ]),
          ),
        ]),

        SectionCard(title: 'Address', children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(children: [
              AppFormField(label: 'City',
                  child: AppInput(controller: _cityCtrl, placeholder: 'City')),
              const SizedBox(height: 14),
              AppFormField(label: 'Province',
                  child: AppInput(controller: _provinceCtrl, placeholder: 'Province')),
            ]),
          ),
        ]),

        Container(
          margin: const EdgeInsets.fromLTRB(
              AppSpacing.lg, AppSpacing.xl, AppSpacing.lg, 0),
          child: PrimaryButton(label: 'Save Changes',
              onPress: _save, loading: _saving),
        ),
        const SizedBox(height: 32),
      ]),
    );
  }
}

class _GenderSelector extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;
  const _GenderSelector({this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(children: ['Male', 'Female', 'Other'].map((g) {
      final selected = value == g;
      return Expanded(child: GestureDetector(
        onTap: () => onChanged(g),
        child: Container(
          margin: EdgeInsets.only(right: g == 'Other' ? 0 : 8),
          padding: const EdgeInsets.symmetric(vertical: 12),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: selected ? AppColors.accent : AppColors.neutralLight,
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
                color: selected ? AppColors.accent : AppColors.borderCard),
          ),
          child: Text(g, style: dmSans(size: 13, weight: FontWeight.w600,
              color: selected ? Colors.white : AppColors.textSecondary)),
        ),
      ));
    }).toList());
  }
}
