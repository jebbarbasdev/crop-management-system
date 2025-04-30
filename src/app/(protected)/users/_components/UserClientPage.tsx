'use client'

import { useState } from "react"
import DaisyButton from "@/app/_components/DaisyButton"
import GenericTitle from "@/app/_components/GenericTitle"
import { IconPlus } from "@tabler/icons-react"
import useModal from "@/app/_hooks/useModal"
import UsersTable from "./UsersTable"
import { User } from "../_services/getUsers"
import UserModal from "./UserModal" 

export default function UsersClientPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const userModal = useModal()
    const deleteUserModal = useModal()

    const handleCreateUser = () => {
        setSelectedUser(null) 
        userModal.open() 
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user) 
        userModal.open() 
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        deleteUserModal.open()
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <GenericTitle removeMargin>Usuarios</GenericTitle>
                <DaisyButton
                    variant="primary"
                    modifier="square"
                    tooltip="Crear Usuario"
                    tooltipPlacement="left"
                    onClick={handleCreateUser} 
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <UsersTable
                onEditUserClick={handleEditUser} 
                onToggleBanUserClick={handleDeleteUser} 
            />

            <UserModal
                modalModel={userModal} 
                user={selectedUser}
            />
        </div>
    )
}

