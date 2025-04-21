import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface DaisyInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function DaisyInput({ label, error, className, ...props }: DaisyInputProps) {
    return (
        <fieldset className="fieldset w-full">
            {label && <legend className="fieldset-legend">{label}</legend>}

            <input 
                {...props}
                className={clsx(className, "input w-full", { "input-error": error })}    
            />

            {error && <p className="label text-error">{error}</p>}
        </fieldset>
    )
}