"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightLeftIcon,
  BoxesIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
  PackageIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DialogForm } from "@/components/includes/DialogForm";
import { ContentPanel } from "@/components/includes/layout/ContentPanel";
import { PageHeader } from "@/components/includes/layout/PageHeader";
import { PageShell } from "@/components/includes/layout/PageShell";
import { getStockLabel, getStockTone, StatCard } from "@/components/includes/layout/StatCard";
import { DataTable } from "@/components/includes/DataTable";
import {
  formatLogTypeLabel,
  getLogTypeBadgeVariant,
  InventoryLogDialog,
} from "@/components/modules/components/InventoryLogDialog";
import { MoveStockDialog } from "@/components/modules/components/MoveStockDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { InventoryLog } from "@/lib/graphql/documents";
import { isValidationError } from "@/lib/graphql/errors";
import { cn } from "@/lib/utils";
import {
  inventoryLogSchema,
  moveStockSchema,
  updateComponentSchema,
  type InventoryLogFormValues,
  type MoveStockFormValues,
  type UpdateComponentFormValues,
} from "@/schema";
import { useCategoriesQuery, useComponentLogsQuery, useComponentQuery } from "@/react-query/queries";
import { useApplyInventoryLogMutation, useUpdateComponentMutation } from "@/react-query/mutations";

type ComponentDetailPageProps = {
  componentId: string;
};

