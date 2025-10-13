import { RentalContractStatus } from "@/constants/enum"

export type CreateRentalContractReq = {
    customerId?: string
    modelId: string
    startDate: string
    endDate: string
    stationId: string
}

export type HandoverContractReq = {
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    amount?: number
}

export type ContractQueryParams = {
    status?: RentalContractStatus
    phone?: string
    citizenIdentityNumber?: string
    driverLicenseNumber?: string
}
