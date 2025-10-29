import {
    CreateVehicleModelReq,
    DeleteModelImagesReq,
    GetAllModelParams,
    SearchModelParams,
    UpdateVehicleModelReq
} from "@/models/vehicle/schema/request"
import {
    CreateVehicleModelRes,
    VehicleModelImagesRes,
    VehicleModelViewRes
} from "@/models/vehicle/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleModelApi = {
    getAll: (query: GetAllModelParams) =>
        requestWrapper<VehicleModelViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/vehicle-models", { params })
            return res.data
        }),

    search: (query: SearchModelParams) =>
        requestWrapper<VehicleModelViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/vehicle-models/search", { params })
            return res.data
        }),

    getById: ({ modelId, query }: { modelId: string; query: SearchModelParams }) =>
        requestWrapper<VehicleModelViewRes>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get(`/vehicle-models/${modelId}`, { params })
            return res.data
        }),

    create: (payload: CreateVehicleModelReq) =>
        requestWrapper<CreateVehicleModelRes>(async () => {
            const res = await axiosInstance.post("/vehicle-models", payload)
            return res.data
        }),

    update: ({ id, payload }: { id: string; payload: UpdateVehicleModelReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch(`/vehicle-models/${id}`, payload)
        }),

    uploadAllImages: ({ id, formData }: { id: string; formData: FormData }) =>
        requestWrapper<VehicleModelImagesRes[]>(async () => {
            const res = await axiosInstance.post(`/vehicle-models/${id}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data
        }),

    uploadMainImage: ({ id, formData }: { id: string; formData: FormData }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post(`/vehicle-models/${id}/main-image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
        }),

    uploadSubImages: ({ id, formData }: { id: string; formData: FormData }) =>
        requestWrapper<VehicleModelImagesRes[]>(async () => {
            const res = await axiosInstance.post(`/vehicle-models/${id}/sub-images`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return res.data?.data ?? res.data
        }),

    deleteSubImages: ({ id, payload }: { id: string; payload: DeleteModelImagesReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/vehicle-models/${id}/sub-images`, {
                data: payload
            })
        })
}

