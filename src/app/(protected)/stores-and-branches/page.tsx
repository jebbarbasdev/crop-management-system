import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import StoresAndBranchesClientPage from "./_components/StoresAndBranchesClientPage";

export const metadata: Metadata = {
    title: "Tiendas y Sucursales | Crop Management System",
    description: "Página de Tiendas y Sucursales de Crop Management System",
};

export default function StoresAndBranchesPage() {
    return (
        <QueryProvider>
            <StoresAndBranchesClientPage />
        </QueryProvider>
    )
}