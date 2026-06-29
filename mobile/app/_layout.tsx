// app/_layout.tsx — Root layout: providers + fonts only
// NO auth logic here — handled in each route group layout via <Redirect>

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular, DMSans_500Medium,
  DMSans_600SemiBold, DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 2, refetchOnWindowFocus: false },
  },
});

export default function RootLayout() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  // Load fonts — does NOT block rendering
  useFonts({
    DMSans_400Regular, DMSans_500Medium,
    DMSans_600SemiBold, DMSans_700Bold,
    DMSerifDisplay_400Regular,
  });

  // Restore persisted auth session on launch
  useEffect(() => { restoreSession(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#1E2128" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"  />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
