import { DamageStatus, VehicleChecklistType } from "@/constants/enum"

export type GetAllVehicleChecklistParams = {
    contractId?: string
    type?: VehicleChecklistType
}

export type CreateVehicleChecklistReq = {
    contractId?: string
    vehicleId?: string
    type: VehicleChecklistType
}

export type UpdateVehicleChecklistReq = {
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    checklistItems: UpdateChecklistItemReq[]
    returnInvoiceId?: string
}

export type UpdateChecklistItemReq = {
    id: string
    status: DamageStatus
    notes?: string
}
