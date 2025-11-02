import { VehicleSegmentReq } from "@/models/vehicle/schema/request"
import { VehicleSegmentViewRes } from "@/models/vehicle/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const vehicleSegmentApi = {
    getAll: () =>
        requestWrapper<VehicleSegmentViewRes[]>(async () => {
            const res = await axiosInstance.get("/vehicle-segments")
            return res.data
        }),

    getById: (id: string) =>
        requestWrapper<VehicleSegmentViewRes>(async () => {
            const res = await axiosInstance.get(`/vehicle-segments/${id}`)
            return res.data
        }),

    create: (req: VehicleSegmentReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/vehicle-segments", req)
        }),

    update: (id: string, req: VehicleSegmentReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/vehicle-segments/${id}`, req)
        }),

    delete: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/vehicle-segments/${id}`)
        })
}
