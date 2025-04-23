import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>