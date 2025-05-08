import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Product } from "../_services/getProducts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigurationByStoreSchema, ConfigurationsByStoreSchema, configurationsByStoreSchema } from "../_models/configurationByStoreSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertConfigurationByStore } from "../_services/upsertConfigurationByStore";
import getConfigurationsByStore, { ConfigurationByStore } from "../_services/getConfigurationsByStore";
import { useEffect, useMemo } from "react";
import DaisyTable from "@/app/_components/DaisyTable";
import { ColumnDef } from "@tanstack/react-table";
import DaisyInput from "@/app/_components/DaisyInput";
import formatAt from "@/app/_utilities/formatAt";
import formatBy from "@/app/_utilities/formatBy";

export interface ConfigurationByStoreModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function ConfigurationByStoreModal({ modalModel, product }: ConfigurationByStoreModalProps) {
    const queryClient = useQueryClient()
    
    const {
        handleSubmit,
        reset,
        control
    } = useForm({
        resolver: zodResolver(configurationsByStoreSchema),
        defaultValues: {
            configurations: []
        }
    })

    const columns: ColumnDef<ConfigurationByStore>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Tienda',
            cell: ({ getValue, row }) => (
                <div>
                    {getValue<string>()}

                    <Controller
                        name={`configurations.${row.index}.store_id`}
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
            id: 'sd_sku',
            header: () => 'SKU',
            cell: ({ row }) => (
                <Controller
                    name={`configurations.${row.index}.sd_sku`}
                    control={control}
                    defaultValue={row.original.product_metadata?.sd_sku ?? ''}
                    render={({ field, fieldState }) => (
                        <DaisyInput
                            type="text"
                            daisySize="xs"

                            className="min-w-30"
                            placeholder="SKU del producto"
                            
                            {...field}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            )
        },
        {
            id: 'sd_name',
            header: () => 'Descripción',
            cell: ({ row }) => (
                <Controller
                    name={`configurations.${row.index}.sd_name`}
                    control={control}
                    defaultValue={row.original.product_metadata?.sd_name ?? ''}
                    render={({ field, fieldState }) => (
                        <DaisyInput
                            type="text"
                            daisySize="xs"

                            className="min-w-30"
                            placeholder="Descripción del producto"
                            
                            {...field}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            )
        },
        {
            id: 'sd_price_by_kg',
            header: () => 'Precio/Kg',
            cell: ({ row }) => (
                <Controller
                    name={`configurations.${row.index}.sd_price_by_kg`}
                    control={control}
                    defaultValue={row.original.product_metadata?.sd_price_by_kg ?? 0}
                    render={({ field, fieldState }) => (
                        <DaisyInput
                            type="number"
                            step="0.1"
                            daisySize="xs"

                            className="min-w-30"
                            placeholder="Precio por Kg del producto"
                            
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
    ], [control])
    
    const { data, error, isLoading } = useQuery({
        queryKey: ['products', 'configurations_by_store', product?.id],
        queryFn: () => getConfigurationsByStore(product!.id),
        enabled: !!product
    })

    useEffect(() => {
        if (data) {
            const configurations: ConfigurationByStoreSchema[] = data.map(store => ({
                product_id: product!.id,
                store_id: store.id,
                sd_sku: store.product_metadata?.sd_sku ?? '',
                sd_name: store.product_metadata?.sd_name ?? '',
                sd_price_by_kg: store.product_metadata?.sd_price_by_kg ?? 0
            }))

            reset({ configurations })
        }
        else {
            reset({ configurations: [] })
        }
    }, [data, reset])

    const { mutate, isPending } = useMutation({ 
        mutationFn: upsertConfigurationByStore,
        onError: (error) => {
            toast.error(`Error al crear las configuraciones por tienda: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Configuraciones por tienda creadas con éxito`)
            queryClient.invalidateQueries({ queryKey: ['products', 'configurations_by_store', product?.id] })
        }
    })

    const onSubmit = async (data: ConfigurationsByStoreSchema) => {
        mutate(data.configurations)
    }
    
    return (
        <DaisyModal
            title="Configuración por Tienda"
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