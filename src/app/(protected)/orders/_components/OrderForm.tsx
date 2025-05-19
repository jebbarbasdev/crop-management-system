'use client'

import React from "react";
import { useQuery } from "@tanstack/react-query";
import DaisyInput from "@/app/_components/DaisyInput";
import DaisySelect from "@/app/_components/DaisySelect";
import { getStoresForSelect } from "../_services/getAllStores";
import { getBranchesForSelect } from "../_services/getBranchesByStore";

export type BranchSelectOption = {
    value: number;
    label: string;
};

export type OrderFormProps = {
    orderDate: string;
    onOrderDateChange: (date: string) => void;
    selectedStoreId: number | null;
    onStoreChange: (storeId: number | null) => void;
    isSubmitting: boolean;
};

export default function OrderForm({
    orderDate,
    onOrderDateChange,
    selectedStoreId,
    onStoreChange,
    isSubmitting
}: OrderFormProps) {
    // Fetch stores using React Query
    const { data: stores = [], isLoading: isLoadingStores } = useQuery({
        queryKey: ['stores'],
        queryFn: getStoresForSelect
    });

    const loading = isSubmitting || isLoadingStores;

    return (
        <div className="flex items-center gap-4 mb-4">
            <DaisyInput
                type="date"
                label="Fecha del Pedido"
                placeholder="Fecha del Pedido"
                value={orderDate}
                onChange={(e) => onOrderDateChange(e.target.value)}
                disabled={loading}
            />

            <DaisySelect
                label="Tienda"
                placeholder="Seleccione una tienda"
                options={stores}
                value={selectedStoreId ?? undefined}
                onChange={(e) => onStoreChange(parseInt(e.target.value))}
                disabled={loading}
            />
        </div>
    );
} 