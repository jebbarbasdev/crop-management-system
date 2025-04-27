import clsx from "clsx"
import { DialogHTMLAttributes, FormEventHandler, ReactNode } from "react"
import DaisyButton from "./DaisyButton"
import { IconX } from "@tabler/icons-react"
import GenericTitle from "./GenericTitle"
import { UseModalModel } from "../_hooks/useModal"

export interface DaisyModalProps {
    modalModel: UseModalModel
    
    title: string
    children: ReactNode

    onSubmit?: FormEventHandler<HTMLFormElement>

    loading?: boolean
}

export default function DaisyModal({ modalModel: { id, close }, title, onSubmit, loading, children }: DaisyModalProps) {
    return (
        <dialog className="modal" id={id}>
            <div className="modal-box">
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

                    <div className="modal-action">
                        <DaisyButton
                            variant="secondary"
                            appearance="outline"
                            type="button"
                            onClick={close}
                            loading={loading}
                        >
                            Cancelar
                        </DaisyButton>

                        <DaisyButton
                            variant="primary"
                            type="submit"
                            loading={loading}
                        >
                            Guardar
                        </DaisyButton>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button disabled={loading}></button>
            </form>
        </dialog>
    )
}