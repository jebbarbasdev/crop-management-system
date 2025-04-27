'use client'

import DaisyButton from "@/app/_components/DaisyButton";
import GenericTitle from "@/app/_components/GenericTitle";
import { IconPlus } from "@tabler/icons-react";
import ProductsTable from "./ProductsTable";
import { SupabaseProduct } from "../_services/getProducts";
import useModal from "@/app/_hooks/useModal";
import NewProductModal from "./NewProductModal";

export default function ProductsClientPage() {
    const newProductModal = useModal()

    const onConfigureProductByStore = (product: SupabaseProduct) => {
        console.log('Configurando por tienda', product)
    }

    const onConfigureProductByStorageUnit = (product: SupabaseProduct) => {
        console.log('Configurando por unidad de almacenamiento', product)
    }

    const onEditProduct = (product: SupabaseProduct) => {
        console.log('Editando', product)
    }

    const onDeleteProduct = (product: SupabaseProduct) => {
        console.log('Eliminando', product)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <GenericTitle removeMargin>Productos</GenericTitle>
                <DaisyButton
                    variant="primary"
                    modifier="square"
                    tooltip="Crear Producto"
                    tooltipPlacement="left"

                    onClick={newProductModal.open}
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <ProductsTable 
                onConfigureProductByStorageUnit={onConfigureProductByStorageUnit}
                onConfigureProductByStore={onConfigureProductByStore}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
            />

            <NewProductModal modalModel={newProductModal} />
        </div>
    )
}