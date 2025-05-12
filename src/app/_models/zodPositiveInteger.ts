import { z } from "zod";

export function zodPositiveInteger(message: string) {
    return z.coerce.number({
            message: message
        })
        .int(message)
        .positive(message);
}