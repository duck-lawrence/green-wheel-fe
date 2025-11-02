import {
    CreateVehicleComponentReq,
    GetVehicleComponentsParams,
    UpdateVehicleComponentReq
} from "@/models/component/request"
import {
    CreateVehicleComponentRes,
    VehicleComponentViewRes
} from "@/models/component/response"
import { PaginationParams } from "@/models/common/request"
import { PageResult } from "@/models/common/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleComponentApi = {
    getAll: ({
        query,
        pagination
    }: {
        query?: GetVehicleComponentsParams
        pagination?: PaginationParams
    } = {}) =>
        requestWrapper<PageResult<VehicleComponentViewRes>>(async () => {
            const params = {
                ...buildQueryParams(query ?? {}),
                ...buildQueryParams(pagination ?? {})
            }

            const res = await axiosInstance.get("/vehicle-components", { params })
            return res.data as PageResult<VehicleComponentViewRes>
        }),

    getById: (id: string) =>
        requestWrapper<VehicleComponentViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-components/${id}`)
            return res.data
        }),

    create: (payload: CreateVehicleComponentReq) =>
        requestWrapper<CreateVehicleComponentRes>(async () => {
            const res = await axiosInstance.post("/vehicle-components", payload)
            return res.data
        }),

    update: ({ id, payload }: { id: string; payload: UpdateVehicleComponentReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/vehicle-components/${id}`, payload)
        }),

    delete: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/vehicle-components/${id}`)
        })
}
