import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import ProductsClientPage from "./_components/ProductsClientPage";

export const metadata: Metadata = {
    title: "Productos | Crop Management System",
    description: "Página de Productos de Crop Management System",
};

export default function ProductsPage() {
    return (
        <QueryProvider>
            <ProductsClientPage />
        </QueryProvider>
    )
}