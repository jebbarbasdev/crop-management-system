import { User } from "../_services/getUsers"

export type UserWithAuthId = User & {
  auth_id: string
  is_banned?: boolean
}