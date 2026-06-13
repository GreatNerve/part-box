import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-primary text-xs font-medium tracking-widest uppercase">{eyebrow}</p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-balance text-2xl font-semibold tracking-tight">{title}</h1>
          {meta ? <div className="text-muted-foreground text-sm tabular-nums">{meta}</div> : null}
        </div>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
