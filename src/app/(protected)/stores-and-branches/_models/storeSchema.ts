import { z } from "zod";
import zodRFC from '@/app/_models/zodRFC'

export const storeSchema = z.object({
    name: z.string().min(1, 'El nombre de la tienda es obligatorio'),
    legal_name: z.string().min(1, 'La razón social de la tienda es obligatoria'),
    rfc: zodRFC("El RFC de la tienda es obligatorio. En caso de no tenerlo, puedes usar un RFC genérico como XAXX010101000 o XEXX010101000"),
    address: z.string().min(1, 'La dirección de la tienda es obligatoria')
})

export type StoreSchema = z.infer<typeof storeSchema>