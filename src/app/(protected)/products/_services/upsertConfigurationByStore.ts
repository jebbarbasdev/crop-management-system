import { getUserWithCustomClaims } from "@/app/_services/getUserWithCustomClaims"
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient"
import { TablesInsert } from "@/app/_utilities/supabase"

export type UpsertConfigurationByStorePayload = TablesInsert<'products_stores'> & {
    product_id: number
    store_id: number
}

export async function upsertConfigurationByStore(payload: UpsertConfigurationByStorePayload) {
    const supabase = await createSupabaseBrowserClient()
    const user = await getUserWithCustomClaims(supabase)
    
    // First check if record exists
    const { data: existing } = await supabase
        .from('products_stores')
        .select('*')
        .eq('product_id', payload.product_id)
        .eq('store_id', payload.store_id)
        .single()

    const now = new Date().toISOString()

    const { error } = await supabase
        .from('products_stores')
        .upsert({
            product_id: payload.product_id,
            store_id: payload.store_id,
            sd_sku: payload.sd_sku,
            sd_name: payload.sd_name,
            sd_price_by_kg: payload.sd_price_by_kg,
            // Only set created fields if record doesn't exist
            ...(!existing && {
                created_at: now,
                created_by: user?.id
            }),
            // Always update these fields
            updated_at: now,
            updated_by: user?.id
        })
        .select()

    if (error) throw error
}