'use client';

import DaisyModal from "@/app/_components/DaisyModal";
import { StorageUnit } from "../_services/getStorageUnits";
import { UseModalModel } from "@/app/_hooks/useModal";

interface DeleteStorageUnitModalProps {
    modalModel: UseModalModel;
    storageUnit: StorageUnit | null;
    onConfirm: () => void;
}

export default function DeleteStorageUnitModal({
    modalModel,
    storageUnit,
    onConfirm,
}: DeleteStorageUnitModalProps) {
    return (
        <DaisyModal
            title="Eliminar Unidad de Empaque"
            modalModel={modalModel}
            onSubmit={onConfirm}
        >
            <div className="text-center">
                <p>
                    ¿Estás seguro de que deseas eliminar la unidad de empaque{" "}
                    <strong>{storageUnit?.name}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Esta acción no se puede deshacer.
                </p>
            </div>
        </DaisyModal>
    );
}