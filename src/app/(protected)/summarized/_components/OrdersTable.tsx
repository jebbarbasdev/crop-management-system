import { useQuery } from "@tanstack/react-query"
import getOrders, { Order } from "../_services/getOrders"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconPencil, IconTrash, IconEye } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import DaisyTable from "@/app/_components/DaisyTable"
import { useMemo } from "react"
import { getEstadoColor } from "@/app/(protected)/summarized/_services/statusColors"

export interface OrdersTableProps {
    onViewOrderClick: (order: Order) => any
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
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return '';
                const [year, month, day] = value.split('-').map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString();
            }
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
                        variant="secondary"
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