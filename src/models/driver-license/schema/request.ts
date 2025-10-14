import { LicenseClass, Sex } from "@/constants/enum"

export type CreateDriverLicenseReq = {
    number: string
    fullName: string
    nationality: string
    sex: Sex
    dateOfBirth: string
    expiresAt: string
    class: LicenseClass
}

export type UpdateDriverLicenseReq = {
    number?: string
    class?: LicenseClass
    fullName?: string
    nationality?: string
    sex?: Sex
    dateOfBirth?: string
    expiresAt?: string
}
