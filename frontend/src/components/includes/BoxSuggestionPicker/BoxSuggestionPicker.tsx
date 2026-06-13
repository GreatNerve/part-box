"use client";

import { CheckIcon, PackageIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type BoxSuggestion = {
  box: string;
  quantity: number;
};

type BoxSuggestionPickerProps = {
  suggestions: BoxSuggestion[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  inputId?: string;
};

export function BoxSuggestionPicker({
  suggestions,
  value,
  onChange,
  disabled = false,
  error,
  label = "Pick a box",
  inputId = "inventory-box",
}: BoxSuggestionPickerProps) {
  const normalized = value.trim().toLowerCase();
  const selectedSuggestion = suggestions.find(
    (item) => item.box.trim().toLowerCase() === normalized,
  );
  const hasCustomValue =
    normalized.length > 0 &&
    !suggestions.some((item) => item.box.trim().toLowerCase() === normalized);

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
      {suggestions.length > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs font-medium tracking-wide uppercase">
              {label}
            </Label>
            <span className="text-muted-foreground text-[11px]">
              {suggestions.length} location{suggestions.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => {
              const isSelected =
                item.box.trim().toLowerCase() === normalized && normalized.length > 0;
              return (
                <Button
                  key={item.box}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={disabled}
                  onClick={() => onChange(item.box)}
                  aria-pressed={isSelected}
                  className={cn(
                    "h-auto min-h-10 gap-2 px-3 py-2",
                    isSelected && "ring-2 ring-primary/25",
                  )}
                >
                  {isSelected ? (
                    <CheckIcon className="size-3.5 shrink-0" aria-hidden />
                  ) : (
                    <PackageIcon className="size-3.5 shrink-0" aria-hidden />
                  )}
                  <span className="font-medium">{item.box}</span>
                  <Badge
                    variant={isSelected ? "secondary" : "outline"}
                    className={cn(
                      "h-5 px-1.5 text-[10px] tabular-nums",
                      isSelected && "bg-primary-foreground/15 text-primary-foreground border-0",
                    )}
                  >
                    {item.quantity} in stock
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/80 bg-background/60 px-3 py-2.5">
          <p className="text-muted-foreground text-xs leading-relaxed">
            No boxes yet — type a label like{" "}
            <span className="font-medium text-foreground">Grid 3 C1</span> below.
          </p>
        </div>
      )}

      <div className="space-y-2 border-t border-border/50 pt-3">
        <Label htmlFor={inputId} className="text-xs">
          {suggestions.length > 0 ? "Or enter a different box" : "Box location"}
        </Label>
        <Input
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Grid 3 C1"
          disabled={disabled}
          aria-invalid={!!error}
          className="h-10 bg-background"
        />
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : selectedSuggestion ? (
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <PackageIcon className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span>
              <span className="font-medium text-foreground">{selectedSuggestion.quantity}</span> units
              available in{" "}
              <span className="font-medium text-foreground">{selectedSuggestion.box}</span>
            </span>
          </p>
        ) : hasCustomValue ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => onChange(value.trim())}
            className="h-8 gap-1.5"
          >
            <PlusIcon className="size-3.5" aria-hidden />
            Use new box &quot;{value.trim()}&quot;
          </Button>
        ) : (
          <p className="text-muted-foreground text-xs">
            Select a known box above or type a new location label.
          </p>
        )}
      </div>
    </div>
  );
}
