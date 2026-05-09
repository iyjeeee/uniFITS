// lib/main.dart — App entry point. Mounts providers and builds router.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'context/auth_provider.dart';
import 'navigation/router.dart';
import 'constants/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // PROD: await Supabase.initialize(url: '...', anonKey: '...');
  runApp(const UniFitsApp());
}

class UniFitsApp extends StatelessWidget {
  const UniFitsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: const _RouterRoot(),
    );
  }
}

// Separate widget so GoRouter can watch AuthProvider via context
class _RouterRoot extends StatefulWidget {
  const _RouterRoot();
  @override State<_RouterRoot> createState() => _RouterRootState();
}

class _RouterRootState extends State<_RouterRoot> {
  late final _router = buildRouter(context.read<AuthProvider>());

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'uniFITS',
      theme: buildAppTheme(),
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}
