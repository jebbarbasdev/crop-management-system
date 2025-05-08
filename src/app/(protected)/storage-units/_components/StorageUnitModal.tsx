'use client';

import { useEffect, useState } from "react";
import DaisyModal from "@/app/_components/DaisyModal";
import DaisyInput from "@/app/_components/DaisyInput";
import { StorageUnit } from "../_services/getStorageUnits";
import { UseModalModel } from "@/app/_hooks/useModal";
import { StorageUnitSchema } from "../_models/Schema"; 
import { z } from "zod";

interface StorageUnitModalProps {
    modalModel: UseModalModel;
    storageUnit: StorageUnit | null;
    onSubmit: (name: string) => void;
}

export default function StorageUnitModal({ modalModel, storageUnit, onSubmit }: StorageUnitModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (storageUnit) {
          
            setName(storageUnit.name);
        } else {
          
            setName("");
        }
        setError(null); 
    }, [storageUnit]);

    const handleSubmit = () => {
        try {
         
            StorageUnitSchema.parse({ name });
            setError(null); 
            onSubmit(name); 
            modalModel.close(); 
            setName(""); 
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message); 
            }
        }
    };

    return (
        <DaisyModal
            title={storageUnit ? "Editar Unidad de Empaque" : "Crear Unidad de Empaque"}
            modalModel={modalModel}
            onSubmit={(e) => {
                e.preventDefault(); 
                handleSubmit();
            }}
        >
            <div className="flex flex-col gap-4">
                <DaisyInput
                    label="Nombre de la Unidad de Empaque"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ejemplo: Caja, Pallet, etc."
                />
                {error && <p className="text-red-500 text-sm">{error}</p>} 
            </div>
        </DaisyModal>
    );
}