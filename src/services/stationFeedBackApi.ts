import { PaginationParams } from "@/models/common/request"
import { PageResult } from "@/models/common/response"
import {
    StationFeedbackCreateReq,
    StationFeedbackParams
} from "@/models/station-feedback/schema/request"
import { StationFeedbackRes } from "@/models/station-feedback/schema/response"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const stationFeedbackApi = {
    create: (req: StationFeedbackCreateReq) =>
        requestWrapper<StationFeedbackRes>(async () => {
            const res = await axiosInstance.post("/station-feedbacks", req)
            return res.data
        }),

    getAll: ({
        query,
        pagination = {}
    }: {
        query: StationFeedbackParams
        pagination: PaginationParams
    }) =>
        requestWrapper<PageResult<StationFeedbackRes>>(async () => {
            const params = {
                ...buildQueryParams(query),
                ...buildQueryParams(pagination)
            }
            const res = await axiosInstance.get("/station-feedbacks", { params })
            return res.data
        }),
    delete: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.delete(`/station-feedbacks/${id}`)
        })
}
