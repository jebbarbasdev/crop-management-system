import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function completeOrderWeighting(orderId: number) {
    const supabase = createSupabaseBrowserClient();

    // Obtener el ID del estado EN_REVISION
    const { data: statusData, error: statusError } = await supabase
        .from('estates')
        .select('id')
        .eq('Estates', 'EN_REVISION')
        .single();

    if (statusError) {
        console.error('Error fetching EN_REVISION status:', statusError);
        throw new Error('Error al obtener el estado EN_REVISION');
    }

    // Actualizar el estado del pedido
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: statusData.id })
        .eq('id', orderId);

    if (updateError) {
        console.error('Error updating order status:', updateError);
        throw new Error('Error al actualizar el estado del pedido');
    }
} 