import { useQuery } from "@tanstack/react-query"
import getUsers, { User } from "../_services/getUsers"
import formatAt from "@/app/_utilities/formatAt"
import DaisyButton from "@/app/_components/DaisyButton"
import { IconPencil, IconUserOff, IconUserCheck } from "@tabler/icons-react"
import TableSkeleton from "@/app/_components/TableSkeleton"
export interface UsersTableProps {
    onEditUserClick: (user: User) => void
    onToggleBanUserClick: (user: User) => void  
}

export default function UsersTable({
    onEditUserClick,
    onToggleBanUserClick
}: UsersTableProps) {
    const { data: users, error, isLoading } = useQuery({ 
        queryKey: ['users'], 
        queryFn: getUsers,
        refetchOnWindowFocus: false
    })

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
                        <TableSkeleton rows={5} cols={10} />
                    ) : error ? (
                        <tr className="bg-error text-error-content">
                            <td colSpan={10} className="py-4">
                                Error al cargar los usuarios: {(error as Error).message}
                            </td>
                        </tr>
                    ) : users && users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id} className="hover">
                                <td className="font-medium">{user.full_name || 'Sin nombre'}</td>
                                <td>{user.email}</td>
                                <td>{user.employee_number}</td>
                                <td>
                                    <span className="badge badge-outline">
                                        {user.roles?.name || `ID: ${user.role_id}`}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${user.is_banned ? 'badge-error' : 'badge-success'}`}>
                                        {user.is_banned ? 'Suspendido' : 'Activo'}
                                    </span>
                                </td>
                                <td>{formatAt(user.created_at)}</td>
                                <td>
                                    {user.created_by_user ? (
                                        <div className="flex flex-col">
                                            <span>{user.created_by_user.full_name || 'Usuario'}</span>
                                            <span className="text-xs opacity-70">
                                                #{user.created_by_user.employee_number}
                                            </span>
                                        </div>
                                    ) : (
                                        'Sistema'
                                    )}
                                </td>
                                <td>{formatAt(user.updated_at)}</td>
                                <td>
                                    {user.updated_by_user ? (
                                        <div className="flex flex-col">
                                            <span>{user.updated_by_user.full_name || 'Usuario'}</span>
                                            <span className="text-xs opacity-70">
                                                #{user.updated_by_user.employee_number}
                                            </span>
                                        </div>
                                    ) : (
                                        'No modificado'
                                    )}
                                </td>
                                <td>
                                    <div className="flex gap-2 justify-center items-center">
                                        <DaisyButton
                                            variant="warning"
                                            modifier="square"
                                            tooltip="Editar Usuario"
                                            tooltipPlacement="left"
                                            onClick={() => onEditUserClick(user)}
                                            size="sm"
                                        >
                                            <IconPencil size={20} />
                                        </DaisyButton>

                                        <DaisyButton
                                            variant={user.is_banned ? "success" : "error"}
                                            modifier="square"
                                            tooltip={user.is_banned ? "Reactivar Usuario" : "Suspender Usuario"}
                                            tooltipPlacement="left"
                                            onClick={() => onToggleBanUserClick(user)}
                                            size="sm"
                                        >
                                            {user.is_banned ? <IconUserCheck size={20} /> : <IconUserOff size={20} />}
                                        </DaisyButton>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="py-4">
                                No hay usuarios registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}