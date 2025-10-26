import { RoleViewRes } from "@/models/role/response"
import { StationViewRes } from "@/models/station/schema/response"

export type UserProfileViewRes = {
    id: string
    email?: string
    firstName: string
    lastName: string
    sex?: number
    dateOfBirth?: string
    avatarUrl?: string
    phone?: string
    bankName?: string
    bankAccountNumber?: string
    bankAccountName?: string
    licenseUrl?: string
    citizenUrl?: string
    needSetPassword: boolean
    role?: RoleViewRes
    station?: StationViewRes
}
