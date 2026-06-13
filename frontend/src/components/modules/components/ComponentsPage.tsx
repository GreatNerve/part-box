"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxesIcon, PackageIcon, PlusIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { ContentPanel } from "@/components/includes/layout/ContentPanel";
import { PageHeader } from "@/components/includes/layout/PageHeader";
import { PageShell } from "@/components/includes/layout/PageShell";
import { getStockLabel, getStockTone, StatCard } from "@/components/includes/layout/StatCard";
import { DataTable } from "@/components/includes/DataTable";
import { DialogForm } from "@/components/includes/DialogForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Component } from "@/lib/graphql/documents";
import { isValidationError } from "@/lib/graphql/errors";
import { componentSchema, type ComponentFormValues } from "@/schema";
import { useCategoriesQuery, useComponentsQuery } from "@/react-query/queries";
import { useCreateComponentMutation } from "@/react-query/mutations";

export function ComponentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categoriesQuery = useCategoriesQuery();
  const componentsQuery = useComponentsQuery({ search: search || undefined });
  const createMutation = useCreateComponentMutation();

  const items = componentsQuery.data?.components.items ?? [];
  const totalCount = componentsQuery.data?.components.totalCount ?? 0;
  const lowStockCount = items.filter(
    (item) => item.totalQty > 0 && item.totalQty < item.lowStockThreshold,
  ).length;
  const outOfStockCount = items.filter((item) => item.totalQty <= 0).length;

  const form = useForm<ComponentFormValues>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      datasheetUrl: "",
      initialBox: "",
      initialQuantity: 0,
    },
  });

  const columns = useMemo<ColumnDef<Component>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Component",
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <Link
              href={`/components/${row.original.id}`}
              className="font-medium hover:text-primary hover:underline"
            >
              {row.original.name}
            </Link>
            <p className="text-muted-foreground text-xs">{row.original.categoryName}</p>
          </div>
        ),
      },
      {
        accessorKey: "totalQty",
        header: "Stock",
        meta: { mobileLabel: "Stock" },
        cell: ({ row }) => {
          const threshold = row.original.lowStockThreshold;
          const tone = getStockTone(row.original.totalQty, threshold);
          return (
            <div className="flex items-center gap-2">
              <Badge
                variant={tone === "danger" ? "destructive" : tone === "warning" ? "secondary" : "default"}
                className="tabular-nums"
              >
                {row.original.totalQty}
              </Badge>
              <span className="text-muted-foreground hidden text-xs sm:inline">
                {getStockLabel(row.original.totalQty, threshold)}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        meta: { mobileLabel: "Updated" },
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {new Date(row.original.updatedAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [],
  );

  const categoryOptions =
    categoriesQuery.data?.categories.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? [];

  const handleCreate = async (values: ComponentFormValues) => {
    setSubmitError(null);

    try {
      const result = await createMutation.mutateAsync({
        input: {
          name: values.name,
          categoryId: values.categoryId,
          datasheetUrl: values.datasheetUrl || null,
          initialBoxQuantities:
            values.initialBox && values.initialQuantity
              ? [{ box: values.initialBox, quantity: values.initialQuantity }]
              : null,
        },
      });

      if (isValidationError(result.createComponent)) {
        setSubmitError(result.createComponent.message);
        return;
      }

      toast.success("Component created");
      setDialogOpen(false);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["components"] });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create component.");
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Inventory"
        title="Components"
        description="Browse your parts library, monitor stock levels, and jump into box-level detail."
        actions={
          <Button size="lg" onClick={() => setDialogOpen(true)} className="gap-2 shadow-sm">
            <PlusIcon className="size-4" aria-hidden />
            Add component
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total parts"
          value={totalCount}
          hint="Matching current filters"
          icon={BoxesIcon}
        />
        <StatCard
          label="Low stock"
          value={lowStockCount}
          hint="Below category threshold"
          icon={PackageIcon}
          tone={lowStockCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Out of stock"
          value={outOfStockCount}
          hint="Needs restocking"
          icon={PackageIcon}
          tone={outOfStockCount > 0 ? "danger" : "default"}
        />
      </div>

      <ContentPanel
        title="Parts catalog"
        description={`Showing ${items.length} of ${totalCount} components`}
        toolbar={
          <div className="relative w-full sm:w-72">
            <SearchIcon
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name..."
              aria-label="Search components"
              className="h-10 pl-9"
            />
          </div>
        }
      >
        {componentsQuery.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load components</AlertTitle>
            <AlertDescription>{componentsQuery.error.message}</AlertDescription>
          </Alert>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            isLoading={componentsQuery.isLoading}
            emptyTitle="No components yet"
            emptyDescription="Add your first part to start tracking stock across labeled boxes."
            onRowClick={(row) => router.push(`/components/${row.id}`)}
          />
        )}
      </ContentPanel>

      <DialogForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add component"
        description="Create a part and optionally seed an initial box quantity."
        form={form}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Arduino Uno R3" },
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
          { name: "initialBox", label: "Initial box", type: "text", placeholder: "Box A" },
          { name: "initialQuantity", label: "Initial quantity", type: "number" },
        ]}
        onSubmit={handleCreate}
        submitLabel="Create"
        isSubmitting={createMutation.isPending}
        errorMessage={submitError}
      />
    </PageShell>
  );
}
