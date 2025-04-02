'use client'

import { AppShell, Burger, Group, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks"
import { ReactNode } from "react";
import CmsAppShellLink from "./cms-app-shell-link";
import { IconHome2, IconLogin2, IconSettings, IconUsers, IconApple, IconPackage, IconBuildingStore, IconLogout2 } from '@tabler/icons-react'

export interface CmsAppShellProps {
    children?: ReactNode
}

export default function CmsAppShell({ children }: CmsAppShellProps) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    Crop Management System
                    {/* <MantineLogo size={30} /> */}
                </Group>
            </AppShell.Header>

            <AppShell.Navbar>
                <AppShell.Section grow component={ScrollArea}>
                    <CmsAppShellLink href="/" label="Inicio" icon={<IconHome2 size={16} stroke={1.5} />} />
                    <CmsAppShellLink href="/users" label="Usuarios" icon={<IconUsers size={16} stroke={1.5} />} />
                    <CmsAppShellLink label="Configuración" childrenOffset={28} icon={<IconSettings size={16} stroke={1.5} />} >
                        <CmsAppShellLink label="Productos" icon={<IconApple size={16} stroke={1.5} />} />
                        <CmsAppShellLink label="Unidades de Empaque" icon={<IconPackage size={16} stroke={1.5} />} />
                        <CmsAppShellLink label="Tiendas y Sucursales" icon={<IconBuildingStore size={16} stroke={1.5} />} />
                    </CmsAppShellLink>
                </AppShell.Section>

                <AppShell.Section>
                    <CmsAppShellLink href="/login" label="Cerrar Sesión" icon={<IconLogout2 size={16} stroke={1.5} />} />
                </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}