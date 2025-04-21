import clsx from "clsx";
import { HTMLAttributes } from "react";

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {

}

export default function Header({ className, ...props }: HeaderProps) {
    return (
        <header 
            {...props}
            className={clsx("bg-primary text-primary-content shadow-lg p-4", className)}
        >
            <h1 className="font-bold text-xl">Crop Management System</h1>
        </header>
    )
}