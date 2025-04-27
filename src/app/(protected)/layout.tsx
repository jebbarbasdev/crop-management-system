import clsx from 'clsx'
import Header from '../_components/Header'
import css from './layout.module.css'
import { createSupabaseServerClient } from '../_utilities/createSupabaseServerClient'
import { redirect } from 'next/navigation'
import Sidebar from '../_components/Sidebar'
import { getUserWithCustomClaims } from '../_services/getUserWithCustomClaims'
import { headers } from 'next/headers'

export default async function ProtectedLayout({ 
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const user = await getUserWithCustomClaims()
    if (!user) redirect('/sign-in')

    const headersList = await headers()
    const path = headersList.get('x-invoke-path') ?? ''

    console.log(path)

    return (
        <div className={css.container}>
            <Header className={css.header} user={user} />
            <Sidebar className={css.sidebar} user={user} currentPath={path} />
            <div className={clsx(css.content, 'p-4')}>
                {children}
            </div>
        </div>
    )
}
