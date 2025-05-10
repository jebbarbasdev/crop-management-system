'use client'

import DaisyButton from "@/app/_components/DaisyButton";
import GenericTitle from "@/app/_components/GenericTitle";
import { IconPlus } from "@tabler/icons-react";
import StoresTable from "./StoresTable";
import { Store } from "../_services/getStores";
import useModal from "@/app/_hooks/useModal";
import StoreModal from "./StoreModal";
import { useState } from "react";
import clsx from "clsx";
import DeleteStoreModal from "./DeleteStoreModal";
import BranchesTable from "./BranchesTable";
import { Branch } from "../_services/getBranches";
//import DeleteProductModal from "./DeleteProductModal";

export default function StoresAndBranchesClientPage() {
    const [selectedStore, setSelectedStore] = useState<Store|null>(null) 
    const [storeToBranch, setStoreToBranch] = useState<Store|null>(null)

    const [selectedBranch, setSelectedBranch] = useState<Branch|null>(null)

    const storeModal = useModal()
    const deleteStoreModal = useModal()
    
    const branchModal = useModal()
    const deleteBranchModal = useModal()

    const onCreateStoreClick = () => {
        setSelectedStore(null)
        storeModal.open()
    }

    const onSelectStore = (store: Store|null) => {
        setStoreToBranch(store)
    }

    const onEditStoreClick = (store: Store) => {
        setSelectedStore(store)
        storeModal.open()
    }

    const onDeleteStoreClick = (store: Store) => {
        setSelectedStore(store)
        deleteStoreModal.open()
    }

    const onCreateBranchClick = () => {
        setSelectedBranch(null)
        branchModal.open()
    }

    const onEditBranchClick = (branch: Branch) => {
        setSelectedBranch(branch)
        branchModal.open()
    }

    const onDeleteBranchClick = (branch: Branch) => {
        setSelectedBranch(branch)
        deleteBranchModal.open()
    }

    return (
        <div>
            <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <GenericTitle removeMargin subtitle="">Tiendas</GenericTitle>
                        
                        <DaisyButton
                            variant="primary"
                            modifier="square"
                            tooltip="Crear Tienda"
                            tooltipPlacement="left"

                            onClick={onCreateStoreClick}
                        >
                            <IconPlus size={24} />
                        </DaisyButton>
                    </div>

                    <StoresTable               
                        onSelectStore={onSelectStore}
                        onEditStoreClick={onEditStoreClick}
                        onDeleteStoreClick={onDeleteStoreClick}
                    />

                    <StoreModal
                        modalModel={storeModal}
                        store={selectedStore}
                    />

                    <DeleteStoreModal
                        modalModel={deleteStoreModal}
                        store={selectedStore}
                    />
                </div>
                
                <div className="">
                    <div className="flex justify-between items-center mb-4">
                        <GenericTitle 
                            removeMargin 
                            subtitle={storeToBranch ? `Mostrando sucursales de "${storeToBranch.name}"` : "Seleccione una tienda para ver sus sucursales"}
                        >
                            Sucursales
                        </GenericTitle>

                        <DaisyButton
                            variant="primary"
                            modifier="square"
                            tooltip="Crear Sucursal"
                            tooltipPlacement="left"

                            onClick={onCreateBranchClick}
                        >
                            <IconPlus size={24} />
                        </DaisyButton>
                    </div>

                    <BranchesTable
                        store={storeToBranch}
                        onEditBranchClick={onEditBranchClick}
                        onDeleteBranchClick={onDeleteBranchClick}
                    />

                    {/* <ConfigurationByStoreModal 
                        modalModel={configurationByStoreModal} 
                        product={selectedStore}
                    />

                    <ConfigurationByStorageModal 
                        modalModel={configurationByStorageModal} 
                        product={selectedStore}
                    />
                    
                    <ProductModal 
                        modalModel={storeModal} 
                        product={selectedStore} 
                    />

                    <DeleteProductModal 
                        modalModel={deleteStoreModal} 
                        product={selectedStore} 
                    /> */}
                </div>
            </div>
        </div>
    )
}