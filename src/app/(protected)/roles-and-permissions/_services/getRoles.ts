import { createSupabaseBrowserClient } from "@/app/_utilities/createSupabaseBrowserClient";

export interface Role {
  id: number;
  name: string;
  description: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_by?: string | null;
  updated_at?: string | null;
  created_by_user?: { id: string; full_name: string | null };
  updated_by_user?: { id: string; full_name: string | null };
}

export default async function getRoles(): Promise<Role[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: roles, error } = await supabase
      .from("roles")
      .select(`
        id, 
        name, 
        description, 
        created_by, 
        created_at, 
        updated_by, 
        updated_at
      `)
      .order("name");
    
    if (error) {
      throw error;
    }
    
    if (!roles || roles.length === 0) return [];
    
    const userIds = Array.from(
      new Set([
        ...roles.map(r => r.created_by).filter(Boolean),
        ...roles.map(r => r.updated_by).filter(Boolean)
      ].filter(Boolean) as string[])
    );
    
    let userMap: Record<string, { id: string; full_name: string | null }> = {};
    
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, full_name")
        .in("id", userIds);
      
      if (usersError) {
        throw new Error("No se pudieron obtener los usuarios.");
      } else if (users) {
        userMap = users.reduce((acc, user) => ({
          ...acc,
          [user.id]: user
        }), {});
      }
    }
    
    const mappedRoles = roles.map(role => {
      const result = {
        ...role,
        created_by_user: role.created_by ? userMap[role.created_by] : undefined,
        updated_by_user: role.updated_by ? userMap[role.updated_by] : undefined
      };
      
      
      return result;
    });

    return mappedRoles;
    
  } catch (error) {
    throw new Error("No se pudieron obtener los roles");
  }
}