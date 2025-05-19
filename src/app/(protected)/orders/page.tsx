import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import OrdersClientPage from "./_components/OrdersClientPage";

export const metadata: Metadata = {
    title: "Pedidos | Crop Management System",
    description: "Página de Pedidos de Crop Management System",
};

export default function OrdersPage() {
    return (
        <QueryProvider>
            <OrdersClientPage />
        </QueryProvider>
    )
}