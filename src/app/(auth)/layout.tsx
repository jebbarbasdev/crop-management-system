import css from './layout.module.css'

export default function AuthLayout({ 
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className={css.wrapper}>
            {children}
        </div>
    )
}