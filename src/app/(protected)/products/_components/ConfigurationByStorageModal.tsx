import { UseModalModel } from "@/app/_hooks/useModal"
import { Product } from "../_services/getProducts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useMemo } from "react"
import { ConfigurationByStorageSchema, ConfigurationsByStorageSchema, configurationsByStorageSchema } from "../_models/configurationByStorageSchema"
import getConfigurationByStorage, { ConfigurationByStorage } from "../_services/getConfigurationByStorage"
import DaisyInput from "@/app/_components/DaisyInput"
import formatAt from "@/app/_utilities/formatAt"
import formatBy from "@/app/_utilities/formatBy"
import { toast } from "sonner"
import { upsertConfigurationByStorage } from "../_services/upsertConfigurationByStorage"
import DaisyModal from "@/app/_components/DaisyModal"
import DaisyTable from "@/app/_components/DaisyTable"

export interface ConfigurationByStorageModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function ConfigurationByStorageModal({ modalModel, product }: ConfigurationByStorageModalProps) {
    const queryClient = useQueryClient()
    
    const {
        handleSubmit,
        reset,
        control
    } = useForm({
        resolver: zodResolver(configurationsByStorageSchema),
        defaultValues: {
            configurations: []
        }
    })

    const columns: ColumnDef<ConfigurationByStorage>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Unidad de Empaque',
            cell: ({ getValue, row }) => (
                <div>
                    {getValue<string>()}

                    <Controller
                        name={`configurations.${row.index}.storage_unit_id`}
                        control={control}
                        defaultValue={row.original.id}
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />

                    <Controller
                        name={`configurations.${row.index}.product_id`}
                        control={control}
                        defaultValue={product?.id ?? 0}
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                </div>
            )
        },
        {
            id: 'weight_by_unit',
            header: () => 'Peso por Unidad (Kg)',
            cell: ({ row }) => (
                <Controller
                    name={`configurations.${row.index}.weight_by_unit`}
                    control={control}
                    defaultValue={row.original.product_metadata?.weight_by_unit ?? 0}
                    render={({ field, fieldState }) => (
                        <DaisyInput
                            type="number"
                            step="0.1"
                            daisySize="xs"

                            className="min-w-30"
                            placeholder="Peso por unidad"
                            
                            {...field}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            )
        },
        {
            accessorKey: 'product_metadata.created_at',
            header: () => 'Creado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'created_by',
            accessorFn: row => formatBy(row.product_metadata?.created_by),
            header: () => 'Creado Por',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'product_metadata.updated_at',
            header: () => 'Actualizado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'updated_by',
            accessorFn: row => formatBy(row.product_metadata?.updated_by),
            header: () => 'Actualizado Por',
            cell: ({ getValue }) => getValue()
        }
    ], [control, product?.id])
    
    const { data, error, isLoading } = useQuery({
        queryKey: ['products', 'configurations_by_storage', product?.id],
        queryFn: () => getConfigurationByStorage(product!.id),
        enabled: !!product
    })

    useEffect(() => {
        if (data) {
            const configurations: ConfigurationByStorageSchema[] = data.map(storage_unit => ({
                product_id: product!.id,
                storage_unit_id: storage_unit.id,
                weight_by_unit: storage_unit.product_metadata?.weight_by_unit ?? 0
            }))

            reset({ configurations })
        }
        else {
            reset({ configurations: [] })
        }
    }, [data, reset, product])

    const { mutate, isPending } = useMutation({ 
        mutationFn: upsertConfigurationByStorage,
        onError: (error) => {
            toast.error(`Error al crear las configuraciones por unidad de empaque: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Configuraciones por unidad de empaque creadas con éxito`)
            queryClient.invalidateQueries({ queryKey: ['products', 'configurations_by_storage', product?.id] })
        }
    })

    const onSubmit = async (data: ConfigurationsByStorageSchema) => {
        mutate(data.configurations)
    }
    
    return (
        <DaisyModal
            title="Configuración por Unidad de Empaque"
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={isPending}
            size="xl"
        >
            <DaisyTable 
                columns={columns} 
                data={data ?? []} 
                isLoading={isLoading} 
                error={error} 
            />
        </DaisyModal>
    )
}