import { z } from "zod";

export const configurationByStorageSchema = z.object({
    product_id: z.number(),
    storage_unit_id: z.number(),
    weight_by_unit: z.coerce.number().gt(0, 'El peso por unidad es obligatorio y debe ser mayor a 0'),
})

export const configurationsByStorageSchema = z.object({
    configurations: z.array(configurationByStorageSchema)
})

export type ConfigurationByStorageSchema = z.infer<typeof configurationByStorageSchema>
export type ConfigurationsByStorageSchema = z.infer<typeof configurationsByStorageSchema>