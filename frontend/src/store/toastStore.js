import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  add: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Date.now(), ...toast }],
    })),
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
