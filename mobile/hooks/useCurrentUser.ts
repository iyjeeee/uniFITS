// hooks/useCurrentUser.ts — Returns current user or null (never throws)
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.currentUser);
}