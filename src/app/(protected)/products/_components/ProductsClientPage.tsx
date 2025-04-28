'use client'

import DaisyButton from "@/app/_components/DaisyButton";
import GenericTitle from "@/app/_components/GenericTitle";
import { IconPlus } from "@tabler/icons-react";
import ProductsTable from "./ProductsTable";
import { Product } from "../_services/getProducts";
import useModal from "@/app/_hooks/useModal";
import ProductModal from "./ProductModal";
import { useState } from "react";
import DeleteProductModal from "./DeleteProductModal";
import ConfigurationByStoreModal from "./ConfigurationByStoreModal";
import ConfigurationByStorageModal from "./ConfigurationByStorageModal";

export default function ProductsClientPage() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null) 

    const productModal = useModal()
    const deleteProductModal = useModal()
    const configurationByStoreModal = useModal()
    const configurationByStorageModal = useModal()

    const handleCreateProduct = () => {
        setSelectedProduct(null)
        productModal.open()
    }

    const handleConfigureProductByStore = (product: Product) => {
        setSelectedProduct(product)
        configurationByStoreModal.open()
    }

    const handleConfigureProductByStorageUnit = (product: Product) => {
        setSelectedProduct(product)
        configurationByStorageModal.open()
    }

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product)
        productModal.open()
    }

    const handleDeleteProduct = (product: Product) => {
        setSelectedProduct(product)
        deleteProductModal.open()
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

                    onClick={handleCreateProduct}
                >
                    <IconPlus size={24} />
                </DaisyButton>
            </div>

            <ProductsTable 
                onConfigureProductByStorageUnitClick={handleConfigureProductByStorageUnit}
                onConfigureProductByStoreClick={handleConfigureProductByStore}
                onEditProductClick={handleEditProduct}
                onDeleteProductClick={handleDeleteProduct}
            />

            <ConfigurationByStoreModal modalModel={configurationByStoreModal} product={selectedProduct} />
            <ConfigurationByStorageModal modalModel={configurationByStorageModal} product={selectedProduct} />
            <ProductModal modalModel={productModal} product={selectedProduct} />
            <DeleteProductModal modalModel={deleteProductModal} product={selectedProduct} />
        </div>
    )
}