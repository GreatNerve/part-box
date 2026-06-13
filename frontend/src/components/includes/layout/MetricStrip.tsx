import { cn } from "@/lib/utils";

type MetricStripItem = {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const valueTone = {
  default: "",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
};

type MetricStripProps = {
  items: MetricStripItem[];
  className?: string;
};

export function MetricStrip({ items, className }: MetricStripProps) {
  return (
    <div
      className={cn(
        "grid divide-x divide-border/60 rounded-lg border border-border/60 bg-card text-sm sm:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 px-3 py-2 first:rounded-l-lg last:rounded-r-lg">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
            {item.label}
          </p>
          <p className={cn("text-base font-semibold tabular-nums", valueTone[item.tone ?? "default"])}>
            {item.value}
          </p>
          {item.hint ? (
            <p className="text-muted-foreground truncate text-[11px]">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
