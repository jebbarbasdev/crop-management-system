import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type Store = {
    id: number;
    name: string;
    legal_name: string;
    address: string;
    rfc: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string | null;
    deleted_by: string | null;
};

export type StoreSelectOption = {
    value: number;
    label: string;
};

export async function getAllStores(): Promise<Store[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching stores:', error);
        throw error;
    }

    return data || [];
}

export async function getStoresForSelect(): Promise<StoreSelectOption[]> {
    const stores = await getAllStores();
    return stores.map(store => ({
        value: store.id,
        label: store.name
    }));
} 