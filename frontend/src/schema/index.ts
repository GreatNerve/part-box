import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().max(100).optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  lowStockThreshold: z.coerce.number().int().min(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  lowStockThreshold: z.coerce.number().int().min(0),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

export const componentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  categoryId: z.string().uuid("Select a category"),
  datasheetUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  initialBox: z.string().max(50).optional(),
  initialQuantity: z.coerce.number().int().min(0).optional(),
});

export type ComponentFormValues = z.infer<typeof componentSchema>;

export const updateComponentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  categoryId: z.string().uuid("Select a category"),
  datasheetUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export type UpdateComponentFormValues = z.infer<typeof updateComponentSchema>;

export const inventoryLogSchema = z.object({
  type: z.enum(["ADD_STOCK", "USE", "RETURN", "LOST", "BURN", "DEFECTIVE"]),
  quantity: z.coerce.number().int().positive("Quantity must be positive"),
  box: z.string().min(1, "Box is required").max(50),
  reason: z.string().max(500).optional(),
});

export type InventoryLogFormValues = z.infer<typeof inventoryLogSchema>;

export const moveStockSchema = z
  .object({
    fromBox: z.string().min(1, "Source box is required").max(50),
    toBox: z.string().min(1, "Destination box is required").max(50),
    quantity: z.coerce.number().int().positive("Quantity must be positive"),
    reason: z.string().max(500).optional(),
  })
  .refine((values) => values.fromBox.trim().toLowerCase() !== values.toBox.trim().toLowerCase(), {
    message: "Source and destination must differ",
    path: ["toBox"],
  });

export type MoveStockFormValues = z.infer<typeof moveStockSchema>;
