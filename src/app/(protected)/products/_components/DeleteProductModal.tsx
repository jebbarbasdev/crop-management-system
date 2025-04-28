import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Product } from "../_services/getProducts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../_services/deleteProduct";
import { toast } from "sonner";
import { FormEvent, FormEventHandler } from "react";

export interface DeleteProductModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function DeleteProductModal({ modalModel, product }: DeleteProductModalProps) {
    const queryClient = useQueryClient()

    const { mutate: deleteProductMutation, isPending: isDeleting } = useMutation({ 
        mutationFn: deleteProduct,
        onError: (error) => {
            toast.error(`Error al eliminar el producto: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Producto eliminado con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()

        if (product) {
            deleteProductMutation(product)
        }
    }
    
    
    return (
        <DaisyModal
            modalModel={modalModel}

            title={`¿Eliminar "${product?.name}"?`}
            loading={isDeleting}

            cancelText="No, Cancelar"
            confirmText="Sí, Eliminar"

            onSubmit={handleSubmit}
        ></DaisyModal>
    )
}