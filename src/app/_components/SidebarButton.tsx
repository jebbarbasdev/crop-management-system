import Link from "next/link"
import DaisyButton, { DaisyButtonProps } from "./DaisyButton"

export interface SidebarButtonProps extends DaisyButtonProps {
    href?: string,
    active?: boolean
}

export default function SidebarButton({ children, href, active, ...props }: SidebarButtonProps) {
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