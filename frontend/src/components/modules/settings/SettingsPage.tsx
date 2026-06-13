"use client";

import { useState } from "react";
import { UserIcon } from "lucide-react";

import { ContentPanel } from "@/components/includes/layout/ContentPanel";
import { PageHeader } from "@/components/includes/layout/PageHeader";
import { PageShell } from "@/components/includes/layout/PageShell";
import {
  CategoriesAddButton,
  CategoriesSettingsSection,
} from "@/components/modules/settings/CategoriesSettingsSection";
import { ThemeToggle } from "@/components/modules/layout/ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { useMeQuery } from "@/react-query/queries";

export function SettingsPage() {
  const meQuery = useMeQuery();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

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
            <div className="min-w-0">
              <p className="text-sm font-medium">Theme</p>
              <p className="text-muted-foreground text-xs">Dark default</p>
            </div>
            <ThemeToggle />
          </div>
        </ContentPanel>

        <ContentPanel title="Profile" description="Signed-in user from the API.">
          {meQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-56" />
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
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                  <UserIcon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {meQuery.data.me.displayName ?? meQuery.data.me.email}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">{meQuery.data.me.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium tabular-nums">
                  {formatDate(meQuery.data.me.createdAt)}
                </span>
              </div>
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
        toolbar={<CategoriesAddButton onClick={() => setCategoryDialogOpen(true)} />}
      >
        <CategoriesSettingsSection
          showAddButton={false}
          dialogOpen={categoryDialogOpen}
          onDialogOpenChange={setCategoryDialogOpen}
        />
      </ContentPanel>
    </PageShell>
  );
}
