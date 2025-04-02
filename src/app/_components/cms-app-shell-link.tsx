import { NavLink } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface CmsAppShellLinkProps {
    label: string
    href?: string,
    icon?: ReactNode,

    children?: ReactNode,
    childrenOffset?: number
}

export default function CmsAppShellLink({ href, label, icon, children, childrenOffset }: CmsAppShellLinkProps) {
    const pathname = usePathname()

    return (
        <NavLink
            href={href ?? '#'}
            label={label}
            component={Link}
            leftSection={icon}
            active={href === pathname}
            childrenOffset={childrenOffset}
        >
            {children}
        </NavLink>
    )
}