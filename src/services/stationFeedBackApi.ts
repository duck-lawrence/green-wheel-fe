import { StationFeedbackCreateReq } from "@/models/station-feedback/schema/request"
import { StationFeedbackRes } from "@/models/station-feedback/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const stationFeedbackApi = {
    create: (req: StationFeedbackCreateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/station-feedbacks", req)
        }),

    getAll: () =>
        requestWrapper<StationFeedbackRes[]>(async () => {
            const res = await axiosInstance.get("/station-feedbacks")
            return res.data
        })
}
