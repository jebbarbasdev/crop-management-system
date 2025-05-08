import { z } from "zod";

export const StorageUnitSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "El nombre no puede estar vacío." }),
});