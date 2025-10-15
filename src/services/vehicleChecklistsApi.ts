import {
    VehicleChecklistItemViewRes,
    VehicleChecklistViewRes
} from "@/models/checklist/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const VehicleChecklistsApi = {
    create: (id: string) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-checklists/${id}`)
            return res.data
        }),

    update: (rep: VehicleChecklistViewRes) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.put(`/vehicle-checklists`, rep)
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
