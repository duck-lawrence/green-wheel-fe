import { Sex } from "@/constants/enum"

export type CitizenIdentityViewRes = {
    id: string
    number: string
    fullName: string
    nationality: string
    sex: Sex
    dateOfBirth: string
    expiresAt: string
    frontImageUrl: string
    backImageUrl: string
}
