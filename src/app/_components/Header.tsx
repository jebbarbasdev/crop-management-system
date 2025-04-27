import clsx from "clsx";
import { HTMLAttributes } from "react";
import { createSupabaseServerClient } from "../_utilities/createSupabaseServerClient";
import { UserWithCustomClaims } from "../_services/getUserWithCustomClaims";

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
    user: UserWithCustomClaims | null
}

export default async function Header({ className, user, ...props }: HeaderProps) {
    return (
        <header 
            {...props}
            className={clsx("bg-primary text-primary-content shadow-lg p-4 flex justify-between", className)}
        >
            <h1 className="font-bold text-xl">Crop Management System</h1>
            {user && (
                <div className="flex justify-center items-center text-xs">
                    Hola, {user.full_name ?? user.email} ({user.role_id.name})
                </div>
            )}
        </header>
    )
}