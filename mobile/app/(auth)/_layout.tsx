// app/(auth)/_layout.tsx — Auth group layout
// Guard: if already authenticated, redirect to tabs immediately via <Redirect>

import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Already logged in — send to main app
  if (isAuthenticated) return <Redirect href="/(tabs)" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login"           />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
