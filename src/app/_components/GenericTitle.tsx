import clsx from "clsx";
import { ReactNode } from "react"

export interface GenericTitleProps {
    children?: ReactNode;
    removeMargin?: boolean;
    subtitle?: ReactNode
}

export default function GenericTitle({ children, subtitle, removeMargin }: GenericTitleProps) {
    return (
        <div className={clsx({ "mb-4": !removeMargin })}>
            <h1 
                className={clsx("text-2xl font-bold text-secondary")}
            >
                {children}
            </h1>

            {subtitle && (
                <h2
                    className={clsx("text-secondary")}
                >
                    {subtitle}
                </h2>
            )}
        </div>
    )
}