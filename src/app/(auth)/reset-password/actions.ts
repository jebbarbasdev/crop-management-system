'use server'

import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/app/_utilities/createSupabaseServerClient'
import { ResetSchema, resetSchema } from './_models/resetSchema'

export async function resetPasswordAction(data: ResetSchema) {
    const supabase = await createSupabaseServerClient();

    const { success, data: parsedData, error: parseError } = resetSchema.safeParse(data);
    if (!success) return parseError.message;

    const { error } = await supabase.auth.updateUser({ password: parsedData.password });
    if (error) return error.message;

    redirect('/')
}
