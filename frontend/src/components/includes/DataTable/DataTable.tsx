"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    mobileLabel?: string;
  }
}

type DataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  dense?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: TData) => void;
};

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  dense = false,
  emptyTitle = "No results",
  emptyDescription = "Nothing to show yet.",
  onRowClick,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className={cn("w-full", dense ? "h-8" : "h-12")} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        {table.getRowModel().rows.map((row) => (
          <Card
            key={row.id}
            className={onRowClick ? "cursor-pointer transition-colors hover:bg-muted/40" : undefined}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {String(
                  row
                    .getVisibleCells()[0]
                    ?.column.columnDef.cell &&
                    flexRender(
                      row.getVisibleCells()[0].column.columnDef.cell,
                      row.getVisibleCells()[0].getContext(),
                    ),
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {row.getVisibleCells().slice(1).map((cell) => (
                <div key={cell.id} className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {cell.column.columnDef.meta?.mobileLabel ??
                      String(cell.column.columnDef.header ?? cell.column.id)}
                  </span>
                  <span className="text-right font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Table className="border-separate border-spacing-0">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-border/80 hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  dense && "h-8 px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase",
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className={cn(
              "border-b border-border/60 last:border-b-0",
              onRowClick && "cursor-pointer hover:bg-muted/50",
              dense ? "transition-colors" : "transition-colors",
            )}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(dense && "px-3 py-1.5 text-sm")}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
