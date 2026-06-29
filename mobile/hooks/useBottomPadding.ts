// hooks/useBottomPadding.ts — Safe bottom padding for ScrollView/FlatList on tab screens
// Returns insets.bottom + TAB_BAR_HEIGHT so content clears the custom tab bar
// Use as contentContainerStyle={{ paddingBottom: bottomPadding }} on all tab screen lists

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout } from '@/constants/theme';

export function useBottomPadding(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom + Layout.TAB_BAR_HEIGHT + Layout.SCREEN_PADDING_V;
}
