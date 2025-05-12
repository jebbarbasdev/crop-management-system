import {
    IconArrowDown,
    IconArrowsSort,
    IconArrowUp,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight
} from '@tabler/icons-react'
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    PaginationState,
    getPaginationRowModel
} from '@tanstack/react-table'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import DaisyInput from './DaisyInput'
import DaisyButton from './DaisyButton'
import TableSkeleton from './TableSkeleton'

export type DaisyTableSelectionMode = 'none' | 'single' | 'multiple'

export interface DaisyTableProps<T> {
    columns: ColumnDef<T>[]
    data: T[]

    isLoading?: boolean
    error?: Error | null

    selection?: DaisyTableSelectionMode
    onSelectionChange?: (selected: T[]) => void
}

export default function DaisyTable<T>({ columns, data, isLoading, error, selection = 'none', onSelectionChange }: DaisyTableProps<T>) {
    const [sorting, setSorting] = useState<any[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // Crear columna de selección solo si se necesita
    const tableColumns: ColumnDef<T>[] = (() => {
        if (selection === 'none') {
            return columns;
        }
        
        if (selection === 'single') {
            return columns; // No agregamos columna de checkbox para modo single
        }
        
        // Solo agregamos columna de checkbox para modo multiple
        return [
            {
                id: "select",
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onChange={row.getToggleSelectedHandler()}
                        className="checkbox"
                    />
                )
            },
            ...columns
        ];
    })();

    const tableInstance = useReactTable({
        columns: tableColumns,
        data: data,
        state: {
            sorting,
            globalFilter,
            pagination,
            rowSelection
        },

        getCoreRowModel: getCoreRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',

        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel(),

        onRowSelectionChange: setRowSelection,
        
        // Habilitar selección según el modo
        enableRowSelection: selection !== 'none',
        // Para modo 'single', deshabilitar selección múltiple
        enableMultiRowSelection: selection === 'multiple',
    })

    // Notificar cambios en selección
    useEffect(() => {
        if (onSelectionChange && selection !== 'none') {
            const table = tableInstance;
            const selectedRows = table
                .getRowModel()
                .rows
                .filter(row => row.getIsSelected())
                .map(row => row.original);
            
            onSelectionChange(selectedRows);
        }
    }, [rowSelection, onSelectionChange, selection, tableInstance]);

    const { pageIndex, pageSize } = tableInstance.getState().pagination
    const showingStart = pageIndex * pageSize + 1
    const showingEnd = showingStart + tableInstance.getRowModel().rows.length - 1
    const showingTotal = tableInstance.getRowCount()

    const TableBodyContent = () => {
        if (isLoading) return <TableSkeleton rows={5} cols={columns.length} />

        if (error) return (
            <tr className="bg-error-content text-error">
                <td colSpan={tableColumns.length}>
                    Error al cargar los registros: {error.message}
                </td>
            </tr>
        )

        const rows = tableInstance.getRowModel().rows

        if (!rows.length) return (
            <tr>
                <td colSpan={tableColumns.length}>
                    No hay registros disponibles
                </td>
            </tr>
        )

        return (
            <>
                {rows.map(row => (
                    <tr
                        key={row.id}
                        className={clsx(
                            selection !== "none" ? 
                            row.getIsSelected() ? '!bg-blue-600 !text-white hover:!bg-blue-700 cursor-pointer' :
                            'hover:!bg-base-300 cursor-pointer' :
                            ''
                        )}
                        onClick={(e) => {
                            // Evitar selección si se hace clic en elementos interactivos
                            const target = e.target as HTMLElement;
                            const isInteractive = 
                                target.tagName === 'BUTTON' || 
                                target.tagName === 'INPUT' || 
                                target.tagName === 'A' ||
                                target.tagName === 'SELECT' ||
                                target.closest('button') ||
                                target.closest('input') ||
                                target.closest('a') ||
                                target.closest('select');
                            
                            // Solo activar selección si no es un elemento interactivo
                            if (selection !== 'none' && !isInteractive) {
                                row.toggleSelected();
                            }
                        }}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        )
    }

    return (
        <div>
            <div className='mb-4 flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                    <span className='text-nowrap'>Elementos por página</span>
                    <select
                        className="select select-sm"
                        value={tableInstance.getState().pagination.pageSize}
                        onChange={e => tableInstance.setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 25, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <DaisyInput
                        type='search'
                        placeholder='Búsqueda'
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100">
                <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
                    <thead>
                        {tableInstance.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-primary text-primary-content">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        <div
                                            className={clsx('select-none', header.column.getCanSort() && 'cursor-pointer flex items-center justify-center gap-2')}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}

                                            {header.column.getCanSort() && {
                                                'asc': <IconArrowUp size={16} />,
                                                'desc': <IconArrowDown size={16} />,
                                                'default': <IconArrowsSort size={16} />
                                            }[header.column.getIsSorted() || 'default']}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        <TableBodyContent />
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <div>
                    Mostrando {showingStart.toLocaleString()} a {showingEnd.toLocaleString()} de {showingTotal.toLocaleString()} registros
                </div>

                <div className='flex items-center gap-2'>
                    <DaisyButton
                        modifier='square'
                        size='sm'
                        onClick={() => tableInstance.firstPage()}
                        disabled={!tableInstance.getCanPreviousPage()}
                    >
                        <IconChevronsLeft size={16} />
                    </DaisyButton>

                    <DaisyButton
                        modifier='square'
                        size='sm'
                        onClick={() => tableInstance.previousPage()}
                        disabled={!tableInstance.getCanPreviousPage()}
                    >
                        <IconChevronLeft size={16} />
                    </DaisyButton>

                    <span className="flex items-center gap-2">
                        <DaisyInput
                            min={1}
                            max={tableInstance.getPageCount()}
                            type="number"
                            daisySize='sm'
                            value={tableInstance.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                tableInstance.setPageIndex(page);
                            }}
                        />
                        <span className='text-nowrap'>de {tableInstance.getPageCount()}</span>
                    </span>

                    <DaisyButton
                        modifier='square'
                        size='sm'
                        onClick={() => tableInstance.nextPage()}
                        disabled={!tableInstance.getCanNextPage()}
                    >
                        <IconChevronRight size={16} />
                    </DaisyButton>

                    <DaisyButton
                        modifier='square'
                        size='sm'
                        onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
                        disabled={!tableInstance.getCanNextPage()}
                    >
                        <IconChevronsRight size={16} />
                    </DaisyButton>
                </div>
            </div>
        </div>
    )
}