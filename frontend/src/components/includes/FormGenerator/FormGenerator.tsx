import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldConfig<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  description?: string;
  options?: FormFieldOption[];
};

type FormGeneratorProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: FormFieldConfig<T>[];
  idPrefix?: string;
};

export function FormGenerator<T extends FieldValues>({
  form,
  fields,
  idPrefix = "field",
}: FormGeneratorProps<T>) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form;

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const error = errors[field.name];
        const fieldId = `${idPrefix}-${String(field.name)}`;
        let control: ReactNode = null;

        if (field.type === "textarea") {
          control = (
            <Textarea
              id={fieldId}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          );
        } else if (field.type === "select") {
          const value = watch(field.name) as string | undefined;
          control = (
            <Select
              value={value ?? ""}
              onValueChange={(next) =>
                setValue(field.name, next as T[Path<T>], { shouldValidate: true })
              }
            >
              <SelectTrigger id={fieldId} className="w-full">
                <SelectValue placeholder={field.placeholder ?? "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {(field.options ?? []).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else {
          control = (
            <Input
              id={fieldId}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name, {
                valueAsNumber: field.type === "number",
              })}
            />
          );
        }

        return (
          <Field key={String(field.name)} data-invalid={!!error}>
            <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
            <FieldContent>{control}</FieldContent>
            {field.description ? (
              <FieldDescription>{field.description}</FieldDescription>
            ) : null}
            <FieldError>{error?.message as string | undefined}</FieldError>
          </Field>
        );
      })}
    </div>
  );
}
