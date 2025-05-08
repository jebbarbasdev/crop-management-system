import { z } from "zod";

export const WeightItemSchema = z.object({
  id: z.number().optional(),
  storage_unit_id: z.number(),
  store_id: z.number(),
  weight_by_unit: z
    .number()
    .min(0.01, "El peso debe ser mayor a 0")
    .refine((value) => value !== 0, "El peso no puede ser 0"),
  store_name: z.string().optional(),
  created_at: z.string().optional(),
  created_by: z.string().optional(),
  updated_at: z.string().optional(),
  updated_by: z.string().optional(),
});

export const StorageUnitStoreWeightsSchema = z.object({
  weights: z
    .array(WeightItemSchema)
    .nonempty("Debe haber al menos un peso configurado"), 
});

export type FormData = z.infer<typeof StorageUnitStoreWeightsSchema>;