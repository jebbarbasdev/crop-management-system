import { useQuery } from "@tanstack/react-query"
import getProducts, { SupabaseProduct } from "../_services/getProducts"
import formatAt from "@/app/_utilities/formatAt"
import formatBy from "@/app/_utilities/formatBy"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconBuildingStore, IconPackage, IconPencil, IconTrash } from "@tabler/icons-react"
import TableSkeleton from "@/app/_components/TableSkeleton"

export interface ProductsTableProps {
    onConfigureProductByStore: (product: SupabaseProduct) => any
    onConfigureProductByStorageUnit: (product: SupabaseProduct) => any
    onEditProduct: (product: SupabaseProduct) => any
    onDeleteProduct: (product: SupabaseProduct) => any
}

export default function ProductsTable({
    onConfigureProductByStore,
    onConfigureProductByStorageUnit,
    onEditProduct,
    onDeleteProduct
}: ProductsTableProps) {
    const { data: products, error, isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts })

    return (
        <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
            <table className="table table-zebra table-pin-rows text-center text-nowrap">
                <thead>
                    <tr className="bg-primary text-primary-content">
                        <th>Nombre</th>
                        <th>Creado En</th>
                        <th>Creado Por</th>
                        <th>Actualizado En</th>
                        <th>Actualizado Por</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isLoading ? (
                            <TableSkeleton rows={5} cols={6} />
                        ) : error ? (
                            <tr className="bg-error text-error-content">
                                <td colSpan={6}>
                                    Error al cargar los productos: {error.message}
                                </td>
                            </tr>
                        ) : products && products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{formatAt(product.created_at)}</td>
                                    <td>{formatBy(product.created_by)}</td>
                                    <td>{formatAt(product.updated_at)}</td>
                                    <td>{formatBy(product.updated_by)}</td>
                                    <td>
                                        <div className="flex gap-2 justify-center items-center">
                                            <DaisyButton
                                                modifier="square"
                                                tooltip="Configuración por Tienda"
                                                tooltipPlacement="left"

                                                onClick={() => onConfigureProductByStore(product)}
                                            >
                                                <IconBuildingStore size={24} />
                                            </DaisyButton>

                                            <DaisyButton
                                                modifier="square"
                                                tooltip="Configuración por Unidad de Empaque"
                                                tooltipPlacement="left"

                                                onClick={() => onConfigureProductByStorageUnit(product)}
                                            >
                                                <IconPackage size={24} />
                                            </DaisyButton>

                                            <DaisyButton
                                                variant="warning"
                                                modifier="square"
                                                tooltip="Editar Producto"
                                                tooltipPlacement="left"

                                                onClick={() => onEditProduct(product)}
                                            >
                                                <IconPencil size={24} />
                                            </DaisyButton>

                                            <DaisyButton
                                                variant="error"
                                                modifier="square"
                                                tooltip="Eliminar Producto"
                                                tooltipPlacement="left"

                                                onClick={() => onDeleteProduct(product)}
                                            >
                                                <IconTrash size={24} />
                                            </DaisyButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    No hay productos disponibles
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}