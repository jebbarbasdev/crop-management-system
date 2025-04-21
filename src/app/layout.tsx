import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import './layout.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <Toaster richColors closeButton position="top-right" />
                {children}
            </body>
        </html>
    );
}
