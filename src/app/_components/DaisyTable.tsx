import { IconArrowDown, IconArrowsSort, IconArrowsUpDown, IconArrowUp, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconSelector } from '@tabler/icons-react'
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
import { useState } from 'react'
import DaisyInput from './DaisyInput'
import DaisyButton from './DaisyButton'
import TableSkeleton from './TableSkeleton'

export interface DaisyTableProps<T> {
    columns: ColumnDef<T>[],
    data: T[],

    isLoading?: boolean,
    error?: Error | null
}

export default function DaisyTable<T>({ columns, data, isLoading, error }: DaisyTableProps<T>) {
    const [sorting, setSorting] = useState<any[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })

    const table = useReactTable({
        columns,
        data: data,
        state: {
            sorting,
            globalFilter,
            pagination
        },

        getCoreRowModel: getCoreRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',

        onPaginationChange: setPagination,
        getPaginationRowModel: getPaginationRowModel()
    })

    const { pageIndex, pageSize } = table.getState().pagination
    const showingStart = pageIndex * pageSize + 1
    const showingEnd = showingStart + table.getRowModel().rows.length - 1
    const showingTotal = table.getRowCount()

    const TableBodyContent = () => {
        if (isLoading) return <TableSkeleton rows={5} cols={columns.length} />
        
        if (error) return (
            <tr className="bg-error-content text-error">
                <td colSpan={columns.length}>
                    Error al cargar los registros: {error.message}
                </td>
            </tr>
        )

        const rows = table.getRowModel().rows

        if (!rows.length) return (
            <tr>
                <td colSpan={columns.length}>
                    No hay registros disponibles
                </td>
            </tr>
        )

        return (
            <> 
                {rows.map(row => (
                    <tr key={row.id}>
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
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
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
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-primary text-primary-content">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        <div
                                            className={clsx(header.column.getCanSort() && 'cursor-pointer flex items-center justify-center gap-2')}                                            
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

                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronsLeft size={16} />
                    </DaisyButton>

                    <DaisyButton
                        modifier='square'
                        size='sm'

                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronLeft size={16} />
                    </DaisyButton>

                    <span className="flex items-center gap-2">
                        <DaisyInput
                            min={1}
                            max={table.getPageCount()}
                            type="number"
                            daisySize='sm'
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                        />
                        <span className='text-nowrap'>de {table.getPageCount()}</span>
                    </span>

                    <DaisyButton
                        modifier='square'
                        size='sm'

                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronRight size={16} />
                    </DaisyButton>

                    <DaisyButton
                        modifier='square'
                        size='sm'

                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronsRight size={16} />
                    </DaisyButton>
                </div>
            </div>
        </div>
    )
}