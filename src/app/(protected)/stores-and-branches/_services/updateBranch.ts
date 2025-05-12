import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesUpdate } from "@/app/_utilities/supabase";

export type UpdateBranchPayload = TablesUpdate<'branches'> & { id: number }

export async function updateBranch({ id, ...payload }: UpdateBranchPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error: updateError } = await supabase
        .from("branches")
        .update(payload)
        .eq('id', id)
        .select()

    const { error: triggerError } = await supabase
        .rpc('set_updated_fields', { table_name: 'branches', row_id: id })

    if (updateError) throw updateError
    if (triggerError) throw triggerError
}