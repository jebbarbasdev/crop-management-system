import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getOrderProductPrices(orderId: number, storeName: string) {
    console.log("Llamando get_order_details con:", { orderId, storeName }); // <-- Añadido para depuración
    const supabase = await createSupabaseBrowserClient();
    const { data, error } = await (supabase as any)
        .rpc("get_order_details", {
            order_id_input: orderId,
            store_name_input: storeName
        });

    if (error) {
        console.error("Error en get_order_details:", error); // <-- Añadido para depuración
        throw error;
    }
    return data;
}