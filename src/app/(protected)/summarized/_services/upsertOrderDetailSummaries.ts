import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

interface OrderDetailSummaryPayload {
  order_detail_id: number;
  billed_product_price_per_kg: number;
  billed_gross_weight: number;
  billed_net_weight: number;
  billed_profit: number;
  measured_gross_weight: number;
  measured_net_weight: number;
  measured_profit: number;
  store_gross_weight: number;
  store_net_weight: number;
  store_profit: number;
}

export default async function upsertOrderDetailSummariesManual(data: OrderDetailSummaryPayload[]) {
  const supabase = createSupabaseBrowserClient();

  for (const item of data) {
    const { data: existing, error: selectError } = await supabase
      .from("order_detail_summaries")
      .select("id")
      .eq("order_detail_id", item.order_detail_id)
      .limit(1)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing && existing.id) {
      const { error: updateError } = await supabase
        .from("order_detail_summaries")
        .update(item)
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("order_detail_summaries")
        .insert(item);
      if (insertError) throw insertError;
    }
  }
} 