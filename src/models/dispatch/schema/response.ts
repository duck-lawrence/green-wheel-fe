import { DispatchRequestStatus } from "@/constants/enum"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { VehicleViewRes } from "@/models/vehicle/schema/response"

export type DispatchViewRes = {
    id: string
    description?: string
    staffs: UserProfileViewRes[]
    vehicles: VehicleViewRes[]
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
