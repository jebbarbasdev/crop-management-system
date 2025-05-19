import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getOrderDetails(orderId: number, storeId: number) {
    const supabase = await createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("order_details")
        .select(`
            id,
            product_id,
            quantity,
            storage_unit_id,
            products:product_id (
                name,
                products_stores (
                    store_id,
                    sd_price_by_kg
                )
            ),
            storage_units:storage_unit_id (
                name
            )
        `)
        .eq("order_id", orderId);

    if (error) throw error;
    return data?.map((detail: any) => ({
        ...detail,
        sd_price_by_kg: (detail.products?.products_stores || []).find((ps: any) => ps.store_id === storeId)?.sd_price_by_kg ?? "-"
    }));
} 