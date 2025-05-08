import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getStorageUnitStoreWeights() {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("storage_unit_store_weights")
      .select(`
        id,
        storage_unit_id,
        store_id,
        weight_by_unit,
        created_at,
        created_by,
        updated_at,
        updated_by,
        stores (
          name
        ),
        created_by_user:users!storage_unit_store_weights_created_by_fkey ( full_name ),
        updated_by_user:users!storage_unit_store_weights_updated_by_fkey ( full_name )
      `);

    if (error) throw error;

    return data?.map(item => ({
      ...item,
      store_name: item.stores?.name,
      created_by_name: item.created_by_user?.full_name || "-",
      updated_by_name: item.updated_by_user?.full_name || "-"
    })) || [];
    
  } catch (error) {
    console.error("Error fetching weights:", error);
    return [];
  }
}
