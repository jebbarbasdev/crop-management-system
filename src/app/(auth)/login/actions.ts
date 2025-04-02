'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/app/_utilities/createSupabaseServerClient'
import { LoginFormSchema, loginFormSchema } from './_models/loginFormSchema'

export async function login(data: Record<string, any>) {
    const supabase = await createSupabaseServerClient()

    const parsedData = loginFormSchema.parse(data)

    const { error } = await supabase.auth.signInWithPassword(parsedData)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
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