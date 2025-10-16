// This file encapsulates REST calls for vehicle CRUD endpoints so UI hooks stay declarative.
import { VehicleStatus } from "@/constants/enum"
import { CreateVehicleReq, UpdateVehicleReq } from "@/models/vehicle/schema/request"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export type VehicleListParams = {
    licensePlate?: string
    stationId?: string
    status?: VehicleStatus
}

export const vehicleApi = {
    getAll: (params: VehicleListParams = {}) =>
        requestWrapper<VehicleViewRes[]>(async () => {
            const query = buildQueryParams(params, true)
            const res = await axiosInstance.get("/vehicles", { params: query })
            return res.data
        }),
    getById: (vehicleId: string) =>
        requestWrapper<VehicleViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicles/${vehicleId}`)
            return res.data
        }),
    create: (payload: CreateVehicleReq) =>
        requestWrapper<VehicleViewRes>(async () => {
            const res = await axiosInstance.post("/vehicles", payload)
            return res.data
        }),
    update: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehicleReq }) =>
        requestWrapper<VehicleViewRes>(async () => {
            const res = await axiosInstance.patch(`/vehicles/${vehicleId}`, payload)
            return res.data
        }),
    delete: (vehicleId: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/vehicles/${vehicleId}`)
        })
}

