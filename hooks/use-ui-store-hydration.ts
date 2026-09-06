"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useUIStore } from "@/stores/ui-store";

const subscribe = (onStoreChange: () => void) =>
  useUIStore.persist.onFinishHydration(onStoreChange);

const getSnapshot = () => useUIStore.persist.hasHydrated();

const getServerSnapshot = () => false;

/**
 * Restores the persisted UI preferences after mount and reports when that has
 * happened.
 *
 * The store is created with `skipHydration`, so nothing reads `localStorage`
 * until this runs. The returned flag lets the layout suppress width transitions
 * on first paint, so a restored "collapsed" sidebar appears already collapsed
 * instead of animating shut in front of the user.
 */
export function useUIStoreHydration(): boolean {
  const hydrated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    void useUIStore.persist.rehydrate();
  }, []);

  return hydrated;
}
