import {
    CreateVehicleChecklistReq,
    GetAllVehicleChecklistParams
} from "@/models/checklist/schema/request"
import {
    VehicleChecklistItemViewRes,
    VehicleChecklistViewRes
} from "@/models/checklist/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleChecklistsApi = {
    create: (req: CreateVehicleChecklistReq) =>
        requestWrapper<{ id: string }>(async () => {
            const res = await axiosInstance.post(`/vehicle-checklists`, req)
            return res.data
        }),

    update: (req: VehicleChecklistViewRes) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.put(`/vehicle-checklists`, req)
            return res.data
        }),

    getAll: (query: GetAllVehicleChecklistParams) =>
        requestWrapper<VehicleChecklistViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("vehicle-checklists", { params })
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-checklists/${id}`)
            return res.data
        }),

    uploadImage: ({ itemId, formData }: { itemId: string; formData: FormData }) =>
        requestWrapper<{ result: VehicleChecklistItemViewRes }>(async () => {
            const res = await axiosInstance.post(
                `/vehicle-checklists/item/${itemId}/image    `,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            return res.data
        }),

    deleteImage: (itemId: string) => {
        requestWrapper<{ result: VehicleChecklistItemViewRes }>(async () => {
            const res = await axiosInstance.delete(`/vehicle-checklists/item/${itemId}/image`)
            return res.data
        })
    }
}
