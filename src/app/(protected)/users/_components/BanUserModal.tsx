import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../_services/getUsers";

interface BanUserModalProps {
  modalModel: UseModalModel;
  user: User | null;
}

export default function BanUserModal({ modalModel, user }: BanUserModalProps) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleBanUser = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_banned: !user.is_banned })
        .eq("id", user.id);

      if (error) throw new Error(error.message);

      toast.success(user.is_banned ? "Usuario reactivado" : "Usuario suspendido");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      modalModel.close();
    } catch (error: any) {
      toast.error(`Error al ${user.is_banned ? "reactivar" : "suspender"} usuario: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DaisyModal
      title={user?.is_banned ? "Reactivar Usuario" : "Suspender Usuario"}
      modalModel={modalModel}
      onSubmit={handleBanUser} 
    >
      <div className="text-center">
        <p>¿Estás seguro de que deseas {user?.is_banned ? "reactivar" : "suspender"} este usuario?</p>
        {isLoading && <p className="text-sm text-gray-500 mt-2">Procesando...</p>}
      </div>
    </DaisyModal>
  );
}