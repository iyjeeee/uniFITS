// src/screens/LoginScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Login screen — gradient hero panel + form sheet below.
// • No demo accounts section — removed entirely.
// • Accepts any email address (no DB validation yet).
// • Non-scrollable: hero fills flex space, form sheet is fixed height below.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Spacing, Radius } from '../constants/theme'
import {
  PrimaryButton, FormField, Input,
  EyeIcon, EyeOffIcon, ProjectsIcon,
} from '../components/ui'

export default function LoginScreen() {
  const { login, loading, error } = useAuth()

  const [email,    setEmail]    = useState('')    // controlled email input
  const [password, setPassword] = useState('')    // controlled password input
  const [showPw,   setShowPw]   = useState(false) // toggle password visibility
  const [localErr, setLocalErr] = useState('')    // local field-level error

  // handleLogin — validates then calls auth; any email is accepted
  const handleLogin = async () => {
    setLocalErr('')
    if (!email.trim())    { setLocalErr('Email is required.'); return }
    if (!password.trim()) { setLocalErr('Password is required.'); return }
    await login(email, password)
  }

  const displayError = localErr || error // local errors shown first

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Hero — flex fills remaining space above form sheet ─────── */}
        <LinearGradient
          colors={['#161B27', Colors.primary, '#252C3D']}
          style={styles.hero}
        >
          {/* Ambient glow circles */}
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          {/* Dot grid decoration — top right corner */}
          <View style={styles.dotGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>

          {/* Brand row */}
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <ProjectsIcon color="#fff" size={20} />
            </View>
            <View>
              <Text style={styles.brandEyebrow}>MEMBER PORTAL</Text>
              <Text style={styles.brandName}>uniFITS</Text>
            </View>
          </View>

          {/* Hero copy */}
          <Text style={styles.heroTitle}>Welcome{'\n'}Back.</Text>
          <Text style={styles.heroSub}>
            Track contributions, projects,{'\n'}events and your records — all here.
          </Text>

          {/* Feature chips */}
          <View style={styles.chipRow}>
            {['Contributions', 'Projects', 'Events', 'Attendance'].map(label => (
              <View key={label} style={styles.chip}>
                <View style={styles.chipDot} />
                <Text style={styles.chipLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Form sheet — fixed bottom, no scroll ──────────────────── */}
        <View style={styles.formSheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Section eyebrow */}
          <View style={styles.eyeRow}>
            <View style={styles.eyeLine} />
            <Text style={styles.eyeText}>SIGN IN</Text>
          </View>

          <Text style={styles.formTitle}>Access your account</Text>
          <Text style={styles.formSub}>Enter your credentials to continue</Text>

          {/* Error banner */}
          {displayError ? (
            <View style={styles.errorBox}>
              <View style={styles.errorBullet}>
                <Text style={styles.errorBulletText}>!</Text>
              </View>
              <Text style={styles.errorMsg}>{displayError}</Text>
            </View>
          ) : null}

          {/* Fields */}
          <View style={styles.fields}>
            <FormField label="Email Address">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={localErr && !email.trim() ? localErr : null}
              />
            </FormField>

            <FormField label="Password">
              <View style={styles.pwWrap}>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPw}
                  style={styles.pwInput}
                  error={localErr && !password.trim() ? localErr : null}
                />
                {/* Eye toggle — show / hide password */}
                <TouchableOpacity
                  onPress={() => setShowPw(v => !v)}
                  style={styles.eyeBtn}
                >
                  {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </TouchableOpacity>
              </View>
            </FormField>
          </View>

          <PrimaryButton label="Sign In" onPress={handleLogin} loading={loading} />

          <Text style={styles.version}>uniFITS Member App v1.0.0</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  flex: { flex: 1 },

  // Hero — grows to fill all space above the form sheet
  hero: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 52,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  glow1: {
    position: 'absolute', top: -100, right: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(75,94,170,0.28)',
  },
  glow2: {
    position: 'absolute', bottom: 0, left: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(75,94,170,0.15)',
  },
  dotGrid: {
    position: 'absolute', top: 20, right: 16,
    flexDirection: 'row', flexWrap: 'wrap', width: 106,
  },
  dot: {
    width: 3, height: 3, borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.14)', margin: 6,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  logoBox: {
    width: 42, height: 42, borderRadius: 11,
    backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  brandEyebrow: { fontSize: 9, fontFamily: Typography.bodyBold, color: Colors.accent, letterSpacing: 2.5 },
  brandName:    { fontSize: 16, fontFamily: Typography.bodyExtraBold, color: '#fff', letterSpacing: 0.5 },
  heroTitle: { fontSize: 42, fontFamily: Typography.display, color: '#fff', lineHeight: 48, marginBottom: 10 },
  heroSub: {
    fontSize: 13.5, fontFamily: Typography.body,
    color: 'rgba(255,255,255,0.48)', lineHeight: 20, marginBottom: 20,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: Radius.full, paddingHorizontal: 11, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  chipDot:  { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.accent },
  chipLabel: { fontSize: 12, fontFamily: Typography.bodyMedium, color: 'rgba(255,255,255,0.68)' },

  // Form sheet — fixed height, no scroll needed
  formSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -28,
    paddingHorizontal: Spacing.xl,
    paddingTop: 18, paddingBottom: 36,
    borderWidth: 1, borderBottomWidth: 0,
    borderColor: 'rgba(75,94,170,0.12)',
  },
  handle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 26,
  },
  eyeRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  eyeLine: { width: 22, height: 3, backgroundColor: Colors.accent, borderRadius: 2 },
  eyeText: { fontSize: 10.5, fontFamily: Typography.bodyBold, color: Colors.accent, letterSpacing: 2.2 },
  formTitle: { fontSize: 27, fontFamily: Typography.display, color: Colors.textPrimary, marginBottom: 5, lineHeight: 33 },
  formSub:   { fontSize: 14, fontFamily: Typography.body, color: Colors.textMuted, marginBottom: 22, lineHeight: 20 },
  fields:    { gap: 16, marginBottom: 24 },
  pwWrap:    { position: 'relative' },
  pwInput:   { paddingRight: 52 },
  eyeBtn:    { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: 'rgba(192,57,43,0.06)',
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.18)',
    borderRadius: Radius.md, padding: 14, marginBottom: 18,
  },
  errorBullet: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.danger,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  errorBulletText: { color: '#fff', fontSize: 11, fontFamily: Typography.bodyBold },
  errorMsg: { fontSize: 13.5, color: Colors.danger, flex: 1, lineHeight: 19 },
  version:  { fontSize: 11.5, color: Colors.textMuted, textAlign: 'center', letterSpacing: 0.3, marginTop: 20 },
})
