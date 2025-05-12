import DaisyModal from "@/app/_components/DaisyModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DaisyInput from "@/app/_components/DaisyInput";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";
import { useEffect } from "react";
import { BranchSchema, branchSchema } from "../_models/branchSchema";
import { Branch } from "../_services/getBranches";
import { createBranch } from "../_services/createBranch";
import { updateBranch } from "../_services/updateBranch";
import { Store } from "../_services/getStores";

export interface BranchModalProps {
    modalModel: UseModalModel
    store: Store | null
    branch: Branch | null
}

export default function BranchModal({ modalModel, store, branch }: BranchModalProps) {
    const queryClient = useQueryClient()
    
    const {
        register, 
        handleSubmit, 
        formState: { errors },
        reset
    } = useForm({ 
        resolver: zodResolver(branchSchema),
        defaultValues: {
            store_id: branch?.store_id || 0,
            sd_name: branch?.sd_name || '',
            sd_number: branch?.sd_number || 0,
        }
    })

    useEffect(() => {
        if (branch) {
            reset(branch)
        }
        else {
            reset({ store_id: store?.id || 0, sd_name: '', sd_number: 0 })
        }
    }, [branch, reset, store])

    const { mutate: createBranchMutation, isPending: isCreating } = useMutation({ 
        mutationFn: createBranch,
        onError: (error) => {
            toast.error(`Error al crear la sucursal: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Sucursal creada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['branches', store?.id] })
        }
    })

    const { mutate: updateBranchMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateBranch,
        onError: (error) => {
            toast.error(`Error al actualizar la sucursal: ` + error.message)
        },
        onSuccess: () => {
            reset()
            toast.success(`Sucursal actualizada con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['branches', store?.id] })
        }
    })

    const onSubmit = async (data: BranchSchema) => {
        if (branch) {
            updateBranchMutation({ id: branch?.id, sd_name: data.sd_name, sd_number: data.sd_number })
        } else {
            createBranchMutation(data)
        }
    }

    const loading = isCreating || isUpdating

    return (
        <DaisyModal
            title={branch ? "Actualizar Sucursal" : "Crear Sucursal"}
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
        >
            <div className="flex flex-col gap-4 w-full">
                <input
                    type="hidden"
                    {...register('store_id')}
                />
                    
                <DaisyInput
                    type="text"
                    placeholder="Nombre de la Sucursal"

                    label="Nombre de la Sucursal"
                    error={errors.sd_name?.message}

                    disabled={loading}

                    {...register('sd_name')}
                />

                <DaisyInput
                    type="number"
                    placeholder="Número de Sucursal"

                    label="Número de Sucursal"
                    error={errors.sd_number?.message}

                    disabled={loading}

                    {...register('sd_number')}
                />
            </div>
        </DaisyModal>
    )
}