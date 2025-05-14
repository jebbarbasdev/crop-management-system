import { useQuery } from "@tanstack/react-query"
import getOrders, { Order } from "../_services/getOrders"
import formatAt from "@/app/_utilities/formatAt"
import formatBy from "@/app/_utilities/formatBy"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconPencil, IconTrash, IconEye } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import DaisyTable from "@/app/_components/DaisyTable"
import { useMemo } from "react"

export interface OrdersTableProps {
    onViewOrderClick: (order: Order) => any
}

function getEstadoColor(estado: string) {
    switch (estado) {
        case "CREADO":
            return "bg-gray-200 text-gray-800"; // Estado inicial, neutro
        case "EN_PESAJE":
            return "bg-yellow-100 text-yellow-700"; // Advertencia o proceso en curso
        case "PESADO":
            return "bg-orange-300 text-orange-900"; // Estado de alerta leve
        case "EN_REVISION":
            return "bg-blue-100 text-blue-700"; // Proceso en progreso
        case "ENVIADO":
            return "bg-indigo-300 text-indigo-900"; // Acción en curso, importante
        case "RECIBIDO":
            return "bg-green-300 text-green-900"; // Completado o exitoso
        case "PAGADO":
            return "bg-teal-300 text-teal-900"; // Pagado, estado satisfactorio
        case "CERRADO":
            return "bg-red-300 text-red-900"; // Finalizado o cerrado
        default:
            return "bg-gray-100 text-gray-500"; // Estado desconocido
    }
}



export default function OrdersTable({
    onViewOrderClick
}: OrdersTableProps) {
    const columns: ColumnDef<Order>[] = useMemo(() => [
        {
            accessorKey: 'id',
            header: () => '#N PEDIDO',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'branch_id',
            header: () => 'Sucursal',
            cell: ({ row }) => row.original.branches?.sd_name || row.original.branch_id
        },
        {
            accessorKey: 'delivery_date',
            header: () => 'Fecha Entrega',
            cell: ({ getValue }) => getValue() ? new Date(getValue<string>()).toLocaleDateString() : ''
        },
        {
            accessorKey: 'status',
            header: () => 'Estado',
            cell: ({ row }) => {
                const estado = row.original.estates?.Estates || row.original.status;
                const colorClass = getEstadoColor(String(estado));
                return (
                    <span className={`px-2 py-1 rounded font-bold ${colorClass}`}>
                        {estado}
                    </span>
                );
            }
        },
        {
            id: 'actions',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center items-center">
                    <DaisyButton
                        variant="info"
                        modifier="square"
                        tooltip="Ver Detalles"
                        tooltipPlacement="left"
                        onClick={() => onViewOrderClick(row.original)}
                    >
                        <IconEye size={24} />
                    </DaisyButton>
                </div>
            )
        }
    ], [onViewOrderClick])

    const { data, error, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: getOrders
    })

    return (
        <DaisyTable columns={columns} data={data ?? []} isLoading={isLoading} error={error} />
    )
}