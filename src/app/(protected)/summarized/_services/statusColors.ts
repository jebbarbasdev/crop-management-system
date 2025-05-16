export function getEstadoColor(estado: string) {
    switch (estado) {
        case "CREADO":
            return "bg-gray-200 text-gray-800";
        case "EN_PESAJE":
            return "bg-yellow-100 text-yellow-700";
        case "PESADO":
            return "bg-orange-300 text-orange-900";
        case "EN_REVISION":
            return "bg-blue-100 text-blue-700";
        case "ENVIADO":
            return "bg-indigo-300 text-indigo-900";
        case "RECIBIDO":
            return "bg-green-300 text-green-900";
        case "PAGADO":
            return "bg-teal-300 text-teal-900";
        case "CERRADO":
            return "bg-red-300 text-red-900";
        default:
            return "bg-gray-100 text-gray-500";
    }
} 