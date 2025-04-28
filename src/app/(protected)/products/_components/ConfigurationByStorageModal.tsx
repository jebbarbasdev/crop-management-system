import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Product } from "../_services/getProducts";
import ConfigurationByStorageTable from "./ConfigurationByStorageTable";

export interface ConfigurationByStorageModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function ConfigurationByStorageModal({ modalModel, product }: ConfigurationByStorageModalProps) {
    return (
        <DaisyModal
            modalModel={modalModel}
            title="Configuración por Unidad de Empaque"

            size="xl"
        >
            <ConfigurationByStorageTable product={product!} />
        </DaisyModal>
    )
}