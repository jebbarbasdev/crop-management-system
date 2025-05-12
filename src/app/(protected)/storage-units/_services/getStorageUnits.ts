import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface StorageUnit {
    id: number;
    name: string;
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
    deleted_at: string | null;
    deleted_by: string | null;
    created_by_user?: { employee_number: number; full_name: string | null };
    updated_by_user?: { employee_number: number; full_name: string | null };
}

export default async function getStorageUnits(): Promise<StorageUnit[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("storage_units")
        .select(`*,
            created_by_user:users!storage_units_created_by_fkey(employee_number,full_name),
            updated_by_user:users!storage_units_updated_by_fkey(employee_number,full_name)
        `)
        .is("deleted_at", null); 
    
    if (error) {
        console.error("Error al obtener las unidades de empaque:", error.message);
        throw new Error("No se pudieron obtener las unidades de empaque.");
    }
    
    return data || [];
}