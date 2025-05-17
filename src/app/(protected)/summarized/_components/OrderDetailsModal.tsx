import DaisyModal from "@/app/_components/DaisyModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getOrderDetails from "../_services/getOrderDetails";
import { Order } from "../_services/getOrders";
import { useState, useEffect, useCallback } from "react";
import getOrderProductPrices from "../_services/getOrderProductPrices";
import getOrderDetailSummaries from "../_services/getOrderDetailSummaries";
import updateOrderStatus from "../_services/updateOrderStatus";
import { toast } from "sonner";
import upsertOrderDetailSummariesManual from "../_services/upsertOrderDetailSummaries";
import { getEstadoColor } from "@/app/(protected)/summarized/_services/statusColors";

interface OrderDetailsModalProps {
    modalModel: ReturnType<typeof import("@/app/_hooks/useModal").default>;
    order: Order | null;
}

interface ProductPrice {
    product_name: string;
    price_per_kg: number;
    store_name: string;
}

export default function OrderDetailsModal({ modalModel, order }: OrderDetailsModalProps) {
    const queryClient = useQueryClient();
    const [localDetails, setLocalDetails] = useState<any[]>([]);
    const [localPrices, setLocalPrices] = useState<ProductPrice[]>([]);
    const [localSummaries, setLocalSummaries] = useState<any[]>([]);
    const [editableSummaries, setEditableSummaries] = useState<any[]>([]);
    const [inputsDisabled, setInputsDisabled] = useState(false);
    const [storeInputsEditable, setStoreInputsEditable] = useState(false);

    const ESTATE_ID_TO_TEXT: Record<number, string> = {
        1: 'CREADO',
        2: 'EN_PESAJE',
        3: 'PESADO',
        4: 'EN_REVISION',
        5: 'ENVIADO',
        6: 'RECIBIDO',
        7: 'CERRADO',
        8: 'PAGADO',
    };
    const NEXT_STATUS_ID: Record<number, { id: number, text: string }> = {
        4: { id: 5, text: 'Completar Revisión' },    
        5: { id: 6, text: 'Registrar Recibido' },    
        6: { id: 7, text: 'Cerrar Pedido' },         
        7: { id: 8, text: 'Registrar Pago' },        
    };

    const currentStatusId = order?.status ?? 0;
    const next = NEXT_STATUS_ID[currentStatusId];

    const loadSummaries = useCallback(async () => {
        if (!order?.id) return;
        try {
            const summariesData = await getOrderDetailSummaries(order.id);
            setLocalSummaries(summariesData);
            setEditableSummaries(summariesData.map(s => ({ ...s })));
            return summariesData;
        } catch (error) {
            console.error("Error loading summaries:", error);
            return [];
        }
    }, [order?.id]);

    const loadAllData = useCallback(async () => {
        if (!order?.id || !order?.branch_id) return;
        try {
            await loadSummaries();
            const [detailsData, pricesData] = await Promise.all([
                getOrderDetails(order.id, order.branch_id),
                getOrderProductPrices(order.id, order.branches?.sd_name || "")
            ]);
            setLocalDetails(detailsData);
            setLocalPrices(pricesData);
            queryClient.setQueryData(["order_details", order.id, order.branch_id], detailsData);
            queryClient.setQueryData(["order_product_prices", order.id, order.branches?.sd_name], pricesData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [order?.id, order?.branch_id, order?.branches?.sd_name, queryClient, loadSummaries]);

    useEffect(() => {
        if (order?.id) {
            loadAllData();
        }
    }, [order?.id, loadAllData]);

    useEffect(() => {
        if (localDetails.length > 0) {
            const summariesByDetailId = Object.fromEntries((localSummaries || []).map(s => [s.order_detail_id, s]));
            const mergedSummaries = localDetails.map(detail => {
                const summary = summariesByDetailId[detail.id] || {};
                let suggestedPrice = '';
                if (Array.isArray(localPrices)) {
                    const priceObj = localPrices.find(
                        p => p.product_name?.trim().toLowerCase() === detail.products?.name?.trim().toLowerCase() &&
                             p.store_name?.trim().toLowerCase() === (order?.branches?.sd_name || '').trim().toLowerCase()
                    ) || localPrices.find(
                        p => p.product_name?.trim().toLowerCase() === detail.products?.name?.trim().toLowerCase()
                    );
                    if (priceObj) suggestedPrice = String(priceObj.price_per_kg);
                }
                const billedPrice = summary.billed_product_price_per_kg !== undefined && summary.billed_product_price_per_kg !== ''
                    ? summary.billed_product_price_per_kg
                    : suggestedPrice;
                const pricePerKg = Number(billedPrice) || 0;
                return {
                    order_detail_id: detail.id,
                    billed_product_price_per_kg: billedPrice,
                    billed_gross_weight: summary.billed_gross_weight ?? '',
                    billed_net_weight: summary.billed_net_weight ?? '',
                    billed_profit: (pricePerKg * (Number(summary.billed_net_weight) || 0)).toString(),
                    measured_gross_weight: summary.measured_gross_weight ?? '',
                    measured_net_weight: summary.measured_net_weight ?? '',
                    measured_profit: (pricePerKg * (Number(summary.measured_net_weight) || 0)).toString(),
                    store_gross_weight: summary.store_gross_weight ?? '',
                    store_net_weight: summary.store_net_weight ?? '',
                    store_profit: (pricePerKg * (Number(summary.store_net_weight) || 0)).toString(),
                };
            });
            setEditableSummaries(mergedSummaries);
        }
    }, [localDetails.length, localSummaries.length]);

    useEffect(() => {
        setInputsDisabled(false);
    }, [order?.id]);

    useEffect(() => {
        if (currentStatusId === 7) {
            setStoreInputsEditable(false);
        }
    }, [currentStatusId]);

    const storeName = order?.branches?.sd_name || "";
    const { data: prices = [], isLoading: isLoadingPrices, error: errorPrices, refetch: refetchPrices } = useQuery<ProductPrice[]>({
        queryKey: ["order_product_prices", order?.id, storeName],
        queryFn: () => order ? getOrderProductPrices(order.id, storeName) : [],
        enabled: !!order && !!storeName,
        staleTime: 0,
        gcTime: 0,
    });

    const { data: summaries = [], isLoading: isLoadingSummaries, error: errorSummaries, refetch: refetchSummaries } = useQuery({
        queryKey: ["order_detail_summaries", order?.id],
        queryFn: () => order ? getOrderDetailSummaries(order.id) : [],
        enabled: !!order,
        staleTime: 0,
        gcTime: 0,
    });

    const [form, setForm] = useState({
        order_detail_id: "",
        billed_product_price_per_kg: "",
        billed_gross_weight: "",
        billed_net_weight: "",
        billed_profit: "",
        measured_gross_weight: "",
        measured_net_weight: "",
        measured_profit: "",
        store_gross_weight: "",
        store_net_weight: "",
        store_profit: ""
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);


    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const totalPages = Math.ceil((localDetails?.length ?? 0) / pageSize);
    const paginatedDetails = (localDetails ?? []).slice(page * pageSize, (page + 1) * pageSize);

    
    const shouldDisableInputs = (field: string) => {
        if (field.includes('profit')) {
            return true;
        }
        if (currentStatusId === 4) {
            return !field.startsWith('billed_');
        }
        
        if (currentStatusId === 6 && storeInputsEditable) {
            return !field.startsWith('store_');
        }
        
        return true;
    };

    const handleStatusChange = async () => {
        if (!order?.id || !next) return;
        setLoading(true);

        try {
            if (next.id === 6 && !storeInputsEditable) {
                setStoreInputsEditable(true);
                setLoading(false);
                return;
            }

            if (currentStatusId === 4 && next.id === 5) {
                const summariesToSave = localDetails.map(detail => {
                    const summary = editableSummaries.find(s => s.order_detail_id === detail.id) || {};
                    const price = localPrices.find(
                        p => p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase() &&
                            p.store_name.trim().toLowerCase() === storeName.trim().toLowerCase()
                    ) || localPrices.find(
                        p => p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase()
                    );
                    
                    return {
                        order_detail_id: detail.id,
                        billed_product_price_per_kg: Number(summary.billed_product_price_per_kg) || Number(price?.price_per_kg) || 0,
                        billed_gross_weight: Number(summary.billed_gross_weight) || 0,
                        billed_net_weight: Number(summary.billed_net_weight) || 0,
                        billed_profit: Number(summary.billed_profit) || 0,
                        measured_gross_weight: Number(summary.measured_gross_weight) || 0,
                        measured_net_weight: Number(summary.measured_net_weight) || 0,
                        measured_profit: Number(summary.measured_profit) || 0,
                        store_gross_weight: Number(summary.store_gross_weight) || 0,
                        store_net_weight: Number(summary.store_net_weight) || 0,
                        store_profit: Number(summary.store_profit) || 0
                    };
                });
                await upsertOrderDetailSummariesManual(summariesToSave);
                toast.success('Datos de revisión guardados correctamente');
            }

            if (currentStatusId === 6 && next.id === 7) {
                const summariesToSave = localDetails.map(detail => {
                    const summary = editableSummaries.find(s => s.order_detail_id === detail.id) || {};
                    const price = localPrices.find(
                        p => p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase() &&
                            p.store_name.trim().toLowerCase() === storeName.trim().toLowerCase()
                    ) || localPrices.find(
                        p => p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase()
                    );
                    
                    return {
                        order_detail_id: detail.id,
                        billed_product_price_per_kg: Number(summary.billed_product_price_per_kg) || Number(price?.price_per_kg) || 0,
                        billed_gross_weight: Number(summary.billed_gross_weight) || 0,
                        billed_net_weight: Number(summary.billed_net_weight) || 0,
                        billed_profit: Number(summary.billed_profit) || 0,
                        measured_gross_weight: Number(summary.measured_gross_weight) || 0,
                        measured_net_weight: Number(summary.measured_net_weight) || 0,
                        measured_profit: Number(summary.measured_profit) || 0,
                        store_gross_weight: Number(summary.store_gross_weight) || 0,
                        store_net_weight: Number(summary.store_net_weight) || 0,
                        store_profit: Number(summary.store_profit) || 0
                    };
                });
                await upsertOrderDetailSummariesManual(summariesToSave);
                toast.success('Datos de store guardados correctamente');
            }

            await updateOrderStatus(order.id, next.id);
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await loadSummaries();
            await loadAllData();
            toast.success(`Estado actualizado a ${next.text} correctamente`);
            modalModel.close();
        } catch (err: any) {
            toast.error(`Error al actualizar el estado: ${err.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    
    const handleSummaryChange = (order_detail_id: number, field: string, value: string) => {
        setEditableSummaries(prev => {
            const updatedSummaries = prev.map(summary => {
                if (summary.order_detail_id === order_detail_id) {
                    
                    const updatedSummary = { 
                        ...summary,
                        [field]: value === '' ? '' : value 
                    };
                    
                    
                    const pricePerKg = Number(updatedSummary.billed_product_price_per_kg) || 0;
                    
                    
                    if (field === 'billed_product_price_per_kg' || field === 'billed_net_weight') {
                        const netWeight = Number(updatedSummary.billed_net_weight) || 0;
                        updatedSummary.billed_profit = (pricePerKg * netWeight).toString();
                    }
                    
        
                    if (field === 'billed_product_price_per_kg' || field === 'measured_net_weight') {
                        const netWeight = Number(updatedSummary.measured_net_weight) || 0;
                        updatedSummary.measured_profit = (pricePerKg * netWeight).toString();
                    }
                    
                
                    if (field === 'billed_product_price_per_kg' || field === 'store_net_weight') {
                        const netWeight = Number(updatedSummary.store_net_weight) || 0;
                        updatedSummary.store_profit = (pricePerKg * netWeight).toString();
                    }
                    
                    return updatedSummary;
                }
                return summary;
            });
            return updatedSummaries;
        });
    };

    const handleDetailSelect = (detailId: string) => {
        const selectedDetail = localDetails?.find(d => d.id === Number(detailId));
        if (selectedDetail) {
            const price = localPrices.find(p => p.product_name === selectedDetail.products?.name);
            setForm(prev => ({
                ...prev,
                order_detail_id: detailId,
                billed_product_price_per_kg: price?.price_per_kg?.toString() || ""
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "order_detail_id") {
            handleDetailSelect(value);
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const uniqueSummaries = Array.from(
        new Map(editableSummaries.map(s => [s.order_detail_id, s])).values()
    );

    
    const tableData = localDetails?.map((detail: any) => {
        const summary = uniqueSummaries.find((s: any) => s.order_detail_id === detail.id) || {};
        let price = localPrices.find(
            (p: ProductPrice) =>
                p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase() &&
                p.store_name.trim().toLowerCase() === storeName.trim().toLowerCase()
        );
        if (!price) {
            price = localPrices.find(
                (p: ProductPrice) =>
                    p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase()
            );
        }
        return {
            id: detail.id,
            product: detail.products?.name,
            price_per_kg: price ? price.price_per_kg : '-',
            quantity: detail.quantity,
            packaging: detail.storage_units?.name,
            ...summary
        };
    }) || [];

    const isLoadingDetails = localDetails.length === 0 || isLoadingSummaries || isLoadingPrices;

    const nextStatusText = next ? ESTATE_ID_TO_TEXT[next.id] : '';

    return (
        <DaisyModal
            modalModel={modalModel}
            title={`Detalles del pedido #${order?.id ?? ""}`}
        >
            {isLoadingDetails ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <span className="loading loading-spinner loading-lg mb-2"></span>
                    <span className="text-lg font-semibold">Cargando detalles de pedido...</span>
                </div>
            ) : (
                <>
                    <div className="space-y-4 max-w-[90vw] max-h-[80vh]">
                            <div className="flex justify-start mb-2">
                            <select className="select select-xs w-28" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}>
                                {[5, 10, 25, 50].map(size => <option key={size} value={size}>{size} por página</option>)}
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra table-pin-rows text-center whitespace-nowrap border border-base-300 w-full">
                                <thead>
                                    <tr className="bg-primary text-primary-content">
                                        <th colSpan={5} className="text-center">Datos Generales</th>
                                        <th colSpan={3} className="text-center">Billed</th>
                                        <th colSpan={3} className="text-center">Measured</th>
                                        <th colSpan={3} className="text-center">Store</th>
                                    </tr>
                                    <tr className="bg-base-200">
                                        <th>ID Detalle</th>
                                        <th>Producto</th>
                                        
                                        <th>Cantidad</th>
                                        <th>Unidad de Empaque</th>
                                        <th>Precio por kg</th>
                                        <th>Peso Bruto</th>
                                        <th>Peso Neto</th>
                                        <th>Ganancia</th>
                                        <th>Peso Bruto</th>
                                        <th>Peso Neto</th>
                                        <th>Ganancia</th>
                                        <th>Peso Bruto</th>
                                        <th>Peso Neto</th>
                                        <th>Ganancia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedDetails.map((detail: any, idx: number)  => {
                                        const isEven = idx % 2 === 0;
                                        const inputBg = isEven ? 'bg-white' : 'bg-base-200';
                                        let price = prices.find(
                                            (p: ProductPrice) =>
                                                p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase() &&
                                                p.store_name.trim().toLowerCase() === storeName.trim().toLowerCase()
                                        );
                                        if (!price) {
                                            price = prices.find(
                                                (p: ProductPrice) =>
                                                    p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase()
                                            );
                                        }
                                        const summary = editableSummaries.find((s: any) => s.order_detail_id === detail.id) || {};
                                        return (
                                            <tr key={detail.id} className="hover:bg-base-300">
                                                <td>{detail.id}</td>
                                                <td>{detail.products?.name}</td>
                                                
                                                <td>{detail.quantity}</td>
                                        
                                                <td>{detail.storage_units?.name}</td>
                                                <td>
                                                    {shouldDisableInputs('billed_product_price_per_kg') ? (
                                                        <span className={`block w-20 text-black text-center ${inputBg}`}>
                                                            {Number(summary.billed_product_price_per_kg ?? price?.price_per_kg ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                        </span>
                                                    ) : (
                                                        <input 
                                                            type="number" 
                                                            value={summary.billed_product_price_per_kg ?? price?.price_per_kg ?? ''} 
                                                            onChange={e => handleSummaryChange(detail.id, 'billed_product_price_per_kg', e.target.value)} 
                                                            className={`input input-xs w-20 text-black ${shouldDisableInputs('billed_product_price_per_kg') ? inputBg : ''}`} 
                                                            disabled={shouldDisableInputs('billed_product_price_per_kg')}
                                                            placeholder="0.00"
                                                        />
                                                    )}
                                                </td>
                                                {/* Billed */}
                                                <td>{shouldDisableInputs('billed_gross_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.billed_gross_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.billed_gross_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'billed_gross_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('billed_gross_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('billed_gross_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('billed_net_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.billed_net_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.billed_net_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'billed_net_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('billed_net_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('billed_net_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('billed_profit') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>
                                                        {Number(summary.billed_profit ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                    </span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.billed_profit ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'billed_profit', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('billed_profit') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('billed_profit')}
                                                        placeholder="0.00"
                                                    />
                                                )}</td>
                                                {/* Measured */}
                                                <td>{shouldDisableInputs('measured_gross_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.measured_gross_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.measured_gross_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'measured_gross_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('measured_gross_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('measured_gross_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('measured_net_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.measured_net_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.measured_net_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'measured_net_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('measured_net_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('measured_net_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('measured_profit') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>
                                                        {Number(summary.measured_profit ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                    </span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.measured_profit ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'measured_profit', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('measured_profit') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('measured_profit')}
                                                        placeholder="0.00"
                                                    />
                                                )}</td>
                                                {/* Store */}
                                                <td>{shouldDisableInputs('store_gross_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.store_gross_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.store_gross_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'store_gross_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('store_gross_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('store_gross_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('store_net_weight') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>{`${Number(summary.store_net_weight ?? 0)} kg`}</span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.store_net_weight ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'store_net_weight', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('store_net_weight') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('store_net_weight')}
                                                        placeholder="0"
                                                    />
                                                )}</td>
                                                <td>{shouldDisableInputs('store_profit') ? (
                                                    <span className={`block w-20 text-black text-center ${inputBg}`}>
                                                        {Number(summary.store_profit ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                                    </span>
                                                ) : (
                                                    <input 
                                                        type="number" 
                                                        value={summary.store_profit ?? ''} 
                                                        onChange={e => handleSummaryChange(detail.id, 'store_profit', e.target.value)} 
                                                        className={`input input-xs w-20 text-black ${shouldDisableInputs('store_profit') ? inputBg : ''}`} 
                                                        disabled={shouldDisableInputs('store_profit')}
                                                        placeholder="0.00"
                                                    />
                                                )}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <button className="btn btn-xs" onClick={() => setPage(0)} disabled={page === 0}>{"<<"}</button>
                                <button className="btn btn-xs" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>{"<"}</button>
                                <span className="mx-2">Página {page + 1} de {totalPages}</span>
                                <button className="btn btn-xs" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>{">"}</button>
                                <button className="btn btn-xs" onClick={() => setPage(totalPages - 1)} disabled={page === totalPages - 1}>{">>"}</button>
                            </div>
                        </div>

                
                        <div className="flex justify-end mt-4">
                            {next ? (
                                <button
                                    type="button"
                                    className={`btn ${getEstadoColor(nextStatusText || '')} ${loading ? 'loading' : ''}`}
                                    onClick={handleStatusChange}
                                    disabled={loading}
                                >
                                    {loading ? 'Actualizando...' : next.text}
                                </button>
                            ) : currentStatusId === 8 ? (
                                <button className="btn btn-disabled" disabled>Pagado</button>
                            ) : null}
                        </div>
                        <div className="mb-2 text-xs text-gray-500">
                            Estado Actual: {order?.estates?.Estates || order?.status}
                        </div>
                    </div>
                </>
            )}
        </DaisyModal>
    );
}