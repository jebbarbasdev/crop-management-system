import GenericTitle from "@/app/_components/GenericTitle";
import { OrderDetailWithSummary } from "../_services/getOrderDetailsWithSummaries";

interface WeighedSectionProps {
    details: OrderDetailWithSummary[];
    isLoading: boolean;
}

export default function WeighedSection({ details, isLoading }: WeighedSectionProps) {
    return (
        <div>
            <GenericTitle>Pesados</GenericTitle>
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