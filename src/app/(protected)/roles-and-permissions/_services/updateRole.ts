import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface UpdateRolePayload {
  id: number;
  name: string;
  description: string;
}

export async function updateRole({ id, name, description }: UpdateRolePayload) {
  const supabase = createSupabaseBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No hay usuario autenticado.");

  const { data, error } = await supabase
    .from("roles")
    .update({
      name,
      description,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("No se pudo actualizar el rol.");
  }

  return data;
} 