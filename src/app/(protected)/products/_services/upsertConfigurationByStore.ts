import { getUserWithCustomClaims } from "@/app/_services/getUserWithCustomClaims"
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient"
import { TablesInsert } from "@/app/_utilities/supabase"

export type UpsertConfigurationByStorePayload = TablesInsert<'products_stores'> & {
    product_id: number
    store_id: number
}

export async function upsertConfigurationByStore(payload: UpsertConfigurationByStorePayload[]) {
    const supabase = await createSupabaseBrowserClient()
    const user = await getUserWithCustomClaims(supabase)
    
    const now = new Date().toISOString()

    const records = payload.map(record => ({
        ...record,
        
        updated_at: now,
        updated_by: user?.id
    }))

    const { error } = await supabase
        .from('products_stores')
        .upsert(records, {
            onConflict: 'product_id,store_id'
        })
        .select()

    if (error) throw error
}