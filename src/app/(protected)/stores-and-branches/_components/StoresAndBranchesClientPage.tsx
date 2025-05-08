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
//import DeleteProductModal from "./DeleteProductModal";

export default function StoresAndBranchesClientPage() {
    const [selectedStore, setSelectedStore] = useState<Store | null>(null) 
    const [selectedBranch, setSelectedBranch] = useState(null)

    const storeModal = useModal()
    const deleteStoreModal = useModal()
    
    const branchModal = useModal()
    const deleteBranchModal = useModal()

    const onCreateStoreClick = () => {
        setSelectedStore(null)
        storeModal.open()
    }

    const onManageBranchesClick = (store: Store) => {
        setSelectedStore(store)
    }

    const onEditStoreClick = (store: Store) => {
        setSelectedStore(store)
        storeModal.open()
    }

    const onDeleteStoreClick = (store: Store) => {
        setSelectedStore(store)
        deleteStoreModal.open()
    }

    // const onCreateBranchClick = () => {
    //     setSelectedBranch(null)
    //     branchModal.open()
    // }

    // const onEditBranchClick = (branch: Store) => {
    //     setSelectedBranch(branch)
    //     branchModal.open()
    // }

    // const onDeleteBranchClick = (branch: Store) => {
    //     setSelectedBranch(branch)
    //     deleteBranchModal.open()
    // }

    return (
        <div>
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <GenericTitle removeMargin>Tiendas</GenericTitle>
                        
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
                        onManageBranchesClick={onManageBranchesClick}
                        onEditStoreClick={onEditStoreClick}
                        onDeleteStoreClick={onDeleteStoreClick}
                    />

                    <StoreModal
                        modalModel={storeModal}
                        store={selectedStore}
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
                
                <div className="">
                    <div className="flex justify-between items-center mb-4">
                        <GenericTitle removeMargin>Sucursales</GenericTitle>

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
                        onManageBranchesClick={onManageBranchesClick}
                        onEditStoreClick={onEditStoreClick}
                        onDeleteStoreClick={onDeleteStoreClick}
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