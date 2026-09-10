import type { NavItem } from "@/types/navigation";

/**
 * Resolves whether a nav item represents the current location.
 *
 * Matching is prefix-based so that nested routes keep their parent highlighted
 * (`/users/42` activates `/users`), but respects segment boundaries so that
 * `/users-archive` does not activate `/users`. Items marked `exact` — and the
 * root route, which would otherwise match everything — compare strictly.
 */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact || item.href === "/") {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
