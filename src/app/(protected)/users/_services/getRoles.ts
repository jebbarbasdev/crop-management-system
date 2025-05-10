import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export default async function getRoles(): Promise<Role[]> {
  const supabase = createSupabaseBrowserClient();

  const { data: roles, error } = await supabase
    .from("roles")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("No se pudieron obtener los roles.");
  }

  return roles || [];
} 