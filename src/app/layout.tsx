import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Metadata } from 'next';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import './globals.css'

export const metadata: Metadata = {
    title: "Crop Management System",
    description: "Management System from Crop Store",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider>
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
