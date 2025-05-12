import { useQuery } from "@tanstack/react-query"
import { Store } from "../_services/getStores"
import formatAt from "@/app/_utilities/formatAt"
import formatBy from "@/app/_utilities/formatBy"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import DaisyTable from "@/app/_components/DaisyTable"
import { useMemo } from "react"
import getBranches, { Branch } from "../_services/getBranches"

export interface BranchesTableProps {
    store: Store|null
    onEditBranchClick: (branch: Branch) => any
    onDeleteBranchClick: (branch: Branch) => any
}

export default function BranchesTable({
    store,
    onEditBranchClick,
    onDeleteBranchClick
}: BranchesTableProps) {
    const columns: ColumnDef<Branch>[] = useMemo(() => [
        {
            accessorKey: 'sd_name',
            header: () => 'Nombre',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'sd_number',
            header: () => 'Número de Sucursal',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'created_at',
            header: () => 'Creado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'created_by',
            accessorFn: row => formatBy(row.created_by),
            header: () => 'Creado Por',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'updated_at',
            header: () => 'Actualizado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'updated_by',
            accessorFn: row => formatBy(row.updated_by),
            header: () => 'Actualizado Por',
            cell: ({ getValue }) => getValue()
        },
        {
            id: 'actions',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center items-center">
                    <DaisyButton
                        variant="warning"
                        modifier="square"
                        tooltip="Editar Sucursal"
                        tooltipPlacement="left"

                        onClick={() => onEditBranchClick(row.original)}
                    >
                        <IconPencil size={24} />
                    </DaisyButton>

                    <DaisyButton
                        variant="error"
                        modifier="square"
                        tooltip="Eliminar Sucursal"
                        tooltipPlacement="left"

                        onClick={() => onDeleteBranchClick(row.original)}
                    >
                        <IconTrash size={24} />
                    </DaisyButton>
                </div>
            )
        }
    ], [onEditBranchClick, onDeleteBranchClick])

    const { data, error, isLoading } = useQuery({
        queryKey: ['branches', store?.id],
        queryFn: () => getBranches(store!.id),
        enabled: !!store
    })

    console.log(data)

    return (
        <DaisyTable 
            columns={columns} 
            data={data ?? []} 
            isLoading={isLoading} 
            error={error} 
        />
    )
}