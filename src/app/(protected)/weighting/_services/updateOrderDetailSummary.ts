import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';
import updateOrderStatus from '@/app/(protected)/summarized/_services/updateOrderStatus';

interface UpdateOrderDetailSummaryInput {
    summaryId: number;
    orderId: number;
    measuredGrossWeight: number;
    measuredNetWeight: number;
    billedProductPricePerKg: number;
}

export async function updateOrderDetailSummary({
    summaryId,
    orderId,
    measuredGrossWeight,
    measuredNetWeight,
    billedProductPricePerKg
}: UpdateOrderDetailSummaryInput) {
    const supabase = createSupabaseBrowserClient();

    // Actualizar el estado del pedido a EN_PESAJE (id: 2)
    await updateOrderStatus(orderId, 2);

    const measuredProfit = measuredNetWeight * billedProductPricePerKg;

    const { error } = await supabase
        .from('order_detail_summaries')
        .update({
            measured_gross_weight: measuredGrossWeight,
            measured_net_weight: measuredNetWeight,
            measured_profit: measuredProfit,
        })
        .eq('id', summaryId);

    if (error) {
        console.error('Error updating order detail summary:', error);
        throw new Error('Error al actualizar el resumen del pedido detalle');
    }
} 