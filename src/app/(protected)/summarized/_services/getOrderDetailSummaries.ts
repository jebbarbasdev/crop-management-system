import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function getOrderDetailSummaries(orderId: number) {
    const supabase = await createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("order_detail_summaries")
        .select(`
            id,
            order_detail_id,
            billed_product_price_per_kg,
            billed_gross_weight,
            billed_net_weight,
            billed_profit,
            measured_gross_weight,
            measured_net_weight,
            measured_profit,
            store_gross_weight,
            store_net_weight,
            store_profit
        `)
        .in("order_detail_id", (
            await supabase
                .from("order_details")
                .select("id")
                .eq("order_id", orderId)
        ).data?.map((d: any) => d.id) || []);

    if (error) throw error;
    return data;
} 