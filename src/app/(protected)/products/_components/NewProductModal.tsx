import DaisyModal, { DaisyModalProps } from "@/app/_components/DaisyModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../_services/createProduct";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, productSchema } from "../_models/productSchema";
import DaisyInput from "@/app/_components/DaisyInput";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";

export interface NewProductModalProps {
    modalModel: UseModalModel
}

export default function NewProductModal({ modalModel }: NewProductModalProps) {
    const queryClient = useQueryClient()
    
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({ resolver: zodResolver(productSchema)})
    
    const { mutate, isPending } = useMutation({ 
        mutationFn: createProduct,
        onError: (error) => {
            toast.error('Error al crear el producto: ' + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success('Producto creado con éxito')
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const onSubmit = async (data: ProductSchema) => {
        mutate(data.name)
    }

    return (
        <DaisyModal
            title="Crear Producto"
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={isPending}
        >
            <div className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="text"
                    placeholder="Nombre del Producto"

                    label="Nombre del Producto"
                    error={errors.name?.message}

                    {...register('name')}
                />
            </div>
        </DaisyModal>
    )
}