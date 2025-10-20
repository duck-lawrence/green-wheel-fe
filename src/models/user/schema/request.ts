import { Sex } from "@/constants/enum"
export type CreateUserReq = {
    email?: string
    phone: string
    firstName: string
    lastName: string
    sex: Sex
    dateOfBirth: string
    roleId: string
}

export type CreateStaffReq = {
    email: string
    firstName: string
    lastName: string
    sex: Sex
    phone: string
    stationId: string
    dateOfBirth: string
}

export type UserUpdateReq = {
    firstName?: string
    lastName?: string
    phone?: string
    sex?: Sex
    dateOfBirth?: string
    stationId?: string // Only for staff
}
export type UserFilterReq = {
    phone?: string
    citizenIdNumber?: string
    driverLicenseNumber?: string
}
