import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default async function insertOrderDetailSummary(data: any) {
    const supabase = await createSupabaseBrowserClient();
    const { error } = await supabase
        .from("order_detail_summaries")
        .insert([data]);
    if (error) throw error;
} 