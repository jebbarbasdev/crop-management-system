import DaisyModal from "@/app/_components/DaisyModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../_services/createProduct";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, productSchema } from "../_models/productSchema";
import DaisyInput from "@/app/_components/DaisyInput";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";
import { useEffect } from "react";
import { updateProduct } from "../_services/updateProduct";
import { Product } from "../_services/getProducts";

export interface ProductModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function ProductModal({ modalModel, product }: ProductModalProps) {
    const queryClient = useQueryClient()
    
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({ 
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || ''
        }
    })

    useEffect(() => {
        if (product) {
            reset(product)
        }
        else {
            reset({ name: '' })
        }
    }, [product, reset])

    const { mutate: createProductMutation, isPending: isCreating } = useMutation({ 
        mutationFn: createProduct,
        onError: (error) => {
            toast.error(`Error al crear el producto: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Producto creado con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateProduct,
        onError: (error) => {
            toast.error(`Error al actualizar el producto: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Producto actualizado con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const onSubmit = async (data: ProductSchema) => {
        if (product) {
            updateProductMutation({ id: product.id, name: data.name })
        } else {
            createProductMutation(data)
        }
    }

    const loading = isCreating || isUpdating

    return (
        <DaisyModal
            title={product ? "Actualizar Producto" : "Crear Producto"}
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="text"
                    placeholder="Nombre del Producto"

                    label="Nombre del Producto"
                    error={errors.name?.message}

                    disabled={loading}

                    {...register('name')}
                />
            </div>
        </DaisyModal>
    )
}