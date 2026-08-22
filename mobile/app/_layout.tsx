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

  // Android system nav bar defaults to white and isn't part of our component tree —
  // sync it to the app's dark theme so there's no light strip below the tab bar
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.primary);
      NavigationBar.setButtonStyleAsync('light');
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
