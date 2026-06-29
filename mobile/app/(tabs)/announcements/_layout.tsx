// app/(tabs)/announcements/_layout.tsx — Announcements stack navigator

import { Stack } from 'expo-router';

export default function AnnouncementsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]"  />
    </Stack>
  );
}
