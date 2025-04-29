'use server'

import { createSupabaseServerClient } from "@/app/_utilities/createSupabaseServerClient";
import { headers } from "next/headers";
import { forgotPasswordSchema, ForgotPasswordSchema } from "./_models/forgotPasswordSchema";

export const forgotPasswordAction = async (data: ForgotPasswordSchema) => {
    const supabase = await createSupabaseServerClient()
    
    const awaitedHeaders = await headers()
    const origin = awaitedHeaders.get("origin")
    
    console.log('Todos tus headers son: ', JSON.stringify(awaitedHeaders, null, 4))
    console.log('Tu origen es: ', origin)

    const { success, data: parsedData, error: parseError } = forgotPasswordSchema.safeParse(data)
    if (!success) return parseError.message

    const { error } = await supabase.auth.resetPasswordForEmail(parsedData.email, {
        redirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent('/reset-password')}`,
    });

    if (error) return error.message

    return null
};
