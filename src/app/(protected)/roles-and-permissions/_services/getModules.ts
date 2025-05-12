import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface Module {
  id: number;
  name: string;
  slug: string;
}

export default async function getModules(): Promise<Module[]> {
  const supabase = createSupabaseBrowserClient();

  const { data: modules, error } = await supabase
    .from("modules")
    .select("*")
    .order("name");

  if (error) {
    throw new Error("No se pudieron obtener los módulos.");
  }

  return modules || [];
} 