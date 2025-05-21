import GenericTitle from "@/app/_components/GenericTitle";
import { OrderDetailWithSummary } from "../_services/getOrderDetailsWithSummaries";
import clsx from "clsx";
import useModal from "@/app/_hooks/useModal";
import { useState } from "react";
import PendingDetailModal from "./PendingDetailModal";

interface PendingSectionProps {
    details: OrderDetailWithSummary[];
    isLoading: boolean;
    selectedDetailId?: number;
    onDetailClick?: (detail: OrderDetailWithSummary) => void;
}

export default function PendingSection({ 
    details, 
    isLoading, 
    selectedDetailId,
    onDetailClick 
}: PendingSectionProps) {
    const [selectedDetail, setSelectedDetail] = useState<OrderDetailWithSummary | null>(null);
    const detailModal = useModal();

    const handleDetailClick = (detail: OrderDetailWithSummary) => {
        setSelectedDetail(detail);
        detailModal.open();
        onDetailClick?.(detail);
    };

    return (
        <div>
            <GenericTitle>Pendientes</GenericTitle>
            <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
                <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                    <thead>
                        <tr className="bg-primary text-primary-content">
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Empaque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="text-center text-gray-400 text-sm">Cargando...</td>
                            </tr>
                        ) : details.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center text-gray-400 text-sm">No hay productos pendientes de pesar.</td>
                            </tr>
                        ) : (
                            details.map(detail => (
                                <tr
                                    key={detail.id}
                                    className={clsx(
                                        selectedDetailId === detail.id 
                                            ? '!bg-blue-600 !text-white hover:!bg-blue-700 cursor-pointer' 
                                            : 'hover:!bg-base-300 cursor-pointer'
                                    )}
                                    onClick={() => handleDetailClick(detail)}
                                >
                                    <td>{detail.product.name}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.storage_unit.name}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <PendingDetailModal 
                modalModel={detailModal}
                detail={selectedDetail}
            />
        </div>
    );
} 