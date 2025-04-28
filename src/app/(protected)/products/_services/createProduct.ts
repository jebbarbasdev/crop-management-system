import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesInsert } from "@/app/_utilities/supabase";

type CreateProductPayload = TablesInsert<'products'>

export async function createProduct(payload: CreateProductPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error } = await supabase
        .from("products")
        .insert([payload])
        .select()

    if (error) throw error
}