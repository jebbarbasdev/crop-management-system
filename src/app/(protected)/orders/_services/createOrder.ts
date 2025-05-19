import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';
import { getStoreProducts } from './getStoreProducts';
import { getStoreStorageUnits } from './getStoreStorageUnits';

export type OrderDetailInput = {
    branchId: number;
    productId: number;
    quantity: number;
    unitId: number;
};

export type CreateOrderInput = {
    orderDate: string;
    storeId: number;
    orderDetails: OrderDetailInput[];
};

export async function createOrder(input: CreateOrderInput) {
    const supabase = createSupabaseBrowserClient();

    // Get the CREATED status from estates table
    const { data: statusData, error: statusError } = await supabase
        .from('estates')
        .select('id')
        .eq('Estates', 'CREADO')
        .single();

    if (statusError) {
        console.error('Error fetching CREATED status:', statusError);
        throw statusError;
    }

    // Get products and storage units information
    const [products, storageUnits] = await Promise.all([
        getStoreProducts(input.storeId),
        getStoreStorageUnits(input.storeId)
    ]);

    // Group order details by branch
    const ordersByBranch = input.orderDetails.reduce((acc, detail) => {
        if (!acc[detail.branchId]) {
            acc[detail.branchId] = [];
        }
        acc[detail.branchId].push(detail);
        return acc;
    }, {} as Record<number, OrderDetailInput[]>);

    // Create orders for each branch
    const orderPromises = Object.entries(ordersByBranch).map(async ([branchId, details]) => {
        // Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                branch_id: parseInt(branchId),
                delivery_date: input.orderDate,
                status: statusData.id
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            throw orderError;
        }

        // Create order details and summaries
        const detailPromises = details.map(async (detail) => {
            const product = products.find(p => p.id === detail.productId);
            const storageUnit = storageUnits.find(u => u.id === detail.unitId);
            
            if (!product || !storageUnit) {
                throw new Error(`Product or storage unit not found for detail: ${JSON.stringify(detail)}`);
            }

            // Encontrar la configuración de la tienda para este producto
            const productStore = (product.products_stores || []).find(ps => ps.store_id === input.storeId);
            // Encontrar la configuración de la unidad de almacenamiento para este producto
            const productStorageUnit = (product.products_storage_units || []).find(psu => psu.storage_unit_id === detail.unitId);
            // Encontrar el peso de la unidad de almacenamiento para esta tienda
            const storeStorageUnitWeight = (storageUnit.storage_unit_store_weights || []).find(w => w.store_id === input.storeId);

            if (!productStore || !productStorageUnit || !storeStorageUnitWeight) {
                throw new Error(`Product store or storage unit weight not found for detail: ${JSON.stringify(detail)}`);
            }

            const billed_product_price_per_kg = productStore.sd_price_by_kg;
            const gross_weight_by_unit = productStorageUnit.weight_by_unit;
            const packaging_weight_by_unit = storeStorageUnitWeight.weight_by_unit;

            console.log('Weight calculation values:', {
                gross_weight_by_unit,
                packaging_weight_by_unit,
                quantity: detail.quantity,
                product: product.name,
                storageUnit: storageUnit.name
            });

            const billed_gross_weight = gross_weight_by_unit * detail.quantity;
            const billed_net_weight = (gross_weight_by_unit - packaging_weight_by_unit) * detail.quantity;
            const billed_profit = billed_net_weight * billed_product_price_per_kg;

            console.log('Calculated weights:', {
                billed_gross_weight,
                billed_net_weight,
                billed_profit
            });

            // Create order detail
            const { data: orderDetail, error: detailError } = await supabase
                .from('order_details')
                .insert({
                    order_id: order.id,
                    product_id: detail.productId,
                    storage_unit_id: detail.unitId,
                    quantity: detail.quantity,
                })
                .select()
                .single();

            if (detailError) {
                console.error('Error creating order detail:', detailError);
                throw detailError;
            }

            // Create order detail summary
            const { error: summaryError } = await supabase
                .from('order_detail_summaries')
                .insert({
                    order_detail_id: orderDetail.id,

                    billed_product_price_per_kg,
                    
                    billed_gross_weight,
                    billed_net_weight,
                    billed_profit,

                    measured_gross_weight: 0,
                    measured_net_weight: 0,
                    measured_profit: 0,

                    store_gross_weight: 0,
                    store_net_weight: 0,
                    store_profit: 0
                });

            if (summaryError) {
                console.error('Error creating order detail summary:', summaryError);
                throw summaryError;
            }

            return orderDetail;
        });

        await Promise.all(detailPromises);
        return order;
    });

    const orders = await Promise.all(orderPromises);
    return orders;
} 