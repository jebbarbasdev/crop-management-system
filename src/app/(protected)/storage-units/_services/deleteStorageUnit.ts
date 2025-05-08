import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface DeleteStorageUnitInput {
    id: number; 
    deleted_by: string; 
}

export default async function deleteStorageUnit(input: DeleteStorageUnitInput): Promise<void> {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase
        .from("storage_units")
        .update({
            deleted_at: new Date().toISOString(),
            deleted_by: input.deleted_by,
        })
        .eq("id", input.id);

    if (error) {
        console.error("Error al eliminar la unidad de empaque:", error.message);
        throw new Error("No se pudo eliminar la unidad de empaque.");
    }
}