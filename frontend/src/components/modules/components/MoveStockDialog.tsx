"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

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
import type { MoveStockFormValues } from "@/schema";

type MoveStockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MoveStockFormValues>;
  boxSuggestions: BoxSuggestion[];
  componentName?: string;
  onSubmit: (values: MoveStockFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function MoveStockDialog({
  open,
  onOpenChange,
  form,
  boxSuggestions,
  componentName,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: MoveStockDialogProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const fromBox = watch("fromBox");
  const toBox = watch("toBox");

  useEffect(() => {
    if (open && boxSuggestions.length > 0) {
      if (!fromBox) {
        setValue("fromBox", boxSuggestions[0].box, { shouldValidate: true });
      }
      if (!toBox && boxSuggestions.length > 1) {
        setValue("toBox", boxSuggestions[1].box, { shouldValidate: true });
      } else if (!toBox) {
        setValue("toBox", "", { shouldValidate: true });
      }
    }
  }, [open, fromBox, toBox, boxSuggestions, setValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(640px,90dvh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 border-b border-border/60 px-6 py-5 pr-14">
          <DialogTitle className="text-lg">Move stock</DialogTitle>
          <DialogDescription className="leading-relaxed">
            {componentName ? (
              <>
                Move units between boxes for{" "}
                <span className="font-medium text-foreground">{componentName}</span>. Total stock
                stays the same.
              </>
            ) : (
              "Transfer quantity from one box to another without changing total stock."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <BoxSuggestionPicker
              label="From box"
              inputId="move-from-box"
              suggestions={boxSuggestions}
              value={fromBox}
              onChange={(next) => setValue("fromBox", next, { shouldValidate: true })}
              disabled={isSubmitting}
              error={errors.fromBox?.message}
            />

            <BoxSuggestionPicker
              label="To box"
              inputId="move-to-box"
              suggestions={boxSuggestions}
              value={toBox}
              onChange={(next) => setValue("toBox", next, { shouldValidate: true })}
              disabled={isSubmitting}
              error={errors.toBox?.message}
            />

            <Field data-invalid={!!errors.quantity}>
              <FieldLabel htmlFor="move-quantity">Quantity</FieldLabel>
              <FieldContent>
                <Input
                  id="move-quantity"
                  type="number"
                  min={1}
                  disabled={isSubmitting}
                  className="h-10 w-full max-w-[120px] tabular-nums"
                  {...register("quantity", { valueAsNumber: true })}
                />
              </FieldContent>
              <FieldDescription>Units to move out of the source box.</FieldDescription>
              <FieldError>{errors.quantity?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.reason}>
              <FieldLabel htmlFor="move-reason">Reason (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  id="move-reason"
                  placeholder="e.g. Reorganizing drawer labels"
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
              Move stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
