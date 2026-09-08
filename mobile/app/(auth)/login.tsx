// app/(auth)/login.tsx — Login screen
// Fixes: removed KeyboardAvoidingView (pan mode handles it), removed focused state
// (elevation change on focus caused Android view redraw + focus loss),
// removed autoComplete (prevented Android autofill from auto-advancing fields)

import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, Platform, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { hapticError, hapticSuccess } from '@/utils/haptics';

export default function LoginScreen() {
  const insets      = useSafeAreaInsets();
  const login       = useAuthStore((s) => s.login);
  const passwordRef = useRef<TextInput>(null);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      hapticError();
      return;
    }
    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      await login(user);
      hapticSuccess();
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed. Please try again.');
      hapticError();
    } finally {
      setLoading(false);
    }
  }

  return (
    // No KeyboardAvoidingView — softwareKeyboardLayoutMode="pan" in app.json handles this
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* ── Brand section ── */}
      <View style={styles.brandSection}>
        <View style={styles.logoCircle}>
          <Ionicons name="stats-chart" size={36} color={Colors.textOnDark} />
        </View>
        <Text style={styles.logoText}>uniFITS</Text>
        <Text style={styles.tagline}>Financial Information Tracking System</Text>
      </View>

      {/* ── Form card ── */}
      <ScrollView
        style={styles.formCard}
        contentContainerStyle={[styles.formContent, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.signInSubtitle}>Sign in to your account</Text>

        {/* Error */}
        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={15} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Email field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Email address"
              returnKeyType="next"
              blurOnSubmit={false}
              // Focus password on next — only fires on explicit keyboard Next press
              onSubmitEditing={() => passwordRef.current?.focus()}
              // No autoComplete — prevents Android autofill from auto-advancing fields
              autoComplete="off"
              // Prevent iOS autofill suggestions
              textContentType="none"
            />
          </View>
        </View>

        {/* Password field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
            <TextInput
              ref={passwordRef}
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              // No autoComplete — prevents Android autofill interference
              autoComplete="off"
              textContentType="none"
            />
            <TouchableOpacity
              onPress={() => setShowPw(!showPw)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={showPw ? 'Hide password' : 'Show password'}
            >
              <Ionicons
                name={showPw ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot password */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotRow}
          accessibilityRole="link"
          accessibilityLabel="Forgot password"
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign in button */}
        <TouchableOpacity
          style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          accessibilityState={{ disabled: loading, busy: loading }}
        >
          <Text style={styles.signInBtnText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
          {!loading && <Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        </TouchableOpacity>

        <Text style={styles.devHint}>DEV: juan@example.com · any password</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: Colors.primary,
  },

  // Brand top section
  brandSection: {
    alignItems:        'center',
    paddingHorizontal: Layout.SCREEN_PADDING_H,
    paddingTop:        Spacing.xl,
    paddingBottom:     Spacing.xxl,
    gap:               Spacing.sm,
  },
  logoCircle: {
    width:           72,
    height:          72,
    borderRadius:    36,
    backgroundColor: Colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    Spacing.xs,
  },
  logoText: {
    fontFamily:    Typography.fontDisplay,
    fontSize:      FontSize.xxxl,
    color:         Colors.textOnDark,
    letterSpacing: 3,
  },
  tagline: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      'rgba(249,250,251,0.50)',
    textAlign:  'center',
  },

  // White rounded form card (bottom portion)
  formCard: {
    flex:                 1,
    backgroundColor:      Colors.white,
    borderTopLeftRadius:  Radius.lg + 8,
    borderTopRightRadius: Radius.lg + 8,
  },
  formContent: {
    paddingHorizontal: Layout.SCREEN_PADDING_H + 4,
    paddingTop:        Spacing.xl,
    gap:               Spacing.md,
  },
  welcomeText: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textPrimary,
  },
  signInSubtitle: {
    fontFamily:   Typography.fontBody,
    fontSize:     FontSize.base,
    color:        Colors.textMuted,
    marginTop:    -Spacing.sm,
    marginBottom: Spacing.xs,
  },

  // Error box
  errorBox: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.xs,
    backgroundColor: Colors.dangerLight,
    borderRadius:    Radius.sm,
    borderWidth:     1,
    borderColor:     Colors.danger,
    padding:         Spacing.sm,
  },
  errorText: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.danger,
    flex:       1,
  },

  // Form fields
  fieldGroup: { gap: Spacing.xs },
  fieldLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
  },

  // Single input row — static styles only, no dynamic changes on focus
  // Removing focused state prevents Android View redraws that break TextInput focus
  inputRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing.sm,
    borderWidth:       1.5,
    borderColor:       Colors.borderCard,
    borderRadius:      Radius.sm,
    backgroundColor:   Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   Platform.OS === 'ios' ? 12 : 8,
    minHeight:         48,  // guaranteed tap target size on Android
  },
  textInput: {
    flex:            1,
    fontFamily:      Typography.fontBody,
    fontSize:        FontSize.base,
    color:           Colors.textPrimary,
    paddingVertical: 0,
    // Prevents Android from adding extra internal padding
    includeFontPadding: false,
  },

  // Forgot password
  forgotRow:  { alignSelf: 'flex-end', marginTop: -Spacing.xs },
  forgotText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.accent,
  },

  // Sign in button
  signInBtn: {
    backgroundColor: Colors.accent,
    borderRadius:    Radius.sm,
    paddingVertical: 13,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.sm,
    marginTop:       Spacing.xs,
  },
  signInBtnDisabled: { opacity: 0.7 },
  signInBtnText: {
    fontFamily: Typography.fontBodySemiBold,
    fontSize:   FontSize.md,
    color:      Colors.textOnDark,
  },

  devHint: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.xs,
    color:      Colors.textMuted,
    textAlign:  'center',
    marginTop:  Spacing.xs,
  },
});
