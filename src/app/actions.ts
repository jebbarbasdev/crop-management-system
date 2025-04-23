'use server'

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./_utilities/createSupabaseServerClient";

// export const signOutAction = async () => {
//     const supabase = await createSupabaseServerClient()

//     const { error } = await supabase.auth.signOut()
//     if (error) return error.message

//     redirect('/sign-in')
// };

export const signOutAction = async () => {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signOut()
    if (!error) redirect('/sign-in')
};