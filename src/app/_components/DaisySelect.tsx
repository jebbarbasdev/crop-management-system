import { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export type DaisyInputColor = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type DaisyInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface DaisySelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
    label?: string;
    error?: string;
    placeholder?: string;
    clearable?: boolean;

    options: {
        value: string | number;
        label: string;
    }[];

    value?: string | number | null;
    color?: DaisyInputColor;
    daisySize?: DaisyInputSize;
    ghost?: boolean;
}

export default function DaisySelect({ 
    label, 
    error, 
    color, 
    daisySize, 
    ghost, 
    placeholder, 
    className, 
    options, 
    value,
    onChange,
    clearable = false,
    ...props 
}: DaisySelectProps) {
    const getColorTailwindClassName = () => {
        switch (color) {
            case 'neutral': return 'select-neutral';
            case 'primary': return 'select-primary';
            case 'secondary': return 'select-secondary';
            case 'accent': return 'select-accent';
            case 'info': return 'select-info';
            case 'success': return 'select-success';
            case 'warning': return 'select-warning';
            case 'error': return 'select-error';
            default: return '';
        }
    }

    const getSizeTailwindClassName = () => {
        switch (daisySize) {
            case 'xs': return 'select-xs';
            case 'sm': return 'select-sm';
            case 'md': return 'select-md';
            case 'lg': return 'select-lg';
            case 'xl': return 'select-xl';
            default: return '';
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === '' && !clearable && value !== null) {
            return;
        }
        
        const newValue = e.target.value === '' ? null : e.target.value;
        onChange?.({
            ...e,
            target: {
                ...e.target,
                value: newValue
            }
        } as React.ChangeEvent<HTMLSelectElement>);
    };

    return (
        <fieldset className="fieldset w-full">
            {label && <legend className="fieldset-legend">{label}</legend>}

            <select 
                {...props}
                value={value ?? ''}
                onChange={handleChange}
                className={clsx("select w-full", { "select-error": error, "select-ghost": ghost }, getColorTailwindClassName(), getSizeTailwindClassName(), className)}    
            >
                {placeholder && <option value="" disabled={!clearable && value !== null}>{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>

            {error && <p className="label text-error">{error}</p>}
        </fieldset>
    )
}