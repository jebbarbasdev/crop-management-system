import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function updateOrderStatus(orderId: number, newStatus: number) {
    const supabase = await createSupabaseBrowserClient();
    const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
    if (error) throw error;
} 