import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const VehicleChecklistsApi = {
    getById: (id: string) =>
        requestWrapper<VehicleChecklistViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-checklists/${id}`)
            return res.data
        })

    // uploadImage: ()
}
