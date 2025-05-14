'use client'

import DaisyButton from "@/app/_components/DaisyButton";
import GenericTitle from "@/app/_components/GenericTitle";
import { IconPlus } from "@tabler/icons-react";
import OrdersTable from "./OrdersTable";
import { Order } from "../_services/getOrders";
import useModal from "@/app/_hooks/useModal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getOrders from "../_services/getOrders";
import OrderDetailsModal from "./OrderDetailsModal";

export default function SummarizedClientPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const orderModal = useModal();
    const deleteOrderModal = useModal();
    const detailsModal = useModal();

    const { data: orders = [], isLoading } = useQuery<Order[]>({
        queryKey: ['orders'],
        queryFn: getOrders
    });

    const onEditOrderClick = (order: Order) => {
        setSelectedOrder(order);
        orderModal.open();
    };

    const onDeleteOrderClick = (order: Order) => {
        setSelectedOrder(order);
        deleteOrderModal.open();
    };

    const onViewOrderClick = (order: Order) => {
        setSelectedOrder(order);
        detailsModal.open();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <GenericTitle removeMargin>Sumarizado</GenericTitle>
                <DaisyButton
                    variant="primary"
                    modifier="square"
                    tooltip="Crear Orden"
                    tooltipPlacement="left"
                    // onClick={onCreateOrderClick} // Si tienes lógica para crear
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <OrdersTable 
                onViewOrderClick={onViewOrderClick}
            />
            <OrderDetailsModal modalModel={detailsModal} order={selectedOrder} />
            {/* Aquí puedes agregar modales para editar/eliminar si los tienes */}
        </div>
    );
}