import clsx from 'clsx'
import Header from '../_components/Header'
import css from './layout.module.css'
import { redirect } from 'next/navigation'
import Sidebar from '../_components/Sidebar'
import { getUserWithCustomClaims } from '../_services/getUserWithCustomClaims'

export default async function ProtectedLayout({ 
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const user = await getUserWithCustomClaims()
    if (!user) redirect('/sign-in')

    return (
        <div className={css.container}>
            <Header className={css.header} user={user} />
            <Sidebar className={css.sidebar} user={user} />
            <div className={clsx(css.content, 'p-4')}>
                {children}
            </div>
        </div>
    )
}
