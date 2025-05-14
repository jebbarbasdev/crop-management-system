import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import SummarizedClientPage from "./_components/SummarizedClientPage";

export const metadata: Metadata = {
    title: "Sumarizado | Crop Management System",
    description: "Página de Sumarizado de Crop Management System",
};

export default function ClientPage() {
    return (
        <QueryProvider>
            <SummarizedClientPage />
        </QueryProvider>
    )
}