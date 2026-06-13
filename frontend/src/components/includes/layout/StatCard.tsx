import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-destructive/10 text-destructive",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <Card size="sm" className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardContent className="flex items-start gap-2.5 p-3">
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", toneStyles[tone])}>
          <Icon className="size-3.5" aria-hidden />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
          <p className="text-lg font-semibold tabular-nums tracking-tight">{value}</p>
          {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function getStockTone(totalQty: number, threshold = 5): StatCardProps["tone"] {
  if (totalQty <= 0) return "danger";
  if (totalQty < threshold) return "warning";
  return "success";
}

export function getStockLabel(totalQty: number, threshold = 5): string {
  if (totalQty <= 0) return "Out of stock";
  if (totalQty < threshold) return "Low stock";
  return "In stock";
}
