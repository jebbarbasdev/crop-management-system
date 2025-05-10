"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import getRoles, { Role } from "../../users/_services/getRoles";
import useModal from "@/app/_hooks/useModal";
import RolePermissionsModal from "./RolePermissionsModal";
import RoleModal from "./RoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import DaisyButton from "@/app/_components/DaisyButton";
import RolesTable from "./RolesTable";
import { IconPlus } from "@tabler/icons-react";
import { deleteRole } from "../_services/deleteRole";
import { toast } from "sonner";
import { initializePermissions } from "../_services/initializePermissions";
import GenericTitle from "@/app/_components/GenericTitle";

export default function RolesClientPage() {
  const queryClient = useQueryClient();
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const permissionsModal = useModal();
  const roleModal = useModal();
  const deleteRoleModal = useModal();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    initializePermissions().catch((error) => {
      console.error("Error al inicializar permisos:", error);
      toast.error("Error al inicializar permisos. Por favor, contacta al administrador.");
    });
  }, []);

  const { mutate: deleteRoleMutation } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Rol eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      deleteRoleModal.close();
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar rol: ${error.message}`);
    },
  });

  const handleCreateRole = () => {
    setSelectedRole(null);
    roleModal.open();
  };

  const handleEditPermissions = (role: Role) => {
    setSelectedRole(role);
    permissionsModal.open();
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    roleModal.open();
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    deleteRoleModal.open();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GenericTitle removeMargin>Roles y Permisos</GenericTitle>
        <DaisyButton
          variant="primary"
          modifier="square"
          tooltip="Crear Rol"
          tooltipPlacement="left"
          onClick={handleCreateRole}
        >
          <IconPlus size={24} />
        </DaisyButton>
      </div>

      <RolesTable
        roles={roles ?? []}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onPermissions={handleEditPermissions}
      />

      <RolePermissionsModal
        modalModel={permissionsModal}
        role={selectedRole}
      />

      <RoleModal
        modalModel={roleModal}
        role={selectedRole}
      />

      <DeleteRoleModal
        modalModel={deleteRoleModal}
        role={selectedRole}
        onConfirm={() => {
          if (selectedRole) {
            deleteRoleMutation(selectedRole.id);
          }
        }}
      />
    </div>
  );
}