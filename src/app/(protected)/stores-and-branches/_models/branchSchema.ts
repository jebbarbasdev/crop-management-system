import { z } from "zod";
import { zodPositiveInteger } from "@/app/_models/zodPositiveInteger";
export const branchSchema = z.object({
    store_id: z.number(),
    sd_name: z.string().min(1, 'El nombre de la sucursal es obligatorio'),
    sd_number: zodPositiveInteger('El número de sucursal debe ser un número entero positivo'),
})

export type BranchSchema = z.infer<typeof branchSchema>