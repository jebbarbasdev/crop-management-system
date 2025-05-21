import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { OrderDetailWithSummary } from "../_services/getOrderDetailsWithSummaries";
import DaisyInput from "@/app/_components/DaisyInput";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { weightingFormSchema, WeightingFormData } from "../_models/weightingFormSchema";
import { updateOrderDetailSummary } from "../_services/updateOrderDetailSummary";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PendingDetailModalProps {
    modalModel: UseModalModel;
    detail: OrderDetailWithSummary | null;
}

export default function PendingDetailModal({ modalModel, detail }: PendingDetailModalProps) {
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<WeightingFormData>({
        resolver: zodResolver(weightingFormSchema),
        defaultValues: {
            packagingUnits: detail?.quantity ?? 0,
            kgPerUnit: detail?.storage_unit.weight_by_unit ?? 0,
            totalPackagingKg: 0,
            grossWeight: 0,
            netWeight: 0,
            netWeightPerUnit: 0
        }
    });

    // Watch values for calculations
    const grossWeight = watch("grossWeight");
    const totalPackagingKg = watch("totalPackagingKg");
    const packagingUnits = watch("packagingUnits");

    // Reset form when modal opens with a new detail
    useEffect(() => {
        if (detail) {
            const defaultValues = {
                packagingUnits: detail.quantity,
                kgPerUnit: detail.storage_unit.weight_by_unit,
                totalPackagingKg: detail.quantity * detail.storage_unit.weight_by_unit,
                grossWeight: 0,
                netWeight: 0,
                netWeightPerUnit: 0
            };
            reset(defaultValues);
        }
    }, [detail, reset]);

    // Calculate net weight when gross weight or total packaging weight changes
    useEffect(() => {
        const netWeight = grossWeight - totalPackagingKg;
        setValue("netWeight", netWeight, { shouldValidate: true });
    }, [grossWeight, totalPackagingKg, setValue]);

    // Calculate net weight per unit when net weight or units change
    useEffect(() => {
        const netWeight = grossWeight - totalPackagingKg;
        const netWeightPerUnit = packagingUnits > 0 ? netWeight / packagingUnits : 0;
        setValue("netWeightPerUnit", netWeightPerUnit, { shouldValidate: true });
    }, [grossWeight, totalPackagingKg, packagingUnits, setValue]);

    const updateSummaryMutation = useMutation({
        mutationFn: updateOrderDetailSummary,
        onSuccess: () => {
            toast.success("Pesaje guardado correctamente");
            queryClient.invalidateQueries({ queryKey: ["order-details-with-summaries", detail?.order_id] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            
            if (detail) {
                const defaultValues = {
                    packagingUnits: detail.quantity,
                    kgPerUnit: detail.storage_unit.weight_by_unit,
                    totalPackagingKg: detail.quantity * detail.storage_unit.weight_by_unit,
                    grossWeight: 0,
                    netWeight: 0,
                    netWeightPerUnit: 0
                };
                reset(defaultValues);
            }
            
            modalModel.close();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const onSubmit = (data: WeightingFormData) => {
        if (!detail?.summary?.id || !detail?.order_id) {
            toast.error("No se encontró el resumen del pedido detalle");
            return;
        }

        updateSummaryMutation.mutate({
            summaryId: detail.summary.id,
            orderId: detail.order_id,
            measuredGrossWeight: data.grossWeight,
            measuredNetWeight: data.netWeight,
            billedProductPricePerKg: detail.summary.billed_product_price_per_kg
        });
    };

    return (
        <DaisyModal
            modalModel={modalModel}
            title="Pesaje de Pedido Detalle"
            size="xl"
            confirmText="Guardar Pesaje"
            onSubmit={handleSubmit(onSubmit)}
            loading={isSubmitting || updateSummaryMutation.isPending}
        >
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="packagingUnits"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Cantidad de Unidades"
                            badge={`${detail?.storage_unit.name}(s)`}
                            value={field.value}
                            disabled
                            error={errors.packagingUnits?.message}
                        />
                    )}
                />

                <Controller
                    name="kgPerUnit"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Kg por Unidad"
                            value={field.value}
                            disabled
                            step="0.01"
                            error={errors.kgPerUnit?.message}
                        />
                    )}
                />

                <Controller
                    name="totalPackagingKg"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Total Kg de Empaque"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            step="0.01"
                            error={errors.totalPackagingKg?.message}
                        />
                    )}
                />

                <Controller
                    name="grossWeight"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Peso Bruto (Kg)"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            step="0.01"
                            error={errors.grossWeight?.message}
                        />
                    )}
                />

                <Controller
                    name="netWeight"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Peso Neto (Kg)"
                            value={field.value}
                            disabled
                            error={errors.netWeight?.message}
                        />
                    )}
                />

                <Controller
                    name="netWeightPerUnit"
                    control={control}
                    render={({ field }) => (
                        <DaisyInput
                            type="number"
                            label="Peso Neto por Unidad (Kg)"
                            value={field.value}
                            disabled
                            error={errors.netWeightPerUnit?.message}
                        />
                    )}
                />
            </div>
        </DaisyModal>
    );
} 