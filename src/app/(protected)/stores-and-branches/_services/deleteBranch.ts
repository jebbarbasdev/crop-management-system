import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export type DeleteBranchPayload = {
    id: number
}

export async function deleteBranch({ id }: DeleteBranchPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .rpc('soft_delete', { table_name: 'branches', row_id: id })

    if (error) throw error
}