import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from './supabase'
import { getUserWithCustomClaims } from '../_services/getUserWithCustomClaims'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    // ^^^ getUserWithCustomClaims() ya usa auth.getUser, no se preocupen ^^^

    const user = await getUserWithCustomClaims(supabase)
    
    const unprotectedPaths = ['/sign-in', '/forgot-password', '/auth/callback']
    const isUnprotectedPath = unprotectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (!user && !isUnprotectedPath) {
        // No hay usuario y quiere entrar a ruta protegida

        const url = request.nextUrl.clone()
        const redirectTo = url.pathname

        url.pathname = `/sign-in`
        url.search = `?redirectTo=${encodeURIComponent(redirectTo)}`

        return NextResponse.redirect(url)
    }
    else if (user){
        const moduleSlug = request.nextUrl.pathname.substring(1)
        
        // Permitiremos el acceso a la ruta en los siguientes casos:
        // 1. Se quiere entrar al dashboard (fallback por defecto)
        // 2. Se quiere entrar a la ruta de reset-password
        // 3. El usuario tiene permisos para acceder a la ruta
        const hasAccessToThisModule = 
            moduleSlug === '' || 
            moduleSlug === 'reset-password' ||
            user.hasAnyPermissionIn(moduleSlug) 

        if (isUnprotectedPath || !hasAccessToThisModule) {
            // Hay usuario, pero esta queriendo hacer una de las siguientes acciones
            // 1. Entrar a una pagina de las del login/recover-password
            // 2. Acceder a un modulo que no le corresponde

            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        } 
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}