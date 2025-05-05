import { z } from "zod";

export const configurationByStoreSchema = z.object({
    sd_sku: z.string().min(1, 'El SKU es obligatorio'),
    sd_name: z.string().min(1, 'La descripción es obligatoria'),
    sd_price_by_kg: z.number().gt(0, 'El precio por kg es obligatorio y debe ser mayor a 0'),
})

export type ConfigurationByStoreSchema = z.infer<typeof configurationByStoreSchema>