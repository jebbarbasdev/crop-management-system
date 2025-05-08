import { z } from "zod";

export const configurationByStoreSchema = z.object({
    weight_by_unit: z.coerce.number().gt(0, 'El peso por unidad es obligatorio y debe ser mayor a 0'),
})

export type ConfigurationByStoreSchema = z.infer<typeof configurationByStoreSchema>