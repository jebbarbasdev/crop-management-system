import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesInsert } from "@/app/_utilities/supabase";

type CreateStorePayload = TablesInsert<'stores'>

export async function createStore(payload: CreateStorePayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .from("stores")
        .insert([payload])
        .select()

    if (error) throw error
}