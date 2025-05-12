import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { Role } from "../../users/_services/getRoles";

interface DeleteRoleModalProps {
  modalModel: UseModalModel;
  role: Role | null;
  onConfirm: () => void;
}

export default function DeleteRoleModal({
  modalModel,
  role,
  onConfirm,
}: DeleteRoleModalProps) {
  return (
    <DaisyModal
      title="Eliminar Rol"
      modalModel={modalModel}
      onSubmit={onConfirm}
    >
      <div className="text-center">
        <p>
          ¿Estás seguro de que deseas eliminar el rol{" "}
          <strong>{role?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta acción eliminará todos los permisos asociados al rol y no se puede deshacer.
        </p>
      </div>
    </DaisyModal>
  );
} 