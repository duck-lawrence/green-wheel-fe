import { Sex } from "@/constants/enum"

export type CreateUserReq = {
    email?: string
    phone: string
    firstName: string
    lastName: string
    dateOfBirth: string
}

export type UserUpdateReq = {
    firstName?: string
    lastName?: string
    phone?: string
    sex?: Sex
    dateOfBirth?: string
}

export type UserFilterReq = {
    phone?: string
    citizenIdNumber?: string
    driverLicenseNumber?: string
}
