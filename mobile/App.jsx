// App.jsx — Root entry: loads fonts then mounts providers
// ─────────────────────────────────────────────────────────────────────────────
// FONT LOADING STRATEGY:
// @expo-google-fonts 0.2.x was built for expo-font ~11. With expo-font 14
// (Expo SDK 54), the re-exported `useFonts` hook can hang permanently because
// the internal asset resolution changed. We fix this by using Font.loadAsync()
// directly inside a useEffect with:
//   1. An explicit 8-second timeout so the app never freezes on font failure
//   2. A try/catch so a network hiccup on first launch doesn't block the app
//   3. A graceful fallback — if fonts fail we still render with System font
//      (all fontFamily refs are safe; RN falls back to system if a named font
//      isn't loaded rather than crashing)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Font from 'expo-font'  // expo-font: direct Font.loadAsync for reliable loading

// Import font assets directly — these are static require() calls resolved at
// bundle time, which is what expo-font 14 expects
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'

import { AuthProvider } from './src/context/AuthContext'
import AppNavigator     from './src/navigation/AppNavigator'
import { Colors }       from './src/constants/theme'

// Timeout in ms before we give up waiting for fonts and render anyway
const FONT_TIMEOUT_MS = 8000

export default function App() {
  // fontsReady: true = fonts loaded (or timed out / failed — render either way)
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    let cancelled = false  // guard: prevent setState after unmount

    // Timeout: if Font.loadAsync takes too long, unblock the app
    const timer = setTimeout(() => {
      if (!cancelled) setFontsReady(true)
    }, FONT_TIMEOUT_MS)

    Font.loadAsync({
      DMSans_400Regular,
      DMSans_500Medium,
      DMSans_600SemiBold,
      DMSans_700Bold,
      DMSans_800ExtraBold,
      DMSerifDisplay_400Regular,
    })
      .catch(() => {
        // Font load failed (network issue, corrupt asset, etc.)
        // App still renders — RN falls back to the system font gracefully
      })
      .finally(() => {
        clearTimeout(timer)
        if (!cancelled) setFontsReady(true)
      })

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  // ── Loading splash — shown only while fonts are being fetched ──────────────
  if (!fontsReady) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ActivityIndicator color={Colors.accent} size="large" />
        <Text style={{
          color: 'rgba(255,255,255,0.5)',
          marginTop: 14,
          fontSize: 13,
          fontFamily: 'System',  // always safe — fonts not loaded yet
        }}>
          Loading uniFITS…
        </Text>
      </View>
    )
  }

  // ── App tree ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
