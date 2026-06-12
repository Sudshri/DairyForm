import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:          null,
      token:         null,
      isInitialized: false,

      initialize: async () => {
        const { token } = get();
        if (token) {
          try {
            const { data } = await authApi.me();
            set({ user: data, isInitialized: true });
          } catch {
            set({ user: null, token: null, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },

      login: (user, token) => set({ user, token }),

      logout: () => {
        authApi.logout().catch(() => {});
        set({ user: null, token: null });
      },

      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
    }),
    {
      name: 'dairyform-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
