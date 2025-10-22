import { DispatchRequestStatus } from "@/constants/enum"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"

export type DispatchViewRes = {
    id: string
    description?: string
    dispatchRequestStaffs: UserProfileViewRes[]
    dispatchRequestVehicles: DispatchVehicleRes[]
    fromStationId: string
    toStationId: string
    fromStationName: string
    toStationName: string
    status: DispatchRequestStatus
    requestAdminId: string
    requestAdminName: string
    approvedAdminId: string
    approvedAdminName: string
    createdAt: string
}

export type DispatchVehicleRes = {
    vehicleId: string
    createdAt: string
    vehicle: VehicleModelViewRes
}
