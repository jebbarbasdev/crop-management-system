import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import DaisyInput from "@/app/_components/DaisyInput";
import { createRole } from "../_services/createRole";
import { updateRole } from "../_services/updateRole";
import { Role } from "../../users/_services/getRoles";
import React from "react";

interface RoleFormValues {
  id?: number;
  name: string;
  description: string;
}

interface RoleModalProps {
  modalModel: UseModalModel;
  role: Role | null;
}

export default function RoleModal({ modalModel, role }: RoleModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (role) {
      reset({
        name: role.name || "",
        description: role.description || "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [role, reset]);

  const { mutate: createRoleMutation } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Rol creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      modalModel.close();
      reset();
    },
    onError: (error: Error) => {
      toast.error(`Error al crear rol: ${error.message}`);
    },
  });

  const { mutate: updateRoleMutation } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success("Rol actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      modalModel.close();
      reset();
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar rol: ${error.message}`);
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    if (role) {
      updateRoleMutation({
        id: role.id,
        name: data.name,
        description: data.description,
      });
    } else {
      createRoleMutation({
        name: data.name,
        description: data.description,
      });
    }
  };

  return (
    <DaisyModal
      title={role ? "Editar Rol" : "Crear Rol"}
      modalModel={modalModel}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <DaisyInput
          label="Nombre"
          error={errors.name?.message}
          {...register("name", { required: "El nombre es requerido" })}
        />
        <DaisyInput
          label="Descripción"
          error={errors.description?.message}
          {...register("description", { required: "La descripción es requerida" })}
        />
      </div>
    </DaisyModal>
  );
} 