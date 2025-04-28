import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export type DeleteProductPayload = {
    id: number
}

export async function deleteProduct({ id }: DeleteProductPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .rpc('soft_delete', { table_name: 'products', row_id: id })

    if (error) throw error
}