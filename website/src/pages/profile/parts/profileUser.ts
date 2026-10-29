// parts/profileUser.ts — Which user a profile page shows: explicit userId, else the logged-in user (B-01; no more default user 1)
import { MOCK_USERS } from '../../../api/mockData'
import type { User, NavigateFn } from '../../../types'

export interface ProfilePageProps { userId?: string; currentUser?: User | null; navigate?: NavigateFn }

// resolveProfileUser — undefined when nobody matches (page shows not-found)
export function resolveProfileUser({ userId, currentUser }: ProfilePageProps): User | undefined {
  const id = userId ?? currentUser?.id
  return MOCK_USERS.find((u) => u.id === id)
}
