"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Reports whether React has hydrated the tree.
 *
 * Use it to defer rendering anything the server cannot know — a resolved theme,
 * a value read from `localStorage` — until markup on both sides has agreed
 * once. Unlike a `useState` + `useEffect` pair this does not schedule a second
 * render pass of its own.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
