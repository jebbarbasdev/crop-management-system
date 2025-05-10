import { useQuery } from "@tanstack/react-query";
import getStorageUnits, { StorageUnit } from "../_services/getStorageUnits";
import formatAt from "@/app/_utilities/formatAt";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconPencil, IconTrash, IconBuildingStore } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import DaisyTable from "@/app/_components/DaisyTable";
import { useMemo, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface StorageUnitsTableProps {
    onEditStorageUnitClick: (storageUnit: StorageUnit) => any;
    onDeleteStorageUnitClick: (storageUnit: StorageUnit) => any;
    onConfigureWeightsClick: (storageUnit: StorageUnit) => any; 
}

export default function StorageUnitsTable({
    onEditStorageUnitClick,
    onDeleteStorageUnitClick,
    onConfigureWeightsClick, 
}: StorageUnitsTableProps) {
    const [userNames, setUserNames] = useState<Record<string, string>>({});
    
    const { data, error, isLoading } = useQuery({
        queryKey: ['storage_units'],
        queryFn: getStorageUnits,
    });
    
    useEffect(() => {
        async function loadUserNames() {
            if (!data || data.length === 0) return;
            
            const supabase = createSupabaseBrowserClient();

            const userIds = new Set<string>();
            data.forEach(item => {
                if (item.created_by) userIds.add(item.created_by);
                if (item.updated_by) userIds.add(item.updated_by);
            });
            
            if (userIds.size === 0) return;
            
            try {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .in("id", Array.from(userIds));
                
                if (userError) {
                    console.error("Error al obtener datos de usuarios:", userError.message);
                    return;
                }
                
                if (userData && userData.length > 0) {
                    const nameMap: Record<string, string> = {};
                    
                    userData.forEach(user => {
                        const displayName = user.full_name || user.id;
                        
                        nameMap[user.id] = displayName;
                    });
                    
                    setUserNames(nameMap);
                }
            } catch (err) {
                console.error("Error al procesar datos de usuario:", err);
            }
        }
        
        loadUserNames();
    }, [data]);
    
    const columns: ColumnDef<StorageUnit>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: () => 'Nombre',
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: 'created_at',
            header: () => 'Creado En',
            cell: ({ getValue }) => formatAt(getValue<string>()),
        },
        {
            accessorKey: 'created_by',
            header: () => 'Creado Por',
            cell: ({ row }) => {
                const user = row.original.created_by_user;
                if (user) {
                    return `#${user.employee_number} - ${user.full_name ?? ''}`;
                }
                return row.original.created_by ? userNames[row.original.created_by] : '';
            },
        },
        {
            accessorKey: 'updated_at',
            header: () => 'Actualizado En',
            cell: ({ getValue }) => getValue() ? formatAt(getValue<string>()) : '',
        },
        {
            accessorKey: 'updated_by',
            header: () => 'Actualizado Por',
            cell: ({ row }) => {
                const user = row.original.updated_by_user;
                if (user) {
                    return `#${user.employee_number} - ${user.full_name ?? ''}`;
                }
                return row.original.updated_by ? userNames[row.original.updated_by] : '';
            },
        },
        {
            id: 'actions',
            header: () => 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center items-center">
                    <DaisyButton
                        variant="secondary"
                        modifier="square"
                        tooltip="Configurar Pesos"
                        tooltipPlacement="left"
                        onClick={() => onConfigureWeightsClick(row.original)} 
                    >
                        <IconBuildingStore size={24} />
                    </DaisyButton>
                    <DaisyButton
                        variant="warning"
                        modifier="square"
                        tooltip="Editar Unidad de Empaque"
                        tooltipPlacement="left"
                        onClick={() => onEditStorageUnitClick(row.original)}
                    >
                        <IconPencil size={24} />
                    </DaisyButton>
                    
                    <DaisyButton
                        variant="error"
                        modifier="square"
                        tooltip="Eliminar Unidad de Empaque"
                        tooltipPlacement="left"
                        onClick={() => onDeleteStorageUnitClick(row.original)}
                    >
                        <IconTrash size={24} />
                    </DaisyButton>
                </div>
            ),
        },
    ], [userNames, onEditStorageUnitClick, onDeleteStorageUnitClick, onConfigureWeightsClick]);
    
    return (
        <DaisyTable columns={columns} data={data ?? []} isLoading={isLoading} error={error} />
    );
}