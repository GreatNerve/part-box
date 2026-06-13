import { cn } from "@/lib/utils";
import { formatLogTypeLabel } from "@/components/modules/components/InventoryLogDialog";

const typeTone: Record<string, string> = {
  ADD_STOCK: "text-emerald-600 dark:text-emerald-400",
  RETURN: "text-emerald-600 dark:text-emerald-400",
  USE: "text-foreground",
  BURN: "text-muted-foreground",
  REALLOCATE: "text-primary",
  LOST: "text-destructive",
  DEFECTIVE: "text-destructive",
};

type LogTypeLabelProps = {
  type: string;
  className?: string;
};

export function LogTypeLabel({ type, className }: LogTypeLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-sm",
        typeTone[type] ?? "text-foreground",
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden />
      <span className="truncate font-medium">{formatLogTypeLabel(type)}</span>
    </span>
  );
}
