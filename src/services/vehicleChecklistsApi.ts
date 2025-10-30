import {
    CreateVehicleChecklistReq,
    GetAllVehicleChecklistParams,
    UpdateChecklistItemReq,
    UpdateVehicleChecklistReq
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
            const res = await axiosInstance.post("/vehicle-checklists", req)
            return res.data
        }),

    update: ({ id, req }: { id: string; req: UpdateVehicleChecklistReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/vehicle-checklists/${id}`, req)
        }),

    updateItem: ({ id, req }: { id: string; req: UpdateChecklistItemReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/vehicle-checklists/items/${id}`, req)
        }),

    signByCustomer: ({ id }: { id: string }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/vehicle-checklists/${id}/customer-sign`)
        }),

    getAll: (query: GetAllVehicleChecklistParams) =>
        requestWrapper<VehicleChecklistViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/vehicle-checklists", { params })
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-checklists/${id}`)
            return res.data
        }),

    uploadItemImage: ({ itemId, formData }: { itemId: string; formData: FormData }) =>
        requestWrapper<string>(async () => {
            const res = await axiosInstance.post(
                `/vehicle-checklists/items/${itemId}/image`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            )
            return res.data
        }),

    deleteItemImage: (itemId: string) => {
        requestWrapper<VehicleChecklistItemViewRes>(async () => {
            const res = await axiosInstance.delete(`/vehicle-checklists/items/${itemId}/image`)
            return res.data
        })
    }
}
