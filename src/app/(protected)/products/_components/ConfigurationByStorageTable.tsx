import { useQuery } from "@tanstack/react-query";
import { Product } from "../_services/getProducts";
import TableSkeleton from "@/app/_components/TableSkeleton";
import formatAt from "@/app/_utilities/formatAt";
import formatBy from "@/app/_utilities/formatBy";
import getConfigurationByStorage from "../_services/getConfigurationByStorage";

export interface ConfigurationByStorageTableProps {
    product: Product | null
}

export default function ConfigurationByStorageTable({ product }: ConfigurationByStorageTableProps) {
    const { data: storagesMetadata, error, isLoading } = useQuery({ 
        queryKey: ['products', 'storages_metadata', product?.id], 
        queryFn: () => getConfigurationByStorage(product!.id),
        enabled: !!product
    })

    return (
        <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
            <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                <thead>
                    <tr className="bg-primary text-primary-content">
                        <th>Unidad de Empaque</th>
                        <th>Precio/Kg</th>
                        <th>Creado En</th>
                        <th>Creado Por</th>
                        <th>Actualizado En</th>
                        <th>Actualizado Por</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        isLoading ? (
                            <TableSkeleton rows={5} cols={6} />
                        ) : error ? (
                            <tr className="bg-error-content text-error">
                                <td colSpan={6}>
                                    Error al cargar las configuraciones: {error.message}
                                </td>
                            </tr>
                        ) : storagesMetadata && storagesMetadata.length > 0 ? (
                            storagesMetadata.map(storageMetadata => (
                                <tr key={storageMetadata.id}>
                                    <td>{storageMetadata.name}</td>
                                    <td>{storageMetadata.product_metadata?.weight_by_unit ?? '-'}</td>
                                    <td>{formatAt(storageMetadata.product_metadata?.created_at)}</td>
                                    <td>{formatBy(storageMetadata.product_metadata?.created_by)}</td>
                                    <td>{formatAt(storageMetadata.product_metadata?.updated_at)}</td>
                                    <td>{formatBy(storageMetadata.product_metadata?.updated_by)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    No hay configuraciones disponibles
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}