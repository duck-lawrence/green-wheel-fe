import { StationUpdateReq, StationViewReq } from "@/models/station/schema/request"
import { StationViewRes } from "@/models/station/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const stationApi = {
    getAll: () =>
        requestWrapper<StationViewRes[]>(async () => {
            const res = await axiosInstance.get("/stations")
            return res.data
        }),
    getById: (id: string) =>
        requestWrapper<StationViewRes>(async () => {
            const res = await axiosInstance.get(`/stations/${id}`)
            return res.data
        }),
    create: (data: StationViewReq) =>
        requestWrapper<void>(async () => {
            const res = await axiosInstance.post("/stations", data)
            return res.data
        }),
    update: (id: string, data: StationUpdateReq) =>
        requestWrapper<void>(async () => {
            const res = await axiosInstance.put(`/stations/${id}`, data)
            return res.data
        }),
    delete: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/stations/${id}`)
        })
}
