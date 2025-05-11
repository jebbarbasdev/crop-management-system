import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type Branch = FromSubapaseService<typeof getBranches>

export default async function getBranches(storeId: number) {
    const supabase = await createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("branches")
        .select(`
            id,
            sd_name,
            sd_number,
            store_id,

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
        `)
        .eq('store_id', storeId)
        .is('deleted_at', null)

    if (error) throw error
    return data
}