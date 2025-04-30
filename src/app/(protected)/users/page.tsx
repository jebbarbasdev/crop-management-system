import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import UserClientPage from "./_components/UserClientPage";

export const metadata: Metadata = {
    title: "Usuarios | Crop Management System",
    description: "Página de Usuarios de Crop Management System",
};

export default function ClientPage() {
    return (
        <QueryProvider>
            <UserClientPage />
        </QueryProvider>
    )
}