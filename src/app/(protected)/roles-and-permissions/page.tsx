import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import RolesClientPage from "./_components/RolesClientPage";

export const metadata: Metadata = {
    title: "Roles y Permisos | Crop Management System",
    description: "Página de Usuarios de Crop Management System",
};

export default function ClientPage() {
    return (
        <QueryProvider>
            <RolesClientPage />
        </QueryProvider>
    )
}