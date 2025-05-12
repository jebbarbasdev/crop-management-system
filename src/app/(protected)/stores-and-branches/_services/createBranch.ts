import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesInsert } from "@/app/_utilities/supabase";

type CreateBranchPayload = TablesInsert<'branches'>

export async function createBranch(payload: CreateBranchPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .from("branches")
        .insert([payload])
        .select()

    if (error) throw error
}