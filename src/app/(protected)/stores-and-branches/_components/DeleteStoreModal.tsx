import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Store } from "../_services/getStores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStore } from "../_services/deleteStore";
import { toast } from "sonner";
import { FormEventHandler } from "react";

export interface DeleteStoreModalProps {
    modalModel: UseModalModel
    store: Store | null
}

export default function DeleteStoreModal({ modalModel, store }: DeleteStoreModalProps) {
    const queryClient = useQueryClient()

    const { mutate: deleteStoreMutation, isPending: isDeleting } = useMutation({ 
        mutationFn: deleteStore,
        onError: (error) => {
            toast.error(`Error al eliminar la tienda: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Tienda eliminada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['stores'] })
        }
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        if (store) {
            deleteStoreMutation(store)
        }
    }
    
    
    return (
        <DaisyModal
            modalModel={modalModel}

            title={`¿Eliminar "${store?.name}"?`}
            loading={isDeleting}

            cancelText="No, Cancelar"
            confirmText="Sí, Eliminar"

            onSubmit={handleSubmit}
        ></DaisyModal>
    )
}