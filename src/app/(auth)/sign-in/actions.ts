'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/app/_utilities/createSupabaseServerClient';
import { SignInFormSchema, signInFormSchema } from './_models/signInFormSchema';

export async function signInAction(data: SignInFormSchema, redirectTo: string | null) {
    const supabase = await createSupabaseServerClient();

    const { success, data: parsedData, error: parseError } = signInFormSchema.safeParse(data);
    if (!success) return parseError.message;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(parsedData);
    if (authError) return authError.message;

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_banned')
        .eq('id', authData.user?.id)
        .single();

    if (userError) {
        return 'Error al verificar el estado del usuario.';
    }

    if (userData?.is_banned) {
        await supabase.auth.signOut();
        return 'Tu cuenta está suspendida. Contacta al administrador.';
    }

    if (redirectTo) redirect(decodeURIComponent(redirectTo));
    redirect('/');
}