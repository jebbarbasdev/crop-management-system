const dateTimeFormat = new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'medium',
})

export default function formatAt(date?: string | Date | number | null) {
    if (!date) return '-'
    if (typeof date === "string") date = new Date(date)
    return dateTimeFormat.format(date)
}