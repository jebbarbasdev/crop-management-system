import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type Product = FromSubapaseService<typeof getProducts>

export default async function getProducts() {
    const supabase = await createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,

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