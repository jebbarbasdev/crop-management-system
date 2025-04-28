import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type ConfigurationByStorage = FromSubapaseService<typeof getConfigurationByStorage>

export default async function getConfigurationByStorage(productId: number) {
    const supabase = await createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from("storage_units")
        .select(`
            id,
            name,

            products_storage_units (
                weight_by_unit,

                created_at,
                created_by:users!created_by (
                    employee_number,
                    full_name
                ),

                updated_at,
                updated_by:users!updated_by ( 
                    employee_number,
                    full_name
                )
            )
        `)
        .eq('products_storage_units.product_id', productId)

    if (error) throw error

    const normalData = data.map(store => ({
        id: store.id,
        name: store.name,
        product_metadata: store.products_storage_units.length > 0 ? store.products_storage_units[0] : null,
    }))

    return normalData
}