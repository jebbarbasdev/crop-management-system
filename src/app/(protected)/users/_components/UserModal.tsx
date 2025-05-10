import DaisyModal from "@/app/_components/DaisyModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import DaisyInput from "@/app/_components/DaisyInput";
import { UseModalModel } from "@/app/_hooks/useModal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { updateUser } from "../_services/updateUser";
import { User } from "../_services/getUsers";
import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";
import getRoles from "../_services/getRoles";

type FormValues = {
  id?: string;
  full_name: string;
  email: string;
  role_id: string;
};

interface UserModalProps {
  modalModel: UseModalModel;
  user: User | null;
}

export default function UserModal({ modalModel, user }: UserModalProps) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      full_name: "",
      email: "",
      role_id: "1",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        full_name: user.full_name || "",
        email: user.email || "",
        role_id: user.role_id.toString(),
      });
    }
  }, [user, reset]);

  const handleCreateUser = async (formData: FormValues) => {
    setIsLoading(true);
    try {
      const { data: currentUser, error: currentUserError } = await supabase.auth.getUser();
      if (currentUserError) throw new Error(currentUserError.message);

      const createdBy = currentUser?.user?.id;
      if (!createdBy) throw new Error("No se pudo obtener el ID del usuario autenticado");

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: "TempPass123!",
        options: {
          data: {
            full_name: formData.full_name,
            role_id: Number(formData.role_id),
            created_by: createdBy, 
          },
        },
      });

      console.log("Auth Data:", authData);
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Error en registro de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const { mutate: createUserMutation } = useMutation({
    mutationFn: handleCreateUser,
    onError: (error: Error) => {
      toast.error(`Error al crear usuario: ${error.message}`);
    },
    onSuccess: () => {
      reset();
      modalModel.close();
      toast.success("Usuario creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleUpdateUser = async (formData: FormValues) => {
    const now = new Date().toISOString();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const payload = {
      id: formData.id!,
      full_name: formData.full_name,
      email: formData.email,
      role_id: Number(formData.role_id),
      updated_at: now,
      updated_by: userData.user?.id,
    };
    return updateUser(payload);
  };

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: handleUpdateUser,
    onError: (error: Error) => {
      toast.error(`Error al actualizar usuario: ${error.message}`);
    },
    onSuccess: () => {
      reset();
      modalModel.close();
      toast.success("Usuario actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.id) {
      updateUserMutation(data);
    } else {
      createUserMutation(data);
    }
  };

  return (
    <DaisyModal
      title={user ? "Actualizar Usuario" : "Crear Usuario"}
      modalModel={modalModel}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4 w-full">
        <DaisyInput
          label="Nombre completo"
          error={errors.full_name?.message}
          {...register("full_name", { required: "Requerido" })}
        />
        <DaisyInput
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email inválido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido",
            },
          })}
        />

        {/* Selector de roles */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Rol</span>
          </label>
          <select
            className="select select-bordered w-full"
            {...register("role_id", { required: "Seleccione un rol" })}
          >
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role_id && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.role_id.message}
              </span>
            </label>
          )}
        </div>
      </div>
    </DaisyModal>
  );
}