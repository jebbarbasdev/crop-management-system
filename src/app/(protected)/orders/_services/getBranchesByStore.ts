import { createSupabaseBrowserClient } from '@/app/_utilities/createSupabaseBrowserClient';

export type Branch = {
    id: number;
    store_id: number;
    sd_name: string;
    sd_number: number;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string | null;
    deleted_by: string | null;
};

export type BranchSelectOption = {
    value: number;
    label: string;
};

export type BranchWithOrders = Branch & {
    orders: Order[];
};

export type Order = {
    id: number;
    branch_id: number;
    delivery_date: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: string | null;
    deleted_by: string | null;
    status: number | null;
};

export async function getBranchesByStore(storeId: number): Promise<Branch[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('store_id', storeId)
        .order('sd_name');

    if (error) {
        console.error('Error fetching branches:', error);
        throw error;
    }

    return data || [];
}

export async function getBranchesForSelect(storeId: number): Promise<BranchSelectOption[]> {
    const branches = await getBranchesByStore(storeId);
    return branches.map(branch => ({
        value: branch.id,
        label: branch.sd_name
    }));
}

export async function getBranchesWithOrders(storeId: number): Promise<BranchWithOrders[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from('branches')
        .select(`
            *,
            orders (*)
        `)
        .eq('store_id', storeId)
        .order('sd_name');

    if (error) {
        console.error('Error fetching branches with orders:', error);
        throw error;
    }

    return data || [];
} 