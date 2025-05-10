import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import getPermissions from "../_services/getPermissions";
import getRolePermissions from "../_services/getRolePermissions";
import { updateRolePermissions } from "../_services/updateRolePermissions";
import { Role } from "../../users/_services/getRoles";
import { ShoppingCart, Users, Package, Store, Scale, Layers, Box } from "lucide-react";

interface RolePermissionsModalProps {
  modalModel: UseModalModel;
  role: Role | null;
}

const moduleIcons: Record<string, React.ReactNode> = {
  "Pesaje": <Scale size={18} className="mr-2" />, 
  "Sumarizado": <Layers size={18} className="mr-2" />,
  "Unidades de Empaque": <Box size={18} className="mr-2" />,
  "Usuarios": <Users size={18} className="mr-2" />,
  "Tiendas y Sucursales": <Store size={18} className="mr-2" />,
  "Productos": <Package size={18} className="mr-2" />,
  "Pedidos": <ShoppingCart size={18} className="mr-2" />,
};

export default function RolePermissionsModal({ modalModel, role }: RolePermissionsModalProps) {
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const { data: rolePermissions } = useQuery({
    queryKey: ["rolePermissions", role?.id],
    queryFn: () => role ? getRolePermissions(role.id) : Promise.resolve([]),
    enabled: !!role,
  });

  useEffect(() => {
    if (rolePermissions) {
      setSelectedPermissions(rolePermissions.map(rp => rp.permission_id));
    }
  }, [rolePermissions]);

  const { mutate: updatePermissions } = useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      toast.success("Permisos actualizados exitosamente");
      queryClient.invalidateQueries({ queryKey: ["rolePermissions"] });
      modalModel.close();
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar permisos: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (!role) return;
    updatePermissions({
      roleId: role.id,
      permissionIds: selectedPermissions,
    });
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const permissionsByModule = permissions?.reduce((acc, permission) => {
    const moduleName = permission.module?.name || "Sin módulo";
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const moduleNames = permissions ? Array.from(new Set(permissions.map(p => p.module?.name || "Sin módulo"))) : [];

  useEffect(() => {
    if (!selectedModule && moduleNames.length > 0) {
      setSelectedModule(moduleNames[0]);
    }
  }, [moduleNames, selectedModule]);

  return (
    <DaisyModal
      title={`Permisos de ${role?.name || ""}`}
      modalModel={modalModel}
      onSubmit={handleSubmit}
    >
      <div className="flex w-full min-h-[350px] max-h-[70vh] overflow-y-auto divide-x divide-base-200">
        <div className="w-1/2 pr-4 flex flex-col">
          <span className="font-semibold mb-2">Seleccionar Módulo</span>
          <div className="flex flex-col gap-1">
            {moduleNames.map((name) => (
              <button
                key={name}
                type="button"
                className={`flex items-center px-3 py-2 rounded transition-colors text-left ${selectedModule === name ? "bg-green-100 text-green-800 font-semibold" : "hover:bg-base-200"}`}
                onClick={() => setSelectedModule(name)}
              >
                {moduleIcons[name] || <Box size={18} className="mr-2" />}
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-4 flex flex-col">
          <span className="font-semibold mb-2">Permisos</span>
          <div className="flex flex-col gap-1">
            {selectedModule && permissionsByModule && permissionsByModule[selectedModule]?.length > 0 ? (
              permissionsByModule[selectedModule].map(permission => (
                <label key={permission.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-300 px-2 py-1 rounded text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionChange(permission.id)}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{permission.name}</span>
                    <span className="text-xs text-gray-500 whitespace-normal">{permission.description}</span>
                  </div>
                </label>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No hay permisos para este módulo.</span>
            )}
          </div>
        </div>
      </div>
    </DaisyModal>
  );
} 