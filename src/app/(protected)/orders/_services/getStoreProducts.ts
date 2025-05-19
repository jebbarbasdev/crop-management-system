import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type StoreProduct = {
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
    products_stores: {
        created_at: string;
        created_by: string;
        product_id: number;
        sd_name: string;
        sd_price_by_kg: number;
        sd_sku: string;
        store_id: number;
        updated_at: string;
        updated_by: string;
        store: {
            id: number;
            name: string;
        };
    }[];
    // Configuración de todas las unidades de almacenamiento
    products_storage_units: {
        created_at: string;
        created_by: string;
        product_id: number;
        storage_unit_id: number;
        weight_by_unit: number;
        updated_at: string;
        updated_by: string;
        storage_unit: {
            id: number;
            name: string;
            storage_unit_store_weights: {
                id: number;
                storage_unit_id: number;
                store_id: number;
                weight_by_unit: number;
                store: {
                    id: number;
                    name: string;
                };
            }[];
        };
    }[];
};

export type StoreProductSelectOption = {
    value: number;
    label: string;
    price: number;
    sku: string;
};

export async function getStoreProducts(storeId: number): Promise<StoreProduct[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from('products')
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
            products_stores (
                created_at,
                created_by,
                product_id,
                sd_name,
                sd_price_by_kg,
                sd_sku,
                store_id,
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
                storage_unit:storage_unit_id (
                    id,
                    name,
                    storage_unit_store_weights (
                        id,
                        storage_unit_id,
                        store_id,
                        weight_by_unit,
                        store:store_id (
                            id,
                            name
                        )
                    )
                )
            )
        `)
        .is('deleted_at', null)
        .order('name');

    if (error) {
        console.error('Error fetching store products:', error);
        throw error;
    }

    // Asegurarnos de que products_stores y products_storage_units siempre sean arrays
    return (data || []).map(product => ({
        ...product,
        products_stores: product.products_stores || [],
        products_storage_units: product.products_storage_units || []
    }));
}

export async function getStoreProductsForSelect(storeId: number): Promise<StoreProductSelectOption[]> {
    const products = await getStoreProducts(storeId);
    return products.map(product => {
        // Asegurarnos de que products_stores sea un array antes de usar find
        const storeConfig = (product.products_stores || []).find(ps => ps.store_id === storeId);
        return {
            value: product.id,
            label: product.name,
            price: storeConfig?.sd_price_by_kg ?? 0,
            sku: storeConfig?.sd_sku ?? ''
        };
    });
} 