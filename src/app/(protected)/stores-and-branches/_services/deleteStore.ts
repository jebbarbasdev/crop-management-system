import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export type DeleteStorePayload = {
    id: number
}

export async function deleteStore({ id }: DeleteStorePayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .rpc('soft_delete', { table_name: 'stores', row_id: id })

    if (error) throw error
}