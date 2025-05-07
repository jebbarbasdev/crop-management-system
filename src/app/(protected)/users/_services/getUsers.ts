import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

interface ReferencedUser {
  id: string;
  email: string;
  employee_number: number;
  full_name: string | null;
}

export interface User {
  id: string;
  email: string;
  employee_number: number;
  full_name: string | null;
  role_id: number;
  roles: {
    name: string;
    description: string;
  } | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by_user?: ReferencedUser;
  updated_by_user?: ReferencedUser;
  deleted_by_user?: ReferencedUser;
  is_banned: boolean; 
}

export default async function getUsers(): Promise<User[]> {
  const supabase = createSupabaseBrowserClient();

  const { data: users, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      employee_number,
      full_name,
      role_id,
      roles(name, description),
      created_at,
      created_by,
      updated_at,
      updated_by,
      deleted_at,
      deleted_by,
      is_banned
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    throw new Error("No se pudieron obtener los usuarios.");
  }

  if (!users) {
    return [];
  }

  const typedUsers = users as User[];

  const referencedIds = Array.from(
    new Set([
      ...typedUsers.map((u) => u.created_by),
      ...typedUsers.map((u) => u.updated_by),
      ...typedUsers.map((u) => u.deleted_by),
    ].filter(Boolean) as string[])
  );

  let referencedUsers: ReferencedUser[] = [];

  if (referencedIds.length > 0) {
    const { data, error: refError } = await supabase
      .from("users")
      .select("id, email, employee_number, full_name")
      .in("id", referencedIds);

    if (refError) {
      console.error("Error al obtener usuarios referenciados:", refError.message);
      throw new Error("No se pudieron obtener los usuarios referenciados.");
    }

    referencedUsers = data || [];
  }

  return typedUsers.map((user) => ({
    ...user,
    created_by_user: referencedUsers.find((u) => u.id === user.created_by) || undefined,
    updated_by_user: referencedUsers.find((u) => u.id === user.updated_by) || undefined,
    deleted_by_user: referencedUsers.find((u) => u.id === user.deleted_by) || undefined,
  }));
}