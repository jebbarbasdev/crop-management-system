import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { Permission } from "./getPermissions";

export interface RolePermission {
  role_id: number;
  permission_id: number;
  permission?: Permission;
}

export default async function getRolePermissions(roleId: number): Promise<RolePermission[]> {
  const supabase = createSupabaseBrowserClient();

  const { data: rolePermissions, error } = await supabase
    .from("roles_permissions")
    .select(`
      *,
      permission:permissions (
        id,
        name,
        description,
        module_id,
        module:modules (
          id,
          name,
          slug
        )
      )
    `)
    .eq("role_id", roleId);

  if (error) {
    throw new Error("No se pudieron obtener los permisos del rol.");
  }

  return rolePermissions || [];
} 