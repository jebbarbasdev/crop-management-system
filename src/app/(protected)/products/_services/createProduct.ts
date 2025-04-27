import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export async function createProduct(name: string) {
    const supabase = await createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from("products")
        .insert([{ 
            name
        }])
        .select()

    if (error) throw error
    return data
}