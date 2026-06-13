"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/includes/DataTable";
import { DialogForm } from "@/components/includes/DialogForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/graphql/documents";
import { isValidationError } from "@/lib/graphql/errors";
import { categorySchema, type CategoryFormValues } from "@/schema";
import { useCategoriesQuery } from "@/react-query/queries";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/react-query/mutations";

type CategoryRow = Category & { draftThreshold: number; draftName: string };

type CategoriesSettingsSectionProps = {
  showAddButton?: boolean;
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
};

export function CategoriesSettingsSection({
  showAddButton = true,
  dialogOpen: dialogOpenProp,
  onDialogOpenChange,
}: CategoriesSettingsSectionProps) {
  const queryClient = useQueryClient();
  const [dialogOpenLocal, setDialogOpenLocal] = useState(false);
  const dialogOpen = dialogOpenProp ?? dialogOpenLocal;
  const setDialogOpen = onDialogOpenChange ?? setDialogOpenLocal;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, { name: string; threshold: number }>>({});

  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();

  const categories = categoriesQuery.data?.categories ?? [];

  const rows: CategoryRow[] = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        draftName: drafts[category.id]?.name ?? category.name,
        draftThreshold: drafts[category.id]?.threshold ?? category.lowStockThreshold,
      })),
    [categories, drafts],
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", lowStockThreshold: 5 },
  });

  const handleSaveRow = useCallback(
    async (row: CategoryRow) => {
      setRowErrors((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });

      try {
        const result = await updateMutation.mutateAsync({
          input: {
            id: row.id,
            name: row.isDefault ? undefined : row.draftName,
            lowStockThreshold: row.draftThreshold,
          },
        });

        const payload = result.updateCategory;
        if (isValidationError(payload)) {
          setRowErrors((prev) => ({ ...prev, [row.id]: payload.message }));
          return;
        }

        toast.success(`Updated ${payload.name}`);
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[row.id];
          return next;
        });
        await queryClient.invalidateQueries({ queryKey: ["categories"] });
        await queryClient.invalidateQueries({ queryKey: ["components"] });
      } catch (error) {
        setRowErrors((prev) => ({
          ...prev,
          [row.id]: error instanceof Error ? error.message : "Could not update category.",
        }));
      }
    },
    [queryClient, updateMutation],
  );

  const columns = useMemo<ColumnDef<CategoryRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category",
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-2">
            <FolderIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
            {row.original.isDefault ? (
              <span className="truncate font-medium">{row.original.name}</span>
            ) : (
              <Input
                value={row.original.draftName}
                onChange={(event) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [row.original.id]: {
                      name: event.target.value,
                      threshold: row.original.draftThreshold,
                    },
                  }))
                }
                className="h-8 max-w-[12rem] text-sm"
                aria-label={`Name for ${row.original.name}`}
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "isDefault",
        header: "Type",
        meta: { mobileLabel: "Type" },
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.isDefault ? "System" : "Custom"}
          </span>
        ),
      },
      {
        id: "threshold",
        header: "Low at",
        meta: { mobileLabel: "Low stock threshold" },
        cell: ({ row }) => (
          <Input
            type="number"
            min={0}
            value={row.original.draftThreshold}
            onChange={(event) =>
              setDrafts((prev) => ({
                ...prev,
                [row.original.id]: {
                  name: row.original.draftName,
                  threshold: Number(event.target.value),
                },
              }))
            }
            className="h-8 w-16 tabular-nums"
            aria-label={`Low stock threshold for ${row.original.name}`}
          />
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const changed =
            row.original.draftThreshold !== row.original.lowStockThreshold ||
            (!row.original.isDefault && row.original.draftName !== row.original.name);
          const error = rowErrors[row.original.id];
          return (
            <div className="flex flex-col items-end gap-0.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                disabled={!changed || updateMutation.isPending}
                onClick={() => void handleSaveRow(row.original)}
              >
                Save
              </Button>
              {error ? (
                <span className="text-destructive text-[11px]" role="alert">
                  {error}
                </span>
              ) : null}
            </div>
          );
        },
      },
    ],
    [handleSaveRow, rowErrors, updateMutation.isPending],
  );

  const handleCreate = async (values: CategoryFormValues) => {
    setSubmitError(null);

    try {
      const result = await createMutation.mutateAsync({
        input: {
          name: values.name,
          lowStockThreshold: values.lowStockThreshold,
        },
      });

      if (isValidationError(result.createCategory)) {
        setSubmitError(result.createCategory.message);
        return;
      }

      toast.success("Category created");
      setDialogOpen(false);
      form.reset({ name: "", lowStockThreshold: 5 });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create category.");
    }
  };

  return (
    <>
      {showAddButton ? (
        <div className="mb-2 flex justify-end">
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1.5">
            <PlusIcon className="size-3.5" aria-hidden />
            Add category
          </Button>
        </div>
      ) : null}

      {categoriesQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load categories</AlertTitle>
          <AlertDescription>{categoriesQuery.error.message}</AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          isLoading={categoriesQuery.isLoading}
          emptyTitle="No categories"
          emptyDescription="Categories are seeded when you register."
        />
      )}

      <DialogForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Add category"
        description="Choose a short name and set when stock should show as low."
        form={form}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Passives" },
          {
            name: "lowStockThreshold",
            label: "Low stock threshold",
            type: "number",
            placeholder: "5",
          },
        ]}
        onSubmit={handleCreate}
        submitLabel="Create"
        isSubmitting={createMutation.isPending}
        errorMessage={submitError}
      />
    </>
  );
}

export function CategoriesAddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick} className="gap-1.5">
      <PlusIcon className="size-3.5" aria-hidden />
      Add category
    </Button>
  );
}
