import clsx from "clsx"
import { FormEventHandler, ReactNode } from "react"
import DaisyButton from "./DaisyButton"
import { IconX } from "@tabler/icons-react"
import GenericTitle from "./GenericTitle"
import { UseModalModel } from "../_hooks/useModal"

export interface DaisyModalProps {
    modalModel: UseModalModel
    
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

    title: string
    children?: ReactNode

    showConfirmButton?: boolean
    confirmText?: string

    showCancelButton?: boolean
    cancelText?: string
    
    onSubmit?: FormEventHandler<HTMLFormElement>

    loading?: boolean
    disabled?: boolean
}

export default function DaisyModal({ modalModel: { id, close }, size, title, cancelText, confirmText, onSubmit, loading, disabled, children, showCancelButton = true, showConfirmButton = true }: DaisyModalProps) {
    const getSizeTailwindClass = () => {
        switch (size) {
            case 'xs': return 'max-w-xl'
            case 'sm': return 'max-w-2xl'
            case 'md': return 'max-w-3xl'
            case 'lg': return 'max-w-4xl'
            case 'xl': return 'max-w-5xl'
            default: return 'max-w-3xl'
        }
    }
    
    return (
        <dialog className="modal" id={id}>
            <div className={clsx("modal-box", getSizeTailwindClass())}>
                <form method="dialog" onSubmit={onSubmit}>
                    <div className="flex justify-between items-center mb-4">
                        <GenericTitle removeMargin>{title}</GenericTitle>
                        <DaisyButton
                            size="sm"
                            variant="ghost"
                            modifier="circle"
                            type="button"
                            onClick={close}
                            loading={loading}
                        >
                            <IconX size={24} />
                        </DaisyButton>
                    </div>

                    {children}

                    {(showCancelButton || showConfirmButton) && (
                        <div className="modal-action">
                            {showCancelButton && (
                                <DaisyButton
                                    variant="secondary"
                                    appearance="outline"
                                    type="button"
                                    onClick={close}
                                    loading={loading}
                                >
                                    {cancelText ?? 'Cancelar'}
                                </DaisyButton>
                            )}

                            {showConfirmButton && (
                                <DaisyButton
                                    variant="primary"
                                    type="submit"
                                    loading={loading}
                                    disabled={disabled}
                                >
                                    {confirmText ?? 'Guardar'}
                                </DaisyButton>
                            )}
                        </div>
                    )}
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button disabled={loading}></button>
            </form>
        </dialog>
    )
}