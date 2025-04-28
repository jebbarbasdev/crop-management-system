export interface TableSkeletonProps {
    rows: number
    cols: number
}

export default function TableSkeleton({ rows, cols }: TableSkeletonProps) {
    return (
        Array
        .from({ length: rows })
        .map((_, key) => (
            <tr key={key}>
                {
                    Array
                    .from({ length: cols })
                    .map((_, key) => (
                        <td key={key}>
                            <div className="skeleton h-4 w-full"></div>
                        </td>
                    ))
                }
            </tr>
        ))
    )
}