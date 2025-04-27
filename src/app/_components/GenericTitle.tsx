import clsx from "clsx";
import { ReactNode } from "react"

export interface GenericTitleProps {
    children: ReactNode;
    removeMargin?: boolean;
}

export default function GenericTitle({ children, removeMargin }: GenericTitleProps) {
    return (
        <h1 
            className={clsx("text-2xl font-bold text-secondary", { "mb-4": !removeMargin })}
        >
            {children}
        </h1>
    )
}