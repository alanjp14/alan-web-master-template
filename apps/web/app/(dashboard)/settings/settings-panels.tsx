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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppearance } from "@/hooks/use-appearance";

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
  const { theme, setTheme, density, setDensity, themes } = useAppearance();

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
      {/* Scrolls rather than overflowing the viewport on a narrow phone.
          `-mx-1 px-1` keeps the focus ring off the clip edge. */}
      <div className="-mx-1 overflow-x-auto px-1">
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
      </div>

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
          description="Light/dark mode is in the header — these persist per browser."
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="appearance-theme">Brand theme</FieldLabel>
              <Select
                value={theme}
                onValueChange={(value) =>
                  setTheme(value as (typeof themes)[number]["id"])
                }
              >
                <SelectTrigger id="appearance-theme" className="w-full">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label} — {option.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Recolors the whole app: accents, charts, focus rings, radius
                and — for some themes — the typeface.
              </FieldDescription>
            </Field>
            <Field
              orientation="horizontal"
              className="items-start justify-between"
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="appearance-compact">
                  Compact density
                </FieldLabel>
                <FieldDescription>
                  Tightens the spacing scale ~12% across every screen.
                </FieldDescription>
              </div>
              <Switch
                id="appearance-compact"
                checked={density === "compact"}
                onCheckedChange={(checked) =>
                  setDensity(checked ? "compact" : "comfortable")
                }
              />
            </Field>
            <Field
              orientation="horizontal"
              className="items-start justify-between"
            >
              <div className="space-y-0.5">
                <FieldLabel>Interface animation</FieldLabel>
                <FieldDescription>
                  Reveal and transition effects follow your OS “reduce motion”
                  setting automatically — no per-app toggle needed.
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </DashboardCard>
      </TabsContent>
    </Tabs>
  );
}
