import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type StoreStorageUnit = {
    id: number;
    name: string;
    created_at: string;
    created_by: {
        employee_number: number;
        full_name: string | null;
    };
    updated_at: string;
    updated_by: {
        employee_number: number;
        full_name: string | null;
    };
    deleted_at: string | null;
    deleted_by: string | null;
    // Configuración de todas las tiendas
    storage_unit_store_weights: {
        id: number;
        storage_unit_id: number;
        store_id: number;
        weight_by_unit: number;
        created_at: string | null;
        created_by: string;
        updated_at: string | null;
        updated_by: string;
        store: {
            id: number;
            name: string;
        };
    }[];
    // Configuración de todos los productos
    products_storage_units: {
        created_at: string;
        created_by: string;
        product_id: number;
        storage_unit_id: number;
        weight_by_unit: number;
        updated_at: string;
        updated_by: string;
        product: {
            id: number;
            name: string;
        };
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
            created_by:users!created_by (
                employee_number,
                full_name
            ),
            updated_by:users!updated_by (
                employee_number,
                full_name
            ),
            storage_unit_store_weights (
                id,
                storage_unit_id,
                store_id,
                weight_by_unit,
                created_at,
                created_by,
                updated_at,
                updated_by,
                store:store_id (
                    id,
                    name
                )
            ),
            products_storage_units (
                created_at,
                created_by,
                product_id,
                storage_unit_id,
                weight_by_unit,
                updated_at,
                updated_by,
                product:product_id (
                    id,
                    name
                )
            )
        `)
        .is('deleted_at', null)
        .order('name');

    if (error) {
        console.error('Error fetching store storage units:', error);
        throw error;
    }

    // Asegurarnos de que storage_unit_store_weights y products_storage_units siempre sean arrays
    return (data || []).map(unit => ({
        ...unit,
        storage_unit_store_weights: unit.storage_unit_store_weights || [],
        products_storage_units: unit.products_storage_units || []
    }));
}

export async function getStoreStorageUnitsForSelect(storeId: number): Promise<StoreStorageUnitSelectOption[]> {
    const storageUnits = await getStoreStorageUnits(storeId);
    
    return storageUnits.map(unit => {
        // Asegurarnos de que storage_unit_store_weights sea un array antes de usar find
        const storeConfig = (unit.storage_unit_store_weights || []).find(w => w.store_id === storeId);
        return {
            value: unit.id,
            label: unit.name,
            weight: storeConfig?.weight_by_unit ?? 0
        };
    });
} 