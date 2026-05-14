import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types/domain';

interface AuthState {
  currentUserId: string | null;
  role: Role;
  setUser: (userId: string | null, role: Role) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: null,
      role: 'guest',
      setUser: (currentUserId, role) => set({ currentUserId, role }),
      logout: () => set({ currentUserId: null, role: 'guest' })
    }),
    { name: 'landx:auth' }
  )
);

export function pickUserByRole(users: User[], role: Role): User | undefined {
  return users.find((u) => u.roles.includes(role) && u.status === 'active');
}
