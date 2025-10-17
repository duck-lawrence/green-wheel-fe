import { DispatchRequestStatus } from "@/constants/enum"
import { StationViewRes } from "@/models/station/schema/response"

export type CreateDispatchReq = {
    description?: string
    toStationId: StationViewRes
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
