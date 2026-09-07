"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BellIcon, PaletteIcon, UserIcon } from "lucide-react";

import { DashboardCard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const notifications = [
  {
    id: "notify-product",
    label: "Product updates",
    description: "New features, improvements and changelog highlights.",
    defaultChecked: true,
  },
  {
    id: "notify-security",
    label: "Security alerts",
    description: "Sign-ins from new devices and permission changes.",
    defaultChecked: true,
  },
  {
    id: "notify-digest",
    label: "Weekly digest",
    description: "A Monday summary of the past week's activity.",
    defaultChecked: false,
  },
];

/**
 * Client half of the settings route — the interactive tabs and form controls.
 * The page shell (`PageContainer`, heading, breadcrumbs) stays a server
 * component; only this subtree needs state.
 *
 * The controls are uncontrolled and nothing is persisted — this is a pattern
 * showcase. Wire the `onSubmit` to a Server Action in a real app.
 */
export function SettingsPanels() {
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    // Stand-in for a real mutation.
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved", {
        description: "Your changes have been applied.",
      });
    }, 600);
  }

  return (
    <Tabs defaultValue="profile" className="gap-6">
      <TabsList>
        <TabsTrigger value="profile">
          <UserIcon aria-hidden="true" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <BellIcon aria-hidden="true" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="appearance">
          <PaletteIcon aria-hidden="true" />
          Appearance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <DashboardCard
          title="Profile"
          description="How you appear across the workspace."
          footer={
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          }
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="settings-name">Full name</FieldLabel>
              <Input id="settings-name" defaultValue="Alan Prasetyo" />
            </Field>
            <Field>
              <FieldLabel htmlFor="settings-email">Email</FieldLabel>
              <Input
                id="settings-email"
                type="email"
                defaultValue="alan@example.com"
              />
              <FieldDescription>
                Used for account notifications and sign-in.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
              <Textarea
                id="settings-bio"
                rows={3}
                defaultValue="Product engineer. Building the thing that builds the thing."
              />
              <FieldDescription>
                Shown on your profile card. Plain text, 160 characters.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </DashboardCard>
      </TabsContent>

      <TabsContent value="notifications">
        <DashboardCard
          title="Notifications"
          description="Choose what lands in your inbox."
          footer={
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          }
        >
          <FieldGroup>
            {notifications.map((item) => (
              <Field
                key={item.id}
                orientation="horizontal"
                className="items-start justify-between"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={item.id}>{item.label}</FieldLabel>
                  <FieldDescription>{item.description}</FieldDescription>
                </div>
                <Switch id={item.id} defaultChecked={item.defaultChecked} />
              </Field>
            ))}
          </FieldGroup>
        </DashboardCard>
      </TabsContent>

      <TabsContent value="appearance">
        <DashboardCard
          title="Appearance"
          description="Theme is in the header — these are the finer controls."
        >
          <FieldGroup>
            <Field orientation="horizontal" className="items-start justify-between">
              <div className="space-y-0.5">
                <FieldLabel htmlFor="appearance-compact">
                  Compact density
                </FieldLabel>
                <FieldDescription>
                  Tighten row heights and padding across tables and lists.
                </FieldDescription>
              </div>
              <Switch id="appearance-compact" />
            </Field>
            <Field orientation="horizontal" className="items-start justify-between">
              <div className="space-y-0.5">
                <FieldLabel htmlFor="appearance-motion">
                  Interface animation
                </FieldLabel>
                <FieldDescription>
                  Reveal and transition effects. Your OS “reduce motion”
                  setting always wins.
                </FieldDescription>
              </div>
              <Switch id="appearance-motion" defaultChecked />
            </Field>
          </FieldGroup>
        </DashboardCard>
      </TabsContent>
    </Tabs>
  );
}
