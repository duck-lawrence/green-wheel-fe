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
}

export type UserFilterParams = {
    roleName?: RoleName
    phone?: string
    citizenIdNumber?: string
    driverLicenseNumber?: string
    // role?: string // Để lọc bên staff, chỉ hiển thị staff thôi 

}

export type StaffReq = {
    name?: string
    stationId?: string
}
