import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export async function initializePermissions() {
  const supabase = createSupabaseBrowserClient();

  let moduleData;
  const { data: moduleDataResult, error: moduleError } = await supabase
    .from("modules")
    .select("id")
    .eq("slug", "roles-and-permissions")
    .single();

  moduleData = moduleDataResult;

  if (moduleError && moduleError.code !== "PGRST116") {
    throw new Error("No se pudo verificar el módulo de roles y permisos.");
  }

  if (!moduleData) {
    const { data: newModule, error: createModuleError } = await supabase
      .from("modules")
      .insert([
        {
          name: "Roles y Permisos",
          slug: "roles-and-permissions",
        },
      ])
      .select()
      .single();

    if (createModuleError) {
      throw new Error("No se pudo crear el módulo de roles y permisos.");
    }

    moduleData = newModule;
  }

  const permissions = [
    {
      name: "create",
      description: "Crear roles",
      module_id: moduleData.id,
    },
    {
      name: "read",
      description: "Ver roles y permisos",
      module_id: moduleData.id,
    },
    {
      name: "update",
      description: "Actualizar roles",
      module_id: moduleData.id,
    },
    {
      name: "delete",
      description: "Eliminar roles",
      module_id: moduleData.id,
    },
  ];

  const permissionIds: number[] = [];
  for (const permission of permissions) {
    try {
      const { data: existingPermission, error: checkError } = await supabase
        .from("permissions")
        .select("id")
        .eq("name", permission.name)
        .eq("module_id", permission.module_id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error("No se pudo verificar si el permiso existe.");
      }

      if (existingPermission) {
        permissionIds.push(existingPermission.id);
        continue;
      }

      const { data: newPermission, error: insertError } = await supabase
        .from("permissions")
        .insert(permission)
        .select()
        .single();

      if (insertError) {
        throw new Error("No se pudieron crear los permisos necesarios.");
      }

      permissionIds.push(newPermission.id);
    } catch (error) {
      continue;
    }
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("No hay usuario autenticado.");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (userError) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  for (const permissionId of permissionIds) {
    try {
      const { error: assignError } = await supabase
        .from("roles_permissions")
        .upsert({
          role_id: userData.role_id,
          permission_id: permissionId
        }, {
          onConflict: "role_id,permission_id"
        });

      if (assignError) {
        continue;
      }
    } catch (error) {
      continue;
    }
  }
} 