import { HomeIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { isNavItemActive } from "@/lib/navigation";
import type { NavItem } from "@/types/navigation";

function navItem(overrides: Partial<NavItem> & Pick<NavItem, "href">): NavItem {
  return { title: "Test", icon: HomeIcon, ...overrides };
}

describe("isNavItemActive", () => {
  it("matches an exact pathname", () => {
    expect(isNavItemActive("/users", navItem({ href: "/users" }))).toBe(true);
  });

  it("matches a nested route so the parent stays highlighted", () => {
    expect(isNavItemActive("/users/42", navItem({ href: "/users" }))).toBe(
      true
    );
  });

  it("does not match on a shared prefix that isn't a real segment boundary", () => {
    expect(
      isNavItemActive("/users-archive", navItem({ href: "/users" }))
    ).toBe(false);
  });

  it("does not match an unrelated route", () => {
    expect(isNavItemActive("/settings", navItem({ href: "/users" }))).toBe(
      false
    );
  });

  it("compares an `exact` item strictly, ignoring nested routes", () => {
    expect(
      isNavItemActive("/users/42", navItem({ href: "/users", exact: true }))
    ).toBe(false);
  });

  it("always compares the root route strictly, exact or not", () => {
    expect(isNavItemActive("/dashboard", navItem({ href: "/" }))).toBe(false);
    expect(isNavItemActive("/", navItem({ href: "/" }))).toBe(true);
  });
});
