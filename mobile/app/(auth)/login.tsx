// app/(auth)/login.tsx — Login screen, fixed single input per field

import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const login  = useAuthStore((s) => s.login);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [focused,  setFocused]  = useState<'email'|'password'|null>(null);

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      await login(user);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.formCard, { paddingBottom: insets.bottom + Spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
            <View style={[
              styles.inputRow,
              focused === 'email' && styles.inputRowFocused,
            ]}>
              <Ionicons name="mail-outline" size={18} color={focused === 'email' ? Colors.accent : Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={[
              styles.inputRow,
              focused === 'password' && styles.inputRowFocused,
            ]}>
              <Ionicons name="lock-closed-outline" size={18} color={focused === 'password' ? Colors.accent : Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                secureTextEntry={!showPw}
                autoComplete="password"
                placeholder="Enter your password"
                placeholderTextColor={Colors.textMuted}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={10}>
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
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in button */}
          <TouchableOpacity
            style={[styles.signInBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.signInBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>

          {/* Dev hint */}
          <Text style={styles.devHint}>DEV: juan@example.com · any password</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.primary },
  flex:        { flex: 1 },

  brandSection: {
    alignItems:        'center',
    paddingHorizontal: Layout.SCREEN_PADDING_H,
    paddingTop:        Spacing.xl,
    paddingBottom:     Spacing.xxl,
    gap:               Spacing.sm,
  },
  logoCircle: {
    width:           72, height: 72, borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
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

  formCard: {
    backgroundColor:      Colors.white,
    borderTopLeftRadius:  Radius.lg + 8,
    borderTopRightRadius: Radius.lg + 8,
    paddingHorizontal:    Layout.SCREEN_PADDING_H + 4,
    paddingTop:           Spacing.xl,
    gap:                  Spacing.md,
    flexGrow:             1,
  },
  welcomeText: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textPrimary,
  },
  signInSubtitle: {
    fontFamily:  Typography.fontBody,
    fontSize:    FontSize.base,
    color:       Colors.textMuted,
    marginTop:   -Spacing.sm,
    marginBottom: Spacing.xs,
  },

  errorBox: {
    flexDirection:   'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: Colors.dangerLight,
    borderRadius:    Radius.sm,
    borderWidth:     1, borderColor: Colors.danger,
    padding:         Spacing.sm,
  },
  errorText: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.sm,
    color:      Colors.danger,
    flex:       1,
  },

  fieldGroup: { gap: Spacing.xs },
  fieldLabel: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.textSecondary,
  },

  // Single input row — ONE box, no double border
  inputRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing.sm,
    borderWidth:       1.5,
    borderColor:       Colors.borderCard,
    borderRadius:      Radius.sm,
    backgroundColor:   Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   Platform.OS === 'ios' ? 12 : 2,
  },
  inputRowFocused: {
    borderColor:  Colors.accent,
    shadowColor:  Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation:    2,
  },
  textInput: {
    flex:        1,
    fontFamily:  Typography.fontBody,
    fontSize:    FontSize.base,
    color:       Colors.textPrimary,
    paddingVertical: 0,    // prevents android double height
  },

  forgotRow:  { alignSelf: 'flex-end', marginTop: -Spacing.xs },
  forgotText: {
    fontFamily: Typography.fontBodyMedium,
    fontSize:   FontSize.sm,
    color:      Colors.accent,
  },

  signInBtn: {
    backgroundColor: Colors.accent,
    borderRadius:    Radius.sm,
    paddingVertical: 13,
    flexDirection:   'row', alignItems: 'center', justifyContent: 'center',
    gap:             Spacing.sm,
    marginTop:       Spacing.xs,
  },
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
