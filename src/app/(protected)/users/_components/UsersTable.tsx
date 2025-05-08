import { useQuery } from "@tanstack/react-query";
import getUsers, { User } from "../_services/getUsers";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconPencil, IconUserOff, IconUserCheck } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import DaisyTable from "@/app/_components/DaisyTable";
import { useMemo, useState, useEffect } from "react";
import useModal from "@/app/_hooks/useModal";
import UserModal from "./UserModal";
import BanUserModal from "./BanUserModal";
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export default function UsersTable() {
    const { data: users, error, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        refetchOnWindowFocus: false,
    });

    const userModal = useModal();
    const banUserModal = useModal();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userNames, setUserNames] = useState<Record<string, string>>({});

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        userModal.open();
    };

    const handleBanClick = (user: User) => {
        setSelectedUser(user);
        banUserModal.open();
    };

    // Cargar nombres de usuarios relacionados
    useEffect(() => {
        async function loadUserNames() {
            if (!users || users.length === 0) return;

            const supabase = createSupabaseBrowserClient();

            // Extraer IDs únicos de usuarios relacionados
            const userIds = new Set<string>();
            users.forEach((user) => {
                if (user.created_by) userIds.add(user.created_by);
                if (user.updated_by) userIds.add(user.updated_by);
            });

            if (userIds.size === 0) return;

            try {
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("id, full_name")
                    .in("id", Array.from(userIds));

                if (userError) {
                    console.error("Error al obtener datos de usuarios:", userError.message);
                    return;
                }

                if (userData && userData.length > 0) {
                    const nameMap: Record<string, string> = {};
                    userData.forEach((user) => {
                        nameMap[user.id] = user.full_name || user.id;
                    });
                    setUserNames(nameMap);
                }
            } catch (err) {
                console.error("Error al procesar datos de usuario:", err);
            }
        }

        loadUserNames();
    }, [users]);

    // Definir las columnas de la tabla
    const columns: ColumnDef<User>[] = useMemo(() => [
        {
            accessorKey: "full_name",
            header: () => "Nombre",
            cell: ({ getValue }) => getValue() || "Sin nombre",
        },
        {
            accessorKey: "email",
            header: () => "Email",
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: "employee_number",
            header: () => "N° Empleado",
            cell: ({ getValue }) => getValue() || "N/A",
        },
        {
            accessorKey: "roles.name",
            header: () => "Rol",
            cell: ({ row }) => row.original.roles?.name || "Sin rol",
        },
        {
            accessorKey: "is_banned",
            header: () => "Estado",
            cell: ({ getValue }) => (
                <span className={`badge ${getValue() ? "badge-error" : "badge-success"}`}>
                    {getValue() ? "Suspendido" : "Activo"}
                </span>
            ),
        },
        {
            accessorKey: "created_at",
            header: () => "Creado En",
            cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
        },
        {
            accessorKey: "created_by",
            header: () => "Creado Por",
            cell: ({ row }) =>
                row.original.created_by
                    ? userNames[row.original.created_by] : "Sistema",
        },
        {
            accessorKey: "updated_at",
            header: () => "Modificado En",
            cell: ({ getValue }) =>
                getValue() ? new Date(getValue<string>()).toLocaleDateString() : "No modificado",
        },
        {
            accessorKey: "updated_by",
            header: () => "Modificado Por",
            cell: ({ row }) =>
                row.original.updated_by
                    ? userNames[row.original.updated_by] : "No modificado",
        },
        {
            id: "actions",
            header: () => "Acciones",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                    <DaisyButton
                        variant="warning"
                        modifier="square"
                        tooltip="Editar Usuario"
                        onClick={() => handleEditClick(row.original)}
                    >
                        <IconPencil size={20} />
                    </DaisyButton>
                    <DaisyButton
                        variant={row.original.is_banned ? "success" : "error"}
                        modifier="square"
                        tooltip={row.original.is_banned ? "Reactivar Usuario" : "Suspender Usuario"}
                        onClick={() => handleBanClick(row.original)}
                    >
                        {row.original.is_banned ? <IconUserCheck size={20} /> : <IconUserOff size={20} />}
                    </DaisyButton>
                </div>
            ),
        },
    ], [userNames]);

    return (
        <>
            <DaisyTable columns={columns} data={users ?? []} isLoading={isLoading} error={error} />

            <UserModal modalModel={userModal} user={selectedUser} />
            <BanUserModal modalModel={banUserModal} user={selectedUser} />
        </>
    );
}