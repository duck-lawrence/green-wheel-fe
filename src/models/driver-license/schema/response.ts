import { LicenseClass, Sex } from "@/constants/enum"

export type DriverLicenseViewRes = {
    id: string
    number: string
    fullName: string
    class: LicenseClass
    nationality: string
    sex: Sex
    dateOfBirth: string
    expiresAt: string
    frontImageUrl: string
    backImageUrl: string
}
