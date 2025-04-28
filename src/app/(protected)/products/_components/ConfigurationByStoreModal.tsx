import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import ConfigurationByStoreTable from "./ConfigurationByStoreTable";
import { Product } from "../_services/getProducts";

export interface ConfigurationByStoreModalProps {
    modalModel: UseModalModel
    product: Product | null
}

export default function ConfigurationByStoreModal({ modalModel, product }: ConfigurationByStoreModalProps) {
    return (
        <DaisyModal
            modalModel={modalModel}
            title="Configuración por Tienda"

            size="xl"
        >
            <ConfigurationByStoreTable product={product!} />
        </DaisyModal>
    )
}