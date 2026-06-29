// app/(tabs)/activities/_layout.tsx — Activities stack (Projects + Events)

import { Stack } from 'expo-router';

export default function ActivitiesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"           />
      <Stack.Screen name="projects/[id]"   />
      <Stack.Screen name="events/[id]"     />
    </Stack>
  );
}
