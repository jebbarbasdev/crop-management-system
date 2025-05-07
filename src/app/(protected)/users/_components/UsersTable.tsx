import { useQuery } from "@tanstack/react-query";
import getUsers, { User } from "../_services/getUsers";
import DaisyButton from "@/app/_components/DaisyButton";
import { IconPencil, IconUserOff, IconUserCheck } from "@tabler/icons-react";
import useModal from "@/app/_hooks/useModal";
import { useState } from "react";
import UserModal from "./UserModal";
import BanUserModal from "./BanUserModal";

export default function UsersTable() {
  const { data: users, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });

  const userModal = useModal(); 
  const banUserModal = useModal(); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    userModal.open();
  };

  const handleBanClick = (user: User) => {
    setSelectedUser(user);
    banUserModal.open();
  };

  return (
    <div className="overflow-x-auto w-full border border-base-content/5 bg-base-100 rounded-box">
      <table className="table table-zebra table-pin-rows text-center whitespace-nowrap">
        <thead>
          <tr className="bg-primary text-primary-content">
            <th>Nombre</th>
            <th>Email</th>
            <th>N° Empleado</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Creado en</th>
            <th>Creado por</th>
            <th>Modificado en</th>
            <th>Modificado por</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10}>Cargando...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={10}>Error al cargar los usuarios</td>
            </tr>
          ) : users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name || "Sin nombre"}</td>
                <td>{user.email}</td>
                <td>{user.employee_number}</td>
                <td>{user.roles?.name || "Sin rol"}</td>
                <td>
                  <span className={`badge ${user.is_banned ? "badge-error" : "badge-success"}`}>
                    {user.is_banned ? "Suspendido" : "Activo"}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  {user.created_by_user ? (
           <div className="flex flex-col">
                                        <span>{user.created_by_user.full_name || "Usuario"}</span>
                                        <span className="text-xs opacity-70">
                                          #{user.created_by_user.employee_number}
                                        </span>
                                      </div>
                  ) : (
                    "Sistema"
                  )}
                </td>
                <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                <td>
                  {user.updated_by_user ? (
                    <div className="flex flex-col">
                      <span>{user.updated_by_user.full_name || "Usuario"}</span>
                      <span className="text-xs opacity-70">
                        #{user.updated_by_user.employee_number}
                      </span>
                    </div>
                  ) : (
                    "No modificado"
                  )}
                </td>
                <td>
                  <div className="flex gap-2 justify-center">
                    <DaisyButton
                      variant="warning"
                      modifier="square"
                      tooltip="Editar Usuario"
                      onClick={() => handleEditClick(user)}
                    >
                      <IconPencil size={20} />
                    </DaisyButton>
                    <DaisyButton
                      variant={user.is_banned ? "success" : "error"}
                      modifier="square"
                      tooltip={user.is_banned ? "Reactivar Usuario" : "Suspender Usuario"}
                      onClick={() => handleBanClick(user)}
                    >
                      {user.is_banned ? <IconUserCheck size={20} /> : <IconUserOff size={20} />}
                    </DaisyButton>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>

      
      <UserModal modalModel={userModal} user={selectedUser} />

  
      <BanUserModal modalModel={banUserModal} user={selectedUser} />
    </div>
  );
}