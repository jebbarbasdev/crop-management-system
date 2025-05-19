'use client'

import GenericTitle from "@/app/_components/GenericTitle";
import { useState, useEffect, useMemo } from "react";
import OrderForm from "./OrderForm";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconPlus } from "@tabler/icons-react";
import OrderTable from "./OrderTable";
import { OrderDetail } from "./OrderTable/types/order.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../_services/createOrder";
import { toast } from "sonner";

// Tipo para el detalle de pedido que se enviará al servidor
type OrderDetailItem = {
    branchId: number;
    productId: number;
    quantity: number;
    unitId: number;
};

export default function OrdersClientPage() {
    const [orderDate, setOrderDate] = useState<string>("");
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetail>({});
    const queryClient = useQueryClient();

    // Transformar y validar los detalles del pedido
    const validOrderDetails = useMemo(() => {
        const details: OrderDetailItem[] = [];
        
        // Iterar sobre cada producto
        Object.entries(orderDetails).forEach(([productId, branches]) => {
            // Iterar sobre cada sucursal
            Object.entries(branches).forEach(([branchId, detail]) => {
                // Solo incluir si la cantidad es un número válido y mayor a 0
                if (typeof detail.quantity === 'number' && detail.quantity > 0) {
                    details.push({
                        branchId: Number(branchId),
                        productId: Number(productId),
                        quantity: detail.quantity,
                        unitId: detail.unitId
                    });
                }
            });
        });
        
        return details;
    }, [orderDetails]);

    // Verificar si hay al menos un detalle válido
    const hasValidDetails = useMemo(() => validOrderDetails.length > 0, [validOrderDetails]);

    useEffect(() => {
        // Set today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        setOrderDate(today);
    }, []);

    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            toast.success('Pedido creado exitosamente');
            // Limpiar el estado después de crear el pedido
            setOrderDetails({});
            setSelectedStoreId(null);
            // Invalidar la query de órdenes para que se actualice la tabla
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error) => {
            console.error('Error al crear el pedido:', error);
            toast.error('Error al crear el pedido');
        }
    });

    const handleSubmit = async () => {
        if (!hasValidDetails || !selectedStoreId) return;
        
        createOrderMutation.mutate({
            orderDate,
            storeId: selectedStoreId,
            orderDetails: validOrderDetails,
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <GenericTitle removeMargin>Pedidos</GenericTitle>
                
                <DaisyButton
                    variant="primary"
                    modifier="square"
                    tooltip="Realizar Pedido"
                    tooltipPlacement="left"
                    onClick={handleSubmit}
                    loading={createOrderMutation.isPending}
                    disabled={!orderDate || !selectedStoreId || createOrderMutation.isPending || !hasValidDetails}
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <OrderForm
                orderDate={orderDate}
                onOrderDateChange={setOrderDate}
                selectedStoreId={selectedStoreId}
                onStoreChange={setSelectedStoreId}
                isSubmitting={createOrderMutation.isPending}
            />

            {selectedStoreId && (
                <OrderTable 
                    storeId={selectedStoreId} 
                    onOrderDetailsChange={setOrderDetails}
                />
            )}
        </div>
    )
}