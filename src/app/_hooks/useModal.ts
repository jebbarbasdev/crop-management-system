import { useId } from "react";

export type UseModalModel = {
    id: string
    open: () => void
    close: () => void
}

export default function useModal() {
    const id = useId()

    const open = () => {
        const modal = document.getElementById(id) as HTMLDialogElement
        
        if (modal) {
            modal.showModal()
        }
    }

    const close = () => {
        const modal = document.getElementById(id) as HTMLDialogElement
        if (modal) {
            modal.close()
        }
    }

    return { id, open, close}
}