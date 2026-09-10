import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  /** Desktop only: collapses the sidebar to an icon rail. */
  sidebarCollapsed: boolean;
  /** Mobile only: controls the sidebar drawer. */
  mobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: "ui-store",
      // The server cannot read localStorage, so rehydrating during render would
      // produce markup that disagrees with the client. Hydration is deferred to
      // `useUIStoreHydration`, which runs after mount.
      skipHydration: true,
      // Drawer state is per-visit, not a preference.
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
