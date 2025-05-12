import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { initializePermissions } from "./initializePermissions";

interface CreateRolePayload {
  name: string;
  description: string;
}

export async function createRole({ name, description }: CreateRolePayload) {
  const supabase = createSupabaseBrowserClient();

  await initializePermissions();

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
    throw new Error("No se pudo verificar los permisos del usuario.");
  }

  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("id")
    .eq("slug", "roles-and-permissions")
    .single();

  if (moduleError || !module) {
    throw new Error("No se pudo verificar el módulo de roles y permisos.");
  }

  const { data: permission, error: permissionError } = await supabase
    .from("permissions")
    .select("id")
    .eq("name", "create")
    .eq("module_id", module.id)
    .single();

  if (permissionError || !permission) {
    throw new Error("No se pudo verificar el permiso de crear roles.");
  }

  const { data: hasPermission, error: checkError } = await supabase
    .from("roles_permissions")
    .select("permission_id")
    .eq("role_id", userData.role_id)
    .eq("permission_id", permission.id)
    .single();

  if (checkError || !hasPermission) {
    throw new Error("No tienes permiso para crear roles.");
  }

  const { data: existingRole, error: existingRoleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", name)
    .single();

  if (existingRoleError && existingRoleError.code !== "PGRST116") {
    throw new Error("No se pudo verificar si el rol ya existe.");
  }

  if (existingRole) {
    throw new Error("Ya existe un rol con este nombre. Por favor, elige otro nombre.");
  }

  const { data, error } = await supabase
    .from("roles")
    .insert([{
      name,
      description,
      created_by: user.id,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    throw new Error("No se pudo crear el rol.");
  }

  return data;
}