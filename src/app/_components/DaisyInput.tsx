import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export type DaisyInputColor = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type DaisyInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DaisyInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;

    color?: DaisyInputColor;
    daisySize?: DaisyInputSize;
    ghost?: boolean;
}

export default function DaisyInput({ label, error, color, daisySize, ghost, className, ...props }: DaisyInputProps) {
    const getColorTailwindClassName = () => {
        switch (color) {
            case 'neutral': return 'input-neutral';
            case 'primary': return 'input-primary';
            case 'secondary': return 'input-secondary';
            case 'accent': return 'input-accent';
            case 'info': return 'input-info';
            case 'success': return 'input-success';
            case 'warning': return 'input-warning';
            case 'error': return 'input-error';
            default: return '';
        }
    }

    const getSizeTailwindClassName = () => {
        switch (daisySize) {
            case 'xs': return 'input-xs';
            case 'sm': return 'input-sm';
            case 'md': return 'input-md';
            case 'lg': return 'input-lg';
            case 'xl': return 'input-xl';
            default: return '';
        }
    }


    return (
        <fieldset className="fieldset w-full">
            {label && <legend className="fieldset-legend">{label}</legend>}

            <input 
                {...props}
                className={clsx(className, "input w-full", { "input-error": error, "input-ghost": ghost }, getColorTailwindClassName(), getSizeTailwindClassName())}    
            />

            {error && <p className="label text-error">{error}</p>}
        </fieldset>
    )
}