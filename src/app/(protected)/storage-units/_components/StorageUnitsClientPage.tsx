'use client';
import DaisyButton from "@/app/_components/DaisyButton";
import GenericTitle from "@/app/_components/GenericTitle";
import { IconPlus } from "@tabler/icons-react";
import StorageUnitsTable from "../_components/StorageUnitsTable";
import { StorageUnit } from "../_services/getStorageUnits";
import useModal from "@/app/_hooks/useModal";
import { useState } from "react";
import StorageUnitModal from "../_components/StorageUnitModal";
import DeleteStorageUnitModal from "../_components/DeleteStorageUnitModal";
import StorageUnitStoreWeightsModal from "../_components/StorageUnitStoreWeightsModal";
import createStorageUnit from "../_services/createStorageUnit";
import updateStorageUnit from "../_services/updateStorageUnit";
import deleteStorageUnit from "../_services/deleteStorageUnit"; 
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const supabase = createSupabaseBrowserClient();

export default function StorageUnitsClientPage() {
    const [selectedStorageUnit, setSelectedStorageUnit] = useState<StorageUnit | null>(null);
    const [selectedStorageUnitForWeights, setSelectedStorageUnitForWeights] = useState<StorageUnit | null>(null); 
    const storageUnitModal = useModal();
    const deleteStorageUnitModal = useModal();
    const weightsModal = useModal(); 
    const queryClient = useQueryClient();

    const handleCreateStorageUnit = async (name: string) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("No se pudo obtener el usuario autenticado.");
                return;
            }

            await createStorageUnit({
                name,
                created_by: user.id,
            });

            storageUnitModal.close();
            toast.success("Unidad de empaque creada con éxito.");

            queryClient.invalidateQueries({ queryKey: ["storage_units"] });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al crear la unidad de empaque:", error.message);
                toast.error(`Error al crear la unidad de empaque: ${error.message}`);
            } else {
                console.error("Error desconocido:", error);
                toast.error("Ocurrió un error desconocido al crear la unidad de empaque.");
            }
        }
    };

    const handleEditStorageUnit = async (id: number, name: string) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("No se pudo obtener el usuario autenticado.");
                return;
            }

            await updateStorageUnit({
                id,
                name,
                updated_by: user.id,
            });

            storageUnitModal.close();
            toast.success("Unidad de empaque actualizada exitosamente.");

            queryClient.invalidateQueries({ queryKey: ["storage_units"] });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al actualizar la unidad de empaque:", error.message);
                toast.error(`Error al actualizar la unidad de empaque: ${error.message}`);
            } else {
                console.error("Error desconocido:", error);
                toast.error("Ocurrió un error desconocido al actualizar la unidad de empaque.");
            }
        }
    };

    const handleDeleteStorageUnit = async (id: number) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("No se pudo obtener el usuario autenticado.");
                return;
            }

            await deleteStorageUnit({
                id,
                deleted_by: user.id,
            });

            deleteStorageUnitModal.close();
            toast.success("Unidad de empaque eliminada exitosamente.");

            queryClient.invalidateQueries({ queryKey: ["storage_units"] });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al eliminar la unidad de empaque:", error.message);
                toast.error(`Error al eliminar la unidad de empaque: ${error.message}`);
            } else {
                console.error("Error desconocido:", error);
                toast.error("Ocurrió un error desconocido al eliminar la unidad de empaque.");
            }
        }
    };

    const onCreateStorageUnitClick = () => {
        setSelectedStorageUnit(null);
        storageUnitModal.open();
    };

    const onEditStorageUnitClick = (storageUnit: StorageUnit) => {
        setSelectedStorageUnit(storageUnit);
        storageUnitModal.open();
    };

    const onDeleteStorageUnitClick = (storageUnit: StorageUnit) => {
        setSelectedStorageUnit(storageUnit);
        deleteStorageUnitModal.open();
    };

    const onConfigureWeightsClick = (storageUnit: StorageUnit) => {
        setSelectedStorageUnitForWeights(storageUnit);
        weightsModal.open();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <GenericTitle removeMargin>Unidades de Empaque</GenericTitle>
                <DaisyButton
                    variant="primary"
                    modifier="square"
                    tooltip="Crear Unidad de Empaque"
                    tooltipPlacement="left"
                    onClick={onCreateStorageUnitClick}
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <StorageUnitsTable
                onEditStorageUnitClick={onEditStorageUnitClick}
                onDeleteStorageUnitClick={onDeleteStorageUnitClick}
                onConfigureWeightsClick={onConfigureWeightsClick} 
            />

            <StorageUnitModal
                modalModel={storageUnitModal}
                storageUnit={selectedStorageUnit}
                onSubmit={(name: string) => {
                    if (selectedStorageUnit) {
                        handleEditStorageUnit(selectedStorageUnit.id, name);
                    } else {
                        handleCreateStorageUnit(name);
                    }
                }}
            />

            <DeleteStorageUnitModal
                modalModel={deleteStorageUnitModal}
                storageUnit={selectedStorageUnit}
                onConfirm={() => {
                    if (selectedStorageUnit) {
                        handleDeleteStorageUnit(selectedStorageUnit.id);
                    }
                }}
            />

            <StorageUnitStoreWeightsModal
                modalModel={weightsModal}
                storageUnit={selectedStorageUnitForWeights} 
            />
        </div>
    );
}
