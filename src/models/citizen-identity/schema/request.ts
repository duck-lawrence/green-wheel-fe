import { Sex } from "@/constants/enum"

export type CreateCitizenIdentityReq = {
    idNumber: string
    fullName: string
    nationality: string
    sex: Sex
    dateOfBirth: string
    expireAt: string
}

export type UpdateCitizenIdentityReq = {
    number?: string
    fullName?: string
    nationality?: string
    sex?: Sex
    dateOfBirth?: string
    expireAt?: string
}
