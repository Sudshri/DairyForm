import { useCallback } from 'react';
import { useToastStore } from '@/store/toastStore';

export function useToast() {
  const add = useToastStore((s) => s.add);
  return {
    success: useCallback((msg) => add({ type: 'success', message: msg }), [add]),
    error:   useCallback((msg) => add({ type: 'error',   message: msg }), [add]),
    info:    useCallback((msg) => add({ type: 'info',    message: msg }), [add]),
  };
}

// Imperative helper (usable outside components)
export const toast = {
  success: (msg) => useToastStore.getState().add({ type: 'success', message: msg }),
  error:   (msg) => useToastStore.getState().add({ type: 'error',   message: msg }),
  info:    (msg) => useToastStore.getState().add({ type: 'info',    message: msg }),
};
