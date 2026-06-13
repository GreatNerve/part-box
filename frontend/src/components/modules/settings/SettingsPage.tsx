"use client";

import { UserIcon } from "lucide-react";

import { ContentPanel } from "@/components/includes/layout/ContentPanel";
import { PageHeader } from "@/components/includes/layout/PageHeader";
import { PageShell } from "@/components/includes/layout/PageShell";
import { CategoriesSettingsSection } from "@/components/modules/settings/CategoriesSettingsSection";
import { ThemeToggle } from "@/components/modules/layout/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMeQuery } from "@/react-query/queries";

export function SettingsPage() {
  const meQuery = useMeQuery();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Profile, categories, and appearance preferences for your workspace."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ContentPanel title="Appearance" description="Switch between dark and light mode.">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-muted-foreground text-xs">Dark mode is the default</p>
            </div>
            <ThemeToggle />
          </div>
        </ContentPanel>

        <ContentPanel title="Profile" description="Signed-in user from the API.">
          {meQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : null}

          {meQuery.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Could not load profile</AlertTitle>
              <AlertDescription>{meQuery.error.message}</AlertDescription>
            </Alert>
          ) : null}

          {meQuery.data?.me ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                  <UserIcon className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="font-medium">{meQuery.data.me.displayName ?? meQuery.data.me.email}</p>
                  <p className="text-muted-foreground text-xs">{meQuery.data.me.email}</p>
                </div>
              </div>
              <dl className="divide-y divide-border/60 rounded-lg border border-border/60">
                <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd className="font-medium tabular-nums">
                    {new Date(meQuery.data.me.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          {!meQuery.isLoading && !meQuery.isError && !meQuery.data?.me ? (
            <p className="text-muted-foreground text-sm">No profile data available.</p>
          ) : null}
        </ContentPanel>
      </div>

      <ContentPanel
        title="Inventory categories"
        description="Per-category low stock thresholds and custom labels."
      >
        <CategoriesSettingsSection />
      </ContentPanel>
    </PageShell>
  );
}
