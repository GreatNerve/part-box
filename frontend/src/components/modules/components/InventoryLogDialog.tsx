"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { CheckIcon } from "lucide-react";

import { BoxSuggestionPicker, type BoxSuggestion } from "@/components/includes/BoxSuggestionPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { InventoryLogFormValues } from "@/schema";

const logTypeOptions = [
  { label: "Add stock", value: "ADD_STOCK", hint: "Receive new parts" },
  { label: "Use", value: "USE", hint: "Take from inventory" },
  { label: "Return", value: "RETURN", hint: "Put back unused parts" },
  { label: "Lost", value: "LOST", hint: "Missing items" },
  { label: "Burn", value: "BURN", hint: "Used up in project" },
  { label: "Defective", value: "DEFECTIVE", hint: "Damaged parts" },
] as const;

type InventoryLogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<InventoryLogFormValues>;
  boxSuggestions: BoxSuggestion[];
  componentName?: string;
  onSubmit: (values: InventoryLogFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function InventoryLogDialog({
  open,
  onOpenChange,
  form,
  boxSuggestions,
  componentName,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: InventoryLogDialogProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedType = watch("type");
  const selectedBox = watch("box");

  useEffect(() => {
    if (open && !selectedBox && boxSuggestions.length > 0) {
      setValue("box", boxSuggestions[0].box, { shouldValidate: true });
    }
  }, [open, selectedBox, boxSuggestions, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(640px,90dvh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 border-b border-border/60 px-6 py-5 pr-14">
          <DialogTitle className="text-lg">Record inventory change</DialogTitle>
          <DialogDescription className="leading-relaxed">
            {componentName ? (
              <>
                Updating stock for{" "}
                <span className="font-medium text-foreground">{componentName}</span>. Choose a log
                type, box, and quantity.
              </>
            ) : (
              "Choose a log type, pick a box, and enter the quantity moved."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field data-invalid={!!errors.type}>
              <FieldLabel>Log type</FieldLabel>
              <FieldContent>
                <div className="grid grid-cols-2 gap-2">
                  {logTypeOptions.map((option) => {
                    const isActive = selectedType === option.value;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        disabled={isSubmitting}
                        aria-pressed={isActive}
                        onClick={() =>
                          setValue("type", option.value, { shouldValidate: true })
                        }
                        className={cn(
                          "relative h-auto min-h-12 flex-col items-start gap-0.5 px-3 py-2.5 text-left",
                          isActive && "ring-2 ring-primary/25",
                        )}
                      >
                        <span className="flex w-full items-center gap-1.5">
                          {isActive ? (
                            <CheckIcon className="size-3.5 shrink-0" aria-hidden />
                          ) : null}
                          <span className="text-sm font-medium">{option.label}</span>
                        </span>
                        <span
                          className={cn(
                            "line-clamp-1 text-[11px] leading-tight",
                            isActive ? "text-primary-foreground/75" : "text-muted-foreground",
                          )}
                        >
                          {option.hint}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </FieldContent>
              <FieldError>{errors.type?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor="inventory-quantity">Quantity</FieldLabel>
              <FieldContent>
                <Input
                  id="inventory-quantity"
                  type="number"
                  min={1}
                  disabled={isSubmitting}
                  className="h-10 w-full max-w-[120px] tabular-nums"
                  {...register("quantity", { valueAsNumber: true })}
                />
              </FieldContent>
              <FieldDescription>Units moved in this event.</FieldDescription>
              <FieldError>{errors.quantity?.message}</FieldError>
            </Field>

            <BoxSuggestionPicker
              suggestions={boxSuggestions}
              value={selectedBox}
              onChange={(next) => setValue("box", next, { shouldValidate: true })}
              disabled={isSubmitting}
              error={errors.box?.message}
            />

            <Field data-invalid={!!errors.reason}>
              <FieldLabel htmlFor="inventory-reason">Reason (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  id="inventory-reason"
                  placeholder="e.g. Used in robotics lab project"
                  disabled={isSubmitting}
                  rows={2}
                  className="min-h-[72px] resize-none"
                  {...register("reason")}
                />
              </FieldContent>
              <FieldError>{errors.reason?.message}</FieldError>
            </Field>

            {errorMessage ? (
              <p
                className="text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
          </div>

          <Separator />
          <DialogFooter className="gap-2 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-28">
              {isSubmitting ? <Spinner className="size-4" /> : null}
              Apply log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function getLogTypeBadgeVariant(
  type: string,
): "default" | "secondary" | "outline" | "destructive" {
  switch (type) {
    case "ADD_STOCK":
    case "RETURN":
      return "default";
    case "USE":
    case "BURN":
      return "secondary";
    case "LOST":
    case "DEFECTIVE":
      return "destructive";
    case "REALLOCATE":
      return "outline";
    default:
      return "outline";
  }
}

export function formatLogTypeLabel(type: string): string {
  if (type === "REALLOCATE") return "Move stock";
  return type
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
