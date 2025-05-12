import { z } from "zod";
import { zodPositiveNumber } from "@/app/_models/zodPositiveNumber";

export const configurationByStoreSchema = z.object({
    product_id: z.number(),
    store_id: z.number(),
    sd_sku: z.string().min(1, 'El SKU es obligatorio'),
    sd_name: z.string().min(1, 'La descripción es obligatoria'),
    sd_price_by_kg: zodPositiveNumber('El precio por kg es obligatorio y debe ser mayor a 0'),
})

export const configurationsByStoreSchema = z.object({
    configurations: z.array(configurationByStoreSchema).min(1, 'Al menos un producto es obligatorio')
})

export type ConfigurationByStoreSchema = z.infer<typeof configurationByStoreSchema>
export type ConfigurationsByStoreSchema = z.infer<typeof configurationsByStoreSchema>