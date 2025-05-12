import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

interface UpdateRolePermissionsPayload {
  roleId: number;
  permissionIds: number[];
}

export async function updateRolePermissions({ roleId, permissionIds }: UpdateRolePermissionsPayload) {
  const supabase = createSupabaseBrowserClient();

  const { error: deleteError } = await supabase
    .from("roles_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) {
    throw new Error("No se pudieron eliminar los permisos existentes.");
  }

  if (permissionIds.length === 0) {
    return;
  }

  const rolePermissions = permissionIds.map(permissionId => ({
    role_id: roleId,
    permission_id: permissionId
  }));

  const { error: insertError } = await supabase
    .from("roles_permissions")
    .insert(rolePermissions);

  if (insertError) {
    throw new Error("No se pudieron insertar los nuevos permisos.");
  }
} 