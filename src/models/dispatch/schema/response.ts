import { DispatchRequestStatus } from "@/constants/enum"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { VehicleViewRes } from "@/models/vehicle/schema/response"

export type DispatchViewRes = {
    id: string
    description?: DispatchDescriptionDto
    finalDescription?: DispatchDescriptionDto
    fromStationId?: string
    toStationId: string
    fromStationName?: string
    toStationName: string
    status: DispatchRequestStatus
    requestAdminId: string
    requestAdminName: string
    approvedAdminId: string
    approvedAdminName: string
    createdAt: string
    dispatchRequestStaffs: DispatchStaffRes[]
    dispatchRequestVehicles: DispatchVehicleRes[]
}

export type DispatchVehicleRes = {
    createdAt: string
    vehicle: VehicleViewRes
}

export type DispatchStaffRes = {
    staffId: string
    createdAt: string
    staff: UserProfileViewRes
}

export interface DispatchDescriptionVehicleDto {
    modelId: string
    modelName?: string
    quantity: number
}

export interface DispatchDescriptionDto {
    numberOfStaffs: number
    vehicles?: DispatchDescriptionVehicleDto[]
}