export function ComponentDetailPage({ componentId }: ComponentDetailPageProps) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [moveSubmitError, setMoveSubmitError] = useState<string | null>(null);
  const [editSubmitError, setEditSubmitError] = useState<string | null>(null);

  const componentQuery = useComponentQuery(componentId);
  const categoriesQuery = useCategoriesQuery();
  const logsQuery = useComponentLogsQuery(componentId);
  const applyLogMutation = useApplyInventoryLogMutation();
  const updateMutation = useUpdateComponentMutation();

  const form = useForm<InventoryLogFormValues>({
    resolver: zodResolver(inventoryLogSchema),
    defaultValues: {
      type: "ADD_STOCK",
      quantity: 1,
      box: "",
      reason: "",
    },
  });

  const moveForm = useForm<MoveStockFormValues>({
    resolver: zodResolver(moveStockSchema),
    defaultValues: {
      fromBox: "",
      toBox: "",
      quantity: 1,
      reason: "",
    },
  });

  const editForm = useForm<UpdateComponentFormValues>({
    resolver: zodResolver(updateComponentSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      datasheetUrl: "",
    },
  });

  const logColumns = useMemo<ColumnDef<InventoryLog>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Event",
        cell: ({ row }) => (
          <Badge variant={getLogTypeBadgeVariant(row.original.type)}>
            {formatLogTypeLabel(row.original.type)}
          </Badge>
        ),
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
        accessorKey: "box",
        header: "Box",
        meta: { mobileLabel: "Box" },
        cell: ({ row }) => {
          const log = row.original;
          if (log.type === "REALLOCATE" && log.fromBox) {
            return (
              <span className="inline-flex items-center gap-1.5">
                <PackageIcon className="text-muted-foreground size-3.5" aria-hidden />
                {log.fromBox} → {log.box}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5">
              <PackageIcon className="text-muted-foreground size-3.5" aria-hidden />
              {log.box}
            </span>
          );
        },
      },
      {
        accessorKey: "reason",
        header: "Reason",
        meta: { mobileLabel: "Reason" },
        cell: ({ row }) => row.original.reason ?? "—",
      },
      {
        accessorKey: "createdAt",
        header: "When",
        meta: { mobileLabel: "When" },
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {new Date(row.original.createdAt).toLocaleString()}
          </span>
        ),
      },
    ],
    [],
  );

  const openRecordDialog = (defaultBox: string) => {
    setSubmitError(null);
    form.reset({
      type: "ADD_STOCK",
      quantity: 1,
      box: defaultBox,
      reason: "",
    });
    setDialogOpen(true);
  };

  const openMoveDialog = (fromBox: string, toBox: string) => {
    setMoveSubmitError(null);
    moveForm.reset({
      fromBox,
      toBox,
      quantity: 1,
      reason: "",
    });
    setMoveDialogOpen(true);
  };

  const openEditDialog = (values: UpdateComponentFormValues) => {
    setEditSubmitError(null);
    editForm.reset(values);
    setEditDialogOpen(true);
  };

  const handleApplyLog = async (values: InventoryLogFormValues) => {
    setSubmitError(null);

    try {
      const result = await applyLogMutation.mutateAsync({
        input: {
          componentId,
          type: values.type,
          quantity: values.quantity,
          box: values.box,
          reason: values.reason || null,
        },
      });

      if (isValidationError(result.applyInventoryLog)) {
        setSubmitError(result.applyInventoryLog.message);
        return;
      }

      toast.success("Inventory updated");
      setDialogOpen(false);
      form.reset({
        type: "ADD_STOCK",
        quantity: 1,
        box: values.box,
        reason: "",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["component", componentId] }),
        queryClient.invalidateQueries({ queryKey: ["componentLogs", componentId] }),
        queryClient.invalidateQueries({ queryKey: ["inventoryLogs"] }),
        queryClient.invalidateQueries({ queryKey: ["components"] }),
      ]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not apply inventory log.");
    }
  };

  const handleMoveStock = async (values: MoveStockFormValues) => {
    setMoveSubmitError(null);

    try {
      const result = await applyLogMutation.mutateAsync({
        input: {
          componentId,
          type: "REALLOCATE",
          quantity: values.quantity,
          box: values.toBox,
          fromBox: values.fromBox,
          reason: values.reason || null,
        },
      });

      if (isValidationError(result.applyInventoryLog)) {
        setMoveSubmitError(result.applyInventoryLog.message);
        return;
      }

      toast.success("Stock moved");
      setMoveDialogOpen(false);
      moveForm.reset({
        fromBox: values.fromBox,
        toBox: values.toBox,
        quantity: 1,
        reason: "",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["component", componentId] }),
        queryClient.invalidateQueries({ queryKey: ["componentLogs", componentId] }),
        queryClient.invalidateQueries({ queryKey: ["inventoryLogs"] }),
        queryClient.invalidateQueries({ queryKey: ["components"] }),
      ]);
    } catch (error) {
      setMoveSubmitError(error instanceof Error ? error.message : "Could not move stock.");
    }
  };

  const handleEdit = async (values: UpdateComponentFormValues) => {
    setEditSubmitError(null);

    try {
      const result = await updateMutation.mutateAsync({
        input: {
          id: componentId,
          name: values.name,
          categoryId: values.categoryId,
          datasheetUrl: values.datasheetUrl || null,
        },
      });

      if (isValidationError(result.updateComponent)) {
        setEditSubmitError(result.updateComponent.message);
        return;
      }

      toast.success("Component updated");
      setEditDialogOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["component", componentId] }),
        queryClient.invalidateQueries({ queryKey: ["components"] }),
      ]);
    } catch (error) {
      setEditSubmitError(error instanceof Error ? error.message : "Could not update component.");
    }
  };

  if (componentQuery.isLoading) {
    return (
      <PageShell className="gap-5">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (componentQuery.isError || !componentQuery.data?.component) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Component not found</AlertTitle>
        <AlertDescription>
          {componentQuery.error?.message ?? "This component may have been removed."}
        </AlertDescription>
      </Alert>
    );
  }

  const component = componentQuery.data.component;
  const boxSuggestions = component.boxQuantities.map((entry) => ({
    box: entry.box,
    quantity: entry.quantity,
  }));
  const defaultBox = boxSuggestions[0]?.box ?? "";
  const secondBox = boxSuggestions[1]?.box ?? "";
  const categoryOptions =
    categoriesQuery.data?.categories.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  return (
    <PageShell className="gap-5">
      <Link
        href="/components"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "text-muted-foreground hover:text-foreground -ml-2 w-fit gap-1.5",
        )}
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Back to components
      </Link>

      <PageHeader
        eyebrow={component.categoryName}
        title={component.name}
        description="Track stock by box, review history, and record every inventory change."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                openEditDialog({
                  name: component.name,
                  categoryId: component.categoryId,
                  datasheetUrl: component.datasheetUrl ?? "",
                })
              }
            >
              <PencilIcon className="size-4" aria-hidden />
              Edit details
            </Button>
            {component.datasheetUrl ? (
              <a
                href={component.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
              >
                <ExternalLinkIcon className="size-4" aria-hidden />
                View resource
              </a>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total stock"
          value={component.totalQty}
          hint={getStockLabel(component.totalQty, component.lowStockThreshold)}
          icon={BoxesIcon}
          tone={getStockTone(component.totalQty, component.lowStockThreshold)}
        />
        <StatCard
          label="Box locations"
          value={component.boxQuantities.length}
          hint="Active storage labels"
          icon={PackageIcon}
        />
        <StatCard
          label="Log entries"
          value={logsQuery.data?.componentLogs.totalCount ?? "—"}
          hint="Audit trail events"
          icon={ClipboardListIcon}
        />
      </div>

      <ContentPanel title="Box breakdown" description="Quantities stored in each labeled box.">
        {component.boxQuantities.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-4 text-center">
            <p className="text-sm font-medium">No boxes yet</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Record your first log to create a box location.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {component.boxQuantities.map((entry) => (
              <div
                key={entry.box}
                className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2.5 py-2"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <PackageIcon className="text-muted-foreground size-3.5" aria-hidden />
                  {entry.box}
                </span>
                <Badge variant="secondary" className="tabular-nums">
                  {entry.quantity} units
                </Badge>
              </div>
            ))}
          </div>
        )}
      </ContentPanel>

      <ContentPanel
        title="Inventory history"
        description="Every stock change with box-level detail."
        toolbar={
          <>
            <Button
              variant="outline"
              className="gap-2"
              disabled={component.boxQuantities.length === 0}
              onClick={() => openMoveDialog(defaultBox, secondBox)}
            >
              <ArrowRightLeftIcon className="size-4" aria-hidden />
              Move stock
            </Button>
            <Button className="gap-2 shadow-sm" onClick={() => openRecordDialog(defaultBox)}>
              <PlusIcon className="size-4" aria-hidden />
              Record change
            </Button>
          </>
        }
      >
        {logsQuery.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load logs</AlertTitle>
            <AlertDescription>{logsQuery.error.message}</AlertDescription>
          </Alert>
        ) : (
          <DataTable
            columns={logColumns}
            data={logsQuery.data?.componentLogs.items ?? []}
            isLoading={logsQuery.isLoading}
            emptyTitle="No logs yet"
            emptyDescription="Record your first inventory change to start the audit trail."
          />
        )}
      </ContentPanel>

      <InventoryLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        boxSuggestions={boxSuggestions}
        componentName={component.name}
        onSubmit={handleApplyLog}
        isSubmitting={applyLogMutation.isPending}
        errorMessage={submitError}
      />

      <MoveStockDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        form={moveForm}
        boxSuggestions={boxSuggestions}
        componentName={component.name}
        onSubmit={handleMoveStock}
        isSubmitting={applyLogMutation.isPending}
        errorMessage={moveSubmitError}
      />

      <DialogForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit component"
        description="Update name, category, or resource link."
        form={editForm}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Arduino Nano" },
          {
            name: "categoryId",
            label: "Category",
            type: "select",
            placeholder: "Select category",
            options: categoryOptions,
          },
          {
            name: "datasheetUrl",
            label: "Resource link URL",
            type: "text",
            placeholder: "https://...",
          },
        ]}
        onSubmit={handleEdit}
        submitLabel="Save"
        isSubmitting={updateMutation.isPending}
        errorMessage={editSubmitError}
      />
    </PageShell>
  );
}
