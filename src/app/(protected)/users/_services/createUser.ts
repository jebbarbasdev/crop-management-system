import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { create } from "domain";

export async function createUser(payload: {
  full_name: string;
  email: string;
  role_id: number;
  employee_number: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}) {
  const supabase = await createSupabaseBrowserClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: payload.email,
    password: 'TempPass123!', 
    options: {
      data: {
        full_name: payload.full_name, 
        role_id: payload.role_id
      }
    }
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error("Error en registro de autenticación");

}
