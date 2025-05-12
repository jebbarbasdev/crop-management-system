import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getAllStores() {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("stores") 
      .select(`
        id,
        name
      `);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching stores:", error);
    return [];
  }
}