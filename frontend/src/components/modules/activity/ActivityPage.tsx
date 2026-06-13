"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";

import { ContentPanel } from "@/components/includes/layout/ContentPanel";
import { PageHeader } from "@/components/includes/layout/PageHeader";
import { PageShell } from "@/components/includes/layout/PageShell";
import { DataTable } from "@/components/includes/DataTable";
import { LogTypeLabel } from "@/components/includes/inventory/LogTypeLabel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InventoryLog, InventoryLogType } from "@/lib/graphql/documents";
import { formatDateTime } from "@/lib/format";
import { useInventoryLogsQuery } from "@/react-query/queries";

const logTypeOptions: { label: string; value: InventoryLogType | "ALL" }[] = [
  { label: "All types", value: "ALL" },
  { label: "Add stock", value: "ADD_STOCK" },
  { label: "Use", value: "USE" },
  { label: "Return", value: "RETURN" },
  { label: "Lost", value: "LOST" },
  { label: "Burn", value: "BURN" },
  { label: "Defective", value: "DEFECTIVE" },
  { label: "Move stock", value: "REALLOCATE" },
];

function formatBoxCell(log: InventoryLog): string {
  if (log.type === "REALLOCATE" && log.fromBox) {
    return `${log.fromBox} → ${log.box}`;
  }
  return log.box;
}

export function ActivityPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [boxFilter, setBoxFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<InventoryLogType | "ALL">("ALL");

  const logsQuery = useInventoryLogsQuery({
    search: search || undefined,
    box: boxFilter || undefined,
    type: typeFilter === "ALL" ? undefined : typeFilter,
    limit: 50,
  });

  const items = logsQuery.data?.inventoryLogs.items ?? [];
  const totalCount = logsQuery.data?.inventoryLogs.totalCount ?? 0;

  const columns = useMemo<ColumnDef<InventoryLog>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "When",
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap tabular-nums">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        accessorKey: "componentName",
        header: "Component",
        meta: { mobileLabel: "Component" },
        cell: ({ row }) => (
          <Link
            href={`/components/${row.original.componentId}`}
            className="block max-w-[10rem] truncate font-medium hover:text-primary hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {row.original.componentName ?? "Unknown part"}
          </Link>
        ),
      },
      {
        accessorKey: "type",
        header: "Event",
        meta: { mobileLabel: "Event" },
        cell: ({ row }) => <LogTypeLabel type={row.original.type} />,
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        meta: { mobileLabel: "Quantity" },
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">{row.original.quantity}</span>
        ),
      },
      {
        id: "box",
        header: "Box",
        meta: { mobileLabel: "Box" },
        cell: ({ row }) => (
          <span className="max-w-[10rem] truncate">{formatBoxCell(row.original)}</span>
        ),
      },
      {
        accessorKey: "reason",
        header: "Reason",
        meta: { mobileLabel: "Reason" },
        cell: ({ row }) => (
          <span className="text-muted-foreground max-w-[12rem] truncate">
            {row.original.reason ?? "—"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Audit trail"
        title="Activity"
        meta={`${totalCount} events`}
        description="Every inventory change across all components, newest first."
      />

      <ContentPanel
        title="Workspace activity"
        description={`Showing ${items.length} of ${totalCount}`}
        toolbar={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search component name…"
                aria-label="Search activity"
                className="h-10 pl-9"
              />
            </div>
            <Input
              value={boxFilter}
              onChange={(event) => setBoxFilter(event.target.value)}
              placeholder="Filter by box…"
              aria-label="Filter by box"
              className="h-10 sm:max-w-[160px]"
            />
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as InventoryLogType | "ALL")}
            >
              <SelectTrigger className="h-10 sm:w-[160px]" aria-label="Filter by log type">
                <SelectValue placeholder="Log type" />
              </SelectTrigger>
              <SelectContent>
                {logTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {logsQuery.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load activity</AlertTitle>
            <AlertDescription>{logsQuery.error.message}</AlertDescription>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            isLoading={logsQuery.isLoading}
            emptyTitle="No activity yet"
            emptyDescription="Record inventory changes on any component to populate this feed."
            onRowClick={(row) => router.push(`/components/${row.componentId}`)}
          />
        )}
      </ContentPanel>
    </PageShell>
  );
}
