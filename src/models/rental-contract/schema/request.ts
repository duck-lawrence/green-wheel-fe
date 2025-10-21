import { RentalContractStatus } from "@/constants/enum"

export type CreateRentalContractReq = {
    modelId: string
    startDate: string
    endDate: string
    stationId: string
}

export type CreateRentalContractManualReq = CreateRentalContractReq & {
    customerId: string
}

export type HandoverContractReq = {
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    // amount?: number
}

export type ContractQueryParams = {
    status?: RentalContractStatus
    phone?: string
    citizenIdentityNumber?: string
    driverLicenseNumber?: string
    stationId?: string
}
