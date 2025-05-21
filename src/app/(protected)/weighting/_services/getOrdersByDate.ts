import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type Order = {
    id: number;
    branch_id: number;
    delivery_date: string;
    status: number | null;
    branch?: {
        id: number;
        sd_name: string;
        store?: {
            id: number;
            name: string;
        }
    };
    // ...otros campos relevantes
};

export async function getOrdersByDate(date: string): Promise<Order[]> {
    const supabase = createSupabaseBrowserClient();

    // Obtener los IDs de los estados 'CREADO' y 'EN_PESAJE'
    const { data: estates, error: estatesError } = await supabase
        .from('estates')
        .select('id, Estates')
        .in('Estates', ['CREADO', 'EN_PESAJE']);

    if (estatesError) throw estatesError;
    const statusIds = (estates ?? []).map(e => e.id);

    // Consultar los pedidos con esos estados, la fecha indicada y que no estén borrados
    const { data, error } = await supabase
        .from('orders')
        .select(`*, branch:branch_id (id, sd_name, store:store_id (id, name))`)
        .eq('delivery_date', date)
        .in('status', statusIds)
        .is('deleted_at', null);

    if (error) throw error;
    return data as Order[];
} 