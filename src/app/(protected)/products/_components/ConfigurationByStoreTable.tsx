import { useQuery } from "@tanstack/react-query";
import { Product } from "../_services/getProducts";
import getConfigurationByStore, { ConfigurationByStore } from "../_services/getConfigurationByStore";
import TableSkeleton from "@/app/_components/TableSkeleton";
import formatAt from "@/app/_utilities/formatAt";
import formatBy from "@/app/_utilities/formatBy";
import DaisyInput from "@/app/_components/DaisyInput";
import { useMemo, useState } from "react";
import { ConfigurationByStoreSchema, ConfigurationsByStoreSchema } from "../_models/configurationByStoreSchema";
import { ColumnDef, Row } from "@tanstack/react-table";
import DaisyTable from "@/app/_components/DaisyTable";
import { Control, FieldErrors, useController, UseFormRegister } from "react-hook-form";

export interface ConfigurationByStoreTableProps {
    data: ConfigurationByStore[] | null
    isLoading: boolean
    error: Error | null

    control: Control<ConfigurationsByStoreSchema>
}

interface CustomCellProps {
    row: Row<ConfigurationByStore>, 
    control: Control<ConfigurationsByStoreSchema>
}

function SkuCell({ row, control }: CustomCellProps) {
    const { field, fieldState} = useController({
        name: `configurations.${row.index}.sd_sku`,
        control,
        defaultValue: row.original.product_metadata?.sd_sku ?? ''
    })

    return (
        <DaisyInput
            type="text"
            daisySize="xs"

            className="min-w-30"
            placeholder="SKU del producto"
            
            {...field}
            error={fieldState.error?.message}
        />
    )
}

function DescriptionCell({ row, control }: CustomCellProps) {
    const { field, fieldState} = useController({
        name: `configurations.${row.index}.sd_name`,
        control,
        defaultValue: row.original.product_metadata?.sd_name ?? ''
    })

    return (
        <DaisyInput
            type="text"
            daisySize="xs"

            className="min-w-30"
            placeholder="Descripción del producto"
            
            {...field}
            error={fieldState.error?.message}
        />
    )
}

function PriceCell({ row, control }: CustomCellProps) {
    const { field, fieldState} = useController({
        name: `configurations.${row.index}.sd_price_by_kg`,
        control,
        defaultValue: row.original.product_metadata?.sd_price_by_kg ?? 0
    })

    return (
        <DaisyInput
            type="number"
            daisySize="xs"

            className="min-w-30"
            placeholder="Precio por Kg del producto"
            
            {...field}
            error={fieldState.error?.message}
        />
    )
}

export default function ConfigurationByStoreTable({ data, isLoading, error, control }: ConfigurationByStoreTableProps) {
    const columns: ColumnDef<ConfigurationByStore>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Tienda',
            cell: ({ getValue }) => getValue()
        },
        {
            id: 'sd_sku',
            header: () => 'SKU',
            cell: ({ row }) => <SkuCell row={row} control={control} />
        },
        {
            id: 'sd_name',
            header: () => 'Descripción',
            cell: ({ row }) => <DescriptionCell row={row} control={control} />
        },
        {
            id: 'sd_price_by_kg',
            header: () => 'Precio/Kg',
            cell: ({ row }) => <PriceCell row={row} control={control} />
        },
        {
            accessorKey: 'product_metadata.created_at',
            header: () => 'Creado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'created_by',
            accessorFn: row => formatBy(row.product_metadata?.created_by),
            header: () => 'Creado Por',
            cell: ({ getValue }) => getValue()
        },
        {
            accessorKey: 'product_metadata.updated_at',
            header: () => 'Actualizado En',
            cell: ({ getValue }) => formatAt(getValue<string>())
        },
        {
            id: 'updated_by',
            accessorFn: row => formatBy(row.product_metadata?.updated_by),
            header: () => 'Actualizado Por',
            cell: ({ getValue }) => getValue()
        },
    ], [control])

    return (
        <DaisyTable 
            columns={columns} 
            data={data ?? []} 
            isLoading={isLoading} 
            error={error} 
        />
    )
}