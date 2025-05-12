import { useQuery } from "@tanstack/react-query"
import getStores, { Store } from "../_services/getStores"
import formatAt from "@/app/_utilities/formatAt"
import formatBy from "@/app/_utilities/formatBy"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import DaisyTable from "@/app/_components/DaisyTable"
import { useMemo } from "react"

export interface StoresTableProps {
    onSelectStore: (store: Store|null) => any
    onEditStoreClick: (store: Store) => any
    onDeleteStoreClick: (store: Store) => any
}

export default function StoresTable({
    onSelectStore,
    onEditStoreClick,
    onDeleteStoreClick
}: StoresTableProps) {
    const columns: ColumnDef<Store>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Nombre',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'legal_name',
            header: () => 'Razón Social',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'rfc',
            header: () => 'RFC',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'address',
            header: () => 'Dirección',
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
                        tooltip="Editar Tienda"
                        tooltipPlacement="left"

                        onClick={() => onEditStoreClick(row.original)}
                    >
                        <IconPencil size={24} />
                    </DaisyButton>

                    <DaisyButton
                        variant="error"
                        modifier="square"
                        tooltip="Eliminar Tienda"
                        tooltipPlacement="left"

                        onClick={() => onDeleteStoreClick(row.original)}
                    >
                        <IconTrash size={24} />
                    </DaisyButton>
                </div>
            )
        }
    ], [onEditStoreClick, onDeleteStoreClick])

    const { data, error, isLoading } = useQuery({
        queryKey: ['stores'],
        queryFn: getStores
    })

    const onSelectionChange = (selectedStores: Store[]) => {
        if (selectedStores.length) onSelectStore(selectedStores[0])
        else onSelectStore(null)
    }

    return (
        <DaisyTable 
            columns={columns} 
            data={data ?? []} 
            isLoading={isLoading} 
            error={error} 
            selection="single"

            onSelectionChange={onSelectionChange}
        />
    )
}