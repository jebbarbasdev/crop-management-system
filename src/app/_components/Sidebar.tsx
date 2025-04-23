import clsx from "clsx";
import { HTMLAttributes } from "react";
import DaisyButton from "./DaisyButton";
import { IconLogout } from '@tabler/icons-react'
import { signOutAction } from "../actions";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {

}

export default async function Sidebar({ className, ...props }: SidebarProps) {
    return (
        <nav 
            {...props}
            className={clsx("flex flex-col gap-4 p-4 bg-secondary text-secondary-content", className)}
        >
            <form action={signOutAction}>
                <DaisyButton className='btn-circle'>
                    <IconLogout size={24} />
                </DaisyButton>
            </form>
        </nav>
    )
}