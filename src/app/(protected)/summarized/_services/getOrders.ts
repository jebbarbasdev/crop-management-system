import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { FromSubapaseService } from "@/app/_utilities/FromSupabaseService";

export type Order = FromSubapaseService<typeof getOrders>

export default async function getOrders() {
    const supabase = await createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("orders")
        .select(`
            id,
            branch_id,
            delivery_date,
            status,
            
            branches:branch_id (
                sd_name
            ),
            estates:status (
                Estates
            ),

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
    console.log("Datos de órdenes:", data)
    return data
}