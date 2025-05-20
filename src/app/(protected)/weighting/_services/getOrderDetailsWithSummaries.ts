import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type OrderDetailWithSummary = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    storage_unit_id: number;
    product: {
        id: number;
        name: string;
    };
    storage_unit: {
        id: number;
        name: string;
    };
    summary: {
        id: number;
        order_detail_id: number;
        billed_product_price_per_kg: number;
        billed_gross_weight: number;
        billed_net_weight: number;
        billed_profit: number;
        measured_gross_weight: number;
        measured_net_weight: number;
        measured_profit: number;
        store_gross_weight: number;
        store_net_weight: number;
        store_profit: number;
    };
};

export type OrderDetailsWithSummaries = {
    weighted: OrderDetailWithSummary[];
    unweighted: OrderDetailWithSummary[];
};

export async function getOrderDetailsWithSummaries(orderId: number): Promise<OrderDetailsWithSummaries> {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from('order_details')
        .select(`
            id,
            order_id,
            product_id,
            quantity,
            storage_unit_id,
            product:product_id (
                id,
                name
            ),
            storage_unit:storage_unit_id (
                id,
                name
            ),
            summary:order_detail_summaries!order_detail_summaries_order_detail_id_fkey (
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
            )
        `)
        .eq('order_id', orderId);

    if (error) throw error;

    // Split the details into weighted and unweighted
    const weighted: OrderDetailWithSummary[] = [];
    const unweighted: OrderDetailWithSummary[] = [];

    data.forEach((detail: any) => {
        const detailWithSummary: OrderDetailWithSummary = {
            ...detail,
            summary: detail.summary[0] // Since it's a 1-1 relationship, we take the first (and only) summary
        };

        // Check if any of the measured weights are greater than 0
        const hasBeenWeighted = detail.summary[0]?.measured_gross_weight > 0 || 
                              detail.summary[0]?.measured_net_weight > 0 || 
                              detail.summary[0]?.measured_profit > 0;

        if (hasBeenWeighted) {
            weighted.push(detailWithSummary);
        } else {
            unweighted.push(detailWithSummary);
        }
    });

    return {
        weighted,
        unweighted
    };
} 