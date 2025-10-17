import { Theme } from '@core/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Feature Flags
  featureFlags: Record<string, boolean>;
  setFeatureFlag: (key: string, value: boolean) => void;
  setFeatureFlags: (flags: Record<string, boolean>) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>;
  addNotification: (notification: Omit<GlobalState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Feature Flags
      featureFlags: {},
      setFeatureFlag: (key, value) =>
        set((state) => ({
          featureFlags: { ...state.featureFlags, [key]: value },
        })),
      setFeatureFlags: (flags) => set({ featureFlags: flags }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id: Date.now().toString() },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'global-store',
      partialize: (state) => ({
        theme: state.theme,
        featureFlags: state.featureFlags,
      }),
    }
  )
); 