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
  is_banned?: boolean;
}

export default async function getUsers(): Promise<User[]> {
    const supabase = await createSupabaseBrowserClient();
  
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
        deleted_by
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
  
    if (error) throw error;
    if (!users) return [];

    const referencedIds = Array.from(new Set([
      ...users.map(u => u.created_by),
      ...users.map(u => u.updated_by),
      ...users.map(u => u.deleted_by)
    ].filter(Boolean) as string[]));
  
    let referencedUsers: ReferencedUser[] = [];
  
    if (referencedIds.length > 0) {
      const { data, error: refError } = await supabase
        .from("users")
        .select("id, email, employee_number, full_name")
        .in("id", referencedIds);
  
      if (refError) throw refError;
      referencedUsers = data || [];
    }

    console.log('Users:', users);
console.log('Referenced IDs:', referencedIds);
console.log('Referenced Users:', referencedUsers);


    return users.map(user => ({
      ...user,
      created_by_user: referencedUsers.find(u => u.id === user.created_by) || undefined,
      updated_by_user: referencedUsers.find(u => u.id === user.updated_by) || undefined,
      deleted_by_user: referencedUsers.find(u => u.id === user.deleted_by) || undefined,
    }));
  }
  