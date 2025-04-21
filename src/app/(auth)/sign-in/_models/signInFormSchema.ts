import { z } from "zod";

export const signInFormSchema = z.object({
    email: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
    password: z.string().min(1, { message: 'Ingrese una contraseña válida' })
})

export type SignInFormSchema = z.infer<typeof signInFormSchema>