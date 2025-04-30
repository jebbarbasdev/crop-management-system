'use server'

import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/app/_utilities/createSupabaseServerClient'
import { SignInFormSchema, signInFormSchema } from './_models/signInFormSchema'

export async function signInAction(data: SignInFormSchema, redirectTo: string | null) {
    const supabase = await createSupabaseServerClient()
    
    const { success, data: parsedData, error: parseError } = signInFormSchema.safeParse(data)
    if (!success) return parseError.message

    const { error } = await supabase.auth.signInWithPassword(parsedData)
    if (error) return error.message
    
    if (redirectTo) redirect(decodeURIComponent(redirectTo))
    redirect('/')
}

// export async function signup(formData: FormData) {
//     const supabase = await createSupabaseServerClient()

//     // type-casting here for convenience
//     // in practice, you should validate your inputs
//     const data = {
//         email: formData.get('email') as string,
//         password: formData.get('password') as string,
//     }

//     const { error } = await supabase.auth.signUp(data)

//     if (error) {
//         redirect('/error')
//     }

//     revalidatePath('/', 'layout')
//     redirect('/')
// }