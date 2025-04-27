import clsx from 'clsx'
import Header from '../_components/Header'
import css from './layout.module.css'

export default function AuthLayout({ 
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className={css.container}>
            <Header className={css.header} user={null} />

            <div className={clsx(css.logo, 'flex flex-col items-center justify-center gap-4 p-4')}>
                <img 
                    src="/cropms-logo.png" 
                    alt="Crop Management System Logo" 
                    loading='lazy'
                    className="w-1/2 h-auto"
                />

                <span className='text-rose-900 text-center'>
                    Gestione su frutería y verdulería con tecnología de última generación.
                </span>

                <p className='text-rose-600 text-xs text-center'>
                    Crop Management System le permite administrar productos, pedidos, tiendas y pesajes de forma ágil 
                    y centralizada, ayudándole a llevar un control preciso desde el campo hasta el 
                    punto de venta.
                </p>
            </div>

            <div className={clsx(css.content, 'flex justify-center items-center p-4')}>
                {children}
            </div>
        </div>
    )
}

