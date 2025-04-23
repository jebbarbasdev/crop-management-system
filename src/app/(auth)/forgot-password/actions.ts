'use server'

import { createSupabaseServerClient } from "@/app/_utilities/createSupabaseServerClient";
import { headers } from "next/headers";
import { forgotPasswordSchema, ForgotPasswordSchema } from "./_models/forgotPasswordSchema";

export const forgotPasswordAction = async (data: ForgotPasswordSchema) => {
    const supabase = await createSupabaseServerClient()
    const origin = (await headers()).get("origin")
    
    const { success, data: parsedData, error: parseError } = forgotPasswordSchema.safeParse(data)
    if (!success) return parseError.message

    const { error } = await supabase.auth.resetPasswordForEmail(parsedData.email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
    });

    if (error) return error.message

    // if (callbackUrl) {
    //     return redirect(callbackUrl);
    // }

    return null
};
