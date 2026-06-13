import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ContentPanelProps = {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ContentPanel({
  title,
  description,
  toolbar,
  children,
  className,
}: ContentPanelProps) {
  return (
    <Card
      size="sm"
      className={cn("border-border/60 bg-card/80 shadow-sm backdrop-blur-sm", className)}
    >
      {title || toolbar ? (
        <CardHeader className="gap-2 border-b border-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title ? <CardTitle className="text-base font-semibold">{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {toolbar ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">{toolbar}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(title || toolbar ? "pt-3" : "pt-4")}>{children}</CardContent>
    </Card>
  );
}
