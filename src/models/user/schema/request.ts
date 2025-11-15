import { RoleName, Sex } from "@/constants/enum"

export type CreateUserReq = {
    email?: string
    phone: string
    firstName: string
    lastName: string
    sex: Sex
    dateOfBirth: string
    stationId?: string
    roleName?: RoleName
}

export type UserUpdateReq = {
    firstName?: string
    lastName?: string
    phone?: string
    sex?: Sex
    dateOfBirth?: string
    stationId?: string // Only for staff
    hasSeenTutorial?: boolean
}

export type UpdateBankAccountReq = {
    bankName: string
    bankAccountNumber: string
    bankAccountName: string
}

export type UserFilterParams = {
    roleName?: RoleName
    stationId?: string
    phone?: string
    citizenIdNumber?: string
    driverLicenseNumber?: string
}

export type StaffReq = {
    name?: string
    stationId?: string
}
