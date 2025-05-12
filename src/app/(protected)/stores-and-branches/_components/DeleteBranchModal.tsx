import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Store } from "../_services/getStores";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBranch } from "../_services/deleteBranch";
import { toast } from "sonner";
import { FormEventHandler } from "react";
import { Branch } from "../_services/getBranches";

export interface DeleteBranchModalProps {
    modalModel: UseModalModel
    store: Store | null
    branch: Branch | null
}

export default function DeleteBranchModal({ modalModel, store, branch }: DeleteBranchModalProps) {
    const queryClient = useQueryClient()

    const { mutate: deleteBranchMutation, isPending: isDeleting } = useMutation({ 
        mutationFn: deleteBranch,
        onError: (error) => {
            toast.error(`Error al eliminar la sucursal: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Sucursal eliminada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['branches', store?.id] })
        }
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        if (branch) {
            deleteBranchMutation(branch)
        }
    }
    
    
    return (
        <DaisyModal
            modalModel={modalModel}

            title={`¿Eliminar "${branch?.sd_name}"?`}
            loading={isDeleting}

            cancelText="No, Cancelar"
            confirmText="Sí, Eliminar"

            onSubmit={handleSubmit}
        ></DaisyModal>
    )
}