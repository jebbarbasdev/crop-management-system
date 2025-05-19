import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import StorageUnitsClientPage from "./_components/StorageUnitsClientPage";

export const metadata: Metadata = {
    title: "Unidades de Empaque | Crop Management System",
    description: "Página de Unidades de Empaque de Crop Management System",
};

export default function ClientPage() {
    return (
        <QueryProvider>
            <StorageUnitsClientPage />
        </QueryProvider>
    )
}