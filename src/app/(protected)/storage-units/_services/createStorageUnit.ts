import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface CreateStorageUnitInput {
    name: string;
    created_by: string; 
}

export default async function createStorageUnit(input: CreateStorageUnitInput): Promise<void> {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from("storage_units")
        .insert({
            name: input.name,
            created_by: input.created_by, 
        });

    if (error) {
        console.error("Error al crear la unidad de empaque:", error);
        throw new Error("No se pudo crear la unidad de empaque.");
    }

    console.log("Unidad de empaque creada:", data);
}