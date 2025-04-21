import clsx from "clsx";
import { HTMLAttributes } from "react";

export interface TitledFormProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
}

export default function TitledForm({ children, className, title, ...props }: TitledFormProps) {
    return (
        <div className={clsx(className, "bg-white flex p-4 flex-col w-full max-w-100 shadow-lg")} {...props}>
            <span className='text-primary font-bold text-center text-xl'>{title}</span>
            {children}
        </div>
    )

}