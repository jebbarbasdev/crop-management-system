import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export async function deleteRole(id: number) {
  const supabase = createSupabaseBrowserClient();

  const { error: permissionsError } = await supabase
    .from("roles_permissions")
    .delete()
    .eq("role_id", id);

  if (permissionsError) {
    throw new Error("No se pudieron eliminar los permisos del rol.");
  }

  const { error: roleError } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);

  if (roleError) {
    throw new Error("No se pudo eliminar el rol.");
  }
} 