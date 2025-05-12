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

  // Primero, obtenemos los registros existentes para obtener los created_by originales
  const existingIds: number[] = data
    .filter(item => item.id !== undefined)
    .map(item => item.id as number);
  
  let existingRecords: Record<number, string> = {};
  if (existingIds.length > 0) {
    const { data: existingData, error: fetchError } = await supabase
      .from("storage_unit_store_weights")
      .select("id, created_by")
      .in("id", existingIds);
      
    if (fetchError) {
      throw new Error(`Error al obtener registros existentes: ${fetchError.message}`);
    }
    
    existingRecords = (existingData || []).reduce((acc, item) => {
      acc[item.id] = item.created_by;
      return acc;
    }, {} as Record<number, string>);
  }

  // Preparar los datos para upsert
  const upsertData: UpsertPayload[] = data.map(item => {
    if (item.id && existingRecords[item.id]) {
      // Si tiene ID y existe en la base de datos, mantener el created_by original
      return {
        id: item.id,
        storage_unit_id: item.storage_unit_id,
        store_id: item.store_id,
        weight_by_unit: item.weight_by_unit,
        created_by: existingRecords[item.id],
        updated_by: user.id
      };
    } else {
      // Si no tiene ID o no se encontró en la base de datos, es una inserción nueva
      return {
        ...(item.id && { id: item.id }),
        storage_unit_id: item.storage_unit_id,
        store_id: item.store_id,
        weight_by_unit: item.weight_by_unit,
        created_by: user.id,
        updated_by: user.id
      };
    }
  });

  const { error } = await supabase
    .from("storage_unit_store_weights")
    .upsert(upsertData, { onConflict: 'id' });

  if (error) {
    throw new Error(error.message);
  }
}