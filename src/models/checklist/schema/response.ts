import { DamageStatus, VehicleChecklistType } from "@/constants/enum"
import { VehicleComponentViewRes } from "@/models/vehicle/schema/response"

export type VehicleChecklistViewRes = {
    id: string
    type: VehicleChecklistType
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    staffId: string
    customerId?: string
    vehicleId: string
    contractId?: string
    vehicleChecklistItems?: VehicleChecklistItemViewRes[]
}

export type VehicleChecklistItemViewRes = {
    id: string
    notes?: string
    status: DamageStatus
    imageUrl?: string
    component: VehicleComponentViewRes
}
