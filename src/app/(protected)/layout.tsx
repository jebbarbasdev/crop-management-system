import clsx from 'clsx'
import Header from '../_components/Header'
import css from './layout.module.css'
import { createSupabaseServerClient } from '../_utilities/createSupabaseServerClient'
import { redirect } from 'next/navigation'
import Sidebar from '../_components/Sidebar'

export default async function ProtectedLayout({ 
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) redirect('/sign-in')

    return (
        <div className={css.container}>
            <Header className={css.header} />

            <Sidebar className={css.sidebar} />

            <div className={clsx(css.content)}>
                {children}
            </div>
        </div>
    )
}
