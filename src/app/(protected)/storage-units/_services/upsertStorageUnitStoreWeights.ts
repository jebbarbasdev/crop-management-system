import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

interface StorageUnitStoreWeight {
  id?: number;
  storage_unit_id: number;
  store_id: number;
  weight_by_unit: number;
  store_name?: string;
}

interface UpsertPayload {
  id?: number;
  storage_unit_id: number;
  store_id: number;
  weight_by_unit: number;
  created_by: string; 
  updated_by: string;
}

export default async function upsertStorageUnitStoreWeights(data: StorageUnitStoreWeight[]) {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No se pudo obtener el usuario autenticado.");
  }

  const upsertData: UpsertPayload[] = data.map(item => ({
    ...(item.id && { id: item.id }), 
    storage_unit_id: item.storage_unit_id,
    store_id: item.store_id,
    weight_by_unit: item.weight_by_unit,
    created_by: user.id,
    updated_by: user.id
  }));

  const { error } = await supabase
    .from("storage_unit_store_weights")
    .upsert(upsertData);

  if (error) {
    throw new Error(error.message);
  }
}