import clsx from "clsx";
import { HTMLAttributes } from "react";
import { createSupabaseServerClient } from "../_utilities/createSupabaseServerClient";
import { redirect } from "next/navigation";

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {

}

export default async function Header({ className, ...props }: HeaderProps) {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.auth.getUser()    

    return (
        <header 
            {...props}
            className={clsx("bg-primary text-primary-content shadow-lg p-4 flex justify-between", className)}
        >
            <h1 className="font-bold text-xl">Crop Management System</h1>
            {data?.user?.email && (
                <div className="flex justify-center items-center text-xs">
                    {data.user.email}
                </div>
            )}
        </header>
    )
}