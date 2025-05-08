import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface UpdateStorageUnitInput {
    id: number;
    name: string;
    updated_by: string; 
}

export default async function updateStorageUnit(input: UpdateStorageUnitInput): Promise<void> {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
        .from("storage_units")
        .update({
            name: input.name,
            updated_by: input.updated_by,
            updated_at: new Date().toISOString(),
        })
        .eq("id", input.id);

    if (error) {
        console.error("Error al actualizar la unidad de empaque:", error.message);
        throw new Error("No se pudo actualizar la unidad de empaque.");
    }
}