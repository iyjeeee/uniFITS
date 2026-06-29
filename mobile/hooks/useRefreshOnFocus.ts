// hooks/useRefreshOnFocus.ts — Refetch React Query data when screen gains focus
// Wraps Expo Router useIsFocused; call in any tab screen that shows live data
// Usage: useRefreshOnFocus(refetch) where refetch comes from useQuery()

import { useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';

export function useRefreshOnFocus(refetch: () => void): void {
  const firstMount = useRef(true);
  const isFocused  = useIsFocused();

  useEffect(() => {
    // Skip on initial mount — useQuery already fetches on mount
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    if (isFocused) refetch();
  }, [isFocused, refetch]);
}
