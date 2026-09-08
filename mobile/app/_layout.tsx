// app/_layout.tsx — Root layout: providers + fonts
// Waits for sessionRestored before rendering routes — prevents flicker/redirect race

import { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular, DMSans_500Medium,
  DMSans_600SemiBold, DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 2, refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  const restoreSession  = useAuthStore((s) => s.restoreSession);
  const sessionRestored = useAuthStore((s) => s.sessionRestored);

  useFonts({
    DMSans_400Regular, DMSans_500Medium,
    DMSans_600SemiBold, DMSans_700Bold,
    DMSerifDisplay_400Regular,
  });

  useEffect(() => { restoreSession(); }, []);

  // SDK 54 enables edge-to-edge on Android by default: the system nav bar is transparent,
  // so setBackgroundColorAsync is a no-op that only throws a warning — our own dark tab bar
  // (sized with insets.bottom in app/(tabs)/_layout.tsx) already shows through it correctly.
  // Button/icon style can still be set safely, wrapped in case a future SDK also deprecates it.
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        NavigationBar.setButtonStyleAsync('light');
      } catch {
        // no-op — safe to ignore on devices/SDKs where this isn't supported
      }
    }
  }, []);

  // Hold ALL rendering until session check is done — prevents redirect race on login screen
  if (!sessionRestored) {
    return <View style={{ flex: 1, backgroundColor: Colors.primary }} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.primary} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"  />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
