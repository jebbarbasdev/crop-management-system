import clsx from "clsx";
import { HTMLAttributes } from "react";
import { IconApple, IconBuildingStore, IconHome2, IconLogout, IconPackage, IconQuestionMark, IconReport, IconScaleOutline, IconShieldLock, IconTruck, IconUsers } from '@tabler/icons-react'
import { signOutAction } from "../actions";
import { UserWithCustomClaims } from "../_services/getUserWithCustomClaims";
import SidebarButton from "./SidebarButton";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
    user: UserWithCustomClaims | null,
    currentPath: string
}

export default async function Sidebar({ className, user, currentPath, ...props }: SidebarProps) {
    const getSidebarButtonIcon = (slug: string) => {
        const size = 24
        switch (slug) {
            case "users": return <IconUsers size={size} />;
            case "roles-and-permissions": return <IconShieldLock size={size} />;
            case "products": return <IconApple size={size} />;
            case "storage-units": return <IconPackage size={size} />;
            case "stores-and-branches": return <IconBuildingStore size={size} />;
            case "orders": return <IconTruck size={size} />;
            case "weighting": return <IconScaleOutline size={size} />;
            case "summarized": return <IconReport size={size} />;
            default: return <IconQuestionMark size={size} />;
        }
    }

    return (
        <nav 
            {...props}
            className={clsx("p-1 bg-secondary text-secondary-content", className)}
        >
            <form action={signOutAction} className="h-full flex flex-col justify-start gap-1">
                <SidebarButton type="button" tooltip="Dashboard" href="/">
                    <IconHome2 size={24} />
                </SidebarButton>

                {user && Object.values(user.modulesWithAccess).map(module => (
                    <SidebarButton 
                        key={module.id} 
                        type="button" 
                        tooltip={module.name} 
                        href={`/${module.slug}`}
                        active={currentPath === `/${module.slug}`}
                    >
                        {getSidebarButtonIcon(module.slug)}
                    </SidebarButton>
                ))}

                <SidebarButton tooltip="Cerrar Sesión">
                    <IconLogout size={24} />
                </SidebarButton>
            </form>
        </nav>
    )
}