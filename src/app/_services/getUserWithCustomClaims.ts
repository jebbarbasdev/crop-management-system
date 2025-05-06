import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../_utilities/supabase";

export type UserWithCustomClaims = NonNullable<Awaited<ReturnType<typeof getUserWithCustomClaims>>>

export async function getUserWithCustomClaims(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null

    const { user } = data

    const { data: userData, error: userError} = await supabase
        .from("users")
        .select(`
            id,
            email,
            full_name,
            employee_number,
            role_id (
                id,
                name,
                description
            )
        `)
        .eq("id", user.id)
        .single()

    if (userError) return null

    const { data: permissionsData, error: permissionsError } = await supabase
        .from('roles_permissions')
        .select(`
            permission_id (
                id,
                name,
                description,

                module_id (
                    id,
                    name,
                    slug
                )
            )
        `)
        .eq('role_id', userData.role_id.id)

    if (permissionsError) return null

    type Permission = { id: number, name: string, description: string }
    type Module = { id: number, name: string, slug: string, permissions: Permission[] }
    type Modules = Record<string, Module>
    
    const modulesWithAccess: Modules = permissionsData.reduce((acc, permission) => {
        acc[permission.permission_id.module_id.slug] ??= {
            id: permission.permission_id.module_id.id,
            name: permission.permission_id.module_id.name,
            slug: permission.permission_id.module_id.slug,
            permissions: []
        }

        acc[permission.permission_id.module_id.slug].permissions.push({
            id: permission.permission_id.id,
            name: permission.permission_id.name,
            description: permission.permission_id.description
        })

        return acc
    }, {} as Modules)
    
    return {
        ...userData,
        modulesWithAccess,

        hasPermissionIn(moduleSlug: string, permissionName: string) {
            const moduleRecord = this.modulesWithAccess[moduleSlug]
            if (!moduleRecord) return false

            return moduleRecord.permissions.some(permission => permission.name === permissionName)
        },

        hasAnyPermissionIn(moduleSlug: string) {
            const moduleRecord = this.modulesWithAccess[moduleSlug]
            if (!moduleRecord) return false

            return moduleRecord.permissions.length > 0
        }
    }
}