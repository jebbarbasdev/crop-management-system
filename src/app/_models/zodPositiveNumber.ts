import { z } from "zod";

export function zodPositiveNumber(message: string) {
    return z.coerce.number({
        message: message
    })
    .positive(message)
}