import { DamageStatus, VehicleChecklistType } from "@/constants/enum"

export type CreateVehicleChecklistReq = {
    contractId?: string
    vehicleId?: string
    type: VehicleChecklistType
}

export type UpdateVehicleChecklistReq = {
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    vehicleChecklistId: string
    checklistItems: UpdateChecklistItemReq[]
    returnInvoiceId?: string
}

export type UpdateChecklistItemReq = {
    id: string
    status: DamageStatus
    notes?: string
}
