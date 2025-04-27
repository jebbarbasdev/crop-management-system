'use client'

import Link from "next/link"
import DaisyButton, { DaisyButtonProps } from "./DaisyButton"
import { usePathname } from "next/navigation"

export interface SidebarButtonProps extends DaisyButtonProps {
    href?: string,
}

export default function SidebarButton({ children, href, ...props }: SidebarButtonProps) {
    const pathname = usePathname()
    const active = pathname === href
    
    const Button = () => (
        <DaisyButton modifier="circle" variant={active ? "primary": "secondary"} tooltipPlacement="right" {...props}>
            {children}
        </DaisyButton>
    )

    if (!href) return <Button />

    return (
        <Link href={href}>
            <Button />
        </Link>
    )
}