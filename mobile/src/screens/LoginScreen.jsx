// src/screens/LoginScreen.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full-screen login with the same brand language as the website:
// dark primary top panel + white form card below.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '../context/AuthContext'
import { Colors, Typography, Spacing, Radius, Shadow } from '../constants/theme'
import {
  PrimaryButton, FormField, Input,
  EyeIcon, EyeOffIcon, ProjectsIcon,
} from '../components/ui'

// ── Brand logo icon ────────────────────────────────────────────────────────────
function BrandIcon() {
  return (
    <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' }}>
      <ProjectsIcon color="#fff" size={22} />
    </View>
  )
}

// ── Feature row ───────────────────────────────────────────────────────────────
function Feature({ icon, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.accent }} />
      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontFamily: Typography.body }}>{label}</Text>
    </View>
  )
}

export default function LoginScreen() {
  const { login, loading, error } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [localErr, setLocalErr] = useState('')

  const handleLogin = async () => {
    setLocalErr('')
    if (!email.trim()) { setLocalErr('Email is required.'); return }
    if (!password.trim()) { setLocalErr('Password is required.'); return }
    await login(email, password)
  }

  const displayError = localErr || error

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand panel ─────────────────────────────────────── */}
          <LinearGradient
            colors={[Colors.primary, '#252C3D']}
            style={styles.brandPanel}
          >
            {/* Decorative glow */}
            <View style={styles.glowTR} />
            <View style={styles.glowBL} />
            {/* Ring decorations */}
            <View style={styles.ringLg} />
            <View style={styles.ringSm} />

            <View style={styles.brandContent}>
              {/* Logo */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <BrandIcon />
                <View>
                  <Text style={{ fontSize: 10, fontFamily: Typography.bodyBold, color: Colors.accent, textTransform: 'uppercase', letterSpacing: 2 }}>Member Portal</Text>
                  <Text style={{ fontSize: 16, fontFamily: Typography.bodyBold, color: '#fff', letterSpacing: 0.3 }}>uniFITS</Text>
                </View>
              </View>

              {/* Headline */}
              <Text style={styles.headline}>Your Organization,{'\n'}
                <Text style={{ color: Colors.accent, fontStyle: 'italic' }}>In Your Pocket</Text>
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 19, marginTop: 10, marginBottom: 20 }}>
                Track contributions, projects, events, and your personal records — all in one place.
              </Text>

              {/* Feature pills */}
              <View style={{ gap: 8 }}>
                <Feature label="View your contributions & dues" />
                <Feature label="Browse org projects & events" />
                <Feature label="Check your attendance record" />
                <Feature label="Read latest announcements" />
              </View>
            </View>
          </LinearGradient>

          {/* ── Form card ────────────────────────────────────────── */}
          <View style={styles.formWrapper}>
            <View style={styles.formCard}>
              {/* Accent bar */}
              <View style={styles.accentBar} />

              {/* Eyebrow */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <View style={{ width: 24, height: 2, backgroundColor: Colors.accent, borderRadius: 1 }} />
                <Text style={{ fontSize: 11, fontFamily: Typography.bodyBold, color: Colors.accent, textTransform: 'uppercase', letterSpacing: 2 }}>Member Login</Text>
              </View>

              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={{ fontSize: 13, color: Colors.textMuted, marginBottom: 24, lineHeight: 19 }}>
                Sign in to access your member portal
              </Text>

              {/* Error */}
              {displayError ? (
                <View style={styles.errorBox}>
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontFamily: Typography.bodyBold }}>!</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: Colors.danger, flex: 1, lineHeight: 18 }}>{displayError}</Text>
                </View>
              ) : null}

              {/* Fields */}
              <View style={{ gap: 16 }}>
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
                  <View style={{ position: 'relative' }}>
                    <Input
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry={!showPw}
                      style={{ paddingRight: 48 }}
                      error={localErr && !password.trim() ? localErr : null}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPw(v => !v)}
                      style={{ position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' }}
                    >
                      {showPw ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </TouchableOpacity>
                  </View>
                </FormField>
              </View>

              <View style={{ marginTop: 24 }}>
                <PrimaryButton
                  label="Sign In"
                  onPress={handleLogin}
                  loading={loading}
                />
              </View>

              {/* Dev hint */}
              <View style={styles.devHint}>
                <Text style={{ fontSize: 11.5, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 }}>
                  <Text style={{ fontFamily: Typography.bodyBold, color: Colors.textSecondary }}>Demo logins:{'\n'}</Text>
                  ana@example.com · juan@example.com{'\n'}pedro@example.com · carlos@example.com{'\n'}
                  <Text style={{ color: Colors.textMuted, fontStyle: 'italic' }}>(any password)</Text>
                </Text>
              </View>

              <Text style={{ fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 16, letterSpacing: 0.3 }}>
                uniFITS Member App v1.0.0
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  brandPanel: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  glowTR: {
    position: 'absolute', top: -80, right: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(75,94,170,0.35)',
  },
  glowBL: {
    position: 'absolute', bottom: -60, left: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(75,94,170,0.2)',
  },
  ringLg: {
    position: 'absolute', top: -80, left: -110,
    width: 400, height: 400, borderRadius: 200,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  ringSm: {
    position: 'absolute', bottom: -60, right: -70,
    width: 260, height: 260, borderRadius: 130,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  brandContent: { position: 'relative', zIndex: 1 },
  headline: {
    fontSize: 28,
    fontFamily: Typography.display,
    color: '#fff',
    lineHeight: 34,
  },
  formWrapper: {
    backgroundColor: '#F7F8FC',
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 28,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(75,94,170,0.1)',
    ...Shadow.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0, left: 36, right: 36,
    height: 3,
    backgroundColor: Colors.accent,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  formTitle: {
    fontSize: 26,
    fontFamily: Typography.display,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 32,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.dangerLight,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.22)',
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: 16,
  },
  devHint: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.neutralLight,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderCard,
  },
})
