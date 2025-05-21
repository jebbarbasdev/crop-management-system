'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GenericTitle from "@/app/_components/GenericTitle";
import OrdersSection from "./OrdersSection";
import PendingSection from "./PendingSection";
import WeighedSection from "./WeighedSection";
import { getOrdersByDate, Order } from "../_services/getOrdersByDate";
import { getOrderDetailsWithSummaries, OrderDetailWithSummary } from "../_services/getOrderDetailsWithSummaries";

function getLocalToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function WeightingClientPage() {
    const [date, setDate] = useState(getLocalToday);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<OrderDetailWithSummary | null>(null);

    const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
        queryKey: ["orders-by-date", date],
        queryFn: () => getOrdersByDate(date),
    });

    const { data: orderDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ["order-details-with-summaries", selectedOrder?.id],
        queryFn: () => selectedOrder ? getOrderDetailsWithSummaries(selectedOrder.id) : null,
        enabled: !!selectedOrder,
    });

    // Reset selected detail when order changes
    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setSelectedDetail(null);
    };

    // Reset all states when weighting is completed
    const handleWeightingComplete = () => {
        setSelectedOrder(null);
        setSelectedDetail(null);
    };

    return (
        <div>
            <GenericTitle removeMargin>Pesaje</GenericTitle>
            <div className="grid grid-cols-3 gap-4">
                <OrdersSection
                    date={date}
                    onDateChange={setDate}
                    orders={orders}
                    onOrderClick={handleOrderClick}
                    selectedOrderId={selectedOrder?.id}
                    isLoading={isLoadingOrders}
                />

                <PendingSection 
                    details={orderDetails?.unweighted ?? []}
                    isLoading={isLoadingDetails}
                    selectedDetailId={selectedDetail?.id}
                    onDetailClick={setSelectedDetail}
                />
                
                <WeighedSection 
                    details={orderDetails?.weighted ?? []}
                    isLoading={isLoadingDetails}
                    orderId={selectedOrder?.id}
                    totalDetails={(orderDetails?.weighted?.length ?? 0) + (orderDetails?.unweighted?.length ?? 0)}
                    onComplete={handleWeightingComplete}
                />
            </div>
        </div>
    );
}