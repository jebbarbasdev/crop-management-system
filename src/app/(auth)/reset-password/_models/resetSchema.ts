import { z } from "zod";

export const resetSchema = z.object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[a-z]/, 'Debe incluir al menos una minúscula')
        .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
        .regex(/[0-9]/, 'Debe incluir al menos un número')
        .regex(/[^a-zA-Z0-9]/, 'Debe incluir al menos un símbolo'),

    confirmPassword: z.string().min(1, 'La confirmación de contraseña es obligatoria'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // Apunta el error a confirmPassword
})

export type ResetSchema = z.infer<typeof resetSchema>