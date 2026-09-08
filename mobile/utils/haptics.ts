// utils/haptics.ts — Thin wrapper around expo-haptics
// Centralizes which feedback style is used where, and no-ops safely on web
// (expo-haptics throws on unsupported platforms if called directly without a guard)

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/** tap — light impact, for any card/button press (PressableScale, Button) */
export function hapticTap() {
  if (isSupported) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** select — for switching between segments/tabs, not a "confirm" action */
export function hapticSelect() {
  if (isSupported) Haptics.selectionAsync();
}

/** success — form submit succeeded (e.g. login, save) */
export function hapticSuccess() {
  if (isSupported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** error — form submit failed / validation error */
export function hapticError() {
  if (isSupported) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
