// app/(tabs)/profile/_layout.tsx — Profile stack navigator

import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit"  />
    </Stack>
  );
}
