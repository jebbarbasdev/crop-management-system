import GenericTitle from "@/app/_components/GenericTitle";
import DaisyInput from "@/app/_components/DaisyInput";
import { Order } from "../_services/getOrdersByDate";
import clsx from "clsx";

interface OrdersSectionProps {
    date: string;
    onDateChange: (date: string) => void;
    orders: Order[];
    onOrderClick?: (order: Order) => void;
    selectedOrderId?: number;
}

export default function OrdersSection({ date, onDateChange, orders, onOrderClick, selectedOrderId }: OrdersSectionProps) {
    return (
        <div>
            <GenericTitle>Pedidos</GenericTitle>
            <div className="mb-4 w-60">
                <DaisyInput
                    type="date"
                    label="Fecha"
                    value={date}
                    onChange={e => onDateChange(e.target.value)}
                />
            </div>
            <div>
                <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
                    <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                        <thead>
                            <tr className="bg-primary text-primary-content">
                                <th>#</th>
                                <th>Tienda</th>
                                <th>Sucursal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400 text-sm">No hay pedidos para esta fecha.</td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr
                                        key={order.id}
                                        className={clsx(
                                            selectedOrderId === order.id 
                                                ? '!bg-blue-600 !text-white hover:!bg-blue-700 cursor-pointer' 
                                                : 'hover:!bg-base-300 cursor-pointer'
                                        )}
                                        onClick={() => onOrderClick?.(order)}
                                    >
                                        <td>{order.id}</td>
                                        <td>{order.branch?.store?.name ?? '—'}</td>
                                        <td>{order.branch?.sd_name ?? '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 