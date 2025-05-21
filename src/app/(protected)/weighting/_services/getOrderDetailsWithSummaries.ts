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
        weight_by_unit: number;
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

    // First get the order to get the store_id
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
            id,
            branch:branch_id (
                store:store_id (
                    id
                )
            )
        `)
        .eq('id', orderId)
        .single();

    if (orderError) throw orderError;

    const storeId = order.branch?.store?.id;
    if (!storeId) throw new Error('No se encontró la tienda asociada al pedido');

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
                name,
                storage_unit_store_weights!inner (
                    weight_by_unit
                )
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
        .eq('order_id', orderId)
        .eq('storage_unit.storage_unit_store_weights.store_id', storeId);

    if (error) throw error;

    // Split the details into weighted and unweighted
    const weighted: OrderDetailWithSummary[] = [];
    const unweighted: OrderDetailWithSummary[] = [];

    data.forEach((detail: any) => {
        const detailWithSummary: OrderDetailWithSummary = {
            ...detail,
            storage_unit: {
                ...detail.storage_unit,
                weight_by_unit: detail.storage_unit.storage_unit_store_weights[0]?.weight_by_unit ?? 0
            },
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