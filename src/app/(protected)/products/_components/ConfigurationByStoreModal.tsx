import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import ConfigurationByStoreTable from "./ConfigurationByStoreTable";
import { Product } from "../_services/getProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfigurationsByStoreSchema, configurationsByStoreSchema } from "../_models/configurationByStoreSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { upsertConfigurationByStore } from "../_services/upsertConfigurationByStore";
import getConfigurationByStore from "../_services/getConfigurationByStore";
import { useEffect } from "react";

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

    const { data, error, isLoading } = useQuery({
        queryKey: ['products', 'stores_metadata', product?.id],
        queryFn: () => getConfigurationByStore(product!.id),
        enabled: !!product
    })

    useEffect(() => {
        if (data) {
            const configurations = data.map(store => ({
                store_id: store.id,
                sd_sku: store.product_metadata?.sd_sku ?? '',
                sd_name: store.product_metadata?.sd_name ?? '',
                sd_price_by_kg: store.product_metadata?.sd_price_by_kg ?? 0
            }))

            reset({ configurations })
        }
    }, [data, reset])

    const { mutate, isPending } = useMutation({ 
        mutationFn: upsertConfigurationByStore,
        onError: (error) => {
            toast.error(`Error al crear el producto: ` + error.message)
        },
        onSuccess: () => {
            toast.success(`Producto creado con éxito`)
            modalModel.close()
            queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const onSubmit = async (data: ConfigurationsByStoreSchema) => {
        console.log(data)
    }
    
    return (
        <DaisyModal
            title="Configuración por Tienda"
            modalModel={modalModel}
            onSubmit={handleSubmit(onSubmit)}
            loading={isPending}
            size="xl"
        >
            <ConfigurationByStoreTable 
                data={data ?? null}
                isLoading={isLoading}
                error={error}

                control={control}
            />
        </DaisyModal>
    )
}