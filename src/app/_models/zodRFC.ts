import { z } from "zod";

const rfcRegex = /^([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}|XAXX010101000|XEXX010101000)$/

export default function zRfc(message?: string) {
    return z.string().toUpperCase().regex(rfcRegex, message)
}