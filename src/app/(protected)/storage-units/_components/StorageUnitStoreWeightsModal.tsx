"use client";
import { UseModalModel } from "@/app/_hooks/useModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DaisyInput from "@/app/_components/DaisyInput";
import DaisyModal from "@/app/_components/DaisyModal";
import DaisyTable from "@/app/_components/DaisyTable";
import { z } from "zod";
import getStorageUnitStoreWeights from "../_services/getStorageUnitStoreWeights";
import upsertStorageUnitStoreWeights from "../_services/upsertStorageUnitStoreWeights";
import { StorageUnit } from "../_services/getStorageUnits";
import getAllStores from "../_services/getAllStores";
import { WeightItemSchema} from "../_models/storageUnitStoreWeightsSchema";

const StorageUnitStoreWeightsSchema = z.object({
  weights: z.array(WeightItemSchema),
});

type FormData = z.infer<typeof StorageUnitStoreWeightsSchema>;

export default function StorageUnitStoreWeightsModal({
  modalModel,
  storageUnit,
}: {
  modalModel: UseModalModel;
  storageUnit: StorageUnit | null;
}) {
  const queryClient = useQueryClient();
  const [tableData, setTableData] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(StorageUnitStoreWeightsSchema),
    defaultValues: {
      weights: [],
    },
  });

  const { data: weights, isLoading: isLoadingWeights } = useQuery({
    queryKey: ["storage_unit_store_weights", storageUnit?.id],
    queryFn: async () => {
      if (!storageUnit) return [];
      const data = await getStorageUnitStoreWeights();
      return data?.filter((item) => item.storage_unit_id === storageUnit.id) || [];
    },
    enabled: !!storageUnit,
  });

  const { data: stores, isLoading: isLoadingStores } = useQuery({
    queryKey: ["stores"],
    queryFn: getAllStores,
  });

  useEffect(() => {
    if (stores && storageUnit) {
      const weightsMap = new Map();
      weights?.forEach(weight => {
        weightsMap.set(weight.store_id, weight);
      });

      const newTableData = stores.map(store => {
        const existingWeight = weightsMap.get(store.id);
        if (existingWeight) {
          return {
            ...existingWeight,
            store_name: store.name
          };
        } else {
          return {
            id: undefined,
            storage_unit_id: storageUnit.id,
            store_id: store.id,
            weight_by_unit: 0,
            store_name: store.name,
            created_at: undefined,
            created_by: undefined,
            updated_at: undefined,
            updated_by: undefined
          };
        }
      });

      setTableData(newTableData);
      reset({ weights: newTableData });
    } else if (stores && !weights && storageUnit) {
      const newTableData = stores.map(store => ({
        id: undefined,
        storage_unit_id: storageUnit.id,
        store_id: store.id,
        weight_by_unit: 0,
        store_name: store.name,
        created_at: undefined,
        created_by: undefined,
        updated_at: undefined,
        updated_by: undefined
      }));
      
      setTableData(newTableData);
      reset({ weights: newTableData });
    }
  }, [stores, weights, storageUnit, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: upsertStorageUnitStoreWeights,
    onSuccess: () => {
      toast.success("Pesos actualizados correctamente");
      queryClient.invalidateQueries({
        queryKey: ["storage_unit_store_weights"],
      });
      modalModel.close();
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: "store_name",
        header: "Tienda",
        cell: ({ row }) => row.original.store_name || "Sin nombre",
        size: 200,
      },
      {
        accessorKey: "weight_by_unit",
        header: "Peso (kg)",
        cell: ({ row }) => (
          <Controller
            name={`weights.${row.index}.weight_by_unit`}
            control={control}
            render={({ field }) => {
              const displayValue = field.value === 0 ? '' : field.value;
              return (
                <DaisyInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={displayValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      field.onChange(0);
                    } else {
                      const numValue = parseFloat(val);
                      field.onChange(isNaN(numValue) ? 0 : numValue);
                    }
                  }}
                  error={errors.weights?.[row.index]?.weight_by_unit?.message}
                  className="w-24"
                />
              );
            }}
          />
        ),
        size: 150,
      },
      {
        accessorKey: "created_at",
        header: "Creado en",
        cell: ({ row }) => row.original.created_at 
          ? new Date(row.original.created_at).toLocaleString() 
          : "-",
        size: 180,
      },
      {
        accessorKey: "created_by_name",
        header: "Creado por",
        cell: ({ row }) => row.original.created_by_name || "-",
        size: 150,
      },
      {
        accessorKey: "updated_at",
        header: "Modificado en",
        cell: ({ row }) => row.original.updated_at 
          ? new Date(row.original.updated_at).toLocaleString() 
          : "-",
        size: 180,
      },
      {
        accessorKey: "updated_by_name",
        header: "Modificado por",
        cell: ({ row }) => row.original.updated_by_name || "-",
        size: 150,
      },
    ],
    [control, errors]
  );

  const onSubmit = (data: FormData) => {
    const cleanedWeights = data.weights.map(item => ({
      id: item.id,
      storage_unit_id: item.storage_unit_id,
      store_id: item.store_id,
      weight_by_unit: item.weight_by_unit
    }));
    
    mutate(cleanedWeights);
  };

  if (!storageUnit) return null;

  return (
    <DaisyModal
      title={`Pesos para ${storageUnit.name}`}
      modalModel={modalModel}
      onSubmit={handleSubmit(onSubmit)}
      loading={isPending}
      size="xl"
    >
      <div className="max-h-[60vh] overflow-y-auto w-full">
        <DaisyTable
          columns={columns}
          data={tableData}
          isLoading={isLoadingWeights || isLoadingStores}
          error={null}
        />
      </div>
    </DaisyModal>
  );
}