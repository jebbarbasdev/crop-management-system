import GenericTitle from "@/app/_components/GenericTitle";
import { OrderDetailWithSummary } from "../_services/getOrderDetailsWithSummaries";
import DaisyButton from "@/app/_components/DaisyButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import completeOrderWeighting from "../_services/completeOrderWeighting";

interface WeighedSectionProps {
    details: OrderDetailWithSummary[];
    isLoading: boolean;
    orderId?: number;
    totalDetails?: number;
    onComplete?: () => void;
}

export default function WeighedSection({ details, isLoading, orderId, totalDetails, onComplete }: WeighedSectionProps) {
    const queryClient = useQueryClient();

    const completeWeightingMutation = useMutation({
        mutationFn: async () => {
            if (!orderId) throw new Error("No se encontró el ID del pedido");
            await completeOrderWeighting(orderId);
        },
        onSuccess: async () => {
            try {
                // Invalidar las queries en paralelo
                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["orders-by-date"] }),
                    queryClient.invalidateQueries({ queryKey: ["order-details-with-summaries"] })
                ]);
                toast.success("Pesaje completado correctamente");
                onComplete?.();
            } catch (error) {
                console.error("Error al invalidar las queries:", error);
                toast.error("Error al actualizar la vista");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            completeWeightingMutation.reset();
        }
    });

    const canCompleteWeighting = orderId && totalDetails && details.length === totalDetails;

    return (
        <div>
            <GenericTitle>Pesados</GenericTitle>
            <div className="w-full mb-2">
                <DaisyButton
                    variant="primary"
                    onClick={() => completeWeightingMutation.mutate()}
                    loading={completeWeightingMutation.isPending}
                    disabled={completeWeightingMutation.isPending || !canCompleteWeighting}
                    title={!canCompleteWeighting ? "Todos los detalles deben estar pesados para completar el pesaje" : undefined}
                    className="w-full"
                >
                    Completar Pesaje
                </DaisyButton>
            </div>
            <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
                <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                    <thead>
                        <tr className="bg-primary text-primary-content">
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Empaque</th>
                            <th>Peso Bruto</th>
                            <th>Peso Neto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 text-sm">Cargando...</td>
                            </tr>
                        ) : details.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 text-sm">No hay productos pesados.</td>
                            </tr>
                        ) : (
                            details.map(detail => (
                                <tr key={detail.id}>
                                    <td>{detail.product.name}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.storage_unit.name}</td>
                                    <td>{detail.summary.measured_gross_weight.toFixed(2)} kg</td>
                                    <td>{detail.summary.measured_net_weight.toFixed(2)} kg</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 