import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
    password: z.string().min(1, { message: 'Ingrese una contraseña válida' })
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>