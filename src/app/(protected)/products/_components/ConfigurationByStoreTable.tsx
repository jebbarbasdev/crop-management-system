import { useQuery } from "@tanstack/react-query";
import { Product } from "../_services/getProducts";
import getConfigurationByStore from "../_services/getConfigurationByStore";
import TableSkeleton from "@/app/_components/TableSkeleton";
import formatAt from "@/app/_utilities/formatAt";
import formatBy from "@/app/_utilities/formatBy";

export interface ConfigurationByStoreTableProps {
    product: Product | null
}

export default function ConfigurationByStoreTable({ product }: ConfigurationByStoreTableProps) {
    const { data: storesMetadata, error, isLoading } = useQuery({ 
        queryKey: ['products', 'stores_metadata', product?.id], 
        queryFn: () => getConfigurationByStore(product!.id),
        enabled: !!product
    })

    return (
        <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
            <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                <thead>
                    <tr className="bg-primary text-primary-content">
                        <th>Tienda</th>
                        <th>SKU</th>
                        <th>Descripción</th>
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
                        ) : storesMetadata && storesMetadata.length > 0 ? (
                            storesMetadata.map(storeMetadata => (
                                <tr key={storeMetadata.id}>
                                    <td>{storeMetadata.name}</td>
                                    <td>{storeMetadata.product_metadata?.sd_sku ?? '-'}</td>
                                    <td>{storeMetadata.product_metadata?.sd_name ?? '-'}</td>
                                    <td>{storeMetadata.product_metadata?.sd_price_by_kg ?? '-'}</td>
                                    <td>{formatAt(storeMetadata.product_metadata?.created_at)}</td>
                                    <td>{formatBy(storeMetadata.product_metadata?.created_by)}</td>
                                    <td>{formatAt(storeMetadata.product_metadata?.updated_at)}</td>
                                    <td>{formatBy(storeMetadata.product_metadata?.updated_by)}</td>
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