import DaisyModal from "@/app/_components/DaisyModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStore } from "../_services/createStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreSchema, storeSchema } from "../_models/storeSchema";
import DaisyInput from "@/app/_components/DaisyInput";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";
import { useEffect } from "react";
import { updateStore } from "../_services/updateStore";
import { Store } from "../_services/getStores";

export interface ProductModalProps {
    modalModel: UseModalModel
    store: Store | null
}

export default function ProductModal({ modalModel, store }: ProductModalProps) {
    const queryClient = useQueryClient()
    
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({ 
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: store?.name || '',
            legal_name: store?.legal_name || '',
            rfc: store?.rfc || '',
            address: store?.address || ''
        }
    })

    useEffect(() => {
        if (store) {
            reset(store)
        }
        else {
            reset({ name: '', legal_name: '', rfc: '', address: '' })
        }
    }, [store, reset])

    const { mutate: createStoreMutation, isPending: isCreating } = useMutation({ 
        mutationFn: createStore,
        onError: (error) => {
            toast.error(`Error al crear la tienda: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Tienda creada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['stores'] })
        }
    })

    const { mutate: updateStoreMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateStore,
        onError: (error) => {
            toast.error(`Error al actualizar la tienda: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Tienda actualizada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['stores'] })
        }
    })

    const onSubmit = async (data: StoreSchema) => {
        if (store) {
            updateStoreMutation({ id: store.id, name: data.name, legal_name: data.legal_name, rfc: data.rfc, address: data.address })
        } else {
            createStoreMutation(data)
        }
    }

    const loading = isCreating || isUpdating

    return (
        <DaisyModal
            title={store ? "Actualizar Tienda" : "Crear Tienda"}
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4 w-full">
                <DaisyInput
                    type="text"
                    placeholder="Nombre de la Tienda"

                    label="Nombre de la Tienda"
                    error={errors.name?.message}

                    disabled={loading}

                    {...register('name')}
                />

                <DaisyInput
                    type="text"
                    placeholder="Razón Social de la Tienda"

                    label="Razón Social de la Tienda"
                    error={errors.name?.message}

                    disabled={loading}

                    {...register('legal_name')}
                />

                <DaisyInput
                    type="text"
                    placeholder="RFC de la Tienda"

                    label="RFC de la Tienda"
                    error={errors.rfc?.message}

                    disabled={loading}

                    {...register('rfc')}
                />

                <DaisyInput
                    type="text"
                    placeholder="Dirección de la Tienda"

                    label="Dirección de la Tienda"
                    error={errors.address?.message}

                    disabled={loading}

                    {...register('address')}
                />
            </div>
        </DaisyModal>
    )
}