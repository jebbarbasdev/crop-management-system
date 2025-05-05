import { useQuery } from "@tanstack/react-query"
import getProducts, { Product } from "../_services/getProducts"
import formatAt from "@/app/_utilities/formatAt"
import formatBy, { FormatByTarget } from "@/app/_utilities/formatBy"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconBuildingStore, IconPackage, IconPencil, IconTrash } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import DaisyTable from "@/app/_components/DaisyTable"
import { useMemo } from "react"

export interface ProductsTableProps {
    onConfigureProductByStoreClick: (product: Product) => any
    onConfigureProductByStorageUnitClick: (product: Product) => any
    onEditProductClick: (product: Product) => any
    onDeleteProductClick: (product: Product) => any
}

export default function ProductsTable({
    onConfigureProductByStoreClick,
    onConfigureProductByStorageUnitClick,
    onEditProductClick,
    onDeleteProductClick
}: ProductsTableProps) {
    const columns: ColumnDef<Product>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Nombre',
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
                        modifier="square"
                        variant="secondary"
                        tooltip="Configuración por Tienda"
                        tooltipPlacement="left"

                        onClick={() => onConfigureProductByStoreClick(row.original)}
                    >
                        <IconBuildingStore size={24} />
                    </DaisyButton>

                    <DaisyButton
                        modifier="square"
                        variant="secondary"
                        tooltip="Configuración por Unidad de Empaque"
                        tooltipPlacement="left"

                        onClick={() => onConfigureProductByStorageUnitClick(row.original)}
                    >
                        <IconPackage size={24} />
                    </DaisyButton>

                    <DaisyButton
                        variant="warning"
                        modifier="square"
                        tooltip="Editar Producto"
                        tooltipPlacement="left"

                        onClick={() => onEditProductClick(row.original)}
                    >
                        <IconPencil size={24} />
                    </DaisyButton>

                    <DaisyButton
                        variant="error"
                        modifier="square"
                        tooltip="Eliminar Producto"
                        tooltipPlacement="left"

                        onClick={() => onDeleteProductClick(row.original)}
                    >
                        <IconTrash size={24} />
                    </DaisyButton>
                </div>
            )
        }
    ], [])

    const { data, error, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts
    })

    return (
        <DaisyTable columns={columns} data={data ?? []} isLoading={isLoading} error={error} />
    )

    // return (
    //     <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
    //         <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
    //             <thead>
    //                 <tr className="bg-primary text-primary-content">
    //                     <th>Nombre</th>
    //                     <th>Creado En</th>
    //                     <th>Creado Por</th>
    //                     <th>Actualizado En</th>
    //                     <th>Actualizado Por</th>
    //                     <th>Acciones</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {
    //                     isLoading ? (
    //                         <TableSkeleton rows={5} cols={6} />
    //                     ) : error ? (
    //                         <tr className="bg-error-content text-error">
    //                             <td colSpan={6}>
    //                                 Error al cargar los productos: {error.message}
    //                             </td>
    //                         </tr>
    //                     ) : products && products.length > 0 ? (
    //                         products.map(product => (
    //                             <tr key={product.id}>
    //                                 <td>{product.name}</td>
    //                                 <td>{formatAt(product.created_at)}</td>
    //                                 <td>{formatBy(product.created_by)}</td>
    //                                 <td>{formatAt(product.updated_at)}</td>
    //                                 <td>{formatBy(product.updated_by)}</td>
    //                                 <td>

    //                                 </td>
    //                             </tr>
    //                         ))
    //                     ) : (
    //                         <tr>
    //                             <td colSpan={6}>
    //                                 No hay productos disponibles
    //                             </td>
    //                         </tr>
    //                     )
    //                 }
    //             </tbody>
    //         </table>
    //     </div>
    // )
}