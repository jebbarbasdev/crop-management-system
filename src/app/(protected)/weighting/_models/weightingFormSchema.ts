import { z } from "zod";
import { zodPositiveNumber } from "@/app/_models/zodPositiveNumber";

export const weightingFormSchema = z.object({
    packagingUnits: z.number().int("La cantidad de unidades debe ser un número entero").positive("La cantidad de unidades debe ser mayor a 0"),
    kgPerUnit: zodPositiveNumber("El peso por unidad debe ser mayor a 0"),
    totalPackagingKg: zodPositiveNumber("El peso total de empaque debe ser mayor a 0"),
    grossWeight: zodPositiveNumber("El peso bruto debe ser mayor a 0"),
    netWeight: zodPositiveNumber("El peso neto debe ser mayor a 0"),
    netWeightPerUnit: zodPositiveNumber("El peso neto por unidad debe ser mayor a 0")
});

export type WeightingFormData = z.infer<typeof weightingFormSchema>; 