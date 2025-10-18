import { VehicleViewReq } from "@/models/vehicle/schema/request"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleApi = {
    getAll: (query: VehicleViewReq) =>
        requestWrapper<VehicleViewRes[]>(async () => {
            const params = buildQueryParams(query)
            const res = await axiosInstance.get("/vehicles", { params })
            return res.data
        })
}
