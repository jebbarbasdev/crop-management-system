import DaisyModal from "@/app/_components/DaisyModal";
import { UseModalModel } from "@/app/_hooks/useModal";
import { User } from "../_services/getUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { banUser, unbanUser } from "../_services/BanearUser";
import { toast } from "sonner";
import { FormEvent, FormEventHandler, useState } from "react";

type UserWithAuthId = User & {
  auth_id: string;
};

export interface BanUserModalProps {
  modalModel: UseModalModel;
  user: UserWithAuthId | null;
  isBanned: boolean;
}

export default function BanUserModal({ modalModel, user, isBanned }: BanUserModalProps) {
  const queryClient = useQueryClient();
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'permanent' | 'temporary'>('permanent');
  const [banUntil, setBanUntil] = useState('');

  const { mutate: banUserMutation, isPending: isBanning } = useMutation({
    mutationFn: async (payload: {
      userId: string;
      authId: string;
      banReason?: string;
      isPermanent?: boolean;
      bannedUntil?: string | null;
    }) => {
      if (isBanned) {
        return await unbanUser(payload.userId, payload.authId);
      } else {
        return await banUser({
          id: payload.userId,
          auth_id: payload.authId,
          ban_reason: payload.banReason || '',
          is_permanent: payload.isPermanent || false,
          banned_until: payload.bannedUntil || null,
        });
      }
    },
    onError: (error) => {
      toast.error(`Error al ${isBanned ? 'desbanear' : 'banear'} el usuario: ${error.message}`);
    },
    onSuccess: () => {
      toast.success(`Usuario ${isBanned ? 'desbaneado' : 'baneado'} con éxito`);
      modalModel.close();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!user || !user.auth_id) {
      toast.error('Datos del usuario incompletos');
      return;
    }

    banUserMutation({
      userId: user.id,
      authId: user.auth_id,
      banReason: isBanned ? undefined : banReason,
      isPermanent: isBanned ? undefined : banDuration === 'permanent',
      bannedUntil: isBanned ? undefined : banDuration === 'temporary' ? banUntil : null,
    });
  };

  return (
    <DaisyModal
      modalModel={modalModel}
      title={`${isBanned ? 'Desbanear' : 'Banear'} usuario "${user?.full_name}"?`}
      loading={isBanning}
      cancelText="Cancelar"
      confirmText={isBanned ? 'Desbanear' : 'Banear'}
      onSubmit={handleSubmit}
    >
      {!isBanned ? (
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Razón del ban</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tipo de ban</span>
            </label>
            <select
              className="select select-bordered"
              value={banDuration}
              onChange={(e) => setBanDuration(e.target.value as 'permanent' | 'temporary')}
            >
              <option value="permanent">Permanente</option>
              <option value="temporary">Temporal</option>
            </select>
          </div>

          {banDuration === 'temporary' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ban hasta</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered"
                value={banUntil}
                onChange={(e) => setBanUntil(e.target.value)}
                required
              />
            </div>
          )}
        </div>
      ) : (
        <p>¿Estás seguro que deseas quitar el ban a este usuario?</p>
      )}
    </DaisyModal>
  );
}