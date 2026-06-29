// app/(tabs)/finances/_layout.tsx — Finances stack navigator

import { Stack } from 'expo-router';

export default function FinancesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]"  />
    </Stack>
  );
}
