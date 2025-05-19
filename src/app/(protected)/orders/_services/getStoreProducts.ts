import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type StoreProduct = {
    id: number;
    name: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string | null;
    deleted_by: string | null;
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
    }[];
    available_storage_units: {
        id: number;
        name: string;
        weight_by_unit: number;
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
            products_stores!inner (
                created_at,
                created_by,
                product_id,
                sd_name,
                sd_price_by_kg,
                sd_sku,
                store_id,
                updated_at,
                updated_by
            ),
            available_storage_units:products_storage_units!inner (
                storage_units!inner (
                    id,
                    name,
                    storage_unit_store_weights!inner (
                        weight_by_unit
                    )
                )
            )
        `)
        .eq('products_stores.store_id', storeId)
        .eq('available_storage_units.storage_units.storage_unit_store_weights.store_id', storeId)
        .is('deleted_at', null)
        .order('name');

    if (error) {
        console.error('Error fetching store products:', error);
        throw error;
    }

    // Transformar los datos para tener una estructura más limpia
    return data.map(product => ({
        ...product,
        available_storage_units: product.available_storage_units.map(su => ({
            id: su.storage_units.id,
            name: su.storage_units.name,
            weight_by_unit: su.storage_units.storage_unit_store_weights[0]?.weight_by_unit || 0
        }))
    })) || [];
}

export async function getStoreProductsForSelect(storeId: number): Promise<StoreProductSelectOption[]> {
    const products = await getStoreProducts(storeId);
    return products.map(product => ({
        value: product.id,
        label: product.name,
        price: product.products_stores[0].sd_price_by_kg,
        sku: product.products_stores[0].sd_sku
    }));
} 