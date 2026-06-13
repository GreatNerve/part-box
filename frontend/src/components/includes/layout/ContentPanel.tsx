import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ContentPanelProps = {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function ContentPanel({
  title,
  description,
  toolbar,
  children,
  className,
  contentClassName,
}: ContentPanelProps) {
  return (
    <Card
      size="sm"
      className={cn("gap-0 border-border/60 bg-card py-0 shadow-sm", className)}
    >
      {title || toolbar ? (
        <CardHeader className="gap-2 border-b border-border/60 px-4 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? <CardTitle className="text-base font-semibold">{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {toolbar ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">{toolbar}</div>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          "px-4 pb-4",
          title || toolbar ? "pt-4" : "pt-4",
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
