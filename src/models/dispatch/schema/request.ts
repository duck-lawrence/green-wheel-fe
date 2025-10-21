import { DispatchRequestStatus } from "@/constants/enum"

export type CreateDispatchReq = {
    description?: string
    fromStationId: string
    toStationId: string
    staffIds?: string[]
    vehicleIds?: string[]
}

export type UpdateDispatchReq = {
    status: DispatchRequestStatus
}

export type DispatchQueryParams = {
    fromStation?: string
    toStation?: string
    status?: DispatchRequestStatus
}
