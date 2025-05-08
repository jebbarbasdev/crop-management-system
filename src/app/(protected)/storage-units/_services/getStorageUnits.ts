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
}

export default async function getStorageUnits(): Promise<StorageUnit[]> {
    const supabase = createSupabaseBrowserClient();
    
    const { data, error } = await supabase
        .from("storage_units")
        .select("*")
        .is("deleted_at", null); 
    
    if (error) {
        console.error("Error al obtener las unidades de empaque:", error.message);
        throw new Error("No se pudieron obtener las unidades de empaque.");
    }
    
    return data || [];
}