import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type DaisyTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type DaisyButtonVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'ghost' | 'link';
export type DaisyButtonAppearance = 'outline' | 'dash' | 'soft' | 'ghost' | 'link'
export type DaisyButtonModifier = 'wide' | 'block' | 'square' | 'circle'

export interface DaisyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    tooltip?: string
    tooltipPlacement?: DaisyTooltipPlacement

    variant?: DaisyButtonVariant
    appearance?: DaisyButtonAppearance
    modifier?: DaisyButtonModifier
}

export default function DaisyButton({ children, loading, tooltip, tooltipPlacement, variant, appearance, modifier, className, ...props }: DaisyButtonProps) {
    const getTooltipPlacementTailwindClass = () => {
        switch (tooltipPlacement) {
            case 'top': return 'tooltip-top'
            case 'bottom': return 'tooltip-bottom'
            case 'left': return 'tooltip-left'
            case 'right': return 'tooltip-right'
            default: return ''
        }
    }
    
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

    const getAppearanceTailiwindClass = () => {
        switch (appearance) {
            case 'outline': return 'btn-outline'
            case 'dash': return 'btn-dash'
            case 'soft': return 'btn-soft'
            case 'ghost': return 'btn-ghost'
            case 'link': return 'btn-link'
            default: return ''
        }
    }

    const getModifierTailiwindClass = () => {
        switch (modifier) {
            case 'wide': return 'btn-wide'
            case 'block': return 'btn-block'
            case 'square': return 'btn-square'
            case 'circle': return 'btn-circle'
            default: return ''
        }
    }

    const Button = () => (
        <button
            className={clsx(className, "btn", getVariantTailiwindClass(), getAppearanceTailiwindClass(), getModifierTailiwindClass())}
            disabled={loading}

            {...props}
        >
            {loading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    )

    if (!tooltip) return <Button />

    return (
        <div className={clsx("tooltip", getTooltipPlacementTailwindClass())} data-tip={tooltip}>
            <Button />
        </div>
    )
}