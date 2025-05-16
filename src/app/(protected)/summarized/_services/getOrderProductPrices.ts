import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getOrderProductPrices(orderId: number, storeName: string) {
    const supabase = await createSupabaseBrowserClient();
    const { data, error } = await (supabase as any)
        .rpc("get_order_details", {
            order_id_input: orderId,
            store_name_input: storeName
        });

    if (error) {
        throw error;
    }
    return data;
}