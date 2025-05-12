import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface Permission {
  id: number;
  name: string;
  description: string;
  module_id: number;
  module?: {
    id: number;
    name: string;
    slug: string;
  };
}

export default async function getPermissions(): Promise<Permission[]> {
  const supabase = createSupabaseBrowserClient();

  const { data: permissions, error } = await supabase
    .from("permissions")
    .select(`
      *,
      module:modules (
        id,
        name,
        slug
      )
    `)
    .order("name");

  if (error) {
    throw new Error("No se pudieron obtener los permisos.");
  }

  return permissions || [];
} 