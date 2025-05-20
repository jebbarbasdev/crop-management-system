import { Metadata } from "next";
import QueryProvider from "@/app/_providers/QueryProvider";
import WeightingClientPage from "./_components/WeightingClientPage";

export const metadata: Metadata = {
    title: "Pesaje | Crop Management System",
    description: "Página de Pesaje de Crop Management System",
};

export default function WeightingPage() {
    return (
        <QueryProvider>
            <WeightingClientPage />
        </QueryProvider>
    )
}