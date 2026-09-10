import type { Metadata } from "next";

import { PageContainer } from "@/components/layout";

import { SettingsPanels } from "./settings-panels";

export const metadata: Metadata = {
  title: "Settings",
  description: "Profile, notification and appearance preferences.",
};

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Manage your profile, notifications and appearance."
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Settings" }]}
      size="sm"
    >
      <SettingsPanels />
    </PageContainer>
  );
}
