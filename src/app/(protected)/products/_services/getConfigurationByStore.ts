import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type ConfigurationByStore = FromSubapaseService<typeof getConfigurationByStore>

export default async function getConfigurationByStore(productId: number) {
    const supabase = await createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from("stores")
        .select(`
            id,
            name,

            products_stores (
                sd_sku,
                sd_name,
                sd_price_by_kg,

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
        .eq('products_stores.product_id', productId)

    if (error) throw error

    const normalData = data.map(store => ({
        id: store.id,
        name: store.name,
        product_metadata: store.products_stores.length > 0 ? store.products_stores[0] : null,
    }))

    return normalData
}