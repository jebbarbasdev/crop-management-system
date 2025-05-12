import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesUpdate } from "@/app/_utilities/supabase";

export type UpdateStorePayload = TablesUpdate<'stores'> & { id: number }

export async function updateStore({ id, ...payload }: UpdateStorePayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error: updateError } = await supabase
        .from("stores")
        .update(payload)
        .eq('id', id)
        .select()

    const { error: triggerError } = await supabase
        .rpc('set_updated_fields', { table_name: 'stores', row_id: id })

    if (updateError) throw updateError
    if (triggerError) throw triggerError
}