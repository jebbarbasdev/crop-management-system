import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { TablesUpdate } from "@/app/_utilities/supabase";

type UpdateUserPayload = TablesUpdate<'users'> & { 
    id: string;
    updated_by: string; 
};

export async function updateUser({ 
    id, 
    full_name, 
    email, 
    role_id,
    updated_by 
}: UpdateUserPayload) {
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
        .from('users')
        .update({
            full_name,
            email,
            role_id,
            updated_at: new Date().toISOString(), 
            updated_by 
            })
        .eq('id', id); 
        console.log(updated_by);
    if (error) throw error;
    return data;
}


