import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type StoreStorageUnit = {
    id: number;
    name: string;
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
    deleted_at: string | null;
    deleted_by: string | null;
    storage_unit_store_weights: {
        id: number;
        storage_unit_id: number;
        store_id: number;
        weight_by_unit: number;
        created_at: string | null;
        created_by: string;
        updated_at: string | null;
        updated_by: string;
    }[];
};

export type StoreStorageUnitSelectOption = {
    value: number;
    label: string;
    weight: number;
};

export async function getStoreStorageUnits(storeId: number): Promise<StoreStorageUnit[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from('storage_units')
        .select(`
            *,
            storage_unit_store_weights!inner (
                id,
                storage_unit_id,
                store_id,
                weight_by_unit,
                created_at,
                created_by,
                updated_at,
                updated_by
            )
        `)
        .eq('storage_unit_store_weights.store_id', storeId)
        .is('deleted_at', null)
        .order('name');

    if (error) {
        console.error('Error fetching store storage units:', error);
        throw error;
    }

    return data || [];
}

export async function getStoreStorageUnitsForSelect(storeId: number): Promise<StoreStorageUnitSelectOption[]> {
    const storageUnits = await getStoreStorageUnits(storeId);
    
    return storageUnits.map(unit => ({
        value: unit.id,
        label: unit.name,
        weight: unit.storage_unit_store_weights[0]?.weight_by_unit || 0
    }));
} 