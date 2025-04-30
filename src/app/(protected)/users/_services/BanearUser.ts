import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface BanUserPayload {
  id: string;
  auth_id: string;
  ban_reason?: string;
  is_permanent: boolean;
  banned_until?: string | null;
}

export async function banUser(payload: BanUserPayload) {
  const supabase = createSupabaseBrowserClient();

  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({
      banned_until: payload.is_permanent ? null : payload.banned_until,
      is_banned: true,
      ban_reason: payload.ban_reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.id);

  if (userError) throw userError;

  const { error: authError } = await supabase.auth.admin.updateUserById(
    payload.auth_id,
    { 
      ban_duration: payload.is_permanent ? 'none' : 'date',
      ...(payload.banned_until && !payload.is_permanent ? { 
        ban_expires_at: new Date(payload.banned_until).toISOString() 
      } : {})
    }
  );

  if (authError) throw authError;

  return userData;
}

export async function unbanUser(userId: string, authId: string) {
  const supabase = createSupabaseBrowserClient();

  const { data: userData, error: userError } = await supabase
    .from('users')
    .update({
      banned_until: null,
      is_banned: false,
      ban_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userError) throw userError;

  const { error: authError } = await supabase.auth.admin.updateUserById(authId, {
    ban_duration: 'none'
  });

  if (authError) throw authError;

  return userData;
}