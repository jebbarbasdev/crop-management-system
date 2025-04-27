'use client'

import { ReactNode, useState } from "react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export interface QueryProviderProps {
    children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}