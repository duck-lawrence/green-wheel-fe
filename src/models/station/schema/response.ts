import { DispatchDescriptionDto } from "@/models/dispatch/schema/response"

export type StationViewRes = {
    id: string
    name: string
    address: string
    createdAt: string
}

export type StationForDispatchRes = {
    id: string
    name: string
    address: string
    availableDescription: DispatchDescriptionDto
}
