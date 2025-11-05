import { DispatchRequestStatus } from "@/constants/enum"

export type CreateDispatchReq = {
    // description?: string
    // fromStationId: string
    vehicles: VehicleDispatchReq[]
    numberOfStaffs?: number
}

export type UpdateApproveDispatchReq = {
    status: DispatchRequestStatus
    staffIds: string[]
    vehicleIds: string[]
    description?: string
}

export type ApproveDispatchReq = {
    status: DispatchRequestStatus
    fromStationId?: string
}

export type UpdateDispatchReq = {
    status: DispatchRequestStatus
    staffIds?: string[]
    vehicleIds?: string[]
    description?: string
}

export type VehicleDispatchReq = {
    modelId: string
    quantity: number
}

export type DispatchQueryParams = {
    fromStation?: string
    toStation?: string
    status?: DispatchRequestStatus
}
