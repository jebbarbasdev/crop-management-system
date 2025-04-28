export interface FormatByTarget {
    employee_number: number,
    full_name?: string | null,
}

export default function formatBy(target?: FormatByTarget | null) {
    if (!target) return '-'
    if (!target.full_name) return `#${target.employee_number}`
    return `#${target.employee_number} - ${target.full_name}`
}