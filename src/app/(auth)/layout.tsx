import css from './layout.module.css'

import "../(auth)/login/stylos/home.css"

import logo from "../(auth)/login/imagenes/logo.png"

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

