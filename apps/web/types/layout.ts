/**
 * Minimal user shape consumed by the layout chrome.
 *
 * The layout is auth-agnostic: map whatever your session provider returns onto
 * this type at the route-layout boundary rather than coupling the chrome to it.
 */
export interface AppUser {
  name: string;
  email?: string;
  avatarUrl?: string;
}
