import { DamageStatus, VehicleChecklistType } from "@/constants/enum"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { VehicleComponentViewRes, VehicleViewRes } from "@/models/vehicle/schema/response"

export type VehicleChecklistViewRes = {
    id: string
    type: VehicleChecklistType
    isSignedByStaff: boolean
    isSignedByCustomer: boolean
    staff: UserProfileViewRes
    customer?: UserProfileViewRes
    vehicle: VehicleViewRes
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
