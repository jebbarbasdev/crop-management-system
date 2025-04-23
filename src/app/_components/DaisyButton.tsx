import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type DaisyButtonVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link';

export interface DaisyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    variant?: DaisyButtonVariant;
}

export default function DaisyButton({ children, loading, variant, className, ...props }: DaisyButtonProps) {
    const getVariantTailiwindClass = () => {
        switch (variant) {
            case 'neutral': return 'btn-neutral'
            case 'primary': return 'btn-primary'
            case 'secondary': return 'btn-secondary'
            case 'accent': return 'btn-accent'
            case 'info': return 'btn-info'
            case 'success': return 'btn-success'
            case 'warning': return 'btn-warning'
            case 'error': return 'btn-error'
            case 'ghost': return 'btn-ghost'
            case 'link': return 'btn-link'
            default: return ''
        }
    }

    return (
        <button
            className={clsx(className, "btn", getVariantTailiwindClass())}
            disabled={loading}

            {...props}
        >
            {loading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    )
}