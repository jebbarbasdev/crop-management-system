import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesUpdate } from "@/app/_utilities/supabase";

export type UpdateProductPayload = TablesUpdate<'products'> & { id: number }

export async function updateProduct({ id, name }: UpdateProductPayload) {
    const supabase = await createSupabaseBrowserClient();

    const { error: updateError } = await supabase
        .from("products")
        .update({ 
            name
        })
        .eq('id', id)
        .select()

    const { error: triggerError } = await supabase
        .rpc('set_updated_fields', { table_name: 'products', row_id: id })

    if (updateError) throw updateError
    if (triggerError) throw triggerError
}