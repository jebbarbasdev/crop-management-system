import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo inválido"),
  role_id: z.number({ required_error: "El rol es requerido" }),
});

export type UserSchema = z.infer<typeof userSchema>;
