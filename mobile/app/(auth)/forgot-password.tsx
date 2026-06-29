// app/(auth)/forgot-password.tsx — Forgot password screen (DEV: mock only)

import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, FontSize, Spacing, Radius, Layout } from '@/constants/theme';
import { Button, Input, ScreenHeader } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const insets        = useSafeAreaInsets();
  const [email,    setEmail]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // DEV delay
    setLoading(false);
    setSent(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title="Forgot Password"
        subtitle="Reset your account password"
        showBack
        style={{ paddingTop: insets.top + Spacing.sm }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {sent ? (
          <View style={styles.sentBox}>
            <Text style={styles.sentIcon}>✅</Text>
            <Text style={styles.sentTitle}>Check your email</Text>
            <Text style={styles.sentDesc}>
              If an account exists for {email}, you will receive a password reset link shortly.
            </Text>
            <Button title="Back to Login" onPress={() => router.replace('/(auth)/login')} fullWidth />
          </View>
        ) : (
          <>
            <Text style={styles.desc}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="juan@example.com"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              disabled={!email.trim()}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex:            1,
    backgroundColor: Colors.bgApp,
  },
  content: {
    padding: Layout.SCREEN_PADDING_H,
    gap:     Spacing.md,
    flexGrow: 1,
  },
  desc: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textSecondary,
    lineHeight: 22,
  },
  sentBox: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing.md,
    paddingTop:     Spacing.xxl,
  },
  sentIcon: {
    fontSize: 48,
  },
  sentTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize:   FontSize.xxl,
    color:      Colors.textPrimary,
  },
  sentDesc: {
    fontFamily: Typography.fontBody,
    fontSize:   FontSize.base,
    color:      Colors.textMuted,
    textAlign:  'center',
    lineHeight: 22,
  },
});
