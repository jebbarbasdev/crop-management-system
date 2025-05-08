import { getUserWithCustomClaims } from "@/app/_services/getUserWithCustomClaims"
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient"
import { TablesInsert } from "@/app/_utilities/supabase"

export type UpsertConfigurationByStoragePayload = TablesInsert<'products_storage_units'> & {
    product_id: number
    storage_unit_id: number
}

export async function upsertConfigurationByStorage(payload: UpsertConfigurationByStoragePayload[]) {
    const supabase = await createSupabaseBrowserClient()
    const user = await getUserWithCustomClaims(supabase)
    
    const now = new Date().toISOString()

    const records = payload.map(record => ({
        ...record,
        
        updated_at: now,
        updated_by: user?.id
    }))

    const { error } = await supabase
        .from('products_storage_units')
        .upsert(records, {
            onConflict: 'product_id,storage_unit_id'
        })
        .select()

    if (error) throw error
}