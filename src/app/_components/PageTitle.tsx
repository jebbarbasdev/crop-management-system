import { ReactNode } from "react"

export interface PageTitleProps {
    children: ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
    return (
        <h1 
            className="text-2xl font-bold text-secondary mb-4"
        >
            {children}
        </h1>
    )
}