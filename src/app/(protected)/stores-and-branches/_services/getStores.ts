import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type Store = FromSubapaseService<typeof getStores>

export default async function getStores() {
    const supabase = await createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("stores")
        .select(`
            id,
            name,
            legal_name,
            rfc,
            address,

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
        .is('deleted_at', null)

    if (error) throw error
    return data
}