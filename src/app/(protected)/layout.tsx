import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "../_utilities/createSupabaseServerClient"

export default async function ProtetedLayout({ 
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    // const supabase = await createSupabaseServerClient()
    //
    // const { data, error } = await supabase.auth.getUser()
    // if (error || !data?.user) {
    //     redirect('/login')
    // }

    return (
        <>
            {children}
        </>
    )
}