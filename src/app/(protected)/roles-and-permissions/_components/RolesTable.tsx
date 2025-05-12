import DaisyTable from "@/app/_components/DaisyTable";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconShieldLock, IconPencil, IconTrash } from "@tabler/icons-react";
import { useMemo, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { Role } from "../_services/getRoles";

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onPermissions: (role: Role) => void;
}

export default function RolesTable({ roles, onEdit, onDelete, onPermissions }: RolesTableProps) {
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadUserNames() {
      if (!roles || roles.length === 0) return;

      const supabase = createSupabaseBrowserClient();

      const userIds = new Set<string>();
      roles.forEach((role) => {
        if (role.created_by) userIds.add(role.created_by);
        if (role.updated_by) userIds.add(role.updated_by);
      });

      if (userIds.size === 0) return;

      try {
        const { data: userData, error } = await supabase
          .from("users")
          .select("id, full_name, employee_number")
          .in("id", Array.from(userIds));

        if (error) {
          return;
        }

        if (userData && userData.length > 0) {
          const nameMap: Record<string, string> = {};
          userData.forEach((user) => {
            nameMap[user.id] = `#${user.employee_number || "N/A"} - ${user.full_name || user.id}`;
          });
          setUserNames(nameMap);
        }
      } catch (err) {
      }
    }

    loadUserNames();
  }, [roles]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Nombre", cell: ({ getValue }: any) => <span className="truncate block">{getValue()}</span> },
    { accessorKey: "description", header: "Descripción", cell: ({ getValue }: any) => <span className="truncate block">{getValue()}</span> },
    {
      accessorKey: "created_at",
      header: "Creado En",
      cell: ({ row }: any) => row.original.created_at ? <span>{new Date(row.original.created_at).toLocaleString()}</span> : "-",
    },
    {
      accessorKey: "created_by",
      header: "Creado Por",
      cell: ({ row }: any) => {
        return userNames[row.original.created_by] || "Sistema";
      },
    },
    {
      accessorKey: "updated_at",
      header: "Actualizado En",
      cell: ({ row }: any) => row.original.updated_at ? <span>{new Date(row.original.updated_at).toLocaleString()}</span> : "-",
    },
    {
      accessorKey: "updated_by",
      header: "Actualizado Por",
      cell: ({ row }: any) => {
        return userNames[row.original.updated_by] || "No modificado";
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: any) => (
        <div className="flex gap-2 justify-center">
          <DaisyButton
            onClick={() => onPermissions(row.original)}
            variant="secondary"
            modifier="square"
            tooltip="Gestionar Permisos"
            tooltipPlacement="left"
          >
            <IconShieldLock size={20} />
          </DaisyButton>
          <DaisyButton
            onClick={() => onEdit(row.original)}
            variant="warning"
            modifier="square"
            tooltip="Editar Rol"
            tooltipPlacement="left"
          >
            <IconPencil size={20} />
          </DaisyButton>

          <DaisyButton
            onClick={() => onDelete(row.original)}
            variant="error"
            modifier="square"
            tooltip="Eliminar Rol"
            tooltipPlacement="left"
          >
            <IconTrash size={20} />
          </DaisyButton>
        </div>
      ),
    },
  ], [onEdit, onDelete, onPermissions, userNames]);

  return (
    <DaisyTable
      columns={columns}
      data={roles}
    />
  );
}