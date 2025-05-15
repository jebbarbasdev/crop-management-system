import DaisyModal from "@/app/_components/DaisyModal";
import { useQuery } from "@tanstack/react-query";
import getOrderDetails from "../_services/getOrderDetails";
import { Order } from "../_services/getOrders";
import { useState } from "react";
import insertOrderDetailSummary from "../_services/insertOrderDetailSummary";
import getOrderProductPrices from "../_services/getOrderProductPrices";

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
    const { data: details, isLoading, error } = useQuery({
        queryKey: ["order_details", order?.id, order?.branch_id],
        queryFn: () => order ? getOrderDetails(order.id, order.branch_id) : [],
        enabled: !!order
    });

    const storeName = order?.branches?.sd_name || "";
    const { data: prices = [], isLoading: isLoadingPrices, error: errorPrices } = useQuery<ProductPrice[]>({
        queryKey: ["order_product_prices", order?.id, storeName],
        queryFn: () => order ? getOrderProductPrices(order.id, storeName) : [],
        enabled: !!order && !!storeName
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

    const handleDetailSelect = (detailId: string) => {
        const selectedDetail = details?.find(d => d.id === Number(detailId));
        if (selectedDetail) {
            const price = prices.find(p => p.product_name === selectedDetail.products?.name);
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

    const handleSubmit = async () => {
        if (!details || !order) return;
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            await insertOrderDetailSummary({
                ...form,
                order_detail_id: Number(form.order_detail_id),
                billed_product_price_per_kg: Number(form.billed_product_price_per_kg),
                billed_gross_weight: Number(form.billed_gross_weight),
                billed_net_weight: Number(form.billed_net_weight),
                billed_profit: Number(form.billed_profit),
                measured_gross_weight: Number(form.measured_gross_weight),
                measured_net_weight: Number(form.measured_net_weight),
                measured_profit: Number(form.measured_profit),
                store_gross_weight: Number(form.store_gross_weight),
                store_net_weight: Number(form.store_net_weight),
                store_profit: Number(form.store_profit)
            });
            setSuccessMsg("¡Resumen insertado correctamente!");
            setForm({
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
        } catch (err: any) {
            setErrorMsg(err.message);
        }
        setLoading(false);
    };

    // DEBUG: Mostrar en consola los datos de precios y detalles
    if (typeof window !== 'undefined') {
        console.log('Detalles:', details);
        console.log('Precios:', prices);
    }

    return (
        <DaisyModal
            modalModel={modalModel}
            title={`Detalles del pedido #${order?.id ?? ""}`}
        >
            {isLoading && <div>Cargando detalles...</div>}
            {error && <div className="text-error">Error: {error.message}</div>}
            {!isLoading && details && (
                <>
                    <div className="space-y-4">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID Detalle</th>
                                    <th>Producto</th>
                                    <th>Precio por kg</th>
                                    <th>Cantidad</th>
                                    <th>Unidad de Empaque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.map((detail: any)  => {
                                    // Busca el precio correspondiente al producto y tienda
                                    let price = prices.find(
                                        (p: ProductPrice) =>
                                            p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase() &&
                                            p.store_name.trim().toLowerCase() === storeName.trim().toLowerCase()
                                    );
                                    // Si no encuentra por tienda, busca solo por producto
                                    if (!price) {
                                        price = prices.find(
                                            (p: ProductPrice) =>
                                                p.product_name.trim().toLowerCase() === detail.products?.name.trim().toLowerCase()
                                        );
                                    }
                                    return (
                                        <tr key={detail.id}>
                                            <td>{detail.id}</td>
                                            <td>{detail.products?.name}</td>
                                            <td>{price ? price.price_per_kg : '-'}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{detail.storage_units?.name}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </DaisyModal>
    );
}